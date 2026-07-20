---
title: Складской учет
description: 'Складской учет. Модуль Торговый каталог Bitrix: склады, документы, остатки, штрихкоды и резервирование товаров.'
---

Складской учет помогает вести остатки товаров по складам: принять поставку, списать брак, перенести товар между складами, проверить текущее количество на каждом складе, учесть штрихкоды и резерв.

## Подготовить данные

Перед выполнением примеров подключите модуль `catalog` и проверьте права пользователя на изменение данных каталога и складских документов.

```php
if (!\Bitrix\Main\Loader::includeModule('catalog'))
{
    throw new \RuntimeException('Не удалось подключить модуль catalog');
}
```

{% note tip "" %}

Товар или торговое предложение создайте заранее по статье [Работа с товарами и торговыми предложениями](./products-and-offers.md).

{% endnote %}

Для изменения остатков подготовьте склад. Если товар поступает от поставщика, дополнительно подготовьте поставщика и сохраните его идентификатор для приходного документа.

### Создать склад {#create-store}

Склад хранит информацию о месте учета товара: название, адрес, контакты, режим работы. Склад может быть обычным складом, пунктом выдачи заказов или центром отгрузки.

Чтобы создать склад, вызовите классический метод `CCatalogStore::Add()` и передайте в него массив с параметрами склада.

Основные параметры:

-  `TITLE` — название склада,

-  `ACTIVE` — активность склада,

-  `ADDRESS` — обязательный фактический адрес склада,

-  `PHONE` — контактный телефон,

-  `EMAIL` — электронная почта склада,

-  `SCHEDULE` — режим работы.

Дополнительные параметры:

-  `ISSUING_CENTER` — признак пункта выдачи заказов. Укажите `Y`, если покупатели могут забрать товар со склада.

-  `SHIPPING_CENTER` — признак центра отгрузки. Укажите `Y`, если со склада отправляют заказы курьером или транспортной компанией.

-  `SITE_ID` — идентификатор сайта, к которому привязан склад.

-  `CODE` — символьный код склада для обращения в коде.

-  `SORT` — порядок сортировки в списке складов. Меньшее число — выше в списке.

```php
$storeId = \CCatalogStore::Add([
    'TITLE'           => 'Основной склад',
    'ACTIVE'          => 'Y',
    'ADDRESS'         => 'Москва, ул. Складская, 1',
    'PHONE'           => '+7 495 000-00-00',
    'EMAIL'           => 'store@example.ru',
    'SCHEDULE'        => 'Пн-Пт 09:00-18:00',
    'ISSUING_CENTER'  => 'Y',
    'SHIPPING_CENTER' => 'Y',
    'SITE_ID'         => 's1',
    'CODE'            => 'main-store',
    'SORT'            => 100,
]);

if (!$storeId)
{
    global $APPLICATION;
    $exception = $APPLICATION->GetException();
    $message = $exception ? $exception->GetString() : 'Не удалось создать склад';

    throw new \RuntimeException($message);
}
```

Метод возвращает идентификатор нового склада или `false` при ошибке.

Сохраните идентификатор склада в `$storeId`. Примеры используют его, чтобы записать остаток на склад, списать товар со склада или переместить товар между складами.

{% note info "" %}

При добавлении склада метод `CCatalogStore::Add()` автоматически заполняет дату создания и дату изменения. Если не передать поле `USER_ID`, метод использует идентификатор текущего пользователя.

{% endnote %}

### Получить список складов {#get-stores}

Получите список складов, чтобы выбрать склад для остатков и складских документов. Сохраните поле `ID` из результата в `$storeId`.

В метод `\Bitrix\Catalog\StoreTable::getList` передайте параметры выборки:

-  `select` — поля склада, которые нужно получить,

-  `filter` — условия отбора,

-  `order` — сортировку.

```php
$stores = \Bitrix\Catalog\StoreTable::getList([
    'select' => [
        'ID',
        'TITLE',
        'ADDRESS',
        'PHONE',
        'ISSUING_CENTER',
        'SHIPPING_CENTER',
    ],
    'filter' => [
        '=ACTIVE' => 'Y',
    ],
    'order' => [
        'SORT' => 'ASC',
        'ID' => 'ASC',
    ],
])->fetchAll();
```

### Создать поставщика {#create-contractor}

Поставщик — это контрагент, от которого поступают товары на склад. В приходных документах поставщика указывают в поле `CONTRACTOR_ID`.

{% note info "" %}

