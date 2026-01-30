---
title: Работа с инфоблоками через API
description: 'Работа с инфоблоками через API. Модуль инфоблоков Bitrix: структура данных, ключевые объекты и практические рекомендации.'
---

Информационный блок -- это набор данных в связанных между собой таблицах: элементы, свойства, разделы, права, SEO. Если обновить только одну таблицу, данные потеряют согласованность. В классическом API некоторые функции работают автоматически. В ORM их нужно вызывать вручную. Поэтому для корректной работы используйте классическое API и D7 вместе.

## Границы ORM и классического API

Информационные блоки используют два слоя API:

-  D7 ORM -- для повседневной работы с данными: добавление, чтение, обновление элементов, разделов. ORM типизирован и дает автоподсказки в редакторе.

-  Классическое API -- для инфраструктурных задач: создание типов и инфоблоков, свойств, управление правами, индексация поиска, ресайз изображений, копирование структуры.

ORM не заменяет классическое API. Эти два слоя дополняют друг друга.

### Когда использовать классическое API

| Задача                                   | Метод и инструмент                                              |
|------------------------------------------|-----------------------------------------------------------------|
| Создать тип инфоблоков                   | `CIBlockType::Add()`                                            |
| Создать инфоблок                         | `CIBlock::Add()`                                                |
| Добавить свойство                        | `CIBlockProperty::Add()`                                        |
| Назначить простые права доступа          | `CIBlockElement::SetPermission()`                               |
| Добавить элемент в полнотекстовый поиск  | `CIBlockElement::UpdateSearch($id)`                             |
| Сделать миниатюру изображения            | `CFile::ResizeImage($fileId, [...])`                            |
| Скопировать инфоблок со всеми свойствами | XML-экспорт или `CIBlock::Add()` и `CIBlockProperty::GetList()` |

## Типы инфоблоков

Типы создают один раз, почти никогда не изменяют и используют для однотипных инфоблоков: новости, статьи, вакансии.

### Добавить тип

Обычно типы добавляют через административный раздел: *Контент > Инфоблоки > Типы инфоблоков*.

Если нужно создать тип программно, используйте классическое API. Оно гарантирует корректное добавление типа и его названий на всех языках.

```php
\Bitrix\Main\Loader::includeModule('iblock');

$iblockType = new \CIBlockType;
$result = $iblockType->Add([
    'ID'       => 'mynews',
    'SECTIONS' => 'Y',
    'IN_RSS'   => 'Y',
    'LANG'     => [
        'ru' => [
            'NAME'         => 'Мои новости',
            'SECTION_NAME' => 'Раздел',
            'ELEMENT_NAME' => 'Новость',
        ],
        'en' => [
            'NAME'         => 'My news',
            'SECTION_NAME' => 'Section',
            'ELEMENT_NAME' => 'News item',
        ],
    ],
]);

if (!$result)
{
    throw new \Exception($iblockType->getLastError()->getMessage());
}
```

ORM-метод `TypeTable::add()` работает с таблицей `b_iblock_type`. Он не добавляет названия на языках, потому что они хранятся в отдельной таблице `b_iblock_type_lang`.

## Инфоблок

ORM не поддерживает полное создание инфоблока. Оно добавляет базовую запись в таблицу `b_iblock`, но не привязывает инфоблок к сайту, не назначает права, не включает SEO-наследование и не гарантирует видимость в административном разделе.

### Создать инфоблок

Чтобы инфоблок работал на сайте, используйте классический API. В метод `CIBlock::Add` обязательно передайте параметры:

-  `IBLOCK_TYPE_ID` -- идентификатор типа инфоблоков. Тип должен существовать.

-  `NAME` -- название инфоблока.

-  `LID` -- массив идентификаторов сайтов, к которым привязан инфоблок. Без привязки инфоблок не отобразится на сайте.

-  `API_CODE` -- cимвольный код API необходим для дальнейшей работы с инфоблоком через D7 ORM.

С помощью параметра `GROUP_ID` можно настроить простые права доступа к инфоблоку. В `GROUP_ID` передайте массив из идентификаторов групп и уровней прав доступа.

Идентификаторы групп можно получить с помощью методов класса `\Bitrix\Main\GroupTable` или посмотреть в административном разделе на странице *Настройки > Пользователи > Группы пользователей*. Например, задайте права доступа для групп с идентификаторами `2` и `8`.

![](./api.png){width=700px height=525px}

```php
\Bitrix\Main\Loader::includeModule('iblock');

$iblock = new \CIBlock;

$result = $iblock->Add([
    'IBLOCK_TYPE_ID' => 'mynews',
    'NAME'           => 'Новости моей компании',
    'CODE'           => 'mycompany_news',
    'API_CODE'       => 'News',             // обязательно для объектного ORM
    'ACTIVE'         => 'Y',
    'LID'            => ['s1'],             // привязка к сайту с идентификатором s1
    'GROUP_ID'       => [                   // права доступа
        2  => \CIBlockRights::PUBLIC_READ,  // Все пользователи — чтение
        8  => \CIBlockRights::EDIT_ACCESS,  // Контент-редакторы — запись
    ],
]);

if (!$result)
{
    throw new \Exception($iblock->getLastError()->getMessage());
}

$iblockId = $result;
```

