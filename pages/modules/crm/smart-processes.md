---
title: Смарт-процессы
description: "Создание, поиск, настройка и удаление типа смарт-процесса, работа с его элементами и ссылки на список и карточку через локальный PHP API."
---

Смарт-процесс — собственный тип CRM с настраиваемыми стадиями, направлениями, полями и правами. Модель объектов CRM подробно описывает статья [Схема работы CRM и основные объекты API](./architecture.md).

Из PHP-кода модуля тип можно создать, найти при следующем хите, настроить, связать с другими типами и удалить. Тип создают и настраивают через ORM-класс `Bitrix\Crm\Model\Dynamic\TypeTable`.

Элементы типа читают и сохраняют так же, как сделки. Фабрика типа загружает элементы, а операция проверяет и сохраняет изменения. Ссылки на список и карточку строит роутер.

Примеры работают в коробочном Битрикс24 с модулем `crm`. Перед запуском подключите модуль через `Loader::includeModule('crm')`. Переменная `$userId` содержит ID пользователя, от имени которого работает код. Подготовку этих данных показывает статья [Работа с элементами CRM](./items.md#prepare-type-data-and-user).

## Выбрать смарт-процесс для задачи

Элементы смарт-процесса можно связать со сделками, контактами и компаниями, но они не смешиваются с записями готовых типов. Перед созданием типа сравните его с другими способами хранить данные.

-  Направление сделки подходит, если процесс остается продажей. В интерфейсе направления называются воронками. Направление получает свои стадии и права, а поля остаются общими для всех сделок.

-  Пользовательское поле готового типа подходит, если нужно дополнить данные лида, сделки, контакта или компании.

-  Смарт-процесс подходит, если процессу нужен свой набор полей, а не только свои стадии и права.

-  Собственная таблица ORM или [highload-блок](./../highloadblocks/overview.md) подходят, если данным не нужны карточка, стадии, права и автоматизация CRM.

Число смарт-процессов ограничено тарифом или лицензией Битрикс24. Если лимит исчерпан, создать тип нельзя. Перед созданием типа [проверьте лимит](#check-permissions-and-limits).

## Отличить тип от элемента {#type-and-item}

Тип смарт-процесса задает структуру, а элемент хранит данные одной записи. Тип «Заявки на оборудование» определяет стадии и поля, а каждая заявка — отдельный элемент этого типа.

У типа есть два числовых идентификатора с разным назначением.

#|
|| **Идентификатор** | **Метод объекта `Type`** | **Где нужен** ||
|| ID типа | `getId()` | Запись о типе в `TypeTable` и метод `Container::getType($id)` ||
|| `entityTypeId` | `getEntityTypeId()` | Методы `Container::getFactory()` и `Container::getTypeByEntityTypeId()`, связи, ссылки и элементы ||
|#

Класс `Container` — это `Bitrix\Crm\Service\Container`. Его методы вызывают у объекта `Container::getInstance()`.

Во всех операциях с элементами передавайте `entityTypeId`. ID типа нужен только для работы с самой записью о типе. Значения ID типа и `entityTypeId` не связаны друг с другом. Не подставляйте одно вместо другого.

CRM выдает `entityTypeId` при создании типа. Не вычисляйте его и не проверяйте по фиксированному диапазону.

Метод `CCrmOwnerType::isPossibleDynamicTypeId($entityTypeId)` отличает значения пользовательских смарт-процессов от служебных и готовых типов. Метод не проверяет, существует ли тип. Для этой проверки вызовите `Container::getTypeByEntityTypeId()`.

Метод `CCrmOwnerType::ResolveName($entityTypeId)` возвращает символьное имя типа вида `DYNAMIC_<entityTypeId>`.

Счета, смарт-документы и документы кадрового электронного документооборота используют тот же механизм типов, но это не пользовательские смарт-процессы. Для них метод `isPossibleDynamicTypeId()` возвращает `false`. Не меняйте настройки этих типов кодом из примеров ниже.

## Создать тип смарт-процесса

Метод `Container::getDynamicTypeDataClass()` возвращает имя ORM-класса типов, по умолчанию `TypeTable`. Вызывайте методы класса через это имя, а не через `TypeTable` напрямую. Метод берет класс из `ServiceLocator`, поэтому код продолжит работать, если класс типов заменят.

Метод `save()` нового объекта `Type` создает таблицы элементов и направление по умолчанию со стадиями. CRM записывает начальные права ролей на направление фоновой задачей после завершения текущего хита. Не проверяйте права обычных пользователей на новый тип в том же хите. Результат будет неполным.

Интерфейс CRM после сохранения типа отдельно записывает связи с другими типами. В PHP-коде тоже [связывайте типы](#bind-types) отдельным вызовом после создания.

### Выбрать настройки типа {#type-settings}

Логические поля `TypeTable` вида `IS_..._ENABLED` управляют возможностями типа. Значение `true` включает возможность для всех элементов типа. Значение поля задает метод объекта `Type` вида `setIs...()`, например поле `IS_STAGES_ENABLED` — метод `setIsStagesEnabled(true)`. ORM-класс хранит значения в базе как `Y` и `N`, но в методы передавайте `bool`.

Часть настроек добавляет к элементам поля. Состав этих полей перечисляет статья [Схема работы CRM и основные объекты API](./architecture.md#smart-process-fields). Остальные настройки включают для типа другие возможности, например корзину или автоматизацию. Методы фабрики из таблицы возвращают `true`, если возможность включена.

#|
|| **Поле типа** | **Метод фабрики** | **Что включает** ||
|| `IS_CATEGORIES_ENABLED` | `isCategoriesEnabled()` | Несколько направлений. В интерфейсе настроек они называются воронками ||
|| `IS_STAGES_ENABLED` | `isStagesEnabled()` | Стадии и канбан ||
|| `IS_BEGIN_CLOSE_DATES_ENABLED` | `isBeginCloseDatesEnabled()` | Поля даты начала и даты завершения ||
|| `IS_CLIENT_ENABLED` | `isClientEnabled()` | Поле клиента с привязкой компании и контактов ||
|| `IS_LINK_WITH_PRODUCTS_ENABLED` | `isLinkWithProductsEnabled()` | Товарные позиции, сумму и валюту ||
|| `IS_MYCOMPANY_ENABLED` | `isMyCompanyEnabled()` | Поле реквизитов собственной компании ||
|| `IS_OBSERVERS_ENABLED` | `isObserversEnabled()` | Поле наблюдателей ||
|| `IS_SOURCE_ENABLED` | `isSourceEnabled()` | Поля источника и дополнительных сведений об источнике ||
|| `IS_RECURRING_ENABLED` | `isRecurringEnabled()` | Регулярные элементы, если функция доступна ||
|| `IS_RECYCLEBIN_ENABLED` | `isRecyclebinEnabled()` | Перенос удаленных элементов в корзину ||
|| `IS_AUTOMATION_ENABLED` | `isAutomationEnabled()` | Роботов и триггеры. Фабрика считает автоматизацию включенной, только если включены и стадии ||
|| `IS_BIZ_PROC_ENABLED` | `isBizProcEnabled()` | Дизайнер бизнес-процессов ||
|| `IS_DOCUMENTS_ENABLED` | `isDocumentGenerationEnabled()` | Печать документов через модуль `documentgenerator` ||
|| `IS_USE_IN_USERFIELD_ENABLED` | `isUseInUserfieldEnabled()` | Выбор элементов типа в пользовательском поле привязки к CRM ||
|| `IS_COUNTERS_ENABLED` | `isCountersEnabled()` | Счетчики ||
|| `IS_SET_OPEN_PERMISSIONS` | Нет | Максимальные права ролей на новые направления типа ||
|#

У нового объекта `Type` поле `IS_SET_OPEN_PERMISSIONS` по умолчанию равно `true`, а остальные поля из таблицы — `false`. Метод `setIsSetOpenPermissions(false)` отключает максимальные права для новых направлений.

Метод `setDaysBeforeClose()` задает поле `DAYS_BEFORE_CLOSE`. Значение определяет, через сколько дней от текущей даты CRM назначает дату завершения нового элемента по умолчанию. Допустимы значения от 0 до 365. При значении `null` CRM назначает дату через семь дней.

С данными клиента и реквизитами работают по статье [Поля и данные клиента](./fields-and-client-data.md), с товарными позициями — по статье [Товары в элементах CRM](./product-rows.md).

При создании пользовательского поля смарт-процесса передайте в `ENTITY_ID` значение, которое возвращает метод фабрики `getUserFieldEntityId()`.

### Проверить права и ограничения {#check-permissions-and-limits}

ORM-класс типов сам не проверяет права пользователя и ограничения тарифа или лицензии. Выполните обе проверки до создания объекта.

-  `Container::getUserPermissions($userId)->dynamicType()->canAdd()` возвращает `true`, если пользователь может создать тип.

-  `RestrictionManager::getDynamicTypesLimitRestriction()->isCreateTypeRestricted()` возвращает `true`, если создать еще один тип нельзя.

Метод `canAdd()` без аргумента проверяет права администратора CRM.

### Сохранить новый тип {#save-new-type}

Метод `generateName($title)` ORM-класса формирует уникальное внутреннее имя типа из названия. Имя состоит из латинских букв и цифр и начинается с заглавной буквы. Метод возвращает `null`, если за несколько попыток не удалось подобрать свободное имя.

Поле `CODE` хранит символьный код, по которому модуль найдет тип повторно. CRM не проверяет уникальность этого кода.

**Пример.** Создайте тип «Заявки на оборудование» со стадиями, клиентом и наблюдателями от имени пользователя `$userId`. Символьный код `equipment_request` связывает тип с модулем.

```php
use Bitrix\Crm\Restriction\RestrictionManager;
use Bitrix\Crm\Service\Container;

$container = Container::getInstance();
if (!$container->getUserPermissions($userId)->dynamicType()->canAdd())
{
    throw new \RuntimeException('Нет права создавать смарт-процессы');
}

$restriction = RestrictionManager::getDynamicTypesLimitRestriction();
if ($restriction->isCreateTypeRestricted())
{
    throw new \RuntimeException($restriction->getCreateTypeRestrictedError()->getMessage());
}

$title = 'Заявки на оборудование';
$typeDataClass = $container->getDynamicTypeDataClass();
$name = $typeDataClass::generateName($title);
if ($name === null)
{
    throw new \RuntimeException('Не удалось сформировать имя типа');
}

$type = $typeDataClass::createObject();
$type->setTitle($title);
$type->setName($name);
$type->setCode('equipment_request');
$type->setCreatedBy($userId);
$type->setIsStagesEnabled(true);
$type->setIsClientEnabled(true);
$type->setIsObserversEnabled(true);

$result = $type->save();
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$entityTypeId = $type->getEntityTypeId();
```

После успешного `save()` переменная `$entityTypeId` содержит идентификатор нового типа. [Сохраните его в настройках модуля](#find-type) через `Bitrix\Main\Config\Option::set()`.

Метод `Container::getFactory($entityTypeId)` уже в том же хите возвращает фабрику типа, а метод фабрики `getDefaultCategory()` — направление по умолчанию.

Метод `setCreatedBy($userId)` записывает автора типа. Без этого вызова ORM-класс берет текущего пользователя из общего контекста CRM `Container::getContext()`. В фоновой задаче такого пользователя может не быть. ORM-класс всегда заполняет поле `UPDATED_BY` из этого контекста. Объект `Context`, который передают в операции элементов, на тип не влияет.

### Повторить создание после ошибки

При каждом сохранении нового объекта CRM выдает новый `entityTypeId`. Повторный запуск того же кода создаст второй тип с тем же названием. Перед повтором [найдите тип по коду](#find-type). Если тип найден, продолжайте работу с ним.

Поиск по коду не защищает, если два процесса создают тип одновременно. Запускайте создание типа из одного места, например при установке модуля.

Если метод `isCreateTypeRestricted()` вернул `true`, код не создает тип. Повтор даст тот же результат, пока администратор не удалит лишние типы или не расширит тариф или лицензию.

## Найти тип повторно {#find-type}

Храните `entityTypeId` созданного типа в настройках своего модуля. Это значение не меняется за время жизни типа. Если сохраненного значения нет, найдите тип по символьному коду в коллекции типов.

Метод `Container::getDynamicTypesMap()->getTypesCollection()` возвращает все типы, создание которых завершено. Коллекция содержит служебные типы счетов и документов, поэтому отберите пользовательские смарт-процессы через `CCrmOwnerType::isPossibleDynamicTypeId()`.

**Пример.** Получите `entityTypeId` из настроек модуля `my.module`. Если значения нет, найдите тип с кодом `equipment_request` и сохраните результат. Если тип не найден, переменная `$entityTypeId` останется равной `null`.

```php
use Bitrix\Crm\Service\Container;
use Bitrix\Main\Config\Option;

$entityTypeId = (int)Option::get('my.module', 'equipment_request_type_id', 0);
if ($entityTypeId <= 0 || Container::getInstance()->getTypeByEntityTypeId($entityTypeId) === null)
{
    $entityTypeId = null;
    $foundIds = [];
    $types = Container::getInstance()->getDynamicTypesMap()->getTypesCollection();
    foreach ($types as $type)
    {
        if (
            \CCrmOwnerType::isPossibleDynamicTypeId($type->getEntityTypeId())
            && $type->getCode() === 'equipment_request'
        )
        {
            $foundIds[] = $type->getEntityTypeId();
        }
    }

    if (count($foundIds) > 1)
    {
        throw new \RuntimeException('Найдено несколько типов с кодом equipment_request');
    }

    if (count($foundIds) === 1)
    {
        $entityTypeId = $foundIds[0];
        Option::set('my.module', 'equipment_request_type_id', (string)$entityTypeId);
    }
}
```

Модуль `my.module` и ключ `equipment_request_type_id` замените на свои.

CRM не проверяет уникальность кода, поэтому пример отклоняет дубль, а не выбирает первый найденный тип.

Если тип не найден, [создайте его](#save-new-type) или остановите сценарий. Не передавайте `null` в методы, которые ожидают `entityTypeId`.

Метод `Container::getTypeByEntityTypeId($entityTypeId)` возвращает объект типа или `null`. Результат `null` означает, что для этого `entityTypeId` нет готового к работе типа. Например, тип удален в предыдущем хите, еще не завершил создание или значение относится к сделке. Метод `Container::getType($id)` ищет тип по ID записи и работает так же.

## Изменить настройки типа {#update-type-settings}

Получите объект через `Container::getTypeByEntityTypeId()`, измените нужные поля и вызовите `save()`. Фабрика типа хранит ссылку на этот же объект. После сохранения фабрика в том же хите использует новые настройки.

Изменять настройки типа может администратор CRM или пользователь с правами администратора на этот тип в настройках ролей. Метод `dynamicType()->canUpdate($entityTypeId)` объекта прав проверяет эти права. Метод возвращает `false` для служебных типов счетов и документов, а также для типа, заблокированного ограничениями тарифа.

Метод `RestrictionManager::getDynamicTypesLimitRestriction()->isTypeSettingsRestricted($entityTypeId)` возвращает `true`, если тариф или лицензия запрещает менять настройки типа.

**Пример.** Включите товарные позиции и корзину для типа `$entityTypeId` от имени пользователя `$userId`.

```php
use Bitrix\Crm\Restriction\RestrictionManager;
use Bitrix\Crm\Service\Container;

$container = Container::getInstance();
$permissions = $container->getUserPermissions($userId);
if (!$permissions->dynamicType()->canUpdate($entityTypeId))
{
    throw new \RuntimeException('Нет права изменить смарт-процесс');
}

$restriction = RestrictionManager::getDynamicTypesLimitRestriction();
if ($restriction->isTypeSettingsRestricted($entityTypeId))
{
    throw new \RuntimeException('Настройки смарт-процесса недоступны на текущем тарифе');
}

$type = $container->getTypeByEntityTypeId($entityTypeId);
if ($type === null)
{
    throw new \RuntimeException('Смарт-процесс не найден');
}

$type->setIsLinkWithProductsEnabled(true);
$type->setIsRecyclebinEnabled(true);

$result = $type->save();
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

После сохранения метод `$container->getFactory($entityTypeId)->isLinkWithProductsEnabled()` возвращает `true`. Элементы типа получают поля товаров и суммы.

ORM-класс отклоняет некоторые изменения и возвращает ошибку в результате `save()`.

-  `ENTITY_TYPE_ID` изменить нельзя.

-  Направления нельзя выключить, если у типа их больше одного. Сначала перенесите элементы и удалите лишние направления.

-  Корзину нельзя выключить, пока в ней есть элементы этого типа.

Не меняйте поле `NAME` существующего типа. Интерфейс CRM не передает его при изменении, а от имени зависят имена ORM-классов элементов типа.

### Отключить возможность без удаления данных

Отключение дат начала и завершения не очищает их значения в таблице элементов. Фабрика перестает включать эти поля в описания. При повторном включении дат сохраненные значения снова доступны через поля фабрики.

Отключение стадий также не удаляет справочник стадий и сохраненные `STAGE_ID` элементов. Фабрика перестает включать поля стадий в свой набор. Отключение направлений сохраняет единственное направление и привязки элементов к нему. Ограничение на количество направлений проверяется при сохранении настроек типа.

Отключайте возможность через настройки типа, а удаление данных выполняйте отдельным действием, только если оно требуется задаче. Перед изменением настроек проверьте, какие поля использует интеграция. После изменения в новом PHP-запросе получите фабрику заново и проверьте ее возможности и `getFieldsInfo()`. Если продолжаете работу с уже полученной фабрикой в том же запросе, вызовите `clearFieldsCollectionCache()` перед созданием новых операций, чтобы они получили обновленную коллекцию полей.

### Добавить направление {#add-category}

Тип получает направление по умолчанию при создании. Интерфейс CRM разрешает добавлять направления, только если включена настройка `IS_CATEGORIES_ENABLED`. Фабрика и ORM-класс эту настройку не проверяют, поэтому проверьте ее в коде модуля.

Метод фабрики `createCategory($data)` создает объект направления в памяти, а метод `save()` объекта записывает его.

Для нового направления CRM сразу добавляет стадии по умолчанию. Права ролей на направление появляются после завершения хита, как и при создании типа. Если у типа включена настройка `IS_SET_OPEN_PERMISSIONS`, роли получают максимальные права на направление, иначе — минимальные.

**Пример.** Добавьте в тип `$entityTypeId` направление «Ремонт» от имени пользователя `$userId`. У типа должна быть включена настройка `IS_CATEGORIES_ENABLED`. [Включите ее](#update-type-settings) методом `setIsCategoriesEnabled(true)`. Метод `category()->canAdd($category)` объекта прав проверяет право добавить направление.

```php
use Bitrix\Crm\Service\Container;

$container = Container::getInstance();
$factory = $container->getFactory($entityTypeId);
if ($factory === null || !$factory->isCategoriesEnabled())
{
    throw new \RuntimeException('Направления для типа недоступны');
}

$category = $factory->createCategory(['NAME' => 'Ремонт']);
if (!$container->getUserPermissions($userId)->category()->canAdd($category))
{
    throw new \RuntimeException('Нет права добавить направление');
}

$result = $category->save();
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$categoryId = $category->getId();
```

После успешного `save()` переменная `$categoryId` содержит ID направления. Метод фабрики `getStages($categoryId)` возвращает созданные для него стадии.

Повторный запуск создаст второе направление с тем же названием. Перед созданием проверьте названия в списке, который возвращает метод фабрики `getCategories()`.

Статья [Направления и стадии](./categories-and-stages.md) показывает, как читать направления и стадии и переводить элемент между ними.

### Связать тип с другими типами CRM {#bind-types}

Связь между типами разрешает привязывать элементы одного типа к элементам другого. Например, связь «сделка — смарт-процесс» добавляет в элементы смарт-процесса поле `PARENT_ID_2`, где `2` — идентификатор типа сделки. Имя такого поля возвращает метод `ParentFieldManager::getParentFieldName($parentEntityTypeId)`.

Метод `Container::getRelationManager()` возвращает объект `RelationManager`. Метод `bindTypes()` этого объекта создает связь и принимает объект `Relation` с идентификатором `RelationIdentifier` и настройками `Relation\Settings`. Первый аргумент `RelationIdentifier` — тип родителя, второй — тип потомка.

Чтобы привязать элементы к контактам и компаниям, включите настройку `IS_CLIENT_ENABLED`. CRM сама свяжет тип с контактами и компаниями через поле клиента, отдельная связь типов не нужна.

**Пример.** Сделайте смарт-процесс `$entityTypeId` дочерним типом для сделок и покажите список его элементов в карточке сделки.

```php
use Bitrix\Crm\Relation;
use Bitrix\Crm\RelationIdentifier;
use Bitrix\Crm\Service\Container;

$relationManager = Container::getInstance()->getRelationManager();
$identifier = new RelationIdentifier(\CCrmOwnerType::Deal, $entityTypeId);

if (!$relationManager->areTypesBound($identifier))
{
    $settings = (new Relation\Settings())->setIsChildrenListEnabled(true);
    $result = $relationManager->bindTypes(new Relation($identifier, $settings));
    if (!$result->isSuccess())
    {
        throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
    }
}
```

Проверка `areTypesBound()` делает повторный запуск безопасным. Без нее метод `bindTypes()` для уже связанных типов вернет ошибку.

Метод `unbindTypes($identifier)` объекта `RelationManager` удаляет связь между типами.

Привязку конкретных элементов и чтение связанных записей описывает статья [Связи между элементами](./relations.md).

## Работать с элементами смарт-процесса

Элементы смарт-процесса читают, создают, изменяют и удаляют через фабрику типа так же, как элементы готовых типов. Метод `Container::getFactory($entityTypeId)` возвращает объект `Bitrix\Crm\Service\Factory\Dynamic`. Порядок проверки прав, запуска операции и обработки результата не отличается от описанного в статье [Работа с элементами CRM](./items.md).

При записи полей элемента учитывайте особенности смарт-процесса.

-  Поле `CATEGORY_ID` есть у каждого смарт-процесса, даже если несколько направлений выключены. Задайте направление по умолчанию из `getDefaultCategory()` или другое направление типа.

-  Поле стадии есть, только если включена настройка `IS_STAGES_ENABLED`. Метод `setStartStageIdPermittedForUser()` записывает в элемент первую доступную пользователю стадию и возвращает ее строковый код. Метод возвращает `null`, если стадии выключены или пользователю недоступна ни одна начальная стадия.

-  Поле `XML_ID` хранит внешний идентификатор элемента. По этому полю [находят элемент](#find-item-by-external-id) повторно.

-  Если название не задано, CRM после сохранения подставляет название по умолчанию.

-  Поля клиента, товаров, наблюдателей и других возможностей доступны только при включенной настройке типа. Перед записью этих полей проверьте [методами фабрики](#type-settings), включены ли нужные возможности.

### Создать элемент {#create-item}

**Пример.** Создайте заявку в направлении по умолчанию смарт-процесса `$entityTypeId` от имени пользователя `$userId`. Заявка получает внешний идентификатор `request-1001` и привязку к сделке `$dealId`. Привязка работает, если [типы связаны](#bind-types).

```php
use Bitrix\Crm\Item;
use Bitrix\Crm\Service\Container;
use Bitrix\Crm\Service\Context;
use Bitrix\Crm\Service\ParentFieldManager;

$factory = Container::getInstance()->getFactory($entityTypeId);
if ($factory === null)
{
    throw new \RuntimeException('Смарт-процесс не найден');
}

$defaultCategory = $factory->getDefaultCategory();
if ($defaultCategory === null)
{
    throw new \RuntimeException('У типа нет направления по умолчанию');
}

$item = $factory->createItem();
$item->set(Item::FIELD_NAME_TITLE, 'Заявка на ноутбук');
$item->set(Item::FIELD_NAME_XML_ID, 'request-1001');
$item->set(Item::FIELD_NAME_CATEGORY_ID, $defaultCategory->getId());
$item->set(ParentFieldManager::getParentFieldName(\CCrmOwnerType::Deal), $dealId);

if ($factory->isStagesEnabled())
{
    $stageId = $factory->setStartStageIdPermittedForUser($item, $userId);
    if ($stageId === null)
    {
        throw new \RuntimeException('Нет доступной начальной стадии');
    }
}

$context = (new Context())->setUserId($userId);
$result = $factory->getAddOperation($item, $context)->launch();
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$itemId = $item->getId();
```

После успешного `launch()` переменная `$itemId` содержит ID заявки. Операция проверяет права пользователя на добавление в выбранное направление и отправляет события добавления элемента.

Перед повторным созданием после ошибки [найдите элемент](#find-item-by-external-id) по `XML_ID`. Операция могла сохранить элемент и вернуть ошибку на этапе действий после сохранения. Этапы операции перечисляет статья [Схема работы CRM и основные объекты API](./architecture.md#operation-save-steps).

### Найти элемент по внешнему идентификатору {#find-item-by-external-id}

У смарт-процесса нет полей `ORIGINATOR_ID` и `ORIGIN_ID`, которые есть у некоторых готовых типов. Внешний идентификатор записи храните в поле `XML_ID`. Метод `getItemsFilteredByPermissions()` с фильтром по `XML_ID` находит запись, созданную ранее из внешней системы, с учетом прав пользователя.

**Пример.** Найдите доступную пользователю `$userId` заявку с внешним идентификатором `request-1001`. Переменная `$factory` содержит фабрику смарт-процесса.

```php
$items = $factory->getItemsFilteredByPermissions([
    'filter' => ['=XML_ID' => 'request-1001'],
    'limit' => 2,
], $userId);

if (count($items) > 1)
{
    throw new \RuntimeException('Найдено несколько заявок с одним внешним идентификатором');
}

$item = $items[0] ?? null;
```

Переменная `$item` содержит найденный элемент или `null`. CRM не проверяет уникальность `XML_ID`, поэтому пример ограничивает выборку двумя записями и отклоняет дубль. Пустой результат означает, что элемент не создан или недоступен пользователю.

### Обработать изменения элементов типа

Для реакции на изменение заявки подпишитесь на событие `onCrmDynamicItemUpdate_<entityTypeId>`. Значение `entityTypeId` возьмите из настроек модуля, где вы сохранили идентификатор созданного типа. Суффикс ограничивает подписку одним смарт-процессом.

Обработчик получает объект `Bitrix\Main\Event` с параметрами `item` и `id`. Событие вызывается после записи и не может отменить сохранение. Перечень событий, пример подписки и ограничения их вызова приведены в статье [События и расширение поведения CRM](./events-and-extension.md#smart-process-events).

## Удалить тип

Сначала удалите элементы типа, иначе метод `delete()` вернет ошибку. Большое число элементов удаляйте порциями, как описано в статье [Работа с элементами CRM](./items.md#process-items-in-batches).

Вместе с типом CRM удаляет его направления, стадии, роботов, связи с другими типами и привязки элементов к другим объектам. Если установлен модуль `bizproc`, CRM удаляет и шаблоны бизнес-процессов.

Элементы в корзине не мешают удалить тип. После удаления типа CRM стирает их фоновым агентом без возможности восстановления.

Удалять тип может администратор CRM или администратор этого типа. Метод `isAdminForEntity()` объекта прав проверяет это право так же, как интерфейс CRM при удалении.

{% note warning "" %}

Удаление типа нельзя отменить. Перед удалением проверьте, что обработчики событий, настройки модуля и связи с внешней системой больше не используют этот `entityTypeId`.

{% endnote %}

**Пример.** Удалите тип `$entityTypeId` от имени пользователя `$userId`, если у него не осталось элементов. Метод фабрики `getItemsCount()` возвращает число элементов типа.

```php
use Bitrix\Crm\Service\Container;

$container = Container::getInstance();
if (!$container->getUserPermissions($userId)->isAdminForEntity($entityTypeId))
{
    throw new \RuntimeException('Нет права удалить смарт-процесс');
}

$type = $container->getTypeByEntityTypeId($entityTypeId);
if ($type === null)
{
    throw new \RuntimeException('Смарт-процесс не найден');
}

$factory = $container->getFactory($entityTypeId);
if ($factory === null || $factory->getItemsCount() > 0)
{
    throw new \RuntimeException('Сначала удалите элементы смарт-процесса');
}

$result = $type->delete();
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

После успешного удаления метод `Container::getTypeByEntityTypeId($entityTypeId)` в следующем хите возвращает `null`. Удалите сохраненный `entityTypeId` из настроек модуля. Новый тип с тем же кодом получит другой `entityTypeId`.

## Получить ссылки на список и карточку

Роутер CRM строит адрес от корня раздела Битрикс24, в котором находится тип. Для типа в CRM корень — `/crm/`. Не собирайте адреса вручную по шаблону `/crm/type/<entityTypeId>/`. Если тип перенесут в другой раздел, такая ссылка перестанет вести на тип.

Метод `Container::getRouter()` возвращает объект `Bitrix\Crm\Service\Router`. Адреса списка и карточки строят четыре метода роутера. Каждый возвращает объект `Bitrix\Main\Web\Uri` или `null`, если адрес построить нельзя.

-  `getItemListUrlInCurrentView($entityTypeId, $categoryId)` — список элементов в представлении, которое пользователь выбрал последним,

-  `getItemListUrl($entityTypeId, $categoryId)` — список элементов в виде таблицы,

-  `getKanbanUrl($entityTypeId, $categoryId)` — канбан по стадиям,

-  `getItemDetailUrl($entityTypeId, $id, $categoryId)` — карточка элемента или форма нового элемента при `$id`, равном нулю.

Аргумент `$categoryId` необязателен. Передайте его, если нужен адрес конкретного направления.

**Пример.** Получите ссылки на список заявок смарт-процесса `$entityTypeId` и на карточку заявки `$itemId` для вывода в интерфейсе модуля.

```php
use Bitrix\Crm\Service\Container;

$router = Container::getInstance()->getRouter();

$listUrl = $router->getItemListUrlInCurrentView($entityTypeId);
$detailUrl = $router->getItemDetailUrl($entityTypeId, $itemId);

$links = [
    'list' => $listUrl === null ? null : (string)$listUrl,
    'detail' => $detailUrl === null ? null : (string)$detailUrl,
];
```

Массив `$links` содержит адрес списка и адрес карточки либо `null`. Перед выводом в HTML экранируйте значения.

## Проверить результат

Сценарий смарт-процесса проходит через тип, связи, элементы и ссылки. Проверьте каждый этап отдельно.

1. Метод `Container::getTypeByEntityTypeId($entityTypeId)` возвращает тип, а поиск по коду находит ровно один тип.

2. Методы фабрики возвращают `true` для включенных настроек.

3. Метод `areTypesBound()` подтверждает связь с нужными типами.

4. Созданный элемент находится по `XML_ID` с учетом прав пользователя.

5. Ссылки роутера открывают список и карточку типа.

Храните `entityTypeId` в настройках модуля, проверяйте возможности типа методами фабрики и получайте адреса только через роутер.

Права пользователей на элементы типа описывает статья [Права доступа в PHP API CRM](./permissions.md).
