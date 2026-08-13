---
title: Статусы и события
description: "Статусы и события. Статусы заказа и доставки, права, история изменений и события модуля sale."
---

Статусы показывают, на каком этапе находятся заказ и его отгрузки. События модуля `sale` позволяют выполнить дополнительное действие после сохранения, оплаты, отмены или изменения статуса.

{% note tip "" %}

Заказ, оплаты и отгрузки меняют через связанные PHP-объекты. Подробнее в статье [Схема работы интернет-магазина и основные объекты](./architecture.md).

{% endnote %}

## Чем статус заказа отличается от статуса отгрузки

Заказ и отгрузка проходят разные жизненные циклы. Поэтому модуль хранит для них разные типы статусов.

#|
|| **Состояние** | **Где хранится** | **Класс списка статусов** | **Начальный и финальный статусы** ||
|| Заказ | Поле `STATUS_ID` объекта `Bitrix\Sale\Order` | `Bitrix\Sale\OrderStatus` | `N` и `F` ||
|| Отгрузка | Поле `STATUS_ID` объекта `Bitrix\Sale\Shipment` | `Bitrix\Sale\DeliveryStatus` | `DN` и `DF` ||
|#

У одного заказа может быть несколько отгрузок, и у каждой отгрузки свой статус.

-  Статус отгрузки не означает, что заказ оплачен.

-  Статус заказа не заменяет признаки оплаты, отмены, разрешения доставки и списания товаров.

Эти состояния меняются через соответствующие объекты и методы. Подробнее об отгрузках читайте в статье [Доставка и отгрузки](./delivery-shipments.md), об оплатах — в статье [Оплаты и платежные системы](./payments.md).

## Основные объекты

Для операций с заказом или отгрузкой используйте соответствующий объект и класс статусов: `OrderStatus` для заказа или `DeliveryStatus` для отгрузки. Поля статуса, его локализованные название и описание можно получить через ORM-классы `StatusTable` и `StatusLangTable`.

Чтобы создать или изменить статус, используйте сценарии из статьи [Базовые настройки интернет-магазина](./sale-settings.md).

#|
|| **API** | **Роль** ||
|| `Bitrix\Sale\OrderStatus` | Возвращает:

-  статусы заказа
-  начальный и финальный коды
-  доступные пользователю переходы и статусы, с которых разрешена оплата
||
|| `Bitrix\Sale\DeliveryStatus` | Возвращает:

-  статусы отгрузки
-  начальный и финальный коды
-  доступные пользователю переходы
||
|| `Bitrix\Sale\Internals\StatusTable` | Хранит общие поля статуса: код, тип, сортировку, признак уведомления, цвет и внешний идентификатор ||
|| `Bitrix\Sale\Internals\StatusLangTable` | Хранит название и описание статуса для конкретного языка ||
|| `Bitrix\Sale\OrderHistory` | Собирает изменения заказа и связанных объектов во время сохранения ||
|| `Bitrix\Main\EventManager` | Регистрирует обработчики событий модуля `sale` ||
|#

### Поля статуса {#status-fields}

Класс `StatusTable` хранит данные статусов заказа и отгрузки. Поле `TYPE` разделяет записи:

-  `O` — заказ,

-  `D` — отгрузка.

Используйте константы `StatusTable::TYPE_ORDER` и `StatusTable::TYPE_SHIPMENT`, чтобы не передавать эти значения строками.

#|
|| **Поле** | **Назначение** ||
|| `ID` | Код статуса из одной или двух латинских букв ||
|| `TYPE` | Тип статуса: заказа или отгрузки. По умолчанию — статус заказа ||
|| `SORT` | Порядок статуса в списке. Значение по умолчанию — `100` ||
|| `NOTIFY` | Признак штатного уведомления о смене статуса: `Y` или `N`. Значение по умолчанию — `Y` ||
|| `COLOR` | Цвет статуса в интерфейсе ||
|| `XML_ID` | Внешний идентификатор статуса ||
|#

### Получить локализованные статусы

Составной ключ класса `StatusLangTable` образуют код статуса `STATUS_ID` и двухбуквенный код языка `LID`. Поле `NAME` обязательно, поле `DESCRIPTION` содержит необязательное описание.

