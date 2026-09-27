---
title: Провайдеры данных
description: "Получение данных для шаблона через DataProvider и DataProviderManager, вложенные поля, множественные значения и собственные провайдеры."
---

Провайдер данных связывает объект приложения с полями шаблона. Он принимает исходное значение, загружает данные объекта, описывает доступные поля и проверяет, может ли пользователь читать эти данные.

Используйте `Bitrix\DocumentGenerator\DataProvider` для нового типа исходного объекта, а `Bitrix\DocumentGenerator\DataProviderManager` — чтобы создать провайдер, получить значение поля или построить список доступных плейсхолдеров. Формат плейсхолдеров и правила представления значений описаны в статье [Шаблоны, поля и форматирование](./templates-and-fields.md).

## Как работает дерево провайдеров

Документ начинает чтение данных с корневого провайдера `SOURCE`. Поля корневого провайдера возвращают:

-  простое поле — строку, число, логическое значение или объект `Value`,

-  вложенное поле — другой провайдер,

-  множественное поле — `ArrayDataProvider` с набором дочерних провайдеров.

```text
SOURCE: OrderDataProvider
├── NUMBER: string
├── DATE: Value\DateTime
├── CLIENT: ClientDataProvider
│   ├── NAME: string
│   └── EMAIL: string
└── ITEMS: ArrayDataProvider
    └── ITEM: LineDataProvider[]
        ├── NAME: string
        ├── QUANTITY: int
        └── PRICE: string
```

Для пути `SOURCE.CLIENT.NAME` менеджер сначала получает поле `CLIENT`, создает `ClientDataProvider` и затем запрашивает у него `NAME`. Для поля `SOURCE.ITEMS.ITEM.NAME` тело документа обходит элементы `ArrayDataProvider` и получает `NAME` у каждого `LineDataProvider`.

### Класс DataProvider

Класс `Bitrix\DocumentGenerator\DataProvider` описывает и возвращает данные одного объекта.

В примерах ниже переменная `$provider` содержит загруженный экземпляр `OrderDataProvider`.

#### Описать поля

Метод `getFields(): array` возвращает массив описаний полей. Параметров нет.

```php
$fields = $provider->getFields();
```

#### Получить значение поля

Метод `getValue($placeholder)` возвращает подготовленное значение поля: строку, число, объект `Value`, вложенный провайдер, список или `false`.

-  `$placeholder` — внутренний код поля.

```php
$number = $provider->getValue('NUMBER');
```

Метод кеширует в объекте провайдера рассчитанный результат, если он отличается от `null`. Поэтому обработчик поля не должен зависеть от количества вызовов.

#### Проверить загрузку объекта

Метод `isLoaded(): bool` возвращает `true`, если провайдер загрузил исходный объект. Параметров нет.

```php
if (!$provider->isLoaded())
{
    throw new \RuntimeException('Исходный объект не найден');
}
```

#### Проверить доступ

Метод `hasAccess($userId): bool` проверяет, может ли пользователь читать исходный объект.

-  `$userId` — идентификатор пользователя.

```php
if (!$provider->hasAccess(7))
{
    throw new \RuntimeException('Нет доступа к исходному объекту');
}
```

### Класс DataProviderManager

Класс `Bitrix\DocumentGenerator\DataProviderManager` создает провайдеры, переходит по составным путям, формирует список плейсхолдеров и проверяет доступ.

В примерах ниже переменная `$manager` содержит экземпляр `DataProviderManager`. Переменная `$provider` содержит загруженный провайдер заказа, а класс `OrderDataProvider` импортирован через `use`.

#### Проверить класс провайдера

Метод `checkProviderName($providerClassName, $moduleId = null): bool` проверяет, что класс наследует `DataProvider`. Если указан модуль, метод также ищет класс среди провайдеров этого модуля. Встроенные классы `ArrayDataProvider` и `DataProvider\User` не требуют поиска в реестре модуля.

-  `$providerClassName` — полное имя класса провайдера,

-  `$moduleId` — идентификатор модуля. По умолчанию `null`.

