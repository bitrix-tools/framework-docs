---
title: Базовые настройки каталога
description: 'Базовые настройки каталога. Модуль Торговый каталог Bitrix: типы цен, НДС, единицы измерения и параметры продажи товаров.'
---

Базовые настройки задают общие правила для товаров, цен и скидок. Чтобы цены, НДС и единицы измерения работали предсказуемо, настройте эти параметры до массового создания каталога.

{% note warning "" %}

Перед настройкой базовых параметров убедитесь, что установлен модуль `catalog` и у пользователя есть права на изменение данных каталога.

{% endnote %}

## Настроить типы цен и доступ

Сначала настройте типы цен. Без прав на тип цены пользователь видит товар, но не видит цену и не может оформить заказ.

{% note info "" %}

В торговом каталоге только один тип цены может быть базовым. Базовый тип цены всегда есть в системе, его нельзя удалить. Если создаете дополнительные типы цен, указывайте для них `BASE` равным `N`.

{% endnote %}

### Получить базовый тип цены {#base-price-type}

Базовый тип цен чаще всего хранит розничную цену. Получить его можно с помощью `\Bitrix\Catalog\GroupTable::getBasePriceType()` без параметров. Метод возвращает массив с полями типа цены.

```php
$basePriceType = \Bitrix\Catalog\GroupTable::getBasePriceType();

if (!$basePriceType)
{
    throw new \RuntimeException('Базовый тип цен не найден');
}

$basePriceTypeId = (int)$basePriceType['ID'];
```

При добавлении цены к товару передайте идентификатор из поля `ID` в параметр `CATALOG_GROUP_ID`.

### Создать тип цены {#create-price-type}

Чтобы создать тип цены, используйте классический метод `CCatalogGroup::Add()`. Например, отдельный тип цены нужен для оптовых покупателей. Они видят оптовую цену и могут купить товар по ней, а обычные посетители сайта работают с базовой розничной ценой.

Передайте массив параметров:

-  `NAME` — внутренний код типа цены,

-  `BASE` — признак базового типа,

-  `SORT` — сортировка,

-  `USER_GROUP` — группы пользователей, которые видят цены этого типа,

-  `USER_GROUP_BUY` — группы, которые могут покупать по этому типу цены,

-  `USER_LANG` — названия типа цены для языков сайта.

```php
$wholesalePriceTypeId = \CCatalogGroup::Add([
    'NAME' => 'WHOLESALE',
    'BASE' => 'N',
    'SORT' => 200,
    'USER_GROUP' => [2],
    'USER_GROUP_BUY' => [8],
    'USER_LANG' => [
        'ru' => 'Оптовая цена',
        'en' => 'Wholesale price',
    ],
]);

if (!$wholesalePriceTypeId)
{
    global $APPLICATION;
    $exception = $APPLICATION->GetException();
    $message = $exception ? $exception->GetString() : 'Не удалось создать тип цены';

    throw new \RuntimeException($message);
}
```

В примере `2` — идентификатор группы всех пользователей, а `8` — пример идентификатора группы оптовых покупателей. В своем проекте передайте идентификаторы тех групп, которым нужен доступ к этому типу цены.

### Получить список типов цен

Класс `\Bitrix\Catalog\GroupTable` возвращает список типов цен без языковых названий и прав. В `getList()` передайте `select` со списком полей и `order` с сортировкой.

```php
$priceTypes = \Bitrix\Catalog\GroupTable::getList([
    'select' => ['ID', 'NAME', 'BASE', 'SORT'],
    'order' => ['SORT' => 'ASC', 'ID' => 'ASC'],
])->fetchAll();
```

### Проверить доступ к типу цены {#check-price-type-access}

Тип цены может быть доступен не всем пользователям. Например, оптовую цену видят только оптовые покупатели. `\Bitrix\Catalog\GroupAccessTable` позволяет узнать, какие группы пользователей имеют доступ к определенному типу цены.

