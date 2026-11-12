---
title: Доставка и отгрузки
description: "Доставка и отгрузки. Службы доставки, отгрузки, позиции отгрузки, расчет стоимости, ограничения и дополнительные услуги."
---

В модуле Интернет-магазин за доставку заказа отвечает служба доставки, а отгрузка связывает ее с товарами заказа. Через API разработчик выбирает службу доставки, распределяет товары по отгрузкам, рассчитывает стоимость, сохраняет трек-номер, разрешает доставку и списывает товары.

## Основные объекты

В работе с доставкой участвуют объекты отгрузки и классы службы доставки.

### Отгрузка заказа

#|
|| **Объект** | **Роль в сценарии** ||
|| `Bitrix\Sale\ShipmentCollection` | Хранит отгрузки заказа, создает новые отгрузки и пересчитывает стоимость доставки ||
|| `Bitrix\Sale\Shipment` | Хранит службу доставки, стоимость, статус, трек-номер, склад самовывоза и значения дополнительных услуг для одной отгрузки ||
|| `Bitrix\Sale\ShipmentItemCollection` | Хранит состав отгрузки — связь позиций корзины с количеством, которое входит в эту отгрузку ||
|| `Bitrix\Sale\ShipmentItem` | Хранит одну позицию отгрузки и количество товара из позиции корзины ||
|#

Отгрузка всегда принадлежит заказу. После изменений сохраняйте заказ через `Order::save()`. Не сохраняйте `Shipment`, `ShipmentCollection` или `ShipmentItemCollection` отдельно.

### Доставка

#|
|| **Объект** | **Роль в сценарии** ||
|| `Bitrix\Sale\Delivery\Services\Manager` | Возвращает службы доставки, проверяет ограничения и запускает расчет стоимости ||
|| `Bitrix\Sale\Delivery\Services\Base` | Базовый класс для своей службы доставки. В наследнике разработчик описывает настройки обработчика и расчет стоимости для конкретной отгрузки ||
|| `Bitrix\Sale\Delivery\CalculationResult` | Хранит результат расчета доставки — цену, стоимость дополнительных услуг, срок, описание и ошибки ||
|| `Bitrix\Sale\Delivery\Restrictions\Base` | Базовый класс ограничения доставки. Наследник проверяет, доступна ли служба доставки для отгрузки ||
|| `Bitrix\Sale\Delivery\ExtraServices` | Пространство имен дополнительных услуг доставки. Содержит типы «чекбокс», «выбор из списка», «количество», «склад самовывоза» и пользовательские типы ||
|#

{% note warning "" %}

Классы классического API доставки `CSaleDelivery`, `CSaleDeliveryHandler`, `CSaleDeliveryHelper` и `CSaleDelivery2PaySystem` могут встречаться в старых проектах. Классы `CSaleDelivery` и `CSaleDeliveryHandler` устарели.

В новых сценариях создавайте обработчики как наследников `Bitrix\Sale\Delivery\Services\Base`.

{% endnote %}

## Базовый сценарий

Чтобы оформить отгрузку, выполните шаги по порядку.

1. Загрузите или создайте заказ, как описано в статьях [Создание заказа](./order-create.md) и [Изменение заказа](./order-update.md).

2. Создайте отгрузку через `$order->getShipmentCollection()->createItem()`.

3. Добавьте позиции корзины в `ShipmentItemCollection` и установите количество.

4. Получите доступные службы через `Delivery\Services\Manager::getRestrictedObjectsList()` и назначьте выбранную службу через `Shipment::setDeliveryService()`.

5. Выберите дополнительные услуги через `Shipment::setExtraServices()`, если они нужны.

6. Рассчитайте доставку через `Delivery\Services\Manager::calculateDeliveryPrice()` или `ShipmentCollection::calculateDelivery()`.

7. Выполните финальный расчет заказа через `$order->doFinalAction(true)`.

8. Сохраните заказ через `$order->save()`.

После сохранения в заказе появится новая отгрузка со службой доставки, составом, рассчитанной стоимостью и выбранными дополнительными услугами.

Чтобы после расчета передать отгрузку во внешнюю транспортную службу, создайте транспортную заявку. Порядок описан в статье [Транспортные заявки](./delivery-requests.md).

## Подготовить данные для отгрузки

Перед шагами базового сценария соберите данные магазина и объекты заказа:

-  объект `$order` — новый или загруженный заказ с корзиной,

-  позиции корзины, которые можно передать в отгрузку через `$basketItem`,

-  идентификатор службы доставки `$deliveryId`,

-  валюту и [свойства заказа](./properties.md), если их используют ограничения или обработчик доставки,

-  идентификаторы дополнительных услуг, если сценарий выбирает значения через `Shipment::setExtraServices()`,

-  количество для частичной отгрузки, например `$firstQuantity`,

-  идентификатор склада, если сценарий списывает товары или задает склад самовывоза.

Служба доставки, ограничения и расчет читают данные через отгрузку и связанный с ней заказ. Сначала подготовьте заказ и корзину, затем создайте отгрузку, добавьте позиции и только после этого рассчитайте доставку.

## Выбрать службу доставки {#choose-delivery-service}

Служба доставки должна быть доступна для условий заказа. Менеджер служб доставки проверяет сайт, тип плательщика, [местоположение](./locations-taxes.md), сумму, вес, платежную систему и другие ограничения.

Два метода менеджера служб доставки возвращают доступные службы:

-  `getRestrictedObjectsList()` возвращает объекты служб `Delivery\Services\Base`, ключи массива — идентификаторы служб. Объект можно сразу передать в `Shipment::setDeliveryService()`. Метод не включает в результат службы с профилями, группы служб и службы, для которых `isCompatible()` вернул `false`.

-  `getRestrictedList()` возвращает массивы полей служб, ключи массива — идентификаторы служб. По умолчанию в результат попадают и службы с профилями, и группы служб.

Чтобы назначить службу отгрузке, используйте `getRestrictedObjectsList()`.

**Пример.** Код проверяет, что выбранная покупателем служба доступна для отгрузки, и назначает ее.

```php
// $shipment — отгрузка с добавленными позициями
// $deliveryId — идентификатор службы доставки, который выбрал покупатель

$availableDeliveries = \Bitrix\Sale\Delivery\Services\Manager::getRestrictedObjectsList(
    $shipment,
    \Bitrix\Sale\Services\Base\RestrictionManager::MODE_CLIENT
);

$delivery = $availableDeliveries[$deliveryId] ?? null;
if (!$delivery)
{
    throw new \RuntimeException('Служба доставки недоступна для заказа');
}

$shipment->setDeliveryService($delivery);
```

