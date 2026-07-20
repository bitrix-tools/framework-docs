---
title: Доступность, цены и подписка
description: 'Доступность, цены и подписка. Модуль Торговый каталог Bitrix: остатки, цены, доступность товаров и подписки на появление.'
---

Модуль Торговый каталог управляет товарными параметрами: остатками, доступностью, ценами и подписками.

Система рассчитывает доступность товара по остатку и настройкам учета. При покупке товара модуль дополнительно проверяет активность элемента, даты публикации и права пользователя на типы цен.

В примерах кода статьи используются три типа идентификаторов:

-  `$productId` — идентификатор простого товара или родительской карточки,

-  `$offerId` — идентификатор торгового предложения,

-  `$basePriceTypeId` — идентификатор базового типа цены.

Чтобы изменить один вариант товара, передавайте его `$offerId`. Если передать `$productId`, изменения применятся к родительской карточке и затронут все варианты.

## Доступность и остатки

Остатки определяют количество единиц товара для заказа. Доступность влияет на отображение кнопки В корзину на сайте.

### Обновить остаток и доступность {#update-stock-availability}

Если в настройках магазина отключен складской учет, обновляйте остатки товаров с помощью `\Bitrix\Catalog\Model\Product::update`. Метод принимает идентификатор товара и массив с полями:

-  `QUANTITY` — общий остаток товара,

-  `QUANTITY_TRACE` — вести количественный учет: Y или N,

-  `CAN_BUY_ZERO` — разрешить покупку при нулевом остатке: Y или N.

```php
$result = \Bitrix\Catalog\Model\Product::update($productId, [
    'QUANTITY'       => 20,
    'QUANTITY_TRACE' => 'Y',
    'CAN_BUY_ZERO'   => 'N',
]);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Метод возвращает объект `\Bitrix\Main\Result`. После успешного вызова система автоматически пересчитывает флаг доступности.

Правила расчета доступности:

-  простой товар становится недоступным, если включен учет остатка, запрещена покупка при нуле и количество меньше или равно нулю,

-  предложение становится недоступным по тем же правилам,

-  товар с предложениями становится недоступным, если недоступны все его варианты.

{% note warning "" %}

Флаг доступности не гарантирует покупку. Компоненты вывода и корзина проверяют активность элемента, даты публикации, права пользователя и доступность цен для текущей группы.

{% endnote %}

#### Работать с торговыми предложениями

Товары с торговыми предложениями хранят остаток и доступность на уровне каждого варианта. Используйте `$offerId` вместо `$productId`.

```php
$result = \Bitrix\Catalog\Model\Product::update($offerId, [
    'QUANTITY'       => 7,
    'QUANTITY_TRACE' => 'Y',
    'CAN_BUY_ZERO'   => 'N',
]);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Метод возвращает объект результата. После успешного вызова обновляются поля предложения и пересчитывается доступность родительского товара.

### Разрешить отрицательный остаток

Отрицательный остаток нужен, когда товар можно продать до фактического поступления на склад. Например, для предзаказа или продажи под будущую поставку. В этом сценарии остаток товара может стать меньше нуля, но правила покупки все равно должны быть заданы явно.

За продажу при недостатке остатка отвечают три поля товарной записи:

-  `QUANTITY_TRACE` — учитывать количество товара при продаже: `Y`, `N` или `D`,

-  `CAN_BUY_ZERO` — разрешить покупку при нулевом остатке: `Y`, `N` или `D`,

-  `NEGATIVE_AMOUNT_TRACE` — разрешить отрицательный остаток: `Y`, `N` или `D`.

Значение `D` означает, что товар берет правило из настроек модуля Торговый каталог. Если нужно зафиксировать поведение для конкретного товара, задайте `Y` или `N` явно.

Чтобы товар можно было купить при нуле и увести остаток в минус, включите учет количества, разрешите покупку при нулевом остатке и разрешите отрицательный остаток.

```php
$result = \Bitrix\Catalog\Model\Product::update($productId, [
    'QUANTITY_TRACE'        => 'Y',
    'CAN_BUY_ZERO'          => 'Y',
    'NEGATIVE_AMOUNT_TRACE' => 'Y',
]);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Для товара с торговыми предложениями передавайте в метод идентификатор предложения `$offerId`. Если настроить только родительскую карточку, покупка конкретного варианта может продолжить работать по правилам самого предложения.

### Проверить доступность товара {#check-product-availability}

Чтобы получить актуальное состояние товара перед выводом на странице или перед расчетами, используйте `\Bitrix\Catalog\ProductTable::getList()`. В метод передайте:

-  `select` — какие поля вернуть, например, `ID`, `AVAILABLE`, `QUANTITY`, `SUBSCRIBE`,

-  `filter` — фильтр по товару: `=ID => $productId`,

-  `limit` — значение `1` для ограничения выборки одной записью.

```php
$productRow = \Bitrix\Catalog\ProductTable::getList([
    'select' => ['ID', 'AVAILABLE', 'QUANTITY', 'SUBSCRIBE'],
    'filter' => ['=ID' => $productId],
    'limit' => 1,
])->fetch();

