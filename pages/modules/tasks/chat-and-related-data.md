---
title: Чат, результаты, файлы и учет времени
description: "Как написать сообщение в чат задачи, добавить, изменить и прочитать результат, прикрепить и открепить файлы с Диска, учесть затраченное время, запустить таймер и отметить пункты чек-листа через команды модуля Задачи."
---

Вокруг задачи хранятся связанные данные — сообщения чата, результаты, файлы, записи учета времени и чек-листы. Для каждого вида данных в модуле есть свои команды из пространства имен `Bitrix\Tasks\V2\Public\Command`. Как и команды изменения задачи, они не проверяют права сотрудника. Если код выполняет действие по запросу сотрудника, сначала проверьте его право.

Таблица связывает задачу разработчика с командой и правом, которое нужно проверить перед ее запуском. Действия прав — константы класса `Bitrix\Tasks\Access\ActionDictionary`.

| Что нужно сделать | Команда из `Bitrix\Tasks\V2\Public\Command\` | Право для проверки |
|---|---|---|
| Написать сообщение в чат | `Task\Chat\SendMessageCommand` | `ACTION_TASK_READ` в `TaskAccessController` |
| Добавить результат | `Task\Result\AddResultCommand` | `ACTION_TASK_READ` в `TaskAccessController` |
| Сделать результат из сообщения чата | `Task\Result\AddResultFromMessageCommand` | `ACTION_TASK_READ` в `TaskAccessController` |
| Изменить результат | `Task\Result\UpdateResultCommand` | `ACTION_RESULT_EDIT` в `ResultAccessController` |
| Удалить результат | `Task\Result\DeleteResultCommand` | `ACTION_RESULT_REMOVE` в `ResultAccessController` |
| Потребовать результат | `Task\Result\RequireResultCommand` | `ACTION_TASK_SAVE` в `TaskAccessController` |
| Прикрепить файлы | `Task\Attachment\AttachFilesCommand` | `ACTION_TASK_ATTACH_FILE` в `TaskAccessController` |
| Открепить файлы | `Task\Attachment\DetachFilesCommand` | `ACTION_TASK_EDIT` в `TaskAccessController` |
| Добавить запись учета времени | `Task\Tracking\AddElapsedTimeCommand` | `ACTION_TASK_ELAPSED_TIME` в `TaskAccessController` |
| Изменить или удалить запись учета времени | `Task\Tracking\UpdateElapsedTimeCommand`, `Task\Tracking\DeleteElapsedTimeCommand` | `ACTION_ELAPSED_TIME_UPDATE` и `ACTION_ELAPSED_TIME_DELETE` в `ElapsedTimeAccessController` |
| Запустить или остановить таймер | `Task\Tracking\StartTimerCommand`, `Task\Tracking\StopTimerCommand` | `ACTION_TASK_TIME_TRACKING` в `TaskAccessController` |
| Отметить пункт чек-листа или снять отметку | `CheckList\CompleteCheckListItemsCommand`, `CheckList\RenewCheckListItemsCommand` | `ACTION_CHECKLIST_TOGGLE` в `TaskAccessController` |
| Сохранить чек-листы задачи целиком | `CheckList\SaveCheckListCommand`. Формат данных команды в статье не описан, не используйте команду без сверки с кодом модуля | `ACTION_CHECKLIST_SAVE` в `TaskAccessController` |

Как устроена проверка прав, описано в статье [Права доступа к задачам](./permissions.md). Общий порядок запуска команды и проверки результата приведен в статье [Как выбрать API задач](./choose-tasks-api.md#run-command).

Все команды статьи работают одинаково. Если аргументы не прошли проверку, например текст пустой или ID не положительный, метод `run()` выбрасывает исключение `Bitrix\Main\Command\Exception\CommandValidationException`. Ошибку при выполнении действия, например запрет обработчика события, команда возвращает в результате, и метод `isSuccess()` возвращает `false`.

Объекты данных команд, например `Message`, `Result` и `ElapsedTime`, относятся к пространству имен `V2\Internal`. Снаружи модуля внутренние классы не используют, но эти классы — исключение, без них команду не запустить. Второе исключение — контроллер прав `Bitrix\Tasks\V2\Internal\Access\Tracking\Elapsed\ElapsedTimeAccessController`. Он проверяет права на изменение и удаление записей учета времени, и публичного аналога у него нет.

Провайдеры из пространства имен `Bitrix\Tasks\V2\Public\Provider` получают зависимости через конструктор:

-  `TaskResultProvider` читает результаты,

-  `TaskElapsedTimeProvider` — записи учета времени,

-  `TimerProvider` — таймер,

-  `CheckListProvider` — чек-листы.

Создайте объект провайдера методом `get()` сервис-локатора [`Bitrix\Main\DI\ServiceLocator`](../../api-reference/main/di/service-locator/index.md), а не оператором `new` — без аргументов конструктора PHP выбросит ошибку `ArgumentCountError`. Подробнее — в статье [Service Locator](./../../framework/service-locator.md).

Перед запуском примеров подключите [пролог Bitrix Framework](./../../framework/request-lifecycle.md) и модуль `tasks`. Полный код подключения приведен в примере из раздела [Написать сообщение в чат задачи](#chat-message), в остальных примерах его нет. Каждый пример ниже предполагает, что модуль `tasks` уже подключен.

Переменная `$userId` в примерах содержит ID сотрудника, от имени которого выполняется действие, `$taskId` — ID задачи. Замените значения на свои.

## Написать сообщение в чат задачи {#chat-message}

Обсуждение задачи идет в ее чате модуля Веб-мессенджер `im`. Сообщение в чат отправляет команда `Bitrix\Tasks\V2\Public\Command\Task\Chat\SendMessageCommand`. Она принимает аргументы `taskId` — ID задачи, `userId` — ID автора и `message` — объект сообщения `Bitrix\Tasks\V2\Internal\Integration\Im\Entity\Message`. Объект собирают методом `Message::mapFromArray()`, текст сообщения передают ключом `text`.

{% note warning "" %}

Классические методы `CTaskCommentItem::add()` и `Bitrix\Tasks\Integration\Forum\Task\Comment::add()` больше не создают комментарии. Они не возвращают ошибку, но сообщение не появляется ни в чате, ни на форуме. Используйте команду `SendMessageCommand`. Подробнее о классических методах — в статье [Как выбрать API задач](./choose-tasks-api.md#classic-api).

{% endnote %}

Команда отправляет сообщение от имени пользователя `userId`. Для отправки достаточно права прочитать задачу `ActionDictionary::ACTION_TASK_READ`. Сама команда права не проверяет, поэтому проверьте его до запуска.

**Пример.** Код отправляет сообщение в чат задачи от имени сотрудника.

```php
use Bitrix\Main\Loader;
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\TaskAccessController;
use Bitrix\Tasks\V2\Internal\Integration\Im\Entity\Message;
use Bitrix\Tasks\V2\Public\Command\Task\Chat\SendMessageCommand;

