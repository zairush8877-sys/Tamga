// ===== Телеграм-бот «Тамги»: правка меню с телефона =====
// Вебхук Telegram. Понимает команды на русском и коммитит изменения
// в data/menu.js (и фото в img/tg/) через GitHub API — после коммита
// Netlify сам пересобирает сайт, правка появляется через минуту.
//
// Переменные окружения (Netlify → Site configuration → Environment variables):
//   TG_BOT_TOKEN — токен бота из @BotFather
//   TG_SECRET    — придуманная строка-секрет; та же передаётся в setWebhook
//   TG_ADMINS    — chat id владельцев через запятую (бот подскажет ваш id)
//   GH_TOKEN     — GitHub fine-grained token с правом Contents: Read and write
//   GH_REPO      — репозиторий, по умолчанию zairush8877-sys/Tamga
//   GH_BRANCH    — ветка, по умолчанию main

const GH_API = 'https://api.github.com';
const MENU_PATH = 'data/menu.js';

const HELP = [
  'Я меняю меню на сайте tamga-rest.netlify.app. Команды:',
  '',
  '• меню — список разделов',
  '• меню завтраки — блюда раздела с ценами',
  '• цена сырники 420 — новая цена блюда',
  '• скрыть сырники — убрать блюдо с сайта',
  '• показать сырники — вернуть блюдо на сайт',
  '• фото сырники — какие фото стоят у блюда',
  '• пришлите фотографию с подписью «сырники» — она станет главным фото блюда',
  '',
  'Название можно писать не целиком: «цена драники 600» найдёт «Драники из цукини и брокколи». Изменения появляются на сайте через 1–2 минуты.',
].join('\n');

// ---------- Утилиты ----------

