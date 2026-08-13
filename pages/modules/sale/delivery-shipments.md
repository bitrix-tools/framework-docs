---
title: Доставка и отгрузки
description: "Доставка и отгрузки. Службы доставки, отгрузки, позиции отгрузки, расчет стоимости, ограничения и дополнительные услуги."
---

В модуле Интернет-магазин за доставку заказа отвечает служба доставки, а отгрузка связывает ее с товарами заказа. Через API разработчик выбирает службу доставки, распределяет товары по отгрузкам и рассчитывает стоимость. API также позволяет сохранить трек-номер, разрешить доставку и списать товары.

-  Служба доставки описывает способ доставки: обработчик, настройки, ограничения, дополнительные услуги, валюту и правила расчета стоимости.

-  Отгрузка связывает конкретные товары заказа со службой доставки, стоимостью, статусом, трек-номером, разрешением доставки и списанием.

## Основные объекты

В работе с доставкой участвуют объекты отгрузки и классы службы доставки.

### Отгрузка заказа

#|
|| **Объект** | **Роль в сценарии** ||
|| `Bitrix\Sale\ShipmentCollection` | Хранит отгрузки заказа, создает новые отгрузки и пересчитывает стоимость доставки. ||
|| `Bitrix\Sale\Shipment` | Хранит службу доставки, стоимость, статус, трек-номер, склад самовывоза и значения дополнительных услуг для одной отгрузки. ||
|| `Bitrix\Sale\ShipmentItemCollection` | Хранит состав отгрузки: связь позиций корзины с количеством, которое входит в эту отгрузку. ||
|| `Bitrix\Sale\ShipmentItem` | Хранит одну позицию отгрузки и количество товара из позиции корзины. ||
|#


Отгрузка всегда принадлежит заказу. Не сохраняйте `Shipment`, `ShipmentCollection` или `ShipmentItemCollection` отдельно. После изменений сохраняйте заказ через `Order::save()`.

### Доставка

#|
|| **Объект** | **Роль в сценарии** ||
|| `Bitrix\Sale\Delivery\Services\Manager` | Возвращает службы доставки, проверяет ограничения и запускает расчет стоимости. ||
|| `Bitrix\Sale\Delivery\Services\Base` | Базовый класс для своей службы доставки. В наследнике описывают настройки обработчика и расчет стоимости для конкретной отгрузки. ||
|| `Bitrix\Sale\Delivery\CalculationResult` | Хранит результат расчета доставки: цену, стоимость дополнительных услуг, срок, описание и ошибки. ||
|| `Bitrix\Sale\Delivery\Restrictions\Base` | Базовый класс ограничения доставки. Наследник проверяет, доступна ли служба доставки для отгрузки. ||
|| `Bitrix\Sale\Delivery\ExtraServices` | Пространство имен дополнительных услуг доставки: чекбокс, выбор из списка, количество, склад самовывоза и пользовательские типы. ||
|#


{% note warning "" %}

Классы классического API доставки `CSaleDelivery`, `CSaleDeliveryHandler`, `CSaleDeliveryHelper` и `CSaleDelivery2PaySystem` могут встречаться в старых проектах.

В новых сценариях создавайте обработчики как наследников `Bitrix\Sale\Delivery\Services\Base`.

{% endnote %}

## Базовый сценарий

Обычно отгрузку оформляют так:

1. Загрузите или создайте заказ.

2. Получите службу доставки через `Delivery\Services\Manager::getObjectById()`.

3. Создайте отгрузку через `$order->getShipmentCollection()->createItem($delivery)`.

4. Добавьте позиции корзины в `ShipmentItemCollection` и установите количество.

5. Выберите дополнительные услуги через `Shipment::setExtraServices()`, если они нужны.

6. Рассчитайте доставку через `Delivery\Services\Manager::calculateDeliveryPrice()` или `ShipmentCollection::calculateDelivery()`.

7. Выполните финальный расчет заказа через `$order->doFinalAction(true)`.

8. Сохраните заказ через `$order->save()`.

После сохранения в заказе появится новая отгрузка со службой доставки, составом, рассчитанной стоимостью и выбранными дополнительными услугами.

Если после расчета нужно передать отгрузку во внешнюю транспортную службу — создайте транспортную заявку в службу доставки. Подробнее в статье [Транспортные заявки](./delivery-requests.md).

## Подготовить данные для отгрузки

Чтобы выполнить шаги, подготовьте данные магазина и объекты заказа:

-  объект `$order` — новый или загруженный заказ с корзиной,

