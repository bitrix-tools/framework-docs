---
title: Изменение и чтение заказа
description: "Изменение и чтение заказа. Загрузка заказа, изменение полей, свойств, оплат, отгрузок и статусов через объектный API Bitrix Framework."
---

Сохраненный заказ объединяет корзину покупателя, контактные и адресные данные, оплаты, отгрузки и текущее состояние. Через объект `Bitrix\Sale\Order` можно читать и изменять поля заказа и элементы связанных коллекций.

Объектный API Bitrix Framework подходит для интеграций, фоновых задач и других серверных сценариев без формы редактирования. Разработчик загружает заказ по внутреннему идентификатору или номеру, изменяет нужные поля и элементы коллекций, а затем сохраняет все изменения вместе.

## Порядок изменения заказа {#update-order-flow}

Работайте с одним загруженным объектом заказа до завершения сценария. Не сохраняйте коллекции и вложенные объекты отдельно.

Общий порядок работы:

1. Подключите модуль `sale`.

2. Проверьте право текущего пользователя на операцию, если код выполняется по пользовательскому запросу.

3. Загрузите заказ через `Order::load()`.

4. Измените поля заказа или элементы его коллекций и проверьте каждый объект `Result`.

5. Пересчитайте доставку и заказ, если изменение влияет на стоимость, скидки, налоги или состав отгрузок.

6. Сохраните заказ через `Order::save()` и обработайте ошибки и предупреждения.

Методы объектной модели не заменяют проверку прав в коде проекта. Например, перед редактированием заказа от имени текущего пользователя проверьте `CSaleOrder::CanUserUpdateOrder()`. Для смены статуса и отмены используйте отдельные проверки `CSaleOrder::CanUserChangeOrderStatus()` и `CSaleOrder::CanUserCancelOrder()`.

### Выбрать действия для каждого изменения {#choose-actions}

Во всех примерах ниже `$order` — уже загруженный заказ. Пока не вызван `Order::save()`, изменения существуют только в памяти.

В таблице указано, когда после изменения нужны пересчет доставки, финальный расчет и согласование оплат.

#|
|| **Изменение** | **Рассчитать доставку** | **Вызвать `doFinalAction(true)`** | **Согласовать неоплаченные оплаты** | **Вызвать `Order::save()`** ||
|| Статус, отмена, отметка, комментарий, телефон, имя, трек-номер или разрешение доставки | Нет | Нет | Нет | Да ||
|| Местоположение или адрес, который участвует в ограничениях доставки и оплаты | Да | Да | Если изменилась стоимость заказа | Да ||
|| Состав или количество товаров | Да | Да | Если изменилась стоимость заказа | Да ||
|| Купон, скидка или данные для расчета налогов | Нет, если параметры доставки не изменились | Да | Если изменилась стоимость заказа | Да ||
|| Служба, состав, количество товаров или стоимость доставки, включая удаление отгрузки | Да | Да | Если изменилась стоимость заказа | Да ||
|| Сумма или удаление неоплаченной оплаты | Нет | Нет | Измените остальные оплаты по правилам проекта | Да ||
|| Резервирование, снятие резерва или списание товаров | Нет | Нет | Нет | Да ||
|#

Согласовывайте только неоплаченные оплаты. Если итоговая стоимость изменилась, для подтвержденной оплаты потребуется отмена платежа или возврат.

## Загрузить заказ {#load-order}

Метод `Order::load($id)` возвращает объект `Bitrix\Sale\Order` по внутреннему числовому идентификатору или `null`, если заказ не найден. Нулевой или отрицательный идентификатор приводит к исключению `ArgumentNullException`.

**Пример.** Код подключает модуль `sale` и загружает заказ по идентификатору.

```php
use Bitrix\Main\Loader;
use Bitrix\Sale\Order;

if (!Loader::includeModule('sale'))
{
    throw new \RuntimeException('Не удалось подключить модуль sale');
}

// Идентификатор сохраненного заказа
$orderId = 123;
$order = Order::load($orderId);

if (!$order)
{
    throw new \RuntimeException('Заказ не найден');
}
```

Поле `ACCOUNT_NUMBER` хранит номер заказа, который может отличаться от внутреннего идентификатора. Если известен номер, передайте его строкой в `Order::loadByAccountNumber($accountNumber)` и проверьте, что метод вернул объект заказа. Если заказ не найден, метод возвращает `false`. Пустая строка приводит к исключению `ArgumentNullException`.

### Найти несколько заказов

Метод `Order::loadByFilter(array $parameters)` возвращает массив объектов `Order`. Если заказы не найдены, метод возвращает пустой массив. Метод загружает все поля каждого найденного заказа.

Параметры выборки:

-  `filter` — массив с условиями отбора. Значения для фильтра берите из проверенного запроса или настроек процесса.

-  `order` — массив с полями и направлениями сортировки. Проверьте, что имена полей доступны в ORM-запросе.

-  `limit` — целое число, которое ограничивает количество загружаемых объектов. Для фоновой обработки выбирайте размер порции, который не создает лишней нагрузки.

-  `offset` — целое число с количеством пропускаемых строк. Значение не должно быть отрицательным.

-  `runtime` — массив с описанием вычисляемых полей ORM, если они нужны для фильтрации или сортировки.

**Пример.** Код загружает 20 последних заказов покупателя со статусами `N` и `P`.

```php
// Идентификатор покупателя
$userId = 123;

$orders = Order::loadByFilter([
    'filter' => [
        '=USER_ID' => $userId,
        '@STATUS_ID' => ['N', 'P'],
    ],
    'order' => ['DATE_INSERT' => 'DESC'],
    'limit' => 20,
]);

foreach ($orders as $order)
{
    $orderId = $order->getId();
    $orderPrice = $order->getPrice();
}
```