Вызов метода `Add()` добавит в систему инфоблок с идентификатором `$iblockId`.

{% note info "" %}

Чтобы назначить простые права доступа в существующем инфоблоке, используйте метод `CIBlockElement::SetPermission()`.

{% endnote %}

Расширенные права настраиваются отдельно с помощью классов:

-  `CIBlockRights` -- управляет правами на инфоблок,

-  `CIBlockSectionRights` -- для прав на раздел,

-  `CIBlockElementRights` -- для прав на элемент.

## Свойства инфоблока

Чтобы работать со свойствами, используйте методы классического API: `CIBlockProperty::Add`, `CIBlockProperty::Update`, `CIBlockProperty::Delete`. Эти методы работают корректно с обеими версиями инфоблоков.

{% note warning "" %}

Для всех свойств обязательно заполните параметр `CODE`. Без него ORM не увидит свойство и методы `get()`, `set()`, `addTo()` не будут работать.

{% endnote %}

ORM-методы `PropertyTable::add`, `PropertyTable::update`, `PropertyTable::delete` можно использовать только для инфоблоков 1.0.

{% note tip "" %}

Подробную информацию о свойствах и типах читайте в статье [Схема работы и основные объекты](./architecture).

{% endnote %}

### Как добавить свойства базового типа

1. Создайте новый экземпляр класса `CIBlockProperty`.

2. В метод `Аdd()` передайте основные параметры:

   -  `IBLOCK_ID` -- идентификатор инфоблока,

   -  `NAME` -- название свойства,

   -  `CODE` -- символьный код свойства на латинице в верхнем регистре без пробелов,

   -  `PROPERTY_TYPE` -- тип свойства,

   -  `MULTIPLE` -- признак множественности.

#### Свойства типа Строка

Например, добавьте два строковых свойства:

-  Автор -- простая одинарная строка,

-  Теги -- множественное свойство.

```php
// Автор — простая строка
$authorProp = new \CIBlockProperty;

$result = $authorProp->Add([
    'IBLOCK_ID'     => $iblockId,
    'NAME'          => 'Автор',
    'CODE'          => 'AUTHOR',      
    'PROPERTY_TYPE' => 'S',           // строка
    'MULTIPLE'      => 'N',           // одно значение 
]);

if (!$result)
{
    throw new \Exception($authorProp->getLastError()->getMessage());
}

// Теги — множественная строка
$tagsProp = new \CIBlockProperty;

$result = $tagsProp->Add([
    'IBLOCK_ID'     => $iblockId,
    'NAME'          => 'Теги',
    'CODE'          => 'TAGS',
    'PROPERTY_TYPE' => 'S',     
    'MULTIPLE'      => 'Y',      // несколько значений
]);

if (!$result)
{
    throw new \Exception($tagsProp->getLastError()->getMessage());
}
```

#### Свойства типа Файл

Добавьте два свойства типа Файл: Фото и Галерея.

```php
// Фото — один файл
$property = new \CIBlockProperty;
$property->Add([
    'IBLOCK_ID'     => $iblockId,
    'NAME'          => 'Фото',
    'CODE'          => 'PHOTO',
    'PROPERTY_TYPE' => 'F',      // файл
    'MULTIPLE'      => 'N',      // один файл
]);

// Галерея — несколько файлов
$property = new \CIBlockProperty;
$property->Add([
    'IBLOCK_ID'     => $iblockId,
    'NAME'          => 'Галерея',
    'CODE'          => 'GALLERY',
    'PROPERTY_TYPE' => 'F',
    'MULTIPLE'      => 'Y',       // несколько значений
]);
```

#### Свойство типа Список

1. Вызовите метод `CIBlockProperty::Add()` с параметром `'PROPERTY_TYPE' => 'L'`.

2. Добавьте варианты списка через `CIBlockPropertyEnum::Add()`. Обязательно укажите уникальные `XML_ID`, чтобы избежать дублей.

```php
// добавляем свойство
$property = new \CIBlockProperty;
$result = $property->Add([
    'IBLOCK_ID'     => $iblockId,
    'NAME'          => 'Источник',
    'CODE'          => 'SOURCE',
    'PROPERTY_TYPE' => 'L',          // список
    'MULTIPLE'      => 'N',
]);

if (!$result)
{
    throw new \Exception($property->getLastError()->getMessage());
}

$propId = $result;

// добавляем варианты
$enum = new \CIBlockPropertyEnum;

$enum->Add([
    'PROPERTY_ID' => $propId,
    'VALUE'       => 'РИА Новости',
    'SORT'        => 10,
    'XML_ID'      => 'ria',           // уникальный код, только латиница
]);

$enum->Add([
    'PROPERTY_ID' => $propId,
    'VALUE'       => 'ТАСС',
    'SORT'        => 20,
    'XML_ID'      => 'tass',
]);
```

### Как создать свойство пользовательского типа

Чтобы добавить свойство пользовательского типа, в метод `CIBlockProperty::Add()` передайте два параметра для типа.

-  `PROPERTY_TYPE` -- определяет тип поля для свойства. Например, строка или список.

-  `USER_TYPE` --  задает способ редактирования свойства. Настройки можно указать в параметре `USER_TYPE_SETTINGS`.

