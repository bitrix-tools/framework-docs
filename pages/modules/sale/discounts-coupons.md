---
title: Правила работы с корзиной
description: "Правила работы с корзиной. Расчет правил, применение купонов и чтение результата через D7 API модуля sale."
---

Правила работы с корзиной описывают условия и действия, которые влияют на сумму корзины и заказа. Правило может уменьшить цену товаров, применить наценку, зафиксировать цену позиции, изменить стоимость доставки, добавить подарок или остановить дальнейшие скидки.

Через API разработчик создает, обновляет, удаляет и читает правила, запускает расчет корзины или заказа, получает результат применения и читает сохраненные скидки заказа.

## Основные объекты

#|
|| **Объект** | **Роль в сценарии** ||
|| `CSaleDiscount` | Класс классического API для создания, обновления и чтения правил работы с корзиной. Настраивает условия, действия, группы пользователей, купоны и порядок применения ||
|| `Bitrix\Sale\Discount` | Рассчитывает правила работы с корзиной для корзины или заказа. Возвращает результат расчета, цены для показа и данные примененных правил ||
|| `Bitrix\Sale\DiscountCouponsManager` | Хранит купоны текущего расчета, проверяет купоны и передает их в расчет скидок ||
|| `Bitrix\Sale\OrderDiscount` | Сохраняет и загружает результат расчета скидок заказа ||
|| `Bitrix\Sale\Internals\DiscountCouponTable` | ORM-таблица купонов. Хранит код купона, тип, активность и ограничения использования ||
|| `Bitrix\Sale\Discount\Actions` | Выполняет действия правила над корзиной и доставкой: меняет цену, формирует описание результата и отмечает примененные позиции ||
|| `Bitrix\Sale\Discount\Gift\Manager` | Возвращает список подарков, которые правило может добавить к корзине ||
|| `Bitrix\Sale\Discount\Prediction\Manager` | Возвращает подсказки по правилам. Подсказка показывает покупателю, что нужно сделать, чтобы получить скидку ||
|#

Сохраненный заказ содержит не только текущие настройки правила, но и результат, который применился при расчете. Примененные скидки, купоны, правила и описания результата хранятся в таблицах `OrderDiscountTable`, `OrderCouponsTable`, `OrderRulesTable` и `OrderRulesDescrTable`.

## Как выполняется расчет правил

Расчет правил начинается с данных корзины или заказа.

1. Система получает товары, цены, доставку, сайт и контекст пользователя.

2. Если покупатель ввел купон, система передает его в `DiscountCouponsManager`, а расчет использует купон как входные данные.

3. Метод `Discount::calculate()` загружает активные правила для групп пользователя, сайта, модулей и купонов.

4. Расчет проверяет условия правила из `CONDITIONS_LIST`.

5. Если условия выполнены, расчет выполняет действия из `ACTIONS_LIST`.

6. Заказ через `Order::doFinalAction(true)` применяет результат к корзине, доставке и налогам.

7. Метод `Order::save()` сохраняет заказ и результат скидок.

Для корзины без заказа запускайте предварительный расчет, чтобы показать цены, проверить купон и прочитать результат. Для оформляемого заказа запускайте расчет через объект заказа: так связанные коллекции и итоговые суммы изменятся согласованно.

Не рассчитывайте правила вручную и не меняйте итоговые цены прямой записью. Расчет учитывает сайт, пользователя, группы пользователя, купоны, условия правил, товары корзины, цены, доставку, налоги и настройки магазина. Если изменить цену без расчета правил, заказ может не совпасть с правами пользователя и историей примененных скидок.

## Из чего состоит правило

Правило работы с корзиной можно описать набором полей.

#|
|| **Поле** | **Как влияет на расчет** ||
|| `LID` | Связывает правило с сайтом. Правило участвует только в расчете своего сайта ||
|| `ACTIVE`, `ACTIVE_FROM`, `ACTIVE_TO` | Определяют активность и период действия правила ||
|| `PRICE_FROM`, `PRICE_TO`, `CURRENCY` | Ограничивают правило по сумме заказа в валюте правила ||
|| `CONDITIONS_LIST` | Хранит дерево условий: какие товары, свойства корзины, параметры заказа, покупателя или предыдущих заказов должны совпасть ||
|| `ACTIONS_LIST` | Хранит дерево действий: что изменить в корзине или доставке, какой подарок предложить, какие позиции затронуть ||
|| `USE_COUPONS` | Указывает, нужен ли купон для применения правила: `Y` или `N`. По умолчанию правило работает без купона ||
|| `SORT`, `PRIORITY` | Определяют порядок применения среди других правил ||
|| `LAST_DISCOUNT`, `LAST_LEVEL_DISCOUNT` | Останавливают дальнейшее применение правил полностью или на текущем уровне приоритета ||
|| `PREDICTION_TEXT`, `PREDICTIONS_LIST` | Хранят текст и условия подсказки, которую можно показать покупателю до применения правила ||
|#

### Какие условия может учитывать правило

Правило проверяет:

-  сумму корзины или заказа,

-  товары, разделы, свойства товаров и свойства позиций корзины,

-  количество, цену, вес и другие поля позиции корзины,

-  поля заказа и доставки,

-  пользователя и группы пользователя,

-  данные прошлых заказов и накопительные условия,

-  наличие или отсутствие уже примененной скидки.

Если одно из указанных условий не совпадает, правило не применяется.

### Какие действия может выполнить правило

Действия правила влияют на сумму корзины или заказа. Правило может:

-  применить скидку или наценку к позициям корзины в процентах,

-  применить скидку или наценку фиксированной суммой,

-  распределить сумму скидки по подходящим позициям,

-  установить фиксированную цену позиции,

-  применить накопительную скидку по сумме заказов пользователя,

-  применить скидку или наценку к доставке,

-  добавить подарок.

