---
title: Оплаты и платежные системы
description: "Оплаты и платежные системы. Создание оплат, выбор платежной системы, обработчики, возвраты, ограничения и разделение оплаты."
---

В модуле Интернет-магазин объект оплаты хранит данные о платеже, а платежная система определяет способ его проведения. Через API разработчик создает оплату в заказе и выбирает платежную систему. Затем разработчик может запустить платежный сценарий, обработать ответ платежного сервиса или выполнить возврат. Оплату также можно связать с компанией и кассой.

-  Оплата хранит часть суммы заказа, платежную систему, статус оплаты, данные ответа платежного сервиса, компанию, документы оплаты и возврата.

-  Платежная система описывает способ оплаты: обработчик, настройки, бизнес-значения, шаблоны, ограничения и операции, которые может выполнить внешний платежный сервис.

## Основные объекты

Для работы с оплатой используйте объекты заказа, менеджер и сервис платежных систем, а также менеджеры связанных подсистем.

### Оплата заказа

#|
|| **Объект** | **Роль в сценарии** ||
|| `Bitrix\Sale\PaymentCollection` | Хранит оплаты заказа, создает новые оплаты, считает оплаченную сумму и передает изменения в заказ ||
|| `Bitrix\Sale\Payment` | Хранит сумму, валюту, платежную систему, статус оплаты, данные платежного сервиса, компанию, возврат и служебные поля одной оплаты ||
|#

Оплата всегда принадлежит заказу. Не сохраняйте `Payment` или `PaymentCollection` отдельно. После изменений вызывайте `Order::save()`, чтобы заказ, корзина, оплаты, отгрузки, статусы и события сохранились согласованно.

### Платежная система

#|
|| **Объект** | **Роль в сценарии** ||
|| `Bitrix\Sale\PaySystem\Manager` | Возвращает платежные системы, проверяет их ограничения и создает объекты сервиса для работы с обработчиками ||
|| `Bitrix\Sale\PaySystem\Service` | Объект настроенной платежной системы. Запускает оплату, обработку ответа, возврат и сохраняет данные платежного сервиса в оплату ||
|| `Bitrix\Sale\PaySystem\ServiceHandler` | Базовый класс автоматизированного обработчика платежной системы. Наследник реализует сценарий оплаты и обработку ответа платежного сервиса ||
|| `Bitrix\Sale\PaySystem\BaseServiceHandler` | Базовый класс обработчика. Отвечает за вывод шаблона, работу с бизнес-значениями и общую механику подготовки шаблона ||
|| `Bitrix\Sale\PaySystem\ServiceResult` | Результат работы платежной системы: ошибки, данные для полей оплаты, HTML-шаблон, ссылка на оплату, QR-код и тип операции ||
|| `Bitrix\Sale\Services\PaySystem\Restrictions\Manager` | Регистрирует и проверяет ограничения платежных систем для оплаты ||
|#

{% note warning "" %}

Классы классического API платежных систем `CSalePaySystem`, `CSalePaySystemAction`, `CSalePaySystemsHelper`, `CSalePaySystemTarif` и `CSaleDelivery2PaySystem` могут встречаться в старых проектах.

В новых сценариях работайте с платежными системами через `Bitrix\Sale\PaySystem\Manager`. Обработчики создавайте как наследников `Bitrix\Sale\PaySystem\ServiceHandler` или `Bitrix\Sale\PaySystem\BaseServiceHandler`.

{% endnote %}

### Связанные подсистемы

#|
|| **Объект** | **Роль в сценарии** ||
|| `Bitrix\Sale\Services\Company\Manager` | Подбирает компанию для оплаты с учетом правил компании ||
|| `Bitrix\Sale\Cashbox\Manager` | Подбирает кассу для чека с учетом ограничений кассы, платежной системы и компании ||
|#

## Базовый сценарий

Обычно оплату оформляют так:

1. Загрузите или создайте заказ.

2. Получите коллекцию оплат через `$order->getPaymentCollection()`.

3. Создайте оплату через `PaymentCollection::createItem()`.

4. Установите предварительную сумму и другие данные оплаты, от которых зависят ограничения.

5. Получите доступные платежные системы через `PaySystem\Manager::getListWithRestrictions()` и выберите одну из них.

6. Загрузите объект выбранной платежной системы через `PaySystem\Manager::getObjectById()` и назначьте его оплате.

