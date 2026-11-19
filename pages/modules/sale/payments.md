---
title: Оплаты и платежные системы
description: "Оплаты и платежные системы. Создание оплат, выбор платежной системы, обработчики, возвраты, ограничения и разделение оплаты."
---

В модуле Интернет-магазин объект оплаты хранит данные о платеже, а платежная система определяет способ его проведения. Через API разработчик создает оплату в заказе и выбирает платежную систему. Затем разработчик может запустить платежный сценарий, обработать ответ платежного сервиса или выполнить возврат. Оплату можно связать с компанией, а по данным оплаты — подобрать кассу для чека.

## Основные объекты

Для работы с оплатой используйте объекты заказа, менеджер и сервис платежных систем, а также менеджеры связанных подсистем.

### Оплата заказа

#|
|| **Объект** | **Роль в сценарии** ||
|| `Bitrix\Sale\PaymentCollection` | Хранит оплаты заказа, создает новые оплаты, считает оплаченную сумму и передает изменения в заказ ||
|| `Bitrix\Sale\Payment` | Хранит сумму, валюту, платежную систему, статус оплаты, данные платежного сервиса, компанию, возврат и служебные поля одной оплаты ||
|#

Оплата всегда принадлежит заказу. После изменений вызывайте `Order::save()`, чтобы заказ согласованно сохранил корзину, оплаты, отгрузки и статусы и вызвал события. Не сохраняйте `Payment` или `PaymentCollection` отдельно.

### Платежная система

Платежным сервисом в статье называется внешний провайдер оплаты.

#|
|| **Объект** | **Роль в сценарии** ||
|| `Bitrix\Sale\PaySystem\Manager` | Возвращает платежные системы, проверяет их ограничения и создает объекты сервиса для работы с обработчиками ||
|| `Bitrix\Sale\PaySystem\Service` | Сервис платежной системы — объект настроенной платежной системы в коде. Запускает оплату, обработку ответа и возврат, сохраняет данные платежного сервиса в оплату ||
|| `Bitrix\Sale\PaySystem\ServiceHandler` | Базовый класс автоматизированного обработчика платежной системы. Наследник реализует сценарий оплаты и обработку ответа платежного сервиса ||
|| `Bitrix\Sale\PaySystem\BaseServiceHandler` | Базовый класс обработчика. Выводит шаблон и работает с бизнес-значениями ||
|| `Bitrix\Sale\PaySystem\ServiceResult` | Результат работы платежной системы. Содержит ошибки, данные для полей оплаты, HTML-шаблон, ссылку на оплату, QR-код и тип операции ||
|| `Bitrix\Sale\Services\PaySystem\Restrictions\Manager` | Регистрирует и проверяет ограничения платежных систем для оплаты ||
|#

{% note warning "" %}

Классы классического API платежных систем `CSalePaySystem`, `CSalePaySystemAction`, `CSalePaySystemsHelper`, `CSalePaySystemTarif` и `CSaleDelivery2PaySystem` могут встречаться в старых проектах. Классы `CSalePaySystem` и `CSalePaySystemAction` устарели.

В новых сценариях работайте с платежными системами через `Bitrix\Sale\PaySystem\Manager`. Обработчики создавайте как наследников `Bitrix\Sale\PaySystem\ServiceHandler` или `Bitrix\Sale\PaySystem\BaseServiceHandler`.

{% endnote %}

### Связанные подсистемы

#|
|| **Объект** | **Роль в сценарии** ||
|| `Bitrix\Sale\Services\Company\Manager` | Подбирает компанию для оплаты с учетом правил компании ||
|| `Bitrix\Sale\Cashbox\Manager` | Подбирает кассу для чека с учетом ограничений кассы, платежной системы и компании ||
|#

## Базовый сценарий

Чтобы оформить оплату, выполните шаги по порядку.

1. Загрузите или создайте заказ, как описано в статьях [Создание заказа](./order-create.md) и [Изменение и чтение заказа](./order-update.md).

2. Получите коллекцию оплат через `$order->getPaymentCollection()`.

3. Создайте оплату через `PaymentCollection::createItem()`.

4. Установите предварительную сумму и другие данные оплаты, от которых зависят ограничения.

5. Получите доступные платежные системы через `PaySystem\Manager::getListWithRestrictions()` и выберите одну из них.

6. Загрузите объект выбранной платежной системы через `PaySystem\Manager::getObjectById()` и назначьте его оплате.

7. После финального расчета установите итоговую сумму и компанию, если компания нужна для учета или печати чеков.

8. Сохраните заказ через `$order->save()`.