if (!Loader::includeModule('tasks'))
{
    throw new \RuntimeException('Не удалось подключить модуль Задачи');
}

if (!TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_READ, $taskId))
{
    throw new \RuntimeException('Нет доступа к задаче');
}

$result = (new SendMessageCommand(
    taskId: $taskId,
    userId: $userId,
    message: Message::mapFromArray(['text' => 'Данные по отделу добавлены в отчет']),
))->run();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}
```

Команда передает в чат только текст сообщения. Ключ `fileIds` объекта `Message` она не использует, поэтому файлы этой командой в чат не отправить.

Если текст пустой, метод `run()` выбрасывает исключение `Bitrix\Main\Command\Exception\CommandValidationException`. В примере текст задан в коде и не пустой, поэтому исключение не перехватывается. Если текст приходит извне, оберните `run()` в блок `try/catch`, как в примере из раздела [Прикрепить файл с Диска](#attach-files). Общая схема обработки ошибок команды приведена в статье [Как выбрать API задач](./choose-tasks-api.md#run-command).

Успешный результат команды не гарантирует, что сообщение доставлено. Если у задачи нет чата или модуль Веб-мессенджер не установлен, сообщение не отправляется, а команда все равно возвращает успех. Чат есть у задач, созданных командой `AddTaskCommand`. Для старой задачи сначала прочитайте ее через провайдер `Bitrix\Tasks\V2\Public\Provider\TaskProvider`, как описано в статье [Чтение и выборка задач](./read-tasks.md#get-task). Провайдер создает чат, если его нет, и возвращает его ID в свойстве `chatId`.

Сообщения чата хранит модуль `im`, и свой PHP-обработчик события `OnAfterCommentAdd` их не получает. Подробнее — в статье [События модуля Задачи](./events.md#comment-events).

## Результаты задачи {#result}

Результат фиксирует итог работы по задаче. Сотрудник добавляет результат перед завершением, а постановщик может сделать результат обязательным. Команды результатов находятся в пространстве имен `Bitrix\Tasks\V2\Public\Command\Task\Result` и принимают объект результата `Bitrix\Tasks\V2\Internal\Entity\Result`. Объект собирают методом `Result::mapFromArray()`.

Класс результата задачи совпадает по короткому имени с результатом команды. В примерах он подключен под псевдонимом `TaskResult`.

### Добавить результат {#add-result}

Команда `AddResultCommand` добавляет результат. Она принимает аргументы `result` — объект результата и `userId` — ID автора. В объект передайте ключи ниже.

*Обязательные ключи обозначены \*.*

- `taskId`* — ID задачи, целое число.

- `text` — текст результата, строка.

- `fileIds` — файлы с Диска, массив строк вида `n512`. Формат описан в разделе [Прикрепить файл с Диска](#attach-files).

Результат должен содержать текст или хотя бы один файл. Если текст пустой и файлов нет, команда вернет ошибку. Пустым считается и текст, в котором только пустые абзацы BBCode `[p][/p]`.

Перед добавлением результата по запросу сотрудника проверьте, что он может прочитать задачу, — `ActionDictionary::ACTION_TASK_READ`. Каждый запуск команды создает новый результат.

**Пример.** Код проверяет право и добавляет результат к задаче.

```php
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\TaskAccessController;
use Bitrix\Tasks\V2\Internal\Entity\Result as TaskResult;
use Bitrix\Tasks\V2\Public\Command\Task\Result\AddResultCommand;

if (!TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_READ, $taskId))
{
    throw new \RuntimeException('Нет доступа к задаче');
}

$result = (new AddResultCommand(
    result: TaskResult::mapFromArray([
        'taskId' => $taskId,
        'text' => 'Отчет за квартал подготовлен и отправлен руководителю',
    ]),
    userId: $userId,
))->run();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}