Коды `N` и `P` в примере условные. Замените их кодами статусов заказа из настроек проекта. Поля статуса описаны в статье «Статусы и события», раздел [Поля статуса](./statuses-events.md#status-fields).

Если нужны только отдельные поля заказа, запросите их через `Order::getList($parameters)` без загрузки объектов. В `$parameters` укажите `select` со списком полей и при необходимости `filter`, `order`, `limit`, `offset` и `runtime`. Метод `Order::getList()` возвращает [`Bitrix\Main\DB\Result`](../../api-reference/main/db/result/index.md), а метод `fetch()` — очередной массив полей. Для изменения найденного заказа загрузите объект через `load()`, `loadByAccountNumber()` или `loadByFilter()`.

**Пример.** Код получает номер, стоимость и статус 50 последних заказов покупателя без загрузки объектов.

```php
$result = Order::getList([
    'select' => ['ID', 'ACCOUNT_NUMBER', 'PRICE', 'STATUS_ID'],
    'filter' => ['=USER_ID' => $userId],
    'order' => ['DATE_INSERT' => 'DESC'],
    'limit' => 50,
]);

while ($row = $result->fetch())
{
    $accountNumber = $row['ACCOUNT_NUMBER'];
}
```

Не вызывайте `Order::load()` в цикле, если нужно только прочитать поля для списка, отчета или экспорта. Каждый объект заказа может загрузить связанные данные и увеличить расход памяти и количество запросов. Вместо этого запросите через `Order::getList()` только нужные поля.

Для массового изменения загружайте полные объекты заказов. Сначала выберите идентификаторы ограниченной порцией, затем последовательно загрузите, измените и сохраните каждый заказ. Не передавайте в `loadByFilter()` неограниченную выборку.

### Защитить заказ от параллельного изменения {#lock-order}

Блокировка нужна, когда с одним заказом одновременно работают несколько менеджеров. Для нее есть три метода:

-  `Order::lock($orderId)` — блокирует заказ на время редактирования,

-  `Order::isLocked($orderId)` — возвращает `true`, если заказ заблокирован другим пользователем,

-  `Order::unlock($orderId)` — снимает блокировку, если ее установил текущий пользователь или у него есть право `W` на модуль `sale`. В остальных случаях метод возвращает успешный `Result` и блокировку не снимает.

Методы `lock()` и `unlock()` возвращают `Result`. Снимайте блокировку в `finally`, чтобы она не осталась после исключения.

**Пример.** Код блокирует заказ, загружает его и снимает блокировку в блоке `finally`.

```php
use Bitrix\Sale\Order;

global $USER;

// Идентификатор заказа, который нужно заблокировать
$orderId = 123;

if (!is_object($USER) || !(int)$USER->GetID())
{
    throw new \RuntimeException(
        'Для блокировки нужен авторизованный пользователь'
    );
}

if (Order::isLocked($orderId))
{
    throw new \RuntimeException('Заказ редактирует другой пользователь');
}

$lockResult = Order::lock($orderId);
if (!$lockResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $lockResult->getErrorMessages())
    );
}

try
{
    $order = Order::load($orderId);

    if (!$order)
    {
        throw new \RuntimeException('Заказ не найден');
    }

    // Измените и сохраните заказ
}
finally
{
    $unlockResult = Order::unlock($orderId);

    if (!$unlockResult->isSuccess())
    {
        error_log(implode('; ', $unlockResult->getErrorMessages()));
    }
}
```

Такая блокировка координирует работу интерфейса проекта, но не заменяет транзакцию и проверку актуальности входных данных. Фоновый процесс должен отдельно защищать заказ от повторной обработки.

## Прочитать поля и состав заказа

У заказа есть отдельные методы для часто используемых значений. Метод `getField()` возвращает остальные доступные поля. В таблице `$order` — загруженный объект заказа.

#|
|| **Данные** | **Метод объекта \$order** ||
|| Внутренний идентификатор | `getId()` ||
|| Номер заказа | `getField('ACCOUNT_NUMBER')` ||
|| Стоимость | `getPrice()` ||
|| Валюта | `getCurrency()` ||
|| Идентификатор покупателя | `getUserId()` ||
|| Статус | `getField('STATUS_ID')` ||
|| Признак отмены | `isCanceled()` ||
|| Корзина | `getBasket()` ||
|| Свойства | `getPropertyCollection()` ||
|| Оплаты | `getPaymentCollection()` ||
|| Отгрузки | `getShipmentCollection()` ||
|#

Коллекции можно обходить через `foreach`.

**Пример.** Код перебирает позиции корзины и читает идентификатор, название и количество.

```php
$basket = $order->getBasket();

foreach ($basket as $basketItem)
{
    $basketItemId = $basketItem->getId();
    $productName = $basketItem->getField('NAME');
    $quantity = $basketItem->getQuantity();
}
```

### Получить свойства заказа

Коллекция `PropertyValueCollection` содержит значения свойств для типа плательщика заказа. Найдите значение по идентификатору настройки свойства или по коду.

Код `PHONE` — пример кода свойства из настроек проекта. `$propertyId` — внутренний идентификатор настройки свойства для типа плательщика заказа.

**Пример.** Код находит значение свойства по коду `PHONE` и по идентификатору настройки.

```php
$propertyCollection = $order->getPropertyCollection();

$phoneProperty = $propertyCollection->getItemByOrderPropertyCode('PHONE');
if ($phoneProperty)
{
    $phone = $phoneProperty->getValue();
}

$propertyId = 7;
$propertyValue = $propertyCollection->getItemByOrderPropertyId($propertyId);
```

Если несколько свойств имеют одинаковый код, `getItemByOrderPropertyCode()` вернет первое найденное значение. Чтобы выбрать свойство однозначно, найдите его по идентификатору.

### Получить оплаты

Коллекция `PaymentCollection` содержит все оплаты заказа. Получите конкретную оплату через `getItemById()` или переберите коллекцию.

**Пример.** Код перебирает оплаты заказа и читает идентификатор, сумму, признак оплаты и платежную систему.

```php
$paymentCollection = $order->getPaymentCollection();

foreach ($paymentCollection as $payment)
{
    $paymentId = $payment->getId();
    $paymentSum = $payment->getSum();
    $isPaid = $payment->isPaid();
    $paySystemId = $payment->getPaymentSystemId();
}
```

### Получить отгрузки

Коллекция `ShipmentCollection` содержит пользовательские отгрузки и системную отгрузку. Системная отгрузка хранит остаток товаров, который еще не распределен по пользовательским отгрузкам. Не меняйте ее поля напрямую.

**Пример.** Код перебирает пользовательские отгрузки, пропускает системную и читает идентификатор, службу доставки и стоимость.

```php
$shipmentCollection = $order->getShipmentCollection();

foreach ($shipmentCollection as $shipment)
{
    if ($shipment->isSystem())
    {
        continue;
    }

    $shipmentId = $shipment->getId();
    $deliveryId = $shipment->getDeliveryId();
    $deliveryPrice = $shipment->getPrice();
}
```

## Изменить состав корзины заказа {#change-order-basket}

Корзина сохраненного заказа связана с отгрузками, оплатами и рассчитанной стоимостью. Получите ее через `$order->getBasket()` и измените позиции через `BasketItem`. Не загружайте такую корзину через `Basket::loadItemsForFUser()` и не сохраняйте отдельно через `Basket::save()`.

Подробные операции добавления, изменения и удаления позиций описаны в статье [Работа с корзиной](./basket.md#change-basket-items). В заказе дополнительно соблюдайте порядок действий:

1. Согласуйте новое количество с позициями пользовательских отгрузок.

2. Измените позицию корзины и проверьте [`Result`](../../api-reference/main/result/index.md).

3. Обновите товарные данные через `$basket->refresh()`.

4. Рассчитайте доставку и проверьте ограничения выбранных служб.

5. Выполните `doFinalAction(true)`, приведите неоплаченные оплаты к новой стоимости и повторно проверьте ограничения служб.

6. Сохраните весь заказ через `Order::save()`.

### Изменить количество товара

Этот сценарий подходит, если товар полностью входит в одну редактируемую пользовательскую отгрузку, а единственная оплата заказа еще не подтверждена. Для нескольких отгрузок и частичных оплат выберите нужные объекты по правилам проекта.

Укажите идентификаторы позиции, отгрузки и оплаты, а также новое количество.

-  `$basketItemId` — целое число. Возьмите идентификатор позиции из корзины загруженного заказа. Позиция должна принадлежать именно этому заказу.

-  `$shipmentId` — целое число. Возьмите идентификатор из коллекции отгрузок заказа. Выбранная отгрузка не должна быть системной или отгруженной.

-  `$paymentId` — целое число. Найдите идентификатор в коллекции оплат. Сценарий рассчитан на единственную неоплаченную оплату заказа.

-  `$newQuantity` — число с плавающей точкой. Передайте значение из проверенного запроса или бизнес-процесса. Количество должно быть больше нуля и отличаться от текущего.

Если количество уменьшается, сначала измените позицию отгрузки. Если модуль не может сам скорректировать отгрузку, например отгрузок несколько или доставка по отгрузке уже разрешена, новое количество корзины окажется меньше распределенного, и `BasketItem::setField()` вернет ошибку. При увеличении сначала измените корзину, затем распределите добавленное количество из системной отгрузки в пользовательскую.

Метод `RefreshFactory::createSingle($basketItem->getBasketCode())` создает объект для пересчета одной позиции по ее внутреннему коду корзины. Передайте этот объект в `$basket->refresh()`. Метод `$basket->refresh()` возвращает `Result` с ошибками обновления цены, доступности или других товарных данных.

В примере `$comparisonTolerance` равна `1e-10`. Это допустимая погрешность при сравнении дробного количества. Задайте другое положительное значение, если нужна другая точность.

Вспомогательная функция `$ensureSuccess` объявлена прямо в примере. Она проверяет объект `Result` и, если операция не удалась, выбрасывает `RuntimeException` с текстом операции и сообщениями об ошибках.

**Пример.** Код меняет количество позиции в корзине и отгрузке, пересчитывает доставку и заказ, обновляет сумму оплаты и сохраняет заказ.

```php
$basketItemId = 789;
$shipmentId = 67;
$paymentId = 45;
$newQuantity = 2.0;
$comparisonTolerance = 1e-10;

$ensureSuccess = static function (
    \Bitrix\Main\Result $result,
    string $message
): void
{
    if (!$result->isSuccess())
    {
        throw new \RuntimeException(
            $message . ': ' . implode('; ', $result->getErrorMessages())
        );
    }
};

$basket = $order->getBasket();
$basketItem = $basket->getItemById($basketItemId);

if (!$basketItem)
{
    throw new \RuntimeException('Позиция корзины не найдена');
}

$shipment = $order
    ->getShipmentCollection()
    ->getItemById($shipmentId);

if (!$shipment || $shipment->isSystem() || $shipment->isShipped())
{
    throw new \RuntimeException('Нет доступной пользовательской отгрузки');
}

$shipmentItem = $shipment
    ->getShipmentItemCollection()
    ->getItemByBasketId($basketItemId);

if (!$shipmentItem)
{
    throw new \RuntimeException('Позиция отгрузки не найдена');
}

$oldQuantity = $basketItem->getQuantity();
$distributedQuantity = $order
    ->getShipmentCollection()
    ->getBasketItemDistributedQuantity($basketItem);

if (
    $newQuantity <= 0
    || abs($newQuantity - $oldQuantity) < $comparisonTolerance
)
{
    throw new \RuntimeException('Некорректное новое количество');
}

if (
    abs($shipmentItem->getQuantity() - $oldQuantity) >= $comparisonTolerance
    || abs($distributedQuantity - $oldQuantity) >= $comparisonTolerance
)
{
    throw new \RuntimeException(
        'Товар распределен не только в выбранную отгрузку'
    );
}

if ($newQuantity < $oldQuantity)
{
    $ensureSuccess(
        $shipmentItem->setQuantity($newQuantity),
        'Не удалось уменьшить количество в отгрузке'
    );
}

$ensureSuccess(
    $basketItem->setField('QUANTITY', $newQuantity),
    'Не удалось изменить количество в корзине'
);

if ($newQuantity > $oldQuantity)
{
    $ensureSuccess(
        $shipmentItem->setQuantity($newQuantity),
        'Не удалось увеличить количество в отгрузке'
    );
}

$ensureSuccess(
    $basket->refresh(
        \Bitrix\Sale\Basket\RefreshFactory::createSingle(
            $basketItem->getBasketCode()
        )
    ),
    'Не удалось обновить данные товара'
);

$ensureSuccess(
    $order->getShipmentCollection()->calculateDelivery(),
    'Не удалось рассчитать доставку'
);

$ensureSuccess(
    $order->doFinalAction(true),
    'Не удалось пересчитать заказ'
);

$paymentCollection = $order->getPaymentCollection();
$payment = $paymentCollection->getItemById($paymentId);

if (
    $paymentCollection->count() !== 1
    || !$payment
    || $payment->isPaid()
)
{
    throw new \RuntimeException(
        'Сценарий требует одну неоплаченную оплату'
    );
}

$ensureSuccess(
    $payment->setField('SUM', $order->getPrice()),
    'Не удалось обновить сумму оплаты'
);

$ensureSuccess($order->save(), 'Не удалось сохранить заказ');
```

Чтобы удалить товар, вызовите `BasketItem::delete()`. Объектная модель удалит связанные позиции отгрузок, если операция разрешена. После удаления выполните тот же пересчет и согласуйте оплаты. Если товар уже входит в отгруженную отгрузку, не меняйте состав корзины без отдельного сценария возврата.

## Изменить данные покупателя

Поля заказа и свойства заказа относятся к разным наборам данных. Поля хранят состояние и служебные данные заказа. Контактные данные, адрес и местоположение обычно хранятся в `PropertyValueCollection`.

### Изменить поля заказа {#change-order-fields}

Метод `Order::setField($name, $value)` принимает техническое имя поля и новое значение. Метод возвращает `Bitrix\Sale\Result`. Проверьте результат каждого изменения до пересчета и сохранения.

Здесь `USER_DESCRIPTION` — поле комментария покупателя, а `$userDescription` — новый текст комментария.

**Пример.** Код записывает комментарий покупателя в поле `USER_DESCRIPTION` и проверяет результат.

```php
$userDescription = 'Позвонить перед доставкой';

$result = $order->setField(
    'USER_DESCRIPTION',
    $userDescription
);

if (!$result->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $result->getErrorMessages())
    );
}
```

Метод `Order::getAvailableFields()` возвращает список полей заказа. Этот список не означает, что любое поле можно безопасно менять в произвольном сценарии. Например, для полей `CURRENCY` и `USER_ID` метод `setField()` выбрасывает `NotImplementedException`. Стоимость, оплаченную сумму и даты состояний изменяйте через профильные объекты и методы, а не прямой записью рассчитанных полей.

{% note warning "" %}

Не меняйте `PERSON_TYPE_ID` у сохраненного заказа как обычное поле. Метод `setPersonTypeId()` изменяет тип плательщика, но не заменяет автоматически значения свойств старого типа значениями нового.

Смена типа плательщика требует отдельного сценария миграции данных. Перенесите контактные и адресные значения в свойства нового типа, повторно проверьте ограничения служб доставки и платежных систем, пересчитайте заказ и только затем сохраните его.

{% endnote %}

### Изменить свойства заказа

Найдите значение свойства и вызовите `setValue()`. Метод возвращает `Result`. Если свойства с таким кодом или идентификатором нет в коллекции, не создавайте его без настройки свойства для текущего типа плательщика.

Здесь `PHONE` — код свойства телефона из настроек проекта, а `$newPhone` — новое значение свойства.

**Пример.** Код находит свойство `PHONE` и записывает в него новое значение.

```php
$newPhone = '0000000000';

$phoneProperty = $order
    ->getPropertyCollection()
    ->getItemByOrderPropertyCode('PHONE');

if (!$phoneProperty)
{
    throw new \RuntimeException('Свойство PHONE не найдено');
}

$result = $phoneProperty->setValue($newPhone);

if (!$result->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $result->getErrorMessages())
    );
}
```

Изменение телефона, имени или комментария не требует `doFinalAction()`. После изменения местоположения или адреса повторно проверьте ограничения служб доставки и платежных систем, рассчитайте доставку и выполните финальный пересчет заказа.

{% note tip "" %}

Подробнее о настройке и типах свойств читайте в статье [Свойства заказа](./properties.md).

{% endnote %}

### Изменить местоположение и адрес

Свойство местоположения отмечено в настройках признаком `IS_LOCATION`. Получите его через `getDeliveryLocation()` и передайте внутренний код местоположения.

Подготовьте код местоположения, адрес и код свойства адреса:

-  `$locationCode` — строка. Получите код из справочника местоположений. Название города вместо внутреннего кода не подойдет.

-  `$address` — строка. Передайте адрес из проверенных данных покупателя в формате, который принят в проекте.

-  `ADDRESS` — строка с кодом свойства адреса из настроек текущего типа плательщика. Перед изменением убедитесь, что это свойство есть в коллекции заказа.

**Пример.** Код меняет местоположение и адрес, рассчитывает доставку и выполняет финальный пересчет.

```php
$locationCode = '0000073738';
$address = 'Адрес доставки';

$propertyCollection = $order->getPropertyCollection();
$locationProperty = $propertyCollection->getDeliveryLocation();
$addressProperty = $propertyCollection
    ->getItemByOrderPropertyCode('ADDRESS');

if (!$locationProperty || !$addressProperty)
{
    throw new \RuntimeException(
        'Свойство местоположения или адреса не найдено'
    );
}

$locationResult = $locationProperty->setValue($locationCode);
if (!$locationResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $locationResult->getErrorMessages())
    );
}

$addressResult = $addressProperty->setValue($address);
if (!$addressResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $addressResult->getErrorMessages())
    );
}

$deliveryResult = $order
    ->getShipmentCollection()
    ->calculateDelivery();

if (!$deliveryResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $deliveryResult->getErrorMessages())
    );
}

$finalActionResult = $order->doFinalAction(true);
if (!$finalActionResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $finalActionResult->getErrorMessages())
    );
}
```

После смены местоположения выбранные служба доставки и платежная система могут перестать удовлетворять ограничениям. Проверьте их доступность так, как показано в разделе [Собрать полный сценарий изменения заказа](#full-update-scenario). Если стоимость заказа изменилась, обновите неоплаченные оплаты перед `Order::save()`.

## Изменить состояние заказа

Статус, отмена и отметка о проблеме хранятся в полях заказа. Изменяйте их через `setField()`, чтобы объект вызвал проверки и события жизненного цикла.

### Сменить статус

Перед сменой статуса по пользовательскому запросу проверьте право через `CSaleOrder::CanUserChangeOrderStatus()`. Передайте идентификатор заказа, код нового статуса и массив групп текущего пользователя. Затем измените поле `STATUS_ID` и проверьте результат.

Код `P` здесь условный. Замените его кодом нового статуса из настроек проекта.

**Пример.** Код проверяет право текущего пользователя на смену статуса и записывает новый `STATUS_ID`.

```php
global $USER;

$statusId = 'P';

if (!\CSaleOrder::CanUserChangeOrderStatus(
    $order->getId(),
    $statusId,
    $USER->GetUserGroupArray()
))
{
    throw new \RuntimeException('Нет права изменить статус заказа');
}

$result = $order->setField('STATUS_ID', $statusId);

if (!$result->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $result->getErrorMessages())
    );
}
```

При изменении `STATUS_ID` модуль вызывает событие перед сменой статуса. Обработчик может запретить операцию, и ошибка попадет в результат `setField()`. Событие об измененном статусе модуль ставит в очередь и отправляет при сохранении заказа. Смена статуса не требует пересчета стоимости заказа.

### Отменить заказ

Пока в заказе есть оплаченная оплата или отгруженная отгрузка, `setField('CANCELED', 'Y')` возвращает результат с ошибкой. Сначала снимите подтверждение оплаты и списание отгрузки по правилам проекта.

Перед отменой по пользовательскому запросу проверьте `CSaleOrder::CanUserCancelOrder()`. Передайте идентификатор заказа, массив групп и идентификатор текущего пользователя. Затем запишите причину в `REASON_CANCELED` и установите `CANCELED` в значение `Y`.

Переменная `$cancelReason` — текст причины отмены для истории заказа.

**Пример.** Код проверяет право текущего пользователя на отмену, записывает причину и устанавливает `CANCELED` в `Y`.

```php
global $USER;

$cancelReason = 'Покупатель отказался от заказа';

if (!\CSaleOrder::CanUserCancelOrder(
    $order->getId(),
    $USER->GetUserGroupArray(),
    (int)$USER->GetID()
))
{
    throw new \RuntimeException('Нет права отменить заказ');
}

$reasonResult = $order->setField(
    'REASON_CANCELED',
    $cancelReason
);

if (!$reasonResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $reasonResult->getErrorMessages())
    );
}

$cancelResult = $order->setField('CANCELED', 'Y');

if (!$cancelResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $cancelResult->getErrorMessages())
    );
}
```

Перед изменением поля `CANCELED` модуль вызывает события `OnBeforeSaleOrderSetField` и `OnSaleBeforeOrderCanceled`. Их обработчики могут вернуть ошибку и отменить изменение поля. После успешного `save()` модуль вызывает отложенное событие `OnSaleOrderCanceled`.

### Вернуть отмененный заказ

Чтобы восстановить отмененный заказ, установите `CANCELED` в `N` и сохраните заказ. Смена признака отмены не требует пересчета стоимости. Если восстановление выполняется по пользовательскому запросу, сначала проверьте право на отмену заказа через `CSaleOrder::CanUserCancelOrder()`, как в примере раздела об отмене.

```php
if (!$order->isCanceled())
{
    throw new \RuntimeException('Заказ не отменен');
}

$restoreResult = $order->setField('CANCELED', 'N');

if (!$restoreResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $restoreResult->getErrorMessages())
    );
}

$saveResult = $order->save();

if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $saveResult->getErrorMessages())
    );
}
```

Учитывайте бизнес-правила проекта. Отмена могла повлиять на оплаты, отгрузки, резервирование и внешние системы. Возврат признака `CANCELED` не восстанавливает операции во внешних системах.

### Отметить заказ, который требует внимания

Признак проблемы хранится в поле `MARKED`, а причина — в поле `REASON_MARKED`.

Поля `USER_DESCRIPTION`, `COMMENTS` и `ADDITIONAL_INFO` хранят текстовые данные заказа. Назначение комментариев закрепите в правилах проекта, чтобы разные процессы не перезаписывали данные друг друга.

Переменная `$markedReason` — текст причины, по которой заказ требует внимания.

**Пример.** Код записывает причину в `REASON_MARKED` и устанавливает `MARKED` в `Y`.

```php
$markedReason = 'Не удалось подтвердить адрес доставки';

$reasonResult = $order->setField(
    'REASON_MARKED',
    $markedReason
);

if (!$reasonResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $reasonResult->getErrorMessages())
    );
}

$markedResult = $order->setField('MARKED', 'Y');

if (!$markedResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $markedResult->getErrorMessages())
    );
}
```

## Изменить оплаты

Получите оплату из `PaymentCollection` и вызовите нужные методы объекта `Payment`. Не записывайте напрямую поля заказа `SUM_PAID` и `PAYED`.

### Изменить одну оплату

Для новой суммы неоплаченной оплаты задайте:

-  `$paymentId` — целое число. Получите идентификатор из `PaymentCollection`. Оплата должна принадлежать загруженному заказу и не должна быть подтверждена.

-  `$newPaymentSum` — число с плавающей точкой. Получите сумму из проверенного запроса или после пересчета заказа и передайте в валюте заказа. До вызова `setField()` проверьте сумму по правилам оплаты в проекте.

**Пример.** Код находит неоплаченную оплату и записывает в нее новую сумму.

```php
$paymentId = 45;
$newPaymentSum = 1500.00;

$payment = $order
    ->getPaymentCollection()
    ->getItemById($paymentId);

if (!$payment)
{
    throw new \RuntimeException('Оплата не найдена в заказе');
}

if ($payment->isPaid())
{
    throw new \RuntimeException(
        'Нельзя менять сумму подтвержденной оплаты этим сценарием'
    );
}

$result = $payment->setField('SUM', $newPaymentSum);

if (!$result->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $result->getErrorMessages())
    );
}
```

Чтобы подтвердить оплату или снять подтверждение, вызовите `$payment->setPaid()` или используйте обработчик платежной системы. Значение `Y` подтверждает оплату, а `N` снимает подтверждение. Такой переход может вызвать операции платежной системы, создание кассовых чеков и события оплаты.

Заказ переходит в оплаченное состояние, когда сумма оплат с признаком `PAID = Y` достигает стоимости заказа. Поэтому при нескольких частичных оплатах проверяйте результат `setPaid()` для каждой подтвержденной части и сохраняйте заказ только после успешных изменений.

### Перераспределить сумму между оплатами

Чтобы изменить частичную оплату, задайте новые суммы у нескольких неоплаченных объектов `Payment`. Сценарий подходит для заказа с двумя неоплаченными оплатами и без других оплат.

Укажите идентификаторы обеих оплат и сумму первой:

-  `$firstPaymentId` и `$secondPaymentId` — целые числа. Получите идентификаторы из коллекции оплат заказа. Обе оплаты должны существовать и оставаться неподтвержденными.

-  `$firstPaymentSum` — число с плавающей точкой с новой суммой первой оплаты в валюте заказа. Сумма не может быть отрицательной или превышать стоимость заказа. Вторая оплата получает остаток.

**Пример.** Код задает сумму первой оплаты и переносит остаток стоимости заказа во вторую оплату.

```php
$paymentCollection = $order->getPaymentCollection();
$firstPaymentId = 45;
$secondPaymentId = 46;
$firstPaymentSum = 1500.00;

$firstPayment = $paymentCollection->getItemById($firstPaymentId);
$secondPayment = $paymentCollection->getItemById($secondPaymentId);

if (
    $paymentCollection->count() !== 2
    || !$firstPayment
    || !$secondPayment
)
{
    throw new \RuntimeException(
        'Сценарий требует две оплаты указанного заказа'
    );
}

if ($firstPayment->isPaid() || $secondPayment->isPaid())
{
    throw new \RuntimeException(
        'Нельзя перераспределять подтвержденные оплаты этим сценарием'
    );
}

if ($firstPaymentSum < 0 || $firstPaymentSum > $order->getPrice())
{
    throw new \RuntimeException('Некорректная сумма первой оплаты');
}

$firstResult = $firstPayment->setField('SUM', $firstPaymentSum);
if (!$firstResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $firstResult->getErrorMessages())
    );
}

$secondResult = $secondPayment->setField(
    'SUM',
    $order->getPrice() - $firstPaymentSum
);

if (!$secondResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $secondResult->getErrorMessages())
    );
}
```

Изменение сумм оплат не пересчитывает стоимость товаров, скидки и доставку. Если стоимость заказа изменилась раньше, сначала пересчитайте заказ, а затем распределите актуальную сумму между оплатами.

### Удалить неоплаченную оплату

Метод `Payment::delete()` убирает оплату из коллекции в памяти и возвращает `Result`. Оплаченную оплату удалить нельзя. Сначала оформите отмену платежа или возврат по правилам платежной системы.

Переменная `$paymentId` — внутренний идентификатор неоплаченной оплаты текущего заказа.

**Пример.** Код удаляет неоплаченную оплату и сохраняет заказ.

```php
$paymentId = 45;
$payment = $order
    ->getPaymentCollection()
    ->getItemById($paymentId);

if (!$payment)
{
    throw new \RuntimeException('Оплата не найдена');
}

$deleteResult = $payment->delete();

if (!$deleteResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $deleteResult->getErrorMessages())
    );
}

$saveResult = $order->save();

if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $saveResult->getErrorMessages())
    );
}
```

Если после удаления заказ должен остаться доступным для оплаты, создайте новую оплату или перераспределите сумму между оставшимися неоплаченными оплатами до сохранения.

{% note tip "" %}

Создание оплаты, выбор платежной системы, возврат и запуск обработчика описаны в статье [Оплаты и платежные системы](./payments.md).

{% endnote %}

## Изменить отгрузки

Получите пользовательскую отгрузку из `ShipmentCollection`. Не меняйте системную отгрузку напрямую. Коллекция хранит в ней нераспределенное количество товаров. Подробнее об отгрузках — в статье [Доставка и отгрузки](./delivery-shipments.md).

### Изменить трек-номер и разрешение доставки

Для трек-номера подготовьте:

-  `$shipmentId` — целое число. Получите идентификатор из `ShipmentCollection`. Отгрузка должна принадлежать заказу и не должна быть системной.

-  `$trackingNumber` — строка. Передайте трек-номер в формате службы доставки. Если значение приходит извне, сначала проверьте его по правилам интеграции.

**Пример.** Код находит пользовательскую отгрузку и записывает трек-номер в `TRACKING_NUMBER`.

```php
$shipmentId = 67;
$trackingNumber = 'TRACK-123456';

$shipment = $order
    ->getShipmentCollection()
    ->getItemById($shipmentId);

if (!$shipment || $shipment->isSystem())
{
    throw new \RuntimeException('Отгрузка не найдена');
}

$result = $shipment->setField(
    'TRACKING_NUMBER',
    $trackingNumber
);

if (!$result->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $result->getErrorMessages())
    );
}
```

Чтобы разрешить доставку одной пользовательской отгрузки, вызовите `$shipment->allowDelivery()`. Метод `$shipment->disallowDelivery()` снимает разрешение. Оба метода возвращают `Result`. У отмененного заказа оба метода возвращают результат с ошибкой.

```php
// $shipment — пользовательская отгрузка, которую получили выше
$allowResult = $shipment->allowDelivery();

if (!$allowResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $allowResult->getErrorMessages())
    );
}
```

Если заказ разделен на несколько отгрузок, измените разрешение у каждой нужной пользовательской отгрузки. Поле заказа `ALLOW_DELIVERY` получает значение `Y`, когда доставка разрешена для всех непустых пользовательских отгрузок и в системной отгрузке не осталось нераспределенных товаров.

Изменение трек-номера или разрешения доставки не требует пересчета стоимости. Смена службы доставки, состава или количества товаров требует повторного расчета доставки и заказа.

### Перераспределить товары между отгрузками

Меняйте количество только в пользовательских отгрузках, которые еще не отгружены. При уменьшении количества `ShipmentItem::setQuantity()` переносит разницу в системную отгрузку. После этого добавьте товар в другую пользовательскую отгрузку.

Укажите исходную и целевую отгрузки, позицию товара и количество для переноса:

-  `$sourceShipmentId` — целое число. Найдите идентификатор в коллекции отгрузок заказа. Исходная отгрузка должна быть пользовательской и еще не отгруженной.

-  `$targetShipmentId` — целое число. Возьмите идентификатор из той же коллекции. Целевая отгрузка также должна быть пользовательской и неотгруженной.

-  `$sourceShipmentItemId` — целое число. Получите идентификатор из коллекции позиций исходной отгрузки. Позиция должна быть связана с товаром, который нужно перенести.

-  `$movedQuantity` — число с плавающей точкой. Передайте количество из проверенного запроса или бизнес-процесса. Значение должно быть больше нуля и не превышать количество исходной позиции.

**Пример.** Код переносит часть количества позиции из исходной отгрузки в целевую.

```php
$sourceShipmentId = 67;
$targetShipmentId = 68;
$sourceShipmentItemId = 91;
$movedQuantity = 1.0;

$shipmentCollection = $order->getShipmentCollection();
$sourceShipment = $shipmentCollection->getItemById($sourceShipmentId);
$targetShipment = $shipmentCollection->getItemById($targetShipmentId);

if (
    !$sourceShipment
    || !$targetShipment
    || $sourceShipment->isSystem()
    || $targetShipment->isSystem()
    || $sourceShipment->isShipped()
    || $targetShipment->isShipped()
)
{
    throw new \RuntimeException('Не найдены доступные отгрузки');
}

$sourceItem = $sourceShipment
    ->getShipmentItemCollection()
    ->getItemById($sourceShipmentItemId);

if (!$sourceItem)
{
    throw new \RuntimeException('Позиция исходной отгрузки не найдена');
}

if (
    $movedQuantity <= 0
    || $movedQuantity > $sourceItem->getQuantity()
)
{
    throw new \RuntimeException('Некорректное количество для переноса');
}

$basketItem = $sourceItem->getBasketItem();
$newSourceQuantity = $sourceItem->getQuantity() - $movedQuantity;

$sourceResult = $sourceItem->setQuantity($newSourceQuantity);
if (!$sourceResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $sourceResult->getErrorMessages())
    );
}

$targetItem = $targetShipment
    ->getShipmentItemCollection()
    ->createItem($basketItem);

if (!$targetItem)
{
    throw new \RuntimeException('Не удалось создать позицию отгрузки');
}

$targetResult = $targetItem->setQuantity(
    $targetItem->getQuantity() + $movedQuantity
);

if (!$targetResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $targetResult->getErrorMessages())
    );
}
```

После перераспределения рассчитайте доставку и выполните финальный пересчет заказа.

### Удалить неотгруженную отгрузку

Метод `Shipment::delete()` исключает пользовательскую отгрузку из коллекции и возвращает `Result`. Отгруженную отгрузку удалить нельзя. При удалении позиции товаров возвращаются в системную отгрузку как нераспределенные.

Если товары должна доставить другая отгрузка, распределите их до расчета доставки и сохранения.

Укажите удаляемую отгрузку и оплату, сумму которой нужно обновить:

-  `$shipmentId` — целое число. Получите идентификатор из коллекции отгрузок заказа. Удалить можно только пользовательскую отгрузку, которая еще не отгружена.

-  `$paymentId` — целое число. Найдите идентификатор в коллекции оплат. Сценарий обновляет единственную неоплаченную оплату после пересчета заказа.

**Пример.** Код удаляет отгрузку, оставляет товары нераспределенными, пересчитывает заказ и обновляет сумму единственной оплаты.

```php
$shipmentId = 67;
$paymentId = 45;
$shipmentCollection = $order->getShipmentCollection();
$shipment = $shipmentCollection->getItemById($shipmentId);

if (!$shipment || $shipment->isSystem())
{
    throw new \RuntimeException('Отгрузка не найдена');
}

$deleteResult = $shipment->delete();

if (!$deleteResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $deleteResult->getErrorMessages())
    );
}

$deliveryResult = $shipmentCollection->calculateDelivery();
if (!$deliveryResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $deliveryResult->getErrorMessages())
    );
}

$finalActionResult = $order->doFinalAction(true);
if (!$finalActionResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $finalActionResult->getErrorMessages())
    );
}

$paymentCollection = $order->getPaymentCollection();
$payment = $paymentCollection->getItemById($paymentId);

if (
    $paymentCollection->count() !== 1
    || !$payment
    || $payment->isPaid()
)
{
    throw new \RuntimeException(
        'Сценарий требует одну неоплаченную оплату'
    );
}

$paymentResult = $payment->setField('SUM', $order->getPrice());
if (!$paymentResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $paymentResult->getErrorMessages())
    );
}

$saveResult = $order->save();
if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $saveResult->getErrorMessages())
    );
}
```

Для нескольких неоплаченных оплат распределите новую стоимость по правилам проекта. Не меняйте сумму подтвержденной оплаты без сценария отмены платежа или возврата.

### Зарезервировать и списать товары отгрузки

Для резервирования вызовите `Shipment::tryReserve()`, для снятия резерва — `Shipment::tryUnreserve()`. Фактическое списание товаров отгрузки подтверждает поле `DEDUCTED` со значением `Y`. Установите его через `Shipment::setField()`.

Проверяйте `Result` каждой операции и сохраняйте весь заказ через `Order::save()`. После резервирования вызовите `$shipment->isReserved()`. Метод возвращает `true`, если все позиции отгрузки зарезервированы полностью. Для частичного резерва сравните `$shipmentItem->getReservedQuantity()` с `$shipmentItem->getQuantity()` у каждой позиции.

Метод `$shipment->isShipped()` возвращает состояние списания.

{% note tip "" %}

Учитывайте настройки автоматического резервирования, складского учета и провайдера товара. Полный сценарий описан в статье [Резервирование и списание](./reservation-deduct.md).

{% endnote %}

## Пересчитать заказ после изменений {#recalculate-order}

Метод `Order::doFinalAction(true)` применяет отложенные действия после изменений, значимых для расчета.

Аргумент `true`:

-  отмечает, что изменились данные, значимые для стоимости заказа,

-  запускает финальный расчет скидок, налогов и рассчитанных полей.

С аргументом `false` метод только выполняет накопленные действия и не пересчитывает скидки и налоги. С аргументом `true` метод вызывает события `OnBeforeSaleOrderFinalAction` и `OnAfterSaleOrderFinalAction`. Обработчик события до пересчета может вернуть ошибку.

Перед вызовом метода отдельно рассчитайте доставку, если изменились служба, местоположение или состав отгрузок.

```php
$deliveryResult = $order
    ->getShipmentCollection()
    ->calculateDelivery();

if (!$deliveryResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $deliveryResult->getErrorMessages())
    );
}

$finalActionResult = $order->doFinalAction(true);

if (!$finalActionResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $finalActionResult->getErrorMessages())
    );
}
```

Если заказ содержит одну неоплаченную оплату на всю сумму, после финального расчета синхронизируйте ее поле `SUM` с `Order::getPrice()`. Ограничения службы доставки и платежной системы проверяйте до их назначения и повторно после финального расчета. Новые суммы, состав заказа и свойства могут изменить доступность доставки или платежной системы. Затем сохраняйте заказ.

Какие изменения требуют пересчета, указано в таблице раздела [Выбрать действия для каждого изменения](#choose-actions).

### Применить купон к сохраненному заказу

Для сохраненного заказа инициализируйте `DiscountCouponsManager` в режиме `MODE_ORDER`. Передайте идентификаторы пользователя и заказа, добавьте код купона и вызовите `doFinalAction(true)`. Если менеджер купонов уже инициализирован в текущем запросе, повторный `init()` режим не меняет. В этом случае вызовите `reInit()`.

Переменная `$couponCode` — строковый код купона. Получите его из проверенного значения пользовательского запроса, интеграции или настроек процесса.

Метод `DiscountCouponsManager::add()` возвращает `true`, если менеджер принял купон и не определил его как отсутствующий. Это не подтверждает применение скидки. После пересчета вызовите `DiscountCouponsManager::get(true, ['COUPON' => $couponCode], true, true)` и проверьте поле `STATUS` найденного купона.

-  Первый параметр `true` включает расширенные данные купона.

-  Массив во втором параметре выбирает `$couponCode`.

-  Третий параметр `true` возвращает и заблокированные купоны со статусом `STATUS_FREEZE`, и добавляет к купонам подсказки для показа пользователю.

-  Четвертый параметр `true` завершает проверку. Купоны, которые остались только введенными, получают статус непримененных.

Значение `DiscountCouponsManager::STATUS_APPLYED` означает, что купон применился к товару или доставке.

**Пример.** Код добавляет купон в расчет существующего заказа, пересчитывает заказ и проверяет статус купона.

```php
use Bitrix\Sale\DiscountCouponsManager;

$couponCode = 'SALE10';

// reInit() сбрасывает прежнюю инициализацию менеджера в текущем запросе
DiscountCouponsManager::reInit(
    DiscountCouponsManager::MODE_ORDER,
    [
        'userId' => $order->getUserId(),
        'orderId' => $order->getId(),
    ]
);

if (!DiscountCouponsManager::add($couponCode))
{
    throw new \RuntimeException('Не удалось добавить купон в расчет');
}

$finalActionResult = $order->doFinalAction(true);
if (!$finalActionResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $finalActionResult->getErrorMessages())
    );
}

$coupons = DiscountCouponsManager::get(
    true,
    ['COUPON' => $couponCode],
    true,
    true
);

if ($coupons === false)
{
    throw new \RuntimeException(
        'Не удалось получить результат проверки купона'
    );
}

if (!$coupons)
{
    throw new \RuntimeException('Купон не найден после пересчета');
}

$coupon = reset($coupons);

if (
    ($coupon['STATUS'] ?? null)
    !== DiscountCouponsManager::STATUS_APPLYED
)
{
    throw new \RuntimeException('Купон не применился к заказу');
}
```

После проверки заново распределите итоговую стоимость между неоплаченными оплатами и сохраните заказ. Не очищайте уже связанные с заказом купоны, если бизнес-сценарий не требует заменить их набор.

Инициализация менеджера, добавление и удаление купонов описаны в статье «Правила работы с корзиной», раздел [Существующий заказ](./discounts-coupons.md#recalculate-existing-order).

## Сохранить заказ и обработать ошибки {#save-order}

Метод `Order::save()` записывает в базу заказ и его корзину, свойства, оплаты, отгрузки и другие связанные данные. Метод возвращает `Bitrix\Sale\Result`.

`setField()`, пересчет, синхронизация коллекций и обработчики событий могут изменить и другие поля помимо переданных в `setField()`. Например, смена статуса заполняет `DATE_STATUS` и `EMP_STATUS_ID`, а изменение поля заказа сбрасывает `UPDATED_1C`.

**Пример.** Код сохраняет заказ, проверяет ошибки и получает список предупреждений.

```php
$saveResult = $order->save();

if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $saveResult->getErrorMessages())
    );
}

$warningMessages = $saveResult->getWarningMessages();
```

Обрабатывайте предупреждения отдельно от ошибок. Метод `save()` переносит часть ошибок проверки и вложенных объектов в предупреждения результата. Поэтому успешный `isSuccess()` не означает, что список предупреждений пуст.

### Проверить сохраненное состояние

Если предупреждение относится к важной части заказа, не продолжайте внешний процесс по данным объекта в памяти. Запишите предупреждения в журнал, заново загрузите заказ и проверьте поля и коллекции, которые нужны внешнему процессу.

После вызова `Order::save()` проверьте `$saveResult` и состояние заказа в базе. Переменная `$saveResult` содержит результат сохранения, а `$order` — сохраненный объект заказа в памяти.

```php
foreach ($saveResult->getWarningMessages() as $warningMessage)
{
    error_log($warningMessage);
}

$storedOrder = Order::load($order->getId());

if (!$storedOrder)
{
    throw new \RuntimeException(
        'Не удалось загрузить заказ после сохранения'
    );
}

$storedStatusId = $storedOrder->getField('STATUS_ID');
$storedPrice = $storedOrder->getPrice();

if (
    $storedStatusId !== $order->getField('STATUS_ID')
    || abs($storedPrice - $order->getPrice()) >= 1e-10
)
{
    throw new \RuntimeException(
        'Сохраненное состояние заказа отличается от ожидаемого'
    );
}
```

Сравнивайте только значения, важные для текущего процесса, — статус, стоимость, свойство покупателя, оплату или отгрузку. Не повторяйте `save()` автоматически с тем же объектом. Сначала определите причину предупреждения и заново загрузите актуальное состояние.

В начале сохранения модуль вызывает `OnSaleOrderBeforeSaved`. Обработчик может изменить объект или остановить сохранение. После записи заказа и его коллекций модуль вызывает `OnSaleOrderSaved`, а затем отправляет события смены состояния заказа — смены статуса, оплаты и отмены.

Не вызывайте `$order->save()` из обработчиков `OnSaleOrderBeforeSaved` и `OnSaleOrderSaved`. Оба события срабатывают, пока исходный `save()` еще выполняется. Повторный вызов запускает вложенное сохранение того же заказа. Модуль выдает PHP-предупреждение `E_USER_WARNING` с текстом `Order saving in recursion`, но сохранение не прерывает.

Если значение должно попасть в заказ при текущем сохранении, измените объект в `OnSaleOrderBeforeSaved` без вызова `save()`. Если действие нужно выполнить после сохранения, поставьте задачу в очередь из `OnSaleOrderSaved`. В отложенном процессе заново загрузите заказ по идентификатору и сохраните его. Храните уникальный идентификатор операции в очереди, чтобы повторное сохранение заказа не поставило задачу дважды. Подробнее — в статье [Статусы и события](./statuses-events.md#avoid-handler-recursion).

### Отличить удаление от обновления

События `OnSaleOrderDeleted`, `OnSalePaymentDeleted`, `OnSaleShipmentDeleted` и `OnSalePropertyValueDeleted` относятся к физическому удалению данных. Обычный `Order::save()` не вызывает их, если соответствующие объекты не удаляются.

Модуль вызывает событие `OnSaleOrderDeleted` после попытки удалить строку заказа через `Order::delete()`. Событие получает параметры:

-  `ENTITY` — объект удаляемого заказа,

-  `VALUE` — логический результат удаления строки заказа.

События `OnSalePaymentDeleted`, `OnSaleShipmentDeleted` и `OnSalePropertyValueDeleted` получают параметр `VALUES` с полями объекта, прочитанными до удаления. Модуль отправляет каждое событие после удаления соответствующей строки из базы данных.

Отмена заказа через `setField('CANCELED', 'Y')` не удаляет заказ и не вызывает `OnSaleOrderDeleted`. Для реакции на сохраненную отмену используйте `OnSaleOrderCanceled`, а для обычного обновления — `OnSaleOrderSaved`. Событие `OnSaleOrderCanceled` приходит при любом изменении `CANCELED`, в том числе при восстановлении заказа, поэтому в обработчике проверяйте `$order->isCanceled()`.

{% note warning "" %}

Не используйте `Order::delete()` для обычного отказа покупателя, ошибки оплаты или прекращения обработки заказа. В бизнес-логике отмените заказ через `CANCELED = 'Y'`. Данные заказа останутся доступны для истории, отчетов и интеграций.

Физическое удаление применяйте только в административном или служебном сценарии с отдельной проверкой прав. Удаленный заказ и связанные строки нельзя восстановить установкой `CANCELED = 'N'`.

{% endnote %}

## Собрать полный сценарий изменения заказа {#full-update-scenario}

Код ниже меняет телефон покупателя и службу доставки. Смена службы влияет на стоимость заказа, поэтому код проверяет и назначает службу доставки, заново рассчитывает доставку, проверяет платежную систему, выполняет `doFinalAction(true)`, обновляет сумму оплаты, повторяет проверку и сохраняет заказ.

Сценарий рассчитан на одну пользовательскую отгрузку и одну неоплаченную оплату.

Перед запуском задайте:

-  `$orderId` — целое число. Получите идентификатор из проверенного запроса, очереди или данных фоновой задачи. Заказ с таким идентификатором должен существовать.

-  `$phonePropertyId` — целое число. Возьмите идентификатор из настроек свойств текущего типа плательщика. По этому идентификатору в заказе должно находиться значение свойства телефона.

-  `$shipmentId` — целое число. Получите идентификатор из коллекции отгрузок загруженного заказа. Выбранная отгрузка не должна быть системной.

-  `$deliveryId` — целое число. Возьмите идентификатор из настроек проекта или проверенного запроса. Служба должна существовать и подходить для собранной отгрузки.

-  `$paymentId` — целое число. Найдите идентификатор в коллекции оплат заказа. Оплата должна принадлежать заказу и оставаться неподтвержденной.

-  `$newPhone` — строка. Передайте телефон из проверенных данных покупателя в формате, принятом в проекте.

**Пример.** Код загружает заказ, меняет телефон и службу доставки, проверяет доступность платежной системы, пересчитывает заказ и сохраняет его.

```php
use Bitrix\Main\Loader;
use Bitrix\Sale\Delivery\Services\Manager as DeliveryManager;
use Bitrix\Sale\Order;
use Bitrix\Sale\PaySystem\Manager as PaySystemManager;
use Bitrix\Sale\Services\Base\RestrictionManager;

if (!Loader::includeModule('sale'))
{
    throw new \RuntimeException('Не удалось подключить модуль sale');
}

// Подготовка входных данных
$orderId = 123;
$phonePropertyId = 7;
$shipmentId = 67;
$deliveryId = 3;
$paymentId = 45;
$newPhone = '0000000000';

// Загрузка заказа
$order = Order::load($orderId);

if (!$order)
{
    throw new \RuntimeException('Заказ не найден');
}

// Изменение телефона покупателя
$phoneProperty = $order
    ->getPropertyCollection()
    ->getItemByOrderPropertyId($phonePropertyId);

if (!$phoneProperty)
{
    throw new \RuntimeException('Свойство телефона не найдено');
}

$phoneResult = $phoneProperty->setValue($newPhone);
if (!$phoneResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $phoneResult->getErrorMessages())
    );
}

// Проверка текущей оплаты
$paymentCollection = $order->getPaymentCollection();
$payment = $paymentCollection->getItemById($paymentId);

if (
    $paymentCollection->count() !== 1
    || !$payment
    || $payment->isPaid()
)
{
    throw new \RuntimeException(
        'Сценарий требует одну неоплаченную оплату'
    );
}

$paySystemId = $payment->getPaymentSystemId();

// Выбор службы доставки
$shipmentCollection = $order->getShipmentCollection();
$shipment = $shipmentCollection->getItemById($shipmentId);

if (!$shipment || $shipment->isSystem())
{
    throw new \RuntimeException('Пользовательская отгрузка не найдена');
}

$availableDeliveries = DeliveryManager::getRestrictedObjectsList($shipment);
$delivery = $availableDeliveries[$deliveryId] ?? null;
if (!$delivery)
{
    throw new \RuntimeException('Служба доставки недоступна для заказа');
}

$shipment->setDeliveryService($delivery);

if ($shipment->getDeliveryId() !== (int)$delivery->getId())
{
    throw new \RuntimeException('Не удалось назначить службу доставки');
}

// Пересчет доставки и заказа
$deliveryResult = $shipmentCollection->calculateDelivery();
if (!$deliveryResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $deliveryResult->getErrorMessages())
    );
}

$availablePaySystems = PaySystemManager::getListWithRestrictions(
    $payment,
    RestrictionManager::MODE_CLIENT
);

if (!isset($availablePaySystems[$paySystemId]))
{
    throw new \RuntimeException('Платежная система недоступна для заказа');
}

$finalActionResult = $order->doFinalAction(true);
if (!$finalActionResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $finalActionResult->getErrorMessages())
    );
}

// Обновление суммы оплаты
$paymentResult = $payment->setField('SUM', $order->getPrice());
if (!$paymentResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $paymentResult->getErrorMessages())
    );
}

// Повторная проверка сервисов после финального расчета
$availableDeliveries = DeliveryManager::getRestrictedObjectsList($shipment);
if (!isset($availableDeliveries[$deliveryId]))
{
    throw new \RuntimeException(
        'Служба доставки недоступна после расчета заказа'
    );
}

$availablePaySystems = PaySystemManager::getListWithRestrictions(
    $payment,
    RestrictionManager::MODE_CLIENT
);
if (!isset($availablePaySystems[$paySystemId]))
{
    throw new \RuntimeException(
        'Платежная система недоступна после расчета заказа'
    );
}

// Сохранение заказа
$saveResult = $order->save();
if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $saveResult->getErrorMessages())
    );
}

$warningMessages = $saveResult->getWarningMessages();
```

Если код выполняется по запросу пользователя, добавьте проверку права на обновление заказа до `Order::load()` или сразу после загрузки. Для фонового процесса ограничьте набор заказов и допустимых переходов правилами самого процесса.

## Перейти к связанным операциям

Для дальнейшей работы выберите статью о нужной части заказа:

-  добавление, изменение и удаление позиций — [Работа с корзиной](./basket.md),

-  настройка контактных и адресных данных — [Свойства заказа](./properties.md),

-  платежная система, частичная оплата и возврат — [Оплаты и платежные системы](./payments.md),

-  расчет доставки и разделение отгрузок — [Доставка и отгрузки](./delivery-shipments.md),

-  складской резерв и списание товаров — [Резервирование и списание](./reservation-deduct.md),

-  скидки после изменения корзины — [Скидки и купоны](./discounts-coupons.md),

-  обработчики сохранения и изменения состояния — [Статусы и события](./statuses-events.md).
