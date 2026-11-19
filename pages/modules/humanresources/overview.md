---
title: Введение и базовые концепции
description: "Назначение API модуля humanresources, основные объекты структуры компании, подключение модуля и первый запрос."
---

Структура компании в Битрикс24 объединяет подразделения, команды и пользователей. Модуль Управление персоналом `humanresources` предоставляет API, чтобы найти нужную часть структуры, получить ее участников и роли, определить руководителей и подчиненных или прочитать настройки.

API сгруппирован в сервисы по типам задач. Контейнер `Bitrix\HumanResources\Public\Service\Container` возвращает нужный сервис, а сервис выполняет операцию со структурой компании.

{% note info "" %}

Модуль Управление персоналом доступен только в Битрикс24. В 1С-Битрикс: Управление сайтом модуль отсутствует.

{% endnote %}

## Основные объекты

**Структура компании** — дерево подразделений и команд. В дереве есть корневой узел и связанные с ним дочерние узлы.

**Узел** — элемент структуры. Узел хранит положение в иерархии и относится к одному из двух типов: `DEPARTMENT` или `TEAM`.

**Подразделение** — узел типа `DEPARTMENT`. Подразделения образуют административную иерархию компании.

**Команда** — узел типа `TEAM`. Команды используют для рабочих объединений сотрудников, которые нужно отличать от административных подразделений.

**Участник** — связь пользователя с узлом. Один пользователь может состоять в нескольких узлах, поэтому пользователя и участника нельзя считать одним объектом.

**Роль** — назначение участника внутри узла. Роль используется, например, чтобы отличить руководителя, заместителя и сотрудника.

{% note tip "" %}

Связи между этими объектами и распределение задач между сервисами приведены в статье [Архитектура модуля и выбор сервиса](./architecture.md).

{% endnote %}

## Как подключить модуль {#connect-module}

Перед обращением к API подключите модуль `humanresources`. Метод [`Loader::includeModule()`](../../api-reference/main/loader/include-module.md) возвращает `false`, если модуль недоступен.

```php
use Bitrix\Main\Loader;

if (!Loader::includeModule('humanresources'))
{
    throw new \RuntimeException('Модуль humanresources не установлен');
}
```

Не продолжайте выполнение сценария после неудачного подключения. Классы и сервисы модуля в этом случае недоступны.

## Как получить сервис и узел

**Пример.** Код получает узел по известному внутреннему идентификатору. Число `42` — условный идентификатор. Замените его идентификатором узла из своего сценария.

```php
use Bitrix\HumanResources\Public\Service\Container;
use Bitrix\Main\Loader;

if (!Loader::includeModule('humanresources'))
{
    throw new \RuntimeException('Модуль humanresources не установлен');
}

$nodeService = Container::getNodeService();

// Внутренний идентификатор узла структуры компании
$nodeId = 42;
$node = $nodeService->getById($nodeId);

if ($node === null)
{
    throw new \RuntimeException('Узел не найден');
}

echo $node->name;
```

Метод `Container::getNodeService()` возвращает сервис для чтения и поиска узлов. Метод `getById()` принимает внутренний идентификатор узла и возвращает объект `Node` или `null`, если узел не найден. После успешного запроса пример выводит название узла из свойства `name`.

{% note tip "" %}

О других способах поиска и правилах проверки результата читайте в статье [Узлы структуры компании](./nodes.md).

{% endnote %}

## Как выбрать API для задачи

Для типовых операций используйте API из пространства имен `Bitrix\HumanResources\Public`. Если готового метода сервиса недостаточно для выборки данных, соберите запрос с помощью билдеров и фильтров `Bitrix\HumanResources\Builder`. Подробнее читайте в статье [Выборки узлов и участников через билдеры](./data-builders.md).

{% note warning "" %}

Не обращайтесь к другим внутренним классам модуля: они не входят в документированный API и могут измениться.

{% endnote %}

## Как было раньше {#legacy-structure}

До модуля `humanresources` структура компании хранилась в инфоблоке «Подразделения». Идентификатор инфоблока задает опция `iblock_structure` модуля `intranet`. В прежней схеме:

-  подразделение — раздел инфоблока,

-  руководитель подразделения — поле раздела `UF_HEAD`,

-  подразделения сотрудника — множественное поле пользователя `UF_DEPARTMENT`,

-  чтение структуры — статические методы класса `CIntranetUtils` модуля `intranet`.

### Как старая и новая структура работают вместе {#legacy-sync}

Модуль `humanresources` синхронизирует обе схемы:

-  Создание, изменение и удаление подразделения через API модуля сразу меняет раздел инфоблока. Руководитель записывается в `UF_HEAD` раздела.