#### Свойство типа HTML

Добавьте свойство Итог для вывода с абзацами, списками, выделениями.

```php
$property = new \CIBlockProperty;
$result = $property->Add([
    'IBLOCK_ID'         => $iblockId,
    'NAME'              => 'Итог',
    'CODE'              => 'SUMMARY',      
    'PROPERTY_TYPE'     => 'S',           // строка
    'USER_TYPE'         => 'HTML',        // специальное поле для редактирования текста или кода HTML
    'MULTIPLE'          => 'N',
]);

if (!$result)
{
    throw new \Exception($property->getLastError()->getMessage());
}
```

В результате в ORM можно передать HTML напрямую:

```php
$element->set('SUMMARY', '<p><b>Вывод:</b> система обновлена</p>');
```

#### Свойство типа Справочник

Допустим, в системе есть список рубрик, которые хранятся в Highload-блоке.

{% note info "" %}

Highload-блок -- это отдельная таблица, которую система создает в базе данных для хранения пользовательской информации. Например, рубрик, брендов, групп товаров.

Настроить Highload-блок можно в административном разделе на странице *Контент > Highload-блоки*.

{% endnote %}

В элементах можно указать рубрику, если создать свойство Рубрика и подключить его к Highload-блоку.

```php
$property = new \CIBlockProperty;
$result = $property->Add([
    'IBLOCK_ID'         => $iblockId,
    'NAME'              => 'Рубрика',
    'CODE'              => 'CATEGORY',
    'PROPERTY_TYPE'     => 'S',              // в базе — строка, хранит UF_XML_ID
    'USER_TYPE'         => 'directory',      // выпадающий список из Highload-блока
    'MULTIPLE'          => 'N',
    'USER_TYPE_SETTINGS' => [
        'TABLE_NAME' => 'b_news_categories', // название таблицы Highload-блока
    ],
]);

if (!$result)
{
    throw new \Exception($property->getLastError()->getMessage());
}
```

После добавления найдите нужную рубрику и укажите ее `UF_XML_ID`:

```php
// /например, у рубрики Безопасность UF_XML_ID = 'security'
$element->set('CATEGORY', 'security');
```

## Разделы

ORM позволяет работать с разделами как с полноценными объектами: создавать, читать, обновлять, удалять, использовать пользовательские поля `UF_*`.

{% note tip "" %}

О том, как создать пользовательские поля к разделам инфоблока читайте в статье [Пользовательские поля](./../../cms-basics/userfields).

{% endnote %}

### Скомпилировать сущность разделов

Скомпилируйте ORM-класс для разделов инфоблока один раз в начале скрипта.

```php
// News — значение поля «Символьный код API» из настроек инфоблока
$sectionNewsClass = \Bitrix\Iblock\Model\Section::compileEntityByIblock('News'); 
```

В результате получите класс вида `\Bitrix\Iblock\Section{ID}Table`, где `{ID}` -- числовой идентификатор инфоблока. Например, `\Bitrix\Iblock\Section10Table`.

Используйте этот класс для всех операций с разделами.

{% note warning "" %}

Не используйте `\Bitrix\Iblock\SectionTable`. Он работает только с базовыми полями.

{% endnote %}

### Создать раздел

Чтобы создать раздел, вызовите `createObject()` у скомпилированного класса `$sectionNewsClass` и укажите:

-  `setIblockId($iblockId)` -- идентификатор инфоблока,

-  `setName('Название')` -- название раздела,

-  `setCode('symbolic_code')` -- символьный код раздела,

-  `setActive(true/false)` -- признак активности.

```php
$section = $sectionNewsClass::createObject()
    ->setIblockId($iblockId)
    ->setName('Мероприятия')
    ->setCode('events')
    ->setActive(true)
    ->save();

$eventsSectionId = $section->getId();
```

### Получить раздел по символьному коду

Информацию по разделу можно получить, например, по символьному коду. Нужные поля укажите в `setSelect()`.

```php
// получаем раздел Мероприятия
$section = $sectionNewsClass::query()
    ->setSelect(['NAME', 'ACTIVE'])
    ->where('CODE', 'events')
    ->setLimit(1)
    ->fetchObject();
if ($section)
{
    echo "Раздел: " . $section->getName(); // Мероприятия
    echo "Активен: " . ($section->getActive() ? 'да' : 'нет');
}
```

### Создать вложенный раздел

1. Найдите родительский раздел по символьному коду `CODE`.

2. Укажите идентификатор родителя через `setIblockSectionId()`.

```php
// находим раздел Мероприятия
$parentSection = $sectionNewsClass::query()
    ->setSelect(['ID'])
    ->where('CODE', 'events')
    ->setLimit(1)
    ->fetchObject();

if ($parentSection)
{
    // создаем вложенный раздел Выставки
    $exhibitionSection = $sectionNewsClass::createObject()
        ->setIblockId($iblockId)
        ->setName('Выставки')
        ->setCode('exhibitions')
        ->setIblockSectionId($parentSection->getId()) // привязка к родителю
        ->setActive(true)
        ->save();

    $exhibitionSectionId = $exhibitionSection->getId();
}
```

### Выбрать разделы по фильтру

