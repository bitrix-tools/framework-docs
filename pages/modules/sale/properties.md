---
title: Свойства заказа
description: "Как настроить, прочитать и заполнить свойства заказа через API модуля sale и чем свойства заказа отличаются от товарных свойств catalog и iblock."
---

Свойства заказа хранят данные, которые относятся ко всему заказу: имя покупателя, телефон, email, адрес доставки, ИНН и другие поля оформления. Набор полей зависит от типа плательщика.

Разработчик может создавать и настраивать поля оформления, записывать значения в заказ и использовать их в отчетах.

## Как устроено свойство заказа

У свойства заказа есть настройка и значение. Настройка описывает поле, а значение содержит данные конкретного заказа.

#|
|| **Уровень** | **API** | **Что хранит** ||
|| Настройка | `Bitrix\Sale\Property`, `Bitrix\Sale\Internals\OrderPropsTable` | Название, код, тип, группу, обязательность, тип плательщика и служебные флаги ||
|| Значение | `Bitrix\Sale\PropertyValue` | Значение одного свойства в объекте заказа ||
|| Коллекция значений | `Bitrix\Sale\PropertyValueCollection` | Значения свойств заказа для выбранного типа плательщика ||
|| Сохраненное значение | `Bitrix\Sale\Internals\OrderPropsValueTable` | Значение свойства конкретного сохраненного заказа ||
|#

### Проследить путь свойства от настройки до заказа

Свойство проходит четыре этапа.

1. Администратор или скрипт создает свойство для типа плательщика.

2. Форма оформления получает набор активных свойств.

3. Код передает введенные данные в элементы `PropertyValueCollection`.

4. `Order::save()` сохраняет заказ и значения его свойств.

Не записывайте новое значение заказа напрямую через `OrderPropsValueTable`. Такая запись обходит объект заказа, его проверки и связанные расчеты.

### Выбрать API для задачи

Выбор API зависит от того, работает код с настройкой свойства или со значением конкретного заказа.

#|
|| **Задача** | **API** ||
|| Создать настройку свойства через API | `OrderPropsGroupTable`, `OrderPropsTable` ||
|| Прочитать или изменить значение в заказе | `Order`, `PropertyValueCollection`, `PropertyValue` ||
|| Принять значения и файлы из формы | `PropertyValueCollection::setValuesFromPost()` ||
|| Получить служебный отчет без загрузки заказов | `OrderPropsTable`, `OrderPropsValueTable` ||
|| Добавить собственный тип свойства | `Input\Base`, `Input\Manager`, событие `registerInputTypes` ||
|#

Если задача относится к конкретному заказу, начинайте с `Order::load()` или `Order::create()`. ORM-таблицы используйте для создания и чтения настроек, а также для отчетов.

## Настроить свойства заказа

Настройка определяет доступность, формат и роль свойства. Сначала свяжите свойство с типом плательщика, затем задайте группу, тип значения и дополнительные параметры.

### Связать свойства с типом плательщика

Тип плательщика определяет, какие свойства доступны в заказе. Сначала вызовите `Order::setPersonTypeId()`, затем получите коллекцию через `Order::getPropertyCollection()`.

Свойство связано с сайтом косвенно. Сайт связан с типом плательщика, а `PERSON_TYPE_ID` связывает свойство с этим типом. Поэтому у физического и юридического лица на одном сайте могут быть разные наборы полей.

