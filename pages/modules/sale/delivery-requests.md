---
title: Транспортные заявки
description: "Заявки в службы доставки. API-сценарии для отправки отгрузок в транспортные службы и контроля состояния заявки."
---

Если сохраненную отгрузку заказа должна выполнить внешняя транспортная служба, создайте транспортную заявку. Заявка передает в службу одну или несколько отгрузок. До создания заявки укажите в отгрузке службу доставки, состав товаров, стоимость и нужные свойства.

Отгрузка и транспортная заявка хранят разные данные.

-  Отгрузка хранит данные о доставке внутри заказа: товары, службу доставки, стоимость, статус, трек-номер и документы доставки.

-  Транспортная заявка хранит результат внешней операции: идентификатор транспортной заявки во внешней системе, внешний статус, связь с отгрузками и ошибки по отдельным отгрузкам.

Создание отгрузки, выбор службы доставки и расчет стоимости описаны в статье [Доставка и отгрузки](./delivery-shipments.md).

## Объекты для работы с транспортными заявками

#|
|| **Объект** | **Роль в сценарии** ||
|| `Bitrix\Sale\Shipment` | Хранит отгрузку заказа, которую нужно передать во внешнюю транспортную службу. Через отгрузку обработчик получает заказ, состав товаров, вес, стоимость, адресные свойства и выбранную службу доставки ||
|| `Bitrix\Sale\Delivery\Services\Manager` | Возвращает объект службы доставки по идентификатору. Через службу доставки `Requests\Manager` получает обработчик транспортной заявки ||
|| `Bitrix\Sale\Delivery\Requests\Manager` | Создает транспортную заявку, добавляет и удаляет отгрузки, обновляет данные отгрузок из внешней службы, выполняет действия обработчика и сохраняет связь транспортной заявки с отгрузками ||
|| `Bitrix\Sale\Delivery\Requests\HandlerBase` | Базовый класс обработчика транспортных заявок. Конкретная служба доставки переопределяет методы для операций, которые поддерживает внешний сервис ||
|| `Bitrix\Sale\Delivery\Requests\Result` | Общий результат операции транспортной заявки. Содержит ошибки, сообщения и вложенные результаты транспортных заявок или отгрузок ||
|| `Bitrix\Sale\Delivery\Requests\RequestResult` | Результат одной транспортной заявки. Хранит внешний идентификатор транспортной заявки и после успешного сохранения — внутренний идентификатор записи ||
|| `Bitrix\Sale\Delivery\Requests\ShipmentResult` | Результат обработки одной отгрузки внутри транспортной заявки. Хранит идентификатор отгрузки, внешний идентификатор отправления, трек-номер, номер и дату документа доставки ||
|| `Bitrix\Sale\Delivery\Requests\RequestTable` | ORM-таблица транспортных заявок. Используйте для чтения сохраненных транспортных заявок, статуса и внешних свойств ||
|| `Bitrix\Sale\Delivery\Requests\ShipmentTable` | ORM-таблица связи транспортной заявки с отгрузками, внешним идентификатором отправления и текстом ошибки по отгрузке ||
|#

## Как работает транспортная заявка

Транспортную заявку создает менеджер заявок `Bitrix\Sale\Delivery\Requests\Manager`. Он получает службу доставки по идентификатору, запрашивает у нее обработчик заявок и передает обработчику список отгрузок.

Обработчик заявок — это объект класса-наследника `Bitrix\Sale\Delivery\Requests\HandlerBase`. Он знает правила конкретной транспортной службы: какие данные отправить во внешний сервис, можно ли объединять несколько отгрузок и какие документы или трек-номера вернуть после отправки.

Ответ обработчика возвращается через объекты результата.

-  `Requests\Result` хранит общий результат вызова: ошибки верхнего уровня, сообщения и вложенные результаты.

-  `RequestResult` описывает одну созданную заявку. Обработчик передает в результате внешний идентификатор заявки, а `Requests\Manager` после сохранения записывает внутренний идентификатор.

-  `ShipmentResult` описывает результат по одной отгрузке. Обработчик передает в нем идентификатор отгрузки, внешний идентификатор отправления, трек-номер, номер и дату документа доставки.