Чтобы выполнить фильтрацию по разделам, используйте `fetchCollection()`.

```php
$sections = $sectionNewsClass::query()
    ->setSelect(['ID', 'NAME', 'CODE'])
    ->where('ACTIVE', 'Y')
    ->setOrder(['NAME' => 'ASC'])
    ->setLimit(10)
    ->fetchCollection();
foreach ($sections as $item)
{
    echo $item->getName() . "\n";
}
```

### Получить родительский раздел

Чтобы получить родительский раздел, подгрузите его через псевдоним `PARENT_SECTION`.

```php
// находим вложенный раздел Выставки и его родителя Мероприятия за один запрос
$exhibitionSection = $sectionNewsClass::query()
    ->setSelect([
        'ID', 'NAME',
        'PARENT_SECTION' => 'IBLOCK_SECTION', // загружаем родителя
    ])
    ->where('CODE', 'exhibitions')
    ->setLimit(1)
    ->fetchObject();

if ($exhibitionSection)
{
    $parent = $exhibitionSection->getIblockSection(); // метод возвращает объект родителя
    if ($parent)
    {
        echo "Родительский раздел: " . $parent->getName(); // Мероприятия
    }
}
```

{% note info "" %}

Без `PARENT_SECTION` в `setSelect()` метод `getIblockSection()` вернет `null`.

{% endnote %}

### Обновить раздел

1. Получите объект раздела с помощью `query()`.

2. Укажите новые данные.

3. Вызовите метод `save()`.

```php
// обновим раздел Выставки
$exhibitionSection = $sectionNewsClass::query()
    ->where('CODE', 'exhibitions')
    ->setLimit(1)
    ->fetchObject();

if ($exhibitionSection)
{
    $exhibitionSection
        ->setName('Выставки 2025-2026') // изменим название раздела
        ->setActive(false);             // и деактивируем его

    $result = $exhibitionSection->save();

    if (!$result->isSuccess())
    {
        foreach ($result->getErrors() as $error)
        {
            echo $error->getMessage() . "\n";
        }
    }
}
```

{% note info "" %}

Статический метод `update()` обновляет только базовые поля: `NAME`, `CODE`, `ACTIVE`. Для `UF_*` и сложной логики используйте объект.

{% endnote %}

### Создать раздел с **пользовательскими** полями

Например, у разделов инфоблока есть пользовательское поле `UF_MANAGER`. Это строка с именем ответственного менеджера.

Укажите значение пользовательского поля при создании раздела через метод `set()`.

```php
$conferenceSection = $sectionNewsClass::createObject()
    ->setIblockId($iblockId)
    ->setName('Конференции')
    ->setCode('conferences')
    ->set('UF_MANAGER', 'Ирина Сидорова') // ← значение UF-поля
    ->setActive(true)
    ->save();
```

### Получить пользовательские поля раздела

Чтобы получить пользовательское поле `UF_MANAGER`, добавьте `'UF_*'` в `setSelect()`.

```php
$conferenceSection = $sectionNewsClass::query()
    ->setSelect(['ID', 'NAME', 'UF_*']) // загружаем все UF-поля
    ->where('CODE', 'conferences')
    ->setLimit(1)
    ->fetchObject();

if ($conferenceSection)
{
    $manager = $conferenceSection->get('UF_MANAGER'); // строка
    echo "Ответственный: " . $manager; // Ирина Сидорова
}
```

### Удалить раздел

Чтобы удалить раздел со всем содержимым, используйте классическое API. Метод `\CIBlockSection::Delete()` работает следующим образом:

-  рекурсивно удаляет все дочерние разделы,

-  удаляет все элементы в разделе и подразделах,

-  обновляет кеши и индексы.

```php
// удаляем раздел Выставки
\CIBlockSection::Delete($exhibitionSectionId); 
```

ORM-метод `$section->delete()` применяйте для специфических сценариев, когда требуется самостоятельная обработка дочерних данных.

-  Метод удаляет только сам раздел.

-  Дочерние разделы и элементы остаются в базе, но теряют привязку к дереву и не отображаются на сайте.

-  Элементы остаются в результатах поиска, потому что ORM не обновляет полнотекстовый поиск.

```php
// удаляем раздел Конференции
$conferenceSection = $sectionNewsClass::query()
    ->where('CODE', 'conferences')
    ->setLimit(1)
    ->fetchObject();

if ($conferenceSection)
{
    $conferenceSection->delete(); // элементы останутся в базе, но исчезнут из дерева
}
```

## Элементы

ORM позволяет работать с элементами как с полноценными объектами: создавать, читать, обновлять, удалять, работать со свойствами любого типа.

### Скомпилировать сущность элементов

Скомпилируйте ORM-класс для элементов инфоблока один раз в начале скрипта.

```php
// News — значение поля «Символьный код API» из настроек инфоблока
$elementClassName = \Bitrix\Iblock\IblockTable::compileEntity('News'); 
```

В результате получите класс вида `\Bitrix\Iblock\Elements\Element{API_CODE}Table`, где `{API_CODE}` -- cимвольный код API инфоблока. Например, `\Bitrix\Iblock\Elements\ElementNewsTable`.

Используйте этот класс для работы с элементами и их свойствами.

{% note warning "" %}

