---
title: Узлы структуры компании
description: "Получение и поиск подразделений и команд, обход иерархии и фильтрация узлов через Bitrix\\HumanResources\\Public\\Service\\NodeService модуля humanresources."
---

Узел — это подразделение или команда в структуре компании. С помощью публичного API разработчик находит узел по известному идентификатору, получает подразделения и команды пользователя или проходит по нужной части дерева структуры.

API возвращает отдельные узлы и коллекции, фильтрует их, находит родителей и дочерние элементы. API работает с данными в режиме чтения. Для вызова методов используйте сервис `Bitrix\HumanResources\Public\Service\NodeService`. 

{% note tip "" %}

Подробнее о понятиях узла и структуры компании читайте во [введении](./overview.md), о задачах публичных сервисов — в [архитектуре модуля](./architecture.md).

{% endnote %}

## Выбрать метод {#select-method}

Выбирайте метод сервиса `Bitrix\HumanResources\Public\Service\NodeService` по исходным данным и ожидаемому результату.

#|
|| **Задача** | **Метод** ||
|| Получить узел по внутреннему идентификатору | `getById()` ||
|| Получить узел по коду доступа | `getByAccessCode()` ||
|| Начать обход структуры от корня | `getRootNode()` ||
|| Получить страницу узлов структуры | `findAll()` ||
|| Получить узлы по набору идентификаторов | `findAllByIds()` ||
|| Получить узлы по кодам доступа | `findAllByAccessCodes()` ||
|| Найти узлы по названию | `findAllByName()` ||
|| Найти узлы по внешнему идентификатору | `findAllByXmlId()` ||
|| Получить подразделения или команды пользователя | `findAllByMemberEntityId()` ||
|| Подняться к родительским узлам | `findParentsByNodeId()` ||
|| Спуститься к дочерним узлам | `findChildrenByNodeIds()` ||
|| Преобразовать коды доступа в идентификаторы | `getNodeIdsByAccessCodes()` ||
|#

## Получить сервис

Перед вызовом методов подключите модуль `humanresources` и получите сервис `Bitrix\HumanResources\Public\Service\NodeService`.

```php
if (!\Bitrix\Main\Loader::includeModule('humanresources'))
{
    throw new \RuntimeException('Модуль humanresources недоступен');
}

$nodeService = \Bitrix\HumanResources\Public\Service\Container::getNodeService();
```

## Типы результатов

Методы `Bitrix\HumanResources\Public\Service\NodeService` возвращают один из четырех результатов:

-  объект `Bitrix\HumanResources\Item\Node`, если найден один узел,

-  `null`, если одиночный метод не нашел узел или доступ к нему ограничен,

-  коллекцию `Bitrix\HumanResources\Item\Collection\NodeCollection`, если метод выбирает несколько узлов,

-  массив идентификаторов для `getNodeIdsByAccessCodes()`.

Объект `Bitrix\HumanResources\Item\Node` содержит данные узла. Знак `?` перед типом означает, что свойство может содержать `null`. Короткое имя `NodeEntityType` в таблице обозначает класс `Bitrix\HumanResources\Type\NodeEntityType`.

#|
|| **Свойство объекта** | **Тип** | **Описание** ||
|| `id` | `?int` | Идентификатор узла ||
|| `name` | `?string` | Название ||
|| `type` | `?NodeEntityType` | Тип узла: `NodeEntityType::DEPARTMENT` или `NodeEntityType::TEAM` ||
|| `structureId` | `?int` | Идентификатор структуры ||
|| `parentId` | `?int` | Идентификатор родительского узла ||
|| `accessCode` | `?string` | Код доступа ||
|| `xmlId` | `?string` | Внешний идентификатор ||
|| `active` | `?bool` | Собственный признак активности узла ||
|| `globalActive` | `?bool` | Активность узла с учетом активности родителей ||
|| `sort` | `?int` | Значение сортировки ||
|| `description` | `?string` | Описание ||
|| `colorName` | `?string` | Название цвета узла ||
|| `createdBy` | `?int` | Идентификатор пользователя, который создал узел ||
|| `createdAt`, `updatedAt` | `?Bitrix\Main\Type\DateTime` | Даты создания и изменения ||
|| `depth` | `?int` | Глубина узла. При `needDepth: true` загружается сразу, иначе — при первом обращении к свойству ||
|#