```php
$isProvider = $manager->checkProviderName(
    OrderDataProvider::class,
    'mycompany.orders'
);
```

#### Создать провайдер

Метод `getDataProvider($providerClassName, $value, array $options = [], DataProvider $parentDataProvider = null): ?DataProvider` создает провайдер и может применить зарегистрированную подмену класса. Возвращает объект провайдера или `null`, если класс не прошел проверку.

-  `$providerClassName` — полное имя класса провайдера,

-  `$value` — исходное значение для конструктора провайдера,

-  `$options` — опции провайдера. По умолчанию пустой массив,

-  `$parentDataProvider` — родительский провайдер для вложенного объекта. По умолчанию `null`.

```php
$sourceId = 25;
$provider = $manager->getDataProvider(
    OrderDataProvider::class,
    $sourceId
);
```

Менеджер повторно использует провайдер для одинакового класса, исходного значения и опций. Кеш действует до конца PHP-скрипта, поэтому после изменения исходного объекта не читайте его через уже созданный провайдер.

#### Получить значение по пути

Метод `getDataProviderValue(DataProvider $dataProvider, $placeholder)` возвращает значение простого или составного поля либо `false`, если путь нельзя разрешить.

-  `$dataProvider` — провайдер, с которого начинается путь,

-  `$placeholder` — код поля или составной путь к нему.

```php
$clientName = $manager->getDataProviderValue(
    $provider,
    'CLIENT.NAME'
);
```

#### Получить список плейсхолдеров

Метод `getProviderPlaceholders($providerClassName, array $placeholders = [], array $options = [], $isCopyFields = false): array` возвращает список доступных плейсхолдеров.

-  `$providerClassName` — полное имя класса провайдера,

-  `$placeholders` — начальный список плейсхолдеров. По умолчанию пустой массив,

-  `$options` — опции технического экземпляра провайдера. По умолчанию пустой массив,

-  `$isCopyFields` — признак копирования полей. По умолчанию `false`.

```php
$placeholders = $manager->getProviderPlaceholders(
    OrderDataProvider::class
);
```

#### Проверить доступ к данным

Метод `checkDataProviderAccess(DataProvider $dataProvider, $userId = null): bool` проверяет доступ и кеширует результат для пары «провайдер — пользователь».

-  `$dataProvider` — проверяемый провайдер,

-  `$userId` — идентификатор пользователя. По умолчанию `null`.

```php
$hasAccess = $manager->checkDataProviderAccess($provider, 7);
```

## Описать поля провайдера

Метод `getFields()` возвращает массив, где ключ — внутренний код поля, а значение — его описание. Используйте коды без точек. Точка разделяет уровни дерева провайдеров.

#|
|| **Ключ** | **Когда нужен** | **Назначение** ||
|| `TITLE` | Для поля, которое показывается в списке | Понятное название поля ||
|| `VALUE` | Для вычисляемого значения или связи | Имя другого поля либо вызываемый обработчик ||
|| `TYPE` | Для специального представления | Тип `IMAGE`, `STAMP`, `DATE`, `TEXT`, `NAME`, `PHONE` или класс-наследник `Value` ||
|| `FORMAT` | Если типу нужны исходные настройки | Массив параметров, который получает класс значения ||
|| `PROVIDER` | Для связанного объекта | Класс вложенного провайдера ||
|| `OPTIONS` | Для настройки вложенного провайдера | Значения, параметры элемента списка и другие опции провайдера ||
|| `REQUIRED` | Для обязательного поля | Значение `Y` включает проверку заполнения ||
|| `HIDE_ROW` | Для изображения, печати или множественного поля в DOCX | Значение `Y` разрешает удалить строку или абзац при пустом результате поля поддерживаемого типа ||
|#

Базовый класс `DataProvider` объявляет защищенное свойство `$data`. Наследник заполняет его данными исходного объекта, например в конструкторе. Если в `$data` есть значение с кодом запрошенного поля, метод `getValue()` возвращает его. Если значения нет, менеджер вычисляет его по `VALUE`. В качестве обработчика используйте метод текущего провайдера, объект с методом или замыкание.

