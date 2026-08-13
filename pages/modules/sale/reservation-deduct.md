---
title: Резервирование и списание
description: "Резервирование товара, списание при отгрузке и связь операций с остатками торгового каталога."
---

Модуль Интернет-магазин резервирует товар по заказу до списания. Списание меняет состояние отгрузки, а провайдер товара обновляет остатки при сохранении заказа.

В объектной модели резерв связан с тремя объектами:

-  Позиция корзины хранит строки резерва по складам.

-  Позиция отгрузки хранит количество товара в конкретной отгрузке.

-  Отгрузка объединяет позиции, проверяет, зарезервированы ли они полностью, и запускает резервирование или списание через провайдер каталога.

## Основные объекты

#|
|| **Объект** | **Роль в сценарии** ||
|| `Bitrix\Sale\ReserveQuantity` | Хранит одну строку резерва позиции корзины: количество, склад, дату резерва, дату окончания резерва и пользователя, который создал резерв ||
|| `Bitrix\Sale\ReserveQuantityCollection` | Хранит строки резерва одной позиции корзины, создает новые строки, возвращает общее количество резерва и количество по складу ||
|| `Bitrix\Sale\Reservation\BasketReservationService` | Добавляет, обновляет и удаляет строки резерва в таблице резервирования, а также пишет историю резерва. Возвращает доступное к списанию количество по заказу или позиции корзины ||
|| `Bitrix\Sale\Reservation\AvailableQuantityCalculator` | Рассчитывает доступное количество по складам на основе остатков и истории резервов ||
|| `Bitrix\Sale\Helpers\ReservedProductCleaner` | Пошагово снимает просроченные резервы неоплаченных и неотмененных заказов ||
|| `Bitrix\Sale\Shipment` | Хранит отгрузку заказа. Может запускать резервирование, снимать с резерва и списывать количество ||
|| `Bitrix\Sale\ShipmentItem` | Хранит позицию отгрузки: количество в отгрузке и зарезервированное количество ||
|#

{% note warning "" %}

Классы классического API `CSaleBasket`, `CSaleProduct`, `CSaleStoreBarcode` и интерфейс провайдера классического API `IBXSaleProductProvider` могут встречаться в существующих проектах. В новых сценариях работайте через `Order`, `Shipment`, `ShipmentItem`, `ReserveQuantity` и сервисы пространства имен `Bitrix\Sale\Reservation`.

{% endnote %}

## Как связаны корзина, отгрузка и каталог

Позиция корзины описывает товар заказа: связь с заказом, количество, цену и служебные поля резерва. Для товаров каталога позиция обычно использует провайдер `catalog`. Провайдер учитывает настройки товара, остатки, склады, резерв и списание.

Позиция отгрузки описывает, какая часть позиции корзины входит в конкретную отгрузку. Если заказ отгружается частями, одна позиция корзины может быть распределена между несколькими отгрузками.

Резерв может храниться на двух уровнях:

-  в позиции корзины и склада — в строках `ReserveQuantity`,

-  в позиции отгрузки — в поле `RESERVED_QUANTITY`.

Когда меняется `RESERVED_QUANTITY` позиции отгрузки, объектная модель синхронизирует строки резерва позиции корзины. При увеличении резерва она создает или увеличивает строку `ReserveQuantity`. При уменьшении резерва объектная модель уменьшает существующие строки или удаляет их.

{% note warning "" %}

Не меняйте поля резервирования напрямую в таблицах. Прямая запись не запустит провайдер товара, историю резервирования, пересчет складских остатков и проверки заказа.

{% endnote %}

## Настройки резервирования

Резервирование зависит от настроек модулей Интернет-магазин `sale` и Торговый каталог `catalog`.

### Модуль Интернет-магазин

Настройки модуля `sale` управляют автоматическим резервированием в заказе. Прочитать настройки можно методами класса `Bitrix\Sale\Configuration`.

-  `getProductReservationCondition()` возвращает одно из условий автоматического резервирования `Bitrix\Sale\Reservation\Configuration\ReserveCondition`:

   -  `ON_CREATE` — при создании заказа,

   -  `ON_PAY` — когда хотя бы одна оплата заказа имеет статус оплаченной,

   -  `ON_FULL_PAY` — после полной оплаты заказа,

   -  `ON_ALLOW_DELIVERY` — при разрешении доставки отгрузки,

   -  `ON_SHIP` — при списании отгрузки.