Методы `isDepartment()` и `isTeam()` объекта `Bitrix\HumanResources\Item\Node` проверяют тип узла и возвращают `true` или `false`.

```php
$node = $nodeService->getById(15);
if ($node === null)
{
    throw new \RuntimeException('Узел не найден');
}

if ($node->isDepartment())
{
    echo 'Узел является подразделением';
}
```

Коллекция `Bitrix\HumanResources\Item\Collection\NodeCollection` поддерживает перебор через `foreach`. Для работы с результатом используйте методы:

-  `empty()` — проверяет, пуста ли коллекция,

-  `count()` — возвращает количество элементов,

-  `getIds()` — возвращает идентификаторы узлов,

-  `getItemById()` — возвращает узел с указанным идентификатором или `null`.

```php
// Идентификатор узла, который нужно найти в коллекции
$nodeId = 15;
$nodes = $nodeService->findAllByIds(nodeIds: [$nodeId]);

$node = $nodes->getItemById($nodeId);
if ($node === null)
{
    echo 'Узел не найден в коллекции';
}
```

## Настроить выборку под задачу {#configure-query}

Перед вызовом метода определите, из какой структуры получить узлы, какие типы включить и насколько глубоко пройти по дереву. Передавайте параметры, которые меняют результат сценария.

### Ограничить структуру и типы узлов

В сервисе параметр `structureId` позволяет получить узлы из заданной структуры компании. Его можно использовать в методах:

-  `getRootNode()` — получить корневой узел,

-  `findChildrenByNodeIds()` — обойти дочерние узлы,

-  `findAll()`, `findAllByIds()`, `findAllByAccessCodes()`, `findAllByName()`, `findAllByXmlId()` и `findAllByMemberEntityId()` — найти узлы.

Метод `findAll()` требует идентификатор структуры и не принимает `null`. Методы `getRootNode()` и `findAllByXmlId()` при значении `null` обращаются к структуре по умолчанию. В остальных методах `null` не ограничивает поиск заданной структурой.

Параметр `nodeTypes` позволяет выбрать типы узлов. Его можно использовать в методах `findAll()`, `findAllByIds()`, `findAllByAccessCodes()`, `findAllByName()`, `findAllByMemberEntityId()`, `findParentsByNodeId()` и `findChildrenByNodeIds()`.

Передайте в `nodeTypes` одно или оба значения `Bitrix\HumanResources\Type\NodeEntityType`:

-  `Bitrix\HumanResources\Type\NodeEntityType::DEPARTMENT` — подразделения,

-  `Bitrix\HumanResources\Type\NodeEntityType::TEAM` — команды.

Если не передать `nodeTypes`, большинство методов вернет только подразделения. Метод `findChildrenByNodeIds()` по умолчанию возвращает подразделения и команды.

В примере кода `$structureId` хранит идентификатор структуры, а `$parentNodeId` — идентификатор родительского узла.

```php
$structureId = 2;
$parentNodeId = 15;

$nodes = $nodeService->findChildrenByNodeIds(
    nodeIds: [$parentNodeId],
    structureId: $structureId,
    nodeTypes: [
        \Bitrix\HumanResources\Type\NodeEntityType::DEPARTMENT,
        \Bitrix\HumanResources\Type\NodeEntityType::TEAM,
    ],
);
```

### Оставить узлы с доступным действием

