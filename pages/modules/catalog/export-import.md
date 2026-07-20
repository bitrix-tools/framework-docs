---
title: Экспорт и импорт
description: 'Экспорт и импорт. Модуль Торговый каталог Bitrix: профили обмена, PHP-шаблоны и сценарии выгрузки и загрузки товаров.'
---

Импорт и экспорт в модуле каталога работают через профили и PHP-шаблоны. Профиль хранит имя рабочего шаблона и параметры запуска в поле `SETUP_VARS`. Шаблон выполняет прикладную задачу: выгружает товары в файл, читает файл импорта, обновляет карточки товаров, цены или остатки.

Для обмена данными подготовьте рабочий шаблон, передайте ему настройки через профиль, запустите экспорт или импорт и проверьте результат.

## Как устроен обмен

Шаблоны размещают в папках проекта:

-  экспорт — в `/bitrix/php_interface/include/catalog_export/`,

-  импорт — в `/bitrix/php_interface/include/catalog_import/`.

Имя рабочего скрипта шаблона заканчивается на `_run.php`. При запуске по профилю система подключает файл с этим суффиксом.

Файл `_setup.php` рядом с рабочим скриптом используют для мастера настроек в административной части.

Профиль связывает настройки и рабочий файл. В `FILE_NAME` хранится имя шаблона без `_run.php`, а в `SETUP_VARS` — строка параметров. Если профиль не помечен как `DEFAULT_PROFILE`, при запуске система передает эти параметры в шаблон как обычные PHP-переменные, например `$IBLOCK_ID`, `$SETUP_FILE_NAME` или `$URL_DATA_FILE`.

{% note warning "" %}

Перед выполнением примеров кода подключите модули `iblock` и `catalog`, проверьте права пользователя на чтение и изменение каталога. Товарный инфоблок подготовьте по статье [Работа с товарами и торговыми предложениями](./products-and-offers.md).

{% endnote %}

## Выбрать сценарий

Сценарий зависит от того, что нужно сделать с данными каталога.

#|
|| Сценарий | Что подготовить ||
|| Разовая выгрузка товаров в файл | Шаблон экспорта и профиль с путем к файлу результата ||
|| Регулярная выгрузка по расписанию | Профиль экспорта с `IN_AGENT` или `IN_CRON` и настройка запуска агента или cron ||
|| Разовая загрузка файла | Шаблон импорта и профиль с путем к файлу данных ||
|| Мастер с настройками в административной части | Файл `_setup.php`, который собирает параметры и передает их рабочему шаблону ||
|| Обновление существующих профилей | Методы `GetList()`, `GetByID()`, `Update()` и `Delete()` классов `CCatalogExport` и `CCatalogImport` ||
|#

Если нужно загрузить цены, остатки или торговые предложения, используйте шаблон импорта как точку входа. Внутри шаблона вызывайте API из статей [Работа с товарами и торговыми предложениями](./products-and-offers.md), [Доступность, цены и подписка](./availability-prices-subscription.md) и [Складской учет](./inventory-management.md).

## Экспорт

Экспорт выгружает данные каталога в файл. Для запуска подготовьте рабочий шаблон, сохраните настройки в профиле и вызовите профиль вручную, агентом или через cron.

### Подготовить шаблон экспорта {#prepare-export-template}

Пользовательский шаблон экспорта размещают в `/bitrix/php_interface/include/catalog_export/`. В шаблоне должен быть весь код, который нужен для выгрузки данных. Предустановленные шаблоны могут только подключать рабочие скрипты.

Шаблон экспорта — обычный PHP-скрипт без вывода данных на экран. В скрипте доступны стандартные переменные системы и переменные, которые установил мастер экспорта или профиль.

В примере ниже `$IBLOCK_ID` — идентификатор инфоблока каталога. Профиль передает его в шаблон через `SETUP_VARS`, а шаблон приводит значение к числу и сохраняет в `$productIblockId`.

Ключевые переменные шаблона экспорта:

-  `$SETUP_FILE_NAME` — путь к файлу данных, в который шаблон записывает результат. Путь может быть относительным или абсолютным. После экспорта система покажет полный путь к файлу.

-  `$strExportErrorMessage` — текст ошибки экспорта. Если шаблон установит эту переменную, система считает экспорт неудачным и покажет ее содержимое.

