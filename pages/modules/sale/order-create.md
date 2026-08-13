---
title: Создание заказа
description: "Создание заказа. Полный сценарий оформления заказа через API D7 модуля sale."
---

Объект `Bitrix\Sale\Order` управляет состоянием заказа и обеспечивает согласованное сохранение данных. Заказ объединяет корзину покупателя, тип плательщика, контактные и адресные данные, отгрузки и оплаты. Связанные данные хранят коллекции модуля `sale`.

Создание заказа через API D7 применяют в фоновых задачах, интеграциях и серверных сценариях без публичной формы. До вызова `Order::save()` заказ и его новые коллекции существуют в памяти. Код заполняет коллекции, выполняет расчеты и обрабатывает ошибки до записи в базу.

## Проследить путь от корзины до сохраненного заказа

Собирайте заказ последовательно. Тип плательщика определяет свойства. Корзина задает состав. Доставка и платежная система влияют на расчеты. Сохраняйте заказ после заполнения связанных объектов и успешного финального расчета.

#|
|| **Шаг** | **Объект после шага** | **Результат** ||
|| Подготовить корзину | `Bitrix\Sale\Basket` | В корзине остаются доступные для заказа позиции ||
|| Создать заказ | `Bitrix\Sale\Order` | Заказ получает сайт, пользователя, валюту и начальный статус ||
|| Назначить тип плательщика | `Bitrix\Sale\Order` | Заказ может сформировать коллекцию свойств для выбранного типа плательщика ||
|| Передать корзину | `Bitrix\Sale\Order` и `Bitrix\Sale\Basket` | Корзина становится частью нового заказа ||
|| Заполнить свойства | `Bitrix\Sale\PropertyValueCollection` | Заказ получает контактные и адресные данные ||
|| Создать отгрузку | `Bitrix\Sale\ShipmentCollection` | Позиции корзины распределяются в пользовательскую отгрузку ||
|| Выбрать доставку | `Bitrix\Sale\Shipment` | Отгрузка получает службу и рассчитанную стоимость доставки ||
|| Создать оплату | `Bitrix\Sale\PaymentCollection` | Заказ получает способ оплаты и сумму ||
|| Выполнить финальный расчет | `Bitrix\Sale\Order` | Модуль применяет скидки, рассчитывает налоги и обновляет итоговые суммы ||
|| Сохранить заказ | `Bitrix\Sale\Order` | Заказ и коллекции записываются в базу ||
|#

Компонент `bitrix:sale.order.ajax` проходит те же этапы. Он получает тип плательщика, свойства, доставку и оплату из формы.

{% note tip "" %}

Подробнее о проверках формы и AJAX-пересчетах читайте в статье [Оформление заказа и публичные сценарии](./order-checkout-component.md).

{% endnote %}

## Подготовить данные и корзину

До создания заказа определите идентификаторы сайта, пользователя, типа плательщика, службы доставки и платежной системы. При необходимости задайте валюту явно. Все объекты должны относиться к одному сайту и подходить под ограничения проекта. Если сценарий не создает оплату или пользовательскую отгрузку, соответствующий идентификатор не нужен.

В примерах используются условные значения:

#|
|| **Переменная** | **Тип** | **Источник** | **Что проверить** ||
|| `$siteId` | `string` | Идентификатор сайта из настроек проекта, например, `s1` | Сайт существует и совпадает с сайтом корзины, типа плательщика и служб ||
|| `$userId` | `int` | Идентификатор зарегистрированного пользователя | Значение больше нуля, пользователь существует и может оформлять заказ ||
|| `$personTypeId` | `int` | Идентификатор типа плательщика из настроек магазина | Тип активен и привязан к `$siteId` ||
|| `$deliveryId` | `int` | Настройки проекта или проверенное значение из запроса | Служба существует и проходит ограничения для собранной отгрузки ||
|| `$paySystemId` | `int` | Настройки проекта или проверенное значение из запроса | Платежная система существует и проходит ограничения для созданной оплаты ||
|| `$currency` | `string` | Трехсимвольный код валюты, например, `RUB` | Валюта доступна для сайта и согласована с ценами заказа. Если параметр не передан, `Order::create()` использует валюту сайта, а затем базовую валюту ||
|#

У идентификаторов нет универсальных значений по умолчанию. Замените их на значения из проекта. Валюту можно не передавать по правилам `Order::create()`. Не передавайте идентификаторы из HTTP-запроса в `getObjectById()` без проверки ограничений.

### Пересчитать корзину

Идентификатор покупателя `FUSER` связывает пользователя с несохраненной корзиной. Метод `Fuser::getIdByUserId()` возвращает идентификатор покупателя корзины и создает его, если записи еще нет.

Загрузите корзину пользователя для нужного сайта. Затем вызовите `Basket::refresh()`. Провайдер товаров обновит цены, доступность и другие товарные данные.

Методы `Basket::refresh()` и `Basket::save()` возвращают `Bitrix\Sale\Result`. Проверяйте результат каждого вызова до создания заказа.