В `StatusTable` определена ORM-связь `STATUS_LANG` со `StatusLangTable` по коду статуса: `StatusTable.ID` соответствует `StatusLangTable.STATUS_ID`. Поэтому локализованные поля можно получить через `StatusTable::getList()` по путям `STATUS_LANG.NAME`, `STATUS_LANG.DESCRIPTION` и `STATUS_LANG.LID`. ORM автоматически присоединит языковые записи к данным статусов.

```php
$languageId = 'ru';

$statusResult = \Bitrix\Sale\Internals\StatusTable::getList([
    'select' => [
        'ID',
        'TYPE',
        'SORT',
        'NOTIFY',
        'COLOR',
        'XML_ID',
        'NAME' => 'STATUS_LANG.NAME',
        'DESCRIPTION' => 'STATUS_LANG.DESCRIPTION',
    ],
    'filter' => [
        '=TYPE' => \Bitrix\Sale\Internals\StatusTable::TYPE_ORDER,
        '=STATUS_LANG.LID' => $languageId,
    ],
    'order' => ['SORT' => 'ASC'],
]);

$statuses = [];

while ($status = $statusResult->fetch())
{
    $statuses[$status['ID']] = [
        'NAME' => $status['NAME'],
        'DESCRIPTION' => $status['DESCRIPTION'],
        'NOTIFY' => $status['NOTIFY'],
        'COLOR' => $status['COLOR'],
    ];
}
```

Запрос с фильтром по `STATUS_LANG.LID` возвращает только записи выбранного языка.

## Базовый сценарий

Работа со статусом и событием состоит из последовательных действий:

1. Загрузите заказ.

2. Получите текущий `STATUS_ID` заказа или отгрузки.

3. Запросите разрешенные целевые статусы для пользователя.

4. Проверьте, что нужный статус входит в результат.

5. Измените `STATUS_ID` через объект заказа или отгрузки.

6. Сохраните заказ методом `Order::save()` и проверьте ошибки.

7. Выполните дополнительное действие в подходящем событии и убедитесь, что повторный вызов обработчика не дублирует результат.

После успешного сохранения новый статус появляется в объекте и истории изменений. Модуль вызывает событие смены статуса и при `NOTIFY = Y` передает изменение подсистеме штатных уведомлений.

### Получить статус заказа

Загрузите заказ методом `Bitrix\Sale\Order::load()`. Текущий статус заказа находится в поле заказа `STATUS_ID`. Название статуса можно получить из списка `OrderStatus::getAllStatusesNames()`.

```php
if (!\Bitrix\Main\Loader::includeModule('sale'))
{
    throw new \RuntimeException('Модуль sale не установлен');
}

$order = \Bitrix\Sale\Order::load($orderId);
if (!$order)
{
    throw new \RuntimeException('Заказ не найден');
}

$orderStatusId = (string) $order->getField('STATUS_ID');
$orderStatusNames = \Bitrix\Sale\OrderStatus::getAllStatusesNames(LANGUAGE_ID);
$orderStatusName = $orderStatusNames[$orderStatusId] ?? $orderStatusId;
```

Метод `getAllStatusesNames()` возвращает массив, в котором:

-  ключ — код статуса,

-  значение — название для указанного языка.

Константа `LANGUAGE_ID` содержит код текущего языка. В фоновом сценарии без языкового контекста передайте явный код, например `ru`.

### Получить статус отгрузки

Статусы отгрузок получают из коллекции отгрузок заказа. Системную отгрузку нужно пропустить: она служит для внутреннего учета товаров, которые еще не распределены по обычным отгрузкам.

```php
$deliveryStatusNames = \Bitrix\Sale\DeliveryStatus::getAllStatusesNames(LANGUAGE_ID);
$shipmentStatuses = [];

foreach ($order->getShipmentCollection() as $shipment)
{
    if ($shipment->isSystem())
    {
        continue;
    }

    $statusId = (string) $shipment->getField('STATUS_ID');
    $shipmentStatuses[] = [
        'SHIPMENT_ID' => $shipment->getId(),
        'STATUS_ID' => $statusId,
        'STATUS_NAME' => $deliveryStatusNames[$statusId] ?? $statusId,
    ];
}
```