Параметр `structureAction` фильтрует узлы по доступному действию. Сервис проверяет права текущего пользователя. Используйте параметр в методах `getById()`, `findAll*()`, `findParentsByNodeId()` и `findChildrenByNodeIds()`. Значение `null` отключает фильтр.

Параметр принимает одно из действий `Bitrix\HumanResources\Type\StructureAction`.

#|
|| **Действие** | **Операция** ||
|| `ViewAction` | Просмотреть узел ||
|| `CreateAction` | Создать узел ||
|| `UpdateAction` | Изменить узел ||
|| `DeleteAction` | Удалить узел ||
|| `AddMemberAction` | Добавить участника ||
|| `RemoveMemberAction` | Удалить участника ||
|| `InviteUserAction` | Пригласить пользователя ||
|| `EditSettingsAction` | Изменить настройки узла ||
|| `EditChatAction` | Изменить чат ||
|| `EditChannelAction` | Изменить канал ||
|| `EditCollabAction` | Изменить совместное рабочее пространство ||
|#

```php
$nodes = $nodeService->findAllByIds(
    nodeIds: [15, 27],
    structureAction: \Bitrix\HumanResources\Type\StructureAction::ViewAction,
);
```

Метод вернет из узлов `15` и `27` только те, которые текущий пользователь может просматривать. Доступность действия зависит от типа узла.

### Выбрать узлы по активности

Параметр `activeFilter` фильтрует узлы по активности. Его можно использовать в методах `findAll()`, `findAllByIds()`, `findAllByAccessCodes()`, `findAllByName()`, `findAllByXmlId()` и `findChildrenByNodeIds()`. В методе `findAllByMemberEntityId()` этот параметр называется `nodeActiveFilter`.

Передайте в параметр одно из значений `Bitrix\HumanResources\Enum\NodeActiveFilter`:

-  `ONLY_GLOBAL_ACTIVE` — выбирает активные узлы, у которых также активны родители. Используется по умолчанию.

-  `ONLY_ACTIVE` — проверяет только собственную активность узла.

-  `ALL` — возвращает активные и неактивные узлы.

```php
$nodes = $nodeService->findAllByIds(
    nodeIds: [15, 27],
    activeFilter: \Bitrix\HumanResources\Enum\NodeActiveFilter::ALL,
);
```

Пример возвращает узлы `15` и `27` независимо от их активности. Другие фильтры метода могут исключить часть узлов.

### Задать глубину обхода {#set-traversal-depth}

Параметр `depthLevel` принимает значение перечисления `Bitrix\HumanResources\Enum\DepthLevel` или целое положительное число. Параметр можно передать в методы:

-  `findAllByName()` — по умолчанию `FULL`,

-  `findParentsByNodeId()` — по умолчанию `FIRST`,

-  `findChildrenByNodeIds()` — по умолчанию `FIRST`.

Значения перечисления задают область обхода:

-  `FIRST` — только ближайший уровень,

-  `FULL` — вся доступная ветвь,

-  `NONE` — останавливает обход на исходном уровне,

-  `WITHOUT_PARENT` — все подходящие уровни, кроме узла, от которого начался обход,

-  целое положительное число — максимум указанного количества уровней.

```php
// Идентификатор родительского узла
$nodeId = 15;

$children = $nodeService->findChildrenByNodeIds(
    nodeIds: [$nodeId],
    depthLevel: \Bitrix\HumanResources\Enum\DepthLevel::FULL,
);
```

### Ограничить количество результатов {#limit-results}

Передайте `limit` и `offset` в метод `findAll()`, чтобы получить нужную страницу результатов. По умолчанию `limit` равен `100`, `offset` — `0`.

```php
$structureId = 2;

$nodes = $nodeService->findAll(
    structureId: $structureId,
    limit: 50,
    offset: 100,
);
```

Метод `findAllByName()` поддерживает только `limit`. Задать смещение результатов нельзя.

## Получить отдельный узел

