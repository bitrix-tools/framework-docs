---
title: Связи между элементами
description: "Чтение, добавление, замена и удаление связей элементов CRM через локальный PHP API: клиент сделки, основной и дополнительные контакты, компании контакта и родительские элементы смарт-процессов."
---

Связь соединяет два элемента CRM разных типов. Сделка хранит свою компанию и контакты, контакт — свои компании, элемент смарт-процесса — родительскую сделку или другой элемент. Связь читают через поля элемента и объект `RelationManager`, а меняют через операцию изменения того элемента, который хранит привязку.

Сценарии используют PHP API фабрик и операций. Общую модель фабрики, элемента и операции объясняет статья [Схема работы CRM и основные объекты API](./architecture.md).

Примеры используют ID пользователя `$userId`, от имени которого код читает и меняет данные. Числовые ID элементов вроде `123` и `456` замените значениями своей установки. Пролог и модуль `crm` подключены до запуска примеров, как в статье [Работа с элементами CRM](./items.md#get-items).

## Определить вид связи {#relation-types}

Каждая связь описывает пару «родитель — потомок». Родитель — элемент, к которому привязывают, например компания или сделка. Потомок — элемент, который хранит привязку в своих полях. Поэтому для изменения связи нужна фабрика потомка и операция изменения потомка.

#|
|| **Связь** | **Поля потомка** | **Как изменить** ||
|| Контакты сделки, лида, предложения, счета, смарт-процесса | `CONTACT_ID`, `CONTACT_IDS`, `CONTACT_BINDINGS` | Методы `bindContacts()` и `unbindContacts()` объекта `Item` ||
|| Компания сделки, лида, предложения, счета, смарт-процесса | `COMPANY_ID` | Новое значение поля через `set()` ||
|| Компании контакта | `COMPANY_ID`, `COMPANY_IDS`, `COMPANY_BINDINGS` | Полный набор привязок в `COMPANY_BINDINGS` или `COMPANY_IDS` ||
|| Контакты компании | `CONTACT_IDS`, `CONTACT_BINDINGS` | Со стороны контакта через его поле `COMPANY_BINDINGS` ||
|| Сделка коммерческого предложения | `DEAL_ID` | ID сделки в поле предложения через `set()` ||
|| Родитель в пользовательской связи типов | `PARENT_ID_<entityTypeId родителя>`, например `PARENT_ID_2`, где `2` — `CCrmOwnerType::Deal` | ID родителя в поле потомка через `set()` ||
|| Реквизит клиента и своей компании | Отдельная привязка `EntityLink` | Методы `EntityLink::checkConsistence()` и `EntityLink::register()` ||
|#

Счет — тип `CCrmOwnerType::SmartInvoice`, который работает через фабрику, как смарт-процесс.

Клиентские связи с контактами и компаниями CRM создает сама. Для смарт-процесса и счета они доступны, если метод фабрики `isClientEnabled()` возвращает `true`. Пользовательскую связь типов, например «сделка — смарт-процесс», нужно заранее создать. Порядок описан в статье [Смарт-процессы](./smart-processes.md#bind-types). Потомком в такой связи чаще всего бывает смарт-процесс или счет.

Поля `LEAD_ID` и `QUOTE_ID` сделки хранят исходный лид и коммерческое предложение. Их заполняет [конвертация](./items.md#convert-lead), поэтому для привязки клиента их не используйте. Поле `MYCOMPANY_ID` хранит собственную компанию, от имени которой ведется продажа. Собственная компания не относится к клиенту, ее меняют обычной записью поля через `set()`.

Объект `Bitrix\Crm\Relation\RelationManager` описывает связи типов и элементов. Метод `Container::getInstance()->getRelationManager()` возвращает этот объект. Если код заранее не знает, с какими типами связан тип, используйте два метода объекта.

-  `getParentRelations($entityTypeId)` — связи, где тип указан как потомок,

-  `getChildRelations($entityTypeId)` — связи, где тип указан как родитель.

Оба метода возвращают коллекцию объектов `Bitrix\Crm\Relation`. Методы `getParentEntityTypeId()` и `getChildEntityTypeId()` объекта `Relation` возвращают типы связи, а `isPredefined()` — `true` для связи, которую задает сама CRM.

### Подготовить идентификаторы элементов

Числовой ID элемента уникален только внутри типа, поэтому элемент связи задают парой «тип — ID». Объект `Bitrix\Crm\ItemIdentifier` хранит эту пару для конкретного элемента. Объект `Bitrix\Crm\RelationIdentifier` хранит пару типов «родитель — потомок» и описывает связь между типами без конкретных элементов.

Конструктор `ItemIdentifier` выбрасывает исключение при неверном типе или ID меньше единицы. Если тип и ID пришли из запроса, приведите их к целому числу и создайте идентификатор методом `ItemIdentifier::createByParams($entityTypeId, $entityId)`. Метод возвращает `null` вместо исключения. Для загруженного элемента используйте `ItemIdentifier::createByItem($item)`.

**Пример.** Подготовьте идентификаторы сделки и элемента смарт-процесса. Переменная `$entityTypeId` содержит `entityTypeId` смарт-процесса, а `$itemId` — ID его элемента из проверенного запроса.

```php
$dealIdentifier = \Bitrix\Crm\ItemIdentifier::createByParams(\CCrmOwnerType::Deal, 123);
$itemIdentifier = \Bitrix\Crm\ItemIdentifier::createByParams((int)$entityTypeId, (int)$itemId);
if ($dealIdentifier === null || $itemIdentifier === null)
{
    throw new \RuntimeException('Неверный тип или ID элемента');
}
```

Объекты `$dealIdentifier` и `$itemIdentifier` не подтверждают, что элементы существуют. Метод `createByParams()` проверяет только формат значений. Существование и доступ проверяет выборка с учетом прав.

## Найти связанные элементы

Связанные элементы находят тремя способами. Поля элемента хранят его клиента и родителя. Фильтр фабрики находит потомков конкретного клиента или родителя. Объект `RelationManager` собирает связанные элементы всех типов.

### Прочитать клиента элемента {#get-item-client}

Метод `getItemsFilteredByPermissions()` загружает элемент со всеми полями, если параметр `select` не задан. Такой элемент содержит компанию, привязки контактов и родительские поля. Методы элемента возвращают значения этих полей.

-  `getCompanyId()` — ID компании, а если компания не выбрана — `0` или `null`,

-  `getContactIds()` — массив ID всех контактов,

-  `getContactBindings()` — массив привязок контактов с ключами `CONTACT_ID`, `SORT`, `ROLE_ID` и признаком `IS_PRIMARY`,

-  `get(ParentFieldManager::getParentFieldName($parentEntityTypeId))` — ID родителя указанного типа или `null`.

Основным считается контакт с `IS_PRIMARY`, равным `Y`. Метод `EntityBinding::getPrimaryEntityID()` возвращает ID такого контакта. Если признак не задан, метод возвращает ID первой привязки, а для пустого набора — `0`.

**Пример.** Получите компанию, основной и все контакты сделки с ID `123`, доступной пользователю `$userId`. Затем получите подписи только тех контактов, которые пользователь может читать.

```php
$container = \Bitrix\Crm\Service\Container::getInstance();
$dealFactory = $container->getFactory(\CCrmOwnerType::Deal);
$contactFactory = $container->getFactory(\CCrmOwnerType::Contact);
if ($dealFactory === null || $contactFactory === null)
{
    throw new \RuntimeException('Фабрики CRM недоступны');
}

$deals = $dealFactory->getItemsFilteredByPermissions([
    'filter' => ['=ID' => 123],
], $userId);
$deal = $deals[0] ?? null;
if ($deal === null)
{
    throw new \RuntimeException('Сделка не найдена или недоступна');
}

$companyId = (int)$deal->getCompanyId();
$contactIds = $deal->getContactIds();
$primaryContactId = \Bitrix\Crm\Binding\EntityBinding::getPrimaryEntityID(
    \CCrmOwnerType::Contact,
    $deal->getContactBindings()
);

$contactTitles = [];
if ($contactIds !== [])
{
    $contacts = $contactFactory->getItemsFilteredByPermissions([
        'filter' => ['@ID' => $contactIds],
    ], $userId);
    foreach ($contacts as $contact)
    {
        $contactTitles[$contact->getId()] = $contact->getHeading();
    }
}
```

После выполнения примера переменные содержат данные клиента сделки.

-  `$companyId` — ID компании или `0`, если компания не выбрана,

-  `$contactIds` — ID всех контактов сделки,

-  `$primaryContactId` — ID основного контакта или `0`, если контактов нет,

-  `$contactTitles` — подписи доступных пользователю контактов по их ID.

Недоступные пользователю контакты не попадут в `$contactTitles`, хотя их ID есть в `$contactIds`. Подпись элемента возвращает метод `getHeading()`.

Право читать сделку не дает права читать ее клиента. Перед выводом данных контакта или компании отберите их отдельной выборкой с учетом прав.

### Найти элементы по клиенту или родителю

Чтобы получить сделки контакта или элементы смарт-процесса одной сделки, выберите элементы потомка с фильтром по полю связи.

-  `=COMPANY_ID` — элементы с указанной компанией,

-  `=CONTACT_BINDINGS.CONTACT_ID` — элементы, к которым привязан указанный контакт, в том числе как дополнительный,

-  `=PARENT_ID_<entityTypeId родителя>` — элементы смарт-процесса с указанным родителем.

Фильтр `CONTACT_ID` находит только элементы, где контакт основной. Для поиска по всем контактам используйте `CONTACT_BINDINGS.CONTACT_ID`.

**Пример.** Получите первые 50 сделок, в которых участвует контакт с ID `456`, и элементы смарт-процесса `$entityTypeId`, привязанные к сделке с ID `123`. Обе выборки учитывают права пользователя `$userId`. Переменная `$dealFactory` содержит фабрику сделок из предыдущего примера.

```php
$contactDeals = $dealFactory->getItemsFilteredByPermissions([
    'select' => [\Bitrix\Crm\Item::FIELD_NAME_ID, \Bitrix\Crm\Item::FIELD_NAME_TITLE],
    'filter' => ['=CONTACT_BINDINGS.CONTACT_ID' => 456],
    'order' => [\Bitrix\Crm\Item::FIELD_NAME_ID => 'ASC'],
    'limit' => 50,
], $userId);

$itemFactory = \Bitrix\Crm\Service\Container::getInstance()->getFactory($entityTypeId);
if ($itemFactory === null)
{
    throw new \RuntimeException('Смарт-процесс не найден');
}

$parentField = \Bitrix\Crm\Service\ParentFieldManager::getParentFieldName(\CCrmOwnerType::Deal);
$dealChildren = $itemFactory->getItemsFilteredByPermissions([
    'select' => [\Bitrix\Crm\Item::FIELD_NAME_ID, \Bitrix\Crm\Item::FIELD_NAME_TITLE],
    'filter' => ['=' . $parentField => 123],
    'order' => [\Bitrix\Crm\Item::FIELD_NAME_ID => 'ASC'],
], $userId);
```

Массив `$contactDeals` содержит доступные пользователю сделки контакта. Массив `$dealChildren` содержит доступные пользователю элементы смарт-процесса сделки. Поле `PARENT_ID_2` появляется у смарт-процесса только после связи его типа со сделками. Перед выборкой проверьте связь типов методом [`areTypesBound()`](#bind-smart-process-parent).

Для большого числа связанных элементов читайте их порциями по ID, как описано в статье [Работа с элементами CRM](./items.md#process-items-in-batches).

### Получить связанные элементы всех типов

Если набор типов заранее неизвестен, используйте [объект `RelationManager`](#relation-types). Его методы принимают `ItemIdentifier` и возвращают массив объектов `ItemIdentifier`.

-  `getParentElements($child)` — родители элемента по всем связям, где его тип указан как потомок,

-  `getChildElements($parent)` — потомки элемента по всем связям, где его тип указан как родитель,

-  `getElements($identifier)` — родители и потомки без повторов.

Методы не учитывают права пользователя и не загружают данные элементов. Они возвращают только тип и ID, которые дают методы `getEntityTypeId()` и `getEntityId()` объекта `ItemIdentifier`. Для сделки потомками будут, например, коммерческие предложения, заказы и элементы связанных смарт-процессов. Для контакта сделки и лиды — потомки, а компании и лид, из которого создан контакт, — родители.

**Пример.** Соберите потомков сделки с ID `123` и отберите из них элементы, доступные пользователю `$userId`. Массив `$children` содержит найденные элементы по типам.

```php
$container = \Bitrix\Crm\Service\Container::getInstance();
$identifiers = $container->getRelationManager()->getChildElements(
    new \Bitrix\Crm\ItemIdentifier(\CCrmOwnerType::Deal, 123)
);

$idsByType = [];
foreach ($identifiers as $identifier)
{
    $idsByType[$identifier->getEntityTypeId()][] = $identifier->getEntityId();
}

$children = [];
foreach ($idsByType as $childTypeId => $ids)
{
    $factory = $container->getFactory((int)$childTypeId);
    if ($factory === null || (int)$childTypeId === \CCrmOwnerType::Order)
    {
        continue;
    }

    foreach ($factory->getItemsFilteredByPermissions(['filter' => ['@ID' => $ids]], $userId) as $childItem)
    {
        $children[$childTypeId][$childItem->getId()] = $childItem->getHeading();
    }
}
```

Массив `$children` содержит подписи доступных потомков по типу и ID. Пример пропускает типы без фабрики и заказы. Заказ читают через API модуля [Интернет-магазин](./../sale/overview.md). Порядок вывода подписей и ссылок на карточки описан в статье [Работа с элементами CRM](./items.md#get-items-of-different-types).

## Добавить или изменить связь

Связь меняйте на элементе-потомке через операцию изменения. Операция проверяет право изменить потомка. Если поле связи изменилось, она также проверяет право читать каждый элемент в этом поле, включая уже привязанные.

После проверок операция сохраняет привязку, записывает привязку и отвязку в историю изменений CRM и отправляет события изменения элемента. В зависимости от типа и настроек операция также запускает бизнес-процессы и автоматизацию. Порядок операции описан в статье [Схема работы CRM и основные объекты API](./architecture.md#operation-save-steps).

Операцию получите методом фабрики `getUpdateOperation($item, $context)`. Объект `Context` с ID пользователя из `Context::setUserId($userId)` задает, чьи права проверяет операция. Порядок запуска от нужного пользователя описан в статье [Права доступа в PHP API CRM](./permissions.md#operation-user).

Загрузите потомка методом `getItem($id)` без второго аргумента `$fieldsToSelect`. Метод загрузит все поля, включая текущие привязки. Методы `bindContacts()` и `unbindContacts()` меняют набор относительно них.

Операция вычисляет изменения по набору привязок, загруженному в память. Изменения, которые другой процесс внес между `getItem()` и `launch()`, она не учитывает. Основной контакт и итоговый набор могут не совпасть с ожидаемыми. Для обмена с внешней системой, где такое возможно, перечитайте элемент непосредственно перед изменением и согласуйте правило разрешения конфликта, как описано в статье [Работа с элементами CRM](./items.md#retry-update).

Операция отправляет событие изменения для элемента, на котором ее запустили. Выбор точки расширения описан в статье [События и расширение поведения CRM](./events-and-extension.md).

### Добавить контакт и сохранить остальные {#add-contact}

Метод `bindContacts($contactBindings)` добавляет переданные контакты к текущим. Результат зависит от того, привязан ли контакт.

-  Новый контакт без `IS_PRIMARY` метод добавляет в набор, основной контакт не меняется.

-  Уже привязанный контакт метод не дублирует, а заменяет его привязку переданной.

-  Если передать уже привязанный основной контакт без `IS_PRIMARY`, основным станет другой контакт набора.

Перед вызовом проверьте, что контакт еще не привязан. Массив привязок из простого списка ID формирует метод `EntityBinding::prepareEntityBindings(\CCrmOwnerType::Contact, $contactIds)`. Метод задает первой привязке сортировку `SORT`, равную `10`, как у первого контакта сделки. Поэтому в `getContactIds()` новый контакт может оказаться первым, хотя основным не станет. Привязку с признаком основного контакта соберите вручную с ключами `CONTACT_ID` и `IS_PRIMARY`, как в разделе [о смене основного контакта](#change-primary-contact).

{% note warning "" %}

Не записывайте новый контакт в поле `CONTACT_ID`, если нужно сохранить остальные. Если контакт еще не привязан, запись `CONTACT_ID` заменит все привязки одним этим контактом. Для добавления используйте `bindContacts()`.

{% endnote %}

**Пример.** Добавьте контакт с ID `456` к сделке с ID `123` от имени пользователя `$userId`. Переменная `$dealFactory` содержит фабрику сделок.

```php
$deal = $dealFactory->getItem(123);
if ($deal === null)
{
    throw new \RuntimeException('Сделка не найдена');
}

$contactId = 456;
if (!in_array($contactId, $deal->getContactIds(), true))
{
    $deal->bindContacts(
        \Bitrix\Crm\Binding\EntityBinding::prepareEntityBindings(\CCrmOwnerType::Contact, [$contactId])
    );

    $context = (new \Bitrix\Crm\Service\Context())->setUserId($userId);
    $result = $dealFactory->getUpdateOperation($deal, $context)->launch();
    if (!$result->isSuccess())
    {
        throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
    }
}
```

После успешного `launch()` сделка содержит прежние контакты и контакт `456`. Проверка `in_array()` делает повторный запуск безопасным. Если контакт уже привязан, операция не запускается. Если пользователь не может читать новый или любой уже привязанный контакт, операция вернет ошибку доступа и не сохранит сделку.

### Сменить основной контакт {#change-primary-contact}

CRM записывает ID основного контакта в поле `CONTACT_ID`. Чтобы сделать основным другой контакт, передайте в `bindContacts()` привязку с ключом `IS_PRIMARY`, равным `Y`. Если контакт еще не привязан, метод добавит его сразу основным.

**Пример.** Сделайте контакт с ID `456` основным в сделке `$deal`, которую загрузили методом `getItem()`. Переменная `$dealFactory` содержит фабрику сделок. Остальные контакты останутся дополнительными.

```php
if ((int)$deal->getContactId() !== 456)
{
    $deal->bindContacts([
        ['CONTACT_ID' => 456, 'IS_PRIMARY' => 'Y'],
    ]);

    $context = (new \Bitrix\Crm\Service\Context())->setUserId($userId);
    $result = $dealFactory->getUpdateOperation($deal, $context)->launch();
    if (!$result->isSuccess())
    {
        throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
    }
}
```

После успешного `launch()` метод `getContactId()` перечитанной сделки возвращает `456`. Прежний основной контакт остается в `getContactIds()`.

### Заменить весь набор контактов {#replace-contacts}

Если внешняя система передает полный список контактов, запишите его в поле `CONTACT_IDS`. Новый набор заменит текущий, а основным станет первый ID массива. Контакты, которых нет в массиве, CRM отвяжет.

**Пример.** Замените контакты сделки `$deal` двумя контактами. Переменная `$dealFactory` содержит фабрику сделок. Контакт `456` станет основным.

```php
$newContactIds = [456, 789];
if ($deal->getContactIds() !== $newContactIds || (int)$deal->getContactId() !== $newContactIds[0])
{
    $deal->set(\Bitrix\Crm\Item::FIELD_NAME_CONTACT_IDS, $newContactIds);

    $context = (new \Bitrix\Crm\Service\Context())->setUserId($userId);
    $result = $dealFactory->getUpdateOperation($deal, $context)->launch();
    if (!$result->isSuccess())
    {
        throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
    }
}
```

После успешного `launch()` сделка содержит только контакты `456` и `789`. Пустой массив отвяжет все контакты. Передавайте его, только если внешняя система передала пустой список как признак отсутствия контактов, а не из-за неполных данных.

### Изменить компанию клиента или контакта {#change-company}

Сделка, лид, коммерческое предложение, счет и смарт-процесс с клиентом хранят одну компанию в поле `COMPANY_ID`. Новое значение заменяет прежнюю компанию, контакты при этом не меняются.

**Пример.** Привяжите к сделке `$deal` компанию с ID `321`. Переменная `$dealFactory` содержит фабрику сделок.

```php
if ((int)$deal->getCompanyId() !== 321)
{
    $deal->set(\Bitrix\Crm\Item::FIELD_NAME_COMPANY_ID, 321);

    $context = (new \Bitrix\Crm\Service\Context())->setUserId($userId);
    $result = $dealFactory->getUpdateOperation($deal, $context)->launch();
    if (!$result->isSuccess())
    {
        throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
    }
}
```

После успешного `launch()` метод `getCompanyId()` перечитанной сделки возвращает `321`. Операция отклонит изменение, если пользователь не может читать компанию.

Выбранный реквизит клиента хранится в отдельной привязке. После смены компании или основного контакта [проверьте ее](#bind-client-requisite).

У контакта может быть несколько компаний. Их набор хранит поле `COMPANY_BINDINGS` с ключами `COMPANY_ID`, `SORT`, `ROLE_ID` и `IS_PRIMARY`. Связь «компания — контакт» меняйте со стороны контакта.

{% note warning "" %}

Не привязывайте контакты методом `bindContacts()` компании. При сохранении компания записывает свой ID в поле `COMPANY_ID` своих контактов, а признак `IS_PRIMARY` в их привязках не меняет. У контакта с несколькими компаниями основная компания в `COMPANY_ID` и в `COMPANY_BINDINGS` перестанет совпадать. Добавляйте компанию в поле `COMPANY_BINDINGS` контакта.

{% endnote %}

Отдельных методов добавления компаний у `Item` нет. Прочитайте текущие привязки, добавьте новую и запишите полный набор обратно. Метод `EntityBinding::prepareEntityIDs(\CCrmOwnerType::Company, $bindings)` возвращает ID компаний из привязок и помогает проверить, не привязана ли компания уже. Если в наборе нет привязки с `IS_PRIMARY`, равным `Y`, основной станет первая компания.

Поле `COMPANY_IDS` принимает простой массив ID. Запись в него заменяет набор, и основной становится первая компания массива.

**Пример.** Добавьте компанию с ID `321` к контакту `$contact`, который загрузили методом `getItem()`, и сохраните прежние компании. Переменная `$contactFactory` содержит фабрику контактов.

```php
$bindings = $contact->get(\Bitrix\Crm\Item\Contact::FIELD_NAME_COMPANY_BINDINGS);
$companyIds = \Bitrix\Crm\Binding\EntityBinding::prepareEntityIDs(\CCrmOwnerType::Company, $bindings);
if (!in_array(321, $companyIds, true))
{
    $bindings[] = ['COMPANY_ID' => 321];
    $contact->set(\Bitrix\Crm\Item\Contact::FIELD_NAME_COMPANY_BINDINGS, $bindings);

    $context = (new \Bitrix\Crm\Service\Context())->setUserId($userId);
    $result = $contactFactory->getUpdateOperation($contact, $context)->launch();
    if (!$result->isSuccess())
    {
        throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
    }
}
```

Компания `321` добавляется в конец набора. Прежняя основная компания остается основной, потому что ее привязка сохранила `IS_PRIMARY`.

### Привязать реквизит клиента {#bind-client-requisite}

Сделка, коммерческое предложение, счет и смарт-процесс хранят выбранный реквизит и банковский реквизит клиента и собственной компании в отдельной привязке. Класс `Bitrix\Crm\Requisite\EntityLink` читает и записывает эту привязку. Операция элемента ее не меняет. Состав реквизитов и способ получить их ID описаны в статье [Поля и данные клиента](./fields-and-client-data.md#get-client-requisites).

Клиентом для привязки CRM считает компанию элемента. Если компании нет, клиентом становится основной контакт. Поэтому после смены компании или основного контакта прежний реквизит может перестать принадлежать клиенту.

Методы класса выполняют три действия.

-  `getByEntity($entityTypeId, $entityId)` — возвращает массив с ключами `REQUISITE_ID`, `BANK_DETAIL_ID`, `MC_REQUISITE_ID`, `MC_BANK_DETAIL_ID` или `null`, если привязки нет,

-  `checkConsistence($entityTypeId, $entityId, $requisiteId, $bankDetailId, $mcRequisiteId, $mcBankDetailId)` — проверяет, что реквизит принадлежит клиенту элемента, банковский реквизит — этому реквизиту, а реквизит своей компании — компании из `MYCOMPANY_ID`, и выбрасывает `Bitrix\Main\SystemException` при несовпадении,

-  `register($entityTypeId, $entityId, $requisiteId, $bankDetailId, $mcRequisiteId, $mcBankDetailId)` — записывает привязку или заменяет существующую.

Метод `register()` не проверяет права и соответствие реквизита клиенту. Перед записью проверьте право изменить элемент методом `Container::getInstance()->getUserPermissions($userId)->item()->canUpdate($entityTypeId, $entityId)` и вызовите `checkConsistence()`. Проверка прав описана в статье [Права доступа в PHP API CRM](./permissions.md#check-type-and-item-access). Значение `0` в аргументе означает, что реквизит этого вида не выбран.

**Пример.** Привяжите к сделке с ID `123` реквизит клиента с ID `55` и его банковский реквизит с ID `66` от имени пользователя `$userId`. Реквизиты своей компании не выбраны.

```php
$dealId = 123;
$permissions = \Bitrix\Crm\Service\Container::getInstance()->getUserPermissions($userId);
if (!$permissions->item()->canUpdate(\CCrmOwnerType::Deal, $dealId))
{
    throw new \RuntimeException('Нет права изменить сделку');
}

try
{
    \Bitrix\Crm\Requisite\EntityLink::checkConsistence(\CCrmOwnerType::Deal, $dealId, 55, 66, 0, 0);
    \Bitrix\Crm\Requisite\EntityLink::register(\CCrmOwnerType::Deal, $dealId, 55, 66, 0, 0);
}
catch (\Bitrix\Main\SystemException $exception)
{
    throw new \RuntimeException('Реквизит не подходит для сделки: ' . $exception->getMessage());
}

$link = \Bitrix\Crm\Requisite\EntityLink::getByEntity(\CCrmOwnerType::Deal, $dealId);
```

Массив `$link` содержит `REQUISITE_ID`, равный `55`, и `BANK_DETAIL_ID`, равный `66`. Метод `getByEntity()` возвращает ID строками, поэтому перед сравнением приведите их к целому числу, например `(int)$link['REQUISITE_ID']`. Если реквизит принадлежит не клиенту сделки, метод `checkConsistence()` выбросит исключение и привязка не изменится. Метод `EntityLink::unregister($entityTypeId, $entityId)` удаляет привязку реквизитов элемента.

Чтобы проверить привязку после смены клиента, выполните действия по порядку.

1. Получите текущие ID методом `getByEntity()`. Если метод вернул `null`, проверять нечего.

2. Передайте эти ID в `checkConsistence()`.

3. Если метод выбросил исключение, запишите реквизит нового клиента методом `register()` или удалите привязку методом `unregister()`.

### Привязать элемент смарт-процесса к родителю {#bind-smart-process-parent}

Родителя элемента смарт-процесса хранит поле `PARENT_ID_<entityTypeId родителя>` элемента-потомка. Имя поля возвращает метод `ParentFieldManager::getParentFieldName($parentEntityTypeId)`. У потомка может быть только один родитель каждого типа. Новый ID заменяет прежнюю привязку к родителю этого типа.

Перед записью проверьте, что типы связаны. Метод `areTypesBound(new RelationIdentifier($parentEntityTypeId, $childEntityTypeId))` объекта `RelationManager` возвращает `true`, если связь типов существует. Первым аргументом `RelationIdentifier` передайте тип родителя, вторым — тип потомка.

**Пример.** Привяжите элемент `$itemId` смарт-процесса `$entityTypeId` к сделке с ID `123` от имени пользователя `$userId`.

```php
$container = \Bitrix\Crm\Service\Container::getInstance();
$relation = new \Bitrix\Crm\RelationIdentifier(\CCrmOwnerType::Deal, $entityTypeId);
if (!$container->getRelationManager()->areTypesBound($relation))
{
    throw new \RuntimeException('Смарт-процесс не связан со сделками');
}

$itemFactory = $container->getFactory($entityTypeId);
if ($itemFactory === null)
{
    throw new \RuntimeException('Смарт-процесс не найден');
}

$item = $itemFactory->getItem($itemId);
if ($item === null)
{
    throw new \RuntimeException('Элемент смарт-процесса не найден');
}

$parentField = \Bitrix\Crm\Service\ParentFieldManager::getParentFieldName(\CCrmOwnerType::Deal);
if ((int)$item->get($parentField) !== 123)
{
    $item->set($parentField, 123);

    $context = (new \Bitrix\Crm\Service\Context())->setUserId($userId);
    $result = $itemFactory->getUpdateOperation($item, $context)->launch();
    if (!$result->isSuccess())
    {
        throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
    }
}
```

После успешного `launch()` элемент привязан к сделке `123` и попадает в выборку с фильтром `=PARENT_ID_2`. Если элемент был привязан к другой сделке, прежняя привязка удалена. Операция отклонит изменение, если пользователь не может читать сделку.

Родителя можно задать и при создании элемента. Пример приведен в статье [Смарт-процессы](./smart-processes.md#create-item).

### Связать элементы через RelationManager {#bind-items-with-relation-manager}

Метод `bindItems($parent, $child)` объекта `RelationManager` создает связь двух элементов по их `ItemIdentifier`. Метод `areItemsBound($parent, $child)` возвращает `true`, если связь уже есть. Оба метода работают для любой пары типов, у которой существует связь типов.

{% note warning "" %}

Метод `bindItems()` не проверяет права пользователя. Для части связей, например «контакт — сделка» и «сделка — смарт-процесс», он записывает привязку напрямую, без операции изменения потомка. Такая запись не попадает в историю изменений и не запускает события и автоматизацию изменения элемента. Для клиентских полей и родителя смарт-процесса используйте операцию потомка.

{% endnote %}

Используйте `bindItems()` в доверенном серверном коде, который сам проверил права и не зависит от связанных действий операции. В пользовательской связи типов метод заменяет прежнего родителя того же типа, как и запись поля `PARENT_ID_*`. Метод возвращает `Bitrix\Main\Result`. Среди ошибок результата есть два кода.

-  `RelationManager::ERROR_CODE_BIND_ITEMS_TYPES_NOT_BOUND` — типы элементов не связаны,

-  `RelationManager::ERROR_CODE_BIND_ITEMS_ITEMS_ALREADY_BOUND` — элементы уже связаны.

Результат также может содержать ошибку сохранения, например если элемента-потомка не существует.

**Пример.** Свяжите сделку `$dealIdentifier` и элемент смарт-процесса `$itemIdentifier`, если связи еще нет. Идентификаторы подготовлены методом `createByParams()`, а права пользователя уже проверены.

```php
$relationManager = \Bitrix\Crm\Service\Container::getInstance()->getRelationManager();
if (!$relationManager->areItemsBound($dealIdentifier, $itemIdentifier))
{
    $result = $relationManager->bindItems($dealIdentifier, $itemIdentifier);
    if (!$result->isSuccess())
    {
        throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
    }
}
```

После успешного вызова метод `areItemsBound()` возвращает `true`. В обоих методах первым аргументом передайте родителя, вторым — потомка.

### Проверить результат изменения связи

Перед повтором после ошибки перечитайте потомка и сравните привязки с ожидаемыми. Операция могла сохранить связь и вернуть ошибку на этапе связанных действий. Состояние после ошибки объясняет статья [Схема работы CRM и основные объекты API](./architecture.md#check-operation-result).

Для обмена с внешней системой сравнивайте набор ID, а не результат одного вызова. Метод `getContactIds()` перечитанного элемента возвращает фактический набор контактов, `getCompanyId()` — компанию, `get($parentField)` — родителя. Если фактический набор совпадает с ожидаемым, повторять операцию не нужно.

## Удалить связь

Удаление связи и удаление элемента — разные действия. Отвязанный контакт остается в CRM и сохраняет другие связи. Удаленный элемент теряет все связи сразу.

### Отвязать контакт

Метод `unbindContacts($contactBindings)` удаляет из элемента только переданные контакты. Если отвязан основной контакт, основным станет первый оставшийся контакт. Если контактов не осталось, поле `CONTACT_ID` получит значение `0`.

**Пример.** Отвяжите контакт с ID `456` от сделки `$deal`, которую загрузили методом `getItem()`. Переменная `$dealFactory` содержит фабрику сделок.

```php
if (in_array(456, $deal->getContactIds(), true))
{
    $deal->unbindContacts(
        \Bitrix\Crm\Binding\EntityBinding::prepareEntityBindings(\CCrmOwnerType::Contact, [456])
    );

    $context = (new \Bitrix\Crm\Service\Context())->setUserId($userId);
    $result = $dealFactory->getUpdateOperation($deal, $context)->launch();
    if (!$result->isSuccess())
    {
        throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
    }
}
```

После успешного `launch()` контакт `456` отсутствует в `getContactIds()` перечитанной сделки. Сам контакт и его связи с другими элементами не меняются. Проверьте `getContactId()`, если от основного контакта зависит дальнейшая обработка.

### Отвязать компанию или родителя

Чтобы отвязать компанию, запишите в поле `COMPANY_ID` значение `0`. Чтобы отвязать родителя смарт-процесса, запишите `0` в его поле `PARENT_ID_<entityTypeId родителя>`. Затем запустите операцию изменения потомка.

**Пример.** Отвяжите элемент смарт-процесса `$item` от родительской сделки. Элемент загружен методом `getItem()`, переменная `$itemFactory` содержит фабрику его типа. Тип смарт-процесса [связан со сделками](#bind-smart-process-parent), иначе поля `PARENT_ID_2` у элемента нет.

```php
$parentField = \Bitrix\Crm\Service\ParentFieldManager::getParentFieldName(\CCrmOwnerType::Deal);
if ((int)$item->get($parentField) > 0)
{
    $item->set($parentField, 0);

    $context = (new \Bitrix\Crm\Service\Context())->setUserId($userId);
    $result = $itemFactory->getUpdateOperation($item, $context)->launch();
    if (!$result->isSuccess())
    {
        throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
    }
}
```

После успешного `launch()` значение `(int)$item->get($parentField)` перечитанного элемента равно `0`, а элемент пропадает из выборки потомков сделки. Сделка остается без изменений.

Метод `unbindItems($parent, $child)` объекта `RelationManager` тоже удаляет связь. Он не проверяет права. Для части связей, например «контакт — сделка» и «сделка — смарт-процесс», метод удаляет привязку напрямую, без операции потомка, записи в историю изменений, событий и автоматизации. Метод возвращает ошибку `RelationManager::ERROR_CODE_UNBIND_ITEMS_ITEMS_NOT_BOUND`, если элементы не связаны, и `RelationManager::ERROR_CODE_UNBIND_ITEMS_TYPES_NOT_BOUND`, если не связаны их типы. Условия применения описаны в разделе [о методе `bindItems()`](#bind-items-with-relation-manager).

### Учесть связи при удалении элемента

Не удаляйте элемент, чтобы убрать связь. Операция удаления снимает все привязки элемента к другим элементам. Контакт при удалении отвязывается от всех сделок, лидов, предложений, компаний, смарт-процессов и счетов. Сделка при удалении теряет привязки к контактам и к элементам смарт-процессов. Привязку реквизитов CRM удаляет только при окончательном удалении сделки. При переносе в корзину привязка остается.

Если метод фабрики `isRecyclebinEnabled()` возвращает `false`, элемент и его связи удаляются сразу. Так работает, например, смарт-процесс, для которого корзина не включена.

Если CRM переносит удаленный элемент в корзину, она сохраняет его связи и восстанавливает их вместе с элементом. Восстановленный элемент получает новый ID. Связи с элементами, которые удалили за это время, не восстанавливаются. После восстановления получите элемент по новому ID и сравните связи с ожидаемыми. Порядок удаления и проверки результата описан в статье [Работа с элементами CRM](./items.md#delete-item).

Удаление связи типов запрещает новые привязки элементов этих типов. Метод `unbindTypes()` удаляет только запись о связи типов. Привязки элементов, созданные раньше, он не удаляет, но поле `PARENT_ID_*` у потомков пропадает. Предопределенные связи CRM, например «контакт — сделка», удалить нельзя. Метод `unbindTypes()` вернет для них ошибку. Удаление связи типов описано в статье [Смарт-процессы](./smart-processes.md#bind-types).
