---
title: Комплекты, наборы и скидки
description: 'Комплекты, наборы и скидки. Модуль Торговый каталог Bitrix: составные товары, рекомендации, правила скидок и купоны.'
---

Комплекты помогают продавать один товар как состав из нескольких позиций, наборы показывают рекомендации «купить вместе», а скидки и купоны меняют итоговую цену товара при расчете.

Эти сценарии нужны, чтобы управлять составом покупки, сопутствующими товарами и правилами продажи.

{% note warning "" %}

Перед выполнением примеров подключите модули `iblock` и `catalog`. Для работы с купонами и расчета скидок дополнительно подключите модуль `sale`.

{% endnote %}

## Работать с комплектами и наборами

Класс `CCatalogProductSet` управляет двумя сценариями: комплектами товаров и наборами рекомендаций.

### Настроить комплект товаров

Комплект применяют, когда покупатель выбирает один товар, а система учитывает несколько позиций в его составе. Например, комплект «Рабочее место» включает стол, лампу и кресло.

После настройки такой товар можно показывать как одну продаваемую позицию с составом.

#### Создать товар-комплект {#create-product-set}

Сначала создайте обычный товар по статье [Работа с товарами и торговыми предложениями](products-and-offers.md). Затем смените его тип через `\Bitrix\Catalog\Model\Product::update()`. В примере `$productId` хранит идентификатор товара, который станет комплектом.

```php
$result = \Bitrix\Catalog\Model\Product::update($productId, [
    'TYPE' => \Bitrix\Catalog\ProductTable::TYPE_SET,
]);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Тип `TYPE_SET` регистрирует товар как составной. После этого система ожидает заполнения состава.

#### Добавить состав комплекта {#add-set-items}

Состав комплекта задают через `CCatalogProductSet::add()` с типом `TYPE_SET`. Заполните параметры перед вызовом метода.

1. В `ITEM_ID` передайте `$productId` — товар-комплект.
2. В `ITEMS` перечислите товары, которые входят в комплект. В примере это лампа `$lampProductId` и кресло `$chairProductId`.
3. Для каждого товара состава укажите количество в `QUANTITY` и порядок в `SORT`.
4. В `ACTIVE` передайте активность комплекта.

Ограничения состава:

- массив `ITEMS` не должен быть пустым,
- `ITEM_ID` основного товара и вложенных товаров должен быть положительным числом,
- `QUANTITY` должен быть больше `0`,
- один и тот же товар нельзя добавить в состав дважды,
- в комплект можно включать товары и торговые предложения.

Метод может вернуть ошибку, если товар не существует, массив `ITEMS` пустой, количество равно `0` или один товар повторяется в составе. В примере ошибки сохраняются в `$errors`, а в `$message` попадает первый текст ошибки или запасное сообщение.

```php
$setId = \CCatalogProductSet::add([
    'TYPE'    => \CCatalogProductSet::TYPE_SET,
    'ITEM_ID' => $productId,
    'ACTIVE'  => 'Y',
    'ITEMS'   => [
        [
            'ITEM_ID'  => $lampProductId,
            'QUANTITY' => 1,
            'SORT'     => 100,
        ],
        [
            'ITEM_ID'  => $chairProductId,
            'QUANTITY' => 1,
            'SORT'     => 200,
        ],
    ],
]);

if (!$setId)
{
    $errors = \CCatalogProductSet::getErrors();
    $message = $errors ? $errors[0]['text'] : 'Не удалось создать комплект';

    throw new \RuntimeException($message);
}
```

Метод возвращает идентификатор комплекта или `false`. Сохраните результат в `$setId`: он нужен для изменения и удаления комплекта. После успешного выполнения товар получает состав.

#### Получить состав комплекта {#get-set-items}

Список элементов комплекта возвращает `CCatalogProductSet::getAllSetsByProduct()`. Первым параметром передайте `$productId` — товар-комплект, вторым — тип `TYPE_SET`.

```php
$sets = \CCatalogProductSet::getAllSetsByProduct(
    $productId,
    \CCatalogProductSet::TYPE_SET
);
```

Метод возвращает массив комплектов и их состав для указанного товара. Если комплект не найден или параметры некорректны, метод возвращает `false`.

#### Изменить состав комплекта {#update-set-items}

Состав комплекта изменяет `CCatalogProductSet::update()`. Первым параметром передайте `$setId` — идентификатор комплекта, который вернул `CCatalogProductSet::add()`. Вторым параметром передайте массив с новым описанием состава.

Передавайте полный новый состав комплекта. Элементы, которых нет в массиве `ITEMS`, метод удалит из состава.

```php
$isUpdated = \CCatalogProductSet::update($setId, [
    'TYPE'    => \CCatalogProductSet::TYPE_SET,
    'ITEM_ID' => $productId,
    'ITEMS'   => [
        [
            'ITEM_ID'  => $lampProductId,
            'QUANTITY' => 2,
            'SORT'     => 100,
        ],
        [
            'ITEM_ID'  => $chairProductId,
            'QUANTITY' => 1,
            'SORT'     => 200,
        ],
    ],
]);