$resultId = (int)$result->getId();
```

При успехе метод `getId()` результата команды возвращает ID созданного результата, а метод `getObject()` — объект результата. Кроме записи результата команда выполняет несколько действий.

| Что происходит | Что учесть |
|---|---|
| Автором результата становится пользователь `userId` | Автора нельзя указать в объекте результата. Чтобы результат добавил другой сотрудник, передайте его ID в аргументе `userId` |
| В чат задачи приходит уведомление о результате | Чтобы не отправлять уведомление, передайте в команду аргумент `skipNotification: true`. Аргумент логический, по умолчанию `false`. У команд `UpdateResultCommand` и `DeleteResultCommand` такого аргумента нет |
| Если автор не участник задачи, модуль добавляет его в наблюдатели | Добавление наблюдателя меняет задачу и вызывает события `OnBeforeTaskUpdate` и `OnTaskUpdate`. Обработчики проекта получат это изменение |
| Новый результат открыт | Открытый последний результат разрешает завершить задачу с обязательным результатом |

Чтобы добавить результат и сразу завершить задачу, используйте порядок проверок из раздела [Завершить задачу с результатом](./tasks.md#complete-task) статьи о создании и изменении задач.

### Изменить или удалить результат {#update-delete-result}

Команда `UpdateResultCommand` меняет результат, а команда `DeleteResultCommand` удаляет его. Обе принимают аргументы `result` — объект результата с ключом `id` и `userId` — ID сотрудника. Для изменения передайте в объект новые значения ключей `text` или `fileIds`. Ключи, которых нет в объекте, сохраняют прежние значения, а автор и задача результата не меняются.

Права на результат проверяет контроллер `Bitrix\Tasks\Access\ResultAccessController`. Третьим аргументом его метода `can()` передают ID результата, а не ID задачи.

- `ACTION_RESULT_EDIT` — изменить результат может только его автор.

- `ACTION_RESULT_REMOVE` — удалить результат может автор и администратор.

**Пример.** Код проверяет право и меняет текст результата. Переменная `$resultId` содержит ID результата.

```php
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\ResultAccessController;
use Bitrix\Tasks\V2\Internal\Entity\Result as TaskResult;
use Bitrix\Tasks\V2\Public\Command\Task\Result\UpdateResultCommand;

if (!ResultAccessController::can($userId, ActionDictionary::ACTION_RESULT_EDIT, $resultId))
{
    throw new \RuntimeException('Изменить результат может только его автор');
}

$result = (new UpdateResultCommand(
    result: TaskResult::mapFromArray([
        'id' => $resultId,
        'text' => 'Отчет за квартал подготовлен, замечания руководителя учтены',
    ]),
    userId: $userId,
))->run();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}
```

Если результата с таким ID нет, команда `UpdateResultCommand` возвращает ошибку. Команда `DeleteResultCommand` в этом случае ничего не делает и возвращает успех. После изменения и удаления в чат задачи приходит уведомление.

**Пример.** Код проверяет право и удаляет результат. Для удаления в объекте результата достаточно ключа `id`.

```php
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\ResultAccessController;
use Bitrix\Tasks\V2\Internal\Entity\Result as TaskResult;
use Bitrix\Tasks\V2\Public\Command\Task\Result\DeleteResultCommand;

if (!ResultAccessController::can($userId, ActionDictionary::ACTION_RESULT_REMOVE, $resultId))
{
    throw new \RuntimeException('Нет прав на удаление результата');
}

$result = (new DeleteResultCommand(
    result: TaskResult::mapFromArray(['id' => $resultId]),
    userId: $userId,
))->run();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}
```

### Сделать результат из сообщения чата {#result-from-message}

Команда `Bitrix\Tasks\V2\Public\Command\Task\Result\AddResultFromMessageCommand` превращает сообщение чата задачи в результат. Она принимает аргументы `userId` — ID автора результата и `messageId` — ID сообщения. Текст и файлы сообщения переходят в результат. Если сообщение не найдено или отправлено не в чат задачи, команда возвращает ошибку.

ID задачи команда не принимает. Модуль берет его из чата сообщения — у чата задачи тип сущности `TASKS_TASK`, а ID задачи хранится в его поле `ENTITY_ID`. Перед запуском по запросу сотрудника получите ID задачи так же и проверьте право `ACTION_TASK_READ` для этой задачи.

Чат сообщения возвращает метод `getChat()` объекта `\Bitrix\Im\V2\Message`. Класс относится к модулю Веб-мессенджер, поэтому перед вызовом подключите модуль `im`. Если сообщения с таким ID нет, конструктор не выбрасывает исключение, а `getChat()` возвращает пустой чат `\Bitrix\Im\V2\Chat\NullChat`. Тип сущности у такого чата не равен `TASKS_TASK`, поэтому проверка типа в примере отсекает и несуществующие сообщения. Если код получил сообщение из чата известной задачи, ID задачи у него уже есть.

**Пример.** Код находит задачу по сообщению чата, проверяет право и делает результат из сообщения. Переменная `$messageId` содержит ID сообщения.

```php
use Bitrix\Im\V2\Message;
use Bitrix\Main\Loader;
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\TaskAccessController;
use Bitrix\Tasks\V2\Public\Command\Task\Result\AddResultFromMessageCommand;

if (!Loader::includeModule('im'))
{
    throw new \RuntimeException('Не удалось подключить модуль Веб-мессенджер');
}

$chat = (new Message($messageId))->getChat();

if ($chat->getEntityType() !== 'TASKS_TASK')
{
    throw new \RuntimeException('Сообщение не из чата задачи');
}

$taskId = (int)$chat->getEntityId();

if (!TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_READ, $taskId))
{
    throw new \RuntimeException('Нет доступа к задаче');
}