Классический источник поставщиков актуален для *1С-Битрикс: Управление сайтом*, когда складской учет работает без модуля CRM. В *1С-Битрикс24* поставщиков создают и редактируют в CRM как контакты и компании отдельной категории.

{% endnote %}

Чтобы создать поставщика в классическом источнике, используйте метод `CCatalogContractor::add()`. При создании задайте его тип `PERSON_TYPE`: юридическое или физическое лицо.

Общие поля для любого типа:

-  `EMAIL`, `PHONE` — контакты,

-  `COUNTRY`, `CITY`, `ADDRESS` — адрес,

-  `INN`, `KPP` — реквизиты.

{% note warning "" %}

Если поставщики хранятся в CRM или в другом подключенном источнике данных, класс `CCatalogContractor` не создает и не обновляет поставщиков.

Создавайте и редактируйте поставщика в собственном источнике. Для 1С-Битрикс24 это контакт или компания CRM в соответствующей категории.

{% endnote %}

#### Создать юридическое лицо

Для юридического лица используйте `PERSON_TYPE => CONTRACTOR_JURIDICAL` и заполните `COMPANY`. Так поставщика будет проще найти в документах. Если передать пустое значение, метод вернет ошибку.

```php
$contractorId = \CCatalogContractor::add([
    'PERSON_TYPE' => CONTRACTOR_JURIDICAL,
    'COMPANY'     => 'ООО "Поставщик"',
    'EMAIL'       => 'supplier@example.ru',
    'PHONE'       => '+7 495 111-22-33',
    'COUNTRY'     => 'Россия',
    'CITY'        => 'Москва',
    'ADDRESS'     => 'Москва, ул. Поставщиков, 10',
    'INN'         => '7700000000',
    'KPP'         => '770001001',
]);

if (!$contractorId)
{
    global $APPLICATION;
    $exception = $APPLICATION->GetException();
    $message = $exception ? $exception->GetString() : 'Не удалось создать поставщика-юрлицо';

    throw new \RuntimeException($message);
}
```

Пример кода сохраняет результат метода в `$contractorId`. Передайте это значение в поле `CONTRACTOR_ID` приходного документа.

#### Создать физическое лицо

Для физического лица используйте `PERSON_TYPE => CONTRACTOR_INDIVIDUAL` и обязательно заполните `PERSON_NAME`.

Если оформляете приход от этого поставщика, сохраните результат метода в `$contractorId`.

```php
$contractorId = \CCatalogContractor::add([
    'PERSON_TYPE' => CONTRACTOR_INDIVIDUAL,
    'PERSON_NAME' => 'Иван Петров',
    'EMAIL'       => 'supplier.person@example.ru',
    'PHONE'       => '+7 921 111-22-33',
    'COUNTRY'     => 'Россия',
    'CITY'        => 'Калининград',
    'ADDRESS'     => 'ул. Примерная, 5',
    'INN'         => '390000000000',
]);

if (!$contractorId)
{
    global $APPLICATION;
    $exception = $APPLICATION->GetException();
    $message = $exception ? $exception->GetString() : 'Не удалось создать поставщика-физлицо';

    throw new \RuntimeException($message);
}
```

## Выбрать способ изменения остатка

Способ изменения остатка зависит от режима складского учета и задачи. Перед выбором способа проверьте настройку складского учета в проекте. Если режим неизвестен, уточните его в настройках торгового каталога.

Выберите способ изменения остатка по сценарию.

#|
|| Сценарий | Способ ||
|| Складской учет выключен | Обновите общий остаток товара через `\Bitrix\Catalog\Model\Product::update()`. Подробнее читайте в статье [Доступность, цены и подписка](./availability-prices-subscription.md) ||
|| Нужно выполнить начальную загрузку остатков или служебную операцию | Запишите остаток по складу через `CCatalogStoreProduct` ||
|| Складской учет включен, товар поступает на склад, уходит со склада или меняет склад учета | Создайте и проведите складской документ с помощью методов класса `CCatalogDocs` ||
|| Нужно связать товар с физическим штрихкодом | Запишите штрихкод через `\Bitrix\Catalog\StoreBarcodeTable` и проверяйте его перед складским документом ||
|| Нужно проверить свободное количество на складе | Получите `AMOUNT` и `QUANTITY_RESERVED` через `\Bitrix\Catalog\StoreProductTable` ||
|| Нужно отменить влияние проведенного документа | Вызовите метод `CCatalogDocs::cancellationDocument()` ||
|| Нужно снять резерв | Создайте и проведите документ `TYPE_UNDO_RESERVE` ||
|#