```php
public function getFields(): array
{
    if ($this->fields === null)
    {
        $this->fields = [
            'NUMBER' => [
                'TITLE' => 'Номер заказа',
                'VALUE' => [$this, 'getNumber'],
                'REQUIRED' => 'Y',
            ],
            'DATE' => [
                'TITLE' => 'Дата заказа',
                'VALUE' => [$this, 'getDate'],
                'TYPE' => static::FIELD_TYPE_DATE,
            ],
        ];
    }

    return $this->fields;
}
```

Возвращайте из провайдера предметные данные. Представление даты, имени, телефона, изображения или другого специального значения задавайте через `TYPE`, чтобы формат зависел от шаблона и контекста генерации, а не от способа загрузки объекта.

## Создать и проверить провайдер

Чтобы создать провайдер и получить значения его полей, получите менеджер через `DataProviderManager::getInstance()`. Метод `getDataProvider()` проверяет имя класса, применяет зарегистрированную подмену провайдера и вызывает конструктор с исходным значением и опциями.

```php
<?php

use MyCompany\Orders\Document\OrderDataProvider;
use Bitrix\DocumentGenerator\DataProviderManager;
use Bitrix\Main\Loader;

if (!Loader::includeModule('documentgenerator'))
{
    throw new \RuntimeException('Модуль documentgenerator не установлен');
}

$sourceId = 25;
$manager = DataProviderManager::getInstance();
$provider = $manager->getDataProvider(OrderDataProvider::class, $sourceId);

if ($provider === null || !$provider->isLoaded())
{
    throw new \RuntimeException('Исходный объект не найден');
}

$number = $provider->getValue('NUMBER');
$clientName = $manager->getDataProviderValue($provider, 'CLIENT.NAME');

if ($number === false || $clientName === false)
{
    throw new \RuntimeException('Поле провайдера не найдено или недоступно');
}
```

Поскольку `false` может быть как признаком ошибки при разрешении пути, так и значением самого поля, проверяйте результат с учетом типа поля. Пустая строка, `0` и `null` также могут быть корректными данными.

Чтобы проверить, какие поля доступны, получите список плейсхолдеров. Каждый путь к полю представлен в нем отдельным элементом. Загружать реальный исходный объект для этого не нужно.

```php
$fields = $manager->getProviderPlaceholders(OrderDataProvider::class);

foreach ($fields as $placeholder => $field)
{
    $title = $field['TITLE'] ?? $placeholder;
    echo $placeholder . ': ' . $title . PHP_EOL;
}
```

Менеджер создает провайдер с техническим исходным значением, чтобы обойти его поля. Поэтому `getFields()` должен описывать структуру и при незагруженном объекте. Не загружайте связанные объекты в этом методе. Получайте их в обработчиках `VALUE` только при чтении соответствующего поля.

### Добавить вложенный провайдер

Для связи с одним объектом укажите класс в `PROVIDER`, а в `VALUE` верните исходное значение, которое принимает его конструктор. Менеджер свяжет дочерний провайдер с родительским.

```php
'CLIENT' => [
    'TITLE' => 'Клиент',
    'VALUE' => [$this, 'getClientId'],
    'PROVIDER' => ClientDataProvider::class,
],
```

Если `VALUE` вернул массив вариантов с ключами `VALUE`, `TITLE` и `SELECTED`, менеджер выбирает элемент с признаком `SELECTED`. Если такого элемента нет, менеджер использует первый элемент. Такой список подходит, когда один из связанных объектов выбирается настройкой поля или дополнительным значением документа.

Если исходное значение — массив, а вложенный класс не наследует `ArrayDataProvider` или `HashDataProvider`, менеджер не создает дочерний провайдер автоматически и возвращает массив. Сначала выберите один элемент или используйте класс, который принимает массив.