### Как настроить порядок применения правил

Если к корзине подходят несколько правил, система применяет их не как независимые формулы, а последовательно. Результат предыдущего правила может изменить цену позиции, доставку или доступность позиции для следующих скидок.

Порядок расчета задают два поля.

-  `PRIORITY` — уровень приоритета. Чем больше значение, тем раньше правило идет в расчете.

-  `SORT` — сортировка внутри одного уровня приоритета. Если у нескольких правил одинаковый `PRIORITY`, раньше рассчитывается правило с меньшим `SORT`.

Схема порядка:

1. Система выбирает активные правила, которые подходят по сайту, группам пользователей, периоду действия и купонам.

2. Система сортирует правила по `PRIORITY` от большего значения к меньшему.

3. Внутри одного `PRIORITY` система сортирует правила по `SORT` от меньшего значения к большему.

4. После применения правила система проверяет `LAST_LEVEL_DISCOUNT` и `LAST_DISCOUNT`.

Флаги остановки настраивайте с учетом этого порядка:

-  `LAST_LEVEL_DISCOUNT = Y` останавливает следующие правила с тем же `PRIORITY`, но не запрещает расчет правил с другим уровнем приоритета.

-  `LAST_DISCOUNT = Y` останавливает дальнейший расчет правил после применения текущего правила.

-  `LAST_DISCOUNT = N` и `LAST_LEVEL_DISCOUNT = N` разрешают системе перейти к следующим правилам по общей очереди.

Пример очереди:

#|
|| **Правило** | **PRIORITY** | **SORT** | **Когда применится** ||
|| Персональная скидка клиента | `20` | `100` | Первым, потому что приоритет выше остальных ||
|| Скидка на раздел | `10` | `100` | Вторым: приоритет ниже, чем у персональной скидки ||
|| Скидка от суммы заказа | `10` | `200` | Третьим: приоритет такой же, как у скидки на раздел, но сортировка больше ||
|#

Если персональная скидка клиента применится с `LAST_DISCOUNT = Y`, две следующие скидки не будут рассчитаны. Если скидка на раздел применится с `LAST_LEVEL_DISCOUNT = Y`, скидка от суммы заказа с тем же `PRIORITY = 10` не будет рассчитана.

## Подготовить данные для работы с правилами

Примеры статьи — отдельные шаги сценария. Чтобы использовать их в своем коде, подготовьте данные магазина и объекты заказа:

-  `$userId` — идентификатор пользователя, для которого рассчитываются правила,

-  `$orderId` — идентификатор существующего заказа,

-  `$siteId` — идентификатор сайта,

-  `$userGroupIds` — массив идентификаторов групп пользователей, для которых действует правило,

-  `$productId` — идентификатор товара,

-  `$sectionId` — идентификатор раздела инфоблока,

-  `$deliveryId` — идентификатор службы или профиля доставки,

-  `$basket` — объект `Bitrix\Sale\Basket`,

-  `$order` — объект `Bitrix\Sale\Order`.

## Создать правило

Создавайте правила через метод классического API `CSaleDiscount::Add()`. В метод передают массив с настройками правила: сайт, активность, группы пользователей, условия, действия, купоны и порядок применения.

{% note warning "" %}

Не используйте для создания правила `Bitrix\Sale\Internals\DiscountTable::add()`. Прямой ORM-вызов не выполняет всю подготовку правила и не создает привязки к группам пользователей.

{% endnote %}

### Структура CONDITIONS и ACTIONS

В `CSaleDiscount::Add()` передайте исходные структуры условий и действий: `CONDITIONS` и `ACTIONS`. При сохранении метод проверяет параметры, привязывает правило к группам пользователей и формирует подготовленные структуры `CONDITIONS_LIST` и `ACTIONS_LIST` для расчета.

Поля `CONDITIONS` и `ACTIONS` состоят из вложенных узлов. Каждый узел указывает контроллер через `CLASS_ID`, передает ему параметры через `DATA` и может содержать дочерние узлы в `CHILDREN`. Для миграции или повторного создания правила можно взять структуру из сохраненного правила за основу.

#|
|| **Ключ** | **Как заполнять** ||
|| `CLASS_ID` | Идентификатор контроллера условия или действия ||
|| `DATA` | Параметры конкретного контроллера. Набор ключей зависит от `CLASS_ID`. Например, у условия суммы есть `logic` и `Value`, у действия скидки есть `Type`, `Value`, `Unit`, `Max`, `All`, `True` ||
|| `CHILDREN` | Вложенные условия или ограничения действия. Если вложенных узлов нет, передайте пустой массив ||
|#

#### Идентификатор контроллера CLASS_ID

Идентификатор контроллера `CLASS_ID` определяет, какой контроллер обработает узел условия или действия. Для типовых сценариев можно использовать наиболее часто встречающиеся значения.

#|
|| **CLASS_ID** | **Где используется** | **Назначение** ||
|| `CondGroup` | `CONDITIONS`, `ACTIONS` | Корневая группа дерева. Объединяет дочерние условия или действия ||
|| `CondBsktAmtGroup` | `CONDITIONS` | Условие по сумме корзины или заказа ||
|| `CondBsktProductGroup` | `CONDITIONS` | Группа условий по позициям корзины: товар, раздел, свойства товара или позиции ||
|| `CondIBElement` | `CONDITIONS`, вложенные ограничения в `ACTIONS` | Условие по элементам инфоблока, то есть по товарам ||
|| `CondIBSection` | `CONDITIONS`, вложенные ограничения в `ACTIONS` | Условие по разделам инфоблока ||
|| `CondSaleDelivery` | `CONDITIONS` | Условие по службе или профилю доставки ||
|| `ActSaleBsktGrp` | `ACTIONS` | Скидка, наценка или остановка скидок для позиций корзины ||
|| `ActSaleSubGrp` | Вложенные ограничения в `ActSaleBsktGrp` | Ограничивает действие только подходящими товарами, разделами или другими условиями внутри действия ||
|| `ActSaleDelivery` | `ACTIONS` | Скидка или наценка на доставку ||
|#