### Получить доступные для заказа позиции

Метод `Basket::getOrderableItems()` создает отдельный объект корзины. Объект содержит только позиции, доступные для покупки. Отложенные позиции в объект не входят. Если объект пуст, заказ создавать не из чего.

После передачи корзины в заказ не сохраняйте ее отдельно. Метод `Order::save()` сохранит заказ и связанные коллекции согласованно.

{% note tip "" %}

Подробнее о загрузке и наполнении корзины читайте в статье [Корзина](./basket.md).

{% endnote %}

### Создать корзину из заданного списка товаров

Серверный сценарий может создать заказ без готовой корзины пользователя. Создайте корзину в памяти через `Basket::create($siteId)` и добавьте в нее товары через `Basket::createItem()`. Этот самостоятельный пример подготавливает `$orderableBasket`, которую затем можно передать в новый заказ.

Идентификатор сайта определяет принадлежность корзины к сайту.

Для товара каталога передайте в `createItem()` строку `catalog` и идентификатор продаваемого товара или торгового предложения. При пересчете стандартный провайдер каталога заполнит цену, валюту, название, доступность и другие товарные данные.

Перед запуском замените `$siteId` и идентификаторы товаров на значения из проекта. Пример нужно выполнять в скрипте с подключенным ядром Bitrix Framework.

Переменная `$products` содержит массив товаров со следующей структурой:

-  `PRODUCT_ID` — положительное целое число, которое содержит идентификатор товара или торгового предложения каталога,

-  `QUANTITY` — целое или дробное число больше нуля, которое задает количество товара в единицах его меры.

```php
use Bitrix\Catalog\Product\Basket as CatalogBasket;
use Bitrix\Main\Loader;
use Bitrix\Sale\Basket;

if (!Loader::includeModule('sale') || !Loader::includeModule('catalog'))
{
    throw new \RuntimeException('Не удалось подключить модули sale и catalog');
}

$siteId = 's1';
$products = [
    ['PRODUCT_ID' => 1811, 'QUANTITY' => 5],
    ['PRODUCT_ID' => 1812, 'QUANTITY' => 1],
];

$basket = Basket::create($siteId);

foreach ($products as $product)
{
    $basketItem = $basket->createItem('catalog', $product['PRODUCT_ID']);
    $setFieldsResult = $basketItem->setFields([
        'QUANTITY' => $product['QUANTITY'],
        'PRODUCT_PROVIDER_CLASS' => CatalogBasket::getDefaultProviderName(),
    ]);

    if (!$setFieldsResult->isSuccess())
    {
        throw new \RuntimeException(
            implode('; ', $setFieldsResult->getErrorMessages())
        );
    }
}

$refreshResult = $basket->refresh();
if (!$refreshResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $refreshResult->getErrorMessages())
    );
}

$orderableBasket = $basket->getOrderableItems();
if ($orderableBasket->isEmpty())
{
    throw new \RuntimeException('Нет доступных для заказа товаров');
}

$preparedItems = [];
foreach ($orderableBasket as $basketItem)
{
    $preparedItems[] = [
        'PRODUCT_ID' => (int)$basketItem->getField('PRODUCT_ID'),
        'NAME' => (string)$basketItem->getField('NAME'),
        'QUANTITY' => (float)$basketItem->getField('QUANTITY'),
        'PRICE' => (float)$basketItem->getField('PRICE'),
        'CURRENCY' => (string)$basketItem->getField('CURRENCY'),
    ];
}

echo '```
' . htmlspecialcharsbx(print_r($preparedItems, true)) . '
```';
```

После успешного запуска скрипт выведет идентификатор, название, количество, цену и валюту каждой доступной позиции. Диагностический массив `$preparedItems` и `echo` не нужны для создания заказа -- удалите их после проверки.

Метод `Basket::create($siteId)` создает корзину в памяти и задает ей сайт. Этот фрагмент не привязывает корзину к пользователю и не сохраняет ее отдельно. Поэтому товары не появятся в публичной корзине.