Права хранятся в поле `ACCESS`. Возможные значения:

-  `ACCESS_VIEW` — пользователь видит цену этого типа,

-  `ACCESS_BUY` — пользователь может купить товар по цене этого типа.

Чтобы запросить права для нужного типа цены, вызовите метод `getList()`. Передайте `select` со списком нужных полей и `filter` по `CATALOG_GROUP_ID`.

Поле `GROUP_ID` в результате показывает, для какой группы пользователей действует право.

```php
$accessRows = \Bitrix\Catalog\GroupAccessTable::getList([
    'select' => ['CATALOG_GROUP_ID', 'GROUP_ID', 'ACCESS'],
    'filter' => [
        '=CATALOG_GROUP_ID' => $basePriceTypeId,
    ],
])->fetchAll();

foreach ($accessRows as $row)
{
    if ($row['ACCESS'] === 'ACCESS_VIEW') {
        echo "Группа {$row['GROUP_ID']} видит цену\n";
    }

    if ($row['ACCESS'] === 'ACCESS_BUY') {
        echo "Группа {$row['GROUP_ID']} может покупать по этой цене\n";
    }
}
```

Доступ к цене проверяйте отдельно от флага `AVAILABLE`. Товар может быть доступен по остатку, но недоступен для покупки пользователю без доступа к нужному типу цены.

## Настроить НДС

НДС не хранится в строке цены. Ставка хранится в таблице НДС каталога `VatTable`. В записи товара есть два поля:

-  `VAT_ID` — хранит идентификатор ставки НДС из таблицы НДС,

-  `VAT_INCLUDED` — показывает, входит ли НДС в цену товара.

### Создать ставку НДС {#create-vat-rate}

Создайте новую ставку через `\Bitrix\Catalog\Model\Vat::add()`. Например, ставка нужна, если товары в каталоге продаются с НДС 10% и это значение должно участвовать в расчетах. Передайте массив с полями:

-  `ACTIVE` — активность ставки: `Y` или `N`,

-  `NAME` — название ставки,

-  `RATE` — процент НДС,

-  `SORT` — порядок сортировки в списке ставок.

```php
$result = \Bitrix\Catalog\Model\Vat::add([
    'ACTIVE' => 'Y',
    'NAME'   => 'НДС 10%',
    'RATE'   => 10,
    'SORT'   => 100,
]);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$vatId = $result->getId();
```

Метод возвращает объект результата. При успешном создании идентификатор новой ставки можно получить через `$result->getId()`.

{% note info "" %}

Классические методы `CCatalogVat::Add()`, `Update()` и `Delete()` устарели. Не используйте их в новом коде.

{% endnote %}

### Назначить НДС товару {#assign-vat-to-product}

Если товара еще нет, сначала создайте его по инструкции [Работа с товарами и торговыми предложениями](./products-and-offers.md). В примерах ниже `$productId` — идентификатор созданного товара или торгового предложения.

Чтобы назначить НДС товару, вызовите метод `\Bitrix\Catalog\Model\Product::update()`. Первым параметром передайте идентификатор товара. Вторым параметром передайте массив с полями:

-  `VAT_ID` — идентификатор ставки НДС, который получили при создании,

-  `VAT_INCLUDED` — признак вхождения НДС в цену: `Y` или `N`.