Если нужен другой тип условия или действия, сначала создайте похожее правило в административном разделе или мастере правил. Затем прочитайте правило через `CSaleDiscount::GetByID()` или `CSaleDiscount::GetList()` и используйте его структуру как основу для кода. В результате можно получить актуальные `CLASS_ID`, параметры `DATA` и вложенность `CHILDREN` для установленных модулей и версии продукта.

#### Параметры дерева

#|
|| **Параметр** | **Где используется** | **Возможные значения и правила заполнения** ||
|| `logic` | Оператор сравнения в условии | Базовый набор операторов:

-  `Equal` — равно,
-  `Not` — не равно,
-  `Great` — больше,
-  `Less` — меньше,
-  `EqGr` — больше или равно,
-  `EqLs` — меньше или равно,
-  `Contain` — содержит,
-  `NotCont` — не содержит.

Конкретный `CLASS_ID` разрешает не весь базовый набор, а только свои значения:

-  `CondBsktAmtGroup` — `Equal`, `Not`, `Great`, `Less`, `EqGr`, `EqLs`,
-  `CondIBElement` — `Equal`, `Not`,
-  `CondIBSection` — `Equal`, `Not`,
-  `CondSaleDelivery` — `Equal`, `Not`.
||
|| `All` | Объединение вложенных условий. | Возможные значения:

-  `AND` — должны выполниться все вложенные условия,
-  `OR` — достаточно одного выполненного условия.
||
|| `True` | Проверка или инверсия результата группы. | Возможные значения:

-  `True` — условие должно выполниться,
-  `False` — результат условия инвертируется.
||
|| `Found` | Поиск подходящих позиций в `CondBsktProductGroup`. | Возможные значения:

-  `Found` — в корзине должна быть подходящая позиция,
-  `NoFound` — подходящей позиции быть не должно.
||
|| `Type` | Тип действия. Возможные значения зависят от `CLASS_ID` действия. | Для `ActSaleBsktGrp`:

-  `Discount` — скидка,
-  `Extra` — наценка,
-  `Closeout` — остановить дальнейшие скидки для подходящих позиций.

Для `ActSaleDelivery`:

-  `Discount` — скидка на доставку,
-  `DiscountZero` — уменьшить стоимость доставки до нуля,
-  `Extra` — наценка на доставку.
||
|| `Unit` | Единица значения действия. Возможные значения зависят от `CLASS_ID` действия. | Для `ActSaleBsktGrp`:

-  `Perc` — проценты,
-  `CurEach` — сумма для каждой подходящей позиции,
-  `CurAll` — общая сумма для подходящих позиций.

Для `ActSaleDelivery`:

-  `Perc` — проценты,
-  `Cur` — сумма в валюте правила.
||
|| `Value` и `value` | Число или идентификатор, с которым работает условие или действие. | Регистр ключа важен:

-  `Value` используется в `CondBsktAmtGroup`, `ActSaleBsktGrp` и `ActSaleDelivery`,
-  `value` используется в `CondIBElement`, `CondIBSection` и `CondSaleDelivery`.
||
|| `Max` | Ограничение максимальной скидки в `ActSaleBsktGrp`. | Возможные значения:

-  `0` — скидка не ограничена,
-  положительное число — максимальная сумма скидки.
||
|#

### Примеры создания правил

#### 1\. Создать скидку от суммы заказа

Добавьте скидку 10% на корзину, если сумма заказа больше или равна `3000` в валюте сайта.

-  `USER_GROUPS` задает группы пользователей, для которых правило активно,

-  `CONDITIONS` описывает условие применения правила,

-  `ACTIONS` описывает действие правила,

-  `USE_COUPONS = N` означает, что правило применяется без купона,

-  `Unit = Perc` задает процентную скидку,

-  `LAST_DISCOUNT = N` разрешает следующим правилам продолжить расчет.

```php
$siteId = SITE_ID;
$userGroupIds = [2];

$discountId = \CSaleDiscount::Add([
    'LID' => $siteId,
    'NAME' => 'Скидка 10% от суммы заказа',
    'ACTIVE' => 'Y',
    'SORT' => 100,
    'PRIORITY' => 1,
    'LAST_DISCOUNT' => 'N',
    'LAST_LEVEL_DISCOUNT' => 'N',
    'CURRENCY' => \Bitrix\Sale\Internals\SiteCurrencyTable::getSiteCurrency($siteId),
    'USER_GROUPS' => $userGroupIds,
    'USE_COUPONS' => 'N',
    // Общее условие применения правила
    'CONDITIONS' => [
        'CLASS_ID' => 'CondGroup',
        'DATA' => [
            'All' => 'AND',
            'True' => 'True',
        ],
        'CHILDREN' => [
            [
                'CLASS_ID' => 'CondBsktAmtGroup',
                'DATA' => [
                    'logic' => 'EqGr',
                    'Value' => 3000,
                    'All' => 'AND',
                ],
                'CHILDREN' => [],
            ],
        ],
    ],
    // Действие, которое выполнится, если условия подошли
    'ACTIONS' => [
        'CLASS_ID' => 'CondGroup',
        'DATA' => [
            'All' => 'AND',
        ],
        'CHILDREN' => [
            [
                'CLASS_ID' => 'ActSaleBsktGrp',
                'DATA' => [
                    'Type' => 'Discount',
                    'Value' => 10,
                    'Unit' => 'Perc',
                    'Max' => 0,
                    'All' => 'AND',
                    'True' => 'True',
                ],
                'CHILDREN' => [],
            ],
        ],
    ],
]);

if ((int)$discountId <= 0)
{
    global $APPLICATION;

    $exception = $APPLICATION->GetException();
    $message = $exception ? $exception->GetString() : 'Не удалось создать правило';

    throw new \RuntimeException($message);
}
```