-  позиции корзины, которые можно передать в отгрузку через `$basketItem`,

-  идентификатор службы доставки `$deliveryId`,

-  валюту и свойства заказа, если их используют ограничения или обработчик доставки,

-  идентификаторы дополнительных услуг, если сценарий выбирает значения через `Shipment::setExtraServices()`,

-  количество для частичной отгрузки, например `$firstQuantity`,

-  идентификатор склада, если сценарий списывает товары или задает склад самовывоза.

Служба доставки, ограничения и расчет читают данные через отгрузку и связанный с ней заказ. Поэтому сначала подготовьте заказ и корзину, затем создавайте отгрузку, добавляйте позиции и только после этого рассчитывайте доставку.

## Выбрать службу доставки

Служба доставки должна быть доступна для условий заказа. Менеджер служб доставки проверяет сайт, тип плательщика, местоположение, сумму, вес, платежную систему и другие ограничения.

```php
$availableServices = \Bitrix\Sale\Delivery\Services\Manager::getRestrictedList(
    $shipment,
    \Bitrix\Sale\Delivery\Restrictions\Manager::MODE_CLIENT
);

foreach ($availableServices as $serviceFields)
{
    echo $serviceFields['ID'] . ': ' . $serviceFields['NAME'];
}
```

Второй параметр `getRestrictedList()` — режим проверки ограничений. Чтобы установить режим, используйте константы класса `Bitrix\Sale\Delivery\Restrictions\Manager`:

-  `MODE_CLIENT` оставляет только службы, которые прошли ограничения,

-  `MODE_MANAGER` возвращает полный список.

В массиве каждой службы из результата метода есть ключ `RESTRICTED`. Для недоступной службы ключ равен `true`.

Служба доставки связана с заказом через отгрузку. Она не заменяет свойства заказа: адрес, местоположение, телефон и другие данные покупателя по-прежнему хранятся в свойствах заказа. Обработчик доставки и ограничения читают эти данные через отгрузку и связанный с ней заказ.

Если идентификатор службы доставки уже выбран, используйте его при создании отгрузки или расчете доставки.

## Коллекция отгрузок

Заказ может содержать несколько отгрузок. Так оформляют заказ, если товары отправляют разными службами доставки, с разных складов или несколькими партиями.

В коллекции всегда есть системная отгрузка. Она хранит товары, которые еще не распределены по пользовательским отгрузкам. Когда разработчик добавляет позицию корзины в обычную отгрузку, система уменьшает количество этой позиции в системной отгрузке или переносит позицию полностью.

В своем коде чаще работают с пользовательскими отгрузками.

```php
$shipmentCollection = $order->getShipmentCollection();

foreach ($shipmentCollection->getNotSystemItems() as $shipment)
{
    echo $shipment->getField('ACCOUNT_NUMBER');
}
```

Если нужно получить конкретную отгрузку, используйте методы коллекции:

-  `getItemById($id)` — получить отгрузку по идентификатору,

-  `getItemByIndex($index)` — получить отгрузку по внутреннему индексу коллекции,

-  `getItemByShipmentCode($code)` — получить отгрузку по коду.

## Создать отгрузку в заказе

Создавайте отгрузку через коллекцию заказа. Передайте в `createItem()` объект службы доставки, если служба уже выбрана.

```php
if (!\Bitrix\Main\Loader::includeModule('sale'))
{
    throw new \RuntimeException('Не удалось подключить модуль sale');
}

// $order — новый или загруженный объект \Bitrix\Sale\Order
// $deliveryId — идентификатор службы доставки

$delivery = \Bitrix\Sale\Delivery\Services\Manager::getObjectById($deliveryId);
if (!$delivery)
{
    throw new \RuntimeException('Служба доставки не найдена');
}

$shipmentCollection = $order->getShipmentCollection();
$shipment = $shipmentCollection->createItem($delivery);
```

Метод `createItem()` добавляет `Shipment` в коллекцию заказа и связывает новую отгрузку с заказом. Если службу доставки нужно выбрать позже, можно создать отгрузку без параметра `$delivery` и затем установить поле `DELIVERY_ID`.