if (!$productRow)
{
    throw new \RuntimeException('Товар не найден');
}
```

Метод возвращает массив с полями товара:

-  `AVAILABLE` — показывает текущую доступность: `Y` или `N`,

-  `QUANTITY` — хранит актуальный остаток,

-  `SUBSCRIBE` — указывает, разрешена ли подписка на поступление.

## Цены

Цены товаров хранятся в отдельной таблице и привязаны к типу цены. Один товар может содержать розничную, оптовую и валютную цены одновременно.

{% note warning "" %}

Не используйте `PRICE_SCALE` как исходную цену товара. При добавлении и изменении цены передавайте `PRICE` и `CURRENCY` через API каталога. Система пересчитает `PRICE_SCALE` по валюте и текущему курсу. Если в проекте меняются курсы валют, проверьте, что зависимые цены и сортировка по цене пересчитались корректно.

{% endnote %}

### Получить цены товара {#get-product-prices}

Чтобы получить все цены товара, вызовите `\Bitrix\Catalog\PriceTable::getList()`. В метод передайте:

-  `select` — список полей цены,

-  `filter` — фильтр по товару: `=PRODUCT_ID => $productId`,

-  `order` — сортировка, например, по `CATALOG_GROUP_ID`.

```php
$prices = \Bitrix\Catalog\PriceTable::getList([
    'select' => [
        'ID',
        'PRODUCT_ID',
        'CATALOG_GROUP_ID',
        'PRICE',
        'CURRENCY',
    ],
    'filter' => [
        '=PRODUCT_ID' => $productId,
    ],
    'order' => [
        'CATALOG_GROUP_ID' => 'ASC',
    ],
])->fetchAll();
```

Метод `fetchAll()` возвращает массив строк. Каждая строка — отдельная цена с типом, суммой и валютой. Массив содержит столько элементов, сколько типов цен настроено для товара.

### Изменить цену товара {#update-product-price}

Чтобы не создать дубли цены, сделайте проверку существующей записи. Найдите цену по паре `PRODUCT_ID` и `CATALOG_GROUP_ID` через `getList()`. Если запись существует, вызовите `update()`. Если нет — создайте новую через `add()`.

Параметры для методов:

-  `update()` — идентификатор записи цены `$price['ID']` и массив полей: `PRICE`, `CURRENCY`,

-  `add()` — массив полей: `PRODUCT_ID`, `CATALOG_GROUP_ID`, `PRICE`, `CURRENCY`.

```php
$price = \Bitrix\Catalog\Model\Price::getList([
    'select' => ['ID'],
    'filter' => [
        '=PRODUCT_ID' => $productId,
        '=CATALOG_GROUP_ID' => $basePriceTypeId,
    ],
])->fetch();

if ($price)
{
    $result = \Bitrix\Catalog\Model\Price::update((int)$price['ID'], [
        'PRICE'    => 1350.00,
        'CURRENCY' => 'RUB',
    ]);
}
else
{
    $result = \Bitrix\Catalog\Model\Price::add([
        'PRODUCT_ID'       => $productId,
        'CATALOG_GROUP_ID' => $basePriceTypeId,
        'PRICE'            => 1350.00,
        'CURRENCY'         => 'RUB',
    ]);
}

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Метод `add()` или `update()` возвращает объект `Result`. Операция создает или обновляет цену для выбранной пары товара и типа цены.

### Создать диапазонные цены {#create-quantity-prices}

Используйте диапазонные цены для оптовых продаж и акций, когда сумма зависит от количества. Каждый диапазон — отдельная запись в таблице цен.

Для каждого диапазона вызовите метод `\Bitrix\Catalog\Model\Price::add()` с параметрами:

-  `PRODUCT_ID` — идентификатор товара,

-  `CATALOG_GROUP_ID` — тип цены,

-  `PRICE` и `CURRENCY` — сумма и валюта цены,

-  `QUANTITY_FROM` и `QUANTITY_TO` — границы диапазона, `null` означает без ограничения сверху.