-  Поле `UF_DEPARTMENT` модуль обновляет в фоновом задании после изменения участников. Подробнее — в разделе [Назначить пользователя в подразделения](./users-and-hierarchy.md#assign-user-to-departments).

-  Изменения разделов инфоблока и поля `UF_DEPARTMENT`, сделанные старым API, модуль переносит в узлы и участников. Обратная синхронизация работает после перевода структуры портала на модуль `humanresources`.

Идентификатор узла не совпадает с идентификатором раздела инфоблока. Их связывает код доступа `D<ID раздела>`: для подразделения с разделом инфоблока свойство `Node->accessCode` содержит такой код. У узла без раздела инфоблока свойство содержит код нового формата `SN<ID узла>`.

**Пример.** Код находит узел по идентификатору раздела инфоблока и получает все его дочерние подразделения. Число `15` — условный идентификатор раздела.

```php
use Bitrix\HumanResources\Enum\DepthLevel;
use Bitrix\HumanResources\Public\Service\Container;
use Bitrix\HumanResources\Type\NodeEntityType;

$sectionId = 15;
$nodeService = Container::getNodeService();

// Код доступа подразделения из прежней схемы
$node = $nodeService->getByAccessCode('D' . $sectionId);

if ($node === null)
{
    throw new \RuntimeException('Подразделение не найдено');
}

$children = $nodeService->findChildrenByNodeIds(
    nodeIds: [$node->id],
    nodeTypes: [NodeEntityType::DEPARTMENT],
    depthLevel: DepthLevel::FULL,
);
```

### Таблица соответствий {#legacy-api-mapping}

Большинство методов `CIntranetUtils` помечены как устаревшие. Пометки ссылаются на внутренние классы `Bitrix\HumanResources\Contract\*`. Используйте вместо них публичные сервисы из таблицы. Сервис `NodeService` возвращает метод `Container::getNodeService()`, `NodeMemberService` — `Container::getNodeMemberService()`, `Department\UserService` — `Container::getUserDepartmentService()`.

#|
|| **Задача** | **Прежний способ** | **Новый способ** ||
|| Найти подразделение по идентификатору раздела | Идентификатор раздела инфоблока | `NodeService::getByAccessCode('D' . $sectionId)`, для нескольких разделов — `findAllByAccessCodes()`. См. [Получить узел по коду доступа](./nodes.md#get-node-by-access-code) ||
|| Получить данные подразделений | `CIntranetUtils::GetDepartmentsData()` | `NodeService::findAllByAccessCodes()` или `findAllByIds()` ||
|| Получить все дерево структуры | `CIntranetUtils::GetStructure()`, `GetDeparmentsTree()` | `NodeService::getRootNode()`, затем `findChildrenByNodeIds()` с `DepthLevel::FULL` ||
|| Получить дочерние подразделения | `CIntranetUtils::GetIBlockSectionChildren()`, `getSubDepartments()` | `NodeService::findChildrenByNodeIds()` ||
|| Получить подразделения пользователя | `CIntranetUtils::GetUserDepartments()`, поле `UF_DEPARTMENT` | `NodeService::findAllByMemberEntityId()` ||
|| Получить руководителей пользователя | `CIntranetUtils::GetUserDepartments()`, затем `GetDepartmentManager()` | `Department\UserService::getUserHeads()`, для нескольких пользователей — `getUsersManagers()`. См. [Получить руководителей и заместителей](./users-and-hierarchy.md) ||
|| Получить руководителя подразделения | Поле раздела `UF_HEAD`, `CIntranetUtils::GetDepartmentManagerID()`, `GetDepartmentManager()` | `NodeMemberService::findAllByRoleIdAndNodeId()` с ролью руководителя. См. [Выбрать стандартную роль](./node-members.md#select-standard-role) ||
|| Получить подразделения, которыми руководит пользователь | `CIntranetUtils::GetSubordinateDepartments()` | `Department\UserService::getDepartmentIdsWhereUserIsHead()` ||
|| Получить подчиненных | `CIntranetUtils::getSubordinateEmployees()` | `Department\UserService::getSubordinateUserIds()`. См. [Получить подчиненных](./users-and-hierarchy.md#get-subordinates) ||
|| Назначить пользователя в подразделения | Запись поля `UF_DEPARTMENT` через `CUser::Update()` | `Department\UserService::assignToDepartments()`. См. [Назначить пользователя в подразделения](./users-and-hierarchy.md#assign-user-to-departments) ||
|#

Новые методы принимают и возвращают идентификаторы узлов. Если сохраненные данные проекта ссылаются на разделы инфоблока, сначала получите узлы по кодам `D<ID раздела>`.

## Как реагировать на изменения структуры {#structure-events}

Модуль отправляет событие после каждого изменения узла, участника или связи узла с чатом или коллабой. Событие отправляется от имени модуля `humanresources`, параметры передаются в объекте [`Bitrix\Main\Event`](../../api-reference/main/event/index.md).

#|
|| **Событие** | **Когда отправляется** | **Параметры** ||
|| `OnNodeAdded` | Узел создан | `node` — объект `Bitrix\HumanResources\Item\Node` ||
|| `OnNodeUpdated` | Изменены поля узла | `node` — узел после изменения.

`fields` — массив только измененных полей, ключи: `name`, `type`, `parentId`, `xmlId`, `active`, `sort`, `description`, `colorName` ||
|| `OnNodeDeleted` | Узел удален | `node` — удаленный узел ||
|| `OnMemberAdded` | Участник добавлен в узел | `member` — объект `Bitrix\HumanResources\Item\NodeMember` ||
|| `OnMemberUpdated` | Изменены роль, узел или активность участника | `member` — участник после изменения.

`previousMember` — участник до изменения.

`fields` — список измененных свойств: `role`, `nodeId` или `active` ||
|| `OnMemberDeleted` | Участник удален из узла | `member` — удаленный участник ||
|| `OnRelationAdded` | Узел связан с чатом или коллабой | `relation` — объект `Bitrix\HumanResources\Item\NodeRelation` ||
|| `OnRelationDeleted` | Связь узла удалена | `relation` — удаленная связь ||
|| `OnRelationPartDeleted` | При удалении узла удалена часть связи, полученной им от родительского узла | `relation` — связь, в свойстве `node` — удаленный узел ||
|| `OnAiReportsEnabled` | Для узла включена настройка `AiReports` | `nodeId` — идентификатор узла.

`userId` — идентификатор текущего пользователя ||
|#

Учитывайте особенности отправки:

-  Событие отправляется после записи в базу данных. Обработчик не может отменить операцию или изменить сохраняемые данные.

-  Исключение в обработчике останавливает вызов следующих обработчиков этого события. Для большинства событий модуль перехватывает исключение и записывает его в журнал через `AddMessage2Log()`. Событие `OnMemberUpdated` о смене роли или узла модуль отправляет из очереди после сохранения, и там исключение не перехватывается. Не выбрасывайте исключения из обработчиков.

-  При удалении узла и при пакетном добавлении или удалении участников события отправляются внутри транзакции. Если транзакция будет отменена, изменение не сохранится, хотя обработчик уже выполнился.

-  Изменение `GLOBAL_ACTIVE` у дочерних узлов после изменения активности родителя событий не вызывает. Событие `OnNodeUpdated` придет только для узла, который изменили.

-  Создание узла может вызвать и `OnNodeAdded`, и `OnNodeUpdated`: после создания модуль размещает узел в дереве отдельным изменением.

**Пример.** Обработчик реагирует на перевод пользователя в другой узел. Регистрацию поместите в `/local/php_interface/init.php` или в установщик собственного модуля.

```php
use Bitrix\HumanResources\Item\NodeMember;
use Bitrix\HumanResources\Type\MemberEntityType;
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;

EventManager::getInstance()->addEventHandler(
    'humanresources',
    'OnMemberUpdated',
    static function (Event $event): void
    {
        $member = $event->getParameter('member');
        $previousMember = $event->getParameter('previousMember');

        // Обрабатываем только пользователей
        if (
            !$member instanceof NodeMember
            || !$previousMember instanceof NodeMember
            || $member->entityType !== MemberEntityType::USER
        )
        {
            return;
        }

        // Узел не изменился — перевода не было
        if ($member->nodeId === $previousMember->nodeId)
        {
            return;
        }

        $userId = $member->entityId;
        $oldNodeId = $previousMember->nodeId;
        $newNodeId = $member->nodeId;

        // Здесь обновите данные, которые зависят от подразделения пользователя
    }
);
```

Обработчик выполняется в том же запросе, что и изменение структуры. Долгую обработку, например пересчет связанных данных, переносите в агент или фоновое задание.

### Доступ через REST {#rest-access}

Внешние приложения работают со структурой компании через методы REST 3.0 `humanresources.*`: узлы, участники, коммуникации и сотрудники. Прежние методы `department.*` работают только с подразделениями и их руководителями. Удалить подразделение можно только методом `department.delete`, в REST 3.0 аналога нет. Описание методов и таблица соответствий приведены в разделе [Структура компании](https://apidocs.bitrix24.ru/api-reference/departments/index.html) справочника REST API.

Событий REST об изменении структуры компании нет. Чтобы реагировать на изменения, используйте PHP-обработчики событий модуля из раздела выше.

## Основные сценарии

Используйте материалы раздела в зависимости от задачи:

-  [Архитектура модуля и выбор сервиса](./architecture.md) — связи объектов, выбор сервиса и форматы результатов.

-  [Узлы структуры компании](./nodes.md) — получение, поиск и обход подразделений и команд.

-  [Участники и роли в структуре компании](./node-members.md) — связи пользователей с узлами и выборки по ролям.

-  [Выборки узлов и участников через билдеры](./data-builders.md) — составные фильтры, обход иерархии, пагинация и сортировка через билдеры.

-  [Пользователи и управленческая иерархия](./users-and-hierarchy.md) — руководители, подчиненные и назначение пользователей в подразделения.

-  [Настройки узлов и пользователей](./settings.md) — доступные параметры подразделений, команд и пользователей.

-  [Производительность и частые ошибки](./performance.md) — ограничения выборок и диагностика пустых или неожиданных результатов.

Если сервис еще не выбран, начните с архитектуры. Если известны объект, исходные данные и ожидаемый результат, переходите к статье с соответствующим сценарием.
