---
title: Участники и роли
description: "Поиск подразделений и команд пользователя, выборка участников по ролям и добавление данных узлов в запросы пользователей."
---

Объект `Bitrix\HumanResources\Item\NodeMember` связывает пользователя с подразделением или командой. Для каждого узла объект хранит отдельный набор ролей пользователя.

Сервис `Bitrix\HumanResources\Public\Service\NodeMemberService` находит связи пользователей с узлами и участников с заданной ролью. С его помощью можно дополнить ORM-запрос `Bitrix\Main\UserTable` и получить данные пользователей вместе со сведениями об их подразделениях или командах.

## Выбрать метод

Выбирайте метод сервиса `Bitrix\HumanResources\Public\Service\NodeMemberService` по исходным данным и ожидаемому результату.

#|
|| **Задача** | **Метод** | **Результат** ||
|| Найти подразделения или команды известных пользователей | `findAllByEntityIds()` | Коллекция связей пользователей с узлами ||
|| Получить участников узла с заданным числовым идентификатором роли | `findAllByRoleIdAndNodeId()` | Коллекция участников узла ||
|| Найти узлы пользователя по стандартным ролям | `findByUserIdAndRoleXmlIds()` или `findAllByUserIdAndRoleXmlIds()` сервиса пользователей | Одна связь, `null` или коллекция связей ||
|| Получить подразделения, которыми управляет пользователь | `getManagedDepartmentNodes()` | Коллекция связей с подразделениями ||
|| Добавить сведения об узлах в запрос к `Bitrix\Main\UserTable` | `injectUserNodeSubquery()` | Дополненный ORM-запрос пользователей ||
|| Сначала расположить пользователей из тех же подразделений, а руководителей — выше сотрудников | `injectUserNodeSort()` | ORM-запрос с добавленной сортировкой ||
|#

## Получить сервис участников {#get-node-member-service}