Получайте один узел по известному идентификатору или коду доступа. Если нужно начать обход дерева, получите корневой узел. Каждый метод этого раздела возвращает объект `Bitrix\HumanResources\Item\Node` или `null`.

### Получить узел по идентификатору

Используйте метод сервиса `getById()`, чтобы получить узел по внутреннему идентификатору. Передайте в метод параметры:

-  `nodeId` — идентификатор узла.

-  `needDepth` — признак загрузки глубины узла в свойство `depth`. По умолчанию равен `false`.

-  `structureAction` — действие, доступность которого нужно проверить для текущего пользователя. По умолчанию равен `null`.

```php
// Идентификатор узла из структуры компании
$nodeId = 15;

$node = $nodeService->getById(
    // Внутренний идентификатор узла
    nodeId: $nodeId,
    needDepth: true,
    structureAction: \Bitrix\HumanResources\Type\StructureAction::ViewAction,
);

if ($node === null)
{
    throw new \RuntimeException('Узел отсутствует или доступ ограничен');
}

echo $node->name . ', глубина: ' . $node->depth;
```

### Получить узел по коду доступа {#get-node-by-access-code}

Используйте `getByAccessCode()`, когда известен код доступа, но неизвестен внутренний идентификатор узла. Метод вернет найденный узел или `null`.

Передавайте в метод только параметр `accessCode`. Код состоит из префикса и идентификатора:

-  `SN` — узел структуры,

-  `SNT` — команда,

-  `SNTR` — рекурсивный код команды,

-  `SND` — подразделение,

-  `SNDR` — рекурсивный код подразделения,

-  `D` и `DR` — коды подразделений классического API. Сервис преобразует их через таблицу соответствий.

```php
$node = $nodeService->getByAccessCode(
    // Код доступа узла
    accessCode: 'SN15',
);

if ($node === null)
{
    throw new \RuntimeException('Узел не найден');
}
```

### Получить корневой узел

Чтобы начать обход дерева, получите корневой узел методом `getRootNode()`. Передайте в `structureId` идентификатор нужной структуры. Если не передать параметр или передать `null`, метод обратится к структуре по умолчанию.

```php
// Идентификатор структуры
$structureId = 2;

$rootNode = $nodeService->getRootNode(structureId: $structureId);

if ($rootNode === null)
{
    throw new \RuntimeException('Корневая структура отсутствует');
}
```

## Найти несколько узлов

Методы раздела ищут узлы по идентификаторам, кодам доступа, названию, внешнему идентификатору или пользователю. Они возвращают `Bitrix\HumanResources\Item\Collection\NodeCollection`. Пустая коллекция означает, что подходящих узлов нет.

### Получить все узлы структуры

Чтобы получить страницу узлов выбранной структуры, вызовите `findAll()`. Метод возвращает коллекцию узлов с учетом переданных фильтров.

Передайте в метод параметры:

-  `structureId` — идентификатор структуры, из которой нужно получить узлы. Обязательный параметр.

-  `nodeTypes` — типы узлов. По умолчанию содержит `Bitrix\HumanResources\Type\NodeEntityType::DEPARTMENT`. Добавьте `Bitrix\HumanResources\Type\NodeEntityType::TEAM`, чтобы включить команды.

-  `activeFilter` — фильтр по активности. По умолчанию равен `Bitrix\HumanResources\Enum\NodeActiveFilter::ONLY_GLOBAL_ACTIVE`.

-  `structureAction` — действие, доступность которого нужно проверить. По умолчанию равен `null`.

-  `limit` — размер страницы. По умолчанию равен `100`.

-  `offset` — смещение страницы. По умолчанию равен `0`.

```php
$structureId = 2;

$nodes = $nodeService->findAll(
    structureId: $structureId, // Идентификатор структуры
    nodeTypes: [
        \Bitrix\HumanResources\Type\NodeEntityType::DEPARTMENT,
        \Bitrix\HumanResources\Type\NodeEntityType::TEAM,
    ],
    structureAction: \Bitrix\HumanResources\Type\StructureAction::ViewAction,
    activeFilter: \Bitrix\HumanResources\Enum\NodeActiveFilter::ONLY_GLOBAL_ACTIVE,
    limit: 50, // Размер страницы
    offset: 0, // Смещение страницы
);
```

