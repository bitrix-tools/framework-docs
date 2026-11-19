---
title: Поля, участники и статусы задач
description: "Поля задачи в TaskTable и в объекте задачи, роли участников и чтение участников для одной задачи и для списка, статусы и приоритеты с константами, чтение и запись тегов, создание, запись и чтение пользовательских полей задач."
---

Данные задачи доступны в двух формах. Класс ORM `Bitrix\Tasks\Internals\TaskTable` и классический API хранят их в полях с именами в верхнем регистре и числовыми константами. Объект задачи `Bitrix\Tasks\V2\Internal\Entity\Task`, который возвращает провайдер и принимают команды, хранит их в свойствах в стиле camelCase, а статус и приоритет — значениями enum.

Верхний регистр встречается в `TaskTable`, фильтрах запроса `Bitrix\Tasks\Provider\Query\TaskQuery`, обработчиках событий и классическом API. Стиль camelCase используют провайдер `TaskProvider` и команды. Используйте статью как справочник, когда переносите данные между `TaskTable`, фильтрами и объектом задачи.

Перед запуском примеров подключите [пролог Bitrix Framework](./../../framework/request-lifecycle.md) и модуль `tasks`. Полный код подключения приведен в первом примере раздела [Участники и роли](#members), в остальных примерах его нет. Выполняйте их после этого кода подключения.

Переменная `$userId` в примерах содержит ID сотрудника, от имени которого выполняется действие, `$taskId` — ID задачи, `$taskIds` — массив ID задач.

{% note tip "" %}

Как читать и менять задачи, описано в статьях [Чтение и выборка задач](./read-tasks.md) и [Создание, изменение и удаление задач](./tasks.md).

{% endnote %}

## Основные поля задачи {#task-fields}

Таблица сопоставляет поля `TaskTable` со свойствами объекта задачи `Bitrix\Tasks\V2\Internal\Entity\Task` и ключами массива для метода `Task::mapFromArray()`. Ключи массива строятся так:

-  для простых значений ключ совпадает с именем свойства,

-  для постановщика, ответственного, проекта и потока передают ключ с суффиксом `Id` и числовым ID, например `creatorId`,

-  для соисполнителей и наблюдателей — ключ с суффиксом `Ids` и массивом ID, например `auditorsIds`.

Прочерк в колонке ключа означает, что значение заполняет модуль. Типы значений для записи приведены в разделе [Подготовить данные задачи](./tasks.md#prepare-task-data).

| Поле `TaskTable` | Свойство объекта | Ключ для `mapFromArray()` | Тип в объекте | Описание | Запись |
|---|---|---|---|---|---|
| `ID` | `id` | `id` | `int` | ID задачи | Только при изменении, ключ `id` указывает задачу |
| `TITLE` | `title` | `title` | `string` | Название | Да |
| `DESCRIPTION` | `description` | `description` | `string` | Описание | Да |
| `CREATED_BY` | `creator` | `creatorId` с ID пользователя | Объект пользователя | Постановщик | Да |
| `RESPONSIBLE_ID` | `responsible` | `responsibleId` с ID пользователя | Объект пользователя | Ответственный | Да |
| `STATUS` | `status` | — | enum `Bitrix\Tasks\V2\Internal\Entity\Task\Status` | Статус. Значения приведены в разделе [Статусы](#statuses) | Нет, только командами статуса |
| `PRIORITY` | `priority` | `priority` со строковым значением enum | enum `Bitrix\Tasks\V2\Internal\Entity\Priority` | Приоритет. Значения приведены в разделе [Приоритет](#priority) | Да |
| `DEADLINE` | `deadlineTs` | `deadlineTs` | `int`, метка времени Unix | Крайний срок | Да |
| `START_DATE_PLAN` | `startPlanTs` | `startPlanTs` | `int`, метка времени Unix | Плановая дата начала | Да |
| `END_DATE_PLAN` | `endPlanTs` | `endPlanTs` | `int`, метка времени Unix | Плановая дата завершения | Да |
| `DATE_START` | `startedTs` | — | `int`, метка времени Unix | Дата, когда задачу начали выполнять | Нет, заполняет модуль при переходе в статус «Выполняется» |
| `CREATED_DATE` | `createdTs` | — | `int`, метка времени Unix | Дата создания | Нет, заполняет модуль |
| `CHANGED_DATE` | `changedTs` | — | `int`, метка времени Unix | Дата последнего изменения | Нет, заполняет модуль |
| `ACTIVITY_DATE` | `activityTs` | — | `int`, метка времени Unix | Дата последней активности в задаче | Нет, заполняет модуль |
| `CLOSED_DATE` | `closedTs` | — | `int`, метка времени Unix | Дата завершения | Нет, заполняет модуль |
| `GROUP_ID` | `group` | `groupId` с ID проекта | Объект проекта | Проект | Да |
| Нет поля. В фильтре `TaskQuery` — `FLOW_ID` | `flow` | `flowId` с ID потока | Объект потока | Поток | Да |
| `PARENT_ID` | `parentId` | `parentId` | `int` | ID родительской задачи | Да |
| `TASK_CONTROL` | `needsControl` | `needsControl` | `bool`. В `TaskTable` — значения `Y` и `N` | Контроль постановщика после завершения | Да |
| `ALLOW_CHANGE_DEADLINE` | `allowsChangeDeadline` | `allowsChangeDeadline` | `bool`. В `TaskTable` — значения `Y` и `N` | Ответственный может менять крайний срок | Да |
| `ALLOW_TIME_TRACKING` | `allowsTimeTracking` | `allowsTimeTracking` | `bool`. В `TaskTable` — значения `Y` и `N` | Учет времени в задаче включен | Да |
| `XML_ID` | `xmlId` | `xmlId` | `string` | Внешний код для связи с другой системой | Да |
| Нет поля. Хранится в параметрах задачи | `requireResult` | `requireResult` | `bool` | Сотрудник не завершит задачу без результата | Да |

Если значение не задано или связанные данные не загружены, свойство объекта равно `null`. Обращайтесь к свойствам-объектам через оператор `?->`. ID постановщика, ответственного и проекта возвращают выражения `$task->creator?->id`, `$task->responsible?->id` и `$task->group?->id`.

Свойства `status`, `startedTs`, `createdTs`, `changedTs`, `activityTs` и `closedTs` заполняет модуль, в таблице они отмечены в колонке «Запись». При создании и изменении задачи через `Task::mapFromArray()` их не передают. Статус меняют командами из раздела [Статусы](#statuses).

Поток задачи хранится отдельно от строки задачи, поэтому поля потока в `TaskTable` нет. Требование результата тоже хранится отдельно, в параметрах задачи.

Даты в `TaskTable` — объекты [`Bitrix\Main\Type\DateTime`](../../api-reference/main/type/date-time/index.md). В объекте задачи даты хранятся как метки времени Unix, поэтому имена свойств заканчиваются на `Ts`. Метка превращается в объект даты вызовом `Bitrix\Main\Type\DateTime::createFromTimestamp()`.

При выборке через `TaskTable` добавляйте условие `'=ZOMBIE' => 'N'`, как описано в разделе [Прочитать строки через TaskTable](./read-tasks.md#tasktable). Иначе в выборку попадут служебные строки задач, удаленных старыми версиями модуля.

## Участники и роли {#members}

У задачи четыре роли участников. Каждая роль определяет, что сотрудник видит и может делать в задаче. Какие действия доступны ролям, описано в статье [Права доступа к задачам](./permissions.md).

| Роль | Код в `MemberTable` | Константа `MemberTable` | Свойство объекта | Ключ для `mapFromArray()` | Сколько участников |
|---|---|---|---|---|---|
| Постановщик | `O` | `MEMBER_TYPE_ORIGINATOR` | `creator` | `creatorId` | Один |
| Ответственный | `R` | `MEMBER_TYPE_RESPONSIBLE` | `responsible` | `responsibleId` | Один |
| Соисполнитель | `A` | `MEMBER_TYPE_ACCOMPLICE` | `accomplices` | `accomplicesIds` | Несколько |
| Наблюдатель | `U` | `MEMBER_TYPE_AUDITOR` | `auditors` | `auditorsIds` | Несколько |

Класс ORM `Bitrix\Tasks\Internals\Task\MemberTable` хранит всех участников задачи в таблице `b_tasks_member`. Каждая строка связывает задачу и сотрудника в одной роли. Поля строки перечислены ниже.

- `TASK_ID` — ID задачи.

- `USER_ID` — ID сотрудника.

- `TYPE` — код роли из таблицы выше.

Постановщик и ответственный дополнительно записаны в поля `CREATED_BY` и `RESPONSIBLE_ID` таблицы задач. Первичный ключ таблицы участников состоит из трех полей `TASK_ID`, `USER_ID` и `TYPE`, поэтому один сотрудник может занимать в задаче несколько ролей.

Чтобы выбрать задачи сотрудника в любой роли, используйте поле фильтра `MEMBER`, а в роли ответственного или соисполнителя — `DOER`. Поля фильтра описаны в статье [Чтение и выборка задач](./read-tasks.md#filter).

При создании задачи участников передают ключами из таблицы. У существующей задачи участников меняют командами из раздела [Сменить статус или участников](./tasks.md#status-and-members). Аргументы этих команд называются `accompliceIds` и `auditorIds` и отличаются от ключей `accomplicesIds` и `auditorsIds`.

### Прочитать участников задачи {#read-members}

Участников одной задачи возвращает провайдер `TaskProvider`, если в параметрах `TaskParams::mapFromIds()` включен ключ `members`. Без этого ключа свойства `creator`, `responsible`, `accomplices` и `auditors` равны `null`. Провайдер проверяет право сотрудника на чтение задачи и возвращает `null`, если задачи нет или прав не хватает.

Свойства `creator` и `responsible` — объекты пользователей, ID возвращает свойство `id`. Свойства `accomplices` и `auditors` — коллекции пользователей. Массив ID возвращает метод `getIdList()` коллекции.

**Пример.** Код читает задачу с участниками и получает ID постановщика, ответственного, соисполнителей и наблюдателей.

```php
use Bitrix\Main\Loader;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskParams;
use Bitrix\Tasks\V2\Public\Provider\TaskProvider;

if (!Loader::includeModule('tasks'))
{
    throw new \RuntimeException('Не удалось подключить модуль Задачи');
}

$task = (new TaskProvider())->get(
    TaskParams::mapFromIds($taskId, $userId, ['members' => true])
);

if ($task === null)
{
    throw new \RuntimeException('Задача не найдена или нет прав на чтение');
}

$creatorId = $task->creator?->id;
$responsibleId = $task->responsible?->id;
$accompliceIds = $task->accomplices?->getIdList() ?? [];
$auditorIds = $task->auditors?->getIdList() ?? [];
```

Другие параметры чтения описаны в разделе [Прочитать одну задачу](./read-tasks.md#get-task).

### Прочитать участников списка задач {#read-members-list}

Метод `TaskProvider::getList()` загружает соисполнителей и наблюдателей для каждой задачи списка, а ответственного и постановщика — если в выборке есть ключи `responsibleId` и `createdBy`. Подробнее — в разделе [Выбрать список задач](./read-tasks.md#get-list).

Если ID задач уже известны, например из выборки `TaskList`, выберите строки `MemberTable` с фильтром по массиву ID задач. Так код выполнит один запрос вместо запроса на каждую задачу.

Класс `MemberTable` не проверяет права сотрудника. Передавайте в фильтр ID задач, которые сотрудник уже может читать.

**Пример.** Код собирает соисполнителей и наблюдателей для списка задач. Результат — массив, где ключ — ID задачи, а значение — массивы ID по кодам ролей.

```php
use Bitrix\Tasks\Internals\Task\MemberTable;

$members = [];

if (!empty($taskIds))
{
    $rows = MemberTable::getList([
        'select' => ['TASK_ID', 'USER_ID', 'TYPE'],
        'filter' => [
            '@TASK_ID' => $taskIds,
            '@TYPE' => [
                MemberTable::MEMBER_TYPE_ACCOMPLICE,
                MemberTable::MEMBER_TYPE_AUDITOR,
            ],
        ],
    ]);

    while ($row = $rows->fetch())
    {
        $members[(int)$row['TASK_ID']][$row['TYPE']][] = (int)$row['USER_ID'];
    }
}

// ID наблюдателей первой задачи из списка
$auditorIds = $members[$taskIds[0]][MemberTable::MEMBER_TYPE_AUDITOR] ?? [];
```

Код проверяет `$taskIds` перед запросом и не обращается к базе данных для пустого списка. Задачи без участников выбранных ролей в массив `$members` не попадут, поэтому читайте значения с оператором `??`.

## Статусы {#statuses}

Статус показывает этап выполнения задачи. В `TaskTable` статус — число из констант класса `Bitrix\Tasks\Internals\Task\Status`. В запросе `TaskQuery` то же число передают и получают полем `REAL_STATUS`. В объекте задачи статус — enum `Bitrix\Tasks\V2\Internal\Entity\Task\Status` со строковыми значениями.

Значения констант совпадают с классическими константами `CTasks::STATE_*`. Замены других классических констант приведены в статье [Как выбрать API задач](./choose-tasks-api.md#classic-api).

| Константа `Status` | Число | Значение enum | Case enum | Что означает |
|---|---|---|---|---|
| `NEW` | 1 | — | — | Новая задача. Статус старых версий модуля, у новых задач не встречается. При чтении через провайдер свойство `status` объекта такой задачи равно `null` |
| `PENDING` | 2 | `pending` | `Pending` | Ждет выполнения |
| `IN_PROGRESS` | 3 | `in_progress` | `InProgress` | Выполняется |
| `SUPPOSEDLY_COMPLETED` | 4 | `supposedly_completed` | `SupposedlyCompleted` | Ждет контроля постановщика |
| `COMPLETED` | 5 | `completed` | `Completed` | Завершена |
| `DEFERRED` | 6 | `deferred` | `Deferred` | Отложена |
| `DECLINED` | 7 | `declined` | `Declined` | Отклонена. Статус старых версий модуля, командами не устанавливается |

У двух классов статусов одинаковое короткое имя `Status`. Если в одном файле нужны оба, задайте псевдоним в `use`, например `use Bitrix\Tasks\V2\Internal\Entity\Task\Status as TaskStatus;`.

Статус меняют командами из пространства имен `Bitrix\Tasks\V2\Public\Command\Task\Status`, а не записью поля.

- Команда сохраняет статус и выполняет связанные действия, например отправляет уведомления участникам.

- Каждая команда принимает аргументы `taskId` и `config` с объектом `Bitrix\Tasks\V2\Internal\Service\Task\Action\Update\Config\UpdateConfig`.

- Аргумент `userId` объекта `UpdateConfig` задает сотрудника, от имени которого выполняется действие.

- Все команды из таблицы создаются одинаково, например `new StartTaskCommand(taskId: $taskId, config: new UpdateConfig(userId: $userId))`.

- Команду запускает метод `run()`.

| Команда | Какой статус устанавливает |
|---|---|
| `Bitrix\Tasks\V2\Public\Command\Task\Status\StartTaskCommand` | `InProgress` |
| `Bitrix\Tasks\V2\Public\Command\Task\Status\TakeTaskCommand` | `InProgress` и назначает ответственным сотрудника, ID которого передан в аргументе `userId` объекта `UpdateConfig` |
| `Bitrix\Tasks\V2\Public\Command\Task\Status\PauseTaskCommand` | `Pending` |
| `Bitrix\Tasks\V2\Public\Command\Task\Status\CompleteTaskCommand` | `Completed`. Если у задачи включен контроль, ответственный и постановщик разные и завершает не постановщик, — `SupposedlyCompleted`. Задачу в статусе `SupposedlyCompleted` администратор или руководитель постановщика завершает сразу в `Completed` |
| `Bitrix\Tasks\V2\Public\Command\Task\Status\ApproveTaskCommand` | `Completed` |
| `Bitrix\Tasks\V2\Public\Command\Task\Status\DisapproveTaskCommand` | `Pending` |
| `Bitrix\Tasks\V2\Public\Command\Task\Status\DeferTaskCommand` | `Deferred` |
| `Bitrix\Tasks\V2\Public\Command\Task\Status\RenewTaskCommand` | `Pending` |

Права для каждой команды и пример запуска приведены в разделе [Сменить статус или участников](./tasks.md#status-and-members).

### Сравнить статус в объекте задачи {#compare-status}

Статус объекта задачи сравнивают с case enum, а не со строкой. Свойство `status` содержит объект enum, поэтому сравнение со строкой `'in_progress'` всегда вернет `false`. Строковое значение возвращает свойство `value`, например `$task->status?->value`.

**Пример.** Код проверяет, выполняется ли задача, и получает строковое значение статуса.

```php
use Bitrix\Tasks\V2\Internal\Entity\Task\Status as TaskStatus;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskParams;
use Bitrix\Tasks\V2\Public\Provider\TaskProvider;

$task = (new TaskProvider())->get(TaskParams::mapFromIds($taskId, $userId));

$isInProgress = $task?->status === TaskStatus::InProgress;

// Строка для журнала или внешней системы, например in_progress
$statusCode = $task?->status?->value;
```

### Вычисляемые состояния {#meta-status}

Кроме статуса, у задачи есть вычисляемые состояния из класса `Bitrix\Tasks\Internals\Task\MetaStatus`. Они не хранятся в задаче, а вычисляются при выборке.

- `MetaStatus::EXPIRED` равно `-1` — крайний срок прошел, а задача не завершена.

- `MetaStatus::UNSEEN` равно `-2` — сотрудник еще не открывал новую задачу, которую ему поставил другой сотрудник.

- `MetaStatus::EXPIRED_SOON` равно `-3` — крайний срок скоро наступит, а задача не завершена.

Эти значения возвращает поле `STATUS` в выборке `TaskQuery`, а для остальных задач оно содержит настоящий статус. Чтобы всегда получать настоящий статус, выбирайте поле `REAL_STATUS`. Если сравнить `STATUS` с константой `Status::IN_PROGRESS`, просроченная задача в работе не пройдет проверку.

В обработчиках событий поле `STATUS` содержит настоящий статус числом. Формат полей в событиях описан в статье [События модуля Задачи](./events.md#task-events).

## Приоритет {#priority}

Приоритет задачи задают константы класса `Bitrix\Tasks\Internals\Task\Priority`. В объекте задачи приоритет — enum `Bitrix\Tasks\V2\Internal\Entity\Priority` со строковыми значениями. Значения констант совпадают с классическими константами `CTasks::PRIORITY_*`.

| Константа `Priority` | Число | Значение enum | Case enum | Что означает |
|---|---|---|---|---|
| `LOW` | 0 | `low` | `Low` | Низкий. Записывается значением `low`, но провайдер `TaskProvider` возвращает его как `average` |
| `AVERAGE` | 1 | `average` | `Average` | Средний |
| `HIGH` | 2 | `high` | `High` | Высокий |

В метод `Task::mapFromArray()` приоритет передают строковым значением enum, например `'priority' => 'high'`. Неизвестное значение метод превращает в `null` без ошибки, и приоритет задачи не изменится.

При записи значение `low` сохраняется как `Priority::LOW` со значением `0`. При чтении через провайдер низкий и средний приоритет возвращаются одним значением `average`. Чтобы отличить низкий приоритет, читайте поле `PRIORITY` через `TaskTable` или `TaskQuery`.

## Теги {#tags}

Тег — метка, по которой задачи группируют и находят. В объекте задачи теги хранятся в свойстве `tags` — коллекции тегов. У каждого тега есть свойство `name` с названием.

Для выборки задач по тегу используйте поле фильтра `TAG` с названием тега, как описано в разделе [Отфильтровать по тегу или пользовательскому полю](./read-tasks.md#filter-by-tag-uf).

### Прочитать теги задачи {#read-tags}

Теги возвращает провайдер `TaskProvider`, если в параметрах `TaskParams::mapFromIds()` включен ключ `tags`. Без этого ключа свойство `tags` равно `null`. Массив названий возвращает метод `getNameList()` коллекции.

**Пример.** Код читает задачу с тегами и получает массив названий тегов.

```php
use Bitrix\Tasks\V2\Public\Provider\Params\TaskParams;
use Bitrix\Tasks\V2\Public\Provider\TaskProvider;

$task = (new TaskProvider())->get(
    TaskParams::mapFromIds($taskId, $userId, ['tags' => true])
);

$tagNames = $task?->tags?->getNameList() ?? [];
```

### Заменить теги задачи {#set-tags}

Теги передают ключом `tags` в метод `Task::mapFromArray()`. Значение — массив, где каждый тег задан массивом с ключом `name`. Объект задачи передают в команду `Bitrix\Tasks\V2\Public\Command\Task\UpdateTaskCommand`.

Переданный список заменяет теги задачи. Тег, которого нет в списке, команда удалит. Пустой массив `'tags' => []` удалит все теги, кроме тегов из названия и описания.

Слова с символом `#` в названии и описании задачи модуль тоже сохраняет как теги. Например, текст `Проверить #отчет` добавит тег `отчет`. При каждом изменении задачи модуль ищет такие слова в текущих названии и описании и добавляет их к списку тегов. Поэтому тег из текста задачи нельзя удалить через ключ `tags`, пока слово с `#` остается в тексте.

Если изменить название или описание без ключа `tags`, модуль сохранит текущие теги и добавит к ним слова с `#` из нового текста.

**Пример.** Код заменяет теги задачи списком из двух тегов.

```php
use Bitrix\Tasks\V2\Internal\Entity\Task;
use Bitrix\Tasks\V2\Internal\Service\Task\Action\Update\Config\UpdateConfig;
use Bitrix\Tasks\V2\Public\Command\Task\UpdateTaskCommand;

$result = (new UpdateTaskCommand(
    task: Task::mapFromArray([
        'id' => $taskId,
        'tags' => [
            ['name' => 'отчет'],
            ['name' => 'квартал'],
        ],
    ]),
    config: new UpdateConfig(userId: $userId),
))->run();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}
```

Пример не проверяет права сотрудника. Перед запуском по запросу сотрудника проверьте право на изменение, как описано в разделе [Изменить задачу](./tasks.md#update-task).

### Добавить тег к текущим {#add-tag}

Ключ `tags` заменяет весь список. Чтобы добавить один тег, прочитайте текущие теги через провайдер, добавьте новый и передайте полный список. Иначе команда удалит остальные теги задачи.

**Пример.** Код добавляет к задаче тег `срочно` и сохраняет прежние теги.

```php
use Bitrix\Tasks\V2\Internal\Entity\Task;
use Bitrix\Tasks\V2\Internal\Service\Task\Action\Update\Config\UpdateConfig;
use Bitrix\Tasks\V2\Public\Command\Task\UpdateTaskCommand;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskParams;
use Bitrix\Tasks\V2\Public\Provider\TaskProvider;

$task = (new TaskProvider())->get(
    TaskParams::mapFromIds($taskId, $userId, ['tags' => true])
);

if ($task === null)
{
    throw new \RuntimeException('Задача не найдена или нет прав на чтение');
}

$tagNames = $task->tags?->getNameList() ?? [];

if (!in_array('срочно', $tagNames, true))
{
    $tagNames[] = 'срочно';

    $result = (new UpdateTaskCommand(
        task: Task::mapFromArray([
            'id' => $taskId,
            'tags' => array_map(static fn (string $name): array => ['name' => $name], $tagNames),
        ]),
        config: new UpdateConfig(userId: $userId),
    ))->run();

    if (!$result->isSuccess())
    {
        throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
    }
}
```

## Пользовательские поля {#user-fields}

Задачи поддерживают пользовательские поля. Идентификатор объекта для пользовательских полей задач — `TASKS_TASK`, он же константа `Bitrix\Tasks\V2\Internal\Entity\UF\UserField::TASK`. Код поля начинается с префикса `UF_`.

Модуль использует несколько системных пользовательских полей. Они не попадают в свойство `userFields` объекта задачи. Для них в объекте есть отдельные свойства.

- `UF_TASK_WEBDAV_FILES` — файлы задачи с Диска, свойство `fileIds`. Провайдер заполняет свойство, только если в параметрах чтения включен ключ `userFields`. Файлы прикрепляют и открепляют командами `Bitrix\Tasks\V2\Public\Command\Task\Attachment\AttachFilesCommand` и `Bitrix\Tasks\V2\Public\Command\Task\Attachment\DetachFilesCommand`, как описано в статье [Чат, результаты, файлы и учет времени](./chat-and-related-data.md#files).

- `UF_CRM_TASK` — привязки к элементам CRM, свойство `crmItemIds`. При чтении через провайдер включите ключ `crm`, он возвращает только элементы, доступные сотруднику.

- `UF_MAIL_MESSAGE` — письмо, из которого создана задача, свойство `email`.

### Создать пользовательское поле {#create-user-field}

Поле создают через API пользовательских полей, как поля других объектов. Метод `CUserTypeEntity::Add()` принимает массив параметров поля, где в ключе `ENTITY_ID` передают `TASKS_TASK`. Метод возвращает ID поля или `false`. Текст ошибки возвращает `$GLOBALS['APPLICATION']->GetException()`. Полный набор параметров и типов описан в статье [Пользовательские поля](./../../cms-basics/userfields.md).

Метод не проверяет права пользователя. Запускайте создание поля в доверенном коде, например при установке модуля. Перед созданием проверьте, нет ли поля с таким кодом, иначе повторный запуск вернет ошибку. Существующее поле ищут методом `Bitrix\Main\UserFieldTable::getList()` с фильтром по `ENTITY_ID` со значением `TASKS_TASK` и по `FIELD_NAME` с кодом поля.

**Пример.** Код создает у задач строковое поле `UF_PROJECT_CODE` для кода проекта во внешней системе.

```php
use Bitrix\Main\UserFieldTable;

$fieldName = 'UF_PROJECT_CODE';

$exists = UserFieldTable::getList([
    'select' => ['ID'],
    'filter' => [
        '=ENTITY_ID' => 'TASKS_TASK',
        '=FIELD_NAME' => $fieldName,
    ],
])->fetch();

if (!$exists)
{
    $fieldId = (new \CUserTypeEntity())->Add([
        'ENTITY_ID' => 'TASKS_TASK',
        'FIELD_NAME' => $fieldName,
        'USER_TYPE_ID' => 'string',
        'MULTIPLE' => 'N',
        'MANDATORY' => 'N',
        'EDIT_FORM_LABEL' => ['ru' => 'Код проекта'],
        'LIST_COLUMN_LABEL' => ['ru' => 'Код проекта'],
    ]);

    if (!$fieldId)
    {
        $exception = $GLOBALS['APPLICATION']->GetException();
        throw new \RuntimeException($exception ? $exception->GetString() : 'Не удалось создать поле');
    }
}
```

Обязательное поле модуль проверяет не всегда, и это легко пропустить.

- При создании задачи модуль проверяет обязательные поля, только если в задаче передано хотя бы одно пользовательское поле. Тогда пустое обязательное поле остановит создание. Задача без пользовательских полей в данных, в том числе без файлов и привязок к CRM, создастся и с пустым обязательным полем.

- При изменении задачи модуль проверяет обязательность только у переданных полей.

Поэтому не рассчитывайте, что флаг обязательности гарантирует значение у всех задач. Проверяйте значение в своем коде, если сценарий без него не работает.

### Записать значения полей {#write-user-fields}

Значения пользовательских полей передают ключом `userFields` в метод `Task::mapFromArray()`. Каждое поле задают массивом с ключами `key` — код поля и `value` — значение. Для множественного поля `value` — массив значений. Объект задачи передают в команду `AddTaskCommand` при создании или в команду `UpdateTaskCommand` при изменении.

Команда передает `value` в менеджер пользовательских полей `CUserTypeManager::Update()` без преобразований, поэтому формат значения такой же, как в классическом API. Форматы для частых типов полей приведены в таблице. Остальные типы описаны в статье [Пользовательские поля](./../../cms-basics/userfields.md).

| Тип поля `USER_TYPE_ID` | Формат `value` |
|---|---|
| `string` | Строка |
| `boolean` | Любое значение. Модуль сохраняет `1`, если значение истинно, иначе `0` |
| `date` | Объект [`Bitrix\Main\Type\Date`](../../api-reference/main/type/date/index.md) или строка в формате даты сайта |
| `datetime` | Объект [`Bitrix\Main\Type\DateTime`](../../api-reference/main/type/date-time/index.md) или строка во времени пользователя в формате сайта, например `17.11.2026 14:30:00` для формата `DD.MM.YYYY HH:MI:SS`. Строку без времени модуль сохранит с временем `00:00` |
| `enumeration` | ID элемента списка, а не его текст. Для немножественного поля из массива сохраняется первый элемент |
| `file` | ID файла из таблицы `b_file` или массив загружаемого файла в формате `CFile::MakeFileArray()` |

Команда изменения записывает только переданные поля. Значения остальных пользовательских полей остаются прежними.

Перед сохранением команда проверяет значения через менеджер пользовательских полей. Если значение не прошло проверку, задача не изменится, а результат команды будет содержать ошибку. Проверяйте `isSuccess()` после каждого запуска.

**Пример.** Код записывает значение поля `UF_PROJECT_CODE` в существующую задачу.

```php
use Bitrix\Tasks\V2\Internal\Entity\Task;
use Bitrix\Tasks\V2\Internal\Service\Task\Action\Update\Config\UpdateConfig;
use Bitrix\Tasks\V2\Public\Command\Task\UpdateTaskCommand;

$result = (new UpdateTaskCommand(
    task: Task::mapFromArray([
        'id' => $taskId,
        'userFields' => [
            ['key' => 'UF_PROJECT_CODE', 'value' => 'Q4'],
        ],
    ]),
    config: new UpdateConfig(userId: $userId),
))->run();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}
```

Пример не проверяет права сотрудника. Перед запуском по запросу сотрудника проверьте право на изменение, как описано в разделе [Изменить задачу](./tasks.md#update-task).

Системные поля из списка выше через `userFields` не передавайте. Для них используйте отдельные ключи объекта задачи и команды.

### Прочитать значения полей {#read-user-fields}

Значения пользовательских полей одной задачи возвращает провайдер `TaskProvider`, если в параметрах `TaskParams::mapFromIds()` включен ключ `userFields`. Свойство `userFields` — коллекция объектов со свойствами `key` и `value`. Объект поля по коду возвращает метод `findOne()` коллекции. Метод принимает массив условий, например `['key' => 'UF_PROJECT_CODE']`, и возвращает `null`, если поля нет. Без ключа `userFields` провайдер не загружает значения полей, и свойство `userFields` содержит пустую коллекцию.

**Пример.** Код читает значение поля `UF_PROJECT_CODE` одной задачи.

```php
use Bitrix\Tasks\V2\Public\Provider\Params\TaskParams;
use Bitrix\Tasks\V2\Public\Provider\TaskProvider;

$task = (new TaskProvider())->get(
    TaskParams::mapFromIds($taskId, $userId, ['userFields' => true])
);

$projectCode = $task?->userFields?->findOne(['key' => 'UF_PROJECT_CODE'])?->value;
```

Метод `TaskProvider::getList()` своих пользовательских полей не поддерживает, поэтому для списка задач используйте класс `TaskList`.

1. Перечислите коды полей в `setSelect()` запроса `TaskQuery`.

2. Чтобы отфильтровать задачи по полю, передайте в метод `setWhere()` запроса ключ с оператором перед кодом поля, например `'=UF_PROJECT_CODE'`.

3. Выполните запрос методом `Bitrix\Tasks\Provider\TaskList::getList()`. Он возвращает массив строк, ключи каждой строки — коды полей из `setSelect()`. Значения пользовательских полей вернутся под их кодами.

**Пример.** Код выбирает задачи сотрудника со значением поля `UF_PROJECT_CODE`.

```php
use Bitrix\Tasks\Provider\Query\TaskQuery;
use Bitrix\Tasks\Provider\TaskList;

$query =
    (new TaskQuery($userId))
        ->setSelect(['ID', 'TITLE', 'UF_PROJECT_CODE'])
        ->setWhere(['=UF_PROJECT_CODE' => 'Q4'])
;

foreach ((new TaskList())->getList($query) as $row)
{
    $projectCode = $row['UF_PROJECT_CODE'];
}
```

Если поля с таким кодом у задач нет, запрос пропустит его без ошибки и значение в строках не вернет. Проверьте код поля, если значение не пришло.

## Проверить результат {#check-result}

Перед публикацией кода выполните в тестовом Битрикс24 несколько проверок.

1. Прочитайте задачу через провайдер без ключей `members`, `tags` и `userFields` и убедитесь, что код не падает на свойствах, равных `null`, и на пустой коллекции пользовательских полей.

2. Сравните участников из `MemberTable` с карточкой задачи. Для выборки по списку задач передавайте только ID задач, которые сотрудник может читать.

3. Замените теги задачи, в названии которой есть слово с `#`, и проверьте, что тег из названия остался.

4. Добавьте тег к задаче с тремя тегами и убедитесь, что прежние теги сохранились.

5. Запишите значение пользовательского поля и прочитайте его через провайдер с ключом `userFields`. Убедитесь, что значения других пользовательских полей не изменились.

6. Передайте значение неверного типа в пользовательское поле и проверьте, что код обрабатывает ошибку из результата команды.

7. Если код сравнивает статус из выборки `TaskQuery`, проверьте его на просроченной задаче и выбирайте поле `REAL_STATUS`.