$result = (new AddResultFromMessageCommand(
    userId: $userId,
    messageId: $messageId,
))->run();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}
```

### Потребовать результат {#require-result}

Команда `RequireResultCommand` включает или выключает обязательный результат. Она принимает аргументы `taskId` — ID задачи, `userId` — ID пользователя и `require` — `true`, чтобы включить требование, или `false`, чтобы выключить. Команда меняет задачу, поэтому вызывает события `OnBeforeTaskUpdate` и `OnTaskUpdate`. Перед запуском проверьте право изменить задачу `ActionDictionary::ACTION_TASK_SAVE`.

**Пример.** Код проверяет право изменить задачу и включает обязательный результат. Модель прав собрана из текущих данных задачи, как описано в разделе [Проверить права сотрудника](./tasks.md#check-permissions). Метод `Bitrix\Tasks\Access\Model\TaskModel::createFromArray()` принимает первым аргументом новые значения полей, вторым — текущие. Пустой первый массив означает, что новых значений нет и модель строится по текущим данным задачи. Подробнее — в разделе [Передать новые данные в проверку](./permissions.md#task-model).

```php
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\Model\TaskModel;
use Bitrix\Tasks\Access\TaskAccessController;
use Bitrix\Tasks\Internals\TaskTable;
use Bitrix\Tasks\V2\Public\Command\Task\Result\RequireResultCommand;

$current = TaskTable::getRow([
    'select' => ['ID', 'CREATED_BY', 'RESPONSIBLE_ID', 'GROUP_ID'],
    'filter' => ['=ID' => $taskId],
]);

if ($current === null)
{
    throw new \RuntimeException('Задача не найдена');
}

$model = TaskModel::createFromArray([], $current);

if (!TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_SAVE, $taskId, $model))
{
    throw new \RuntimeException('Нет прав на изменение задачи');
}

$result = (new RequireResultCommand(
    taskId: $taskId,
    userId: $userId,
    require: true,
))->run();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}
```

Если результат обязателен, сотрудник не сможет завершить задачу без открытого результата. Это не касается постановщика и администратора. Запрет действует только через проверку права `ActionDictionary::ACTION_TASK_COMPLETE_RESULT`, а команда `CompleteTaskCommand` его не проверяет. Порядок проверок перед завершением приведен в разделе [Завершить задачу с результатом](./tasks.md#complete-task).

Когда задача получает статус «Завершена» или «Ждет контроля постановщика», модуль закрывает все открытые результаты задачи. Если задачу возобновить, прежние результаты останутся закрытыми. Чтобы завершить ее снова при обязательном результате, сотруднику нужен новый результат.

### Прочитать результаты задачи {#read-results}

Метод `getTaskResults()` провайдера `Bitrix\Tasks\V2\Public\Provider\TaskResultProvider` возвращает результаты задачи. Метод принимает аргументы `taskId` — ID задачи и `userId` — ID сотрудника и возвращает коллекцию результатов `Bitrix\Tasks\V2\Internal\Entity\ResultCollection`. Каждый элемент коллекции — объект результата со свойствами ниже.

- `id` — ID результата.

- `text` — текст результата.

- `author` — объект пользователя, ID автора находится в его свойстве `id`.

- `createdAtTs` — дата создания как метка времени Unix.

- `status` — статус, значение перечисления `Bitrix\Tasks\V2\Internal\Entity\Result\Status`. Значение `Open` — результат открыт, `Closed` — закрыт после завершения задачи.

- `fileIds` — ID файлов результата.

Метод не проверяет право сотрудника на чтение задачи. Перед вызовом по запросу сотрудника проверьте право `ActionDictionary::ACTION_TASK_READ`.

**Пример.** Код выводит тексты и авторов результатов задачи.

```php
use Bitrix\Main\DI\ServiceLocator;
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\TaskAccessController;
use Bitrix\Tasks\V2\Public\Provider\TaskResultProvider;

if (!TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_READ, $taskId))
{
    throw new \RuntimeException('Нет доступа к задаче');
}

$provider = ServiceLocator::getInstance()->get(TaskResultProvider::class);
$results = $provider->getTaskResults(taskId: $taskId, userId: $userId);

foreach ($results as $taskResult)
{
    echo $taskResult->author?->id . ': ' . $taskResult->text . PHP_EOL;
}
```

## Прикрепить и открепить файлы {#files}

Файлы задачи хранит модуль Диск `disk`. Задача хранит ссылки на файлы в пользовательском поле `UF_TASK_WEBDAV_FILES`.

Чтобы прочитать список файлов, прочитайте задачу через провайдер с ключом `userFields` — ID вложений находятся в свойстве `fileIds`. Без ключа `userFields` свойство остается пустым. Это значения поля `UF_TASK_WEBDAV_FILES`, а не ID файлов на Диске, поэтому в команду `AttachFilesCommand` их не передают. Подробнее о системных полях — в статье [Поля, участники и статусы задач](./fields-and-constants.md#user-fields).

Команды прикрепления и открепления находятся в пространстве имен `Bitrix\Tasks\V2\Public\Command\Task\Attachment`. Обе команды меняют поле файлов задачи командой изменения задачи. Поэтому каждый запуск вызывает события `OnBeforeTaskUpdate` и `OnTaskUpdate`, и обработчик может отменить изменение. Подробнее о событиях — в статье [События модуля Задачи](./events.md#task-events).

### Прикрепить файл с Диска {#attach-files}

Команда `AttachFilesCommand` прикрепляет файлы к задаче. Она принимает аргументы `taskId` — ID задачи и `userId` — ID пользователя, целые числа, и `fileIds` — массив файлов. Каждый элемент массива — строка из префикса `n` и ID файла на Диске, например `n512`. ID файла на Диске — это ID объекта `Bitrix\Disk\File`. Сначала загрузите файл на Диск, затем передайте его ID в команду. Загрузка файлов на Диск в этой статье не описывается.

Команда добавляет новые файлы к уже прикрепленным, прежние файлы остаются в задаче. Каждый запуск создает новое вложение, даже для файла, который уже прикреплен. Чтобы не прикрепить файл дважды, сначала сравните его со списком вложений задачи.

Перед прикреплением по запросу сотрудника проверьте право `ActionDictionary::ACTION_TASK_ATTACH_FILE`. Команда `AttachFilesCommand` это право не проверяет.

**Пример.** Код проверяет право и прикрепляет к задаче файл с Диска.

```php
use Bitrix\Main\Command\Exception\CommandValidationException;
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\TaskAccessController;
use Bitrix\Tasks\V2\Public\Command\Task\Attachment\AttachFilesCommand;