Класс `HashDataProvider` подходит для одного объекта, который уже представлен ассоциативным массивом. Метод `setData()` оставляет только ключи из `getFields()`. Наследник описывает поля, а данные не нужно загружать отдельным запросом. В отличие от `ArrayDataProvider`, этот класс не обходит набор однотипных объектов и не создает повторяемый блок.

**Пример.** Опишите поля контакта в наследнике `HashDataProvider`:

```php
use Bitrix\DocumentGenerator\DataProvider\HashDataProvider;

final class ContactDataProvider extends HashDataProvider
{
    public function getFields(): array
    {
        return [
            'NAME' => ['TITLE' => 'Имя'],
            'EMAIL' => ['TITLE' => 'Электронная почта'],
        ];
    }
}
```

Передайте конструктору ассоциативный массив с ключами `NAME` и `EMAIL`. Метод `setData()` использует `isset()`, поэтому не сохраняет ключ со значением `null`. Если нужно различать отсутствующий ключ и значение `null`, не используйте базовый `setData()`. Реализуйте загрузку данных в собственном провайдере.

### Добавить множественный провайдер

Для повторяемого набора используйте `ArrayDataProvider`. В `OPTIONS` задайте класс и код одного элемента, а обработчик `VALUE` должен вернуть массив объектов дочернего провайдера.

```php
'ITEMS' => [
    'TITLE' => 'Позиции заказа',
    'VALUE' => [$this, 'getItems'],
    'PROVIDER' => ArrayDataProvider::class,
    'OPTIONS' => [
        'ITEM_PROVIDER' => LineDataProvider::class,
        'ITEM_NAME' => 'ITEM',
        'ITEM_TITLE' => 'Позиция заказа',
    ],
],
```

Класс `ArrayDataProvider` реализует `Iterator` и `Countable`. Он также предоставляет поле `NUMBER` с количеством элементов и поле `INDEX` с номером текущего элемента. Нумерация начинается с единицы. Для каждого элемента списка создавайте дочерний провайдер через менеджер и передавайте текущий объект как родительский:

```php
public function getItems(): array
{
    $items = [];
    foreach ($this->loadItemData() as $itemData)
    {
        $item = DataProviderManager::getInstance()->getDataProvider(
            LineDataProvider::class,
            $itemData,
            [],
            $this
        );

        if ($item !== null)
        {
            $items[] = $item;
        }
    }

    return $items;
}
```

Если поле без `PROVIDER` возвращает массив простых значений, менеджер обрабатывает его по количеству и типу элементов:

-  несколько непустых значений оборачивает в `Value\Multiple`,

-  одно значение, кроме даты, оставляет одиночным,

-  пустой список преобразует в `null`,

-  массив поля типа `NAME` обрабатывает как состав имени.