```php
$result = \Bitrix\Catalog\Model\Product::update($productId, [
    'VAT_ID'       => $vatId,
    'VAT_INCLUDED' => 'Y',
]);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

В примере `$productId` — идентификатор товара или торгового предложения, которому нужно назначить ставку НДС. `$vatId` — идентификатор ставки, полученный после создания ставки или из списка ставок НДС.

Если поле `VAT_INCLUDED` имеет значение `Y`, система считает, что цена товара уже включает НДС. Если значение `N`, система добавляет НДС к цене при расчете.

### Получить список ставок НДС

Получите список активных ставок НДС через `\Bitrix\Catalog\VatTable::getList()`. Передайте:

-  `select` — массив полей, которые нужно получить: `ID`, `NAME`, `RATE`, `ACTIVE`,

-  `filter` — условия отбора, например, только активные ставки,

-  `order` — порядок сортировки.

```php
$vatRates = \Bitrix\Catalog\VatTable::getList([
    'select' => ['ID', 'NAME', 'RATE', 'ACTIVE'],
    'filter' => ['=ACTIVE' => 'Y'],
    'order' => ['SORT' => 'ASC'],
])->fetchAll();
```

### Получить НДС товара

Для товара в каталоге НДС хранится как ссылка: в записи товара лежит `VAT_ID`, а сама ставка лежит в таблице НДС.

Используйте методы:

-  `\Bitrix\Catalog\ProductTable::getList()` — получить `VAT_ID` и `VAT_INCLUDED` у товара,

-  `\Bitrix\Catalog\VatTable::getList()` — получить ставку НДС по `VAT_ID`.

```php
$productRow = \Bitrix\Catalog\ProductTable::getList([
    'select' => ['ID', 'VAT_ID', 'VAT_INCLUDED'],
    'filter' => ['=ID' => $productId],
    'limit' => 1,
])->fetch();

if (!$productRow)
{
    throw new \RuntimeException('Товар не найден в каталоге');
}

$vatRate = null;
if ((int)$productRow['VAT_ID'] > 0)
{
    $vatRow = \Bitrix\Catalog\VatTable::getList([
        'select' => ['ID', 'NAME', 'RATE', 'ACTIVE'],
        'filter' => ['=ID' => (int)$productRow['VAT_ID']],
        'limit' => 1,
    ])->fetch();

    if ($vatRow)
    {
        $vatRate = (float)$vatRow['RATE'];
    }
}
```

## Настроить единицы измерения

Единица измерения определяет, в чем продается товар: штуки, килограммы, литры, метры.

Коэффициент продажи задает, кратно какому числу можно заказать товар. Например, упаковка продается кратно 6 штукам.

### Создать единицу измерения {#create-measure}

Создайте единицу измерения через `\Bitrix\Catalog\MeasureTable::add()`. Например, отдельная единица нужна, если товар продается не поштучно, а упаковками. Передайте массив с полями:

-  `MEASURE_TITLE` — название единицы измерения,

-  `SYMBOL` — условное обозначение,

-  `CODE` — код единицы по международному классификатору,

-  `IS_DEFAULT` — признак единицы по умолчанию.

```php
$result = \Bitrix\Catalog\MeasureTable::add([
    'MEASURE_TITLE' => 'Упаковка',
    'SYMBOL'        => 'упак',
    'CODE'          => 796,
    'IS_DEFAULT'    => 'N',
]);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$measureId = (int)$result->getId();
```

Метод возвращает объект результата. Идентификатор созданной единицы измерения доступен через `$result->getId()`.

В примере `CODE = 796` — код единицы измерения по международному классификатору. Если используете другую единицу, передайте ее код.

### Получить единицы измерения

Получить все доступные единицы измерения можно с помощью `\Bitrix\Catalog\MeasureTable::getList()`. В `select` передайте поля единицы измерения, а в `order` — порядок сортировки.

```php
$measures = \Bitrix\Catalog\MeasureTable::getList([
    'select' => ['ID', 'CODE', 'MEASURE_TITLE', 'SYMBOL', 'IS_DEFAULT'],
    'order' => ['ID' => 'ASC'],
])->fetchAll();
```

### Получить единицу измерения по умолчанию

Классический метод `CCatalogMeasure::getDefaultMeasure()` возвращает единицу измерения по умолчанию. Первый параметр отвечает за использование текущего языка сайта. Второй параметр включает автоматическое создание единицы по умолчанию, если она еще не существует.

```php
$defaultMeasure = \CCatalogMeasure::getDefaultMeasure(true, true);
$defaultMeasureId = (int)$defaultMeasure['ID'];
```

### Назначить единицу измерения товару {#assign-measure-to-product}

Чтобы в товаре назначить единицу измерения, вызовите метод `\Bitrix\Catalog\Model\Product::update()`. Первым параметром передайте идентификатор товара, во втором укажите поле `MEASURE` с идентификатором единицы измерения.

```php
$result = \Bitrix\Catalog\Model\Product::update($productId, [
    'MEASURE' => $measureId,
]);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

