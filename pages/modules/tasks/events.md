---
title: События модуля Задачи
description: "События модуля Задачи — OnBeforeTaskAdd, OnTaskAdd, OnBeforeTaskUpdate, OnTaskUpdate, OnBeforeTaskDelete, OnTaskDelete и события учета времени. Какие команды вызывают события, подписка в init.php и в модуле, аргументы, изменение полей, отмена операции, фильтр по проекту, защита от рекурсии и ограничения обработчиков."
---

Модуль Задачи вызывает события, когда задачу создают, изменяют или удаляют и когда меняют записи учета времени. Обработчик события может проверить или изменить поля перед сохранением, отменить операцию или выполнить действие после записи, например отправить данные во внешнюю систему.

События вызывают команды и классические методы `CTasks` и `CTaskItem`, потому что классические методы работают через те же сервисы. Создание задачи из шаблона и методы REST тоже работают через эти сервисы, поэтому обработчик срабатывает не только для кода проекта. Запись через класс ORM `TaskTable` событий не вызывает.

События модуля относятся к классическому типу. Обработчик получает аргументы напрямую, поля — массивом по ссылке. Подписывайте обработчики методом `addEventHandlerCompatible()`, отличие от метода `addEventHandler()` описано в разделе [Подписаться на событие](#subscribe). Модуль `tasks` в обработчике подключать не нужно, модуль уже работает, раз вызвал событие. Подключите модуль только там, где код сам обращается к его классам.

## Какие события вызывает запись {#which-events}

Таблица показывает события, которые вызывают команды модуля. Порядок событий в ячейке совпадает с порядком вызова. Команды описаны в статьях [Создание, изменение и удаление задач](./tasks.md) и [Чат, результаты, файлы и учет времени](./chat-and-related-data.md).

| Способ записи | События |
|---|---|
| `AddTaskCommand` | `OnBeforeTaskAdd`, `OnTaskAdd` |
| `UpdateTaskCommand`, `UpdateDeadlineCommand` | `OnBeforeTaskUpdate`, `OnTaskUpdate` |
| Команды статуса, например `StartTaskCommand`, `CompleteTaskCommand` | `OnBeforeTaskUpdate`, `OnTaskUpdate`. В поле `STATUS` новый статус |
| Команды участников, например `DelegateCommand`, `SetAccomplicesCommand` | `OnBeforeTaskUpdate`, `OnTaskUpdate` |
| `AttachFilesCommand`, `DetachFilesCommand`, `RequireResultCommand` | `OnBeforeTaskUpdate`, `OnTaskUpdate` |
| `DeleteTaskCommand` | `OnBeforeTaskDelete`, `OnTaskDelete` |
| Команды учета времени | События из раздела [События учета времени](#elapsed-time-events) |
| `AddResultCommand` | Событий задачи нет. Если автор результата не участник задачи, команда добавляет его в наблюдатели и вызывает `OnBeforeTaskUpdate`, `OnTaskUpdate` |
| `SendMessageCommand` | Событий задачи нет |
| `TaskTable::add()`, `update()`, `delete()` | Событий нет |

## Подписаться на событие {#subscribe}

Обработчик подписывают на событие методом `addEventHandlerCompatible()` объекта `Bitrix\Main\EventManager`. Метод передает обработчику аргументы события как есть, в том числе массив полей по ссылке. Вызов размещают в файле `/local/php_interface/init.php`, чтобы подписка действовала на каждом запросе. Общие правила подписки описаны в статье [События](./../../framework/events.md).

Метод `addEventHandler()` подписывает обработчик нового типа. Какие аргументы получит такой обработчик, зависит от того, как модуль вызывает событие. Функция `ExecuteModuleEventEx()` не учитывает тип подписки.

| Событие или группа событий | Как модуль вызывает | Что получит обработчик `addEventHandler()` |
|---|---|---|
| События задачи | Функцией `ExecuteModuleEventEx()` | Те же аргументы, что и обработчик `addEventHandlerCompatible()` |
| События `OnBefore...` учета времени | Функцией `ExecuteModuleEventEx()` | Те же аргументы, что и обработчик `addEventHandlerCompatible()` |
| `OnTaskElapsedTimeAdd`, `OnTaskElapsedTimeUpdate`, `OnTaskElapsedTimeDelete` из команд | Объектом `Bitrix\Main\Event` | Вместо аргументов один объект `Bitrix\Main\Event`. ID и поля записи возвращает его метод `getParameters()` по ключам `0` и `1` |
| `OnTaskElapsedTimeAdd`, `OnTaskElapsedTimeUpdate`, `OnTaskElapsedTimeDelete` из классического класса `CTaskElapsedTime` | Функцией `ExecuteModuleEventEx()` | Те же аргументы, что и обработчик `addEventHandlerCompatible()` |

Чтобы обработчик получал аргументы одинаково во всех событиях модуля, подписывайте его методом `addEventHandlerCompatible()`.

**Пример.** Код подписывает обработчик на изменение задачи в файле `init.php`. Класс `ProjectTaskLogger` приведен в разделе [Выполнить действие после изменения](#after-events).

```php
use Bitrix\Main\EventManager;
use Partner\Tasks\ProjectTaskLogger;

EventManager::getInstance()->addEventHandlerCompatible(
    'tasks',
    'OnTaskUpdate',
    [ProjectTaskLogger::class, 'onTaskUpdate']
);
```

Класс обработчика должен загружаться автозагрузкой, например автозагрузкой Composer или методом `Bitrix\Main\Loader::registerNamespace()`. Иначе подключите файл класса в `init.php` до подписки.

В собственном модуле подписку сохраняют в базе данных один раз методом `registerEventHandlerCompatible()` в `InstallDB()` установщика модуля, а удаляют методом `unRegisterEventHandler()` в `UnInstallDB()`. У метода удаления нет суффикса `Compatible`, он удаляет подписку любого типа. Метод `registerEventHandlerCompatible()` принимает имя класса и метода, анонимную функцию ему передать нельзя.

**Пример.** Код регистрирует обработчик модуля `partner.tasks` при установке и удаляет его при удалении модуля.

```php
use Bitrix\Main\EventManager;
use Partner\Tasks\ProjectTaskLogger;

// InstallDB()
EventManager::getInstance()->registerEventHandlerCompatible(
    'tasks',
    'OnTaskUpdate',
    'partner.tasks',
    ProjectTaskLogger::class,
    'onTaskUpdate'
);

// UnInstallDB()
EventManager::getInstance()->unRegisterEventHandler(
    'tasks',
    'OnTaskUpdate',
    'partner.tasks',
    ProjectTaskLogger::class,
    'onTaskUpdate'
);
```

Перед вызовом обработчика система подключает модуль `partner.tasks`, поэтому класс обработчика должен загружаться автозагрузкой модуля.

Обработчик вызывается для всех задач Битрикс24. Если он нужен только для задач одного проекта, проверьте поле `GROUP_ID` в начале обработчика, как в примере из раздела [Выполнить действие после изменения](#after-events).

## События задачи {#task-events}

Таблица перечисляет события создания, изменения и удаления задачи и аргументы, которые получает обработчик.

| Событие | Когда вызывается | Аргументы обработчика | Можно отменить |
|---|---|---|---|
| `OnBeforeTaskAdd` | Перед созданием задачи | `&$fields` — поля новой задачи | Да |
| `OnTaskAdd` | После создания задачи | `$id` — ID задачи, `&$fields` — поля задачи, `$params` — параметры операции | Нет |
| `OnBeforeTaskUpdate` | Перед изменением задачи | `$id` — ID задачи, `&$fields` — поля, переданные для изменения, `&$taskData` — текущие данные задачи | Да |
| `OnTaskUpdate` | После изменения задачи | `$id` — ID задачи, `&$fields` — поля, переданные для изменения, `&$taskData` — данные задачи до изменения | Нет |
| `OnBeforeTaskDelete` | Перед удалением задачи | `$id` — ID задачи, `$taskData` — данные задачи, `$params` — параметры удаления, они описаны в списке после таблицы | Да |
| `OnTaskDelete` | После удаления задачи | `$id` — ID задачи, `$params` — параметры операции | Нет |

Поля в аргументах передаются в формате классического API. Ключи записаны в верхнем регистре, например `TITLE`, `RESPONSIBLE_ID`, `DEADLINE`, а статус и приоритет — числами.

Для статуса используйте константы класса `Bitrix\Tasks\Internals\Task\Status`, например `Status::COMPLETED`. Поле `STATUS` в событиях содержит настоящий статус задачи, а не вычисляемое состояние. Крайний срок `DEADLINE` передается объектом `Bitrix\Main\Type\DateTime` или `0`, если срок снят. Соответствие полей и констант приведено в статье [Поля, участники и статусы задач](./fields-and-constants.md).

Кто выполнил операцию и в каком контексте, показывают такие параметры.

-  `OnTaskAdd` — в `$params` ключи `USER_ID` — ID пользователя, от имени которого создана задача, и `FROM_AGENT`, `FROM_WORKFLOW` — `true`, если задачу создал агент или бизнес-процесс.

-  `OnBeforeTaskUpdate` и `OnTaskUpdate` — в `$fields` ключ `CHANGED_BY` — ID пользователя, который изменил задачу.

-  `OnBeforeTaskDelete` — в `$params` массив `byPassParameters` из конфигурации удаления `Bitrix\Tasks\V2\Internal\Service\Task\Action\Delete\Config\DeleteConfig`. По умолчанию массив пустой, ключей `USER_ID` и `FLOW_ID` в нем нет. Не рассчитывайте на этот аргумент, если сами не передаете `byPassParameters` в конфигурацию. ID пользователя берите из `$params` события `OnTaskDelete`.

-  `OnTaskDelete` — в `$params` ключи `USER_ID` — ID пользователя, от имени которого удалена задача, и `FLOW_ID` — ID потока удаленной задачи.

### Изменить поля перед сохранением {#modify-fields}

Обработчики `OnBeforeTaskAdd` и `OnBeforeTaskUpdate` получают поля по ссылке. Изменения, которые обработчик вносит в массив `$fields`, модуль сохранит в задаче.

При изменении задачи в массиве `$fields` есть только переданные поля и служебные ключи. Служебные ключи модуль добавляет до события:

-  `CHANGED_BY` — ID пользователя из конфигурации команды,

-  `CHANGED_DATE` — время изменения,

-  `STATUS_CHANGED_BY` и `STATUS_CHANGED_DATE` — только при смене статуса.

Полей, которые не переданы в команду, в массиве нет, например при смене статуса в массиве нет `TITLE`. Проверяйте наличие ключа перед тем, как его менять. Текущие данные задачи обработчик `OnBeforeTaskUpdate` получает третьим аргументом `$taskData`.

**Пример.** Обработчик убирает пробелы по краям названия задачи перед созданием и изменением. Событие `OnBeforeTaskAdd` передает поля первым аргументом, а `OnBeforeTaskUpdate` — вторым, поэтому у каждого события свой метод.

```php
namespace Partner\Tasks;

class TaskEventHandler
{
    public static function onBeforeTaskAdd(array &$fields): void
    {
        self::trimTitle($fields);
    }

    public static function onBeforeTaskUpdate($id, array &$fields): void
    {
        self::trimTitle($fields);
    }

    private static function trimTitle(array &$fields): void
    {
        if (isset($fields['TITLE']))
        {
            $fields['TITLE'] = trim((string)$fields['TITLE']);
        }
    }
}
```

Подпишите методы на события.

```php
use Bitrix\Main\EventManager;
use Partner\Tasks\TaskEventHandler;

$eventManager = EventManager::getInstance();
$eventManager->addEventHandlerCompatible('tasks', 'OnBeforeTaskAdd', [TaskEventHandler::class, 'onBeforeTaskAdd']);
$eventManager->addEventHandlerCompatible('tasks', 'OnBeforeTaskUpdate', [TaskEventHandler::class, 'onBeforeTaskUpdate']);
```

### Отменить операцию {#before-events}

Чтобы отменить создание, изменение или удаление задачи, обработчик `OnBeforeTaskAdd`, `OnBeforeTaskUpdate` или `OnBeforeTaskDelete` возвращает `false`. Любое другое значение, в том числе отсутствие `return`, операцию не прерывает.

Текст ошибки задайте методом `$APPLICATION->ThrowException()` до возврата. Команда создания или изменения вернет этот текст в ошибке результата, его возвращает метод `getErrorMessages()`. Команда удаления вернет ошибку, но текста из `ThrowException()` в ней не будет.

**Пример.** Обработчик запрещает создавать задачи без крайнего срока. Метод дополняет класс `TaskEventHandler` из раздела [Изменить поля перед сохранением](#modify-fields), остальные методы класса в примере опущены.

```php
namespace Partner\Tasks;

class TaskEventHandler
{
    public static function onBeforeTaskAddCheckDeadline(array &$fields): bool
    {
        global $APPLICATION;

        if (empty($fields['DEADLINE']))
        {
            $APPLICATION->ThrowException('Укажите крайний срок задачи');

            return false;
        }

        return true;
    }
}
```

Подпишите метод на событие `OnBeforeTaskAdd` в `init.php`.

```php
use Bitrix\Main\EventManager;
use Partner\Tasks\TaskEventHandler;

EventManager::getInstance()->addEventHandlerCompatible(
    'tasks',
    'OnBeforeTaskAdd',
    [TaskEventHandler::class, 'onBeforeTaskAddCheckDeadline']
);
```

Если обработчик вернул `false`, задача не создается, а метод `isSuccess()` результата команды [`AddTaskCommand`](./tasks.md#create-task) вернет `false`.

Модуль подставляет крайний срок по умолчанию из настроек пользователя еще до события `OnBeforeTaskAdd`. Если у сотрудника включен срок по умолчанию, поле `DEADLINE` уже заполнено, и пример такую задачу не запретит.

### Выполнить действие после изменения {#after-events}

Обработчики `OnTaskAdd`, `OnTaskUpdate` и `OnTaskDelete` выполняются после записи основных данных задачи. Отменить операцию из них нельзя. Пользовательские поля модуль сохраняет уже после событий `OnTaskAdd` и `OnTaskUpdate`, поэтому их новых значений в обработчике еще нет в базе данных.

В событии `OnTaskUpdate` массив `$fields` содержит поля, переданные для изменения, и служебные поля, например `CHANGED_BY` и `CHANGED_DATE`. Значение переданного поля может совпадать с прежним. Данные задачи до изменения передаются третьим аргументом `$taskData` и дублируются в ключе `META:PREV_FIELDS` массива `$fields`. Сравните новое и прежнее значение, чтобы понять, что именно изменилось.

**Пример.** Обработчик записывает в журнал событий завершение задачи проекта. Если проект задачи в этом изменении не менялся, обработчик берет его из данных до изменения. Подпишите метод `onTaskUpdate()` на событие `OnTaskUpdate` способом из раздела [Подписаться на событие](#subscribe).

```php
namespace Partner\Tasks;

use Bitrix\Tasks\Internals\Task\Status;

class ProjectTaskLogger
{
    private const PROJECT_ID = 12;

    public static function onTaskUpdate($id, array &$fields): void
    {
        $prevFields = $fields['META:PREV_FIELDS'] ?? [];

        $groupId = (int)($fields['GROUP_ID'] ?? $prevFields['GROUP_ID'] ?? 0);
        if ($groupId !== self::PROJECT_ID)
        {
            return;
        }

        $newStatus = (int)($fields['STATUS'] ?? 0);
        $oldStatus = (int)($prevFields['STATUS'] ?? 0);

        if ($newStatus !== Status::COMPLETED || $oldStatus === Status::COMPLETED)
        {
            return;
        }

        \CEventLog::Add([
            'SEVERITY' => 'INFO',
            'AUDIT_TYPE_ID' => 'PARTNER_TASK_COMPLETED',
            'MODULE_ID' => 'main',
            'ITEM_ID' => (int)$id,
            'DESCRIPTION' => 'Задача проекта завершена',
        ]);
    }
}
```

Метод `CEventLog::Add()` принимает ключи записи журнала.

-  `SEVERITY` — уровень записи, например `INFO`.

-  `AUDIT_TYPE_ID` — тип события, по нему записи фильтруют в журнале.

-  `MODULE_ID` — модуль, к которому относится запись.

-  `ITEM_ID` — ID объекта, например задачи.

-  `DESCRIPTION` — текст записи.

Если у задачи включен контроль, команда завершения переводит ее в статус `Status::SUPPOSEDLY_COMPLETED` — ждет контроля постановщика. Статус `Status::COMPLETED` задача получит, когда постановщик примет работу. Пример сработает в этот момент. Если задачу завершает сам постановщик или он же ответственный, задача сразу получает статус `Status::COMPLETED`.

### Не допустить рекурсии {#recursion}

Если обработчик `OnTaskUpdate` сам меняет ту же задачу командой, событие вызовется снова и обработчик зациклится. Защитите обработчик статическим флагом. Флаг сбрасывайте в блоке `finally`, чтобы исключение не оставило обработчик выключенным до конца запроса.

**Пример.** Обработчик добавляет префикс `[Срочно]` к названию задачи, если в нем есть слово «срочно», без повторного вызова обработчика. Подпишите метод `onTaskUpdate()` на событие `OnTaskUpdate` способом из раздела [Подписаться на событие](#subscribe). Методы `disable()` и `enable()` позволяют выключить обработчик снаружи, например на время импорта.

```php
namespace Partner\Tasks;

use Bitrix\Tasks\V2\Internal\Entity\Task;
use Bitrix\Tasks\V2\Internal\Service\Task\Action\Update\Config\UpdateConfig;
use Bitrix\Tasks\V2\Public\Command\Task\UpdateTaskCommand;

class UrgentTitleMarker
{
    private const PREFIX = '[Срочно] ';

    private static bool $isRunning = false;

    public static function disable(): void
    {
        self::$isRunning = true;
    }

    public static function enable(): void
    {
        self::$isRunning = false;
    }

    public static function onTaskUpdate($id, array &$fields): void
    {
        $title = (string)($fields['TITLE'] ?? '');

        if (
            self::$isRunning
            || $title === ''
            || mb_stripos($title, 'срочно') === false
            || str_starts_with($title, self::PREFIX)
        )
        {
            return;
        }

        $userId = (int)($fields['CHANGED_BY'] ?? 0);

        if ($userId <= 0)
        {
            $userId = (int)($fields['META:PREV_FIELDS']['CREATED_BY'] ?? 0);
        }

        if ($userId <= 0)
        {
            return;
        }

        self::$isRunning = true;

        try
        {
            $result = (new UpdateTaskCommand(
                task: Task::mapFromArray([
                    'id' => (int)$id,
                    'title' => self::PREFIX . $title,
                ]),
                config: new UpdateConfig(userId: $userId),
            ))->run();

            if (!$result->isSuccess())
            {
                \CEventLog::Add([
                    'SEVERITY' => 'WARNING',
                    'AUDIT_TYPE_ID' => 'PARTNER_TASK_MARK_FAILED',
                    'MODULE_ID' => 'main',
                    'ITEM_ID' => (int)$id,
                    'DESCRIPTION' => implode(', ', $result->getErrorMessages()),
                ]);
            }
        }
        finally
        {
            self::$isRunning = false;
        }
    }
}
```

Аргументы команды `Bitrix\Tasks\V2\Public\Command\Task\UpdateTaskCommand` и конфигурации `UpdateConfig` описаны в разделе [Изменить задачу](./tasks.md#update-task).

Команда выполняется от имени пользователя, который изменил задачу. ID пользователя код выбирает так:

1. Берет значение ключа `CHANGED_BY`.

2. Если ключа нет или в нем `0`, берет ID постановщика из данных до изменения в ключе `META:PREV_FIELDS`.

3. Если реального ID пользователя нет, ничего не меняет и выходит.

Если изменение должно выполняться от имени служебного пользователя, передайте его ID в `userId` явно.

Вложенная команда тоже вызывает событие, но обработчик видит флаг и сразу выходит. Проверка префикса дополнительно защищает от повторной обработки в следующих запросах.

### Учесть ограничения обработчиков {#handler-limits}

Обработчик выполняется внутри операции записи и задерживает ее. Учитывайте это при выборе действий в обработчике.

-  Обработчик выполняется для каждой задачи, в том числе для задач, которые создают агенты, бизнес-процессы и шаблоны. Тяжелую работу, например запрос во внешний сервис, вынесите в фоновое задание или агент. Способы описаны в статье [Агенты и фоновые задачи](./../../framework/background-jobs.md).

-  Если свой импорт не должен запускать обработчик, выключите его перед импортом и включите после, например методами `UrgentTitleMarker::disable()` и `UrgentTitleMarker::enable()` из раздела [Не допустить рекурсии](#recursion). Вызов `enable()` поместите в блок `finally`.

    **Пример.** Код выключает обработчик `UrgentTitleMarker` на время импорта и включает его обратно, даже если импорт завершился исключением. Функция `importTasks()` условная и обозначает собственный код импорта.

    ```php
    use Partner\Tasks\UrgentTitleMarker;

    UrgentTitleMarker::disable();

    try
    {
        importTasks();
    }
    finally
    {
        UrgentTitleMarker::enable();
    }
    ```

-  Откат транзакции не отменяет внешние действия обработчика — отправленное письмо или запрос в другой сервис. Если изменение выполняется в транзакции, такие действия выполняйте после ее завершения, а не в обработчике.

Перехватывайте исключения внутри обработчика. Исключение класса `Exception`, которое вышло из обработчика, модуль обрабатывает по-разному. Ошибки PHP класса `Error`, например `TypeError`, модуль не перехватывает, и они прерывают операцию.

-  `OnBeforeTaskAdd`, `OnBeforeTaskUpdate`, `OnBeforeTaskDelete` — модуль исключение не перехватывает, и операция прерывается до записи. Команда возвращает ошибку с текстом исключения и записывает исключение в журнал. Данные задачи не меняются.

-  `OnTaskAdd` — модуль записывает исключение в журнал, а задача остается созданной.

-  `OnTaskUpdate` — модуль превращает исключение в ошибку операции. По умолчанию изменения задачи к этому моменту уже сохранены. Метод `isSuccess()` результата команды вернет `false`, хотя новые данные задачи уже записаны в базу данных. Если операция выполняется в транзакции, исключение откатывает изменения. Транзакцию включает параметр `useConsistency: true` конфигурации `UpdateConfig`, например `new UpdateConfig(userId: $userId, useConsistency: true)`.

-  `OnTaskDelete` — модуль исключение не перехватывает. Команда `DeleteTaskCommand` возвращает ошибку с текстом исключения. Событие вызывается до удаления записи задачи, но после переноса в корзину и очистки части связанных данных, поэтому без транзакции задача останется в частично удаленном состоянии. Транзакцию включает параметр `useConsistency: true` конфигурации `Bitrix\Tasks\V2\Internal\Service\Task\Action\Delete\Config\DeleteConfig`, например `new DeleteConfig(userId: $userId, useConsistency: true)`.

## События учета времени {#elapsed-time-events}

События учета времени вызываются при добавлении, изменении и удалении записи о затраченном времени. Команды учета времени описаны в статье [Чат, результаты, файлы и учет времени](./chat-and-related-data.md#elapsed-time).

| Событие | Когда вызывается | Аргументы обработчика | Можно отменить |
|---|---|---|---|
| `OnBeforeTaskElapsedTimeAdd` | Перед добавлением записи | `&$fields` — поля записи | Да |
| `OnTaskElapsedTimeAdd` | После добавления записи | `$id` — ID записи, `$fields` — поля записи | Нет |
| `OnBeforeTaskElapsedTimeUpdate` | Перед изменением записи | `$id` — ID записи, `$currentFields` — текущие поля, `&$fields` — новые поля | Да |
| `OnTaskElapsedTimeUpdate` | После изменения записи | `$id` — ID записи, `$fields` — поля записи | Нет |
| `OnBeforeTaskElapsedTimeDelete` | Перед удалением записи | `$id` — ID записи, `$fields` — поля записи | Да |
| `OnTaskElapsedTimeDelete` | После удаления записи | `$id` — ID записи, `$fields` — поля записи | Нет |

В событии `OnBeforeTaskElapsedTimeUpdate` изменяемые поля приходят третьим аргументом по ссылке, сигнатура обработчика — `onBeforeTaskElapsedTimeUpdate($id, $currentFields, array &$fields)`. Изменения в `$fields` модуль сохранит в записи, второй аргумент `$currentFields` только для чтения.

Поля записи передаются в формате классического API. Команды учета времени передают такие ключи.

-  `ID` — ID записи. При добавлении ключа нет, ID новой записи `OnTaskElapsedTimeAdd` получает первым аргументом.

-  `TASK_ID` — ID задачи.

-  `USER_ID` — ID сотрудника.

-  `SECONDS` и `MINUTES` — затраченное время.

-  `COMMENT_TEXT` — комментарий.

-  `SOURCE` — источник записи, константа класса `CTaskElapsedItem`. `SOURCE_MANUAL` — время введено вручную, `SOURCE_SYSTEM` — запись добавлена автоматически, например при остановке таймера, `SOURCE_UNDEFINED` — источник неизвестен.

-  `CREATED_DATE` — дата создания записи, объект `Bitrix\Main\Type\DateTime`.

-  `DATE_START` и `DATE_STOP` — начало и конец периода работы, объекты `Bitrix\Main\Type\DateTime`.

Список полный. Ключ попадает в массив, только если значение есть в записи. Исключение — ключи `DATE_START` и `DATE_STOP`, они есть всегда.

Затраченное время передается двумя целыми числами. В `SECONDS` время в секундах, в `MINUTES` то же время в минутах, округленное до целого, то есть `round(SECONDS / 60)`. Ключ `SECONDS` главный. Если обработчик `OnBeforeTaskElapsedTimeAdd` или `OnBeforeTaskElapsedTimeUpdate` меняет время, измените `SECONDS`. Модуль берет `MINUTES` и пересчитывает секунды как `MINUTES * 60`, только если ключа `SECONDS` в массиве нет.

Чтобы отменить добавление, изменение или удаление записи, верните из обработчика `OnBefore...` значение `false` и задайте текст ошибки через `$APPLICATION->ThrowException()`. Команда учета времени вернет этот текст в ошибке результата.

**Пример.** Обработчик запрещает добавлять запись учета времени длиннее восьми часов. Метод получает поля записи по ссылке и проверяет ключ `SECONDS`.

```php
namespace Partner\Tasks;

class ElapsedTimeLimiter
{
    private const MAX_SECONDS = 8 * 3600;

    public static function onBeforeTaskElapsedTimeAdd(array &$fields): bool
    {
        global $APPLICATION;

        if ((int)($fields['SECONDS'] ?? 0) > self::MAX_SECONDS)
        {
            $APPLICATION->ThrowException('Запись не может быть длиннее 8 часов');

            return false;
        }

        return true;
    }
}
```

Подпишите метод на событие `OnBeforeTaskElapsedTimeAdd` в `init.php`.

```php
use Bitrix\Main\EventManager;
use Partner\Tasks\ElapsedTimeLimiter;

EventManager::getInstance()->addEventHandlerCompatible(
    'tasks',
    'OnBeforeTaskElapsedTimeAdd',
    [ElapsedTimeLimiter::class, 'onBeforeTaskElapsedTimeAdd']
);
```

Обработчик, зарегистрированный методом `addEventHandlerCompatible()`, получает аргументы событий учета времени в том виде, как они указаны в таблице выше. Чем отличается подписка методом `addEventHandler()`, описано в разделе [Подписаться на событие](#subscribe).

## Комментарии в чате задачи {#comment-events}

Комментарии задачи перенесены в чат. Событие `OnAfterCommentAdd` для сообщений чата модуль вызывает только для обработчиков модуля `rest`. Собственный PHP-обработчик этого события сообщения из чата не получит. Как отправить сообщение в чат задачи, описано в статье [Чат, результаты, файлы и учет времени](./chat-and-related-data.md#chat-message).

## Проверить результат {#check-result}

Перед публикацией кода выполните в тестовом Битрикс24 несколько проверок.

1. Измените задачу в интерфейсе и убедитесь, что обработчик сработал. Интерфейс меняет задачи через те же сервисы, что и команды.

2. Отмените создание задачи из обработчика `OnBeforeTaskAdd` и проверьте, что команда `AddTaskCommand` вернула текст ошибки из `ThrowException()`, а задача не появилась.

3. Смените статус задачи и убедитесь, что обработчик `OnTaskUpdate` получил поле `STATUS`, но не получил поля, которые не менялись.

4. Если обработчик сам меняет задачу, проверьте, что он вызывается один раз за изменение и не зацикливается.

5. Измените задачу другого проекта и убедитесь, что обработчик ее пропустил.

6. Вызовите исключение в обработчике `OnTaskUpdate` и проверьте, как команда сообщает об ошибке.