9. Если нужно получить форму, ссылку, QR-код или отправить покупателя во внешний платежный сервис, запустите оплату через `$payment->getPaySystem()->initiatePay()`. Подробнее — в разделе [Запустить оплату](#initiate-pay).

10. В автоматическом сценарии обработайте ответ платежного сервиса через обработчик, как описано в разделе [Обработать и сохранить результат](#process-result). В ручном сценарии переведите оплату в состояние оплаченной через `$payment->setPaid('Y')`, как описано в разделе [Оплатить заказ вручную](#manual-pay).

Если менеджер должен проверить заказ до оплаты, используйте сценарий из раздела [Разрешить оплату после проверки менеджером](#manager-approval).

## Подготовить данные для оплаты

Каждый пример ниже — отдельный шаг. Перед запуском подключите модуль `sale` через `\Bitrix\Main\Loader::includeModule('sale')` и подготовьте данные магазина и объекты заказа:

-  объект `$order` — новый или загруженный заказ,

-  идентификатор платежной системы `$paySystemId`,

-  сумму оплаты `$paymentSum`,

-  идентификатор компании `$companyId`, если проект использует компании,

-  объект текущего HTTP-запроса, если обработчик оплаты использует `Bitrix\Main\Request`.

Платежная система, ограничения, компания и касса читают данные через оплату и связанный с ней заказ.

Сначала подготовьте заказ, корзину, обязательные свойства и отгрузки, которые влияют на ограничения. Затем создайте оплату и проверьте доступность платежных систем. Пользовательская отгрузка для создания оплаты не обязательна.

## Работа с оплатой в заказе {#payments-in-order}

Через объект оплаты разработчик выбирает платежную систему, запускает оплату, делит сумму и оформляет возврат.

### Коллекция оплат

Заказ может содержать одну или несколько оплат. Несколько оплат нужны, когда покупатель оплачивает заказ частями или использует разные способы оплаты. Другой сценарий — менеджер делит сумму между внешней оплатой и внутренним счетом.

**Пример.** Код перебирает оплаты заказа и выводит номер каждой.

```php
$paymentCollection = $order->getPaymentCollection();

foreach ($paymentCollection as $payment)
{
    echo $payment->getField('ACCOUNT_NUMBER');
}
```

Если нужно получить конкретную оплату, используйте методы коллекции:

-  `getItemById($id)` — получить оплату по идентификатору,

-  `getItemByIndex($index)` — получить оплату по внутреннему индексу коллекции.

### Создать оплату {#create-payment}

Добавьте оплату в коллекцию заказа через `createItem()`. Ограничения платежных систем учитывают данные оплаты, поэтому сначала создайте оплату без платежной системы и установите сумму. Затем проверьте, что выбранная платежная система доступна, и назначьте ее через `Payment::setPaySystemService()`.

```php
if (!\Bitrix\Main\Loader::includeModule('sale'))
{
    throw new \RuntimeException('Не удалось подключить модуль sale');
}

// $order — новый или загруженный объект \Bitrix\Sale\Order
// $paySystemId — идентификатор платежной системы
// $paymentSum — сумма оплаты

$payment = $order->getPaymentCollection()->createItem();

$result = $payment->setField('SUM', $paymentSum);
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$availablePaySystems = \Bitrix\Sale\PaySystem\Manager::getListWithRestrictions(
    $payment,
    \Bitrix\Sale\Services\Base\RestrictionManager::MODE_CLIENT
);
if (!isset($availablePaySystems[$paySystemId]))
{
    throw new \RuntimeException('Платежная система недоступна для заказа');
}

$service = \Bitrix\Sale\PaySystem\Manager::getObjectById($paySystemId);
if (!$service)
{
    throw new \RuntimeException('Платежная система не найдена');
}

$payment->setPaySystemService($service);

$saveResult = $order->save();
if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $saveResult->getErrorMessages()));
}
```

Метод `getObjectById()` загружает платежную систему по идентификатору и не проверяет ограничения. Подробнее о режимах проверки — в разделе [Выбрать платежную систему](#choose-pay-system).

Если доступность платежной системы для этого заказа уже проверена, передайте объект сервиса в `createItem($service)`. Метод добавляет `Payment` в коллекцию и берет данные платежной системы из объекта сервиса.

Если объект сервиса в сценарии не нужен, создайте оплату без параметра и передайте `PAY_SYSTEM_ID`, `PAY_SYSTEM_NAME` и `SUM` в `setFields()`. В этом варианте код не проверяет ограничения.

```php
$payment = $order->getPaymentCollection()->createItem();

$result = $payment->setFields([
    'PAY_SYSTEM_ID' => $paySystemId,
    'PAY_SYSTEM_NAME' => 'Оплата картой',
    'SUM' => $paymentSum,
]);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

### Выбрать платежную систему {#choose-pay-system}

Перед показом способов оплаты покупателю проверьте ограничения платежных систем. Ограничения учитывают данные оплаты, заказа и плательщика.

Метод `getListWithRestrictions()` возвращает массив платежных систем. Ключи массива — идентификаторы платежных систем, значения — поля платежной системы, например `NAME`. В режиме клиента `MODE_CLIENT` метод возвращает только доступные платежные системы. Исключение — оплата с сохраненным списком доступных платежных систем. Для такой оплаты метод возвращает системы из этого списка и не проверяет ограничения.

**Пример.** Код получает платежные системы, доступные покупателю, и выводит их названия.

```php
$paySystemList = \Bitrix\Sale\PaySystem\Manager::getListWithRestrictions(
    $payment,
    \Bitrix\Sale\Services\Base\RestrictionManager::MODE_CLIENT
);

foreach ($paySystemList as $paySystem)
{
    echo $paySystem['NAME'];
}
```

Для административного сценария используйте режим менеджера `MODE_MANAGER`. В этом режиме метод возвращает активные платежные системы, которые относятся к тому же типу реестра, что и оплата, например к заказу. Системы, которые не прошли мягкое ограничение, попадают в список с признаком `RESTRICTED`. Системы, которые не прошли строгое ограничение, метод исключает из результата. Мягкие и строгие ограничения описаны в разделе [Ограничения платежных систем](#paysystem-restrictions).

**Пример.** Код получает платежные системы в режиме менеджера и пропускает системы с признаком `RESTRICTED`.

```php
$paySystemList = \Bitrix\Sale\PaySystem\Manager::getListWithRestrictions(
    $payment,
    \Bitrix\Sale\Services\Base\RestrictionManager::MODE_MANAGER
);

foreach ($paySystemList as $paySystem)
{
    if (isset($paySystem['RESTRICTED']))
    {
        continue;
    }

    echo $paySystem['NAME'];
}
```

Если оплаты еще нет, проверьте ограничения по данным заказа и сумме методом `getListWithRestrictionsByOrder()`.

**Пример.** Код проверяет платежные системы по данным заказа и его полной сумме до создания оплаты.

```php
$paySystemList = \Bitrix\Sale\PaySystem\Manager::getListWithRestrictionsByOrder(
    $order,
    $order->getPrice(),
    \Bitrix\Sale\Services\Base\RestrictionManager::MODE_CLIENT
);
```

Метод не меняет исходный заказ. Второй параметр — сумма типа `?float`, его можно не передавать. Метод использует переданную сумму, если она больше нуля и не превышает сумму заказа. Иначе метод проверяет платежные системы по полной сумме заказа. Режим проверки по умолчанию — `MODE_CLIENT`.

### Запустить оплату {#initiate-pay}

После выбора платежной системы вызовите `initiatePay()` у объекта сервиса. Метод `initiatePay()` вызывает обработчик платежной системы и возвращает `ServiceResult`.

**Пример.** Код запускает оплату и выводит HTML-шаблон платежной системы.

```php
$service = $payment->getPaySystem();
if (!$service)
{
    throw new \RuntimeException('Для оплаты не задана платежная система');
}

$result = $service->initiatePay(
    $payment,
    \Bitrix\Main\Context::getCurrent()->getRequest(),
    \Bitrix\Sale\PaySystem\BaseServiceHandler::STRING
);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

echo $result->getTemplate();
```

Второй параметр `initiatePay()` — объект `Bitrix\Main\Request` текущего запроса. Если обработчику запрос не нужен, передайте `null`. Третий параметр задает режим вывода шаблона платежной системы, по умолчанию он равен `BaseServiceHandler::STREAM`:

-  `BaseServiceHandler::STRING` — метод возвращает HTML-шаблон строкой через `ServiceResult::getTemplate()`,

-  `BaseServiceHandler::STREAM` — метод сразу подключает шаблон и выводит его в поток.

В `ServiceResult` обработчик может передать:

-  HTML-форму или блок оплаты через `setTemplate()`,

-  ссылку на оплату во внешнем сервисе через `setPaymentUrl()`,

-  QR-код через `setQr()`,

-  данные платежного сервиса для полей оплаты через `setPsData()`,

-  ошибки для разработчика и ошибки, видимые покупателю, через методы результата.

Если `ServiceResult::getPsData()` содержит данные, `PaySystem\Service::initiatePay()` запишет их в оплату через `setFields()` и сохранит заказ.

### Повторная оплата

Повторная оплата нужна, когда платежная система сохраняет токен покупателя и может списывать деньги без повторного ввода платежных данных.

Обработчик платежной системы поддерживает такой сценарий, если он реализует `Bitrix\Sale\PaySystem\IRecurring`. Сервис платежной системы:

-  проверяет поддержку через `isRecurring()`,

-  запускает повторную оплату через `repeatRecurrent()`,

-  передает обработчику отмену повторной оплаты через `cancelRecurrent()`.

**Пример.** Код проверяет поддержку повторной оплаты и запускает ее.

```php
$service = $payment->getPaySystem();
if (!$service)
{
    throw new \RuntimeException('Для оплаты не задана платежная система');
}

if ($service->isRecurring($payment))
{
    $result = $service->repeatRecurrent($payment);
    if (!$result->isSuccess())
    {
        throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
    }
}
```

Токен платежной системы хранится в поле оплаты `PS_RECURRING_TOKEN`, если обработчик передал его в данных платежного сервиса. Токен, правила списания и отмена подписки зависят от конкретного обработчика.

### Оплатить заказ вручную {#manual-pay}

Если оплату подтверждает менеджер или внутренний сценарий, а не внешний платежный сервис, отметьте ее как оплаченную через `Payment::setPaid('Y')`.

```php
$result = $payment->setPaid('Y');
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

После вызова `setPaid('Y')` метод `Payment::isPaid()` возвращает `true`, а `PaymentCollection::getPaidSum()` учитывает сумму этой оплаты. Метод `Order::save()` сохраняет изменение.

**Пример.** Код выводит оплаченную сумму заказа, если `isPaid()` возвращает `true`.

```php
if ($payment->isPaid())
{
    echo $order->getPaymentCollection()->getPaidSum();
}
```

Для автоматизированных платежных систем статус оплаты меняет сервис платежной системы по типу операции, который вернул обработчик. Порядок описан в разделе [Обработать и сохранить результат](#process-result). Не меняйте статус оплаты в шаблоне платежной системы.

### Создать несколько оплат для одного заказа

Чтобы разделить сумму заказа на части, добавьте в `PaymentCollection` несколько объектов `Payment`. У каждой оплаты своя сумма, своя платежная система и свой статус.

**Пример.** Код делит заказ на две оплаты. Платежные системы обеих частей заданы в коде сценария, поэтому код загружает их через `getObjectById()` без проверки ограничений.

```php
// $order — загруженный заказ
// $firstPaySystemId — платежная система для первой части
// $secondPaySystemId — платежная система для второй части
// $firstPaymentSum — сумма первой оплаты

if ($firstPaymentSum <= 0 || $firstPaymentSum >= $order->getPrice())
{
    throw new \RuntimeException('Сумма первой оплаты должна быть больше нуля и меньше суммы заказа');
}

$firstService = \Bitrix\Sale\PaySystem\Manager::getObjectById($firstPaySystemId);
if (!$firstService)
{
    throw new \RuntimeException('Первая платежная система не найдена');
}

$secondService = \Bitrix\Sale\PaySystem\Manager::getObjectById($secondPaySystemId);
if (!$secondService)
{
    throw new \RuntimeException('Вторая платежная система не найдена');
}

$paymentCollection = $order->getPaymentCollection();

$firstPayment = $paymentCollection->createItem($firstService);
$result = $firstPayment->setField('SUM', $firstPaymentSum);
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$secondPayment = $paymentCollection->createItem($secondService);
$result = $secondPayment->setField('SUM', $order->getPrice() - $firstPaymentSum);
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

Если платежные системы выбирает покупатель, создайте каждую оплату без платежной системы, установите сумму и проверьте доступность, как в разделе [Создать оплату](#create-payment).

Если в заказе одна неоплаченная оплата на всю сумму, измените ее сумму и добавьте вторую оплату.

```php
// из предыдущего примера: $paymentCollection — PaymentCollection,
// $secondService — PaySystem\Service, $firstPaymentSum — float
// $paymentId — идентификатор существующей неоплаченной оплаты

$payment = $paymentCollection->getItemById($paymentId);
if (!$payment)
{
    throw new \RuntimeException('Оплата не найдена');
}

$result = $payment->setField('SUM', $firstPaymentSum);
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$newPayment = $paymentCollection->createItem($secondService);
$result = $newPayment->setField('SUM', $order->getPrice() - $firstPaymentSum);
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

Сумму оплаченной оплаты изменить нельзя. Для такой оплаты метод `setField('SUM')` возвращает ошибку `SALE_PAYMENT_NOT_ALLOWED_CHANGE_SUM`. Перед изменением суммы проверьте `$payment->isPaid()`.

### Разрешить оплату после проверки менеджером {#manager-approval}

Если заказ должен пройти проверку менеджером, сохраните его в статусе ожидания проверки и не создавайте оплату до выбора платежной системы. Платежный сценарий запускайте только после проверки.

```php
$statusAwaitingApproval = 'N'; // замените на статус ожидания проверки в вашем проекте

$result = $order->setField('STATUS_ID', $statusAwaitingApproval);
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

После проверки менеджер выбирает платежную систему. Затем выполните шаги по порядку.

1. Создайте оплату без платежной системы и установите сумму.

2. Проверьте доступность выбранной платежной системы в режиме клиента `MODE_CLIENT`, потому что оплату проводит покупатель.

3. Назначьте платежную систему оплате, как в разделе [Создать оплату](#create-payment).

4. Переведите заказ в статус, при котором оплата разрешена.

5. Сохраните заказ и вызовите `initiatePay()`.

```php
$payment = $order->getPaymentCollection()->createItem();

$result = $payment->setField('SUM', $order->getPrice());
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$availablePaySystems = \Bitrix\Sale\PaySystem\Manager::getListWithRestrictions(
    $payment,
    \Bitrix\Sale\Services\Base\RestrictionManager::MODE_CLIENT
);
if (!isset($availablePaySystems[$paySystemId]))
{
    throw new \RuntimeException('Платежная система недоступна для заказа');
}

$service = \Bitrix\Sale\PaySystem\Manager::getObjectById($paySystemId);
if (!$service)
{
    throw new \RuntimeException('Платежная система не найдена');
}

$payment->setPaySystemService($service);

$statusPaymentAllowed = 'P'; // замените на статус, при котором оплату можно показать покупателю

$result = $order->setField('STATUS_ID', $statusPaymentAllowed);
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$saveResult = $order->save();
if (!$saveResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $saveResult->getErrorMessages()));
}

$initResult = $service->initiatePay(
    $payment,
    null,
    \Bitrix\Sale\PaySystem\BaseServiceHandler::STRING
);

if (!$initResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $initResult->getErrorMessages()));
}

$paymentHtml = $initResult->getTemplate();
```

Коды статусов задает проект в настройках интернет-магазина. Смена статуса сама не запускает оплату: после сохранения заказа серверный код явно вызывает `initiatePay()`.

### Внутренний счет {#inner-account}

Внутренняя платежная система оплачивает заказ средствами с внутреннего счета покупателя. Сам внутренний счет платежной системой не является. Подробнее о балансе покупателя, транзакциях, списаниях и пополнениях внутреннего счета — в статье [Покупатели и внутренние счета](./buyers-accounts.md).

**Пример.** Код создает оплату внутренней платежной системой на всю сумму заказа.

```php
$innerPaySystemId = \Bitrix\Sale\PaySystem\Manager::getInnerPaySystemId();

$service = \Bitrix\Sale\PaySystem\Manager::getObjectById($innerPaySystemId);
if (!$service)
{
    throw new \RuntimeException('Внутренняя платежная система не найдена');
}

$payment = $order->getPaymentCollection()->createItem($service);

$result = $payment->setField('SUM', $order->getPrice());
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Чтобы проверить, что оплата создана внутренней платежной системой, вызовите `Payment::isInner()`.

```php
if ($payment->isInner())
{
    echo 'Оплата внутренней платежной системой';
}
```

### Возврат оплаты

Чтобы вернуть оплату, вызовите `Payment::setReturn()`. Метод принимает одно из трех значений:

-  `Payment::RETURN_INNER` — возврат на внутренний счет,

-  `Payment::RETURN_PS` — возврат через платежную систему,

-  `Payment::RETURN_NONE` — отмена признака возврата.

**Пример.** Код проверяет признак оплаты через `isPaid()`, запускает возврат через платежную систему и сохраняет заказ.

```php
if (!$payment->isPaid())
{
    throw new \RuntimeException('Нельзя вернуть неоплаченную оплату');
}

$result = $payment->setReturn(\Bitrix\Sale\Payment::RETURN_PS);
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

Со значением `RETURN_PS` метод `setReturn()` сразу запускает возврат через сервис платежной системы, а не только меняет поле `IS_RETURN`. Обработчик должен реализовать интерфейс `Bitrix\Sale\PaySystem\IRefund`. Если обработчик реализует `Bitrix\Sale\PaySystem\IRefundExtended`, возврат доступен, только когда его метод `isRefundableExtended()` возвращает `true`. Если признак возврата у оплаты уже установлен, повторный вызов со значением `RETURN_PS` или `RETURN_INNER` ничего не меняет и возврат не запускает. Если платежная система не поддерживает возврат, метод `setReturn()` вернет результат с ошибкой.

Для возврата на внутренний счет используйте `Payment::RETURN_INNER`.

```php
$result = $payment->setReturn(\Bitrix\Sale\Payment::RETURN_INNER);
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Чтобы сбросить признак возврата в объекте оплаты, передайте `Payment::RETURN_NONE`.

```php
$result = $payment->setReturn(\Bitrix\Sale\Payment::RETURN_NONE);
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Значение `RETURN_NONE` не отменяет финансовую операцию во внешнем платежном сервисе. Метод только меняет поле `IS_RETURN` на `N`.

Сумма возврата через `setReturn()` равна сумме оплаты. Для частичного возврата вызовите `PaySystem\Service::refund()` и передайте сумму. Обработчик платежной системы должен поддерживать возврат указанной суммы.

Если платежная система не поддерживает возврат, метод `refund()` выбрасывает `Bitrix\Main\SystemException`. Для неоплаченной оплаты метод возвращает ошибку. Если передать сумму `0`, метод выполнит возврат всей суммы оплаты.

**Пример.** Код проверяет сумму частичного возврата и поддержку возврата через `isRefundable()`, затем возвращает часть оплаты через `refund()`.

```php
$partialRefundSum = 1000.0;
if ($partialRefundSum <= 0 || $partialRefundSum >= $payment->getSum())
{
    throw new \InvalidArgumentException('Неверная сумма частичного возврата');
}

$service = $payment->getPaySystem();
if (!$service || !$service->isRefundable())
{
    throw new \RuntimeException('Платежная система не поддерживает возврат');
}

$result = $service->refund($payment, $partialRefundSum);
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Метод `Service::refund()` передает сумму обработчику, но не устанавливает признак полного возврата в объекте оплаты.

## Ограничения платежных систем {#paysystem-restrictions}

Ограничение платежной системы проверяет, доступна ли платежная система для конкретной оплаты и ее заказа.

Встроенный менеджер ограничений — `Bitrix\Sale\Services\PaySystem\Restrictions\Manager`. Он регистрирует ограничения из пространства имен `Bitrix\Sale\Services\PaySystem\Restrictions` по таким признакам:

-  `PersonType` — тип плательщика,

-  `Price` — сумма оплаты,

-  `PercentPrice` — процент суммы заказа,

-  `Currency` — валюта,

-  `Delivery` — служба доставки,

-  `Site` — сайт,

-  `TradeBinding` — привязка к торговой платформе,

-  `ProductCategory` — категория товара,

-  `ConcreteProduct` — конкретный товар.

Метод `getSeverity($mode)` класса ограничения определяет строгость ограничения. Строгость может зависеть от режима проверки.

-  Базовый класс `Restriction` возвращает строгое ограничение в режиме клиента и мягкое в режиме менеджера.

-  Ограничения `PersonType` и `Site` возвращают строгое ограничение в обоих режимах.

-  Ограничения `Price` и `PercentPrice` возвращают мягкое ограничение в обоих режимах.

Результат в каждом режиме описан в разделе [Выбрать платежную систему](#choose-pay-system).

### Создать пользовательское ограничение платежной системы

Пользовательское ограничение нужно, когда доступность платежной системы зависит от условия проекта, например от свойства заказа, компании, состава корзины или внешнего признака.

Класс ограничения наследуется от `Bitrix\Sale\Services\Base\Restriction` и переопределяет методы:

-  `extractParams()` — получает данные из оплаты,

-  `check()` — сравнивает их с настройками ограничения,

-  `getParamsStructure()` — описывает настройки ограничения,

-  `getSeverity()` — задает строгость ограничения,

-  `getClassTitle()` и `getClassDescription()` — возвращают название и описание ограничения для административного раздела.

В массиве `getParamsStructure()` ключи `TYPE`, `DEFAULT` и `LABEL` задают тип поля, значение по умолчанию и подпись.

**Пример.** Ограничение `ByOrderPropertyValue` разрешает платежную систему, если свойство заказа `PAYMENT_ZONE` совпадает со значением из настроек ограничения.

```php
namespace Local\Sale\PaySystem\Restrictions;

class ByOrderPropertyValue extends \Bitrix\Sale\Services\Base\Restriction
{
    public static function getClassTitle()
    {
        return 'По значению свойства заказа';
    }

    public static function getClassDescription()
    {
        return 'Проверяет значение свойства заказа для оплаты.';
    }

    public static function check($propertyValue, array $restrictionParams, $serviceId = 0)
    {
        if (empty($restrictionParams['VALUE']))
        {
            return true;
        }

        return (string)$propertyValue === (string)$restrictionParams['VALUE'];
    }

    protected static function extractParams(\Bitrix\Sale\Internals\Entity $entity)
    {
        if (!$entity instanceof \Bitrix\Sale\Payment)
        {
            return '';
        }

        $order = $entity->getCollection()->getOrder();
        $property = $order
            ->getPropertyCollection()
            ->getItemByOrderPropertyCode('PAYMENT_ZONE')
        ;

        return $property ? $property->getValue() : '';
    }

    public static function getParamsStructure($entityId = 0)
    {
        return [
            'VALUE' => [
                'TYPE' => 'STRING',
                'DEFAULT' => '',
                'LABEL' => 'Допустимое значение свойства PAYMENT_ZONE',
            ],
        ];
    }

    public static function getSeverity($mode)
    {
        return \Bitrix\Sale\Services\PaySystem\Restrictions\Manager::SEVERITY_STRICT;
    }
}
```

Зарегистрируйте ограничение через событие `onSalePaySystemRestrictionsClassNamesBuildList`. Обработчик события возвращает [`EventResult`](../../api-reference/main/event-result/index.md) с массивом, где ключ — полное имя класса ограничения, а значение — путь к файлу класса от корня сайта. Модуль передает этот массив в автозагрузку классов.

Размещайте регистрацию в коде, который подключается при каждом запросе, например в `/local/php_interface/init.php`. Если класс не зарегистрирован в текущем запросе, проверка ограничений этой платежной системы, например `getListWithRestrictions()` при оформлении заказа, завершится ошибкой PHP: класс не найден.

```php
$eventManager = \Bitrix\Main\EventManager::getInstance();

$eventManager->addEventHandler(
    'sale',
    'onSalePaySystemRestrictionsClassNamesBuildList',
    static function ()
    {
        return new \Bitrix\Main\EventResult(
            \Bitrix\Main\EventResult::SUCCESS,
            [
                '\Local\Sale\PaySystem\Restrictions\ByOrderPropertyValue' =>
                    '/local/php_interface/lib/sale/paysystem/restrictions/byorderpropertyvalue.php',
            ],
            'sale'
        );
    }
);
```

Чтобы привязать ограничение к платежной системе программно, вызовите `save()` у класса ограничения. Поля ограничения:

-  `SERVICE_ID` — идентификатор платежной системы,

-  `SERVICE_TYPE` — тип сервиса, для платежных систем `Manager::SERVICE_TYPE_PAYMENT`,

-  `SORT` — порядок проверки,

-  `PARAMS` — значения настроек из `getParamsStructure()`.

```php
$result = \Local\Sale\PaySystem\Restrictions\ByOrderPropertyValue::save([
    'SERVICE_ID' => $paySystemId,
    'SERVICE_TYPE' => \Bitrix\Sale\Services\PaySystem\Restrictions\Manager::SERVICE_TYPE_PAYMENT,
    'SORT' => 100,
    'PARAMS' => [
        'VALUE' => 'B2B',
    ],
]);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

После этого `PaySystem\Manager::getListWithRestrictions()` будет учитывать новое ограничение в следующих запросах. Если в текущем запросе ограничения уже проверялись, модуль использует список ограничений, прочитанный до сохранения.

Чтобы изменить существующее ограничение, передайте его идентификатор вторым аргументом `save($fields, $restrictionId)`. Без идентификатора повторный вызов `save()` создаст еще одно ограничение с теми же параметрами. Для миграций и установочных скриптов сначала найдите ограничение через `Bitrix\Sale\Internals\ServiceRestrictionTable::getList()` по `SERVICE_ID` и `CLASS_NAME`. Модуль хранит `CLASS_NAME` с ведущим обратным слешем, например `'\Local\Sale\PaySystem\Restrictions\ByOrderPropertyValue'`.

## Обработчик и шаблон платежной системы

Платежная система состоит из обработчика и файла описания. Шаблон нужен, если обработчик выводит форму или ссылку через `showTemplate()`.

### Создать обработчик платежной системы

Собственный обработчик нужен, когда проект подключает новый платежный сервис или меняет платежный сценарий существующей системы.

Размещайте пользовательские обработчики в папке `/local/php_interface/include/sale_payment/`. Папка обработчика должна содержать:

-  `handler.php` — класс обработчика,

-  `.description.php` — описание платежной системы и бизнес-значений,

-  `template/template.php` — шаблон вывода формы или ссылки оплаты, если обработчик выводит их через шаблон.

Класс автоматизированного обработчика наследуется от `Bitrix\Sale\PaySystem\ServiceHandler`. Система ищет класс по имени папки. Объявите класс в пространстве имен `Sale\Handlers\PaySystem` и назовите его по имени папки с суффиксом `Handler`. Для класса `LocalCardHandler` из примера папка называется `localcard`. Значение признака `handler` в `getIndicativeFields()` с именем папки не связано.

**Пример.** Обработчик `LocalCardHandler` формирует ссылку на оплату, проверяет подпись уведомления и передает сервису результат успешной оплаты.

```php
namespace Sale\Handlers\PaySystem;

use Bitrix\Main\Request;
use Bitrix\Sale\Payment;
use Bitrix\Sale\PaySystem\ServiceHandler;
use Bitrix\Sale\PaySystem\ServiceResult;
use Bitrix\Sale\PriceMaths;

class LocalCardHandler extends ServiceHandler
{
    public function getCurrencyList()
    {
        return ['RUB'];
    }

    // Настроить признаки, по которым система выберет обработчик
    public static function getIndicativeFields()
    {
        return [
            'handler' => 'local_card',
        ];
    }

    protected static function isMyResponseExtended(Request $request, $paySystemId)
    {
        return (int)$request->get('pay_system_id') === (int)$paySystemId;
    }

    // Подготовить данные для шаблона страницы оплаты
    public function initiatePay(Payment $payment, ?Request $request = null)
    {
        $result = new ServiceResult();

        $paymentUrl = 'https://pay.example.com/invoice/' . $payment->getId();

        $this->setExtraParams([
            'PAYMENT_URL' => $paymentUrl,
            'PAYMENT_SUM' => $payment->getSum(),
        ]);

        $templateResult = $this->showTemplate($payment, 'template');
        if (!$templateResult->isSuccess())
        {
            return $templateResult;
        }

        $result->setPaymentUrl($paymentUrl);
        $result->setTemplate($templateResult->getTemplate());
        $result->setPsData([
            'PS_INVOICE_ID' => (string)$payment->getId(),
            'PS_RESPONSE_DATE' => new \Bitrix\Main\Type\DateTime(),
        ]);

        return $result;
    }

    public function getPaymentIdFromRequest(Request $request)
    {
        return (int)$request->get('payment_id');
    }

    public function processRequest(Payment $payment, Request $request)
    {
        $result = new ServiceResult();

        $amount = (string)$request->get('amount');
        $currency = (string)$request->get('currency');

        // Сформировать и проверить подпись по правилам платежного сервиса
        $payload = (string)$request->get('pay_system_id')
            . '|'
            . (string)$request->get('payment_id')
            . '|'
            . (string)$request->get('status')
            . '|'
            . $amount
            . '|'
            . $currency
        ;
        $expectedSignature = hash_hmac(
            'sha256',
            $payload,
            (string)$this->getBusinessValue($payment, 'SECRET_KEY')
        );

        if (!hash_equals($expectedSignature, (string)$request->get('signature')))
        {
            $result->addError(new \Bitrix\Main\Error('Подпись запроса не прошла проверку'));
            return $result;
        }

        // Сверить валюту и сумму с данными оплаты
        $paymentCurrency = (string)$payment->getField('CURRENCY');
        if ($currency !== $paymentCurrency)
        {
            $result->addError(new \Bitrix\Main\Error('Валюта платежа не совпадает'));
            return $result;
        }

        $requestSum = PriceMaths::roundByFormatCurrency($amount, $paymentCurrency);
        $paymentSum = PriceMaths::roundByFormatCurrency(
            $payment->getSum(),
            $paymentCurrency
        );
        if ($requestSum !== $paymentSum)
        {
            $result->addError(new \Bitrix\Main\Error('Сумма платежа не совпадает'));
            return $result;
        }

        if ((string)$request->get('status') !== 'paid')
        {
            $result->addError(new \Bitrix\Main\Error('Платеж не подтвержден'));
            return $result;
        }

        // Не изменять статус оплаты повторно при повторном уведомлении
        if ($payment->isPaid())
        {
            return $result;
        }

        // Передать сервису результат успешной оплаты
        $result->setOperationType(ServiceResult::MONEY_COMING);
        $result->setPsData([
            'PS_STATUS' => 'Y',
            'PS_STATUS_CODE' => 'paid',
            'PS_SUM' => (float)$amount,
            'PS_CURRENCY' => $currency,
            'PS_RESPONSE_DATE' => new \Bitrix\Main\Type\DateTime(),
        ]);

        return $result;
    }

    // Вернуть ответ в формате, который ожидает платежный сервис
    public function sendResponse(ServiceResult $result, Request $request)
    {
        global $APPLICATION;

        $APPLICATION->restartBuffer();
        header('Content-Type: text/plain; charset=UTF-8');

        echo $result->isResultApplied() ? 'OK' : 'ERROR';
        die();
    }
}
```

Обработчик из примера переопределяет такие методы:

-  `getCurrencyList()` — возвращает список валют, с которыми работает обработчик,

-  `getIndicativeFields()` — возвращает поля, по которым система распознает запрос этого обработчика,

-  `isMyResponseExtended()` — проверяет идентификатор конкретной настройки платежной системы,

-  `initiatePay()` — готовит платежный сценарий и возвращает `ServiceResult`,

-  `getPaymentIdFromRequest()` — возвращает идентификатор оплаты из входящего запроса платежного сервиса,

-  `processRequest()` — проверяет ответ платежного сервиса и возвращает данные для оплаты,

-  `sendResponse()` — возвращает платежному сервису результат применения уведомления.

В примере платежный сервис должен передать поля `handler`, `pay_system_id`, `payment_id`, `status`, `amount`, `currency` и `signature`.

Перед проверкой запроса задайте бизнес-значение `SECRET_KEY`, как описано в разделе [Описать настройки обработчика](#handler-settings). Обработчик строит подписываемую строку в порядке `pay_system_id|payment_id|status|amount|currency`. Алгоритм подписи и состав подписываемых данных приведите в соответствие с требованиями платежного сервиса.

### Обработать результат платежной системы

Стандартная точка входа для уведомлений платежного сервиса — файл `/bitrix/tools/sale_ps_result.php`. Укажите полный URL этой страницы в настройках уведомлений на стороне платежного сервиса.

Файл `sale_ps_result.php` принимает серверное уведомление и не заменяет страницу, на которую платежный сервис возвращает покупателя после оплаты. Настройте URL уведомления и URL возврата покупателя на стороне платежного сервиса отдельно.

{% note info "" %}

Для обработчика на классическом API создайте отдельную страницу и подключите на ней компонент `bitrix:sale.order.payment.receive`.

{% endnote %}

#### Распознать платежную систему

Файл `sale_ps_result.php` перебирает активные платежные системы и вызывает `isMyResponse()` у их обработчиков. Первый обработчик, который распознал запрос, определяет платежную систему для дальнейшей обработки.

#|
|| **Метод обработчика** | **Роль в обработке запроса** ||
|| `getIndicativeFields()` | Возвращает обязательные поля запроса или пары «поле — значение». Метод `isMyResponse()` проверяет их наличие и значения ||
|| `isMyResponse()` | Определяет, относится ли входящий запрос к обработчику. Базовая реализация проверяет поля из `getIndicativeFields()`, затем вызывает `isMyResponseExtended()` ||
|| `isMyResponseExtended()` | Дополнительно проверяет, что запрос относится к конкретной настройке платежной системы. Переопределите метод, если одинаковые признаки используют несколько платежных систем ||
|#

Файл `sale_ps_result.php` не преобразует запрос под протокол конкретного платежного сервиса. Имена полей, значения и способ формирования подписи в запросе должны соответствовать реализации обработчика.

Если `getIndicativeFields()` возвращает пустой массив, базовая реализация `isMyResponse()` не распознает запрос. Выбирайте признаки, которые платежный сервис передает во входящем запросе и которые не совпадают с признаками других обработчиков. Когда в запросе есть идентификатор настройки платежной системы, дополнительно сравните его с параметром `$paySystemId` в `isMyResponseExtended()`.

#### Обработать и сохранить результат {#process-result}

После выбора платежной системы `sale_ps_result.php` создает `PaySystem\Service` и вызывает `Service::processRequest()`. Сервис выполняет шаги по порядку.

1. Обработчик извлекает идентификатор оплаты через `getPaymentIdFromRequest()`.

2. Сервис находит и загружает заказ, проверяет, что заказ не отменен, затем получает оплату из коллекции.

3. Сервис передает оплату и запрос в `ServiceHandler::processRequest()`.

4. Если обработчик вернул успешный `ServiceResult` с типом операции `MONEY_COMING` или `MONEY_LEAVING`, сервис вызывает событие `OnSalePsServiceProcessRequestBeforePaid`.

5. Сервис применяет тип операции. Для `MONEY_COMING` он отмечает оплату как оплаченную. Для `MONEY_LEAVING` устанавливает признак возврата через платежную систему и снимает признак оплаты.

6. Сервис записывает данные из `ServiceResult::getPsData()` в оплату и сохраняет заказ.

7. Сервис вызывает событие `OnSaleAfterPsServiceProcessRequest` и передает результат в `sendResponse()`. Это происходит и при ошибке обработчика. Если сервис не нашел заказ или оплату либо заказ отменен, обработка завершается раньше: событие не вызывается, а `sendResponse()` не отправляет ответ платежному сервису.

{% note warning "" %}

Файл `sale_ps_result.php` принимает уведомление без авторизации пользователя. Факт обращения к странице не подтверждает оплату. Обработчик должен проверить подпись, статус операции, идентификатор оплаты, сумму и валюту по правилам платежного сервиса.

Платежный сервис может повторить уведомление, если не получил ожидаемый ответ. Обрабатывайте повторный запрос без повторного списания, возврата или другого необратимого действия.

{% endnote %}

В примере обработчика `LocalCardHandler` повторное уведомление по оплате, у которой уже стоит признак оплаты, проходит проверку подписи, суммы, валюты и статуса. Обработчик возвращает успешный `ServiceResult` без типа операции, поэтому сервис не меняет статус оплаты повторно. Метод `sendResponse()` возвращает `OK`, чтобы платежный сервис прекратил повторные отправки.

Если ни один обработчик не распознал запрос, страница ничего не выводит в ответ. Запись об этом появится в журнале платежных систем только при подробном уровне журнала, который задает опция модуля `sale` `pay_system_log_level`.

Ошибки поиска заказа и оплаты, ошибки обработчика и сохранения заказа сервис записывает в журнал платежных систем.

#### Использовать собственную точку входа

Проект может принимать уведомления в отдельном файле в `/local/`, маршруте компонента или другом контроллере. Такой вариант подходит, если точка входа уже знает идентификатор платежной системы и автоматический поиск обработчика не нужен.

Метод `Service::processRequest()` сам вызывает `sendResponse()` обработчика. Если `sendResponse()` завершает скрипт, как в примере `LocalCardHandler`, код после `processRequest()` не выполнится. В возвращаемый результат попадают ошибки поиска заказа и оплаты и ошибки обработчика. Ошибок отметки оплаты и сохранения заказа в нем нет, они записываются в журнал платежных систем.

**Пример.** Код загружает платежную систему по идентификатору `$paySystemId` и передает текущий запрос в `Service::processRequest()`.

```php
$service = \Bitrix\Sale\PaySystem\Manager::getObjectById($paySystemId);
if (!$service)
{
    throw new \RuntimeException('Платежная система не найдена');
}

$result = $service->processRequest(
    \Bitrix\Main\Context::getCurrent()->getRequest()
);

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

### Описать настройки обработчика {#handler-settings}

Файл `.description.php` задает описание платежной системы и бизнес-значений в массиве `$data`. Модуль подключает файл через `require` и читает эту переменную, поэтому возвращать значение через `return` не нужно. Массив `$data` обязателен. Бизнес-значения связывают параметры обработчика с полями оплаты, заказа, пользователя, компании или фиксированными значениями. Массив `$description` добавляет текстовое описание обработчика для формы платежной системы в административном разделе.

**Пример.** Фрагмент `.description.php` описывает обработчик `Local Card` и бизнес-значения `SHOP_ID`, `SECRET_KEY` и `PAYMENT_ID`.

```php
$data = [
    'NAME' => 'Local Card',
    'SORT' => 500,
    'CODES' => [
        'SHOP_ID' => [
            'NAME' => 'Идентификатор магазина',
            'DESCRIPTION' => 'Shop ID во внешней платежной системе',
            'SORT' => 100,
            'GROUP' => 'CONNECT_SETTINGS',
            'DEFAULT' => [
                'PROVIDER_KEY' => 'VALUE',
                'PROVIDER_VALUE' => '',
            ],
        ],
        'SECRET_KEY' => [
            'NAME' => 'Секретный ключ',
            'DESCRIPTION' => 'Ключ для проверки подписи входящего запроса',
            'SORT' => 150,
            'GROUP' => 'CONNECT_SETTINGS',
            'DEFAULT' => [
                'PROVIDER_KEY' => 'VALUE',
                'PROVIDER_VALUE' => '',
            ],
        ],
        'PAYMENT_ID' => [
            'NAME' => 'Идентификатор оплаты',
            'SORT' => 200,
            'GROUP' => 'PAYMENT',
            'DEFAULT' => [
                'PROVIDER_KEY' => 'PAYMENT',
                'PROVIDER_VALUE' => 'ID',
            ],
        ],
    ],
];

$description = [
    'MAIN' => 'Принимает оплату картой через внешний платежный сервис.',
];
```

Ключи массива `$data`:

-  `NAME` — название обработчика,

-  `SORT` — порядок в списке обработчиков,

-  `CODES` — бизнес-значения. Ключ — код значения, его получает обработчик.

Ключи бизнес-значения в `CODES`:

-  `NAME` и `DESCRIPTION` — название и описание в форме настройки,

-  `SORT` — порядок поля в форме,

-  `GROUP` — группа полей в форме,

-  `DEFAULT` — значение по умолчанию. `PROVIDER_KEY` задает источник, `PROVIDER_VALUE` — значение или поле источника. Например, `VALUE` — фиксированное значение, `PAYMENT` — поле оплаты.

Метод `BaseServiceHandler::showTemplate()` подключает шаблон и передает в него объект оплаты `$payment` и массив `$params`. Массив `$params` содержит два набора данных:

-  бизнес-значения из `CODES`,

-  дополнительные параметры из `$this->setExtraParams()`.

### Изменить шаблон платежной системы

Шаблон платежной системы выводит форму, кнопку, ссылку или QR-код. Он не должен менять заказ, выполнять HTTP-запросы к платежному сервису или устанавливать статус оплаты. Не вычисляйте подписи и не обращайтесь к платежному API из шаблона. Эти действия должны находиться в обработчике.

Система ищет шаблон в таком порядке. Здесь `<код_обработчика>` — имя папки обработчика.

1. `/local/templates/<шаблон_сайта>/payment/<код_обработчика>/template/<имя>.php`.

2. `/local/templates/.default/payment/<код_обработчика>/template/<имя>.php`.

3. `/bitrix/templates/<шаблон_сайта>/payment/<код_обработчика>/template/<имя>.php`.

4. `/bitrix/templates/.default/payment/<код_обработчика>/template/<имя>.php`.

5. Папка `template` внутри обработчика платежной системы.

Пути с `.default` попадают в поиск, только когда текущий шаблон сайта отличается от `.default`.

{% note info "" %}

Чтобы изменить вывод встроенной платежной системы, скопируйте шаблон в `/local/templates/<шаблон_сайта>/payment/<код_обработчика>/template/<имя>.php`. Не меняйте файлы в `/bitrix/modules/sale/handlers/paysystem/`.

{% endnote %}

**Пример.** Шаблон `template/template.php` выводит форму перехода к оплате, если обработчик передал `PAYMENT_URL`.

```php
<?php
/** @var array $params */
/** @var \Bitrix\Sale\Payment $payment */

if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
    die();
}

$paymentUrl = (string)($params['PAYMENT_URL'] ?? '');
$paymentSum = (float)($params['PAYMENT_SUM'] ?? 0);
?>

<?php if ($paymentUrl !== ''): ?>
    <form action="<?= htmlspecialcharsbx($paymentUrl) ?>" method="post">
        <input type="hidden" name="payment_id" value="<?= (int)$payment->getId() ?>">
        <button type="submit">
            Оплатить <?= \SaleFormatCurrency($paymentSum, $payment->getField('CURRENCY')) ?>
        </button>
    </form>
<?php endif; ?>
```

В шаблоне можно выводить:

-  данные из `$params`,

-  идентификатор и сумму оплаты,

-  ссылку или форму, подготовленную обработчиком,

-  QR-код, если обработчик передал его в параметры.

## Связь оплаты с другими подсистемами

Компания влияет на бизнес-значения и выбор кассы, а платежная система может участвовать в ограничениях кассы и подготовке чека.

### Компания в оплате

Поле `COMPANY_ID` связывает оплату с компанией продавца. Создать компанию можно по сценарию [Создать компанию](./sale-settings.md#company) в статье «Базовые настройки интернет-магазина». Компания может влиять на:

-  бизнес-значения платежной системы, например реквизиты продавца,

-  правила компании, по которым `Company\Manager` проверяет, доступна ли компания для оплаты,

-  доступность кассы для чека, если касса ограничена по компании.

Чтобы выбрать доступную компанию для оплаты, вызовите `\Bitrix\Sale\Services\Company\Manager::getAvailableCompanyIdByEntity()`. Метод возвращает идентификатор первой по сортировке активной компании, доступной для оплаты, или `0`.

```php
$companyId = \Bitrix\Sale\Services\Company\Manager::getAvailableCompanyIdByEntity(
    $payment,
    \Bitrix\Sale\Services\Base\RestrictionManager::MODE_CLIENT
);

if ($companyId > 0)
{
    $result = $payment->setField('COMPANY_ID', $companyId);
    if (!$result->isSuccess())
    {
        throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
    }
}
```

Чтобы получить компании, доступные для оплаты, вызовите `Company\Manager::getListWithRestrictions()`. Метод возвращает массив записей компаний, ключи массива — идентификаторы компаний.

```php
$companyList = \Bitrix\Sale\Services\Company\Manager::getListWithRestrictions(
    $payment,
    \Bitrix\Sale\Services\Base\RestrictionManager::MODE_CLIENT
);
```

Правила компаний и ограничения платежных систем — разные механизмы. Чтобы компания не подбиралась для оплаты выбранной платежной системой, настройте правило компании по платежной системе. Чтобы скрыть платежную систему, создайте пользовательское ограничение платежной системы, которое проверяет `COMPANY_ID`.

### Связь оплаты с кассой и чеком

Чек печатает подсистема касс, а не оплата. Подробнее о работе с кассами — в статье [Кассы и чеки](./cashbox-checks.md). Оплата влияет на выбор кассы и данные чека.

-  Чек может быть связан с оплатой через `PAYMENT_ID`.

-  Касса может быть ограничена по платежной системе, компании или торговой платформе.

-  Тип оплаты в чеке зависит от сценария оплаты и класса чека.

Чтобы проверить, какие кассы доступны для оплаты, используйте `Cashbox\Manager::getListWithRestrictions()`.

```php
$cashboxList = \Bitrix\Sale\Cashbox\Manager::getListWithRestrictions($payment);

foreach ($cashboxList as $cashbox)
{
    echo $cashbox['NAME'];
}
```

Настройки платежной системы отвечают за оплату, а настройки кассы — за фискализацию.

## События платежных систем

Для расширения платежных сценариев используйте события модуля `sale`. События подходят для дополнительного логирования, интеграции с внутренними системами и точечных проверок. Как подписаться на события, описано в статье [Статусы и события](./statuses-events.md#order-events).

#|
|| **Событие** | **Когда срабатывает** ||
|| `OnSalePsServiceProcessRequestBeforePaid` | При успешной обработке ответа платежной системы, до изменения статуса оплаты. Обработчик получает `payment`, `status` и `pay_system_id` ||
|| `OnSaleAfterPsServiceProcessRequest` | После вызова `processRequest()` обработчика, в том числе при ошибке обработчика. Если сервис не нашел заказ или оплату либо заказ отменен, событие не вызывается. Параметры: `payment` — оплата, `serviceResult` — результат обработчика, `request` — входящий запрос ||
|| `onSalePsBeforeInitiatePay` | При запуске платежного сценария через `initiatePay()`, до вызова обработчика. Обработчик события может вернуть ошибку и остановить запуск оплаты ||
|| `OnSaleGetHandlerDescription` | При получении описания платежной системы. Обработчик события может дополнить описание бизнес-значений ||
|| `OnSalePaySystemUpdate` | При изменении платежной системы через `PaySystem\Manager::update()`. Параметры: `PAY_SYSTEM_ID` — идентификатор, `NEW_FIELDS` — переданные поля, `OLD_FIELDS` — прежние значения этих полей ||
|| `onSalePsInitiatePaySuccess` | При успешном запуске платежного сценария через `initiatePay()`. Обработчик получает `payment` ||
|| `onSalePsInitiatePayError` | При ошибке запуска платежного сценария. Обработчик получает `payment` и массив `errors` ||
|#

**Пример.** Обработчик события `onSalePsInitiatePaySuccess` записывает идентификатор оплаты в файл `/local/var/log/payment.log`.

```php
\Bitrix\Main\EventManager::getInstance()->addEventHandler(
    'sale',
    'onSalePsInitiatePaySuccess',
    static function (\Bitrix\Main\Event $event)
    {
        /** @var \Bitrix\Sale\Payment $payment */
        $payment = $event->getParameter('payment');

        \Bitrix\Main\Diag\Debug::writeToFile(
            ['PAYMENT_ID' => $payment->getId()],
            'Payment initiated',
            '/local/var/log/payment.log'
        );
    }
);
```

## Продолжить изучение

-  [Базовые настройки интернет-магазина](./sale-settings.md)

-  [Доставка и отгрузки](./delivery-shipments.md)

-  [Оформление заказа и публичные сценарии](./order-checkout-component.md)

-  [Статусы и события](./statuses-events.md)