7. После финального расчета установите итоговую сумму и компанию, если компания нужна для учета или печати чеков.

8. Сохраните заказ через `$order->save()`.

9. Запустите оплату через `$payment->getPaySystem()->initiatePay($payment)`, если нужно получить форму, ссылку, QR-код или отправить покупателя во внешний платежный сервис.

10. В автоматическом сценарии обработайте успешный ответ через обработчик платежной системы. В ручном сценарии переведите оплату в состояние оплаченной через `$payment->setPaid('Y')`.

Если менеджер должен проверить заказ до оплаты, сначала сохраните заказ без публичной ссылки на оплату. После проверки выберите платежную систему, создайте или обновите оплату, затем отдайте покупателю результат `initiatePay()`.

## Подготовить данные для оплаты

Примеры ниже — отдельные шаги сценария. Чтобы использовать их в своем коде, заранее подготовьте данные магазина и объекты заказа:

-  объект `$order` — новый или загруженный заказ,

-  идентификатор платежной системы `$paySystemId`,

-  сумму оплаты `$paymentSum`,

-  код валюты заказа,

-  идентификатор компании `$companyId`, если проект использует компании,

-  объект текущего HTTP-запроса, если обработчик оплаты использует `Bitrix\Main\Request`.

Платежная система, ограничения, компания и касса читают данные через оплату и связанный с ней заказ. Поэтому сначала подготовьте заказ, корзину, обязательные свойства и отгрузки, которые существуют в сценарии или влияют на ограничения. Затем создайте оплату и проверьте доступность платежных систем. Пользовательская отгрузка для создания оплаты не обязательна.

## Работа с оплатой в заказе

Новую оплату создают через коллекцию заказа. Объект оплаты используют, чтобы выбрать платежную систему, запустить оплату, разделить сумму и оформить возврат.

### Коллекция оплат

Заказ может содержать одну или несколько оплат. Несколько оплат нужны, когда покупатель оплачивает заказ частями или использует разные способы оплаты. Другой сценарий — менеджер делит сумму между внешней оплатой и внутренним счетом.

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

Коллекция связана с заказом. Когда оплата добавляется, удаляется или меняется, заказ получает событие изменения коллекции и может пересчитать связанные данные.

### Создать оплату

Создавайте оплату через коллекцию заказа. Передайте в метод `createItem()` объект платежной системы, если способ оплаты уже выбран.