#### 2\. Создать скидку на товар или раздел

Создайте скидку 15% на один товар и один раздел.

Для скидки на конкретные товары или разделы используйте условие `CondBsktProductGroup`. Внутри него можно указать товары через `CondIBElement`, а разделы через `CondIBSection`. Такое же ограничение нужно добавить в действие, чтобы скидка изменила только подходящие позиции корзины.

```php
$siteId = SITE_ID;
$userGroupIds = [2];
$productId = 123;
$sectionId = 45;

$discountId = \CSaleDiscount::Add([
    'LID' => $siteId,
    'NAME' => 'Скидка 15% на товар и раздел',
    'ACTIVE' => 'Y',
    'SORT' => 100,
    'PRIORITY' => 1,
    'LAST_DISCOUNT' => 'N',
    'LAST_LEVEL_DISCOUNT' => 'N',
    'CURRENCY' => \Bitrix\Sale\Internals\SiteCurrencyTable::getSiteCurrency($siteId),
    'USER_GROUPS' => $userGroupIds,
    'USE_COUPONS' => 'N',
    // Общее условие применения правила
    'CONDITIONS' => [
        'CLASS_ID' => 'CondGroup',
        'DATA' => [
            'All' => 'AND',
            'True' => 'True',
        ],
        'CHILDREN' => [
            [
                'CLASS_ID' => 'CondBsktProductGroup',
                'DATA' => [
                    'Found' => 'Found',
                    'All' => 'OR',
                ],
                'CHILDREN' => [
                    [
                        'CLASS_ID' => 'CondIBSection',
                        'DATA' => [
                            'logic' => 'Equal',
                            'value' => $sectionId,
                        ],
                    ],
                    [
                        'CLASS_ID' => 'CondIBElement',
                        'DATA' => [
                            'logic' => 'Equal',
                            'value' => [$productId],
                        ],
                    ],
                ],
            ],
        ],
    ],
    // Действие, которое выполнится, если условия подошли
    'ACTIONS' => [
        'CLASS_ID' => 'CondGroup',
        'DATA' => [
            'All' => 'AND',
        ],
        'CHILDREN' => [
            [
                'CLASS_ID' => 'ActSaleBsktGrp',
                'DATA' => [
                    'Type' => 'Discount',
                    'Value' => 15,
                    'Unit' => 'Perc',
                    'Max' => 0,
                    'All' => 'OR',
                    'True' => 'True',
                ],
                // Ограничение действия теми же товарами и разделами
                // Без него скидка может примениться шире, чем условие правила
                'CHILDREN' => [
                    [
                        'CLASS_ID' => 'ActSaleSubGrp',
                        'DATA' => [
                            'All' => 'OR',
                            'True' => 'True',
                        ],
                        'CHILDREN' => [
                            [
                                'CLASS_ID' => 'CondIBSection',
                                'DATA' => [
                                    'logic' => 'Equal',
                                    'value' => $sectionId,
                                ],
                            ],
                        ],
                    ],
                    [
                        'CLASS_ID' => 'ActSaleSubGrp',
                        'DATA' => [
                            'All' => 'AND',
                            'True' => 'True',
                        ],
                        'CHILDREN' => [
                            [
                                'CLASS_ID' => 'CondIBElement',
                                'DATA' => [
                                    'logic' => 'Equal',
                                    'value' => [$productId],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
]);

if ((int)$discountId <= 0)
{
    global $APPLICATION;

    $exception = $APPLICATION->GetException();
    $message = $exception ? $exception->GetString() : 'Не удалось создать правило';

    throw new \RuntimeException($message);
}
```

#### 3\. Создать скидку на доставку

Создадим скидку `200` в валюте сайта на выбранную доставку, если сумма заказа больше или равна `5000`.

Скидка на доставку использует действие `ActSaleDelivery`. В условиях правила укажите минимальную сумму заказа и выбранную службу доставки.

```php
$siteId = SITE_ID;
$userGroupIds = [2];
$deliveryId = 3;

$discountId = \CSaleDiscount::Add([
    'LID' => $siteId,
    'NAME' => 'Скидка 200 на доставку от 5000',
    'ACTIVE' => 'Y',
    'SORT' => 100,
    'PRIORITY' => 1,
    'LAST_DISCOUNT' => 'N',
    'LAST_LEVEL_DISCOUNT' => 'N',
    'CURRENCY' => \Bitrix\Sale\Internals\SiteCurrencyTable::getSiteCurrency($siteId),
    'USER_GROUPS' => $userGroupIds,
    'USE_COUPONS' => 'N',
    // Условие: сумма заказа и выбранная служба доставки
    'CONDITIONS' => [
        'CLASS_ID' => 'CondGroup',
        'DATA' => [
            'All' => 'AND',
            'True' => 'True',
        ],
        'CHILDREN' => [
            [
                'CLASS_ID' => 'CondBsktAmtGroup',
                'DATA' => [
                    'logic' => 'EqGr',
                    'Value' => 5000,
                    'All' => 'AND',
                ],
                'CHILDREN' => [],
            ],
            [
                'CLASS_ID' => 'CondSaleDelivery',
                'DATA' => [
                    'logic' => 'Equal',
                    'value' => [$deliveryId],
                ],
            ],
        ],
    ],
    // Действие: скидка на доставку
    'ACTIONS' => [
        'CLASS_ID' => 'CondGroup',
        'DATA' => [
            'All' => 'AND',
        ],
        'CHILDREN' => [
            [
                'CLASS_ID' => 'ActSaleDelivery',
                'DATA' => [
                    'Type' => 'Discount',
                    'Value' => 200,
                    'Unit' => 'Cur',
                ],
            ],
        ],
    ],
]);

if ((int)$discountId <= 0)
{
    global $APPLICATION;

    $exception = $APPLICATION->GetException();
    $message = $exception ? $exception->GetString() : 'Не удалось создать правило';

    throw new \RuntimeException($message);
}
```

