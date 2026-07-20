---
title: Работа с товарами и торговыми предложениями
description: 'Работа с товарами и торговыми предложениями. Модуль Торговый каталог Bitrix: создание товаров, предложений, цен и остатков.'
---

Товар каталога состоит из связанных данных: карточки в инфоблоке, товарной записи модуля `catalog`, цены и, при необходимости, торговых предложений. Карточка хранит название, код, активность и свойства. Товарная запись хранит тип товара, остаток и правила учета. Цена хранится отдельно и привязана к типу цены.

Базовый жизненный цикл товара включает создание простого товара, услуги, создание товара с торговыми предложениями, изменение карточки, товарных параметров и цены, а также удаление. Для товара без вариантов цена и остаток относятся к самому товару. Для товара с торговыми предложениями цена и остаток относятся к конкретному предложению, а родительская карточка хранит общее описание.

В примерах `$productId` обозначает простой товар или родительскую карточку, а `$offerId` — конкретное торговое предложение. Для простого товара цену и остаток меняют по `$productId`. Для товара с торговыми предложениями цену и остаток меняют по `$offerId`.

Значения в примерах демонстрационные: замените их на данные собственного проекта. Перед выполнением примеров подключите модули `iblock` и `catalog` и проверьте права на изменение инфоблоков и каталога.

## Создать простой товар в каталоге

Создайте простой товар, если у него нет вариантов: одна карточка, одна цена, один остаток. Например, книга без размеров и цветов. Для такой структуры хватает одного инфоблока, который зарегистрирован как торговый каталог.

### Создать инфоблок товаров {#create-product-iblock}

Создайте инфоблок с помощью `CIBlock::Add()`. Передайте в метод массив с параметрами:

-  `IBLOCK_TYPE_ID` — код существующего типа инфоблоков, например, `catalog`,

-  `NAME` — название нового инфоблока,

-  `CODE` — символьный код для обращения в коде,

-  `API_CODE` — код для работы через ORM инфоблоков, код должен быть уникальным в рамках типа инфоблоков,

-  `ACTIVE` — признак активности: `Y` или `N`,

-  `LID` — массив кодов сайтов для привязки, в примере используется сайт `s1`.

```php
$iblock = new \CIBlock;
$productIblockId = $iblock->Add([
    'IBLOCK_TYPE_ID' => 'catalog',
    'NAME'           => 'Каталог товаров',
    'CODE'           => 'products',
    'API_CODE'       => 'Products',
    'ACTIVE'         => 'Y',
    'LID'            => ['s1'],
]);

if (!$productIblockId)
{
    throw new \RuntimeException($iblock->getLastError()->getMessage());
}
```

Метод `Add()` возвращает идентификатор созданного инфоблока или `false` при ошибке. Сохраните идентификатор `$productIblockId`. Он понадобится на следующих шагах для регистрации каталога и добавления товаров.

### Сделать инфоблок торговым каталогом {#register-product-iblock-as-catalog}

Обычный инфоблок хранит карточки, но не работает с ценами, остатками и другими возможностями торгового каталога. Чтобы элементы инфоблока стали товарами, зарегистрируйте инфоблок в модуле `catalog` с помощью `CCatalog::Add()`.

Для простого каталога без торговых предложений параметры связи можно не передавать: по умолчанию они будут равны `0`. В примере они указаны явно:

-  `PRODUCT_IBLOCK_ID = 0` — нет отдельного инфоблока предложений,

-  `SKU_PROPERTY_ID = 0` — нет свойства привязки.

Дополнительные параметры:

-  `YANDEX_EXPORT` — использовать каталог в экспорте в Яндекс.Маркет: `Y` или `N`,

-  `SUBSCRIPTION` — разрешить подписку на поступление: `Y` или `N`,

-  `VAT_ID` — ставка НДС по умолчанию или `0`.

```php
$result = \CCatalog::Add([
    'IBLOCK_ID'      => $productIblockId,
    'YANDEX_EXPORT'  => 'N',
    'SUBSCRIPTION'   => 'Y',
    'VAT_ID'         => 0,
    'PRODUCT_IBLOCK_ID' => 0,
    'SKU_PROPERTY_ID'   => 0,
]);

if (!$result)
{
    throw new \RuntimeException('Не удалось создать торговый каталог');
}
```

После успешной регистрации инфоблок получает функции торгового каталога: цены, остатки, скидки.