```php
if (!\Bitrix\Main\Loader::includeModule('sale'))
{
    throw new \RuntimeException('Не удалось подключить модуль sale');
}

// $order — новый или загруженный объект \Bitrix\Sale\Order
// $paySystemId — идентификатор платежной системы
// $paymentSum — сумма оплаты

$service = \Bitrix\Sale\PaySystem\Manager::getObjectById($paySystemId);
if (!$service)
{
    throw new \RuntimeException('Платежная система не найдена');
}

$payment = $order->getPaymentCollection()->createItem($service);

$result = $payment->setField('SUM', $paymentSum);
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

Метод `createItem($service)` добавляет `Payment` в коллекцию и берет данные платежной системы из объекта сервиса. Если платежную систему нужно указать позже, создайте оплату без параметра и заполните поля вручную.

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

Ручное заполнение полезно только когда объект сервиса еще не нужен. Для обычного сценария передавайте `PaySystem\Service`, чтобы оплата сразу получила согласованные данные платежной системы.

### Выбрать платежную систему

Перед показом способов оплаты покупателю проверьте ограничения платежных систем. Ограничения учитывают данные оплаты, заказа и плательщика.

В режиме клиента `MODE_CLIENT` метод возвращает только доступные платежные системы.

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

Для административного сценария используйте режим менеджера `MODE_MANAGER`.

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

В режиме менеджера метод возвращает активные платежные системы нужного типа. Системы, которые не прошли мягкое ограничение, попадают в список с признаком `RESTRICTED`. Системы, которые не прошли строгое ограничение, исключаются из результата.

Если оплату еще не создали, метод `getListWithRestrictionsByOrder()` может проверить ограничения платежных систем по данным заказа и сумме.

```php
$paySystemList = \Bitrix\Sale\PaySystem\Manager::getListWithRestrictionsByOrder(
    $order,
    $order->getPrice(),
    \Bitrix\Sale\Services\Base\RestrictionManager::MODE_CLIENT
);
```

Метод создает временную оплату в клоне заказа и не меняет исходный заказ. Переданная сумма используется, если она больше нуля и не превышает сумму заказа. Если сумма не подходит под этот диапазон, метод проверяет платежные системы по полной сумме заказа.

### Запустить оплату

После выбора платежной системы запустите ее через объект сервиса. Метод `initiatePay()` вызывает обработчик платежной системы и возвращает `ServiceResult`.

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

Третий параметр `initiatePay()` задает режим вывода шаблона платежной системы:

-  `BaseServiceHandler::STRING` — возвращает HTML-шаблон строкой через `ServiceResult::getTemplate()`,

-  `BaseServiceHandler::STREAM` — сразу подключает шаблон и выводит его в поток.

Обработчик может заполнить `ServiceResult` такими данными:

-  HTML-форма или блок оплаты через `setTemplate()`,

-  ссылка на оплату во внешнем сервисе через `setPaymentUrl()`,

-  QR-код через `setQr()`,

-  данные платежного сервиса для полей оплаты через `setPsData()`,

-  ошибки для разработчика и ошибки, видимые покупателю, через методы результата.

Если `ServiceResult::getPsData()` содержит данные, `PaySystem\Service::initiatePay()` запишет их в оплату через `setFields()` и сохранит заказ.

### Повторная оплата

Повторная оплата нужна, когда платежная система сохраняет токен покупателя и может списывать деньги без повторного ввода платежных данных.

Обработчик платежной системы поддерживает такой сценарий, если он реализует `Bitrix\Sale\PaySystem\IRecurring`. Сервис платежной системы:

-  проверяет поддержку через `isRecurring()`,

-  запускает повторную оплату через `repeatRecurrent()`,

-  отменяет оплату через `cancelRecurrent()`.

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

### Оплатить заказ вручную

Если оплата подтверждается не внешним платежным сервисом, а ручным действием менеджера или внутренним сценарием, отметьте оплату как оплаченную через `setPaid('Y')`.

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

После сохранения `Payment::isPaid()` вернет `true`, а `PaymentCollection::getPaidSum()` будет учитывать сумму этой оплаты.

```php
if ($payment->isPaid())
{
    echo $order->getPaymentCollection()->getPaidSum();
}
```

Для автоматизированных платежных систем статус оплаты обычно меняет обработчик при обработке ответа платежного сервиса. Не дублируйте это действие в шаблоне платежной системы.

### Создать несколько оплат для одного заказа

Чтобы разделить оплату на несколько частей, создайте несколько объектов `Payment` в `PaymentCollection`. У каждой оплаты своя сумма, платежная система и статус.

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

Такой сценарий используют для частичной оплаты, оплаты разными платежными системами или сочетания внешней оплаты с внутренним счетом.

Если заказ уже содержит одну неоплаченную оплату на всю сумму, измените ее сумму и добавьте вторую оплату.

```php
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
```

Не меняйте сумму оплаченной или возвращенной оплаты без отдельной проверки. Такие изменения могут конфликтовать с платежным сервисом, чеками и учетом.

### Разрешить оплату после проверки менеджером

Если заказ должен пройти проверку менеджером, не запускайте платежный сценарий сразу после оформления. Сохраните заказ в статусе, который означает ожидание проверки, и не создавайте оплату до выбора платежной системы.

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

После проверки менеджер выбирает платежную систему и переводит заказ в статус, при котором оплата разрешена. Смена статуса сама не запускает оплату: после сохранения заказа серверный код явно вызывает `initiatePay()`.

```php
$service = \Bitrix\Sale\PaySystem\Manager::getObjectById($paySystemId);
if (!$service)
{
    throw new \RuntimeException('Платежная система не найдена');
}

$payment = $order->getPaymentCollection()->createItem($service);

$result = $payment->setField('SUM', $order->getPrice());
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

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

Конкретные коды статусов задаются настройками проекта. Показывайте публичную ссылку или форму оплаты только после бизнес-проверки заказа.

### Внутренний счет

Внутренний счет — это платежная система, которая оплачивает заказ средствами с баланса покупателя.