```php
//<title>Экспорт мебели в CSV</title>

$productIblockId = (int)$IBLOCK_ID;
$exportFile = (string)$SETUP_FILE_NAME;
$allowedDirectory = '/upload/export/';

if ($productIblockId <= 0)
{
    $strExportErrorMessage = 'Не выбран инфоблок каталога';
}
elseif ($exportFile === '')
{
    $strExportErrorMessage = 'Не указан файл экспорта';
}
elseif (strncmp($exportFile, $allowedDirectory, strlen($allowedDirectory)) !== 0)
{
    $strExportErrorMessage = 'Файл экспорта должен находиться в /upload/export/';
}
else
{
    $filePath = $_SERVER['DOCUMENT_ROOT'] . $exportFile;
    $file = fopen($filePath, 'wb');

    if (!$file)
    {
        $strExportErrorMessage = 'Не удалось открыть файл экспорта';
    }
    else
    {
        fputcsv($file, ['ID', 'XML_ID', 'NAME'], ';');

        $elementsIterator = \CIBlockElement::GetList(
            ['ID' => 'ASC'],
            [
                'IBLOCK_ID' => $productIblockId,
                'ACTIVE' => 'Y',
            ],
            false,
            false,
            ['ID', 'XML_ID', 'NAME']
        );

        while ($element = $elementsIterator->Fetch())
        {
            fputcsv(
                $file,
                [
                    (int)$element['ID'],
                    (string)$element['XML_ID'],
                    (string)$element['NAME'],
                ],
                ';'
            );
        }

        fclose($file);
    }
}
```

Этот пример выгружает только карточки элементов инфоблока. В вызове `CIBlockElement::GetList()` первый массив задает сортировку по `ID`, второй — фильтр по инфоблоку и активности, последний — поля, которые попадут в CSV. Если нужно добавить цены, остатки или свойства, расширьте выборку и получите дополнительные данные через API каталога.

### Подготовить мастер экспорта

Мастер экспорта задает дополнительные параметры шаблона: инфоблок, группы товаров, путь к файлу данных и другие настройки. Если шаблону не нужны дополнительные параметры, файл `_setup.php` можно не создавать.

Мастер может состоять из нескольких шагов. Номер текущего шага хранит переменная `$STEP`. При переходе к следующему шагу увеличьте `$STEP`. На последнем шаге установите `$FINITE = true`. После этого система передаст управление шаблону экспорта или сохранит профиль.

После окончания мастера подготовьте переменные:

-  `$SETUP_FIELDS_LIST` — список имен переменных, которые установил мастер. Имена разделяют запятыми.

-  `$SETUP_PROFILE_NAME` — название профиля. Переменная нужна, если действие мастера создает профиль экспорта и `$ACTION` равен `EXPORT_SETUP`.

Для пути к файлу данных используйте `$SETUP_FILE_NAME`, чтобы после экспорта система показала полный путь к созданному файлу.

Поля из `$SETUP_FIELDS_LIST` попадут в `SETUP_VARS` профиля. При запуске профиля система разберет эту строку и создаст одноименные переменные в рабочем шаблоне.

В примере показана серверная логика мастера: проверка параметров и передача списка полей в профиль. HTML-форму мастера добавьте по правилам административной страницы проекта.

```php
$errorMessage = '';

if ($STEP > 1)
{
    $IBLOCK_ID = (int)$IBLOCK_ID;

    if ($IBLOCK_ID <= 0)
    {
        $errorMessage .= 'Инфоблок не выбран.<br>';
    }

    if ((string)$SETUP_FILE_NAME === '')
    {
        $errorMessage .= 'Не указан файл данных.<br>';
    }

    if ($ACTION === 'EXPORT_SETUP' && (string)$SETUP_PROFILE_NAME === '')
    {
        $errorMessage .= 'Не указано имя профиля.<br>';
    }

    if ($errorMessage !== '')
    {
        $STEP = 1;
    }
}

if ((int)$STEP === 1)
{
    $SETUP_FIELDS_LIST = 'IBLOCK_ID,SETUP_FILE_NAME';
}
elseif ((int)$STEP === 2)
{
    $FINITE = true;
}
```

### Создать профиль экспорта {#create-export-profile}

