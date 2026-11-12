---
title: SEO-шаблоны инфоблока
description: "Вычисляемые свойства SEO инфоблока — заголовок окна браузера, ключевые слова, описание, заголовок страницы, alt, title и имена файлов картинок. Шаблоны инфоблока, раздела и элемента через Bitrix\\Iblock\\InheritedProperty, синтаксис и функции шаблонов, чтение значений, вывод на странице и сброс вычисленных значений после изменений."
---

SEO-свойства инфоблока — заголовок окна браузера, ключевые слова, описание страницы, заголовок страницы, атрибуты `alt` и `title` картинок и имена файлов картинок. Их не заполняют вручную у каждого элемента. Значения вычисляются по шаблонам, например шаблон `{=this.Name} — Новости` дает для элемента Итоги года значение `Итоги года — Новости`.

Обычно шаблоны задает контент-менеджер в административном разделе, на вкладке SEO формы инфоблока, раздела или элемента. Код нужен, когда шаблоны настраивает миграция или импорт, когда страницу формирует свой код, а не стандартный компонент, и когда после программной записи нужно обновить вычисленные значения.

Шаблоны и вычисленные значения обслуживают D7-классы пространства имен `Bitrix\Iblock\InheritedProperty`. Классического API с тем же набором возможностей нет, поэтому статья описывает только эти классы. Классические методы `CIBlock`, `CIBlockSection` и `CIBlockElement` умеют только сохранить шаблоны вместе с записью через поле `IPROPERTY_TEMPLATES`, это описано в разделе [Передать шаблоны при записи](#iproperty-templates-on-add).

Перед работой подключите модуль `iblock`. Переменная `$iblockId` содержит идентификатор инфоблока, `$sectionId` — идентификатор раздела, `$elementId` — идентификатор элемента. Примеры используют инфоблок новостей с разделом Мероприятия и строковыми свойствами `AUTHOR` — автор новости и `KEYWORDS` — множественное свойство с ключевыми словами.

## Как работают шаблоны {#how-it-works}

Шаблон задают на одном из трех уровней — инфоблок, раздел или элемент. Для каждого SEO-свойства действует ближайший шаблон. Поиск идет от элемента вверх по цепочке «элемент → раздел → инфоблок», то есть шаблоны наследуются от инфоблока к разделам и элементам.

-  Шаблон инфоблока действует для всех разделов и элементов, у которых нет своего шаблона.

-  Шаблон раздела действует для его подразделов и элементов. Элемент наследует шаблоны своего основного раздела `IBLOCK_SECTION_ID`, даже если привязан к нескольким разделам. Основной раздел описан в разделе [Привязать элемент к нескольким разделам](./elements.md#bind-to-sections).

-  Шаблон элемента действует только для этого элемента.

Вычисленные значения хранятся в отдельных таблицах базы данных. Значение элемента вычисляется при первом чтении и сохраняется. Следующие чтения берут готовое значение, даже если поля элемента или шаблон с тех пор изменились. Когда значения нужно пересчитать, описано в разделе [Сбросить вычисленные значения](#clear-values).

## Коды SEO-свойств {#seo-codes}

Шаблоны элементов `ELEMENT_*` задают на любом уровне, шаблоны разделов `SECTION_*` — у инфоблока и раздела. Например, шаблон `ELEMENT_META_TITLE`, заданный инфоблоку или разделу, действует для элементов.

| Код для элемента | Код для раздела | Назначение |
|---|---|---|
| `ELEMENT_META_TITLE` | `SECTION_META_TITLE` | Заголовок окна браузера, тег `<title>` |
| `ELEMENT_META_KEYWORDS` | `SECTION_META_KEYWORDS` | Ключевые слова, мета-тег `keywords` |
| `ELEMENT_META_DESCRIPTION` | `SECTION_META_DESCRIPTION` | Описание страницы, мета-тег `description` |
| `ELEMENT_PAGE_TITLE` | `SECTION_PAGE_TITLE` | Заголовок страницы, обычно выводится в теге `<h1>`, и пункт навигационной цепочки |
| `ELEMENT_PREVIEW_PICTURE_FILE_ALT`<br>`ELEMENT_DETAIL_PICTURE_FILE_ALT` | `SECTION_PICTURE_FILE_ALT`<br>`SECTION_DETAIL_PICTURE_FILE_ALT` | Атрибут `alt` картинки. У элемента — картинки для анонса и детальной картинки, у раздела — полей `PICTURE` и `DETAIL_PICTURE` |
| `ELEMENT_PREVIEW_PICTURE_FILE_TITLE`<br>`ELEMENT_DETAIL_PICTURE_FILE_TITLE` | `SECTION_PICTURE_FILE_TITLE`<br>`SECTION_DETAIL_PICTURE_FILE_TITLE` | Атрибут `title` тех же картинок |
| `ELEMENT_PREVIEW_PICTURE_FILE_NAME`<br>`ELEMENT_DETAIL_PICTURE_FILE_NAME` | `SECTION_PICTURE_FILE_NAME`<br>`SECTION_DETAIL_PICTURE_FILE_NAME` | Имя файла картинки при загрузке, подробнее — в разделе [Задать имена файлов картинок](#file-names) |

## Синтаксис шаблона {#template-syntax}

Шаблон — это текст со вставками вида `{=...}`. Текст вне вставок попадает в значение без изменений.

| Вставка | Что подставляет |
|---|---|
| `{=this.Name}` | Название элемента или раздела |
| `{=this.Code}` | Символьный код |
| `{=this.PreviewText}`, `{=this.DetailText}` | Текст анонса и детальный текст элемента. Для раздела обе вставки подставляют описание раздела |
| `{=this.property.AUTHOR}` | Значение свойства элемента с кодом `AUTHOR`. Значения множественного свойства подставляются через пробел |
| `{=parent.Name}` | Название основного раздела элемента. Для элемента вне разделов вставка пустая |
| `{=this.sections.Name}` | Названия разделов на пути к основному разделу, от верхнего уровня, через пробел |
| `{=iblock.Name}` | Название инфоблока |

Имена полей не зависят от регистра, `{=this.Name}` и `{=this.NAME}` дают одинаковый результат. Подстановки вида `#SITE_NAME#` в шаблонах не обрабатываются и попадают в значение как текст.

Функции записывают первым словом внутри вставки, аргументы перечисляют через пробел. Вставки можно вкладывать друг в друга.

| Функция | Результат |
|---|---|
| `{=lower this.Name}`, `{=upper this.Name}` | Текст в нижнем или верхнем регистре |
| `{=ucfirst this.property.AUTHOR}`, `{=ucwords this.Name}` | Первая буква текста или каждого слова — заглавная |
| `{=striptags this.PreviewText}` | Текст без HTML-тегов |
| `{=limit {=striptags this.PreviewText} " " 20}` | Первые 20 слов текста, разделитель слов — пробел. Функция не удаляет HTML-теги, поэтому текст в формате HTML передают через `striptags` |
| `{=concat this.property.KEYWORDS ", "}` | Значения через указанный разделитель, например значения множественного свойства или названия разделов пути |
| `{=translit this.Name}` | Текст латиницей без пробелов и знаков препинания, не длиннее 100 символов, например `Itogigoda`. Для имен файлов удобнее модификатор `t` из раздела [Задать имена файлов картинок](#file-names) |
| `{=min ...}`, `{=max ...}`, `{=distinct ...}` | Минимальное и максимальное значение, значения без повторов. Принимают список значений, например множественное свойство или цены торговых предложений |
| `{=contrast this.PreviewText " " 10}` | До 10 самых характерных слов текста. Последние два аргумента — разделитель слов и число слов |

Если установлен модуль `catalog`, в шаблонах товаров доступны данные каталога через `{=this.catalog...}` — вес, единица измерения, цены, склады и торговые предложения. Например, `{=min this.catalog.sku.price.base}` подставляет минимальную цену торговых предложений по типу цены с кодом `BASE`. Вместо кода типа цены можно указать его `ID`. Цены подставляются в отформатированном виде, с валютой.

**Пример.** Шаблоны для новостей.

```text
{=this.Name} — {=iblock.Name}
{=concat this.property.KEYWORDS ", "}
{=limit {=striptags this.PreviewText} " " 20}
{=concat this.sections.Name " / "}: {=this.Name}
```

Для элемента Итоги года в разделе Мероприятия с ключевыми словами итоги и отчет первая, вторая и четвертая строки дают значения `Итоги года — Новости`, `итоги, отчет` и `Мероприятия: Итоги года`. Третья строка дает первые 20 слов анонса без HTML-тегов.

### Добавить свою функцию шаблона {#custom-function}

Свою функцию шаблона добавляют обработчиком события `OnTemplateGetFunctionClass` модуля `iblock`. Подпишите обработчик методом `addEventHandler()` объекта `Bitrix\Main\EventManager`, а не `addEventHandlerCompatible()` — обработчик получает объект `Bitrix\Main\Event`. Где разместить подписку, описано в статье [События инфоблоков](./events.md#subscribe).

-  Событие вызывается только для имен, которых нет среди встроенных функций. Встроенную функцию переопределить нельзя.

-  Обработчик получает объект `Bitrix\Main\Event`. Имя функции возвращает `$event->getParameters()[0]`.

-  Обработчик возвращает `new \Bitrix\Main\EventResult(\Bitrix\Main\EventResult::SUCCESS, MyFunction::class)`. Если вернуть просто строку с именем класса, функция не подключится.

-  Класс `MyFunction` наследует `Bitrix\Iblock\Template\Functions\FunctionBase` и вычисляет результат в методе `calculate(array $parameters)`. Массив `$parameters` содержит уже вычисленные значения аргументов — строку или массив для множественного свойства. Метод возвращает строку.

Если функции с таким именем нет и обработчик ее не подключил, шаблон подставляет пустую строку.

**Пример.** Добавьте функцию `firstword`, которая возвращает первое слово значения, например `{=firstword this.property.KEYWORDS}`. Вспомогательный метод `parametersToString()` базового класса склеивает аргументы в строку через пробел.

```php
namespace Partner\Seo;

use Bitrix\Iblock\Template\Functions\FunctionBase;

class FirstWordFunction extends FunctionBase
{
    public function calculate(array $parameters): string
    {
        $text = trim($this->parametersToString($parameters));
        $words = preg_split('/\s+/u', $text);

        return (string)($words[0] ?? '');
    }
}
```

Подпишите обработчик, который подключает класс для имени `firstword`.

```php
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;
use Bitrix\Main\EventResult;
use Partner\Seo\FirstWordFunction;

EventManager::getInstance()->addEventHandler(
    'iblock',
    'OnTemplateGetFunctionClass',
    static function (Event $event): ?EventResult
    {
        if ($event->getParameters()[0] !== 'firstword')
        {
            return null;
        }

        return new EventResult(EventResult::SUCCESS, FirstWordFunction::class);
    }
);
```

## Задать шаблоны {#set-templates}

Шаблоны уровня задает метод `set()` объекта шаблонов.

-  `IblockTemplates($iblockId)` — шаблоны инфоблока,

-  `SectionTemplates($iblockId, $sectionId)` — шаблоны раздела,

-  `ElementTemplates($iblockId, $elementId)` — шаблоны элемента.

Метод `set()` принимает массив «код SEO-свойства → шаблон». Коды, которых нет в массиве, метод не меняет. Пустая строка удаляет шаблон этого уровня, и свойство снова наследует шаблон уровня выше. Метод не проверяет синтаксис шаблона и ничего не возвращает.

После каждого `set()` сбросьте вычисленные значения того же уровня методом `clearValues()`. Чтобы компоненты не показывали старые заголовки из своего кеша, сбросьте также тегированный кеш инфоблока, как описано в разделе [Сбросить вычисленные значения](#clear-values).

Без сброса значение может пропасть:

-  элемент вычисляет значения заново, только если у него нет ни одного сохраненного значения,

-  если `set()` добавляет новый шаблон, метод сбрасывает все значения уровня,

-  если `set()` изменяет или удаляет шаблон, метод удаляет сохраненные значения только этого шаблона. Остальные значения элемента остаются, пересчета не происходит, и свойство с измененным шаблоном пропадает из результата `getValues()`.

**Пример.** Задайте шаблоны инфоблоку, переопределите заголовок для раздела Мероприятия и для одного элемента.

```php
use Bitrix\Iblock\InheritedProperty;
use Bitrix\Main\Loader;

if (!Loader::includeModule('iblock'))
{
    throw new \RuntimeException('Не удалось подключить модуль iblock');
}

// Шаблоны для всех разделов и элементов инфоблока
$iblockTemplates = new InheritedProperty\IblockTemplates($iblockId);
$iblockTemplates->set([
    'ELEMENT_META_TITLE' => '{=this.Name} — Новости компании',
    'ELEMENT_META_DESCRIPTION' => '{=limit {=striptags this.PreviewText} " " 20}',
    'ELEMENT_META_KEYWORDS' => '{=concat this.property.KEYWORDS ", "}',
    'SECTION_META_TITLE' => '{=this.Name} — Новости компании',
]);
(new InheritedProperty\IblockValues($iblockId))->clearValues();

// Заголовок для элементов раздела Мероприятия и его подразделов
$sectionTemplates = new InheritedProperty\SectionTemplates($iblockId, $sectionId);
$sectionTemplates->set([
    'ELEMENT_META_TITLE' => 'Мероприятие: {=this.Name}',
]);
(new InheritedProperty\SectionValues($iblockId, $sectionId))->clearValues();

// Заголовок одного элемента
$elementTemplates = new InheritedProperty\ElementTemplates($iblockId, $elementId);
$elementTemplates->set([
    'ELEMENT_META_TITLE' => 'Важно: {=this.Name}',
]);
(new InheritedProperty\ElementValues($iblockId, $elementId))->clearValues();

// Кеш компонентов с заголовками и мета-тегами инфоблока
\CIBlock::clearIblockTagCache($iblockId);
```

Чтобы удалить шаблон элемента и вернуть наследование, передайте пустую строку и сбросьте значения элемента. Код продолжает пример выше и использует объект `$elementTemplates`.

```php
use Bitrix\Iblock\InheritedProperty;

$elementTemplates->set(['ELEMENT_META_TITLE' => '']);
(new InheritedProperty\ElementValues($iblockId, $elementId))->clearValues();
```

Метод `delete()` удаляет все шаблоны уровня сразу, после него тоже вызовите `clearValues()`. При удалении элемента или раздела методами `CIBlockElement::Delete()` и `CIBlockSection::Delete()` их шаблоны удаляются автоматически. Если элемент удаляет ORM, шаблоны удаляют отдельно, как описано в разделе [Удалить элемент](./elements.md#delete-element).

### Передать шаблоны при записи {#iproperty-templates-on-add}

Методы `Add()` и `Update()` классов `CIBlock`, `CIBlockSection` и `CIBlockElement` принимают шаблоны в поле `IPROPERTY_TEMPLATES` в том же формате, что и `set()`. Методы передают массив в `set()`, поэтому правила те же. Пустая строка удаляет шаблон, а после изменения существующего шаблона через `Update()` нужен `clearValues()`.

**Пример.** Задайте шаблон заголовка при добавлении элемента.

```php
$elementApi = new \CIBlockElement();
$elementId = $elementApi->Add([
    'IBLOCK_ID' => $iblockId,
    'NAME' => 'Конференция разработчиков',
    'PROPERTY_VALUES' => [
        'AUTHOR' => 'Пресс-служба',
    ],
    'IPROPERTY_TEMPLATES' => [
        'ELEMENT_META_TITLE' => 'Конференция: {=this.Name}',
    ],
]);

if (!$elementId)
{
    throw new \RuntimeException($elementApi->getLastError());
}
```

ORM-класс элементов `Element{ApiCode}Table` при добавлении методом `add()` не сохраняет `IPROPERTY_TEMPLATES` и не сообщает об ошибке — элемент создается без шаблонов. Почему элементы записывают классическим API, объяснено в разделе [Выбрать API для записи](./elements.md#choose-write-api).

## Прочитать значения {#get-values}

Вычисленные значения возвращают объекты значений.

-  `ElementValues($iblockId, $elementId)` — значения элемента,

-  `SectionValues($iblockId, $sectionId)` — значения раздела,

-  `IblockValues($iblockId)` — значения инфоблока, например для страницы списка в корне инфоблока.

Метод `getValues()` возвращает массив «код SEO-свойства → значение» для всех свойств, у которых на любом уровне цепочки есть шаблон. В результат попадают коды обоих видов. У элемента используйте коды `ELEMENT_*`, у раздела и инфоблока — коды `SECTION_*`. Для инфоблока эти коды вычисляются по его названию и описанию. Метод `getValue($code)` возвращает одно значение или пустую строку. Значения уже экранированы для вывода в HTML, например кавычки заменены на `&quot;`. Не экранируйте их повторно.

**Пример.** Получите SEO-свойства элемента.

```php
use Bitrix\Iblock\InheritedProperty;

$elementValues = new InheritedProperty\ElementValues($iblockId, $elementId);
$seo = $elementValues->getValues();

$metaTitle = $seo['ELEMENT_META_TITLE'] ?? '';
// Мероприятие: Итоги года — шаблон раздела Мероприятия, если у элемента нет своего шаблона
```

### Прочитать значения для списка элементов {#get-list-values}

Каждый объект `ElementValues` при создании встает в общую очередь инфоблока. Первый вызов `getValues()` читает сохраненные значения всех элементов очереди одним запросом. Чтобы список из 20 элементов не делал 20 запросов, сначала создайте объекты для всех элементов, потом читайте значения.

**Пример.** Получите заголовки и `alt` картинок анонса для списка новостей.

```php
use Bitrix\Iblock\InheritedProperty;

// $elementIds — ID элементов текущей страницы списка
$valuesByElement = [];
foreach ($elementIds as $elementId)
{
    $valuesByElement[$elementId] = new InheritedProperty\ElementValues($iblockId, $elementId);
}

$seoByElement = [];
foreach ($valuesByElement as $elementId => $elementValues)
{
    $seo = $elementValues->getValues();
    $seoByElement[$elementId] = [
        'TITLE' => $seo['ELEMENT_META_TITLE'] ?? '',
        'PICTURE_ALT' => $seo['ELEMENT_PREVIEW_PICTURE_FILE_ALT'] ?? '',
    ];
}
```

Значения, которые еще не вычислены, например сразу после `clearValues()`, вычисляются для каждого элемента отдельно. Результат списка кешируйте вместе с остальными данными компонента, подробнее — в статье [Кеширование](./../../performance/caching.md).

### Узнать источник шаблона {#find-templates}

Чтобы узнать, какие шаблоны действуют для элемента и откуда они унаследованы, вызовите `findTemplates()` у объекта шаблонов. Метод возвращает массив «код SEO-свойства → данные шаблона». В данных ключ `TEMPLATE` содержит шаблон, `ENTITY_TYPE` — уровень, где шаблон задан, `B` — инфоблок, `S` — раздел, `E` — элемент. Ключ `INHERITED` равен `N`, если шаблон задан у самого элемента, и `Y`, если унаследован. Метод `get()` возвращает только шаблоны своего уровня.

```php
use Bitrix\Iblock\InheritedProperty;

$elementTemplates = new InheritedProperty\ElementTemplates($iblockId, $elementId);

foreach ($elementTemplates->findTemplates() as $code => $template)
{
    // ELEMENT_META_TITLE: Мероприятие: {=this.Name}, уровень S
    echo $code . ': ' . $template['TEMPLATE'] . ', уровень ' . $template['ENTITY_TYPE'] . PHP_EOL;
}
```

## Вывести значения на странице {#apply-on-page}

Стандартные компоненты, например `bitrix:news.detail` и `bitrix:catalog.element`, сами читают SEO-свойства и устанавливают заголовки. В `bitrix:news.detail` за это отвечают параметры `SET_TITLE`, `SET_BROWSER_TITLE`, `SET_META_KEYWORDS`, `SET_META_DESCRIPTION` и `ADD_ELEMENT_CHAIN`. Если страницу формирует свой код, установите значения методами глобального объекта страницы `$APPLICATION` — он хранит заголовок и свойства текущей страницы до вывода шаблона сайта.

-  `ELEMENT_PAGE_TITLE` — метод `SetTitle()`, заголовок в теге `<h1>`,

-  `ELEMENT_META_TITLE` — метод `SetPageProperty('title', ...)`, тег `<title>`,

-  `ELEMENT_META_KEYWORDS` и `ELEMENT_META_DESCRIPTION` — метод `SetPageProperty()` со свойствами `keywords` и `description`.

Значения из `getValues()` уже экранированы. Запасное значение, например название элемента из ORM-запроса, экранируйте функцией `htmlspecialcharsbx()` — метод `ShowTitle()` выводит заголовок без экранирования.

**Пример.** Установите заголовки и мета-теги страницы элемента.

```php
use Bitrix\Iblock\InheritedProperty;

global $APPLICATION;

$seo = (new InheritedProperty\ElementValues($iblockId, $elementId))->getValues();

// Заголовок страницы: из шаблона или название элемента
$pageTitle = $seo['ELEMENT_PAGE_TITLE'] ?? '';
$APPLICATION->SetTitle($pageTitle !== '' ? $pageTitle : htmlspecialcharsbx($elementName));

if (($seo['ELEMENT_META_TITLE'] ?? '') !== '')
{
    $APPLICATION->SetPageProperty('title', $seo['ELEMENT_META_TITLE']);
}
if (($seo['ELEMENT_META_KEYWORDS'] ?? '') !== '')
{
    $APPLICATION->SetPageProperty('keywords', $seo['ELEMENT_META_KEYWORDS']);
}
if (($seo['ELEMENT_META_DESCRIPTION'] ?? '') !== '')
{
    $APPLICATION->SetPageProperty('description', $seo['ELEMENT_META_DESCRIPTION']);
}
```

Переменная `$elementName` содержит название элемента, полученное вместе с другими полями элемента. Для страницы раздела используйте `SectionValues` и коды `SECTION_*`. Пункт навигационной цепочки со значением `ELEMENT_PAGE_TITLE` или `SECTION_PAGE_TITLE` добавляет метод `$APPLICATION->AddChainItem()`, подробнее — в статье [Хлебные крошки](./../../cms-basics/breadcrumbs.md).

Если на странице заголовок задает и компонент, и свой код, действует последний вызов `SetTitle()` или `SetPageProperty()`. Порядок вывода заголовков описан в статье [Заголовки страницы](./../../cms-basics/titles.md), мета-тегов — в статье [Свойства страницы и раздела](./../../cms-basics/properties.md).

## Сбросить вычисленные значения {#clear-values}

Вычисленное значение не пересчитывается само, когда меняются данные, из которых оно собрано. Методы `CIBlockElement::Update()`, `CIBlockElement::SetPropertyValuesEx()` и `CIBlockSection::Update()` сохраненные значения не сбрасывают. Форма элемента в административном разделе и импорт из 1С сбрасывают их отдельным вызовом `clearValues()` после сохранения. В своем коде вызовите `clearValues()` сами.

| Что изменилось | Что вызвать |
|---|---|
| Поля или свойства элемента, которые используются в шаблонах, шаблоны элемента | `(new ElementValues($iblockId, $elementId))->clearValues()` |
| Название или поля раздела, шаблоны раздела | `(new SectionValues($iblockId, $sectionId))->clearValues()`. Метод сбрасывает значения раздела, его подразделов и их элементов |
| Шаблоны инфоблока, название инфоблока | `(new IblockValues($iblockId))->clearValues()`. Метод сбрасывает все значения инфоблока, разделов и элементов |

После сброса значения вычисляются заново при следующем чтении. Сброс на уровне инфоблока не пересчитывает значения сразу, поэтому его можно вызывать для большого инфоблока. Первые чтения после сброса работают медленнее.

Методы `set()` и `clearValues()` не сбрасывают кеш компонентов. Если вы изменили только шаблоны, компоненты продолжат показывать сохраненные в кеше заголовки и мета-теги. Сбросьте тегированный кеш инфоблока методом `\CIBlock::clearIblockTagCache($iblockId)`. Метод сбрасывает тег, только если определена константа `BX_COMP_MANAGED_CACHE`. После `CIBlockElement::Update()` и `CIBlockSection::Update()` этого не требуется — методы сбрасывают тегированный кеш сами.

**Пример.** Переименуйте элемент и сбросьте его SEO-значения.

```php
use Bitrix\Iblock\InheritedProperty;

$elementApi = new \CIBlockElement();

if (!$elementApi->Update($elementId, ['NAME' => 'Итоги 2026 года']))
{
    throw new \RuntimeException($elementApi->getLastError());
}

(new InheritedProperty\ElementValues($iblockId, $elementId))->clearValues();
```

{% note warning "" %}

Классы шаблонов кешируют прочитанные шаблоны и поля элемента в статических переменных до конца PHP-запроса. Если в одном запросе изменить шаблон или элемент и сразу прочитать значения, результат может быть устаревшим, даже если создать новый объект. Публичного метода, который сбрасывает этот кеш, нет. Читайте значения в следующем запросе, например после перезагрузки страницы или на следующем шаге импорта.

{% endnote %}

## Задать имена файлов картинок {#file-names}

Шаблоны `ELEMENT_PREVIEW_PICTURE_FILE_NAME`, `ELEMENT_DETAIL_PICTURE_FILE_NAME` и аналогичные шаблоны раздела задают имя файла картинки. Имя вычисляется в момент загрузки картинки методами `Add()` и `Update()` классов `CIBlockElement` и `CIBlockSection`, расширение файла сохраняется. Картинки, загруженные раньше, не переименовываются.

При `Add()` действуют шаблоны имени файла инфоблока и шаблоны из поля `IPROPERTY_TEMPLATES` того же вызова. Шаблоны имени файла, заданные разделу, применяются только при `Update()`. Если элементы раздела должны получать свои имена файлов сразу, передайте шаблон в `IPROPERTY_TEMPLATES` при добавлении.

В конце шаблона имени файла можно указать модификаторы через `/`.

-  `l` — перевести имя в нижний регистр,

-  `t` — перевести имя в латиницу. Символ после `t` заменяет пробелы и другие знаки, например `t-` заменяет их дефисом. Регистр модификатор не меняет.

Модификаторы можно совмещать. Например, `/lt-` дает имя латиницей в нижнем регистре через дефис.

**Пример.** Задайте шаблоны имен файлов инфоблока.

```php
use Bitrix\Iblock\InheritedProperty;

$iblockTemplates = new InheritedProperty\IblockTemplates($iblockId);
$iblockTemplates->set([
    // Итоги года → itogi-goda.jpg
    'ELEMENT_PREVIEW_PICTURE_FILE_NAME' => '{=this.Name}/lt-',
    // Символьный код ITOGI-2026 → itogi-2026.jpg
    'ELEMENT_DETAIL_PICTURE_FILE_NAME' => '{=this.Code}/l',
]);
(new InheritedProperty\IblockValues($iblockId))->clearValues();
```

Шаблоны `*_FILE_ALT` и `*_FILE_TITLE` файл не меняют. Их значения читают через `getValues()` и выводят в атрибутах `alt` и `title` тега `<img>`.

## Проверить результат {#check-result}

Перед публикацией кода выполните на тестовом инфоблоке:

1. Задайте шаблон инфоблоку и разделу и убедитесь, что `getValues()` элемента в разделе возвращает шаблон раздела, а элемента вне разделов — шаблон инфоблока.

2. Измените существующий шаблон инфоблока без `clearValues()` и откройте страницу элемента. Свойство с измененным шаблоном пропадет из `getValues()`. После `clearValues()` значение вернется с новым шаблоном.

3. Переименуйте элемент через `CIBlockElement::Update()` и проверьте, что после `clearValues()` заголовок страницы содержит новое название.

4. Загрузите картинку элемента и проверьте имя файла в административном разделе.

5. Проверьте исходный код страницы. В тегах `<title>`, `<meta name="description">` и в атрибутах `alt` не должно быть двойного экранирования, например `&amp;quot;`.

Если шаблоны меняли в административном разделе, сбросить значения можно там же. В формах инфоблока и раздела на вкладке SEO есть флажок Очистить кеш вычисленных значений — он выполняет `clearValues()` при сохранении.