```php
$innerPaySystemId = \Bitrix\Sale\PaySystem\Manager::getInnerPaySystemId();

$service = \Bitrix\Sale\PaySystem\Manager::getObjectById($innerPaySystemId);
if (!$service)
{
    throw new \RuntimeException('Платежная система внутреннего счета не найдена');
}

$payment = $order->getPaymentCollection()->createItem($service);

$result = $payment->setField('SUM', $order->getPrice());
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

Проверить, что оплата относится к внутреннему счету, можно через `Payment::isInner()`.

```php
if ($payment->isInner())
{
    echo 'Оплата внутренним счетом';
}
```

Подробнее о балансе покупателя, транзакциях, списаниях и пополнениях внутреннего счета в статье [Покупатели и внутренние счета](./buyers-accounts.md).

### Возврат оплаты

Возврат выполняйте через `Payment::setReturn()`. Метод принимает одно из трех значений:

-  `Payment::RETURN_INNER` — возврат на внутренний счет,

-  `Payment::RETURN_PS` — возврат через платежную систему,

-  `Payment::RETURN_NONE` — отмена признака возврата.

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

Для возврата через платежную систему обработчик должен поддерживать интерфейс `Bitrix\Sale\PaySystem\IRefund` или `Bitrix\Sale\PaySystem\IRefundExtended`. Если платежная система не поддерживает возврат, результат вернет ошибку. В этом сценарии `setReturn()` запускает возврат через сервис платежной системы, а не только меняет поле `IS_RETURN`.

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

`Service::refund()` передает сумму обработчику, но не устанавливает признак полного возврата в объекте оплаты.

## Ограничения платежных систем

Ограничение платежной системы проверяет, доступен ли способ оплаты для конкретной оплаты и связанного заказа.

Встроенный менеджер ограничений — `Bitrix\Sale\Services\PaySystem\Restrictions\Manager`. Он регистрирует ограничения:

-  `PersonType` — по типу плательщика,

-  `Price` — сумме оплаты,

-  `PercentPrice` — проценту суммы заказа,

-  `Currency` — валюте,

-  `Delivery` — службе доставки,

-  `Site` — сайту,

-  `TradeBinding` — привязке к торговой платформе,

-  `ProductCategory` — категории товара,

-  `ConcreteProduct` — конкретному товару.

При выборе платежной системы `PaySystem\Manager::getListWithRestrictions()` вызывает `Restrictions\Manager::checkService()` для каждой активной платежной системы.

Строгость ограничения определяет метод `getSeverity($mode)` его класса. Она может зависеть от режима проверки:

-  базовый класс `Restriction` возвращает строгое ограничение в клиентском режиме и мягкое в режиме менеджера,

-  `PersonType` и `Site` возвращают строгое ограничение в обоих режимах,

-  `Price` и `PercentPrice` возвращают мягкое ограничение в обоих режимах.

Если для оплаты нет заранее сохраненных привязок доступных платежных систем, в клиентском режиме система попадает в результат, только если все ограничения пройдены. В режиме менеджера система с нарушенным мягким ограничением может попасть в список с признаком `RESTRICTED`, а с нарушенным строгим ограничением исключается из результата.

### Создать пользовательское ограничение платежной системы

Пользовательское ограничение нужно, когда доступность платежной системы зависит от условия проекта: свойства заказа, компании, суммы, типа покупателя, состава корзины или внешнего признака.

Класс ограничения наследуется от `Bitrix\Sale\Services\Base\Restriction`. Метод `extractParams()` получает данные из оплаты, а `check()` сравнивает их с настройками ограничения.

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

Зарегистрируйте ограничение через событие `onSalePaySystemRestrictionsClassNamesBuildList`. Размещайте регистрацию в коде, который подключается при каждом запросе, например в `/local/php_interface/init.php`. Если зарегистрировать класс только перед вызовом `save()`, ограничение сохранится, но при открытии платежной системы в административном разделе класс может не загрузиться.

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

Чтобы привязать ограничение к платежной системе программно, вызовите `save()` у класса ограничения.

Повторный запуск создаст еще одно ограничение с теми же параметрами. Для миграций и установочных скриптов сначала проверьте, что такое ограничение еще не привязано к платежной системе.

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

После этого `PaySystem\Manager::getListWithRestrictions()` будет учитывать новое ограничение.

## Обработчик и шаблон платежной системы

Обработчик выполняет платежные операции, файл `.description.php` описывает его настройки и бизнес-значения, а шаблон выводит подготовленные данные.

### Создать обработчик платежной системы

Собственный обработчик нужен, когда проект подключает новый платежный сервис или меняет платежный сценарий существующей системы.

Размещайте пользовательские обработчики в директории `/local/php_interface/include/sale_payment/`. Папка обработчика должна содержать:

-  `handler.php` — класс обработчика,

-  `.description.php` — описание платежной системы и бизнес-значений,

-  `template/template.php` — шаблон вывода формы или ссылки оплаты, если необходимо.

Класс автоматизированного обработчика наследуется от `Bitrix\Sale\PaySystem\ServiceHandler`.

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

Следующие методы реализуют этапы распознавания запроса, запуска оплаты и обработки ответа:

-  `getCurrencyList()` возвращает список валют, с которыми работает обработчик,

-  `getIndicativeFields()` возвращает поля, по которым система распознает запрос этого обработчика,

-  `isMyResponseExtended()` проверяет идентификатор конкретной настройки платежной системы,

-  `initiatePay()` готовит платежный сценарий и возвращает `ServiceResult`,

-  `getPaymentIdFromRequest()` находит оплату по входящему запросу платежного сервиса,

-  `processRequest()` проверяет ответ платежного сервиса и возвращает данные для оплаты,

-  `sendResponse()` возвращает платежному сервису результат применения уведомления.

В примере платежный сервис должен передать поля `handler`, `pay_system_id`, `payment_id`, `status`, `amount`, `currency` и `signature`. Перед проверкой запроса задайте бизнес-значение `SECRET_KEY`. Обработчик строит подписываемую строку в порядке `pay_system_id|payment_id|status|amount|currency`. Алгоритм подписи и состав подписываемых данных замените на требования конкретного платежного сервиса.

### Обработать результат платежной системы

Для обработчиков стандартная точка входа для уведомлений платежного сервиса — файл `/bitrix/tools/sale_ps_result.php`. Укажите полный URL этой страницы в настройках уведомлений на стороне платежного сервиса.

Файл `sale_ps_result.php` принимает серверное уведомление и не заменяет страницу, на которую платежный сервис возвращает покупателя после оплаты. URL уведомления и URL возврата покупателя выполняют разные задачи и настраиваются отдельно по правилам платежного сервиса.

{% note info "" %}

Для обработчика на классическом API создайте отдельную страницу и подключите на ней компонент `bitrix:sale.order.payment.receive`.

{% endnote %}

#### Распознать платежную систему

Страница получает текущий объект `Bitrix\Main\Request` и передает его в `PaySystem\Manager::searchByRequest()`. Менеджер перебирает активные платежные системы и вызывает `isMyResponse()` у их обработчиков. Первый обработчик, который распознал запрос, определяет платежную систему для дальнейшей обработки.

#|
|| **Метод обработчика** | **Роль в обработке запроса** ||
|| `getIndicativeFields()` | Возвращает обязательные поля запроса или пары «поле — значение». Метод `isMyResponse()` проверяет их наличие и значения ||
|| `isMyResponse()` | Определяет, относится ли входящий запрос к обработчику. Базовую реализацию обычно настраивают через `getIndicativeFields()` и `isMyResponseExtended()` ||
|| `isMyResponseExtended()` | Дополнительно проверяет, что запрос относится к конкретной настройке платежной системы. Переопределите метод, если одинаковые признаки используют несколько платежных систем ||
|#

Файл `sale_ps_result.php` не преобразует запрос под протокол конкретного платежного сервиса. Имена полей, значения и способ формирования подписи в запросе должны соответствовать реализации обработчика.

Если `getIndicativeFields()` возвращает пустой массив, базовая реализация `isMyResponse()` не распознает запрос. Выбирайте признаки, которые платежный сервис передает во входящем запросе и которые не совпадают с признаками других обработчиков. Когда в запросе есть идентификатор настройки платежной системы, дополнительно сравните его с параметром `$paySystemId` в `isMyResponseExtended()`.

#### Обработать и сохранить результат

После выбора платежной системы `sale_ps_result.php` создает `PaySystem\Service` и вызывает `Service::processRequest()`:

1. Обработчик извлекает идентификатор оплаты через `getPaymentIdFromRequest()`.

2. Сервис находит и загружает заказ, проверяет, что заказ не отменен, затем получает оплату из коллекции.

3. Сервис передает оплату и запрос в `ServiceHandler::processRequest()`.

4. Если обработчик вернул успешный `ServiceResult`, сервис применяет тип операции.

   -  `MONEY_COMING` отмечает оплату как оплаченную.

   -  `MONEY_LEAVING` снимает признак оплаты и устанавливает признак возврата через платежную систему.

5. Сервис записывает данные из `ServiceResult::getPsData()` в оплату и сохраняет заказ.

6. Перед изменением статуса оплаты сервис вызывает событие `OnSalePsServiceProcessRequestBeforePaid`, если обработчик вернул `MONEY_COMING` или `MONEY_LEAVING`.

7. После обработки результата сервис вызывает событие `OnSaleAfterPsServiceProcessRequest` и передает результат в `sendResponse()`.

{% note warning "" %}

Файл `sale_ps_result.php` принимает уведомление без авторизации пользователя. Факт обращения к странице не подтверждает оплату. Обработчик должен проверить подпись, статус операции, идентификатор оплаты, сумму и валюту по правилам платежного сервиса.

Платежный сервис может повторить уведомление, если не получил ожидаемый ответ. Обрабатывайте повторный запрос без повторного списания, возврата или другого необратимого действия.

{% endnote %}

В примере обработчика `LocalCardHandler` повторное уведомление для уже оплаченного объекта проходит проверку подписи, суммы, валюты и статуса. Обработчик возвращает успешный `ServiceResult` без типа операции, поэтому сервис не меняет статус оплаты повторно. Метод `sendResponse()` возвращает `OK`, чтобы платежный сервис завершил повторную отправку.

Если ни один обработчик не распознал запрос, `sale_ps_result.php` передает сообщение `Pay system not found` в `PaySystem\Logger::addDebugInfo()`. Страница не выводит это сообщение в HTTP-ответ. Диагностическая запись появится только при включенном подробном журналировании платежных систем.

После распознавания платежной системы сервис записывает в журнал ошибки пустого идентификатора оплаты, отсутствующего или отмененного заказа, отсутствующей оплаты, ошибки обработчика и сохранения заказа.

#### Использовать собственную точку входа

Проект может использовать отдельный файл в `/local/`, маршрут компонента или другой контроллер. Такой вариант подходит, если точка входа уже знает идентификатор платежной системы и автоматический поиск обработчика не нужен.

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

Переменная `$paySystemId` должна содержать идентификатор платежной системы, обработчик которой принимает этот запрос.

### Описать настройки обработчика

Файл `.description.php` возвращает описание платежной системы и бизнес-значений. Бизнес-значения связывают параметры обработчика с полями оплаты, заказа, пользователя, компании или фиксированными значениями.

Ниже показан фрагмент `.description.php`. Массив `$data` с описанием обработчика и бизнес-значений обязателен. Массив `$description` добавляет текстовое описание обработчика.

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

`BaseServiceHandler::showTemplate()` передает в шаблон два набора данных:

-  бизнес-значения из `CODES`, полученные методом `BusinessValue::get()`,

-  дополнительные параметры из `$this->setExtraParams()`.

В шаблоне эти данные доступны в массиве `$params`.

### Изменить шаблон платежной системы

Шаблон платежной системы выводит форму, кнопку, ссылку или QR-код. Он не должен менять заказ, выполнять HTTP-запросы к платежному сервису или устанавливать статус оплаты.

Система ищет шаблон в таком порядке:

-  `/local/templates/<шаблон_сайта>/payment/<код_обработчика>/template/<имя>.php`,

-  `/local/templates/.default/payment/<код_обработчика>/template/<имя>.php`,

-  `/bitrix/templates/<шаблон_сайта>/payment/<код_обработчика>/template/<имя>.php`,

-  `/bitrix/templates/.default/payment/<код_обработчика>/template/<имя>.php`,

-  папка `template` внутри обработчика платежной системы.

Пути с `.default` добавляются в поиск только когда текущий шаблон сайта отличается от `.default`.

{% note info "" %}

Чтобы изменить вывод системной платежной системы, скопируйте шаблон в `/local/templates/.../payment/...`. Не меняйте файлы в `/bitrix/modules/sale/handlers/paysystem/`.

{% endnote %}

Пример шаблона `template/template.php`:

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

Не вычисляйте подписи и не обращайтесь к платежному API из шаблона. Эти действия должны находиться в обработчике.

## Связь оплаты с другими подсистемами

Компания влияет на бизнес-значения и выбор кассы, а платежная система может участвовать в ограничениях кассы и подготовке чека.

### Компания в оплате

Поле `COMPANY_ID` связывает оплату с компанией продавца. Компания может влиять на:

-  бизнес-значения платежной системы, например реквизиты продавца,

-  доступность компании для оплаты через `Bitrix\Sale\Services\Company\Manager`,

-  доступность кассы для чека, если касса ограничена по компании.

Чтобы выбрать доступную компанию для оплаты, используйте менеджер компаний `\Bitrix\Sale\Services\Company\Manager`.

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

Проверить список компаний можно методом `getListWithRestrictions()`.

```php
$companyList = \Bitrix\Sale\Services\Company\Manager::getListWithRestrictions(
    $payment,
    \Bitrix\Sale\Services\Base\RestrictionManager::MODE_CLIENT
);
```

Правила компаний находятся отдельно от ограничений платежных систем. Если нужно запретить платежную систему для компании, настройте правило компании по платежной системе или создайте пользовательское ограничение платежной системы, которое проверяет `COMPANY_ID`.

### Связь оплаты с кассой и чеком

Оплата не печатает чек сама: за это отвечает подсистема касс. При этом оплата влияет на выбор кассы и данные чека:

-  чек может быть связан с оплатой через `PAYMENT_ID`,

-  касса может быть ограничена по платежной системе,

-  касса может быть ограничена по компании,

-  тип оплаты в чеке зависит от сценария оплаты и класса чека.

Чтобы проверить, какие кассы доступны для оплаты, используйте `Cashbox\Manager::getListWithRestrictions()`.

```php
$cashboxList = \Bitrix\Sale\Cashbox\Manager::getListWithRestrictions($payment);