Не используйте `\Bitrix\Iblock\ElemantTable`. Он работает только с базовыми полями.

{% endnote %}

### Добавить элемент в инфоблок

Чтобы добавить элемент без привязки к разделу, вызовите `createObject()` у скомпилированного  класса `$elementNewsClass` и укажите:

-  `setName('Название')` -- заголовок элемента,

-  `setCode('symbolic_code')` -- символьный код элемента,

-  `setActive(true/false)` -- признак активности,

-  `set('CODE', значение)` -- значения свойств.

```php
$element = $elementNewsClass::createObject()
    ->setName('Обновление системы безопасности')
    ->setCode('security-update')
    ->setActive(true)
    ->set('AUTHOR', 'Ирина Петрова');

$result = $element->save();

if (!$result->isSuccess())
{
    foreach ($result->getErrors() as $error)
    {
        echo $error->getMessage() . "\n";
    }
    return;
}

$elementId = $element->getId();
echo "Создана новость c ID={$elementId}";
```

{% note info "" %}

ORM автоматически проверяет обязательные свойства. Если забыть заполнить обязательное свойство, получите ошибку `Не заполнено обязательное свойство {название свойства`}.

{% endnote %}

### Добавить элемент в раздел

Чтобы добавить элемент в раздел, найдите раздел и укажите его идентификатор через `setIblockSectionId()`.

```php
// находим раздел Мероприятия
// $sectionNewsClass — скомпилированный класс разделов
$parentSection = $sectionNewsClass::query()
    ->setSelect(['ID'])
    ->where('CODE', 'events')
    ->setLimit(1)
    ->fetchObject();

if ($parentSection)
{
    $element = $elementNewsClass::createObject()
        ->setName('Конференция по кибербезопасности')
        ->setCode('cybersec-conf-2026')
        ->setActive(true)
        ->setIblockSectionId($parentSection->getId()) // привязка к разделу
        ->set('AUTHOR', 'Иван Сидоров');

    $element->save();
}
```

{% note warning "" %}

Раздел должен существовать. ORM не создает его автоматически.

{% endnote %}

### Установить значения свойств

После создания объекта элемента заполните его свойства. ORM поддерживает все типы.

#### Заполнить обычные свойства: Строка и Список

Для строкового свойства Автор и списка Источник используйте метод `set()`.

-  Код свойства укажите в верхнем регистре.

-  Для списка передайте идентификатор значения `ID`.

```php
$element = $elementNewsClass::createObject()
    ->setName('Новость с автором и источником')
    ->setCode('news-author-source')
    ->set('AUTHOR', 'Светлана Пирогова')  // строка — текст напрямую
    ->set('SOURCE', 1);                   // список — идентификатор значения «РИА Новости»

$element->save();
```

#### Заполнить множественные свойства

Чтобы добавить значение, например, для множественного строкового свойства Теги, используйте `addTo()`. Метод добавляет одно значение за раз.

```php
$element = $elementNewsClass::createObject()
    ->setName('Новость с тегами')
    ->setCode('news-tags')
    ->addTo('TAGS', 'безопасность')
    ->addTo('TAGS', 'обновление')
    ->addTo('TAGS', '2026');

$element->save();
```

{% note info "" %}

Чтобы заменить все значения, сначала вызовите `removeAll('TAGS')`, потом `addTo()`.

{% endnote %}

#### Заполнить свойства типа Файл

ORM не работает с файлами так, как со строками или числами. Если для свойства нужно заполнить описание, нельзя передавать `set('PHOTO', 123)`, где `123` -- идентификатор файла. ORM ожидает не число, а объект, который хранит `ID` файла и описание.

Используйте класс `Bitrix\Iblock\ORM\PropertyValue`. Он создан специально для свойств, у которых есть дополнительные данные.

1. Сохраните файл через классическое API.

   ```php
   $fileId = \CFile::SaveFile(\CFile::MakeFileArray($_SERVER["DOCUMENT_ROOT"].'/images/screen.png'), 'iblock');
   ```

2. Передайте `ID` файла и описание в `PropertyValue`.

   ```php
   new PropertyValue($fileId, 'Главное фото')
   ```

3. Установите значение свойства.

   ```php
   $element->set('PHOTO', new PropertyValue(...));
   ```

ORM не выполняет ресайз изображений. Чтобы создать миниатюру, вызовите `CFile::ResizeImage()` сразу после `SaveFile()`.

```php
\CFile::ResizeImage($fileId, [
    'width'  => 300,
    'height' => 300,
], BX_RESIZE_IMAGE_EXACT, true);
```

Полный пример кода:

```php
use Bitrix\Iblock\ORM\PropertyValue;

$photoId = \CFile::SaveFile(\CFile::MakeFileArray($_SERVER["DOCUMENT_ROOT"].'/images/main_photo.png'), 'iblock');
$otherId  = \CFile::SaveFile(\CFile::MakeFileArray($_SERVER["DOCUMENT_ROOT"].'/images/other_photo.png'), 'iblock');

$element = $elementNewsClass::createObject()
    ->setName('Новость с изображениями')
    ->setCode('news-image')
    ->set('PHOTO', new PropertyValue($photoId, 'Главное фото'))
    ->addTo('GALLERY', new PropertyValue($otherId, 'Дополнительный снимок'));

$element->save();
```

