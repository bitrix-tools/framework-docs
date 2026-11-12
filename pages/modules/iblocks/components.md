---
title: Вывод данных инфоблока компонентами
description: "Вывод элементов инфоблока стандартными компонентами — выбор компонента, комплексный компонент bitrix:news с ЧПУ, параметры и фильтр bitrix:news.list, дополнение данных в result_modifier.php через ORM-класс элементов, адрес детальной страницы, кеш компонента."
---

Стандартные компоненты модуля выводят элементы и разделы инфоблока на сайте. Они сами выбирают данные с учетом активности, дат и прав доступа, кешируют результат и формируют адреса страниц по шаблонам инфоблока. Свой код нужен, когда шаблону компонента не хватает данных. Такой код размещают в файле `result_modifier.php` шаблона.

Как устроены компоненты, их параметры и шаблоны, описано в статье [Компоненты](./../../framework/components.md). Примеры ниже используют инфоблок новостей с символьным кодом API `News` и раздел Мероприятия с кодом `events`. Свойства инфоблока — `AUTHOR`, строка, `SOURCE`, список, `KEYWORDS`, множественная строка, `PHOTO`, файл, и `SUMMARY`, HTML. Они описаны в статье [Значения свойств элементов инфоблока](./property-values.md).

## Выбрать компонент {#choose-component}

| Задача | Компонент |
|---|---|
| Раздел сайта с новостями — список, страницы разделов и детальные страницы с ЧПУ | `bitrix:news` — комплексный компонент, внутри подключает `bitrix:news.list` и `bitrix:news.detail` |
| Список элементов одного инфоблока на странице | `bitrix:news.list` |
| Страница одного элемента | `bitrix:news.detail` |
| Лента последних записей из нескольких инфоблоков одного типа — дата и заголовок | `bitrix:news.line` |
| Дерево или список разделов | `bitrix:catalog.section.list` |
| Пункты меню из разделов инфоблока | `bitrix:menu.sections`, подробнее — в статье [Меню](./../../cms-basics/menu.md) |
| Умный фильтр по свойствам | `bitrix:catalog.smart.filter`, подробнее — в статье [Фасетный индекс и умный фильтр](./faceted-index.md) |
| Добавление и изменение элементов пользователями сайта | `bitrix:iblock.element.add.form` |
| Каталог товаров с ценами и торговыми предложениями | `bitrix:catalog`, `bitrix:catalog.section`, `bitrix:catalog.element`, подробнее — в статье [Торговый каталог](./../catalog/overview.md) |

Для страницы со списком и детальными страницами используйте комплексный компонент `bitrix:news`. Он сам разбирает адрес, выбирает нужную страницу и передает вложенным компонентам согласованные параметры.

## Вывести новости с ЧПУ {#news-sef}

Чтобы адреса страниц были вида `/news/events/itogi-goda/`, включите в комплексном компоненте режим ЧПУ — параметр `SEF_MODE` со значением `Y`. Папку раздела передайте в `SEF_FOLDER`, шаблоны адресов — в `SEF_URL_TEMPLATES`. Ключи массива `SEF_URL_TEMPLATES` задают шаблоны страниц:

-  `news` — страница списка,

-  `section` — страница раздела,

-  `detail` — страница элемента.

Параметр `IBLOCK_TYPE` — тип инфоблока. Параметры вложенных компонентов комплексный компонент получает с префиксами `LIST_` для списка и `DETAIL_` для детальной страницы, например `LIST_PROPERTY_CODE` и `DETAIL_PROPERTY_CODE`.

**Пример.** Подключите раздел новостей с адресами по символьным кодам в файле `/news/index.php`.