Чтобы показать менеджеру список служб вместе с теми, что не прошли мягкое ограничение, вызовите `getRestrictedList()` в режиме `MODE_MANAGER`.

**Пример.** Код выводит идентификатор и название каждой службы и отмечает службы, которые не прошли ограничение.

```php
$availableServices = \Bitrix\Sale\Delivery\Services\Manager::getRestrictedList(
    $shipment,
    \Bitrix\Sale\Services\Base\RestrictionManager::MODE_MANAGER
);

foreach ($availableServices as $serviceFields)
{
    echo $serviceFields['ID'] . ': ' . $serviceFields['NAME']
        . ($serviceFields['RESTRICTED'] ? ' (не прошла ограничение)' : '');
}
```

Второй параметр обоих методов задает режим проверки ограничений:

-  `MODE_CLIENT` оставляет только службы, которые прошли все ограничения. Метод `getRestrictedObjectsList()` применяет этот режим по умолчанию.

-  `MODE_MANAGER` оставляет и службы, которые не прошли мягкое ограничение. В результате `getRestrictedList()` у таких служб ключ `RESTRICTED` равен `true`.

Ограничение, которое служба не прошла, бывает мягким или строгим. По умолчанию в режиме менеджера ограничение мягкое, а в режиме клиента — строгое. Службы, которые не прошли строгое ограничение, не попадают в результат ни в одном режиме. Чтобы отметить службы, которые не прошли мягкое ограничение, используйте `getRestrictedList()` и ключ `RESTRICTED`.

Константы `Delivery\Restrictions\Manager::MODE_*`, `Services\PaySystem\Restrictions\Manager::MODE_*` и `Bitrix\Sale\Services\Base\RestrictionManager::MODE_*` имеют одинаковые значения.

Служба доставки связана с заказом через отгрузку. Она не заменяет свойства заказа. Адрес, местоположение, телефон и другие данные покупателя хранятся в [свойствах заказа](./properties.md).

## Коллекция отгрузок {#shipment-collection}

Заказ может содержать несколько отгрузок. Разработчик создает их, если товары отправляют разными службами доставки, с разных складов или несколькими партиями.

В коллекции всегда есть системная отгрузка. Она хранит товары, которые еще не распределены по пользовательским отгрузкам. Когда разработчик добавляет позицию корзины в пользовательскую отгрузку, количество этой позиции в системной отгрузке уменьшается.

**Пример.** Метод `getNotSystemItems()` возвращает пользовательские отгрузки без системной. Код выводит номер каждой отгрузки.

```php
$shipmentCollection = $order->getShipmentCollection();

foreach ($shipmentCollection->getNotSystemItems() as $shipment)
{
    echo $shipment->getField('ACCOUNT_NUMBER');
}
```

Если нужно получить конкретную отгрузку, используйте методы коллекции:

-  `getItemById($id)` возвращает отгрузку по идентификатору,

-  `getItemByIndex($index)` возвращает отгрузку по внутреннему индексу коллекции,

-  `getItemByShipmentCode($code)` возвращает отгрузку по коду.

## Создать отгрузку в заказе

Метод `ShipmentCollection::createItem()` добавляет объект `Shipment` в коллекцию и связывает его с заказом.

Если службу выбирает покупатель или идентификатор службы пришел из запроса, создайте отгрузку без службы доставки. До назначения другой службы у такой отгрузки стоит служба «Без доставки». Добавьте в отгрузку позиции и назначьте службу из списка доступных. Порядок описан в разделе [Выбрать службу доставки](#choose-delivery-service).

**Пример.** Код подключает модуль `sale` и создает отгрузку без службы доставки.

```php
if (!\Bitrix\Main\Loader::includeModule('sale'))
{
    throw new \RuntimeException('Не удалось подключить модуль sale');
}

// $order — новый или загруженный объект \Bitrix\Sale\Order

$shipmentCollection = $order->getShipmentCollection();
$shipment = $shipmentCollection->createItem();
```

Если службу проверили раньше, например на предыдущем шаге оформления заказа, передайте ее объект в `createItem()`. Метод `getObjectById()` загружает службу по идентификатору и ограничения не проверяет.

```php
// $deliveryId — идентификатор службы доставки, доступность которой уже проверена

$delivery = \Bitrix\Sale\Delivery\Services\Manager::getObjectById($deliveryId);
if (!$delivery)
{
    throw new \RuntimeException('Служба доставки не найдена');
}

$shipment = $order->getShipmentCollection()->createItem($delivery);
```

Дальше добавьте в отгрузку позиции. Если службу не передали в `createItem()`, назначьте ее, как описано в разделе [Выбрать службу доставки](#choose-delivery-service), и перейдите к расчету доставки.

## Добавить позиции в отгрузку

Объект `ShipmentItemCollection` хранит состав отгрузки. Каждая позиция ссылается на позицию корзины и хранит количество товара для доставки.

**Пример.** Код добавляет в отгрузку все позиции корзины с полным количеством.

```php
$shipmentItemCollection = $shipment->getShipmentItemCollection();

foreach ($order->getBasket() as $basketItem)
{
    $shipmentItem = $shipmentItemCollection->createItem($basketItem);
    if (!$shipmentItem)
    {
        throw new \RuntimeException('Не удалось создать позицию отгрузки');
    }

    $result = $shipmentItem->setQuantity($basketItem->getQuantity());
    if (!$result->isSuccess())
    {
        throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
    }
}
```

Метод `createItem($basketItem)` возвращает существующую позицию, если эта позиция корзины уже есть в отгрузке. Если по отгрузке уже списаны товары (`DEDUCTED = 'Y'`), метод возвращает `null`.

Для комплектов в составе отгрузки используйте специальные методы:

-  `getShippableItems()` возвращает позиции, которые участвуют в отгрузке, без родительских позиций комплекта и без услуг,

-  `getSellableItems()` возвращает фактически продаваемые позиции, без состава комплекта.

## Создать частичную отгрузку

Частичная отгрузка нужна, когда заказ отправляют не целиком. В этом сценарии разработчик добавляет в одну отгрузку только часть количества из позиции корзины, а остаток хранится в системной отгрузке или переходит в другую отгрузку.

**Пример.** Код переносит часть количества позиции в первую отгрузку, а остаток — во вторую отгрузку с другой службой доставки.

```php
// $firstQuantity — количество для первой отгрузки
// $secondDeliveryId — идентификатор второй службы доставки

if ($firstQuantity <= 0 || $firstQuantity >= $basketItem->getQuantity())
{
    throw new \RuntimeException('Количество для первой отгрузки должно быть больше нуля и меньше количества в корзине');
}

$firstShipmentItem = $shipment
    ->getShipmentItemCollection()
    ->createItem($basketItem)
;

if (!$firstShipmentItem)
{
    throw new \RuntimeException('Не удалось создать позицию первой отгрузки');
}

$result = $firstShipmentItem->setQuantity($firstQuantity);
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$secondDelivery = \Bitrix\Sale\Delivery\Services\Manager::getObjectById($secondDeliveryId);
if (!$secondDelivery)
{
    throw new \RuntimeException('Вторая служба доставки не найдена');
}

$secondShipment = $order->getShipmentCollection()->createItem($secondDelivery);
$secondShipmentItem = $secondShipment
    ->getShipmentItemCollection()
    ->createItem($basketItem)
;

if (!$secondShipmentItem)
{
    throw new \RuntimeException('Не удалось создать позицию второй отгрузки');
}

$result = $secondShipmentItem->setQuantity($basketItem->getQuantity() - $firstQuantity);
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Код примера загружает вторую службу через `getObjectById()` и не проверяет ее ограничения. Если вторую службу выбирает покупатель, создайте вторую отгрузку без службы, добавьте в нее позицию и назначьте службу из списка доступных. Порядок описан в разделе [Выбрать службу доставки](#choose-delivery-service).

**Пример.** Код проверяет, что суммарное количество позиции в пользовательских отгрузках не превышает количество в корзине.

```php
$distributedQuantity = $order
    ->getShipmentCollection()
    ->getBasketItemDistributedQuantity($basketItem)
;

if ($distributedQuantity > $basketItem->getQuantity())
{
    throw new \RuntimeException('Количество в отгрузках больше количества в корзине');
}
```

После изменения состава отгрузок запустите финальный расчет заказа и сохраните заказ.

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

## Рассчитать стоимость доставки

Метод `Delivery\Services\Manager::calculateDeliveryPrice()` возвращает стоимость одной отгрузки в объекте `Bitrix\Sale\Delivery\CalculationResult`. Метод принимает отгрузку, идентификатор службы доставки и значения дополнительных услуг. Чтобы сохранить рассчитанную цену в отгрузке, запишите результат `getPrice()` в поле `BASE_PRICE_DELIVERY`.

**Пример.** Код рассчитывает стоимость отгрузки с выбранными дополнительными услугами и записывает итоговую цену в поле `BASE_PRICE_DELIVERY`.

```php
$calculationResult = \Bitrix\Sale\Delivery\Services\Manager::calculateDeliveryPrice(
    $shipment,
    $deliveryId,
    $shipment->getExtraServices()
);

if (!$calculationResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $calculationResult->getErrorMessages()));
}