Чтобы создать профиль экспорта, вызовите метод `CCatalogExport::Add`. В примере `$productIblockId` — идентификатор инфоблока каталога, товары которого нужно выгрузить. Его значение сохраняется в `SETUP_VARS` как параметр `IBLOCK_ID`, чтобы при запуске шаблон получил переменную `$IBLOCK_ID`.

В метод передайте массив с параметрами:

-  `FILE_NAME` — имя шаблона без суффикса `_run.php`,

-  `NAME` — название профиля,

-  `SETUP_VARS` — строка с параметрами шаблона в формате URL-запроса,

-  `IN_MENU` — показывать в административном меню: `Y` или `N`,

-  `IN_AGENT` — запускать агентом: `Y` или `N`,

-  `IN_CRON` — запускать через cron: `Y` или `N`,

-  `DEFAULT_PROFILE` — назначить профилем по умолчанию: `Y` или `N`,

-  `NEED_EDIT` — требовать редактирования перед запуском: `Y` или `N`.

`FILE_NAME` должен совпадать с именем файла шаблона без суффикса `_run.php`. Например, для файла `furniture_csv_run.php` передайте `furniture_csv`.

```php
$setupVars = http_build_query([
    'IBLOCK_ID' => $productIblockId,
    'SETUP_FILE_NAME' => '/upload/export/furniture.csv',
]);

$exportProfileId = \CCatalogExport::Add([
    'FILE_NAME'       => 'furniture_csv',
    'NAME'            => 'Экспорт мебели в CSV',
    'IN_MENU'         => 'Y',
    'IN_AGENT'        => 'N',
    'IN_CRON'         => 'N',
    'DEFAULT_PROFILE' => 'N',
    'NEED_EDIT'       => 'N',
    'SETUP_VARS'      => $setupVars,
]);

if (!$exportProfileId)
{
    throw new \RuntimeException('Не удалось создать профиль экспорта');
}
```

Метод возвращает идентификатор профиля или `false`. В примере результат сохраняется в `$exportProfileId`. Этот идентификатор нужен для запуска, обновления и удаления профиля.

### Запустить экспорт по профилю {#run-export-profile}

Запуск выполняет `CCatalogExport::PreGenerateExport()`. В метод передайте `$exportProfileId` — идентификатор профиля, который вернул `CCatalogExport::Add()` или `CCatalogExport::GetByID()`.

Метод находит профиль, подключает файл шаблона и обновляет дату последнего запуска. Для профиля, у которого `DEFAULT_PROFILE` не равен `Y`, метод разбирает параметры из `SETUP_VARS` и передает их в шаблон.

```php
$agentCall = \CCatalogExport::PreGenerateExport($exportProfileId);

if ($agentCall === false)
{
    throw new \RuntimeException('Не удалось запустить экспорт по профилю');
}
```

Метод возвращает строку для запуска агента или `false`. Запуск отменяется, если профиль не найден, требует редактирования или файл шаблона отсутствует.

После запуска проверьте файл, путь к которому передан в `SETUP_FILE_NAME`. Если шаблон установил `$strExportErrorMessage`, экспорт завершится с ошибкой.

### Получить список профилей экспорта {#get-export-profiles}

Метод `CCatalogExport::GetList` возвращает список профилей экспорта.

```php
$profilesIterator = \CCatalogExport::GetList(
    ['NAME' => 'ASC'],
    ['IN_MENU' => 'Y']
);

while ($profile = $profilesIterator->Fetch())
{
    echo $profile['ID'] . ': ' . $profile['NAME'] . "\n";
}

$profileCount = \CCatalogExport::GetList([], [], true);
```

В первом параметре `GetList()` передайте сортировку, во втором — фильтр. В примере метод выбирает профили, которые показываются в административном меню, и сортирует их по названию. Если вызвать метод `GetList()` с третьим параметром `true`, он вернет только количество записей.

### Получить профиль экспорта по идентификатору {#get-export-profile}

Один профиль экспорта можно получить через `GetByID()`. В метод передайте идентификатор профиля.

```php
$profile = \CCatalogExport::GetByID($exportProfileId);
```

Метод `GetByID()` возвращает массив полей профиля или `false`, если профиль не найден.

### Обновить и удалить профиль экспорта {#update-delete-export-profile}