Результат `$shipmentStatuses` содержит отдельную запись для каждой отгрузки.

### Изменить статус с учетом прав

Права на статусы задают разрешенные исходные и целевые статусы для групп пользователей. Метод `OrderStatus::getAllowedUserStatuses()` возвращает доступные целевые статусы для пользователя и текущего статуса заказа.

Проверяйте переход до вызова `setField()`. Переменная `$userId` содержит идентификатор пользователя, от имени которого выполняется операция. Метод учитывает группы этого пользователя и возвращает разрешенные целевые статусы.

{% note info "" %}

Метод `getAllowedUserStatuses()` проверяет только разрешенный переход между статусами. До загрузки и изменения заказа проверьте, что пользователь может просматривать или изменять этот заказ в текущем сценарии проекта.

{% endnote %}

```php
// $order — ранее загруженный заказ
// $userId — идентификатор пользователя, который выполняет переход
$currentStatusId = (string) $order->getField('STATUS_ID');

// Код статуса, в который нужно перевести заказ
$targetStatusId = 'F';

$allowedStatuses = \Bitrix\Sale\OrderStatus::getAllowedUserStatuses(
    $userId,
    $currentStatusId
);

if (!array_key_exists($targetStatusId, $allowedStatuses))
{
    throw new \RuntimeException('Переход в выбранный статус недоступен');
}

$setResult = $order->setField('STATUS_ID', $targetStatusId);
if (!$setResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $setResult->getErrorMessages()));
}

$saveResult = $order->save();
if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $saveResult->getErrorMessages()));
}
```

После успешного сохранения модуль обновляет дату смены статуса, записывает изменение в историю и вызывает события смены статуса. Для пользователя из группы администраторов или с правом на запись `W` в модуле `sale` метод возвращает статусы соответствующего типа, у которых есть название на текущем языке.

Для отгрузки используйте тот же порядок:

1. Получите разрешенные переходы через `DeliveryStatus`.

2. Измените поле отгрузки.

3. Сохраните заказ.

```php
$shipment = $order->getShipmentCollection()->getItemById($shipmentId);
if (!$shipment || $shipment->isSystem())
{
    throw new \RuntimeException('Отгрузка не найдена');
}

$currentStatusId = (string) $shipment->getField('STATUS_ID');
$targetStatusId = 'DF';

$allowedStatuses = \Bitrix\Sale\DeliveryStatus::getAllowedUserStatuses(
    $userId,
    $currentStatusId
);

if (!array_key_exists($targetStatusId, $allowedStatuses))
{
    throw new \RuntimeException('Переход отгрузки в выбранный статус недоступен');
}

$setResult = $shipment->setField('STATUS_ID', $targetStatusId);
if (!$setResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $setResult->getErrorMessages()));
}

$saveResult = $order->save();
if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $saveResult->getErrorMessages()));
}
```

Не проверяйте доступ к статусу только по наличию записи в `StatusTable`. Наличие статуса и право пользователя перейти в него — разные условия.

### Получить историю изменений заказа

Класс `Bitrix\Sale\OrderHistory` собирает изменения полей и действия над заказом, оплатами и отгрузками. Во время сохранения система записывает изменения в журнал заказа.

Для чтения журнала используйте методы класса классического API — `CSaleOrderChange`.

-  `GetList($arOrder, $arFilter, $arGroupBy, $arNavStartParams, $arSelectFields)` — возвращает записи из текущей таблицы изменений заказа.

   -  `$arOrder` задает сортировку,

   -  `$arFilter` — условия выборки,

   -  `$arGroupBy` — поля группировки или `false` для выборки без группировки,

   -  `$arNavStartParams` — параметры постраничной выборки или `false` для получения всех подходящих записей,

   -  `$arSelectFields` — поля результата.

-  `GetRecordDescription($type, $data)` — преобразует запись в название и текстовое описание.

   -  `$type` содержит тип изменения,

   -  `$data` — сохраненные для него сериализованные данные.