$result = $shipment->setField('BASE_PRICE_DELIVERY', $calculationResult->getPrice());
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Результат `CalculationResult` хранит стоимость, срок и описание:

-  `getDeliveryPrice()` — стоимость доставки без дополнительных услуг,

-  `getExtraServicesPrice()` — стоимость выбранных дополнительных услуг,

-  `getPrice()` — итоговая стоимость доставки с дополнительными услугами,

-  `getPeriodFrom()` — начало срока доставки,

-  `getPeriodTo()` — конец срока доставки,

-  `getPeriodType()` — единица срока, например `CalculationResult::PERIOD_TYPE_DAY`,

-  `getDescription()` и `getPeriodDescription()` — описание расчета и срока.

Чтобы пересчитать все пользовательские отгрузки заказа, используйте метод коллекции `ShipmentCollection::calculateDelivery()`.

```php
$result = $order->getShipmentCollection()->calculateDelivery();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Коллекция пропускает системную отгрузку и отгрузки с `DELIVERY_ID = 0`. Отгрузка, созданная через `createItem()` без аргумента, получает службу «Без доставки» и тоже попадает в расчет. Для остальных отгрузок она сама записывает итоговую цену в поле `BASE_PRICE_DELIVERY`. Если у отгрузки установлен флаг ручной цены `CUSTOM_PRICE_DELIVERY = 'Y'`, коллекция не вызывает обработчик доставки и берет текущую цену отгрузки.

## Добавить дополнительную услугу

Дополнительная услуга уточняет доставку и может изменить ее стоимость. Например, дополнительной услугой может быть подъем на этаж, страховка, выбор пункта самовывоза или упаковка.

В модуле есть встроенные типы дополнительных услуг:

-  `Bitrix\Sale\Delivery\ExtraServices\Checkbox` — флаг `Y` или `N`,

-  `Bitrix\Sale\Delivery\ExtraServices\Enum` — выбор одного значения из списка,

-  `Bitrix\Sale\Delivery\ExtraServices\Quantity` — количество, умноженное на цену,

-  `Bitrix\Sale\Delivery\ExtraServices\Store` — выбор склада самовывоза.

### Создать запись дополнительной услуги

Чтобы добавить дополнительную услугу к службе доставки, вызовите `Bitrix\Sale\Delivery\ExtraServices\Table::add()`. Поля записи:

-  `CODE` — символьный код услуги,

-  `NAME` — название услуги,

-  `CLASS_NAME` — класс типа услуги, например `\Bitrix\Sale\Delivery\ExtraServices\Checkbox`,

-  `PARAMS` — настройки типа. Для `Checkbox` и `Quantity` ключ `PRICE` задает цену,

-  `RIGHTS` — права на изменение значения услуги,

-  `DELIVERY_ID` — идентификатор службы доставки,

-  `INIT_VALUE` — значение услуги по умолчанию,

-  `ACTIVE` — активность услуги,

-  `SORT` — порядок показа.

Поле `RIGHTS` — строка из трех символов `Y` или `N`. Первый символ задает право администратора, второй — менеджера, третий — клиента. Значение `YYY` разрешает изменение всем трем ролям.

**Пример.** Код добавляет службе доставки `$deliveryId` услугу-флаг «Подъем на этаж» и сохраняет ее идентификатор в `$extraServiceId`.

```php
$result = \Bitrix\Sale\Delivery\ExtraServices\Table::add([
    'CODE' => 'LIFT',
    'NAME' => 'Подъем на этаж',
    'CLASS_NAME' => '\Bitrix\Sale\Delivery\ExtraServices\Checkbox',
    'PARAMS' => [
        'PRICE' => 300,
    ],
    'RIGHTS' => 'YYY',
    'DELIVERY_ID' => $deliveryId,
    'INIT_VALUE' => 'N',
    'ACTIVE' => 'Y',
    'SORT' => 100,
]);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$extraServiceId = $result->getId();
```

### Выбрать услугу в отгрузке

Чтобы включить услугу в конкретной отгрузке, передайте значения в `Shipment::setExtraServices()`. Метод заменяет весь набор услуг отгрузки. Чтобы сохранить уже выбранные услуги, объедините новые значения с результатом `$shipment->getExtraServices()`. Ключ массива — идентификатор дополнительной услуги. Значение зависит от типа услуги:

-  `Checkbox` — `Y` или `N`,

-  `Enum` — ключ варианта из массива `PARAMS['PRICES']`,

-  `Quantity` — количество, на которое умножается цена,

-  `Store` — идентификатор склада самовывоза.

**Пример.** Код включает услугу `$extraServiceId`, пересчитывает стоимость отгрузки и записывает ее в поле `BASE_PRICE_DELIVERY`.

```php
$extraServices = $shipment->getExtraServices();
$extraServices[$extraServiceId] = 'Y';
$shipment->setExtraServices($extraServices);