## Обновить правило

Для изменения существующего правила используйте метод `CSaleDiscount::Update()`. Передайте идентификатор правила и поля, которые нужно изменить.

```php
$updatedDiscountId = \CSaleDiscount::Update(
    $discountId,
    [
        'ACTIVE' => 'N',
        'SORT' => 200,
    ]
);

if ((int)$updatedDiscountId <= 0)
{
    global $APPLICATION;

    $exception = $APPLICATION->GetException();
    $message = $exception ? $exception->GetString() : 'Не удалось обновить правило';

    throw new \RuntimeException($message);
}
```

## Удалить правило

Для удаления правила используйте метод `Bitrix\Sale\Internals\DiscountTable::delete()`. Метод `CSaleDiscount::Delete()` устарел.

```php
$deleteResult = \Bitrix\Sale\Internals\DiscountTable::delete($discountId);

if (!$deleteResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $deleteResult->getErrorMessages()));
}
```

## Работать с купонами

Класс `DiscountCouponsManager` хранит купоны в контексте текущего пользователя, менеджера или заказа. Перед расчетом выберите режим работы с купонами.

#|
|| **Режим** | **Сценарий** | **Что передать** ||
|| `MODE_CLIENT` | Покупатель вводит купон в публичной корзине. Купоны хранятся в пользовательском контексте | `userId` ||
|| `MODE_MANAGER` | Менеджер создает новый заказ для покупателя | `userId` ||
|| `MODE_ORDER` | Менеджер или обработчик пересчитывает существующий заказ | `userId` и `orderId` ||
|| `MODE_EXTERNAL` | Внешний сценарий запускает расчет вне пользовательской корзины и заказа | Параметры зависят от сценария внешнего расчета ||
|#

Для публичной корзины используйте режим клиента.

```php
\Bitrix\Sale\DiscountCouponsManager::init(
    \Bitrix\Sale\DiscountCouponsManager::MODE_CLIENT,
    [
        'userId' => $userId,
    ]
);
```

Если нужно начать расчет с пустого набора купонов, используйте метод `reInit()` с третьим параметром `true`. Это подходит для фонового сценария, теста или проверки условий. В публичной корзине не очищайте купоны автоматически: покупатель может потерять введенный код.

```php
\Bitrix\Sale\DiscountCouponsManager::reInit(
    \Bitrix\Sale\DiscountCouponsManager::MODE_CLIENT,
    [
        'userId' => $userId,
    ],
    true
);
```

### Создать купон для правила

Для правила, которое должно работать по купону, установите параметр `USE_COUPONS = Y`. Затем создайте купон методом `\Bitrix\Sale\Internals\DiscountCouponTable::add`.

```php
$couponResult = \Bitrix\Sale\Internals\DiscountCouponTable::add([
    'DISCOUNT_ID' => $discountId,
    'COUPON' => 'SALE-10-ORDER',
    'TYPE' => \Bitrix\Sale\Internals\DiscountCouponTable::TYPE_ONE_ORDER,
    'MAX_USE' => 0,
    'USER_ID' => 0,
]);

if (!$couponResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $couponResult->getErrorMessages()));
}
```

Тип купона задает, как он расходуется:

-  `TYPE_BASKET_ROW` — купон, который расходуется при применении к позиции корзины,

-  `TYPE_ONE_ORDER` — одноразовый купон на заказ,

-  `TYPE_MULTI_ORDER` — многоразовый купон с учетом установленного лимита `MAX_USE`.

Купон не применится до расчета через `Discount::calculate()` или `Order::doFinalAction(true)`.

### Добавить купон в расчет

Метод `add()` добавляет код купона в менеджер и возвращает `true`, если купон найден и не заблокирован для расчета.

```php
$couponCode = 'SALE-10-PRODUCT';

if (!\Bitrix\Sale\DiscountCouponsManager::add($couponCode))
{
    $errors = \Bitrix\Sale\DiscountCouponsManager::getErrors();
    $message = $errors ? implode('; ', $errors) : 'Не удалось добавить купон в расчет';

    throw new \RuntimeException($message);
}
```

Метод добавляет купон в менеджер, но не применяет скидку. Купон начнет влиять на цену только после расчета корзины или заказа.

### Получить состояние купонов            {#get-coupons}

После расчета получите купоны методом `get()`.

```php
get($extMode = true, $filter = [], $show = false, $final = false)
```

-  `$extMode` — определяет формат результата.

   -  `true` — возвращает расширенные данные купонов. В расширенных данных могут быть пояснения причины: купон неактивен, истек срок действия, не подходит пользователь или лимит использования.

   -  `false` — только коды купонов.

-  `$filter` — фильтрует список купонов. Значение `[]` возвращает все купоны текущего расчета. Можно передать массив условий по полям купона, например `['COUPON' => $couponCode]`, `['STATUS' => DiscountCouponsManager::STATUS_APPLYED]` или условие с отрицанием `['!STATUS' => DiscountCouponsManager::STATUS_NOT_FOUND]`.

-  `$show` — определяет режим получения.

   -  `true` — возвращает данные для показа пользователю, включая служебные статусы и подсказки проверки.

   -  `false` — возвращает купоны для применения в расчете.

-  `$final` — завершает проверку статусов.

   -  `true` — переводит купоны, которые не применились, в финальный статус `STATUS_NOT_APPLYED`.

   -  `false` — оставляет текущие статусы.

```php
$coupons = \Bitrix\Sale\DiscountCouponsManager::get(
    true,
    [],
    true,
    true
);

foreach ($coupons as $coupon)
{
    echo $coupon['COUPON'] . ': ' . $coupon['STATUS'] . "\n";
}
```

