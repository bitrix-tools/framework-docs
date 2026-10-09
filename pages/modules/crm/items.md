---
title: Работа с элементами CRM
description: "Чтение, создание, изменение, удаление и конвертация элементов CRM через локальный PHP API."
---

Элемент CRM получают через фабрику его типа, а изменения сохраняют через операцию фабрики. Перед чтением, изменением или удалением определите тип и ID элемента. Для создания достаточно выбрать тип. Общую модель контейнера, фабрики и операции объясняет статья [Схема работы CRM и основные объекты API](./architecture.md).

## Подготовить тип, данные и пользователя {#prepare-type-data-and-user}

Тип элемента определяет фабрику, набор полей и доступные действия. ID записи имеет смысл только вместе с типом. Контакт и сделка с одинаковым числовым ID остаются разными объектами. Для готовых типов используйте константы `CCrmOwnerType`, для смарт-процесса — `entityTypeId` настроенного типа.

Перед выполнением сценария подготовьте входные данные.

#|
|| **Данные** | **Откуда взять** | **Что проверить** ||
|| `entityTypeId` | Константа `CCrmOwnerType` или настройки смарт-процесса | Метод `Container::getFactory()` вернул фабрику ||
|| ID элемента | Ссылка на существующую карточку, результат создания или данные задания | ID относится к выбранному типу и больше нуля ||
|| ID пользователя | Авторизованный пользователь или настройки фонового задания | Права соответствуют чтению либо нужной операции записи ||
|| Значения полей | Проверенные данные приложения | Фабрика этого типа поддерживает поля, а значения соответствуют процессу CRM ||
|#

Операция принимает контекст пользователя. Если передать в `getAddOperation()`, `getUpdateOperation()` или `getDeleteOperation()` объект `Bitrix\Crm\Service\Context` с заданным `userId`, проверки операции используют этого пользователя. Если контекст не задан, он берет пользователя текущего окружения.

Отбор видимых записей при чтении и право выполнить действие — разные проверки. Используйте фильтр по правам для списка и контекст пользователя для операции записи. Выбор предварительной проверки и ограничения доступа к связанным данным приведены в статье [Права доступа в PHP API CRM](./permissions.md).

## Получить элемент или список {#get-items}

Метод `Container::getFactory($entityTypeId)` возвращает фабрику типа. Метод фабрики `getItem($id, $fieldsToSelect = ['*'])` получает один элемент или `null`, если запись не найдена. По умолчанию он загружает все поля. Второй аргумент ограничивает их набор. Для списка используйте `getItems($parameters = [])` с параметрами ORM `filter`, `order`, `limit`, `offset` и `select`. Метод возвращает массив объектов `Item`.

**Пример.** Получите первые 20 сделок с ID больше нуля и соберите их названия в массив `$dealData`. Для передачи данных конкретному пользователю выбирайте элементы с учетом прав, как показано после примера.

```php
if (!\Bitrix\Main\Loader::includeModule('crm'))
{
    throw new \RuntimeException('Не удалось подключить модуль CRM');
}

$factory = \Bitrix\Crm\Service\Container::getInstance()->getFactory(\CCrmOwnerType::Deal);
if ($factory === null)
{
    throw new \RuntimeException('Фабрика сделок недоступна');
}

$deals = $factory->getItems([
    'select' => [\Bitrix\Crm\Item::FIELD_NAME_ID, \Bitrix\Crm\Item::FIELD_NAME_TITLE],
    'filter' => ['>ID' => 0],
    'order' => ['ID' => 'ASC'],
    'limit' => 20,
]);

$dealData = [];
foreach ($deals as $deal)
{
    $dealData[] = [
        'id' => $deal->getId(),
        'title' => $deal->get(\Bitrix\Crm\Item::FIELD_NAME_TITLE),
    ];
}
```

Каждая строка массива `$dealData` содержит ключ `id` с ID сделки и ключ `title` с ее названием. Перед выводом этих данных в HTML экранируйте текстовые значения.

Параметры выборки имеют следующие назначения.

-  `select` — поля для загрузки,

-  `filter` — условия отбора,

-  `order` — порядок записей,

-  `limit` — размер порции,

-  `offset` — число пропускаемых записей.