### Создать товар {#create-product}

Создание товара состоит из двух шагов.

1. Создайте элемент инфоблока `$productId` через `CIBlockElement::Add()`.

2. Добавьте к нему товарные параметры через `\Bitrix\Catalog\Model\Product::add()`.

Пока не выполнен второй шаг, элемент инфоблока не считается товаром каталога.

Параметры товарной записи:

-  `TYPE` — тип товара: `TYPE_PRODUCT` для простого товара,

-  `QUANTITY` — общий остаток,

-  `QUANTITY_TRACE` — вести количественный учет: `Y` или `N`,

-  `CAN_BUY_ZERO` — разрешить покупку при нулевом остатке: `Y` или `N`,

-  `SUBSCRIBE` — разрешить подписку на поступление: `Y` или `N`.

```php
$element = new \CIBlockElement;
$productId = $element->Add([
    'IBLOCK_ID' => $productIblockId, // идентификатор инфоблока
    'NAME'      => 'Настольная лампа',
    'CODE'      => 'desk-lamp',
    'ACTIVE'    => 'Y',
]);

if (!$productId)
{
    throw new \RuntimeException($element->LAST_ERROR);
}

$result = \Bitrix\Catalog\Model\Product::add([
    'ID'              => $productId, // идентификатор элемента инфоблока
    'TYPE'            => \Bitrix\Catalog\ProductTable::TYPE_PRODUCT,
    'QUANTITY'        => 15,
    'QUANTITY_TRACE'  => 'Y',
    'CAN_BUY_ZERO'    => 'N',
    'SUBSCRIBE'       => 'Y',
]);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Метод `Product::add()` возвращает объект результата. После успешного выполнения идентификатор товара совпадает с `$productId` — идентификатором элемента инфоблока.

### Добавить цену товару {#add-price}

Цена хранится отдельно от товарных параметров. Добавьте цену через `\Bitrix\Catalog\Model\Price::add()`. В метод передайте:

-  `PRODUCT_ID` — идентификатор товара,

-  `CATALOG_GROUP_ID` — идентификатор типа цены,

-  `PRICE` — числовое значение цены,

-  `CURRENCY` — код валюты.

Идентификатор типа цены получите заранее и сохраните в переменной. Например, можно получить базовый тип цены `$basePriceTypeId`.

{% note tip "" %}

О том, как получить идентификатор типа цены, читайте в статье [Базовые настройки каталога](./catalog-settings.md).

{% endnote %}

```php
$result = \Bitrix\Catalog\Model\Price::add([
    'PRODUCT_ID'       => $productId, // идентификатор товара
    'CATALOG_GROUP_ID' => $basePriceTypeId,
    'PRICE'            => 1250.00,
    'CURRENCY'         => 'RUB',
]);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Метод `Price::add()` возвращает объект результата. Идентификатор созданной цены можно получить через `$result->getId()`.

В результате товар готов к продаже: у него есть карточка в инфоблоке, товарные параметры и цена.

## Создать услугу {#create-service}

Создавайте услугу, если продаете работу или цифровой результат без складского остатка: доставку, консультацию или доступ к сервису. Услуга остается элементом инфоблока, но в товарной записи получает тип `'TYPE' => \Bitrix\Catalog\ProductTable::TYPE_SERVICE`.

Сценарий создания услуги состоит из трех шагов.

1. Создайте элемент инфоблока через `CIBlockElement::Add()`.

2. Добавьте товарную запись через `\Bitrix\Catalog\Model\Product::add()` с типом `\Bitrix\Catalog\ProductTable::TYPE_SERVICE`.

3. Добавьте цену через `\Bitrix\Catalog\Model\Price::add()`.

Для услуги не нужно вести складской остаток. Если услуга продается по фиксированной цене, достаточно карточки, товарной записи с типом услуги и цены.

```php
$element = new \CIBlockElement;
$serviceId = $element->Add([
    'IBLOCK_ID' => $productIblockId, // идентификатор инфоблока
    'NAME'      => 'Настройка оборудования',
    'CODE'      => 'equipment-setup',
    'ACTIVE'    => 'Y',
]);

if (!$serviceId)
{
    throw new \RuntimeException($element->LAST_ERROR);
}

$productResult = \Bitrix\Catalog\Model\Product::add([
    'ID'   => $serviceId,
    'TYPE' => \Bitrix\Catalog\ProductTable::TYPE_SERVICE,
]);

if (!$productResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $productResult->getErrorMessages()));
}

$priceResult = \Bitrix\Catalog\Model\Price::add([
    'PRODUCT_ID'       => $serviceId,
    'CATALOG_GROUP_ID' => $basePriceTypeId,
    'PRICE'            => 3000.00,
    'CURRENCY'         => 'RUB',
]);

if (!$priceResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $priceResult->getErrorMessages()));
}
```