Для постраничного обхода увеличивайте `offset` на значение `limit` после каждой страницы. Завершайте пагинацию, когда количество элементов станет меньше `limit`.

```php
$structureId = 2;
$limit = 50;
$offset = 0;

do
{
    $page = $nodeService->findAll(
        // Идентификатор структуры компании
        structureId: $structureId,
        nodeTypes: [\Bitrix\HumanResources\Type\NodeEntityType::DEPARTMENT],
        limit: $limit,
        offset: $offset,
    );

    foreach ($page as $node)
    {
        echo $node->id . ': ' . $node->name . PHP_EOL;
    }

    $offset += $limit;
}
while ($page->count() === $limit);
```

### Найти узлы по идентификаторам

Используйте `findAllByIds()`, чтобы получить несколько узлов по внутренним идентификаторам. Передайте идентификаторы в `nodeIds`. Пустой массив возвращает пустую коллекцию. Фильтры структуры, типа, действия и активности могут исключить часть запрошенных узлов.

```php
$structureId = 2;

$nodes = $nodeService->findAllByIds(
    // Внутренние идентификаторы узлов
    nodeIds: [15, 27, 31],
    // Идентификатор структуры компании
    structureId: $structureId,
    nodeTypes: [\Bitrix\HumanResources\Type\NodeEntityType::DEPARTMENT],
    structureAction: \Bitrix\HumanResources\Type\StructureAction::ViewAction,
);
```

Учитывайте фильтры при сравнении количества переданных идентификаторов с размером результата. Наличие конкретного узла проверяйте через `containsNodeWithId()` или `getItemById()`.

### Найти узлы по кодам доступа

Используйте `findAllByAccessCodes()`, чтобы получить несколько узлов по кодам доступа. Метод преобразует коды в идентификаторы, применяет фильтры и возвращает коллекцию найденных узлов.

Передайте в метод параметры:

-  `accessCodes` — коды доступа узлов. Обязательный параметр. Пустой массив возвращает пустую коллекцию.

-  `nodeTypes` — типы узлов. По умолчанию равен `null`.

-  `structureId` — идентификатор структуры. По умолчанию равен `null`.

-  `structureAction` — действие, доступность которого нужно проверить. По умолчанию равен `null`.

-  `activeFilter` — фильтр по активности. По умолчанию равен `Bitrix\HumanResources\Enum\NodeActiveFilter::ONLY_GLOBAL_ACTIVE`.