if (!$isUpdated)
{
    $errors = \CCatalogProductSet::getErrors();
    $message = $errors ? $errors[0]['text'] : 'Не удалось обновить комплект';

    throw new \RuntimeException($message);
}
```

Метод возвращает результат операции.

### Настроить набор рекомендаций {#recommendations-set}

Набор применяют для рекомендаций «купить вместе». Например, к ноутбуку показывают сумку и аксессуар. Набор не меняет состав продаваемого товара и не требует смены его типа. Такой набор можно использовать в блоке сопутствующих товаров.

#### Создать набор

Набор создают через `CCatalogProductSet::add()` с типом `TYPE_GROUP`. Заполните параметры перед вызовом метода.

1. В `ITEM_ID` передайте `$productId` — товар, для которого нужно показать рекомендации.
2. В `ITEMS` перечислите товары, которые рекомендуете купить вместе. В примере это сумка `$bagProductId` и аксессуар `$accessoryProductId`.
3. Для каждой рекомендации укажите количество в `QUANTITY` и порядок сортировки в `SORT`.
4. В `ACTIVE` передайте активность набора.

В набор можно включать товары, торговые предложения и комплекты.

Метод может вернуть ошибку, если товар не существует, массив `ITEMS` пустой, количество равно `0` или товар повторяется в наборе.

```php
$groupId = \CCatalogProductSet::add([
    'TYPE'    => \CCatalogProductSet::TYPE_GROUP,
    'ITEM_ID' => $productId,
    'ACTIVE'  => 'Y',
    'ITEMS'   => [
        [
            'ITEM_ID'  => $bagProductId,
            'QUANTITY' => 1,
            'SORT'     => 100,
        ],
        [
            'ITEM_ID'  => $accessoryProductId,
            'QUANTITY' => 1,
            'SORT'     => 200,
        ],
    ],
]);

if (!$groupId)
{
    $errors = \CCatalogProductSet::getErrors();
    $message = $errors ? $errors[0]['text'] : 'Не удалось создать набор';

    throw new \RuntimeException($message);
}
```

Метод возвращает идентификатор набора или `false`. Сохраните результат в `$groupId` — он нужен для изменения и удаления набора. После выполнения у товара появляется список рекомендованных позиций.

#### Получить набор товара

Список рекомендаций возвращает `CCatalogProductSet::getAllSetsByProduct()` с типом `TYPE_GROUP`. Передайте `$productId` — товар, для которого создали набор.

```php
$groups = \CCatalogProductSet::getAllSetsByProduct(
    $productId,
    \CCatalogProductSet::TYPE_GROUP
);
```

Метод возвращает массив наборов рекомендаций для товара `$productId`. Если набор не найден или параметры некорректны, метод возвращает `false`.

#### Изменить набор

Набор изменяет тот же метод `CCatalogProductSet::update()`. Передайте `$groupId` — идентификатор набора, который вернул `CCatalogProductSet::add()`, и новый массив `ITEMS`.

Передавайте полный новый список рекомендаций. Элементы, которых нет в массиве `ITEMS`, метод удалит из набора.

```php
$isUpdated = \CCatalogProductSet::update($groupId, [
    'TYPE'    => \CCatalogProductSet::TYPE_GROUP,
    'ITEM_ID' => $productId,
    'ITEMS'   => [
        [
            'ITEM_ID'  => $bagProductId,
            'QUANTITY' => 1,
            'SORT'     => 100,
        ],
    ],
]);