-  `isEnableAutomaticReservation()` — показывает, включено ли автоматическое резервирование в объектной модели заказа.

-  `getProductReserveClearPeriod()` — возвращает период хранения резерва в днях. Период нужен для расчета даты окончания резерва и очистки устаревших резервов.

### Модуль Торговый каталог

Настройки модуля `catalog` влияют на остатки, складской учет и доступность товара. При работе с заказами их можно читать через методы `Bitrix\Sale\Configuration`.

-  `useStoreControl()` — показывает, используется ли складской учет модуля `catalog`.

-  `isEnabledReservation()` — проверяет настройку `catalog` `enable_reservation`.

-  `getDefaultStoreId()` — возвращает склад по умолчанию для операций резерва и списания. Если складской учет не используется, возвращает `0`.

Если складской учет включен, резерв и списание работают по складам. В коде передавайте склад позиции резерва или склад отгрузки. После операции проверяйте складские остатки через ORM-класс `StoreProductTable`.

Если складской учет выключен, провайдер работает с общими остатками товара каталога. В этом случае склад в строке резерва может быть равен `0`.

{% note tip "" %}

Настройки товаров, количественного учета и складского учета описаны в статьях [Базовые настройки каталога](./../catalog/catalog-settings.md) и [Складской учет](./../catalog/inventory-management.md).

{% endnote %}

## Базовый сценарий

Резервируйте и списывайте товар в следующей последовательности:

1. Загрузите заказ через `Bitrix\Sale\Order::load()`.

2. Получите отгрузку и позиции отгрузки.

3. Проверьте состав отгрузки и склад, если проект использует складской учет.

4. Зарезервируйте товары отгрузки через `Shipment::tryReserve()` или дайте системе сделать это автоматически по настройке резервирования.

5. Сохраните заказ через `Order::save()`.

6. При фактической отгрузке установите `DEDUCTED = 'Y'`.

7. Сохраните заказ еще раз и проверьте результат операции.

Не сохраняйте отдельно отгрузку, позицию отгрузки и строки резерва. После изменений сохраняйте заказ.

## Подготовить заказ и отгрузку

Следующие примеры показывают отдельные шаги сценария. Чтобы использовать их в своем коде, подготовьте заказ и отгрузку:

-  `$orderId` — идентификатор существующего заказа,

-  `$order` — загруженный заказ,

-  `$shipment` — отгрузка, с которой работает сценарий резервирования или списания,

-  `$shipmentItemCollection` — коллекция позиций этой отгрузки.

{% note tip "" %}

Подробнее об отгрузках читайте в статье [Доставка и отгрузки](./delivery-shipments.md).

{% endnote %}

Для складских операций заранее подготовьте склад и товарные остатки в модуле `catalog`. Подробнее в статье [Складской учет](./../catalog/inventory-management.md) модуля Торговый каталог.

## Проверить резерв позиции

У позиции корзины резерв хранится в коллекции `ReserveQuantityCollection`. Метод `BasketItem::getReserveQuantityCollection()` возвращает коллекцию, а `ReserveQuantityCollection::getQuantity()` — сумму всех строк резерва позиции корзины.

Строка резерва содержит склад и количество. Обход коллекции показывает, как резерв позиции корзины распределен по складам.

```php
// $basketItem — объект \Bitrix\Sale\BasketItem из заказа
$reserveCollection = $basketItem->getReserveQuantityCollection();
if (!$reserveCollection)
{
    throw new \RuntimeException('Позиция корзины не поддерживает резервирование');
}

echo 'Всего зарезервировано: ' . $reserveCollection->getQuantity();

foreach ($reserveCollection as $reserve)
{
    echo sprintf(
        'Склад %d: %F',
        $reserve->getStoreId(),
        $reserve->getQuantity()
    );
}
```

Чтобы получить резерв только по одному складу, используйте метод `getQuantityByStoreId($storeId)`.

