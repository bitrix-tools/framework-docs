---
title: Как выбрать API задач
description: "Слои PHP API модуля Задачи — команды, провайдеры, контроллер доступа, классические классы и TaskTable, выбор API по задаче и замены классических методов."
---

В модуле Задачи одну и ту же задачу можно создать или прочитать несколькими способами. От выбора API зависит, проверит ли код права сотрудника, обновит ли участников и чат, вызовет ли события модуля. Для нового кода используйте:

-  команды из пространства имен `Bitrix\Tasks\V2\Public\Command` — для записи,

-  провайдер `Bitrix\Tasks\V2\Public\Provider\TaskProvider` — для одной задачи и списков,

-  класс `Bitrix\Tasks\Provider\TaskList` — для подсчета задач и других случаев, которые провайдер не поддерживает,

-  контроллер доступа `Bitrix\Tasks\Access\TaskAccessController` — для проверки прав.

{% note tip "" %}

Назначение задачи, участников, проекта и потока описано в статье [Введение в модуль Задачи](./overview.md).

{% endnote %}

## Определить, где выполняется код {#runtime}

PHP API модуля доступен коду, который выполняется внутри коробочного Битрикс24. Это обработчик события, компонент, контроллер, агент или фоновое задание. Перед вызовом классов модуля подключите [пролог Bitrix Framework](./../../framework/request-lifecycle.md) и модуль через `Loader::includeModule('tasks')`. Полный код подключения модуля есть только в первом примере статьи, в следующих примерах он опущен.

Команды и провайдеры API V2 находятся в папке модуля `lib/V2/Public`. Если в установленном модуле этой папки нет, классы из статьи недоступны.

**Пример.** Код подключает модуль Задачи и проверяет, что в нем есть команды API V2.

```php
use Bitrix\Main\Loader;
use Bitrix\Tasks\V2\Public\Command\Task\AddTaskCommand;

if (!Loader::includeModule('tasks'))
{
    throw new \RuntimeException('Не удалось подключить модуль Задачи');
}

if (!class_exists(AddTaskCommand::class))
{
    throw new \RuntimeException('В модуле Задачи нет API V2');
}
```