$calculationResult = \Bitrix\Sale\Delivery\Services\Manager::calculateDeliveryPrice(
    $shipment,
    $deliveryId,
    $shipment->getExtraServices()
);

if (!$calculationResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $calculationResult->getErrorMessages()));
}

$result = $shipment->setField('BASE_PRICE_DELIVERY', $calculationResult->getPrice());
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Выбранные услуги сохранятся вместе с заказом.

## Расширить возможности доставки

Разработчик добавляет собственные дополнительные услуги, ограничения и обработчики. Для этого он наследует базовый класс и регистрирует его в событии модуля `sale`.

### Создать пользовательский тип дополнительной услуги

Пользовательский тип дополнительной услуги нужен, когда встроенных типов недостаточно. Унаследуйте класс пользовательского типа от `Bitrix\Sale\Delivery\ExtraServices\Base`.

Обязательно реализуйте `getClassTitle()`, остальные методы переопределите по необходимости:

-  `getClassTitle()` — возвращает название типа,

-  `getCostShipment()` — рассчитывает стоимость услуги для отгрузки,

-  `getAdminParamsName()` — возвращает название блока с настройками услуги. В базовом классе метода нет. Если не объявить его, форма покажет стандартную подпись,

-  `prepareParamsToSave()` — подготавливает параметры перед сохранением, например приводит стоимость к числу,

-  `getAdminParamsControl()` — выводит поле настройки в административной форме службы доставки.

**Пример.** Класс `FragilePackaging` добавляет услугу «Хрупкая упаковка» со стоимостью из настроек услуги.

```php
namespace Local\Sale\Delivery\ExtraServices;

class FragilePackaging extends \Bitrix\Sale\Delivery\ExtraServices\Base
{
    public function __construct($id, array $structure, $currency, $value = null, array $additionalParams = [])
    {
        parent::__construct($id, $structure, $currency, $value, $additionalParams);

        $this->params['TYPE'] = 'Y/N';
    }

    public static function getClassTitle()
    {
        return 'Хрупкая упаковка';
    }

    public static function getAdminParamsName()
    {
        return 'Стоимость упаковки';
    }

    public static function prepareParamsToSave(array $params)
    {
        $params['PARAMS']['PRICE'] ??= 0;
        $params['PARAMS']['PRICE'] = (float)$params['PARAMS']['PRICE'];

        return $params;
    }

    public static function getAdminParamsControl($name, array $params, $currency = '')
    {
        return \Bitrix\Sale\Internals\Input\Manager::getEditHtml(
            $name . '[PARAMS][PRICE]',
            [
                'TYPE' => 'NUMBER',
            ],
            $params['PARAMS']['PRICE'] ?? 0
        ) . ($currency !== '' ? ' (' . $currency . ')' : '');
    }

    public function getCostShipment(?\Bitrix\Sale\Shipment $shipment = null)
    {
        if ($this->value !== 'Y')
        {
            return 0;
        }

        $basePrice = isset($this->params['PRICE'])
            ? (float)$this->params['PRICE']
            : 0
        ;

        return $basePrice;
    }
}
```

В конструкторе тип `Y/N` задает элемент управления для значения услуги по умолчанию. Без ключа `TYPE` форма выбросит `SystemException`.

Зарегистрируйте класс через событие `onSaleDeliveryExtraServicesClassNamesBuildList`.

```php
$eventManager = \Bitrix\Main\EventManager::getInstance();

$eventManager->addEventHandler(
    'sale',
    'onSaleDeliveryExtraServicesClassNamesBuildList',
    static function ()
    {
        return new \Bitrix\Main\EventResult(
            \Bitrix\Main\EventResult::SUCCESS,
            [
                '\Local\Sale\Delivery\ExtraServices\FragilePackaging' =>
                    '/local/php_interface/lib/sale/delivery/extra_services/fragilepackaging.php',
            ],
            'sale'
        );
    }
);
```

После регистрации укажите этот класс в `CLASS_NAME` записи дополнительной услуги.

### Создать пользовательское ограничение доставки

Ограничение доставки проверяет доступность службы доставки для конкретной отгрузки. Например, доступность службы может зависеть от значения свойства заказа или внешнего признака.

Унаследуйте класс ограничения от `Bitrix\Sale\Delivery\Restrictions\Base`. В классе реализуйте методы:

-  `getClassTitle()` и `getClassDescription()` — возвращают название и описание ограничения,

-  `getParamsStructure()` — задает настройки ограничения, которые `check()` получает в `$restrictionParams`,

-  `extractParams()` — получает данные из отгрузки,

-  `check()` — сравнивает их с настройками ограничения.

**Пример.** Ограничение `ByOrderPropertyValue` разрешает службу, если свойство заказа `DELIVERY_ZONE` совпадает со значением из настроек ограничения.