### Как менеджер создает заявку

Метод `Requests\Manager::createDeliveryRequest()` выполняет такой сценарий:

1. Получает обработчик заявок у службы доставки. Если служба доставки не поддерживает заявки, метод возвращает `Requests\Result` с ошибкой.

2. Проверяет идентификаторы отгрузок. Каждый идентификатор должен быть положительным числом, отгрузка должна существовать и не должна входить в другую заявку.

3. Передает обработчику идентификаторы отгрузок и дополнительные данные через `HandlerBase::create($shipmentIds, $additional)`. На этом шаге обработчик обращается во внешнюю транспортную службу.

4. Читает ответ обработчика из `Requests\Result`. Если обработчик создал общую заявку, он возвращает `RequestResult`. Если результат относится к отдельной отгрузке, обработчик возвращает `ShipmentResult`.

5. Сохраняет успешную заявку в `RequestTable`. Запись получает внутренний идентификатор, идентификатор службы доставки, внешний идентификатор и статус `STATUS_SENT`.

6. Сохраняет связь успешных отгрузок с заявкой в `ShipmentTable`. Если по отгрузке пришла ошибка, менеджер сохраняет текст ошибки в этой же таблице.

7. Обновляет данные отгрузки, если обработчик вернул их в `ShipmentResult`. Менеджер записывает в отгрузку трек-номер, номер и дату документа доставки, затем сохраняет заказ.

Одна заявка может содержать одну отгрузку или несколько отгрузок. Несколько отгрузок объединяют, когда обработчик службы доставки поддерживает групповую передачу отправлений в одну внешнюю транспортную заявку. Например, менеджер выбирает несколько отгрузок одной службы доставки и отправляет их одной операцией.

Нельзя добавить отгрузку в новую заявку, если она уже связана с другой транспортной заявкой. Для такой отгрузки `Requests\Manager` вернет `ShipmentResult` с ошибкой.

## Что зависит от обработчика службы доставки

Менеджер `Requests\Manager` задает общий жизненный цикл транспортной заявки, но не формирует HTTP-запрос во внешнюю службу. Конкретный обработчик определяет:

-  какие отгрузки можно объединить в одну заявку,

-  какие поля нужны в `$additional`,

-  какие действия доступны для заявки и отгрузки,

-  как создается, обновляется, отменяется или удаляется заявка во внешней системе,

-  какие внешние статусы и свойства возвращает транспортная служба,

-  какие документы, файлы, трек-номера и внешние идентификаторы можно получить,

-  поддерживается ли callback-трекинг через `hasCallbackTrackingSupport()`.

Если обработчик не переопределяет нужный метод базового класса `HandlerBase`, базовая реализация возвращает результат с ошибкой о неподдерживаемой операции. Проверяйте поддержку действия перед вызовом: службы доставки могут поддерживать разный набор операций, например создание групповых заявок, обновление отправлений или печать документов.

## Что подготовить для работы с транспортными заявками

Для выполнения сценариев заранее подготовьте данные магазина и объекты заказа:

-  объект `$order` — загруженный заказ с сохраненной пользовательской отгрузкой,

-  идентификатор отгрузки `$shipmentId` или массив идентификаторов `$shipmentIds`, если заявка создается по нескольким отгрузкам,

-  идентификатор службы доставки `$deliveryId`, если он не берется из отгрузки,

-  свойства заказа, адрес, контактные данные, вес, стоимость, дополнительные услуги и склад, если их требует обработчик службы доставки,

-  дополнительные данные `$additional`, если обработчик возвращает поля через `Requests\Manager::getDeliveryRequestFormFields()`.

Отгрузка должна быть сохранена в заказе, иметь положительный идентификатор и службу доставки. Системную отгрузку без доставки не передавайте в транспортные заявки.

Конкретный набор данных зависит от обработчика. `Requests\Manager` проверяет только общие условия: существование отгрузок, связь с заявкой и наличие обработчика у службы доставки.

## Создать транспортную заявку