Если тип плательщика еще не настроен, выполните шаги из раздела [Создать тип плательщика](./sale-settings.md#person-type). Проверьте тип по коду, создайте его через `PersonTypeTable`, привяжите к сайту через `PersonTypeSiteTable` и проверьте результат.

Для примеров используйте готовый `$personTypeId`. Если вызвать только `PersonTypeTable::add()`, система создаст неполную настройку и не гарантирует, что тип будет доступен для сайта.

### Выбрать формат значения

Поле `TYPE` определяет формат ввода, проверку и представление значения.

#|
|| **Тип** | **Назначение** ||
|| `STRING` | Строка, например имя, email, телефон или комментарий ||
|| `NUMBER` | Числовое значение ||
|| `Y/N` | Логическое значение ||
|| `ENUM` | Один или несколько вариантов из заданного списка ||
|| `FILE` | Файл ||
|| `DATE` | Дата ||
|| `LOCATION` | Местоположение для доставки или налогов ||
|| `ADDRESS` | Структурированный адрес ||
|| `UF` | Значение пользовательского поля ||
|#

Для типа `ENUM` варианты хранятся в `OrderPropsVariantTable`. Флаг `MULTIPLE = Y` разрешает несколько значений. Модуль сериализует массивы при сохранении и восстанавливает их при чтении.

Не приводите все значения к строке перед `setValue()`. Сначала прочитайте `TYPE` и `MULTIPLE` из настройки.

#|
|| **Настройка** | **Что передавать** ||
|| `STRING`, `NUMBER`, `DATE` | Одно значение в формате соответствующего типа ||
|| `Y/N` | Строку `Y` или `N` ||
|| `LOCATION` | Внутренний код местоположения, а не его название ||
|| `ENUM` | Значение варианта в формате, который возвращает обработчик типа ||
|| `MULTIPLE = Y` | Массив значений, которые поддерживает базовый тип ||
|| `FILE`, `ADDRESS`, `UF` | Структуру, которую ожидает соответствующий обработчик типа ||
|#

Для множественного, сложного или пользовательского типа не формируйте значение по предположению. Получите его из обработчика формы либо соблюдайте контракт класса типа, затем вызовите `PropertyValue::verify()`.

Служебные флаги уточняют роль свойства. Например, `IS_EMAIL`, `IS_PHONE`, `IS_PAYER`, `IS_LOCATION`, `IS_LOCATION4TAX`, `IS_ZIP` и `IS_ADDRESS` позволяют модулю найти поле по назначению, а не только по коду.

{% note info "" %}

Коды `EMAIL`, `PHONE`, `LOCATION` и `ADDRESS` — соглашение проекта, а не обязательные системные значения. Если код заранее неизвестен, ищите настройку по служебному флагу.

{% endnote %}

### Сгруппировать свойства для формы

Группы свойств объединяют поля в интерфейсе. Например, контактные данные можно отделить от адреса доставки. Группа хранится в `OrderPropsGroupTable`, а свойство ссылается на нее через `PROPS_GROUP_ID`.

Если коллекция уже создана, метод `getGroups()` возвращает ее группы, а `getPropertiesByGroupId($groupId)` — значения свойств выбранной группы. Этих методов достаточно, чтобы сгруппировать поля в собственной форме без отдельной ORM-выборки.

Поле `PROPS_GROUP_ID` связывает настройку свойства с группой. В значении заказа отдельное поле группы не хранится. Коллекция получает группу через настройку свойства.

### Получить настройки свойств типа плательщика

Чтобы настроить форму или выполнить служебную выборку, получите активные настройки свойств выбранного типа плательщика через `OrderPropsTable`.

```php
use Bitrix\Main\Loader;
use Bitrix\Sale\Internals\OrderPropsTable;

if (!Loader::includeModule('sale'))
{
    throw new \RuntimeException('Модуль sale не установлен');
}

// Идентификатор типа плательщика
$personTypeId = 1;

$properties = OrderPropsTable::getList([
    'select' => [
        'ID',
        'NAME',
        'CODE',
        'TYPE',
        'REQUIRED',
        'MULTIPLE',
        'PROPS_GROUP_ID',
        'SORT',
    ],
    'filter' => [
        '=PERSON_TYPE_ID' => $personTypeId,
        '=ACTIVE' => 'Y',
        '=ENTITY_TYPE' => 'ORDER',
    ],
    'order' => [
        'PROPS_GROUP_ID' => 'ASC',
        'SORT' => 'ASC',
        'ID' => 'ASC',
    ],
])->fetchAll();
```

В результате `$properties` содержит активные настройки свойств выбранного типа плательщика.

### Создать группу и настройку свойства     {#create-property-api}

Найдите группу и настройку свойства по кодам. Если записей нет, создайте их методами `OrderPropsGroupTable::add()` и `OrderPropsTable::add()`.

Метод `OrderPropsTable::add()` создает настройку свойства. Передайте основные поля:

-  `PERSON_TYPE_ID` — идентификатор типа плательщика,

-  `PROPS_GROUP_ID` — идентификатор группы,

-  `NAME` — название свойства,

-  `CODE` — символьный код свойства,

-  `TYPE` — тип значения,

-  `ENTITY_TYPE` — тип объекта, для свойства заказа передайте `ORDER`.

Поля `ACTIVE`, `REQUIRED`, `MULTIPLE` и служебные флаги принимают строки `Y` или `N`, а `SORT` — целое число. Значение `DEFAULT_VALUE` должно соответствовать типу свойства, а `SETTINGS` — контракту обработчика.

Настройка принадлежит одному типу плательщика. Если одинаковое поле нужно физическому и юридическому лицу, создайте отдельную настройку для каждого типа и задайте обеим настройкам одинаковый символьный код.

Чтобы не создать дубли, найдите группу `CONTACTS` и строковое свойство `LOYALTY_NUMBER` по кодам. Добавьте только отсутствующие записи.

Подготовьте идентификатор типа плательщика и коды группы и свойства:

-  `$personTypeId` — идентификатор типа плательщика,

-  `$groupCode` — символьный код группы,

-  `$propertyCode` — символьный код свойства.

```php
use Bitrix\Main\Loader;
use Bitrix\Sale\Internals\OrderPropsGroupTable;
use Bitrix\Sale\Internals\OrderPropsTable;
use Bitrix\Sale\Registry;

if (!Loader::includeModule('sale'))
{
    throw new \RuntimeException('Модуль sale не установлен');
}

$personTypeId = 1;
$groupCode = 'CONTACTS';
$propertyCode = 'LOYALTY_NUMBER';

$group = OrderPropsGroupTable::getList([
    'select' => ['ID'],
    'filter' => [
        '=PERSON_TYPE_ID' => $personTypeId,
        '=CODE' => $groupCode,
    ],
    'limit' => 1,
])->fetch();

if ($group)
{
    $propertyGroupId = (int)$group['ID'];
}
else
{
    $groupResult = OrderPropsGroupTable::add([
        'PERSON_TYPE_ID' => $personTypeId,
        'NAME' => 'Контактные данные',
        'CODE' => $groupCode,
        'SORT' => 100,
    ]);

    if (!$groupResult->isSuccess())
    {
        throw new \RuntimeException(
            implode('; ', $groupResult->getErrorMessages())
        );
    }

    $propertyGroupId = (int)$groupResult->getId();
}

$property = OrderPropsTable::getList([
    'select' => ['ID'],
    'filter' => [
        '=PERSON_TYPE_ID' => $personTypeId,
        '=CODE' => $propertyCode,
        '=ENTITY_TYPE' => Registry::ENTITY_ORDER,
    ],
    'limit' => 1,
])->fetch();

if ($property)
{
    $propertyId = (int)$property['ID'];
}
else
{
    $propertyResult = OrderPropsTable::add([
        'PERSON_TYPE_ID' => $personTypeId,
        'PROPS_GROUP_ID' => $propertyGroupId,
        'NAME' => 'Номер карты лояльности',
        'CODE' => $propertyCode,
        'TYPE' => 'STRING',
        'REQUIRED' => 'N',
        'MULTIPLE' => 'N',
        'ACTIVE' => 'Y',
        'SORT' => 500,
        'ENTITY_REGISTRY_TYPE' => Registry::REGISTRY_TYPE_ORDER,
        'ENTITY_TYPE' => Registry::ENTITY_ORDER,
    ]);

    if (!$propertyResult->isSuccess())
    {
        throw new \RuntimeException(
            implode('; ', $propertyResult->getErrorMessages())
        );
    }

    $propertyId = (int)$propertyResult->getId();
}
```

После выполнения кода `$propertyGroupId` содержит идентификатор группы, а `$propertyId` — идентификатор настройки свойства. Значение `PROPS_GROUP_ID` помещает свойство в эту группу.

Перед запуском убедитесь, что `$personTypeId` принадлежит нужному сайту.

В коде оформления заказа не вызывайте `OrderPropsTable::add()`. Получайте готовое свойство из `PropertyValueCollection`.

### Проверить настройку свойства

После создания повторно найдите настройку через `OrderPropsTable::getRow()` по идентификатору типа плательщика и коду свойства. Проверьте `TYPE`, `PROPS_GROUP_ID`, `REQUIRED`, `MULTIPLE` и `ACTIVE`, прежде чем использовать настройку в другом сценарии.

Класс `Bitrix\Sale\Property` также позволяет читать настройки. `OrderPropsTable` относится к пространству имен `Internals`, поэтому после обновления модуля проверяйте сценарии, которые используют эту таблицу.

Не переносите идентификаторы настроек между проектами. У каждого проекта собственные типы плательщиков, группы и свойства.

### Настроить варианты свойства типа ENUM

У свойства типа `ENUM` есть две разные части:

-  строка в `OrderPropsVariantTable` описывает вариант списка,

-  значение в `PropertyValueCollection` хранит поле `VALUE` выбранного варианта.

Чтобы изменить или удалить вариант настройки, используйте идентификатор его строки. В значение заказа передавайте не `ID`, а стабильный код из поля `VALUE`. Внутри одного свойства значения должны быть уникальными. Обработчик строит массив в формате `VALUE => NAME`.

Чтобы создать варианты свойства через API, используйте `OrderPropsVariantTable`. Код предполагает, что свойство `ENUM` уже создано.

Перед созданием вариантов подготовьте:

-  `$enumPropertyId` — идентификатор настройки свойства `ENUM`,

-  `$variantDefinitions` — коды, названия и порядок сортировки вариантов.

```php
use Bitrix\Main\Loader;
use Bitrix\Sale\Internals\OrderPropsVariantTable;

if (!Loader::includeModule('sale'))
{
    throw new \RuntimeException('Модуль sale не установлен');
}

$enumPropertyId = 321;
$variantDefinitions = [
    'COURIER' => [
        'NAME' => 'Курьер',
        'SORT' => 100,
    ],
    'PICKUP' => [
        'NAME' => 'Самовывоз',
        'SORT' => 200,
    ],
];

foreach ($variantDefinitions as $value => $definition)
{
    $variant = OrderPropsVariantTable::getList([
        'select' => ['ID'],
        'filter' => [
            '=ORDER_PROPS_ID' => $enumPropertyId,
            '=VALUE' => $value,
        ],
        'limit' => 1,
    ])->fetch();

    if ($variant)
    {
        continue;
    }

    $addResult = OrderPropsVariantTable::add([
        'ORDER_PROPS_ID' => $enumPropertyId,
        'NAME' => $definition['NAME'],
        'VALUE' => $value,
        'SORT' => $definition['SORT'],
    ]);

    if (!$addResult->isSuccess())
    {
        throw new \RuntimeException(
            implode('; ', $addResult->getErrorMessages())
        );
    }
}
```

Таблица `OrderPropsVariantTable` относится к внутреннему API. После обновления модуля проверяйте код, который создает варианты, на поддерживаемых версиях. Не настраивайте варианты при каждом оформлении заказа.

### Настроить связи свойства с доставкой и оплатой

Таблица `OrderPropsRelationTable` связывает свойство с платежной системой или службой доставки. Тип связи хранится в `ENTITY_TYPE`:

-  `P` — платежная система,

-  `D` — служба доставки,

-  `L` — лендинг,

-  `T` — торговая платформа.

Поле `ENTITY_ID` содержит идентификатор настройки платежной системы или службы доставки, а не идентификатор объекта `Payment` или `Shipment` конкретного заказа.

Связи ограничивают показ свойства в форме. Свойство без связей модуль показывает всегда. Если связей несколько, стандартная настройка показывает свойство, когда выбран хотя бы один из указанных критериев оплаты или доставки.

Флаг `IS_LOCATION` отмечает свойство местоположения. Модуль не применяет к нему связи и использует его при расчете доставки.

Чтобы прочитать настройки с учетом связей, используйте `Bitrix\Sale\Property::getList()`. Доступность самой платежной системы или службы доставки проверяйте через их API. Связь свойства не заменяет ограничения текущего заказа.

{% note info "" %}

Таблица `OrderPropsRelationTable` относится к внутреннему API. После обновления модуля проверяйте код, который использует эту таблицу.

{% endnote %}

### Удалить настройку свойства

Если поле больше не нужно при оформлении, сначала деактивируйте настройку. Прежде чем удалить ее физически, проверьте:

-  сохраненные заказы,

-  профили покупателей,

-  отчеты,

-  интеграции.

Они могут использовать идентификатор или код настройки. Для удаления используйте две отдельные операции: `OrderPropsTable::delete()` удаляет настройку, а `PropertyValue::delete()` — значение свойства конкретного заказа. Событие `OnSalePropertyValueDeleted` вызывается только при удалении значения из заказа и не относится к настройке.

## Заполнить свойства нового заказа

Назначьте новому заказу тип плательщика до получения коллекции свойств. Заполните значения, проверьте обязательные поля и сохраните весь заказ.

### Заполнить основные свойства

Создайте заказ, назначьте тип плательщика и только после этого получите `PropertyValueCollection`. Элемент коллекции ищите методом `getItemByOrderPropertyCode()`.

Для нового заказа передайте:

-  `$siteId` — идентификатор сайта,

-  `$userId` — идентификатор пользователя,

-  `$personTypeId` — идентификатор типа плательщика,

-  значения `EMAIL`, `PHONE` и `LOCATION` — данные нового заказа.

```php
use Bitrix\Sale\Order;

$siteId = 's1';
$userId = 25;
$personTypeId = 1;

$order = Order::create($siteId, $userId);

$personTypeResult = $order->setPersonTypeId($personTypeId);
if (!$personTypeResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $personTypeResult->getErrorMessages())
    );
}

$propertyCollection = $order->getPropertyCollection();

$propertyValues = [
    'FIO' => 'Анна Иванова',
    'EMAIL' => 'anna@example.com',
    'PHONE' => '+7 900 000-00-00',
    'ADDRESS' => 'Калининград, ул. Примерная, д. 1',
];

foreach ($propertyValues as $code => $value)
{
    $propertyValue =
        $propertyCollection->getItemByOrderPropertyCode($code);

    if (!$propertyValue)
    {
        throw new \RuntimeException(
            sprintf('Не найдено свойство заказа с кодом %s', $code)
        );
    }

    $setValueResult = $propertyValue->setValue($value);
    if (!$setValueResult->isSuccess())
    {
        throw new \RuntimeException(
            implode('; ', $setValueResult->getErrorMessages())
        );
    }
}
```

Метод `getItemByOrderPropertyCode()` возвращает первый элемент, который найдет коллекция. Коды должны быть уникальны внутри типа плательщика. Если это правило нельзя гарантировать, найдите настройку через `OrderPropsTable`, получите ее идентификатор и вызовите `getItemByOrderPropertyId()`.

### Проверить обязательные свойства

Перед сохранением нового заказа проверьте коллекцию `$propertyCollection`, которую получили после вызова `Order::setPersonTypeId()`.

Флаг `REQUIRED = Y` отмечает обязательное свойство. Проверьте все обязательные элементы коллекции, а не только переданные коды:

```php
// Коллекция свойств нового заказа получена после setPersonTypeId()
$propertyErrors = [];

foreach ($propertyCollection as $propertyValue)
{
    if (!$propertyValue->isRequired())
    {
        continue;
    }

    $propertyResult = $propertyValue->checkRequiredValue(
        $propertyValue->getPropertyId(),
        $propertyValue->getValue()
    );

    if (!$propertyResult->isSuccess())
    {
        $propertyErrors = array_merge(
            $propertyErrors,
            $propertyResult->getErrorMessages()
        );
    }
}

if ($propertyErrors !== [])
{
    throw new \RuntimeException(
        'Не заполнены обязательные свойства: '
        . implode('; ', $propertyErrors)
    );
}
```

Стандартный компонент оформления заказа вызывает `verify()` и `checkRequiredValue()` для несистемных значений при подтверждении заказа. В собственном серверном сценарии выполняйте нужные проверки явно.

### Сохранить новый заказ

После проверки свойств сохраните новый заказ `$order`, для которого уже задан тип плательщика.

Проверить свойства недостаточно. Обработайте результат, который вернет `Order::save()`.

```php
// Новый заказ с заполненными и проверенными свойствами
$saveResult = $order->save();

if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $saveResult->getErrorMessages())
    );
}

$orderId = (int)$saveResult->getId();
```

Сохраняйте коллекцию через `Order::save()`. Не вызывайте `PropertyValue::save()` или `PropertyValueCollection::save()` отдельно.

## Заполнить свойства разных типов

Формат значения зависит от `TYPE` и `MULTIPLE`. Фрагменты ниже показывают только различия между типами. Получите элемент из `PropertyValueCollection`, вызовите `setValue()`, проверьте результат и сохраните весь заказ через `Order::save()`.

### Заполнить свойство местоположения

Свойству `LOCATION` передавайте внутренний код местоположения, а не его название. Найдите значение по служебной роли через `$propertyCollection->getDeliveryLocation()` и передайте код в `setValue()`.

### Заполнить свойство типа ENUM

Объект настройки возвращает варианты через `getOptions()` в формате `VALUE => NAME`. Проверьте выбранный код и передайте его в `setValue()`.

Передайте объект значения типа `ENUM` и код выбранного варианта:

-  `$propertyValue` — значение свойства типа `ENUM`,

-  `$selectedValue` — значение поля `VALUE` выбранного варианта.

```php
$selectedValue = 'PICKUP';

$propertyObject = $propertyValue->getPropertyObject();
$options = $propertyObject?->getOptions();

if (
    !is_array($options)
    || !array_key_exists($selectedValue, $options)
)
{
    throw new \RuntimeException(
        'Выбранное значение отсутствует в списке'
    );
}

$setValueResult = $propertyValue->setValue($selectedValue);
if (!$setValueResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $setValueResult->getErrorMessages())
    );
}
```

Для свойства `ENUM` с `MULTIPLE = Y` передавайте массив значений вариантов, например `['COURIER', 'PICKUP']`. Метод `verify()` проверит каждый элемент по доступным вариантам. Названия `Курьер` и `Самовывоз` предназначены для отображения и могут изменяться. Не сохраняйте их вместо кодов `VALUE`.

### Заполнить множественное значение свойства

Для свойства типа `STRING` с флагом `MULTIPLE = Y` передайте в `setValue()` массив строк. Не сериализуйте массив самостоятельно. Модуль подготовит значение, когда сохранит заказ, и восстановит массив, когда прочитает его.

Передайте объект множественного свойства и новые значения:

-  `$propertyValue` — значение свойства с флагом `MULTIPLE = Y`,

-  массив в `setValue()` — новые значения свойства.

```php
$setValueResult = $propertyValue->setValue([
    '+7 900 000-00-00',
    '+7 900 000-00-01',
]);

if (!$setValueResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $setValueResult->getErrorMessages())
    );
}
```

Элементы массива должны соответствовать базовому типу свойства.

### Загрузить файл в свойство заказа

Создайте одиночное свойство `ATTACHMENT` типа `FILE`. В имени поля используйте идентификатор настройки свойства. В форме ниже это `321`:

```html
<form method="post" enctype="multipart/form-data">
    <!-- 321 — идентификатор настройки файлового свойства -->
    <input type="file" name="PROPERTIES[321]">
    <button type="submit">Загрузить</button>
</form>
```

После проверки прав доступа и защиты запроса передайте `$_POST` и `$_FILES` в `PropertyValueCollection::setValuesFromPost()`. Коллекция нормализует файловую структуру и назначает значение свойству с соответствующим идентификатором.

Передайте в обработчик:

-  `$orderId` — идентификатор сохраненного заказа,

-  `$filePropertyId` — идентификатор настройки файлового свойства,

-  `$_POST` и `$_FILES` — проверенные данные формы.

```php
use Bitrix\Main\Loader;
use Bitrix\Sale\Order;

if (!Loader::includeModule('sale'))
{
    throw new \RuntimeException('Модуль sale не установлен');
}

$orderId = 123;
$filePropertyId = 321;

$order = Order::load($orderId);
if (!$order)
{
    throw new \RuntimeException('Заказ не найден');
}

$propertyCollection = $order->getPropertyCollection();
$propertyValue = $propertyCollection
    ->getItemByOrderPropertyId($filePropertyId)
;

if (!$propertyValue)
{
    throw new \RuntimeException('Свойство заказа не найдено');
}

$property = $propertyValue->getProperty();
if (
    ($property['TYPE'] ?? '') !== 'FILE'
    || ($property['MULTIPLE'] ?? 'N') !== 'N'
)
{
    throw new \RuntimeException(
        'Свойство должно быть одиночным и иметь тип FILE'
    );
}

$setValuesResult = $propertyCollection->setValuesFromPost(
    $_POST,
    $_FILES
);
if (!$setValuesResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $setValuesResult->getErrorMessages())
    );
}

$verifyResult = $propertyValue->verify();
if (!$verifyResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $verifyResult->getErrorMessages())
    );
}

$saveResult = $order->save();
if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $saveResult->getErrorMessages())
    );
}

$savedOrder = Order::load($orderId);
$savedPropertyValue = $savedOrder
    ? $savedOrder
        ->getPropertyCollection()
        ->getItemByOrderPropertyId($filePropertyId)
    : null;

$savedFile = $savedPropertyValue?->getValue();
if (
    !is_array($savedFile)
    || (int)($savedFile['ID'] ?? 0) <= 0
)
{
    throw new \RuntimeException('Файл свойства не сохранен');
}
```

Не вызывайте `CFile::SaveFile()` перед `setValue()`. Во время `Order::save()` обработчик свойства пытается передать файл в файловое хранилище и записать его идентификатор в значение свойства.

Если хранилище не примет файл, результат сохранения заказа не обязательно будет содержать отдельную ошибку этого свойства. Поэтому пример повторно загружает заказ и проверяет файловую структуру. Метод `verify()` проверяет ограничения `MAXSIZE` и `ACCEPT` из настройки свойства.

Для множественного файлового свойства добавьте `[]` в имя поля формы, например, `PROPERTIES[321][]`, и настройте `MULTIPLE = Y`. Метод `setValuesFromPost()` обработает массив файлов без прямого обращения к `Bitrix\Sale\Internals\Input\File`.

### Заполнить структурированный адрес

Для типа `ADDRESS` нужен модуль `location`. Передайте в свойство результат `Address::toArray()`. Объект `Address` заранее сохранять не нужно. Во время `Order::save()` модуль попытается создать или обновить объект адреса и записать его идентификатор в значение свойства.

Если объект адреса сохранить не удалось, отдельная ошибка свойства может отсутствовать. Поэтому пример повторно загружает заказ и проверяет структурированное значение.

Для сохранения адреса передайте:

-  `$orderId` — идентификатор сохраненного заказа,

-  `$propertyCode` — символьный код свойства `ADDRESS`,

-  данные для `Address` — страна, почтовый индекс, город, улица и дом.

```php
use Bitrix\Location\Entity\Address;
use Bitrix\Location\Entity\Address\FieldType;
use Bitrix\Main\Loader;
use Bitrix\Sale\Order;

if (
    !Loader::includeModule('sale')
    || !Loader::includeModule('location')
)
{
    throw new \RuntimeException(
        'Для свойства ADDRESS нужны модули sale и location'
    );
}

$orderId = 123;
$propertyCode = 'DELIVERY_ADDRESS';

// Загрузите заказ и проверьте тип свойства
$order = Order::load($orderId);
if (!$order)
{
    throw new \RuntimeException('Заказ не найден');
}

$propertyValue = $order
    ->getPropertyCollection()
    ->getItemByOrderPropertyCode($propertyCode)
;

if (!$propertyValue)
{
    throw new \RuntimeException('Свойство заказа не найдено');
}

$property = $propertyValue->getProperty();
if (($property['TYPE'] ?? '') !== 'ADDRESS')
{
    throw new \RuntimeException(
        'Свойство должно иметь тип ADDRESS'
    );
}

// Сформируйте структурированный адрес
$address = (new Address('ru'))
    ->setFieldValue(FieldType::POSTAL_CODE, '236000')
    ->setFieldValue(FieldType::LOCALITY, 'Калининград')
    ->setFieldValue(FieldType::STREET, 'ул. Примерная')
    ->setFieldValue(FieldType::BUILDING, '1')
    ->setFieldValue(FieldType::ROOM, '15')
;

// Передайте адрес в свойство и проверьте значение
$setValueResult = $propertyValue->setValue(
    $address->toArray()
);

if (!$setValueResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $setValueResult->getErrorMessages())
    );
}

$verifyResult = $propertyValue->verify();
if (!$verifyResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $verifyResult->getErrorMessages())
    );
}

$saveResult = $order->save();
if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $saveResult->getErrorMessages())
    );
}

// Повторно загрузите заказ и проверьте сохраненный адрес
$savedOrder = Order::load($orderId);
$savedPropertyValue = $savedOrder
    ? $savedOrder
        ->getPropertyCollection()
        ->getItemByOrderPropertyCode($propertyCode)
    : null;

$savedAddressValue = $savedPropertyValue?->getValue();
if (!is_array($savedAddressValue))
{
    throw new \RuntimeException(
        'Структурированный адрес не сохранен'
    );
}

$savedAddress = Address::fromArray($savedAddressValue);
$savedStreet = $savedAddress->getFieldValue(
    FieldType::STREET
);

if ($savedStreet !== 'ул. Примерная')
{
    throw new \RuntimeException(
        'Сохраненное значение улицы не совпадает с переданным'
    );
}
```

Язык `'ru'` в конструкторе адреса замените на язык данных, которые сохраняете. Если пользователь выбрал адрес через стандартный элемент управления, массив также может содержать объект местоположения, координаты и дополнительные поля. Не заменяйте эту структуру произвольным массивом.

Код задает поля адреса напрямую и не выбирает элемент из справочника местоположений. Если местоположение влияет на ограничения и стоимость доставки, сначала загрузите местоположения и настройте их для сайта.

Обработчик `ADDRESS` не поддерживает множественные значения. Для нескольких адресов создайте отдельные свойства с понятными ролями или храните постоянный список адресов в профилях покупателей. В заказ переносите адрес, который выбрал покупатель.

## Получить все значения свойств сохраненного заказа

Загрузите заказ и работайте с его `PropertyValueCollection`. Коллекция позволяет перебрать все значения, найти отдельное свойство и получить данные с учетом его типа.

### Перебрать коллекцию значений

Загрузите заказ и получите его коллекцию. `PropertyValue` возвращает сохраненное значение через `getValue()`.

```php
use Bitrix\Sale\Order;

// Идентификатор сохраненного заказа
$orderId = 123;
$order = Order::load($orderId);

if (!$order)
{
    throw new \RuntimeException('Заказ не найден');
}

$propertyCollection = $order->getPropertyCollection();
$phoneProperty = $propertyCollection
    ->getItemByOrderPropertyCode('PHONE')
;

if ($phoneProperty)
{
    $phone = $phoneProperty->getValue();
    $propertySettings = $phoneProperty->getProperty();

    $propertyId = (int)$propertySettings['ID'];
    $isRequired = $propertySettings['REQUIRED'] === 'Y';
}
```

### Получить значение свойства по символьному коду

У объекта `Order` нет отдельного метода `getPropertyValueByCode()`. Получите коллекцию из заказа, найдите ее элемент по коду настройки и прочитайте значение:

```php
// PHONE — символьный код свойства
$phone = $order
    ->getPropertyCollection()
    ->getItemByOrderPropertyCode('PHONE')
    ?->getValue()
;
```

Цепочка с оператором `?->` возвращает `null` при отсутствии свойства и при пустом значении. Чтобы различить эти ситуации, сначала сохраните объект свойства.

```php
// PHONE — символьный код свойства
$propertyValue = $order
    ->getPropertyCollection()
    ->getItemByOrderPropertyCode('PHONE')
;

if (!$propertyValue)
{
    throw new \RuntimeException(
        'Свойство заказа PHONE не найдено'
    );
}

$phone = $propertyValue->getValue();
```

### Получить множественное значение свойства

После загрузки заказа `getValue()` возвращает массив для свойства с `MULTIPLE = Y`. Не разбирайте сериализованное значение из базы самостоятельно:

```php
// Символьный код множественного свойства
$propertyCode = 'ADDITIONAL_PHONE';
$propertyValue = $order
    ->getPropertyCollection()
    ->getItemByOrderPropertyCode($propertyCode)
;

if (!$propertyValue)
{
    throw new \RuntimeException(
        'Множественное свойство заказа не найдено'
    );
}

$property = $propertyValue->getProperty();
if (($property['MULTIPLE'] ?? 'N') !== 'Y')
{
    throw new \RuntimeException(
        'Свойство должно иметь флаг MULTIPLE = Y'
    );
}

$values = $propertyValue->getValue();
if (!is_array($values))
{
    throw new \RuntimeException(
        'Множественное значение должно быть массивом'
    );
}

foreach ($values as $value)
{
    // Обработайте одно значение свойства
}
```

Для множественного `ENUM` элементы массива содержат значения из поля `VALUE` выбранных вариантов. Пустое сохраненное множественное свойство возвращает пустой массив.

### Получить значение файлового свойства

Для типа `FILE` объектная модель возвращает не только идентификатор, а файловую структуру. У одиночного свойства это один массив, у свойства с `MULTIPLE = Y` — массив файловых структур.

```php
// Символьный код файлового свойства
$propertyCode = 'ATTACHMENT';
$propertyValue = $order
    ->getPropertyCollection()
    ->getItemByOrderPropertyCode($propertyCode)
;

if (!$propertyValue)
{
    throw new \RuntimeException(
        'Файловое свойство заказа не найдено'
    );
}

$property = $propertyValue->getProperty();
if (($property['TYPE'] ?? '') !== 'FILE')
{
    throw new \RuntimeException(
        'Свойство должно иметь тип FILE'
    );
}

$value = $propertyValue->getValue();
$isMultiple = ($property['MULTIPLE'] ?? 'N') === 'Y';

if ($isMultiple)
{
    $files = is_array($value) ? $value : [];
}
else
{
    $files = $value === null ? [] : [$value];
}

foreach ($files as $file)
{
    if (!is_array($file) || (int)($file['ID'] ?? 0) <= 0)
    {
        continue;
    }

    $fileId = (int)$file['ID'];
    $fileName = (string)($file['ORIGINAL_NAME'] ?? $file['FILE_NAME'] ?? '');
    $fileSource = (string)($file['SRC'] ?? '');
}
```

Проверяйте наличие ключей перед использованием. Пустое свойство не содержит файла. Не формируйте путь к файлу из идентификатора самостоятельно. Используйте данные файлового API и проверяйте, вправе ли пользователь читать заказ.

### Выбрать метод поиска элемента коллекции

Коллекция поддерживает несколько способов поиска. Выбор метода зависит от вида идентификатора.

#|
|| **Метод** | **Что принимает** | **Когда использовать** ||
|| `getItemById($valueId)` | Идентификатор значения из `OrderPropsValueTable.ID` | Строка уже существует в базе, и известен ее идентификатор ||
|| `getItemByOrderPropertyId($propertyId)` | Идентификатор настройки из `OrderPropsTable.ID` | Известна настройка свойства ||
|| `getItemByOrderPropertyCode($code)` | Символьный код настройки | Код уникален внутри типа плательщика ||
|| `getItemByIndex($index)` | Внутренний индекс элемента коллекции | Элемент выбирается в рамках текущего объекта коллекции ||
|#

Внутренний индекс не является идентификатором строки базы данных. Не сохраняйте его во внешней системе и не используйте после повторной загрузки заказа.

У коллекции есть методы для свойств с системной ролью.

#|
|| **Метод** | **Какое свойство возвращает** ||
|| `getAddress()` | Адрес ||
|| `getPhone()` | Телефон ||
|| `getProfileName()` | Название профиля покупателя ||
|| `getTaxLocation()` | Местоположение для расчета налогов ||
|| `getDeliveryLocationZip()` | Почтовый индекс доставки ||
|| `getDeliveryLocation()` | Местоположение доставки ||
|| `getPayerName()` | Имя или название плательщика ||
|| `getUserEmail()` | Email покупателя ||
|#

Эти методы ориентируются на служебные флаги настройки. Используйте их, когда важна роль свойства, а код может отличаться между типами плательщика.

### Получить настройку свойства из объекта значения

Метод `PropertyValue::getProperty()` возвращает настройку в виде массива, а `getPropertyObject()` — объект настройки. Из них можно получить тип, код, группу, обязательность, множественность, ограничения и служебные флаги.

```php
// Значение свойства PHONE из коллекции загруженного заказа
if (!$phoneProperty)
{
    throw new \RuntimeException('Значение свойства телефона не найдено');
}

$property = $phoneProperty->getPropertyObject();

if (!$property)
{
    throw new \RuntimeException('Настройка свойства телефона не найдена');
}

$propertyId = $property->getId();
$personTypeId = $property->getPersonTypeId();
$propertyName = $property->getName();
$propertyType = $property->getType();
$propertyGroupId = $property->getGroupId();
$propertyDescription = $property->getDescription();
$propertyRelations = $property->getRelations();
$isRequired = $property->isRequired();
$isUtility = $property->isUtil();
```

Для поля без отдельного метода вызовите `getField()`. Например, `$property->getField('SIZE')` возвращает настроенный размер поля.

## Изменить значение свойства сохраненного заказа

Измените значение через объект `PropertyValue`, затем сохраните весь заказ. Способ очистки и удаления зависит от типа свойства и требуемого результата.

### Заменить значение свойства

Измените поле `VALUE` через `setValue()`, затем сохраните весь заказ. Метод `setField('VALUE', $value)` выполняет тот же сценарий через базовый API объекта.

Подготовьте заказ, его коллекцию свойств и новое значение:

-  `$order` — загруженный заказ,

-  `$propertyCollection` — коллекция свойств этого заказа,

-  новое значение — данные для свойства `PHONE`.

```php
$phoneProperty =
    $propertyCollection->getItemByOrderPropertyCode('PHONE');

if (!$phoneProperty)
{
    throw new \RuntimeException('Свойство телефона не найдено');
}

$setValueResult = $phoneProperty->setValue('+7 900 111-22-33');

if (!$setValueResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $setValueResult->getErrorMessages())
    );
}

$saveResult = $order->save();

if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $saveResult->getErrorMessages())
    );
}
```

### Очистить значение без удаления из коллекции

Чтобы оставить свойство в `PropertyValueCollection`, вызовите `setValue()` с пустым значением и сохраните заказ. Не вызывайте `delete()`. Пустое значение зависит от типа настройки.

#|
|| **Настройка** | **Значение для очистки** ||
|| Одиночный `STRING`, `NUMBER`, `DATE`, `LOCATION` или `ENUM` | Пустая строка `''` ||
|| Тип, который поддерживает `MULTIPLE = Y`, кроме `FILE` | Пустой массив `[]` ||
|| `ADDRESS` | `null` ||
|| `Y/N` | Тип не имеет отдельного пустого состояния; используйте `N` ||
|| `FILE` | Текущее файловое значение с маркером `DELETE`; смотрите раздел [Очистить файловое свойство](#очистить-файловое-свойство) ||
|| `UF` или собственный тип | Пустое значение по контракту обработчика ||
|#

Если очищаете адрес или местоположение, повторно проверьте ограничения, стоимость доставки и налоги. Выполните связанные расчеты перед сохранением заказа.

Чтобы очистить необязательное простое или множественное свойство, определите пустое значение по его типу.

Для очистки свойства передайте:

-  `$order` — загруженный заказ,

-  `$propertyCollection` — коллекция свойств этого заказа,

-  `$propertyCode` — символьный код необязательного свойства.

```php
$propertyCode = 'COMMENT';
$propertyValue = $order
    ->getPropertyCollection()
    ->getItemByOrderPropertyCode($propertyCode)
;

if (!$propertyValue)
{
    throw new \RuntimeException(
        'Свойство заказа не найдено'
    );
}

$property = $propertyValue->getProperty();
if (($property['REQUIRED'] ?? 'N') === 'Y')
{
    throw new \RuntimeException(
        'Обязательное свойство нельзя оставить пустым'
    );
}

$type = (string)($property['TYPE'] ?? '');
$isMultiple = ($property['MULTIPLE'] ?? 'N') === 'Y';

if ($type === 'FILE' || $type === 'UF')
{
    throw new \RuntimeException(
        'Используйте контракт обработчика сложного типа'
    );
}

if ($type === 'ADDRESS')
{
    $emptyValue = null;
}
elseif ($isMultiple)
{
    $emptyValue = [];
}
elseif ($type === 'Y/N')
{
    $emptyValue = 'N';
}
else
{
    $emptyValue = '';
}

$setValueResult = $propertyValue->setValue($emptyValue);
if (!$setValueResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $setValueResult->getErrorMessages())
    );
}

$verifyResult = $propertyValue->verify();
if (!$verifyResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $verifyResult->getErrorMessages())
    );
}

$saveResult = $order->save();
if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $saveResult->getErrorMessages())
    );
}
```

Когда заказ сохранится, элемент останется в коллекции, а его `VALUE` станет пустым. Для обязательного свойства проверка вернет ошибку. Очищайте только необязательные поля или сначала меняйте бизнес-правило в настройке.

### Очистить файловое свойство

Чтобы очистить файловое свойство, оставьте его элемент в коллекции. Передайте каждое файловое значение, которое прочитал API, с маркером `DELETE` и сохраните заказ. Обработчик удалит связь и файлы из файлового хранилища. Пример кода подходит для одиночного и множественного свойства.

Для очистки файла передайте:

-  `$order` — загруженный заказ,

-  `$propertyCollection` — коллекция свойств этого заказа,

-  `$propertyCode` — символьный код файлового свойства.

```php
use Bitrix\Main\Loader;
use Bitrix\Sale\Order;

if (!Loader::includeModule('sale'))
{
    throw new \RuntimeException('Модуль sale не установлен');
}

$orderId = 123;
$propertyCode = 'ATTACHMENT';

// Загрузите заказ и проверьте файловое свойство
$order = Order::load($orderId);
if (!$order)
{
    throw new \RuntimeException('Заказ не найден');
}

$propertyValue = $order
    ->getPropertyCollection()
    ->getItemByOrderPropertyCode($propertyCode)
;

if (!$propertyValue)
{
    throw new \RuntimeException(
        'Файловое свойство заказа не найдено'
    );
}

$property = $propertyValue->getProperty();
if (($property['TYPE'] ?? '') !== 'FILE')
{
    throw new \RuntimeException(
        'Свойство должно иметь тип FILE'
    );
}

if (($property['REQUIRED'] ?? 'N') === 'Y')
{
    throw new \RuntimeException(
        'Обязательное файловое свойство нельзя очистить'
    );
}

// Подготовьте сохраненные файлы к удалению
$currentValue = $propertyValue->getValue();
$isMultiple = ($property['MULTIPLE'] ?? 'N') === 'Y';

if ($isMultiple)
{
    $files = is_array($currentValue) ? $currentValue : [];
}
else
{
    $files = $currentValue === null ? [] : [$currentValue];
}

$filesToDelete = [];
foreach ($files as $file)
{
    if (!is_array($file) || (int)($file['ID'] ?? 0) <= 0)
    {
        continue;
    }

    $file['DELETE'] = 'Y';
    $filesToDelete[] = $file;
}

if ($filesToDelete === [])
{
    throw new \RuntimeException(
        'У свойства нет сохраненных файлов'
    );
}

$emptyValue = $isMultiple
    ? $filesToDelete
    : $filesToDelete[0]
;

// Передайте файлы с маркером DELETE и сохраните заказ
$setValueResult = $propertyValue->setValue($emptyValue);
if (!$setValueResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $setValueResult->getErrorMessages())
    );
}

$verifyResult = $propertyValue->verify();
if (!$verifyResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $verifyResult->getErrorMessages())
    );
}

$saveResult = $order->save();
if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $saveResult->getErrorMessages())
    );
}
```

### Сменить тип плательщика существующего заказа

Не меняйте `PERSON_TYPE_ID` как обычное поле. Вызовите `Order::setPersonTypeId()`. Учтите, что метод не переносит автоматически значения свойств прежнего типа в свойства нового.

Меняйте тип плательщика как отдельную миграцию данных.

1. Прежде чем изменить тип плательщика, сохраните нужные контактные и адресные значения из текущей коллекции.

2. Вызовите `setPersonTypeId()` и обработайте ошибки.

3. Получите коллекцию свойств нового типа плательщика.

4. Сопоставьте свойства по служебной роли или согласованному коду и перенесите только совместимые значения.

5. Проверьте обязательные свойства нового типа.

6. Повторно проверьте ограничения платежных систем и служб доставки.

7. Если изменились адрес или местоположение, пересчитайте доставку и заказ.

8. Вызовите `Order::save()` и обработайте ошибки и предупреждения.

Не сопоставляйте свойства разных типов плательщиков по идентификатору. У каждой настройки собственный идентификатор. Сначала заполните и проверьте новую коллекцию. Только потом удаляйте старые значения.

Чтобы пересчитать и сохранить заказ, выполните сценарий [Изменить поля заказа](./order-update.md#изменить-поля-заказа).

### Выбрать событие значения свойства

Событие выбирайте по моменту, когда должна выполниться логика.

#|
|| **Событие** | **Когда вызывается** | **Когда использовать** | **Параметры** ||
|| `OnBeforeSalePropertyValueSetField` | При попытке изменить поле, до изменения | Нормализовать или отклонить новое значение | `ENTITY`, `NAME`, `VALUE` ||
|| `OnSalePropertyValueSetField` | При изменении поля, перед присваиванием значения | Сравнить новое и прежнее значения | `ENTITY`, `NAME`, `VALUE`, `OLD_VALUE` ||
|| `OnSalePropertyValueEntitySaved` | При попытке записать значение во время `Order::save()` | Отследить попытку сохранения значения | `ENTITY`, `VALUES` ||
|| `OnSalePropertyValueDeleted` | При попытке удалить значение во время сохранения заказа | Отследить удаление значения | `VALUES` ||
|#

Параметр `ENTITY` содержит объект `Bitrix\Sale\PropertyValue`. Если меняется значение свойства, параметр `NAME` равен `VALUE`. Параметр `VALUES` содержит прежние значения измененных полей либо поля удаляемого значения.

Используйте `OnBeforeSalePropertyValueSetField`, если значение нужно нормализовать во всех местах, которые меняют объект. Обработчик возвращает новое значение в `Bitrix\Main\EventResult`.

Из объекта события получите:

-  `ENTITY` — изменяемый объект `PropertyValue`,

-  `NAME` — имя изменяемого поля,

-  `VALUE` — новое значение поля.

```php
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;
use Bitrix\Main\EventResult;
use Bitrix\Sale\PropertyValue;

EventManager::getInstance()->addEventHandler(
    'sale',
    'OnBeforeSalePropertyValueSetField',
    static function (Event $event)
    {
        $propertyValue = $event->getParameter('ENTITY');
        $fieldName = $event->getParameter('NAME');
        $value = $event->getParameter('VALUE');

        if (
            !$propertyValue instanceof PropertyValue
            || $fieldName !== 'VALUE'
            || $propertyValue->getField('CODE') !== 'LOYALTY_NUMBER'
        )
        {
            return;
        }

        $normalizedValue = strtoupper(trim((string)$value));

        $event->addResult(
            new EventResult(
                EventResult::SUCCESS,
                ['VALUE' => $normalizedValue]
            )
        );
    }
);
```

Проверяйте `NAME` и код свойства в начале обработчика. Событие вызывается для каждого изменяемого значения свойства, а не только для одного кода.

Не вызывайте `setValue()` для того же объекта внутри обработчика `OnBeforeSalePropertyValueSetField`. Чтобы подменить значение без повторного запуска события, верните массив с ключом `VALUE` через `EventResult`.

События изменения объекта в памяти не означают, что данные записаны в базу. События `OnSalePropertyValueEntitySaved` и `OnSalePropertyValueDeleted` также сообщают о попытке операции, а не подтверждают ее успех. Надежный результат дает `Order::save()` с последующей проверкой сохраненного состояния.

Чтобы выбрать событие для сообщения и защититься от повторных уведомлений, используйте рекомендации из раздела [Уведомления по заказам](./order-notifications.md).

### Удалить значение из коллекции

Вызовите `delete()` у `PropertyValue`, затем сохраните заказ.

Для удаления значения передайте:

-  `$order` — загруженный заказ,

-  `$phoneProperty` — значение свойства телефона из коллекции заказа.

```php
$deleteResult = $phoneProperty->delete();

if (!$deleteResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $deleteResult->getErrorMessages())
    );
}

$saveResult = $order->save();

if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $saveResult->getErrorMessages())
    );
}
```

Если удалить `PropertyValue`, настройка останется в `OrderPropsTable`. Если свойство обязательное, заказ останется без требуемого значения. Поэтому проверьте заказ, сохраните его и обработайте результат.

Пустое значение не вызывает событие `OnSalePropertyValueDeleted`. Для удаления вызовите `PropertyValue::delete()` и сохраните заказ. Не записывайте в журнал значения свойств — они могут содержать персональные данные.

## Получить значения свойств для отчета

Для отчета без изменения заказа используйте `OrderPropsValueTable`.

```php
use Bitrix\Sale\Internals\OrderPropsValueTable;

// Идентификатор заказа, доступ к которому уже проверен
$orderId = 123;

$propertyRows = OrderPropsValueTable::getList([
    'select' => [
        'ORDER_PROPS_ID',
        'NAME',
        'CODE',
        'VALUE',
    ],
    'filter' => [
        '=ORDER_ID' => $orderId,
        '=ENTITY_TYPE' => 'ORDER',
    ],
    'order' => [
        'ID' => 'ASC',
    ],
])->fetchAll();
```

Таблица `OrderPropsValueTable` хранит снимок названия и кода вместе со значением. Поле `ORDER_PROPS_ID` ссылается на текущую настройку в `OrderPropsTable`.

Методы `PropertyValue::getList()` и `PropertyValueCollection::getList()` принимают те же параметры ORM-выборки. Прямые запросы используйте только для чтения. Чтобы изменить значение, загрузите `Order` и работайте с его коллекцией.

## Работать безопасно со свойствами заказа

Перед чтением и изменением свойств проверьте доступ к заказу. При сохранении учитывайте персональные данные, параллельные операции и результат `Order::save()`.

### Ограничить доступ к данным

Идентификатор заказа из HTTP-запроса не подтверждает, что пользователь вправе читать или изменять его свойства. Прежде чем вызвать `Order::load()`, проверьте аутентификацию, принадлежность заказа и разрешенность операции по правилам проекта. Если объект успешно загрузился, заказ существует, но доступ к нему все равно нужно проверить по правилам проекта.

Не возвращайте клиенту всю `PropertyValueCollection` без фильтрации. Телефон, email, адрес, реквизиты и пользовательские свойства могут содержать персональные или служебные данные. Формируйте ответ из разрешенного списка кодов, маскируйте чувствительные значения и не записывайте всю коллекцию в журнал.

### Учесть параллельные изменения

Когда изменяете заказ, который система уже сохранила, учитывайте параллельную работу менеджеров и интеграций. Если конфликт критичен, заблокируйте заказ на время редактирования или повторно загрузите его перед записью. Используйте порядок действий из раздела [Защитить заказ от параллельного изменения](./order-update.md#защитить-заказ-от-параллельного-изменения).

### Проверить результат сохранения

После `Order::save()` обработайте ошибки и предупреждения. Если новое значение запускает внешний процесс, повторно загрузите заказ и сравните сохраненное значение с ожидаемым.

Не повторяйте `save()` автоматически после предупреждения или расхождения. Для обработки ошибок, повторных запросов и проверки сохраненного состояния используйте раздел [Сохранить заказ и обработать ошибки](./order-update.md#сохранить-заказ-и-обработать-ошибки).

## Различить свойства заказа и товара

Свойство заказа описывает оформление покупки. Оно принадлежит модулю `sale`, зависит от типа плательщика и хранит значение для всего заказа. Примеры: телефон, адрес доставки и ИНН.

Товарное свойство описывает товар или торговое предложение. Оно принадлежит `iblock` или `catalog` и хранит характеристику конкретного элемента. Примеры: цвет, размер и материал.

Характеристики отдельных товаров читайте из позиции корзины или связанного товара. Не записывайте их в свойство всего заказа. Одно значение не описывает несколько позиций. Чтобы сохранить выбранную характеристику вместе с позицией, используйте `BasketItem::getPropertyCollection()`.

Свойство позиции корзины хранит данные выбора в заказе, но не заменяет актуальное свойство элемента или торгового предложения. Создание, чтение и изменение таких значений описано в разделе [Добавить свойства позиции](./basket.md#basket-properties).

## Отделить свойства заказа от профиля покупателя

Значение в `OrderPropsValueTable` принадлежит конкретному заказу и хранит данные, которые покупатель передал при оформлении. Профиль покупателя хранит отдельный набор значений. Их можно подставить, когда покупатель оформляет следующий заказ.

Используйте API из раздела [Покупатели и внутренние счета](./buyers-accounts.md), если нужно:

-  найти или обновить профиль покупателя,

-  сохранить адрес для повторного оформления,

-  получить историю и статистику покупателя,

-  прочитать баланс внутреннего счета или транзакции.

Для текущего заказа работайте с `PropertyValueCollection`. Для постоянных данных покупателя используйте API профилей. Не изменяйте прошлые заказы.

## Создать пользовательский тип свойства

Пользовательский тип задает собственный формат и серверную проверку значения. Для серверной части реализуйте PHP-класс на основе `Bitrix\Sale\Internals\Input\Base` и зарегистрируйте тип через `Bitrix\Sale\Internals\Input\Manager`. PHP-класс формирует поле и проверяет значение на сервере. Если собственная форма создает редактор через `BX.Sale.Input.Manager`, дополнительно реализуйте клиентский класс. Для серверного сценария клиентский класс не нужен.

{% note warning "" %}

После обновления модуля проверьте регистрацию типа, серверную проверку значения и вывод поля в интерфейсе.

{% endnote %}

### Выбрать между стандартным и пользовательским типом

Сначала выберите подходящий стандартный тип в разделе [Выбрать формат значения](#выбрать-формат-значения). Создавайте пользовательский тип, только если стандартные настройки не могут задать формат, проверить значение на сервере или вывести нужный элемент формы.

Для стандартного типа не нужно наследовать `Bitrix\Sale\Internals\Input\Base` или регистрировать новый код.

В пользовательском типе код, например, `LOYALTY_NUMBER`, становится значением `TYPE` в настройке свойства. PHP-класс на основе `Input\Base` формирует поле на сервере и проверяет значение. JavaScript-класс нужен только для интерфейса, который создает редактор через `BX.Sale.Input.Manager`.

Выполняйте сценарий по этапам:

1. Реализуйте обязательный PHP-класс.

2. Зарегистрируйте код типа при запуске проекта.

3. Создайте свойство с новым значением `TYPE`.

4. Добавьте JavaScript-класс, если используемый интерфейс требует клиентский редактор.

### Реализовать PHP-класс типа свойства

Создайте класс на основе `Bitrix\Sale\Internals\Input\Base` в файле `/local/php_interface/lib/Sale/Input/LoyaltyNumber.php`. Не размещайте объявление с пространством имен среди исполняемых инструкций `init.php`.

#|
|| **Метод** | **Назначение** ||
|| `getEditHtmlSingle()` | Возвращает HTML для одного значения ||
|| `getErrorSingle()` | Возвращает массив ошибок одного значения ||
|| `getSettings()` | Описывает дополнительные настройки типа ||
|| `getFilterEditHtml()` | Возвращает HTML поля в фильтре, если тип поддерживает фильтрацию ||
|#

Проверьте формат непустого значения в `getErrorSingle()`. Обязательность свойства обработайте отдельно через настройку `REQUIRED` и `PropertyValue::checkRequiredValue()`.

Методы пользовательского типа получают:

-  `$name` — имя HTML-поля,

-  `$input` — настройки и состояние редактора,

-  `$value` — текущее значение свойства,

-  `$reload` — признак повторной загрузки настроек.

```php
namespace Local\Sale\Input;

use Bitrix\Sale\Internals\Input\Base;

final class LoyaltyNumber extends Base
{
    public static function getEditHtmlSingle(
        $name,
        array $input,
        $value
    )
    {
        $name = htmlspecialcharsbx((string)$name);
        $value = htmlspecialcharsbx((string)$value);
        $placeholder = htmlspecialcharsbx(
            (string)($input['PLACEHOLDER'] ?? 'AB-123456')
        );
        $attributes = '';
        $booleanAttributes = [
            'DISABLED' => 'disabled',
            'READONLY' => 'readonly',
        ];

        foreach ($booleanAttributes as $settingName => $attributeName)
        {
            $settingValue = $input[$settingName] ?? 'N';
            if ($settingValue === 'Y' || $settingValue === true)
            {
                $attributes .= ' ' . $attributeName;
            }
        }

        $form = (string)($input['FORM'] ?? '');
        if ($form !== '')
        {
            $attributes .= ' form="'
                . htmlspecialcharsbx($form)
                . '"';
        }

        $size = (int)($input['SIZE'] ?? 0);
        if ($size > 0)
        {
            $attributes .= ' size="' . $size . '"';
        }

        return sprintf(
            '<input type="text" name="%s" value="%s" '
                . 'placeholder="%s"%s>',
            $name,
            $value,
            $placeholder,
            $attributes
        );
    }

    public static function getErrorSingle(array $input, $value)
    {
        $value = trim((string)$value);

        if ($value === '')
        {
            return [];
        }

        if (!preg_match('/^[A-Z]{2}-\d{6}$/', $value))
        {
            return [
                'FORMAT' => 'Используйте формат AB-123456',
            ];
        }

        return [];
    }

    public static function getSettings(array $input, $reload)
    {
        return [];
    }

    public static function getFilterEditHtml(
        $name,
        array $input,
        $value
    )
    {
        return static::getEditHtmlSingle($name, $input, $value);
    }
}
```

### Зарегистрировать тип в проекте

Разделите класс и регистрацию по разным файлам:

```text
/local/php_interface/
├── init.php
├── include/sale_input_types.php
└── lib/Sale/Input/LoyaltyNumber.php
```

Файл `/local/php_interface/init.php` остается поддерживаемой точкой инициализации. Не размещайте в нем класс и всю логику регистрации. Подключите отдельный файл:

```php
// Подключите файл регистрации пользовательского типа
require_once $_SERVER['DOCUMENT_ROOT']
    . '/local/php_interface/include/sale_input_types.php';
```

В `/local/php_interface/include/sale_input_types.php` подключите класс и зарегистрируйте обработчик события `sale:registerInputTypes`. Код `LOYALTY_NUMBER` должен быть уникален во всей системе. Не используйте коды встроенных типов, например `STRING` или `DATE`.

При регистрации передайте:

-  `sale` — идентификатор модуля,

-  `registerInputTypes` — имя события,

-  `LOYALTY_NUMBER` — уникальный код типа,

-  `LoyaltyNumber::class` — PHP-класс обработчика.

```php
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;
use Bitrix\Sale\Internals\Input\Manager;
use Local\Sale\Input\LoyaltyNumber;

EventManager::getInstance()->addEventHandler(
    'sale',
    'registerInputTypes',
    static function (Event $event)
    {
        require_once $_SERVER['DOCUMENT_ROOT']
            . '/local/php_interface/lib/Sale/Input/LoyaltyNumber.php';

        Manager::register(
            'LOYALTY_NUMBER',
            [
                'CLASS' => LoyaltyNumber::class,
                'NAME' => 'Номер программы лояльности',
            ]
        );
    }
);
```

Проект должен подключить обработчик до того, как модуль `sale` вызовет событие `registerInputTypes`. Когда обработчик зарегистрирует тип, он появится среди доступных вариантов в форме, где создают свойство заказа.

### Заполнить свойство пользовательского типа

Пример реализует только одиночное значение. Создавайте настройку `LOYALTY_NUMBER` с `MULTIPLE = N`. Для множественного пользовательского свойства отдельно реализуйте и протестируйте контракт обработчика типа и используемого компонента.

Сначала создайте настройку с `TYPE = LOYALTY_NUMBER`. Затем найдите значение в коллекции заказа и заполните его.

Чтобы заполнить свойство, передайте:

-  `$propertyCollection` — коллекция свойств созданного или загруженного заказа,

-  `LOYALTY_NUMBER` — символьный код свойства,

-  `AB-123456` — значение в формате пользовательского типа.

```php
$loyaltyProperty =
    $propertyCollection->getItemByOrderPropertyCode('LOYALTY_NUMBER');

if ($loyaltyProperty)
{
    $setValueResult = $loyaltyProperty->setValue('AB-123456');

    if (!$setValueResult->isSuccess())
    {
        throw new \RuntimeException(
            implode('; ', $setValueResult->getErrorMessages())
        );
    }
}
```

#### Проверить значение пользовательского типа

Метод `verify()` проверяет значение, но не сохраняет его.

```php
// Заполненное значение свойства пользовательского типа
if ($loyaltyProperty)
{
    $verifyResult = $loyaltyProperty->verify();

    if (!$verifyResult->isSuccess())
    {
        throw new \RuntimeException(
            implode('; ', $verifyResult->getErrorMessages())
        );
    }
}
```

После успешной проверки вызовите `Order::save()` и обработайте результат.

### Поддержать тип в форме оформления

PHP-класс обеспечивает серверный вывод и проверку значения, но не добавляет поддержку типа во все интерфейсы автоматически. Если собственная форма использует `BX.Sale.Input.Manager`, реализуйте клиентский класс на основе `BX.Sale.Input.BaseInput` и зарегистрируйте его под тем же кодом, который передали в `Manager::register()`.

Для редактора одиночного значения определите методы:

-  `createEditorSingle()` — создает элементы редактора,

-  `afterEditorSingleInsert()` — выполняет действие после вставки редактора,

-  `setValueSingle()` и `getValueSingle()` — записывают и возвращают значение,

-  `setDisabledSingle()` — включает или отключает поле,

-  `addEventSingle()` — назначает обработчик события.

{% note warning "" %}

Стандартный `sale.order.ajax` не гарантирует поддержку произвольного типа. Проверьте полный цикл в используемом шаблоне: вывод поля, отправку значения, повторный показ формы через AJAX и вывод ошибок. Общий сценарий работы компонента описан в статье [Оформление заказа и публичные сценарии](./order-checkout-component.md).

{% endnote %}

Серверная проверка остается обязательной, даже если браузер ограничивает формат через HTML или JavaScript. Разработчик может обойти клиентскую проверку, а `getErrorSingle()` участвует в проверке значения на сервере.

{% note info "" %}

Если пользовательский тип входит в распространяемый модуль, зарегистрируйте обработчик `sale:registerInputTypes` при установке модуля и удалите регистрацию при его удалении. Порядок действий изучите в разделах [Основной файл установки](./../../get-started/create-module.md#основной-файл-установки) и [Регистрация обработчиков](./../../framework/events.md#регистрация-обработчиков).

{% endnote %}