Чтобы использовать результат [в полном сценарии](#собрать-полный-сценарий-создания-заказа), замените получение `FUSER` и вызов `Basket::loadItemsForFUser()` кодом этого примера до получения `$orderableBasket`. Пользователя задайте при создании заказа через `Order::create($siteId, $userId)`. Затем передайте `$orderableBasket` в `Order::setBasket()` и сохраните весь заказ через `Order::save()`.

Не задавайте вручную цену и валюту товару каталога, если их должен получить стандартный провайдер. Ручные значения подходят для позиций с собственной логикой расчета и требуют отдельной настройки полей корзины.

## Создать заказ для сайта и пользователя

Метод `Order::create($siteId, $userId, $currency)` создает заказ в памяти. Третий параметр можно не передавать. Метод возьмет валюту сайта. Если валюта сайта не задана, метод возьмет базовую валюту.

Новый объект получает начальный статус и служебные значения. Запись в базе появится только после успешного `Order::save()`.

## Назначить тип плательщика

Вызовите `Order::setPersonTypeId()` до получения коллекции свойств. Тип плательщика определяет, какие свойства доступны заказу.

Метод принимает идентификатор типа плательщика и возвращает `Bitrix\Sale\Result`. Метод не проверяет активность типа плательщика и его привязку к выбранному сайту. Получите идентификатор из настроек проекта или из списка доступных типов.

## Передать корзину в заказ

Метод `Order::setBasket()` связывает корзину с новым заказом и обновляет ее данные. Метод возвращает `Bitrix\Sale\Result`.

Во время привязки модуль пересчитывает данные корзины и обновляет связанные суммы заказа. После успешного `setBasket()` метод `Order::getPrice()` возвращает текущую стоимость корзины. Итоговая сумма изменится после выбора доставки, платежной системы, применения скидок и расчета налогов.

Передать корзину через `setBasket()` можно только новому заказу. Если заказ уже сохранен, получите его корзину через `Order::getBasket()` и измените существующий объект.

## Заполнить свойства заказа

Метод `Order::getPropertyCollection()` возвращает `PropertyValueCollection` для выбранного типа плательщика. Найдите значения свойств по символьному коду через `getItemByOrderPropertyCode()` и вызовите `setValue()`.

Коды свойств задаются в настройках магазина. В примере используются `FIO`, `EMAIL`, `PHONE`, `LOCATION` и `ADDRESS`. Замените их, если в проекте приняты другие коды. Для свойства местоположения передайте внутренний код местоположения. Не передавайте название.

Метод `setValue()` возвращает результат изменения поля. Обработайте ошибку сразу. Свойства влияют на ограничения и расчет доставки или оплаты.

## Создать пользовательскую отгрузку

Коллекция отгрузок содержит системную отгрузку. Она хранит количество товаров, которое еще не распределено по пользовательским отгрузкам. Не назначайте системной отгрузке службу доставки.

Создайте обычную отгрузку через `ShipmentCollection::createItem()` без параметров. Метод вернет объект `Bitrix\Sale\Shipment` и добавит его в коллекцию заказа. Службу доставки назначьте после проверки ограничений.

### Передать позиции корзины в отгрузку

Создайте `ShipmentItem` для каждой позиции корзины. Установите количество через `setQuantity()`. Система переносит полное количество из системной отгрузки в пользовательскую отгрузку.

Метод `ShipmentItemCollection::createItem()` возвращает объект позиции отгрузки или `null`, если создать позицию нельзя. `ShipmentItem::setQuantity()` возвращает `Bitrix\Sale\Result`.

### Выбрать службу и рассчитать доставку

После добавления товаров получите доступные службы через `Delivery\Services\Manager::getRestrictedObjectsList()`. Выберите службу по идентификатору и назначьте ее через `Shipment::setDeliveryService()`. Затем вызовите `ShipmentCollection::calculateDelivery()`.

Метод рассчитывает только пользовательские отгрузки с выбранной службой. Он возвращает `Bitrix\Sale\Result`. Ошибки обработчика доставки попадают в этот результат.

Проверьте доступность службы с учетом ограничений, если идентификатор доставки поступает от пользователя.

{% note tip "" %}

Подробный сценарий читайте в статье [Доставка и отгрузки](./delivery-shipments.md).

{% endnote %}

В примере `$order` уже содержит корзину, а `$deliveryId` хранит выбранный идентификатор службы доставки:

```php
$shipmentCollection = $order->getShipmentCollection();
$shipment = $shipmentCollection->createItem();
$shipmentItemCollection = $shipment->getShipmentItemCollection();

foreach ($order->getBasket() as $basketItem)
{
    $shipmentItem = $shipmentItemCollection->createItem($basketItem);
    if (!$shipmentItem)
    {
        throw new \RuntimeException('Не удалось создать позицию отгрузки');
    }

    $quantityResult = $shipmentItem->setQuantity($basketItem->getQuantity());
    if (!$quantityResult->isSuccess())
    {
        throw new \RuntimeException(
            implode('; ', $quantityResult->getErrorMessages())
        );
    }
}

$availableDeliveries = \Bitrix\Sale\Delivery\Services\Manager::getRestrictedObjectsList(
    $shipment
);
$delivery = $availableDeliveries[$deliveryId] ?? null;
if (!$delivery)
{
    throw new \RuntimeException('Служба доставки недоступна для заказа');
}

$shipment->setDeliveryService($delivery);

$deliveryResult = $shipmentCollection->calculateDelivery();
if (!$deliveryResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $deliveryResult->getErrorMessages())
    );
}
```

## Создать оплату

Создайте оплату через `PaymentCollection::createItem()` без параметров. Установите текущую сумму собранного заказа, проверьте предварительную доступность платежной системы и получите ее через `PaySystem\Manager::getObjectById()`. Назначьте объект сервиса через `Payment::setPaySystemService()`.

Установите итоговую сумму оплаты после финального расчета заказа. До расчета объект оплаты может находиться в коллекции с нулевой или предварительной суммой.

Если идентификатор платежной системы поступает из формы, проверьте ограничения через `PaySystem\Manager::getListWithRestrictions()`.

{% note tip "" %}

Подробнее о выборе системы и нескольких оплатах читайте в статье [Оплаты и платежные системы](./payments.md).

{% endnote %}

В примере `$order` содержит собранный заказ, а `$paySystemId` хранит выбранный идентификатор платежной системы:

```php
$payment = $order->getPaymentCollection()->createItem();

$sumResult = $payment->setField('SUM', $order->getPrice());
if (!$sumResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $sumResult->getErrorMessages())
    );
}

$availablePaySystems = \Bitrix\Sale\PaySystem\Manager::getListWithRestrictions(
    $payment,
    \Bitrix\Sale\Services\Base\RestrictionManager::MODE_CLIENT
);
if (!isset($availablePaySystems[$paySystemId]))
{
    throw new \RuntimeException('Платежная система недоступна для заказа');
}

$paySystem = \Bitrix\Sale\PaySystem\Manager::getObjectById($paySystemId);
if (!$paySystem)
{
    throw new \RuntimeException('Платежная система не найдена');
}

$payment->setPaySystemService($paySystem);
```

## Выполнить финальный расчет заказа

Вызовите `Order::doFinalAction(true)` после заполнения корзины и свойств, создания отгрузок, расчета доставки и предварительного выбора платежной системы. Значение `true` указывает на значимые изменения для расчета.

Метод запускает действия заказа, применяет скидки и рассчитывает налоги. После успешного вызова прочитайте итоговую сумму через `Order::getPrice()` и передайте ее в оплату.

Если после расчета изменились товары, количества, свойства или доставка, повторите зависимые расчеты и снова вызовите `doFinalAction(true)`. Смена только платежной системы не требует финального расчета скидок и налогов, но требует повторной проверки ограничений оплаты и связанных ограничений доставки. Не сохраняйте сумму оплаты, которая рассчитана для предыдущего состояния заказа.

Метод `doFinalAction()` возвращает `Bitrix\Sale\Result`. Не вызывайте `Order::save()`, если результат содержит ошибки.

Модуль вызывает два события во время финального расчета.

-  `OnBeforeSaleOrderFinalAction` -- перед расчетом скидок и налогов. Событие получает `ENTITY` с объектом заказа, `HAS_MEANINGFUL_FIELD` с признаком значимых изменений и `BASKET` с корзиной. Обработчик может вернуть `EventResult::ERROR` и остановить расчет.

-  `OnAfterSaleOrderFinalAction` -- после расчета. Событие получает `ENTITY` с объектом заказа. Метод не проверяет результаты его обработчиков.

Обработчики `OnBeforeSaleOrderFinalAction` возвращают ошибку только для условия, которое запрещает расчет. В `OnAfterSaleOrderFinalAction` нельзя отменить уже выполненное действие.

## Сохранить заказ и обработать ошибки

Метод `Order::save()` сохраняет заказ, корзину, свойства, оплаты и отгрузки. Он возвращает `Bitrix\Sale\Result`.

Проверьте `isSuccess()` и получите сообщения об ошибках через `getErrorMessages()`.

Метод `isSuccess()` не учитывает предупреждения. Если они важны для бизнес-сценария, прочитайте их через `getWarningMessages()` и направьте заказ на дополнительную проверку.

После успешного сохранения идентификатор доступен через `$saveResult->getId()` и `$order->getId()`.

Не продолжайте оплату, отгрузку или обмен с внешней системой до успешного завершения `save()`. Ошибка означает, что сценарий создания заказа не закончен.

Не создавайте заказ прямыми записями в базу данных. Такой код обходит расчеты объектной модели, проверки, события и согласованное сохранение коллекций.

## Собрать полный сценарий создания заказа

Пример создает заказ из несохраненной корзины указанного пользователя. Он назначает тип плательщика, заполняет свойства, создает одну отгрузку и одну оплату, выполняет расчеты и сохраняет заказ.

Значения идентификаторов, коды свойств и данные покупателя замените на данные собственного проекта. Пример допускает, что `$deliveryId` и `$paySystemId` поступили из запроса, поэтому проверяет их по ограничениям собранного заказа до сохранения.

Константа `RestrictionManager::MODE_CLIENT` включает режим проверки для выбора покупателя. В этом режиме списки содержат только службы и платежные системы, которые доступны для текущей отгрузки или оплаты без ограничений.

```php
use Bitrix\Main\Loader;
use Bitrix\Main\Result;
use Bitrix\Sale\Basket;
use Bitrix\Sale\Delivery\Services\Manager as DeliveryManager;
use Bitrix\Sale\Fuser;
use Bitrix\Sale\Order;
use Bitrix\Sale\PaySystem\Manager as PaySystemManager;
use Bitrix\Sale\Services\Base\RestrictionManager;

if (!Loader::includeModule('sale'))
{
    throw new \RuntimeException('Не удалось подключить модуль sale');
}

// Подготовка входных данных
$siteId = 's1';
$userId = 123;
$personTypeId = 1;
$deliveryId = 2;
$paySystemId = 3;

$propertyValues = [
    'FIO' => 'Иван Петров',
    'EMAIL' => 'buyer@example.ru',
    'PHONE' => '+7 900 000-00-00',
    'LOCATION' => '0000073738',
    'ADDRESS' => 'ул. Примерная, д. 1',
];

$ensureSuccess = static function (Result $result, string $operation): void
{
    if (!$result->isSuccess())
    {
        throw new \RuntimeException(
            $operation . ': ' . implode('; ', $result->getErrorMessages())
        );
    }
};

// Получение и пересчет корзины
$fuserId = Fuser::getIdByUserId($userId);
if ($fuserId === false)
{
    throw new \RuntimeException('Не удалось получить FUSER для пользователя');
}

$basket = Basket::loadItemsForFUser($fuserId, $siteId);

$ensureSuccess($basket->refresh(), 'Не удалось пересчитать корзину');
$ensureSuccess($basket->save(), 'Не удалось сохранить пересчитанную корзину');

$orderableBasket = $basket->getOrderableItems();
if ($orderableBasket->isEmpty())
{
    throw new \RuntimeException('В корзине нет доступных для заказа позиций');
}

// Создание заказа и заполнение свойств
$order = Order::create($siteId, $userId);

$ensureSuccess(
    $order->setPersonTypeId($personTypeId),
    'Не удалось назначить тип плательщика'
);

$ensureSuccess(
    $order->setBasket($orderableBasket),
    'Не удалось передать корзину в заказ'
);

$propertyCollection = $order->getPropertyCollection();
foreach ($propertyValues as $propertyCode => $propertyValue)
{
    $property = $propertyCollection->getItemByOrderPropertyCode($propertyCode);
    if (!$property)
    {
        throw new \RuntimeException(
            "Свойство заказа с кодом {$propertyCode} не найдено"
        );
    }

    $ensureSuccess(
        $property->setValue($propertyValue),
        "Не удалось заполнить свойство {$propertyCode}"
    );
}

// Создание отгрузки и выбор службы доставки
$shipmentCollection = $order->getShipmentCollection();
$shipment = $shipmentCollection->createItem();
$shipmentItemCollection = $shipment->getShipmentItemCollection();

foreach ($order->getBasket() as $basketItem)
{
    $shipmentItem = $shipmentItemCollection->createItem($basketItem);
    if (!$shipmentItem)
    {
        throw new \RuntimeException('Не удалось создать позицию отгрузки');
    }

    $ensureSuccess(
        $shipmentItem->setQuantity($basketItem->getQuantity()),
        'Не удалось установить количество в отгрузке'
    );
}

$availableDeliveries = DeliveryManager::getRestrictedObjectsList($shipment);
$delivery = $availableDeliveries[$deliveryId] ?? null;
if (!$delivery)
{
    throw new \RuntimeException('Служба доставки недоступна для заказа');
}

$shipment->setDeliveryService($delivery);

$ensureSuccess(
    $shipmentCollection->calculateDelivery(),
    'Не удалось рассчитать доставку'
);

// Создание оплаты и выбор платежной системы
$payment = $order->getPaymentCollection()->createItem();

$ensureSuccess(
    $payment->setField('SUM', $order->getPrice()),
    'Не удалось установить предварительную сумму оплаты'
);

$availablePaySystems = PaySystemManager::getListWithRestrictions(
    $payment,
    RestrictionManager::MODE_CLIENT
);

if (!isset($availablePaySystems[$paySystemId]))
{
    throw new \RuntimeException('Платежная система недоступна для заказа');
}

$paySystem = PaySystemManager::getObjectById($paySystemId);
if (!$paySystem)
{
    throw new \RuntimeException('Платежная система не найдена');
}

$payment->setPaySystemService($paySystem);

// Финальный расчет и повторная проверка ограничений
$ensureSuccess(
    $order->doFinalAction(true),
    'Не удалось выполнить финальный расчет заказа'
);

$ensureSuccess(
    $payment->setField('SUM', $order->getPrice()),
    'Не удалось установить сумму оплаты'
);

$availableDeliveries = DeliveryManager::getRestrictedObjectsList($shipment);
if (!isset($availableDeliveries[$deliveryId]))
{
    throw new \RuntimeException(
        'После финального расчета служба доставки стала недоступна'
    );
}

$availablePaySystems = PaySystemManager::getListWithRestrictions(
    $payment,
    RestrictionManager::MODE_CLIENT
);

if (!isset($availablePaySystems[$paySystemId]))
{
    throw new \RuntimeException(
        'После финального расчета платежная система стала недоступна'
    );
}

// Сохранение заказа
$saveResult = $order->save();
$ensureSuccess($saveResult, 'Не удалось сохранить заказ');

$saveWarnings = $saveResult->getWarningMessages();
$orderId = (int)$saveResult->getId();
```

Пример проверяет ограничения дважды. Первая проверка не допускает заведомо недоступные службы в расчет. Вторая учитывает итоговую сумму и выбранные объекты после `doFinalAction(true)`. Верните доступные варианты вызывающему коду, если условия заказа изменились. Не сохраняйте прежний выбор автоматически.

Обязательные свойства зависят от типа плательщика и настроек магазина. Добавьте их в `$propertyValues`. Иначе `Order::save()` вернет ошибку проверки данных или сохранит заказ с диагностическими предупреждениями.

## Учесть варианты серверного сценария

В разделе [Собрать полный сценарий создания заказа](#собрать-полный-сценарий-создания-заказа) приведен пример кода для заранее известного пользователя, одной отгрузки и одной оплаты. В интеграциях и фоновых задачах его часто нужно дополнить правилами для неполного состава корзины, повторного запроса и отсутствующих входных данных.

Такие дополнения приведены ниже. Они используют переменные из полного примера, поэтому перед каждым фрагментом указано, на каком этапе его добавить.

### Проверить состав корзины перед созданием заказа

Метод `Basket::getOrderableItems()` может вернуть не все позиции исходной корзины. Проверки только на `isEmpty()` недостаточно, если серверный сценарий обязан сохранить весь переданный состав.

Сохраните ожидаемые позиции и количества из входных данных до создания заказа. После пересчета сопоставьте их с `$orderableBasket` по идентификатору позиции из входного массива. Идентификатор не должен меняться при пересчете. Если состав различается, выберите одно из двух правил:

-  завершите запрос с ошибкой и верните изменившиеся позиции,

-  продолжите создание частичного заказа только при явном разрешении вызывающего кода.

Не выбирайте правило внутри функции или сервиса проекта, который создает заказ. Передайте решение через отдельный параметр проекта `$allowPartialOrder` типа `bool`. Без явного разрешения используйте значение `false`. Такой параметр не относится к API Framework. Его обрабатывает код интеграции до вызова `Order::setBasket()`.

Повторный вызов дает тот же результат при тех же входных данных. Загрузку, пересчет и идентификацию позиций описывает статья [Работа с корзиной](./basket.md).

### Определить пользователя до создания заказа

Поле `USER_ID` обязательно для сохраненного заказа. Метод `Order::create()` принимает идентификатор зарегистрированного пользователя, а `FUSER_ID` определяет владельца несохраненной корзины. Эти идентификаторы решают разные задачи и не заменяют друг друга.

Серверный сценарий получает или создает учетную запись до вызова `Order::create()`. Если запрос пришел от посетителя без учетной записи, передайте его в отдельный процесс регистрации или сопоставления с техническим пользователем по правилам проекта.

Не используйте один общий технический аккаунт без проверки доступа. Заказы такого аккаунта будут иметь одного владельца.

Работу с `FUSER_ID` описывает статья [Работа с корзиной](./basket.md). Регистрацию посетителя стандартным компонентом описывает статья [Оформление заказа и публичные сценарии](./order-checkout-component.md). Ручной сценарий API D7 начинается после того, как код получил корректный `$userId`.

### Проверить обязательные свойства заранее

Набор обязательных свойств зависит от типа плательщика. После заполнения известных кодов проверьте всю коллекцию, а не только элементы массива `$propertyValues`.

Добавьте фрагмент после цикла заполнения `$propertyValues` и до создания `$shipmentCollection`. Переменная `$propertyCollection` уже содержит свойства выбранного типа плательщика.

```php
$requiredPropertyErrors = [];

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
        $requiredPropertyErrors = array_merge(
            $requiredPropertyErrors,
            $propertyResult->getErrorMessages()
        );
    }
}

if ($requiredPropertyErrors !== [])
{
    throw new \RuntimeException(
        'Не заполнены обязательные свойства: '
        . implode('; ', $requiredPropertyErrors)
    );
}
```

Запустите проверку после `setPersonTypeId()` и заполнения свойств, но до расчета доставки и оплаты. Такой порядок не заменяет проверку результата `Order::save()`. Обработчики событий и связанные объекты могут добавить другие ошибки.

### Вернуть доступные варианты, если идентификатор не задан

Если вызывающий код не передал идентификатор доставки или платежной системы, сформируйте список доступных вариантов из уже собранного заказа. Не выбирайте первый элемент автоматически. Порядок элементов не определяет вариант для выбора.

Сформируйте `$deliveryOptions` после создания позиций отгрузки и вызова `DeliveryManager::getRestrictedObjectsList()`. Сформируйте `$paySystemOptions` после создания оплаты, установки предварительной суммы и вызова `PaySystemManager::getListWithRestrictions()`.

```php
$deliveryOptions = [];
foreach ($availableDeliveries as $availableDeliveryId => $availableDelivery)
{
    $deliveryOptions[] = [
        'ID' => (int)$availableDeliveryId,
        'NAME' => $availableDelivery->getName(),
    ];
}

$paySystemOptions = [];
foreach ($availablePaySystems as $availablePaySystemId => $availablePaySystem)
{
    $paySystemOptions[] = [
        'ID' => (int)$availablePaySystemId,
        'NAME' => (string)$availablePaySystem['NAME'],
    ];
}
```

Верните эти массивы вызывающему коду. Продолжите сборку после явного выбора. Если после `doFinalAction(true)` выбранный вариант стал недоступен, верните обновленный список. Не сохраняйте заказ с прежним идентификатором.

### Исключить дубли при повторном запросе

Интеграции передают стабильный ключ операции для каждой попытки создания одного заказа. Найдите результат предыдущей успешной попытки до сборки заказа. Верните сохраненный `$orderId` вместо создания нового объекта.

В примере `$externalOperationId` представляет строковый ключ одной логической операции. Длина для поля `XML_ID` не превышает 255 символов. Добавьте фрагмент после создания `$order` и до `Order::save()`. Он использует функцию `$ensureSuccess` из полного примера.

Поле заказа `XML_ID` можно использовать как внешний идентификатор для поиска и диагностики. Установите значение до сохранения и проверьте результат изменения поля:

```php
$externalOperationId = 'erp-order-2026-000123';

$ensureSuccess(
    $order->setField('XML_ID', $externalOperationId),
    'Не удалось установить внешний идентификатор заказа'
);
```

Индекс поля `XML_ID` не гарантирует уникальность значения. Одной предварительной выборки недостаточно при параллельных запросах. Храните ключ операции в отдельном реестре проекта с уникальным ограничением или примените другой механизм блокировки.

Обработайте ключ операции по порядку:

1. Зарезервируйте ключ до создания заказа.

2. Запишите `$orderId` для ключа после успешного `Order::save()`.

3. После ошибки переведите запись в состояние, которое разрешает контролируемый повтор.

Не пытайтесь повторно сохранить объект заказа с неизвестным вызывающему коду состоянием.

### Обработать предупреждения как отдельный результат

Успешный `Order::save()` может вернуть предупреждения. Они не отменяют создание заказа. Ответ интеграции отличает такой результат от ошибки сохранения.

Добавьте фрагмент сразу после получения `$saveWarnings` и `$orderId` в полном примере.

```php
$creationResult = [
    'STATUS' => $saveWarnings === []
        ? 'created'
        : 'created_with_warnings',
    'ORDER_ID' => $orderId,
    'WARNINGS' => $saveWarnings,
];
```

Для статуса `created_with_warnings` сохраните `$orderId` и сообщения в журнале или очереди ручной проверки. Не запускайте оплату, отгрузку и обмен автоматически, если правила проекта считают хотя бы одно предупреждение блокирующим.

## Создать оплату и отгрузку независимо {#optional-payment-shipment}

Оплата и пользовательская отгрузка не зависят от обязательного наличия друг друга при первом сохранении. Соберите только те коллекции, которые нужны текущему этапу процесса.

#|
|| **Сценарий** | **Что создать до `doFinalAction(true)`** | **Следующий шаг** ||
|| Физический товар с немедленной оплатой | Пользовательскую отгрузку и оплату | Сохранить заказ и запустить платежный сценарий ||
|| Цифровой товар без доставки | Только оплату | Сохранить заказ и запустить платежный сценарий ||
|| Доставка с оплатой после проверки | Только пользовательскую отгрузку | Сохранить заказ, затем создать оплату отдельным изменением заказа ||
|| Отложенное формирование | Не создавать оплату и пользовательскую отгрузку | Сохранить минимальный заказ и дополнить его позже ||
|#

### Создать только оплату

Выполните действия по порядку после передачи корзины и заполнения свойств.

1. Получите `PaymentCollection` и создайте оплату через `createItem()`.

2. Установите предварительную сумму через `Payment::setField('SUM', $order->getPrice())`.

3. Получите доступные платежные системы через `PaySystemManager::getListWithRestrictions()` и назначьте выбранную систему через `setPaySystemService()`.

4. Вызовите `Order::doFinalAction(true)` и проверьте результат.

5. Запишите итоговую сумму заказа в `SUM` оплаты и повторно проверьте доступность платежной системы.

6. Сохраните заказ через `Order::save()` и обработайте ошибки и предупреждения.

Не создавайте пользовательскую отгрузку в этом варианте. Системная отгрузка может оставаться в коллекции заказа.

### Создать только отгрузку

Выполните действия по порядку после передачи корзины и заполнения свойств.

1. Получите `ShipmentCollection` и создайте пользовательскую отгрузку через `createItem()`.

2. Создайте позиции отгрузки и передайте в них количества товаров.

3. Получите доступные службы через `DeliveryManager::getRestrictedObjectsList()` и назначьте выбранную службу через `setDeliveryService()`.

4. Рассчитайте доставку через `ShipmentCollection::calculateDelivery()` и проверьте результат.

5. Вызовите `Order::doFinalAction(true)` и повторно проверьте доступность службы доставки.

6. Сохраните заказ через `Order::save()` и обработайте ошибки и предупреждения.

Не создавайте объект оплаты в этом варианте.

## Создать заказ без отгрузки и оплаты

Новый заказ можно сохранить без пользовательских отгрузок и оплат. Такой сценарий подходит, если проект создает эти объекты позже или обрабатывает их отдельным процессом.

Создайте и пересчитайте корзину для минимального заказа. Назначьте тип плательщика, передайте корзину в заказ, выполните финальный расчет и сохраните заказ. Пример создает все используемые объекты и переменные самостоятельно.

В примере выбран тип плательщика без обязательных свойств. Если в проекте есть обязательные свойства, заполните их по сценарию [Заполнить свойства заказа](#заполнить-свойства-заказа) до `doFinalAction(true)`.

```php
use Bitrix\Catalog\Product\Basket as CatalogBasket;
use Bitrix\Main\Loader;
use Bitrix\Sale\Basket;
use Bitrix\Sale\Order;

if (!Loader::includeModule('sale') || !Loader::includeModule('catalog'))
{
    throw new \RuntimeException('Не удалось подключить модули sale и catalog');
}

$siteId = 's1';
$userId = 123;
$personTypeId = 1;
$productId = 1811;

$basket = Basket::create($siteId);
$basketItem = $basket->createItem('catalog', $productId);

$basketItemResult = $basketItem->setFields([
    'QUANTITY' => 1,
    'PRODUCT_PROVIDER_CLASS' => CatalogBasket::getDefaultProviderName(),
]);

if (!$basketItemResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $basketItemResult->getErrorMessages())
    );
}

$refreshResult = $basket->refresh();
if (!$refreshResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $refreshResult->getErrorMessages())
    );
}

$orderableBasket = $basket->getOrderableItems();
if ($orderableBasket->isEmpty())
{
    throw new \RuntimeException('Нет доступных для заказа товаров');
}

$order = Order::create($siteId, $userId);

$personTypeResult = $order->setPersonTypeId($personTypeId);
if (!$personTypeResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $personTypeResult->getErrorMessages())
    );
}

$basketResult = $order->setBasket($orderableBasket);
if (!$basketResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $basketResult->getErrorMessages())
    );
}

$finalActionResult = $order->doFinalAction(true);
if (!$finalActionResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $finalActionResult->getErrorMessages())
    );
}

$saveResult = $order->save();
if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $saveResult->getErrorMessages())
    );
}

$saveWarnings = $saveResult->getWarningMessages();
$orderId = (int)$saveResult->getId();
```

Отсутствие оплаты не означает, что заказ оплачен. Отсутствие пользовательской отгрузки не означает, что доставка разрешена или товары отгружены. Создайте коллекции, заполните их и снова сохраните заказ при необходимости этих этапов для сценария.

## Выбрать событие создания заказа

Для проверки заказа перед записью используйте `OnSaleOrderBeforeSaved`. Обработчик может изменить собранный объект или вернуть ошибку и остановить `Order::save()`.

Для действия после первого полного сохранения используйте `OnSaleOrderSaved` и проверяйте, что параметр `IS_NEW` равен `true`. В этот момент заказ и связанные коллекции уже сохранены. Не вызывайте повторный `save()` без условия выхода: новый цикл сохранения снова запустит обработчики.

Постоянные обработчики регистрируйте в `/local/php_interface/init.php` или в подключаемом из него файле. Моменты вызова, параметры событий отдельных объектов и защита от рекурсии описаны в разделе [События заказа и связанных объектов](./statuses-events.md#order-events).

## Продолжить работу с сохраненным заказом

После успешного сохранения используйте `$orderId` для дальнейшего сценария. Это внутренний числовой идентификатор заказа. Метод `Order::load($orderId)` загружает заказ по этому значению.

Поле `ACCOUNT_NUMBER` содержит номер заказа, который может отличаться от внутреннего идентификатора. Загрузите объект через `Order::loadByAccountNumber()` при известном номере.

```php
$accountNumber = '12345'; // номер из поля ACCOUNT_NUMBER

$order = \Bitrix\Sale\Order::loadByAccountNumber($accountNumber);

if (!$order)
{
    throw new \RuntimeException('Заказ не найден');
}
```

Загруженный заказ можно изменить и снова сохранить через `Order::save()`.

Следующий шаг зависит от задачи:

-  чтобы прочитать или изменить поля и коллекции заказа, используйте статью [Изменение и чтение заказа](./order-update.md),

-  чтобы запустить платежный обработчик, используйте статью [Оплаты и платежные системы](./payments.md),

-  чтобы разрешить доставку, списать товары или разделить отгрузки, используйте статью [Доставка и отгрузки](./delivery-shipments.md),

-  чтобы применить купон и повторно рассчитать скидки, используйте статью [Скидки и купоны](./discounts-coupons.md),

-  чтобы отправить сообщение после успешного сохранения, используйте статью [Уведомления о заказах](./order-notifications.md),

-  чтобы зарезервировать или списать товар, используйте статью [Резервирование и списание](./reservation-deduct.md).

Ручной сценарий заканчивается только после успешного `Order::save()`. До этого заказ остается объектом в памяти и не должен запускать внешние операции.