Заявку можно создать для одной или нескольких отгрузок. Если обработчику нужны дополнительные данные, получите описание полей и передайте их значения в `$additional`.

### По одной отгрузке

Получите отгрузку, проверьте службу доставки и передайте идентификатор отгрузки в метод создания заявки `createDeliveryRequest()`.

```php
if (!\Bitrix\Main\Loader::includeModule('sale'))
{
    throw new \RuntimeException('Не удалось подключить модуль sale');
}

// $order — загруженный заказ
// $shipmentId — идентификатор сохраненной отгрузки
$shipment = $order->getShipmentCollection()->getItemById($shipmentId);
if (!$shipment)
{
    throw new \RuntimeException('Отгрузка не найдена');
}

$deliveryId = (int)$shipment->getDeliveryId();
$delivery = \Bitrix\Sale\Delivery\Services\Manager::getObjectById($deliveryId);
if (!$delivery)
{
    throw new \RuntimeException('Служба доставки не найдена');
}

if (!$delivery->getDeliveryRequestHandler())
{
    throw new \RuntimeException('Служба доставки не поддерживает транспортные заявки');
}

$result = \Bitrix\Sale\Delivery\Requests\Manager::createDeliveryRequest(
    $deliveryId,
    [$shipment->getId()]
);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

foreach ($result->getRequestResults() as $requestResult)
{
    echo 'Транспортная заявка: ' . $requestResult->getInternalId();
    echo 'Внешний номер: ' . $requestResult->getExternalId();
}
```

После успешного вызова модуль создаст запись заявки и связь с отгрузкой. Если обработчик вернул трек-номер или документ доставки в `ShipmentResult`, `Requests\Manager` запишет эти данные в отгрузку и сохранит заказ.

### По нескольким отгрузкам

В одну заявку передавайте только отгрузки одной службы доставки. Обработчик определяет, можно ли передать несколько отправлений в одной транспортной заявке.

```php
// $shipmentIds — идентификаторы сохраненных отгрузок одной службы доставки
$shipmentIds = [1024, 1025, 1026];
$deliveryId = 7;

$delivery = \Bitrix\Sale\Delivery\Services\Manager::getObjectById($deliveryId);
if (!$delivery || !$delivery->getDeliveryRequestHandler())
{
    throw new \RuntimeException('Служба доставки не поддерживает транспортные заявки');
}

$result = \Bitrix\Sale\Delivery\Requests\Manager::createDeliveryRequest(
    $deliveryId,
    $shipmentIds
);

foreach ($result->getShipmentResults() as $shipmentResult)
{
    if (!$shipmentResult->isSuccess())
    {
        echo 'Отгрузка ' . $shipmentResult->getInternalId() . ': ';
        echo implode('; ', $shipmentResult->getErrorMessages());
    }
}

foreach ($result->getRequestResults() as $requestResult)
{
    if (!$requestResult->isSuccess())
    {
        echo implode('; ', $requestResult->getErrorMessages());
        continue;
    }

    foreach ($requestResult->getShipmentResults() as $shipmentResult)
    {
        if ($shipmentResult->isSuccess())
        {
            echo 'Отгрузка ' . $shipmentResult->getInternalId();
            echo ' добавлена в заявку ' . $requestResult->getInternalId();
        }
    }
}

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

`Requests\Manager` может вернуть ошибки верхнего уровня и ошибки по отдельным отгрузкам. Сначала разберите вложенные результаты, чтобы не потерять частично успешные операции.

### Передать дополнительные данные обработчику

Некоторые службы доставки требуют передать дополнительные поля перед созданием заявки: дату забора, интервал, комментарий, тип упаковки или внутренние параметры интеграции. Набор полей определяет обработчик.

Чтобы получить описание полей, вызовите `getDeliveryRequestFormFields()`. Для создания заявки используйте тип `FORM_FIELDS_TYPE_CREATE`.

```php
$fields = \Bitrix\Sale\Delivery\Requests\Manager::getDeliveryRequestFormFields(
    $deliveryId,
    \Bitrix\Sale\Delivery\Requests\Manager::FORM_FIELDS_TYPE_CREATE,
    $shipmentIds
);