```php
$shipment = $shipmentCollection->createItem();

$result = $shipment->setField('DELIVERY_ID', $deliveryId);
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Дальше добавьте в отгрузку позиции и перейдите к расчету доставки.

## Добавить позиции в отгрузку

Состав отгрузки связывает отгрузку с позициями корзины. Каждая позиция отгрузки хранит ссылку на позицию корзины и количество товара, которое входит в доставку.

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

Метод `createItem($basketItem)` возвращает существующую позицию, если эта позиция корзины уже есть в отгрузке. Если отгрузка уже списана, метод может вернуть `null`.

Для комплектов в составе отгрузки используйте специальные методы:

-  `getShippableItems()` возвращает позиции, которые участвуют в отгрузке, без родительских позиций комплекта,

-  `getSellableItems()` возвращает фактически продаваемые позиции, без состава комплекта.

## Создать частичную отгрузку

Частичная отгрузка нужна, когда заказ отправляют не целиком. В этом сценарии в одну отгрузку добавляют только часть количества из позиции корзины, а остаток остается в системной отгрузке или распределяется в другую отгрузку.

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

Для частичной отгрузки количество в первой отгрузке должно быть больше нуля и меньше количества позиции корзины. После распределения в первую отгрузку останется часть товара: ее можно отправить второй отгрузкой или оставить в системной. Перед сохранением проверьте, что суммарное количество по несистемным отгрузкам не превышает количество в корзине.

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

Метод `Delivery\Services\Manager::calculateDeliveryPrice()` рассчитывает стоимость одной отгрузки и возвращает `Bitrix\Sale\Delivery\CalculationResult`.

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

-  `getPeriodFrom()`, `getPeriodTo()`, `getPeriodType()` — срок доставки,

-  `getDescription()` и `getPeriodDescription()` — описание расчета и срока.

Чтобы пересчитать все несистемные отгрузки заказа, используйте метод коллекции `ShipmentCollection::calculateDelivery()`.

```php
$result = $order->getShipmentCollection()->calculateDelivery();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Коллекция пропускает системную отгрузку. Если у отгрузки установлен флаг ручной цены `CUSTOM_PRICE_DELIVERY = 'Y'`, коллекция не вызывает обработчик доставки и берет текущую цену отгрузки.

## Добавить дополнительную услугу

Дополнительная услуга уточняет доставку и может изменить ее стоимость. Например, дополнительной услугой может быть подъем на этаж, страховка, выбор пункта самовывоза или упаковка.

В модуле есть встроенные типы дополнительных услуг:

-  `Bitrix\Sale\Delivery\ExtraServices\Checkbox` — флаг `Y` или `N`,

-  `Bitrix\Sale\Delivery\ExtraServices\Enum` — выбор одного значения из списка,

-  `Bitrix\Sale\Delivery\ExtraServices\Quantity` — количество, умноженное на цену,

-  `Bitrix\Sale\Delivery\ExtraServices\Store` — выбор склада самовывоза.

### Создать запись дополнительной услуги

Чтобы добавить дополнительную услугу к службе доставки, создайте запись в `Bitrix\Sale\Delivery\ExtraServices\Table`.

Поле `RIGHTS` хранит права на изменение значения дополнительной услуги. Формат использует три символа `Y` или `N`: первый отвечает за администратора, второй — за менеджера, третий — за клиента. Значение `YYY` разрешает изменение для всех трех ролей. Чтобы ограничить доступ, установите для каждой роли `Y` или `N` в соответствующей позиции строки `RIGHTS`.

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

Чтобы выбрать услугу для конкретной отгрузки, передайте значения в `Shipment::setExtraServices()`. Ключ массива — идентификатор дополнительной услуги, значение зависит от типа услуги.