Прямая запись остатка и складской документ решают разные задачи. Прямая запись меняет текущее количество на складе без истории движения. Складской документ фиксирует причину операции, хранит строки документа и после проведения меняет остатки. Если остаток связан с заказом, резервом или отгрузкой, не заменяйте этот сценарий прямой записью в `CCatalogStoreProduct`: так можно получить расхождение между складом и заказом.

## Записать начальные остатки напрямую {#initial-stock-direct}

Прямая запись через `CCatalogStoreProduct` подходит для запуска нового склада и переноса фактических остатков из внешней системы.

Класс `CCatalogStoreProduct` хранит связь «товар + склад». Чтобы создать запись остатка, используйте метод `Add()`. В примере `$productId` — товар или торговое предложение, а `$storeId` — склад, где нужно записать остаток.

Передайте в метод массив с параметрами:

-  `PRODUCT_ID` — товар или торговое предложение, для которого метод записывает остаток,

-  `STORE_ID` — склад для остатка товара,

-  `AMOUNT` — числовое значение остатка.

```php
$storeProductId = \CCatalogStoreProduct::Add([
    'PRODUCT_ID' => $productId,
    'STORE_ID'   => $storeId,
    'AMOUNT'     => 12,
]);

if (!$storeProductId)
{
    global $APPLICATION;
    $exception = $APPLICATION->GetException();
    $message = $exception ? $exception->GetString() : 'Не удалось записать остаток на складе';

    throw new \RuntimeException($message);
}
```

Метод возвращает идентификатор строки остатка или `false`. После успешного выполнения система создает запись текущего остатка.

Если запись остатка может существовать, используйте `UpdateFromForm()`. Метод находит строку по паре `PRODUCT_ID` и `STORE_ID`. Если строка есть, метод обновляет ее. Если строки нет, метод создает новую.

```php
$storeProductResult = \CCatalogStoreProduct::UpdateFromForm([
    'PRODUCT_ID' => $productId,
    'STORE_ID'   => $storeId,
    'AMOUNT'     => 15, // числовое значение остатка
]);

if (!$storeProductResult)
{
    global $APPLICATION;
    $exception = $APPLICATION->GetException();
    $message = $exception ? $exception->GetString() : 'Не удалось обновить остаток на складе';

    throw new \RuntimeException($message);
}
```

Метод `UpdateFromForm` возвращает результат обновления или `false`.

## Добавить и проверить штрихкоды

Штрихкод помогает кладовщику быстро выбрать нужный товар в приходе, списании, перемещении или отгрузке. Вместо ручного поиска по названию система получает код с упаковки, этикетки или сканера и находит связанную складскую позицию через `\Bitrix\Catalog\StoreBarcodeTable`.

В записи штрихкода укажите товар, значение кода и при необходимости склад. Поле `BARCODE` обязательно, должно быть уникальным и не может быть длиннее 100 символов. Если у товара есть торговые предложения, привязывайте штрихкод к конкретному предложению: в `PRODUCT_ID` передавайте `$offerId`, а не идентификатор родительской карточки.

### Добавить штрихкод товару

В примере `$productId` — товар или торговое предложение, `$storeId` — склад, если штрихкод нужно связать с конкретным складом.

```php
$barcodeResult = \Bitrix\Catalog\StoreBarcodeTable::add([
    'PRODUCT_ID' => $productId,
    'STORE_ID'   => $storeId,
    'BARCODE'    => '4600000000017',
    'CREATED_BY' => $responsibleUserId,
]);

if (!$barcodeResult->isSuccess())
{
    throw new \RuntimeException(implode('; ', $barcodeResult->getErrorMessages()));
}

$barcodeId = (int)$barcodeResult->getId();
```

Метод возвращает объект результата. При успешном добавлении идентификатор записи доступен через `$barcodeResult->getId()`.

### Проверить штрихкод перед документом

Перед работой со складским документом проверьте, что штрихкод существует и относится к нужному товару или предложению. Это снижает риск списать или переместить не тот товар.

```php
$barcodeRow = \Bitrix\Catalog\StoreBarcodeTable::getList([
    'select' => ['ID', 'PRODUCT_ID', 'STORE_ID', 'BARCODE'],
    'filter' => [
        '=BARCODE' => '4600000000017',
    ],
    'limit' => 1,
])->fetch();

if (!$barcodeRow)
{
    throw new \RuntimeException('Штрихкод не найден');
}

if ((int)$barcodeRow['PRODUCT_ID'] !== $productId)
{
    throw new \RuntimeException('Штрихкод относится к другому товару');
}
```