foreach ($fields as $name => $field)
{
    echo $name . ': ' . $field['TITLE'];
}
```

Значения этих полей передайте третьим параметром в `createDeliveryRequest()`.

В рабочем сценарии значения `$additional` получают из формы. Приложение или административный интерфейс строит ее по результату `getDeliveryRequestFormFields()`.

**Пример.** Собранный массив значений:

```php
$additional = [
    $pickupDateFieldCode => '2026-07-10',
    $pickupIntervalFieldCode => '10:00-14:00',
    $commentFieldCode => 'Позвонить за час до приезда курьера',
];

$result = \Bitrix\Sale\Delivery\Requests\Manager::createDeliveryRequest(
    $deliveryId,
    $shipmentIds,
    $additional
);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Модуль не задает единый формат массива `$additional`. В примере переменные `$pickupDateFieldCode`, `$pickupIntervalFieldCode` и `$commentFieldCode` содержат коды полей, которые вернул обработчик этой службы доставки.

## Изменить состав транспортной заявки

Для изменения состава передайте в `$requestId` идентификатор уже созданной заявки. Обработчик службы доставки должен поддерживать добавление и удаление отгрузок.

### Добавить отгрузку

Если служба доставки поддерживает добавление отправлений в существующую заявку, используйте метод `addShipmentsToDeliveryRequest()`.

```php
$result = \Bitrix\Sale\Delivery\Requests\Manager::addShipmentsToDeliveryRequest(
    $requestId,
    [$shipmentId]
);

foreach ($result->getShipmentResults() as $shipmentResult)
{
    if (!$shipmentResult->isSuccess())
    {
        echo 'Отгрузка ' . $shipmentResult->getInternalId() . ': ';
        echo implode('; ', $shipmentResult->getErrorMessages());
    }
}

foreach ($result->getRequestResults() as $requestResult)
{
    if (!$requestResult->isSuccess())
    {
        echo implode('; ', $requestResult->getErrorMessages());
        continue;
    }

    foreach ($requestResult->getShipmentResults() as $shipmentResult)
    {
        if ($shipmentResult->isSuccess())
        {
            echo 'Отгрузка добавлена: ' . $shipmentResult->getInternalId();
        }
    }
}

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Метод проверяет, что заявка существует, отгрузка еще не входит в другую транспортную заявку и обработчик поддерживает операцию.

`Requests\Manager` может вернуть ошибки верхнего уровня и ошибки по отдельным отгрузкам. Сначала разберите вложенные результаты. Если обработчик не переопределил `HandlerBase::addShipments()`, метод вернет результат с ошибкой.

### Удалить отгрузку

Чтобы убрать одну или несколько отгрузок из заявки, вызовите метод `deleteShipmentsFromDeliveryRequest()`.

```php
$result = \Bitrix\Sale\Delivery\Requests\Manager::deleteShipmentsFromDeliveryRequest(
    $requestId,
    [$shipmentId]
);

foreach ($result->getShipmentResults() as $shipmentResult)
{
    if (!$shipmentResult->isSuccess())
    {
        echo 'Отгрузка ' . $shipmentResult->getInternalId() . ': ';
        echo implode('; ', $shipmentResult->getErrorMessages());
    }
}

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

После вызова метод последовательно выполняет четыре шага.

1. Вызывает обработчик службы доставки.

2. Удаляет локальную связь и снимает маркер изменения только для отгрузки, по которой обработчик вернул успешный `ShipmentResult`.

3. Возвращает ошибку, если обработчик вернул успешный результат без вложенных результатов отгрузок: `Requests\Manager` не сможет определить, какие связи нужно удалить.

4. Удаляет запись заявки, если в ней не осталось отгрузок.

## Получить транспортную заявку и связанные отгрузки

Для чтения сохраненной транспортной заявки используйте `RequestTable`. В таблице хранятся внутренний идентификатор, дата, служба доставки, статус, внешний идентификатор и внешний статус.