```php
namespace Local\Sale\Delivery\Restrictions;

class ByOrderPropertyValue extends \Bitrix\Sale\Delivery\Restrictions\Base
{
    public static function getClassTitle()
    {
        return 'По значению свойства заказа';
    }

    public static function getClassDescription()
    {
        return 'Проверяет значение свойства заказа для отгрузки.';
    }

    public static function check($propertyValue, array $restrictionParams, $deliveryId = 0)
    {
        if (empty($restrictionParams['VALUE']))
        {
            return true;
        }

        return (string)$propertyValue === (string)$restrictionParams['VALUE'];
    }

    protected static function extractParams(\Bitrix\Sale\Internals\Entity $entity)
    {
        if (!$entity instanceof \Bitrix\Sale\Shipment)
        {
            return '';
        }

        $order = $entity->getCollection()->getOrder();
        $property = $order
            ->getPropertyCollection()
            ->getItemByOrderPropertyCode('DELIVERY_ZONE')
        ;

        return $property ? $property->getValue() : '';
    }

    public static function getParamsStructure($entityId = 0)
    {
        return [
            'VALUE' => [
                'TYPE' => 'STRING',
                'DEFAULT' => '',
                'LABEL' => 'Допустимое значение свойства DELIVERY_ZONE',
            ],
        ];
    }
}
```

Зарегистрируйте ограничение через событие `onSaleDeliveryRestrictionsClassNamesBuildList`.

```php
$eventManager = \Bitrix\Main\EventManager::getInstance();

$eventManager->addEventHandler(
    'sale',
    'onSaleDeliveryRestrictionsClassNamesBuildList',
    static function ()
    {
        return new \Bitrix\Main\EventResult(
            \Bitrix\Main\EventResult::SUCCESS,
            [
                '\Local\Sale\Delivery\Restrictions\ByOrderPropertyValue' =>
                    '/local/php_interface/lib/sale/delivery/restrictions/byorderpropertyvalue.php',
            ],
            'sale'
        );
    }
);
```

Чтобы привязать ограничение к службе доставки программно, вызовите `save()` у класса ограничения.

```php
$result = \Local\Sale\Delivery\Restrictions\ByOrderPropertyValue::save([
    'SERVICE_ID' => $deliveryId,
    'SERVICE_TYPE' => \Bitrix\Sale\Delivery\Restrictions\Manager::SERVICE_TYPE_SHIPMENT,
    'SORT' => 100,
    'PARAMS' => [
        'VALUE' => 'CENTER',
    ],
]);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

После этого `Delivery\Services\Manager::getRestrictedObjectsList()`, `getRestrictedList()` и `Delivery\Restrictions\Manager::checkService()` будут учитывать новое ограничение в следующих запросах. Если в текущем запросе ограничения уже проверялись, модуль использует список ограничений, прочитанный до сохранения. Чтобы изменить существующее ограничение, передайте его идентификатор вторым аргументом `save($fields, $restrictionId)`. Без идентификатора повторный вызов `save()` создаст еще одно ограничение с теми же параметрами.

### Создать собственную службу доставки

Собственная служба доставки нужна, когда проект рассчитывает доставку по своим правилам или обращается к внешнему сервису.

Унаследуйте класс службы доставки от `Bitrix\Sale\Delivery\Services\Base`.

#### Класс обработчика {#delivery-handler-class}

**Пример.** Обработчик `CityCourier` рассчитывает стоимость по базовой цене из настроек и добавляет надбавку для отгрузок тяжелее 5 кг.

```php
namespace Local\Sale\Delivery\Services;

class CityCourier extends \Bitrix\Sale\Delivery\Services\Base
{
    protected $handlerCode = 'LOCAL_CITY_COURIER';

    public static function getClassTitle()
    {
        return 'Городской курьер';
    }

    public static function getClassDescription()
    {
        return 'Рассчитывает доставку городским курьером.';
    }

    protected function calculateConcrete(\Bitrix\Sale\Shipment $shipment)
    {
        $result = new \Bitrix\Sale\Delivery\CalculationResult();

        $basePrice = isset($this->config['MAIN']['BASE_PRICE'])
            ? (float)$this->config['MAIN']['BASE_PRICE']
            : 0
        ;

        $weightPrice = $shipment->getWeight() > 5000 ? 200 : 0;

        $result->setDeliveryPrice($basePrice + $weightPrice);
        $result->setPeriodFrom(1);
        $result->setPeriodTo(2);
        $result->setPeriodType(\Bitrix\Sale\Delivery\CalculationResult::PERIOD_TYPE_DAY);
        $result->setPeriodDescription('1-2 дня');

        return $result;
    }