```php
// $storeId — идентификатор склада
$reservedOnStore = $reserveCollection->getQuantityByStoreId($storeId);

echo sprintf(
    'На складе %d зарезервировано: %F',
    $storeId,
    $reservedOnStore
);
```

Позиция отгрузки хранит свое зарезервированное количество в поле `RESERVED_QUANTITY`. Метод `ShipmentItem::getReservedQuantity()` возвращает это значение для конкретной позиции отгрузки. Метод `getQuantity()` в этом же примере показывает количество товара, которое входит в отгрузку.

```php
foreach ($shipment->getShipmentItemCollection() as $shipmentItem)
{
    echo sprintf(
        'Позиция корзины %d: в отгрузке %F, зарезервировано %F',
        $shipmentItem->getBasketId(),
        $shipmentItem->getQuantity(),
        $shipmentItem->getReservedQuantity()
    );
}
```

Чтобы проверить резерв всей отгрузки, используйте метод `Shipment::isReserved()`. Он вернет `true`, если у каждой позиции отгрузки зарезервированное количество `RESERVED_QUANTITY` равно количеству в отгрузке `QUANTITY`.

```php
if ($shipment->isReserved())
{
    echo 'Отгрузка полностью зарезервирована';
}
```

## Зарезервировать товар

Чтобы зарезервировать товар в отгрузке, используйте `Shipment::tryReserve()`. Метод передает позиции отгрузки провайдеру товара, проверяет доступное количество и меняет зарезервированное количество позиций отгрузки.

```php
$result = $shipment->tryReserve();
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

Если нужно зарезервировать конкретную позицию корзины вручную, работайте через `ReserveQuantityCollection`. Сначала задайте склад, затем количество: менять склад у строки с положительным количеством нельзя.

```php
// $basketItem — позиция корзины
// $storeId — идентификатор склада
// $quantityToReserve — количество к резервированию

if ($quantityToReserve <= 0)
{
    throw new \RuntimeException('Количество к резервированию должно быть больше нуля');
}

if ($quantityToReserve > $basketItem->getQuantity())
{
    throw new \RuntimeException('Резерв не может быть больше количества позиции корзины');
}

$reserveCollection = $basketItem->getReserveQuantityCollection();
if (!$reserveCollection)
{
    throw new \RuntimeException('Позиция корзины не поддерживает резервирование');
}

$reserve = $reserveCollection->create();
$result = $reserve->setStoreId($storeId);
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$result = $reserve->setQuantity($quantityToReserve);
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

При изменении количества `ReserveQuantity::setQuantity()` проверяет, что суммарный резерв коллекции не превышает количество позиции корзины, и вызывает провайдер каталога для проверки резерва.

## Изменить резерв при изменении отгрузки

Когда количество в отгрузке меняется, резерв нужно привести к новому количеству.

Объектная модель может синхронизировать резерв при изменении количества, если автоматическое резервирование включено и условие резервирования уже выполнено. Чтобы вручную привести резерв к новому количеству отгрузки, вызовите метод `tryReserve()`.

```php
// $basketItem — позиция корзины
// $newShipmentQuantity — новое количество в отгрузке

$shipmentItem = $shipment
    ->getShipmentItemCollection()
    ->getItemByBasketCode($basketItem->getBasketCode())
;

if (!$shipmentItem)
{
    $shipmentItem = $shipment
        ->getShipmentItemCollection()
        ->createItem($basketItem)
    ;
}

if (!$shipmentItem)
{
    throw new \RuntimeException('Не удалось создать позицию отгрузки');
}

$result = $shipmentItem->setQuantity($newShipmentQuantity);
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$result = $shipment->tryReserve();
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

Нельзя менять состав отгрузки после списания. Метод `ShipmentItemCollection::createItem()` вернет `null`, а метод `ShipmentItem::setQuantity()` — результат с ошибкой.

## Списать товар при отгрузке

Списание выполняется на уровне отгрузки. Установите поле `DEDUCTED` в `Y` и сохраните заказ.

```php
if ($shipment->isEmpty())
{
    throw new \RuntimeException('Нельзя списать пустую отгрузку');
}