```php
$request = \Bitrix\Sale\Delivery\Requests\RequestTable::getList([
    'select' => [
        'ID',
        'DATE',
        'DELIVERY_ID',
        'STATUS',
        'EXTERNAL_ID',
        'EXTERNAL_STATUS',
        'EXTERNAL_STATUS_SEMANTIC',
        'EXTERNAL_PROPERTIES',
    ],
    'filter' => [
        '=ID' => $requestId,
    ],
    'limit' => 1,
])->fetch();

if (!$request)
{
    throw new \RuntimeException('Транспортная заявка не найдена');
}
```

Связанные отгрузки хранит `ShipmentTable`.

```php
$requestShipments = \Bitrix\Sale\Delivery\Requests\ShipmentTable::getList([
    'select' => [
        'SHIPMENT_ID',
        'REQUEST_ID',
        'EXTERNAL_ID',
        'ERROR_DESCRIPTION',
    ],
    'filter' => [
        '=REQUEST_ID' => $requestId,
    ],
])->fetchAll();
```

Чтобы быстро узнать заявку по отгрузке, используйте `Requests\Manager::getRequestIdByShipmentId()`.

```php
$requestId = \Bitrix\Sale\Delivery\Requests\Manager::getRequestIdByShipmentId($shipmentId);

if ($requestId > 0)
{
    echo 'Отгрузка уже входит в заявку ' . $requestId;
}
```

Если отгрузка не связана с заявкой, метод возвращает пустое значение, которое при приведении к числу равно `0`.

## Обновить данные отгрузки из транспортной заявки

Если данные отправления изменились во внешней службе, вызовите метод `updateShipmentsFromDeliveryRequest()`.

Обработчик службы доставки получает актуальные данные и возвращает `ShipmentResult`. После успешного обновления `Requests\Manager` сохраняет данные в отгрузку. Список результатов отгрузок доступен через `getResults()`.

```php
$result = \Bitrix\Sale\Delivery\Requests\Manager::updateShipmentsFromDeliveryRequest(
    $requestId,
    [$shipmentId]
);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

foreach ($result->getResults() as $shipmentResult)
{
    if (!$shipmentResult->isSuccess())
    {
        echo implode('; ', $shipmentResult->getErrorMessages());
        continue;
    }

    echo 'Трек-номер: ' . $shipmentResult->getTrackingNumber();
    echo 'Документ доставки: ' . $shipmentResult->getDeliveryDocNum();
}
```

При успешном результате `Requests\Manager` сохраняет в отгрузку поля:

-  `TRACKING_NUMBER` — трек-номер,

-  `DELIVERY_DOC_NUM` — номер документа доставки,

-  `DELIVERY_DOC_DATE` — дата документа доставки.

Если отгрузка уже входит в заявку и разработчик меняет ее вручную, модуль добавляет маркер `DELIVERY_REQUEST_NOT_UPDATED`. Он показывает, что локальная отгрузка изменилась и данные заявки могут требовать обновления во внешней службе.

## Выполнить действие обработчика

Действия зависят от конкретной службы доставки. Обработчик может поддерживать отмену заявки, печать документов, повторную отправку, получение статуса или другие операции.

Сначала получите список действий.

```php
$actions = \Bitrix\Sale\Delivery\Requests\Manager::getDeliveryRequestActions($requestId);

foreach ($actions as $actionCode => $actionName)
{
    echo $actionCode . ': ' . $actionName;
}
```

Затем выполните нужное действие.

```php
$actionCode = \Bitrix\Sale\Delivery\Requests\HandlerBase::CANCEL_ACTION_CODE;

$result = \Bitrix\Sale\Delivery\Requests\Manager::executeDeliveryRequestAction(
    $requestId,
    $actionCode
);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Если действию нужны дополнительные поля, получите их через `getDeliveryRequestFormFields()` с типом `FORM_FIELDS_TYPE_ACTION`. Передайте значения третьим параметром в `executeDeliveryRequestAction()`.

Для формы действия обработчику может понадобиться код действия в `$additional`. В сценарии административного интерфейса модуль передает его в поле `ACTION_TYPE`.

```php
$additional = [
    'ACTION_TYPE' => $actionCode,
    'REASON' => 'Покупатель отменил заказ',
];