if (!$isUpdated)
{
    $errors = \CCatalogProductSet::getErrors();
    $message = $errors ? $errors[0]['text'] : 'Не удалось обновить набор';

    throw new \RuntimeException($message);
}
```

После успешного выполнения у товара остается набор с обновленным списком рекомендованных позиций.

### Удалить комплект или набор {#delete-set-or-group}

Комплект или набор можно удалить с помощью `CCatalogProductSet::delete()`. В метод передайте идентификатор комплекта или набора. В примере удаляется комплект по `$setId`.

```php
if (!\CCatalogProductSet::delete($setId))
{
    $errors = \CCatalogProductSet::getErrors();
    $message = $errors ? $errors[0]['text'] : 'Не удалось удалить комплект или набор';

    throw new \RuntimeException($message);
}
```

Чтобы удалить набор, передайте в тот же метод `$groupId`. После удаления проверьте результат через `CCatalogProductSet::getAllSetsByProduct()`.

При удалении комплекта метод возвращает основной товар к типу обычного товара. При удалении набора метод сбрасывает признак наличия набора, если у товара больше нет наборов.

## Работать со скидками и купонами

Скидка задает правило изменения цены, а купон ограничивает применение скидки кодом. В типичном сценарии разработчик создает скидку на товар, выпускает купон, добавляет код купона в расчет и проверяет, какие скидки доступны товару.

Порядок работы со скидкой и купоном:

1. Создайте скидку.
2. Создайте купон для скидки.
3. Включите использование купонов у скидки.
4. Добавьте код купона в расчет цены.
5. Проверьте активные скидки товара.

В примерах скидки используются код сайта `s1`, валюта `RUB` и идентификатор типа цены `$basePriceTypeId`. Замените их на значения из настроек собственного сайта и каталога.

### Создать скидку на товар {#create-product-discount}

Скидку на товар создают через `CCatalogDiscount::Add()`. В примере скидка действует на товар `$productId` на сайте с кодом `s1` и уменьшает цену на `10%`.

Заполните основные поля скидки:

- `SITE_ID` — связывает скидку с сайтом,
- `ACTIVE` — включает правило скидки,
- `NAME` — хранит название правила,
- `SORT` — задает порядок сортировки среди других скидок,
- `VALUE_TYPE` — задает тип скидки: в примере `TYPE_PERCENT` означает скидку в процентах,
- `VALUE` — задает размер скидки, например, для скидки `10%` передайте значение `10`,
- `CURRENCY` — задает валюту скидки, поле нужно передавать и для процентной скидки,
- `CONDITIONS` — определяет, к каким товарам и при каких условиях применяется скидка.

В примере дерево `CONDITIONS` описывает одно условие:

- `CondGroup` — объединяет условия в группу,
- `DATA.All = AND` — требует выполнения всех дочерних условий,
- `DATA.True = True` — означает, что группа проверяет выполнение условий, а не их отрицание,
- `CondIBElement` — выбирает товар по идентификатору `$productId`,
- `logic = Equal` — требует точного совпадения.

Метод может вернуть ошибку, если код сайта неверный, товар в условии не существует, валюта некорректна или дерево `CONDITIONS` пустое.

```php
$discountId = \CCatalogDiscount::Add([
    'SITE_ID'     => 's1',
    'ACTIVE'      => 'Y',
    'NAME'        => 'Скидка 10% на товар',
    'SORT'        => 100,
    'VALUE_TYPE'  => \CCatalogDiscount::TYPE_PERCENT,
    'VALUE'       => 10,
    'CURRENCY'    => 'RUB',
    'CONDITIONS'  => [
        'CLASS_ID' => 'CondGroup',
        'DATA' => [
            'All'  => 'AND',
            'True' => 'True',
        ],
        'CHILDREN' => [
            [
                'CLASS_ID' => 'CondIBElement',
                'DATA' => [
                    'logic' => 'Equal',
                    'value' => $productId,
                ],
            ],
        ],
    ],
]);

if (!$discountId)
{
    global $APPLICATION;
    $exception = $APPLICATION->GetException();
    $message = $exception ? $exception->GetString() : 'Не удалось создать скидку';

    throw new \RuntimeException($message);
}
```

Метод возвращает идентификатор скидки или `false`. Сохраните результат в `$discountId` — он нужен для выпуска купона.

При ошибке пример получает текст последнего исключения из глобального объекта `$APPLICATION`. Константы `VALUE_TYPE` доступны в `CCatalogDiscount` и `\Bitrix\Catalog\DiscountTable`.

{% note warning "" %}

При создании скидки через `CCatalogDiscount::Add()` поле `USE_COUPONS` не включайте в параметры. Если для скидки нужен купон, создайте купон отдельным шагом и включите купоны через `\Bitrix\Catalog\DiscountTable::setUseCoupons()`.

{% endnote %}

### Создать купон {#create-coupon}

Купон создают отдельно от скидки через `\Bitrix\Catalog\DiscountCouponTable::add()`. Заполните параметры перед вызовом метода:

- `DISCOUNT_ID` — связывает купон со скидкой `$discountId`,
- `ACTIVE` — включает купон,
- `COUPON` — хранит строковый код, который пользователь вводит при покупке. В примере используется код `SALE-10-PRODUCT`,
- `TYPE` — задает режим применения, например, `TYPE_ONE_ORDER` означает купон для одного заказа.

Метод может вернуть ошибку, если `DISCOUNT_ID` неверный, код купона пустой, код длиннее 32 символов или купон уже существует.

```php
$couponResult = \Bitrix\Catalog\DiscountCouponTable::add([
    'DISCOUNT_ID' => $discountId,
    'ACTIVE'      => 'Y',
    'COUPON'      => 'SALE-10-PRODUCT',
    'TYPE'        => \Bitrix\Catalog\DiscountCouponTable::TYPE_ONE_ORDER,
]);