Облачный Битрикс24 и приложение на другом сервере не вызывают PHP-классы напрямую. Для них используйте [REST API задач](https://apidocs.bitrix24.ru/api-reference/tasks/index.html).

## Слои API модуля {#api-layers}

В модуле одновременно работают несколько поколений API. Слои различаются тем, что они делают при вызове.

| Слой | Классы | Для чего | Права сотрудника | События и связанные данные |
|---|---|---|---|---|
| Команды | `Bitrix\Tasks\V2\Public\Command\...` | Создают, меняют и удаляют задачи и связанные данные | Не проверяют. Проверьте права до запуска команды | Команды создания, изменения и удаления задачи вызывают события модуля и обновляют участников, чат, счетчики и поиск |
| Провайдеры | `Bitrix\Tasks\V2\Public\Provider\TaskProvider`, `Bitrix\Tasks\Provider\TaskList` | Читают задачу или список задач. `TaskList` нужен для подсчета, пользовательских полей и других случаев, которые не поддерживает `TaskProvider::getList()` | Учитывают по умолчанию. В `TaskProvider::get()` проверку отключает параметр `checkTaskAccess: false` объекта `TaskParams`, в `TaskProvider::getList()` — аргумент `skipAccessCheck: true` объекта `TaskListParams`, в `TaskList` — метод `TaskQuery::skipAccessCheck()` | Не меняют данные задачи |
| Контроллер доступа | `Bitrix\Tasks\Access\TaskAccessController` | Проверяет, может ли сотрудник выполнить действие с задачей | Проверяет | Не меняет данные |
| Классический API | `CTasks`, `CTaskItem` | Поддерживает существующий код | `CTaskItem` по умолчанию проверяет права перед записью. Методы `CTasks::Add()`, `CTasks::Update()` и `CTasks::Delete()` права не проверяют | Передают данные сервисам команд, поэтому вызывают события модуля и обновляют связанные данные |
| Класс ORM | `Bitrix\Tasks\Internals\TaskTable` | Читает строки задач для отчетов и служебных выборок | Не учитывает | Запись через класс не вызывает события модуля и не обновляет связанные данные. Чтение описано в статье [Чтение и выборка задач](./read-tasks.md#tasktable) |

Команды и провайдеры — основной API для нового кода. Классы `CTasks` и `CTaskItem` устарели, но продолжают работать. Внутри они передают данные тем же сервисам, что и команды, поэтому существующий код не нужно переписывать срочно.

{% note warning "" %}

Не меняйте задачи через `TaskTable::add()`, `TaskTable::update()` и `TaskTable::delete()`. Такая запись меняет только строку задачи. Участники, чат, счетчики, поиск и обработчики событий не узнают об изменении. Различия собраны в разделе [Выбрать API для записи](./tasks.md#choose-write-api).

{% endnote %}

## Выбрать API по задаче {#choose-api}

Подберите класс по результату, который должен получить код. Для действий с задачей используйте отдельную команду. Например, у завершения, делегирования и учета времени свои команды.

Короткие имена команд в таблице указаны относительно пространства имен `Bitrix\Tasks\V2\Public\Command\Task`. Модель `TaskModel` находится в пространстве имен `Bitrix\Tasks\Access\Model`.

| Задача | С чего начать |
|---|---|
| Прочитать одну задачу | Провайдер `TaskProvider`, метод `get()`. Без прав на чтение метод возвращает `null`. Подробнее — в статье [Чтение и выборка задач](./read-tasks.md#get-task) |
| Выбрать список задач | Провайдер `TaskProvider`, метод `getList()` с параметрами `TaskListParams`. Метод учитывает права сотрудника `userId`. Подробнее — в статье [Чтение и выборка задач](./read-tasks.md#get-list), готовые выборки — в разделе [Типовые выборки](./read-tasks.md#recipes) |
| Посчитать задачи, выбрать задачи по своему пользовательскому полю или задачи верхнего уровня | Класс `Bitrix\Tasks\Provider\TaskList` и запрос `Bitrix\Tasks\Provider\Query\TaskQuery`. Почему не `getList()` — в разделе [Учесть ограничения getList()](./read-tasks.md#v2-limitations) |
| Посчитать или сгруппировать задачи для отчета без учета прав | Класс ORM `Bitrix\Tasks\Internals\TaskTable`, только чтение. Подробнее — в разделе [Сгруппировать задачи](./read-tasks.md#group-tasks) |
| Создать задачу | Команда `Bitrix\Tasks\V2\Public\Command\Task\AddTaskCommand`. Перед ней проверьте право вызовом `TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_SAVE, null, $model)`, где `$model` — модель `TaskModel::createFromArray($newData)` с данными новой задачи. Подробнее — в статье [Создание, изменение и удаление задач](./tasks.md#create-task) |
| Создать задачу из внешней системы без дублей | Команда `AddTaskCommand` с ключом `xmlId` и проверка по полю `XML_ID` перед созданием. Подробнее — в разделе [Не создавать дубли](./tasks.md#avoid-duplicates) |
| Изменить поля задачи | Команда `Bitrix\Tasks\V2\Public\Command\Task\UpdateTaskCommand`. Перед ней проверьте право вызовом `TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_SAVE, $taskId, $model)`, где `$model` — модель `TaskModel::createFromArray($newData, $current)`, а `$current` — текущие данные задачи. Подробнее — в статье [Создание, изменение и удаление задач](./tasks.md#update-task) |
| Удалить задачу | Команда `Bitrix\Tasks\V2\Public\Command\Task\DeleteTaskCommand`. Перед ней проверьте право `ActionDictionary::ACTION_TASK_REMOVE`. Подробнее — в статье [Создание, изменение и удаление задач](./tasks.md#delete-task) |
| Начать, приостановить, завершить, отложить, возобновить, принять или вернуть на доработку задачу | Команды из пространства имен `Bitrix\Tasks\V2\Public\Command\Task\Status`, например `StartTaskCommand` и `CompleteTaskCommand`. Право для каждой команды указано в статье [Создание, изменение и удаление задач](./tasks.md#status-and-members) |
| Сменить ответственного, соисполнителей или наблюдателей | Команды из пространства имен `Bitrix\Tasks\V2\Public\Command\Task\Stakeholder`, например `DelegateCommand`, `AddAuditorsCommand` и `SetAuditorsCommand`. Команды `Set...` заменяют весь список участников роли. Подробнее — в статье [Создание, изменение и удаление задач](./tasks.md#status-and-members) |
| Написать сообщение в чат задачи | Команда `Bitrix\Tasks\V2\Public\Command\Task\Chat\SendMessageCommand`. Перед ней проверьте право `ActionDictionary::ACTION_TASK_READ`. Подробнее — в статье [Чат, результаты, файлы и учет времени](./chat-and-related-data.md#chat-message) |
| Добавить результат задачи | Команда `Bitrix\Tasks\V2\Public\Command\Task\Result\AddResultCommand`. Перед ней проверьте право `ActionDictionary::ACTION_TASK_READ`. Подробнее — в статье [Чат, результаты, файлы и учет времени](./chat-and-related-data.md#result) |
| Прикрепить или открепить файлы | Команды `Bitrix\Tasks\V2\Public\Command\Task\Attachment\AttachFilesCommand` и `Bitrix\Tasks\V2\Public\Command\Task\Attachment\DetachFilesCommand`. Перед прикреплением проверьте право `ActionDictionary::ACTION_TASK_ATTACH_FILE`, перед откреплением — `ActionDictionary::ACTION_TASK_EDIT`. Подробнее — в статье [Чат, результаты, файлы и учет времени](./chat-and-related-data.md#files) |
| Учесть затраченное время | Команды из пространства имен `Bitrix\Tasks\V2\Public\Command\Task\Tracking`, например `AddElapsedTimeCommand`. Перед добавлением записи проверьте право `ActionDictionary::ACTION_TASK_ELAPSED_TIME`. Подробнее — в статье [Чат, результаты, файлы и учет времени](./chat-and-related-data.md#elapsed-time) |
| Проверить права сотрудника | Метод `TaskAccessController::can()` с действием из `Bitrix\Tasks\Access\ActionDictionary`. Подробнее — в статье [Права доступа к задачам](./permissions.md) |
| Выполнить код при изменении задачи | Обработчик событий `OnTaskAdd`, `OnTaskUpdate`, `OnTaskDelete` и других событий модуля. Параметры событий и регистрация обработчиков описаны в статье [События модуля Задачи](./events.md) |

Для записи и смены участников метод `TaskAccessController::can()` принимает четвертым аргументом модель `Bitrix\Tasks\Access\Model\TaskModel`.

- Перед `AddTaskCommand` передайте `null` вместо ID задачи, потому что ID еще нет, и модель `TaskModel::createFromArray($newData)`. Модель принимает ключи в верхнем регистре, например `CREATED_BY`, `RESPONSIBLE_ID`, `GROUP_ID`.

- Перед `UpdateTaskCommand` передайте ID задачи и модель `TaskModel::createFromArray($newData, $current)`, где второй аргумент — текущие данные задачи. Без модели проверка возвращает `false`.

- Перед командами из `Stakeholder` передайте модель с новыми участниками. Для `DelegateCommand` проверяют `ACTION_TASK_DELEGATE` или `ACTION_TASK_CHANGE_RESPONSIBLE`, для `SetAccomplicesCommand` — `ACTION_TASK_CHANGE_ACCOMPLICES`, для `SetAuditorsCommand` — `ACTION_TASK_SAVE`. Для `AddAuditorsCommand` проверяют `ACTION_TASK_ADD_AUDITORS` и вместо модели передают массив ID новых наблюдателей. Полный список — в разделе [Основные действия](./permissions.md#actions).

### Проверить права и запустить команду {#run-command}

Команда выполняет действие от имени пользователя, ID которого ей передан. Место для ID зависит от семейства команды. Имена пространств имен в таблице указаны относительно `Bitrix\Tasks\V2\Public\Command`.

| Семейство команд | Где передать ID пользователя |
|---|---|
| Создание, изменение и удаление задачи `Task\AddTaskCommand`, `Task\UpdateTaskCommand`, `Task\DeleteTaskCommand` | Ключ `userId` конфигурации `AddConfig`, `UpdateConfig` или `DeleteConfig` в аргументе `config` |
| Смена статуса `Task\Status\...` и участников `Task\Stakeholder\...` | Ключ `userId` конфигурации `UpdateConfig` в аргументе `config` |
| Наблюдение `Task\Audit\WatchTaskCommand`, `Task\Audit\UnwatchTaskCommand` | Аргумент `userId`. ID наблюдателя передают в аргументе `auditorId` |
| Чат `Task\Chat\SendMessageCommand`, результаты `Task\Result\...`, файлы `Task\Attachment\...` | Аргумент `userId` |
| Таймер `Task\Tracking\StartTimerCommand`, `Task\Tracking\StopTimerCommand` | Аргумент `userId` |
| Учет времени `Task\Tracking\AddElapsedTimeCommand`, `UpdateElapsedTimeCommand` | Ключ `userId` массива, из которого метод `Bitrix\Tasks\V2\Internal\Entity\Task\ElapsedTime::mapFromArray()` создает объект для аргумента `elapsedTime`. Для добавления это сотрудник, который потратил время, для изменения — автор записи. Без ключа `userId` команда изменения выбрасывает ошибку `TypeError` |
| Учет времени `Task\Tracking\DeleteElapsedTimeCommand` | ID пользователя не нужен, объекту `ElapsedTime` достаточно ключа `id` записи |
| Отметка пунктов чек-листа `CheckList\CompleteCheckListItemsCommand`, `CheckList\RenewCheckListItemsCommand` | Аргумент `userId` |
| Сохранение чек-листа `CheckList\SaveCheckListCommand` | Аргумент `updatedBy` |

Остальные аргументы команд описаны в статьях [Создание, изменение и удаление задач](./tasks.md) и [Чат, результаты, файлы и учет времени](./chat-and-related-data.md).

Права пользователя из аргументов команда не проверяет. Если действие выполняется по запросу сотрудника, сначала проверьте его право через `TaskAccessController::can()`, затем запустите команду и проверьте результат.

Запуск любой команды состоит из трех шагов.

1. Проверьте право сотрудника методом `TaskAccessController::can()`, если действие выполняется по его запросу.

2. Создайте объект команды с именованными аргументами и вызовите метод `run()`.

3. Проверьте результат методом `isSuccess()`.

Для начала выполнения задачи нужно право `ActionDictionary::ACTION_TASK_START`. Команда `StartTaskCommand` получает ID задачи в аргументе `taskId` и ID пользователя в конфигурации `UpdateConfig` в аргументе `config`.

**Пример.** Код начинает выполнение задачи от имени сотрудника, если у него есть такое право. Переменная `$userId` содержит ID сотрудника, `$taskId` — ID задачи.

```php
use Bitrix\Main\Command\Exception\CommandValidationException;
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\TaskAccessController;
use Bitrix\Tasks\V2\Internal\Service\Task\Action\Update\Config\UpdateConfig;
use Bitrix\Tasks\V2\Public\Command\Task\Status\StartTaskCommand;

if (!TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_START, $taskId))
{
    throw new \RuntimeException('Нет прав на начало выполнения задачи');
}

try
{
    $result = (new StartTaskCommand(
        taskId: $taskId,
        config: new UpdateConfig(userId: $userId),
    ))->run();
}
catch (CommandValidationException $exception)
{
    throw new \RuntimeException('Неверные параметры команды', 0, $exception);
}

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}
```

Метод `run()` возвращает объект результата. Если команда не выполнила действие, метод `isSuccess()` возвращает `false`, а ошибки доступны через `getErrorMessages()`. Ошибку в результат возвращает и обработчик события, который отменил операцию. Если параметры команды не прошли проверку, например ID задачи не положительный, метод `run()` выбрасывает исключение `Bitrix\Main\Command\Exception\CommandValidationException`.

После успешного запуска метод `getObject()` возвращает объект, который сохранила команда, например задачу. Метод `getId()` возвращает ID этого объекта, например ID новой задачи после команды `AddTaskCommand`.

Некоторые команды требуют больше одной проверки прав. Например, перед завершением проверяют и право на завершение, и условие обязательного результата. Такие случаи описаны в разделах [Завершить задачу с результатом](./tasks.md#complete-task) и [Перенести крайний срок](./tasks.md#update-deadline).

Класс `UpdateConfig` относится к пространству имен `V2\Internal`. Полные имена всех конфигураций приведены в разделе [Подготовить данные задачи](./tasks.md#prepare-task-data). Внешний код не использует внутренние классы модуля, но конфигурации и объекты данных команд — исключение. Без них команду не запустить.

## Поддерживать код на классическом API {#classic-api}

В существующем коде встречаются вызовы `CTasks`, `CTaskItem` и связанных классов. Переводите такой код на команды и провайдеры, когда меняете соответствующий сценарий. Для частых вызовов используйте замены из таблицы. Короткие имена команд указаны относительно пространства имен `Bitrix\Tasks\V2\Public\Command\Task`.

| Классический API | Замена | Что учесть |
|---|---|---|
| `CTasks::Add()`, `CTaskItem::add()` | `AddTaskCommand` | Метод `CTasks::Add()` без ключа `USER_ID` действует от имени текущего пользователя, а если его нет — от имени пользователя с ID 1. Команда получает ID пользователя в конфигурации. Пример — в разделе [Создать задачу](./tasks.md#create-task) |
| `CTasks::Update()`, `CTaskItem::update()` | `UpdateTaskCommand` | Метод `CTasks::Update()` без ключа `USER_ID` действует от имени текущего пользователя, а если его нет — от имени пользователя с ID 1. Команда получает ID пользователя в конфигурации. Пример — в разделе [Изменить задачу](./tasks.md#update-task) |
| `CTasks::Delete()`, `CTaskItem::delete()` | `DeleteTaskCommand` | Метод `CTasks::Delete()` не принимает ID пользователя и выполняет удаление от имени текущего пользователя. Если текущего пользователя нет, метод берет ID из `Bitrix\Tasks\Util\User::getAdminId()` — это активный пользователь с наименьшим ID из группы администраторов. Этот запасной вариант отличается от `CTasks::Add()` и `CTasks::Update()`, которые без пользователя действуют от имени пользователя с ID 1. Пример — в разделе [Удалить задачу](./tasks.md#delete-task) |
| `CTasks::GetByID()`, `CTaskItem::getData()` | `TaskProvider::get()` | Провайдер возвращает объект задачи с полями в стиле camelCase, а не массив с ключами в верхнем регистре. Пример — в разделе [Прочитать одну задачу](./read-tasks.md#get-task) |
| `CTasks::GetList()` | `TaskProvider::getList()`, для подсчета и пользовательских полей — `TaskList::getList()` с `TaskQuery` | Права сотрудника учитываются по умолчанию. Соответствие параметров — в разделе [Заменить CTasks::GetList()](./read-tasks.md#classic-getlist-replacements) |
| `CTaskItem::startExecution()`, `pauseExecution()`, `complete()`, `defer()`, `renew()`, `approve()`, `disapprove()` | Команды из пространства имен `Bitrix\Tasks\V2\Public\Command\Task\Status` — `StartTaskCommand`, `PauseTaskCommand`, `CompleteTaskCommand`, `DeferTaskCommand`, `RenewTaskCommand`, `ApproveTaskCommand`, `DisapproveTaskCommand` | Права сотрудника проверьте до запуска команды. Права для каждой команды — в разделе [Сменить статус или участников](./tasks.md#status-and-members) |
| `CTaskItem::delegate()` | `Bitrix\Tasks\V2\Public\Command\Task\Stakeholder\DelegateCommand` | Права сотрудника проверьте до запуска команды. Право — в разделе [Сменить статус или участников](./tasks.md#status-and-members) |
| `CTaskItem::startWatch()`, `stopWatch()` | `Bitrix\Tasks\V2\Public\Command\Task\Audit\WatchTaskCommand`, `Bitrix\Tasks\V2\Public\Command\Task\Audit\UnwatchTaskCommand` | Команды принимают ID задачи в аргументе `taskId`, ID пользователя, от имени которого выполняется действие, в аргументе `userId` и ID наблюдателя в аргументе `auditorId`. Перед запуском проверьте право `ActionDictionary::ACTION_TASK_READ` |
| `CTaskCommentItem::add()` | `Bitrix\Tasks\V2\Public\Command\Task\Chat\SendMessageCommand` | Классический метод возвращает `0` и не создает сообщение, потому что комментарии задачи перенесены в чат. Метод выбрасывает исключение, если автор комментария не совпадает с пользователем объекта `CTaskItem` и у этого пользователя нет права на чтение задачи. Пример — в разделе [Написать сообщение в чат задачи](./chat-and-related-data.md#chat-message) |
| `CTaskItem::checkAccess()`, `CTaskItem::isActionAllowed()` | `TaskAccessController::can()` | Метод `can()` принимает ID пользователя, действие из `Bitrix\Tasks\Access\ActionDictionary` и ID задачи. Подробнее — в разделе [Проверить право](./permissions.md#check-access) |
| `CTaskCheckListItem` | Команды из пространства имен `Bitrix\Tasks\V2\Public\Command\CheckList` — `CompleteCheckListItemsCommand` и `RenewCheckListItemsCommand` для отметки пунктов | Права сотрудника проверьте до запуска команды. Команда `SaveCheckListCommand` сохраняет чек-листы целиком, но формат ее данных в разделе не описан. Подробнее — в разделе [Чек-листы](./chat-and-related-data.md#checklists) |
| `CTaskElapsedItem`, `CTaskElapsedTime` | Команды из пространства имен `Bitrix\Tasks\V2\Public\Command\Task\Tracking` — `AddElapsedTimeCommand`, `UpdateElapsedTimeCommand`, `DeleteElapsedTimeCommand` | Права сотрудника проверьте до запуска команды. Пример — в разделе [Учесть затраченное время](./chat-and-related-data.md#elapsed-time) |
| `CTasks::STATE_*`, `CTasks::PRIORITY_*` | Классы `Bitrix\Tasks\Internals\Task\Status` и `Bitrix\Tasks\Internals\Task\Priority` | Значения констант совпадают с классическими. Объект задачи из провайдера хранит статус в enum `Bitrix\Tasks\V2\Internal\Entity\Task\Status` со строковыми значениями. Подробнее — в статье [Поля, участники и статусы задач](./fields-and-constants.md#statuses) |
| `Bitrix\Tasks\Control\Task` | `AddTaskCommand`, `UpdateTaskCommand`, `DeleteTaskCommand` | Класс устарел. Внутри он передает данные сервисам команд создания, изменения и удаления |
| `Bitrix\Tasks\Item\Task::save()` | `AddTaskCommand`, `UpdateTaskCommand` | Метод устарел. Для новой записи используйте команды |

Как передать модель `Bitrix\Tasks\Access\Model\TaskModel` в проверку прав перед записью, описано в разделе [Выбрать API по задаче](#choose-api).

Классический метод может сам проверять права или подставлять пользователя по умолчанию, а команда этого не делает. При переносе кода добавьте проверку прав и передавайте ID пользователя явно.

## Проверить результат {#check-result}

Перед публикацией кода, который перенесен на команды и провайдеры, выполните в тестовом Битрикс24 несколько проверок.

1. Создайте и измените задачу новым кодом и убедитесь, что участники, чат и уведомления такие же, как при работе через классический метод.

2. Запустите код от имени сотрудника без прав на действие и проверьте, что `can()` вернул `false` и команда не запускалась.

3. Запустите код в агенте и убедитесь, что действие выполняется от имени пользователя из конфигурации, а не пользователя с ID 1.

4. Проверьте, что обработчики событий проекта срабатывают так же, как раньше.

5. Найдите в коде проекта вызовы `TaskTable::add()`, `update()` и `delete()` и замените их командами.