```php
$result = \Bitrix\Catalog\Model\Price::add([
    'PRODUCT_ID'       => $productId,
    'CATALOG_GROUP_ID' => $basePriceTypeId,
    'PRICE'            => 1350.00,
    'CURRENCY'         => 'RUB',
    'QUANTITY_FROM'    => 1,
    'QUANTITY_TO'      => 9,
]);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$result = \Bitrix\Catalog\Model\Price::add([
    'PRODUCT_ID'       => $productId,
    'CATALOG_GROUP_ID' => $basePriceTypeId,
    'PRICE'            => 1200.00,
    'CURRENCY'         => 'RUB',
    'QUANTITY_FROM'    => 10,
    'QUANTITY_TO'      => null,
]);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Следите, чтобы диапазоны не пересекались.

### Получить цену для количества {#get-quantity-price}

Чтобы узнать, какая диапазонная цена применится к конкретному объему, вызовите `CCatalogProduct::GetNearestQuantityPrice`. Метод принимает:

-  идентификатор товара,

-  количество для расчета,

-  массив групп пользователя.

```php
global $USER;

$userGroups = $USER->GetUserGroupArray();

$quantityPrice = \CCatalogProduct::GetNearestQuantityPrice(
    $productId,
    12,
    $userGroups
);

if ($quantityPrice)
{
    echo $quantityPrice['PRICE'];
}
```

Метод возвращает массив с данными цены или `false`, если подходящий диапазон не найден. Используйте этот вызов для предварительного расчета суммы в каталоге товаров или в корзине.

### Рассчитать итоговую цену со скидками {#final-price}

Чтобы получить финальную стоимость с учетом прав, персональных скидок и купонов, используйте `CCatalogProduct::GetOptimalPrice()`. Передайте в метод:

-  идентификатор товара,

-  количество товара,

-  массив групп пользователя,

-  флаг `N` для товара,

-  массив цен, по которым выполнить пересчет,

-  код сайта.

{% note info "" %}

Метод `CCatalogProduct::GetOptimalPrice()` относится к классическому API, но остается стандартным способом получить итоговую цену. Для создания и обновления цен используйте `\Bitrix\Catalog\Model\Price`.

{% endnote %}

```php
global $USER;

$userGroups = $USER->GetUserGroupArray();

$optimalPrice = \CCatalogProduct::GetOptimalPrice(
    $productId,
    1,
    $userGroups,
    'N',
    [], // пересчет по всем ценам из базы
    SITE_ID
);

if ($optimalPrice)
{
    echo $optimalPrice['RESULT_PRICE']['DISCOUNT_PRICE'];
}
```

Метод возвращает массив с исходной ценой, итоговой ценой и примененными скидками. Если расчет невозможен, вернется `false`.

### Округлить цену по правилам {#round-price-rules}

Типы цен содержат правила округления, например, до целых или до 99 копеек. Используйте эти правила программно через `\Bitrix\Catalog\Product\Price::roundPrice`. В метод передайте:

-  идентификатор типа цены,

-  исходное значение цены,

-  код валюты.

```php
$roundedPrice = \Bitrix\Catalog\Product\Price::roundPrice(
    $basePriceTypeId,
    1250.37,
    'RUB'
);
```

Для технического округления без привязки к настройкам типа цены используйте метод `roundValue()` с параметрами:

-  значение для округления,

-  точность,

-  режим округления, например `\Bitrix\Catalog\RoundingTable::ROUND_DOWN`.

```php
$roundedValue = \Bitrix\Catalog\Product\Price::roundValue(
    555.9,
    1,
    \Bitrix\Catalog\RoundingTable::ROUND_DOWN
);
```

Чтобы получить текущие правила округления, вызовите `getRoundRules()` с идентификатором типа цены.

```php
$rules = \Bitrix\Catalog\Product\Price::getRoundRules($basePriceTypeId);
```

Методы `roundPrice()` и `roundValue()` возвращают округленное числовое значение, `getRoundRules()` — массив правил округления.

## Подписка на поступление

С помощью подписок покупатели получают уведомления, когда отсутствующий товар снова появляется на складе.

### Подписать пользователя на наличие товара {#subscribe-product-availability}

Чтобы оформить подписку, создайте экземпляр `\Bitrix\Catalog\Product\SubscribeManager` и вызовите метод `addSubscribe()`. Передайте массив с параметрами:

-  `USER_CONTACT` — email или телефон пользователя,

-  `ITEM_ID` — идентификатор товара или предложения,

-  `SITE_ID` — код сайта,

-  `CONTACT_TYPE` — тип контакта из `\Bitrix\Catalog\SubscribeTable`,

-  `USER_ID` — идентификатор авторизованного пользователя.

{% note info "" %}

Для гостей не передавайте поле USER_ID.

{% endnote %}

```php
$subscribeManager = new \Bitrix\Catalog\Product\SubscribeManager;

$subscribeId = $subscribeManager->addSubscribe([
    'USER_CONTACT' => 'client@example.ru',
    'ITEM_ID'      => $productId,
    'SITE_ID'      => 's1',
    'CONTACT_TYPE' => \Bitrix\Catalog\SubscribeTable::CONTACT_TYPE_EMAIL,
    'USER_ID'      => 15,
]);