if (!TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_ATTACH_FILE, $taskId))
{
    throw new \RuntimeException('Нет прав на прикрепление файлов');
}

try
{
    $result = (new AttachFilesCommand(
        taskId: $taskId,
        userId: $userId,
        fileIds: ['n512'],
    ))->run();
}
catch (CommandValidationException $exception)
{
    throw new \RuntimeException('Неверный формат ID файлов или не установлен модуль Диск');
}

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}
```

Если модуль Диск не установлен или элемент массива не начинается с `n`, метод `run()` выбрасывает исключение `Bitrix\Main\Command\Exception\CommandValidationException`. Если обработчик события `OnBeforeTaskUpdate` отменил изменение, команда вернет ошибку в результате.

### Открепить файл {#detach-files}

Команда `DetachFilesCommand` открепляет файлы. Она принимает аргументы `taskId` и `userId` — целые числа и `fileIds` — массив ID вложений. ID вложений возвращает свойство `fileIds` задачи. Строка с префиксом `n` и ID файла на Диске файл не открепляет, хотя команда возвращает успех. Вложения, которых нет в массиве, остаются в задаче.

Для открепления в модуле есть право `ActionDictionary::ACTION_TASK_DETACH_FILE`. Его проверка требует данных вложений из модуля Диск, как описано в разделе [Открепить файлы](./permissions.md#detach-file) статьи о правах. Команда `DetachFilesCommand` это право не проверяет. Сотрудник с правом `ActionDictionary::ACTION_TASK_EDIT` может открепить любые файлы задачи, поэтому в своем коде проверьте `ACTION_TASK_EDIT`. Если проверка не прошла, не выполняйте открепление по запросу сотрудника.

**Пример.** Код проверяет право и открепляет от задачи все вложения. ID вложений код читает из свойства `fileIds` задачи.

```php
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\TaskAccessController;
use Bitrix\Tasks\V2\Public\Command\Task\Attachment\DetachFilesCommand;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskParams;
use Bitrix\Tasks\V2\Public\Provider\TaskProvider;

if (!TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_EDIT, $taskId))
{
    throw new \RuntimeException('Нет прав на открепление файлов');
}

$task = (new TaskProvider())->get(TaskParams::mapFromIds($taskId, $userId, ['userFields' => true]));
$attachmentIds = array_map('strval', $task?->fileIds ?? []);

$result = (new DetachFilesCommand(
    taskId: $taskId,
    userId: $userId,
    fileIds: $attachmentIds,
))->run();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}
```

Без модуля Диск команда `DetachFilesCommand` ничего не делает и возвращает успех. Успех она возвращает и тогда, когда у задачи нет прикрепленных файлов. Проверьте свойство `fileIds` задачи после открепления, если коду важно, что файл действительно откреплен.

## Учесть затраченное время {#elapsed-time}

Запись учета времени хранит, сколько времени сотрудник потратил на задачу. Записи добавляют вручную или через таймер, который сам создает запись при остановке. Команды учета времени находятся в пространстве имен `Bitrix\Tasks\V2\Public\Command\Task\Tracking`. Каждое добавление, изменение и удаление записи вызывает события учета времени, они описаны в статье [События модуля Задачи](./events.md#elapsed-time-events).

### Добавить запись {#add-elapsed-time}

Команда `AddElapsedTimeCommand` добавляет запись. Она принимает аргумент `elapsedTime` — объект `Bitrix\Tasks\V2\Internal\Entity\Task\ElapsedTime`, который собирают методом `ElapsedTime::mapFromArray()` из ключей ниже.

*Обязательные ключи обозначены \*.*

- `taskId`* — ID задачи, целое число.

- `userId`* — ID сотрудника, который потратил время, целое число.

- `seconds` или `minutes` — затраченное время в секундах или в минутах, целое число. Обязателен один из этих двух ключей. Если передать оба, модуль использует `seconds`, а `minutes` вычисляет из них.

- `createdAtTs`* — дата записи как метка времени Unix, целое число. Без нее команда вернет ошибку.

- `text` — комментарий к записи, строка.

- `startTs` — время начала работы как метка времени Unix, целое число. Если ключ не передан, модуль записывает текущее время.

- `stopTs` — время окончания работы как метка времени Unix, целое число. Если ключ не передан, модуль записывает текущее время.

Перед добавлением записи по запросу сотрудника проверьте право `ActionDictionary::ACTION_TASK_ELAPSED_TIME`. При успехе метод `getId()` результата команды возвращает ID созданной записи.

**Пример.** Код проверяет право и добавляет запись о полутора часах работы.

```php
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\TaskAccessController;
use Bitrix\Tasks\V2\Internal\Entity\Task\ElapsedTime;
use Bitrix\Tasks\V2\Public\Command\Task\Tracking\AddElapsedTimeCommand;

