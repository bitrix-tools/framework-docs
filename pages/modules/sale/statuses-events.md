---
title: Статусы и события
description: "Статусы и события. Статусы заказа и отгрузки, права на переходы, история изменений и события модуля sale."
---

Статусы показывают, на каком этапе находятся заказ и его отгрузки. Обработчики событий модуля `sale` выполняют дополнительное действие до и после сохранения, оплаты, отмены или смены статуса.

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

У одного заказа может быть несколько отгрузок, и у каждой отгрузки свой статус. Статус не заменяет другие признаки заказа:

-  Статус отгрузки не означает, что заказ оплачен.

-  Статус заказа не заменяет признаки оплаты, отмены, разрешения доставки и списания товаров.

Оплату меняйте через объект оплаты, отгрузку — через объект отгрузки. Подробнее об отгрузках читайте в статье [Доставка и отгрузки](./delivery-shipments.md), об оплатах — в статье [Оплаты и платежные системы](./payments.md).

## Основные объекты

Для операций со статусом заказа используйте класс `OrderStatus`, для статуса отгрузки — `DeliveryStatus`. Поля статуса, его локализованные название и описание можно получить через ORM-классы `StatusTable` и `StatusLangTable`.

Чтобы создать или изменить статус, используйте сценарии из статьи [Базовые настройки интернет-магазина](./sale-settings.md).

#|
|| **API** | **Роль** ||
|| `Bitrix\Sale\OrderStatus` | Возвращает:

-  статусы заказа,
-  начальный и финальный коды,
-  доступные пользователю переходы и статусы, с которых разрешена оплата
||
|| `Bitrix\Sale\DeliveryStatus` | Возвращает:

-  статусы отгрузки,
-  начальный и финальный коды,
-  доступные пользователю переходы
||
|| `Bitrix\Sale\Internals\StatusTable` | Хранит код, тип, сортировку, признак уведомления, цвет и внешний идентификатор статуса ||
|| `Bitrix\Sale\Internals\StatusLangTable` | Хранит название и описание статуса для конкретного языка ||
|| `CSaleOrderChange` | Читает журнал изменений заказа и формирует описание записи ||
|| `Bitrix\Main\EventManager` | Регистрирует обработчики событий модуля `sale` ||
|#

### Поля статуса {#status-fields}

Класс `StatusTable` хранит данные статусов заказа и отгрузки. Поле `TYPE` разделяет записи. Используйте константы `StatusTable::TYPE_ORDER` и `StatusTable::TYPE_SHIPMENT`, чтобы не передавать значения строками.

#|
|| **Поле** | **Назначение** ||
|| `ID` | Код статуса из одной или двух латинских букв ||
|| `TYPE` | Тип статуса — `O` для заказа или `D` для отгрузки. По умолчанию — статус заказа ||
|| `SORT` | Порядок статуса в списке. Значение по умолчанию — `100` ||
|| `NOTIFY` | Признак штатного уведомления о смене статуса, `Y` или `N`. Значение по умолчанию — `Y` ||
|| `COLOR` | Цвет статуса в интерфейсе ||
|| `XML_ID` | Внешний идентификатор статуса ||
|#

### Получить локализованные статусы {#localized-statuses}

Составной ключ класса `StatusLangTable` образуют код статуса `STATUS_ID` и двухбуквенный код языка `LID`. Поле `NAME` обязательно, поле `DESCRIPTION` содержит необязательное описание.

В `StatusTable` определена ORM-связь `STATUS_LANG` со `StatusLangTable` по коду статуса. Поэтому локализованные поля можно получить через `StatusTable::getList()` по путям `STATUS_LANG.NAME`, `STATUS_LANG.DESCRIPTION` и `STATUS_LANG.LID`.

**Пример.** Код получает статусы заказа с названием и описанием на выбранном языке, сортирует их по `SORT` и собирает массив по коду статуса.

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

Запрос с фильтром по `STATUS_LANG.LID` возвращает только записи выбранного языка. Статусы без перевода на этот язык в выборку не попадут.

## Базовый сценарий

Чтобы сменить статус и обработать смену в событии, выполните действия по порядку:

1. Загрузите заказ.

2. Получите текущий `STATUS_ID` заказа или отгрузки.

3. Запросите разрешенные целевые статусы для пользователя.

4. Проверьте, что нужный статус входит в результат.

5. Измените `STATUS_ID` через объект заказа или отгрузки.

6. Сохраните заказ методом `Order::save()` и проверьте ошибки.

7. Выполните дополнительное действие в подходящем событии и убедитесь, что повторный вызов обработчика не дублирует результат.

После сохранения статуса модуль записывает историю, вызывает события и при `NOTIFY = Y` передает изменение штатным уведомлениям, как описано в разделе [Изменить статус с учетом прав](#change-status).

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

Константа `LANGUAGE_ID` содержит код текущего языка. В фоновом сценарии без языкового контекста передайте код языка строкой, например `ru`.

Метод кеширует названия по типу статуса и не учитывает язык. Повторный вызов с другим кодом языка в том же запросе вернет названия первого языка. Для нескольких языков используйте запрос к `StatusTable::getList()` из раздела [Получить локализованные статусы](#localized-statuses).

### Получить статус отгрузки

Переберите коллекцию отгрузок заказа и прочитайте поле `STATUS_ID` у каждой отгрузки. Пропустите системную отгрузку. Она служит для внутреннего учета товаров, которые еще не распределены по пользовательским отгрузкам.

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

Массив `$shipmentStatuses` содержит отдельную запись для каждой отгрузки.

### Изменить статус с учетом прав {#change-status}

Права на статусы задают разрешенные исходные и целевые статусы для групп пользователей. Метод `OrderStatus::getAllowedUserStatuses()` возвращает доступные целевые статусы для пользователя и текущего статуса заказа. Метод учитывает группы пользователя и возвращает массив, где ключ — код статуса, значение — его название на текущем языке.

Для пользователя из группы администраторов или с уровнем доступа `W` и выше в модуле `sale` метод возвращает все статусы соответствующего типа, у которых есть название на текущем языке.

Язык метод берет из константы `LANGUAGE_ID` и не принимает код языка аргументом. В скрипте без этой константы задайте ее до вызова.

Проверяйте переход до вызова `setField()`. Переменная `$userId` содержит идентификатор пользователя, от имени которого выполняется операция.

{% note info "" %}

Метод `getAllowedUserStatuses()` проверяет только разрешенный переход между статусами. До загрузки и изменения заказа проверьте, что пользователь может просматривать или изменять этот заказ в текущем сценарии проекта.

{% endnote %}

**Пример.** Код проверяет, что пользователь `$userId` может перевести заказ в статус `F`, меняет статус и сохраняет заказ.

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

Вызов `setField('STATUS_ID', ...)` сразу заполняет поле `DATE_STATUS`. Если текущий пользователь `$USER` авторизован, в `EMP_STATUS_ID` попадает его идентификатор, а не `$userId` из примера. После сохранения модуль записывает изменение в историю и вызывает событие `OnSaleStatusOrderChange`. При `NOTIFY = Y` модуль передает изменение подсистеме штатных уведомлений.

Для отгрузки используйте тот же порядок:

1. Получите разрешенные переходы через `DeliveryStatus`.

2. Измените поле отгрузки.

3. Сохраните заказ.

**Пример.** Код переводит отгрузку `$shipmentId` в статус `DF`, если пользователю `$userId` разрешен этот переход, и сохраняет заказ.

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

Право перехода проверяйте методом `getAllowedUserStatuses()`. Запись в `StatusTable` подтверждает только, что статус существует, но не право перейти в него.

Если обработчик события меняет `STATUS_ID`, проверьте переход тем же методом для пользователя, от имени которого выполняется операция.

### Получить историю изменений заказа

Модуль записывает изменения заказа, оплат и отгрузок в журнал при сохранении заказа. Текстовое описание записи формирует только классический API, поэтому в примерах ниже используются методы `CSaleOrderChange`.

-  `GetList($arOrder, $arFilter, $arGroupBy, $arNavStartParams, $arSelectFields)` — возвращает записи журнала изменений заказа.

   -  `$arOrder` — сортировка,

   -  `$arFilter` — условия выборки,

   -  `$arGroupBy` — поля группировки или `false` для выборки без группировки,

   -  `$arNavStartParams` — параметры постраничной выборки или `false` для получения всех подходящих записей,

   -  `$arSelectFields` — поля результата.

-  `GetRecordDescription($type, $data)` — возвращает массив с ключами `NAME` — название и `INFO` — описание записи. Для неизвестного типа метод возвращает `false`.

   -  `$type` — тип изменения,

   -  `$data` — сохраненные для него сериализованные данные.

**Пример.** Код получает журнал изменений заказа `$orderId` от новых записей к старым и добавляет к каждой записи название и описание из `GetRecordDescription()`.

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
    ['ID', 'DATE_CREATE', 'TYPE', 'DATA', 'USER_ID', 'ENTITY', 'ENTITY_ID']
);
```

Обработайте `$statusHistoryResult` тем же циклом, что и общий журнал. Поля записи о связанном объекте:

-  `ENTITY` — тип связанного объекта,

-  `ENTITY_ID` — идентификатор этого объекта.

История предназначена для аудита изменений, а не для восстановления текущего состояния объекта. Текущее состояние всегда получайте из загруженного заказа, оплаты или отгрузки.

## Подписаться на события заказа и связанных объектов {#order-events}

Чтобы зарегистрировать обработчик, используйте класс `Bitrix\Main\EventManager`. Размещайте постоянную регистрацию в `/local/php_interface/init.php` или в подключаемом из него файле, чтобы код выполнялся на каждом запросе. Общий механизм регистрации описан в статье [События](./../../framework/events.md).

Основные события передают измененный объект в параметре `ENTITY`.

Выбирайте событие по моменту жизненного цикла:

-  события изменения поля срабатывают до сохранения,

-  события финального расчета вызывает `Order::doFinalAction(true)`, с аргументом `false` они не срабатывают,

-  события `*EntitySaved` вызываются при сохранении отдельного объекта,

-  `OnSaleOrderSaved` вызывается при завершении сохранения заказа и связанных коллекций.

#|
|| **Событие** | **Когда вызывается** | **Основные параметры** ||
|| `OnBeforeSaleOrderSetField` | При вызове `setField()`, до записи нового значения. Обработчик может заменить значение или вернуть ошибку и отменить изменение |
-  `ENTITY` — изменяемый заказ `Bitrix\Sale\Order`
-  `NAME` — имя поля
-  `VALUE` — новое значение
||
|| `OnSaleOrderSetField` | При изменении поля заказа, непосредственно перед записью нового значения в объект |
-  `ENTITY` — изменяемый заказ `Bitrix\Sale\Order`
-  `NAME` — имя поля
-  `VALUE` — новое значение
-  `OLD_VALUE` — прежнее значение
||
|| `OnBeforeSaleOrderFinalAction` | При вызове `Order::doFinalAction(true)` для заказа с корзиной, до расчета скидок и налогов |
-  `ENTITY` — рассчитываемый заказ `Bitrix\Sale\Order`
-  `BASKET` — корзина заказа
||
|| `OnAfterSaleOrderFinalAction` | При завершении финального расчета заказа |
-  `ENTITY` — рассчитанный заказ `Bitrix\Sale\Order`
||
|| `OnSaleOrderBeforeSaved` | При подготовке заказа к сохранению. Обработчик может вернуть ошибку и остановить сохранение |
-  `ENTITY` — заказ `Bitrix\Sale\Order`, который готовится к сохранению
-  `VALUES` — исходные значения полей заказа до текущего сохранения
||
|| `OnSaleOrderEntitySaved` | При сохранении записи заказа, до сохранения связанных коллекций. Вызывается, только если у заказа есть измененные поля |
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
|| `OnSaleOrderPaid` | При сохранении заказа с измененным признаком полной оплаты |
-  `ENTITY` — заказ `Bitrix\Sale\Order` с новым состоянием оплаты
||
|| `OnSaleOrderCanceled` | При сохранении заказа с измененным признаком отмены |
-  `ENTITY` — заказ `Bitrix\Sale\Order` с новым состоянием отмены
||
|| `OnSaleStatusShipmentChange` | При успешном сохранении нового статуса отгрузки |
-  `ENTITY` — отгрузка `Bitrix\Sale\Shipment` с новым статусом
-  `VALUE` — код нового статуса
-  `OLD_VALUE` — код предыдущего статуса
||
|| `OnSaleShipmentDelivery` | При изменении флага разрешения доставки отгрузки через `setField()` или `allowDelivery()`, до сохранения заказа |
-  `ENTITY` — отгрузка `Bitrix\Sale\Shipment`, для которой обработано разрешение доставки
||
|| `OnShipmentDeducted` | При сохранении отгрузки с измененным признаком списания |
-  `ENTITY` — отгрузка `Bitrix\Sale\Shipment` с новым состоянием списания
-  `VALUES` — исходные значения полей отгрузки до изменения
||
|| `OnSalePaymentEntitySaved` | При завершении сохранения оплаты |
-  `ENTITY` — сохраненная оплата `Bitrix\Sale\Payment`
-  `VALUES` — исходные значения полей оплаты до сохранения
||
|| `OnSaleShipmentEntitySaved` | При сохранении записи отгрузки, до сохранения ее позиций. Вызывается, только если в отгрузке есть изменения |
-  `ENTITY` — сохраненная отгрузка `Bitrix\Sale\Shipment`
-  `VALUES` — исходные значения полей отгрузки до сохранения
-  `IS_NEW` — признак создания новой отгрузки
||
|| `OnShipmentTrackingNumberChange` | При сохранении отгрузки с новым непустым идентификатором отправления |
-  `ENTITY` — измененная отгрузка `Bitrix\Sale\Shipment`
-  `VALUES` — исходные значения полей отгрузки
||
|| `OnShipmentAllowDelivery` | При сохранении отгрузки с измененным флагом разрешения доставки |
-  `ENTITY` — измененная отгрузка `Bitrix\Sale\Shipment`
-  `VALUES` — исходные значения полей отгрузки
||
|#

Для вложенных объектов заказа существуют аналогичные пары событий `OnBeforeSale...SetField` и `OnSale...SetField`. Правила для таких пар:

-  обработчик события с префиксом `OnBefore` может вернуть `EventResult::SUCCESS` с параметром `VALUE`, чтобы заменить значение,

-  тот же обработчик может вернуть `EventResult::ERROR`, чтобы отменить изменение,

-  событие без префикса `OnBefore` дополнительно получает `OLD_VALUE` и также может заменить `VALUE`, но его результат с ошибкой не отменяет изменение.

Проверяйте результат `setField()`, `setValue()` и `setQuantity()`. Обработчик события до изменения может отклонить новое значение.

Имена пар для вложенных объектов:

-  позиция корзины — `OnBeforeSaleBasketItemSetField` и `OnSaleBasketItemSetField`,

-  отгрузка — `OnBeforeSaleShipmentSetField` и `OnSaleShipmentSetField`,

-  позиция отгрузки — `OnBeforeSaleShipmentItemSetField` и `OnSaleShipmentItemSetField`,

-  оплата — `OnBeforeSalePaymentSetField` и `OnSalePaymentSetField`,

-  значение свойства — `OnBeforeSalePropertyValueSetField` и `OnSalePropertyValueSetField`.

После записи отдельных объектов вызываются `OnSaleBasketItemEntitySaved`, `OnSaleShipmentEntitySaved`, `OnSaleShipmentItemEntitySaved`, `OnSalePaymentEntitySaved` и `OnSalePropertyValueEntitySaved`. Используйте их, когда обработчику нужен результат сохранения конкретной позиции корзины, отгрузки, позиции отгрузки, оплаты или значения свойства.

При сохранении заказа события срабатывают в таком порядке.

1. Модуль вызывает `OnSaleOrderEntitySaved` и сохраняет коллекции.

2. Во время сохранения каждой отгрузки срабатывают `OnSaleShipmentEntitySaved` и события смены состояния отгрузки, например `OnSaleStatusShipmentChange`, `OnShipmentAllowDelivery` и `OnShipmentTrackingNumberChange`.

3. Модуль вызывает `OnSaleOrderSaved`.

4. После него модуль отправляет события смены состояния заказа — `OnSaleStatusOrderChange`, `OnSaleOrderPaid` и `OnSaleOrderCanceled`.

Результаты обработчиков `OnSaleOrderSaved` не изменяют результат завершенного сохранения. События смены состояния также не подходят для отмены `Order::save()`. Чтобы запретить сохранение, используйте `OnSaleOrderBeforeSaved` или подходящее событие `OnBefore...SetField`.

Чтобы запретить смену статуса заказа, верните `EventResult::ERROR` из обработчика `OnSaleBeforeStatusOrderChange`. Ошибка из этого обработчика приходит в результат `setField()`. Для отгрузки результат `OnSaleBeforeStatusShipmentChange` не учитывается. Чтобы запретить смену статуса отгрузки, верните `EventResult::ERROR` из обработчика `OnBeforeSaleShipmentSetField`, если параметр `NAME` равен `STATUS_ID`.

### Обработать создание заказа

Для действия после первого полного сохранения заказа используйте `OnSaleOrderSaved` и проверяйте параметр `IS_NEW`. Сохраняйте идентификатор обработанного заказа во внешней системе или хранилище проекта и проверяйте его перед действием, чтобы повторный запуск обработчика не создавал дубли.

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

### Обработать смену статуса заказа

В событиях смены статуса сравнивайте `VALUE` и `OLD_VALUE`. Оба кода приходят в параметрах события, поэтому повторно загружать заказ не нужно.

**Пример.** Обработчик записывает идентификатор заказа в журнал, только когда заказ переходит в статус `F`. Обработчик не меняет заказ и не запускает повторное сохранение. Каталог для журнала должен существовать, путь задается от корня сайта.

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

Событие `OnSaleStatusShipmentChange` передает новый и прежний коды статуса.

**Пример.** Обработчик пропускает событие, если код статуса не изменился, и записывает в журнал идентификатор отгрузки, прежний и новый статусы.

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

### Как не допустить рекурсию в обработчике {#avoid-handler-recursion}

{% note warning "" %}

Не вызывайте `$order->save()` из `OnSaleOrderSaved`. В этот момент исходный `save()` еще выполняется, поэтому повторный вызов создает рекурсивное сохранение. Признак рекурсии — предупреждение `E_USER_WARNING` с текстом «Order saving in recursion».

{% endnote %}

Если значение должно попасть в заказ при текущем сохранении, измените объект в `OnSaleOrderBeforeSaved` и не вызывайте `save()` повторно.

**Пример.** Обработчик записывает в поле `ADDITIONAL_INFO` значение `export_required`, если его там еще нет, и возвращает ошибку, если `setField()` не принял значение. Проверка текущего значения предотвращает повторное изменение поля.

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

Если действие нужно выполнить только после сохранения, в обработчике `OnSaleOrderSaved` поставьте отдельную задачу в очередь, например агент модуля `main`, и завершите обработчик, не меняя заказ. В отложенном процессе заново загрузите заказ и сохраните его. Храните уникальный идентификатор операции в очереди или другом общем хранилище проекта, чтобы повторная постановка задачи не создала дубликат.

## Как статусы связаны с уведомлениями {#statuses-notifications}

Поле `NOTIFY` в `StatusTable` указывает, участвует ли статус в отправке штатного уведомления о смене статуса:

-  `Y` — включает уведомление,

-  `N` — отключает уведомление.

Для отдельного канала или дополнительного действия используйте обработчик `OnSaleStatusOrderChange`, например для сообщения во внутреннюю систему, постановки задачи или интеграции с внешним сервисом. Штатное письмо из этого обработчика повторно не отправляйте. Шаблоны, получатели и правила отправки настраивают в уведомлениях. Подробнее — в статье [Уведомления по заказам](./order-notifications.md).

## Продолжить изучение

-  [Уведомления по заказам](./order-notifications.md)

-  [Права доступа и ограничения](./permissions.md)

-  [Изменение и чтение заказа](./order-update.md)