Если штрихкод привязан к складу, сравните `STORE_ID` со складом документа. Если `STORE_ID` не заполнен, код не ограничен конкретным складом.

### Проверить штрихкоды в документе

После создания или проведения документа можно проверить, какие штрихкоды попали в его строки. Для этого используйте `\Bitrix\Catalog\StoreDocumentBarcodeTable`: запись связывает документ, строку документа и значение штрихкода.

```php
$documentBarcodes = \Bitrix\Catalog\StoreDocumentBarcodeTable::getList([
    'select' => ['DOC_ID', 'DOC_ELEMENT_ID', 'BARCODE'],
    'filter' => [
        '=DOC_ID' => $documentId,
    ],
])->fetchAll();
```

Метод `fetchAll()` вернет штрихкоды, которые связаны со строками документа. Если документ должен был обработать штрихкоды, но список пустой, проверьте данные строк документа и настройки учета штрихкодов у товара.

## Изменить остатки складским документом {#update-stock-document}

Документ фиксирует основание операции: поступление, списание, перемещение или другое движение товара.

Сценарий состоит из двух шагов: сначала создайте документ как черновик, затем проведите его. Только после проведения документ изменит остатки.

Используйте методы классического API, чтобы создать и провести документы. Для чтения складов, строк документов и остатков используйте ORM-классы каталога.

Во всех примерах `s1` и `RUB` — демонстрационные значения кода сайта и валюты. Замените их на значения своего проекта. `SITE_ID` связывает документ с сайтом, а `CURRENCY` нужна для документов, где строки содержат закупочную цену.

Складской документ должен хранить ответственного пользователя. В примерах ниже `$responsibleUserId` — идентификатор пользователя из поля `RESPONSIBLE_ID`. Этот же пользователь проводит документ:

```php
$responsibleUserId = 1; // ответственный за документ
```

Все вызовы `CCatalogDocs::add()` создают документ-черновик и возвращают идентификатор документа или `false` при ошибке. Сохраните результат в `$documentId`. Используйте его для проведения, отмены и проверки строк документа.

Если метод вернул `false`, получите текст ошибки из `$APPLICATION->GetException()`.

### Выбрать тип документа

Класс `\Bitrix\Catalog\StoreDocumentTable` содержит типы документов.

#|
|| Тип | Константа | Когда использовать ||
|| Приход | `TYPE_ARRIVAL` | Товар поступил на склад ||
|| Оприходование | `TYPE_STORE_ADJUSTMENT` | Добавляет товар на склад без поставщика ||
|| Перемещение | `TYPE_MOVING` | Меняет склад учета товара ||
|| Возврат | `TYPE_RETURN` | Покупатель возвращает товар на склад ||
|| Списание | `TYPE_DEDUCT` | Убирает товар со склада ||
|| Отмена резервирования | `TYPE_UNDO_RESERVE` | Снимает резерв со склада ||
|#

### Заполнить поля документа

Каждый документ содержит шапку и строки `ELEMENT`. Шапка документа хранит тип, сайт и ответственного пользователя. В строках указывается товар, склад и количество.

Используйте поля, чтобы создать и провести документ.

#|
|| Тип документа | Поля шапки | Поля строки `ELEMENT` ||
|| Приход | `DOC_TYPE`, `SITE_ID`, `RESPONSIBLE_ID`, `CONTRACTOR_ID`, `CURRENCY` | `ELEMENT_ID`, `STORE_TO`, `AMOUNT`, `PURCHASING_PRICE` ||
|| Оприходование | `DOC_TYPE`, `SITE_ID`, `RESPONSIBLE_ID`, `CURRENCY` | `ELEMENT_ID`, `STORE_TO`, `AMOUNT`, `PURCHASING_PRICE` ||
|| Списание | `DOC_TYPE`, `SITE_ID`, `RESPONSIBLE_ID` | `ELEMENT_ID`, `STORE_FROM`, `AMOUNT` ||
|| Перемещение | `DOC_TYPE`, `SITE_ID`, `RESPONSIBLE_ID` | `ELEMENT_ID`, `STORE_FROM`, `STORE_TO`, `AMOUNT` ||
|| Возврат | `DOC_TYPE`, `SITE_ID`, `RESPONSIBLE_ID` | `ELEMENT_ID`, `STORE_TO`, `AMOUNT` ||
|| Отмена резервирования | `DOC_TYPE`, `SITE_ID`, `RESPONSIBLE_ID` | `ELEMENT_ID`, `STORE_FROM`, `AMOUNT` ||
|#

