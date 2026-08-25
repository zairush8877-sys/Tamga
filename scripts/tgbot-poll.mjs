// ===== Телеграм-бот «Тамги» без сервера =====
// Запускается из GitHub Actions раз в несколько минут: забирает новые
// сообщения у Telegram, правит data/menu.js и складывает фото в img/tg/.
// Коммит делает workflow — после него сайт пересобирается сам.
//
// Переменные окружения (GitHub → Settings → Secrets and variables → Actions):
//   TG_BOT_TOKEN — токен бота от @BotFather
//   TG_ADMINS    — chat id владельцев через запятую (бот подскажет свой id)

import { readFile, writeFile, mkdir } from 'node:fs/promises';

const TOKEN = process.env.TG_BOT_TOKEN;
const ADMINS = (process.env.TG_ADMINS || '').split(',').map((s) => s.trim()).filter(Boolean);
const MENU_PATH = 'data/menu.js';

if (!TOKEN) {
  console.log('TG_BOT_TOKEN не задан — боту нечего опрашивать');
  process.exit(0);
}

const HELP = [
  'Я меняю меню на сайте. Команды:',
  '',
  '• меню — список разделов',
  '• меню завтраки — блюда раздела с ценами',
  '• цена сырники 420 — новая цена блюда',
  '• скрыть сырники — убрать блюдо с сайта',
  '• показать сырники — вернуть блюдо на сайт',
  '• фото сырники — какие фото стоят у блюда',
  '• пришлите фотографию с подписью «сырники» — она станет главным фото',
  '',
  'Название можно писать не целиком. Правка появляется на сайте через несколько минут.',
].join('\n');

// ---------- Телеграм ----------

async function tg(method, payload = {}) {
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json();
  if (!body.ok) throw new Error(`Telegram ${method}: ${body.description}`);
  return body.result;
}

const reply = (chatId, text) => tg('sendMessage', { chat_id: chatId, text }).catch((e) => console.log('ответ не ушёл:', e.message));

// ---------- Меню ----------