if (!TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_ELAPSED_TIME, $taskId))
{
    throw new \RuntimeException('Нет прав на учет времени');
}

$result = (new AddElapsedTimeCommand(
    elapsedTime: ElapsedTime::mapFromArray([
        'taskId' => $taskId,
        'userId' => $userId,
        'seconds' => 5400,
        'text' => 'Сбор данных',
        'createdAtTs' => time(),
    ]),
))->run();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}
```

Если обработчик события `OnBeforeTaskElapsedTimeAdd` вернул `false`, запись не создается и команда возвращает ошибку.

### Изменить или удалить запись {#update-elapsed-time}

Команда `UpdateElapsedTimeCommand` меняет запись, а команда `DeleteElapsedTimeCommand` удаляет ее. Обе принимают аргумент `elapsedTime` — объект `ElapsedTime` с ключом `id` записи. Для изменения передайте в объект новые значения ключей `seconds` или `minutes` и `text`.

Таблица описывает, как команда `UpdateElapsedTimeCommand` записывает переданные значения.

| Что происходит | Что учесть |
|---|---|
| Команда записывает только переданные ключи | Ключи `seconds`, `minutes`, `text` и `userId`, которых нет в объекте, сохраняют прежние значения |
| Даты начала и окончания работы перезаписываются | Если не передать ключи `startTs` и `stopTs`, команда запишет в них текущее время. Чтобы сохранить даты, прочитайте запись и передайте ее значения |
| Команда пишет изменение в историю задачи от имени сотрудника из ключа `userId` | Передавайте ключ `userId` всегда, обычно ID автора записи. Без него команда сохраняет запись, а затем выбрасывает ошибку `TypeError` |
| Задачу записи изменить нельзя | Ключ `taskId` команда игнорирует |
| Если записи с таким ID нет, команда возвращает ошибку | Команда `DeleteElapsedTimeCommand` в этом случае тоже возвращает ошибку |

Права на изменение и удаление записи проверяет не `TaskAccessController`, а отдельный контроллер `Bitrix\Tasks\V2\Internal\Access\Tracking\Elapsed\ElapsedTimeAccessController`. Третьим аргументом его метода `can()` передают ID записи учета времени, а не ID задачи. Изменить и удалить запись может только сотрудник, чье время записано, и администратор. Подробнее — в разделе [Изменить или удалить запись учета времени](./permissions.md#elapsed-time-access) статьи о правах.

**Пример.** Код проверяет право и меняет время и комментарий записи. Переменная `$elapsedTimeId` содержит ID записи. Автора и прежние даты записи код читает методом `getById()` провайдера `TaskElapsedTimeProvider`, он описан в разделе [Прочитать записи учета времени](#read-elapsed-time).

```php
use Bitrix\Main\DI\ServiceLocator;
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\V2\Internal\Access\Tracking\Elapsed\ElapsedTimeAccessController;
use Bitrix\Tasks\V2\Internal\Entity\Task\ElapsedTime;
use Bitrix\Tasks\V2\Public\Command\Task\Tracking\UpdateElapsedTimeCommand;
use Bitrix\Tasks\V2\Public\Provider\TaskElapsedTimeProvider;

if (!ElapsedTimeAccessController::can($userId, ActionDictionary::ACTION_ELAPSED_TIME_UPDATE, $elapsedTimeId))
{
    throw new \RuntimeException('Нет прав на изменение записи учета времени');
}

$record = ServiceLocator::getInstance()
    ->get(TaskElapsedTimeProvider::class)
    ->getById(elapsedTimeId: $elapsedTimeId, userId: $userId);

if ($record === null)
{
    throw new \RuntimeException('Запись учета времени не найдена');
}

$result = (new UpdateElapsedTimeCommand(
    elapsedTime: ElapsedTime::mapFromArray([
        'id' => $elapsedTimeId,
        'userId' => $record->userId,
        'seconds' => 7200,
        'text' => 'Сбор и проверка данных',
        'startTs' => $record->startTs,
        'stopTs' => $record->stopTs,
    ]),
))->run();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}
```

**Пример.** Код проверяет право и удаляет запись учета времени. Для удаления в объекте `ElapsedTime` достаточно ключа `id`.

```php
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\V2\Internal\Access\Tracking\Elapsed\ElapsedTimeAccessController;
use Bitrix\Tasks\V2\Internal\Entity\Task\ElapsedTime;
use Bitrix\Tasks\V2\Public\Command\Task\Tracking\DeleteElapsedTimeCommand;

if (!ElapsedTimeAccessController::can($userId, ActionDictionary::ACTION_ELAPSED_TIME_DELETE, $elapsedTimeId))
{
    throw new \RuntimeException('Нет прав на удаление записи учета времени');
}