Метод `CCatalogDocs::add()` проверяет базовые поля шапки: `DOC_TYPE`, `SITE_ID` и `RESPONSIBLE_ID`. В настройках модуля можно задать дополнительные обязательные поля для отдельных типов документов.

Поля шапки документа:

-  `DOC_TYPE` — тип операции: приход, списание, перемещение или другой тип из таблицы выше,

-  `SITE_ID` — сайт, с которым связан складской документ,

-  `RESPONSIBLE_ID` — пользователь, который отвечает за документ,

-  `CONTRACTOR_ID` — поставщик для приходного документа,

-  `CURRENCY` — валюта закупочной цены, если строки документа содержат `PURCHASING_PRICE`.

Поля строки `ELEMENT`:

-  `ELEMENT_ID` — товар или торговое предложение. Для товаров с предложениями передавайте идентификатор предложения, потому что система хранит складской остаток у конкретного предложения,

-  `STORE_TO` — склад, на который поступает товар,

-  `STORE_FROM` — склад, с которого документ списывает товар,

-  `AMOUNT` — количество товара,

-  `PURCHASING_PRICE` — закупочная цена.

{% note warning "" %}

Ошибка при сохранении отдельной строки из массива `ELEMENT` не меняет результат `CCatalogDocs::add()`. После создания документа получите его строки и проверьте, что метод сохранил все позиции.

{% endnote %}

### Создать приход

Приход используют, когда товар поступает от поставщика. Тип документа — `TYPE_ARRIVAL`.

Для приходного документа нужен `CONTRACTOR_ID` — идентификатор поставщика, которого создали с помощью метода `CCatalogContractor::add()`.

Пример кода показывает, как оформить приход от поставщика `$contractorId` на склад `$storeId`.

```php
$documentId = \CCatalogDocs::add([
    'DOC_TYPE'       => \Bitrix\Catalog\StoreDocumentTable::TYPE_ARRIVAL,
    'SITE_ID'        => 's1',
    'TITLE'          => 'Поступление товара',
    'CURRENCY'       => 'RUB',
    'CONTRACTOR_ID'  => $contractorId, // идентификатор поставщика приходного документа
    'RESPONSIBLE_ID' => $responsibleUserId, // идентификатор ответственного за документ
    'ELEMENT'        => [
        [
            'ELEMENT_ID'       => $productId,
            'STORE_TO'         => $storeId,
            'AMOUNT'           => 10, // количество товара
            'PURCHASING_PRICE' => 900, // закупочная цена
        ],
    ],
]);

if (!$documentId)
{
    global $APPLICATION;
    $exception = $APPLICATION->GetException();
    $message = $exception ? $exception->GetString() : 'Не удалось создать документ';

    throw new \RuntimeException($message);
}
```

В следующих примерах проверяйте `$documentId` так же, как в примере прихода.

### Создать оприходование

Оприходование используют, когда нужно добавить товар на склад без поставщика, например после инвентаризации. Тип документа — `TYPE_STORE_ADJUSTMENT`.

Чтобы добавить товар `$productId` на склад `$storeId` без поставщика, используйте следующий код:

```php
$documentId = \CCatalogDocs::add([
    'DOC_TYPE'       => \Bitrix\Catalog\StoreDocumentTable::TYPE_STORE_ADJUSTMENT,
    'SITE_ID'        => 's1',
    'TITLE'          => 'Оприходование товара',
    'CURRENCY'       => 'RUB',
    'RESPONSIBLE_ID' => $responsibleUserId, // идентификатор ответственного за документ
    'ELEMENT'        => [
        [
            'ELEMENT_ID'       => $productId,
            'STORE_TO'         => $storeId,
            'AMOUNT'           => 5, // количество товара
            'PURCHASING_PRICE' => 900, // закупочная цена
        ],
    ],
]);
```

### Создать списание

Списание используют, когда товар нужно убрать со склада: брак, потеря или служебная корректировка.

Чтобы списать товар `$productId` со склада `$storeId`, вызовите `CCatalogDocs::add()` с типом `TYPE_DEDUCT`:

```php
$documentId = \CCatalogDocs::add([
    'DOC_TYPE'       => \Bitrix\Catalog\StoreDocumentTable::TYPE_DEDUCT,
    'SITE_ID'        => 's1',
    'TITLE'          => 'Списание товара',
    'RESPONSIBLE_ID' => $responsibleUserId, // идентификатор ответственного за документ
    'ELEMENT'        => [
        [
            'ELEMENT_ID' => $productId,
            'STORE_FROM' => $storeId,
            'AMOUNT'     => 2, // количество товара
        ],
    ],
]);
```

### Создать перемещение

Перемещение используют, когда товар остается в компании, но меняет склад учета. Тип документа — `TYPE_MOVING`.

Например, перенесите товар `$productId` со склада `$storeId` на склад `$targetStoreId`:

```php
$targetStoreId = 2;     // склад-получатель

$documentId = \CCatalogDocs::add([
    'DOC_TYPE'       => \Bitrix\Catalog\StoreDocumentTable::TYPE_MOVING,
    'SITE_ID'        => 's1',
    'TITLE'          => 'Перемещение товара между складами',
    'RESPONSIBLE_ID' => $responsibleUserId, // идентификатор ответственного за документ
    'ELEMENT'        => [
        [
            'ELEMENT_ID' => $productId,
            'STORE_FROM' => $storeId,
            'STORE_TO'   => $targetStoreId,
            'AMOUNT'     => 3, // количество товара
        ],
    ],
]);
```

### Создать возврат

Возврат используют, когда покупатель возвращает товар на склад после продажи или отгрузки. Тип документа — `TYPE_RETURN`.

Чтобы вернуть товар `$productId` на склад `$storeId`, используйте следующий код:

```php
$documentId = \CCatalogDocs::add([
    'DOC_TYPE'       => \Bitrix\Catalog\StoreDocumentTable::TYPE_RETURN,
    'SITE_ID'        => 's1',
    'TITLE'          => 'Возврат товара на склад',
    'RESPONSIBLE_ID' => $responsibleUserId, // идентификатор ответственного за документ
    'ELEMENT'        => [
        [
            'ELEMENT_ID' => $productId,
            'STORE_TO'   => $storeId,
            'AMOUNT'     => 1, // количество товара
        ],
    ],
]);
```

### Создать отмену резервирования

Отмена резервирования снимает зарезервированное количество товара со склада. Тип документа — `TYPE_UNDO_RESERVE`.

Пример кода показывает, как снять резерв по товару `$productId` со склада `$storeId`.

```php
$documentId = \CCatalogDocs::add([
    'DOC_TYPE'       => \Bitrix\Catalog\StoreDocumentTable::TYPE_UNDO_RESERVE,
    'SITE_ID'        => 's1',
    'TITLE'          => 'Отмена резервирования товара',
    'RESPONSIBLE_ID' => $responsibleUserId, // идентификатор ответственного за документ
    'ELEMENT'        => [
        [
            'ELEMENT_ID' => $productId,
            'STORE_FROM' => $storeId,
            'AMOUNT'     => 1, // количество товара
        ],
    ],
]);
```

### Проверить строки документа

Чтобы получить строки документа, используйте метод `\Bitrix\Catalog\StoreDocumentElementTable::getList`. В `filter` передайте `$documentId` в поле `DOC_ID`.

```php
$documentRows = \Bitrix\Catalog\StoreDocumentElementTable::getList([
    'select' => ['DOC_ID', 'ELEMENT_ID', 'STORE_FROM', 'STORE_TO', 'AMOUNT'],
    'filter' => ['=DOC_ID' => $documentId],
])->fetchAll();
```

Метод `fetchAll()` возвращает массив строк документа. Каждая строка описывает одну товарную позицию документа.

### Провести документ {#conduct-document}

Метод `CCatalogDocs::conductDocument` применяет документ к остаткам. До проведения документ остается черновиком.

Первым параметром передайте `$documentId` — идентификатор созданного документа. Вторым передайте `$responsibleUserId` — пользователя, который проводит документ. Обычно это тот же пользователь, что и в `RESPONSIBLE_ID`.

{% note warning "" %}

Методы проведения и отмены проведения не работают, если складской учет выключен или магазин работает в режиме внешнего каталога 1С.

{% endnote %}

```php
$conducted = \CCatalogDocs::conductDocument($documentId, $responsibleUserId);

if (!$conducted)
{
    global $APPLICATION;
    $exception = $APPLICATION->GetException();
    $message = $exception ? $exception->GetString() : 'Не удалось провести документ';

    throw new \RuntimeException($message);
}
```

