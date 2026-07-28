---
title: Стандартные провайдеры в ui.entity-selector
description: "Стандартные провайдеры в ui.entity-selector: параметры провайдеров user, department, project, meta-user, im-chat, im-bot и im-recent."
---

Bitrix Framework регистрирует стандартные провайдеры данных для пользователей, отделов, проектов, чатов и чат-ботов. Чтобы использовать такой тип объекта в `Dialog` или `TagSelector`, подключите модуль, который его регистрирует.

В JavaScript передавайте идентификатор стандартного провайдера в поле `entities[].id`. Например, для провайдера `user` используйте `entities: [{ id: 'user' }]`.

Параметры провайдера передавайте в [`EntityOptions.options`](./dialog.md#entityoptions). Связь настроек `dynamicLoad`, `dynamicSearch`, `preselectedItems` и методов PHP-провайдера описана в статье [Провайдеры данных](./data-providers.md#js-php).

Если нужного типа объекта нет среди стандартных, зарегистрируйте [собственный провайдер данных](./data-providers.md).

## user

Провайдер `Bitrix\Socialnetwork\Integration\UI\EntitySelector\UserProvider` ищет и возвращает пользователей текущей установки. Модуль: `socialnetwork`. `entityId`: `user`.

Провайдер автоматически заполняет вкладку «Последние» первыми пользователями текущей установки и историей выбора текущего контекста. Если установлен модуль `intranet`, провайдер может добавить в футер диалога ссылку приглашения сотрудника или внешнего пользователя.

```js
const dialog = new Dialog({
    targetNode: button,
    enableSearch: true,
    context: 'MY_MODULE_RESPONSIBLE',
    entities: [
        {
            id: 'user',
            options: {
                intranetUsersOnly: true,
                inviteEmployeeLink: false,
            },
        },
    ],
});
```

**Отбор пользователей**

| Параметр | Тип | Что делает |
| --- | --- | --- |
| `userId` | `int` или `int[]` | Ограничивает выбор списком разрешенных идентификаторов пользователей |
| `!userId` | `int` или `int[]` | Исключает пользователей по списку идентификаторов |
| `activeUsers` | `boolean` | Отбирает только активных (`true`) или только уволенных (`false`) пользователей. Если не задано, отбираются активные пользователи |
| `intranetUsersOnly` | `boolean` | Показывает только сотрудников компании |
| `extranetUsersOnly` | `boolean` | Показывает только внешних пользователей |
| `onlyWithEmail` | `boolean` | Показывает только пользователей с заполненным email |
| `emailUsers` | `boolean` | Включает в выборку почтовых пользователей. По умолчанию `false` |
| `emailUsersOnly` | `boolean` | Показывает только почтовых пользователей |
| `myEmailUsers` | `boolean` | Ограничивает почтовых пользователей теми, кого пригласил текущий пользователь. По умолчанию `true` |
| `networkUsers` | `boolean` | Включает в выборку пользователей из Битрикс24.Network. По умолчанию `false` |
| `networkUsersOnly` | `boolean` | Показывает только пользователей из Битрикс24.Network |
| `collabers` | `boolean` | Включает в выборку коллаберов. По умолчанию `true` |

**Оформление и футер**

| Параметр | Тип | Что делает |
| --- | --- | --- |
| `nameTemplate` | `string` | Шаблон формата имени пользователя в заголовке элемента. По умолчанию берется формат имени сайта |
| `selectFields` | `string[]` | Дополнительные поля профиля пользователя, которые провайдер добавит в `customData` элемента, например `workPosition`, `email`, `phone` |
| `showInvitationFooter` | `boolean` | Показывает в футере диалога ссылку приглашения. По умолчанию `true` |
| `inviteEmployeeLink` | `boolean` | Показывает ссылку приглашения сотрудника. По умолчанию `true` |
| `inviteExtranetLink` | `boolean` | Показывает ссылку приглашения внешнего пользователя. По умолчанию `false` |
| `inviteGuestLink` | `boolean` | Показывает ссылку приглашения гостя. По умолчанию `false` |
| `footerInviteIntranetOnly` | `boolean` | Ограничивает приглашение только сотрудниками компании. По умолчанию совпадает с состоянием функциональности совместной работы (collab) в текущей установке |
| `lockGuestLink` | `boolean` | Блокирует ссылку приглашения гостя. По умолчанию `false` |
| `lockGuestLinkFeatureId` | `string` | Идентификатор тарифного ограничения, из-за которого заблокирована ссылка приглашения гостя |

**Загрузка**

| Параметр | Тип | Что делает |
| --- | --- | --- |
| `fillDialog` | `boolean` | Разрешает автоматически заполнять диалог пользователями и вкладку «Последние». По умолчанию `true` |
| `maxUsersInRecentTab` | `number` | Максимум пользователей во вкладке «Последние». По умолчанию `50`, сервер не отдаст больше `50` |
| `searchLimit` | `number` | Максимум пользователей в результатах поиска. По умолчанию `100`, сервер не отдаст больше `100` |

## department

Провайдер `Bitrix\Intranet\Integration\UI\EntitySelector\DepartmentProvider` строит дерево структуры компании. Модули: `intranet`, `socialnetwork`, `iblock`. `entityId`: `department`.

Провайдер автоматически добавляет вкладку «Отделы» с деревом подразделений. Режим `selectMode` определяет, что можно выбрать: сотрудников, отделы целиком или оба варианта.

```js
const dialog = new Dialog({
    targetNode: button,
    enableSearch: true,
    context: 'MY_MODULE_RESPONSIBLE',
    entities: [
        {
            id: 'department',
            options: {
                selectMode: 'usersAndDepartments',
                allowFlatDepartments: true,
            },
        },
    ],
});
```

| Параметр | Тип | Что делает |
| --- | --- | --- |
| `selectMode` | `'usersOnly'`, `'departmentsOnly'` или `'usersAndDepartments'` | Что можно выбрать в диалоге. По умолчанию `usersOnly` |
| `allowFlatDepartments` | `boolean` | Добавляет для режима `usersAndDepartments` вариант «сотрудники отдела без вложенных подразделений». По умолчанию `false` |
| `allowOnlyUserDepartments` | `boolean` | Ограничивает дерево отделами текущего пользователя. По умолчанию `false` |
| `allowSelectRootDepartment` | `boolean` | Разрешает выбрать корневой отдел (компанию целиком). По умолчанию `true` для режима `departmentsOnly`, иначе `false` |
| `hideChatBotDepartment` | `boolean` | Скрывает служебный отдел чат-бота. По умолчанию `true` |
| `fillDepartmentsTab` | `boolean` | Разрешает автоматически заполнять вкладку «Отделы» при открытии диалога. По умолчанию `true` |
| `fillRecentTab` | `boolean` | Разрешает автоматически заполнять вкладку «Последние» отделами. Работает только вместе с `selectMode: 'departmentsOnly'`. По умолчанию `false` |
| `depthLevel` | `number` | Глубина дерева, которую провайдер загружает во вкладку «Последние». Учитывается, только если включен `fillRecentTab`. По умолчанию `1` |
| `shouldCountSubdepartments` | `boolean` | Добавляет в `customData` элемента количество вложенных подразделений. Работает для режимов `departmentsOnly` и `usersAndDepartments`. По умолчанию `false` |
| `shouldCountUsers` | `boolean` | Добавляет в `customData` элемента количество сотрудников отдела. Работает для режимов `usersOnly` и `usersAndDepartments`. По умолчанию `false` |
| `userOptions` | `Object` | Параметры для внутреннего `UserProvider`, который отдел использует для списка сотрудников. Принимает те же параметры, что и провайдер `user` |

## project

Провайдер `Bitrix\Socialnetwork\Integration\UI\EntitySelector\ProjectProvider` возвращает группы и проекты, в которых участвует текущий пользователь. Модуль: `socialnetwork`. `entityId`: `project`.

Провайдер автоматически добавляет вкладку «Группы» и, если пользователь может создать проект, футер со ссылкой создания.

```js
const dialog = new Dialog({
    targetNode: button,
    enableSearch: true,
    context: 'MY_MODULE_RESPONSIBLE',
    entities: [
        {
            id: 'project',
            options: {
                extranet: false,
                type: ['group'],
            },
        },
    ],
});
```

**Отбор проектов**

| Параметр | Тип | Что делает |
| --- | --- | --- |
| `projectId` | `int` или `int[]` | Ограничивает выбор списком разрешенных идентификаторов проектов |
| `!projectId` | `int` или `int[]` | Исключает проекты по списку идентификаторов |
| `type` | `string[]` | Ограничивает выбор типами проектов. В примерах используется `group` |
| `!type` | `string[]` | Исключает типы проектов из выбора. Используйте те же значения, что и в `type` |
| `project` | `boolean` | Показывает только группы, отмеченные как проект |
| `extranet` | `boolean` | Показывает только внешние (`true`) или только внутренние (`false`) проекты |
| `landing` | `boolean` | Показывает только проекты, отмеченные для публикации на витрине |
| `features` | `Object` | Ограничивает выбор проектами, где у пользователя есть указанные права на функциональность, например `{ tasks: ['view'] }` |
| `checkCollabInviteOption` | `boolean` | Учитывает настройку «кто может приглашать» при выборе для совместной работы (collab). По умолчанию `false` |

Полный набор значений `type` зависит от типов проектов, доступных в модуле `socialnetwork`. Если значение не подтверждено для текущей установки, не передавайте этот параметр.

**Загрузка и футер**

| Параметр | Тип | Что делает |
| --- | --- | --- |
| `fillRecentTab` | `boolean` | Разрешает автоматически заполнять вкладку «Последние» проектами. Если не задано, включается автоматически, если `project` — единственный тип объекта в диалоге |
| `maxProjectsInRecentTab` | `number` | Максимум проектов во вкладке «Последние». По умолчанию `30`, сервер не отдаст больше `30` |
| `searchLimit` | `number` | Максимум проектов в результатах поиска. По умолчанию `100`, сервер не отдаст больше `100` |
| `createProjectLink` | `boolean` | Показывает в футере ссылку создания проекта. Если не задано, показывается автоматически, если `project` — единственный тип объекта в диалоге |
| `checkFeatureForCreate` | `boolean` | Скрывает ссылку создания проекта, если в текущей установке отключена функциональность групп. По умолчанию `false` |
| `lockProjectLink` | `boolean` | Блокирует ссылку создания проекта. По умолчанию `false` |
| `lockProjectLinkFeatureId` | `string` | Идентификатор тарифного ограничения, из-за которого заблокирована ссылка создания проекта |
| `shouldSelectProjectDates` | `boolean` | Добавляет в `customData` элемента даты начала и окончания проекта. По умолчанию `false` |
| `shouldSelectDialogId` | `boolean` | Добавляет в `customData` элемента идентификатор диалога чата проекта. По умолчанию `false` |

Для выбора кодов доступа проектов используйте провайдер `Bitrix\Socialnetwork\Integration\UI\EntitySelector\ProjectAccessCodesProvider`. `entityId` провайдера — `project-access-codes`.

```js
const dialog = new Dialog({
    targetNode: button,
    context: 'MY_MODULE_PROJECT_ACCESS',
    entities: [
        {
            id: 'project-access-codes',
            dynamicLoad: true,
            dynamicSearch: true,
        },
    ],
});
```

## meta-user

Провайдер `Bitrix\Socialnetwork\Integration\UI\EntitySelector\MetaUserProvider` добавляет в диалог составные элементы, которые обозначают группу пользователей, а не одного человека. Модуль: `socialnetwork`. `entityId`: `meta-user`.

Провайдер возвращает элементы `all-users` («Все сотрудники» или «Все пользователи») и `other-users` («Остальные сотрудники» или «Остальные пользователи»). Сценарий, который использует диалог, сам разворачивает эти значения в список конкретных пользователей.

```js
const dialog = new Dialog({
    targetNode: button,
    context: 'MY_MODULE_RESPONSIBLE',
    entities: [
        { id: 'user' },
        {
            id: 'meta-user',
            options: {
                'all-users': { title: 'Все сотрудники компании' },
            },
        },
    ],
});
```

Параметры `all-users` и `other-users` принимают одинаковый набор вложенных полей:

| Параметр | Тип | Что делает |
| --- | --- | --- |
| `allowView` | `boolean` | Определяет, показывать ли элемент в диалоге. По умолчанию виден всем пользователям, если модуль `intranet` не установлен, иначе — только сотрудникам компании |
| `title` | `string` | Текст заголовка элемента. По умолчанию — локализованное «Все сотрудники»/«Все пользователи» или «Остальные сотрудники»/«Остальные пользователи» |
| `deselectable` | `boolean` | Разрешает снять выбор с элемента. По умолчанию `true` |
| `searchable` | `boolean` | Включает элемент в клиентский поиск. По умолчанию `false` |
| `availableInRecentTab` | `boolean` | Показывает элемент во вкладке «Последние». По умолчанию `true` |
| `sort` | `number` | Порядок элемента среди недавних. По умолчанию — порядковый номер элемента в списке (`all-users` получает `1`, следующий за ним — `2` и так далее) |

## im-chat

Провайдер `Bitrix\Im\Integration\UI\EntitySelector\ChatProvider` ищет и возвращает чаты текущего пользователя. Модуль: `im`. `entityId`: `im-chat`.

Провайдер автоматически заполняет вкладку «Последние» недавними чатами. При открытии выше показываются новые чаты, а при поиске — чаты с более поздними сообщениями.

Каждый элемент содержит в `customData` ключ `imChat` с данными чата. Используйте этот ключ в обработчике выбора, если сценарию нужен идентификатор или параметры чата из модуля `im`.

```js
const dialog = new Dialog({
    targetNode: button,
    enableSearch: true,
    context: 'MY_MODULE_RESPONSIBLE',
    entities: [
        {
            id: 'im-chat',
            options: {
                searchableChatTypes: ['C', 'L', 'O'],
            },
        },
    ],
});
```

| Параметр | Тип | Что делает |
| --- | --- | --- |
| `searchableChatTypes` | `string[]` | Ограничивает поиск и автозаполнение типами чатов: `C` — групповые чаты, `L` — открытые линии, `O` — открытые каналы. Передавайте только те типы, которые нужны сценарию |
| `fillDialog` | `boolean` | Разрешает автоматически заполнять диалог чатами. По умолчанию `true` |
| `fillDialogWithDefaultValues` | `boolean` | Разрешает подгружать чаты для заполнения вкладки «Последние», а не только уже сохраненные записи истории. По умолчанию `true` |

Для интранет-пользователей поиск ищет среди групповых чатов и открытых линий, где участвует пользователь, и среди всех открытых каналов. Для экстранет-пользователей поиск ограничен групповыми чатами.

{% note warning "" %}

У `searchableChatTypes` нет значения по умолчанию. Без этого параметра провайдер не найдет новых чатов ни в поиске, ни при автозаполнении вкладки «Последние» — передавайте параметр явно.

{% endnote %}

## im-bot

Провайдер `Bitrix\Im\Integration\UI\EntitySelector\BotProvider` ищет и возвращает чат-ботов текущей установки. Модуль: `im`. `entityId`: `im-bot`. Провайдер недоступен для внешних (экстранет) пользователей.

Провайдер автоматически заполняет вкладку «Последние» ботами. В поиске и среди уже сохраненных недавних ботов выше показываются те, кому пользователь отправил больше сообщений. Остальные боты во вкладке добираются в порядке новизны регистрации.

Каждый элемент содержит в `customData` ключи `imBot`, `imUser` и `imChat` с данными бота. `imBot` относится к боту, `imUser` — к связанному пользователю, `imChat` — к чату бота.

```js
const dialog = new Dialog({
    targetNode: button,
    enableSearch: true,
    context: 'MY_MODULE_RESPONSIBLE',
    entities: [
        {
            id: 'im-bot',
            options: {
                searchableBotTypes: ['H', 'B', 'S'],
            },
        },
    ],
});
```

| Параметр | Тип | Что делает |
| --- | --- | --- |
| `searchableBotTypes` | `string[]` | Ограничивает поиск типами ботов: `H` — бот с задержкой ответа, `B` — бот с мгновенным ответом, `S` — привилегированный бот. Передавайте только те типы, которые нужны сценарию |
| `fillDialog` | `boolean` | Разрешает автоматически заполнять диалог ботами. По умолчанию `true` |
| `fillDialogWithDefaultValues` | `boolean` | Разрешает подгружать ботов для заполнения вкладки «Последние», а не только уже сохраненные записи истории. По умолчанию `true` |

## im-recent

Провайдер `Bitrix\Im\Integration\UI\EntitySelector\RecentChatProvider` заполняет вкладку «Последние» элементами из списка последних чатов пользователя. Модуль: `im`. `entityId`: `im-recent`.

Провайдер использует динамическую загрузку и не выполняет поиск. Для поиска подключайте вместе с ним провайдеры `user`, `im-chat` и `im-bot` с отключенным автозаполнением диалога.

```js
const dialog = new Dialog({
    targetNode: button,
    enableSearch: true,
    entities: [
        {
            id: 'im-bot',
            options: {
                searchableBotTypes: ['H', 'B', 'S'],
                fillDialog: false,
            },
        },
        {
            id: 'im-chat',
            options: {
                searchableChatTypes: ['C', 'L', 'O'],
                fillDialog: false,
            },
        },
        {
            id: 'user',
            options: {
                fillDialog: false,
            },
            filters: [
                {
                    id: 'im.userDataFilter',
                },
            ],
        },
        {
            id: 'im-recent',
            dynamicLoad: true,
            options: {
                limit: 100,
            },
        },
    ],
});
```

| Параметр | Тип | Что делает |
| --- | --- | --- |
| `limit` | `int` | Ограничивает количество элементов из списка последних чатов. По умолчанию `50` |

Элементы, которые добавляет `im-recent`, получают `entityId` не от самого провайдера, а по типу элемента списка: `user`, `im-chat` или `im-bot`. Для чатов провайдер добавляет в `customData` ключ `imChat`, для пользователей — `imUser`, для чат-ботов — `imUser` и `imBot`.

Провайдер создает элементы с `saveable: false`, поэтому сам элемент из списка последних чатов не сохраняется повторно в недавние элементы `ui.entity-selector`.

## im.userDataFilter

Фильтр `Bitrix\Im\Integration\UI\EntitySelector\UserDataFilter` дополняет элементы провайдера `user` данными модуля `im`. Фильтр используется в `entities[].filters` с идентификатором `im.userDataFilter`.

```js
const dialog = new Dialog({
    targetNode: button,
    enableSearch: true,
    entities: [
        {
            id: 'user',
            dynamicLoad: true,
            filters: [
                {
                    id: 'im.userDataFilter',
                },
            ],
        },
    ],
});
```

Фильтр доступен авторизованным пользователям. При обработке элементов он добавляет в `customData` ключ `imUser` с данными пользователя из модуля `im`. Если элемент относится к текущему пользователю, фильтр добавляет бейдж «Это вы».

## Использовать стандартный тип объекта

Идентификатор встроенного провайдера (`entityId`) передайте в поле `entities[].id`. Собственный провайдер регистрировать не нужно: сервер найдет встроенный провайдер по идентификатору типа объекта.

```js
import { Dialog } from 'ui.entity-selector';

const dialog = new Dialog({
    targetNode: button,
    enableSearch: true,
    context: 'MY_MODULE_RESPONSIBLE',
    entities: [
        {
            id: 'user',
            dynamicLoad: true,
            dynamicSearch: true,
        },
    ],
});
```

Модуль, который регистрирует нужный провайдер (`socialnetwork`, `intranet` или `im`), должен быть установлен в текущей установке. Без установленного модуля метод `isAvailable()` провайдера вернет `false`, и диалог не покажет элементы этого типа объекта.

Для стандартных провайдеров флаги `dynamicLoad` и `dynamicSearch` можно передавать в конкретном диалоге явно. Явная передача флагов фиксирует сценарий в коде и не зависит от глобальных настроек типа объекта.

Если элементы стандартного типа не отображаются, проверьте:

- в `entities[].id` передан правильный `entityId`: `user`, `department`, `project`, `meta-user`, `im-chat`, `im-bot` или `im-recent`;
- установлен модуль, который регистрирует провайдер;
- текущему пользователю доступны элементы этого типа;
- фильтры в `options` не исключают все элементы;
- для чатов явно передан `searchableChatTypes`, если нужно находить новые чаты в поиске или при автозаполнении.