if (!$shipment->isReserved())
{
    $reserveResult = $shipment->tryReserve();
    if (!$reserveResult->isSuccess())
    {
        throw new \RuntimeException(implode('; ', $reserveResult->getErrorMessages()));
    }
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

При изменении `DEDUCTED` отгрузка:

-  заполняет дату списания и пользователя списания,

-  запускает событие изменения списания.

Изменение поля переводит отгрузку в новое состояние. Провайдер товара проверяет количество, резерв, складские данные и настройки товара при сохранении заказа.

Если включен складской учет, списание зависит от склада. Для отгрузки можно указать склад самовывоза или использовать склад по умолчанию.

```php
// $storeId — идентификатор склада
// Склад нужно указать до списания, чтобы провайдер проверял остатки по нему
$shipment->setStoreId($storeId);

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

Списание меняет остатки через провайдер товара после сохранения заказа. При складском учете провайдер обновляет поля `AMOUNT` и `QUANTITY_RESERVED` через ORM-класс `StoreProductTable`.

## Снять резерв

Для снятия резерва в отгрузке используйте метод `Shipment::tryUnreserve()`. Метод снимает резерв по позициям отгрузки через провайдер товара.

```php
if ($shipment->isShipped())
{
    throw new \RuntimeException('Нельзя снять резерв со списанной отгрузки');
}

$result = $shipment->tryUnreserve();
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

Для отдельной строки резерва используйте `ReserveQuantity::delete()`. Метод сначала устанавливает количество резерва `0`, затем удаляет строку.

```php
$reserveCollection = $basketItem->getReserveQuantityCollection();
if (!$reserveCollection)
{
    throw new \RuntimeException('Позиция корзины не поддерживает резервирование');
}

$reserve = $reserveCollection->getItemById($reserveId);
if (!$reserve)
{
    throw new \RuntimeException('Резерв не найден');
}

$result = $reserve->delete();
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

## Проверить доступное количество и остатки

Метод `BasketReservationService::getAvailableCountForBasketItem($basketId, $storeId)` возвращает доступное к списанию количество для позиции корзины и склада с учетом истории резервов.

```php
// $basketItem — позиция корзины с сохраненным идентификатором
// $storeId — идентификатор склада

$availableQuantity = \Bitrix\Sale\Reservation\BasketReservationService::getInstance()
    ->getAvailableCountForBasketItem(
        $basketItem->getId(),
        $storeId
    )
;

echo 'Доступно к списанию: ' . $availableQuantity;
```

Для проверки нескольких позиций заказа используйте `getAvailableCountForOrder($orderId)`.

```php
$availableByOrder = \Bitrix\Sale\Reservation\BasketReservationService::getInstance()
    ->getAvailableCountForOrder($order->getId())
;

foreach ($availableByOrder as $basketId => $stores)
{
    foreach ($stores as $storeId => $quantity)
    {
        echo sprintf(
            'Позиция корзины %d, склад %d: %F',
            $basketId,
            $storeId,
            $quantity
        );
    }
}
```

Если нужно рассчитать доступное количество по собственному набору остатков и истории, используйте `AvailableQuantityCalculator`. Он не загружает данные сам: разработчик передает остатки и историю резервов.

```php
// $storeAmount — остаток товара на складе
// $basketItem — позиция корзины, для которой учитывается история резерва
// $reservedQuantity — количество из истории резерва, которое нужно учесть в расчете

$calculator = new \Bitrix\Sale\Reservation\AvailableQuantityCalculator();

$calculator->setStoreQuantity($storeId, $productId, $storeAmount);
$calculator->addReservationHistory(
    $storeId,
    $productId,
    $basketItem->getId(),
    $reservedQuantity
);

$availableByBasket = $calculator->getQuantityForBatch([
    $basketItem->getId() => $productId,
]);

$availableForStore = $availableByBasket[$basketItem->getId()][$storeId] ?? 0.0;
```

Проверить текущие складские остатки товаров можно методом `StoreProductTable::getList()` модуля `catalog`.

```php
$storeProduct = \Bitrix\Catalog\StoreProductTable::getList([
    'select' => [
        'AMOUNT',
        'QUANTITY_RESERVED',
    ],
    'filter' => [
        '=PRODUCT_ID' => $productId,
        '=STORE_ID' => $storeId,
    ],
    'limit' => 1,
])
    ->fetch()
;

if ($storeProduct)
{
    echo 'Остаток на складе: ' . (float)$storeProduct['AMOUNT'];
    echo 'Резерв на складе: ' . (float)$storeProduct['QUANTITY_RESERVED'];
}
```

Если складской учет выключен, проверяйте общие данные товара через ORM-класс `ProductTable`.

```php
$product = \Bitrix\Catalog\ProductTable::getList([
    'select' => [
        'QUANTITY',
        'QUANTITY_RESERVED',
        'QUANTITY_TRACE',
        'CAN_BUY_ZERO',
    ],
    'filter' => [
        '=ID' => $productId,
    ],
    'limit' => 1,
])
    ->fetch()
;

if ($product)
{
    echo 'Остаток товара: ' . (float)$product['QUANTITY'];
    echo 'Резерв товара: ' . (float)$product['QUANTITY_RESERVED'];
}
```

Поля `QUANTITY_TRACE` и `CAN_BUY_ZERO` влияют на проверку доступного количества. Если количественный учет включен и покупка при нулевом остатке запрещена, провайдер не должен списывать больше доступного количества.

## Очистить устаревшие резервы

Класс `Bitrix\Sale\Helpers\ReservedProductCleaner` снимает просроченные резервы порциями по 100 записей. Он выбирает строки резерва с положительным количеством и датой окончания `DATE_RESERVE_END` не позже текущей даты, но только для неоплаченных и неотмененных заказов.

При сохранении система заполняет дату окончания резерва у новой строки. Для расчета она берет период из `Configuration::getProductReserveClearPeriod()` и добавляет его к текущей дате.

Обычно очистку запускает механизм пошаговых задач продукта. Если нужно выполнить ее в своем служебном сценарии, используйте метод `execute()` и передайте массив состояния.

```php
$cleaner = new \Bitrix\Sale\Helpers\ReservedProductCleaner();
$state = [];

$cleaner->execute($state);
```

После удаления строк резерва класс сохраняет заказ. Если сохранение вернуло ошибки, класс устанавливает заказу `MARKED = 'Y'` и добавляет сообщения об ошибках в поле `REASON_MARKED`.

## Что учитывать при интеграции

Резерв и списание зависят от нескольких слоев данных. Перед запуском операции проверьте следующие условия:

-  заказ не отменен,

-  отгрузка не списана, если сценарий меняет состав или снимает резерв,

-  позиции отгрузки заполнены и их суммарное количество не превышает количество в корзине,

-  склад задан, если проект использует складской учет,

-  товар поддерживает количественный учет, если сценарий должен контролировать остатки,

-  провайдер товара поддерживает резерв и списание,

-  код проверяет результат вызовов `tryReserve()`, `tryUnreserve()`, `setField('DEDUCTED', 'Y')` и `Order::save()` через `isSuccess()`.

Если вызов одного из методов — `tryReserve()`, `tryUnreserve()` или `setField('DEDUCTED', 'Y')` — вернул предупреждения, отгрузка может получить пометку `MARKED = 'Y'`. Текст последнего предупреждения сохраняется в поле `REASON_MARKED` заказа. Добавьте этот текст в лог интеграции и покажите менеджеру причину проблемы.

## Проверить результат списания

Модуль `sale` хранит состояние заказа, отгрузки и резерва в контексте продажи. Модуль `catalog` хранит данные о товарах, складах и остатках.

Если интеграция должна сверить результат операции, сравните состояние заказа и складские остатки:

-  у отгрузки `DEDUCTED` равно `Y` после сохранения списания,

-  у позиции отгрузки `RESERVED_QUANTITY` соответствует ожидаемому резерву до списания,

-  в `StoreProductTable` изменились `AMOUNT` и `QUANTITY_RESERVED`, если складской учет включен,

-  в `ProductTable` изменились `QUANTITY` и `QUANTITY_RESERVED`, если используется общий количественный учет без складов.

Для резервирования и списания изменяйте объекты заказа через методы объектной модели и сохраняйте весь заказ. После сохранения проверяйте результат операции, состояние отгрузки и остатки товара.