После успешного выполнения услуга доступна как продаваемая позиция каталога. Для проверки цены используйте сценарии из статьи [Доступность, цены и подписка](./availability-prices-subscription.md).

## Создать каталог с торговыми предложениями

Каталог с предложениями нужен, когда у товара есть варианты с разными параметрами: цвет, размер, комплектация, своя цена и свой остаток. Пример: диван в нескольких цветах.

Логика структуры каталога с предложениями:

-  основная карточка хранит родительский товар без цены и остатка,

-  каждое предложение хранит конкретный вариант, его цену и остаток.

Каталог с предложениями можно собрать за шесть шагов.

1. Создайте инфоблок товаров и инфоблок торговых предложений.

2. Создайте в инфоблоке предложений свойство привязки к товару.

3. Зарегистрируйте оба инфоблока как торговые каталоги и свяжите их через свойство привязки.

4. Создайте основной товар с типом `TYPE_SKU`.

5. Создайте торговое предложение с типом `TYPE_OFFER`.

6. Добавьте цену и остаток к торговому предложению, а не к основной карточке.

В результате будет два инфоблока:

-  инфоблок товаров — хранит основные карточки товаров,

-  инфоблок торговых предложений — хранит варианты товаров и свойство привязки к основному товару.

### Создать инфоблоки

Создайте два инфоблока через `CIBlock::Add()`: один для товаров, второй для предложений. У каждого должны быть уникальные `CODE` и `API_CODE`.

```php
$iblock = new \CIBlock;

$productIblockId = $iblock->Add([
    'IBLOCK_TYPE_ID' => 'catalog',        // код типа инфоблоков
    'NAME'           => 'Каталог мебели', // название инфоблока
    'CODE'           => 'furniture',      // символьный код
    'API_CODE'       => 'Furniture',      // код для работы через ORM
    'ACTIVE'         => 'Y',              // признак активности
    'LID'            => ['s1'],           // массив кодов сайтов для привязки
]);

if (!$productIblockId)
{
    throw new \RuntimeException($iblock->getLastError()->getMessage());
}

$offerIblockId = $iblock->Add([
    'IBLOCK_TYPE_ID' => 'catalog',
    'NAME'           => 'Торговые предложения мебели',
    'CODE'           => 'furniture_offers',
    'API_CODE'       => 'FurnitureOffers',
    'ACTIVE'         => 'Y',
    'LID'            => ['s1'],
]);

if (!$offerIblockId)
{
    throw new \RuntimeException($iblock->getLastError()->getMessage());
}
```

Каждый вызов `Add()` возвращает идентификатор созданного инфоблока или `false` при ошибке. Сохраните `$productIblockId` и `$offerIblockId` — они понадобятся для связи каталогов.

### Создать свойство привязки предложения к товару

В инфоблоке предложений создайте свойство-связку с товаром через `CIBlockProperty::Add()`. Это свойство будет хранить ссылку на родительский товар.

Ключевые параметры метода `CIBlockProperty::Add()`:

-  `IBLOCK_ID` — идентификатор инфоблока предложений `$offerIblockId`,

-  `NAME` — название свойства,

-  `CODE` — символьный код, используйте `CML2_LINK` для совместимости,

-  `PROPERTY_TYPE` — тип `E`: привязка к элементу,

-  `USER_TYPE` — тип `SKU`: специальный тип для торговых предложений,

-  `LINK_IBLOCK_ID` — идентификатор инфоблока товаров `$productIblockId`,

-  `MULTIPLE` — признак множественности: `N` для одного товара на предложение.

```php
$property = new \CIBlockProperty;
$skuPropertyId = $property->Add([
    'IBLOCK_ID'        => $offerIblockId,
    'NAME'             => 'Товар',
    'CODE'             => 'CML2_LINK',
    'PROPERTY_TYPE'    => 'E',
    'USER_TYPE'        => 'SKU',
    'LINK_IBLOCK_ID'   => $productIblockId,
    'MULTIPLE'         => 'N',
]);

if (!$skuPropertyId)
{
    throw new \RuntimeException($property->LAST_ERROR);
}
```

