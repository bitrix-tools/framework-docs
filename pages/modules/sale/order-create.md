---
title: Создание заказа
description: "Как создать заказ через Bitrix\\Sale\\Order: корзина, тип плательщика, свойства, отгрузка, оплата, doFinalAction и save, обработка ошибок и предупреждений."
---

Объект `Bitrix\Sale\Order` хранит состояние заказа и сохраняет его вместе со связанными коллекциями модуля `sale`. Заказ объединяет корзину покупателя, тип плательщика, контактные и адресные данные, отгрузки и оплаты.

Создавайте заказ через API в фоновых задачах, интеграциях и серверных сценариях без публичной формы. До вызова `Order::save()` заказ и его новые коллекции существуют в памяти. Код заполняет коллекции, выполняет расчеты и обрабатывает ошибки до записи в базу.

## Проследить путь от корзины до сохраненного заказа

Собирайте заказ последовательно. Тип плательщика определяет свойства. Корзина задает состав. Доставка и платежная система влияют на расчеты. Сохраняйте заказ после заполнения связанных объектов и успешного финального расчета.

#|
|| **Шаг** | **Объект шага** | **Результат** ||
|| Подготовить корзину | `Bitrix\Sale\Basket` | В корзине остаются доступные для заказа позиции ||
|| Создать заказ | `Bitrix\Sale\Order` | Заказ получает сайт, пользователя, валюту и начальный статус ||
|| Назначить тип плательщика | `Bitrix\Sale\Order` | Заказ может сформировать коллекцию свойств для выбранного типа плательщика ||
|| Передать корзину | `Bitrix\Sale\Order` и `Bitrix\Sale\Basket` | Корзина становится частью нового заказа ||
|| Заполнить свойства | `Bitrix\Sale\PropertyValueCollection` | Заказ получает контактные и адресные данные ||
|| Создать отгрузку | `Bitrix\Sale\ShipmentCollection` | Количество позиций переходит из системной отгрузки в пользовательскую ||
|| Выбрать доставку | `Bitrix\Sale\Shipment` | Отгрузка получает службу и рассчитанную стоимость доставки ||
|| Создать оплату | `Bitrix\Sale\PaymentCollection` | Заказ получает способ оплаты и сумму ||
|| Выполнить финальный расчет | `Bitrix\Sale\Order` | Модуль применяет скидки, рассчитывает налоги и обновляет итоговые суммы ||
|| Сохранить заказ | `Bitrix\Sale\Order` | Метод `save()` записывает заказ и коллекции в базу ||
|#

Компонент `bitrix:sale.order.ajax` проходит те же этапы. Он получает тип плательщика, свойства, доставку и оплату из формы.

{% note tip "" %}

Подробнее о проверках формы и AJAX-пересчетах читайте в статье [Оформление заказа и публичные сценарии](./order-checkout-component.md).

{% endnote %}

## Подготовить данные и корзину

До создания заказа определите идентификаторы сайта, пользователя, типа плательщика, службы доставки и платежной системы. Все объекты должны относиться к одному сайту и подходить под ограничения проекта. Если сценарий не создает оплату или пользовательскую отгрузку, соответствующий идентификатор не нужен.

Код примеров использует переменные из таблицы.

#|
|| **Переменная** | **Тип** | **Источник** | **Что проверить** ||
|| `$siteId` | `string` | Идентификатор сайта из настроек проекта, например `s1` | Сайт существует и совпадает с сайтом корзины, типа плательщика и служб ||
|| `$userId` | `int` | Идентификатор зарегистрированного пользователя | Значение больше нуля, пользователь существует и может оформлять заказ ||
|| `$personTypeId` | `int` | Идентификатор типа плательщика из настроек магазина | Тип активен и привязан к `$siteId` ||
|| `$deliveryId` | `int` | Настройки проекта или проверенное значение из запроса | Служба существует и проходит ограничения для собранной отгрузки ||
|| `$paySystemId` | `int` | Настройки проекта или проверенное значение из запроса | Платежная система существует и проходит ограничения для созданной оплаты ||
|| `$currency` | `string` | Трехсимвольный код валюты из настроек модуля `currency` | Нужна, только если код передает валюту третьим аргументом `Order::create()`. Валюта доступна для сайта и согласована с ценами заказа ||
|#

