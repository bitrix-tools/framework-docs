---
title: Работа с корзиной
description: "Работа с корзиной. Создание, загрузка, изменение и пересчет корзины через D7 API модуля sale."
---

Корзина хранит товары, которые выбрал посетитель сайта: зарегистрированный пользователь или гость. В нее добавляют простые товары каталога или торговые предложения.

Перед оформлением заказа код проверяет позиции, пересчитывает цены и подготавливает данные для заказа.

В ядре D7 за корзину отвечает класс `\Bitrix\Sale\Basket`, за отдельную позицию — `\Bitrix\Sale\BasketItem`, за покупателя корзины — `\Bitrix\Sale\Fuser`.

## Жизненный цикл корзины

Работа с корзиной до создания заказа состоит из пяти шагов.

#|
|| **Шаг** | **API** | **Результат** ||
|| Определить покупателя | `\Bitrix\Sale\Fuser::getId()` | Возвращает `FUSER_ID`, к которому привязана корзина текущего посетителя ||
|| Загрузить или создать корзину | `\Bitrix\Sale\Basket::loadItemsForFUser()` или `\Bitrix\Sale\Basket::create()` | Код получает объект корзины для сайта ||
|| Добавить или изменить позицию | `Basket::createItem()`, `BasketItem::setField()`, `BasketItem::setFields()` | В объекте корзины появляется новая строка или меняются поля существующей строки ||
|| Пересчитать товарные данные | `Basket::refresh()` или `Basket::refreshData()` | Корзина получает у провайдера каталога цену, доступность, вес, НДС и другие данные позиции ||
|| Сохранить изменения | `Basket::save()` | Записывает изменения в таблицы модуля `sale` и возвращает объект результата ||
|#

### Различить посетителя, пользователя и покупателя корзины

Посетитель сайта может быть гостем или зарегистрированным пользователем. У зарегистрированного пользователя есть учетная запись с идентификатором `USER_ID`.

Идентификатор `FUSER_ID` принадлежит покупателю корзины. Для гостя модуль создает запись без `USER_ID`. После авторизации модуль может связать покупателя корзины с учетной записью пользователя.