Метод возвращает результат проведения или `false` при ошибке. После проведения система обновляет остатки на складах.

Документ после проведения нельзя удалить как черновик. Чтобы снять влияние на остатки, используйте `CCatalogDocs::cancellationDocument()`.

### Отменить проведение документа {#cancel-document}

Отмена нужна, если документ провели ошибочно. Она не удаляет документ, а выполняет обратное движение по остаткам.

```php
$cancelled = \CCatalogDocs::cancellationDocument($documentId, $responsibleUserId);

if (!$cancelled)
{
    global $APPLICATION;
    $exception = $APPLICATION->GetException();
    $message = $exception ? $exception->GetString() : 'Не удалось отменить проведение документа';

    throw new \RuntimeException($message);
}
```

Метод отмены возвращает результат отмены или `false` при ошибке. После отмены система восстанавливает остатки до состояния до проведения.

## Проверить остатки по складам {#check-store-stock}

Чтобы получить остатки по складам, используйте `\Bitrix\Catalog\StoreProductTable::getList`. В параметры выборки передайте:

-  `select` — поля остатка и связанные поля склада,

-  `filter` — `$productId`, идентификатор товара, остатки которого нужно проверить.

```php
$storeRows = \Bitrix\Catalog\StoreProductTable::getList([
    'select' => [
        'STORE_ID',
        'AMOUNT',
        'STORE_TITLE' => 'STORE.TITLE',
    ],
    'filter' => [
        '=PRODUCT_ID' => $productId,
    ],
    'order' => [
        'STORE_ID' => 'ASC',
    ],
])->fetchAll();

foreach ($storeRows as $row)
{
    echo $row['STORE_TITLE'] . ': ' . $row['AMOUNT'] . "\n";
}
```

В поле `STORE_TITLE` пример выводит название склада из связанной записи `STORE.TITLE`. В результате видно идентификатор склада и его название.

Для товаров с предложениями запрашивайте остатки по предложениям, а не по основному товару. Сначала получите предложения товара через `CCatalogSKU::getOffersList()`.

```php
$offersByProduct = \CCatalogSKU::getOffersList(
    $productId,
    0,
    ['ACTIVE' => 'Y'],
    ['ID', 'NAME', 'IBLOCK_ID']
);

$offers = $offersByProduct[$productId] ?? [];
```

Метод `getOffersList()` возвращает массив и группирует его по идентификаторам родительских товаров. В `$offers` код сохраняет предложения для товара `$productId`.

Из массива `$offers` соберите `$offerIds` — список идентификаторов предложений. Передайте его в фильтр через оператор `@`, чтобы получить остатки сразу по нескольким предложениям.

```php
$offerIds = array_column($offers, 'ID');

$storeRows = \Bitrix\Catalog\StoreProductTable::getList([
    'select' => ['PRODUCT_ID', 'STORE_ID', 'AMOUNT'],
    'filter' => [
        '@PRODUCT_ID' => $offerIds,
    ],
])->fetchAll();
```

Метод `fetchAll()` вернет массив строк. Каждая строка содержит остаток товара на конкретном складе.

## Проверить резерв

Резерв показывает, какая часть остатка уже занята и не должна участвовать в новых складских операциях. Это важно перед ручным списанием, перемещением или служебной корректировкой: физически товар может лежать на складе, но часть количества уже зарезервирована.

Остаток по паре товар и склад получите через `\Bitrix\Catalog\StoreProductTable`. Для проверки резерва нужны поля:

-  `PRODUCT_ID` — идентификатор товара или торгового предложения,

-  `STORE_ID` — идентификатор склада,

-  `AMOUNT` — общий остаток товара на складе,

-  `QUANTITY_RESERVED` — зарезервированное количество товара на складе.

В `StoreProductTable` нет идентификатора заказа или отгрузки, для которых появился резерв. Таблица показывает только числовое состояние остатка на складе.

Чтобы проверить свободное количество, получите остаток и резерв по нужному складу. В таблице нет отдельного поля свободного остатка, поэтому в прикладном коде его считают как `AMOUNT - QUANTITY_RESERVED`.