$result = (new DeleteElapsedTimeCommand(
    elapsedTime: ElapsedTime::mapFromArray(['id' => $elapsedTimeId]),
))->run();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}
```

### Запустить и остановить таймер {#timer}

Команда `StartTimerCommand` запускает таймер сотрудника по задаче, а команда `StopTimerCommand` останавливает его. Обе принимают аргументы `userId` — ID сотрудника и `taskId` — ID задачи. Перед запуском по запросу сотрудника проверьте право `ActionDictionary::ACTION_TASK_TIME_TRACKING`.

Право `ACTION_TASK_TIME_TRACKING` проверка дает, только если в задаче включен учет времени. Флаг хранит ключ `allowsTimeTracking` объекта задачи. Включите его при создании или изменении задачи, например `Task::mapFromArray(['id' => $taskId, 'allowsTimeTracking' => true])` в команде `UpdateTaskCommand`. Без флага проверка возвращает `false` даже для ответственного.

У сотрудника работает только один таймер. Учтите, как команды меняют данные.

- Запуск таймера по новой задаче останавливает таймер по предыдущей задаче. Время предыдущего таймера записывается в учет времени.

- Аргумент `canStart` команды `StartTimerCommand` — логическое значение, по умолчанию `false`. Повторный запуск по той же задаче без `canStart: true` не перезапускает таймер, команда возвращает уже работающий таймер. С `canStart: true` команда останавливает текущий таймер, записывает его время в учет времени и запускает таймер заново. Кроме того, с `canStart: true` команда переводит задачу в статус «Выполняется», если у задачи другой статус.

- Остановка таймера создает запись учета времени. Это вызывает событие `OnTaskElapsedTimeAdd`.

**Пример.** Код запускает таймер по задаче.

```php
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\TaskAccessController;
use Bitrix\Tasks\V2\Public\Command\Task\Tracking\StartTimerCommand;

if (!TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_TIME_TRACKING, $taskId))
{
    throw new \RuntimeException('Нет прав на запуск таймера');
}

$result = (new StartTimerCommand(
    userId: $userId,
    taskId: $taskId,
))->run();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}
```

**Пример.** Код проверяет право `ACTION_TASK_TIME_TRACKING` и останавливает таймер сотрудника по задаче. Это же право модуль проверяет при запуске и остановке таймера в своем контроллере.

```php
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\TaskAccessController;
use Bitrix\Tasks\V2\Public\Command\Task\Tracking\StopTimerCommand;

if (!TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_TIME_TRACKING, $taskId))
{
    throw new \RuntimeException('Нет прав на остановку таймера');
}

$result = (new StopTimerCommand(
    userId: $userId,
    taskId: $taskId,
))->run();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}
```

Активный таймер сотрудника возвращает метод `getActiveTimer()` провайдера `Bitrix\Tasks\V2\Public\Provider\TimerProvider`. Объект провайдера получают методом `ServiceLocator::getInstance()->get(TimerProvider::class)`. Метод `getActiveTimer()` принимает аргумент `userId` — ID сотрудника и возвращает объект таймера `Bitrix\Tasks\V2\Internal\Entity\Task\Timer` со свойствами `taskId` и `startedAtTs` или `null`, если таймер не запущен.

**Пример.** Код получает ID задачи, по которой у сотрудника работает таймер.

```php
use Bitrix\Main\DI\ServiceLocator;
use Bitrix\Tasks\V2\Public\Provider\TimerProvider;

$timer = ServiceLocator::getInstance()->get(TimerProvider::class)->getActiveTimer($userId);

$activeTaskId = $timer?->taskId;
```

### Прочитать записи учета времени {#read-elapsed-time}

Провайдер `Bitrix\Tasks\V2\Public\Provider\TaskElapsedTimeProvider` возвращает записи учета времени задачи.

- `getList()` — возвращает записи задачи, коллекцию `Bitrix\Tasks\V2\Internal\Entity\Task\ElapsedTimeCollection`. Принимает обязательные аргументы `taskId`, `userId` и `pager` — объект постраничной навигации `Bitrix\Main\Provider\Params\Pager`, значения по умолчанию у `pager` нет. Необязательный аргумент `order` задает сортировку, по умолчанию `['ID' => 'DESC']` — от новых записей к старым.

- `getById()` — возвращает одну запись по ID или `null`. Принимает аргументы `elapsedTimeId` — ID записи и `userId` — ID сотрудника, целые числа.

- `getTimeSpentOnTask()` — возвращает сумму времени по задаче в секундах. Принимает аргумент `taskId` — ID задачи, целое число.

Каждая запись — объект `ElapsedTime` со свойствами `id`, `userId`, `seconds`, `text`, `createdAtTs`, `startTs` и `stopTs`. Методы провайдера не проверяют право сотрудника на чтение задачи. Перед вызовом по запросу сотрудника проверьте право `ActionDictionary::ACTION_TASK_READ`.

**Пример.** Код выводит последние 20 записей учета времени и общее время по задаче.

```php
use Bitrix\Main\DI\ServiceLocator;
use Bitrix\Main\Provider\Params\Pager;
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\TaskAccessController;
use Bitrix\Tasks\V2\Public\Provider\TaskElapsedTimeProvider;

if (!TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_READ, $taskId))
{
    throw new \RuntimeException('Нет доступа к задаче');
}

$provider = ServiceLocator::getInstance()->get(TaskElapsedTimeProvider::class);

$records = $provider->getList(
    taskId: $taskId,
    userId: $userId,
    pager: new Pager(limit: 20),
);

foreach ($records as $record)
{
    echo $record->userId . ': ' . $record->seconds . ' с, ' . $record->text . PHP_EOL;
}