    protected function getConfigStructure()
    {
        return [
            'MAIN' => [
                'TITLE' => 'Настройки расчета',
                'DESCRIPTION' => 'Базовые параметры курьерской доставки',
                'ITEMS' => [
                    'BASE_PRICE' => [
                        'TYPE' => 'NUMBER',
                        'MIN' => 0,
                        'DEFAULT' => 500,
                        'NAME' => 'Базовая стоимость',
                    ],
                ],
            ],
        ];
    }
}
```

В обработчике важны четыре части:

-  `$handlerCode` — задает код обработчика,

-  `getClassTitle()` и `getClassDescription()` — возвращают название и описание для списка обработчиков,

-  `getConfigStructure()` — описывает настройки службы доставки,

-  `calculateConcrete()` — рассчитывает стоимость и возвращает `CalculationResult`.

#### Настройки обработчика

Метод `getConfigStructure()` возвращает структуру формы настроек. Ключи верхнего уровня — коды групп настроек, например `MAIN`. У группы есть ключи:

-  `TITLE` — название группы,

-  `DESCRIPTION` — описание группы,

-  `ITEMS` — поля группы. Ключ — код настройки, значение — описание поля.

При сохранении службы система сохранит значения в поле `CONFIG` с теми же группами и кодами.

Таблица описывает параметры поля настройки.

#|
|| **Параметр** | **Описание** ||
|| `TYPE`* | Тип поля. Без него форма настроек выбросит `SystemException`. По нему административный интерфейс выбирает элемент управления и способ проверки значения ||
|| `NAME` | Название поля в форме настроек службы доставки ||
|| `DEFAULT` | Значение по умолчанию, если в сохраненной конфигурации нет значения ||
|| `VALUE` | Текущее значение. Обычно его не задают вручную. Сервис подставляет сохраненное значение из `CONFIG` или `DEFAULT` ||
|| `REQUIRED` | Обязательное поле. Используйте `Y` или `true` ||
|| `MULTIPLE` | Множественное значение. Используйте `Y`, если тип поддерживает несколько значений ||
|| `HIDDEN` | Скрытое поле. Система хранит значение, но не показывает строку настройки ||
|| `DISABLED` | Недоступное поле. Значение такого поля не обрабатывается как обычный пользовательский ввод ||
|| `READONLY` | HTML-атрибут `readonly` для типов, которые его поддерживают, например `STRING`, `NUMBER` и `DATE`. Если нужно показать неизменяемое значение и сохранить его скрытым полем, используйте тип `DELIVERY_READ_ONLY` ||
|| `ONCHANGE`, `ONCLICK` | Клиентские JavaScript-обработчики для элементов управления, которые выводят эти атрибуты. Для кнопки используйте тип `DELIVERY_BUTTON_SELECTOR` и параметр `BUTTON` ||
|| `MIN`, `MAX`, `STEP` | Ограничения для числового поля `NUMBER` ||
|| `OPTIONS` | Варианты для `ENUM`. Ключ массива сохраняется как значение, значение массива показывается пользователю ||
|| `MULTILINE`, `SIZE`, `ROWS`, `COLS`, `PLACEHOLDER` | Дополнительные параметры текстового поля `STRING` ||
|#

*Обязательные параметры обозначены \*.*

Для настроек доставки можно использовать стандартные типы:

-  `STRING` — текстовое поле. Подходит для строковых настроек — логина, токена, URL, кода тарифа.

-  `NUMBER` — числовое поле с проверкой значения. Поддерживает ограничения `MIN`, `MAX` и `STEP`.

-  `Y/N` — чекбокс со значением `Y` или `N`.

-  `ENUM` — выбор из списка. Варианты передают в параметре `OPTIONS`.

-  `FILE` — загрузка файла.

-  `DATE` — поле даты. Если нужен ввод времени, используйте параметр `TIME`.

-  `LOCATION` — выбор одного местоположения.

-  `ADDRESS` — поле адреса.

Также для служб доставки доступны специальные типы:

-  `DELIVERY_READ_ONLY` — значение только для просмотра. В форме показывается текст, а значение сохраняется в скрытом поле.

-  `DELIVERY_PERIOD` — период доставки с полями «от», «до» и единицей измерения.

-  `DELIVERY_MULTI_CONTROL_STRING` — строка с дополнительным выбором. Используется, когда рядом с текстовым значением нужен связанный элемент выбора.

-  `LOCATION_MULTI` — выбор нескольких местоположений для службы доставки.

-  `LOCATION_MULTI_EXCLUDE` — выбор местоположений, которые нужно исключить.

-  `DELIVERY_BUTTON_SELECTOR` — элемент выбора с названием, кнопкой и скрытыми полями `NAME` и `VALUE`.

Тип `DELIVERY_BUTTON_SELECTOR` использует ключи:

-  `NAME_DEFAULT` — название, которое форма показывает, пока элемент не выбран,

-  `VALUE_DEFAULT` — значение скрытого поля `VALUE`, пока элемент не выбран,

-  `READONLY_NAME_ID` — атрибут `id` блока с названием выбранного элемента,

-  `BUTTON` — массив с ключами `NAME` для подписи кнопки и `ONCLICK` для JavaScript-обработчика.

**Пример.** Настройка показывает название выбранного пункта выдачи и кнопку «Выбрать пункт», которая открывает страницу выбора в боковой панели.

```php
$pickupPointConfig = [
    'TYPE' => 'DELIVERY_BUTTON_SELECTOR',
    'NAME' => 'Пункт выдачи',
    'NAME_DEFAULT' => 'Пункт не выбран',
    'VALUE_DEFAULT' => '',
    'READONLY_NAME_ID' => 'city-courier-pickup-name',
    'BUTTON' => [
        'NAME' => 'Выбрать пункт',
        'ONCLICK' => "BX.SidePanel.Instance.open('/local/tools/pickup.php');",
    ],
];
```

Кнопка открывает пользовательский интерфейс выбора. Если кнопке нужны серверные данные, откройте свое окно или слайдер, получите данные через административный AJAX-обработчик и после выбора обновите скрытые поля настройки.

#### Зарегистрировать и сохранить обработчик

Зарегистрируйте класс обработчика через событие `onSaleDeliveryHandlersClassNamesBuildList`.

```php
$eventManager = \Bitrix\Main\EventManager::getInstance();

$eventManager->addEventHandler(
    'sale',
    'onSaleDeliveryHandlersClassNamesBuildList',
    static function ()
    {
        return new \Bitrix\Main\EventResult(
            \Bitrix\Main\EventResult::SUCCESS,
            [
                '\Local\Sale\Delivery\Services\CityCourier' =>
                    '/local/php_interface/lib/sale/delivery/services/citycourier.php',
            ],
            'sale'
        );
    }
);
```

Теперь сохраните службу доставки через `Delivery\Services\Manager::add()`. Передайте поля:

-  `NAME` — название службы,

-  `ACTIVE` — активность,

-  `CLASS_NAME` — класс обработчика,

-  `CURRENCY` — валюта расчета,

-  `SORT` — порядок сортировки,

-  `CONFIG` — значения настроек по структуре из `getConfigStructure()`.

**Пример.** Код создает службу доставки «Городской курьер» с базовой стоимостью 500 в базовой валюте и сохраняет ее идентификатор в `$deliveryId`.

```php
$result = \Bitrix\Sale\Delivery\Services\Manager::add([
    'NAME' => 'Городской курьер',
    'ACTIVE' => 'Y',
    'CLASS_NAME' => '\Local\Sale\Delivery\Services\CityCourier',
    'CURRENCY' => \Bitrix\Currency\CurrencyManager::getBaseCurrency(),
    'SORT' => 100,
    'CONFIG' => [
        'MAIN' => [
            'BASE_PRICE' => 500,
        ],
    ],
]);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$deliveryId = $result->getId();
```

После успешного сохранения служба появляется в списке служб доставки в административном интерфейсе. В коде ее можно получить через `Delivery\Services\Manager::getObjectById($deliveryId)`, привязать к отгрузке и рассчитать стоимость через API доставки.

#### Добавить профили на основе одного класса

Профиль — дочерняя служба доставки со своими настройками и расчетом. Сначала сохраните родительскую службу доставки. Ее идентификатор `$deliveryId` понадобится в поле `PARENT_ID` каждого профиля.

Если все профили обрабатывает один PHP-класс, добавьте в родительский обработчик три метода:

-  `canHasProfiles()` — разрешает создавать профили,

-  `getProfilesList()` — возвращает идентификаторы и названия профилей,

-  `getChildrenClassNames()` — возвращает класс, который обрабатывает профили.

Добавьте эти методы в класс `CityCourier` из раздела [Класс обработчика](#delivery-handler-class). Остальные методы класса не меняются.

**Пример.** Родительский обработчик разрешает профили `STANDARD` и `EXPRESS` и передает их обработку классу `CityCourierProfile`.

```php
namespace Local\Sale\Delivery\Services;