```php
$storeProductRow = \Bitrix\Catalog\StoreProductTable::getList([
    'select' => ['PRODUCT_ID', 'STORE_ID', 'AMOUNT', 'QUANTITY_RESERVED'],
    'filter' => [
        '=PRODUCT_ID' => $productId,
        '=STORE_ID' => $storeId,
    ],
    'limit' => 1,
])->fetch();

if (!$storeProductRow)
{
    throw new \RuntimeException('Остаток товара на складе не найден');
}

$amount = (float)$storeProductRow['AMOUNT'];
$reserved = (float)$storeProductRow['QUANTITY_RESERVED'];
$freeAmount = max(0, $amount - $reserved);
```

Если нужно снять резерв, создайте документ `TYPE_UNDO_RESERVE` и проведите его. Не уменьшайте `QUANTITY_RESERVED` прямой записью, если резерв связан с заказом: заказ, отгрузка и складской учет должны остаться согласованными.

## Проверить партии

Партии помогают отличать одно поступление товара от другого. Это нужно, когда важны закупочная цена, поставка или внутренние правила списания. На складе может быть один и тот же товар, но в разных партиях.

Список партий товара на складе можно получить с помощью `\Bitrix\Catalog\StoreBatchTable`. Для проверки обычно нужны поля:

-  `ELEMENT_ID` — идентификатор товара или торгового предложения,

-  `STORE_ID` — идентификатор склада,

-  `AVAILABLE_AMOUNT` — доступное количество в партии,

-  `PURCHASING_PRICE` — закупочная цена партии,

-  `PURCHASING_CURRENCY` — валюта закупочной цены.

Чтобы посмотреть партии товара на складе, отфильтруйте список по товару и складу.

```php
$batches = \Bitrix\Catalog\StoreBatchTable::getList([
    'select' => [
        'ID',
        'ELEMENT_ID',
        'STORE_ID',
        'AVAILABLE_AMOUNT',
        'PURCHASING_PRICE',
        'PURCHASING_CURRENCY',
    ],
    'filter' => [
        '=ELEMENT_ID' => $productId,
        '=STORE_ID' => $storeId,
    ],
    'order' => [
        'ID' => 'ASC',
    ],
])->fetchAll();
```

Метод `fetchAll()` вернет партии товара на выбранном складе. Для товара с торговыми предложениями передавайте идентификатор предложения, потому что складской остаток и партии относятся к продаваемому варианту.

Если нужно понять, из какой партии пришло или ушло количество по документу, проверьте связи через `\Bitrix\Catalog\StoreBatchDocumentElementTable`. В строках связи используются поля:

-  `PRODUCT_BATCH_ID` — идентификатор партии из `StoreBatchTable`,

-  `DOCUMENT_ELEMENT_ID` — идентификатор строки складского документа,

-  `SHIPMENT_ITEM_STORE_ID` — идентификатор складской строки отгрузки,

-  `AMOUNT` — количество из партии,

-  `BATCH_PRICE` — цена партии,

-  `BATCH_CURRENCY` — валюта цены партии.

Чтобы проверить, какие партии участвовали в строках документа, сначала получите строки документа через `StoreDocumentElementTable`, затем запросите связи по их идентификаторам.

```php
$documentRows = \Bitrix\Catalog\StoreDocumentElementTable::getList([
    'select' => ['ID', 'DOC_ID', 'ELEMENT_ID', 'AMOUNT'],
    'filter' => [
        '=DOC_ID' => $documentId,
    ],
])->fetchAll();

$documentElementIds = array_column($documentRows, 'ID');

$batchRows = [];
if (!empty($documentElementIds))
{
    $batchRows = \Bitrix\Catalog\StoreBatchDocumentElementTable::getList([
        'select' => [
            'PRODUCT_BATCH_ID',
            'DOCUMENT_ELEMENT_ID',
            'AMOUNT',
            'BATCH_PRICE',
            'BATCH_CURRENCY',
        ],
        'filter' => [
            '@DOCUMENT_ELEMENT_ID' => $documentElementIds,
        ],
    ])->fetchAll();
}
```

В прикладном коде не создавайте партии отдельно от складского движения, если не контролируете весь сценарий учета. Оформляйте поступление, списание, перемещение и возврат складскими документами. Документ сохраняет движение, а связанные складские механизмы могут использовать партии при обработке строк.

Прямая запись остатка через `CCatalogStoreProduct` не создает историю движения и не описывает партию поступления. Используйте ее только для начальной загрузки или служебной корректировки, где партия не участвует в бизнес-логике.

## Продолжить изучение

-  [Работа с товарами и торговыми предложениями](./products-and-offers.md)

-  [Базовые настройки каталога](./catalog-settings.md)

-  [Доступность, цены и подписка](./availability-prices-subscription.md)