```php
$shipment->setExtraServices([
    $extraServiceId => 'Y',
]);

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

Доставку можно расширить собственными дополнительными услугами, ограничениями и обработчиками.

### Создать пользовательский тип дополнительной услуги

Пользовательский тип дополнительной услуги нужен, когда встроенных типов недостаточно. Унаследуйте класс пользовательского типа от `Bitrix\Sale\Delivery\ExtraServices\Base`.

В классе-наследнике переопределите методы:

-  `getClassTitle()` возвращает название типа,

-  `getCostShipment()` рассчитывает стоимость услуги для отгрузки,

-  `getAdminParamsName()` возвращает название блока с настройками услуги,

-  `prepareParamsToSave()` подготавливает параметры перед сохранением, например, приводит стоимость к числу,

-  `getAdminParamsControl()` выводит поле настройки в административной форме службы доставки.

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

В конструкторе тип `Y/N` задает элемент управления для значения услуги по умолчанию. Без этого административная форма попытается вывести массив `PARAMS` как описание поля и покажет ошибку.

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

Ограничение доставки проверяет доступность службы доставки для конкретной отгрузки. Например, доступность службы может зависеть от значения свойства заказа, местоположения, суммы или типа плательщика.

Унаследуйте класс ограничения от `Bitrix\Sale\Delivery\Restrictions\Base`. Метод `extractParams()` получает данные из отгрузки, а `check()` сравнивает их с настройками ограничения.

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

После этого `Delivery\Services\Manager::getRestrictedList()` и `Restrictions\Manager::checkService()` будут учитывать новое ограничение.

### Создать собственную службу доставки

Собственная служба доставки нужна, когда проект рассчитывает доставку по своим правилам или обращается к внешнему сервису.

Унаследуйте класс службы доставки от `Bitrix\Sale\Delivery\Services\Base`.

#### Класс обработчика

**Пример.** Обработчик рассчитывает стоимость локально.

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

-  `$handlerCode` задает код обработчика,

-  `getClassTitle()` и `getClassDescription()` возвращают название и описание для списка обработчиков,

-  `getConfigStructure()` описывает настройки службы доставки,

-  `calculateConcrete()` рассчитывает стоимость и возвращает `CalculationResult`.

#### Настройки обработчика

Метод `getConfigStructure()` возвращает структуру формы настроек. На верхнем уровне задают группы настроек, например `MAIN`. У группы задают `TITLE`, `DESCRIPTION` и `ITEMS`. В `ITEMS` ключ — код настройки, а значение — описание поля. При сохранении службы система сохранит значения в поле `CONFIG` с теми же группами и кодами.

Чаще всего в описании поля используют такие параметры:

#|
|| **Параметр** | **Как работает** ||
|| `TYPE` | Тип поля. По нему административный интерфейс выбирает элемент управления и способ проверки значения. ||
|| `NAME` | Название поля в форме настроек службы доставки. ||
|| `DEFAULT` | Значение по умолчанию, если в сохраненной конфигурации нет значения. ||
|| `VALUE` | Текущее значение. Обычно его не задают вручную: сервис подставляет сохраненное значение из `CONFIG` или `DEFAULT`. ||
|| `REQUIRED` | Обязательное поле. Используйте `Y` или `true`. ||
|| `MULTIPLE` | Множественное значение. Используйте `Y`, если тип поддерживает несколько значений. ||
|| `HIDDEN` | Скрытое поле. Система хранит значение, но не показывает строку настройки. ||
|| `DISABLED` | Недоступное поле. Значение такого поля не обрабатывается как обычный пользовательский ввод. ||
|| `READONLY` | HTML-атрибут `readonly` для типов, которые его поддерживают, например `STRING`, `NUMBER` и `DATE`. Если нужно показать неизменяемое значение и сохранить его скрытым полем, используйте тип `DELIVERY_READ_ONLY`. ||
|| `ONCHANGE`, `ONCLICK` | Клиентские JavaScript-обработчики для элементов управления, которые выводят эти атрибуты. Для кнопки используйте тип `DELIVERY_BUTTON_SELECTOR` и параметр `BUTTON`. ||
|| `MIN`, `MAX`, `STEP` | Ограничения для числового поля `NUMBER`. ||
|| `OPTIONS` | Варианты для `ENUM`. Ключ массива сохраняется как значение, значение массива показывается пользователю. ||
|| `MULTILINE`, `SIZE`, `ROWS`, `COLS`, `PLACEHOLDER` | Дополнительные параметры текстового поля `STRING`. ||
|#


Список типов формирует класс `Bitrix\Sale\Internals\Input\Manager`. Для настроек доставки можно использовать стандартные типы:

-  `STRING` — текстовое поле. Подходит для строковых настроек: логина, токена, URL, кода тарифа.

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

-  `DELIVERY_BUTTON_SELECTOR` — элемент выбора с названием, скрытым значением и кнопкой.

Если в настройках нужна кнопка, используйте `DELIVERY_BUTTON_SELECTOR`. Он показывает название выбранного элемента, кнопку и сохраняет скрытые поля `NAME` и `VALUE`.

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

Кнопка открывает пользовательский интерфейс выбора. Если кнопке нужны серверные данные, откройте свое окно, слайдер или административный AJAX-обработчик и после выбора обновите скрытые поля настройки.

#### Регистрация обработчика

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

Теперь сохраните службу доставки в модуле.

```php
$result = \Bitrix\Sale\Delivery\Services\Manager::add([
    'NAME' => 'Городской курьер',
    'ACTIVE' => 'Y',
    'CLASS_NAME' => '\Local\Sale\Delivery\Services\CityCourier',
    'CURRENCY' => 'RUB',
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

Метод `Delivery\Services\Manager::add()` создает службу доставки. После успешного сохранения служба появляется в списке служб доставки в административном интерфейсе. В коде ее можно получить через `Delivery\Services\Manager::getObjectById($deliveryId)`, привязать к отгрузке и рассчитать стоимость через API доставки.

#### Добавить профили на основе одного класса

Профиль — дочерняя служба доставки со своими настройками и расчетом. Сначала сохраните родительскую службу доставки: ее идентификатор `$deliveryId` понадобится в поле `PARENT_ID` каждого профиля.

Если все профили обрабатывает один PHP-класс, добавьте в родительский обработчик три метода:

-  `canHasProfiles()` разрешает создавать профили,

-  `getProfilesList()` возвращает идентификаторы и названия профилей,

-  `getChildrenClassNames()` возвращает класс, который обрабатывает профили.

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

Метод `isProfile()` отмечает дочернюю службу как профиль. Метод `getProfileType()` возвращает код профиля для служебного кода доставки. В `calculateConcrete()` используйте сохраненный `$profileId`, чтобы выбрать правила расчета.

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
        'CURRENCY' => 'RUB',
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

Выберите класс по идентификатору профиля в методе `createProfileObject()`.

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

Метод `createProfileObject()` выбирает класс по коду `PROFILE_ID` и создает объект профиля.

Создайте классы профилей, например, `CityCourierStandardProfile` и `CityCourierExpressProfile`. Классы профилей должны наследоваться от `Bitrix\Sale\Delivery\Services\Base` и возвращать `true` из `isProfile()`. Реализуйте в каждом классе настройки и расчет стоимости, затем зарегистрируйте классы для автозагрузки.

Передайте код профиля в `PROFILE_ID`. Метод `createProfileObject()` выберет по нему класс обработчика. Сохраните имя этого класса в `CLASS_NAME`, а `PROFILE_ID` удалите: он нужен только для выбора класса и не сохраняется в базе.

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
        'CURRENCY' => 'RUB',
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

Состояние отгрузки задают следующие поля и методы:

#|
|| **Поле или метод** | **Что делает** ||
|| `STATUS_ID` | Хранит статус отгрузки. Статусы настраиваются в модуле Интернет-магазин. ||
|| `allowDelivery()` | Устанавливает разрешение доставки и связанные служебные поля. ||
|| `disallowDelivery()` | Снимает разрешение доставки. ||
|| `DEDUCTED` | Показывает, списаны ли товары по отгрузке: `Y` или `N`. ||
|| `TRACKING_NUMBER` | Хранит трек-номер отправления. ||
|| `DELIVERY_DOC_NUM` | Хранит номер документа доставки. ||
|| `DELIVERY_DOC_DATE` | Хранит дату документа доставки. ||
|| `setStoreId($storeId)` | Устанавливает склад самовывоза для отгрузки. ||
|#


```php
$result = $shipment->allowDelivery();
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$result = $shipment->setFields([
    'TRACKING_NUMBER' => 'RA123456789RU',
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

Поле `DEDUCTED = 'Y'` переводит отгрузку в состояние списания. При изменении поля система обновляет служебные поля, события и связанные документы.

Перед списанием учитывайте состав отгрузки, складской учет, провайдеров товаров и настройки проекта. Резерв — это количество товара, которое система закрепляет за заказом или отгрузкой до списания. Провайдер товара — обработчик, через который модуль получает товарные данные и меняет остатки или резерв при операциях с отгрузкой. Перед изменением поля проверьте условия:

-  состав отгрузки заполнен,

-  количество корректно распределено,

-  склад выбран,

-  проектная логика разрешает списание.

## Настроить трекинг

Трек-номер хранится в поле `TRACKING_NUMBER`. Проверка статуса отправления зависит от обработчика трекинга службы доставки.

Зарегистрируйте класс трекинга через событие `onSaleDeliveryTrackingClassNamesBuildList` и укажите его в службе доставки через `Delivery\Services\Base::setTrackingClass()`. Встроенные обработчики доставки могут сами указывать класс трекинга.

Зарегистрируйте свой класс трекинга в событии и назначьте его в обработчике службы доставки.

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

-  Отгрузка хранит часть заказа: позиции, службу доставки, стоимость, статус, списание и трек-номер.

-  Транспортная заявка передает данные во внешнюю транспортную службу и хранит результат внешней операции.

После создания отгрузки и расчета доставки используйте статью [Транспортные заявки](./delivery-requests.md), чтобы отправить данные во внешнюю службу.