if (!$couponResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $couponResult->getErrorMessages()));
}

\Bitrix\Catalog\DiscountTable::setUseCoupons($discountId, 'Y');
```

Метод возвращает объект результата `$couponResult`. Идентификатор созданного купона доступен через `$couponResult->getId()`.

Метод `\Bitrix\Catalog\DiscountTable::setUseCoupons()` включает использование купонов для скидки.

### Добавить купон в расчет {#add-coupon-to-calculation}

Чтобы купон участвовал в расчете цены, добавьте его код в менеджер модуля `sale`.

{% note warning "" %}

Методы `CCatalogDiscount::SetCoupon`, `GetCoupons`, `ClearCoupon` и одноименные методы `CCatalogDiscountCoupon` устарели. Используйте `\Bitrix\Sale\DiscountCouponsManager::add`, `get` и `clear`.

{% endnote %}

```php
if (!\Bitrix\Main\Loader::includeModule('sale'))
{
    throw new \RuntimeException('Не удалось подключить модуль sale');
}

if (!\Bitrix\Sale\DiscountCouponsManager::add('SALE-10-PRODUCT'))
{
    throw new \RuntimeException('Не удалось добавить купон в расчет');
}
```

### Получить список активных скидок {#active-discounts}

После [расчета итоговой цены](availability-prices-subscription.md#final-price) через `GetOptimalPrice()` получите активные скидки методом `CCatalogDiscount::GetDiscountByProduct()`. Он учитывает товар, группы пользователя, доступные типы цен и сайт.

В примере используются параметры:

- `$productId` — товар, для которого проверяют скидки,
- `$userGroups` — группы текущего пользователя из `$USER->GetUserGroupArray()`,
- `'N'` — режим без обновления купонов перед выборкой,
- `[$basePriceTypeId]` — идентификатор типа цены, который доступен пользователю при расчете,
- `SITE_ID` — текущий сайт.

```php
global $USER;

$userGroups = $USER->GetUserGroupArray();

$discounts = \CCatalogDiscount::GetDiscountByProduct(
    $productId,
    $userGroups,
    'N',
    [$basePriceTypeId],
    SITE_ID
);

if ($discounts === false)
{
    throw new \RuntimeException('Не удалось получить скидки товара');
}

foreach ($discounts as $discount)
{
    echo $discount['NAME'] . "\n";
}
```

Метод возвращает массив скидок в `$discounts`. Каждый элемент массива `$discount` содержит данные одной скидки, в примере выводится ее название из поля `NAME`.

Если скидок нет, метод возвращает пустой массив. Если идентификатор товара некорректен или товар не найден, метод возвращает `false`.

{% note warning "" %}

Не используйте `CCatalogDiscount::GetDiscountProductsList` и `CCatalogDiscount::GetDiscountSectionsList` для выборки товаров со скидками. Эти методы устарели.

{% endnote %}

## Проверить результат

После создания проверьте результат отдельно для каждого сценария.

- Для комплекта вызовите `CCatalogProductSet::getAllSetsByProduct($productId, \CCatalogProductSet::TYPE_SET)`. В результате должен быть комплект с товарами из `ITEMS`.
- Для набора вызовите `CCatalogProductSet::getAllSetsByProduct($productId, \CCatalogProductSet::TYPE_GROUP)`. В результате должен быть набор с рекомендованными товарами.
- Для скидки и купона рассчитайте итоговую цену через `CCatalogProduct::GetOptimalPrice()` и проверьте активные скидки через `CCatalogDiscount::GetDiscountByProduct()`. В списке должна быть скидка, созданная в `$discountId`.
- Если метод возвращает `false` или объект результата с ошибками, получите текст ошибки через метод конкретного API: `getErrors()`, `getErrorMessages()` или `$APPLICATION->GetException()`. После ошибки не продолжайте сценарий.
