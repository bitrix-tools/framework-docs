---
title: Чтение и выборка задач
description: "Как прочитать задачу и выбрать список задач через провайдер TaskProvider с учетом прав сотрудника. Фильтр TaskListArrayFilter, ограничения V2 и когда нужен TaskList с TaskQuery, задачи сотрудника и подчиненного, просроченные задачи, задачи проекта и подзадачи, условия ИЛИ, теги и пользовательские поля, постраничный вывод, подсчет, обработка порциями, служебные выборки через TaskTable и замена CTasks::GetList()."
---

Задачи читают через провайдер `Bitrix\Tasks\V2\Public\Provider\TaskProvider`. Его метод `get()` возвращает одну задачу, а метод `getList()` — список задач объектами того же класса. Для того, что провайдер не умеет, остаются класс `Bitrix\Tasks\Provider\TaskList` с запросом `TaskQuery` и класс ORM `Bitrix\Tasks\Internals\TaskTable`. Различия описаны в разделе [Выбрать способ чтения](#choose-read-api).

Запись задач описана в статье [Создание, изменение и удаление задач](./tasks.md), поля и статусы — в статье [Поля, участники и статусы задач](./fields-and-constants.md).

Перед запуском примеров подключите [пролог Bitrix Framework](./../../framework/request-lifecycle.md) и модуль `tasks`. Полный код подключения приведен в первых примерах разделов [Прочитать одну задачу](#get-task) и [Выбрать список задач](#get-list), в остальных примерах его нет.

Переменная `$userId` в примерах содержит ID сотрудника, для которого выполняется чтение, `$taskId` — ID задачи, `$groupId` — ID проекта.

## Выбрать способ чтения {#choose-read-api}

| | `TaskProvider::get()` | `TaskProvider::getList()` | `TaskList` и `TaskQuery` | `TaskTable` |
|---|---|---|---|---|
| Что возвращает | Объект задачи | Коллекцию объектов задач | Массив строк с полями в верхнем регистре, как в классическом API | Строки или объекты ORM |
| Права сотрудника | Учитывает | Учитывает | Учитывает | Не учитывает |
| Поля в фильтре и выборке | — | camelCase из списка разрешенных полей, без своих пользовательских полей | Верхний регистр, включая пользовательские поля `UF_*` | Колонки таблицы и пользовательские поля |
| Для чего подходит | Карточка задачи, проверка данных перед изменением | Списки для сотрудника | Подсчет, пользовательские поля, задачи верхнего уровня и другие случаи из раздела [Учесть ограничения getList()](#v2-limitations) | Служебные выборки и группировки без учета прав |

Для одной задачи используйте `TaskProvider::get()`, для списка — `TaskProvider::getList()`. Класс `TaskList` нужен там, где у `getList()` есть ограничения. Класс `TaskTable` используйте в фоновом коде, который сам отвечает за то, кому показать результат.

## Прочитать одну задачу {#get-task}

Метод `TaskProvider::get()` возвращает объект задачи `Bitrix\Tasks\V2\Internal\Entity\Task` или `null`. Провайдер возвращает `null`, если задачи нет или сотрудник не может ее прочитать.

Если у задачи еще нет чата, то есть свойство `chatId` равно `null`, метод `get()` создает чат задачи при чтении. Учитывайте это в коде, который читает старые задачи массово. Если чат создать не удалось, метод выбрасывает исключение `\RuntimeException`.

Параметры чтения собирает метод `mapFromIds()` класса `Bitrix\Tasks\V2\Public\Provider\Params\TaskParams`. Он принимает ID задачи, ID сотрудника и массив связанных данных, которые нужно загрузить. Без массива провайдер не загружает связанные данные из списка ниже.

Связанные данные включают ключами массива со значением `true`. Передавайте именно булево значение. Другое значение, например `1` или `'Y'`, вызовет ошибку `TypeError`.

- `members` — участники задачи, то есть постановщик, ответственный, соисполнители и наблюдатели. Свойства `creator`, `responsible`, `accomplices` и `auditors`.

- `tags` — теги задачи. Свойство `tags`.

- `checkLists` — ID чек-листов задачи. Свойство `checklist`. Пункты чек-листов возвращает отдельный провайдер, он описан в статье [Чат, результаты, файлы и учет времени](./chat-and-related-data.md#checklists).

- `group` — проект задачи. Свойство `group`.

- `flow` — поток задачи. Свойство `flow`.

- `userFields` — пользовательские поля. Свойство `userFields`.

- `crm` — ID привязанных элементов CRM, которые доступны сотруднику. Свойство `crmItemIds`.

Если ключ не включен, соответствующее свойство равно `null`. Обращайтесь к нему через оператор `?->`, как в примере ниже. Загружайте только те данные, которые нужны сценарию. Каждый ключ добавляет запросы к базе данных.

**Пример.** Код читает задачу вместе с участниками и получает название, крайний срок и ID наблюдателей.

```php
use Bitrix\Main\Loader;
use Bitrix\Main\Type\DateTime;
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

$title = $task->title;

$deadline = $task->deadlineTs !== null
    ? DateTime::createFromTimestamp($task->deadlineTs)
    : null
;

$auditorIds = $task->auditors?->getIdList() ?? [];
```

Свойства объекта задачи доступны только для чтения. Даты хранятся как метки времени Unix в свойствах с суффиксом `Ts`, например `deadlineTs` и `createdTs`. Основные свойства перечислены в статье [Поля, участники и статусы задач](./fields-and-constants.md#task-fields).

Статус хранится в свойстве `status` — enum `Bitrix\Tasks\V2\Internal\Entity\Task\Status` со строковыми значениями, например case `Status::InProgress` со значением `in_progress` и case `Status::Pending` со значением `pending`. Все значения приведены в разделе [Статусы](./fields-and-constants.md#statuses). Не путайте его с классом числовых констант `Bitrix\Tasks\Internals\Task\Status`, который используют фильтры списков и `TaskTable`. Сравнивайте статус с case enum, а не со строкой.

**Пример.** Код проверяет, что задача выполняется. Для других статусов подставьте нужный case enum из раздела [Статусы](./fields-and-constants.md#statuses).

```php
use Bitrix\Tasks\V2\Internal\Entity\Task\Status as TaskStatus;

$isInProgress = $task->status === TaskStatus::InProgress;
```

Участники хранятся как объекты пользователей в свойствах `creator`, `responsible`, `accomplices` и `auditors`. Эти свойства заполнены, только если включен ключ `members`. ID постановщика возвращает `$task->creator?->id`, а ID соисполнителей и наблюдателей — метод `getIdList()` коллекции, например `$task->auditors?->getIdList()`.

### Прочитать задачу без проверки прав {#get-task-without-access}

В доверенном серверном коде проверку прав можно отключить. Для этого создайте объект `TaskParams` через конструктор с именованными аргументами `taskId` и `userId`. Остальные аргументы конструктора управляют загрузкой и проверками.

- `checkTaskAccess` — `bool`, по умолчанию `true`. Значение `false` отключает проверку права сотрудника на чтение задачи.

- `checkGroupAccess`, `checkFlowAccess`, `checkCrmAccess` — `bool`, по умолчанию `true`. Управляют проверкой доступа к проекту, потоку и элементам CRM. Параметр `checkTaskAccess: false` эти проверки не отключает.

- `checkParentAccess` — `bool`, по умолчанию `true`. Метод `TaskProvider::get()` этот аргумент не использует.

- `view` — `bool`, по умолчанию `false`. Значение `true` отмечает задачу как просмотренную сотрудником `userId`.

- Флаги загрузки связанных данных — `bool`, по умолчанию `true`. Это `group`, `flow`, `stage`, `members`, `checkLists`, `tags`, `crm`, `email`, `subTasks`, `relatedTasks`, `gantt`, `placements`, `containsCommentFiles`, `favorite`, `options`, `parameters`, `results`, `reminders`, `userFields`, `scenarios` и `templateReplication`. Какие данные загрузятся, зависит от способа создания параметров.

   - Конструктор `TaskParams` включает загрузку всех связанных данных. Ненужные отключите значением `false`.

   - Метод `TaskParams::mapFromIds()` включает только флаги со значением `true` из массива в третьем аргументе. Исключение — флаги `placements`, `reminders` и `templateReplication`, метод оставляет их включенными.

**Пример.** Код читает задачу без проверки прав и без загрузки чек-листов и тегов.

```php
use Bitrix\Tasks\V2\Public\Provider\Params\TaskParams;
use Bitrix\Tasks\V2\Public\Provider\TaskProvider;

$params = new TaskParams(
    taskId: $taskId,
    userId: $userId,
    checkLists: false,
    tags: false,
    checkTaskAccess: false,
);

$task = (new TaskProvider())->get($params);

if ($task === null)
{
    throw new \RuntimeException('Задача не найдена');
}
```

Если задачи нет, метод `get()` и в этом случае возвращает `null`. Такой код возвращает задачу независимо от прав сотрудника, поэтому не показывайте результат пользователю без отдельной проверки.

## Выбрать список задач {#get-list}

Метод `TaskProvider::getList()` выбирает задачи с учетом прав сотрудника и возвращает коллекцию `Bitrix\Tasks\V2\Internal\Entity\TaskCollection`. В ней объекты задач того же класса `Bitrix\Tasks\V2\Internal\Entity\Task`, что и у метода `get()`. Если подходящих задач нет, коллекция пустая.

Метод принимает объект параметров `TaskListParams`. Его аргументы и классы для них находятся в пространстве имен `Bitrix\Tasks\V2\Public\Provider\Params\TaskList`.

- `userId` — `int`, ID сотрудника, чьи права учитывает выборка. Обязательный аргумент.

- `pagination` — объект постраничной навигации `Bitrix\Main\Provider\Params\Pager` с аргументами `limit` и `offset`. Обязательный аргумент. Без аргумента `limit` объект выбирает 50 задач, значение меньше 1 вызывает исключение `Bitrix\Main\ArgumentException`.

- `filter` — объект `TaskListArrayFilter` с массивом условий. Формат условий описан в разделе [Составить фильтр](#filter).

- `sort` — объект `TaskListSort` с массивом сортировки. Ключ — поле, значение — `asc` или `desc` в нижнем регистре, например `['deadline' => 'asc']`. Значения `ASC` и `DESC` в верхнем регистре метод пропускает. Сортировать можно по меньшему набору полей, чем выбирать, например по `parentId` и `tags` нельзя.

- `select` — объект `TaskListSelect` с массивом полей, например `['id', 'title', 'deadline', 'realStatus', 'responsibleId']`.

- `skipAccessCheck` — `bool`, по умолчанию `false`. Значение `true` отключает проверку прав.

Поля в фильтре, сортировке и выборке записывают в стиле camelCase. Неизвестное поле и неверное направление сортировки метод пропускает без ошибки, поэтому проверяйте имена полей.

**Пример.** Код выбирает 20 последних задач, где сотрудник ответственный.

```php
use Bitrix\Main\Loader;
use Bitrix\Main\Provider\Params\Pager;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListArrayFilter;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListParams;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListSelect;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListSort;
use Bitrix\Tasks\V2\Public\Provider\TaskProvider;

if (!Loader::includeModule('tasks'))
{
    throw new \RuntimeException('Не удалось подключить модуль Задачи');
}

$tasks = (new TaskProvider())->getList(new TaskListParams(
    userId: $userId,
    pagination: new Pager(limit: 20),
    filter: new TaskListArrayFilter([
        ['responsibleId', '=', $userId],
    ]),
    sort: new TaskListSort(['id' => 'desc']),
    select: new TaskListSelect(['id', 'title', 'deadline', 'realStatus']),
));

foreach ($tasks as $task)
{
    $taskTitle = $task->title;
    $deadlineTs = $task->deadlineTs;
}
```

В объекте задачи заполнены только поля из выборки. Таблица показывает, какие ключи выборки заполняют свойства объекта.

| Ключ выборки | Свойство объекта |
|---|---|
| `title`, `description` | `title`, `description` |
| `deadline`, `createdDate`, `closedDate`, `startDatePlan`, `endDatePlan` | `deadlineTs`, `createdTs`, `closedTs`, `startPlanTs`, `endPlanTs` — метки времени Unix |
| `status` или `realStatus` | `status` — enum `Bitrix\Tasks\V2\Internal\Entity\Task\Status` |
| `priority` | `priority` |
| `responsibleId`, `createdBy` | `responsible`, `creator` — объекты пользователей |
| `tags` | `tags` |
| Не нужен | `accomplices`, `auditors` — соисполнители и наблюдатели загружаются всегда |

Проект задачи метод `getList()` в объект не записывает, свойство `group` остается пустым даже с ключами `groupId` и `group`. Чтобы узнать проект, прочитайте задачу методом `get()` с ключом `group`.

### Учесть ограничения getList() {#v2-limitations}

Метод `getList()` строит запрос тем же построителем, что и класс `TaskList`, но не все возможности работают через него. Таблица перечисляет ограничения, подтвержденные запуском, и способ их обойти.

| Задача | Что происходит в `getList()` | Что использовать |
|---|---|---|
| Посчитать задачи | Метод `TaskProvider::getCount()` всегда возвращает `0` | `TaskList::getCount()`, раздел [Посчитать задачи](#count) |
| Выбрать задачи верхнего уровня | Фильтр `onlyRootTasks` уходит в бесконечную рекурсию и завершает скрипт ошибкой нехватки памяти | `TaskList` с фильтром `ONLY_ROOT_TASKS`, раздел [Задачи проекта и подзадачи](#project-tasks) |
| Выбрать задачи, где участвует другой сотрудник | Фильтры `member` и `doer` работают, только если в них передан тот же ID, что в `userId`. С другим ID в выборку не попадают, например, задачи, где сотрудник наблюдатель | Фильтр `responsibleId` или `TaskList` с фильтрами `MEMBER` и `DOER`, раздел [Задачи подчиненного](#subordinate-tasks) |
| Отфильтровать или выбрать свои пользовательские поля | Своих пользовательских полей нет в списке разрешенных | `TaskList`, раздел [Отфильтровать по тегу или пользовательскому полю](#filter-by-tag-uf) |
| Исключить служебные строки удаленных задач | Поля `ZOMBIE` нет в списке разрешенных | `TaskList` с условием `'ZOMBIE' => 'N'` |
| Сгруппировать задачи | Группировки нет | `TaskTable`, раздел [Сгруппировать задачи](#group-tasks) |

Служебные строки удаленных задач остаются в таблице, только если в Битрикс24 работали старые версии модуля. Новые задачи модуль при удалении переносит в корзину или удаляет сразу.

### Составить фильтр {#filter}

Объект `TaskListArrayFilter` принимает массив условий. Каждое условие — массив из трех элементов `[поле, оператор, значение]` или из двух `[поле, значение]`. Условие из двух элементов означает равенство, а если значение — массив, то вхождение в массив.

| Оператор | Сравнение |
|---|---|
| `=` | Равно |
| `!=` | Не равно |
| `<`, `<=`, `>`, `>=` | Меньше, меньше или равно, больше, больше или равно |
| `in` | Входит в массив значений |
| `like` | Содержит подстроку. Передайте часть строки без символов `%`. Символ `%` метод ищет как обычный знак |

Все условия массива объединяются через И. Как объединить условия через ИЛИ, описано в разделе [Объединить условия через ИЛИ](#filter-or).

Основные поля фильтра приведены в таблице.

| Поле | Значение | Что выбирает |
|---|---|---|
| `id` | ID задачи или массив ID | Задачи с указанными ID |
| `title` | Часть названия с оператором `like` | Задачи, в названии которых есть строка. Условие равенства по `title` задачи не находит, даже если передать название целиком |
| `responsibleId` | ID сотрудника или массив ID | Задачи ответственного |
| `createdBy` | ID сотрудника или массив ID | Задачи постановщика |
| `accomplice`, `auditor` | ID сотрудника | Задачи, где сотрудник соисполнитель или наблюдатель. Не используйте внутри условия ИЛИ, ограничение описано под таблицей |
| `member` | ID сотрудника из `userId` | Задачи, где сотрудник постановщик, ответственный, соисполнитель или наблюдатель |
| `doer` | ID сотрудника из `userId` | Задачи, где сотрудник ответственный или соисполнитель |
| `groupId` | ID проекта | Задачи проекта |
| `flowId` | ID потока | Задачи потока |
| `parentId` | ID задачи | Подзадачи задачи |
| `realStatus` | Константа класса `Bitrix\Tasks\Internals\Task\Status` или массив констант с оператором `in` | Задачи в указанных статусах. Основные константы — новая `Status::NEW`, ждет выполнения `Status::PENDING`, выполняется `Status::IN_PROGRESS`, ждет контроля постановщика `Status::SUPPOSEDLY_COMPLETED`, завершена `Status::COMPLETED`, отложена `Status::DEFERRED` |
| `deadline`, `createdDate`, `closedDate` | Объект [`Bitrix\Main\Type\DateTime`](../../api-reference/main/type/date-time/index.md) | Задачи по крайнему сроку, дате создания или закрытия |
| `xmlId` | Строка | Задачи по внешнему коду, точное совпадение |
| `tag` | Название тега | Задачи с указанным тегом |

Даты в фильтре передавайте объектами `Bitrix\Main\Type\DateTime`. Объект обозначает один момент времени и не зависит от часового пояса текущего пользователя, поэтому фильтр одинаково работает на странице и в агенте.

Фильтры `accomplice` и `auditor` оставляют в выборке только задачи, у которых есть соисполнители или наблюдатели. Внутри условия ИЛИ они отсекают остальные задачи. Например, условие «ответственный или наблюдатель» не вернет задачи ответственного без наблюдателей.

### Учесть права в выборке {#list-permissions}

Метод `getList()` возвращает только задачи, которые может видеть сотрудник `userId`. Для администратора Битрикс24 выборка возвращает все задачи. Кто может прочитать задачу, описано в статье [Права доступа к задачам](./permissions.md#who-can-read). Как проверить для списка задач другое действие, например право изменения, описано в разделе [Проверить права для списка задач](./permissions.md#list-access).

Аргумент `skipAccessCheck: true` отключает проверку. Используйте его только в служебном коде, например в агенте для отчета, и не показывайте такой список сотрудникам без проверки прав.

## Типовые выборки {#recipes}

### Задачи сотрудника в работе {#user-tasks}

Чтобы получить задачи, в которых сотрудник участвует в любой роли, используйте фильтр `member`. Чтобы получить только задачи, которые сотрудник выполняет, используйте `doer`. В обоих фильтрах передавайте тот же ID, что и в `userId`.

**Пример.** Код выбирает незавершенные задачи, которые выполняет сотрудник, сначала с ближайшим сроком.

```php
use Bitrix\Main\Provider\Params\Pager;
use Bitrix\Tasks\Internals\Task\Status;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListArrayFilter;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListParams;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListSelect;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListSort;
use Bitrix\Tasks\V2\Public\Provider\TaskProvider;

$tasks = (new TaskProvider())->getList(new TaskListParams(
    userId: $userId,
    pagination: new Pager(limit: 50),
    filter: new TaskListArrayFilter([
        ['doer', $userId],
        ['realStatus', 'in', [Status::NEW, Status::PENDING, Status::IN_PROGRESS]],
    ]),
    sort: new TaskListSort(['deadline' => 'asc']),
    select: new TaskListSelect(['id', 'title', 'deadline', 'realStatus', 'responsibleId']),
));
```

Статус `Status::NEW` встречается у задач, созданных старыми версиями модуля, поэтому пример включает его в фильтр. При сортировке по возрастанию `deadline` задачи без крайнего срока идут в конце.

### Задачи подчиненного {#subordinate-tasks}

Руководитель может видеть задачи подчиненных. Чтобы выбрать задачи подчиненного с учетом прав руководителя, передайте в `userId` ID руководителя, а ID подчиненного — в фильтр `responsibleId`. Фильтры `member` и `doer` здесь не подходят, они работают только для сотрудника из `userId`.

**Пример.** Код выбирает задачи, где подчиненный ответственный, с учетом прав руководителя. Переменная `$managerId` содержит ID руководителя, `$employeeId` — ID подчиненного.

```php
use Bitrix\Main\Provider\Params\Pager;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListArrayFilter;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListParams;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListSelect;
use Bitrix\Tasks\V2\Public\Provider\TaskProvider;

$tasks = (new TaskProvider())->getList(new TaskListParams(
    userId: $managerId,
    pagination: new Pager(limit: 50),
    filter: new TaskListArrayFilter([
        ['responsibleId', $employeeId],
    ]),
    select: new TaskListSelect(['id', 'title', 'realStatus']),
));
```

Запрос вернет только те задачи подчиненного, которые руководитель может прочитать. Если нужны и задачи, где подчиненный соисполнитель или наблюдатель, используйте класс `TaskList` с фильтром `MEMBER` из раздела [Выбрать список через TaskList](#tasklist). В нем фильтр работает для любого ID.

### Просроченные задачи {#overdue}

Просроченная задача — незавершенная задача с крайним сроком в прошлом. Задайте статусы в `realStatus` и условие `deadline` меньше текущего момента.

**Пример.** Код выбирает просроченные задачи ответственного, начиная с самых старых.

```php
use Bitrix\Main\Provider\Params\Pager;
use Bitrix\Main\Type\DateTime;
use Bitrix\Tasks\Internals\Task\Status;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListArrayFilter;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListParams;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListSelect;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListSort;
use Bitrix\Tasks\V2\Public\Provider\TaskProvider;

$tasks = (new TaskProvider())->getList(new TaskListParams(
    userId: $userId,
    pagination: new Pager(limit: 50),
    filter: new TaskListArrayFilter([
        ['responsibleId', $userId],
        ['realStatus', 'in', [Status::NEW, Status::PENDING, Status::IN_PROGRESS]],
        ['deadline', '<', new DateTime()],
    ]),
    sort: new TaskListSort(['deadline' => 'asc']),
    select: new TaskListSelect(['id', 'title', 'deadline', 'realStatus']),
));
```

### Задачи проекта и подзадачи {#project-tasks}

Задачи проекта выбирает фильтр `groupId`. Подзадачи одной задачи выбирает фильтр `parentId` с ID родительской задачи.

**Пример.** Код выбирает подзадачи задачи `$taskId`.

```php
use Bitrix\Main\Provider\Params\Pager;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListArrayFilter;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListParams;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListSelect;
use Bitrix\Tasks\V2\Public\Provider\TaskProvider;

$subTasks = (new TaskProvider())->getList(new TaskListParams(
    userId: $userId,
    pagination: new Pager(limit: 50),
    filter: new TaskListArrayFilter([
        ['parentId', $taskId],
    ]),
    select: new TaskListSelect(['id', 'title', 'realStatus']),
));
```

Задачи верхнего уровня, то есть без подзадач внутри родителя, выбирает фильтр `ONLY_ROOT_TASKS` класса `TaskList`. Через `getList()` этот фильтр использовать нельзя, причина описана в разделе [Учесть ограничения getList()](#v2-limitations). Фильтр `'ONLY_ROOT_TASKS' => 'Y'` оставляет в списке задачи без родителя и подзадачи, родитель которых не подходит под остальные условия фильтра.

**Пример.** Код выбирает задачи верхнего уровня проекта через `TaskList`.

```php
use Bitrix\Tasks\Provider\Query\TaskQuery;
use Bitrix\Tasks\Provider\TaskList;

$rows = (new TaskList())->getList(
    (new TaskQuery($userId))
        ->setSelect(['ID', 'TITLE', 'PARENT_ID', 'RESPONSIBLE_ID'])
        ->setWhere([
            'GROUP_ID' => $groupId,
            'ONLY_ROOT_TASKS' => 'Y',
        ])
        ->setOrder(['ID' => 'ASC'])
);
```

### Объединить условия через ИЛИ {#filter-or}

Чтобы объединить условия через ИЛИ, вложите их в фильтр отдельным массивом с элементом `'logic' => 'or'`. Вложенный массив объединяется с остальными условиями через И.

**Пример.** Код выбирает незавершенные задачи проекта, где сотрудник постановщик или ответственный.

```php
use Bitrix\Main\Provider\Params\Pager;
use Bitrix\Tasks\Internals\Task\Status;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListArrayFilter;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListParams;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListSelect;
use Bitrix\Tasks\V2\Public\Provider\TaskProvider;

$tasks = (new TaskProvider())->getList(new TaskListParams(
    userId: $userId,
    pagination: new Pager(limit: 50),
    filter: new TaskListArrayFilter([
        ['groupId', $groupId],
        ['realStatus', 'in', [Status::NEW, Status::PENDING, Status::IN_PROGRESS]],
        [
            'logic' => 'or',
            ['createdBy', $userId],
            ['responsibleId', $userId],
        ],
    ]),
    select: new TaskListSelect(['id', 'title', 'createdBy', 'responsibleId']),
));
```

Внутри условия ИЛИ используйте поля задачи, например `createdBy` и `responsibleId`, а не фильтры `accomplice` и `auditor`.

### Отфильтровать по тегу или пользовательскому полю {#filter-by-tag-uf}

Фильтр `tag` метода `getList()` выбирает задачи с тегом по его названию. Своих пользовательских полей метод `getList()` не поддерживает, поэтому фильтруйте и выбирайте их через класс `TaskList` по коду поля. Как создать пользовательское поле задачи, описано в разделе [Пользовательские поля](./fields-and-constants.md#user-fields).

**Пример.** Код выбирает задачи с тегом `отчет`.

```php
use Bitrix\Main\Provider\Params\Pager;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListArrayFilter;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListParams;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListSelect;
use Bitrix\Tasks\V2\Public\Provider\TaskProvider;

$tasks = (new TaskProvider())->getList(new TaskListParams(
    userId: $userId,
    pagination: new Pager(limit: 50),
    filter: new TaskListArrayFilter([
        ['tag', 'отчет'],
    ]),
    select: new TaskListSelect(['id', 'title', 'tags']),
));
```

**Пример.** Код выбирает задачи со значением пользовательского поля `UF_PROJECT_CODE` через `TaskList`. Поле создано примером из раздела [Создать пользовательское поле](./fields-and-constants.md#create-user-field). Код поля замените на свой.

```php
use Bitrix\Tasks\Provider\Query\TaskQuery;
use Bitrix\Tasks\Provider\TaskList;

$rows = (new TaskList())->getList(
    (new TaskQuery($userId))
        ->setSelect(['ID', 'TITLE', 'UF_PROJECT_CODE'])
        ->setWhere(['=UF_PROJECT_CODE' => 'Q4'])
);
```

Пользовательское поле в выборке `TaskList` вернет, только если поле существует у задач. Неизвестный код запрос пропустит без ошибки.

## Разбить список на страницы {#pagination}

Для постраничного вывода передайте в объект `Pager` размер страницы в аргументе `limit` и смещение в аргументе `offset`. Объект навигации [`Bitrix\Main\UI\PageNavigation`](../../api-reference/main/ui/page-navigation/index.md) вычисляет их по номеру страницы из адреса запроса и передает в компонент постраничной навигации.

Общее число задач для навигации возвращает метод `TaskList::getCount()`, потому что `TaskProvider::getCount()` возвращает `0`. Фильтр для подсчета записывают в формате `TaskList`, с полями в верхнем регистре.

**Пример.** Код получает страницу списка задач проекта по 20 задач и общее число задач для навигации.

```php
use Bitrix\Main\Provider\Params\Pager;
use Bitrix\Main\UI\PageNavigation;
use Bitrix\Tasks\Provider\Query\TaskQuery;
use Bitrix\Tasks\Provider\TaskList;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListArrayFilter;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListParams;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListSelect;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskList\TaskListSort;
use Bitrix\Tasks\V2\Public\Provider\TaskProvider;

$navigation = new PageNavigation('tasks');
$navigation
    ->setPageSize(20)
    ->initFromUri()
;

$tasks = (new TaskProvider())->getList(new TaskListParams(
    userId: $userId,
    pagination: new Pager(limit: $navigation->getLimit(), offset: $navigation->getOffset()),
    filter: new TaskListArrayFilter([
        ['groupId', $groupId],
    ]),
    sort: new TaskListSort(['id' => 'desc']),
    select: new TaskListSelect(['id', 'title', 'realStatus']),
));

$navigation->setRecordCount(
    (new TaskList())->getCount((new TaskQuery($userId))->setWhere(['GROUP_ID' => $groupId]))
);
```

Метод `TaskList::getCount()` не учитывает лимит и смещение и возвращает число всех подходящих задач с учетом прав. Методы объекта навигации описаны в статье [Класс PageNavigation](./../../cms-basics/page-navigation-class.md).

## Посчитать задачи {#count}

Метод `TaskProvider::getCount()` всегда возвращает `0`. Считайте задачи методом `TaskList::getCount()`. Он возвращает число задач без загрузки строк с учетом фильтра и прав сотрудника из запроса `TaskQuery`.

Передавайте в метод запрос без вызова `setSelect()`. Если в запросе заданы поля, метод сгруппирует по ним строки и вернет неверное число, например `1` вместо числа всех задач.

**Пример.** Код считает незавершенные задачи, которые выполняет сотрудник.

```php
use Bitrix\Tasks\Internals\Task\Status;
use Bitrix\Tasks\Provider\Query\TaskQuery;
use Bitrix\Tasks\Provider\TaskList;

$count = (new TaskList())->getCount(
    (new TaskQuery($userId))
        ->setWhere([
            'DOER' => $userId,
            '!REAL_STATUS' => [Status::COMPLETED, Status::DEFERRED],
        ])
);
```

Чтобы посчитать задачи по группам, например по статусам, без учета прав, используйте `TaskTable`, как в разделе [Сгруппировать задачи](#group-tasks).

## Выбрать список через TaskList {#tasklist}

Класс `Bitrix\Tasks\Provider\TaskList` с запросом `Bitrix\Tasks\Provider\Query\TaskQuery` нужен в случаях из раздела [Учесть ограничения getList()](#v2-limitations). Метод `getList()` класса возвращает массив строк. Каждая строка — ассоциативный массив с ключами полей в верхнем регистре, например `ID`, `TITLE`, `REAL_STATUS`. Статус приходит числом из констант класса `Bitrix\Tasks\Internals\Task\Status`, даты — объектами [`Bitrix\Main\Type\DateTime`](../../api-reference/main/type/date-time/index.md).

Запрос собирают методами объекта `TaskQuery`.

- `__construct(int $userId = 0)` — задает ID сотрудника, чьи права учитывает выборка.

- `setSelect(array)` — задает массив имен полей, например `['ID', 'TITLE', 'REAL_STATUS']`. Без вызова запрос возвращает только поле `ID`. Пользовательские поля выбирают по коду, например `UF_CRM_TASK`.

- `setWhere(array)` — задает фильтр в формате из таблицы ниже.

- `setOrder(array)` — задает сортировку, ключ — поле, значение — `'ASC'` или `'DESC'`.

- `setLimit(int)` и `setOffset(int)` — задают размер и смещение страницы. Без вызова `setLimit()` запрос возвращает все подходящие задачи.

- `skipAccessCheck()` — отключает проверку прав.

Если подходящих задач нет, метод `getList()` возвращает пустой массив. Если запрос не удалось собрать или выполнить, метод выбрасывает исключение `Bitrix\Tasks\Provider\Exception\TaskListException`. Метод `getCount()` выбрасывает исходное исключение без обертки. Неизвестные поля в выборке и фильтре запрос пропускает без ошибки.

### Фильтр TaskList {#tasklist-filter}

Фильтр `TaskList` — ассоциативный массив. Ключ задает поле в верхнем регистре, а префикс перед именем поля задает сравнение.

| Префикс | Сравнение |
|---|---|
| `=` | Равно. Если значение — массив, подходит любое значение из массива |
| без префикса | Для числовых полей и дат — равно. Если значение — массив, подходит любое значение из массива. Для поля `TITLE` — содержит подстроку |
| `!` | Не равно. Если значение — массив, не входит в массив. Для строковых полей — не содержит подстроку |
| `!=` | Не равно |
| `@` | Входит в массив значений |
| `>`, `>=`, `<`, `<=` | Больше, больше или равно, меньше, меньше или равно |
| `%` | Содержит подстроку. Работает только для строковых полей |

Поля фильтра называются так же, как в фильтре `getList()`, но в верхнем регистре, например `RESPONSIBLE_ID`, `GROUP_ID`, `REAL_STATUS`. Кроме них класс поддерживает поля, которых нет в `getList()`.

- `MEMBER` и `DOER` — один ID любого сотрудника. Фильтры выбирают задачи, где сотрудник участвует в любой роли или выполняет задачу, независимо от ID в конструкторе `TaskQuery`.

- `ONLY_ROOT_TASKS` со значением `Y` — задачи верхнего уровня.

- `UF_*` — значение пользовательского поля. Без префикса фильтр ищет точное совпадение, префикс `%` — часть строки.

- `ZOMBIE` со значением `N` — задачи без служебных строк удаленных задач. Запрос `TaskQuery` сам эти строки не исключает.

Чтобы объединить условия через ИЛИ, вложите их массивом с ключом `'::LOGIC' => 'OR'`. Ключ вложенного массива — число или строка, которая начинается с `::SUBFILTER-`, например `'::SUBFILTER-ROLE'`. Фильтры `ACCOMPLICE` и `AUDITOR` внутри условия ИЛИ отсекают задачи без соисполнителей или наблюдателей, как и в `getList()`.

Для статуса используйте ключ `REAL_STATUS`. Поле `STATUS` в этом запросе вычисляемое. Для просроченных и непросмотренных задач оно содержит отрицательные значения вместо статуса.

Строку даты фильтр `TaskList` трактует в часовом поясе текущего пользователя. В агенте текущего пользователя нет, и та же строка может обозначать другой момент времени. Передавайте даты объектами `Bitrix\Main\Type\DateTime`.

Ключ `CHECK_PERMISSIONS` из фильтра классического метода `CTasks::GetList()` запрос `TaskQuery` пропускает. Права отключает только метод `skipAccessCheck()`.

**Пример.** Код выбирает все задачи, где подчиненный участвует в любой роли, с учетом прав руководителя.

```php
use Bitrix\Tasks\Provider\Query\TaskQuery;
use Bitrix\Tasks\Provider\TaskList;

$rows = (new TaskList())->getList(
    (new TaskQuery($managerId))
        ->setSelect(['ID', 'TITLE', 'REAL_STATUS'])
        ->setWhere(['MEMBER' => $employeeId])
        ->setLimit(50)
);
```

## Обработать много задач {#batch}

Чтобы обработать все задачи, например в агенте, читайте их порциями. Сортируйте выборку по ID и в каждой следующей порции добавляйте условие, что ID больше последнего прочитанного. Такой обход не пропускает и не повторяет задачи, если список меняется во время обработки. Смещение для этого не подходит. Если задачи добавляются или удаляются во время обхода, страницы сдвигаются.

Пример использует класс `TaskList`, чтобы исключить служебные строки удаленных задач условием `'ZOMBIE' => 'N'`. Если в Битрикс24 не работали старые версии модуля, тот же обход можно выполнить методом `getList()` с условием `['id', '>', $lastId]` и аргументом `skipAccessCheck: true`.

**Пример.** Код обрабатывает все задачи проекта порциями по 500 задач без проверки прав.

```php
use Bitrix\Tasks\Provider\Query\TaskQuery;
use Bitrix\Tasks\Provider\TaskList;

$lastId = 0;
$taskList = new TaskList();

do
{
    $rows = $taskList->getList(
        (new TaskQuery($userId))
            ->skipAccessCheck()
            ->setSelect(['ID', 'TITLE'])
            ->setWhere([
                'GROUP_ID' => $groupId,
                'ZOMBIE' => 'N',
                '>ID' => $lastId,
            ])
            ->setOrder(['ID' => 'ASC'])
            ->setLimit(500)
    );

    foreach ($rows as $row)
    {
        // обработка задачи
        $lastId = (int)$row['ID'];
    }
}
while (count($rows) === 500);
```

Агент работает без сотрудника, поэтому пример отключает проверку прав. Для такого запроса учитывайте следующее.

- После вызова `skipAccessCheck()` ID сотрудника в конструкторе `TaskQuery` не влияет на фильтры `GROUP_ID`, `ID`, `REAL_STATUS` и другие поля задачи. Можно передать любой ID или `0`.

- ID сотрудника нужен, только если запрос использует его данные, например вычисляемое поле `STATUS` или фильтры по просмотру и счетчикам. Тогда передайте ID сотрудника, для которого считается результат.

- Если обработка долгая, сохраняйте `$lastId` между запусками агента и продолжайте с него. Способы описаны в статье [Агенты и фоновые задачи](./../../framework/background-jobs.md).

## Прочитать строки через TaskTable {#tasktable}

Класс ORM `Bitrix\Tasks\Internals\TaskTable` выполняет обычный ORM-запрос к таблице задач. Он подходит для служебных выборок, например для отчета по всем задачам или для чтения текущих данных перед [проверкой прав на изменение](./tasks.md#update-task).

Класс не учитывает права сотрудника и не собирает участников и теги в удобном виде. Для вывода задач сотруднику используйте провайдер `TaskProvider`.

Строки удаленных задач класс тоже не исключает. В фильтре `TaskTable` записывайте условие как `'=ZOMBIE' => 'N'`.

В `TaskTable` поле `STATUS` хранит настоящий статус числом из констант `Bitrix\Tasks\Internals\Task\Status`. Вычисляемое поле `STATUS` и поле `REAL_STATUS` есть только в запросе `TaskQuery`.

Фильтр `TaskTable` записывают по правилам ORM. Например, префикс `!@` означает, что значение не входит в массив. Операторы описаны в статье [Выборка данных](./../../orm/querying-data.md).

**Пример.** Код считает задачи проекта, кроме завершенных и отложенных, без учета прав.

```php
use Bitrix\Tasks\Internals\Task\Status;
use Bitrix\Tasks\Internals\TaskTable;

$count = TaskTable::getCount([
    '=GROUP_ID' => $groupId,
    '=ZOMBIE' => 'N',
    '!@STATUS' => [Status::COMPLETED, Status::DEFERRED],
]);
```

### Сгруппировать задачи {#group-tasks}

Запрос ORM с агрегатной функцией группирует строки по остальным полям выборки. Так считают задачи по статусам, ответственным или проектам.

**Пример.** Код считает задачи проекта по статусам без учета прав.

```php
use Bitrix\Main\ORM\Fields\ExpressionField;
use Bitrix\Tasks\Internals\TaskTable;

$rows = TaskTable::getList([
    'select' => [
        'STATUS',
        new ExpressionField('CNT', 'COUNT(*)'),
    ],
    'filter' => [
        '=GROUP_ID' => $groupId,
        '=ZOMBIE' => 'N',
    ],
])->fetchAll();

$countByStatus = array_column($rows, 'CNT', 'STATUS');
```

Ключи массива `$countByStatus` — числовые статусы из констант `Bitrix\Tasks\Internals\Task\Status`. Не меняйте задачи через `TaskTable`. Почему запись в обход команд ломает связанные данные, описано в разделе [Выбрать API для записи](./tasks.md#choose-write-api).

## Заменить CTasks::GetList() {#classic-getlist-replacements}

Классический метод `CTasks::GetList()` заменяет метод `TaskProvider::getList()`. Для случаев из раздела [Учесть ограничения getList()](#v2-limitations) замена — класс `TaskList` с запросом `TaskQuery`.

Метод `CTasks::GetList()` сам передает сортировку, фильтр и поля в объект `TaskQuery` и выполняет его методом `TaskList::getList()`. Поэтому ключи фильтра при переходе меняются по-разному:

-  для `TaskList` ключи совпадают,

-  для `getList()` их нужно записать в стиле camelCase. Соответствие других классических методов приведено в статье [Как выбрать API задач](./choose-tasks-api.md#classic-api).

| `CTasks::GetList()` | `TaskProvider::getList()` | `TaskList` и `TaskQuery` | Что учесть |
|---|---|---|---|
| Первый аргумент — сортировка | `TaskListSort` | `setOrder()` | В `getList()` поля в стиле camelCase, направление `asc` или `desc` |
| Второй аргумент — фильтр | `TaskListArrayFilter` | `setWhere()` | Ключ `CHECK_PERMISSIONS` новые классы пропускают. Права отключают аргумент `skipAccessCheck: true` или метод `skipAccessCheck()` |
| Третий аргумент — поля | `TaskListSelect` | `setSelect()` | С пустым списком полей классический метод возвращал все поля. Новые классы без списка возвращают только ID |
| `USER_ID` в четвертом аргументе | Аргумент `userId` | Аргумент конструктора `TaskQuery` | Без `USER_ID` классический метод брал текущего пользователя. Новым классам передавайте ID явно |
| `NAV_PARAMS` в четвертом аргументе | Объект `Pager` | `setLimit()` и `setOffset()` | Номер страницы переведите в смещение или используйте [`PageNavigation`](../../api-reference/main/ui/page-navigation/index.md) из раздела [Разбить список на страницы](#pagination) |
| Результат `CDBResult` и метод `Fetch()` | Коллекция объектов задач | Массив строк | Число всех задач возвращает `TaskList::getCount()` |

## Проверить результат {#check-result}

Перед публикацией кода выполните в тестовом Битрикс24 несколько проверок.

1. Выберите задачи от имени сотрудника без особых прав и убедитесь, что в списке нет чужих задач, которые он не может открыть.

2. Выберите тот же список от имени администратора и сравните число задач.

3. Проверьте, что нужные свойства объектов задач заполнены. Поле, которого нет в выборке или в списке разрешенных полей, метод пропускает без ошибки.

4. Если фильтр использует фильтры `member` или `doer`, убедитесь, что в них передан тот же ID, что в `userId`.

5. Для постраничного вывода проверьте, что `TaskList::getCount()` совпадает с числом задач на всех страницах.

6. Для обхода порциями проверьте, что последняя порция обработана и цикл завершился.