if (!$subscribeId)
{
    $error = current($subscribeManager->getErrors());
    $message = $error ? $error->getMessage() : 'Не удалось добавить подписку';

    throw new \RuntimeException($message);
}
```

Метод возвращает идентификатор созданной подписки или `false`, если операция завершилась ошибкой.

### Проверить существующую подписку

Перед созданием подписки можно проверить, есть ли у пользователя активная подписка на этот товар. Активной считается запись, у которой `DATE_TO` не заполнена или дата окончания еще не наступила.

```php
$subscribeRow = \Bitrix\Catalog\SubscribeTable::getList([
    'select' => ['ID', 'ITEM_ID', 'USER_CONTACT', 'DATE_TO', 'NEED_SENDING'],
    'filter' => [
        '=ITEM_ID' => $productId,
        '=USER_CONTACT' => 'client@example.ru',
        '=CONTACT_TYPE' => \Bitrix\Catalog\SubscribeTable::CONTACT_TYPE_EMAIL,
        [
            'LOGIC' => 'OR',
            '=DATE_TO' => false,
            '>DATE_TO' => new \Bitrix\Main\Type\DateTime(),
        ],
    ],
    'limit' => 1,
])->fetch();

if ($subscribeRow)
{
    $subscribeId = (int)$subscribeRow['ID'];
}
```

Метод `addSubscribe()` тоже проверяет дубли активных подписок. Если подписка с тем же контактом уже есть, метод вернет `false`. Текст ошибки можно получить через `$subscribeManager->getErrors()`.

### Отключить или удалить подписку

Если подписку нужно временно остановить, используйте `deactivateSubscription()`. Метод записывает в `DATE_TO` текущую дату, и подписка перестает считаться активной.

```php
$subscribeManager = new \Bitrix\Catalog\Product\SubscribeManager;

if (!$subscribeManager->deactivateSubscription([$subscribeId]))
{
    $error = current($subscribeManager->getErrors());
    $message = $error ? $error->getMessage() : 'Не удалось отключить подписку';

    throw new \RuntimeException($message);
}
```

Если подписку нужно удалить, используйте `deleteManySubscriptions()`. Метод проверяет доступ к подписке: администратор может удалить любую запись, авторизованный пользователь — свою, а гость — запись, доступную по токену в сессии.

```php
$subscribeManager = new \Bitrix\Catalog\Product\SubscribeManager;

if (!$subscribeManager->deleteManySubscriptions([$subscribeId], $productId))
{
    $error = current($subscribeManager->getErrors());
    $message = $error ? $error->getMessage() : 'Не удалось удалить подписку';

    throw new \RuntimeException($message);
}
```

Для ссылки отписки из письма используйте `unSubscribe()`. Метод проверяет `subscribeId`, `productId` и `userContact`, затем удаляет найденную подписку.

```php
$subscribeManager = new \Bitrix\Catalog\Product\SubscribeManager;

$unsubscribed = $subscribeManager->unSubscribe([
    'unSubscribe' => 'Y',
    'userContact' => 'client@example.ru',
    'subscribeId' => $subscribeId,
    'productId' => $productId,
]);

if (!$unsubscribed)
{
    $error = current($subscribeManager->getErrors());
    $message = $error ? $error->getMessage() : 'Не удалось отписать пользователя';

    throw new \RuntimeException($message);
}
```

### Отправить уведомления о поступлении

Когда доступность товара меняется с `N` на `Y`, модуль может пометить активные подписки флагом `NEED_SENDING = 'Y'` и запустить агент отправки уведомлений. Подписка участвует в отправке, если:

-  у товара разрешена подписка: поле `SUBSCRIBE = 'Y'` или `SUBSCRIBE = 'D'` и в настройках модуля подписка разрешена по умолчанию,

-  подписка активна: `DATE_TO` не заполнена или дата окончания больше текущей даты,

-  у подписки установлен `NEED_SENDING = 'Y'`,

-  для сайта не отключена отправка товарных подписок настройкой модуля Интернет-магазин.

Если нужно вручную поставить активные подписки товара в очередь отправки, вызовите `runAgentToSendNotice()`.

```php
if (!\Bitrix\Catalog\SubscribeTable::runAgentToSendNotice($productId))
{
    throw new \RuntimeException('Не удалось поставить уведомления в очередь');
}
```

Метод устанавливает `NEED_SENDING = 'Y'` для активных подписок товара и добавляет агент `\Bitrix\Catalog\SubscribeTable::sendNotice()`. Агент отправляет письма пакетами, использует почтовое событие `CATALOG_PRODUCT_SUBSCRIBE_NOTIFY` и после обработки сбрасывает `NEED_SENDING` обратно в `N`.

Повторные уведомления запускаются отдельно методом `runAgentToSendRepeatedNotice()`. Он работает, если в настройках модуля включена опция повторных уведомлений `subscribe_repeated_notify`.