Основные статусы купонов:

#|
|| **Статус** | **Что означает** ||
|| `STATUS_ENTERED` | Купон добавлен в расчет, но итоговое применение еще не подтверждено ||
|| `STATUS_APPLYED` | Купон применился к товару или доставке ||
|| `STATUS_NOT_APPLYED` | Купон существует, но не подошел под условия расчета ||
|| `STATUS_NOT_FOUND` | Купон не найден ||
|| `STATUS_FREEZE` | Купон заблокирован для применения в текущем контексте ||
|#

### Удалить или очистить купоны

Чтобы удалить один купон из текущего расчета, вызовите `delete()`.

```php
if (!\Bitrix\Sale\DiscountCouponsManager::delete($couponCode))
{
    throw new \RuntimeException('Купон не найден в текущем расчете');
}
```

Чтобы очистить все купоны, вызовите `clear(true)`. Параметр `true` очищает также хранилище купонов текущего режима.

```php
\Bitrix\Sale\DiscountCouponsManager::clear(true);
```

После удаления или очистки купонов пересчитайте корзину или заказ. Иначе старые суммы могут остаться в уже рассчитанном объекте.

## Получить подарки по правилу

Правило может предлагать подарок без изменения цены. Для получения подарков используйте `Bitrix\Sale\Discount\Gift\Manager`.

```php
$giftManager = \Bitrix\Sale\Discount\Gift\Manager::getInstance()
    ->setUserId($userId)
;

$collections = $giftManager->getCollectionsByBasket($basket);

foreach ($collections as $collection)
{
    foreach ($collection as $gift)
    {
        echo $gift->getProductId() . "\n";
    }
}
```

Компоненты подарков используют менеджер для отображения доступных товаров. Покупатель может получить эти товары по правилам работы с корзиной. Доступность подарка зависит от условий правила и состава корзины.

## Получить подсказку по правилу

Если у правила настроена подсказка, ее можно получить через `Bitrix\Sale\Discount\Prediction\Manager`. Подсказка показывает покупателю, какое действие необходимо, чтобы получить скидку или подарок.

```php
$predictionText = \Bitrix\Sale\Discount\Prediction\Manager::getInstance()
    ->setUserId($userId)
    ->getFirstPredictionTextByProduct(
        $basket,
        [
            'ID' => $productId,
            'MODULE' => 'catalog',
            'PRODUCT_PROVIDER_CLASS' => \Bitrix\Catalog\Product\Basket::getDefaultProviderName(),
            'QUANTITY' => 1,
        ]
    )
;

if ($predictionText !== null)
{
    echo $predictionText;
}
```

Подсказка не применяет правило и не меняет корзину. Она только читает настроенные в правиле условия и текст.

## Прочитать настройки правил

Для проверки правил используйте `CSaleDiscount::GetList()`. Чтение настроек помогает проверить активность, период, сайт, признак купонов и порядок применения.

```php
$discountRows = [];

$discountIterator = \CSaleDiscount::GetList(
    [
        'PRIORITY' => 'DESC',
        'SORT' => 'ASC',
        'ID' => 'ASC',
    ],
    [
        'LID' => SITE_ID,
        'ACTIVE' => 'Y',
    ],
    false,
    false,
    [
        'ID',
        'LID',
        'NAME',
        'ACTIVE',
        'ACTIVE_FROM',
        'ACTIVE_TO',
        'USE_COUPONS',
        'SORT',
        'PRIORITY',
        'LAST_DISCOUNT',
        'LAST_LEVEL_DISCOUNT',
    ]
);

while ($discount = $discountIterator->Fetch())
{
    $discountRows[] = $discount;
}
```

Метод `CSaleDiscount::GetList()` показывает настройки правила, но не отвечает на вопрос, применится ли правило к конкретной корзине. Для этого нужен расчет через `Discount::calculate()` или `Order::doFinalAction(true)`.

## Рассчитать и применить правила

Правила применяются, когда условия подходят под корзину или заказ и действие может изменить расчет.

### Рассчитать корзину

Чтобы рассчитать корзину без заказа, используйте метод `\Bitrix\Sale\Discount::buildFromBasket()`. Для предварительного расчета корзины создайте контекст покупателя, постройте объект скидок по корзине и выполните расчет.

```php
// Обновляем цены и купоны перед расчетом
$basket->refreshData(['PRICE', 'COUPONS']);

// Создаем контекст покупателя, которому принадлежит корзина
$context = new \Bitrix\Sale\Discount\Context\Fuser($basket->getFUserId(true));

// Строим объект скидок по корзине без заказа
$discount = \Bitrix\Sale\Discount::buildFromBasket(
    $basket,
    $context
);

if ($discount === null)
{
    throw new \RuntimeException('Корзина пуста');
}

// Запускаем расчет правил для корзины
$calculateResult = $discount->calculate();
if (!$calculateResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $calculateResult->getErrorMessages()));
}

// Получаем расширенный результат применения правил
$applyResult = $discount->getApplyResult(true);
```

В `DISCOUNT_LIST` результата будут правила, которые участвовали в расчете. Поле `APPLY` покажет, применилось правило или нет.

Если корзина уже привязана к заказу, не используйте `buildFromBasket()`. Для такой корзины рассчитывайте заказ через `$order->doFinalAction(true)`.

### Рассчитать корзину с купоном

Расчет подходит для показа покупателю, применился ли купон и правила.