Метод возвращает идентификатор свойства или `false`. Сохраните `$skuPropertyId` — он нужен для регистрации каталога предложений.

### Связать каталоги

Зарегистрируйте оба инфоблока в модуле `catalog` через `CCatalog::Add()`.

Для инфоблока товаров укажите:

-  `PRODUCT_IBLOCK_ID = 0` — нет родительского инфоблока,

-  `SKU_PROPERTY_ID = 0` — нет свойства привязки.

Для инфоблока предложений укажите:

-  `PRODUCT_IBLOCK_ID` — идентификатор инфоблока товаров,

-  `SKU_PROPERTY_ID` — идентификатор свойства `CML2_LINK`.

```php
$productCatalogCreated = \CCatalog::Add([
    'IBLOCK_ID'      => $productIblockId,
    'YANDEX_EXPORT'  => 'N',
    'SUBSCRIPTION'   => 'Y',
    'VAT_ID'         => 0,
    'PRODUCT_IBLOCK_ID' => 0,
    'SKU_PROPERTY_ID'   => 0,
]);

if (!$productCatalogCreated)
{
    throw new \RuntimeException('Не удалось создать каталог товаров');
}

$offerCatalogCreated = \CCatalog::Add([
    'IBLOCK_ID'      => $offerIblockId,
    'YANDEX_EXPORT'  => 'N',
    'SUBSCRIPTION'   => 'Y',
    'VAT_ID'         => 0,
    'PRODUCT_IBLOCK_ID' => $productIblockId,
    'SKU_PROPERTY_ID'   => $skuPropertyId,
]);

if (!$offerCatalogCreated)
{
    throw new \RuntimeException('Не удалось создать каталог торговых предложений');
}
```

В результате инфоблок предложений становится полноценным каталогом. Каждое предложение получает собственные товарные параметры, цены и остатки.

### Создать основной товар {#create-main-product}

Создайте родительский товар в инфоблоке товаров через `CIBlockElement::Add()`. Затем добавьте товарные параметры и задайте тип `TYPE_SKU`. Это означает, что товар продается через предложения.

```php
$element = new \CIBlockElement;
$productId = $element->Add([
    'IBLOCK_ID' => $productIblockId, // идентификатор родительского инфоблока
    'NAME'      => 'Диван',
    'CODE'      => 'sofa',
    'ACTIVE'    => 'Y',
]);

if (!$productId)
{
    throw new \RuntimeException($element->LAST_ERROR);
}

$result = \Bitrix\Catalog\Model\Product::add([
    'ID'   => $productId,
    'TYPE' => \Bitrix\Catalog\ProductTable::TYPE_SKU,
]);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Метод `Product::add()` возвращает объект результата. После успешного выполнения товар `$productId` зарегистрирован как родительская карточка каталога.

Цену и остаток храните на предложениях. Родительская карточка обычно не участвует в расчете цены и остатка.

### Создать торговое предложение {#create-offer}

Создайте предложение в инфоблоке предложений через `CIBlockElement::Add()`. Обязательно заполните `CML2_LINK` — это связь с родительским товаром.

После создания элемента добавьте товарные параметры:

-  `TYPE` — тип `TYPE_OFFER` означает, что это вариант товара,

-  `QUANTITY` — остаток конкретного варианта,

-  `QUANTITY_TRACE`, `CAN_BUY_ZERO`, `SUBSCRIBE` — правила учета и подписки.

```php
$element = new \CIBlockElement;
$offerId = $element->Add([
    'IBLOCK_ID' => $offerIblockId, // идентификатор инфоблока предложений
    'NAME'      => 'Диван, цвет бежевый',
    'CODE'      => 'sofa-beige',
    'ACTIVE'    => 'Y',
    'PROPERTY_VALUES' => [
        'CML2_LINK' => $productId, // идентификатор основного товара
    ],
]);

if (!$offerId)
{
    throw new \RuntimeException($element->LAST_ERROR);
}

$result = \Bitrix\Catalog\Model\Product::add([
    'ID'              => $offerId,
    'TYPE'            => \Bitrix\Catalog\ProductTable::TYPE_OFFER,
    'QUANTITY'        => 7,
    'QUANTITY_TRACE'  => 'Y',
    'CAN_BUY_ZERO'    => 'N',
    'SUBSCRIBE'       => 'Y',
]);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

