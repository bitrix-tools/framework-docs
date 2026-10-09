---
title: Поля и данные клиента
description: "Состав и обязательность полей элемента CRM, подготовка значений, телефоны и email, реквизиты, банковские реквизиты, адреса и пользовательские поля в локальном PHP API."
---

Данные клиента в CRM хранятся в нескольких местах. Поля элемента, включая пользовательские, читает и сохраняет фабрика типа через операцию. Телефоны и email хранятся отдельно от записи элемента, но меняются через ту же операцию. Реквизиты, банковские реквизиты и адреса контакта и компании образуют собственные записи со своим API — классами `EntityRequisite`, `EntityBankDetail` и `RequisiteAddress`.

Примеры выполняются после подключения [пролога](./../../framework/request-lifecycle.md) и модуля `crm`. Переменная `$userId` содержит ID пользователя, от имени которого код читает и меняет данные. Общий маршрут «фабрика — элемент — операция» и проверка результата описаны в статьях [Схема работы CRM и основные объекты API](./architecture.md) и [Работа с элементами CRM](./items.md).

## Определить состав полей элемента {#item-fields}

Состав полей зависит от типа элемента и его настроек. Перед чтением или записью получите описание полей у фабрики выбранного типа, а не переносите список с другого типа. Затем определите обязательные поля конкретной операции и приведите значения к формату поля.

### Получить описания полей

