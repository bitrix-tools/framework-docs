---
title: События записей и права доступа
description: "Обработка событий добавления, изменения и удаления записей Highload-блока, отмена операций и проверка прав перед вызовом ORM."
---

Динамический ORM-класс Highload-блока вызывает события при добавлении, изменении и удалении записей. Обработчик может изменить данные до проверки пользовательских полей, отменить операцию с ошибкой или выполнить связанное действие после сохранения.

Прямые вызовы методов `getList()`, `add()`, `update()` и `delete()` не проверяют права текущего пользователя. Если операция выполняется от имени пользователя, код проекта должен отдельно получить разрешенные операции и проверить нужное право.

Чтобы запустить примеры, получите динамический класс данных по правилам из статьи [Работа с записями](./records.md). В примерах переменная `$dataClass` содержит имя этого класса, а `$highloadBlockId` — идентификатор Highload-блока.

Поля `UF_NAME`, `UF_CODE`, `UF_ACTIVE` и `UF_SYNCED` входят в общую [схему данных примеров](./overview.md#example-data-schema).

## Выбрать событие

События каждой операции срабатывают в разные моменты: до проверки данных, перед SQL-операцией и после успешной записи. Регистрируйте обработчики через `Bitrix\Main\ORM\EventManager`, чтобы не составлять имя события из имени Highload-блока вручную.

События различаются назначением и составом параметров:

-  `OnBefore*` позволяет нормализовать и проверить данные. Обработчик получает изменяемый ORM-объект и может отменить операцию.

-  `OnAfter*` подходит для действий, которым нужен результат записи: очистки кеша проекта, создания записи аудита или постановки фонового задания.

-  События изменения передают в `fields` только значения из вызова `update()`. Параметр `oldFields` содержит прежние значения скалярных полей. Если правило зависит от множественного поля, прочитайте его отдельно до `update()`.

-  События удаления не передают параметр `fields`. Данные удаляемой записи находятся в `oldFields`.

#|
|| **Событие** | **Когда срабатывает** | **Основные параметры события** | **Можно отменить операцию** ||
|| `OnBeforeAdd` | При подготовке новой записи, до проверки пользовательских полей |
-  `fields` — переданные значения полей
-  `object` — изменяемый ORM-объект новой записи
| Да ||
|| `OnAdd` | После проверки данных, до преобразования пользовательских полей и SQL-записи |
-  `fields` — проверенные значения полей
-  `object` — копия ORM-объекта новой записи
| Нет ||
|| `OnAfterAdd` | После успешного добавления записи |
-  `id` — числовой идентификатор добавленной записи
-  `primary` — массив со значением первичного ключа добавленной записи
-  `fields` — сохраненные значения полей
-  `object` — копия ORM-объекта добавленной записи
| Нет ||
|| `OnBeforeUpdate` | При подготовке изменения, до проверки пользовательских полей |
-  `primary` — массив со значением первичного ключа изменяемой записи
-  `fields` — переданные изменения
-  `oldFields` — значения скалярных полей до изменения
-  `object` — изменяемый ORM-объект записи
| Да ||
|| `OnUpdate` | После проверки данных, до преобразования пользовательских полей и SQL-записи |
-  `primary` — массив со значением первичного ключа изменяемой записи
-  `fields` — проверенные изменения
-  `oldFields` — значения скалярных полей до изменения
-  `object` — копия ORM-объекта записи
| Нет ||
|| `OnAfterUpdate` | После успешного изменения записи |
-  `primary` — массив со значением первичного ключа измененной записи
-  `fields` — сохраненные изменения
-  `oldFields` — значения скалярных полей до изменения
-  `object` — копия ORM-объекта измененной записи
| Нет ||
|| `OnBeforeDelete` | После чтения удаляемой записи, до удаления |
-  `primary` — массив со значением первичного ключа удаляемой записи
-  `oldFields` — значения полей удаляемой записи
| Да ||
|| `OnDelete` | Непосредственно перед удалением |
-  `primary` — массив со значением первичного ключа удаляемой записи
-  `oldFields` — значения полей удаляемой записи
| Нет ||
|| `OnAfterDelete` | После удаления записи и связанных значений пользовательских полей |
-  `primary` — массив со значением первичного ключа удаленной записи
-  `oldFields` — значения полей удаленной записи
| Нет ||
|#

{% note warning "" %}

Событие `OnAdd`, `OnUpdate` или `OnDelete` срабатывает до SQL-операции, но не может отменить ее через `EventResult`. Чтобы проверить условия и вернуть ошибку, используйте соответствующее событие `OnBefore*`.

{% endnote %}

## Зарегистрировать обработчик

Метод `Bitrix\Main\ORM\EventManager::addEventHandler()` регистрирует обработчик на время текущего запроса. Для постоянной подписки поместите регистрацию в загружаемый файл проекта, например `/local/php_interface/init.php`, или оформите ее при установке собственного модуля.

Сначала подключите модуль, получите описание блока и динамический класс. Затем передайте класс и константу события в менеджер ORM.

```php
use Bitrix\Highloadblock\HighloadBlockTable;
use Bitrix\Main\Loader;
use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Event;
use Bitrix\Main\ORM\EventManager;

if (!Loader::includeModule('highloadblock'))
{
    throw new \RuntimeException('Не удалось подключить модуль highloadblock');
}

$highloadBlock = HighloadBlockTable::getById($highloadBlockId)->fetch();

if (!$highloadBlock)
{
    throw new \RuntimeException('Highload-блок не найден');
}

$dataClass = HighloadBlockTable::compileEntity($highloadBlock)->getDataClass();

$handlerId = EventManager::getInstance()->addEventHandler(
    $dataClass,
    DataManager::EVENT_ON_AFTER_ADD,
    static function (Event $event): void
    {
        $primary = $event->getParameter('primary');
        $recordId = (int)($primary['ID'] ?? 0);

        // Передайте идентификатор в журнал или фоновое задание проекта
    }
);
```

Метод возвращает идентификатор обработчика. Он нужен, если подписку требуется удалить в том же запросе через `removeEventHandler($dataClass, $eventType, $handlerId)`.

Зарегистрируйте обработчик до вызова `add()`, `update()` или `delete()`. Иначе обработчик не получит событие этой операции.

## Изменить данные до сохранения

Обработчик `OnBeforeAdd` или `OnBeforeUpdate` может вернуть `Bitrix\Main\ORM\EventResult`. Метод `modifyFields()` заменяет указанные поля перед проверкой пользовательских полей и сохранением.

**Пример.** Удалите пробелы по краям и приведите внешний код `UF_CODE` к нижнему регистру перед добавлением записи.

```php
use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Event;
use Bitrix\Main\ORM\EventManager;
use Bitrix\Main\ORM\EventResult;

EventManager::getInstance()->addEventHandler(
    $dataClass,
    DataManager::EVENT_ON_BEFORE_ADD,
    static function (Event $event): EventResult
    {
        $result = new EventResult();
        $fields = $event->getParameter('fields');

        if (array_key_exists('UF_CODE', $fields))
        {
            $result->modifyFields([
                'UF_CODE' => mb_strtolower(trim((string)$fields['UF_CODE'])),
            ]);
        }

        return $result;
    }
);
```

Если несколько обработчиков изменяют одно поле, итог зависит от порядка их выполнения. Не распределяйте одно правило нормализации между несколькими подписками.

Метод `unsetFields()` исключает поля из операции. Для `update()` это позволяет пропустить изменение отдельного поля без ошибки. Если вызывающий код должен получить сообщение о запрете, верните ошибку вместо исключения поля.

## Отменить операцию с ошибкой

Добавьте `Bitrix\Main\ORM\EntityError` в результат события `OnBeforeAdd`, `OnBeforeUpdate` или `OnBeforeDelete`. Динамический класс прекратит операцию, а ошибка попадет в результат `add()`, `update()` или `delete()`.

**Пример.** Запретите менять заполненный внешний код записи.

```php
use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\EntityError;
use Bitrix\Main\ORM\Event;
use Bitrix\Main\ORM\EventManager;
use Bitrix\Main\ORM\EventResult;

EventManager::getInstance()->addEventHandler(
    $dataClass,
    DataManager::EVENT_ON_BEFORE_UPDATE,
    static function (Event $event): EventResult
    {
        $result = new EventResult();
        $fields = $event->getParameter('fields');
        $oldFields = $event->getParameter('oldFields');

        $codeIsChanged = array_key_exists('UF_CODE', $fields)
            && ($oldFields['UF_CODE'] ?? null) !== $fields['UF_CODE'];

        if ($codeIsChanged && ($oldFields['UF_CODE'] ?? '') !== '')
        {
            $result->addError(new EntityError(
                'Нельзя изменить внешний код существующей записи'
            ));
        }

        return $result;
    }
);
```

Передайте входные данные и проверьте объект результата в месте вызова операции. Метод `getErrorMessages()` возвращает сообщения как массив строк.

```php
// $recordId — идентификатор изменяемой записи
// $newExternalCode — новый внешний код
$updateResult = $dataClass::update($recordId, [
    'UF_CODE' => $newExternalCode,
]);

if (!$updateResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $updateResult->getErrorMessages())
    );
}
```

Для ошибки конкретного пользовательского поля можно использовать `Bitrix\Main\ORM\Fields\FieldError`. Передайте объект поля из `$event->getEntity()->getField('UF_CODE')` и текст ошибки. `EntityError` подходит для правила, которое относится ко всей записи или нескольким полям.

### Запретить удаление по состоянию записи

События удаления передают прежние значения записи в параметре `oldFields`. Это позволяет проверить состояние без дополнительного запроса.

**Пример.** Запретите удалять активную запись.

```php
use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\EntityError;
use Bitrix\Main\ORM\Event;
use Bitrix\Main\ORM\EventManager;
use Bitrix\Main\ORM\EventResult;

EventManager::getInstance()->addEventHandler(
    $dataClass,
    DataManager::EVENT_ON_BEFORE_DELETE,
    static function (Event $event): EventResult
    {
        $result = new EventResult();
        $oldFields = $event->getParameter('oldFields');

        if ((int)($oldFields['UF_ACTIVE'] ?? 0) === 1)
        {
            $result->addError(new EntityError(
                'Сначала деактивируйте запись'
            ));
        }

        return $result;
    }
);
```

После ошибки метод `delete()` возвращает неуспешный `DeleteResult`. События `OnDelete` и `OnAfterDelete` для этой операции не срабатывают.

### Добавить запись с нормализацией

Зарегистрируйте обработчик и добавьте запись, чтобы проверить нормализацию `UF_CODE`. Перед запуском передайте идентификатор существующего Highload-блока в `$highloadBlockId`. В блоке должны быть строковые поля `UF_NAME` и `UF_CODE`.

```php
use Bitrix\Highloadblock\HighloadBlockTable;
use Bitrix\Main\Loader;
use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Event;
use Bitrix\Main\ORM\EventManager;
use Bitrix\Main\ORM\EventResult;

// Подключите модуль highloadblock
if (!Loader::includeModule('highloadblock'))
{
    throw new \RuntimeException('Не удалось подключить модуль highloadblock');
}

// Получите динамический ORM-класс блока
$highloadBlock = HighloadBlockTable::getById($highloadBlockId)->fetch();

if (!$highloadBlock)
{
    throw new \RuntimeException('Highload-блок не найден');
}

$dataClass = HighloadBlockTable::compileEntity($highloadBlock)->getDataClass();

// Зарегистрируйте нормализацию внешнего кода
EventManager::getInstance()->addEventHandler(
    $dataClass,
    DataManager::EVENT_ON_BEFORE_ADD,
    static function (Event $event): EventResult
    {
        $result = new EventResult();
        $fields = $event->getParameter('fields');

        if (array_key_exists('UF_CODE', $fields))
        {
            $result->modifyFields([
                'UF_CODE' => mb_strtolower(trim((string)$fields['UF_CODE'])),
            ]);
        }

        return $result;
    }
);

// Добавьте запись с пробелами и заглавными буквами в UF_CODE
$addResult = $dataClass::add([
    'UF_NAME' => 'Промышленное оборудование',
    'UF_CODE' => '  INDUSTRIAL-EQUIPMENT  ',
]);

// Проверьте результат добавления
if (!$addResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $addResult->getErrorMessages())
    );
}

// Прочитайте запись и проверьте сохраненное значение UF_CODE
$record = $dataClass::getById($addResult->getId())->fetch();

if (!$record || $record['UF_CODE'] !== 'industrial-equipment')
{
    throw new \RuntimeException('Обработчик не изменил внешний код');
}
```

## Ограничения обработчиков

Обработчик запускается во время выполнения `add()`, `update()` или `delete()`. ORM-операция продолжится только после завершения обработчика. Исключение из обработчика прерывает текущий PHP-код. Перехватывайте ожидаемые ошибки при работе с внешней системой или переносите такие операции в фоновое задание.

Событие после записи подтверждает успешное выполнение операции динамическим классом, но не делает внешние действия частью одной транзакции. Если обработчик отправил запрос во внешнюю систему, последующий сбой нельзя автоматически откатить средствами события.

Вызов того же метода динамического класса внутри его обработчика запускает соответствующие события повторно. Например, `update()` из `OnAfterUpdate` снова вызовет `OnBeforeUpdate`, `OnUpdate` и `OnAfterUpdate`. Добавьте признак, который показывает, что обработчик уже запущен, или используйте отдельный сервисный контекст. Это предотвратит повторный вызов обработчика.

```php
EventManager::getInstance()->addEventHandler(
    $dataClass,
    DataManager::EVENT_ON_AFTER_UPDATE,
    static function (Event $event) use ($dataClass): void
    {
        static $isRunning = false;

        if ($isRunning)
        {
            return;
        }

        $isRunning = true;

        try
        {
            $primary = $event->getParameter('primary');

            $result = $dataClass::update($primary, [
                'UF_SYNCED' => 1,
            ]);

            if (!$result->isSuccess())
            {
                throw new \RuntimeException(
                    implode('; ', $result->getErrorMessages())
                );
            }
        }
        finally
        {
            $isRunning = false;
        }
    }
);
```

Статическая переменная `$isRunning` действует только внутри текущего PHP-запроса. Для фоновых заданий, повторной доставки сообщений и нескольких процессов храните признак обработки в данных проекта, чтобы его видели все процессы.

Параметр `oldFields` отражает состояние, которое динамический класс прочитал перед обновлением, но не блокирует запись от параллельного изменения. Событие не добавляет проверку версии и не предотвращает потерю изменений. Если несколько процессов могут менять одну запись, настройте блокировку на уровне проекта и повторно прочитайте данные перед `update()`. Подробнее об ограничениях операции читайте в статье [Работа с записями](./records.md#update-record).

## Проверить права доступа {#check-access-permissions}

Правило доступа связывает Highload-блок, код доступа и задачу. Код доступа обозначает пользователя, группу или другую аудиторию подсистемы доступа. Задача объединяет разрешенные операции.

Этот раздел проверяет уже настроенные правила Highload-блока. Создание групп, уровней доступа и общие принципы назначения разрешений описаны в статье [Права доступа](./../../security/access-control.md).

Настраивайте правила в административном интерфейсе или находите задачу через API подсистемы доступа по ее назначению. Не задавайте числовой идентификатор задачи в коде. Значение идентификатора зависит от установки.

Метод `Bitrix\Highloadblock\HighloadBlockRightsTable::getOperationsName()` возвращает операции, разрешенные текущему пользователю для Highload-блока. Метод использует авторизованного пользователя из глобальной переменной `$USER`.

#|
|| **Операция** | **Что разрешает в коде проекта** ||
|| `hl_element_read` | Читать записи ||
|| `hl_element_write` | Добавлять и изменять записи ||
|| `hl_element_delete` | Удалять записи ||
|#

Разрешенные операции действуют на Highload-блок целиком. Они не ограничивают доступ к отдельной записи по владельцу, подразделению, статусу или другому полю. Если проекту нужны такие ограничения, после проверки операции блока отдельно проверьте поля записи и контекст пользователя.

Административные страницы модуля предоставляют администратору полный доступ. В коде проекта сначала проверьте, является ли текущий пользователь администратором. Для остальных пользователей найдите нужную операцию в результате `getOperationsName()`.

**Пример.** Проверьте разрешение на изменение перед вызовом `update()`. Переменная `$recordId` содержит идентификатор изменяемой записи, а `$fields` — проверенный массив новых значений.

```php
use Bitrix\Highloadblock\HighloadBlockRightsTable;

global $USER;

$requiredOperation = 'hl_element_write';
$isAllowed = $USER->IsAdmin();

if (!$isAllowed)
{
    $operationsByBlock = HighloadBlockRightsTable::getOperationsName([
        $highloadBlockId,
    ]);
    $operations = $operationsByBlock[$highloadBlockId] ?? [];

    $isAllowed = in_array($requiredOperation, $operations, true);
}

if (!$isAllowed)
{
    throw new \RuntimeException(
        'Недостаточно прав для изменения записи Highload-блока'
    );
}

$updateResult = $dataClass::update($recordId, $fields);

if (!$updateResult->isSuccess())
{
    throw new \RuntimeException(
        implode('; ', $updateResult->getErrorMessages())
    );
}
```

Для нескольких блоков передайте в `getOperationsName()` массив идентификаторов. Метод вернет массив, где ключ — идентификатор блока, а значение — список разрешенных операций. Если для блока не найдено ни одной операции, ключ этого блока может отсутствовать. Чтобы получить операции конкретного блока, обратитесь к элементу массива по идентификатору `$operationsByBlock[$highloadBlockId] ?? []`.

{% note warning "" %}

Проверка прав и ORM-операция выполняются раздельно. Не используйте только параметры HTTP-запроса для выбора идентификатора блока, записи или требуемой операции. Сначала проверьте входные данные и контекст пользователя, затем право, после этого вызовите динамический класс.

{% endnote %}

### Проверить права в фоновом процессе

Метод `getOperationsName()` зависит от глобального авторизованного пользователя. В агенте, обработчике очереди или консольной команде такого пользователя может не быть.

Для фонового процесса выберите модель доступа заранее:

-  передайте идентификатор пользователя, от имени которого запущена операция, и восстановите его подтвержденный контекст,

-  выполняйте действие от имени отдельного сервисного пользователя и проверяйте его разрешения,

-  разрешите системную операцию правилами собственного сервиса без обращения к глобальному `$USER`.

Не подменяйте отсутствующего пользователя администратором по умолчанию. Запишите пользователя и результат операции в журнал проекта, если сценарий влияет на данные пользователей.

## Проверить права в стандартных компонентах {#check-permissions-in-standard-components}

Компоненты `bitrix:highloadblock.list` и `bitrix:highloadblock.view` поддерживают параметр `CHECK_PERMISSIONS`. Значение `Y` включает проверку правил блока для текущего пользователя. Если доступных операций нет, компонент не выводит данные.

Компоненты проверяют наличие любой операции, а не отдельного кода `hl_element_read`. Если нужна строгая семантика чтения, проверьте `hl_element_read` до подключения компонента.

Подключайте компонент на странице Bitrix Framework, где глобальная переменная `$APPLICATION` уже инициализирована.

```php
$APPLICATION->IncludeComponent(
    'bitrix:highloadblock.list',
    '',
    [
        'BLOCK_ID' => $highloadBlockId,
        'CHECK_PERMISSIONS' => 'Y',
        'ROWS_PER_PAGE' => 20,
    ]
);
```

Параметр компонента защищает только запросы, которые выполняет сам компонент. Он не распространяется на прямые вызовы динамического класса в шаблоне, обработчике AJAX, контроллере или другом PHP-коде. Для таких операций выполните отдельную проверку.