Чтобы изменить профиль экспорта, используйте `CCatalogExport::Update()`. Чтобы удалить — `CCatalogExport::Delete()`.

```php
$updatedExportProfileId = \CCatalogExport::Update($exportProfileId, [
    'NAME'       => 'Экспорт мебели в CSV для витрины',
    'SETUP_VARS' => http_build_query([
        'IBLOCK_ID' => $productIblockId,
        'SETUP_FILE_NAME' => '/upload/export/furniture-public.csv',
    ]),
]);

if (!$updatedExportProfileId)
{
    throw new \RuntimeException('Не удалось обновить профиль экспорта');
}

\CCatalogExport::Delete($exportProfileId);
```

Метод `Update()` возвращает идентификатор обновленного профиля или `false`. `Delete()` удаляет профиль и возвращает результат операции.

## Импорт

Импорт загружает данные из файла в каталог. Для запуска подготовьте рабочий шаблон, передайте путь к файлу через профиль и обработайте строки файла в шаблоне.

### Подготовить шаблон импорта {#prepare-import-template}

Пользовательский шаблон импорта размещают в `/bitrix/php_interface/include/catalog_import/`. В качестве шаблонов система предлагает файлы, которые заканчиваются на `_run.php`. Если рядом есть файл с таким же именем и суффиксом `_setup.php`, система считает его мастером импорта.

Шаблон импорта — обычный PHP-скрипт без вывода данных на экран. В нем доступны стандартные переменные системы и переменные, которые установил мастер импорта или профиль.

В примере ниже `$IBLOCK_ID` — идентификатор инфоблока каталога, а `$URL_DATA_FILE` — путь к CSV-файлу импорта. Профиль передает эти значения через `SETUP_VARS`, затем шаблон сохраняет их в `$productIblockId` и `$dataFile`.

Ключевые переменные шаблона импорта:

-  `$URL_DATA_FILE` — путь к файлу данных для импорта.

-  `$strImportErrorMessage` — текст ошибки импорта. Если шаблон установит эту переменную, система считает импорт неудачным и покажет ее содержимое.

```php
//<title>Импорт мебели из CSV</title>

$productIblockId = (int)$IBLOCK_ID;
$dataFile = (string)$URL_DATA_FILE;
$allowedDirectory = '/upload/import/';

if ($productIblockId <= 0)
{
    $strImportErrorMessage = 'Не выбран инфоблок каталога';
}
elseif ($dataFile === '')
{
    $strImportErrorMessage = 'Не указан файл импорта';
}
elseif (strncmp($dataFile, $allowedDirectory, strlen($allowedDirectory)) !== 0)
{
    $strImportErrorMessage = 'Файл импорта должен находиться в /upload/import/';
}
elseif (!is_readable($_SERVER['DOCUMENT_ROOT'] . $dataFile))
{
    $strImportErrorMessage = 'Файл импорта недоступен для чтения';
}
else
{
    $file = fopen($_SERVER['DOCUMENT_ROOT'] . $dataFile, 'rb');
    $element = new \CIBlockElement;

    if (!$file)
    {
        $strImportErrorMessage = 'Не удалось открыть файл импорта';
    }
    else
    {
        fgetcsv($file, 0, ';'); // пропускаем строку заголовков

        while (($row = fgetcsv($file, 0, ';')) !== false)
        {
            [$xmlId, $name] = array_pad($row, 2, '');

            $xmlId = trim((string)$xmlId);
            $name = trim((string)$name);

            if ($xmlId === '' || $name === '')
            {
                $strImportErrorMessage = 'В файле импорта есть строка без XML_ID или названия';
                break;
            }

            $elementRow = \CIBlockElement::GetList(
                [],
                [
                    'IBLOCK_ID' => $productIblockId,
                    '=XML_ID' => $xmlId,
                ],
                false,
                false,
                ['ID']
            )->Fetch();

            if ($elementRow)
            {
                $result = $element->Update((int)$elementRow['ID'], [
                    'NAME' => $name,
                ]);
            }
            else
            {
                $result = $element->Add([
                    'IBLOCK_ID' => $productIblockId,
                    'XML_ID' => $xmlId,
                    'NAME' => $name,
                    'ACTIVE' => 'Y',
                ]);
            }

            if (!$result)
            {
                $strImportErrorMessage = $element->LAST_ERROR ?: 'Не удалось сохранить элемент каталога';
                break;
            }
        }

        fclose($file);
    }
}
```

