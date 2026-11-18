---
title: Создание, изменение и удаление задач
description: "Как создать, изменить и удалить задачу командами модуля Задачи. Что делает команда в отличие от записи через TaskTable, проверка прав сотрудника, подзадачи и задачи в проекте, создание без дублей по внешнему коду, крайний срок, завершение с результатом, делегирование и смена участников."
---

Задачи создают, меняют и удаляют командами из пространства имен `Bitrix\Tasks\V2\Public\Command\Task`. Команда сохраняет задачу и выполняет все действия, которые ожидают пользователи и другие модули, — добавляет участников, создает чат, отправляет уведомления, обновляет поиск и вызывает события. Различия между командами и записью напрямую в таблицу описаны в разделе [Выбрать API для записи](#choose-write-api).

Команды не проверяют права сотрудника. Если код выполняет действие по запросу сотрудника, сначала проверьте его право способом из раздела [Проверить права сотрудника](#check-permissions).

Чтение задач описано в статье [Чтение и выборка задач](./read-tasks.md), поля и статусы — в статье [Поля, участники и статусы задач](./fields-and-constants.md).

Перед запуском примеров подключите [пролог Bitrix Framework](./../../framework/request-lifecycle.md) и модуль `tasks`. Полный код подключения приведен в примере из раздела [Создать задачу](#create-task), в остальных примерах его нет.

Переменная `$userId` в примерах содержит ID сотрудника, от имени которого выполняется действие, `$responsibleId` — ID ответственного, `$taskId` — ID задачи. Замените значения полей на свои.

## Выбрать API для записи {#choose-write-api}

Записывайте задачи командами. Классические методы `CTasks::Add()`, `CTaskItem::update()` и другие устарели и внутри вызывают те же сервисы, что и команды, поэтому результат записи у них такой же. Класс ORM `Bitrix\Tasks\Internals\TaskTable` записывает только строку задачи.

Таблица сравнивает результат записи одной и той же задачи.

| Что происходит при записи | Команды | `TaskTable::add()` и `update()` |
|---|---|---|
| Участники — постановщик, ответственный, соисполнители, наблюдатели | Команда записывает роли участников | Роли не записываются, в строке задачи остаются только ID постановщика и ответственного |
| Чат задачи и уведомления | Команда создает чат с участниками и отправляет уведомления | Чата и уведомлений нет |
| События `OnBeforeTaskAdd`, `OnTaskUpdate` и другие | Команда вызывает | Не вызываются. Обработчики проекта и других модулей не узнают об изменении |
| Поисковый индекс | Команда обновляет | Не меняется |
| Права сотрудника | Не проверяются | Не проверяются |

Классом `TaskTable` пользуйтесь только для чтения. Выбор API для остальных задач модуля описан в статье [Как выбрать API задач](./choose-tasks-api.md).

## Проверить права сотрудника {#check-permissions}

Право проверяет метод `Bitrix\Tasks\Access\TaskAccessController::can()`. Метод принимает четыре аргумента.

1. ID сотрудника.

2. Действие — константа класса `Bitrix\Tasks\Access\ActionDictionary`, например `ACTION_TASK_SAVE`.

3. ID задачи или `null` для новой задачи.

4. Дополнительные данные для проверки. Для создания и изменения это модель новых данных задачи `Bitrix\Tasks\Access\Model\TaskModel`.

Модель нужна, когда право зависит от новых значений. Например, сотрудник может редактировать задачу, но не может передать ее сотруднику из другого отдела. Без модели проверка права `ACTION_TASK_SAVE` всегда возвращает `false`. Модель собирает метод `TaskModel::createFromArray()` из ключей в верхнем регистре, они указаны в колонке «Ключ модели прав» таблицы из раздела [Подготовить данные задачи](#prepare-task-data).

Таблица перечисляет действия для операций этой статьи. Полный список действий приведен в статье [Права доступа к задачам](./permissions.md#actions).

| Операция | Действие `ActionDictionary` | Дополнительные данные |
|---|---|---|
| Создать или изменить задачу | `ACTION_TASK_SAVE` | Модель новых данных |
| Перенести крайний срок | `ACTION_TASK_DEADLINE` | Массив с ключами `DEADLINE` и `DEADLINE_REASON` |
| Сменить статус | `ACTION_TASK_START`, `ACTION_TASK_PAUSE`, `ACTION_TASK_COMPLETE`, `ACTION_TASK_COMPLETE_RESULT`, `ACTION_TASK_DEFER`, `ACTION_TASK_RENEW`, `ACTION_TASK_APPROVE`, `ACTION_TASK_DISAPPROVE`. Соответствие командам — в разделе [Сменить статус](#change-status) | — |
| Сменить участников | `ACTION_TASK_DELEGATE`, `ACTION_TASK_CHANGE_RESPONSIBLE`, `ACTION_TASK_CHANGE_ACCOMPLICES`, `ACTION_TASK_ADD_AUDITORS`, `ACTION_TASK_SAVE`. Соответствие командам — в разделе [Сменить участников](#change-members) | Модель новых участников, для `ACTION_TASK_ADD_AUDITORS` — массив ID новых наблюдателей |
| Удалить задачу | `ACTION_TASK_REMOVE` | — |

Код, который работает без сотрудника, например агент или импорт, права не проверяет. Команде он все равно передает ID пользователя, от имени которого выполняется действие.

## Подготовить данные задачи {#prepare-task-data}

Команды создания и изменения принимают объект задачи `Bitrix\Tasks\V2\Internal\Entity\Task`. Объект неизменяемый, поэтому все значения передают при создании. Метод `Task::mapFromArray()` собирает объект из массива. Ключи массива записываются в стиле camelCase.

Класс задачи и классы конфигураций команд относятся к пространству имен `V2\Internal`. Снаружи модуля внутренние классы не используют, но эти классы — исключение, без них команду не запустить. Конфигурации команд перечислены ниже.

- `Bitrix\Tasks\V2\Internal\Service\Task\Action\Add\Config\AddConfig` — создание задачи.

- `Bitrix\Tasks\V2\Internal\Service\Task\Action\Update\Config\UpdateConfig` — изменение, перенос срока, смена статуса и участников.

- `Bitrix\Tasks\V2\Internal\Service\Task\Action\Delete\Config\DeleteConfig` — удаление.

Обязательный аргумент конфигураций — `userId` типа `int`. Остальные аргументы необязательные и передаются по имени. Основные необязательные аргументы перечислены ниже.

- `useConsistency` типа `bool`, по умолчанию `false`. Есть в `AddConfig`, `UpdateConfig` и `DeleteConfig`. Значение `true` выполняет запись по стратегии из файла `tasks/config/consistency.php`. Для создания, изменения и удаления задачи там указана стратегия `transaction`. Она выполняет запись в транзакции базы данных и откатывает ее, если запись выбросила исключение.

- `skipBP` типа `bool`, по умолчанию `false`. Есть в `AddConfig`, `UpdateConfig` и `DeleteConfig`. Значение `true` не запускает бизнес-процессы при записи задачи.

- `skipNotifications` типа `bool`, по умолчанию `false`. Есть только в `UpdateConfig`. Значение `true` отключает уведомления об изменении задачи.

- `skipComments` типа `bool`, по умолчанию `false`. Есть только в `UpdateConfig`. Значение `true` отключает комментарий в задаче о смене статуса, участников, крайнего срока, проекта или потока.

- `skipExchangeSync` типа `bool`, по умолчанию `false`. Есть только в `DeleteConfig`. Значение `true` не удаляет задачу из Microsoft Exchange, если синхронизация с Exchange включена.

Основные ключи для создания и изменения задачи приведены в таблице. Соответствие ключей полям `TaskTable`, теги и пользовательские поля описаны в статье [Поля, участники и статусы задач](./fields-and-constants.md).

*Обязательные при создании задачи ключи обозначены \*.*

| Ключ | Описание | Ключ модели прав `TaskModel` |
|---|---|---|
| title*<br>`string` | Название задачи | — |
| creatorId*<br>`int` | ID постановщика | `CREATED_BY` |
| responsibleId*<br>`int` | ID ответственного | `RESPONSIBLE_ID` |
| description<br>`string` | Описание задачи | — |
| deadlineTs<br>`int` | Крайний срок как метка времени Unix | — |
| startPlanTs<br>`int` | Плановая дата начала как метка времени Unix | — |
| endPlanTs<br>`int` | Плановая дата завершения как метка времени Unix | — |
| accomplicesIds<br>`int[]` | ID соисполнителей | `ACCOMPLICES` |
| auditorsIds<br>`int[]` | ID наблюдателей | `AUDITORS` |
| groupId<br>`int` | ID проекта, в котором создается задача | `GROUP_ID` |
| flowId<br>`int` | ID потока, в котором создается задача | `FLOW_ID` |
| parentId<br>`int` | ID родительской задачи. Задача станет подзадачей | `PARENT_ID` |
| priority<br>`string` | Приоритет. Допустимые значения `low` — низкий, `average` — средний, `high` — высокий | — |
| needsControl<br>`bool` | Включает контроль. Если `true`, после завершения задача ждет проверки постановщика | — |
| requireResult<br>`bool` | Требует результат. Если `true`, сотрудник не завершит задачу, пока не добавит результат | — |
| xmlId<br>`string` | Внешний код для связи с другой системой | — |
| id<br>`int` | ID существующей задачи. Обязателен при изменении, при создании не передают | `ID` |

Ключи `creatorId`, `responsibleId`, `accomplicesIds` и `auditorsIds` метод превращает в объекты пользователей, `groupId` — в объект проекта, `flowId` — в объект потока. Ключ, которого нет в массиве, остается `null`. При изменении задачи такое поле команда не меняет.

Значение неверного типа метод тоже превращает в `null` без ошибки. Например, нечисловая строка в `deadlineTs` или неизвестное значение `priority` не изменят задачу. Передавайте значения тех типов, которые указаны в таблице.

Если ключ не передан при создании, приоритет будет средним, а контроль выключен.

Чтобы очистить поле при изменении, передайте `0`, а не `null` и не пустую строку. Значение `0` в ключах `deadlineTs`, `startPlanTs` и `endPlanTs` удаляет крайний срок и плановые даты. Значение `0` в ключе `groupId` убирает задачу из проекта. Сотрудник экстранета убрать задачу из проекта не может, команда вернет ошибку.

### Задать крайний срок {#deadline}

Даты в объекте задачи хранятся как метки времени Unix. Метка обозначает один момент времени в любом часовом поясе, поэтому результат не зависит от настроек текущего пользователя.

Чтобы передать дату из объекта `Bitrix\Main\Type\DateTime`, вызовите его метод `getTimestamp()`. Крайний срок через три дня от текущего момента задает выражение `time() + 3 * 86400`. Число 86400 — количество секунд в сутках.

Если дату ввел сотрудник, создайте объект `DateTime` с учетом его часового пояса и только затем получите метку времени. Как это сделать, описано в статье [Дата и время](./../../advanced/datetime.md), в разделе «Работа с часовыми поясами пользователя».

В классическом API строка даты в массиве полей `DEADLINE` трактуется в часовом поясе текущего пользователя. В агенте или фоновом задании текущего пользователя нет, и тот же код может сохранить другой срок. Метки времени в командах такой ошибки не дают.

## Создать задачу {#create-task}

Команда `AddTaskCommand` создает задачу. Она принимает аргументы `task` — объект задачи и `config` — конфигурацию `AddConfig` с ID пользователя, от имени которого создается задача.

Создание задачи по запросу сотрудника состоит из четырех шагов.

1. Соберите объект задачи методом `Task::mapFromArray()`.

2. Соберите модель прав методом `TaskModel::createFromArray()` из тех же значений с ключами в верхнем регистре.

3. Проверьте право `ACTION_TASK_SAVE`. У новой задачи еще нет ID, поэтому третьим аргументом метода `can()` передайте `null`, а четвертым — модель.

4. Запустите команду и проверьте результат.

**Пример.** Код создает задачу с высоким приоритетом, наблюдателем и крайним сроком через три дня. Переменная `$responsibleId` содержит ID ответственного, `$auditorId` — ID наблюдателя.

```php
use Bitrix\Main\Loader;
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\Model\TaskModel;
use Bitrix\Tasks\Access\TaskAccessController;
use Bitrix\Tasks\V2\Internal\Entity\Task;
use Bitrix\Tasks\V2\Internal\Service\Task\Action\Add\Config\AddConfig;
use Bitrix\Tasks\V2\Public\Command\Task\AddTaskCommand;

if (!Loader::includeModule('tasks'))
{
    throw new \RuntimeException('Не удалось подключить модуль Задачи');
}

$task = Task::mapFromArray([
    'title' => 'Подготовить отчет за квартал',
    'description' => 'Собрать данные по всем отделам',
    'creatorId' => $userId,
    'responsibleId' => $responsibleId,
    'auditorsIds' => [$auditorId],
    'deadlineTs' => time() + 3 * 86400,
    'priority' => 'high',
]);

$model = TaskModel::createFromArray([
    'CREATED_BY' => $userId,
    'RESPONSIBLE_ID' => $responsibleId,
    'AUDITORS' => [$auditorId],
]);

if (!TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_SAVE, null, $model))
{
    throw new \RuntimeException('Нет прав на создание задачи');
}

$result = (new AddTaskCommand(
    task: $task,
    config: new AddConfig(userId: $userId),
))->run();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}

$taskId = (int)$result->getId();
```

Метод `getId()` результата возвращает ID созданной задачи, а метод `getObject()` — объект задачи. После создания модуль вызывает событие `OnTaskAdd`, создает чат задачи с ее участниками и отправляет им уведомления.

Все команды статьи сообщают о результате одинаково.

- Исключение `Bitrix\Main\Command\Exception\CommandValidationException` метод `run()` выбрасывает до записи. Причины:

   - не передан обязательный ключ задачи,

   - ID задачи в командах статуса, участников, переноса срока и удаления не положительное число.

  Команда не перехватывает исключение, и оно доходит до вызывающего кода. Примеры этой статьи исключение тоже не перехватывают. Пример с блоком `try/catch` приведен в разделе [Проверить права и запустить команду](./choose-tasks-api.md#run-command).

- Ошибку в результате команда возвращает, если сохранение не удалось или обработчик события отменил операцию. Создание отменяет обработчик `OnBeforeTaskAdd`, изменение — `OnBeforeTaskUpdate`, удаление — `OnBeforeTaskDelete`. Тогда метод `isSuccess()` возвращает `false`, а текст ошибок возвращает метод `getErrorMessages()`.

- Метод `getObject()` при успехе возвращает объект задачи. Команда создания возвращает новую задачу, команды изменения, переноса срока, смены статуса и участников — задачу после изменения. У команды `DeleteTaskCommand` метод возвращает `null`.

- Метод `getId()` при успехе возвращает ID задачи. У команды `DeleteTaskCommand` метод возвращает `null`.

Настройки потока могут сами назначить ответственного и крайний срок задачи. Если передан ключ `flowId`, значения после создания могут отличаться от переданных.

### Создать подзадачу или задачу в проекте {#subtask-and-project}

Чтобы создать подзадачу, передайте ID родительской задачи в ключе `parentId`. Чтобы создать задачу в проекте, передайте ID проекта в ключе `groupId`. Добавьте те же значения в модель прав с ключами `PARENT_ID` и `GROUP_ID`, иначе проверка их не учтет.

С этими ключами проверка права `ACTION_TASK_SAVE` учитывает, может ли сотрудник прочитать родительскую задачу и создавать задачи в проекте. Без них проверка пропустит подзадачу к задаче, которую сотрудник не видит, и задачу в проекте, где ему нельзя создавать задачи.

**Пример.** Код создает подзадачу в проекте. Переменная `$parentTaskId` содержит ID родительской задачи, `$groupId` — ID проекта. Остальной код такой же, как в примере из раздела [Создать задачу](#create-task). Код проверяет право `ACTION_TASK_SAVE` с моделью, запускает команду `AddTaskCommand` и проверяет результат.

```php
use Bitrix\Tasks\Access\Model\TaskModel;
use Bitrix\Tasks\V2\Internal\Entity\Task;

$task = Task::mapFromArray([
    'title' => 'Собрать данные отдела продаж',
    'creatorId' => $userId,
    'responsibleId' => $responsibleId,
    'parentId' => $parentTaskId,
    'groupId' => $groupId,
]);

$model = TaskModel::createFromArray([
    'CREATED_BY' => $userId,
    'RESPONSIBLE_ID' => $responsibleId,
    'PARENT_ID' => $parentTaskId,
    'GROUP_ID' => $groupId,
]);
```

### Потребовать результат и проверку {#require-result-and-control}

Два ключа меняют то, как задачу завершают.

- `requireResult` — сотрудник не завершит задачу, пока не добавит результат. Постановщика и администратора требование не ограничивает.

- `needsControl` — после завершения задача ждет проверки постановщика. Постановщик принимает работу или возвращает задачу на доработку. Если задачу завершает сам постановщик или он же ответственный, проверка не нужна и задача сразу завершается.

**Пример.** Код создает задачу с обязательным результатом и проверкой постановщиком. Остальной код такой же, как в примере из раздела [Создать задачу](#create-task). Код собирает модель прав, проверяет право `ACTION_TASK_SAVE`, запускает команду `AddTaskCommand` и проверяет результат.

```php
use Bitrix\Tasks\V2\Internal\Entity\Task;

$task = Task::mapFromArray([
    'title' => 'Подготовить договор с поставщиком',
    'creatorId' => $userId,
    'responsibleId' => $responsibleId,
    'requireResult' => true,
    'needsControl' => true,
]);
```

Как завершить такую задачу, описано в разделе [Завершить задачу с результатом](#complete-task). Включить или выключить требование результата у существующей задачи можно командой `RequireResultCommand` из статьи [Чат, результаты, файлы и учет времени](./chat-and-related-data.md#result).

### Не создавать дубли {#avoid-duplicates}

Команда создает новую задачу при каждом запуске. Если задачи создает интеграция с другой системой, повторная доставка того же события создаст дубль.

Передайте идентификатор из другой системы в ключе `xmlId`. Перед созданием найдите задачу с этим внешним кодом. Если задача есть, используйте ее ID, если нет — создайте задачу. Чтобы обновить найденную задачу, передайте ее ID команде из раздела [Изменить задачу](#update-task).

Интеграция работает без сотрудника, поэтому код примера права не проверяет. Задачу создает технический пользователь. Храните его ID в настройках модуля интеграции и передавайте в ключе `creatorId` и в конфигурации `AddConfig`.

**Пример.** Код создает задачу по заявке из внешней системы, только если задачи с этим кодом еще нет. Переменная `$externalId` содержит ID заявки, `$title` — ее название, `$userId` — ID технического пользователя, `$responsibleId` — ID ответственного. Оба значения хранятся в настройках модуля интеграции.

```php
use Bitrix\Tasks\Internals\TaskTable;
use Bitrix\Tasks\V2\Internal\Entity\Task;
use Bitrix\Tasks\V2\Internal\Service\Task\Action\Add\Config\AddConfig;
use Bitrix\Tasks\V2\Public\Command\Task\AddTaskCommand;

$xmlId = 'helpdesk-' . $externalId;

$existing = TaskTable::getRow([
    'select' => ['ID'],
    'filter' => [
        '=XML_ID' => $xmlId,
        '=ZOMBIE' => 'N',
    ],
]);

if ($existing !== null)
{
    $taskId = (int)$existing['ID'];
}
else
{
    $result = (new AddTaskCommand(
        task: Task::mapFromArray([
            'title' => $title,
            'creatorId' => $userId,
            'responsibleId' => $responsibleId,
            'xmlId' => $xmlId,
        ]),
        config: new AddConfig(userId: $userId),
    ))->run();

    if (!$result->isSuccess())
    {
        throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
    }

    $taskId = (int)$result->getId();
}
```

Условие `'=ZOMBIE' => 'N'` исключает служебные строки удаленных задач, подробнее — в разделе [Прочитать строки через TaskTable](./read-tasks.md#tasktable). Префикс `helpdesk-` отделяет коды одной интеграции от кодов другой.

Модуль не проверяет уникальность поля `XML_ID`. Проверка перед созданием защищает от дублей при последовательной обработке. Два параллельных процесса могут одновременно не найти задачу и создать две. Обрабатывайте события одной заявки последовательно.

## Изменить задачу {#update-task}

Команда `UpdateTaskCommand` меняет несколько полей за один вызов. Она принимает аргументы `task` — объект задачи с ID и только теми полями, которые нужно изменить, и `config` — конфигурацию `UpdateConfig` с ID пользователя. Остальные поля останутся прежними. Для отдельного действия со сроком, статусом или участниками используйте профильные команды из разделов ниже.

Перед изменением проверьте право `ACTION_TASK_SAVE` в три шага.

1. Прочитайте текущие данные задачи через класс `TaskTable` — модели нужны поля `ID`, `CREATED_BY`, `RESPONSIBLE_ID` и `GROUP_ID`.

2. Соберите модель методом `TaskModel::createFromArray($newData, $current)`. В первом аргументе передайте новые значения ключами из колонки «Ключ модели прав», во втором — текущие данные.

3. Вызовите метод `can()` с ID задачи и моделью.

**Пример.** Код меняет название и ответственного задачи. Переменная `$newResponsibleId` содержит ID нового ответственного.

```php
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\Model\TaskModel;
use Bitrix\Tasks\Access\TaskAccessController;
use Bitrix\Tasks\Internals\TaskTable;
use Bitrix\Tasks\V2\Internal\Entity\Task;
use Bitrix\Tasks\V2\Internal\Service\Task\Action\Update\Config\UpdateConfig;
use Bitrix\Tasks\V2\Public\Command\Task\UpdateTaskCommand;

$current = TaskTable::getRow([
    'select' => ['ID', 'CREATED_BY', 'RESPONSIBLE_ID', 'GROUP_ID'],
    'filter' => ['=ID' => $taskId],
]);

if ($current === null)
{
    throw new \RuntimeException('Задача не найдена');
}

$model = TaskModel::createFromArray(['RESPONSIBLE_ID' => $newResponsibleId], $current);

if (!TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_SAVE, $taskId, $model))
{
    throw new \RuntimeException('Нет прав на изменение задачи');
}

$result = (new UpdateTaskCommand(
    task: Task::mapFromArray([
        'id' => $taskId,
        'title' => 'Подготовить отчет за полугодие',
        'responsibleId' => $newResponsibleId,
    ]),
    config: new UpdateConfig(userId: $userId),
))->run();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}
```

После изменения модуль вызывает событие `OnTaskUpdate`. Метод `getObject()` результата возвращает задачу с сохраненными данными. Если задача с переданным ID не существует, команда возвращает ошибку в результате.

### Перенести крайний срок {#update-deadline}

Для переноса срока используйте команду `Bitrix\Tasks\V2\Public\Command\Task\Deadline\UpdateDeadlineCommand`. Она учитывает ограничения задачи на перенос. Задача может ограничивать крайнюю дату переноса и число переносов или требовать причину. Если перенос нарушает ограничение, команда возвращает ошибку в результате.

Ограничения действуют не для всех. Постановщика, администратора и сотрудника с правом редактировать задачу они не касаются. Остальным пользователям, например ответственному, команда их применяет.

Эта команда не увеличивает счетчик переносов. Поэтому ограничение числа переносов на ее вызовы не влияет.

Если срок переносят по запросу сотрудника, до запуска команды проверьте право `ACTION_TASK_DEADLINE`. Четвертым аргументом метода `can()` передайте массив с ключами `DEADLINE` — новый срок объектом `Bitrix\Main\Type\DateTime` и `DEADLINE_REASON` — причина переноса. Если задача требует причину, без ключа `DEADLINE_REASON` проверка вернет `false` для сотрудника, на которого действуют ограничения. Интерфейс модуля проверяет перенос так же.

Команда принимает аргументы `taskId` — ID задачи, `deadlineTs` — новый срок как метку времени Unix, `updateConfig` — конфигурацию `UpdateConfig` и необязательный `reason` — причину переноса. Аргумент конфигурации у этой команды называется `updateConfig`, а не `config`.

**Пример.** Код проверяет право и переносит срок задачи на неделю от текущего момента.

```php
use Bitrix\Main\Type\DateTime;
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\TaskAccessController;
use Bitrix\Tasks\V2\Internal\Service\Task\Action\Update\Config\UpdateConfig;
use Bitrix\Tasks\V2\Public\Command\Task\Deadline\UpdateDeadlineCommand;

$deadlineTs = time() + 7 * 86400;
$reason = 'Нужны данные еще одного отдела';

$canChange = TaskAccessController::can(
    $userId,
    ActionDictionary::ACTION_TASK_DEADLINE,
    $taskId,
    [
        'DEADLINE' => DateTime::createFromTimestamp($deadlineTs),
        'DEADLINE_REASON' => $reason,
    ]
);

if (!$canChange)
{
    throw new \RuntimeException('Нет прав на перенос срока');
}

$result = (new UpdateDeadlineCommand(
    taskId: $taskId,
    deadlineTs: $deadlineTs,
    updateConfig: new UpdateConfig(userId: $userId),
    reason: $reason,
))->run();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}
```

## Сменить статус или участников {#status-and-members}

Статус и участников задачи меняют отдельными командами. Каждая команда выполняет одно действие и после изменения вызывает событие `OnTaskUpdate`.

### Сменить статус {#change-status}

Команды статуса находятся в пространстве имен `Bitrix\Tasks\V2\Public\Command\Task\Status` и принимают аргументы `taskId` — ID задачи и `config` — конфигурацию `UpdateConfig`.

| Команда | Действие | Право для проверки |
|---|---|---|
| `StartTaskCommand` | Начинает выполнение задачи | `ACTION_TASK_START` |
| `PauseTaskCommand` | Приостанавливает выполнение | `ACTION_TASK_PAUSE` |
| `CompleteTaskCommand` | Завершает задачу. Если включен контроль, задача ждет проверки постановщика | Два условия. Первое — `ACTION_TASK_COMPLETE` или `ACTION_TASK_APPROVE`. Второе — `ACTION_TASK_COMPLETE_RESULT`. Подробнее — в разделе [Завершить задачу с результатом](#complete-task) |
| `DeferTaskCommand` | Откладывает задачу | `ACTION_TASK_DEFER` |
| `RenewTaskCommand` | Возобновляет завершенную или отложенную задачу | `ACTION_TASK_RENEW` |
| `ApproveTaskCommand` | Принимает работу по задаче на контроле | `ACTION_TASK_APPROVE` |
| `DisapproveTaskCommand` | Возвращает задачу на контроле на доработку | `ACTION_TASK_DISAPPROVE` |

**Пример.** Код начинает выполнение задачи от имени сотрудника.

```php
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\TaskAccessController;
use Bitrix\Tasks\V2\Internal\Service\Task\Action\Update\Config\UpdateConfig;
use Bitrix\Tasks\V2\Public\Command\Task\Status\StartTaskCommand;

if (!TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_START, $taskId))
{
    throw new \RuntimeException('Нет прав на начало выполнения задачи');
}

$result = (new StartTaskCommand(
    taskId: $taskId,
    config: new UpdateConfig(userId: $userId),
))->run();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}
```

Остальные команды статуса запускаются так же, меняются только класс команды и действие для проверки. Исключение — команда `CompleteTaskCommand`, перед ней нужна дополнительная проверка, см. раздел [Завершить задачу с результатом](#complete-task).

### Завершить задачу с результатом {#complete-task}

Если в задаче включено требование результата, сотрудник не может завершить задачу без результата. Запрет действует только через проверку права `ACTION_TASK_COMPLETE_RESULT`. Команда `CompleteTaskCommand` его не проверяет и завершит задачу без результата.

Перед завершением проверьте два условия.

1. У сотрудника есть право `ACTION_TASK_COMPLETE` или `ACTION_TASK_APPROVE`.

2. Проверка `ACTION_TASK_COMPLETE_RESULT` возвращает `true`. Результат проверки зависит от состояния задачи.

    - Для незавершенной задачи без обязательного результата проверка возвращает `true`.

    - Для постановщика и администратора проверка незавершенной задачи возвращает `true`.

    - Если результат обязателен, проверка возвращает `true`, только когда последний результат задачи открыт. Открытый результат имеет статус `Bitrix\Tasks\V2\Internal\Entity\Result\Status::Open`. Новый результат получает этот статус сразу, а при завершении задачи модуль закрывает результаты. Подробнее — в разделе [Добавить результат](./chat-and-related-data.md#result).

    - Для уже завершенной задачи проверка возвращает `false`.

Результат добавляет команда `Bitrix\Tasks\V2\Public\Command\Task\Result\AddResultCommand`. Она принимает аргументы `result` — объект результата `Bitrix\Tasks\V2\Internal\Entity\Result` и `userId` — ID автора. Объект результата собирает метод `Result::mapFromArray()` из ключей `taskId` — ID задачи и `text` — текст результата. Подробнее о результатах — в разделе [Добавить результат](./chat-and-related-data.md#result).

**Пример.** Код добавляет результат и завершает задачу. Класс результата подключен под псевдонимом `TaskResult`, чтобы не путать его с результатом команды.

```php
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\TaskAccessController;
use Bitrix\Tasks\V2\Internal\Entity\Result as TaskResult;
use Bitrix\Tasks\V2\Internal\Service\Task\Action\Update\Config\UpdateConfig;
use Bitrix\Tasks\V2\Public\Command\Task\Result\AddResultCommand;
use Bitrix\Tasks\V2\Public\Command\Task\Status\CompleteTaskCommand;

$canClose =
    TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_COMPLETE, $taskId)
    || TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_APPROVE, $taskId)
;

if (!$canClose)
{
    throw new \RuntimeException('Нет прав на завершение задачи');
}

$resultAdded = (new AddResultCommand(
    result: TaskResult::mapFromArray([
        'taskId' => $taskId,
        'text' => 'Договор согласован и подписан',
    ]),
    userId: $userId,
))->run();

if (!$resultAdded->isSuccess())
{
    throw new \RuntimeException(implode(', ', $resultAdded->getErrorMessages()));
}

if (!TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_COMPLETE_RESULT, $taskId))
{
    throw new \RuntimeException('Задачу нельзя завершить без результата');
}

$result = (new CompleteTaskCommand(
    taskId: $taskId,
    config: new UpdateConfig(userId: $userId),
))->run();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}
```

Право `ACTION_TASK_COMPLETE_RESULT` пример проверяет после добавления результата, потому что до этого у задачи с обязательным результатом проверка вернет `false`. Если у задачи включен контроль и ее завершает не постановщик, после команды она получит статус «Ждет контроля постановщика», а не «Завершена».

Если автор результата не участник задачи, команда `AddResultCommand` добавит его в наблюдатели. Это изменение вызывает события `OnBeforeTaskUpdate` и `OnTaskUpdate`.

### Сменить участников {#change-members}

Команды участников находятся в пространстве имен `Bitrix\Tasks\V2\Public\Command\Task\Stakeholder`. Они принимают аргументы `taskId` — ID задачи, `config` — конфигурацию `UpdateConfig` и аргумент с новыми участниками из таблицы.

| Команда | Действие | Аргумент с участниками | Право для проверки |
|---|---|---|---|
| `DelegateCommand` | Передает задачу новому ответственному | `responsibleId` — ID нового ответственного | `ACTION_TASK_DELEGATE` или `ACTION_TASK_CHANGE_RESPONSIBLE` с моделью новых участников |
| `SetAccomplicesCommand` | Заменяет список соисполнителей | `accompliceIds` — массив ID | `ACTION_TASK_CHANGE_ACCOMPLICES` с моделью новых участников |
| `AddAuditorsCommand` | Добавляет наблюдателей к текущим | `auditorIds` — массив ID | `ACTION_TASK_ADD_AUDITORS`, четвертым аргументом `can()` передают массив ID новых наблюдателей |
| `SetAuditorsCommand` | Заменяет список наблюдателей | `auditorIds` — массив ID | `ACTION_TASK_SAVE` с моделью новых участников |

Имена аргументов `accompliceIds` и `auditorIds` отличаются от ключей объекта задачи `accomplicesIds` и `auditorsIds`.

Модель новых участников собирают так же, как при [изменении задачи](#update-task), из текущих данных и новых значений. Без модели проверка учитывает только текущих участников. Например, сотрудник сможет передать задачу тому, кому сам ставить задачи не может.

**Пример.** Код передает задачу другому ответственному. Переменная `$newResponsibleId` содержит ID нового ответственного.

```php
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\Model\TaskModel;
use Bitrix\Tasks\Access\TaskAccessController;
use Bitrix\Tasks\Internals\TaskTable;
use Bitrix\Tasks\V2\Internal\Service\Task\Action\Update\Config\UpdateConfig;
use Bitrix\Tasks\V2\Public\Command\Task\Stakeholder\DelegateCommand;

$current = TaskTable::getRow([
    'select' => ['ID', 'CREATED_BY', 'RESPONSIBLE_ID', 'GROUP_ID'],
    'filter' => ['=ID' => $taskId],
]);

if ($current === null)
{
    throw new \RuntimeException('Задача не найдена');
}

$model = TaskModel::createFromArray(['RESPONSIBLE_ID' => $newResponsibleId], $current);

$canDelegate =
    TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_DELEGATE, $taskId, $model)
    || TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_CHANGE_RESPONSIBLE, $taskId, $model)
;

if (!$canDelegate)
{
    throw new \RuntimeException('Нет прав на смену ответственного');
}

$result = (new DelegateCommand(
    taskId: $taskId,
    responsibleId: $newResponsibleId,
    config: new UpdateConfig(userId: $userId),
))->run();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}
```

После передачи прежний ответственный остается в задаче наблюдателем. Если он не должен видеть задачу, уберите его из наблюдателей командой `SetAuditorsCommand`.

### Добавить соисполнителя к текущим {#add-accomplice}

Команды `SetAccomplicesCommand` и `SetAuditorsCommand` заменяют весь список. Чтобы добавить одного соисполнителя, прочитайте текущий список через провайдер с ключом `members` — ID возвращает `$task->accomplices?->getIdList()`. Добавьте в список новый ID и передайте полный массив. Иначе команда удалит остальных участников этой роли. Как читать задачу, описано в статье [Чтение и выборка задач](./read-tasks.md#get-task).

**Пример.** Код добавляет соисполнителя к текущим. Переменная `$newAccompliceId` содержит ID нового соисполнителя.

```php
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\Model\TaskModel;
use Bitrix\Tasks\Access\TaskAccessController;
use Bitrix\Tasks\Internals\TaskTable;
use Bitrix\Tasks\V2\Internal\Service\Task\Action\Update\Config\UpdateConfig;
use Bitrix\Tasks\V2\Public\Command\Task\Stakeholder\SetAccomplicesCommand;
use Bitrix\Tasks\V2\Public\Provider\Params\TaskParams;
use Bitrix\Tasks\V2\Public\Provider\TaskProvider;

$task = (new TaskProvider())->get(TaskParams::mapFromIds($taskId, $userId, ['members' => true]));

if ($task === null)
{
    throw new \RuntimeException('Задача не найдена или нет прав на чтение');
}

$accompliceIds = $task->accomplices?->getIdList() ?? [];
$accompliceIds[] = $newAccompliceId;

$current = TaskTable::getRow([
    'select' => ['ID', 'CREATED_BY', 'RESPONSIBLE_ID', 'GROUP_ID'],
    'filter' => ['=ID' => $taskId],
]);

$model = TaskModel::createFromArray(['ACCOMPLICES' => $accompliceIds], $current);

if (!TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_CHANGE_ACCOMPLICES, $taskId, $model))
{
    throw new \RuntimeException('Нет прав на смену соисполнителей');
}

$result = (new SetAccomplicesCommand(
    taskId: $taskId,
    accompliceIds: $accompliceIds,
    config: new UpdateConfig(userId: $userId),
))->run();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}
```

Провайдер вернул задачу, значит, она существует, поэтому проверки строки `$current` на `null` в примере нет.

Модель `$model` содержит только новый список соисполнителей, постановщика, ответственного и проект. Ключи `ACCOMPLICES` и `AUDITORS` из строки `$current` не нужны. Текущих участников метод `can()` читает из базы данных сам — по ID задачи из третьего аргумента он собирает модель методом `TaskModel::createFromId()`. Правило `ACTION_TASK_CHANGE_ACCOMPLICES` сравнивает новый список соисполнителей с текущим, а наблюдателей не учитывает.

## Удалить задачу {#delete-task}

Команда `DeleteTaskCommand` удаляет задачу. Она принимает аргументы `taskId` — ID задачи и `config` — конфигурацию `DeleteConfig` с ID пользователя. Перед удалением по запросу сотрудника проверьте право `ACTION_TASK_REMOVE`.

**Пример.** Код удаляет задачу от имени сотрудника.

```php
use Bitrix\Tasks\Access\ActionDictionary;
use Bitrix\Tasks\Access\TaskAccessController;
use Bitrix\Tasks\V2\Internal\Service\Task\Action\Delete\Config\DeleteConfig;
use Bitrix\Tasks\V2\Public\Command\Task\DeleteTaskCommand;

if (!TaskAccessController::can($userId, ActionDictionary::ACTION_TASK_REMOVE, $taskId))
{
    throw new \RuntimeException('Нет прав на удаление задачи');
}

$result = (new DeleteTaskCommand(
    taskId: $taskId,
    config: new DeleteConfig(userId: $userId),
))->run();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode(', ', $result->getErrorMessages()));
}
```

Если установлен модуль Корзина `recyclebin`, задача перемещается в корзину и ее можно восстановить. Без модуля задача удаляется сразу. Перед удалением модуль вызывает событие `OnBeforeTaskDelete`, после удаления — `OnTaskDelete`. Если обработчик `OnBeforeTaskDelete` отменил удаление, команда возвращает ошибку в результате. Подробнее — в статье [События модуля Задачи](./events.md#before-events).

## Проверить результат {#check-result}

Перед публикацией кода выполните в тестовом Битрикс24 несколько проверок.

1. Создайте задачу командой и убедитесь, что она видна в списке задач ответственного и у нее есть чат с участниками.

2. Создайте задачу от имени сотрудника, которому нельзя ставить задачи выбранному ответственному, и проверьте, что `can()` вернул `false`.

3. Создайте задачу с ключом `xmlId` и запустите код повторно. Убедитесь, что вторая задача не появилась.

4. Измените одно поле командой `UpdateTaskCommand` и убедитесь, что остальные поля не изменились.

5. Включите требование результата и попробуйте завершить задачу от имени ответственного без результата. Проверка `ACTION_TASK_COMPLETE_RESULT` должна вернуть `false`.

6. Добавьте соисполнителя и проверьте, что прежние соисполнители остались в задаче.

7. Удалите задачу и убедитесь, что она попала в корзину, если установлен модуль Корзина.

Если обработчики событий проекта меняют задачу, проверьте их способом из статьи [События модуля Задачи](./events.md#check-result).