```php
<?php
require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/header.php';

$APPLICATION->IncludeComponent(
    'bitrix:news',
    '',
    [
        'IBLOCK_TYPE' => 'news',
        'IBLOCK_ID' => $iblockId,
        'NEWS_COUNT' => 20,
        'SEF_MODE' => 'Y',
        'SEF_FOLDER' => '/news/',
        'SEF_URL_TEMPLATES' => [
            'news' => '',
            'section' => '#SECTION_CODE#/',
            'detail' => '#SECTION_CODE#/#ELEMENT_CODE#/',
        ],
        'LIST_PROPERTY_CODE' => ['AUTHOR', 'SOURCE'],
        'DETAIL_PROPERTY_CODE' => ['AUTHOR', 'SOURCE', 'PHOTO'],
        'SET_STATUS_404' => 'Y',
        'SHOW_404' => 'Y',
        'CACHE_TYPE' => 'A',
        'CACHE_TIME' => 3600,
    ]
);

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/footer.php';
```

Переменная `$iblockId` содержит `ID` инфоблока новостей — подставьте число или получите `ID` заранее, например способом из раздела [Найти инфоблок по коду](./setup.md#find-iblock). Параметры `SET_STATUS_404` и `SHOW_404` отдают код 404 и страницу ошибки для адреса, которого нет. По умолчанию они выключены, и неизвестный адрес внутри `/news/` показывает список с кодом 200. Файл страницы ошибки задают в параметре `FILE_404`.

Шаблон `#SECTION_CODE#/#ELEMENT_CODE#/` рассчитан на элементы, которые лежат в разделах первого уровня. У элемента без раздела адрес получится одноуровневым и совпадет с шаблоном страницы раздела. Для вложенных разделов используйте метку `#SECTION_CODE_PATH#` — путь из кодов всех разделов. Если элементы бывают вне разделов, дайте шаблону элемента постоянный префикс, например `detail/#ELEMENT_CODE#/`.

Чтобы запросы `/news/...` попадали на файл `/news/index.php`, нужно правило обработки адресов. Визуальный редактор добавляет его сам при сохранении страницы с компонентом. Если страница создана в коде, добавьте правило методом `Bitrix\Main\UrlRewriter::add()`. Первый аргумент — код сайта, второй — массив правила. В нем `CONDITION` — регулярное выражение адреса, `ID` — имя компонента, `PATH` — файл, который обрабатывает адрес, `RULE` — правило подстановки, для комплексного компонента пустая строка. Если правило с таким же условием уже есть, метод ничего не меняет. Правила `urlrewrite.php` и переход на новый роутинг описаны в статье [Роутинг](./../../framework/routing.md).

**Пример.** Добавьте правило для раздела `/news/`.

```php
\Bitrix\Main\UrlRewriter::add(SITE_ID, [
    'CONDITION' => '#^/news/#',
    'RULE' => '',
    'ID' => 'bitrix:news',
    'PATH' => '/news/index.php',
]);
```

Комплексный компонент строит ссылки по своим `SEF_URL_TEMPLATES`. Шаблоны адресов в настройках инфоблока — поля `LIST_PAGE_URL`, `SECTION_PAGE_URL` и `DETAIL_PAGE_URL` — используют поиск и компоненты, которым шаблон не передан. Задайте в настройках инфоблока те же шаблоны, например `#SITE_DIR#/news/#SECTION_CODE#/#ELEMENT_CODE#/`, иначе ссылки из поиска будут вести на другие адреса.

## Настроить выборку списка {#list-params}

Таблица описывает основные параметры `bitrix:news.list`. В комплексном компоненте `bitrix:news` часть параметров списка называется с префиксом `LIST_` — `LIST_FIELD_CODE`, `LIST_PROPERTY_CODE`, `LIST_ACTIVE_DATE_FORMAT`. Остальные, например `NEWS_COUNT`, `SORT_BY1` и `CACHE_TIME`, передаются без префикса.

| Параметр | Тип | Описание |
|---|---|---|
| `IBLOCK_TYPE`, `IBLOCK_ID` | `string`, `int` | Тип и `ID` инфоблока. По умолчанию тип `news` |
| `NEWS_COUNT` | `int` | Количество элементов на странице. По умолчанию `20` |
| `SORT_BY1`, `SORT_ORDER1`, `SORT_BY2`, `SORT_ORDER2` | `string` | Поля и направления сортировки. По умолчанию `ACTIVE_FROM` по убыванию |
| `FIELD_CODE`, `PROPERTY_CODE` | `array` | Дополнительные поля и коды свойств, которые компонент выберет для шаблона |
| `FILTER_NAME` | `string` | Имя глобальной переменной с дополнительным фильтром |
| `PARENT_SECTION`, `PARENT_SECTION_CODE` | `int`, `string` | Раздел, из которого выводить элементы |
| `INCLUDE_SUBSECTIONS` | `Y` или `N` | Выводить элементы подразделов. По умолчанию `Y` |
| `CHECK_DATES` | `Y` или `N` | Учитывать даты начала и окончания активности. По умолчанию `Y` |
| `CHECK_PERMISSIONS` | `Y` или `N` | Проверять права пользователя на чтение. По умолчанию `Y` |
| `DISPLAY_TOP_PAGER`, `DISPLAY_BOTTOM_PAGER` | `Y` или `N` | Постраничная навигация над списком и под ним. По умолчанию выводится только нижняя. Если обе выключены, компонент выводит только первые `NEWS_COUNT` элементов |
| `PAGER_TEMPLATE` | `string` | Шаблон постраничной навигации |
| `SET_TITLE`, `INCLUDE_IBLOCK_INTO_CHAIN`, `ADD_SECTIONS_CHAIN` | `Y` или `N` | Установить заголовок страницы и добавить инфоблок и разделы в навигационную цепочку. По умолчанию включены. Для списка внутри другой страницы передайте `N` |
| `CACHE_TYPE` | `A`, `Y` или `N` | Режим кеша — `A` по настройкам автокеширования сайта, `Y` всегда, `N` без кеша |
| `CACHE_TIME` | `int` | Время жизни кеша в секундах. По умолчанию `36000000` |
| `CACHE_FILTER` | `Y` или `N` | Кешировать список с фильтром. Если задан фильтр, а параметр не равен `Y`, компонент не кеширует результат |
| `CACHE_GROUPS` | `Y` или `N` | Хранить отдельный кеш для групп пользователей. По умолчанию `Y` |

Если на странице несколько списков с постраничной навигацией, каждый получает свой параметр страницы в порядке подключения: первый — `PAGEN_1`, второй — `PAGEN_2`. Списки листаются независимо. Без кеша ссылки навигации сохраняют номер страницы соседнего списка, а с кешем строка навигации берется из кеша и может этот номер потерять.

Компонент выбирает элементы методом `CIBlockElement::GetList()`, поэтому дополнительный фильтр задают в формате фильтра классического API. Создайте глобальную переменную с массивом условий до подключения компонента и передайте ее имя в `FILTER_NAME`. Комплексный компонент `bitrix:news` учитывает `FILTER_NAME`, только если передан `USE_FILTER` со значением `Y`.

Компонент объединяет свой фильтр с переданным, и ключи переданного фильтра заменяют ключи компонента. Не собирайте фильтр из параметров запроса без проверки и не передавайте в нем ключи `ACTIVE` и `CHECK_PERMISSIONS` — так можно показать неактивные элементы или элементы без прав на чтение.

Умный фильтр `bitrix:catalog.smart.filter` записывает условия в глобальную переменную с именем из своего параметра `FILTER_NAME`. Чтобы список показывал отфильтрованные элементы, передайте списку то же имя и `CACHE_FILTER` со значением `Y`. Умный фильтр описан в статье [Фасетный индекс и умный фильтр](./faceted-index.md).

**Пример.** Выведите новости источника `press` и включите кеш для отфильтрованного списка. Для свойства-списка фильтр принимает `ID` варианта, поэтому код сначала находит вариант по внешнему коду способом из раздела [Найти вариант списка](./property-values.md#find-enum-by-xml-id). Поиск выполняется до подключения компонента, поэтому код сначала подключает модуль `iblock`.

```php
use Bitrix\Iblock\PropertyEnumerationTable;
use Bitrix\Main\Loader;

if (!Loader::includeModule('iblock'))
{
    return;
}

$sourceEnum = PropertyEnumerationTable::getRow([
    'select' => ['ID'],
    'filter' => [
        '=PROPERTY.IBLOCK_ID' => $iblockId,
        '=PROPERTY.CODE' => 'SOURCE',
        '=XML_ID' => 'press',
    ],
]);

$GLOBALS['arrNewsFilter'] = [
    'PROPERTY_SOURCE' => $sourceEnum !== null ? (int)$sourceEnum['ID'] : 0,
];

$APPLICATION->IncludeComponent(
    'bitrix:news.list',
    '',
    [
        'IBLOCK_ID' => $iblockId,
        'NEWS_COUNT' => 10,
        'FILTER_NAME' => 'arrNewsFilter',
        'PROPERTY_CODE' => ['AUTHOR', 'SOURCE'],
        'SET_TITLE' => 'N',
        'INCLUDE_IBLOCK_INTO_CHAIN' => 'N',
        'CACHE_TYPE' => 'A',
        'CACHE_TIME' => 3600,
        'CACHE_FILTER' => 'Y',
    ]
);
```

Если вариант не найден, фильтр получает `0` и список выводится пустым. Ключи классического фильтра и их значения описаны в разделе [Заменить фильтр](./element-queries.md#classic-filter-replacements).

## Дополнить данные шаблона {#result-modifier}

Если шаблону нужны данные, которых компонент не выбрал, дополните его результат в файле `result_modifier.php` шаблона. Шаблон вложенного компонента, например `bitrix:news.list` внутри `bitrix:news`, лежит в папке шаблона комплексного компонента. Порядок поиска шаблонов описан в разделе [Шаблоны компонента](./../../framework/components.md#templates).

Компонент выполняет `result_modifier.php` до сохранения кеша. Если кеш включен, запросы в файле выполняются только при построении кеша, а в кеш попадает готовый HTML шаблона.

-  Из `$arResult` в кеше остаются только ключи, перечисленные в `SetResultCacheKeys()`. Они доступны в `component_epilog.php`, подробнее — в разделе [Файл component_epilog.php](./../../framework/components.md#component-epilog-file).

-  Если кеш выключен или фильтр задан без `CACHE_FILTER`, файл выполняется при каждом открытии страницы.

Кеш компонента сбрасывает тег `iblock_id_<ID>`, когда элементы записывают методами API, если на сайте определена константа `BX_COMP_MANAGED_CACHE`, подробнее — в разделе [Кешировать результат вне компонентов](./performance.md#cache-outside-components). Если `result_modifier.php` берет данные из других источников, например из Highload-блока, их изменение кеш не сбросит. Способ сбросить тегированный кеш вручную описан в разделе [Обновить кеш и индексы](./property-values.md#refresh-cache-and-indexes).

Данные элементов читайте через ORM-класс инфоблока. Скомпилируйте класс в начале каждого `result_modifier.php`, в котором его используете. Подробно получение класса описано в разделе [Получить элемент](./elements.md#get-element).

**Пример.** Скомпилируйте ORM-класс элементов инфоблока новостей. Примеры ниже используют переменную `$elementNewsClass` из этого кода.

```php
use Bitrix\Iblock\IblockTable;

$elementEntity = IblockTable::compileEntity('News');

if ($elementEntity === false)
{
    return;
}

$elementNewsClass = $elementEntity->getDataClass();
```

Метод `compileEntity()` возвращает `false`, если инфоблока с таким символьным кодом API нет. Тогда код выходит из `result_modifier.php`, и шаблон получает только данные компонента.

{% note warning "" %}

Компоненты `bitrix:news.list` и `bitrix:news.detail` выбирают элементы с учетом флага активности. Даты активности и права доступа они по умолчанию тоже проверяют. В `bitrix:news.list` за это отвечают параметры `CHECK_DATES` и `CHECK_PERMISSIONS`, `bitrix:news.detail` проверяет права всегда. ORM даты активности и права не проверяет, условие `where('ACTIVE', 'Y')` проверяет только флаг. Поэтому в `result_modifier.php` не выбирайте элементы заново, а дополняйте данные, которые уже выбрал компонент, — `$arResult['ITEMS']` в списке и `$arResult['ID']` на детальной странице.

{% endnote %}

### Дополнить список новостей автором, источником и разделом {#list-extra-fields}

**Пример.** Добавьте к новостям, которые выбрал компонент, автора, источник и название раздела. Код размещается в `result_modifier.php` шаблона компонента `bitrix:news.list` после компиляции ORM-класса.

```php
$ids = array_column($arResult['ITEMS'], 'ID');

if ($ids)
{
    $elements = $elementNewsClass::query()
        ->setSelect([
            'ID',
            'AUTHOR',         // строка
            'SOURCE.ITEM',    // список — ITEM, иначе getItem() вернет null
            'IBLOCK_SECTION', // подгружаем раздел за один запрос
        ])
        ->whereIn('ID', $ids)
        ->fetchCollection()
    ;

    $extra = [];
    foreach ($elements as $element)
    {
        $extra[$element->getId()] = [
            'AUTHOR'       => $element->get('AUTHOR')?->getValue() ?? '—',
            'SOURCE_NAME'  => $element->get('SOURCE')?->getItem()?->getValue() ?? '—',
            'SECTION_NAME' => $element->getIblockSection()?->getName() ?? 'Без раздела',
        ];
    }

    foreach ($arResult['ITEMS'] as &$item)
    {
        $item += $extra[$item['ID']] ?? [];
    }
    unset($item);
}
```

Порядок, количество и постраничная навигация остаются такими, как их настроил компонент. В шаблоне новые значения доступны в ключах `AUTHOR`, `SOURCE_NAME` и `SECTION_NAME` каждого элемента `$arResult['ITEMS']`. ORM возвращает значения без HTML-экранирования, поэтому выводите их через `htmlspecialcharsbx()`.

### Вывести новость с разделом, фото и итогом {#detail-extra-fields}

Для элемента, который выбрал компонент `bitrix:news.detail`, загрузите раздел, фото и итог — HTML-свойство `SUMMARY`. Используйте `$arResult['ID']`. Не ищите элемент повторно по `$arParams['ELEMENT_CODE']`. Это экранированное значение, и код с `&` или кавычкой не найдется. Если нужен символьный код, берите исходное значение `$arParams['~ELEMENT_CODE']` — его использует сам компонент.

**Пример.** Подготовьте раздел, фото и итог для шаблона детальной страницы. Код размещается в `result_modifier.php` шаблона компонента `bitrix:news.detail`.

```php
$element = $elementNewsClass::query()
    ->setSelect([
        'ID', 'NAME', 'AUTHOR',
        'PHOTO.VALUE', 'PHOTO.DESCRIPTION',
        'SUMMARY', // HTML-свойство
        'IBLOCK_SECTION',
    ])
    ->where('ID', (int)$arResult['ID'])
    ->fetchObject()
;

if ($element)
{
    // HTML-свойство хранит сериализованный массив с ключами TEXT и TYPE
    $summary = (string)($element->get('SUMMARY')?->getValue() ?? '');
    $summaryData = CheckSerializedData($summary)
        ? unserialize($summary, ['allowed_classes' => false])
        : false
    ;

    if (!is_array($summaryData))
    {
        // несериализованную строку ядро читает как обычный текст
        $summaryData = ['TEXT' => $summary, 'TYPE' => 'TEXT'];
    }

    // FormatText() возвращает HTML как есть, а текст экранирует
    $summaryHtml = FormatText(
        (string)($summaryData['TEXT'] ?? ''),
        (string)($summaryData['TYPE'] ?? 'TEXT')
    );

    $arResult['ITEM'] = [
        'ID'           => $element->getId(),
        'NAME'         => $element->getName(),
        'AUTHOR'       => $element->get('AUTHOR')?->getValue() ?? '',
        'SUMMARY_HTML' => $summaryHtml, // передаем в шаблон
    ];

    // Фото
    $photo = $element->get('PHOTO');
    if ($photo)
    {
        $arResult['ITEM']['PHOTO'] = [
            'SRC' => \CFile::GetPath($photo->getValue()),
            'ALT' => $photo->getDescription(),
        ];
    }

    // Раздел
    $section = $element->getIblockSection();
    if ($section)
    {
        $arResult['ITEM']['SECTION_NAME'] = $section->getName();
        $arResult['ITEM']['SECTION_CODE'] = $section->getCode();
    }
}
```

Код записывает данные в `$arResult['ITEM']` — ключи `ID`, `NAME`, `AUTHOR`, `SUMMARY_HTML`, `PHOTO` с ключами `SRC` и `ALT`, `SECTION_NAME` и `SECTION_CODE`. Значения `NAME`, `AUTHOR`, `ALT` и `SECTION_NAME` выводите через `htmlspecialcharsbx()`. В шаблоне `template.php` выведите готовое значение итога через `<?= $arResult['ITEM']['SUMMARY_HTML'] ?>`. Если HTML-свойство заполняют пользователи публичной части, очистите HTML перед выводом методом `SanitizeHtml()` класса `CBXSanitizer`.

ORM возвращает значение HTML-свойства в том виде, в котором оно хранится в базе, — сериализованный массив с ключами `TEXT` и `TYPE`. Поэтому код передает в `unserialize()` строку значения и берет из массива ключ `TEXT`. Функция `FormatText()` готовит значение к выводу так же, как ядро при выводе свойства в публичной части. Значение с типом `HTML` возвращает без изменений, а значение с типом `TEXT` экранирует. Несериализованную строку код читает как текст с типом `TEXT`. Формат записи приведен в разделе [Записать HTML-свойство](./property-values.md#write-html-property).

### Сформировать анонс из подробного текста {#auto-preview}

Компонент `bitrix:news.list` уже выбирает `DETAIL_TEXT`, поэтому для краткого описания отдельный запрос не нужен.

**Пример.** Обрежьте детальный текст до 300 символов без тегов. Код размещается в `result_modifier.php` шаблона компонента `bitrix:news.list`.

```php
foreach ($arResult['ITEMS'] as &$item)
{
    $text = strip_tags((string)$item['~DETAIL_TEXT']); // исходный текст без экранирования
    $preview = mb_substr($text, 0, 300);
    if (mb_strlen($text) > mb_strlen($preview))
    {
        $preview .= '…';
    }

    $item['AUTO_PREVIEW_TEXT'] = htmlspecialcharsbx($preview);
}
unset($item);
```

В шаблоне выведите `$item['AUTO_PREVIEW_TEXT']` без повторного экранирования — код уже экранировал значение.

### Показать другие новости источника {#more-from-source}

Это отдельная выборка, поэтому даты активности проверьте в запросе сами. Права доступа ORM не проверяет. Если они важны, выберите похожие новости через `CIBlockElement::GetList()` с `'CHECK_PERMISSIONS' => 'Y'` в фильтре, способ описан в разделе [Проверить права пользователя](./elements.md#check-permissions).

Код выполняется при построении кеша, поэтому текущая дата для проверки активности фиксируется в этот момент. Новость с истекшей датой окончания активности останется в блоке до истечения `CACHE_TIME` или до сброса кеша.

**Пример.** На странице новости покажите еще пять новостей от того же источника. Код размещается в `result_modifier.php` шаблона компонента `bitrix:news.detail`.

```php
use Bitrix\Main\ORM\Query\Query;
use Bitrix\Main\Type\DateTime;

$current = $elementNewsClass::query()
    ->setSelect(['ID', 'SOURCE'])
    ->where('ID', (int)$arResult['ID'])
    ->fetchObject()
;

$arResult['MORE_FROM_SOURCE'] = [];

if (!$current)
{
    return;
}

$sourceId = $current->get('SOURCE')?->getValue();
if (!$sourceId)
{
    return;
}

$now = new DateTime();

$similar = $elementNewsClass::query()
    ->setSelect(['ID', 'IBLOCK_ID', 'NAME', 'CODE', 'IBLOCK_SECTION_ID'])
    ->where('ACTIVE', 'Y')
    ->where(Query::filter()
        ->logic('or')
        ->whereNull('ACTIVE_FROM')
        ->where('ACTIVE_FROM', '<=', $now)
    )
    ->where(Query::filter()
        ->logic('or')
        ->whereNull('ACTIVE_TO')
        ->where('ACTIVE_TO', '>=', $now)
    )
    ->where('SOURCE.VALUE', $sourceId) // фильтр по идентификатору источника
    ->whereNot('ID', $current->getId())
    ->setOrder(['ACTIVE_FROM' => 'DESC', 'ID' => 'DESC']) // сначала новые
    ->setLimit(5)
    ->fetchCollection()
;

// Шаблон адреса — из параметров компонента или из настроек инфоблока
$detailUrlTemplate = (string)($arParams['~DETAIL_URL'] ?? '');
if ($detailUrlTemplate === '')
{
    $detailUrlTemplate = (string)($arResult['IBLOCK']['DETAIL_PAGE_URL'] ?? '');
}

foreach ($similar as $item)
{
    $arResult['MORE_FROM_SOURCE'][] = [
        'NAME' => $item->getName(),
        'URL'  => \CIBlock::ReplaceDetailUrl($detailUrlTemplate, [
            'ID' => $item->getId(),
            'IBLOCK_ID' => $item->getIblockId(),
            'IBLOCK_CODE' => $arResult['IBLOCK']['CODE'] ?? '',
            'IBLOCK_TYPE_ID' => $arResult['IBLOCK']['IBLOCK_TYPE_ID'] ?? '',
            'CODE' => $item->getCode(),
            'IBLOCK_SECTION_ID' => $item->getIblockSectionId(),
        ], true, 'E'),
    ];
}
```

Метод `CIBlock::ReplaceDetailUrl()` подставляет в шаблон адреса поля элемента и инфоблока, например `#ELEMENT_CODE#`, `#SECTION_CODE#` и `#IBLOCK_CODE#`. Третий аргумент `true` подставляет папку сайта вместо `#SITE_DIR#`. Код берет шаблон из параметра `DETAIL_URL`, который передает комплексный компонент, или из поля `DETAIL_PAGE_URL` настроек инфоблока. Так адреса совпадают со ссылками, которые формирует сам компонент.

В MySQL элементы без даты начала активности попадают в конец списка.

ORM возвращает значения без HTML-экранирования, поэтому в шаблоне выводите `NAME` и `URL` через `htmlspecialcharsbx()`. Сортировка и другие параметры выборки описаны в статье [Выборка элементов инфоблока](./element-queries.md#sort).

## Проверить результат {#check-result}

Перед публикацией проверьте на тестовом сайте сценарии ниже.

1. Откройте список и детальную страницу и проверьте, что адреса ссылок совпадают с шаблонами `SEF_URL_TEMPLATES` и настройками инфоблока.

2. Снимите элемент с публикации и проверьте, что список и детальная страница его не показывают. Если список остался прежним, сбросьте кеш компонента — без константы `BX_COMP_MANAGED_CACHE` тегированный кеш не сбрасывается.

3. Задайте фильтр через `FILTER_NAME` и проверьте, что при включенном `CACHE_FILTER` разные значения фильтра дают разные списки.

4. Измените данные, которые добавляет `result_modifier.php`, и проверьте, что после сброса кеша компонента страница показывает новые значения.

5. Войдите пользователем без прав на чтение инфоблока и проверьте, что элементы не выводятся.