Метод `Factory::getFieldsCollection()` возвращает коллекцию `Bitrix\Crm\Field\Collection` со всеми полями типа, включая пользовательские. Коллекция не зависит от прав пользователя и содержит поля, скрытые от него в интерфейсе. Метод `Factory::getFieldsInfo()` возвращает массив описаний только системных полей и подходит, если пользовательские поля не нужны. Назначение системных полей готовых типов приведено в разделе [«Системные поля элементов CRM»](./architecture.md#system-fields).

Объект `Bitrix\Crm\Field` описывает одно поле.

-  `getName()` — имя поля, например `TITLE`, `FM` или `UF_CRM_...`.

-  `getTitle()` — подпись поля.

-  `getType()` — тип данных. Для системных полей это константы `Field::TYPE_*`, например `string` или `crm_multifield`. Для пользовательского поля — ID пользовательского типа, например `string` или `enumeration`.

-  `isMultiple()` — признак множественного поля.

-  `isRequired()` — признак обязательности в описании поля.

-  `isUserField()` — признак пользовательского поля.

-  `isValueCanBeChanged()` — признак поля, значение которого можно менять. Метод возвращает `false` для полей только для чтения и неизменяемых полей.

**Пример.** Соберите описания полей контакта в массив `$fields`.

```php
if (!\Bitrix\Main\Loader::includeModule('crm'))
{
    throw new \RuntimeException('Не удалось подключить модуль CRM');
}

$contactFactory = \Bitrix\Crm\Service\Container::getInstance()->getFactory(\CCrmOwnerType::Contact);
if ($contactFactory === null)
{
    throw new \RuntimeException('Фабрика контактов недоступна');
}

$fields = [];
foreach ($contactFactory->getFieldsCollection() as $field)
{
    $fields[$field->getName()] = [
        'title' => $field->getTitle(),
        'type' => $field->getType(),
        'multiple' => $field->isMultiple(),
        'required' => $field->isRequired(),
        'userField' => $field->isUserField(),
        'editable' => $field->isValueCanBeChanged(),
    ];
}
```

Ключи массива `$fields` — имена полей. Значение по каждому ключу содержит подпись, тип и признаки поля. Чтобы проверить одно поле, вызовите `getFieldsCollection()->getField($fieldName)`. Метод возвращает объект `Field` или `null`, если у типа нет такого поля.

### Найти обязательные поля для операции {#required-operation-fields}

Признак `isRequired()` отражает только обязательность, заданную в описании поля. Поле может стать обязательным и по настройкам карточки, в том числе только на определенной стадии. Полный список для конкретного сохранения возвращает метод `getRequiredFields()` операции.

Метод учитывает тип элемента, направление, стадию, видимость полей для пользователя из контекста и вид операции.

-  При создании метод возвращает все обязательные поля.

-  При изменении без смены стадии метод возвращает только обязательные поля, значения которых изменились в `Item`.

-  При смене стадии в том же направлении метод возвращает все обязательные поля новой стадии.

-  При смене направления метод возвращает только измененные обязательные поля. Порядок такого переноса описан в разделе [«Учесть подбор стадии и обязательные поля»](./categories-and-stages.md#stage-selection-and-required-fields).

Для телефона и email метод возвращает имена типов способов связи, например `PHONE` или `EMAIL`, а не имя поля `FM`.

**Пример.** Получите обязательные поля для создания контакта от имени пользователя `$userId`. Переменная `$contactFactory` обозначает фабрику контактов из предыдущего примера.

```php
$newContact = $contactFactory->createItem();
$context = (new \Bitrix\Crm\Service\Context())->setUserId($userId);

$requiredFields = $contactFactory->getAddOperation($newContact, $context)->getRequiredFields();
```

Массив `$requiredFields` содержит имена полей, которые нужно заполнить перед `launch()`. Для типа со стадиями сначала задайте направление и стадию элемента — от них зависит результат. Выбор направления и стадии описан в статье [Направления и стадии](./categories-and-stages.md). Если обязательное поле осталось пустым, `launch()` вернет ошибку в `Result`, и элемент не сохранится.

### Подготовить значения для записи

Метод `Item::set()` меняет значение поля в памяти. Формат значения зависит от поля.

-  Множественное поле принимает массив значений. Для обычного множественного поля `Item::set()` удаляет пустые элементы массива.

-  Поле `FM` принимает только объект `Bitrix\Crm\Multifield\Collection`. Для массива метод выбрасывает исключение `ArgumentTypeException`. Работа с этим полем описана в разделе [«Обновить телефоны и email»](#update-phones-and-email).

-  Пользовательское поле принимает значение в формате своего пользовательского типа. Поле типа «Список» `enumeration` хранит целочисленный ID варианта, а не его текст. Форматы типов описаны в статье [Пользовательские поля](./../../cms-basics/userfields.md).

-  Поля клиента `COMPANY_ID`, `CONTACT_IDS` и привязки контактов и компаний хранят связи между элементами. Порядок их изменения без потери других связей описан в статье [Связи между элементами](./relations.md).

Операция не сохраняет изменение поля только для чтения и не возвращает ошибку. Для нового элемента она подставляет значение по умолчанию. Неизменяемое поле можно задать при создании, а при изменении операция возвращает ему прежнее значение. Проверяйте `isValueCanBeChanged()` до записи, чтобы не потерять данные без сообщения.

**Пример.** Перенесите значения из массива `$values` в существующий контакт `$contact`. Контакт прочитан с учетом прав пользователя через `getItemsFilteredByPermissions()`, как в разделе [«Прочитать одну запись с учетом прав»](./items.md#read-item-with-permissions). Ключи `$values` — имена полей, значения — данные из проверенного запроса.

```php
$fieldsCollection = $contactFactory->getFieldsCollection();
$preparedValues = [];
foreach ($values as $fieldName => $value)
{
    $field = $fieldsCollection->getField($fieldName);
    if ($field === null || !$field->isValueCanBeChanged())
    {
        throw new \RuntimeException('Поле нельзя изменить: ' . $fieldName);
    }

    if ($fieldName === \Bitrix\Crm\Item::FIELD_NAME_FM)
    {
        throw new \RuntimeException('Способы связи меняйте через коллекцию FM');
    }

    $preparedValues[$fieldName] = ($field->isMultiple() && !is_array($value)) ? [$value] : $value;
}

foreach ($preparedValues as $fieldName => $value)
{
    $contact->set($fieldName, $value);
}
```

Первый цикл проверяет все поля и останавливается на первом неизвестном или неизменяемом поле до изменения контакта. Второй цикл переносит значения в объект `$contact` в памяти. Сохраните их операцией изменения, как показано в статье [Работа с элементами CRM](./items.md#update-fields).

## Обновить телефоны и email {#update-phones-and-email}

Телефоны, email, сайты и мессенджеры контакта, компании и лида хранятся в поле `FM`. Поле содержит коллекцию `Bitrix\Crm\Multifield\Collection` из объектов `Bitrix\Crm\Multifield\Value`. Сначала прочитайте текущий набор, затем измените его и передайте целиком. Перед добавлением значения проверьте дубли в этом элементе и в других элементах CRM.

Значение `Value` состоит из нескольких частей.

-  `getId()` — ID сохраненного значения. У нового значения ID равен `null`.

-  `getTypeId()` — тип способа связи. Метод возвращает `PHONE`, `EMAIL`, `WEB`, `IM` или `LINK`. Константы находятся в классах `Bitrix\Crm\Multifield\Type\Phone`, `Email`, `Web`, `Im` и `Link`, например `Email::ID`.

-  `getValueType()` — вид значения. Для телефона доступны `WORK`, `MOBILE`, `FAX`, `HOME`, `PAGER`, `MAILING` и `OTHER`, для email — `WORK`, `HOME`, `MAILING` и `OTHER`. Константы вида `Phone::VALUE_TYPE_MOBILE` находятся в тех же классах.

-  `getValue()` — сам телефон, адрес email или другое значение.

Новое значение задают методами `setTypeId()`, `setValueType()` и `setValue()`. Каждый метод возвращает тот же объект `Value`, поэтому вызовы можно объединить в цепочку.

### Прочитать способы связи

Метод `Item::getFm()` возвращает копию коллекции. Изменения в ней не попадают в элемент, пока вы не передадите коллекцию в `setFm()`. Метод `filterByType($typeId)` возвращает новую коллекцию со значениями одного типа.

**Пример.** Получите email контакта с ID `456`, доступного пользователю `$userId`, и соберите их в массив `$emails`.

```php
$contactId = 456;
$contactFactory = \Bitrix\Crm\Service\Container::getInstance()->getFactory(\CCrmOwnerType::Contact);
if ($contactFactory === null)
{
    throw new \RuntimeException('Фабрика контактов недоступна');
}

$contacts = $contactFactory->getItemsFilteredByPermissions([
    'filter' => ['=ID' => $contactId],
], $userId);
$contact = $contacts[0] ?? null;
if ($contact === null)
{
    throw new \RuntimeException('Контакт не найден или недоступен');
}

$emails = [];
foreach ($contact->getFm()->filterByType(\Bitrix\Crm\Multifield\Type\Email::ID) as $value)
{
    $emails[] = [
        'id' => $value->getId(),
        'valueType' => $value->getValueType(),
        'value' => $value->getValue(),
    ];
}
```

Каждая строка `$emails` содержит ID значения, его вид и адрес. ID понадобится, чтобы изменить или удалить конкретное значение. Если контакт недоступен пользователю, код останавливается до чтения способов связи.

### Добавить значение без потери существующих {#append-communication}

Операция сохраняет коллекцию `FM` как полный набор. Значения, которых нет в переданной коллекции, CRM удаляет. Добавляйте новое значение в коллекцию из `getFm()`, а не в новую пустую коллекцию.

Метод `Collection::add()` не добавляет значение, если в коллекции уже есть значение с тем же типом, видом и строкой. Сравнение точное. Адреса `Info@example.com` и `info@example.com` метод считает разными, как и одинаковый email с разным видом. Приводите значения к одному виду в коде приложения перед сравнением.

Операция проверяет значения перед сохранением. Она возвращает ошибку для пустого значения, для значения длиннее 250 символов и для email в неверном формате. Проверка охватывает весь набор, включая сохраненные ранее значения. Некорректный старый email тоже остановит изменение контакта.

**Пример.** Добавьте рабочий email контакту `$contact` из предыдущего примера, если такого адреса у него еще нет. Переменная `$inputEmail` содержит адрес из проверенного запроса, `$contactFactory` — фабрику контактов. Операция выполняется от имени пользователя `$userId`.

```php
$newEmail = mb_strtolower(trim($inputEmail));
$fm = $contact->getFm();

$isEmailExists = false;
foreach ($fm->filterByType(\Bitrix\Crm\Multifield\Type\Email::ID) as $value)
{
    if (mb_strtolower(trim((string)$value->getValue())) === $newEmail)
    {
        $isEmailExists = true;
        break;
    }
}

if (!$isEmailExists)
{
    $fm->add(
        (new \Bitrix\Crm\Multifield\Value())
            ->setTypeId(\Bitrix\Crm\Multifield\Type\Email::ID)
            ->setValueType(\Bitrix\Crm\Multifield\Type\Email::VALUE_TYPE_WORK)
            ->setValue($newEmail)
    );
    $contact->setFm($fm);

    $context = (new \Bitrix\Crm\Service\Context())->setUserId($userId);
    $result = $contactFactory->getUpdateOperation($contact, $context)->launch();
    if (!$result->isSuccess())
    {
        throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
    }
}
```

После успешного `launch()` контакт содержит прежние способы связи и новый адрес. Операция сама проверяет право изменить контакт. CRM сохраняет способы связи после основной записи контакта. Если `Result` содержит ошибку, перечитайте контакт перед повтором — поля контакта уже могли сохраниться.

Чтение коллекции и ее запись не блокируют контакт. CRM добавляет, меняет и удаляет значения по разнице с набором, который прочитал этот процесс. Значение, добавленное другим процессом после чтения, сохранится. Если два процесса одновременно меняют или удаляют одно и то же сохраненное значение, останется результат последней записи. Для параллельной обработки получите контакт заново непосредственно перед изменением и выполняйте изменения одного контакта последовательно.

### Изменить или удалить значение

Чтобы изменить сохраненное значение, найдите его по ID методом `Collection::getById()` и поменяйте нужные части. Метод `removeById()` удаляет значение из коллекции. В обоих случаях передайте измененную коллекцию в `setFm()` и запустите операцию изменения.

**Пример.** Сделайте телефон с ID `789` мобильным, а email с ID `790` удалите. ID значений получите при чтении способов связи. Контакт `$contact` уже прочитан с учетом прав, переменная `$contactFactory` обозначает фабрику контактов.

```php
$phoneValueId = 789;
$emailValueId = 790;
$fm = $contact->getFm();

$phone = $fm->getById($phoneValueId);
if ($phone === null || $phone->getTypeId() !== \Bitrix\Crm\Multifield\Type\Phone::ID)
{
    throw new \RuntimeException('Телефон не найден у контакта');
}
$phone->setValueType(\Bitrix\Crm\Multifield\Type\Phone::VALUE_TYPE_MOBILE);

$email = $fm->getById($emailValueId);
if ($email === null || $email->getTypeId() !== \Bitrix\Crm\Multifield\Type\Email::ID)
{
    throw new \RuntimeException('Email не найден у контакта');
}
$fm->removeById($emailValueId);
$contact->setFm($fm);

$context = (new \Bitrix\Crm\Service\Context())->setUserId($userId);
$result = $contactFactory->getUpdateOperation($contact, $context)->launch();
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

После успешного `launch()` у телефона изменится вид, email с ID `790` исчезнет, а остальные значения сохранятся. Если набор не изменился, операция завершится успешно без сохранения. Проверьте результат повторным чтением контакта.

### Проверить дубли в других элементах {#check-duplicates}

Класс `Bitrix\Crm\Integrity\DuplicateCommunicationCriterion` ищет элементы с тем же телефоном или email по индексу дубликатов. Тот же поиск находит клиента по входящему телефону или email. Операции создания и изменения обновляют этот индекс. Перед поиском класс нормализует значение. Номер телефона класс приводит к цифрам в международном формате без добавочного номера. У email класс убирает пробелы по краям и приводит его к нижнему регистру.

Конструктор принимает тип способа связи и значение. Для типа используйте константы `Bitrix\Crm\CommunicationType::PHONE_NAME` и `CommunicationType::EMAIL_NAME`. Метод `find($entityTypeId, $limit)` возвращает объект `Duplicate` или `null`, если совпадений нет. Чтобы искать сразу среди лидов, контактов и компаний, передайте тип `\CCrmOwnerType::Undefined`. Метод `getEntityIDsByType()` объекта `Duplicate` возвращает ID найденных элементов одного типа.

Поиск не учитывает права пользователя. Перед показом совпадений отберите из найденных ID доступные элементы.

**Пример.** Найдите другие контакты с адресом `$newEmail`, доступные пользователю `$userId`. Переменная `$newEmail` содержит нормализованный адрес из раздела [«Добавить значение без потери существующих»](#append-communication), `$contactId` — ID текущего контакта, `$contactFactory` — фабрику контактов.

```php
$criterion = new \Bitrix\Crm\Integrity\DuplicateCommunicationCriterion(
    \Bitrix\Crm\CommunicationType::EMAIL_NAME,
    $newEmail
);
$duplicate = $criterion->find(\CCrmOwnerType::Contact, 20);

$duplicateIds = $duplicate === null ? [] : $duplicate->getEntityIDsByType(\CCrmOwnerType::Contact);
$duplicateIds = array_values(array_diff($duplicateIds, [$contactId]));

$duplicateContacts = $duplicateIds === [] ? [] : $contactFactory->getItemsFilteredByPermissions([
    'select' => [\Bitrix\Crm\Item::FIELD_NAME_ID],
    'filter' => ['@ID' => $duplicateIds],
], $userId);
```

Массив `$duplicateContacts` содержит доступные пользователю контакты с тем же email, кроме текущего. Поиск возвращает не больше 20 совпадений, включая текущий контакт. Совпадение способа связи не доказывает, что это тот же клиент. Решение о слиянии или связывании примите по правилам приложения. Для обмена с внешней системой надежнее хранить внешний ключ записи. Сопоставление записей при импорте описано в статье [Синхронизация CRM с внешней системой](./synchronization.md).

## Работать с реквизитами и адресами {#requisites-and-addresses}

Реквизиты есть только у контакта и компании. Они не входят в поля `Item` и не сохраняются операцией фабрики. Сначала определите, какой объект хранит нужное значение, затем прочитайте текущие данные и меняйте их через API этого объекта.

### Различить поля, реквизиты и адреса

Каждый вид данных имеет своего владельца и свой класс.

#|
|| **Данные** | **Владелец** | **Класс** | **Что учесть** ||
|| Поля элемента | Контакт, компания или другой элемент CRM | Фабрика и операция | Операция проверяет права и обязательные поля ||
|| Реквизит | Контакт или компания | `Bitrix\Crm\EntityRequisite` | Набор полей `RQ_*` задает шаблон реквизита. Методы записи не проверяют права пользователя ||
|| Банковский реквизит | Реквизит | `Bitrix\Crm\EntityBankDetail` | Владельца задают тип `CCrmOwnerType::Requisite` и ID реквизита ||
|| Адрес | Реквизит | `Bitrix\Crm\RequisiteAddress` | Тип адреса задают константы `Bitrix\Crm\EntityAddressType`, например `Primary` — фактический адрес или `Registered` — юридический адрес ||
|#

У реквизита и банковского реквизита обязательно поле `NAME` — название записи. Передайте для реквизита ID шаблона `PRESET_ID`. Без него реквизит сохранится с шаблоном `0`, то есть без страны и состава полей. Шаблон определяет страну и состав полей `RQ_*`, поэтому одно и то же поле доступно не во всех шаблонах.

Методы выборки и записи реквизитов и банковских реквизитов вызывайте у объекта класса, а не статически. Объект возвращает метод `getSingleInstance()`, например `EntityRequisite::getSingleInstance()->add($fields)`. Остальные методы, которые в примерах кода вызываются через `::`, статические.

Методы реквизитов не запускают операцию контакта или компании. После записи они отправляют события модуля `crm`, например `OnAfterRequisiteAdd`, `OnAfterRequisiteUpdate`, `OnAfterRequisiteDelete` и `OnAfterBankDetailAdd`, и обновляют индекс дубликатов по реквизитам. Выбор точки расширения описан в статье [События и расширение поведения CRM](./events-and-extension.md).

У лида нет реквизитов. Его адрес хранит класс `Bitrix\Crm\LeadAddress`, а владелец адреса — сам лид. Прочитайте адрес лида методом `LeadAddress::getListByOwner(\CCrmOwnerType::Lead, $leadId)`.

Сделка, счет, коммерческое предложение и смарт-процесс хранят выбранный реквизит и банковский реквизит клиента и собственной компании в отдельной привязке. Сам реквизит при этом не меняется. Работа с привязками элементов описана в статье [Связи между элементами](./relations.md).

### Проверить права на реквизиты {#check-requisite-permissions}

Методы `add()`, `update()` и `delete()` классов реквизитов права не проверяют. Проверьте права пользователя `$userId` до записи по владельцу реквизита — контакту или компании. Объект прав, который возвращает `\Bitrix\Crm\Service\Container::getInstance()->getUserPermissions($userId)`, выполняет те же проверки, что и методы `check*PermissionOwnerEntity()` классов `EntityRequisite` и `EntityBankDetail`.

-  Чтение — `item()->canRead($ownerTypeId, $ownerId)`.

-  Добавление — `entityType()->canAddItemsInCategory($ownerTypeId, 0)`, где `0` — направление по умолчанию. Примеры статьи дополнительно требуют права изменить конкретного владельца. Это условие приложения, а не проверка CRM.

-  Изменение — `item()->canUpdate($ownerTypeId, $ownerId)`.

-  Удаление — `item()->canDelete($ownerTypeId, $ownerId)`.

Для собственной компании — компании вашей организации, от имени которой ведутся продажи, — CRM проверяет права через объект `myCompany()`. Чтение проверяет метод `canReadBaseFields($companyId)`, изменение и удаление — методы `canUpdate()` и `canDelete()` без аргументов. Общая модель прав описана в разделе [«Проверить права на чтение и изменение»](./architecture.md#check-read-and-write-permissions).

Методы `check*PermissionOwnerEntity()` проверяют права текущего пользователя окружения и подходят, если код выполняется от авторизованного пользователя. Автором и последним изменившим запись API реквизитов тоже записывает текущего пользователя окружения, а не `$userId`. В фоновом коде без авторизованного пользователя эти поля получают значение `0`.

### Прочитать реквизиты клиента {#get-client-requisites}

Метод `EntityRequisite::getList()` принимает параметры ORM `filter`, `select`, `order` и `limit` и возвращает результат выборки. Реквизиты компании или контакта отбирайте по полям `ENTITY_TYPE_ID` и `ENTITY_ID` — типу и ID владельца. Метод `EntityBankDetail::getList()` отбирает банковские реквизиты по типу `CCrmOwnerType::Requisite` и ID реквизита.

Метод `RequisiteAddress::getListByOwner(\CCrmOwnerType::Requisite, $requisiteId)` возвращает адреса реквизита. Ключ массива — тип адреса, значение — поля `ADDRESS_1`, `ADDRESS_2`, `CITY`, `POSTAL_CODE`, `REGION`, `PROVINCE`, `COUNTRY`, `COUNTRY_CODE` и `LOC_ADDR_ID`.

**Пример.** Получите реквизиты компании с ID `321` вместе с банковскими реквизитами и адресами, если пользователь `$userId` может читать компанию.

```php
$companyId = 321;
$permissions = \Bitrix\Crm\Service\Container::getInstance()->getUserPermissions($userId);
if (!$permissions->item()->canRead(\CCrmOwnerType::Company, $companyId))
{
    throw new \RuntimeException('Нет права читать компанию');
}

$requisite = \Bitrix\Crm\EntityRequisite::getSingleInstance();
$bankDetail = \Bitrix\Crm\EntityBankDetail::getSingleInstance();

$requisites = [];
$requisiteRows = $requisite->getList([
    'filter' => [
        '=ENTITY_TYPE_ID' => \CCrmOwnerType::Company,
        '=ENTITY_ID' => $companyId,
    ],
    'select' => ['ID', 'NAME', 'PRESET_ID'],
    'order' => ['ID' => 'ASC'],
]);
while ($requisiteRow = $requisiteRows->fetch())
{
    $requisiteId = (int)$requisiteRow['ID'];

    $bankDetails = [];
    $bankDetailRows = $bankDetail->getList([
        'filter' => [
            '=ENTITY_TYPE_ID' => \CCrmOwnerType::Requisite,
            '=ENTITY_ID' => $requisiteId,
        ],
        'select' => ['ID', 'NAME', 'RQ_BANK_NAME'],
        'order' => ['ID' => 'ASC'],
    ]);
    while ($bankDetailRow = $bankDetailRows->fetch())
    {
        $bankDetails[] = $bankDetailRow;
    }

    $requisites[$requisiteId] = [
        'name' => $requisiteRow['NAME'],
        'presetId' => (int)$requisiteRow['PRESET_ID'],
        'bankDetails' => $bankDetails,
        'addresses' => \Bitrix\Crm\RequisiteAddress::getListByOwner(\CCrmOwnerType::Requisite, $requisiteId),
    ];
}
```

Массив `$requisites` содержит реквизиты компании по их ID. Для каждого реквизита в нем есть название, шаблон, банковские реквизиты и адреса. Если у компании нет реквизитов, массив пустой. Для собственной компании замените проверку на `$permissions->myCompany()->canReadBaseFields($companyId)`.

### Создать реквизит

Метод `EntityRequisite::add($fields)` создает реквизит и возвращает результат. После успеха метод `getId()` результата возвращает ID нового реквизита. Метод проверяет обязательные поля и длину значений, но не проверяет права.

Для шаблона используйте метод `EntityRequisite::getDefaultPresetId($entityTypeId)`. Он возвращает ID шаблона по умолчанию для компании или контакта либо `0`, если шаблон не найден. Если шаблон по умолчанию еще не сохранен в настройках модуля, метод находит стандартный шаблон страны и сохраняет его как шаблон по умолчанию. Если нужен другой шаблон, например для физического лица, выберите его из списка `EntityPreset::getActiveItemList()`. Метод возвращает активные шаблоны в виде массива, где ключ — ID шаблона, а значение — его название. Перед записью поля `RQ_*` проверьте, что оно входит в состав шаблона. Состав возвращает класс `EntityPreset` в три шага.

1. Метод `getById($presetId)` возвращает запись шаблона. Ключ `SETTINGS` содержит его настройки.

2. Метод `settingsGetFields($settings)` возвращает из настроек описания полей.

3. Метод `extractFieldNames($fields)` возвращает имена полей, например `RQ_COMPANY_NAME`.

**Пример.** Создайте реквизит компании с ID `321` по шаблону по умолчанию, если пользователь `$userId` может добавлять компании и изменять эту компанию.

```php
$companyId = 321;
$permissions = \Bitrix\Crm\Service\Container::getInstance()->getUserPermissions($userId);
if (
    !$permissions->entityType()->canAddItemsInCategory(\CCrmOwnerType::Company, 0)
    || !$permissions->item()->canUpdate(\CCrmOwnerType::Company, $companyId)
)
{
    throw new \RuntimeException('Нет права добавить реквизит компании');
}

$presetId = \Bitrix\Crm\EntityRequisite::getDefaultPresetId(\CCrmOwnerType::Company);
if ($presetId <= 0)
{
    throw new \RuntimeException('Шаблон реквизитов компании не найден');
}

$preset = \Bitrix\Crm\EntityPreset::getSingleInstance();
$presetRow = $preset->getById($presetId);
$presetSettings = is_array($presetRow['SETTINGS'] ?? null) ? $presetRow['SETTINGS'] : [];
$presetFieldNames = $preset->extractFieldNames($preset->settingsGetFields($presetSettings));

$fields = [
    'ENTITY_TYPE_ID' => \CCrmOwnerType::Company,
    'ENTITY_ID' => $companyId,
    'PRESET_ID' => $presetId,
    'NAME' => 'Основные реквизиты',
];
if (in_array(\Bitrix\Crm\EntityRequisite::COMPANY_NAME, $presetFieldNames, true))
{
    $fields[\Bitrix\Crm\EntityRequisite::COMPANY_NAME] = 'Название организации';
}

$result = \Bitrix\Crm\EntityRequisite::getSingleInstance()->add($fields);
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$requisiteId = (int)$result->getId();
```

Переменная `$requisiteId` содержит ID нового реквизита. Константа `EntityRequisite::COMPANY_NAME` задает поле `RQ_COMPANY_NAME` — название организации. Подпись поля зависит от страны шаблона. Пример заполняет его, только если поле есть в шаблоне.

Повторный запуск создаст еще один реквизит. Для повторяемого импорта передайте при создании внешний ключ в поле `XML_ID`. Перед добавлением найдите реквизит методом `getList()` с фильтром по `XML_ID`, `ENTITY_TYPE_ID` и `ENTITY_ID`. Метод `EntityRequisite::getByExternalId($xmlId)` ищет только по `XML_ID` без учета владельца и возвращает первую найденную запись, поэтому при одинаковом ключе у разных клиентов он вернет чужой реквизит. Поле `XML_ID` есть и у банковского реквизита.

Метод `update($id, $fields)` меняет и поля `RQ_*` существующего реквизита. Права на изменение проверьте по владельцу, как в разделе [«Изменить адрес реквизита»](#update-requisite-address).

### Добавить банковский реквизит

Метод `EntityBankDetail::add($fields)` создает банковский реквизит. Владельца задают поля `ENTITY_TYPE_ID` со значением `CCrmOwnerType::Requisite` и `ENTITY_ID` с ID реквизита. Поле `COUNTRY_ID` определяет страну и набор полей банковского реквизита. Возьмите его из шаблона реквизита методом `getCountryIdByRequisiteId($requisiteId)` объекта `EntityRequisite`. Метод возвращает `0`, если страну определить не удалось.

Права на банковский реквизит проверяйте по владельцу реквизита. Тип и ID владельца возвращает метод `EntityRequisite::getOwnerEntityById($requisiteId)` в ключах `ENTITY_TYPE_ID` и `ENTITY_ID`.

**Пример.** Добавьте банковский реквизит к реквизиту `$requisiteId` из предыдущего примера. Переменная `$permissions` содержит права пользователя `$userId`.

```php
$owner = \Bitrix\Crm\EntityRequisite::getOwnerEntityById($requisiteId);
if (
    ($owner['ENTITY_ID'] ?? 0) <= 0
    || !$permissions->entityType()->canAddItemsInCategory($owner['ENTITY_TYPE_ID'], 0)
    || !$permissions->item()->canUpdate($owner['ENTITY_TYPE_ID'], $owner['ENTITY_ID'])
)
{
    throw new \RuntimeException('Нет права добавить банковский реквизит');
}

$countryId = \Bitrix\Crm\EntityRequisite::getSingleInstance()->getCountryIdByRequisiteId($requisiteId);
if ($countryId <= 0)
{
    throw new \RuntimeException('Не удалось определить страну шаблона реквизита');
}

$result = \Bitrix\Crm\EntityBankDetail::getSingleInstance()->add([
    'ENTITY_TYPE_ID' => \CCrmOwnerType::Requisite,
    'ENTITY_ID' => $requisiteId,
    'COUNTRY_ID' => $countryId,
    'NAME' => 'Основной счет',
    'RQ_BANK_NAME' => 'Название банка',
]);
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}

$bankDetailId = (int)$result->getId();
```

Переменная `$bankDetailId` содержит ID банковского реквизита. Поле `RQ_BANK_NAME` — название банка — есть в наборах полей всех стран. Остальные поля `RQ_*` банковского реквизита зависят от страны.

Существующий банковский реквизит меняет метод `EntityBankDetail::update($id, $fields)`. Перед изменением проверьте право изменить владельца реквизита через `item()->canUpdate()`. Повторный `add()` создаст второй банковский реквизит, поэтому перед повтором найдите уже созданную запись по `XML_ID` или по выборке реквизита.

### Изменить адрес реквизита {#update-requisite-address}

Адрес реквизита меняет метод `EntityRequisite::update($id, $fields)`. Передайте в поле `EntityRequisite::ADDRESS` (`RQ_ADDR`) массив, где ключ — тип адреса, а значение — поля адреса. Метод возвращает результат, но не проверяет права. Перед изменением проверьте право изменить владельца реквизита.

{% note warning "" %}

CRM записывает адрес целиком из переданных полей. Поля, которых нет в массиве, станут пустыми. Чтобы изменить одно поле, прочитайте текущий адрес, замените в нем нужное значение и передайте все поля.

{% endnote %}

Чтобы удалить адрес этого типа, передайте вместо полей `['DELETED' => 'Y']`.

**Пример.** Замените вторую строку юридического адреса реквизита с ID `654` и сохраните остальные части адреса. Переменная `$permissions` содержит права пользователя `$userId`.

```php
$requisiteId = 654;
$addressTypeId = \Bitrix\Crm\EntityAddressType::Registered;
$requisite = \Bitrix\Crm\EntityRequisite::getSingleInstance();

$owner = \Bitrix\Crm\EntityRequisite::getOwnerEntityById($requisiteId);
if (
    ($owner['ENTITY_ID'] ?? 0) <= 0
    || !$permissions->item()->canUpdate($owner['ENTITY_TYPE_ID'], $owner['ENTITY_ID'])
)
{
    throw new \RuntimeException('Реквизит не найден или нет права изменить его');
}

$addresses = \Bitrix\Crm\RequisiteAddress::getListByOwner(\CCrmOwnerType::Requisite, $requisiteId);
$address = $addresses[$addressTypeId] ?? null;
if ($address === null)
{
    throw new \RuntimeException('У реквизита нет юридического адреса');
}

$address['ADDRESS_2'] = 'Корпус 2';

$result = $requisite->update($requisiteId, [
    \Bitrix\Crm\EntityRequisite::ADDRESS => [
        $addressTypeId => $address,
    ],
]);
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

После успешного `update()` адрес содержит новую вторую строку и прежние значения остальных полей. Прочитайте адрес повторно через `getListByOwner()`, чтобы проверить сохраненное значение.

Чтение и запись адреса выполняются отдельными вызовами и не блокируют запись. Если другой процесс изменит адрес между ними, ваш `update()` перезапишет его изменения прежними значениями. Для одновременных изменений сравните адрес с ожидаемым состоянием непосредственно перед записью и определите правило разрешения конфликта в коде приложения.

### Удалить реквизит

Метод `EntityRequisite::delete($id)` удаляет реквизит вместе с его адресами и банковскими реквизитами. Метод также удаляет связи этого реквизита с элементами CRM. Если нужно удалить только адрес или банковский реквизит, не удаляйте реквизит целиком. Используйте `DELETED` для адреса или `EntityBankDetail::delete()` для банковского реквизита.

Метод удаляет связи, адреса и банковские реквизиты до удаления самой записи и не использует транзакцию. Если удаление записи завершится ошибкой, дочерние данные уже будут удалены. Перед массовым удалением сохраните данные реквизитов, которые может понадобиться восстановить.

CRM связывает удаление реквизита с правом удалить его владельца. Метод `EntityRequisite::checkDeletePermissionOwnerEntity()` проверяет это право для текущего пользователя, а `item()->canDelete()` — для пользователя `$userId`.

**Пример.** Удалите реквизит с ID `654` вместе с его адресами и банковскими реквизитами. Переменная `$permissions` содержит права пользователя `$userId`.

```php
$requisiteId = 654;
$owner = \Bitrix\Crm\EntityRequisite::getOwnerEntityById($requisiteId);
if (
    ($owner['ENTITY_ID'] ?? 0) <= 0
    || !$permissions->item()->canDelete($owner['ENTITY_TYPE_ID'], $owner['ENTITY_ID'])
)
{
    throw new \RuntimeException('Реквизит не найден или нет права удалить его');
}

$result = \Bitrix\Crm\EntityRequisite::getSingleInstance()->delete($requisiteId);
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

После успешного `delete()` выборка реквизитов владельца не содержит удаленный реквизит, а `getListByOwner()` для его ID возвращает пустой массив.

## Создать пользовательское поле {#create-custom-field}

Пользовательское поле нужно, когда интеграции требуется хранить значение, для которого у типа нет системного поля. Сначала создайте поле для типа элемента, затем записывайте значение через `Item` и операцию, как для системного поля.

### Добавить поле к типу

Для создания поля CRM использует классический API. Класс `CCrmFields` создает пользовательское поле CRM и сбрасывает кеш менеджера пользовательских полей. Коллекцию полей, сохраненную в фабрике, этот метод не сбрасывает. Конструктор принимает менеджер пользовательских полей и ID объекта поля. Этот ID возвращает метод `Factory::getUserFieldEntityId()`, например `CRM_CONTACT` для контакта.

Метод `AddField($fields)` принимает массив параметров, как метод `CUserTypeEntity::Add()`, и возвращает `true` при успехе. Текст ошибки возвращает `$APPLICATION->GetException()`. Глобальные объекты `$APPLICATION` и `$USER_FIELD_MANAGER` доступны после подключения пролога. Полный набор параметров и типов описан в статье [Пользовательские поля](./../../cms-basics/userfields.md).

Метод не проверяет права пользователя. Запускайте создание поля в доверенном коде, например при установке или обновлении модуля. Ядро требует префикс `UF_`, а по соглашению CRM имя поля начинается с `UF_CRM_`. Для поля типа «Список» с вариантами в ключе `LIST` метод вернет `false`, если не удалось сохранить варианты, хотя само поле уже создано. Перед повтором проверьте, есть ли поле в коллекции.

**Пример.** Создайте у контакта множественное строковое поле `UF_CRM_DOCUMENT_TYPES` для типов документов клиента. Переменная `$contactFactory` обозначает фабрику контактов.

```php
$fieldName = 'UF_CRM_DOCUMENT_TYPES';
if (!$contactFactory->getFieldsCollection()->hasField($fieldName))
{
    $crmFields = new \CCrmFields($GLOBALS['USER_FIELD_MANAGER'], $contactFactory->getUserFieldEntityId());
    $isAdded = $crmFields->AddField([
        'ENTITY_ID' => $contactFactory->getUserFieldEntityId(),
        'FIELD_NAME' => $fieldName,
        'USER_TYPE_ID' => 'string',
        'MULTIPLE' => 'Y',
        'MANDATORY' => 'N',
        'EDIT_FORM_LABEL' => ['ru' => 'Типы документов'],
        'LIST_COLUMN_LABEL' => ['ru' => 'Типы документов'],
    ]);

    if (!$isAdded)
    {
        $exception = $GLOBALS['APPLICATION']->GetException();
        throw new \RuntimeException($exception ? $exception->GetString() : 'Не удалось создать поле');
    }

    $contactFactory->clearFieldsCollectionCache();
}

$isFieldReady = $contactFactory->getFieldsCollection()->hasField($fieldName);
```

Переменная `$isFieldReady` равна `true`, если поле есть в коллекции контакта. В стандартной настройке карточки CRM показывает новое поле в конце раздела «Дополнительно». Проверка `hasField()` перед созданием не дает добавить поле повторно. Метод `clearFieldsCollectionCache()` сбрасывает сохраненную в фабрике коллекцию, чтобы следующий вызов `getFieldsCollection()` увидел новое поле.

Не делайте новое поле обязательным, пока у существующих элементов нет значений. Пустое обязательное поле остановит создание элемента и смену стадии. Исключение — переход в стадию провала: для него CRM не проверяет обязательность, заданную в самом пользовательском поле. Изменение и удаление пользовательского поля описаны в статье [Пользовательские поля](./../../cms-basics/userfields.md). Удаление поля удаляет его значения у всех элементов типа.

### Записать значение пользовательского поля

Запишите значение пользовательского поля так же, как значение системного. Задайте его через `Item::set()` и запустите операцию. Множественное поле принимает массив. Метод `getItem()` с полями по умолчанию загружает и пользовательские поля.

Прочитайте контакт после создания поля, лучше в следующем запросе. Для объекта, загруженного до создания поля, `set()` выбросит `ArgumentException`.

**Пример.** Запишите типы документов контакту `$contact`, прочитанному с учетом прав пользователя `$userId` после создания поля. Переменная `$contactFactory` обозначает фабрику контактов.

```php
$contact->set('UF_CRM_DOCUMENT_TYPES', ['Договор', 'Акт']);

$context = (new \Bitrix\Crm\Service\Context())->setUserId($userId);
$result = $contactFactory->getUpdateOperation($contact, $context)->launch();
if (!$result->isSuccess())
{
    throw new \RuntimeException(implode('; ', $result->getErrorMessages()));
}
```

После успешного `launch()` метод `$contact->get('UF_CRM_DOCUMENT_TYPES')` возвращает массив из двух значений. Новый массив заменяет прежний набор значений поля, поэтому для добавления значения сначала прочитайте текущий массив.

## Проверить результат

Каждый вид данных клиента сохраняется своим вызовом. Проверяйте результат каждого вызова отдельно, а после ошибки перечитайте данные перед повтором.

-  Поля элемента и пользовательские поля — перечитайте элемент через фабрику и сравните значения.

-  Телефоны и email — прочитайте `getFm()` заново. Ошибка может появиться после сохранения основной записи.

-  Реквизиты и банковские реквизиты — выберите их по владельцу через `getList()`.

-  Адреса — прочитайте `RequisiteAddress::getListByOwner()` и проверьте все поля адреса, а не только измененное.

Успешное изменение контакта не подтверждает изменение его реквизитов, и наоборот. Для обмена с внешней системой сохраняйте результат каждого шага отдельно, чтобы повтор не создавал второй реквизит и не удалял способы связи.