{% note info "" %}

Для множественных файлов вызывайте `addTo()` каждый раз с новым `PropertyValue`.

{% endnote %}

#### Заполнить HTML-свойство

Для свойства типа HTML передавайте строку с тегами напрямую.

```php
$element = $elementNewsClass::createObject()
    ->setName('Новость с итогом')
    ->set('SUMMARY', '<p><b>Вывод:</b> система защищена от уязвимостей CVE-2026-XXXX.</p>');

$element->save();
```

Если текст приходит от пользователя, обработайте его:

```php
$safeHtml = \Bitrix\Main\Text\HtmlFilter::getHtmlEncoder()->encode($userInput);
```

#### Указать значение из Highload-блока

Свойство типа Справочник хранит `UF_XML_ID` записи Highload-блоке, а не `ID`.

Например, в Highload-блоке рубрик новостей есть запись Кибербезопасность. В параметре  XML_ID задано `cybersec`.

Чтобы в элементе инфоблока указать рубрику, передайте `UF_XML_ID = 'cybersec'`.

```php
$element = $elementNewsClass::createObject()
    ->setName('Новость по кибербезопасности')
    ->setCode('news-cybersec')
    ->set('CATEGORY', 'cybersec');

$element->save();
```

### Получить элемент и его свойства

Чтобы прочитать элемент, выполните запрос через `query()`. Укажите `setLimit(1)`, если нужен один элемент.

#### Получить базовые поля

Чтобы получить базовые поля, вызовите методы:

-  `getName()` -- название,

-  `getCode()` -- символьный код,

-  `getActive()` -- активность,

-  `getIblockSectionId()` -- идентификатор раздела.

```php
$element = $elementNewsClass::query()
    ->where('CODE', 'security-update')
    ->setLimit(1)
    ->fetchObject();

if ($element)
{
    echo $element->getName(); // Обновление системы безопасности
}
```

#### Прочитать обычные свойства

Для свойств укажите код в верхнем регистре. Для списка сначала получите объект значения через `getItem()`.

```php
$element = $elementNewsClass::query()
    ->where('CODE', 'news-author-source')
    ->setLimit(1)
    ->fetchObject();

echo $element->get('AUTHOR'); // Светлана Пирогова

$source = $element->get('SOURCE');
if ($source)
{
    echo $source->getItem()->getValue();   // РИА Новости
    echo $source->getItem()->getXmlId();   // ria
}
```

#### Прочитать множественные свойства

Чтобы получить значения множественного свойства Теги, вызовите `getAll()`. Метод вернет коллекцию значений.

```php
$element = $elementNewsClass::query()
    ->where('CODE', 'news-tags')
    ->setLimit(1)
    ->fetchObject();

foreach ($element->get('TAGS')->getAll() as $tag)
{
    echo $tag->getValue() . "\n";
}
```

#### Прочитать файлы

1. Вызовите метод `get()`, чтобы получить объект `PropertyValue`.

2. Используйте `getValue()` и `getDescription()`, чтобы получить `ID` файла и описание.

```php
$element = $elementNewsClass::query()
    ->where('CODE', 'news-image')
    ->setLimit(1)
    ->fetchObject();

$photo = $element->get('PHOTO');
if ($photo)
{
    $fileId = $photo->getValue();      // идентификатор сохраненного файла
    $desc  = $photo->getDescription(); // описание
    $path  = \CFile::GetPath($fileId);
}
```

Для множественного файлового свойства получите коллекцию `PropertyValueCollection`:

```php
// элемент со свойством GALLERY
$element = $dataClass::query()
    ->setSelect(['ID', 'NAME', 'GALLERY'])
    ->where('CODE', 'news-image')
    ->setLimit(1)
    ->fetchObject();

if ($element)
{
    $gallery = $element->get('GALLERY');
    
    if ($gallery)
    {
        // коллекция PropertyValueCollection
        foreach ($gallery->getAll() as $other)
        {
            $fileId = $other->getValue();
            $description = $other->getDescription();
            
            $fileArray = \CFile::GetFileArray($fileId);
            echo $fileArray['SRC'] . ' — ' . $description . "\n";
        }
    }
}
```

### Получить элементы по фильтру

Для построения запроса используйте методы `setSelect()`, `where()`, `setOrder()`, `setLimit()`. Метод `fetchCollection()` возвращает коллекцию, которую можно перебрать через `foreach`.

Для фильтрации по списку Источник укажите `SOURCE.VALUE`, а не `SOURCE`.

```php
// выборка с фильтрацией
$elements = $elementNewsClass::query()
    ->setSelect(['ID', 'NAME', 'SOURCE'])
    ->where('ACTIVE', 'Y')
    ->where('SOURCE.VALUE', 1) // фильтр по идентификатору источника
    ->setOrder(['DATE_ACTIVE_FROM' => 'DESC'])
    ->setLimit(10)
    ->fetchCollection();

foreach ($elements as $element)
{
    echo $element->getName() . ': ' . $element->get('SOURCE')->getValue() . "\n";
}
```

### Обновить элемент

1. Получите объект элемента с помощью `query()`.

2. Укажите новые данные.