-  `getApplyResult(true)` — возвращает расширенный результат для отображения. Подробнее в разделе [Прочитать результат расчета](#read-calculation-result).

-  `getShowPrices()` — возвращает цены для отображения в публичных компонентах, включая рассчитанные цены позиций корзины.

```php
// Инициализируем менеджер купонов в режиме публичной корзины
\Bitrix\Sale\DiscountCouponsManager::init(
    \Bitrix\Sale\DiscountCouponsManager::MODE_CLIENT,
    [
        'userId' => $userId,
    ]
);

// Добавляем купон в текущий расчет
if (!\Bitrix\Sale\DiscountCouponsManager::add($couponCode))
{
    throw new \RuntimeException('Не удалось добавить купон в расчет');
}

// Обновляем цены и купоны перед расчетом
$basket->refreshData(['PRICE', 'COUPONS']);

// Создаем контекст покупателя, которому принадлежит корзина
$context = new \Bitrix\Sale\Discount\Context\Fuser($basket->getFUserId(true));

// Строим объект скидок по корзине без заказа
$discount = \Bitrix\Sale\Discount::buildFromBasket(
    $basket,
    $context
);

if ($discount === null)
{
    throw new \RuntimeException('Корзина пуста');
}

// Запускаем расчет правил с учетом добавленного купона
$calculateResult = $discount->calculate();
if (!$calculateResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $calculateResult->getErrorMessages()));
}

// Получаем результат применения и цены для показа покупателю
$applyResult = $discount->getApplyResult(true);
$showPrices = $discount->getShowPrices();
```

### Применить правила к заказу           {#calculate-order}

В заказе правила применяются через `Order::doFinalAction(true)`. Метод получает объект скидок заказа, запускает расчет, применяет результат к корзине, доставке и налогам. После расчета сохраните заказ через `Order::save()`.

#### Заказ без купона           {#calculate-order-rules}

Если правило не требует купон, достаточно пересчитать и сохранить заказ.

```php
$calculateResult = $order->doFinalAction(true);
if (!$calculateResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $calculateResult->getErrorMessages()));
}

$saveResult = $order->save();
if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $saveResult->getErrorMessages()));
}
```

#### Заказ с новым купоном

Если покупатель вводит купон при оформлении заказа, инициализируйте менеджер купонов в режиме клиента, добавьте купон и затем пересчитайте заказ.

```php
\Bitrix\Sale\DiscountCouponsManager::init(
    \Bitrix\Sale\DiscountCouponsManager::MODE_CLIENT,
    [
        'userId' => $order->getUserId(),
    ]
);

if (!\Bitrix\Sale\DiscountCouponsManager::add($couponCode))
{
    throw new \RuntimeException('Не удалось добавить купон в расчет');
}

$calculateResult = $order->doFinalAction(true);
if (!$calculateResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $calculateResult->getErrorMessages()));
}

$saveResult = $order->save();
if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $saveResult->getErrorMessages()));
}
```

После сохранения заказ хранит итоговую сумму, скидки на позиции корзины, скидки на доставку и примененные купоны. Сохраняйте заказ целиком через `Order::save()`, а не отдельные строки скидок.

#### Существующий заказ           {#recalculate-existing-order}

Для редактирования существующего заказа используйте режим `MODE_ORDER`. Он загружает купоны, уже связанные с заказом, и позволяет добавить новые купоны в контекст редактирования.

```php
\Bitrix\Sale\DiscountCouponsManager::init(
    \Bitrix\Sale\DiscountCouponsManager::MODE_ORDER,
    [
        'userId' => $order->getUserId(),
        'orderId' => $order->getId(),
    ]
);

if (!\Bitrix\Sale\DiscountCouponsManager::add($couponCode))
{
    throw new \RuntimeException('Не удалось добавить купон в расчет');
}

$calculateResult = $order->doFinalAction(true);
if (!$calculateResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $calculateResult->getErrorMessages()));
}

$saveResult = $order->save();
if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $saveResult->getErrorMessages()));
}
```

Если при редактировании заказа нужно удалить старые купоны, очистите менеджер купонов и затем пересчитайте заказ.

### Рассчитать правила для доставки

Правило может менять стоимость доставки. Для такого сценария в заказе должна быть отгрузка со службой доставки и рассчитанной базовой стоимостью. Затем `Order::doFinalAction(true)` применит правила к заказу и доставке.

```php
$shipmentCollection = $order->getShipmentCollection();

$deliveryResult = $shipmentCollection->calculateDelivery();
if (!$deliveryResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $deliveryResult->getErrorMessages()));
}

$calculateResult = $order->doFinalAction(true);
if (!$calculateResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $calculateResult->getErrorMessages()));
}

$applyResult = $order->getDiscount()->getApplyResult(false);
$deliveryDiscounts = [];

foreach ($applyResult['APPLY_BLOCKS'] ?? [] as $applyBlock)
{
    foreach ($applyBlock['ORDER'] ?? [] as $discount)
    {
        foreach ($discount['RESULT']['DELIVERY'] ?? [] as $deliveryResult)
        {
            $deliveryDiscounts[] = $deliveryResult;
        }
    }
}
```

Правило не изменит доставку, если у отгрузки установлена пользовательская стоимость доставки или если доставка не подходит под условия правила.

### Прочитать результат расчета {#read-calculation-result}

Пока заказ находится в памяти, результат расчета доступен через объект скидок заказа.

```php
$discount = $order->getDiscount();
$applyResult = $discount->getApplyResult(false);
```

Результат `getApplyResult(false)` содержит блоки:

#|
|| **Ключ** | **Что хранит** ||
|| `DISCOUNT_LIST` | Список правил, которые участвовали в расчете ||
|| `COUPON_LIST` | Купоны, связанные с расчетом ||
|| `APPLY_BLOCKS` | Блоки применения правил к товарам, доставке и заказу ||
|| `FULL_DISCOUNT_LIST` | Расширенное описание правил ||
|#

В `DISCOUNT_LIST` и `COUPON_LIST` есть поле `APPLY`. Значение:

-  `Y` — правило или купон повлияли на расчет,

-  `N` — объект участвовал в проверке, но не изменил итог.

Внутри `APPLY_BLOCKS` результат группируется по объектам:

-  `BASKET` — результат для конкретных позиций корзины,

-  `ORDER` — результат правила на уровне заказа, включая действия по корзине и доставке,

-  `BASKET_ROUND` — результат округления позиций корзины.

Метод `getApplyResult(true)` возвращает расширенный результат для отображения и убирает `APPLY_BLOCKS`. В нем примененные скидки по позициям находятся в `RESULT['BASKET']`.

```php
$extendedApplyResult = $discount->getApplyResult(true);
$showPrices = $discount->getShowPrices();
```

Для вывода цены позиции используйте данные объекта корзины или метод `getShowPrices()`. Не пересчитывайте скидку повторно по проценту из названия правила.

#### Сохраненный результат заказа

После сохранения заказа можно загрузить результат из хранилища.

```php
$result = \Bitrix\Sale\OrderDiscount::loadResultFromDb($orderId);
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$discountData = $result->getData();
```

Метод возвращает объект `Bitrix\Sale\Result`. В данных есть примененные блоки, список скидок, список купонов и служебные данные сохраненного расчета.

Для низкоуровневого чтения примененных правил используйте ORM-таблицу `OrderRulesTable` и метод `getList()`.

```php
$ruleRows = \Bitrix\Sale\Internals\OrderRulesTable::getList([
    'select' => [
        'ID',
        'MODULE_ID',
        'ORDER_DISCOUNT_ID',
        'DISCOUNT_NAME' => 'ORDER_DISCOUNT.NAME',
        'ENTITY_TYPE',
        'ENTITY_ID',
        'COUPON_ID',
        'APPLY',
    ],
    'filter' => [
        '=ORDER_ID' => $orderId,
    ],
    'order' => [
        'ID' => 'ASC',
    ],
])->fetchAll();
```

Поле `ENTITY_TYPE` показывает, к чему относится результат: к позиции корзины или доставке. Для чтения названия и исходных данных сохраненного правила используйте связь с `OrderDiscountTable`.

## Проверить, почему правило не применилось

Если правило или купон не применились, проверяйте расчет в том же контексте, в котором покупатель оформляет заказ. Если изменить пользователя, сайт, корзину, доставку или тип цены, результат может измениться.

1. Проверьте, что купон добавлен в менеджер и имеет корректный статус.

2. Запустите расчет корзины или заказа.

3. Получите купоны через `DiscountCouponsManager::get(true, [], true, true)`.

4. Получите примененные правила через `$order->getDiscount()->getApplyResult(true)` или `OrderDiscount::loadResultFromDb($orderId)`.

5. Проверьте товарные данные, которые участвуют в условиях правила: товар, цену, валюту, количество, доступный тип цены, пользователя и сайт.

6. Проверьте доставку, если правило должно менять стоимость доставки.

7. Проверьте порядок правил, `LAST_DISCOUNT`, `LAST_LEVEL_DISCOUNT` и режим применения скидок.

Пример проверки работы купона:

```php
$coupons = \Bitrix\Sale\DiscountCouponsManager::get(
    true,
    [],
    true,
    true
);

foreach ($coupons as $coupon)
{
    if ($coupon['STATUS'] === \Bitrix\Sale\DiscountCouponsManager::STATUS_APPLYED)
    {
        continue;
    }

    $reason = '';
    if (!empty($coupon['CHECK_CODE_TEXT']) && is_array($coupon['CHECK_CODE_TEXT']))
    {
        $reason = implode('; ', $coupon['CHECK_CODE_TEXT']);
    }

    echo $coupon['COUPON'] . ': ' . ($reason ?: 'Купон не применился') . "\n";
}
```

### Частые причины

1. Купон не найден, неактивен или вышел за период активности.

2. Правило скидки неактивно или не подходит по периоду действия.

3. Купон привязан к другому пользователю или исчерпал лимит использования.

4. Условия правила не совпали с товарами, суммой заказа, доставкой или сайтом.

5. Правило требует купон, но в расчете нет подходящего купона.

6. Правило не требует купон, но его остановило предыдущее правило.

7. Позиция корзины имеет пользовательскую цену или уже закрыта для следующих скидок.

8. Правило доставки проверяется до выбора или расчета службы доставки.

9. Корзина рассчитана без актуальных цен и купонов.

10. Заказ изменили после расчета, но не вызвали `doFinalAction(true)`.

## Связь с торговым каталогом

Модуль `sale` применяет правила в контексте корзины или заказа. Исходные товарные данные приходят из модуля `catalog`: товары, торговые предложения, цены, типы цен, валюты и остатки.

Если товарная цена должна учитывать права пользователя, диапазонные цены и купоны на уровне каталога, используйте API каталога. Подробнее в разделе [Торговый каталог](./../catalog/overview.md).

Для корректного расчета правил работы с корзиной проверьте:

-  что товар добавлен в корзину с правильным `PRODUCT_ID`, `MODULE`, ценой и валютой,

-  цена товара доступна текущему пользователю и сайту,

-  базовая цена товара заполнена корректно, если включена настройка `get_discount_percent_from_base_price`,

-  количество товара в корзине соответствует условиям правила,

-  купон создан в том модуле, который участвует в расчете,

-  корзина обновлена через `refreshData(['PRICE', 'COUPONS'])` перед предварительным расчетом.

### Как округление влияет на итог

Округление цен настраивается в торговом каталоге и влияет на цену товара, которую получает корзина. Если товарная цена уже округлена по правилам каталога, правила работы с корзиной рассчитываются от этой цены. После применения скидок заказ хранит итоговые суммы с учетом рассчитанных цен корзины, скидок, доставки и налогов.

Не дублируйте округление в коде расчета правила. Если нужно проверить правило округления цены, используйте API каталога. Подробнее в статье [Доступность, цены и подписка](./../catalog/availability-prices-subscription.md#round-price-rules).