foreach ($cashboxList as $cashbox)
{
    echo $cashbox['NAME'];
}
```

Встроенные ограничения касс включают ограничение по платежной системе, торговой платформе и компании. Если у оплаты заполнены `PAY_SYSTEM_ID` и `COMPANY_ID`, эти поля участвуют в подборе кассы.

Платежная система может быть частью сценария печати чека, но не заменяет кассу. Настройки платежной системы отвечают за оплату, а настройки кассы — за фискализацию.

Подробнее о работе с кассами в статье [Кассы и чеки](./cashbox-checks.md).

## События платежных систем

Для расширения платежных сценариев используйте события модуля `sale`. События подходят для дополнительного логирования, маркировки, интеграции с внутренними системами и точечных проверок.

#|
|| **Событие** | **Когда использовать** ||
|| `OnSalePsServiceProcessRequestBeforePaid` | Перед изменением статуса оплаты после успешной обработки ответа платежной системы. В обработчик передаются `payment`, `status` и `pay_system_id` ||
|| `OnSaleAfterPsServiceProcessRequest` | После обработки запроса платежной системы. Используйте для дополнительной реакции на результат обработки ||
|| `onSalePsBeforeInitiatePay` | Перед запуском платежного сценария через `initiatePay()`. Обработчик может вернуть ошибку и остановить запуск оплаты ||
|| `OnSaleGetHandlerDescription` | При получении описания платежной системы. Используйте, чтобы дополнить описание бизнес-значений обработчика ||
|| `OnSalePaySystemUpdate` | При изменении платежной системы. Используйте для реакции на обновление настроек платежной системы ||
|| `onSalePsInitiatePaySuccess` | После успешного запуска платежного сценария через `initiatePay()`. В обработчик передается `payment` ||
|| `onSalePsInitiatePayError` | После ошибки запуска платежного сценария. В обработчик передаются `payment` и массив `errors` ||
|#

Пример обработки успешного запуска оплаты:

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

Обработчик запишет идентификатор оплаты в файл `/local/var/log/payment.log` после успешного вызова `initiatePay()`.

## Продолжить изучение

-  [Базовые настройки интернет-магазина](./sale-settings.md)

-  [Доставка и отгрузки](./delivery-shipments.md)

-  [Оформление заказа и публичные сценарии](./order-checkout-component.md)

-  [Статусы и события](./statuses-events.md)
