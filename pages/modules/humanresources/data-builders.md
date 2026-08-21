---
title: Выборки узлов и участников через билдеры
description: "Построение выборок узлов и участников структуры компании через NodeDataBuilder, NodeMemberDataBuilder, составные фильтры и сортировку."
---

Составные выборки помогают получить из структуры компании данные, которые одновременно соответствуют нескольким условиям. Например, одним запросом можно выбрать руководителей доступных активных подразделений на заданной глубине и разбить результат на страницы.

Для таких запросов используйте классы:

-  `Bitrix\HumanResources\Builder\Structure\NodeDataBuilder` — при работе с подразделениями и командами,

-  `Bitrix\HumanResources\Builder\Structure\NodeMemberDataBuilder` — при работе со связями пользователей с узлами.

Оба класса поддерживают составные фильтры, сортировку, постраничную выборку и настройку кеша.

Классы `NodeDataBuilder` и `NodeMemberDataBuilder` только читают данные. Они не изменяют узлы, связи участников и роли.

## Подключить классы и выполнить запрос

Перед обращением к билдерам подключите модуль `humanresources`, как показано в статье [Введение и базовые концепции](./overview.md#connect-module).

Затем импортируйте классы выборки и основные фильтры. Директивы `use` позволяют обращаться к классам по коротким именам.

```php
use Bitrix\HumanResources\Builder\Structure\Filter\NodeFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeMemberFilter;
use Bitrix\HumanResources\Builder\Structure\NodeDataBuilder;
use Bitrix\HumanResources\Builder\Structure\NodeMemberDataBuilder;
```

Выберите класс по задаче и объекту, который должен вернуть запрос.

#|
|| **Задача** | **Класс** ||
|| Получить подразделения или команды | `NodeDataBuilder` ||
|| Получить связи пользователей с узлами | `NodeMemberDataBuilder` ||
|#

Фильтр сам не выполняет запрос. Методы `setFilter()` и `addFilter()` сохраняют условия в объекте класса, а `get()` и `getAll()` применяют их при получении данных.

Метод `get()` возвращает первый найденный объект или `null`. Для `NodeDataBuilder` это объект `Node`, для `NodeMemberDataBuilder` — `NodeMember`. При `limit = 0` метод устанавливает лимит в один элемент. Последующий вызов `getAll()` в том же объекте вернет не более одного элемента, поэтому для независимых запросов создавайте новый объект класса.

Метод `getAll()` возвращает все найденные объекты: `NodeCollection` для узлов или `NodeMemberCollection` для связей участников. Пустая коллекция означает, что совпадений нет.

## Собрать условия выборки

Запрос складывается из фильтров, ограничения результата, сортировки и параметров кеша. Классы `NodeDataBuilder` и `NodeMemberDataBuilder` используют для этого одинаковые методы настройки существующего объекта.

#|
|| **Метод** | **Что делает** | **Начальное значение** ||
|| `setFilter($filter)` | Удаляет ранее добавленные фильтры и устанавливает один фильтр | Фильтров нет ||
|| `addFilter($filter)` | Добавляет условие к существующим и объединяет фильтры логикой `AND` | Фильтров нет ||
|| `setLimit(int $limit)` | Ограничивает количество строк. Значение больше нуля включает ограничение | `0`, без ограничения ||
|| `setOffset(int $offset)` | Пропускает указанное количество строк; значение больше нуля включает смещение | `0` ||
|| `setCacheTtl(int $seconds)` | Задает время жизни кеша ORM-запроса в секундах | `86400` ||
|| `setSelect(array $select)` | Заменяет стандартный список выбираемых ORM-полей | Зависит от класса ||
|| `setSort(?SortInterface $sort)` | Задает объект сортировки или отключает ее значением `null` | Сортировки нет ||
|#

Методы из таблицы возвращают текущий объект, поэтому их можно объединять в цепочку.

Помимо методов настройки, классы `NodeDataBuilder` и `NodeMemberDataBuilder` предоставляют статические фабричные методы `createWithFilter()`. Каждый метод создает новый объект соответствующего класса и сразу добавляет в него один фильтр. Это сокращенная запись последовательных вызовов конструктора и `addFilter()`.

Следующий пример показывает полный путь от входных данных до коллекции. Код создает фильтр подразделений, передает его в `NodeDataBuilder`, ограничивает результат и вызывает `getAll()`.

```php
use Bitrix\HumanResources\Builder\Structure\Filter\Column\Node\NodeTypeFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeFilter;
use Bitrix\HumanResources\Builder\Structure\NodeDataBuilder;

// Идентификатор структуры компании
$structureId = 1;

$nodes = (new NodeDataBuilder())
    ->setFilter(new NodeFilter(
        entityTypeFilter: NodeTypeFilter::createForDepartment(),
        structureId: $structureId,
    ))
    ->setLimit(20)
    ->setOffset(0)
    ->getAll();
```

Классы `NodeDataBuilder` и `NodeMemberDataBuilder` не проверяют `limit` и `offset` на отрицательные значения. Передавайте только ноль или положительные целые числа. Метод `get()` подставляет лимит `1`, только когда текущее значение равно нулю.

{% note warning "" %}

Метод `setSort()` задает предсказуемый порядок результата. Используйте сортировку для постраничной выборки и для сценария, в котором важен первый или последний элемент.

{% endnote %}

## Построить выборку узлов

Работа со структурой начинается с отбора подразделений или команд. Класс `NodeDataBuilder` позволяет найти отдельный узел, пройти по его ветке, ограничить тип и активность узлов или учесть права пользователя.

### Задать фильтр узлов {#set-node-filter}

Объект `NodeFilter` описывает признаки, которым должны одновременно соответствовать узлы: идентификатор, тип, положение в иерархии, активность, название и доступность пользователю. Создайте фильтр с нужными условиями и передайте его в `NodeDataBuilder`.

Методы `setFilter()` и `addFilter()` класса `NodeDataBuilder` принимают только объекты `NodeFilter`. Объект другого типа приводит к `InvalidArgumentException`.

Конструктор `NodeFilter` принимает именованные параметры:

-  `idFilter` — ограничивает выборку идентификаторами узлов,

-  `entityTypeFilter` — выбирает подразделения, команды или оба типа узлов,

-  `structureId` — задает идентификатор структуры,

-  `direction` и `depthLevel` — задают направление и глубину обхода иерархии,

-  `active` — фильтрует узлы по активности,

-  `accessFilter` — учитывает права пользователя,

-  `name` — ищет узлы по названию.

Чтобы получить активные команды выбранной структуры, задайте идентификатор структуры, создайте фильтр и передайте его в фабричный метод `NodeDataBuilder::createWithFilter()`:

```php
use Bitrix\HumanResources\Builder\Structure\Filter\Column\Node\NodeTypeFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeFilter;
use Bitrix\HumanResources\Builder\Structure\NodeDataBuilder;

// Идентификатор структуры компании
$structureId = 1;

$filter = new NodeFilter(
    entityTypeFilter: NodeTypeFilter::createForTeam(),
    structureId: $structureId,
    active: true,
);

$teams = NodeDataBuilder::createWithFilter($filter)->getAll();
```

Если `structureId` равен `null`, конструктор пытается получить идентификатор структуры по умолчанию. Чтобы запрос не зависел от текущей конфигурации, передавайте известный идентификатор явно.

### Получить узел по идентификатору

Чтобы получить один узел по идентификатору, выполните три действия:

1. Создайте фильтр методом `NodeFilter::createWithNodeId()`.

2. Передайте фильтр в `NodeDataBuilder::createWithFilter()`.

3. Вызовите метод `get()`.

Метод `get()` применит фильтр и вернет объект `Node` или `null`.

**Пример.** Код получает активный узел по внутреннему идентификатору и останавливает сценарий, если узел не найден.

```php
use Bitrix\HumanResources\Builder\Structure\Filter\NodeFilter;
use Bitrix\HumanResources\Builder\Structure\NodeDataBuilder;

// Идентификатор узла
$nodeId = 42;

$node = NodeDataBuilder::createWithFilter(
    NodeFilter::createWithNodeId($nodeId),
)->get();

if ($node === null)
{
    throw new \RuntimeException('Узел не найден');
}
```

Фильтр по умолчанию также проверяет структуру по умолчанию и глобальную активность узла. Поэтому существующий узел из другой структуры или неактивной ветки может не попасть в результат.

### Получить подразделения или команды

Тип узла отделяет подразделения от команд, а идентификатор структуры не позволяет смешать данные разных структур. Для подразделений используйте `NodeTypeFilter::createForDepartment()`, для команд — `NodeTypeFilter::createForTeam()`.

**Пример.** Код получает все активные подразделения выбранной структуры в коллекции `NodeCollection`.

```php
use Bitrix\HumanResources\Builder\Structure\Filter\Column\Node\NodeTypeFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeFilter;
use Bitrix\HumanResources\Builder\Structure\NodeDataBuilder;

// Идентификатор структуры компании
$structureId = 1;

$departments = (new NodeDataBuilder())
    ->setFilter(new NodeFilter(
        entityTypeFilter: NodeTypeFilter::createForDepartment(),
        structureId: $structureId,
    ))
    ->getAll();
```

Если одна выборка должна содержать подразделения и команды, создайте фильтр методом `NodeTypeFilter::fromNodeTypes()` и передайте массив значений `NodeEntityType`.

### Обойти иерархию

Для обхода передайте исходные узлы в `idFilter`, направление в `direction` и глубину в `depthLevel`.

Направления обхода:

-  `Direction::ROOT` — к родителям,

-  `Direction::CHILD` — к потомкам.

Значения глубины:

-  `DepthLevel::NONE` или `0` — не обходить иерархию, а отобрать исходные узлы,

-  `DepthLevel::FIRST` — получить непосредственных родителей или потомков,

-  `DepthLevel::FULL` — получить всю доступную ветку вместе с исходным узлом,

-  `DepthLevel::WITHOUT_PARENT` — получить подходящие уровни без узла, от которого начался обход,

-  положительное целое число — ограничить обход указанным количеством уровней.

**Пример.** Код получает непосредственных потомков узла в коллекции `NodeCollection`.

```php
use Bitrix\HumanResources\Builder\Structure\Filter\Column\IdFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeFilter;
use Bitrix\HumanResources\Builder\Structure\NodeDataBuilder;
use Bitrix\HumanResources\Enum\DepthLevel;
use Bitrix\HumanResources\Enum\Direction;

// Идентификатор исходного узла и структуры компании
$parentId = 42;
$structureId = 1;

$children = (new NodeDataBuilder())
    ->setFilter(new NodeFilter(
        idFilter: IdFilter::fromId($parentId),
        direction: Direction::CHILD,
        depthLevel: DepthLevel::FIRST,
        structureId: $structureId,
    ))
    ->getAll();
```

**Пример.** Код получает исходный узел и всю цепочку его родителей в коллекции `NodeCollection`.

```php
use Bitrix\HumanResources\Builder\Structure\Filter\Column\IdFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeFilter;
use Bitrix\HumanResources\Builder\Structure\NodeDataBuilder;
use Bitrix\HumanResources\Enum\DepthLevel;
use Bitrix\HumanResources\Enum\Direction;

// Идентификатор исходного узла и структуры компании
$nodeId = 42;
$structureId = 1;

$ancestors = (new NodeDataBuilder())
    ->setFilter(new NodeFilter(
        idFilter: IdFilter::fromId($nodeId),
        direction: Direction::ROOT,
        depthLevel: DepthLevel::FULL,
        structureId: $structureId,
    ))
    ->getAll();
```

Для ограниченного обхода передавайте положительное целое число. При поиске родителей `NodeDataBuilder` получает каждый исходный узел, чтобы вычислить допустимую глубину его родительской ветки. Поэтому не передавайте несуществующие идентификаторы.

Если `idFilter` отсутствует, а `depthLevel` содержит целое число, класс `NodeDataBuilder` может начать обход от корневого узла выбранной структуры. Для предсказуемого результата явно передавайте `structureId`, `direction` и нужный `idFilter`.

### Найти узлы по названию

Чтобы найти узлы по части названия, передайте строку в параметр `name` или создайте объект `NodeNameFilter` со значением `strict: false`. Для поиска по полному названию установите `strict: true`.

**Пример.** Код находит до 50 активных команд, название которых содержит слово «Разработка».

```php
use Bitrix\HumanResources\Builder\Structure\Filter\Column\Node\NodeNameFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\Column\Node\NodeTypeFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeFilter;
use Bitrix\HumanResources\Builder\Structure\NodeDataBuilder;

// Идентификатор структуры компании
$structureId = 1;

$teams = (new NodeDataBuilder())
    ->setFilter(new NodeFilter(
        entityTypeFilter: NodeTypeFilter::createForTeam(),
        name: new NodeNameFilter(
            name: 'Разработка',
            strict: false,
        ),
        structureId: $structureId,
    ))
    ->setLimit(50)
    ->getAll();
```

Пустая строка не добавляет условие по названию.

### Выбрать узлы по активности

Чтобы выбрать узлы по активности, передайте в параметр `active` логическое значение или элемент перечисления `NodeActiveFilter`.

#|
|| **Значение** | **Условие в NodeFilter** ||
|| `true` | `GLOBAL_ACTIVE = true` ||
|| `false` | `GLOBAL_ACTIVE = false` ||
|| `NodeActiveFilter::ALL` | Условие активности не добавляется ||
|| `NodeActiveFilter::ONLY_ACTIVE` | `GLOBAL_ACTIVE = true` ||
|| `NodeActiveFilter::ONLY_GLOBAL_ACTIVE` | `ACTIVE = true` ||
|#

Поле `ACTIVE` описывает состояние самого узла, а `GLOBAL_ACTIVE` учитывает состояние его ветки. Таблица фиксирует точное поведение класса `NodeFilter`. Выбирайте значение по создаваемому условию, а не только по названию элемента перечисления.

### Ограничить выборку правами пользователя {#restrict-by-user-access}

Чтобы ограничить выборку правами пользователя, передайте объект `NodeAccessFilter` в параметр `accessFilter`. Фильтр оставит узлы, для которых пользователю разрешено указанное действие.

Объект `NodeAccessFilter` принимает следующие параметры:

-  Параметр `action` задает действие, право на которое нужно проверить.

-  Параметр `userId` задает пользователя для проверки. Значение `null` означает текущего пользователя.

-  Параметр `allowedLevels` ограничивает допустимые уровни разрешения. При значении `null` класс использует стандартный набор уровней фильтра.

Для фильтра доступа необходимо задать параметр `entityTypeFilter` в объекте `NodeFilter`. Без типа узла метод `prepareFilter()` выбрасывает исключение `Bitrix\Main\ArgumentException`.

**Пример.** Код получает подразделения, которые текущий пользователь может просматривать.

```php
use Bitrix\HumanResources\Builder\Structure\Filter\Column\Node\NodeTypeFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\SelectionCondition\Node\NodeAccessFilter;
use Bitrix\HumanResources\Builder\Structure\NodeDataBuilder;
use Bitrix\HumanResources\Type\StructureAction;

// Идентификатор структуры компании
$structureId = 1;

$nodes = (new NodeDataBuilder())
    ->setFilter(new NodeFilter(
        entityTypeFilter: NodeTypeFilter::createForDepartment(),
        structureId: $structureId,
        accessFilter: new NodeAccessFilter(
            action: StructureAction::ViewAction,
        ),
    ))
    ->getAll();
```

Если для запрошенных типов узлов нет доступного условия, `get()` возвращает `null`, а `getAll()` — пустую коллекцию. Такой результат не позволяет отличить отсутствие прав от отсутствия совпадений. Если это важно для сценария, проверяйте права отдельно.

## Построить выборку участников {#build-member-query}

После отбора узлов можно получить связанные с ними учетные записи и роли. Класс `NodeMemberDataBuilder` возвращает объекты `NodeMember` — связи пользователей с узлами. Один пользователь может состоять в нескольких узлах. Если у пользователя несколько ролей в одном узле, класс возвращает отдельный элемент коллекции для каждой роли.

### Задать фильтр участников {#set-member-filter}

Объект `NodeMemberFilter` объединяет условия пользователя, узла, активности и роли. Его конструктор принимает именованные параметры:

-  `entityIdFilter` — ограничивает выборку идентификаторами пользователей,

-  `entityType` — задает тип участника,

-  `nodeFilter` — применяет условия узлов к связям участников,

-  `findRelatedMembers` — включает поиск связей относительно узлов пользователя,

-  `active` — фильтрует связи по активности,

-  `roleFilter` — выбирает связи с нужными ролями.

Передайте один объект `NodeMemberFilter` в метод `setFilter()`, чтобы все условия применились к одной выборке.

**Пример.** Код создает фильтр активных связей одного пользователя и получает коллекцию `NodeMemberCollection`.

```php
use Bitrix\HumanResources\Builder\Structure\Filter\Column\EntityIdFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeMemberFilter;
use Bitrix\HumanResources\Builder\Structure\NodeMemberDataBuilder;

// Идентификатор пользователя
$userId = 123;

$filter = new NodeMemberFilter(
    entityIdFilter: EntityIdFilter::fromEntityId($userId),
    active: true,
);

$members = NodeMemberDataBuilder::createWithFilter($filter)->getAll();
```

### Найти связи одного или нескольких пользователей

Чтобы найти связи пользователей с узлами, создайте объект `EntityIdFilter`. Метод `EntityIdFilter::fromEntityId()` принимает один идентификатор пользователя, а `EntityIdFilter::fromEntityIds()` — массив идентификаторов.

**Пример.** Код возвращает все активные связи для пользователей из массива `$userIds`.

```php
use Bitrix\HumanResources\Builder\Structure\Filter\Column\EntityIdFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeMemberFilter;
use Bitrix\HumanResources\Builder\Structure\NodeMemberDataBuilder;

// Идентификаторы пользователей
$userIds = [123, 456];

$members = (new NodeMemberDataBuilder())
    ->setFilter(new NodeMemberFilter(
        entityIdFilter: EntityIdFilter::fromEntityIds($userIds),
        active: true,
    ))
    ->getAll();
```

Не передавайте в метод `EntityIdFilter::fromEntityIds()` пустой массив. При выполнении запроса такой фильтр приводит к ошибке `Error`, потому что не содержит коллекцию идентификаторов. Если входной список пуст, завершите сценарий до построения запроса и верните пустой результат на уровне приложения.

### Найти связи пользователя с командами

Чтобы найти связи пользователя с командами, передайте объект `NodeFilter` в параметр `nodeFilter` и задайте тип узла `NodeEntityType::TEAM`.

**Пример.** Код получает связи одного пользователя только с командами выбранной структуры, затем извлекает идентификаторы этих команд.

```php
use Bitrix\HumanResources\Builder\Structure\Filter\Column\EntityIdFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\Column\Node\NodeTypeFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeMemberFilter;
use Bitrix\HumanResources\Builder\Structure\NodeMemberDataBuilder;
use Bitrix\HumanResources\Type\NodeEntityType;

// Идентификаторы пользователя и структуры компании
$userId = 123;
$structureId = 1;

$members = (new NodeMemberDataBuilder())
    ->setFilter(new NodeMemberFilter(
        entityIdFilter: EntityIdFilter::fromEntityId($userId),
        nodeFilter: new NodeFilter(
            entityTypeFilter: NodeTypeFilter::fromNodeType(
                NodeEntityType::TEAM,
            ),
            structureId: $structureId,
        ),
    ))
    ->getAll();

$nodeIds = $members->getNodeIds();
```

### Найти участников по ролям

Чтобы найти участников по ролям, создайте объект `RoleFilter`. Метод `RoleFilter::fromRole()` принимает одну роль, а `RoleFilter::fromRoles()` — несколько аргументов `NodeMemberRole`.

**Пример.** Код получает до 100 руководителей и заместителей из подразделений выбранной структуры.

```php
use Bitrix\HumanResources\Builder\Structure\Filter\Column\Node\NodeTypeFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\Column\RoleFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeMemberFilter;
use Bitrix\HumanResources\Builder\Structure\NodeMemberDataBuilder;
use Bitrix\HumanResources\Type\NodeMemberRole;

// Идентификатор структуры компании
$structureId = 1;

$heads = (new NodeMemberDataBuilder())
    ->setFilter(new NodeMemberFilter(
        nodeFilter: new NodeFilter(
            entityTypeFilter: NodeTypeFilter::createForDepartment(),
            structureId: $structureId,
        ),
        roleFilter: RoleFilter::fromRoles(
            NodeMemberRole::Head,
            NodeMemberRole::DeputyHead,
        ),
    ))
    ->setLimit(100)
    ->getAll();
```

Назначение всех элементов перечисления `NodeMemberRole` приведено в статье [Участники и роли](./node-members.md#select-standard-role). Для фильтрации передавайте актуальный объект `RoleFilter` в параметр `roleFilter` класса `NodeMemberFilter`.

### Найти связи в родительских узлах пользователя

Чтобы найти связи в родительских узлах пользователя, установите параметр `findRelatedMembers` в `true`. Условие работает, только когда фильтр содержит `entityIdFilter` и `nodeFilter`. Класс `NodeMemberDataBuilder` берет первый идентификатор из `entityIdFilter` и строит связанные условия для направления `Direction::ROOT`.

**Пример.** Код находит руководителей в непосредственных родительских узлах пользователя.

```php
use Bitrix\HumanResources\Builder\Structure\Filter\Column\EntityIdFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\Column\Node\NodeTypeFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\Column\RoleFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeMemberFilter;
use Bitrix\HumanResources\Builder\Structure\NodeMemberDataBuilder;
use Bitrix\HumanResources\Enum\DepthLevel;
use Bitrix\HumanResources\Enum\Direction;
use Bitrix\HumanResources\Type\NodeMemberRole;

// Идентификаторы пользователя и структуры компании
$userId = 123;
$structureId = 1;

$relatedHeads = (new NodeMemberDataBuilder())
    ->setFilter(new NodeMemberFilter(
        entityIdFilter: EntityIdFilter::fromEntityId($userId),
        nodeFilter: new NodeFilter(
            entityTypeFilter: NodeTypeFilter::createForDepartment(),
            structureId: $structureId,
            direction: Direction::ROOT,
            depthLevel: DepthLevel::FIRST,
        ),
        findRelatedMembers: true,
        roleFilter: RoleFilter::fromRole(NodeMemberRole::Head),
    ))
    ->getAll();
```

Не используйте массив идентификаторов пользователей в этом режиме: остальные идентификаторы не участвуют в условии связанных узлов. Для нескольких пользователей выполняйте отдельные запросы или выберите готовый [сервис управленческой иерархии](./users-and-hierarchy.md).

Значение `DepthLevel::NONE` оставляет связи в тех же узлах, где состоит указанный пользователь. Для `Direction::ROOT` значение `FIRST` ограничивает поиск непосредственными родительскими узлами, а другие значения не добавляют ограничение глубины. Режим `Direction::CHILD` не реализует отдельное условие связанных участников, поэтому не используйте его для поиска подчиненных через этот параметр.

### Исключить узлы из выборки

Чтобы убрать известные узлы из результата, укажите режим `ConditionMode::Exclusion` в методе `IdFilter::fromIds()`. Фильтр добавляет условие `NOT IN` и не обходит иерархию.

**Пример.** Код получает связи пользователя со всеми подразделениями выбранной структуры, кроме узлов из массива `$excludedNodeIds`.

```php
use Bitrix\HumanResources\Builder\Structure\Filter\Column\EntityIdFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\Column\IdFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\Column\Node\NodeTypeFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeMemberFilter;
use Bitrix\HumanResources\Builder\Structure\NodeMemberDataBuilder;
use Bitrix\HumanResources\Enum\ConditionMode;
use Bitrix\HumanResources\Enum\NodeActiveFilter;

// Идентификатор пользователя и структуры компании
$userId = 123;
$structureId = 1;

// Идентификаторы узлов, которые нужно исключить
$excludedNodeIds = [10, 20];

$members = (new NodeMemberDataBuilder())
    ->setFilter(new NodeMemberFilter(
        entityIdFilter: EntityIdFilter::fromEntityId($userId),
        nodeFilter: new NodeFilter(
            idFilter: IdFilter::fromIds(
                $excludedNodeIds,
                ConditionMode::Exclusion,
            ),
            entityTypeFilter: NodeTypeFilter::createForDepartment(),
            structureId: $structureId,
            active: NodeActiveFilter::ALL,
        ),
    ))
    ->getAll();
```

Метод `IdFilter::fromIds()` приводит числовые значения к типу `int` и выбрасывает `ArgumentException`, если хотя бы один элемент массива не является числом. Пустой массив не добавляет условие по идентификаторам.

Режим `Exclusion` может работать не во всех сочетаниях фильтров. Комбинируйте его с другими фильтрами осторожно и проверяйте итоговую коллекцию.

## Отсортировать результат {#sort-result}

Сортировка делает результат предсказуемым и нужна для корректной постраничной выборки. Для узлов используйте `NodeSort`, для связей участников — `NodeMemberSort`. Направление задает перечисление `SortDirection`.

### Отсортировать узлы

Класс `NodeSort` сортирует по глубине иерархии, значению поля `SORT` и типу узла. Порядок аргументов конструктора определяет порядок полей сортировки: `depth`, затем `sort`, затем `type`.

**Пример.** Код получает исходный узел и всю ветку его потомков, затем располагает узлы сначала по глубине, а потом по значению поля `SORT`.

```php
use Bitrix\HumanResources\Builder\Structure\Filter\Column\IdFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeFilter;
use Bitrix\HumanResources\Builder\Structure\NodeDataBuilder;
use Bitrix\HumanResources\Builder\Structure\Sort\NodeSort;
use Bitrix\HumanResources\Enum\DepthLevel;
use Bitrix\HumanResources\Enum\Direction;
use Bitrix\HumanResources\Enum\SortDirection;

// Идентификатор исходного узла и структуры компании
$parentId = 42;
$structureId = 1;

$nodes = (new NodeDataBuilder())
    ->setFilter(new NodeFilter(
        idFilter: IdFilter::fromId($parentId),
        direction: Direction::CHILD,
        depthLevel: DepthLevel::FULL,
        structureId: $structureId,
    ))
    ->setSort(new NodeSort(
        depth: SortDirection::Asc,
        sort: SortDirection::Asc,
    ))
    ->getAll();
```

### Отсортировать связи участников

Класс `NodeMemberSort` сортирует связи по их идентификатору.

**Пример.** Код получает первую страницу из 50 связей узла и сортирует связи от новых к старым.

```php
use Bitrix\HumanResources\Builder\Structure\Filter\NodeFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeMemberFilter;
use Bitrix\HumanResources\Builder\Structure\NodeMemberDataBuilder;
use Bitrix\HumanResources\Builder\Structure\Sort\NodeMemberSort;
use Bitrix\HumanResources\Enum\SortDirection;

// Идентификатор узла
$nodeId = 42;

$members = (new NodeMemberDataBuilder())
    ->setFilter(new NodeMemberFilter(
        nodeFilter: NodeFilter::createWithNodeId($nodeId),
    ))
    ->setSort(new NodeMemberSort(id: SortDirection::Desc))
    ->setLimit(50)
    ->setOffset(0)
    ->getAll();
```

Для стабильной пагинации выбирайте сортировку с однозначным порядком. `NodeMemberSort` подходит для этого, потому что сортирует по идентификатору связи. В `NodeSort` поля `depth`, `sort` и `type` могут совпадать у нескольких узлов, а класс не поддерживает дополнительное поле идентификатора.

## Выбрать первый или последний элемент коллекции {#select-first-or-last-item}

Метод `NodeMemberDataBuilder::setSelectionCondition()` применяет объект `First` или `Last` после выполнения запроса и оставляет в коллекции один элемент, если результат не пуст.

**Пример.** Код сортирует связи по возрастанию идентификатора и получает последнюю связь из загруженной коллекции.

```php
use Bitrix\HumanResources\Builder\Structure\Filter\NodeFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeMemberFilter;
use Bitrix\HumanResources\Builder\Structure\NodeMemberDataBuilder;
use Bitrix\HumanResources\Builder\Structure\SelectionCondition\Last;
use Bitrix\HumanResources\Builder\Structure\Sort\NodeMemberSort;
use Bitrix\HumanResources\Enum\SortDirection;

// Идентификатор узла
$nodeId = 42;

$lastMember = (new NodeMemberDataBuilder())
    ->setFilter(new NodeMemberFilter(
        nodeFilter: NodeFilter::createWithNodeId($nodeId),
    ))
    ->setSort(new NodeMemberSort(id: SortDirection::Asc))
    ->setSelectionCondition(new Last())
    ->getAll()
    ->getFirst();
```

Условие `Last` выбирает последний элемент уже загруженной коллекции. Оно не меняет ORM-запрос и само по себе не уменьшает объем чтения. Сначала ограничьте запрос фильтрами и лимитом. Для первого элемента обычно проще вызвать `get()`. Он устанавливает лимит в один элемент до выполнения запроса.

## Продолжить настройку через ORM

Метод `prepareQuery()` классов `NodeDataBuilder` и `NodeMemberDataBuilder` нужен, когда их возможностей недостаточно, но собранные фильтры нужно сохранить. Метод возвращает настроенный объект `Bitrix\Main\ORM\Query\Query` и не загружает данные.

**Пример.** Код подготавливает запрос активных подразделений, ограничивает результат 50 строками и получает необработанные ORM-данные.

```php
use Bitrix\HumanResources\Builder\Structure\Filter\Column\Node\NodeTypeFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeFilter;
use Bitrix\HumanResources\Builder\Structure\NodeDataBuilder;

// Идентификатор структуры компании
$structureId = 1;

$query = (new NodeDataBuilder())
    ->setFilter(new NodeFilter(
        entityTypeFilter: NodeTypeFilter::createForDepartment(),
        structureId: $structureId,
    ))
    ->setLimit(50)
    ->prepareQuery();

$rows = $query->fetchAll();
```

Метод `fetchAll()` возвращает массивы ORM, а не объекты `Node` или `NodeMember`. Для результата в формате API модуля вызывайте `getAll()` или `get()`. Эти методы выполняют запрос и преобразуют строки в объекты коллекции.

## Ограничить выбираемые поля и кеш {#limit-selected-fields-and-cache}

Метод `setSelect()` классов `NodeDataBuilder` и `NodeMemberDataBuilder` полностью заменяет стандартный набор ORM-полей. Поля передаются в формате ORM, например `['ID', 'NAME', 'TYPE']`.

Без `setSelect()` классы запрашивают следующие поля:

#|
|| **Класс** | **Стандартные поля** ||
|| `NodeDataBuilder` | `ID`, `TYPE`, `PARENT_ID`, `STRUCTURE_ID`, `ACTIVE`, `GLOBAL_ACTIVE`, `NAME`, `DESCRIPTION`, `ACCESS_CODE`, `COLOR_NAME`, `SORT` ||
|| `NodeMemberDataBuilder` | `ID`, `ENTITY_TYPE`, `ENTITY_ID`, `NODE_ID`, `ACTIVE`, `ADDED_BY`, `CREATED_AT`, `UPDATED_AT`, `ROLE` ||
|#

Класс `NodeDataBuilder` преобразует отсутствующие поля в значения `null` или стандартные значения объекта `Node`. Если после выборки понадобится свойство `depth`, учитывайте его отложенную загрузку.

Для класса `NodeMemberDataBuilder` обязательно оставляйте поля `ENTITY_TYPE`, `ENTITY_ID` и `NODE_ID`: конструктор объекта `NodeMember` требует эти значения. Чтобы получить роли, добавьте отношение `ROLE`; стандартный список класса уже содержит необходимые поля.

**Пример.** Код получает только поля связи, которые нужны для определения пользователя, узла, активности и роли.

```php
use Bitrix\HumanResources\Builder\Structure\Filter\Column\EntityIdFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeMemberFilter;
use Bitrix\HumanResources\Builder\Structure\NodeMemberDataBuilder;

// Идентификатор пользователя
$userId = 123;

$members = (new NodeMemberDataBuilder())
    ->setFilter(new NodeMemberFilter(
        entityIdFilter: EntityIdFilter::fromEntityId($userId),
    ))
    ->setSelect([
        'ID',
        'ENTITY_TYPE',
        'ENTITY_ID',
        'NODE_ID',
        'ACTIVE',
        'ROLE',
    ])
    ->getAll();
```

Оба класса используют кеш на `86400` секунд по умолчанию. Уменьшайте время жизни кеша, если данные должны обновляться чаще одного раза в сутки. Класс `NodeDataBuilder` передает значение `0` в ORM и отключает кеш запроса. Класс `NodeMemberDataBuilder` передает время жизни кеша в ORM только при положительном значении, поэтому `0` также оставляет запрос без заданного кеша.

## Быстро собрать типовой фильтр

Фабричные методы создают готовые объекты фильтров для повторяющихся условий: одного или нескольких идентификаторов, типов узлов, названия и ролей. Передайте такой объект в соответствующий параметр `NodeFilter` или `NodeMemberFilter`.

**Пример.** Код сочетает три фабричных метода. Он выбирает руководителей подразделений из заданной структуры и исключает узлы из массива `$excludedNodeIds`.

```php
use Bitrix\HumanResources\Builder\Structure\Filter\Column\IdFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\Column\Node\NodeTypeFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\Column\RoleFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeFilter;
use Bitrix\HumanResources\Builder\Structure\Filter\NodeMemberFilter;
use Bitrix\HumanResources\Builder\Structure\NodeMemberDataBuilder;
use Bitrix\HumanResources\Enum\ConditionMode;
use Bitrix\HumanResources\Type\NodeMemberRole;

// Идентификатор структуры компании
$structureId = 1;

// Идентификаторы узлов, которые нужно исключить
$excludedNodeIds = [10, 20];

$filter = new NodeMemberFilter(
    nodeFilter: new NodeFilter(
        idFilter: IdFilter::fromIds(
            $excludedNodeIds,
            ConditionMode::Exclusion,
        ),
        entityTypeFilter: NodeTypeFilter::createForDepartment(),
        structureId: $structureId,
    ),
    roleFilter: RoleFilter::fromRole(NodeMemberRole::Head),
);

$heads = NodeMemberDataBuilder::createWithFilter($filter)->getAll();
```

#|
|| **Фабрика** | **Результат и особенность** ||
|| `IdFilter::fromId(int $id)` | Включает один идентификатор узла ||
|| `IdFilter::fromIds(array $ids, ConditionMode $mode)` | Включает или исключает несколько узлов. Режим по умолчанию — `Inclusion` ||
|| `EntityIdFilter::fromEntityId(int $entityId)` | Включает одного пользователя ||
|| `EntityIdFilter::fromEntityIds(array $entityIds)` | Включает нескольких пользователей; массив должен быть непустым ||
|| `NodeTypeFilter::createForDepartment()` | Включает подразделения ||
|| `NodeTypeFilter::createForTeam()` | Включает команды ||
|| `NodeTypeFilter::fromNodeType(NodeEntityType $type)` | Включает один переданный тип узлов ||
|| `NodeTypeFilter::fromNodeTypes(array $types)` | Включает несколько типов узлов; массив должен быть непустым ||
|| `NodeNameFilter::fromName(string $name)` | Ищет узлы по подстроке названия ||
|| `RoleFilter::fromRole(NodeMemberRole $role)` | Включает одну стандартную роль ||
|| `RoleFilter::fromRoles(NodeMemberRole ...$roles)` | Включает несколько стандартных ролей ||
|#

Пустой список в `RoleFilter::fromRoles()` не добавляет условие по ролям. Если отсутствие ролей должно давать пустой результат, завершите сценарий до выполнения запроса.

Чтобы отфильтровать узлы по кодам доступа, получите их идентификаторы методом `Bitrix\HumanResources\Public\Service\NodeService::getNodeIdsByAccessCodes()`, а затем передайте результат в `IdFilter::fromIds()`.

{% note tip "" %}

Поиск узлов по кодам доступа описан в статье [Узлы структуры компании](./nodes.md).

{% endnote %}

## Обработать результат и ошибки

Пустой результат не всегда означает отсутствие данных. Перед изменением фильтров проверьте:

-  модуль `humanresources` подключен,

-  выбран правильный идентификатор структуры,

-  исходные идентификаторы пользователей и узлов не пусты и существуют,

-  типы и роли соответствуют подразделениям или командам,

-  фильтры активности не исключают нужный узел или связь,

-  направление и глубина обхода соответствуют задаче,

-  `limit` и `offset` не исключают нужную строку,

-  текущему или указанному пользователю доступно действие из `NodeAccessFilter`,

-  время жизни кеша соответствует допустимому сроку устаревания данных.

При построении и выполнении выборки возможны следующие исключения.

#|
|| **Исключение** | **Причина** ||
|| `InvalidArgumentException` | Неподходящий тип фильтра для `NodeDataBuilder` ||
|| `Bitrix\Main\ArgumentException` | Некорректные идентификаторы, отсутствие типа узла при проверке доступа или ошибка подготовки ORM-условия ||
|| `Bitrix\Main\ObjectPropertyException` | Ошибка подготовки или чтения ORM-данных ||
|| `Bitrix\Main\SystemException` | Ошибка подготовки или выполнения запроса ||
|| `Bitrix\HumanResources\Exception\WrongStructureItemException` | Ошибка преобразования связи участника в объект структуры ||
|#

Обрабатывайте исключения на уровне приложения, где известен контекст запроса. Классы `NodeDataBuilder` и `NodeMemberDataBuilder` перехватывают `NodeAccessFilterException` и возвращают пустой результат, поэтому отдельно диагностируйте права пользователя.

## Продолжить изучение

-  [Узлы структуры компании](./nodes.md)

-  [Участники и роли в структуре компании](./node-members.md)

-  [Пользователи и управленческая иерархия](./users-and-hierarchy.md)

-  [Производительность и частые ошибки](./performance.md)