echo 'Всего: ' . $provider->getTimeSpentOnTask($taskId) . ' с';
```

## Чек-листы {#checklists}

Чек-лист — список пунктов внутри задачи. У задачи может быть несколько чек-листов, и каждый из них хранится как пункт верхнего уровня, а его пункты — как дочерние. Команды чек-листов находятся в пространстве имен `Bitrix\Tasks\V2\Public\Command\CheckList`.

### Прочитать пункты чек-листа {#read-checklist}

Провайдер задачи с ключом `checkLists` возвращает только ID чек-листов, как описано в статье [Чтение и выборка задач](./read-tasks.md#get-task). Пункты возвращает метод `getByEntity()` провайдера `Bitrix\Tasks\V2\Public\Provider\CheckListProvider`. Метод принимает аргументы `entityId` — ID задачи, `userId` — ID пользователя и `type` — тип `Bitrix\Tasks\V2\Internal\Entity\CheckList\Type::Task`.

Метод возвращает коллекцию пунктов `Bitrix\Tasks\V2\Internal\Entity\CheckList` — это коллекция, а не отдельный пункт. Коллекция плоская, в ней есть и сами чек-листы, и их пункты. Каждый элемент коллекции — объект `Bitrix\Tasks\V2\Internal\Entity\CheckList\CheckListItem` со свойствами ниже.

- `id` — ID пункта.

- `title` — текст пункта.

- `isComplete` — `true`, если пункт выполнен.

- `parentId` — ID родительского пункта. У чек-листа верхнего уровня значение `0`.

Массив ID всех пунктов возвращает метод `getIds()` коллекции. Метод `getByEntity()` не проверяет право сотрудника на чтение задачи. Перед вызовом по запросу сотрудника проверьте право `ActionDictionary::ACTION_TASK_READ`.

**Пример.** Код проверяет право на чтение задачи и выводит невыполненные пункты ее чек-листов.

```php
use Bitrix\Main\DI\ServiceLocator;
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\TaskAccessController;
use Bitrix\Tasks\V2\Internal\Entity\CheckList\Type;
use Bitrix\Tasks\V2\Public\Provider\CheckListProvider;

if (!TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_READ, $taskId))
{
    throw new \RuntimeException('Нет доступа к задаче');
}

$provider = ServiceLocator::getInstance()->get(CheckListProvider::class);
$items = $provider->getByEntity(
    entityId: $taskId,
    userId: $userId,
    type: Type::Task,
);

foreach ($items as $item)
{
    if ($item->parentId > 0 && !$item->isComplete)
    {
        echo $item->id . ': ' . $item->title . PHP_EOL;
    }
}
```

### Отметить пункт выполненным {#complete-checklist-item}

Команда `CompleteCheckListItemsCommand` отмечает пункты выполненными, а команда `RenewCheckListItemsCommand` снимает отметку. Обе принимают аргументы `ids` — массив ID пунктов, целых чисел, и `userId` — ID пользователя.

Перед отметкой и снятием отметки по запросу сотрудника проверьте право `ActionDictionary::ACTION_CHECKLIST_TOGGLE` для каждого пункта. Третьим аргументом метода `can()` передают ID задачи, а четвертым — модель пункта. Модели пунктов возвращает метод `Bitrix\Tasks\CheckList\Task\TaskCheckListFacade::getAccessModelsByItemIds()` по массиву ID пунктов. Метод возвращает массив моделей с ключами — ID пунктов. Если пункта нет, ключа в массиве нет. Подробнее о праве — в разделе [Отметить пункты чек-листа](./permissions.md#checklist-toggle) статьи о правах.

**Пример.** Код проверяет право и отмечает пункт чек-листа выполненным. Переменная `$itemId` содержит ID пункта.

```php
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\TaskAccessController;
use Bitrix\Tasks\CheckList\Task\TaskCheckListFacade;
use Bitrix\Tasks\V2\Public\Command\CheckList\CompleteCheckListItemsCommand;

$models = TaskCheckListFacade::getAccessModelsByItemIds([$itemId]);

if (
    !isset($models[$itemId])
    || !TaskAccessController::can($userId, ActionDictionary::ACTION_CHECKLIST_TOGGLE, $taskId, $models[$itemId])
)
{
    throw new \RuntimeException('Нет прав на отметку пункта');
}

$result = (new CompleteCheckListItemsCommand(
    ids: [$itemId],
    userId: $userId,
))->run();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}
```

Чтобы снять отметку, запустите команду `RenewCheckListItemsCommand` с теми же аргументами и той же проверкой права.

Команда `SaveCheckListCommand` сохраняет чек-листы задачи целиком — добавляет, меняет и удаляет пункты. Она принимает аргументы `task` — объект задачи с чек-листами и `updatedBy` — ID пользователя. Для нее в модуле есть право `ActionDictionary::ACTION_CHECKLIST_SAVE`, его проверяют с массивом пунктов в параметрах. Команда это право не проверяет. Ограничение по формату данных указано в таблице в начале статьи.

## Проверить результат {#check-result}

Перед публикацией кода выполните в тестовом Битрикс24 несколько проверок.

1. Отправьте сообщение командой `SendMessageCommand` и убедитесь, что оно появилось в чате задачи. Для старой задачи без чата сообщение не появится, хотя команда вернет успех.

2. Добавьте результат от имени сотрудника, который не участвует в задаче. Убедитесь, что он стал наблюдателем и обработчики события `OnTaskUpdate` проекта корректно обработали это изменение.

3. Попробуйте изменить результат от имени другого сотрудника. Проверка `ACTION_RESULT_EDIT` должна вернуть `false`.

4. Прикрепите файл к задаче, в которой уже есть файлы, и убедитесь, что прежние файлы остались.

5. Открепите файл и проверьте свойство `fileIds` задачи — файла в нем быть не должно.

6. Измените запись учета времени и сравните даты начала и окончания работы с прежними значениями.

7. Запустите таймер по одной задаче, затем по другой. Убедитесь, что по первой задаче появилась запись учета времени.

8. Отметьте пункт чек-листа от имени сотрудника без права `ACTION_CHECKLIST_TOGGLE` и проверьте, что `can()` вернул `false`.

Если обработчики событий проекта меняют задачу или записи учета времени, проверьте их способом из статьи [События модуля Задачи](./events.md#check-result).