В примере `$productId` — идентификатор товара или торгового предложения, а `$measureId` — идентификатор единицы измерения, полученный после создания или из списка единиц измерения.

### Задать коэффициент {#set-measure-ratio}

Коэффициент показывает, какими порциями продается товар. Коэффициент хранится в таблице `\Bitrix\Catalog\MeasureRatioTable` и привязывается к товару через поле `PRODUCT_ID`.

Примеры значений:

-  `RATIO = 1` — товар можно купить по 1 штуке, это стандартное значение,

-  `RATIO = 6` — товар продается кратно 6, покупатель может заказать 6, 12, 18 штук, но не 5 или 7,

-  `RATIO = 0.1` — товар продается кратно 0.1, покупатель может заказать дробное количество товара.

Чтобы назначить коэффициент товару, проверьте, есть ли у товара уже назначенный коэффициент. Найдите запись в `MeasureRatioTable` по `PRODUCT_ID` с признаком `IS_DEFAULT = Y`.

-  Если запись существует, обновите поле `RATIO` с помощью `\Bitrix\Catalog\MeasureRatioTable::update()`.

-  Если записи нет, создайте новую с помощью `\Bitrix\Catalog\MeasureRatioTable::add()`.

```php
$ratioValue = 6; // Товар продается кратно 6 штукам

// Проверяем, есть ли у товара коэффициент по умолчанию
$ratioRow = \Bitrix\Catalog\MeasureRatioTable::getList([
    'select' => ['ID'],
    'filter' => [
        '=PRODUCT_ID' => $productId, // идентификатор товара или торгового предложения
        '=IS_DEFAULT' => 'Y',        // коэффициент по умолчанию
    ],
    'limit' => 1, // нужна только одна запись
])->fetch();

// Обновляем существующий коэффициент или создаем новый
if ($ratioRow)
{
    // У товара есть коэффициент -- обновляем его
    $result = \Bitrix\Catalog\MeasureRatioTable::update((int)$ratioRow['ID'], [
        'RATIO' => $ratioValue,
    ]);
}
else
{
    // У товара нет коэффициента -- создаем новый
    $result = \Bitrix\Catalog\MeasureRatioTable::add([
        'PRODUCT_ID' => $productId,
        'RATIO'      => $ratioValue,
        'IS_DEFAULT' => 'Y',
    ]);
}

// Проверяем результат
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

`$ratioValue` — шаг продажи товара. Например, значение `6` означает, что покупатель сможет заказать 6, 12, 18 единиц товара, но не 5 или 7. `$productId` — идентификатор товара или торгового предложения, для которого задается шаг продажи.

### Получить текущий коэффициент

Чтобы проверить текущий коэффициент товара, используйте метод `getCurrentRatio()`. Он принимает массив идентификаторов товаров и возвращает массив, где ключ — идентификатор товара, а значение — коэффициент.

```php
$ratios = \Bitrix\Catalog\MeasureRatioTable::getCurrentRatio([$productId]);
$productRatio = $ratios[$productId] ?? 1; // Если коэффициента нет, считаем равным 1
```

## Продолжить изучение

-  [Работа с товарами и торговыми предложениями](./products-and-offers.md)

-  [Доступность, цены и подписка](./availability-prices-subscription.md)

-  [Складской учет](./inventory-management.md)