### Добавить цену торговому предложению

Добавьте цену торговому предложению с помощью `\Bitrix\Catalog\Model\Price::add()` как [для простого товара](#add-price), но в `PRODUCT_ID` передайте идентификатор предложения `$offerId`.

{% note warning "" %}

Типичная ошибка — добавить цену к основному товару с типом `TYPE_SKU`, а не к предложению. В этом случае цена не попадет в расчет при выборе конкретного варианта. Всегда передавайте в `PRODUCT_ID` идентификатор предложения `$offerId`.

{% endnote %}

```php
$result = \Bitrix\Catalog\Model\Price::add([
    'PRODUCT_ID'       => $offerId,
    'CATALOG_GROUP_ID' => $basePriceTypeId, // идентификатор типа цены
    'PRICE'            => 1500.00,
    'CURRENCY'         => 'RUB',
]);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Метод возвращает объект результата. Идентификатор созданной цены доступен через `$result->getId()`.

### Получить торговые предложения товара {#get-product-offers}

Самый простой способ получить предложения — использовать метод `CCatalogSKU::getOffersList()`.

Параметры метода:

-  `productID` — идентификатор товара или массив идентификаторов,

-  `iblockID` — идентификатор инфоблока предложений или `0` для автоопределения,

-  `skuFilter` — фильтр предложений,

-  `fields` — список полей для выборки.

```php
$offersByProduct = \CCatalogSKU::getOffersList(
    $productId,
    0,
    ['ACTIVE' => 'Y'],
    ['ID', 'NAME', 'IBLOCK_ID']
);

$offers = $offersByProduct[$productId] ?? [];
```

Метод `getOffersList()` возвращает массив, который сгруппирован по идентификаторам родительских товаров. В переменной `$offers` остаются предложения для `$productId`.

Для кастомного запроса сначала получите параметры связки инфоблоков через `CCatalogSKU::GetInfoByProductIBlock()`. Затем отфильтруйте элементы предложений по свойству привязки.

```php
$skuInfo = \CCatalogSKU::GetInfoByProductIBlock($productIblockId);

if (!$skuInfo)
{
    throw new \RuntimeException('Инфоблок не связан с торговыми предложениями');
}

$offersIterator = \CIBlockElement::GetList(
    [],
    [
        'IBLOCK_ID' => $skuInfo['IBLOCK_ID'],
        'PROPERTY_' . $skuInfo['SKU_PROPERTY_ID'] => $productId,
        'ACTIVE' => 'Y',
    ],
    false,
    false,
    ['ID', 'NAME']
);

while ($offer = $offersIterator->Fetch())
{
    echo $offer['ID'] . ': ' . $offer['NAME'] . "\n";
}
```

Метод `CIBlockElement::GetList()` возвращает итератор `CDBResult`. Метод `Fetch()` по шагам выдает строки предложений.

## Изменить товар

Товар состоит из нескольких частей. Перед обновлением определите, что именно нужно изменить: карточку инфоблока, товарные параметры, цену или настройки продажи.

#|
|| Что изменить | Метод ||
|| Название, символьный код, активность и свойства карточки | `CIBlockElement::Update()` ||
|| Тип товара, общий остаток, правила учета количества и подписки | `\Bitrix\Catalog\Model\Product::update()` ||
|| Цену | `\Bitrix\Catalog\Model\Price::update()` ||
|| НДС, единицу измерения и коэффициент продажи | `\Bitrix\Catalog\Model\Product::update()` и таблицы каталога. Подробнее смотрите в статье [Базовые настройки каталога](./catalog-settings.md) ||
|| Остатки, доступность и подписку | Методы товарных параметров. Подробные сценарии читайте в статье [Доступность, цены и подписка](./availability-prices-subscription.md) ||
|| Комплекты, наборы и скидки | `CCatalogProductSet` и методы скидок. Подробнее читайте в статье [Комплекты, наборы и скидки](./bundles-sets-discounts.md) ||
|#

### Изменить карточку товара

Чтобы изменить поля элемента инфоблока, используйте `CIBlockElement::Update()`. Метод подходит для названия, символьного кода, активности и свойств карточки. Передайте идентификатор элемента инфоблока и массив полей.

Для простого товара или родительской карточки передайте `$productId`. Родительскую карточку обновляйте, когда нужно изменить общее описание товара: название, код, активность или свойства, которые относятся ко всем вариантам.

`Настольная лампа с регулировкой` и `adjustable-desk-lamp` — примеры новых значений названия и символьного кода.

```php
$element = new \CIBlockElement;
$updated = $element->Update($productId, [
    'NAME'   => 'Настольная лампа с регулировкой',
    'CODE'   => 'adjustable-desk-lamp',
    'ACTIVE' => 'Y',
]);

if (!$updated)
{
    throw new \RuntimeException($element->LAST_ERROR);
}
```

Для торгового предложения передайте в первый параметр `$offerId`, если нужно изменить карточку конкретного варианта.

### Изменить товарные параметры {#update-product-parameters}

Чтобы изменить данные модуля `catalog`, используйте `\Bitrix\Catalog\Model\Product::update()`. Метод меняет товарную запись, а не поля элемента инфоблока. Передайте идентификатор товара `$productId` или предложения `$offerId` и массив товарных полей.

```php
$result = \Bitrix\Catalog\Model\Product::update($productId, [
    'QUANTITY_TRACE' => 'Y',
    'CAN_BUY_ZERO'   => 'N',
    'SUBSCRIBE'      => 'Y',
]);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

{% note tip "" %}

Про правила обновления остатков читайте в статье [Доступность, цены и подписка](./availability-prices-subscription.md).

{% endnote %}

### Изменить цену без дублей

Цена хранится в отдельной записи. При изменении цены обновите существующую запись для пары `PRODUCT_ID` и `CATALOG_GROUP_ID`. Не создавайте новую для того же товара и типа цены.

Для простого товара в `PRODUCT_ID` используйте `$productId`. Для товара с торговыми предложениями используйте `$offerId`, потому что цена продаваемого варианта хранится на предложении.

Полный сценарий создания или обновления цены без дублей смотрите в статье [Доступность, цены и подписка](./availability-prices-subscription.md).

## Удалить товар

Перед удалением проверьте наличие торговых предложений. Если предложения существуют, удалите их сначала. Затем удалите родительскую карточку. Система не удаляет предложения автоматически вместе с родителем.

В примерах удаления `$productId` — идентификатор простого товара или родительского товара с предложениями.

### Удалить простой товар

Для простого товара без предложений используйте `CIBlockElement::Delete()`. В метод передайте идентификатор элемента инфоблока.

```php
if (!\CIBlockElement::Delete($productId))
{
    global $APPLICATION;
    $exception = $APPLICATION->GetException();
    $message = $exception ? $exception->GetString() : 'Не удалось удалить товар';

    throw new \RuntimeException($message);
}
```

Метод `CIBlockElement::Delete()` возвращает `true` при успешном удалении и `false` при ошибке. Он очищает данные из инфоблока и связанные товарные параметры модуля `catalog`.

### Удалить товар с торговыми предложениями {#delete-product-with-offers}

Чтобы удалить товар с торговыми предложениями, выполните три шага.

1. Получите список предложений через `CCatalogSKU::getOffersList()`.

2. Удалите каждое предложение в цикле с помощью `CIBlockElement::Delete()`.

3. Удалите родительскую карточку через `CIBlockElement::Delete()`.

```php
$offersByProduct = \CCatalogSKU::getOffersList(
    $productId,
    0,
    [],
    ['ID']
);

$offers = $offersByProduct[$productId] ?? [];

foreach ($offers as $offer)
{
    if (!\CIBlockElement::Delete((int)$offer['ID']))
    {
        global $APPLICATION;
        $exception = $APPLICATION->GetException();
        $message = $exception ? $exception->GetString() : 'Не удалось удалить торговое предложение';

        throw new \RuntimeException($message);
    }
}

if (!\CIBlockElement::Delete($productId))
{
    global $APPLICATION;
    $exception = $APPLICATION->GetException();
    $message = $exception ? $exception->GetString() : 'Не удалось удалить родительский товар';

    throw new \RuntimeException($message);
}
```

Цикл обрабатывает каждое предложение по идентификатору. После завершения цикла метод удаляет родительский элемент.

## Продолжить изучение

-  [Базовые настройки каталога](./catalog-settings.md)

-  [Доступность, цены и подписка](./availability-prices-subscription.md)

-  [Складской учет](./inventory-management.md)

-  [Комплекты, наборы и скидки](./bundles-sets-discounts.md)

-  [Как выбрать API торгового каталога](./choose-catalog-api.md)