$result = \Bitrix\Sale\Delivery\Requests\Manager::executeDeliveryRequestAction(
    $requestId,
    $actionCode,
    $additional
);
```

Для действия над конкретной отгрузкой используйте `executeDeliveryRequestShipmentAction()`.

**Пример.** Вызов действия над отгрузкой с условным кодом `PRINT_LABEL`:

```php
$result = \Bitrix\Sale\Delivery\Requests\Manager::executeDeliveryRequestShipmentAction(
    $requestId,
    $shipmentId,
    'PRINT_LABEL'
);
```

Реальные коды действий возвращает обработчик в `getDeliveryRequestShipmentActions()`.

## Обработать ошибку внешней службы

Ошибки могут быть общими для заявки или относиться к конкретной отгрузке. Общие ошибки возвращает сам `Requests\Result`, а ошибки отгрузок — вложенные `ShipmentResult`.

```php
$result = \Bitrix\Sale\Delivery\Requests\Manager::createDeliveryRequest(
    $deliveryId,
    $shipmentIds,
    $additional
);

if (!$result->isSuccess())
{
    foreach ($result->getErrorMessages() as $message)
    {
        echo 'Ошибка заявки: ' . $message;
    }
}

foreach ($result->getShipmentResults() as $shipmentResult)
{
    if ($shipmentResult->isSuccess())
    {
        continue;
    }

    echo 'Отгрузка ' . $shipmentResult->getInternalId() . ': ';
    echo implode('; ', $shipmentResult->getErrorMessages());
}

foreach ($result->getRequestResults() as $requestResult)
{
    foreach ($requestResult->getShipmentResults() as $shipmentResult)
    {
        if (!$shipmentResult->isSuccess())
        {
            echo 'Отгрузка ' . $shipmentResult->getInternalId() . ': ';
            echo implode('; ', $shipmentResult->getErrorMessages());
        }
    }
}
```

Если `ShipmentResult` содержит ошибку, `Requests\Manager` сохраняет ее текст в `ShipmentTable::ERROR_DESCRIPTION` для этой отгрузки. Это помогает показать причину отказа рядом с отгрузкой и не терять ответ внешней службы.

## Удалить транспортную заявку

Чтобы удалить заявку целиком, используйте метод `deleteDeliveryRequest()`.

```php
$result = \Bitrix\Sale\Delivery\Requests\Manager::deleteDeliveryRequest($requestId);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Удаление зависит от обработчика. Метод `deleteDeliveryRequest()` вызывает обработчик, только если нашел транспортную заявку и ее служба доставки поддерживает транспортные заявки.

Если обработчик не найден, метод удаляет локальные связи и запись заявки без внешнего запроса.

## Статусы и внешние свойства транспортной заявки

У заявки есть внутренний статус `STATUS`. Допустимые значения статуса заданы константами класса `Requests\Manager`.

#|
|| **Константа** | **Значение** | **Когда используется** ||
|| `STATUS_PREPARED` | `0` | Этап до отправки заявки во внешнюю службу. Используйте, если такой этап поддерживает обработчик или проектная интеграция ||
|| `STATUS_SENT` | `10` | Отправленная заявка. Этот статус `Requests\Manager` ставит при успешном создании транспортной заявки ||
|| `STATUS_PROCESSED` | `20` | Этап после обработки заявки внешней службой. Используйте, если такой этап поддерживает обработчик или проектная интеграция ||
|#

При создании заявки `Requests\Manager` сам устанавливает только `STATUS_SENT`. Другие статусы устанавливает обработчик или код интеграции через `updateDeliveryRequest()`.

Внешняя служба может вернуть собственный статус. Для него в `RequestTable` есть поля:

-  `EXTERNAL_STATUS` — строковый статус внешней системы,

-  `EXTERNAL_STATUS_SEMANTIC` — семантика внешнего статуса: `success` или `process`,

-  `EXTERNAL_PROPERTIES` — массив дополнительных внешних свойств заявки.

Чтобы обновить эти поля через код, используйте метод `updateDeliveryRequest()`.