```php
$historyResult = \CSaleOrderChange::GetList(
    ['DATE_CREATE' => 'DESC'],
    ['ORDER_ID' => $orderId],
    false,
    false,
    ['ID', 'DATE_CREATE', 'TYPE', 'DATA', 'USER_ID', 'ENTITY', 'ENTITY_ID']
);

$history = [];

while ($record = $historyResult->Fetch())
{
    $description = \CSaleOrderChange::GetRecordDescription(
        $record['TYPE'],
        $record['DATA']
    );

    $history[] = [
        'ID' => (int) $record['ID'],
        'DATE_CREATE' => $record['DATE_CREATE'],
        'TYPE' => $record['TYPE'],
        'NAME' => $description['NAME'] ?? $record['TYPE'],
        'INFO' => $description['INFO'] ?? '',
        'USER_ID' => (int) $record['USER_ID'],
    ];
}
```

Чтобы получить только смены статусов заказа и отгрузок, добавьте фильтр по типу записи.

```php
$statusHistoryResult = \CSaleOrderChange::GetList(
    ['DATE_CREATE' => 'DESC'],
    [
        'ORDER_ID' => $orderId,
        '@TYPE' => [
            'ORDER_STATUS_CHANGED',
            'SHIPMENT_STATUS_CHANGED',
        ],
    ],
    false,
    false,
    ['ID', 'DATE_CREATE', 'TYPE', 'DATA', 'ENTITY', 'ENTITY_ID']
);
```

Обработайте `$statusHistoryResult` тем же циклом, что и общий журнал. Поле `ENTITY` показывает тип связанного объекта, а `ENTITY_ID` — его идентификатор.

История предназначена для аудита изменений, а не для восстановления текущего состояния объекта. Текущее состояние всегда получайте из загруженного заказа, оплаты или отгрузки.

## Подписаться на события заказа и связанных объектов {#order-events}

Чтобы зарегистрировать обработчик, используйте класс `Bitrix\Main\EventManager`. Размещайте постоянную регистрацию в `/local/php_interface/init.php` или в подключаемом из него файле, чтобы код выполнялся на каждом запросе. Общий механизм регистрации описан в статье [События](./../../framework/events.md).

Основные события передают измененный объект в параметре `ENTITY`.

Для оплаты или отгрузки выбирайте событие по бизнес-смыслу. Например, `OnSaleOrderPaid` сообщает об изменении полной оплаты заказа, а `OnSalePaymentEntitySaved` — о сохранении конкретной оплаты.

Выбирайте событие по моменту жизненного цикла. События изменения поля срабатывают до сохранения. События финального расчета относятся к `Order::doFinalAction()`. События `*EntitySaved` сообщают о сохранении отдельного объекта, а `OnSaleOrderSaved` — о завершении сохранения заказа и связанных коллекций.