3. Вызовите метод `save()`.

```php
$element = $elementNewsClass::query()
    ->where('CODE', 'security-update')
    ->fetchObject();

if ($element)
{
    $element
        ->setName('Критическое обновление')
        ->removeAll('TAGS')
        ->addTo('TAGS', 'критическое');

    $element->save();
}
```

{% note info "" %}

Статический метод `update($id, [...])` обновляет только базовые поля и не работает со свойствами. Для работы со свойствами используйте объект.

{% endnote %}

### Удалить элемент

Например, удалите элемент Обновление системы безопасности.

1. В методе `delete()` укажите символьный код элемента. Метод удаляет значения свойств и очищает тегированный кеш.

2. Вызовите `CIBlockElement::UpdateSearch()`, чтобы элемент пропал из результатов поиска.

```php
$element = $elementNewsClass::query()
    ->where('CODE', 'security-update') // символьный код элемента Обновление системы безопасности 
    ->fetchObject();

if ($element)
{
    $element->delete();
    \CIBlockElement::UpdateSearch($element->getId());
}
```

{% note info "" %}

Без `UpdateSearch()` элемент останется в результатах полнотекстового поиска.

{% endnote %}

## Вычисляемые свойства SEO

Свойства SEO -- этот заголовок, ключевые слова, описание. Они не хранятся как обычные свойства. Их значения вычисляются динамически по шаблонам:

`{=this.NAME} — Новости` -> `Обновление безопасности — Новости`.

Шаблоны наследуются по цепочке `инфоблок → раздел → элемент`.

-  Если у элемента нет своего шаблона, он использует шаблон раздела.

-  Если у раздела нет шаблона, он берет шаблон инфоблока.

-  Шаблон можно переопределить  на любом уровне.

ORM не работает с полями SEO напрямую. Для управления шаблонами и чтения вычисленных значений используйте классы из пространства `Bitrix\Iblock\InheritedProperty`.

{% note info "" %}

Вычисление происходит один раз и кешируется. Чтобы изменения вступили в силу, вызывайте `clearValues()`.

{% endnote %}

### Задать шаблон для инфоблока

Установите базовые шаблоны для всего инфоблока. Все разделы и элементы будут использовать их, если не заданы собственные.

```php
use Bitrix\Iblock\InheritedProperty;

$templates = new InheritedProperty\IblockTemplates($iblockId);
$templates->set([
    'ELEMENT_META_TITLE' => '{=this.NAME} — #SITE_NAME#',
    'SECTION_META_TITLE' => '{=this.NAME} — Новости',
]);
```

### Переопределить шаблон для раздела

Например, для раздела Мероприятия задайте отдельный формат:

```php
$templates = new InheritedProperty\SectionTemplates($iblockId, $eventsSectionId);
$templates->set([
    'ELEMENT_META_TITLE' => 'Мероприятие: {=this.NAME}',
]);
```

Теперь в этом разделе все элементы будут использовать новый шаблон.

### Задать индивидуальный шаблон для элемента

Для особо важных новостей можно задать уникальный заголовок:

```php
$templates = new InheritedProperty\ElementTemplates($iblockId, $elementId);
$templates->set([
    'ELEMENT_META_TITLE' => '❗ Важно: {=this.NAME}',
]);
```

Этот шаблон имеет наивысший приоритет и заменит шаблоны инфоблока и раздела.

{% note info "" %}

Чтобы удалить собственный шаблон и вернуться к наследованию, передайте пустую строку:

```php
$templates->set(['ELEMENT_META_TITLE' => '']);
```

{% endnote %}

### Прочитать вычисленное значение

Чтобы получить итоговое SEO-поле с учетом наследования, создайте объект `ElementValues` и вызовите `getValues()`:

```php
$values = new InheritedProperty\ElementValues($iblockId, $elementId);
$seo = $values->getValues();

echo $seo['ELEMENT_META_TITLE']; 
// Мероприятие: Конференция по кибербезопасности — из шаблона раздела
```

Метод автоматически соберет цепочку `элемент → раздел → инфоблок` и возьмет первый непустой шаблон.

### Сбросить кеш после изменения

Если вы изменили шаблон на любом уровне, сбросьте кеш. Без этого действия старое значение останется в кеше.

```php
// после изменения шаблона инфоблока
$iblockValues = new InheritedProperty\IblockValues($iblockId);
$iblockValues->clearValues();

// после изменения шаблона раздела
$sectionValues = new InheritedProperty\SectionValues($iblockId, $sectionId);
$sectionValues->clearValues();

// после изменения шаблона элемента
$elementValues = new InheritedProperty\ElementValues($iblockId, $elementId);
$elementValues->clearValues();
```

{% note info "" %}

Без `clearValues()` элементы продолжат использовать закешированные значения, даже после перезагрузки страницы.

{% endnote %}

### Передать шаблоны при создании элемента

Чтобы задать SEO-шаблоны сразу при добавлении элемента, используйте `'IPROPERTY_TEMPLATES'` в `CIBlockElement::Add()`:

```php
$element = new \CIBlockElement;
$result = $element->Add([
    'IBLOCK_ID' => $iblockId,
    'NAME'      => 'Конференция',
    'ACTIVE'    => 'Y',
    'IPROPERTY_TEMPLATES' => [
        'ELEMENT_META_TITLE' => 'Конференция: {=this.NAME}',
    ],
]);
```