Пример импортирует только карточки элементов инфоблока. В каждой строке CSV первое значение попадает в `$xmlId`, второе — в `$name`. Поле `XML_ID` используется как внешний идентификатор товара: по нему пример ищет существующий элемент и обновляет его, а если элемент не найден — создает новый.

Чтобы элемент стал товаром торгового каталога, добавьте товарные параметры через `\Bitrix\Catalog\Model\Product::add()` или `update()`. Чтобы загрузить цену, вызовите методы класса `\Bitrix\Catalog\Model\Price`. Для остатков по складам используйте API складского учета.

### Подготовить мастер импорта

Мастер импорта задает дополнительные параметры шаблона: тип инфоблока, действие с отсутствующими товарами, путь к файлу данных и другие настройки. Если шаблону не нужны дополнительные параметры, файл `_setup.php` можно не создавать.

Многошаговый мастер импорта использует те же служебные переменные, что и мастер экспорта.

-  `$STEP` — текущий шаг мастера.

-  `$FINITE` — признак последнего шага. Установите `true`, чтобы система передала управление шаблону импорта или сохранению профиля.

-  `$SETUP_FIELDS_LIST` — список имен переменных, которые установил мастер. Имена разделяют запятыми.

-  `$SETUP_PROFILE_NAME` — название профиля. Переменная нужна, если действие мастера создает профиль импорта и `$ACTION` равен `IMPORT_SETUP`.

Минимальная логика мастера импорта может проверять файл данных и передавать в профиль список переменных:

```php
$errorMessage = '';

if ($STEP > 1)
{
    $IBLOCK_ID = (int)$IBLOCK_ID;

    if ($IBLOCK_ID <= 0)
    {
        $errorMessage .= 'Инфоблок не выбран.<br>';
    }

    if ((string)$URL_DATA_FILE === '')
    {
        $errorMessage .= 'Не указан файл импорта.<br>';
    }

    if ($ACTION === 'IMPORT_SETUP' && (string)$SETUP_PROFILE_NAME === '')
    {
        $errorMessage .= 'Не указано имя профиля.<br>';
    }

    if ($errorMessage !== '')
    {
        $STEP = 1;
    }
}

if ((int)$STEP === 1)
{
    $SETUP_FIELDS_LIST = 'IBLOCK_ID,URL_DATA_FILE';
}
elseif ((int)$STEP === 2)
{
    $FINITE = true;
}
```

### Создать профиль импорта {#create-import-profile}