#|
|| **Событие** | **Когда вызывается** | **Основные параметры** ||
|| `OnBeforeSaleOrderSetField` | Перед изменением поля заказа. Обработчик может заменить значение или вернуть ошибку и отменить изменение |
-  `ENTITY` — изменяемый заказ `Bitrix\Sale\Order`
-  `NAME` — имя поля
-  `VALUE` — новое значение
||
|| `OnSaleOrderSetField` | Непосредственно перед записью нового значения в объект заказа |
-  `ENTITY` — изменяемый заказ `Bitrix\Sale\Order`
-  `NAME` — имя поля
-  `VALUE` — новое значение
-  `OLD_VALUE` — прежнее значение
||
|| `OnBeforeSaleOrderFinalAction` | Перед расчетом скидок и налогов в `Order::doFinalAction()` |
-  `ENTITY` — рассчитываемый заказ `Bitrix\Sale\Order`
-  `HAS_MEANINGFUL_FIELD` — признак значимых изменений
-  `BASKET` — корзина заказа
||
|| `OnAfterSaleOrderFinalAction` | После завершения финального расчета заказа |
-  `ENTITY` — рассчитанный заказ `Bitrix\Sale\Order`
||
|| `OnSaleOrderBeforeSaved` | При подготовке заказа к сохранению. Обработчик может вернуть ошибку и остановить сохранение |
-  `ENTITY` — заказ `Bitrix\Sale\Order`, который готовится к сохранению
-  `VALUES` — исходные значения полей заказа до текущего сохранения
||
|| `OnSaleOrderEntitySaved` | После сохранения строки самого заказа. Связанные коллекции в этот момент еще могут сохраняться |
-  `ENTITY` — сохраненный объект заказа `Bitrix\Sale\Order`
-  `VALUES` — исходные значения полей заказа
||
|| `OnSaleOrderSaved` | При завершении сохранения заказа |
-  `ENTITY` — сохраненный заказ `Bitrix\Sale\Order`
-  `IS_NEW` — признак создания нового заказа
-  `IS_CHANGED` — признак изменения полей заказа
-  `VALUES` — исходные значения полей заказа до сохранения
||
|| `OnSaleStatusOrderChange` | При успешном сохранении нового статуса заказа |
-  `ENTITY` — заказ `Bitrix\Sale\Order` с новым статусом
-  `VALUE` — код нового статуса
-  `OLD_VALUE` — код предыдущего статуса
||
|| `OnSaleOrderPaid` | При изменении признака полной оплаты заказа. |
-  `ENTITY` — заказ `Bitrix\Sale\Order` с новым состоянием оплаты
||
|| `OnSaleOrderCanceled` | При изменении признака отмены заказа. |
-  `ENTITY` — заказ `Bitrix\Sale\Order` с новым состоянием отмены
||
|| `OnSaleStatusShipmentChange` | При успешном сохранении нового статуса отгрузки. |
-  `ENTITY` — отгрузка `Bitrix\Sale\Shipment` с новым статусом
-  `VALUE` — код нового статуса
-  `OLD_VALUE` — код предыдущего статуса
||
|| `OnSaleShipmentDelivery` | При успешной обработке разрешения доставки, до завершения `Order::save()`. |
-  `ENTITY` — отгрузка `Bitrix\Sale\Shipment`, для которой обработано разрешение доставки
||
|| `OnShipmentDeducted` | При изменении признака списания отгрузки. |
-  `ENTITY` — отгрузка `Bitrix\Sale\Shipment` с новым состоянием списания
-  `VALUES` — исходные значения полей отгрузки до изменения
||
|| `OnSalePaymentEntitySaved` | При завершении сохранения оплаты. |
-  `ENTITY` — сохраненная оплата `Bitrix\Sale\Payment`
-  `VALUES` — исходные значения полей оплаты до сохранения
||
|| `OnSaleShipmentEntitySaved` | При завершении сохранения отгрузки. |
-  `ENTITY` — сохраненная отгрузка `Bitrix\Sale\Shipment`
-  `VALUES` — исходные значения полей отгрузки до сохранения
-  `IS_NEW` — признак создания новой отгрузки
||
|| `OnShipmentTrackingNumberChange` | После сохранения нового непустого идентификатора отправления |
-  `ENTITY` — измененная отгрузка `Bitrix\Sale\Shipment`
-  `VALUES` — исходные значения полей отгрузки
||
|| `OnShipmentAllowDelivery` | После сохранения изменения флага разрешения доставки |
-  `ENTITY` — измененная отгрузка `Bitrix\Sale\Shipment`
-  `VALUES` — исходные значения полей отгрузки
||
|#

Для позиций корзины, оплат, отгрузок, позиций отгрузок и значений свойств существуют аналогичные пары событий `OnBeforeSale...SetField` и `OnSale...SetField`. Обработчик события с префиксом `OnBefore` может вернуть `EventResult::SUCCESS` с параметром `VALUE`, чтобы заменить значение, или `EventResult::ERROR`, чтобы отменить изменение. Событие без префикса `OnBefore` дополнительно получает `OLD_VALUE` и также может заменить `VALUE`, но его результат с ошибкой не отменяет изменение. Проверяйте результат `setField()`, `setValue()` и `setQuantity()`: обработчик события до изменения может отклонить новое значение.

Имена пар для вложенных объектов:

-  позиция корзины — `OnBeforeSaleBasketItemSetField` и `OnSaleBasketItemSetField`,

-  отгрузка — `OnBeforeSaleShipmentSetField` и `OnSaleShipmentSetField`,

-  позиция отгрузки — `OnBeforeSaleShipmentItemSetField` и `OnSaleShipmentItemSetField`,

-  оплата — `OnBeforeSalePaymentSetField` и `OnSalePaymentSetField`,

-  значение свойства — `OnBeforeSalePropertyValueSetField` и `OnSalePropertyValueSetField`.

После записи отдельных объектов вызываются `OnSaleBasketItemEntitySaved`, `OnSaleShipmentEntitySaved`, `OnSaleShipmentItemEntitySaved`, `OnSalePaymentEntitySaved` и `OnSalePropertyValueEntitySaved`. Используйте их, когда обработчику нужен результат сохранения конкретной позиции корзины, отгрузки, позиции отгрузки, оплаты или значения свойства.

При сохранении заказа сначала срабатывают события отдельных записей и коллекций, затем `OnSaleOrderSaved`. После него модуль отправляет отложенные события состояния: смены статуса, полной оплаты, отмены и изменений отгрузки.

Результаты обработчиков `OnSaleOrderSaved` не изменяют результат завершенного сохранения. Отложенные события состояния также не подходят для отмены `Order::save()`. Чтобы запретить сохранение, используйте `OnSaleOrderBeforeSaved` или подходящее событие `OnBefore...SetField`.

### Обработать создание заказа

Для действия после первого полного сохранения заказа используйте `OnSaleOrderSaved` и проверяйте параметр `IS_NEW`. Учитывайте идентификатор заказа во внешней системе или хранилище проекта, чтобы повторный запуск обработчика не создавал дубли.

```php
\Bitrix\Main\EventManager::getInstance()->addEventHandler(
    'sale',
    'OnSaleOrderSaved',
    static function (\Bitrix\Main\Event $event): void
    {
        if (!$event->getParameter('IS_NEW'))
        {
            return;
        }

        /** @var \Bitrix\Sale\Order $order */
        $order = $event->getParameter('ENTITY');

        $orderId = $order->getId();
        $orderPrice = $order->getPrice();

        // Выполните идемпотентное действие для нового заказа
    }
);
```

В событиях смены статуса сравнивайте `VALUE` и `OLD_VALUE`. Параметры позволяют обработчику сравнить статусы без повторной загрузки объекта.

**Пример.** Обработчик выполняет действие только при переходе заказа в статус `F`. Он не меняет заказ и поэтому не запускает повторное сохранение.

```php
\Bitrix\Main\EventManager::getInstance()->addEventHandler(
    'sale',
    'OnSaleStatusOrderChange',
    static function (\Bitrix\Main\Event $event): void
    {
        $newStatusId = (string) $event->getParameter('VALUE');
        $oldStatusId = (string) $event->getParameter('OLD_VALUE');

        if ($newStatusId !== 'F' || $oldStatusId === $newStatusId)
        {
            return;
        }

        /** @var \Bitrix\Sale\Order $order */
        $order = $event->getParameter('ENTITY');

        \Bitrix\Main\Diag\Debug::writeToFile(
            ['ORDER_ID' => $order->getId()],
            'Order status changed',
            '/local/var/log/order-status.log'
        );
    }
);
```

### Обработать полную оплату заказа

Событие `OnSaleOrderPaid` вызывается при установке и при снятии признака полной оплаты. Проверяйте текущее состояние заказа, если действие нужно выполнить только после оплаты.

```php
\Bitrix\Main\EventManager::getInstance()->addEventHandler(
    'sale',
    'OnSaleOrderPaid',
    static function (\Bitrix\Main\Event $event): void
    {
        /** @var \Bitrix\Sale\Order $order */
        $order = $event->getParameter('ENTITY');

        if (!$order->isPaid())
        {
            return;
        }

        \Bitrix\Main\Diag\Debug::writeToFile(
            ['ORDER_ID' => $order->getId()],
            'Order paid',
            '/local/var/log/order-events.log'
        );
    }
);
```

