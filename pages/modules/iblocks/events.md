---
title: События инфоблоков
description: "События модуля Информационные блоки — OnBeforeIBlockElementAdd, OnAfterIBlockElementUpdate, OnBeforeIBlockElementDelete, события значений свойств, разделов, свойств и инфоблоков. Какие события вызывает каждый способ записи, подписка на события, изменение полей, отмена операции, проверка результата, защита от рекурсии, события ORM-классов Element{ApiCode}Table."
---

Модуль Информационные блоки вызывает события, когда элементы, разделы, свойства и инфоблоки добавляют, изменяют и удаляют. Обработчик события может изменить поля перед сохранением, отменить операцию или выполнить действие после записи, например отправить уведомление или обновить связанные данные.

У модуля два набора событий.

-  События классического API, например `OnBeforeIBlockElementUpdate`. Их вызывают методы `CIBlockElement`, `CIBlockSection`, `CIBlockProperty` и `CIBlock`, а также административный раздел, импорт и стандартные компоненты, которые записывают данные этими методами.

-  События ORM-классов, например `OnBeforeUpdate` класса `Element{ApiCode}Table`. Их вызывают только ORM-методы `save()`, `add()`, `update()` и `delete()`.

Один набор не вызывает другой. Обработчик события классического API не сработает, если элемент изменен через ORM, и наоборот. Поэтому элементы и разделы в проекте записывают методами классического API, как описано в статье [Как выбрать API инфоблоков](./api.md#events), а обработчики подписывают на события классического API.

События классического API — это хуки уровня методов. Обработчик получает аргументы метода, обычно массив полей по ссылке, и может изменить их или прервать операцию. Модуль `iblock` подключать в обработчике не нужно, модуль уже работает, раз вызвал событие. Подключите модуль только там, где код сам обращается к классам модуля, например при подписке на события ORM-класса. Примеры используют инфоблок новостей со строковым свойством `AUTHOR` — автор новости.

## Какие события вызывает запись {#which-events}

Таблица показывает события, которые вызывает каждый способ записи элемента. Порядок событий в ячейке совпадает с порядком вызова. Поведение одинаково для обеих [версий хранения свойств](./overview.md#property-storage-versions).

| Способ записи | События |
|---|---|
| `CIBlockElement::Add()` | `OnStartIBlockElementAdd`, `OnBeforeIBlockElementAdd`, `OnIBlockElementAdd`, `OnAfterIBlockElementAdd`. Если переданы значения свойств `PROPERTY_VALUES`, перед `OnAfterIBlockElementAdd` вызываются еще `OnIBlockElementSetPropertyValues` и `OnAfterIBlockElementSetPropertyValues` |
| `CIBlockElement::Update()` | `OnStartIBlockElementUpdate`, `OnBeforeIBlockElementUpdate`, `OnIBlockElementUpdate`, `OnAfterIBlockElementUpdate`. Если переданы значения свойств `PROPERTY_VALUES`, перед `OnAfterIBlockElementUpdate` вызываются еще `OnIBlockElementSetPropertyValues` и `OnAfterIBlockElementSetPropertyValues` |
| `CIBlockElement::Delete()` | `OnBeforeIBlockElementDelete`, `OnIBlockElementDelete`, `OnAfterIBlockElementDelete` |
| `CIBlockElement::SetPropertyValuesEx()` | `OnIBlockElementSetPropertyValuesEx`, `OnAfterIBlockElementSetPropertyValuesEx` |
| `CIBlockElement::SetPropertyValues()` | `OnIBlockElementSetPropertyValues`, `OnAfterIBlockElementSetPropertyValues` |
| ORM `save()` нового элемента | `OnBeforeAdd`, `OnAdd`, `OnAfterAdd` ORM-класса `Element{ApiCode}Table` |
| ORM `save()` с измененными полями элемента | `OnBeforeUpdate`, `OnUpdate`, `OnAfterUpdate` ORM-класса |
| ORM `save()`, когда изменены только значения свойств | Событий нет |
| ORM `delete()` | `OnBeforeDelete`, `OnDelete`, `OnAfterDelete` ORM-класса |

Методы `CIBlockSection::Add()`, `Update()` и `Delete()` вызывают пары событий `OnBeforeIBlockSection*` и `OnAfterIBlockSection*`. Метод `CIBlockSection::Delete()` удаляет элементы раздела методом `CIBlockElement::Delete()`, поэтому для каждого элемента вызываются и события удаления элемента. Импорт из 1С и административный раздел тоже записывают элементы методами `CIBlockElement`, и обработчики выполняются для каждого импортированного элемента. События разделов, свойств и инфоблоков перечислены в разделе [События разделов, свойств и инфоблоков](#other-events).

## Подписаться на событие {#subscribe}

Обработчик подписывают на событие методом `addEventHandlerCompatible()` объекта [`Bitrix\Main\EventManager`](../../api-reference/main/event-manager/index.md). Метод передает обработчику аргументы события как есть, в том числе массив полей по ссылке. Вызов размещают в файле `/local/php_interface/init.php`, чтобы подписка действовала на каждом запросе. Регистрация обработчиков описана в статье [События](./../../framework/events.md).

Метод `addEventHandlerCompatible()` подходит для событий классического API. Если событие передает обработчику объект [`Bitrix\Main\Event`](../../api-reference/main/event/index.md), например `OnTemplateGetFunctionClass` из раздела [Добавить свою функцию шаблона](./seo.md#custom-function), подписывайтесь методом `addEventHandler()`.

**Пример.** Подпишите обработчик на изменение элемента в файле `init.php`.

```php
use Bitrix\Main\EventManager;
use Partner\News\IblockEventHandler;

EventManager::getInstance()->addEventHandlerCompatible(
    'iblock',
    'OnAfterIBlockElementUpdate',
    [IblockEventHandler::class, 'onAfterElementUpdate']
);
```

Класс обработчика должен загружаться автозагрузкой, например автозагрузкой Composer или методом [`Bitrix\Main\Loader::registerNamespace()`](../../api-reference/main/loader/register-namespace.md). Иначе подключите файл класса в `init.php` до подписки.

В модуле подписку сохраняют в базе данных один раз — в методе `InstallDB()` установщика модуля, а удаляют в `UnInstallDB()`.

**Пример.** Зарегистрируйте обработчик модуля `partner.news` при установке и удалите при удалении модуля.

```php
use Bitrix\Main\EventManager;
use Partner\News\IblockEventHandler;

// InstallDB()
EventManager::getInstance()->registerEventHandlerCompatible(
    'iblock',
    'OnAfterIBlockElementUpdate',
    'partner.news',
    IblockEventHandler::class,
    'onAfterElementUpdate'
);

// UnInstallDB()
EventManager::getInstance()->unRegisterEventHandler(
    'iblock',
    'OnAfterIBlockElementUpdate',
    'partner.news',
    IblockEventHandler::class,
    'onAfterElementUpdate'
);
```

Перед вызовом обработчика система подключает модуль `partner.news`, поэтому класс обработчика должен загружаться автозагрузкой модуля.

Обработчик вызывается для элементов всех инфоблоков. Проверьте `IBLOCK_ID` в начале обработчика, чтобы он работал только для нужного инфоблока. Обработчик `OnBeforeIBlockElementDelete` получает только `ID` элемента — инфоблок узнайте запросом по `ID`, как в примере раздела [Отменить операцию](#cancel).

## События элементов {#element-events}

| Событие | Когда вызывается | Аргументы | Можно отменить |
|---|---|---|---|
| `OnStartIBlockElementAdd`, `OnStartIBlockElementUpdate` | В начале проверки полей, до проверки обязательных полей | Массив полей по ссылке. При изменении в нем есть `ID` | Нет |
| `OnBeforeIBlockElementAdd`, `OnBeforeIBlockElementUpdate` | В конце проверки полей, до записи в базу данных. Событие вызывается, даже если проверка уже нашла ошибки | Массив полей по ссылке | Да |
| `OnIBlockElementAdd` | Непосредственно перед записью в базу данных | Массив полей | Нет |
| `OnIBlockElementUpdate` | Непосредственно перед записью в базу данных | Массив новых полей с `ID` и массив текущих полей элемента | Нет |
| `OnAfterIBlockElementAdd`, `OnAfterIBlockElementUpdate` | После операции, в том числе после ошибки или отмены | Массив полей по ссылке с ключами `IBLOCK_ID` и `RESULT`. Ключ `ID` есть при изменении и после успешного добавления | Нет |
| `OnBeforeIBlockElementDelete` | До удаления | `ID` элемента | Да |
| `OnIBlockElementDelete` | После проверки `OnBeforeIBlockElementDelete`, до удаления значений свойств, привязок к разделам и записи элемента. Данные элемента еще можно прочитать | `ID` элемента и массив основных полей элемента — `ID`, `IBLOCK_ID`, `NAME`, `CODE`, `EXTERNAL_ID`, картинки | Нет |
| `OnAfterIBlockElementDelete` | После удаления | Массив основных полей удаленного элемента | Нет |

Если в инфоблоке включен документооборот, события `OnIBlockElementDelete` и `OnAfterIBlockElementDelete` вызываются и для каждой исторической копии элемента. Событие `OnBeforeIBlockElementDelete` вызывается один раз для исходного элемента. Отличить копию можно по полю `WF_PARENT_ELEMENT_ID` массива полей — у копии в нем `ID` исходного элемента.

### Изменить поля перед сохранением {#modify-fields}

Обработчик `OnBeforeIBlockElementAdd` или `OnBeforeIBlockElementUpdate` получает массив полей по ссылке. Изменения в массиве сохраняются вместе с элементом. Если поле нужно заполнить до проверки обязательных полей, например символьный код, используйте `OnStartIBlockElementAdd` и `OnStartIBlockElementUpdate`.

При изменении элемента в массиве есть переданные в `Update()` поля, `ID`, `IBLOCK_ID` и служебные ключи, например `SEARCHABLE_CONTENT`. Остальных полей, например `NAME`, в массиве нет, если код, который вызвал `Update()`, их не передал.

**Пример.** Уберите пробелы по краям названия новости перед добавлением и изменением.

```php
namespace Partner\News;

class IblockEventHandler
{
    private const NEWS_IBLOCK_ID = 5;

    public static function onBeforeElementSave(array &$fields): void
    {
        if ((int)($fields['IBLOCK_ID'] ?? 0) !== self::NEWS_IBLOCK_ID)
        {
            return;
        }

        if (isset($fields['NAME']))
        {
            $fields['NAME'] = trim((string)$fields['NAME']);
        }
    }
}
```

Подпишите метод на оба события.

```php
use Bitrix\Main\EventManager;
use Partner\News\IblockEventHandler;

$eventManager = EventManager::getInstance();
$eventManager->addEventHandlerCompatible('iblock', 'OnBeforeIBlockElementAdd', [IblockEventHandler::class, 'onBeforeElementSave']);
$eventManager->addEventHandlerCompatible('iblock', 'OnBeforeIBlockElementUpdate', [IblockEventHandler::class, 'onBeforeElementSave']);
```

### Отменить операцию {#cancel}

Чтобы отменить добавление, изменение или удаление, обработчик `OnBefore*` возвращает `false`. Текст ошибки передайте методом `$APPLICATION->ThrowException()` до возврата.

-  Методы `Add()` и `Update()` объекта `CIBlockElement` вернут `false`, текст ошибки вернет метод `getLastError()` того же объекта, например `$elementApi->getLastError()`. Так же работают объекты `CIBlockSection`, `CIBlockProperty` и `CIBlock`.

-  `CIBlockElement::Delete()` вернет `false`, текст ошибки вернет `$APPLICATION->GetException()`.

**Пример.** Запретите удалять активные новости.

```php
namespace Partner\News;

use Bitrix\Iblock\ElementTable;

class DeleteGuard
{
    private const NEWS_IBLOCK_ID = 5;

    public static function onBeforeElementDelete($elementId): bool
    {
        global $APPLICATION;

        $element = ElementTable::getRow([
            'select' => ['IBLOCK_ID', 'ACTIVE'],
            'filter' => ['=ID' => (int)$elementId],
        ]);

        if (
            $element !== null
            && (int)$element['IBLOCK_ID'] === self::NEWS_IBLOCK_ID
            && $element['ACTIVE'] === 'Y'
        )
        {
            $APPLICATION->ThrowException('Снимите новость с публикации перед удалением');

            return false;
        }

        return true;
    }
}
```

Подпишите метод на событие `OnBeforeIBlockElementDelete` в файле `init.php`.

```php
use Bitrix\Main\EventManager;
use Partner\News\DeleteGuard;

EventManager::getInstance()->addEventHandlerCompatible(
    'iblock',
    'OnBeforeIBlockElementDelete',
    [DeleteGuard::class, 'onBeforeElementDelete']
);
```

Если обработчик ничего не вернул или вернул не `false`, операция продолжается.

### Выполнить действие после записи {#after-write}

События `OnAfterIBlockElementAdd` и `OnAfterIBlockElementUpdate` вызываются и после ошибки, и после отмены операции обработчиком. Результат операции находится в ключе `RESULT` массива полей. После успешного добавления это `ID` нового элемента, после успешного изменения — `true`, после ошибки — `false`. Проверяйте `RESULT` в начале обработчика.

Массив полей содержит только переданные поля и служебные ключи. Если обработчику нужны все поля или значения свойств, прочитайте элемент по `ID` способом из раздела [Получить элемент по ID](./elements.md#get-by-id).

Ключ `PROPERTY_VALUES` есть в массиве, только если вызывающий код передал значения свойств. Методы `Add()` и `Update()` не приводят его к одному виду: ключами могут быть коды или `ID` свойств, значениями — строки, массивы или массивы с ключами `VALUE` и `DESCRIPTION`. Например, компонент `bitrix:iblock.element.add.form` передает ключи-`ID`, а при изменении элемента дополняет массив значениями неизмененных свойств из базы данных в формате `VALUE` и `DESCRIPTION`. Если обработчику нужны значения свойств в одном формате, не разбирайте `PROPERTY_VALUES`, а прочитайте элемент по `ID`, как описано выше.

**Пример.** Запишите в журнал событий изменение новости. Метод дополняет класс `IblockEventHandler` из раздела [Изменить поля перед сохранением](#modify-fields) и использует его константу `NEWS_IBLOCK_ID`.

```php
public static function onAfterElementUpdate(array &$fields): void
{
    if (empty($fields['RESULT']) || (int)$fields['IBLOCK_ID'] !== self::NEWS_IBLOCK_ID)
    {
        return;
    }

    \CEventLog::Add([
        'SEVERITY' => 'INFO',
        'AUDIT_TYPE_ID' => 'NEWS_UPDATED',
        'MODULE_ID' => 'iblock',
        'ITEM_ID' => (int)$fields['ID'],
        'DESCRIPTION' => 'Новость изменена',
    ]);
}
```

Метод `CEventLog::Add()` принимает ключи записи журнала:

-  `SEVERITY` — уровень записи, например `INFO`,

-  `AUDIT_TYPE_ID` — тип события, по нему записи фильтруют в журнале,

-  `MODULE_ID` — модуль, к которому относится запись,

-  `ITEM_ID` — `ID` объекта, например элемента,

-  `DESCRIPTION` — текст записи.

Если нужно только записывать добавление, изменение и удаление элементов, обработчик не нужен. Включите нужные флажки, например Записывать изменение элемента, на вкладке Журнал событий в настройках инфоблока, и методы классического API будут записывать операции в журнал событий сами.

Обработчик проверяет `RESULT` функцией `empty()`. Она отсекает `false` после ошибки и пропускает `ID` нового элемента и `true` после изменения.

Методы классического API не пересчитывают вычисленные SEO-свойства. Если обработчик должен поддерживать их в актуальном состоянии, вызовите в нем `clearValues()`, как описано в разделе [Сбросить вычисленные значения](./seo.md#clear-values).

### Не допустить рекурсии {#recursion}

Если обработчик `OnAfterIBlockElementUpdate` сам вызывает `CIBlockElement::Update()`, событие вызовется снова и обработчик зациклится. Защитите обработчик статическим флагом. Флаг сбрасывайте в блоке `finally`, чтобы исключение не оставило обработчик выключенным до конца запроса.

**Пример.** Дополните анонс после изменения элемента без повторного вызова обработчика. Подпишите метод `onAfterElementUpdate()` на событие `OnAfterIBlockElementUpdate` способом из раздела [Подписаться на событие](#subscribe). Методы `disable()` и `enable()` позволяют выключить обработчик снаружи, например на время импорта.

```php
namespace Partner\News;

class PreviewUpdater
{
    private const NEWS_IBLOCK_ID = 5;

    private static bool $isRunning = false;

    public static function disable(): void
    {
        self::$isRunning = true;
    }

    public static function enable(): void
    {
        self::$isRunning = false;
    }

    public static function onAfterElementUpdate(array &$fields): void
    {
        if (
            self::$isRunning
            || empty($fields['RESULT'])
            || (int)$fields['IBLOCK_ID'] !== self::NEWS_IBLOCK_ID
        )
        {
            return;
        }

        self::$isRunning = true;

        try
        {
            $elementApi = new \CIBlockElement();
            $elementApi->Update((int)$fields['ID'], ['PREVIEW_TEXT' => 'Обновлено обработчиком']);
        }
        finally
        {
            self::$isRunning = false;
        }
    }
}
```

Вложенный `Update()` тоже вызывает событие, но обработчик видит флаг и сразу выходит.

### Учесть ограничения обработчиков {#handler-limits}

Обработчик выполняется внутри операции записи и задерживает ее. Учитывайте это при выборе действий в обработчике.

-  Обработчик выполняется для каждого элемента, в том числе при импорте из 1С и массовой записи. Тяжелую работу, например запрос во внешний сервис или пересчет связанных данных, вынесите в фоновое задание или агент, способы описаны в статье [Агенты и фоновые задачи](./../../framework/background-jobs.md).

-  Если свой импорт не должен запускать обработчик, выключите обработчик перед импортом и включите после, например методами `PreviewUpdater::disable()` и `PreviewUpdater::enable()` из раздела [Не допустить рекурсии](#recursion). Вызов `enable()` поместите в блок `finally`. Приемы массовой записи описаны в разделе [Записать много элементов](./elements.md#bulk-write).

-  Если запись выполняется в транзакции, например удаление по примеру из раздела [Удалить элемент](./elements.md#delete-element), откат транзакции не отменит внешние действия обработчика — отправленное письмо или запрос в другой сервис. Такие действия выполняйте в коде, который управляет транзакцией, после вызова `commitTransaction()`, а не в обработчике.

## События значений свойств {#property-value-events}

Методы, которые записывают значения свойств, вызывают свои события. Отменить запись из этих событий нельзя, возвращаемое значение обработчика не учитывается.

| Событие | Когда вызывается | Аргументы |
|---|---|---|
| `OnIBlockElementSetPropertyValuesEx` | До записи значений методом `SetPropertyValuesEx()` | `$elementId`, `$iblockId`, `$propertyValues` — переданные значения, `$propertyList` — описания свойств инфоблока, `$currentValues` — текущие значения из базы данных |
| `OnAfterIBlockElementSetPropertyValuesEx` | После записи значений методом `SetPropertyValuesEx()` | `$elementId`, `$iblockId`, `$propertyValues` — переданные значения, `$flags` — массив флагов, переданный в метод четвертым аргументом |
| `OnIBlockElementSetPropertyValues` | До записи методом `SetPropertyValues()`, а также при `CIBlockElement::Add()` и `Update()` с ключом `PROPERTY_VALUES` | `$elementId`, `$iblockId`, `$propertyValues`, `$propertyCode` — код свойства или `false`, `$propertyList` — описания свойств, `$currentValues` — текущие значения |
| `OnAfterIBlockElementSetPropertyValues` | После записи в тех же случаях | `$elementId`, `$iblockId`, `$propertyValues`, `$propertyCode` |

**Пример.** Обработчик изменения автора новости методом `SetPropertyValuesEx()`.

```php
namespace Partner\News;

class PropertyEventHandler
{
    public static function onAfterSetPropertyValuesEx($elementId, $iblockId, $propertyValues, $flags): void
    {
        if (!array_key_exists('AUTHOR', $propertyValues))
        {
            return;
        }

        // действие после изменения автора элемента $elementId
    }
}
```

Ключи массива `$propertyValues` — коды или `ID` свойств в том виде, в котором их передал вызывающий код.

Если проект обрабатывает эти события, записывайте значения методом `SetPropertyValuesEx()`, как описано в разделе [Записать значения с событиями классического API](./property-values.md#set-property-values-ex). ORM-метод `save()` при изменении только значений свойств не вызывает ни события классического API, ни события ORM-класса.

## События разделов, свойств и инфоблоков {#other-events}

События разделов, свойств и инфоблоков работают по тем же правилам, что и события элементов.

-  Обработчик `OnBefore*Add` и `OnBefore*Update` получает массив полей по ссылке и отменяет операцию возвратом `false`. Текст ошибки вернет метод `getLastError()` объекта `CIBlockSection`, `CIBlockProperty` или `CIBlock`.

-  Обработчик `OnBefore*Delete` получает `ID` и отменяет удаление возвратом `false`. Текст ошибки вернет метод `GetString()` объекта из `$APPLICATION->GetException()`. Для разделов и инфоблоков метод `Delete()` добавляет перед текстом имя обработчика. Например, если обработчик — анонимная функция, текст будет таким — ` callable: Раздел удалять нельзя`, с пробелом в начале. Перед показом пользователю отрежьте префикс и пробелы или сформируйте сообщение сами.

-  Обработчик `OnAfter*Add` и `OnAfter*Update` получает массив полей по ссылке с ключом `RESULT`, как у элементов.

| Объект | Методы | События |
|---|---|---|
| Раздел | `CIBlockSection::Add()`, `Update()`, `Delete()` | `OnBeforeIBlockSectionAdd`, `OnAfterIBlockSectionAdd`, `OnBeforeIBlockSectionUpdate`, `OnAfterIBlockSectionUpdate`, `OnBeforeIBlockSectionDelete`, `OnAfterIBlockSectionDelete` |
| Свойство | `CIBlockProperty::Add()`, `Update()`, `Delete()` | `OnBeforeIBlockPropertyAdd`, `OnAfterIBlockPropertyAdd`, `OnBeforeIBlockPropertyUpdate`, `OnAfterIBlockPropertyUpdate`, `OnBeforeIBlockPropertyDelete`, `OnIBlockPropertyDelete`, `OnAfterIBlockPropertyDelete` |
| Инфоблок | `CIBlock::Add()`, `Update()`, `Delete()` | `OnBeforeIBlockAdd`, `OnAfterIBlockAdd`, `OnBeforeIBlockUpdate`, `OnAfterIBlockUpdate`, `OnBeforeIBlockDelete`, `OnIBlockDelete`, `OnAfterIBlockDelete` |

ORM-классы разделов, свойств и инфоблоков эти события не вызывают.

Если элемент — товар торгового каталога, его цены, остатки и товарные параметры записывает модуль `catalog`. На их изменение подписывайтесь событиями модуля `catalog`, они описаны в разделе [Основные события товаров и цен](./../catalog/architecture.md#catalog-events). Событие `OnTemplateGetFunctionClass` для своих функций SEO-шаблонов описано в разделе [Добавить свою функцию шаблона](./seo.md#custom-function).

## События ORM-классов {#orm-events}

ORM-класс элементов `Element{ApiCode}Table` вызывает стандартные события ORM — `OnBeforeAdd`, `OnAfterAdd`, `OnBeforeUpdate`, `OnAfterUpdate`, `OnBeforeDelete`, `OnAfterDelete` и другие. Обработчик подписывают методом `addEventHandler()` объекта `Bitrix\Main\ORM\EventManager` на конкретный ORM-класс. Подробнее об обработчиках ORM — в разделе [События](./../../orm/entity-operations.md#events) статьи об операциях с сущностями.

**Пример.** Подпишите обработчик на изменение элемента через ORM-класс инфоблока новостей.

```php
use Bitrix\Iblock\IblockTable;
use Bitrix\Main\Loader;
use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Event;
use Bitrix\Main\ORM\EventManager as OrmEventManager;

if (Loader::includeModule('iblock'))
{
    // News — символьный код API инфоблока новостей
    $entity = IblockTable::compileEntity('News');

    if ($entity !== false)
    {
        OrmEventManager::getInstance()->addEventHandler(
            $entity->getDataClass(),
            DataManager::EVENT_ON_AFTER_UPDATE,
            static function (Event $event): void
            {
                // Параметр id — первичный ключ в виде массива ['ID' => 123]
                $elementId = (int)$event->getParameter('id')['ID'];
                // действие после изменения элемента через ORM
            }
        );
    }
}
```

Класс `Bitrix\Main\ORM\EventManager` отличается от [`Bitrix\Main\EventManager`](../../api-reference/main/event-manager/index.md) из раздела [Подписаться на событие](#subscribe). Если оба класса нужны в одном файле, дайте одному из них псевдоним, как в примере. Метод `compileEntity()` возвращает `false`, если инфоблока с таким символьным кодом API нет.

Обработчики ORM-событий срабатывают только при записи через ORM-класс. Методы `CIBlockElement` их не вызывают. Если элементы проекта пишут оба API, обработчик придется подписать на оба набора событий.

## Проверить результат {#check-result}

Перед публикацией кода выполните на тестовом инфоблоке:

1. Измените элемент в административном разделе и убедитесь, что обработчик сработал. Административный раздел записывает элементы методами классического API.

2. Отмените операцию из обработчика `OnBefore*` и проверьте текст ошибки. После `Add()` и `Update()` его возвращает `getLastError()`, после `CIBlockElement::Delete()` — `$APPLICATION->GetException()`. Элемент не должен измениться.

3. Вызовите `Update()` с ошибкой, например с пустым названием, и проверьте, что обработчик `OnAfterIBlockElementUpdate` не выполнил действие, потому что `RESULT` равен `false`.

4. Если обработчик сам изменяет элемент, проверьте, что он вызывается один раз за изменение и не зацикливается.

5. Измените элемент в другом инфоблоке и убедитесь, что обработчик его пропустил.