Если нужны все поля элемента для изменения, получите его отдельно через `getItem()`. При долгой обработке используйте условие по последнему ID из раздела [«Обработать элементы порциями»](#process-items-in-batches).

Методы `getItem()` и `getItems()` сами не отбирают записи по правам пользователя. Для списка, который должен соответствовать правам пользователя, вызовите `getItemsFilteredByPermissions($parameters, $userId)`. Метод применяет фильтр прав и возвращает массив элементов. Для пользователя без авторизации он возвращает пустой массив. Передавайте ID пользователя, когда код работает в фоне.

### Прочитать одну запись с учетом прав {#read-item-with-permissions}

Метод `getItem($id)` подходит для доверенного серверного кода, который уже определил доступ к записи. Если ID пришел из пользовательского запроса, отберите запись через `getItemsFilteredByPermissions()` по этому ID. Пустой результат в таком случае означает, что запись отсутствует либо пользователь не может ее читать. Не выводите пользователю данные, полученные через обычный `getItem()`, до отдельной проверки доступа.

**Пример.** Получите доступную пользователю `$userId` сделку с ID `123`. Подставьте ID сделки из проверенного запроса.

```php
$dealId = 123;
$deals = $factory->getItemsFilteredByPermissions([
    'filter' => ['=ID' => $dealId],
], $userId);

$deal = $deals[0] ?? null;
if ($deal === null)
{
    throw new \RuntimeException('Сделка не найдена или недоступна');
}

$title = $deal->get(\Bitrix\Crm\Item::FIELD_NAME_TITLE);
```

Метод `getItemsFilteredByPermissions()` принимает параметры выборки первым аргументом и ID пользователя вторым. По умолчанию он проверяет право чтения.

**Пример.** Получите первые 20 доступных пользователю сделок с ID больше нуля. Переменная `$userId` содержит ID пользователя, права которого нужно учитывать. Переменная `$factory` обозначает фабрику сделок из предыдущего примера.

```php
$deals = $factory->getItemsFilteredByPermissions([
    'filter' => ['>ID' => 0],
    'order' => ['ID' => 'ASC'],
    'limit' => 20,
], $userId);
```

Если интерфейсу нужно число доступных записей, вызовите `getItemsCountFilteredByPermissions($filter, $userId)`. Передайте тот же фильтр и того же пользователя, что и при выборке списка. Обычный `getItemsCount()` не добавляет ограничение прав автоматически.

**Пример.** Посчитайте сделки с ID больше нуля, доступные пользователю `$userId`. Фабрика `$factory` относится к сделкам.

```php
$filter = ['>ID' => 0];
$total = $factory->getItemsCountFilteredByPermissions($filter, $userId);
```

Переменная `$total` содержит целое число доступных сделок с указанным фильтром. Используйте его для интерфейса с постраничным переходом.

Параметр `offset` пропускает записи перед текущей страницей, а условие `>ID` продолжает чтение после указанной записи. Для большого задания используйте [порционную обработку](#process-items-in-batches).

### Получить элементы разных типов {#get-items-of-different-types}

Если известны несколько пар «тип — ID», сгруппируйте ID по типам и сделайте одну выборку с проверкой прав для каждого типа. Метод `getItemDetailUrl()` формирует адрес карточки с учетом типа элемента и направления. Метод может вернуть `null`, поэтому проверяйте его результат.

**Пример.** Переменная `$identifiers` содержит известные пары «тип — ID», `$userId` — ID пользователя, которому нужно показать карточки. Код получает подписи и ссылки без отдельного запроса к CRM для каждого элемента и отбирает только доступные пользователю записи. Массив `$cards` содержит найденные элементы. Отсутствующие или недоступные ID в него не попадут. Пролог и модуль `crm` уже подключены.

```php
$identifiers = [
    [\CCrmOwnerType::Deal, 123],
    [\CCrmOwnerType::Contact, 456],
];

$container = \Bitrix\Crm\Service\Container::getInstance();
$idsByType = [];
foreach ($identifiers as [$entityTypeId, $itemId])
{
    $idsByType[$entityTypeId][] = $itemId;
}

$cards = [];
foreach ($idsByType as $entityTypeId => $ids)
{
    $factory = $container->getFactory((int)$entityTypeId);
    if ($factory === null)
    {
        continue;
    }

    $items = $factory->getItemsFilteredByPermissions([
        'filter' => ['@ID' => array_unique($ids)],
    ], $userId);

    foreach ($items as $item)
    {
        $url = $container->getRouter()->getItemDetailUrl((int)$entityTypeId, $item->getId());
        $cards[$entityTypeId][$item->getId()] = [
            'title' => $item->getHeading(),
            'url' => $url === null ? null : (string)$url,
        ];
    }
}
```

Каждый найденный элемент записан в `$cards` по типу и ID. Ключ `title` содержит подпись, а ключ `url` — адрес карточки либо `null`. Метод `getHeading()` возвращает подпись элемента с учетом его типа. Она может отсутствовать.

Для карточки в отдельном разделе смарт-процесса маршрут может зависеть от настроек типа. Подробнее о них — в статье [Смарт-процессы](./smart-processes.md).

## Создать элемент {#create-item}

Метод фабрики `createItem($data = [])` создает объект без записи в CRM. Необязательный массив `$data` задает начальные значения полей. Пример ниже устанавливает название отдельно через `Item::set()`. Получите операцию `getAddOperation()` и вызовите `launch()`. Метод `isSuccess()` результата сообщает, завершилась ли операция, а `getErrorMessages()` возвращает сообщения об ошибках. После успешного добавления метод `getId()` созданного объекта возвращает его ID.

Для сделки заранее определите пользователя и доступную ему начальную стадию. Метод `setStartStageIdPermittedForUser($item, $userId)` установит первую разрешенную стадию нового элемента и вернет ее код либо `null`. Если подходящей стадии нет, не запускайте добавление. Операция использует переданный контекст для проверки прав. У разных типов набор обязательных полей может отличаться.

**Пример.** Создайте сделку с названием от имени пользователя `$userId`, который задан кодом приложения и имеет положительный ID. Операция проверит данные и права, запишет элемент и выполнит предусмотренные для сделок связанные действия.

```php
if (!\Bitrix\Main\Loader::includeModule('crm'))
{
    throw new \RuntimeException('Не удалось подключить модуль CRM');
}

$factory = \Bitrix\Crm\Service\Container::getInstance()->getFactory(\CCrmOwnerType::Deal);
if ($factory === null)
{
    throw new \RuntimeException('Фабрика сделок недоступна');
}

$deal = $factory->createItem();
$deal->set(\Bitrix\Crm\Item::FIELD_NAME_TITLE, 'Новая сделка');

$startStageId = $factory->setStartStageIdPermittedForUser($deal, $userId);
if ($startStageId === null)
{
    throw new \RuntimeException('Нет доступной начальной стадии сделки');
}

$context = (new \Bitrix\Crm\Service\Context())->setUserId($userId);
$result = $factory->getAddOperation($deal, $context)->launch();

if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$dealId = $deal->getId();
```

После успешного `launch()` переменная `$dealId` содержит ID сделки. Прочитайте ее по этому ID, когда нужно подтвердить сохраненные значения перед ответом внешней системе.

Для другого типа не копируйте набор полей сделки без проверки. Обязательные поля, стадии и доступные операции могут отличаться. Состав полей и клиентские данные описаны в статье [Поля и данные клиента](./fields-and-client-data.md), выбор направления и стадии — в статье [Направления и стадии](./categories-and-stages.md).

### Проверить результат операции

Перед повторным созданием проверьте фактический ID и состояние CRM. Операция могла сохранить элемент до ошибки связанного действия. Само по себе повторение `createItem()` не защищает от дубля.

Если операция выполняется по пользовательскому запросу, показывайте пользователю понятное сообщение, а технические детали сохраняйте в журнале приложения. Для повторяемого импорта нужен внешний устойчивый ключ и поиск уже созданного элемента перед добавлением, иначе повтор может создать дубль. Для сопоставления записей и восстановления обмена используйте статью [Синхронизация CRM с внешней системой](./synchronization.md#find-item-by-external-key).

## Изменить нужные поля {#update-fields}

Прочитайте существующий элемент через `getItem()`, установите только изменяемые значения и запустите `getUpdateOperation()`. Сам вызов `set()` меняет объект в памяти. Запись и связанные действия происходят при `launch()`. Перед записью сравните новое значение с текущим, если повторный вызов не должен запускать связанные действия без изменения данных.

**Пример.** Измените название существующей сделки от имени пользователя `$userId`. Подставьте ее ID вместо `123`. Переменная `$factory` обозначает фабрику сделок из предыдущего примера. Код выполняется в доверенном серверном обработчике после подключения модуля `crm`.

```php
$dealId = 123;
$deal = $factory->getItem($dealId);
if ($deal === null)
{
    throw new \RuntimeException('Сделка не найдена');
}

$permissions = \Bitrix\Crm\Service\Container::getInstance()->getUserPermissions($userId);
if (!$permissions->item()->canUpdateItem($deal))
{
    throw new \RuntimeException('Нет права изменить сделку');
}

$newTitle = 'Название после проверки';
if ($deal->get(\Bitrix\Crm\Item::FIELD_NAME_TITLE) !== $newTitle)
{
    $deal->set(\Bitrix\Crm\Item::FIELD_NAME_TITLE, $newTitle);
    $context = (new \Bitrix\Crm\Service\Context())->setUserId($userId);
    $result = $factory->getUpdateOperation($deal, $context)->launch();

    if (!$result->isSuccess())
    {
        throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
    }
}
```

Предварительная проверка через `canUpdateItem()` помогает дать ранний отказ. Операция все равно повторно проверяет доступ и данные при `launch()`. Результат этой проверки остается решающим. После успешного вызова перечитайте сделку, если дальнейшее действие зависит от уже сохраненного значения.

### Повторить изменение после ошибки {#retry-update}

Перед повторным запуском после ошибки получите элемент заново и сравните фактическое название с `$newTitle`. Если значение совпало, не выполняйте ту же операцию автоматически. Сначала выясните, какое связанное действие завершилось ошибкой. Для разбора ошибки и проверки связанных действий используйте статью [Производительность и типовые ошибки CRM](./performance-and-errors.md#check-state-before-retry).

Чтение и запись в двух отдельных операциях не дают защиты от параллельного изменения другим процессом. Если для вашей задачи важно не перезаписать чужую правку, согласуйте правило разрешения конфликта в коде приложения и сравните актуальное состояние непосредственно перед запуском операции.

## Изменить состав наблюдателей

Метод `Item::getObservers()` возвращает массив ID пользователей, а `setObservers($observerIds)` задает полный состав наблюдателей. Пользователи, которых нет в переданном массиве, будут удалены из состава. Чтобы добавить одного наблюдателя, сначала прочитайте существующий набор и дополните его. Изменение нужно сохранить через операцию фабрики.

Проверьте поддержку наблюдателей методом `$factory->isObserversEnabled()`. У смарт-процесса она зависит от настройки `IS_OBSERVERS_ENABLED`. Загружайте элемент вместе с наблюдателями. В примере `getItem()` получает полный набор полей, чтобы сохранить существующие связи.

**Пример.** Добавьте пользователя `$observerId` к наблюдателям элемента `$itemId` от имени пользователя `$userId`. Переменная `$factory` содержит фабрику нужного типа, а `$observerId` — проверенный положительный ID пользователя, которого разрешено добавить в вашем сценарии. Код выполняется после подключения модуля `crm`.

```php
use Bitrix\Crm\Service\Container;
use Bitrix\Crm\Service\Context;

if (!$factory->isObserversEnabled())
{
    throw new \RuntimeException('Наблюдатели недоступны для этого типа');
}

$item = $factory->getItem($itemId);
if ($item === null)
{
    throw new \RuntimeException('Элемент не найден');
}

$permissions = Container::getInstance()->getUserPermissions($userId);
if (!$permissions->item()->canUpdateItem($item))
{
    throw new \RuntimeException('Нет права изменить элемент');
}

$observerIds = array_map('intval', $item->getObservers());
$observerId = (int)$observerId;
if (!in_array($observerId, $observerIds, true))
{
    $observerIds[] = $observerId;
    $item->setObservers($observerIds);

    $context = (new Context())->setUserId($userId);
    $result = $factory->getUpdateOperation($item, $context)->launch();
    if (!$result->isSuccess())
    {
        throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
    }
}
```

Чтобы удалить одного наблюдателя, исключите его ID из прочитанного массива через `array_values(array_diff($observerIds, [$observerId]))` и передайте результат в `setObservers()`. Чтобы очистить состав, вызовите `setObservers([])`. В обоих случаях сохраните элемент через `getUpdateOperation()` и проверьте результат `launch()`.

После сохранения перечитайте элемент и проверьте `getObservers()`. При добавлении новый ID должен присутствовать вместе с прежними, при удалении остальные ID должны сохраниться. Если состав наблюдателей могут менять параллельно, согласуйте правило разрешения конфликта, как при [изменении других полей](#retry-update).

## Удалить элемент {#delete-item}

Для удаления получите элемент и передайте его в `getDeleteOperation()`. Метод `launch()` проверит доступ и вернет результат. Предварительную проверку права можно выполнить через `Container::getUserPermissions($userId)->item()->canDeleteItem($item)`, но она не заменяет проверку операции.

Последствия удаления зависят от типа и настроек CRM. Фабрика может добавить перенос записи в корзину либо очистку связанных данных. Отсутствие элемента в обычной выборке после операции подтверждает удаление из активных записей, но не определяет возможность восстановления. Перед массовым удалением проверьте поведение на тестовом элементе.

**Пример.** Удалите сделку с известным ID от имени пользователя `$userId`. Переменная `$factory` обозначает фабрику сделок.

```php
$dealId = 123;
$deal = $factory->getItem($dealId);
if ($deal === null)
{
    throw new \RuntimeException('Сделка не найдена');
}

$permissions = \Bitrix\Crm\Service\Container::getInstance()->getUserPermissions($userId);
if (!$permissions->item()->canDeleteItem($deal))
{
    throw new \RuntimeException('Нет права удалить сделку');
}

$context = (new \Bitrix\Crm\Service\Context())->setUserId($userId);
$result = $factory->getDeleteOperation($deal, $context)->launch();
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$deleted = $factory->getItem($dealId) === null;
```

Переменная `$deleted` показывает результат повторного чтения. Проверьте, что она равна `true`. Если операция завершилась ошибкой, перечитайте элемент перед повторной попыткой. Удаление и последующая очистка могут завершиться на разных этапах. Для пользовательского запроса отдельно проверяйте право чтения, иначе отсутствие элемента и запрет доступа можно спутать.

## Конвертировать лид {#convert-lead}

Конвертация лида создает или связывает целевые объекты и переносит данные по конфигурации преобразования. Смена статуса лида через `set()` не выполняет эти действия. Для сценария с лидом используйте `LeadConversionConfig` и `LeadConversionWizard`. Конфигурация задает активные целевые типы, мастер выполняет конвертацию и возвращает ее результат.

Карта конвертации сопоставляет поля источника и результата. Например, она переносит `NAME` лида в `NAME` контакта, а `TITLE` лида — в `TITLE` сделки. Для пользовательских полей карта учитывает настроенные соответствия между типами. Перед автоматической конвертацией проверьте обязательные поля целевых объектов. Если для них нужны дополнительные значения, автоматическое создание может завершиться ошибкой.

Мастер проверяет права текущего авторизованного пользователя. Если ID лида пришел из пользовательского запроса, проверьте право чтения до `resolveByEntityID()`. Этот метод определяет тип лида без фильтра по правам. Для конвертации также нужны права на изменение лида и создание целевых объектов.

**Пример.** Конвертируйте обычный лид в контакт и сделку. Код запускается после подключения пролога и модуля `crm` от авторизованного пользователя, которому доступны чтение и изменение лида, а также создание целевых объектов. Подставьте ID лида своей установки. Переменная `$userId` содержит ID текущего пользователя.

```php
$leadId = 123;
$leadFactory = \Bitrix\Crm\Service\Container::getInstance()->getFactory(\CCrmOwnerType::Lead);
if ($leadFactory === null || $leadFactory->getItemsFilteredByPermissions([
    'filter' => ['=ID' => $leadId],
], $userId) === [])
{
    throw new \RuntimeException('Лид не найден или недоступен');
}

$typeId = \Bitrix\Crm\Conversion\LeadConversionType::resolveByEntityID($leadId);
if ($typeId !== \Bitrix\Crm\Conversion\LeadConversionType::GENERAL)
{
    throw new \RuntimeException('Нужна другая схема конвертации лида');
}

$config = \Bitrix\Crm\Conversion\LeadConversionConfig::getDefault([
    'TYPE_ID' => $typeId,
]);
$config->getItem(\CCrmOwnerType::Company)->setActive(false);

$wizard = new \Bitrix\Crm\Conversion\LeadConversionWizard($leadId, $config);
if (!$wizard->execute())
{
    throw new \RuntimeException($wizard->getErrorText());
}

$resultIds = $wizard->getResultData();
$contactId = (int)($resultIds[\CCrmOwnerType::ContactName] ?? 0);
$dealId = (int)($resultIds[\CCrmOwnerType::DealName] ?? 0);
if ($contactId <= 0 || $dealId <= 0)
{
    throw new \RuntimeException('Конвертация не вернула ID контакта и сделки');
}
```

Массив `$resultIds` содержит результаты по типам. Переменные `$contactId` и `$dealId` получают ID контакта и сделки. Код проверяет оба ID перед дальнейшей работой с ними.

Метод `resolveByEntityID()` определяет тип преобразования по данным лида. Значение `GENERAL` обозначает обычный сценарий. Для возвращающегося клиента и уже успешного лида действуют другие конфигурации. Ключ `TYPE_ID` передает выбранный тип методу `getDefault()`. Метод включает доступные целевые типы для обычного лида, после чего пример отключает создание компании.

### Конвертировать повторный или успешный лид

Для повторного лида `RETURNING_CUSTOMER` и лида в успешном статусе `SUPPLEMENT` метод `LeadConversionConfig::getDefault()` активирует только сделку как целевой объект. Передайте полученный тип в `TYPE_ID`. Конфигурация обычного лида здесь не подходит. Если `resolveByEntityID()` вернул `UNDEFINED`, сначала проверьте ID и существование лида.

**Пример.** Создайте сделку из лида возвращающегося клиента или уже успешного лида. Подставьте ID лида своей установки. Переменная `$userId` содержит ID текущего пользователя. Код запускается после подключения пролога и модуля `crm` от пользователя с правами на чтение и изменение лида, а также создание сделки.

```php
$leadId = 123;
$leadFactory = \Bitrix\Crm\Service\Container::getInstance()->getFactory(\CCrmOwnerType::Lead);
if ($leadFactory === null || $leadFactory->getItemsFilteredByPermissions([
    'filter' => ['=ID' => $leadId],
], $userId) === [])
{
    throw new \RuntimeException('Лид не найден или недоступен');
}

$typeId = \Bitrix\Crm\Conversion\LeadConversionType::resolveByEntityID($leadId);
if (!in_array($typeId, [
    \Bitrix\Crm\Conversion\LeadConversionType::RETURNING_CUSTOMER,
    \Bitrix\Crm\Conversion\LeadConversionType::SUPPLEMENT,
], true))
{
    throw new \RuntimeException('Для этого лида нужна другая схема конвертации');
}

$config = \Bitrix\Crm\Conversion\LeadConversionConfig::getDefault([
    'TYPE_ID' => $typeId,
]);
$wizard = new \Bitrix\Crm\Conversion\LeadConversionWizard($leadId, $config);
if (!$wizard->execute())
{
    throw new \RuntimeException($wizard->getErrorText());
}

$resultIds = $wizard->getResultData();
$dealId = (int)($resultIds[\CCrmOwnerType::DealName] ?? 0);
if ($dealId <= 0)
{
    throw new \RuntimeException('Конвертация не вернула ID сделки');
}
```

Код проверяет `$dealId` перед дальнейшей работой со сделкой. Мастер возвращает результат по целевым типам. В этой конфигурации активна только сделка. Если операция завершилась ошибкой, проверьте состояние лида и созданные связи до повторного вызова.

### Использовать существующий контакт

Если контакт уже найден, передайте его ID в массив параметров конвертации для `execute()`. Этот массив не является объектом `Service\Context`, который используют операции фабрики. В конфигурации обычного лида контакт активен как целевой тип. Константа `CCrmOwnerType::ContactName` задает ключ `CONTACT`.

При `MODE => 'LINK'` и `ENABLE_MERGE => true` мастер может обновить поля этого контакта данными лида. До запуска сравните данные и проверьте право текущего пользователя на изменение контакта. Ключ `USER_ID` передается связанным действиям и не переключает пользователя, чьи права проверяет мастер. При выборе контакта заранее определите правило поиска дублей в коде приложения.

**Пример.** Конвертируйте обычный лид с привязкой к существующему контакту. Подставьте ID лида и контакта своей установки. Переменная `$userId` должна содержать ID текущего авторизованного пользователя с нужными правами. Пролог и модуль `crm` уже подключены. До запуска проверьте, не привязан ли к лиду другой контакт. Мастер может сохранить уже существующую привязку вместо переданного ID.

```php
$leadId = 123;
$existingContactId = 456;
if ($existingContactId <= 0)
{
    throw new \RuntimeException('Укажите ID контакта');
}

// Проверяем выбранный контакт и право на изменение
$container = \Bitrix\Crm\Service\Container::getInstance();
$contactFactory = $container->getFactory(\CCrmOwnerType::Contact);
if ($contactFactory === null)
{
    throw new \RuntimeException('Фабрика контактов недоступна');
}

$contacts = $contactFactory->getItemsFilteredByPermissions([
    'filter' => ['=ID' => $existingContactId],
], $userId);
$contact = $contacts[0] ?? null;
if ($contact === null || !$container->getUserPermissions($userId)->item()->canUpdateItem($contact))
{
    throw new \RuntimeException('Контакт недоступен для изменения');
}

// Проверяем доступ к лиду
$leadFactory = $container->getFactory(\CCrmOwnerType::Lead);
if ($leadFactory === null || $leadFactory->getItemsFilteredByPermissions([
    'filter' => ['=ID' => $leadId],
], $userId) === [])
{
    throw new \RuntimeException('Лид не найден или недоступен');
}

// Ищем контакты, которые уже созданы из лида
$boundResult = \CCrmContact::GetListEx(
    [],
    ['=LEAD_ID' => $leadId, 'CHECK_PERMISSIONS' => 'N'],
    false,
    false,
    ['ID']
);
if ($boundResult === false)
{
    throw new \RuntimeException('Не удалось проверить связь лида с контактом');
}
while ($boundContact = $boundResult->Fetch())
{
    if ((int)$boundContact['ID'] !== $existingContactId)
    {
        throw new \RuntimeException('С лидом уже связан другой контакт');
    }
}

// Определяем схему конвертации
$typeId = \Bitrix\Crm\Conversion\LeadConversionType::resolveByEntityID($leadId);
if ($typeId !== \Bitrix\Crm\Conversion\LeadConversionType::GENERAL)
{
    throw new \RuntimeException('Нужна другая схема конвертации лида');
}

// Настраиваем целевые объекты
$config = \Bitrix\Crm\Conversion\LeadConversionConfig::getDefault([
    'TYPE_ID' => $typeId,
]);
$config->getItem(\CCrmOwnerType::Company)->setActive(false);

// Передаем существующий контакт мастеру
$wizard = new \Bitrix\Crm\Conversion\LeadConversionWizard($leadId, $config);
$contextData = [
    \CCrmOwnerType::ContactName => $existingContactId,
    'ENABLE_MERGE' => true,
    'USER_ID' => $userId,
    'MODE' => 'LINK',
];

// Запускаем конвертацию
if (!$wizard->execute($contextData))
{
    throw new \RuntimeException($wizard->getErrorText());
}

// Проверяем фактическую связь с контактом
$resultIds = $wizard->getResultData();
$resultContactId = (int)($resultIds[\CCrmOwnerType::ContactName] ?? 0);
if ($resultContactId !== $existingContactId)
{
    throw new \RuntimeException('Лид связан с другим контактом');
}
```

Запрос по `LEAD_ID` обнаруживает ранее созданный из лида контакт. Мастер использует его ID до чтения переданного `CONTACT`. Проверка `$resultContactId` после выполнения подтверждает фактический результат.

Это альтернативный запуск мастера. Не вызывайте `execute()` сначала без контекста, а затем повторно с ним для того же лида. При ошибке проверьте результат `getResultData()` и созданные связи до повтора. Конвертация состоит из нескольких действий. Метод `getErrorText()` возвращает текст ошибки, которую сохранил мастер.

## Обработать элементы порциями {#process-items-in-batches}

Для большого списка задайте устойчивый порядок по ID и ограничьте размер выборки. Журнал задания позволит продолжить работу после сбоя с сохраненной позиции.

Не отключайте проверки, события и автоматизацию ради скорости. Операция выполняет связанные действия, которые могут быть обязательны для CRM.

Журнал задания должен содержать следующие данные.

-  тип элемента и фильтр — чтобы повторить выборку того же набора,

-  верхний ID `$upperId` — чтобы не включать записи, созданные после начала запуска,

-  последний обработанный ID `$lastId` — чтобы продолжить обход с сохраненной позиции,

-  неуспешные ID и ошибки — чтобы повторить проблемные операции после проверки фактического состояния.

Пример обрабатывает данные в памяти одного запуска и сам не возобновляет задание после сбоя. Чтобы добавить возобновление, сохраняйте результат элемента и новую контрольную точку в постоянном журнале одной транзакцией до перехода к следующему ID. При первом запуске `$lastId` равен нулю, при продолжении возьмите `$lastId` и `$upperId` из журнала.

**Пример.** Удалите пробелы по краям названий сделок порциями по 100 элементов от имени пользователя `$userId`. Массивы `$succeededIds` и `$failed` собирают результаты текущего запуска. Код выполняется после подключения пролога и модуля `crm`.

```php
$factory = \Bitrix\Crm\Service\Container::getInstance()->getFactory(\CCrmOwnerType::Deal);
if ($factory === null)
{
    throw new \RuntimeException('Фабрика сделок недоступна');
}

$lastId = 0; // При продолжении возьмите ID из журнала
$upperId = null; // При продолжении возьмите границу из журнала
$limit = 100;
$succeededIds = [];
$failed = [];
$context = (new \Bitrix\Crm\Service\Context())->setUserId($userId);

if ($upperId === null)
{
    $latest = $factory->getItemsFilteredByPermissions([
        'select' => [\Bitrix\Crm\Item::FIELD_NAME_ID],
        'order' => ['ID' => 'DESC'],
        'limit' => 1,
    ], $userId);
    $upperId = $latest === [] ? 0 : $latest[0]->getId();
}

do
{
    $deals = $factory->getItemsFilteredByPermissions([
        'filter' => ['>ID' => $lastId, '<=ID' => $upperId],
        'order' => ['ID' => 'ASC'],
        'limit' => $limit,
    ], $userId);

    foreach ($deals as $deal)
    {
        $title = (string)$deal->get(\Bitrix\Crm\Item::FIELD_NAME_TITLE);
        $normalizedTitle = trim($title);

        if ($normalizedTitle !== $title && $normalizedTitle !== '')
        {
            $deal->set(\Bitrix\Crm\Item::FIELD_NAME_TITLE, $normalizedTitle);
            $result = $factory->getUpdateOperation($deal, $context)->launch();
            if (!$result->isSuccess())
            {
                $failed[$deal->getId()] = $result->getErrorMessages();
            }
            else
            {
                $succeededIds[] = $deal->getId();
            }
        }

        $nextLastId = $deal->getId();
        // Для возобновления атомарно сохраните результат элемента и $nextLastId в журнале
        $lastId = $nextLastId;
    }
}
while (count($deals) === $limit);
```

Массив `$failed` позволяет отдельно повторить неуспешные элементы, а повторное применение `trim()` к уже нормализованному названию не меняет его. Метод `getItemsFilteredByPermissions()` ограничивает чтение доступными пользователю записями. Операция изменения отдельно проверяет право записи для каждого элемента.

### Повторить неуспешную порцию

После сбоя получите из постоянного журнала границу `$upperId`, контрольную точку `$lastId` и список неуспешных ID. Сначала разберите неуспешные операции. Повторно прочитайте каждую сделку и проверьте, не сохранилось ли нормализованное название до ошибки связанного действия.

Затем продолжите основную выборку с условием `>ID` от сохраненной точки. Новый запуск с `$upperId`, взятым из CRM заново, уже будет другим заданием и может захватить новые элементы.

Перед обработкой большого набора измерьте длительность и нагрузку на тестовой установке по статье [Производительность и типовые ошибки CRM](./performance-and-errors.md#measure-load). Если задание получает данные из внешней системы, сохраняйте соответствие внешнего ключа и ID элемента вместе с результатами обработки.