const norm = (s) => s.toLowerCase().replaceAll('ё', 'е').replace(/[«»"'·/]/g, ' ').replace(/\s+/g, ' ').trim();

function* allItems(menu) {
  for (const section of menu.sections) {
    const columns = section.columns ? section.columns : [section.blocks || []];
    for (const blocks of columns) {
      for (const block of blocks) {
        if (block.items) for (const item of block.items) yield { item, section };
      }
    }
  }
}

function findItems(menu, query) {
  const q = norm(query);
  if (!q) return [];
  const all = [...allItems(menu)];
  const exact = all.filter(({ item }) => norm(item.name) === q);
  if (exact.length) return exact.slice(0, 1);
  const sub = all.filter(({ item }) => norm(item.name).includes(q));
  if (sub.length) return sub;
  const words = q.split(' ');
  return all.filter(({ item }) => words.every((w) => norm(item.name).includes(w)));
}

const MARKER = 'window.TAMGA_MENU =';

async function loadMenu() {
  const text = await readFile(MENU_PATH, 'utf8');
  const at = text.indexOf(MARKER);
  if (at === -1) throw new Error(`в ${MENU_PATH} не найден ${MARKER}`);
  return { head: text.slice(0, at + MARKER.length), menu: JSON.parse(text.slice(at + MARKER.length).trim().replace(/;\s*$/, '')) };
}

const saveMenu = (head, menu) => writeFile(MENU_PATH, `${head} ${JSON.stringify(menu, null, 2)};\n`);

const ambiguous = (hits) =>
  'Нашлось несколько блюд, уточните название:\n' + hits.slice(0, 8).map(({ item }) => `• ${item.name}`).join('\n');

// ---------- Команды ----------

async function cmdSections(chatId, menu) {
  const lines = menu.sections.map((s) => {
    let n = 0;
    for (const { section } of allItems(menu)) if (section === s) n += 1;
    return `• ${s.title} — ${n} позиций`;
  });
  await reply(chatId, 'Разделы меню:\n' + lines.join('\n') + '\n\nНапишите «меню <раздел>», чтобы увидеть цены.');
}

async function cmdSection(chatId, menu, name) {
  const q = norm(name);
  const section = menu.sections.find((s) => norm(s.title).includes(q));
  if (!section) return reply(chatId, `Раздел «${name}» не нашёл. Напишите «меню» — покажу список разделов.`);
  const lines = [];
  for (const { item, section: s } of allItems(menu)) {
    if (s === section) lines.push(`• ${item.name} — ${item.price}${item.hidden ? ' (скрыто)' : ''}`);
  }
  await reply(chatId, `${section.title}:\n${lines.join('\n')}`);
}

async function cmdPrice(chatId, menu, text) {
  const m = text.match(/^цена\s+(.+?)\s+([\d][\d\s./]*)$/i);
  if (!m) { await reply(chatId, 'Напишите так: «цена сырники 420» или «цена лимонад фейхоа 370/710».'); return false; }
  const [, name, raw] = m;
  const price = raw.replace(/\s*\/\s*/g, ' / ').replace(/\.$/, '').trim() + ' ₽';
  const hits = findItems(menu, name);
  if (!hits.length) { await reply(chatId, `Блюдо «${name}» не нашёл. Напишите «меню <раздел>» — покажу точные названия.`); return false; }
  if (hits.length > 1) { await reply(chatId, ambiguous(hits)); return false; }
  const { item } = hits[0];
  const old = item.price;
  item.price = price;
  await reply(chatId, `Готово: «${item.name}» теперь ${price} (было ${old}). Сайт обновится через несколько минут.`);
  return true;
}

async function cmdHide(chatId, menu, text, hide) {
  const name = text.replace(/^(скрыть|показать|вернуть)\s+/i, '');
  const hits = findItems(menu, name);
  if (!hits.length) { await reply(chatId, `Блюдо «${name}» не нашёл.`); return false; }
  if (hits.length > 1) { await reply(chatId, ambiguous(hits)); return false; }
  const { item } = hits[0];
  if (hide) item.hidden = true; else delete item.hidden;
  await reply(chatId, hide
    ? `«${item.name}» скрыто с сайта. Вернуть: «показать ${item.name.toLowerCase()}».`
    : `«${item.name}» снова на сайте.`);
  return true;
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

async function cmdSetPhoto(chatId, menu, message) {
  const caption = (message.caption || '').trim();
  if (!caption) { await reply(chatId, 'Добавьте к фотографии подпись с названием блюда — например «сырники».'); return false; }
  const hits = findItems(menu, caption);
  if (!hits.length) { await reply(chatId, `Блюдо «${caption}» не нашёл. Пришлите фото ещё раз с точным названием.`); return false; }
  if (hits.length > 1) { await reply(chatId, ambiguous(hits)); return false; }

  const sizes = message.photo;
  const file = await tg('getFile', { file_id: sizes[sizes.length - 1].file_id });
  const bin = await fetch(`https://api.telegram.org/file/bot${TOKEN}/${file.file_path}`);
  if (!bin.ok) throw new Error('не удалось скачать фото из Telegram');
  await mkdir('img/tg', { recursive: true });
  const path = `img/tg/${file.file_unique_id}.jpg`;
  await writeFile(path, Buffer.from(await bin.arrayBuffer()));

  const { item } = hits[0];
  if (!item.photos) item.photos = [];
  item.photos = [path, ...item.photos.filter((p) => p !== path)].slice(0, 4);
  await reply(chatId, `Готово: новая фотография стала главной у «${item.name}». Сайт обновится через несколько минут.`);
  return true;
}

// ---------- Опрос ----------

const updates = await tg('getUpdates', { timeout: 25, allowed_updates: ['message'] });
if (!updates.length) {
  console.log('новых сообщений нет');
  process.exit(0);
}
console.log(`сообщений: ${updates.length}`);

const { head, menu } = await loadMenu();
let changed = false;

for (const update of updates) {
  const message = update.message;
  const chatId = message?.chat?.id;
  if (!chatId) continue;

  try {
    if (!ADMINS.includes(String(chatId))) {
      await reply(chatId, `Это служебный бот ресторана «Тамга». Ваш chat id: ${chatId}. `
        + 'Чтобы получить доступ, добавьте его в секрет TG_ADMINS в настройках репозитория.');
      continue;
    }

    if (message.photo) {
      changed = (await cmdSetPhoto(chatId, menu, message)) || changed;
      continue;
    }

    const text = (message.text || '').trim();
    const lower = norm(text);

    if (!text || ['/start', '/help', 'help', 'помощь'].includes(lower)) await reply(chatId, HELP);
    else if (lower === 'меню') await cmdSections(chatId, menu);
    else if (lower.startsWith('меню ')) await cmdSection(chatId, menu, text.slice(5));
    else if (lower.startsWith('цена ')) changed = (await cmdPrice(chatId, menu, text)) || changed;
    else if (lower.startsWith('скрыть ')) changed = (await cmdHide(chatId, menu, text, true)) || changed;
    else if (lower.startsWith('показать ') || lower.startsWith('вернуть ')) changed = (await cmdHide(chatId, menu, text, false)) || changed;
    else if (lower.startsWith('фото ')) await cmdShowPhotos(chatId, menu, text);
    else await reply(chatId, 'Не понял команду. ' + HELP);
  } catch (err) {
    console.error(err);
    await reply(chatId, `Что-то пошло не так: ${err.message}. Попробуйте ещё раз.`);
  }
}

if (changed) {
  await saveMenu(head, menu);
  console.log('меню обновлено');
}

// Подтверждаем обработанные сообщения, чтобы Telegram не прислал их снова
await tg('getUpdates', { offset: updates[updates.length - 1].update_id + 1 });
