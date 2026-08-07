// Меню ресторана «Тамга»: цены, описания и фото.
// Файл правит телеграм-бот и читает js/menu.js при загрузке страницы.
window.TAMGA_MENU = {
  "sections": [
    {
      "id": "breakfast",
      "title": "Завтраки",
      "blocks": [
        {
          "type": "note",
          "text": "Завтраки подаём ежедневно с 9:00 до 16:00"
        },
        {
          "type": "cards",
          "items": [
            {
              "name": "Каша рисовая",
              "price": "250 ₽",
              "alt": "Каша рисовая",
              "photos": [
                "img/dish-rice-porridge.webp",
                "img/dish-rice-porridge-2.webp",
                "img/dish-rice-porridge-3.webp"
              ]
            },
            {
              "name": "Каша овсяная",
              "price": "250 ₽",
              "alt": "Каша овсяная",
              "photos": [
                "img/dish-oat-porridge.webp",
                "img/dish-oat-porridge-2.webp",
                "img/dish-oat-porridge-3.webp"
              ]
            },
            {
              "name": "Блины с вишнёвым вареньем",
              "price": "390 ₽",
              "desc": "С густой сметаной",
              "alt": "Блины с вишнёвым вареньем",
              "photos": [
                "img/dish-blinchiki.webp",
                "img/dish-blinchiki-2.webp",
                "img/dish-blinchiki-3.webp"
              ]
            },
            {
              "name": "Сырники",
              "price": "390 ₽",
              "desc": "С вареньем из смородины и сметаной",
              "alt": "Сырники с вареньем из смородины",
              "photos": [
                "img/dish-syrniki.webp",
                "img/dish-syrniki-2.webp",
                "img/dish-syrniki-3.webp"
              ]
            },
            {
              "name": "Шакшука с фета",
              "price": "450 ₽",
              "desc": "Яйца пашот, сыр фета, дроблёные орехи, деревенский хлеб",
              "alt": "Шакшука с фета",
              "photos": [
                "img/dish-shakshuka.webp",
                "img/dish-shakshuka-2.webp",
                "img/dish-shakshuka-3.webp"
              ]
            },
            {
              "name": "Брекфаст-бургер с индейкой",
              "price": "550 ₽",
              "desc": "Страчателла, томаты, два яйца-глазуньи, микс салатов",
              "alt": "Брекфаст-бургер с индейкой",
              "photos": [
                "img/dish-brunch-burger.webp",
                "img/dish-brunch-burger-2.webp",
                "img/dish-brunch-burger-3.webp"
              ]
            },
            {
              "name": "Драники из цукини и брокколи",
              "price": "560 ₽",
              "desc": "Слабосолёный лосось, яйцо пашот, соус голландез",
              "alt": "Драники из цукини и брокколи с лососем",
              "photos": [
                "img/dish-draniki.webp",
                "img/dish-draniki-2.webp",
                "img/dish-draniki-3.webp"
              ]
            },
            {
              "name": "Скрэмбл авокадо, лосось",
              "price": "590 ₽",
              "desc": "Скрэмбл из двух яиц с пармезаном, лосось, хлеб бриош",
              "alt": "Скрэмбл с авокадо и лососем",
              "photos": [
                "img/dish-scramble.webp",
                "img/dish-scramble-2.webp",
                "img/dish-scramble-3.webp"
              ]
            },
            {
              "name": "Сковорода с глазуньей",
              "price": "590 ₽",
              "desc": "Копчёный говяжий брискет, томаты, огурцы, деревенский хлеб",
              "alt": "Сковорода с глазуньей и копчёной грудиной",
              "photos": [
                "img/dish-skillet.webp",
                "img/dish-skillet-2.webp",
                "img/dish-skillet-3.webp"
              ]
            },
            {
              "name": "Омлет с креветками",
              "price": "590 ₽",
              "desc": "Французский омлет из трёх яиц, томаты, пармезан, микс салатов",
              "alt": "Омлет с томатами и креветками",
              "photos": [
                "img/dish-omelet-shrimp.webp",
                "img/dish-omelet-shrimp-2.webp",
                "img/dish-omelet-shrimp-3.webp"
              ]
            },
            {
              "name": "Большой горский завтрак",
              "price": "650 ₽",
              "desc": "По рецепту стамбульских черкесов: яйца в сметанном соусе, лакумы, кабардинский сыр, калмыцкий чай",
              "alt": "Большой завтрак по рецепту стамбульских черкесов",
              "photos": [
                "img/dish-big-breakfast.webp",
                "img/dish-big-breakfast-2.webp",
                "img/dish-big-breakfast-3.webp"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "starters",
      "title": "Закуски и салаты",
      "blocks": [
        {
          "type": "subhead",
          "text": "Закуски"
        },
        {
          "type": "cards",
          "items": [
            {
              "name": "Паштет из печени баксанской индейки",
              "price": "390 ₽",
              "desc": "Соус из чёрной смородины, пышные лакумы",
              "alt": "Паштет из печени баксанской индейки",
              "photos": [
                "img/dish-pate.webp",
                "img/dish-pate-2.webp"
              ]
            },
            {
              "name": "Баклажан печёный на углях",
              "price": "460 ₽",
              "desc": "Кахунские томаты, соус из урухской буйволиной сметаны",
              "alt": "Баклажан печёный на углях",
              "photos": [
                "img/dish-eggplant.webp",
                "img/dish-eggplant-2.webp",
                "img/dish-eggplant-3.webp"
              ]
            },
            {
              "name": "Хрустящий попкорн из креветок",
              "price": "660 ₽",
              "desc": "Подушка из мятого авокадо, пикантный соус чили",
              "alt": "Хрустящий попкорн из креветок",
              "photos": [
                "img/dish-shrimp-popcorn.webp",
                "img/dish-shrimp-popcorn-2.webp",
                "img/dish-shrimp-popcorn-3.webp"
              ]
            },
            {
              "name": "Тартар из молодого бычка",
              "price": "680 ₽",
              "desc": "Слоёный молодой картофель, каперсы, сушёный кизил, трюфельное масло",
              "alt": "Тартар из молодого бычка",
              "photos": [
                "img/dish-tartare.webp",
                "img/dish-tartare-2.webp",
                "img/dish-tartare-3.webp"
              ]
            }
          ]
        },
        {
          "type": "list",
          "items": [
            {
              "name": "Телятина, обожжённая костным мозгом",
              "price": "760 ₽",
              "desc": "Мраморный стриплойн, трюфельный айоли, соус понзу, пармезан"
            }
          ]
        },
        {
          "type": "subhead",
          "text": "Салаты"
        },
        {
          "type": "cards",
          "items": [
            {
              "name": "Домашний салат",
              "price": "350 ₽",
              "desc": "Огурцы, помидоры, красный лук, зелень",
              "alt": "Домашний салат из огурцов и помидоров",
              "photos": [
                "img/dish-home-salad.webp",
                "img/dish-home-salad-2.webp",
                "img/dish-home-salad-3.webp"
              ]
            },
            {
              "name": "Хрустящий баклажан",
              "price": "460 ₽",
              "desc": "Кахунские томаты, грецкий орех, клюква, страчателла",
              "alt": "Хрустящий баклажан с томатами",
              "photos": [
                "img/dish-crispy-eggplant.webp",
                "img/dish-crispy-eggplant-2.webp",
                "img/dish-crispy-eggplant-3.webp"
              ]
            },
            {
              "name": "Большой зелёный салат",
              "price": "490 ₽",
              "desc": "Авокадо, брокколи, соус из мяты и сельдерея, пармезан",
              "alt": "Большой зелёный салат",
              "photos": [
                "img/dish-green-salad.webp",
                "img/dish-green-salad-2.webp",
                "img/dish-green-salad-3.webp"
              ]
            },
            {
              "name": "Греческий",
              "price": "560 ₽",
              "desc": "Перец рамиро, брусок феты, базилик, мята, орегано",
              "alt": "Греческий салат",
              "photos": [
                "img/dish-greek.webp",
                "img/dish-greek-2.webp",
                "img/dish-greek-3.webp"
              ]
            },
            {
              "name": "Салат эльбрусских чабанов",
              "price": "690 ₽",
              "desc": "Романо, вяленые томаты, шашлычок из копчёной телятины, соус из ферментированных каштанов",
              "alt": "Салат эльбрусских чабанов",
              "photos": [
                "img/dish-chaban-salad.webp",
                "img/dish-chaban-salad-2.webp",
                "img/dish-chaban-salad-3.webp"
              ]
            },
            {
              "name": "Томаты с креветкой и авокадо",
              "price": "690 ₽",
              "desc": "Тигровые креветки, соус «томатный терияки»",
              "alt": "Томаты с креветкой и авокадо",
              "photos": [
                "img/dish-shrimp-tomatoes.webp",
                "img/dish-shrimp-tomatoes-2.webp",
                "img/dish-shrimp-tomatoes-3.webp"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "soups",
      "title": "Супы",
      "blocks": [
        {
          "type": "cards",
          "items": [
            {
              "name": "Чечевичный",
              "price": "390 ₽",
              "desc": "Сливочный крем-суп, лимон, деревенский хлеб",
              "alt": "Чечевичный крем-суп",
              "photos": [
                "img/dish-lentil-soup.webp",
                "img/dish-lentil-soup-2.webp",
                "img/dish-lentil-soup-3.webp"
              ]
            },
            {
              "name": "Шурпа",
              "price": "490 ₽",
              "desc": "Наваристый бульон, телятина, картофель, морковь, томаты",
              "alt": "Шурпа",
              "photos": [
                "img/dish-shurpa.webp",
                "img/dish-shurpa-2.webp",
                "img/dish-shurpa-3.webp"
              ]
            },
            {
              "name": "Суп с пельменями курзе",
              "price": "490 ₽",
              "desc": "Горские пельмени по рецепту терских невесток в говяжьем бульоне",
              "alt": "Суп с горскими пельменями курзе",
              "photos": [
                "img/dish-kurze-soup.webp",
                "img/dish-kurze-soup-2.webp",
                "img/dish-kurze-soup-3.webp"
              ]
            },
            {
              "name": "Кукурузный ашрыт",
              "price": "590 ₽",
              "desc": "Сливочно-кукурузный суп с томлёной говядиной по авторскому рецепту шефа",
              "alt": "Кукурузный ашрыт",
              "photos": [
                "img/dish-ashryt.webp",
                "img/dish-ashryt-2.webp",
                "img/dish-ashryt-3.webp"
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "mains",
      "title": "Основные блюда",
      "blocks": [
        {
          "type": "cards",
          "items": [
            {
              "name": "Терские пельмени курзе",
              "price": "590 ₽",
              "desc": "Начинка из телятины, сливочный соус cacio e pepe",
              "alt": "Терские пельмени курзе с соусом cacio e pepe",
              "photos": [
                "img/dish-kurze.webp",
                "img/dish-kurze-2.webp",
                "img/dish-kurze-3.webp"
              ]
            },
            {
              "name": "Жаркое с телятиной и овощами",
              "price": "590 ₽",
              "alt": "Жаркое с телятиной и овощами",
              "photos": [
                "img/dish-zharkoe.webp",
                "img/dish-zharkoe-2.webp",
                "img/dish-zharkoe-3.webp"
              ]
            },
            {
              "name": "Жаркое с копчёным мясом",
              "price": "690 ₽",
              "desc": "В сливочном соусе",
              "alt": "Жаркое с копчёным мясом",
              "photos": [
                "img/dish-zharkoe-smoked.webp",
                "img/dish-zharkoe-smoked-2.webp",
                "img/dish-zharkoe-smoked-3.webp"
              ]
            },
            {
              "name": "Томлёный язык в соусе шипс",
              "price": "740 ₽",
              "desc": "Телячий язык, томлённый 12 часов в печи, картофельное пюре",
              "alt": "Томлёный язык в мясном соусе шипс",
              "photos": [
                "img/dish-tongue.webp",
                "img/dish-tongue-2.webp",
                "img/dish-tongue-3.webp"
              ]
            },
            {
              "name": "Баксанское лыбже из цыплёнка",
              "price": "740 ₽",
              "desc": "Томлёное в сметане, с пшённой кабардинской пастой",
              "alt": "Баксанское лыбже из цыплёнка",
              "photos": [
                "img/dish-lybzhe.webp",
                "img/dish-lybzhe-2.webp",
                "img/dish-lybzhe-3.webp"
              ]
            },
            {
              "name": "Томлёная голень ягнёнка",
              "price": "750 ₽",
              "desc": "С картофельным пюре",
              "alt": "Томлёная голень ягнёнка",
              "photos": [
                "img/dish-lamb-shank.webp",
                "img/dish-lamb-shank-2.webp",
                "img/dish-lamb-shank-3.webp"
              ]
            },
            {
              "name": "Грудинка копчёная",
              "price": "760 ₽",
              "desc": "Дымный мясной соус, томлёный в соусе тху картофель",
              "alt": "Грудинка копчёная с картофелем тху",
              "photos": [
                "img/dish-brisket.webp",
                "img/dish-brisket-2.webp",
                "img/dish-brisket-3.webp"
              ]
            },
            {
              "name": "Лягур томлёный в сметане",
              "price": "780 ₽",
              "desc": "С пшённой пастой",
              "alt": "Лягур томлёный в сметане",
              "photos": [
                "img/dish-lyagur.webp",
                "img/dish-lyagur-2.webp",
                "img/dish-lyagur-3.webp"
              ]
            },
            {
              "name": "Копчёная урванская утка",
              "price": "790 ₽",
              "desc": "Утиная грудка на горных травах, пюре, соус демигляс с вишней",
              "alt": "Копчёная урванская утка",
              "photos": [
                "img/dish-duck-breast.webp",
                "img/dish-duck-breast-2.webp",
                "img/dish-duck-breast-3.webp"
              ]
            },
            {
              "name": "Лосось с цитрусовой заправкой",
              "price": "890 ₽",
              "desc": "Брокколи и шпинат",
              "alt": "Лосось с цитрусовой заправкой",
              "photos": [
                "img/dish-salmon.webp",
                "img/dish-salmon-2.webp",
                "img/dish-salmon-3.webp"
              ]
            },
            {
              "name": "Утка с терским цыртом",
              "price": "1 650 ₽",
              "desc": "Половина утки на вертеле, терские галушки, бульон, картофель в сметане, соус цахтон",
              "alt": "Утка запечённая с терским цыртом",
              "photos": [
                "img/dish-duck-whole.webp",
                "img/dish-duck-whole-2.webp",
                "img/dish-duck-whole-3.webp"
              ]
            }
          ]
        },
        {
          "type": "list",
          "items": [
            {
              "name": "Лыбже томлёный в глиняном горшке",
              "price": "760 ₽",
              "desc": "Ритуальное блюдо адыгского застолья: телятина в собственном соку, пшённая каша"
            }
          ]
        }
      ]
    },
    {
      "id": "grill",
      "title": "Мангал",
      "blocks": [
        {
          "type": "cards",
          "items": [
            {
              "name": "Шашлык из кабардинского цыплёнка",
              "price": "390 ₽",
              "alt": "Шашлык из кабардинского цыплёнка",
              "photos": [
                "img/dish-chicken-kebab.webp",
                "img/dish-chicken-kebab-2.webp",
                "img/dish-chicken-kebab-3.webp"
              ]
            },
            {
              "name": "Люля из баранины",
              "price": "590 ₽",
              "alt": "Люля из баранины",
              "photos": [
                "img/dish-lyulya.webp",
                "img/dish-lyulya-2.webp",
                "img/dish-lyulya-3.webp"
              ]
            },
            {
              "name": "Шашлык из вырезки",
              "price": "980 ₽",
              "alt": "Шашлык из вырезки",
              "photos": [
                "img/dish-veal-kebab.webp",
                "img/dish-veal-kebab-2.webp",
                "img/dish-veal-kebab-3.webp"
              ]
            },
            {
              "name": "Каре ягнёнка",
              "price": "1 200 ₽",
              "alt": "Каре ягнёнка",
              "photos": [
                "img/dish-lamb-rack.webp",
                "img/dish-lamb-rack-2.webp",
                "img/dish-lamb-rack-3.webp"
              ]
            },
            {
              "name": "Стриплойн",
              "price": "1 850 ₽",
              "desc": "Молодой картофель, соус лечо",
              "alt": "Стриплойн с молодым картофелем",
              "photos": [
                "img/dish-striploin.webp",
                "img/dish-striploin-2.webp",
                "img/dish-striploin-3.webp"
              ]
            }
          ]
        },
        {
          "type": "list",
          "items": [
            {
              "name": "Люля из цыплёнка",
              "price": "390 ₽"
            },
            {
              "name": "Люля из телятины",
              "price": "590 ₽"
            },
            {
              "name": "Шашлык из молодого барашка из селения Тегенекли",
              "price": "690 ₽"
            }
          ],
          "cols": true
        }
      ]
    },
    {
      "id": "oven",
      "title": "Из печи",
      "blocks": [
        {
          "type": "cards",
          "items": [
            {
              "name": "Хычины с сыром и травами",
              "price": "270 ₽",
              "desc": "По рецепту верхнебалкарских бабушек: сыр, свекольная ботва, томлёное масло, сметана",
              "alt": "Хычины с сыром и травами",
              "photos": [
                "img/dish-khychiny.webp",
                "img/dish-khychiny-2.webp",
                "img/dish-khychiny-3.webp"
              ]
            },
            {
              "name": "Лакум с сыром",
              "price": "250 ₽",
              "alt": "Лакум с сыром",
              "photos": [
                "img/dish-lakum.webp",
                "img/dish-lakum-2.webp",
                "img/dish-lakum-3.webp"
              ]
            },
            {
              "name": "Деревенский хлеб",
              "price": "190 ₽",
              "desc": "Со взбитым маслом и мёдом",
              "alt": "Деревенский хлеб со взбитым маслом и мёдом",
              "photos": [
                "img/dish-bread.webp",
                "img/dish-bread-2.webp",
                "img/dish-bread-3.webp"
              ]
            }
          ]
        },
        {
          "type": "list",
          "items": [
            {
              "name": "Хычины с сыром и картофелем",
              "price": "230 ₽",
              "desc": "Наитончайшая круглая лепёшка, олицетворяющая солнце, — достояние балкарского народа"
            },
            {
              "name": "Слоёная лепёшка с лососем «Зытеупэщык1»",
              "price": "450 ₽",
              "desc": "Современный вариант слоёного адыгского хлеба, подаётся с лососем и авокадо"
            },
            {
              "name": "Лепёшка на айране со страчателлой и мортаделлой из индейки",
              "price": "490 ₽"
            },
            {
              "name": "Пышная лепёшка с ветчиной индейки, страчателлой и песто",
              "price": "490 ₽"
            },
            {
              "name": "Пышная лепёшка с томатами, страчателлой, песто",
              "price": "490 ₽"
            },
            {
              "name": "Пышная лепёшка на айране с халапеньо и брискетом",
              "price": "490 ₽"
            },
            {
              "name": "Пышная лепёшка",
              "price": "150 ₽"
            }
          ]
        }
      ]
    },
    {
      "id": "pasta",
      "title": "Паста и гарниры",
      "blocks": [
        {
          "type": "subhead",
          "text": "Паста из Италии — с акцентом гор"
        },
        {
          "type": "cards",
          "items": [
            {
              "name": "Паста с цыплёнком",
              "price": "690 ₽",
              "desc": "Паста ручной работы, сливочный соус тху, трюфельно-грибная паста",
              "alt": "Паста с цыплёнком в сливочном соусе тху",
              "photos": [
                "img/dish-pasta-cream.webp",
                "img/dish-pasta-cream-2.webp",
                "img/dish-pasta-cream-3.webp"
              ]
            },
            {
              "name": "Большая паста с креветками",
              "price": "750 ₽",
              "desc": "Сливочно-томатный соус, пармезан",
              "alt": "Большая паста с креветками",
              "photos": [
                "img/dish-pasta-shrimp.webp",
                "img/dish-pasta-shrimp-2.webp",
                "img/dish-pasta-shrimp-3.webp"
              ]
            }
          ]
        },
        {
          "type": "list",
          "items": [
            {
              "name": "Паста с копчёным дымным брискетом",
              "price": "690 ₽",
              "desc": "Перечный соус cacio e pepe"
            }
          ]
        },
        {
          "type": "subhead",
          "text": "Гарниры"
        },
        {
          "type": "list",
          "items": [
            {
              "name": "Картофельное пюре",
              "price": "150 ₽"
            },
            {
              "name": "Картофель фри",
              "price": "170 ₽"
            },
            {
              "name": "Брокколи на гриле",
              "price": "240 ₽"
            },
            {
              "name": "Овощи на гриле",
              "price": "260 ₽"
            },
            {
              "name": "Батат фри с пармезаном",
              "price": "360 ₽"
            }
          ],
          "cols": true
        }
      ]
    },
    {
      "id": "desserts",
      "title": "Десерты",
      "blocks": [
        {
          "type": "cards",
          "items": [
            {
              "name": "Капрон",
              "price": "450 ₽",
              "desc": "С ванильным кремом и ягодами",
              "alt": "Капрон с ванильным кремом и ягодами",
              "photos": [
                "img/dish-kapron.webp",
                "img/dish-kapron-2.webp",
                "img/dish-kapron-3.webp"
              ]
            },
            {
              "name": "Хрустящий домашний наполеон",
              "price": "490 ₽",
              "alt": "Хрустящий домашний наполеон",
              "photos": [
                "img/dish-napoleon.webp",
                "img/dish-napoleon-2.webp",
                "img/dish-napoleon-3.webp"
              ]
            },
            {
              "name": "Тарт с ягодами",
              "price": "590 ₽",
              "alt": "Тарт с ягодами",
              "photos": [
                "img/dish-berry-tart.webp",
                "img/dish-berry-tart-2.webp",
                "img/dish-berry-tart-3.webp"
              ]
            }
          ]
        },
        {
          "type": "list",
          "items": [
            {
              "name": "Медовик",
              "price": "390 ₽"
            },
            {
              "name": "Сан-Себастьян карамельный",
              "price": "490 ₽",
              "desc": "Нежный карамельный себастьян с кофейным мороженым"
            },
            {
              "name": "Ассорти фирменных конфет «Родовое древо»",
              "price": "490 ₽",
              "desc": "Шесть плодов, шесть вкусов на одном большом древе — олицетворение развития племени и рода"
            }
          ]
        }
      ]
    },
    {
      "id": "drinks",
      "title": "Напитки",
      "columns": [
        [
          {
            "type": "subhead",
            "text": "Авторские безалкогольные коктейли"
          },
          {
            "type": "list",
            "items": [
              {
                "name": "Бузина · мята · лайм",
                "price": "450 ₽"
              },
              {
                "name": "Кабардинский персик · виноград",
                "price": "450 ₽"
              },
              {
                "name": "Баксанская черешня · шисо · каркаде",
                "price": "490 ₽"
              },
              {
                "name": "Кокос · ананас · лемонграсс",
                "price": "490 ₽"
              }
            ]
          },
          {
            "type": "subhead",
            "text": "Лимонады",
            "note": "250 / 750 мл"
          },
          {
            "type": "list",
            "items": [
              {
                "name": "Фейхоа · каламанси · ананас",
                "price": "370 / 710 ₽"
              },
              {
                "name": "Персик · черешня · миндаль",
                "price": "370 / 710 ₽"
              },
              {
                "name": "Маракуйя · манго · ваниль",
                "price": "370 / 710 ₽"
              },
              {
                "name": "Грейпфрут · малина · мята",
                "price": "370 / 710 ₽"
              },
              {
                "name": "Арбуз · гранат · бергамот",
                "price": "370 / 710 ₽"
              }
            ]
          },
          {
            "type": "subhead",
            "text": "Смузи"
          },
          {
            "type": "list",
            "items": [
              {
                "name": "Яблоко · щавель · киви · матча",
                "price": "410 ₽"
              },
              {
                "name": "Персик · клубника · мята",
                "price": "430 ₽"
              },
              {
                "name": "Малина · кокос · банан",
                "price": "450 ₽"
              }
            ]
          },
          {
            "type": "subhead",
            "text": "Свежевыжатые соки",
            "note": "200 мл"
          },
          {
            "type": "list",
            "items": [
              {
                "name": "Апельсин / яблоко / морковь",
                "price": "350 ₽"
              },
              {
                "name": "Грейпфрут / яблоко-сельдерей",
                "price": "400 ₽"
              }
            ]
          }
        ],
        [
          {
            "type": "subhead",
            "text": "Классические чаи",
            "note": "1000 мл"
          },
          {
            "type": "list",
            "items": [
              {
                "name": "Ассам / эрл грей / сенча / жасминовый / иван-чай / молочный улун / ромашковый / милый фрукт / ройбуш",
                "price": "350 ₽"
              }
            ]
          },
          {
            "type": "subhead",
            "text": "Авторские чаи",
            "note": "800 мл"
          },
          {
            "type": "list",
            "items": [
              {
                "name": "Облепиха · манго · иван-чай",
                "price": "620 ₽"
              },
              {
                "name": "Персик · айва · ройбуш",
                "price": "620 ₽"
              },
              {
                "name": "Чёрная смородина · малина · сенча",
                "price": "620 ₽"
              },
              {
                "name": "Клубника · имбирь · ассам",
                "price": "620 ₽"
              },
              {
                "name": "Калмыцкий чай",
                "price": "750 ₽"
              }
            ]
          },
          {
            "type": "subhead",
            "text": "Классический кофе"
          },
          {
            "type": "list",
            "items": [
              {
                "name": "Эспрессо",
                "price": "190 ₽"
              },
              {
                "name": "Американо",
                "price": "230 ₽"
              },
              {
                "name": "Капучино",
                "price": "290 ₽"
              },
              {
                "name": "Флэт уайт",
                "price": "300 ₽"
              },
              {
                "name": "Латте",
                "price": "320 ₽"
              }
            ]
          },
          {
            "type": "note",
            "text": "Приготовим кофе на кокосовом, миндальном, банановом или безлактозном молоке"
          },
          {
            "type": "subhead",
            "text": "Кофейные напитки"
          },
          {
            "type": "list",
            "items": [
              {
                "name": "Горячий шоколад / бамбл",
                "price": "350 ₽"
              },
              {
                "name": "Матча латте",
                "price": "370 ₽"
              },
              {
                "name": "Матча латте с тыквенным урбечем",
                "price": "390 ₽"
              },
              {
                "name": "Раф урбеч",
                "price": "350 ₽"
              },
              {
                "name": "Раф с малиной / с голубикой",
                "price": "390 ₽"
              },
              {
                "name": "Эспрессо-тоник с сакурой и шисо",
                "price": "390 ₽"
              }
            ]
          }
        ]
      ]
    }
  ]
};