Запись покупателя корзины не создает профиль и не определяет присутствие пользователя в административном списке покупателей. Этот список строится по статистике покупателя. Профили и статистика описаны в статье [Покупатели и внутренние счета](./buyers-accounts.md#как-различать-данные-покупателя).

{% note warning "" %}

Если корзина уже привязана к заказу, не вызывайте `$basket->save()` отдельно. Пересчитайте связанные данные и сохраните весь заказ через `$order->save()`. Порядок действий описан в статье [Изменение и чтение заказа](./order-update.md#изменить-состав-корзины-заказа).

{% endnote %}

Для новых сценариев используйте D7-классы `\Bitrix\Sale\Basket`, `\Bitrix\Sale\BasketItem`, `\Bitrix\Sale\Fuser` и `\Bitrix\Sale\Internals\BasketTable`.

Классы классического ядра `CSaleBasket`, `CSaleBasketHelper`, `CSaleUser` и `CSaleProduct` оставлены для поддержки кода на старом API.

## Подготовить данные

Перед выполнением примеров подключите модули:

-  `sale` — хранит корзину и заказ,

-  `catalog` — возвращает товарные данные для позиции корзины.

```php
if (!\Bitrix\Main\Loader::includeModule('sale'))
{
    throw new \RuntimeException('Не удалось подключить модуль sale');
}

if (!\Bitrix\Main\Loader::includeModule('catalog'))
{
    throw new \RuntimeException('Не удалось подключить модуль catalog');
}
```

{% note info "" %}

Товар или торговое предложение создайте заранее по статье [Работа с товарами и торговыми предложениями](./../catalog/products-and-offers.md). Цены, доступность и остатки проверьте по статье [Доступность, цены и подписка](./../catalog/availability-prices-subscription.md).

{% endnote %}

### Поля для работы с позициями          {#basket-item-fields}

Позиция корзины хранит товар, количество и результат расчета. Эти поля встречаются в примерах ниже: часть полей задает разработчик, часть заполняет провайдер каталога после пересчета.

{% note tip "" %}

Полную карту хранения смотрите в статье [Схема работы интернет-магазина и основные объекты](./architecture.md#корзина).

{% endnote %}

#|
|| **Поле** | **Когда задавать** | **Роль в сценарии** ||
|| `PRODUCT_ID` | При создании позиции | Идентификатор продаваемого товара или торгового предложения ||
|| `MODULE` | При создании позиции. Для товаров каталога используйте `catalog` | Показывает, какой модуль отвечает за товар ||
|| `QUANTITY` | При добавлении и изменении позиции | Количество товара. Значение должно быть больше нуля ||
|| `PRODUCT_PROVIDER_CLASS` | Обязательно при создании строки через `Basket::createItem()`. При использовании `\Bitrix\Catalog\Product\Basket::addProductToBasket()` провайдер подставляется автоматически | Указывает провайдер, который вернет цену, доступность, вес, НДС и другие товарные данные ||
|| `PRICE` и `CURRENCY` | Не задавайте вручную для товара каталога | Провайдер каталога заполняет цену и валюту после пересчета ||
|| `CAN_BUY` | Не задавайте вручную | Показывает, можно ли купить позицию после проверки товара провайдером ||
|| `ORDER_ID` | Не меняйте вручную. Модуль `sale` заполняет поле при оформлении заказа | Пустое значение означает позицию текущей корзины. Заполненное значение связывает позицию с заказом ||
|| `CUSTOM_PRICE` | Используйте только для сценариев с собственной ценой | Поле принимает строковые значения `Y` и `N`. Значение `Y` включает собственную цену: позиция хранит пользовательскую цену и не должна получать обычную цену каталога. Значение `N` отключает собственную цену и используется по умолчанию ||
|#

## Проверить товар перед добавлением в корзину

Карточка товара и позиция корзины решают разные задачи. Элемент инфоблока помогает найти товар по разделу, символьному коду или свойствам, но для продажи этого мало. Перед добавлением проверьте, что каталог видит элемент как товар или торговое предложение.

Сначала найдите карточку, затем проверьте товарные данные и только после этого передайте в корзину идентификатор продаваемого товара.

#|
|| **Уровень** | **За что отвечает** | **Что передает дальше** ||
|| Инфоблок | Хранит карточку: название, описание, изображения, свойства элемента | Идентификатор элемента, который может быть товаром или родительской карточкой ||
|| Торговый каталог | Хранит товарную запись, тип товара, цену, валюту, остаток, доступность, НДС, единицу измерения и связь с предложениями | Идентификатор продаваемого товара или предложения и товарные данные для провайдера ||
|| Корзина | Хранит выбор покупателя: товар, количество, свойства позиции, цену и состояние покупки на момент расчета | Позиции, которые затем переходят в заказ ||
|#

Если система ищет карточку через `CIBlockElement::GetList`, не передавайте найденный `ID` в корзину автоматически. Сначала проверьте, что у элемента есть товарная запись в каталоге.

В примере `$elementId = 123` — идентификатор элемента инфоблока, который код нашел на странице каталога.

```php
$elementId = 123;

$productRow = \Bitrix\Catalog\ProductTable::getList([
    'select' => ['ID'],
    'filter' => ['=ID' => $elementId],
    'limit' => 1,
])->fetch();

if (!$productRow)
{
    throw new \RuntimeException('У элемента нет товарной записи в каталоге');
}

$productId = (int)$productRow['ID'];
```

Передайте `$productId` в `PRODUCT_ID` при добавлении простого товара. Если найденная карточка имеет торговые предложения, выберите конкретное предложение и передайте в корзину идентификатор предложения.

Модуль `catalog` хранит настройки НДС и округления цены. Корзина берет подготовленные товарные данные и сохраняет результат в позиции.

{% note tip "" %}

Подробнее о НДС, типах цен и округлении читайте в статьях [Базовые настройки каталога](./../catalog/catalog-settings.md) и [Доступность, цены и подписка](./../catalog/availability-prices-subscription.md).

{% endnote %}

## Создать пустую корзину          {#create-empty-basket}

Пустая корзина нужна, когда заказ формируют без текущей корзины посетителя или позиции собирают отдельно.

Вызовите `\Bitrix\Sale\Basket::create()`. Метод создает объект корзины в памяти. Записи в базе появятся только после добавления позиций и вызова `save()`.

В метод передайте:

-  `$siteId` — идентификатор сайта, для которого код собирает корзину.

```php
$siteId = 's1'; // идентификатор сайта

$basket = \Bitrix\Sale\Basket::create($siteId);
```

После создания добавьте позиции через `createItem()` или передайте корзину в код, который собирает заказ.

## Получить корзину текущего посетителя                {#load-current-basket}

Чтобы работать с корзиной посетителя сайта, сначала получите `FUSER_ID`. Это внутренний идентификатор покупателя корзины. Метод `\Bitrix\Sale\Fuser::getId()` ищет покупателя в сессии, cookie и текущем пользователе. Если покупателя нет, метод создает его.

В `loadItemsForFUser()` передайте:

-  `$fuserId` — внутренний идентификатор покупателя корзины,

-  `$siteId` — идентификатор сайта.

```php
$siteId = 's1'; // идентификатор сайта
$fuserId = \Bitrix\Sale\Fuser::getId();

$basket = \Bitrix\Sale\Basket::loadItemsForFUser($fuserId, $siteId);
```

Метод загружает только позиции, которые еще не связаны с заказом. Он фильтрует строки по `FUSER_ID`, `LID` и пустому `ORDER_ID`.

Если нужно только проверить существование покупателя без создания новой записи, передайте `true` первым параметром. Тогда метод вернет `null`, если покупателя нет.

```php
$siteId = 's1'; // идентификатор сайта
$fuserId = \Bitrix\Sale\Fuser::getId(true);

if ($fuserId === null)
{
    $basket = \Bitrix\Sale\Basket::create($siteId);
}
else
{
    $basket = \Bitrix\Sale\Basket::loadItemsForFUser($fuserId, $siteId);
}
```

## Получить корзину заказа                {#load-order-basket}

После оформления заказа корзина становится частью заказа. В таком состоянии не загружайте ее как текущую корзину посетителя и не сохраняйте отдельно через `Basket::save()`.

В `Order::load()` передайте `$orderId` — идентификатор заказа.

В примере `$orderId = 1001`. Замените значение на идентификатор заказа из собственного проекта.

```php
$orderId = 1001;

$order = \Bitrix\Sale\Order::load($orderId);

if (!$order)
{
    throw new \RuntimeException('Заказ не найден');
}

$basket = $order->getBasket();
```

Если меняете позиции такой корзины, работайте с загруженным объектом заказа до завершения сценария. Изменение состава, количества или цены может затронуть распределение товаров по отгрузкам, стоимость доставки, скидки, налоги и суммы оплат.

При уменьшении количества сначала проверьте, сколько товара уже распределено по пользовательским отгрузкам. Модуль может автоматически изменить единственную доступную отгрузку. Если заказ разделен на несколько отгрузок или отгрузку уже нельзя редактировать, уменьшите количество в нужных позициях отгрузок до изменения позиции корзины. Иначе `BasketItem::setField()` вернет ошибку.

После изменения пересчитайте товарные данные, доставку и заказ. Затем приведите неоплаченные оплаты к новой стоимости и сохраните весь заказ через `Order::save()`. Полный порядок действий и пример описаны в статье [Изменение и чтение заказа](./order-update.md#изменить-состав-корзины-заказа).

## Добавить простой товар каталога                {#add-product}

В позицию корзины передайте идентификатор продаваемого товара из торгового каталога. Для простого товара это идентификатор элемента, у которого есть товарная запись в `catalog`.

### Добавить через каталог

Для кнопки добавления товара используйте метод `\Bitrix\Catalog\Product\Basket::addProductToBasket()`. Он сам задает модуль `catalog`, стандартный провайдер и заполняет товарные данные перед добавлением.

В метод передайте:

-  `$basket` — текущую корзину посетителя, которую пример загружает через `Basket::loadItemsForFUser()`,

-  `PRODUCT_ID` — идентификатор простого товара каталога, например `123`,

-  `QUANTITY` — количество товара,

-  `SITE_ID` — идентификатор сайта.

```php
$siteId = 's1'; // идентификатор сайта
$productId = 123;
$basket = \Bitrix\Sale\Basket::loadItemsForFUser(
    \Bitrix\Sale\Fuser::getId(),
    $siteId
);

$basketResult = \Bitrix\Catalog\Product\Basket::addProductToBasket(
    $basket,
    [
        'PRODUCT_ID' => $productId,
        'QUANTITY' => 1,
    ],
    [
        'SITE_ID' => $siteId,
    ]
);

if (!$basketResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $basketResult->getErrorMessages()));
}

$saveResult = $basket->save();

if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $saveResult->getErrorMessages()));
}

$basketItem = $basketResult->getData()['BASKET_ITEM'];
```

Метод возвращает объект результата. Добавленная позиция доступна в данных результата по ключу `BASKET_ITEM`.

После `addProductToBasket()` не нужно отдельно вызывать `refreshData()` для добавленной позиции. Метод уже получает данные товара через каталог. Сохраните корзину через `save()`, чтобы записать результат в базу.

По умолчанию метод ищет в корзине существующую позицию с тем же товаром и тем же набором свойств. Если позиция найдена, метод увеличивает ее количество. Чтобы всегда создавать отдельную строку, передайте опцию `USE_MERGE => 'N'`.

```php
$siteId = 's1'; // идентификатор сайта
$productId = 123;  // идентификатор товара
$basket = \Bitrix\Sale\Basket::loadItemsForFUser(
    \Bitrix\Sale\Fuser::getId(),
    $siteId
);

$basketResult = \Bitrix\Catalog\Product\Basket::addProductToBasket(
    $basket,
    [
        'PRODUCT_ID' => $productId,
        'QUANTITY' => 1,
    ],
    [
        'SITE_ID' => $siteId,
    ],
    [
        'USE_MERGE' => 'N',
    ]
);

if (!$basketResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $basketResult->getErrorMessages()));
}

$saveResult = $basket->save();

if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $saveResult->getErrorMessages()));
}
```

### Создать строку корзины через createItem()

Если нужно явно управлять созданием строки, используйте `Basket::createItem()`.

В метод и поля позиции передайте:

-  `catalog` — модуль, который отвечает за товар,

-  `$productId` — идентификатор продаваемого товара каталога, например, `123`,

-  `QUANTITY` — количество товара,

-  `PRODUCT_PROVIDER_CLASS` — класс провайдера, который вернет цену, доступность, вес, НДС и другие товарные данные.

Перед сохранением пересчитайте позицию. Вызов `refreshData([], $basketItem)` обновляет данные одной позиции. Без второго параметра метод пересчитает всю корзину.

```php
$siteId = 's1'; // идентификатор сайта
$productId = 123;
$basket = \Bitrix\Sale\Basket::loadItemsForFUser(
    \Bitrix\Sale\Fuser::getId(),
    $siteId
);

$basketItem = $basket->createItem('catalog', $productId);

$setFieldsResult = $basketItem->setFields([
    'QUANTITY' => 1,
    'PRODUCT_PROVIDER_CLASS' => \Bitrix\Catalog\Product\Basket::getDefaultProviderName(),
]);

if (!$setFieldsResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $setFieldsResult->getErrorMessages()));
}

$refreshResult = $basket->refreshData([], $basketItem);

if (!$refreshResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $refreshResult->getErrorMessages()));
}

$saveResult = $basket->save();

if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $saveResult->getErrorMessages()));
}
```

Для товаров каталога стандартный провайдер — `\Bitrix\Catalog\Product\CatalogProvider`. Метод `\Bitrix\Catalog\Product\Basket::getDefaultProviderName()` возвращает имя этого провайдера.

После пересчета провайдер каталога заполняет поля позиции, которые зависят от товара: цену, валюту, название, доступность к покупке, НДС, вес, единицу измерения и другие поддерживаемые поля. Набор заполненных данных зависит от настроек товара и каталога.

{% note warning "" %}

Передавайте в корзину только идентификатор продаваемого товара или торгового предложения. Результата `CIBlockElement::GetList` недостаточно: если у элемента нет товарной записи, цены или доступности в `catalog`, провайдер не сможет рассчитать корректную позицию для продажи.

{% endnote %}

## Добавить торговое предложение                {#add-offer}

Если товар имеет торговые предложения, в корзину добавляют выбранное предложение, а не родительскую карточку товара. Родительская карточка хранит общее описание, а предложение хранит продаваемый вариант: размер, цвет, цену и остаток.

Код почти не отличается от добавления простого товара. Меняется только идентификатор: в `PRODUCT_ID` передайте `$offerId` — конкретное предложение, которое выбрал покупатель.

В примере `$offerId = 456`. Замените значение на идентификатор предложения из собственного каталога.

```php
$siteId = 's1'; // идентификатор сайта
$offerId = 456;
$basket = \Bitrix\Sale\Basket::loadItemsForFUser(
    \Bitrix\Sale\Fuser::getId(),
    $siteId
);

$basketResult = \Bitrix\Catalog\Product\Basket::addProductToBasket(
    $basket,
    [
        'PRODUCT_ID' => $offerId,
        'QUANTITY' => 1,
    ],
    [
        'SITE_ID' => $siteId,
    ]
);

if (!$basketResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $basketResult->getErrorMessages()));
}

$saveResult = $basket->save();

if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $saveResult->getErrorMessages()));
}
```

Если создаете строку через `createItem()`, используйте тот же код, что и для простого товара каталога, но передайте идентификатор предложения: `$basket->createItem('catalog', $offerId)`.

Чтобы получить предложения товара, используйте API торгового каталога. Пример работы с предложениями смотрите в статье [Работа с товарами и торговыми предложениями](./../catalog/products-and-offers.md#get-product-offers).

## Изменить позиции корзины

Состав корзины меняют через объект `BasketItem`: обновляют количество, задают собственную цену, добавляют свойства или удаляют строку. После изменения сохраните корзину через `Basket::save()`. Если позиция уже входит в заказ, выполните связанный пересчет по сценарию из статьи [Изменение и чтение заказа](./order-update.md#изменить-состав-корзины-заказа) и сохраните заказ через `Order::save()`.

### Изменить количество                {#change-quantity}

Чтобы изменить количество, загрузите корзину, найдите позицию и вызовите `BasketItem::setField('QUANTITY', 3)`. В примере `3` — новое количество товара.

В примере код использует:

-  `$siteId` — идентификатор сайта,

-  `$basketItemId = 789` — идентификатор позиции корзины из таблицы `b_sale_basket`,

-  `QUANTITY` — новое количество товара.

```php
$siteId = 's1'; // идентификатор сайта
$basketItemId = 789;

$basket = \Bitrix\Sale\Basket::loadItemsForFUser(
    \Bitrix\Sale\Fuser::getId(),
    $siteId
);

$basketItem = $basket->getItemById($basketItemId);

if (!$basketItem)
{
    throw new \RuntimeException('Позиция корзины не найдена');
}

$quantityResult = $basketItem->setField('QUANTITY', 3);

if (!$quantityResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $quantityResult->getErrorMessages()));
}

$refreshResult = $basket->refreshData([], $basketItem);

if (!$refreshResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $refreshResult->getErrorMessages()));
}

$saveResult = $basket->save();

if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $saveResult->getErrorMessages()));
}
```

Количество должно быть больше нуля. Если передать ноль или отрицательное число и затем сохранить корзину, проверка позиции вернет ошибку.

### Задать собственную цену                {#custom-price}

Для товара каталога цена приходит из модуля `catalog`. Если проект сам рассчитывает стоимость, установите собственную цену в позиции корзины.

В позиции задайте:

-  `CUSTOM_PRICE = 'Y'`, чтобы включить собственную цену,

-  `PRICE` со значением цены, которую рассчитал код проекта,

-  `CURRENCY` с кодом валюты цены.

После этого пересчет не должен заменять поле `PRICE` обычной ценой каталога.

В примере `$basketItemId = 789` — идентификатор позиции корзины, `$customPrice = 1500.00` — собственная цена, `$currency = 'RUB'` — валюта цены.

```php
$siteId = 's1'; // идентификатор сайта
$basketItemId = 789;
$customPrice = 1500.00;
$currency = 'RUB';

$basket = \Bitrix\Sale\Basket::loadItemsForFUser(
    \Bitrix\Sale\Fuser::getId(),
    $siteId
);

$basketItem = $basket->getItemById($basketItemId);

if (!$basketItem)
{
    throw new \RuntimeException('Позиция корзины не найдена');
}

$priceResult = $basketItem->setFields([
    'CUSTOM_PRICE' => 'Y',
    'PRICE' => $customPrice,
    'CURRENCY' => $currency,
]);

if (!$priceResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $priceResult->getErrorMessages()));
}

$saveResult = $basket->save();

if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $saveResult->getErrorMessages()));
}
```

Если меняете собственную цену у позиции корзины заказа, дополнительно пометьте поле `PRICE` как пользовательское.

```php
$customPrice = 1500.00;

$basketItem->markFieldCustom('PRICE');
$priceResult = $basketItem->setField('PRICE', $customPrice);

if (!$priceResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $priceResult->getErrorMessages()));
}
```

После изменения пересчитайте заказ, согласуйте сумму неоплаченных оплат и сохраните объект через `Order::save()`. Порядок действий описан в статье [Изменение и чтение заказа](./order-update.md#изменить-состав-корзины-заказа).

Используйте собственную цену только в сценариях, где проект сам считает стоимость. Для обычных товаров каталога не меняйте `PRICE` напрямую. Провайдер каталога должен заполнить цену, валюту, НДС и скидочные поля.

### Получить цены позиции                {#basket-item-prices}

Если нужно вывести цену конкретной строки корзины, получите данные из объекта `BasketItem`. Так можно показать цену до скидки, итоговую цену, сумму скидки и признак включенного НДС.

Основные поля цены позиции:

-  `PRICE` — итоговая цена единицы позиции,

-  `BASE_PRICE` — базовая цена единицы позиции до скидки,

-  `DISCOUNT_PRICE` — сумма скидки на единицу позиции,

-  `VAT_INCLUDED` — признак, что НДС включен в цену. Поле хранит строковое значение `Y` или `N`.

В примере `$basketItemId = 789` — идентификатор позиции корзины из таблицы `b_sale_basket`.

```php
$siteId = 's1'; // идентификатор сайта
$basketItemId = 789;

$basket = \Bitrix\Sale\Basket::loadItemsForFUser(
    \Bitrix\Sale\Fuser::getId(),
    $siteId
);

$basketItem = $basket->getItemById($basketItemId);

if (!$basketItem)
{
    throw new \RuntimeException('Позиция корзины не найдена');
}

$priceData = [
    'PRICE' => $basketItem->getPrice(),
    'PRICE_WITH_VAT' => $basketItem->getPriceWithVat(),
    'BASE_PRICE' => $basketItem->getBasePrice(),
    'BASE_PRICE_WITH_VAT' => $basketItem->getBasePriceWithVat(),
    'DISCOUNT_PRICE' => $basketItem->getDiscountPrice(),
    'VAT_INCLUDED' => $basketItem->getField('VAT_INCLUDED') === 'Y',
    'CURRENCY' => $basketItem->getField('CURRENCY'),
];
```

Методы `getPriceWithVat()` и `getBasePriceWithVat()` возвращают цену с учетом НДС по настройкам позиции. Если НДС уже включен в цену, методы учитывают это при расчете.

### Добавить свойства позиции                {#basket-properties}

Свойства позиции переносят в заказ детали выбора: цвет, размер, имя получателя, параметры услуги или другой комментарий к конкретной строке.

Чтобы добавить одно свойство без замены остальных свойств позиции, получите коллекцию через `BasketItem::getPropertyCollection()` и создайте элемент коллекции.

В поля свойства передайте:

-  `NAME` — название свойства, которое увидит пользователь или менеджер заказа,

-  `CODE` — символьный код для поиска свойства в коде,

-  `VALUE` — значение свойства,

-  `SORT` — сортировку свойства в списке.

В примере `$basketItemId = 789` — идентификатор позиции корзины, к которой добавляется свойство.

```php
$siteId = 's1'; // идентификатор сайта
$basketItemId = 789;

$basket = \Bitrix\Sale\Basket::loadItemsForFUser(
    \Bitrix\Sale\Fuser::getId(),
    $siteId
);

$basketItem = $basket->getItemById($basketItemId);

if (!$basketItem)
{
    throw new \RuntimeException('Позиция корзины не найдена');
}

$propertyCollection = $basketItem->getPropertyCollection();

$propertyItem = $propertyCollection->createItem();
$propertyResult = $propertyItem->setFields([
    'NAME' => 'Размер',
    'CODE' => 'SIZE',
    'VALUE' => 'M',
    'SORT' => 100,
]);

if (!$propertyResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $propertyResult->getErrorMessages()));
}

$saveResult = $basket->save();

if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $saveResult->getErrorMessages()));
}
```

Если нужно заменить весь набор свойств позиции, используйте `redefine()`. Передайте список свойств, который должен остаться у позиции. Метод удалит свойства, которых нет в переданном массиве, кроме служебных свойств `CATALOG.XML_ID` и `PRODUCT.XML_ID`.

В примере `$basketItemId = 789` — идентификатор позиции корзины.

```php
$siteId = 's1'; // идентификатор сайта
$basketItemId = 789;

$basket = \Bitrix\Sale\Basket::loadItemsForFUser(
    \Bitrix\Sale\Fuser::getId(),
    $siteId
);

$basketItem = $basket->getItemById($basketItemId);

if (!$basketItem)
{
    throw new \RuntimeException('Позиция корзины не найдена');
}

$propertyCollection = $basketItem->getPropertyCollection();

$propertyCollection->redefine([
    [
        'NAME' => 'Размер',
        'CODE' => 'SIZE',
        'VALUE' => 'M',
        'SORT' => 100,
    ],
    [
        'NAME' => 'Комментарий',
        'CODE' => 'COMMENT',
        'VALUE' => 'Подарочная упаковка',
        'SORT' => 300,
    ],
]);

$saveResult = $basket->save();

if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $saveResult->getErrorMessages()));
}
```

#### Получить, изменить или удалить свойство

Чтобы вывести свойства позиции, переберите коллекцию из `getPropertyCollection()`. В примере `$basketItemId = 789` — идентификатор позиции корзины.

```php
$siteId = 's1'; // идентификатор сайта
$basketItemId = 789;

$basket = \Bitrix\Sale\Basket::loadItemsForFUser(
    \Bitrix\Sale\Fuser::getId(),
    $siteId
);

$basketItem = $basket->getItemById($basketItemId);

if (!$basketItem)
{
    throw new \RuntimeException('Позиция корзины не найдена');
}

$propertyCollection = $basketItem->getPropertyCollection();

foreach ($propertyCollection as $propertyItem)
{
    echo $propertyItem->getField('CODE') . ': ' . $propertyItem->getField('VALUE') . "\n";
}
```

Если известен идентификатор свойства, получите его через `getItemById()` и измените нужное поле.

В примере `$basketItemId = 789` — идентификатор позиции корзины, `$propertyId = 321` — идентификатор свойства этой позиции.

```php
$siteId = 's1'; // идентификатор сайта
$basketItemId = 789;
$propertyId = 321;

$basket = \Bitrix\Sale\Basket::loadItemsForFUser(
    \Bitrix\Sale\Fuser::getId(),
    $siteId
);

$basketItem = $basket->getItemById($basketItemId);

if (!$basketItem)
{
    throw new \RuntimeException('Позиция корзины не найдена');
}

$propertyCollection = $basketItem->getPropertyCollection();
$propertyItem = $propertyCollection->getItemById($propertyId);

if ($propertyItem)
{
    $propertyResult = $propertyItem->setField('VALUE', 'Новое значение');

    if (!$propertyResult->isSuccess())
    {
        throw new \RuntimeException(implode('; ', $propertyResult->getErrorMessages()));
    }
}

$saveResult = $basket->save();

if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $saveResult->getErrorMessages()));
}
```

Чтобы удалить свойство, получите элемент коллекции по `$propertyId`, вызовите `delete()` и сохраните корзину.

В примере `$basketItemId = 789` — идентификатор позиции корзины, `$propertyId = 321` — идентификатор свойства этой позиции.

```php
$siteId = 's1'; // идентификатор сайта
$basketItemId = 789;
$propertyId = 321;

$basket = \Bitrix\Sale\Basket::loadItemsForFUser(
    \Bitrix\Sale\Fuser::getId(),
    $siteId
);

$basketItem = $basket->getItemById($basketItemId);

if (!$basketItem)
{
    throw new \RuntimeException('Позиция корзины не найдена');
}

$propertyCollection = $basketItem->getPropertyCollection();
$propertyItem = $propertyCollection->getItemById($propertyId);

if ($propertyItem)
{
    $deleteResult = $propertyItem->delete();

    if (!$deleteResult->isSuccess())
    {
        throw new \RuntimeException(implode('; ', $deleteResult->getErrorMessages()));
    }
}

$saveResult = $basket->save();

if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $saveResult->getErrorMessages()));
}
```

### Удалить позицию                {#delete-item}

Чтобы удалить позицию, получите ее по `$basketItemId`, вызовите `BasketItem::delete()` и сохраните корзину.

В примере `$basketItemId = 789` — идентификатор строки корзины из таблицы `b_sale_basket`.

```php
$siteId = 's1'; // идентификатор сайта
$basketItemId = 789;

$basket = \Bitrix\Sale\Basket::loadItemsForFUser(
    \Bitrix\Sale\Fuser::getId(),
    $siteId
);

$basketItem = $basket->getItemById($basketItemId);

if (!$basketItem)
{
    throw new \RuntimeException('Позиция корзины не найдена');
}

$deleteResult = $basketItem->delete();

if (!$deleteResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $deleteResult->getErrorMessages()));
}

$saveResult = $basket->save();

if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $saveResult->getErrorMessages()));
}
```

Удаление меняет объект корзины в памяти. Запись в базе изменится после `save()`.

Если позиция уже входит в оформленный заказ, после `BasketItem::delete()` согласуйте отгрузки и оплаты, пересчитайте заказ и сохраните изменения через `$order->save()`. Полный порядок действий описан в статье [Изменение и чтение заказа](./order-update.md#изменить-состав-корзины-заказа).

### Очистить корзину                {#clear-basket}

Чтобы удалить все позиции, переберите элементы корзины, вызовите `delete()` для каждой позиции и сохраните корзину. Такой сценарий подходит для кнопки «Очистить корзину» или служебной очистки перед пересборкой состава заказа.

```php
$siteId = 's1'; // идентификатор сайта

$basket = \Bitrix\Sale\Basket::loadItemsForFUser(
    \Bitrix\Sale\Fuser::getId(),
    $siteId
);

foreach ($basket->getBasketItems() as $basketItem)
{
    $deleteResult = $basketItem->delete();

    if (!$deleteResult->isSuccess())
    {
        throw new \RuntimeException(implode('; ', $deleteResult->getErrorMessages()));
    }
}

$saveResult = $basket->save();

if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $saveResult->getErrorMessages()));
}
```

Не удаляйте строки корзины прямым запросом к `BasketTable`. Объектная модель должна обработать удаление позиций, свойства, события и связанные проверки.

## Найти существующие позиции товара                {#find-existing-items}

Один `PRODUCT_ID` может встречаться в корзине несколько раз: например, если у строк разные свойства или код создает отдельные позиции через `USE_MERGE => 'N'`. Поэтому ищите строки через `getExistsItems()` и не считайте, что товар в корзине всегда один.

В метод передайте:

-  `catalog` — модуль товара,

-  `$productId` — идентификатор продаваемого товара каталога, например, `123`.

```php
$siteId = 's1'; // идентификатор сайта
$productId = 123;
$basket = \Bitrix\Sale\Basket::loadItemsForFUser(
    \Bitrix\Sale\Fuser::getId(),
    $siteId
);

$items = $basket->getExistsItems('catalog', $productId);

foreach ($items as $basketItem)
{
    echo $basketItem->getField('NAME') . ': ' . $basketItem->getQuantity() . "\n";
}
```

В результате получите массив позиций с указанным модулем и товаром. Третий параметр принимает свойства, если нужно найти строки с конкретным набором свойств.

Если уже известен внутренний код строки, получите позицию через `getItemByBasketCode()`. Код строки возвращает метод `BasketItem::getBasketCode()`.

В примере `$basketItemId = 789` — идентификатор позиции, для которой нужно получить внутренний код.

```php
$siteId = 's1'; // идентификатор сайта
$basketItemId = 789;
$basket = \Bitrix\Sale\Basket::loadItemsForFUser(
    \Bitrix\Sale\Fuser::getId(),
    $siteId
);

$basketItem = $basket->getItemById($basketItemId);

if (!$basketItem)
{
    throw new \RuntimeException('Позиция корзины не найдена');
}

$basketCode = $basketItem->getBasketCode();
$sameBasketItem = $basket->getItemByBasketCode($basketCode);
```

## Получить вес и стоимость корзины                {#basket-totals}

Вес и стоимость нужны для предварительного вывода корзины, расчета доставки и проверки ограничений перед оформлением заказа. Загрузите корзину и получите значения из объекта `$basket`.

```php
$siteId = 's1'; // идентификатор сайта
$basket = \Bitrix\Sale\Basket::loadItemsForFUser(
    \Bitrix\Sale\Fuser::getId(),
    $siteId
);

$weight = $basket->getWeight();
$basePrice = $basket->getBasePrice();
$price = $basket->getPrice();
```

Методы возвращают:

-  `getWeight()` — общий вес позиций корзины,

-  `getBasePrice()` — стоимость без учета скидок и наценок,

-  `getPrice()` — стоимость с учетом примененных скидок и наценок.

До оформления заказа скидки в корзине остаются предварительными. Перед показом итоговой стоимости пересчитайте корзину и учтите, что сценарий создания заказа выполняет финальный расчет скидок.

### Рассчитать скидки для текущей корзины

Чтобы показать предварительную стоимость со скидками до создания заказа, рассчитайте скидки для корзины и примените результат к позициям.

В примере код выполняет три действия.

1. Создает контекст скидок для покупателя корзины.

2. Рассчитывает скидки для текущей корзины.

3. Применяет данные из `BASKET_ITEMS` к позициям корзины.

```php
$siteId = 's1'; // идентификатор сайта
$basket = \Bitrix\Sale\Basket::loadItemsForFUser(
    \Bitrix\Sale\Fuser::getId(),
    $siteId
);

$context = new \Bitrix\Sale\Discount\Context\Fuser($basket->getFUserId());
$discount = \Bitrix\Sale\Discount::buildFromBasket($basket, $context);

$discountResult = $discount->calculate();

if (!$discountResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $discountResult->getErrorMessages()));
}

$discountData = $discountResult->getData();

if (isset($discountData['BASKET_ITEMS']))
{
    $applyResult = $basket->applyDiscount($discountData['BASKET_ITEMS']);

    if (!$applyResult->isSuccess())
    {
        throw new \RuntimeException(implode('; ', $applyResult->getErrorMessages()));
    }
}
```

После `applyDiscount()` метод `getPrice()` вернет стоимость с примененными скидками для текущего объекта корзины. Сохраните корзину только тогда, когда эти значения нужно записать.

## Пересчитать корзину перед созданием заказа                {#refresh-before-order}

Перед созданием заказа пересчитайте корзину. Код обновит цену, доступность, остаток, НДС и другие данные, которые могли измениться после добавления товара.

В большинстве случаев вызовите `$basket->refreshData()`. Метод пересчитает все позиции через провайдера. Метод `RefreshFactory` пригодится, когда нужна явная стратегия: полный пересчет или пересчет одной строки по коду корзины.

Для полного пересчета подставьте:

-  `$siteId` — идентификатор сайта,

-  `TYPE_FULL` — стратегия полного пересчета корзины.

```php
$siteId = 's1'; // идентификатор сайта

$basket = \Bitrix\Sale\Basket::loadItemsForFUser(
    \Bitrix\Sale\Fuser::getId(),
    $siteId
);

$refreshResult = $basket->refresh(
    \Bitrix\Sale\Basket\RefreshFactory::create(
        \Bitrix\Sale\Basket\RefreshFactory::TYPE_FULL
    )
);

if (!$refreshResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $refreshResult->getErrorMessages()));
}

$saveResult = $basket->save();

if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $saveResult->getErrorMessages()));
}

$orderableBasket = $basket->getOrderableItems();
```

После полного пересчета вызовите `getOrderableItems()`. В результате получите позиции, которые можно передать в заказ.

Для создания заказа передайте:

-  `$siteId` — идентификатор сайта,

-  `$userId` — идентификатор пользователя, на которого оформляется заказ, например, `1`,

-  `$orderableBasket` — позиции корзины, доступные для заказа.

```php
$siteId = 's1'; // идентификатор сайта
$userId = 1;

$basket = \Bitrix\Sale\Basket::loadItemsForFUser(
    \Bitrix\Sale\Fuser::getId(),
    $siteId
);

$refreshResult = $basket->refreshData();

if (!$refreshResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $refreshResult->getErrorMessages()));
}

$orderableBasket = $basket->getOrderableItems();

$order = \Bitrix\Sale\Order::create($siteId, $userId);
$basketResult = $order->setBasket($orderableBasket);

if (!$basketResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $basketResult->getErrorMessages()));
}
```

После этого заполните тип плательщика, свойства, оплату и отгрузку. Полный сценарий оформления смотрите в статье [Создание заказа](./order-create.md).

Если нужно пересчитать одну строку, используйте `RefreshFactory::createSingle($basketItem->getBasketCode())` или `refreshData([], $basketItem)`.

{% note info "" %}

Метод `RefreshFactory` учитывает настройку `basket_refresh_gap` модуля `sale`. Если для позиции еще не наступил интервал обновления, стратегия может не запрашивать данные у провайдера повторно.

{% endnote %}

## Обработать события корзины                {#basket-events}

События модуля `sale` подключают бизнес-правила к уже готовым операциям корзины. Через обработчики можно проверить позицию перед сохранением, записать лог после изменения, отреагировать на удаление строки или изменить данные после пересчета провайдером.

#|
|| **Событие** | **Когда срабатывает** | **Что передает** ||
|| `OnSaleBasketBeforeSaved` | Перед сохранением корзины, которая не привязана к заказу | Объект корзины в параметре `ENTITY` ||
|| `OnSaleBasketSaved` | После сохранения корзины, которая не привязана к заказу | Объект корзины в параметре `ENTITY` ||
|| `OnSaleBasketItemBeforeSaved` | Перед сохранением позиции корзины | Позицию в `ENTITY`, признак новой позиции в `IS_NEW`, старые значения в `VALUES` ||
|| `OnSaleBasketItemSaved` | После сохранения позиции корзины | Позицию в `ENTITY`, признак новой позиции в `IS_NEW`, старые значения в `VALUES` ||
|| `OnSaleBasketItemEntitySaved` | После сохранения позиции как объекта системы заказов | Позицию в `ENTITY` и старые значения полей в `VALUES` ||
|| `OnSaleBasketItemRefreshData` | Во время пересчета позиции после получения данных от провайдера. Событие вызывается для каждой пересчитываемой позиции | Позицию и данные позиции, полученные от провайдера ||
|| `OnBeforeSaleBasketItemEntityDeleted` | Перед удалением позиции | Позицию и старые значения ||
|| `OnSaleBasketItemDeleted` | После удаления позиции при сохранении корзины | Массив значений удаленной позиции ||
|#

Обработчики событий сохранения и пересчета могут вернуть ошибочный `\Bitrix\Main\EventResult`. В таком случае `save()`, `refresh()` или `refreshData()` вернет ошибку в объекте результата. В коде проекта всегда проверяйте `isSuccess()` после этих методов.

Например, обработчик `OnSaleBasketItemBeforeSaved` может остановить сохранение позиции с количеством больше десяти.

```php
\Bitrix\Main\EventManager::getInstance()->addEventHandler(
    'sale',
    'OnSaleBasketItemBeforeSaved',
    static function (\Bitrix\Main\Event $event): \Bitrix\Main\EventResult
    {
        /** @var \Bitrix\Sale\BasketItem $basketItem */
        $basketItem = $event->getParameter('ENTITY');

        if ($basketItem->getQuantity() > 10)
        {
            return new \Bitrix\Main\EventResult(
                \Bitrix\Main\EventResult::ERROR,
                new \Bitrix\Sale\ResultError(
                    'Количество позиции не должно быть больше 10',
                    'BASKET_ITEM_QUANTITY_LIMIT'
                ),
                'sale'
            );
        }

        return new \Bitrix\Main\EventResult(\Bitrix\Main\EventResult::SUCCESS);
    }
);
```

## Прочитать позиции через ORM                {#basket-table}

Для списков, отчетов и служебных проверок используйте `\Bitrix\Sale\Internals\BasketTable`. Таблица хранит текущие корзины и позиции заказов. У текущей корзины поле `ORDER_ID` пустое. У позиции заказа в нем лежит идентификатор заказа.

В примере фильтр выбирает текущие позиции покупателя:

-  `FUSER_ID` — внутренний идентификатор покупателя корзины,

-  `LID` — идентификатор сайта,

-  `ORDER_ID => null` — признак позиции, которая еще не перешла в заказ.

```php
$siteId = 's1'; // идентификатор сайта

$rows = \Bitrix\Sale\Internals\BasketTable::getList([
    'select' => [
        'ID',
        'FUSER_ID',
        'ORDER_ID',
        'LID',
        'PRODUCT_ID',
        'NAME',
        'QUANTITY',
        'PRICE',
        'CURRENCY',
        'CAN_BUY',
    ],
    'filter' => [
        '=FUSER_ID' => \Bitrix\Sale\Fuser::getId(),
        '=LID' => $siteId,
        'ORDER_ID' => null,
    ],
    'order' => [
        'ID' => 'ASC',
    ],
])->fetchAll();
```

`BasketTable` подходит для чтения и отчетов. Для изменения корзины используйте объектную модель `Basket` и `BasketItem`, потому что она проверяет данные, вызывает события, сохраняет свойства и согласует позицию с заказом.

## Продолжить изучение

-  [Создание заказа](./order-create.md)

-  [Изменение и чтение заказа](./order-update.md)

-  [Работа с товарами и торговыми предложениями](./../catalog/products-and-offers.md)

-  [Доступность, цены и подписка](./../catalog/availability-prices-subscription.md)

-  [Базовые настройки каталога](./../catalog/catalog-settings.md)