Тело выводит подготовленные значения в одном плейсхолдере. Используйте `ArrayDataProvider`, когда у каждого элемента есть собственные поля и фрагмент шаблона должен повторяться. Правила маркеров повторяемого блока приведены в статье [Шаблоны, поля и форматирование](./templates-and-fields.md#repeat-block-for-object-list).

Получайте данные элементов одним запросом и передавайте подготовленные массивы дочерним провайдерам. В примере метод `getItems()` передает подготовленный массив `$itemData` в `LineDataProvider`. Не загружайте каждую строку списка отдельным запросом, если исходный модуль поддерживает пакетное чтение.

### Изменить элементы множественного провайдера

Измените содержимое `ArrayDataProvider`, если перед обработкой документа нужно отфильтровать, добавить или заменить элементы. Например, получите множественное поле в обработчике события `onBeforeProcessDocument` и измените созданный объект провайдера.

Методы изменения списка:

-  `getItemByIndex(int $index)` возвращает элемент с указанным индексом или `null`, если элемента нет,

-  `replaceItem(int $index, $item)` заменяет существующий элемент и возвращает текущий `ArrayDataProvider`. Если элемента нет, метод выбрасывает `OutOfRangeException`,

-  `addItem($item)` добавляет элемент в конец и возвращает новое количество элементов. Возвращенное число не является индексом добавленного элемента,

-  `deleteItemByIndex(int $index)` удаляет элемент, заново нумерует оставшиеся индексы и возвращает текущий `ArrayDataProvider`.

Следующий обработчик оставляет только первый элемент поля `ITEMS` и изменяет его название. Элементом служит описанный выше наследник `HashDataProvider`.

```php
use Bitrix\DocumentGenerator\DataProvider\ArrayDataProvider;
use Bitrix\DocumentGenerator\DataProvider\HashDataProvider;
use Bitrix\DocumentGenerator\Document;
use Bitrix\Main\Event;

function prepareDocumentItems(Event $event): void
{
    $document = $event->getParameter('document');

    if (!$document instanceof Document)
    {
        return;
    }

    $provider = $document->getProvider();

    if ($provider === null)
    {
        return;
    }

    $items = $provider->getValue('ITEMS');

    if (!$items instanceof ArrayDataProvider)
    {
        return;
    }

    $firstItem = $items->getItemByIndex(0);

    if ($firstItem instanceof HashDataProvider)
    {
        $data = $firstItem->getData();
        $data['NAME'] = 'Основная позиция';
        $firstItem->setData($data);
    }

    while (count($items) > 1)
    {
        $items->deleteItemByIndex(count($items) - 1);
    }
}
```

Зарегистрируйте обработчик до генерации документа. Порядок вызова события и ограничение на повторную обработку документа описаны в разделе «Перед обработкой тела» статьи [События и расширение модуля](./events-and-extension.md#before-body-processing).

## Проверить доступ к данным

Базовый `DataProvider::hasAccess()` не разрешает чтение корневого объекта. Собственный корневой провайдер должен переопределить этот метод и проверить права на исходный объект для переданного идентификатора пользователя.

```php
public function hasAccess($userId): bool
{
    return $this->isLoaded()
        && OrderAccess::canRead((int)$this->getSource(), (int)$userId);
}
```

Для вложенного провайдера базовая реализация делегирует проверку родительскому, если дочерний объект загружен. Переопределите ее, когда у связанного объекта есть собственная модель доступа.

Метод `DataProviderManager::checkDataProviderAccess()` кеширует результат для пары «провайдер — пользователь». Если переданный идентификатор пользователя не задан или равен `0`, менеджер сначала берет идентификатор пользователя из `Driver`. Проверка пропускается только тогда, когда итоговый идентификатор равен `0`. В пользовательском сценарии передавайте положительный идентификатор и проверяйте результат до ручного чтения данных:

```php
$userId = 7;
if (!$manager->checkDataProviderAccess($provider, $userId))
{
    throw new \RuntimeException('Нет доступа к исходному объекту');
}

$number = $provider->getValue('NUMBER');
```

Во время генерации менеджер проверяет вложенный провайдер, только если в контексте документа включен флаг проверки доступа. Вызов `checkProviderName()` без идентификатора модуля подтверждает наследование, но не регистрацию и не права на конкретный исходный объект.

## Создать собственный провайдер

Собственный провайдер объединяет загрузку исходного объекта, описание полей и проверку доступа. В примере ниже показан провайдер заказа, который возвращает номер и дату заказа, данные клиента и список позиций. В собственном модуле замените классы примера классами, которые работают с вашими данными и моделью прав.

Методы `OrderRepository::getById()` и `ClientRepository::getById()` возвращают массив данных или `null`, если объект не найден. Для данных заказа используйте внутренние ключи `NUMBER`, `DATE`, `CLIENT_ID` и `ITEM_ROWS`. Ключ `ITEM_ROWS` не совпадает с кодом поля `ITEMS`, поэтому базовый `getValue()` вызовет обработчик поля, а не вернет исходный массив напрямую.

Провайдер принимает идентификатор заказа, загружает данные один раз и описывает простое, вложенное и множественное поля.

Пространство имен `MyCompany\Orders` используется только в примере. Замените `MyCompany` пространством имен своего модуля.

```php
<?php

namespace MyCompany\Orders\Document;

use MyCompany\Orders\Access\OrderAccess;
use MyCompany\Orders\ClientRepository;
use MyCompany\Orders\OrderRepository;
use Bitrix\DocumentGenerator\DataProvider;
use Bitrix\DocumentGenerator\DataProvider\ArrayDataProvider;
use Bitrix\DocumentGenerator\DataProviderManager;
use Bitrix\DocumentGenerator\Nameable;

class OrderDataProvider extends DataProvider implements Nameable
{
    public function __construct($source, array $options = [])
    {
        parent::__construct($source, $options);

        // Загрузить данные заказа по исходному идентификатору
        $orderId = (int)$source;
        $this->data = $orderId > 0
            ? OrderRepository::getById($orderId)
            : null;
    }

    public static function getLangName(): string
    {
        return 'Заказ';
    }

    public function isRootProvider(): bool
    {
        return true;
    }

    public function hasAccess($userId): bool
    {
        // Проверить доступ пользователя к загруженному заказу
        return $this->isLoaded()
            && OrderAccess::canRead((int)$this->getSource(), (int)$userId);
    }

    public function getFields(): array
    {
        if ($this->fields === null)
        {
            // Описать простые, вложенные и множественные поля
            $this->fields = [
                'NUMBER' => [
                    'TITLE' => 'Номер заказа',
                    'REQUIRED' => 'Y',
                ],
                'DATE' => [
                    'TITLE' => 'Дата заказа',
                    'TYPE' => static::FIELD_TYPE_DATE,
                ],
                'CLIENT' => [
                    'TITLE' => 'Клиент',
                    'VALUE' => [$this, 'getClientId'],
                    'PROVIDER' => ClientDataProvider::class,
                ],
                'ITEMS' => [
                    'TITLE' => 'Позиции заказа',
                    'VALUE' => [$this, 'getItems'],
                    'PROVIDER' => ArrayDataProvider::class,
                    'OPTIONS' => [
                        'ITEM_PROVIDER' => LineDataProvider::class,
                        'ITEM_NAME' => 'ITEM',
                        'ITEM_TITLE' => 'Позиция заказа',
                    ],
                ],
            ];
        }

        return $this->fields;
    }

    public function getClientId(): ?int
    {
        $clientId = (int)($this->data['CLIENT_ID'] ?? 0);

        return $clientId > 0 ? $clientId : null;
    }

    public function getItems(): array
    {
        // Создать провайдер для каждой позиции заказа
        $items = [];
        foreach ($this->data['ITEM_ROWS'] ?? [] as $itemData)
        {
            $provider = DataProviderManager::getInstance()->getDataProvider(
                LineDataProvider::class,
                $itemData,
                [],
                $this
            );

            if ($provider !== null)
            {
                $items[] = $provider;
            }
        }

        return $items;
    }
}
```

Поля `NUMBER` и `DATE` читаются из `$data` по одноименным ключам. Для `CLIENT` обработчик возвращает идентификатор из `CLIENT_ID`, а для `ITEMS` — провайдеры строк из `ITEM_ROWS`. На основе этих значений менеджер строит следующие уровни дерева.

Вложенный провайдер клиента может загружать объект по идентификатору. Провайдер строки принимает подготовленный массив и не выполняет отдельный запрос:

```php
final class ClientDataProvider extends DataProvider
{
    public function __construct($source, array $options = [])
    {
        parent::__construct($source, $options);
        $this->data = (int)$source > 0
            ? ClientRepository::getById((int)$source)
            : null;
    }

    public function getFields(): array
    {
        return [
            'NAME' => ['TITLE' => 'Имя клиента'],
            'EMAIL' => ['TITLE' => 'Электронная почта'],
        ];
    }
}

final class LineDataProvider extends DataProvider
{
    public function __construct($source, array $options = [])
    {
        parent::__construct($source, $options);
        $this->data = is_array($source) ? $source : null;
    }

    public function getFields(): array
    {
        return [
            'NAME' => ['TITLE' => 'Название'],
            'QUANTITY' => ['TITLE' => 'Количество'],
            'PRICE' => ['TITLE' => 'Цена'],
        ];
    }
}
```

Не выполняйте проверку доступа только по наличию записи. Корневой провайдер должен обращаться к модели прав исходного модуля. Если вложенный объект защищен отдельными правами, добавьте собственный `hasAccess()` и для него.

### Зарегистрировать корневой провайдер {#register-root-provider}

Чтобы провайдер появился в списке доступных классов, зарегистрируйте обработчик события `documentgenerator:onGetDataProviderList` при установке своего модуля. Обработчик возвращает массив, где ключ — имя класса, а описание содержит название, класс и идентификатор модуля.

```php
use MyCompany\Orders\Document\OrderDataProvider;

final class DocumentGeneratorHandlers
{
    public static function getDataProviders(): array
    {
        return [
            mb_strtolower(OrderDataProvider::class) => [
                'NAME' => OrderDataProvider::getLangName(),
                'CLASS' => OrderDataProvider::class,
                'MODULE' => 'mycompany.orders',
            ],
        ];
    }
}
```

Реестр принимает только существующий класс, который наследует `DataProvider` и реализует `Bitrix\DocumentGenerator\Nameable`. Зарегистрируйте обработчик через `EventManager`:

```php
use Bitrix\Main\EventManager;

$eventManager = EventManager::getInstance();
$eventManager->registerEventHandler(
    'documentgenerator',
    'onGetDataProviderList',
    'mycompany.orders',
    DocumentGeneratorHandlers::class,
    'getDataProviders'
);
```

После регистрации проверьте результат через менеджер:

```php
use MyCompany\Orders\Document\OrderDataProvider;
use Bitrix\DocumentGenerator\DataProviderManager;

$providers = DataProviderManager::getInstance()->getList([
    'filter' => ['MODULE' => 'mycompany.orders'],
]);

if (!isset($providers[mb_strtolower(OrderDataProvider::class)]))
{
    throw new \RuntimeException('Провайдер не зарегистрирован');
}
```

При удалении модуля снимите тот же обработчик. Получите объект `EventManager` внутри метода удаления, потому что установка и удаление обычно выполняются раздельно:

```php
use Bitrix\Main\EventManager;

$eventManager = EventManager::getInstance();
$eventManager->unRegisterEventHandler(
    'documentgenerator',
    'onGetDataProviderList',
    'mycompany.orders',
    DocumentGeneratorHandlers::class,
    'getDataProviders'
);
```

При регистрации и удалении обработчика передавайте одинаковые идентификаторы модулей, имя события, класс и метод обработчика. Другие точки расширения смотрите в статье [События и расширение модуля](./events-and-extension.md).

## Подменить зарегистрированный провайдер

При создании объекта менеджер может заменить зарегистрированный класс совместимым наследником. Для этого используется событие `documentgenerator:onDataProviderManagerFillSubstitutionProviders`.

Формат обработчика, требования к классу замены, момент регистрации и способ отключить подмену для одного вызова описаны в разделе «Подменить провайдер наследником» статьи [События и расширение модуля](./events-and-extension.md#replace-provider-with-subclass).

## Добавить региональные фразы

Провайдер может возвращать текст, который зависит от региона шаблона. Для этого переопределите `getLangPhrasesPath()` и верните каталог с файлами `phrase_<регион>.php`. Каждый файл должен возвращать массив «код — фраза».

```php
public function getLangPhrasesPath(): string
{
    return __DIR__ . '/phrases';
}

public function getPaymentStatus(): ?string
{
    $code = !empty($this->data['IS_PAID'])
        ? 'PAYMENT_STATUS_PAID'
        : 'PAYMENT_STATUS_NOT_PAID';

    return DataProviderManager::getInstance()->getLangPhraseValue($this, $code);
}
```

Если регион — числовой идентификатор, менеджер читает фразы из настроек региона модуля. Если регион строковый, он загружает соответствующий PHP-файл из каталога провайдера. При отсутствии каталога базовый метод возвращает `null`, а `getLangPhraseValue()` — пустую строку.

Региональные фразы предназначены для предметного текста, например статуса оплаты. Форматы дат, имен и телефонов задавайте типом поля и региональными настройками контекста.

## Обработать ошибки и рекурсивные связи

Ошибки провайдера возникают на разных уровнях: при проверке класса, загрузке исходного объекта, чтении поля, переходе к связи и проверке доступа. Проверяйте уровни по порядку, чтобы отличить неверную структуру провайдера от отсутствия данных или прав. Отдельно контролируйте рекурсивные связи. Менеджер ограничивает диагностический обход, но не исправляет структуру дерева.

#|
|| **Ситуация** | **Результат API** | **Что проверить** ||
|| Класс не наследует `DataProvider` | `getDataProvider()` возвращает `null` | Пространство имен, автозагрузку и базовый класс ||
|| Исходный объект не найден | `isLoaded()` возвращает `false` | Тип и значение `$source`, результат загрузки ||
|| Поле не описано | `getDataProviderValue()` возвращает `false` | Код поля и результат `getFields()` ||
|| Связь вернула пустое значение | Вложенный провайдер не создается | Обработчик `VALUE` и данные связи ||
|| Пользователь не имеет доступа | При включенной проверке составное значение становится `false` | `hasAccess()`, идентификатор пользователя и контекст документа ||
|| Множественное поле пусто | `ArrayDataProvider` содержит ноль элементов | Запрос списка и создание дочерних провайдеров ||
|| Путь образует цикл | Диагностический обход не входит повторно в уже встреченный класс | Направление связей и границы дерева ||
|#

Менеджер защищает проверку структуры от циклических связей двумя способами:

-  метод `DataProviderManager::getArray()` ведет стек классов текущей ветви дерева и останавливает обход, когда доходит до класса, который уже есть в списке пройденных классов этой ветви,

-  построение списка плейсхолдеров ограничивает глубину цепочки корневых провайдеров.

Эти ограничения помогают при проверке, но не исправляют структуру данных. Если провайдеры ссылаются друг на друга, разорвите цикл. На обратной стороне связи оставьте только идентификатор и простые поля.

Не запускайте загрузку всех связанных объектов в `getFields()`. Описывайте структуру заранее, а данные получайте обработчиками `VALUE`. Такой подход уменьшает число запросов при построении списка полей и позволяет менеджеру запрашивать только нужные ветви дерева.

## Проверить провайдер перед генерацией

Перед привязкой класса к шаблону выполните проверки.

1. Убедитесь, что модуль `documentgenerator` и модуль провайдера подключаются.

2. Проверьте, что класс наследует `DataProvider`, а корневой класс реализует `Nameable`.

3. Убедитесь, что метод `getFields()` возвращает одинаковую структуру для загруженного и технического исходного значения.

4. Проверьте, что метод `isLoaded()` отличает найденный объект от отсутствующего.

5. Убедитесь, что метод `hasAccess()` использует права исходного модуля.

6. Проверьте, что обработчики `VALUE` возвращают тип, который ожидают `TYPE` и `PROVIDER`.

7. Убедитесь, что элементы `ArrayDataProvider` являются объектами дочернего провайдера.

8. Проверьте, что неизвестное поле, пустая связь и пустой список обрабатываются без необработанного исключения.

9. Убедитесь, что связи провайдеров не создают бесконечный цикл.

10. Проверьте, что зарегистрированный класс присутствует в результате `DataProviderManager::getList()`.

После проверки структуры выполните пробную генерацию от имени пользователя с доступом к исходному объекту. Обработайте ошибки из результата `Document::getFile()`. Получение значения провайдера подтверждает только доступность данных, но не успешную обработку тела и сохранение файла.

## Связанные материалы

-  [Шаблоны, поля и форматирование](./templates-and-fields.md) — использование полей провайдера в плейсхолдерах.

-  [Документы](./document-generation.md) — передача исходного объекта при генерации.

-  [Права доступа](./permissions.md) — сочетание разрешений модуля и проверки данных провайдера.

-  [События и расширение модуля](./events-and-extension.md) — регистрация и подмена классов провайдеров.