Обработчик получает заказ после изменения его признака полной оплаты. Для реакции на одну конкретную оплату используйте `OnSalePaymentEntitySaved` и получите объект `Bitrix\Sale\Payment` из параметра `ENTITY`.

### Обработать смену статуса отгрузки

Событие `OnSaleStatusShipmentChange` передает новый и прежний коды статуса. Обработчик пропускает повтор значения и записывает изменение для конкретной отгрузки.

```php
\Bitrix\Main\EventManager::getInstance()->addEventHandler(
    'sale',
    'OnSaleStatusShipmentChange',
    static function (\Bitrix\Main\Event $event): void
    {
        $newStatusId = (string) $event->getParameter('VALUE');
        $oldStatusId = (string) $event->getParameter('OLD_VALUE');

        if ($newStatusId === $oldStatusId)
        {
            return;
        }

        /** @var \Bitrix\Sale\Shipment $shipment */
        $shipment = $event->getParameter('ENTITY');

        \Bitrix\Main\Diag\Debug::writeToFile(
            [
                'SHIPMENT_ID' => $shipment->getId(),
                'OLD_STATUS_ID' => $oldStatusId,
                'STATUS_ID' => $newStatusId,
            ],
            'Shipment status changed',
            '/local/var/log/order-events.log'
        );
    }
);
```

### Как не допустить рекурсию в обработчике

{% note warning "" %}

Не вызывайте `$order->save()` из `OnSaleOrderSaved`. В этот момент исходный `save()` еще выполняется, поэтому повторный вызов создает рекурсивное сохранение.

{% endnote %}

Если значение должно попасть в заказ при текущем сохранении, измените объект в `OnSaleOrderBeforeSaved` и не вызывайте `save()` повторно. Проверка текущего значения предотвращает повторное изменение поля.

```php
\Bitrix\Main\EventManager::getInstance()->addEventHandler(
    'sale',
    'OnSaleOrderBeforeSaved',
    static function (\Bitrix\Main\Event $event): \Bitrix\Main\EventResult
    {
        /** @var \Bitrix\Sale\Order $order */
        $order = $event->getParameter('ENTITY');

        if ((string) $order->getField('ADDITIONAL_INFO') === 'export_required')
        {
            return new \Bitrix\Main\EventResult(
                \Bitrix\Main\EventResult::SUCCESS
            );
        }

        $setResult = $order->setField('ADDITIONAL_INFO', 'export_required');
        if (!$setResult->isSuccess())
        {
            return new \Bitrix\Main\EventResult(
                \Bitrix\Main\EventResult::ERROR,
                new \Bitrix\Sale\ResultError(
                    implode('; ', $setResult->getErrorMessages())
                )
            );
        }

        return new \Bitrix\Main\EventResult(
            \Bitrix\Main\EventResult::SUCCESS
        );
    }
);
```

Если действие нужно выполнить только после сохранения, обработчик `OnSaleOrderSaved` должен поставить отдельную задачу в очередь и завершиться без изменения заказа. Отложенный процесс заново загружает заказ и выполняет собственное сохранение. Храните уникальный идентификатор операции в очереди или другом общем хранилище проекта, чтобы повторная постановка задачи не создала дубликат.

Обработчик не должен обходить права на смену статуса. Если он меняет `STATUS_ID`, сначала вызовите `OrderStatus::getAllowedUserStatuses()` или `DeliveryStatus::getAllowedUserStatuses()` для пользователя, от имени которого выполняется операция.

## Как статусы связаны с уведомлениями

Поле `NOTIFY` в `StatusTable` указывает, участвует ли статус в отправке штатного уведомления о смене статуса:

-  `Y` — включает уведомление,

-  `N` отключает.

После сохранения нового статуса модуль формирует событие смены статуса и передает его подсистеме уведомлений.

Не отправляйте то же штатное письмо повторно из события `OnSaleStatusOrderChange`. Пользовательский обработчик нужен для отдельного канала или дополнительного действия: сообщения во внутреннюю систему, постановки задачи или интеграции с внешним сервисом. Шаблоны, получатели и правила отправки относятся к настройке уведомлений, а не к логике переходов между статусами.