У идентификаторов нет универсальных значений по умолчанию. Замените их на значения из проекта. Не передавайте идентификаторы из HTTP-запроса в `getObjectById()` без проверки ограничений.

### Загрузить и пересчитать корзину пользователя

Идентификатор покупателя `FUSER_ID` связывает пользователя с несохраненной корзиной. Метод `Fuser::getIdByUserId()` возвращает идентификатор покупателя корзины и создает его, если записи еще нет. Если создать запись не удалось, метод возвращает `false`.

Загрузите корзину пользователя для нужного сайта через `Basket::loadItemsForFUser($fuserId, $siteId)`. Затем вызовите `Basket::refresh()`. Провайдер товаров обновит цены, доступность и другие товарные данные.

После пересчета сохраните исходную корзину пользователя через `Basket::save()`, чтобы в базе остались актуальные товарные данные. Так делает полный пример в разделе [Собрать полный сценарий создания заказа](#full-scenario).

Методы `Basket::refresh()` и `Basket::save()` возвращают `Bitrix\Sale\Result`. Проверяйте результат каждого вызова до создания заказа.

### Получить доступные для заказа позиции

Метод `Basket::getOrderableItems()` создает отдельный объект корзины. Объект содержит только позиции, доступные для заказа. Отложенные позиции в объект не входят. Если объект пуст, не создавайте заказ.

Метод `Order::save()` сохраняет корзину `$orderableBasket` вместе с заказом и связанными коллекциями. Отдельно сохранять ее не нужно.

{% note tip "" %}

Подробнее о загрузке и наполнении корзины читайте в статье [Работа с корзиной](./basket.md).

{% endnote %}

### Создать корзину из заданного списка товаров

Серверный сценарий может обойтись без готовой корзины пользователя. Соберите корзину в памяти через `Basket::create($siteId)` и добавьте в нее товары через `Basket::createItem()`. Код примера ниже готовит корзину `$orderableBasket`, которую затем можно передать в новый заказ.

Для товара каталога передайте в `createItem()` идентификатор модуля `catalog` и идентификатор продаваемого товара или торгового предложения. В поле `PRODUCT_PROVIDER_CLASS` позиции передайте имя стандартного провайдера каталога. Метод `\Bitrix\Catalog\Product\Basket::getDefaultProviderName()` возвращает это имя. При пересчете провайдер заполнит цену, валюту, название, доступность и другие товарные данные.

Перед запуском замените `$siteId` и идентификаторы товаров на значения из проекта. Выполните пример в скрипте с подключенным ядром Bitrix Framework. Подключите модули `sale` и `catalog` через [`Loader::includeModule()`](../../api-reference/main/loader/include-module.md).

Переменная `$products` содержит массив товаров со следующей структурой:

-  `PRODUCT_ID` — положительное целое число, которое содержит идентификатор товара или торгового предложения каталога,

-  `QUANTITY` — целое или дробное число больше нуля, которое задает количество товара в единицах его меры.

**Пример.** Код создает корзину из массива `$products`, пересчитывает ее и выводит доступные для заказа позиции.

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

echo '<pre>' . htmlspecialcharsbx(print_r($preparedItems, true)) . '</pre>';
```

После успешного запуска скрипт выведет идентификатор, название, количество, цену и валюту каждой доступной позиции. Диагностический массив `$preparedItems` и `echo` не нужны для создания заказа — удалите их после проверки.

Метод `Basket::create($siteId)` создает корзину в памяти и задает ей сайт. Фрагмент не привязывает корзину к пользователю и не сохраняет ее отдельно, поэтому товары не появятся в публичной корзине.

Чтобы использовать результат в разделе [Собрать полный сценарий создания заказа](#full-scenario):

1. Замените блок «Получение и пересчет корзины» от `Fuser::getIdByUserId()` до проверки `$orderableBasket->isEmpty()` кодом этого примера без `$preparedItems` и `echo`.

2. Удалите вызов `$basket->save()`, в этом варианте он не нужен.

3. Задайте пользователя при создании заказа через `Order::create($siteId, $userId)`.

4. Передайте `$orderableBasket` в `Order::setBasket()` и сохраните весь заказ через `Order::save()`.

Не задавайте вручную цену и валюту товару каталога, если их должен получить стандартный провайдер. Ручные значения подходят для позиций с собственной логикой расчета. Поля таких позиций описаны в статье [Работа с корзиной](./basket.md).

## Создать заказ для сайта и пользователя

Метод `Order::create($siteId, $userId, $currency)` формирует заказ в памяти. Если третий параметр не передан, метод использует валюту сайта. Если валюта сайта не задана, метод берет валюту по умолчанию модуля `sale` (опция `default_currency`), а если пуста и она — базовую валюту.

Новый объект получает начальный статус и служебные значения. Запись в базе появится только после успешного `Order::save()`.

## Назначить тип плательщика

Вызовите `Order::setPersonTypeId()` до получения коллекции свойств. Тип плательщика определяет, какие свойства доступны заказу.

Метод принимает идентификатор типа плательщика и возвращает `Bitrix\Sale\Result`. Метод не проверяет активность типа плательщика и его привязку к выбранному сайту. Получите идентификатор из настроек проекта. Как создать тип плательщика, описано в разделе [Создать тип плательщика](./sale-settings.md#person-type).

## Передать корзину в заказ

Метод `Order::setBasket()` связывает корзину с новым заказом, пересчитывает ее данные и обновляет суммы заказа. Метод возвращает `Bitrix\Sale\Result`.

После успешного `setBasket()` метод `Order::getPrice()` возвращает текущую стоимость корзины. Итоговая сумма может измениться после выбора доставки, применения скидок и расчета налогов.

Передать корзину через `setBasket()` можно только новому заказу. Для сохраненного заказа метод выбрасывает исключение `Bitrix\Main\NotSupportedException`. Если заказ уже сохранен, получите его корзину через `Order::getBasket()` и измените существующий объект.

## Заполнить свойства заказа {#fill-properties}

Метод `Order::getPropertyCollection()` возвращает `PropertyValueCollection` для выбранного типа плательщика. Устройство свойств описано в статье [Свойства заказа](./properties.md). Найдите значения свойств по символьному коду через `getItemByOrderPropertyCode()` и вызовите `setValue()`. Если свойства с таким кодом нет, метод `getItemByOrderPropertyCode()` возвращает `null`.

Символьный код задают в настройках свойства заказа. Как создать свойства, описано в разделе [Создать свойства заказа](./sale-settings.md#order-properties). Код примеров заполняет свойства `FIO`, `EMAIL`, `PHONE`, `LOCATION` и `ADDRESS`. Замените их, если в проекте приняты другие коды.

Для свойства местоположения передайте внутренний код местоположения, а не название. Коды местоположений описаны в статье [Местоположения и налоги](./locations-taxes.md).

Метод `setValue()` возвращает `Bitrix\Sale\Result`. Проверяйте `isSuccess()` после каждого `setValue()`.

Заполните свойства до создания отгрузки и оплаты. От них зависят ограничения и расчет доставки и оплаты.

## Создать пользовательскую отгрузку

Коллекция отгрузок содержит системную отгрузку. Она хранит количество товаров, которое еще не распределено по пользовательским отгрузкам. Не назначайте системной отгрузке службу доставки.

Создайте пользовательскую отгрузку через `ShipmentCollection::createItem()` без параметров. Метод добавит новую отгрузку в коллекцию заказа и вернет объект `Bitrix\Sale\Shipment`. Службу доставки назначьте после проверки ограничений.

### Передать позиции корзины в отгрузку

Создайте позицию отгрузки `ShipmentItem` для каждой позиции корзины. Установите количество через `setQuantity()`. Количество позиции переходит из системной отгрузки в пользовательскую.

Метод `ShipmentItemCollection::createItem()` возвращает позицию отгрузки для переданной позиции корзины. Если позиция уже есть в отгрузке, метод возвращает ее. Если отгрузка уже отгружена, метод возвращает `null`. Метод `ShipmentItem::setQuantity()` возвращает `Bitrix\Sale\Result`.

### Выбрать службу и рассчитать доставку

После добавления товаров передайте пользовательскую отгрузку в `Delivery\Services\Manager::getRestrictedObjectsList()` и получите доступные службы. Без второго аргумента метод проверяет ограничения в режиме покупателя `RestrictionManager::MODE_CLIENT`. Режим менеджера `RestrictionManager::MODE_MANAGER` оставляет и службы, которые не прошли мягкое ограничение. Выберите службу по идентификатору и назначьте ее через `Shipment::setDeliveryService()`. Затем вызовите `ShipmentCollection::calculateDelivery()`.

Метод `calculateDelivery()` рассчитывает пользовательские отгрузки, у которых задана служба доставки. Новая отгрузка из `createItem()` без аргумента уже содержит службу «Без доставки». Он возвращает `Bitrix\Sale\Result`. Ошибки обработчика доставки попадают в этот результат.

{% note tip "" %}

Подробнее о выборе службы доставки и расчете ее стоимости читайте в статье [Доставка и отгрузки](./delivery-shipments.md).

{% endnote %}

**Пример.** Код создает пользовательскую отгрузку, переносит в нее позиции корзины, назначает службу `$deliveryId` и рассчитывает доставку. Заказ `$order` уже содержит корзину.

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

## Создать оплату {#create-payment}

Выполните действия по порядку.

1. Создайте оплату через `PaymentCollection::createItem()` без параметров.

2. Установите предварительную сумму через `Payment::setField('SUM', $order->getPrice())`.

3. Передайте оплату с предварительной суммой в `PaySystem\Manager::getListWithRestrictions()` и проверьте, что `$paySystemId` есть среди ключей результата. Второй аргумент задает режим проверки. Режим `RestrictionManager::MODE_CLIENT` оставляет только платежные системы, которые прошли все ограничения.

4. Получите объект платежной системы через `PaySystem\Manager::getObjectById()` и назначьте его через `Payment::setPaySystemService()`.

Итоговую сумму оплаты установите после финального расчета заказа. До расчета объект оплаты может находиться в коллекции с нулевой или предварительной суммой.

{% note tip "" %}

Подробнее о выборе системы и нескольких оплатах читайте в статье [Оплаты и платежные системы](./payments.md).

{% endnote %}

**Пример.** Код создает оплату с предварительной суммой заказа, проверяет доступность платежной системы `$paySystemId` и назначает ее оплате. Заказ `$order` уже собран.

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

Вызовите `Order::doFinalAction(true)` после того, как заполните корзину и свойства. Если сценарий создает отгрузку и оплату, сначала рассчитайте доставку и назначьте платежную систему.

С аргументом `true` метод вызывает события финального расчета, применяет скидки и рассчитывает налоги. С аргументом `false` скидки и налоги не пересчитываются, поэтому после изменения заказа передавайте `true`.

После успешного вызова прочитайте итоговую сумму через `Order::getPrice()` и передайте ее в оплату.

Если после расчета изменились товары, количества, свойства, доставка или платежная система, повторите зависимые расчеты и снова вызовите `doFinalAction(true)`.

Если [правило работы с корзиной](./discounts-coupons.md) содержит условие по платежной системе, смена платежной системы меняет скидку и итоговую сумму. После смены платежной системы также повторно проверьте ограничения оплаты и связанные ограничения доставки. Не сохраняйте сумму оплаты, которая рассчитана для предыдущего состояния заказа.

Метод `doFinalAction()` возвращает `Bitrix\Sale\Result`. Не вызывайте `Order::save()`, если результат содержит ошибки.

### События финального расчета

Метод `doFinalAction(true)` вызывает два события.

-  `OnBeforeSaleOrderFinalAction` — перед расчетом скидок и налогов. Событие получает `ENTITY` с объектом заказа и `BASKET` с корзиной. Обработчик может вернуть `EventResult::ERROR` и остановить расчет.

-  `OnAfterSaleOrderFinalAction` — после расчета. Событие получает `ENTITY` с объектом заказа. Обработчик этого события не может остановить расчет.

Возвращайте ошибку из обработчика `OnBeforeSaleOrderFinalAction`, только если условие запрещает расчет.

## Сохранить заказ и обработать ошибки

Метод `Order::save()` записывает в базу заказ, корзину, свойства, оплаты и отгрузки и возвращает `Bitrix\Sale\Result`. Проверьте `isSuccess()` и получите сообщения об ошибках через `getErrorMessages()`. После успешного сохранения идентификатор доступен через `$saveResult->getId()` и `$order->getId()`.

Метод `isSuccess()` не учитывает предупреждения. Метод `save()` возвращает ошибки проверки данных заказа как предупреждения и все равно сохраняет заказ. Ошибки сохранения корзины, свойств, отгрузок, оплат и скидок тоже приходят предупреждениями, а `isSuccess()` при этом возвращает `true`.

Метод `save()` не считает ошибкой незаполненные обязательные свойства. Проверьте их до сохранения по разделу [Проверить обязательные свойства заранее](#check-required-properties). Если предупреждения важны для бизнес-сценария, прочитайте их через `getWarningMessages()` и направьте заказ на дополнительную проверку, как описано в разделе [Обработать предупреждения как отдельный результат](#save-warnings).

Не продолжайте оплату, отгрузку или обмен с внешней системой до успешного завершения `save()`. Ошибка означает, что сценарий создания заказа не закончен.

Не создавайте заказ прямыми записями в базу данных. Такой код обходит расчеты объектной модели, проверки, события и согласованное сохранение коллекций.

## Собрать полный сценарий создания заказа {#full-scenario}

Замените идентификаторы, коды свойств и данные покупателя на значения проекта. В примере `$deliveryId` и `$paySystemId` заданы числами. Если в проекте они приходят из запроса, код проверяет их по ограничениям собранного заказа до сохранения. Запустите код в скрипте с подключенным ядром. Код подключает модуль `sale` через `Loader::includeModule('sale')`.

**Пример.** Код создает заказ из несохраненной корзины указанного пользователя, назначает тип плательщика, заполняет свойства, создает одну отгрузку и одну оплату, выполняет расчеты и сохраняет заказ.

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

Код примера проверяет ограничения дважды. Первая проверка исключает недоступные службы доставки и платежные системы до финального расчета. Вторая проверка учитывает итоговую сумму и выбранные объекты после `doFinalAction(true)`. Если условия заказа изменились, верните вызывающему коду обновленный список, как описано в разделе [Вернуть доступные варианты, если идентификатор не задан](#return-options). Не сохраняйте прежний выбор автоматически.

Обязательные свойства зависят от типа плательщика и настроек магазина. Добавьте их в `$propertyValues` и проверьте по разделу [Проверить обязательные свойства заранее](#check-required-properties).

## Учесть варианты серверного сценария

Пример из раздела [Собрать полный сценарий создания заказа](#full-scenario) рассчитан на заранее известного пользователя, одну отгрузку и одну оплату. Для интеграций и фоновых задач дополните его проверками состава корзины, пользователя, обязательных свойств и выбора вариантов, защитой от дублей и обработкой предупреждений.

Фрагменты подразделов используют переменные из полного примера. Перед каждым фрагментом указан этап, на котором его добавить.

### Проверить состав корзины перед созданием заказа

Метод `Basket::getOrderableItems()` может вернуть не все позиции исходной корзины. Проверки только на `isEmpty()` недостаточно, если серверный сценарий обязан сохранить весь переданный состав.

Сохраните ожидаемые позиции и количества из входных данных до создания заказа. После пересчета сопоставьте их с `$orderableBasket` по идентификатору товара `PRODUCT_ID` из входного массива, а не по идентификатору позиции корзины. Если состав различается, выберите одно из двух правил:

-  завершите запрос с ошибкой и верните изменившиеся позиции,

-  продолжите создание частичного заказа, только если вызывающий код разрешил это в параметре `$allowPartialOrder`.

Передайте решение через отдельный параметр проекта `$allowPartialOrder` типа `bool` и не выбирайте правило внутри функции или сервиса, который создает заказ. Если параметр не передан, используйте значение `false`. Такой параметр не относится к API Framework. Его обрабатывает код интеграции до вызова `Order::setBasket()`.

Повторный вызов дает тот же результат при тех же входных данных. Загрузка, пересчет и идентификация позиций описаны в статье [Работа с корзиной](./basket.md).

### Определить пользователя до создания заказа

Поле `USER_ID` обязательно для сохраненного заказа. Метод `Order::create()` принимает идентификатор зарегистрированного пользователя. Идентификатор `FUSER_ID` определяет владельца несохраненной корзины. Идентификатор `FUSER_ID` нельзя передать вместо `USER_ID`, и наоборот.

Получите или создайте учетную запись до вызова `Order::create()`. Если запрос пришел от посетителя без учетной записи, передайте его в отдельный процесс регистрации или сопоставления с техническим пользователем по правилам проекта.

Не используйте один общий технический аккаунт без проверки доступа. Если сопоставляете посетителей с технической учетной записью, учитывайте, что все ее заказы будут иметь одного владельца и будут видны любому, кто входит под этой записью.

О `FUSER_ID` читайте в статье [Работа с корзиной](./basket.md), о регистрации посетителя стандартным компонентом — в статье [Оформление заказа и публичные сценарии](./order-checkout-component.md). Ручной сценарий через API начинается после того, как код получил корректный `$userId`.

### Проверить обязательные свойства заранее {#check-required-properties}

Набор обязательных свойств зависит от типа плательщика. После заполнения известных кодов проверьте всю коллекцию, а не только элементы массива `$propertyValues`. Для каждого значения, у которого метод `isRequired()` возвращает `true`, вызовите `checkRequiredValue()`.

Добавьте фрагмент после цикла заполнения `$propertyValues` и до создания `$shipmentCollection`. Переменная `$propertyCollection` уже содержит свойства выбранного типа плательщика.

**Пример.** Код собирает ошибки всех незаполненных обязательных свойств и останавливает сценарий, если ошибки есть.

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

Ранняя проверка не заменяет проверку результата `Order::save()`. Обработчики событий и связанные объекты могут добавить другие ошибки.

### Вернуть доступные варианты, если идентификатор не задан {#return-options}

Если вызывающий код не передал идентификатор доставки или платежной системы, сформируйте список доступных вариантов из уже собранного заказа. Не выбирайте первый элемент автоматически. Порядок элементов не определяет вариант для выбора.

Сформируйте `$deliveryOptions` после создания позиций отгрузки и вызова `DeliveryManager::getRestrictedObjectsList()`. Сформируйте `$paySystemOptions` после создания оплаты, установки предварительной суммы и вызова `PaySystemManager::getListWithRestrictions()`.

Метод `getRestrictedObjectsList()` возвращает массив объектов служб доставки. Ключи массива — идентификаторы служб. Метод `getName()` объекта службы возвращает ее название. Метод `getListWithRestrictions()` возвращает массивы полей платежных систем. Ключи — идентификаторы платежных систем, название хранится в ключе `NAME`.

**Пример.** Код собирает идентификаторы и названия доступных служб доставки и платежных систем.

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

Верните эти массивы вызывающему коду. Продолжите сборку после того, как вызывающий код передаст выбранный идентификатор. Если после `doFinalAction(true)` выбранный вариант стал недоступен, верните обновленный список. Не сохраняйте заказ с прежним идентификатором.

### Исключить дубли при повторном запросе

Передавайте один и тот же ключ операции во всех попытках создать один заказ. До сборки заказа найдите результат предыдущей успешной попытки по этому ключу и верните сохраненный `$orderId` вместо создания нового объекта.

Ключи операций храните в отдельном реестре проекта с уникальным ограничением или используйте другой механизм блокировки. Такой реестр не относится к API Framework. Обработайте ключ операции по порядку.

1. Зарезервируйте ключ до создания заказа.

2. Запишите `$orderId` для ключа после успешного `Order::save()`.

3. После ошибки переведите запись в состояние, которое разрешает контролируемый повтор.

Если `save()` вернул ошибку, соберите заказ заново. Не сохраняйте тот же объект повторно, его состояние неизвестно вызывающему коду.

Поле заказа `XML_ID` подходит для поиска и диагностики, но не для защиты от дублей. Значение `XML_ID` не уникально, поэтому одной предварительной выборки недостаточно при параллельных запросах.

Чтобы найти заказ по ключу операции при диагностике, запишите ключ в поле `XML_ID`. Добавьте фрагмент после создания `$order` и до `Order::save()`. Он использует функцию `$ensureSuccess` из полного примера. Переменная `$externalOperationId` содержит строковый ключ одной логической операции.

**Пример.** Код записывает ключ операции в поле `XML_ID` и проверяет результат изменения поля.

```php
$externalOperationId = 'erp-order-2026-000123';

$ensureSuccess(
    $order->setField('XML_ID', $externalOperationId),
    'Не удалось установить внешний идентификатор заказа'
);
```

### Обработать предупреждения как отдельный результат {#save-warnings}

Успешный `Order::save()` может вернуть предупреждения. Они не отменяют создание заказа. В ответе интеграции отличайте такой результат от ошибки сохранения.

Добавьте фрагмент сразу после получения `$saveWarnings` и `$orderId` в полном примере.

**Пример.** Код формирует ответ интеграции со статусом `created` или `created_with_warnings`, идентификатором заказа и предупреждениями.

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

При первом сохранении заказ может содержать оплату без пользовательской отгрузки, отгрузку без оплаты или ни одной из них. Соберите только те коллекции, которые нужны текущему этапу процесса.

#|
|| **Сценарий** | **Что создать до `doFinalAction(true)`** | **После сохранения заказа** ||
|| Физический товар с немедленной оплатой | Пользовательскую отгрузку и оплату | Запустить платежный сценарий ||
|| Цифровой товар без доставки | Только оплату | Запустить платежный сценарий ||
|| Доставка с оплатой после проверки | Только пользовательскую отгрузку | Создать оплату отдельным изменением заказа ||
|| Отложенное формирование | Не создавать оплату и пользовательскую отгрузку | Дополнить заказ позже ||
|#

### Создать только оплату

Выполните действия по порядку после передачи корзины и заполнения свойств.

1. Получите коллекцию оплат через `Order::getPaymentCollection()` и создайте оплату через `createItem()`.

2. Установите предварительную сумму через `Payment::setField('SUM', $order->getPrice())`.

3. Проверьте, что `$paySystemId` есть в результате `PaySystemManager::getListWithRestrictions()`. Получите объект через `PaySystemManager::getObjectById()` и назначьте его через `setPaySystemService()`.

4. Вызовите `Order::doFinalAction(true)` и проверьте результат.

5. Запишите итоговую сумму заказа в `SUM` оплаты и повторно проверьте доступность платежной системы.

6. Сохраните заказ через `Order::save()` и обработайте ошибки и предупреждения.

Не создавайте пользовательскую отгрузку в этом варианте. Системная отгрузка может оставаться в коллекции заказа.

### Создать только отгрузку

Выполните действия по порядку после передачи корзины и заполнения свойств.

1. Получите коллекцию отгрузок через `Order::getShipmentCollection()` и создайте пользовательскую отгрузку через `createItem()`.

2. Создайте позиции отгрузки и передайте в них количества товаров.

3. Получите доступные службы через `DeliveryManager::getRestrictedObjectsList()` и назначьте выбранную службу через `setDeliveryService()`.

4. Рассчитайте доставку через `ShipmentCollection::calculateDelivery()` и проверьте результат.

5. Вызовите `Order::doFinalAction(true)` и повторно проверьте доступность службы доставки.

6. Сохраните заказ через `Order::save()` и обработайте ошибки и предупреждения.

Не создавайте объект оплаты в этом варианте.

### Создать заказ без отгрузки и оплаты

Новый заказ можно сохранить без пользовательских отгрузок и оплат. Такой сценарий подходит, если проект создает эти объекты позже или обрабатывает их отдельным процессом.

Выполните действия по порядку.

1. Создайте и пересчитайте корзину для минимального заказа.

2. Назначьте тип плательщика и передайте корзину в заказ.

3. Выполните финальный расчет через `Order::doFinalAction(true)`.

4. Сохраните заказ через `Order::save()`.

В примере выбран тип плательщика без обязательных свойств. Если в проекте есть обязательные свойства, заполните их по разделу [Заполнить свойства заказа](#fill-properties) до `doFinalAction(true)`. Пример подключает модули `sale` и `catalog` через [`Loader::includeModule()`](../../api-reference/main/loader/include-module.md).

**Пример.** Код создает и пересчитывает корзину, создает заказ без отгрузок и оплат, выполняет финальный расчет и сохраняет заказ. Пример не зависит от переменных из других фрагментов статьи.

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

Отсутствие оплаты не означает, что заказ оплачен. Отсутствие пользовательской отгрузки не означает, что доставка разрешена или товары отгружены. Если сценарию нужны оплата или отгрузка, создайте объекты оплаты или отгрузки в коллекциях заказа позже, заполните их и снова сохраните заказ.

## Выбрать событие создания заказа

Чтобы проверить заказ перед записью, используйте событие `OnSaleOrderBeforeSaved`. Событие получает `ENTITY` с объектом заказа и `VALUES` с исходными значениями полей. Обработчик может изменить собранный объект. Чтобы остановить `Order::save()`, верните `EventResult` с типом `EventResult::ERROR`.

Для действия после первого полного сохранения используйте событие `OnSaleOrderSaved` и проверьте, что параметр `IS_NEW` равен `true`. В этот момент заказ и связанные коллекции уже сохранены.

Не вызывайте `save()` из обработчика `OnSaleOrderSaved`. Событие срабатывает, пока исходный `save()` еще выполняется, поэтому повторный вызов создает рекурсивное сохранение. Способ выполнить действие после сохранения без рекурсии описан в разделе [Как не допустить рекурсию в обработчике](./statuses-events.md#avoid-handler-recursion).

Постоянные обработчики регистрируйте в `/local/php_interface/init.php` или в подключаемом из него файле. Моменты вызова и параметры событий отдельных объектов описаны в разделе [Подписаться на события заказа и связанных объектов](./statuses-events.md#order-events).

## Продолжить работу с сохраненным заказом

После успешного сохранения используйте `$orderId` для дальнейшего сценария. Переменная `$orderId` содержит внутренний числовой идентификатор заказа. Метод `Order::load($orderId)` загружает заказ по этому значению.

Поле `ACCOUNT_NUMBER` содержит номер заказа, который может отличаться от внутреннего идентификатора. Если номер известен, загрузите объект через `Order::loadByAccountNumber()`. Если заказ с таким номером не найден, метод возвращает `false`.

**Пример.** Код загружает заказ по номеру из поля `ACCOUNT_NUMBER` и останавливает сценарий, если заказ не найден.

```php
$accountNumber = '12345'; // номер из поля ACCOUNT_NUMBER

$order = \Bitrix\Sale\Order::loadByAccountNumber($accountNumber);

if (!$order)
{
    throw new \RuntimeException('Заказ не найден');
}
```

Загруженный заказ можно изменить и снова сохранить через `Order::save()`.

Следующий шаг зависит от задачи. Статьи по задачам:

-  прочитать или изменить поля и коллекции заказа — [Изменение и чтение заказа](./order-update.md),

-  запустить платежный обработчик — [Оплаты и платежные системы](./payments.md),

-  разрешить доставку, списать товары или разделить отгрузки — [Доставка и отгрузки](./delivery-shipments.md),

-  применить купон и повторно рассчитать скидки — [Правила работы с корзиной](./discounts-coupons.md),

-  отправить сообщение после успешного сохранения — [Уведомления по заказам](./order-notifications.md),

-  зарезервировать или списать товар — [Резервирование и списание](./reservation-deduct.md).

Заказ создан, когда `Order::save()` вернул успешный результат. Дальнейшие изменения выполняйте с объектом, загруженным по `$orderId`.