Префиксы и формат кодов описаны в разделе [Получить узел по коду доступа](./nodes.md#get-node-by-access-code). Числовая часть кодов `SN`, `SNT`, `SNTR`, `SND` и `SNDR` содержит идентификатор узла. Для кодов `D` и `DR` числовая часть может не совпадать с идентификатором узла.

Если массив содержит код неподдерживаемого формата, метод выбросит исключение `\InvalidArgumentException`.

```php
$structureId = 2;

$nodes = $nodeService->findAllByAccessCodes(
    // Коды доступа узлов
    accessCodes: ['SN15', 'SN27'],
    // Идентификатор структуры компании
    structureId: $structureId,
    nodeTypes: [\Bitrix\HumanResources\Type\NodeEntityType::DEPARTMENT],
    structureAction: \Bitrix\HumanResources\Type\StructureAction::ViewAction,
);
```

Метод `getNodeIdsByAccessCodes()` преобразует коды доступа в массив идентификаторов `int[]`. Для кодов узлов структуры компании метод извлекает идентификаторы из числовой части, а для кодов подразделений классического API использует таблицу соответствий.

```php
// Коды доступа узлов
$nodeIds = $nodeService->getNodeIdsByAccessCodes(['SN15', 'SN27']);
// [15, 27]
```

### Найти узлы по названию

Чтобы найти узлы по названию, используйте метод `findAllByName()`. Передайте параметры:

-  `name` — строка поиска. Значение `null` выбирает узлы с учетом `parentIds`.

-  `parentIds` — идентификаторы корневых узлов для поиска по ветвям. По умолчанию равен `null`.

-  `structureId` — идентификатор структуры. По умолчанию равен `null`.

-  `nodeTypes` — типы узлов. По умолчанию содержит `Bitrix\HumanResources\Type\NodeEntityType::DEPARTMENT`.

-  `depthLevel` — глубина обхода. По умолчанию равен `Bitrix\HumanResources\Enum\DepthLevel::FULL`.

-  `strict` — режим сравнения названия. Значение `true` требует полного совпадения, а `false` ищет вхождение строки. По умолчанию равен `false`.

-  `structureAction` — действие, доступность которого нужно проверить. По умолчанию равен `null`.

-  `activeFilter` — фильтр по активности. По умолчанию равен `Bitrix\HumanResources\Enum\NodeActiveFilter::ONLY_GLOBAL_ACTIVE`.

-  `limit` — максимальное количество результатов. По умолчанию равен `100`.

```php
$structureId = 2;
$parentNodeId = 15;

$nodes = $nodeService->findAllByName(
    // Строка для поиска внутри названия
    name: 'Продажи',
    // Идентификатор структуры компании
    structureId: $structureId,
    // Корень ветви поиска
    parentIds: [$parentNodeId],
    nodeTypes: [
        \Bitrix\HumanResources\Type\NodeEntityType::DEPARTMENT,
        \Bitrix\HumanResources\Type\NodeEntityType::TEAM,
    ],
    depthLevel: \Bitrix\HumanResources\Enum\DepthLevel::FULL,
    strict: false,
    structureAction: \Bitrix\HumanResources\Type\StructureAction::ViewAction,
    activeFilter: \Bitrix\HumanResources\Enum\NodeActiveFilter::ONLY_GLOBAL_ACTIVE,
    limit: 50,
);
```

При `name: null` параметр `parentIds` определяет результат. При заданном `parentIds` метод выбирает дочерние узлы, а при `parentIds: null` — все узлы. Методы `findChildrenByNodeIds()` и `findAll()` точнее выражают эти задачи в коде.

### Найти узлы по внешнему идентификатору

Чтобы связать узлы с данными внешней системы, найдите их по внешнему идентификатору методом `findAllByXmlId()`. Метод возвращает коллекцию, потому что один `xmlId` может соответствовать нескольким узлам.

Передайте в метод параметры:

-  `xmlId` — внешний идентификатор узла. Обязательный параметр.

-  `structureId` — идентификатор структуры. По умолчанию равен `null`: метод обращается к структуре по умолчанию.

-  `structureAction` — действие, доступность которого нужно проверить. По умолчанию равен `null`.

-  `activeFilter` — фильтр по активности. По умолчанию равен `Bitrix\HumanResources\Enum\NodeActiveFilter::ONLY_GLOBAL_ACTIVE`.

```php
$structureId = 2;

$nodes = $nodeService->findAllByXmlId(
    // Внешний идентификатор узла
    xmlId: 'sales-department',
    // Идентификатор структуры компании
    structureId: $structureId,
    structureAction: \Bitrix\HumanResources\Type\StructureAction::ViewAction,
);
```

### Получить узлы пользователя

Используйте `findAllByMemberEntityId()`, чтобы получить узлы пользователя с учетом типа участника, структуры, типов узлов, прав и активности.

Передайте в метод параметры:

-  `memberEntityId` — идентификатор пользователя. Обязательный параметр.

-  `memberEntityType` — тип участника. По умолчанию равен `Bitrix\HumanResources\Type\MemberEntityType::USER`.

-  `structureId` — идентификатор структуры. По умолчанию равен `null`.

-  `nodeTypes` — типы узлов. По умолчанию содержит `Bitrix\HumanResources\Type\NodeEntityType::DEPARTMENT`.

-  `structureAction` — действие, доступность которого нужно проверить. По умолчанию равен `null`.

-  `nodeActiveFilter` — фильтр узлов по активности. По умолчанию равен `Bitrix\HumanResources\Enum\NodeActiveFilter::ONLY_GLOBAL_ACTIVE`.

```php
$userId = 25;
$structureId = 2;

$nodes = $nodeService->findAllByMemberEntityId(
    // Идентификатор пользователя
    memberEntityId: $userId,
    memberEntityType: \Bitrix\HumanResources\Type\MemberEntityType::USER,
    // Идентификатор структуры компании
    structureId: $structureId,
    nodeTypes: [\Bitrix\HumanResources\Type\NodeEntityType::DEPARTMENT],
    structureAction: \Bitrix\HumanResources\Type\StructureAction::ViewAction,
);
```

Результат содержит узлы, с которыми связан участник указанного типа. Связи и роли доступны через сервисы из статьи [Участники и роли в структуре компании](./node-members.md).

По умолчанию метод ищет только подразделения. Чтобы получить команды пользователя, передайте `nodeTypes: [\Bitrix\HumanResources\Type\NodeEntityType::TEAM]`.

## Найти родительские и дочерние узлы

Сервис позволяет найти родителей одного узла и дочерние элементы одного или нескольких узлов. Параметр `depthLevel` определяет, остановится ли поиск на ближайшем уровне или пройдет по всей ветви.

### Найти родительские узлы

Используйте `findParentsByNodeId()`, чтобы получить родителей узла с учетом типов, глубины обхода и прав текущего пользователя. Метод возвращает коллекцию родительских узлов. При явно заданном `nodeTypes` и отсутствующем исходном узле метод может вернуть `null`. Параметры определяют область поиска.

-  `nodeId` — идентификатор исходного узла. Обязательный параметр.

-  `nodeTypes` — типы родительских узлов. Значение `null` включает автоматический выбор: для команды сервис использует подразделения и команды, для подразделения — только подразделения. По умолчанию равен `null`.

-  `depthLevel` — глубина поиска. По умолчанию равен `Bitrix\HumanResources\Enum\DepthLevel::FIRST` и выбирает ближайшего родителя.

-  `structureAction` — действие, доступность которого нужно проверить. По умолчанию равен `null`.

```php
$nodeId = 15;

$parents = $nodeService->findParentsByNodeId(
    // Внутренний идентификатор исходного узла
    nodeId: $nodeId,
    nodeTypes: [
        \Bitrix\HumanResources\Type\NodeEntityType::DEPARTMENT,
        \Bitrix\HumanResources\Type\NodeEntityType::TEAM,
    ],
    depthLevel: \Bitrix\HumanResources\Enum\DepthLevel::FULL,
    structureAction: \Bitrix\HumanResources\Type\StructureAction::ViewAction,
);
```

Тип результата при отсутствии исходного узла зависит от `nodeTypes`. При `nodeTypes: null` метод возвращает пустую коллекцию, а при явно заданном массиве типов может вернуть `null`. Проверяйте оба результата перед обращением к коллекции, чтобы не вызвать метод `empty()` у `null`.

```php
if ($parents === null || $parents->empty())
{
    return;
}
```

### Найти дочерние узлы

Используйте `findChildrenByNodeIds()`, чтобы получить дочерние узлы одного или нескольких родителей с учетом структуры, типов, глубины, прав и активности. Метод возвращает коллекцию дочерних узлов.

Передайте в метод параметры:

-  `nodeIds` — идентификаторы родительских узлов. Обязательный параметр. Пустой массив возвращает пустую коллекцию.

-  `structureId` — идентификатор структуры. По умолчанию равен `null`.

-  `nodeTypes` — типы дочерних узлов. По умолчанию содержит `Bitrix\HumanResources\Type\NodeEntityType::DEPARTMENT` и `Bitrix\HumanResources\Type\NodeEntityType::TEAM`.

-  `depthLevel` — глубина поиска. По умолчанию равен `Bitrix\HumanResources\Enum\DepthLevel::FIRST` и выбирает ближайший уровень.

-  `structureAction` — действие, доступность которого нужно проверить. По умолчанию равен `null`.

-  `activeFilter` — фильтр дочерних узлов по активности. По умолчанию равен `Bitrix\HumanResources\Enum\NodeActiveFilter::ONLY_GLOBAL_ACTIVE`.

```php
$nodeId = 15;
$structureId = 2;

$children = $nodeService->findChildrenByNodeIds(
    // Идентификаторы родительских узлов
    nodeIds: [$nodeId],
    // Идентификатор структуры компании
    structureId: $structureId,
    nodeTypes: [
        \Bitrix\HumanResources\Type\NodeEntityType::DEPARTMENT,
        \Bitrix\HumanResources\Type\NodeEntityType::TEAM,
    ],
    depthLevel: \Bitrix\HumanResources\Enum\DepthLevel::FULL,
    structureAction: \Bitrix\HumanResources\Type\StructureAction::ViewAction,
    activeFilter: \Bitrix\HumanResources\Enum\NodeActiveFilter::ONLY_GLOBAL_ACTIVE,
);
```

## Проверить результат и обработать ошибки

Проверяйте результат сразу после вызова метода. Для одиночного узла сравните результат с `null`. Для коллекции вызовите `empty()`.

```php
$node = $nodeService->getById(15);
if ($node === null)
{
    echo 'Узел не найден или доступ ограничен';
}

$nodes = $nodeService->findAllByIds(nodeIds: [15, 27]);
if ($nodes->empty())
{
    echo 'Узлы не найдены';
}
```

Значение `null` у одиночного метода означает отсутствие узла. Если параметр `structureAction` задан, значение `null` также указывает на ограниченный доступ текущего пользователя. Пустая коллекция `Bitrix\HumanResources\Item\Collection\NodeCollection` означает отсутствие узлов, которые соответствуют фильтрам выборки.

Методы `Bitrix\HumanResources\Public\Service\NodeService` могут выбросить исключения:

-  `Bitrix\Main\ArgumentException`, `Bitrix\Main\ObjectPropertyException` и `Bitrix\Main\SystemException` — ошибки аргументов, свойств объектов и работы системы,

-  `\InvalidArgumentException` — код доступа в массиве имеет неподдерживаемый формат,

-  `Bitrix\HumanResources\Exception\NodeAccessFilterException` — фильтр доступа недоступен для выбранной комбинации действия и типов узлов.

При неожиданном пустом результате проверьте:

-  доступен ли модуль `humanresources`,

-  соответствует ли `structureId` нужной структуре,

-  содержит ли `nodeTypes` значение `Bitrix\HumanResources\Type\NodeEntityType::TEAM`, если нужна команда,

-  соответствует ли узел фильтру активности,

-  охватывает ли `depthLevel` нужный уровень,

-  доступно ли текущему пользователю действие из `structureAction`,

-  попадает ли нужный узел в границы `limit`, `offset`, `parentIds` и условия поиска по названию.

Сервис `Bitrix\HumanResources\Public\Service\NodeService` отделяет получение узлов от работы с участниками. Если готовых методов сервиса недостаточно, используйте гибкие выборки через `Bitrix\HumanResources\Builder\Structure\NodeDataBuilder`. После получения нужного `Bitrix\HumanResources\Item\Node` переходите к [связям участников и ролям](./node-members.md) или к [управленческой иерархии](./users-and-hierarchy.md).