const norm = (s) => s.toLowerCase().replaceAll('ё', 'е').replace(/[«»"'·/]/g, ' ').replace(/\s+/g, ' ').trim();

function* allItems(menu) {
  for (const section of menu.sections) {
    const blockLists = section.columns ? section.columns : [section.blocks || []];
    for (const blocks of blockLists) {
      for (const block of blocks) {
        if (block.items) {
          for (const item of block.items) yield { item, section, block };
        }
      }
    }
  }
}

function findItems(menu, query) {
  const q = norm(query);
  if (!q) return [];
  const all = [...allItems(menu)];
  // сначала точное имя, затем подстрока, затем «все слова запроса есть в названии»
  const exact = all.filter(({ item }) => norm(item.name) === q);
  if (exact.length) return exact.slice(0, 1);
  const sub = all.filter(({ item }) => norm(item.name).includes(q));
  if (sub.length) return sub;
  const words = q.split(' ');
  return all.filter(({ item }) => {
    const name = norm(item.name);
    return words.every((w) => name.includes(w));
  });
}

function parseMenuJs(source) {
  const marker = 'window.TAMGA_MENU =';
  const at = source.indexOf(marker);
  if (at === -1) throw new Error('в data/menu.js не найден window.TAMGA_MENU');
  const head = source.slice(0, at + marker.length);
  const json = source.slice(at + marker.length).trim().replace(/;\s*$/, '');
  return { head, menu: JSON.parse(json) };
}

const serializeMenuJs = (head, menu) => `${head} ${JSON.stringify(menu, null, 2)};\n`;

// ---------- GitHub ----------

function ghHeaders() {
  return {
    Authorization: `Bearer ${process.env.GH_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'tamga-menu-bot',
  };
}

const ghRepo = () => process.env.GH_REPO || 'zairush8877-sys/Tamga';
const ghBranch = () => process.env.GH_BRANCH || 'main';

async function ghGetFile(path) {
  const res = await fetch(`${GH_API}/repos/${ghRepo()}/contents/${path}?ref=${ghBranch()}`, { headers: ghHeaders() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET ${path}: ${res.status} ${await res.text()}`);
  const body = await res.json();
  return { sha: body.sha, text: Buffer.from(body.content, 'base64').toString('utf8') };
}

async function ghPutFile(path, contentBase64, message, sha) {
  const res = await fetch(`${GH_API}/repos/${ghRepo()}/contents/${path}`, {
    method: 'PUT',
    headers: ghHeaders(),
    body: JSON.stringify({ message, content: contentBase64, branch: ghBranch(), ...(sha ? { sha } : {}) }),
  });
  if (!res.ok) throw new Error(`GitHub PUT ${path}: ${res.status} ${await res.text()}`);
}

async function updateMenu(mutate, commitMessage) {
  const file = await ghGetFile(MENU_PATH);
  if (!file) throw new Error(`${MENU_PATH} не найден в репозитории`);
  const { head, menu } = parseMenuJs(file.text);
  const result = mutate(menu);
  const next = serializeMenuJs(head, menu);
  await ghPutFile(MENU_PATH, Buffer.from(next, 'utf8').toString('base64'), commitMessage, file.sha);
  return result;
}

// ---------- Telegram ----------

const tgApi = (method) => `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/${method}`;

async function reply(chatId, text) {
  await fetch(tgApi('sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

async function downloadPhoto(fileId) {
  const meta = await (await fetch(tgApi('getFile'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_id: fileId }),
  })).json();
  if (!meta.ok) throw new Error('Telegram getFile не ответил');
  const filePath = meta.result.file_path;
  const bin = await fetch(`https://api.telegram.org/file/bot${process.env.TG_BOT_TOKEN}/${filePath}`);
  if (!bin.ok) throw new Error('не удалось скачать фото из Telegram');
  return {
    base64: Buffer.from(await bin.arrayBuffer()).toString('base64'),
    uniqueId: meta.result.file_unique_id,
  };
}

// ---------- Команды ----------

const ambiguous = (hits) =>
  'Нашлось несколько блюд, уточните название:\n' +
  hits.slice(0, 8).map(({ item }) => `• ${item.name}`).join('\n');

async function cmdListSections(chatId, menu) {
  const lines = menu.sections.map((s) => {
    let n = 0;
    for (const { section } of allItems(menu)) if (section === s) n += 1;
    return `• ${s.title} — ${n} позиций`;
  });
  await reply(chatId, 'Разделы меню:\n' + lines.join('\n') + '\n\nНапишите «меню <раздел>», чтобы увидеть цены.');
}

async function cmdListSection(chatId, menu, name) {
  const q = norm(name);
  const section = menu.sections.find((s) => norm(s.title).includes(q));
  if (!section) return reply(chatId, `Раздел «${name}» не нашёл. Напишите «меню» — покажу список разделов.`);
  const lines = [];
  for (const { item, section: s } of allItems(menu)) {
    if (s === section) lines.push(`• ${item.name} — ${item.price}${item.hidden ? ' (скрыто)' : ''}`);
  }
  await reply(chatId, `${section.title}:\n${lines.join('\n')}`);
}

async function cmdPrice(chatId, text) {
  // «цена <блюдо> <число>»; цена может быть двойной: «370/710»
  const m = text.match(/^цена\s+(.+?)\s+([\d][\d\s./]*)$/i);
  if (!m) return reply(chatId, 'Напишите так: «цена сырники 420» или «цена лимонад фейхоа 370/710».');
  const [, name, rawPrice] = m;
  const price = rawPrice.replace(/\s*\/\s*/g, ' / ').replace(/\.$/, '').trim() + ' ₽';
  const outcome = await updateMenu((menu) => {
    const hits = findItems(menu, name);
    if (hits.length !== 1) return { hits };
    const { item } = hits[0];
    const old = item.price;
    item.price = price;
    return { item, old };
  }, `Цена: ${name.trim()} → ${price}`);
  if (outcome.hits) {
    if (!outcome.hits.length) return reply(chatId, `Блюдо «${name}» не нашёл. Напишите «меню <раздел>» — покажу точные названия.`);
    return reply(chatId, ambiguous(outcome.hits));
  }
  await reply(chatId, `Готово: «${outcome.item.name}» теперь ${price} (было ${outcome.old}). Сайт обновится через 1–2 минуты.`);
}

async function cmdHide(chatId, text, hide) {
  const name = text.replace(/^(скрыть|показать|вернуть)\s+/i, '');
  const outcome = await updateMenu((menu) => {
    const hits = findItems(menu, name);
    if (hits.length !== 1) return { hits };
    const { item } = hits[0];
    if (hide) item.hidden = true; else delete item.hidden;
    return { item };
  }, `${hide ? 'Скрыто' : 'Возвращено'}: ${name.trim()}`);
  if (outcome.hits) {
    if (!outcome.hits.length) return reply(chatId, `Блюдо «${name}» не нашёл.`);
    return reply(chatId, ambiguous(outcome.hits));
  }
  await reply(chatId, hide
    ? `«${outcome.item.name}» скрыто с сайта. Вернуть: «показать ${outcome.item.name.toLowerCase()}».`
    : `«${outcome.item.name}» снова на сайте.`);
}

async function cmdShowPhotos(chatId, menu, text) {
  const name = text.replace(/^фото\s+/i, '');
  const hits = findItems(menu, name);
  if (!hits.length) return reply(chatId, `Блюдо «${name}» не нашёл.`);
  if (hits.length > 1) return reply(chatId, ambiguous(hits));
  const { item } = hits[0];
  if (!item.photos) return reply(chatId, `«${item.name}» — позиция без фотографий (показывается списком).`);
  await reply(chatId, `«${item.name}», фото (первое — главное):\n` + item.photos.map((p, i) => `${i + 1}. ${p}`).join('\n'));
}

async function cmdSetPhoto(chatId, message) {
  const caption = (message.caption || '').trim();
  if (!caption) {
    return reply(chatId, 'Добавьте к фотографии подпись с названием блюда — например «сырники», — и я поставлю её на сайт.');
  }
  const sizes = message.photo;
  const fileId = sizes[sizes.length - 1].file_id; // самое большое из превью Telegram
  const { base64, uniqueId } = await downloadPhoto(fileId);
  const path = `img/tg/${uniqueId}.jpg`;
  await ghPutFile(path, base64, `Фото от владельца: ${caption}`);
  const outcome = await updateMenu((menu) => {
    const hits = findItems(menu, caption);
    if (hits.length !== 1) return { hits };
    const { item } = hits[0];
    if (!item.photos) item.photos = [];
    item.photos = [path, ...item.photos.filter((p) => p !== path)].slice(0, 4);
    return { item };
  }, `Главное фото: ${caption}`);
  if (outcome.hits) {
    if (!outcome.hits.length) return reply(chatId, `Фото загрузил, но блюдо «${caption}» не нашёл. Пришлите ещё раз с точным названием.`);
    return reply(chatId, ambiguous(outcome.hits));
  }
  await reply(chatId, `Готово: новая фотография стала главной у «${outcome.item.name}». Сайт обновится через 1–2 минуты.`);
}

// ---------- Вебхук ----------

export default async (req) => {
  if (req.method !== 'POST') return new Response('ok');

  const secret = process.env.TG_SECRET;
  if (secret && req.headers.get('x-telegram-bot-api-secret-token') !== secret) {
    return new Response('forbidden', { status: 403 });
  }

  let update;
  try { update = await req.json(); } catch { return new Response('ok'); }
  const message = update.message || update.edited_message;
  const chatId = message?.chat?.id;
  if (!chatId) return new Response('ok');

  // Всегда отвечаем Telegram 200, иначе он будет повторять доставку
  try {
    const admins = (process.env.TG_ADMINS || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (!admins.includes(String(chatId))) {
      await reply(chatId, `Это служебный бот ресторана «Тамга». Ваш chat id: ${chatId}. `
        + 'Чтобы получить доступ, добавьте его в переменную TG_ADMINS на Netlify и перезапустите деплой.');
      return new Response('ok');
    }

    if (message.photo) {
      await cmdSetPhoto(chatId, message);
      return new Response('ok');
    }

    const text = (message.text || '').trim();
    const lower = norm(text);

    if (!text || lower === '/start' || lower === 'помощь' || lower === 'help' || lower === '/help') {
      await reply(chatId, HELP);
    } else if (lower === 'меню') {
      const file = await ghGetFile(MENU_PATH);
      await cmdListSections(chatId, parseMenuJs(file.text).menu);
    } else if (lower.startsWith('меню ')) {
      const file = await ghGetFile(MENU_PATH);
      await cmdListSection(chatId, parseMenuJs(file.text).menu, text.slice(5));
    } else if (lower.startsWith('цена ')) {
      await cmdPrice(chatId, text);
    } else if (lower.startsWith('скрыть ')) {
      await cmdHide(chatId, text, true);
    } else if (lower.startsWith('показать ') || lower.startsWith('вернуть ')) {
      await cmdHide(chatId, text, false);
    } else if (lower.startsWith('фото ')) {
      const file = await ghGetFile(MENU_PATH);
      await cmdShowPhotos(chatId, parseMenuJs(file.text).menu, text);
    } else {
      await reply(chatId, 'Не понял команду. ' + HELP);
    }
  } catch (err) {
    console.error(err);
    try { await reply(chatId, `Что-то пошло не так: ${err.message}. Попробуйте ещё раз.`); } catch {}
  }
  return new Response('ok');
};