class CityCourier extends \Bitrix\Sale\Delivery\Services\Base
{
    public static function canHasProfiles()
    {
        return true;
    }

    public function getProfilesList()
    {
        return [
            'STANDARD' => 'Стандартная доставка',
            'EXPRESS' => 'Экспресс-доставка',
        ];
    }

    public static function getChildrenClassNames()
    {
        return [
            CityCourierProfile::class,
        ];
    }
}
```

Класс профиля получает его идентификатор из параметров создания или из сохраненной конфигурации. Поле `PROFILE_ID` добавьте в `CONFIG`, чтобы идентификатор был доступен после загрузки профиля из базы данных.

**Пример.** Класс профиля читает код профиля и выбирает по нему стоимость.

```php
namespace Local\Sale\Delivery\Services;

class CityCourierProfile extends \Bitrix\Sale\Delivery\Services\Base
{
    protected $profileId = '';

    public function __construct(array $initParams)
    {
        parent::__construct($initParams);

        if (!empty($initParams['PROFILE_ID']))
        {
            $this->profileId = (string)$initParams['PROFILE_ID'];
        }
        elseif (!empty($this->config['MAIN']['PROFILE_ID']))
        {
            $this->profileId = (string)$this->config['MAIN']['PROFILE_ID'];
        }

        if ($this->name === '' && $this->profileId !== '')
        {
            $parentService = $this->getParentService();
            $profiles = $parentService ? $parentService->getProfilesList() : [];
            $this->name = (string)($profiles[$this->profileId] ?? '');
        }
    }

    public static function isProfile()
    {
        return true;
    }

    protected function getProfileType(): string
    {
        return $this->profileId;
    }

    protected function getConfigStructure()
    {
        return [
            'MAIN' => [
                'TITLE' => 'Настройки профиля',
                'ITEMS' => [
                    'PROFILE_ID' => [
                        'TYPE' => 'STRING',
                        'NAME' => 'Код профиля',
                        'HIDDEN' => true,
                        'DEFAULT' => $this->profileId,
                    ],
                ],
            ],
        ];
    }

    protected function calculateConcrete(\Bitrix\Sale\Shipment $shipment)
    {
        $result = new \Bitrix\Sale\Delivery\CalculationResult();
        $price = $this->profileId === 'EXPRESS' ? 900 : 500;

        $result->setDeliveryPrice($price);

        return $result;
    }
}
```

Метод `isProfile()` отмечает дочернюю службу как профиль. В `calculateConcrete()` используйте сохраненный `$profileId`, чтобы выбрать правила расчета.

Зарегистрируйте класс профиля для автозагрузки. Разместите регистрацию в файле родительского обработчика до объявления класса `CityCourier`.

```php
\Bitrix\Main\Loader::registerAutoLoadClasses(
    null,
    [
        \Local\Sale\Delivery\Services\CityCourierProfile::class =>
            '/local/php_interface/lib/sale/delivery/services/citycourierprofile.php',
    ]
);
```

Получите сохраненный объект родительской службы и создайте для каждого профиля из `getProfilesList()` дочернюю службу класса `CityCourierProfile`.

```php
$parentDelivery = \Bitrix\Sale\Delivery\Services\Manager::getObjectById($deliveryId);
if (!$parentDelivery)
{
    throw new \RuntimeException('Родительская служба доставки не найдена');
}

$profileIds = [];

foreach ($parentDelivery->getProfilesList() as $profileId => $profileName)
{
    $result = \Bitrix\Sale\Delivery\Services\Manager::add([
        'NAME' => $profileName,
        'ACTIVE' => 'Y',
        'PARENT_ID' => $deliveryId,
        'CLASS_NAME' => \Local\Sale\Delivery\Services\CityCourierProfile::class,
        'CURRENCY' => \Bitrix\Currency\CurrencyManager::getBaseCurrency(),
        'SORT' => 100,
        'CONFIG' => [
            'MAIN' => [
                'PROFILE_ID' => $profileId,
            ],
        ],
    ]);

    if (!$result->isSuccess())
    {
        throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
    }

    $profileIds[$profileId] = $result->getId();
}
```

Метод `Manager::add()` сохраняет каждый профиль как отдельную службу доставки с идентификатором родителя в `PARENT_ID`. Массив `$profileIds` связывает коды `STANDARD` и `EXPRESS` с идентификаторами созданных служб. Перед повторным выполнением кода проверьте, что у родительской службы еще нет таких профилей, иначе код создаст дубли.

#### Добавить профили на основе разных классов

Используйте разные классы, если профилям нужны независимые настройки, расчет или интеграция с разными внешними сервисами.

Выберите класс по идентификатору профиля в методе `createProfileObject()`. Добавьте методы в класс `CityCourier` из раздела [Класс обработчика](#delivery-handler-class). Остальные методы класса не меняются.

**Пример.** Метод `createProfileObject()` выбирает класс по коду `PROFILE_ID` и создает объект профиля.

```php
namespace Local\Sale\Delivery\Services;

class CityCourier extends \Bitrix\Sale\Delivery\Services\Base
{
    private const PROFILE_CLASSES = [
        'STANDARD' => CityCourierStandardProfile::class,
        'EXPRESS' => CityCourierExpressProfile::class,
    ];

    public static function canHasProfiles()
    {
        return true;
    }

    public function getProfilesList()
    {
        return [
            'STANDARD' => 'Стандартная доставка',
            'EXPRESS' => 'Экспресс-доставка',
        ];
    }

    public static function getChildrenClassNames()
    {
        return array_values(self::PROFILE_CLASSES);
    }

    public function createProfileObject($fields)
    {
        $profileId = (string)($fields['PROFILE_ID'] ?? '');

        if ($profileId !== '')
        {
            if (!isset(self::PROFILE_CLASSES[$profileId]))
            {
                throw new \Bitrix\Main\SystemException(
                    'Неизвестный профиль службы доставки: ' . $profileId
                );
            }

            $fields['CLASS_NAME'] = self::PROFILE_CLASSES[$profileId];
        }

        return \Bitrix\Sale\Delivery\Services\Manager::createObject($fields);
    }
}
```

Создайте классы профилей, например `CityCourierStandardProfile` и `CityCourierExpressProfile`. Классы профилей должны наследоваться от `Bitrix\Sale\Delivery\Services\Base` и возвращать `true` из `isProfile()`. Реализуйте в каждом классе настройки и расчет стоимости, затем зарегистрируйте классы для автозагрузки.

Передайте код профиля в `PROFILE_ID`. Сохраните имя выбранного класса в `CLASS_NAME`, а `PROFILE_ID` удалите из массива полей перед `Manager::add()`. Этот ключ нужен только для выбора класса.

**Пример.** Код создает дочернюю службу для каждого профиля и сохраняет класс, который выбрал `createProfileObject()`.

```php
$parentDelivery = \Bitrix\Sale\Delivery\Services\Manager::getObjectById($deliveryId);
if (!$parentDelivery)
{
    throw new \RuntimeException('Родительская служба доставки не найдена');
}