Сервис `Bitrix\HumanResources\Public\Service\NodeMemberService` работает со связями участников подразделений и команд. Перед вызовом [подключите модуль `humanresources`](./overview.md#connect-module). Получите сервис через контейнер `Bitrix\HumanResources\Public\Service\Container`.

```php
use Bitrix\HumanResources\Public\Service\Container;
use Bitrix\Main\Loader;

if (!Loader::includeModule('humanresources'))
{
    throw new \RuntimeException('Требуется модуль humanresources');
}

$memberService = Container::getNodeMemberService();
```

Все следующие примеры используют переменную `$memberService` из этого блока.

Для работы с руководителями и подчиненными получите сервис `Bitrix\HumanResources\Public\Service\Node\UserService` с помощью метода `Bitrix\HumanResources\Public\Service\Container::getUserService()`. Сценарии работы с этим сервисом смотрите в статье [Пользователи и управленческая иерархия](./users-and-hierarchy.md).

## Данные участника узла

Пользователь и участник узла — разные объекты. Для каждого узла сервис возвращает отдельный объект `Bitrix\HumanResources\Item\NodeMember`.

Объект `Bitrix\HumanResources\Item\NodeMember` содержит свойства связи. Обращайтесь к ним через объект, например `$member->nodeId`. Это не параметры метода: сервис заполняет свойства в возвращенном объекте. Знак `?` перед типом означает, что свойство может содержать `null`.

#|
|| **Свойство** | **Тип** | **Назначение** ||
|| `id` | `?int` | Идентификатор связи или `null` для несохраненного объекта ||
|| `entityType` | `Bitrix\HumanResources\Type\MemberEntityType` | Тип объекта участника ||
|| `entityId` | `int` | Идентификатор объекта, для пользователя это его ID ||
|| `nodeId` | `int` | Идентификатор узла ||
|| `active` | `?bool` | Признак активности участника или `null` ||
|| `roles` | `?array<int>` | Идентификаторы ролей в результатах чтения ||
|| `role` | `?int` | Идентификатор роли для создания или изменения связи либо `null` ||
|| `icon` | `?string` | Строковое значение значка, по умолчанию пустая строка ||
|| `addedBy` | `?int` | Идентификатор пользователя, который добавил участника, или `null` ||
|| `createdAt` | `?Bitrix\Main\Type\DateTime` | Дата создания связи или `null` ||
|| `updatedAt` | `?Bitrix\Main\Type\DateTime` | Дата изменения связи или `null` ||
|| `node` | `?Bitrix\HumanResources\Item\Node` | Объект связанного узла или `null`, если узел отсутствует ||
|#

Свойство `node` использует отложенную загрузку. Сервис загружает объект узла при первом обращении к свойству. Если достаточно идентификатора узла, используйте `nodeId`: обращение к нему не загружает связанный объект.

### Найти связи пользователей с узлами

Для поиска связей участников с узлами используйте методы сервиса `findAllByEntityIds()` и `findAllByRoleIdAndNodeId()`. Они возвращают коллекцию `Bitrix\HumanResources\Item\Collection\NodeMemberCollection`. Она позволяет перебрать найденные связи и получить идентификатор узла и роли участника для каждой связи. Элемент коллекции — это объект `Bitrix\HumanResources\Item\NodeMember`. Пустая коллекция означает, что подходящих связей нет.

Используйте метод `findAllByEntityIds()`, чтобы определить, в каких подразделениях или командах состоят известные пользователи. Передайте их идентификаторы в `entityIds` и укажите нужные типы узлов в `nodeTypes`. По умолчанию метод ищет пользователей только в активных подразделениях.

**Пример.** Получить связи пользователей с подразделениями и командами.

```php
use Bitrix\HumanResources\Type\NodeEntityType;

$userIds = [25, 31, 42];

// Сервис участников получен в первом примере
$members = $memberService->findAllByEntityIds(
    entityIds: $userIds, // ID пользователей, связи которых нужно найти
    nodeTypes: [
        NodeEntityType::DEPARTMENT, // подразделения
        NodeEntityType::TEAM, // команды
    ],
);

foreach ($members as $member)
{
    echo "Пользователь {$member->entityId}, узел {$member->nodeId}\n";
}
```

Метод возвращает все найденные связи. Один пользователь может встретиться в коллекции несколько раз, если состоит в нескольких узлах или имеет несколько ролей в одном узле. Каждой роли соответствует отдельный элемент коллекции.

### Ограничить поиск узлами и структурой

Передайте идентификаторы известных узлов в параметр `nodeIds`, чтобы найти связи только в этих узлах. Параметр `structureId` ограничивает поиск одной структурой, а `structureAction` — узлами, для которых текущему пользователю доступно указанное действие. Значение `Bitrix\HumanResources\Enum\NodeActiveFilter::ONLY_GLOBAL_ACTIVE` используется для параметра `nodeActiveFilter` по умолчанию.

```php
use Bitrix\HumanResources\Enum\NodeActiveFilter;
use Bitrix\HumanResources\Type\NodeEntityType;
use Bitrix\HumanResources\Type\StructureAction;

$userId = 25;
$structureId = 1;

// Сервис участников получен в первом примере
$members = $memberService->findAllByEntityIds(
    entityIds: [$userId], // ID пользователя
    nodeIds: [10, 20, 30], // узлы, в которых нужно искать связь
    nodeTypes: [NodeEntityType::DEPARTMENT], // только подразделения
    structureId: $structureId, // структура, которой принадлежат узлы
    structureAction: StructureAction::ViewAction, // доступные для просмотра узлы
    nodeActiveFilter: NodeActiveFilter::ONLY_GLOBAL_ACTIVE, // стандартный фильтр активности
);
```

## Найти участников узла по роли

Используйте метод `findAllByRoleIdAndNodeId()`, чтобы получить участников одного узла с заданной ролью. Передайте параметры:

-  `roleId` — числовой идентификатор роли из массива `roles` объекта `Bitrix\HumanResources\Item\NodeMember`,

-  `nodeId` — идентификатор узла,

-  `limit` — максимальное количество участников в результате,

-  `offset` — смещение от начала результата,

-  `ascendingSort` — порядок сортировки по идентификатору связи: `true` — по возрастанию, `false` — по убыванию.

```php
// Сервис участников получен в первом примере
$roleId = null;
$nodeId = null;

foreach ($memberService->findAllByEntityIds(entityIds: [25]) as $member)
{
    $roleId = $member->roles[0] ?? null;
    if ($roleId !== null)
    {
        $nodeId = $member->nodeId;
        break;
    }
}

if ($roleId === null || $nodeId === null)
{
    throw new \RuntimeException('У пользователя нет связи с ролью');
}

$members = $memberService->findAllByRoleIdAndNodeId(
    roleId: $roleId, // ID роли из массива roles объекта NodeMember
    nodeId: $nodeId, // узел, в котором нужно найти участников
    limit: 50, // максимум 50 участников
    offset: 0, // начать с первого участника
    ascendingSort: true, // сортировать по возрастанию
);
```

Метод возвращает коллекцию `Bitrix\HumanResources\Item\Collection\NodeMemberCollection`. Пустая коллекция означает, что совпадений нет. Пустую коллекцию метод также возвращает, если `roleId` или `nodeId` равен `0`, узел не найден либо роль не связана с указанным узлом.

## Выбрать стандартную роль {#select-standard-role}

Чтобы найти узлы пользователя по стандартным ролям, выберите метод сервиса `Bitrix\HumanResources\Public\Service\Node\UserService`:

-  `findByUserIdAndRoleXmlIds()` — возвращает одну связь или `null`,

-  `findAllByUserIdAndRoleXmlIds()` — возвращает все подходящие связи в коллекции `Bitrix\HumanResources\Item\Collection\NodeMemberCollection`.

Передайте идентификатор пользователя в `userId`, а внешние идентификаторы ролей — в `roleXmlIds`. Перечисление `Bitrix\HumanResources\Type\NodeMemberRole` содержит внешние идентификаторы стандартных ролей подразделений и команд.

Роли подразделений:

-  `NodeMemberRole::Head` — руководитель, внешний идентификатор `MEMBER_HEAD`,

-  `NodeMemberRole::DeputyHead` — заместитель, внешний идентификатор `MEMBER_DEPUTY_HEAD`,

-  `NodeMemberRole::Employee` — сотрудник, внешний идентификатор `MEMBER_EMPLOYEE`.

Роли команд:

-  `NodeMemberRole::TeamHead` — руководитель команды, внешний идентификатор `MEMBER_TEAM_HEAD`,

-  `NodeMemberRole::TeamDeputyHead` — заместитель руководителя команды, внешний идентификатор `MEMBER_TEAM_DEPUTY_HEAD`,

-  `NodeMemberRole::TeamEmployee` — участник команды, внешний идентификатор `MEMBER_TEAM_EMPLOYEE`.

**Пример.** Найти подразделения и команды, где пользователь назначен руководителем.

```php
use Bitrix\HumanResources\Public\Service\Container;
use Bitrix\HumanResources\Type\NodeMemberRole;

$userId = 25;
$userService = Container::getUserService();
$managedNodes = $userService->findAllByUserIdAndRoleXmlIds(
    userId: $userId,
    roleXmlIds: [
        NodeMemberRole::Head->value, // руководитель подразделения
        NodeMemberRole::TeamHead->value, // руководитель команды
    ],
);
```

Коллекция `$managedNodes` содержит связи пользователя с подразделениями и командами, где он назначен руководителем. Чтобы получить только первую подходящую связь, вызовите `findByUserIdAndRoleXmlIds()` с теми же аргументами. Пустой массив или массив без допустимых внешних идентификаторов ролей дает `null` для одиночного поиска и пустую коллекцию для множественного.

Дополнительные сценарии смотрите в статье [Пользователи и управленческая иерархия](./users-and-hierarchy.md).

## Получить управляемые подразделения

Используйте метод `getManagedDepartmentNodes()`, чтобы получить подразделения, где пользователь назначен руководителем или заместителем. Метод работает только с узлами типа `Bitrix\HumanResources\Type\NodeEntityType::DEPARTMENT` и возвращает коллекцию `Bitrix\HumanResources\Item\Collection\NodeMemberCollection`.

Передайте идентификатор пользователя в `userId`. Параметр `structureId` ограничивает поиск одной структурой. Если передать `null`, сервис использует структуру по умолчанию.

**Пример.** Получить управляемые подразделения одной структуры.

```php
$structureId = 1;

// Сервис участников получен в первом примере
$managedDepartments = $memberService->getManagedDepartmentNodes(
    userId: 25,
    structureId: $structureId, // ID нужной структуры
);
```

По свойству `nodeId` определите подразделение, а по массиву `roles` — роль пользователя в нем.

## Добавить данные узлов в запрос пользователей

Чтобы получить пользователей из определенных подразделений или команд одним ORM-запросом, используйте `injectUserNodeSubquery()`. Метод дополняет запрос `Bitrix\Main\UserTable` связями с узлами и возвращает измененный объект `Bitrix\Main\ORM\Query\Query`.

Настройте выборку с помощью параметров:

-  `query` — запрос к `Bitrix\Main\UserTable`, который нужно дополнить.

-  `nodeTypes` — типы узлов. По умолчанию метод выбирает подразделения, значение `null` включает все типы узлов.

-  `active` — состояние связей: `true` — активные, `false` — неактивные, `null` — все связи. По умолчанию метод выбирает активные связи.

-  `nodeIds` — идентификаторы узлов. Значение `null` или пустой массив включает все узлы выбранных типов.

**Пример.** Получить пользователей из двух активных подразделений.

```php
use Bitrix\HumanResources\Type\NodeEntityType;
use Bitrix\Main\UserTable;

$query = UserTable::query()
    ->setSelect(['ID', 'NAME', 'LAST_NAME'])
;

// Сервис участников получен в первом примере
$query = $memberService->injectUserNodeSubquery(
    query: $query,
    nodeTypes: [NodeEntityType::DEPARTMENT], // только подразделения
    active: true, // только активные связи участников
    nodeIds: [10, 20], // подразделения, из которых нужны пользователи
);

$users = $query->exec();
```

После вызова продолжите настройку запроса или выполните его через `exec()`.

## Отсортировать пользователей по узлам и ролям {#sort-users-by-nodes-and-roles}

Используйте метод `injectUserNodeSort()`, чтобы сначала расположить пользователей из тех же подразделений, что и выбранный пользователь, а затем остальных. В каждой части результата руководители располагаются выше сотрудников.

Сначала вызовите `injectUserNodeSubquery()`. Он регистрирует поле `USER_NODE_MEMBER`, которое использует сортировка. Затем передайте дополненный запрос в `query`, а идентификатор выбранного пользователя — в `userId`.

Связи с несколькими узлами или ролями могут создать несколько строк для одного пользователя. Метод `setDistinct()` формирует результат с уникальными строками. Вызывайте его до выполнения или подсчета запроса, если результат должен содержать по одной строке на пользователя.

```php
use Bitrix\Main\UserTable;

$currentUserId = 25;
$query = UserTable::query()
    ->setSelect(['ID', 'NAME', 'LAST_NAME'])
;

// Сервис участников получен в первом примере
$query = $memberService->injectUserNodeSubquery($query); // добавить связи с узлами
$query = $memberService->injectUserNodeSort(
    query: $query,
    userId: $currentUserId, // пользователь, чьи подразделения должны быть первыми
);

$query->setDistinct(); // по одной строке на пользователя
$users = $query->exec();
```

## Обработать пустой результат и ошибки

Если метод вернул пустой результат, проверьте условия поиска:

-  модуль `humanresources` подключен,

-  идентификаторы пользователей, узлов, структуры и роли существуют,

-  `nodeTypes` содержит `Bitrix\HumanResources\Type\NodeEntityType::TEAM` для выборки участников команд,

-  фильтр активности включает целевые узлы или связи,

-  параметры `nodeIds` и `structureId` включают целевые узлы, а `limit` и `offset` не исключают нужные связи,

-  текущему пользователю доступно действие из `structureAction`.

Пустая коллекция `Bitrix\HumanResources\Item\Collection\NodeMemberCollection` — корректный результат поиска. Проверяйте количество элементов перед обработкой. Для результата одиночного поиска отдельно проверяйте значение `null`.

При работе с сервисом учитывайте следующие исключения:

#|
|| **Исключение** | **На каком этапе возможно** ||
|| `Bitrix\Main\ArgumentException` | Подготовка поискового запроса и его аргументов ||
|| `Bitrix\Main\ObjectPropertyException` | Подготовка и чтение данных ORM ||
|| `Bitrix\Main\SystemException` | Подготовка или выполнение операции сервиса ||
|| `Bitrix\HumanResources\Exception\WrongStructureItemException` | Обработка элемента структуры компании ||
|| `Bitrix\Main\DB\SqlQueryException` | Выполнение ORM-запроса через `exec()` ||
|#

Обрабатывайте исключения на уровне приложения, где доступен контекст запроса и можно выбрать дальнейшее действие.

При поиске с `structureAction` ошибка построения фильтра доступа преобразуется в пустую коллекцию `Bitrix\HumanResources\Item\Collection\NodeMemberCollection`. Поиск без совпадений возвращает такой же результат. Для диагностики сохраняйте исходные идентификаторы и выбранное действие. Права пользователя проверяйте отдельно от содержимого коллекции.

## Выбрать сервис или билдер

Выбирайте сервис `Bitrix\HumanResources\Public\Service\NodeMemberService` для типового поиска связей, выборки по одной роли и расширения запросов `Bitrix\Main\UserTable`. Используйте [`Bitrix\HumanResources\Builder\Structure\NodeMemberDataBuilder`](./data-builders.md#build-member-query), когда один запрос должен объединить несколько фильтров по узлам, пользователям, ролям, иерархии или доступу.

Методы поиска и `getManagedDepartmentNodes()` читают существующие связи. Методы `injectUserNodeSubquery()` и `injectUserNodeSort()` изменяют только настройки переданного объекта `Bitrix\Main\ORM\Query\Query`. Запрос загружает данные после вызова `exec()`.

Сервис `Bitrix\HumanResources\Public\Service\NodeMemberService` не изменяет роли участников. Для поиска и обхода подразделений и команд используйте [сервис узлов](./nodes.md). Для получения руководителей и подчиненных, проверки управленческих отношений и назначения пользователей в подразделения используйте [сервисы управленческой иерархии](./users-and-hierarchy.md).