Профиль импорта можно создать методом `CCatalogImport::Add`. Параметры и логика совпадают [с экспортом](#create-export-profile).

В примере `$productIblockId` — идентификатор инфоблока каталога. В `SETUP_VARS` передайте его через `IBLOCK_ID`, а путь к файлу данных — через `URL_DATA_FILE`.

```php
$importProfileId = \CCatalogImport::Add([
    'FILE_NAME'       => 'furniture_csv',
    'NAME'            => 'Импорт мебели из CSV',
    'IN_MENU'         => 'Y',
    'IN_AGENT'        => 'N',
    'IN_CRON'         => 'N',
    'DEFAULT_PROFILE' => 'N',
    'NEED_EDIT'       => 'N',
    'SETUP_VARS'      => http_build_query([
        'IBLOCK_ID' => $productIblockId,
        'URL_DATA_FILE' => '/upload/import/furniture.csv',
    ]),
]);

if (!$importProfileId)
{
    throw new \RuntimeException('Не удалось создать профиль импорта');
}
```

Метод возвращает идентификатор профиля или `false`. В примере результат сохраняется в `$importProfileId`. Этот идентификатор нужен для запуска, обновления и удаления профиля импорта.

### Запустить импорт по профилю {#run-import-profile}

Запуск выполняет `CCatalogImport::PreGenerateImport()`. В метод передайте `$importProfileId` — идентификатор профиля, который вернул `CCatalogImport::Add()` или `CCatalogImport::GetByID()`.

Метод подключает шаблон и обновляет дату запуска. Для профиля, у которого `DEFAULT_PROFILE` не равен `Y`, метод разбирает параметры из `SETUP_VARS` и передает их в шаблон.

```php
$agentCall = \CCatalogImport::PreGenerateImport($importProfileId);

if ($agentCall === false)
{
    throw new \RuntimeException('Не удалось запустить импорт по профилю');
}
```

Метод возвращает строку агента или `false` при ошибке запуска.

После запуска проверьте измененные элементы инфоблока, цены и остатки, если шаблон их обновляет. Если шаблон установил `$strImportErrorMessage`, импорт завершится с ошибкой.

### Получить, обновить и удалить профили импорта {#manage-import-profiles}

Работа с профилями импорта повторяет логику [экспорта](#get-export-profiles). Используйте методы `GetList()`, `GetByID()`, `Update()` и `Delete()` класса `CCatalogImport`.

```php
$profilesIterator = \CCatalogImport::GetList(
    ['ID' => 'DESC'],
    ['FILE_NAME' => 'furniture_csv']
);

while ($profile = $profilesIterator->Fetch())
{
    echo $profile['ID'] . ': ' . $profile['NAME'] . "\n";
}

$profile = \CCatalogImport::GetByID($importProfileId);

$updatedImportProfileId = \CCatalogImport::Update($importProfileId, [
    'NAME' => 'Импорт мебели из CSV по расписанию',
]);

if (!$updatedImportProfileId)
{
    throw new \RuntimeException('Не удалось обновить профиль импорта');
}

\CCatalogImport::Delete($importProfileId);
```

В примере `GetList()` выбирает профили импорта с именем шаблона `furniture_csv` и сортирует результат по убыванию `ID`.

Методы возвращают:

-  `GetList()` — список профилей,

-  `GetByID()` — один профиль в виде массива,

-  `Update()` — идентификатор профиля или `false`,

-  `Delete()` — результат удаления.

{% note warning "" %}

`PreGenerateExport()` и `PreGenerateImport()` выполняют PHP-файл шаблона через `include`. Не передавайте в `FILE_NAME` данные из запроса пользователя и не создавайте профиль для непроверенного файла.

{% endnote %}

## Проверить результат

После экспорта проверьте:

-  профиль найден через `CCatalogExport::GetByID()`,

-  файл создан в каталоге, который указан в `SETUP_FILE_NAME`,

-  файл содержит ожидаемые строки и кодировку,

-  в результате запуска нет сообщения из `$strExportErrorMessage`.

После импорта проверьте:

-  профиль найден через `CCatalogImport::GetByID()`,

-  элементы инфоблока созданы или обновлены,

-  товарные параметры, цены и остатки изменились, если шаблон их обрабатывает,

-  в результате запуска нет сообщения из `$strImportErrorMessage`.

```php
$profile = \CCatalogExport::GetByID($exportProfileId);

if (!$profile)
{
    throw new \RuntimeException('Профиль экспорта не найден');
}

$exportFile = '/upload/export/furniture.csv';

if (!is_readable($_SERVER['DOCUMENT_ROOT'] . $exportFile))
{
    throw new \RuntimeException('Файл экспорта не найден');
}
```

В примере `$exportProfileId` — идентификатор профиля экспорта, а `$exportFile` — путь к файлу, который должен создать шаблон.

## Учитывать ограничения

Экспорт и импорт подключают рабочий файл шаблона как PHP-код. Из-за этого шаблон должен быть частью проекта, а не файлом, который загрузил пользователь.

Правила работы с путями к файлам данных:

-  хранить файлы импорта и экспорта в заранее выбранных каталогах, например, `/upload/import/` и `/upload/export/`,

-  не передавать в `FILE_NAME`, `SETUP_FILE_NAME` и `URL_DATA_FILE` значения из запроса без проверки,

-  проверять чтение файла импорта и возможность записи файла экспорта до обработки данных,

-  записывать описание ошибки в `$strExportErrorMessage` или `$strImportErrorMessage`, если входные данные некорректны.

Для регулярного обмена учитывайте объем каталога. Большой импорт лучше разбить на шаги в мастере или вынести запуск в cron, чтобы не зависеть от времени выполнения административного запроса.

## Продолжить изучение

-  [Работа с товарами и торговыми предложениями](./products-and-offers.md)

-  [Базовые настройки каталога](./catalog-settings.md)

-  [Доступность, цены и подписка](./availability-prices-subscription.md)

-  [Складской учет](./inventory-management.md)