{% note warning "" %}

ORM-метод `$element->save()` не поддерживает `IPROPERTY_TEMPLATES`. Используйте классическое API.

{% endnote %}

## Примеры для компонентов

Подготовьте данные для шаблона компонента, например, списка новостей или страницы элемента.

Все примеры ниже используют уже созданные сущности: инфоблок с символьным кодом API `News`, свойства `AUTHOR`, `SOURCE`, `TAGS`, `PHOTO`, раздел `Мероприятия`.

Выполните компиляцию перед запросом:

```php
\Bitrix\Iblock\IblockTable::compileEntity('News');
$elementNewsClass = \Bitrix\Iblock\Elements\ElementNewsTable::class;
```

### Вывести список активных новостей

Получите 10 последних активных новостей с автором и разделом.

Используйте этот код в `result_modifier.php` компонента `bitrix:news.list`.

```php
$news = $elementNewsClass::query()
    ->setSelect([
        'ID',
        'NAME',
        'AUTHOR',               // строка — напрямую
        'SOURCE.VALUE',         // список — VALUE, а не SOURCE
        'DATE_ACTIVE_FROM',
        'SECTION_' => 'IBLOCK_SECTION', // подгружаем раздел за один запрос
    ])
    ->where('ACTIVE', 'Y')
    ->setOrder(['DATE_ACTIVE_FROM' => 'DESC'])
    ->setLimit(10)
    ->fetchCollection();

foreach ($news as $item)
{
    $arResult['NEWS'][] = [
        'ID'     => $item->getId(),
        'NAME'   => $item->getName(),
        'AUTHOR' => $item->get('AUTHOR') ?: '—',
        'SOURCE' => $item->get('SOURCE')?->getItem()?->getValue() ?: '—',
        'DATE'   => $item->getDateActiveFrom()?->format('d.m.Y'),
        'SECTION' => $item->getIblockSection()?->getName() ?: 'Без раздела',
    ];
}
```

### Вывести новость с разделом, фото и итогом

Подготовьте данные для страницы элемента `bitrix:news.detail`.

Загрузите элемент, его раздел, фото и HTML-свойство `SUMMARY`.

```php
$element = $elementNewsClass::query()
    ->setSelect([
        'ID', 'NAME', 'AUTHOR',
        'PHOTO.VALUE', 'PHOTO.DESCRIPTION', 
        'SUMMARY',                                // HTML-свойство
        'SECTION_' => 'IBLOCK_SECTION',     
    ])
    ->where('CODE', $arParams['ELEMENT_CODE'] ?? '')
    ->setLimit(1)
    ->fetchObject();

if ($element)
{
    $arResult['ITEM'] = [
        'ID'     => $element->getId(),
        'NAME'   => $element->getName(),
        'AUTHOR' => $element->get('AUTHOR'),
        'SUMMARY_HTML' => $element->get('SUMMARY'), // передаем в шаблон
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

В шаблоне `template.php` обрабатывайте HTML через `<?= $arResult['ITEM']['SUMMARY_HTML'] ?>`. Если данные ненадежны, предварительно фильтруйте через `HtmlFilter`.

### Сформировать анонс из подробного текста

Если в элементе есть `DETAIL_TEXT`, обрежьте его до 300 символов без тегов. Используйте в компоненте `bitrix:news.list`, когда нужно краткое описание.

```php
$elements = $elementNewsClass::query()
    ->setSelect(['ID', 'NAME', 'DETAIL_TEXT'])
    ->where('ACTIVE', 'Y')
    ->setLimit(5)
    ->fetchCollection();

foreach ($elements as $item)
{
    $text = $item->getDetailText();
    if ($text)
    {
        $preview = strip_tags($text);
        $preview = mb_substr($preview, 0, 300);
        if (mb_strlen($text) > mb_strlen($preview))
        {
            $preview .= '…';
        }
    } else {
        $preview = '';
    }

    $arResult['NEWS'][] = [
        'NAME' => $item->getName(),
        'PREVIEW_TEXT' => $preview,
    ];
}
```

### Показать другие новости источника

На странице новости покажите еще пять новостей от того же источника.

```php
$current = $elementNewsClass::query()
    ->setSelect(['ID', 'SOURCE'])
    ->where('CODE', $arParams['ELEMENT_CODE'])
    ->fetchObject();

if (!$current) return;

$sourceId = $current->get('SOURCE')?->getValue();
if (!$sourceId) return;

$similar = $elementNewsClass::query()
    ->setSelect(['ID', 'NAME', 'CODE'])
    ->where('ACTIVE', 'Y')
    ->where('SOURCE.VALUE', $sourceId)               // фильтр по идентификатору источника
    ->whereNot('ID', $current->getId())
    ->setLimit(5)
    ->fetchCollection();

$arResult['MORE_FROM_SOURCE'] = [];
foreach ($similar as $item)
{
    $arResult['MORE_FROM_SOURCE'][] = [
        'NAME' => $item->getName(),
        'URL'  => '/news/' . $item->getCode() . '/', // единый URL-паттерн
    ];
}
```