```php
$result = \Bitrix\Sale\Delivery\Requests\Manager::updateDeliveryRequest(
    $requestId,
    [
        'STATUS' => \Bitrix\Sale\Delivery\Requests\Manager::STATUS_PROCESSED,
        'EXTERNAL_STATUS' => 'accepted',
        'EXTERNAL_STATUS_SEMANTIC' => \Bitrix\Sale\Delivery\Requests\Manager::EXTERNAL_STATUS_SEMANTIC_SUCCESS,
        'EXTERNAL_PROPERTIES' => [
            [
                'NAME' => 'COURIER',
                'VALUE' => 'Иван Петров',
            ],
        ],
    ]
);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

По умолчанию `updateDeliveryRequest()` объединяет новые `EXTERNAL_PROPERTIES` с существующими по ключу `NAME`. Чтобы заменить массив свойств полностью, передайте третьим параметром `true`.

## События транспортных заявок

Для отдельных операций `Requests\Manager` отправляет события модуля `sale`. Используйте их, если нужно синхронизировать заявку с внешней системой, записать данные в журнал или уведомить менеджера.

#|
|| **Событие** | **Условие** | **Основные данные** ||
|| `OnDeliveryRequestCreated` | При попытке создать заявку | `DELIVERY_ID`, `SHIPMENT_IDS`, `ADDITIONAL`, `RESULT` ||
|| `OnDeliveryRequestDeleted` | При удалении заявки | `REQUEST_ID`, `SHIPMENT_IDS`, `RESULT` ||
|| `OnDeliveryRequestUpdated` | При обновлении полей заявки | `REQUEST_ID`, `FIELDS`, `RESULT` ||
|| `OnDeliveryRequestActionExecuted` | При выполнении действия над заявкой | `REQUEST_ID`, `ACTION_TYPE`, `ADDITIONAL`, `RESULT`, `DELIVERY_REQUEST_HANDLER` ||
|| `OnDeliveryRequestMessageReceived` | При отправке сообщения через `Requests\Manager::sendMessage()` | `ADDRESSEE`, `REQUEST_ID`, `SHIPMENT_ID`, `MESSAGE` ||
|#

В колонке «Основные данные» перечислены параметры, доступные обработчику события:

-  `REQUEST_ID` — идентификатор заявки,

-  `SHIPMENT_ID` — идентификатор отгрузки,

-  `SHIPMENT_IDS` — массив идентификаторов отгрузок,

-  `DELIVERY_ID` — идентификатор службы доставки,

-  `ACTION_TYPE` — код действия,

-  `ADDITIONAL` — переданные методу дополнительные данные,

-  `FIELDS` — обновленные поля заявки,

-  `RESULT` — результат операции,

-  `ADDRESSEE` — получатель сообщения,

-  `MESSAGE` — текст сообщения.

События передают результат операции, но не заменяют проверку возвращаемого `Result` в вызывающем коде.

В `OnDeliveryRequestUpdated` параметр `FIELDS` содержит итоговые поля, которые сохраняет менеджер. Например, если `updateDeliveryRequest()` объединяет новые `EXTERNAL_PROPERTIES` с существующими свойствами, в событие попадет объединенный массив.

Метод `Requests\Manager::sendMessage()` только отправляет событие `OnDeliveryRequestMessageReceived`. Метод не сохраняет сообщение в заявке или заказе. Чтобы записать сообщение в журнал, уведомить менеджера или изменить заказ, добавьте обработчик события.

**Пример.** Обработчик события создания заявки проверяет результат и записывает ошибки в журнал:

```php
\Bitrix\Main\EventManager::getInstance()->addEventHandler(
    'sale',
    \Bitrix\Sale\Delivery\Requests\Manager::REQUEST_CREATED_EVENT_CODE,
    static function (\Bitrix\Main\Event $event)
    {
        /** @var \Bitrix\Sale\Delivery\Requests\Result $result */
        $result = $event->getParameter('RESULT');

        if (!$result->isSuccess())
        {
            AddMessage2Log(
                implode('; ', $result->getErrorMessages()),
                'sale_delivery_request'
            );
        }
    }
);
```

Подписывайтесь только на события, которые нужны интеграции, и проверяйте `Result` после прямого вызова метода.