$profileIds = [];

foreach ($parentDelivery->getProfilesList() as $profileId => $profileName)
{
    $fields = [
        'NAME' => $profileName,
        'ACTIVE' => 'Y',
        'PARENT_ID' => $deliveryId,
        'PROFILE_ID' => $profileId,
        'CLASS_NAME' => '',
        'CURRENCY' => \Bitrix\Currency\CurrencyManager::getBaseCurrency(),
        'SORT' => 100,
        'CONFIG' => [],
    ];

    $profileObject = $parentDelivery->createProfileObject($fields);
    if (!$profileObject)
    {
        throw new \RuntimeException('Не удалось создать объект профиля доставки');
    }

    $fields['CLASS_NAME'] = get_class($profileObject);
    unset($fields['PROFILE_ID']);

    $result = \Bitrix\Sale\Delivery\Services\Manager::add($fields);

    if (!$result->isSuccess())
    {
        throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
    }

    $profileIds[$profileId] = $result->getId();
}
```

После успешного сохранения `$profileIds` содержит идентификаторы дочерних служб. Перед повторным выполнением кода проверьте существующие профили родительской службы, чтобы не создать дубли.

После создания профиля поле `CLASS_NAME` хранит выбранный класс. При последующей загрузке и расчете служба использует сохраненный класс без повторного выбора по `PROFILE_ID`.

## Разрешить доставку, списать товары и добавить трек-номер

Состояние отгрузки задают поля и методы из таблицы.

#|
|| **Поле или метод** | **Что делает** ||
|| `STATUS_ID` | Хранит статус отгрузки. Статусы отгрузки описаны в статье [Статусы и события](./statuses-events.md) ||
|| `allowDelivery()` | Устанавливает `ALLOW_DELIVERY = 'Y'`, дату `DATE_ALLOW_DELIVERY` и идентификатор текущего пользователя в `EMP_ALLOW_DELIVERY_ID` ||
|| `disallowDelivery()` | Снимает разрешение доставки ||
|| `DEDUCTED` | Показывает, списаны ли товары по отгрузке. Значения `Y` или `N` ||
|| `TRACKING_NUMBER` | Хранит трек-номер отправления ||
|| `DELIVERY_DOC_NUM` | Хранит номер документа доставки ||
|| `DELIVERY_DOC_DATE` | Хранит дату документа доставки ||
|| `setStoreId($storeId)` | Устанавливает склад самовывоза для отгрузки ||
|#

Перед списанием проверьте, что состав отгрузки заполнен, а количество в отгрузках не превышает количество в корзине. Порядок резервирования и списания описан в статье [Резервирование и списание](./reservation-deduct.md).

**Пример.** Код разрешает доставку, записывает трек-номер и номер документа доставки, списывает товары по отгрузке и сохраняет заказ.

```php
$result = $shipment->allowDelivery();
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$result = $shipment->setFields([
    'TRACKING_NUMBER' => 'TRACK-123456',
    'DELIVERY_DOC_NUM' => 'D-1024',
    'DELIVERY_DOC_DATE' => new \Bitrix\Main\Type\Date(),
]);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$result = $shipment->setField('DEDUCTED', 'Y');
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$saveResult = $order->save();
if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $saveResult->getErrorMessages()));
}
```

## Настроить трекинг

Трек-номер хранится в поле `TRACKING_NUMBER`. Проверка статуса отправления зависит от обработчика трекинга службы доставки.

Класс трекинга наследуется от `Bitrix\Sale\Delivery\Tracking\Base`. Класс реализует методы экземпляра `getClassTitle()`, `getClassDescription()` и `getParamsStructure()`. В отличие от классов службы доставки и ограничения, здесь эти методы нестатические. Статус отправления класс возвращает через `getStatus($trackingNumber)` в объекте `Bitrix\Sale\Delivery\Tracking\StatusResult` или через `getStatuses()`.

Зарегистрируйте класс трекинга в обработчике события `onSaleDeliveryTrackingClassNamesBuildList`.

```php
$eventManager = \Bitrix\Main\EventManager::getInstance();

$eventManager->addEventHandler(
    'sale',
    'onSaleDeliveryTrackingClassNamesBuildList',
    static function ()
    {
        return new \Bitrix\Main\EventResult(
            \Bitrix\Main\EventResult::SUCCESS,
            [
                '\Local\Sale\Delivery\Tracking\CityCourierTracking' =>
                    '/local/php_interface/lib/sale/delivery/tracking/citycouriertracking.php',
            ],
            'sale'
        );
    }
);
```

Назначьте класс трекинга в конструкторе обработчика службы доставки через `Delivery\Services\Base::setTrackingClass()`. Встроенные обработчики доставки могут сами указывать класс трекинга. Добавьте конструктор в класс `CityCourier` из раздела [Класс обработчика](#delivery-handler-class). Остальные методы класса не меняются.

```php
namespace Local\Sale\Delivery\Services;

class CityCourier extends \Bitrix\Sale\Delivery\Services\Base
{
    public function __construct(array $initParams)
    {
        parent::__construct($initParams);

        $this->setTrackingClass(\Local\Sale\Delivery\Tracking\CityCourierTracking::class);
    }
}
```

После изменения статусов отправлений модуль вызывает событие `onSaleShipmentsTrackingStatusesChanged`. Используйте его, если нужно записать историю статусов или передать изменение во внешнюю систему.

## Связь с транспортной заявкой в службу доставки

Отгрузка и транспортная заявка в службу доставки решают разные задачи.

-  Отгрузка хранит часть заказа — позиции, службу доставки, стоимость, статус, списание и трек-номер.

-  Транспортная заявка передает данные во внешнюю транспортную службу и хранит результат внешней операции.

После создания отгрузки и расчета доставки используйте статью [Транспортные заявки](./delivery-requests.md), чтобы отправить данные во внешнюю службу.
