---
title: Обновление компонента после фоновой операции
description: "Фоновая обработка отчета, подписка в компоненте с кешем, сохранение результата и обновление интерфейса через Push and Pull. Успех, ошибка и ограниченное ожидание."
---

Фоновая операция может завершиться после ответа на запрос или после закрытия страницы. Ее результат хранится на сервере. Push and Pull сообщает открытому компоненту об изменении, после чего компонент читает сохраненное состояние и обновляет интерфейс без перезагрузки. Так пользователь видит итог операции и после повторного открытия страницы.

## Сценарий и файлы примера

Пример использует отчет `42`. Пользователь ставит отчет в очередь, отдельный PHP-процесс выполняет расчет, а два наблюдателя видят результат. Компонент показывает сохраненные данные, даже если команда не пришла или операция завершилась до открытия страницы.

Нажмите кнопку, чтобы сохранить задание, затем запустите обработчик вручную в отдельном терминале. Так можно управлять моментом завершения и проверить ожидание. Push and Pull доставляет уведомление браузеру. Расчет выполняет код приложения. Ожидающее задание в примере и сервер очередей Push and Pull — разные части системы.

Сначала проверьте транспорт по статье [Обновление страницы по команде сервера](./quick-start.md). Затем сохраните функцию `mountReportView` из раздела [Первоначальная загрузка данных и подписка](./javascript-client.md#initial-load-and-subscribe) в `/local/pull-demo/report-view.js`. Она уже обрабатывает повторные команды, версии ответа и восстановление связи. Здесь к ней добавляется ограниченное ожидание операции.

Пример рассчитан на тестовый Linux-сервер с одним узлом приложения, PHP в браузере и CLI и локальным файловым хранилищем. Запускайте CLI от пользователя, которому доступны те же файлы, что и PHP сайта. Для наблюдения нужны две тестовые учетные записи, для проверки отказа в доступе — третья.

Соберите пример в следующем порядке:

1. Подготовьте общее хранилище и укажите тестовых пользователей.

2. Создайте компонент, HTTP-обработчик, CLI-обработчик и клиентский файл по коду ниже.

3. Откройте страницу компонента, сохраните задание кнопкой и запустите CLI из терминала.

4. Проверьте результат двумя пользователями, затем ошибку и тайм-аут.

Для примера достаточно зависимости из статьи [Обновление страницы по команде сервера](./quick-start.md#declare-public-dependency). Сохраните обработчик `OnGetDependentModule` в `/local/php_interface/init.php`, не добавляя второй. Создание отдельного модуля относится к [переносу в приложение](#move-to-module) после проверки примера.

Пути ниже указаны относительно корня сайта, кроме каталога данных. Создайте файлы:

#|
|| **Путь** | **Назначение** ||
|| `/local/php_interface/pull-report-demo.php` | Проверка доступа, чтение и сохранение общего состояния ||
|| `/local/pull-demo/operation.php` | HTTP API для чтения, подписки и постановки операции в очередь ||
|| `/local/pull-demo/worker.php` | CLI-обработчик одной операции ||
|| `/local/pull-demo/report-view.js` | Готовая функция наблюдения из JS-статьи ||
|| `/local/pull-demo/operation-view.js` | Запуск операции и ограничение времени ожидания ||
|| `/local/components/example/report.wait/component.php` | Проверка прав, персональная подписка и кеширование разметки ||
|| `/local/components/example/report.wait/templates/.default/template.php` | Кнопки и область результата ||
|| `/local/pull-demo/operation-page.php` | Страница с компонентом ||
|#

Рядом с корнем сайта создайте каталог `pull-report-demo`, доступный на чтение и запись PHP сайта и CLI. Например, для корня `/home/bitrix/www` это `/home/bitrix/pull-report-demo`. Каталог должен находиться вне доступных по HTTP каталогов. В нем пример создаст `state.json`, временный файл и файл блокировки.

Исключите `/local/pull-demo/*` из композитного кеша и кеширования HTML на прокси. Порядок подготовки приведен в статье [Обновление страницы по команде сервера](./quick-start.md#prepare-environment). Кеш компонента оставьте включенным — его работу проверим отдельно.

### Состояния операции и контракт команды

HTTP API возвращает состояние отчета с полями `reportId`, `operationId`, `revision`, `status` и `text`. Идентификатор `operationId` отличает повторные расчеты одного отчета. Версия `revision` растет при постановке в очередь и сохранении результата.

#|
|| **Состояние** | **Когда появляется** | **Что показывает компонент** ||
|| `idle` | До первого запуска | Предложение запустить расчет ||
|| `queued` | После сохранения задания | Ожидание фонового обработчика ||
|| `ready` | После успешного расчета и сохранения | Результат расчета ||
|| `failed` | После сохранения ошибки операции | Сообщение об ошибке ||
|#

Поля ответа содержат следующие значения:

-  `reportId` — число `42`.

-  `revision` — неотрицательное целое число.

-  `operationId` — строка из 32 шестнадцатеричных символов или `null` до первого запуска.

-  `status` и `text` — строки.

-  `canStart` — значение типа `boolean`, которое управляет доступностью кнопки запуска. Сервер повторно проверяет это право при каждом запуске.

Имя модуля остается `example.reports`. Успех сопровождает команда `reportReady`, ошибку — `reportFailed`. В `params` передаем только числовой `reportId: 42`. Обработчик читает текущую операцию через HTTP API и не подставляет данные команды в интерфейс. Старое уведомление поэтому не возвращает компонент к результату предыдущего расчета.

Истечение времени ожидания относится только к интерфейсу. Сервер не меняет `queued` на `failed` из-за таймера в браузере.

### Что предоставляет платформа

Компонент связывает PHP-код и шаблон страницы, а его кеш повторно использует подготовленную разметку. Модуль `pull` предоставляет серверные подписки и доставку команд. Расчет, состояния `queued` и `ready`, HTTP API и правила доступа определяет учебное приложение.

Используйте Pull, когда результат должен появиться в другой открытой вкладке или у нескольких наблюдателей. Для результата одного текущего запроса может хватить HTTP-ответа. Для выполнения расчета по расписанию нужен агент или планировщик. Подключение Pull не запускает расчет по расписанию.

## Подготовить общее состояние и проверку доступа

Состояние должно быть общим для браузеров и фонового процесса. Сессия из учебного примера [Обработка команд в JavaScript](./javascript-client.md#saved-state-example) для этого не подходит. Здесь используем один JSON-файл вне корня сайта. В рабочем модуле храните операции в его хранилище данных.

Создайте `/local/php_interface/pull-report-demo.php`. Замените `101` и `102` идентификаторами двух тестовых пользователей. Первый может запускать расчет, оба могут читать результат:

```php
<?php

if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
    die();
}

final class PullReportDemo
{
    public const TAG = 'example.reports.report.42';
    private const READERS = [101, 102];
    private const OPERATOR = 101;

    public static function canRead(int $userId): bool
    {
        return in_array($userId, self::READERS, true);
    }

    public static function canStart(int $userId): bool
    {
        return $userId === self::OPERATOR && self::canRead($userId);
    }

    // Функция изменения получает текущее состояние и возвращает новое
    public static function state(?callable $change = null): array
    {
        $directory = dirname($_SERVER['DOCUMENT_ROOT']) . '/pull-report-demo';
        $path = $directory . '/state.json';
        $temporary = $directory . '/state.tmp';
        $lock = fopen($directory . '/state.lock', 'c');
        if ($lock === false)
        {
            throw new RuntimeException('Не удалось открыть файл блокировки.');
        }

        try
        {
            if (!flock($lock, LOCK_EX))
            {
                throw new RuntimeException('Не удалось заблокировать состояние.');
            }

            $state = is_file($path)
                ? json_decode(file_get_contents($path), true, 512, JSON_THROW_ON_ERROR)
                : [
                    'reportId' => 42,
                    'operationId' => null,
                    'revision' => 0,
                    'status' => 'idle',
                    'text' => 'Отчет 42 еще не запускали.',
                    'initiatorId' => null,
                ];

            if ($change !== null)
            {
                $next = $change($state);
                if ($next !== $state)
                {
                    $json = json_encode($next, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
                    if (file_put_contents($temporary, $json) !== strlen($json)
                        || !rename($temporary, $path))
                    {
                        throw new RuntimeException('Не удалось сохранить состояние.');
                    }
                    $state = $next;
                }
            }

            return $state;
        }
        finally
        {
            flock($lock, LOCK_UN);
            fclose($lock);
        }
    }

    public static function publicState(array $state): array
    {
        unset($state['initiatorId']);
        return $state;
    }
}
```

Блокировка охватывает чтение и изменение. Сначала код записывает новое состояние во временный файл, затем заменяет основной файл в том же каталоге. Если функция изменения выбросит исключение, сохранение не начнется. Ошибка записи не должна сопровождаться командой об успехе.

Файловое хранилище здесь нужно только для воспроизводимого примера на одном сервере. Оно не заменяет очередь заданий, транзакционное хранилище или восстановление после аварии. Не удаляйте файл состояния во время проверки — иначе версии начнутся заново.

## Разместить подписку в компоненте с кешем {#component-cache-subscription}

Компонент проверяет права и подписывает текущего пользователя до обращения к кешу. В кеш попадает только общая разметка. Состояние операции, идентификатор пользователя и CSRF-токен в кеш компонента не записываются.

### Создать компонент и шаблон

Файл `component.php` выполняет серверную часть компонента, а `template.php` выводит его HTML. Их размещение описано в статье [Компоненты](./../../framework/components.md#component-structure).

Создайте `/local/components/example/report.wait/component.php`:

```php
<?php

use Bitrix\Main\Loader;
use Bitrix\Main\UI\Extension;

if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
    die();
}

require_once $_SERVER['DOCUMENT_ROOT'] . '/local/php_interface/pull-report-demo.php';

if (!$USER->IsAuthorized() || !PullReportDemo::canRead((int)$USER->GetID()))
{
    ShowError('Нет доступа к отчету.');
    return;
}

if (!Loader::includeModule('pull'))
{
    ShowError('Модуль pull недоступен.');
    return;
}

// Эти действия нужны и при попадании в кеш компонента
CPullWatch::Add((int)$USER->GetID(), PullReportDemo::TAG);
Extension::load('pull.client');
$APPLICATION->AddHeadScript('/local/pull-demo/report-view.js');
$APPLICATION->AddHeadScript('/local/pull-demo/operation-view.js');

if ($this->StartResultCache())
{
    $this->IncludeComponentTemplate();
}
```

Метод `CPullWatch::Add` создает серверное наблюдение пользователя по тегу: первый аргумент задает идентификатор пользователя, второй — тег. Тег задан в PHP и не поступает из запроса. До вызова компонент проверяет доступ именно к учебному отчету.

При попадании в кеш метод `StartResultCache` выводит сохраненную разметку и возвращает `false`. Если перенести подписку внутрь `if`, новый пользователь при попадании в кеш не пройдет этот участок кода.

Создайте `/local/components/example/report.wait/templates/.default/template.php`:

```php
<?php
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
    die();
}
?>
<section id="report-operation">
    <h2>Отчет 42</h2>
    <p data-role="output" aria-live="polite"></p>
    <p data-role="status" aria-live="polite">Подготовка компонента...</p>
    <p data-role="launch" aria-live="polite"></p>
    <button type="button" data-role="start" disabled>Запустить новый расчет</button>
    <button type="button" data-role="open">Проверить состояние</button>
    <button type="button" data-role="close">Закрыть наблюдение</button>
</section>
<script>
BX.ready(function () {
    if (window.reportOperation)
    {
        window.reportOperation.destroy();
    }
    window.reportOperation = mountReportOperation(
        document.getElementById('report-operation')
    );
});
</script>
```

В примере на странице находится один экземпляр компонента. Повторная инициализация сначала освобождает предыдущий. Если компонент вставляет ваш AJAX-код, после создания DOM явно вызовите ту же функцию инициализации. Вставка HTML-фрагмента с тегом `script` не гарантирует выполнения этого скрипта браузером.

При нескольких экземплярах задайте каждому отдельный контейнер и храните функцию завершения рядом с ним. Не используйте один глобальный `window.reportOperation` для нескольких отчетов.

### Создать страницу компонента

Пролог подготавливает окружение страницы и подключает ядро. Эпилог завершает ее обработку. На публичной странице их подключают через `/bitrix/header.php` и `/bitrix/footer.php`. HTTP API ниже использует пролог без разметки и завершает запрос через `CMain::FinalActions`.

Создайте `/local/pull-demo/operation-page.php`:

```php
<?php

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/header.php';

$APPLICATION->SetTitle('Ожидание фонового отчета');
$APPLICATION->IncludeComponent('example:report.wait', '', [
    'CACHE_TYPE' => 'A',
    'CACHE_TIME' => 3600,
]);

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/footer.php';
```

Шаблон содержит одинаковые кнопки для обоих читателей. Разрешение на запуск браузер получит из API, а сервер повторно проверит его при POST-запросе. Блокировка кнопки не заменяет эту проверку.

Другие способы разделить кешируемые и персональные данные разобраны в статье [Компоненты](./../../framework/components.md#component-epilog-file). Не размещайте персональную подписку только в `template.php` или `result_modifier.php` — при попадании в кеш они не выполнят ее заново.

## Подписаться и поставить операцию в очередь

При открытии интерфейса сначала зарегистрируйте JS-обработчик, затем подтвердите серверное наблюдение и прочитайте состояние. Кнопка запуска станет доступна только после этого чтения. При запуске снова подготовьте наблюдение, выполните POST и прочитайте отчет — операция может завершиться до получения HTTP-ответа.

Обработчик `/local/pull-demo/operation.php` поддерживает три операции. Во всех запросах передавайте `reportId=42` в URL, включая POST-запросы. Для доступа нужна авторизованная сессия пользователя из `READERS`.

Разрешите тестовым пользователям доступ к файлам `operation-page.php` и `operation.php` средствами сайта. Пролог проверяет эти права до выполнения кода примера. Список `READERS` задает дополнительное право на отчет и не заменяет доступ к файлам.

#|
|| **Операция** | **HTTP-метод и URL** | **Обязательные поля формы** | **Результат** ||
|| Прочитать состояние | `GET /local/pull-demo/operation.php?reportId=42` | Нет | Текущее состояние, `canStart` и `started: null` ||
|| Подтвердить наблюдение | `POST /local/pull-demo/operation.php?reportId=42` | `action=observe`, `sessid` | Добавление серверной подписки и текущее состояние с `started: null` ||
|| Запустить расчет | `POST /local/pull-demo/operation.php?reportId=42` | `action=start`, `sessid`, `revision` | Состояние и `started: true` при создании задания либо `started: false`, если новое задание не создано ||
|#

Поля POST передавайте как форму `application/x-www-form-urlencoded`, как делает `URLSearchParams` в клиентском примере. Обработчик читает их из `$_POST`, а не из JSON-тела. Поле `sessid` содержит строку с текущим CSRF-токеном, который клиент получает через `BX.bitrix_sessid()`. Поле `revision` — строковое представление неотрицательного целого числа из последнего прочитанного состояния. Оно обязательно только для `start`. Запуск дополнительно требует права `canStart`.

После прохождения пролога обработчик при успехе возвращает HTTP `200` и JSON с состоянием отчета. Конфликт версии тоже возвращает `200`, но с `started: false`. При ошибке обработчик возвращает JSON `{ "error": "Сообщение" }` и один из HTTP-статусов:

-  `400` — неверное действие или версия.

-  `403` — отказ в доступе к отчету или неверный токен.

-  `404` — другой `reportId`.

-  `405` — неподдерживаемый метод.

-  `503` — модуль `pull` недоступен при действии `observe`.

-  `500` — внутренняя ошибка.

Авторизация и доступ проверяются до параметров отчета.

Если пролог запрещает доступ к файлу или требует авторизацию, он может вывести HTML-форму входа и завершить запрос до JSON-обработчика. Например, это возможно после истечения авторизации на закрытом сайте. Клиентский вызов `response.json()` тогда завершится ошибкой, а интерфейс покажет общее сообщение о невозможности прочитать состояние. Проверьте тело ответа во вкладке *Network*, восстановите авторизацию и доступ к файлу, затем повторите чтение.

Ответ `405` с JSON также возможен только тогда, когда запрос дошел до проверки метода в обработчике. На установке с WebDAV запрос `PUT` может быть перехвачен во время выполнения пролога. Например, WebDAV может вернуть `401` с пустым телом и заголовком `X-WebDAV-Status`. В этом случае `response.json()` завершится ошибкой разбора JSON. При проверке неподдерживаемых методов сначала посмотрите HTTP-статус, заголовки и тело ответа во вкладке *Network*: ответ может сформировать другой обработчик до выполнения кода примера.

Создайте `/local/pull-demo/operation.php`:

```php
<?php

use Bitrix\Main\Loader;
use Bitrix\Main\Web\Json;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/local/php_interface/pull-report-demo.php';

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');
$httpStatus = 200;
$started = null;

try
{
    $userId = (int)$USER->GetID();
    if (!$USER->IsAuthorized() || !PullReportDemo::canRead($userId))
    {
        throw new RuntimeException('Нет доступа к отчету.', 403);
    }
    if (($_GET['reportId'] ?? '') !== '42')
    {
        throw new RuntimeException('Отчет не найден.', 404);
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST')
    {
        // Все изменяющие действия требуют токен текущей сессии
        if (!check_bitrix_sessid())
        {
            throw new RuntimeException('Обновите страницу.', 403);
        }
        $action = $_POST['action'] ?? '';
        if ($action === 'observe')
        {
            // Подтверждаем наблюдение до чтения состояния
            if (!Loader::includeModule('pull'))
            {
                throw new RuntimeException('Модуль pull недоступен.', 503);
            }
            CPullWatch::Add($userId, PullReportDemo::TAG);
            $state = PullReportDemo::state();
        }
        elseif ($action === 'start')
        {
            // Право на запуск проверяется заново при каждом POST-запросе
            if (!PullReportDemo::canStart($userId))
            {
                throw new RuntimeException('Нет права запускать отчет.', 403);
            }
            $expectedRevision = filter_var($_POST['revision'] ?? null, FILTER_VALIDATE_INT);
            if ($expectedRevision === false || $expectedRevision === null || $expectedRevision < 0)
            {
                throw new RuntimeException('Некорректная версия отчета.', 400);
            }

            $started = false;
            // Блокировка в state() делает проверку версии и запись одной операцией
            $state = PullReportDemo::state(static function (array $state) use ($expectedRevision, $userId, &$started) {
                // Повтор старого запроса не создает еще одну операцию
                if ($state['revision'] !== $expectedRevision || $state['status'] === 'queued')
                {
                    return $state;
                }
                $started = true;
                $state['operationId'] = bin2hex(random_bytes(16));
                $state['revision']++;
                $state['status'] = 'queued';
                $state['text'] = 'Отчет 42 ожидает фонового обработчика.';
                $state['initiatorId'] = $userId;
                return $state;
            });
        }
        else
        {
            throw new RuntimeException('Неизвестное действие.', 400);
        }
    }
    elseif ($_SERVER['REQUEST_METHOD'] === 'GET')
    {
        $state = PullReportDemo::state();
    }
    else
    {
        throw new RuntimeException('Метод не поддерживается.', 405);
    }

    $result = PullReportDemo::publicState($state);
    // Клиент получает право на запуск, но не внутренний initiatorId
    $result['canStart'] = PullReportDemo::canStart($userId);
    $result['started'] = $started;
}
catch (Throwable $exception)
{
    // Неизвестные ошибки не раскрывают внутренние детали хранилища
    $httpStatus = in_array($exception->getCode(), [400, 403, 404, 405, 503], true)
        ? $exception->getCode() : 500;
    $result = ['error' => $httpStatus === 500 ? 'Ошибка хранилища.' : $exception->getMessage()];
}

http_response_code($httpStatus);
CMain::FinalActions(Json::encode($result));
```

Ответ `start` содержит результат запроса в поле `started`:

-  `true` — сервер сохранил новую операцию, ее идентификатор находится в `operationId`,

-  `false` — версия уже изменилась или задание ожидает обработки, новая операция не создана.

Для чтения и `observe` значение `started` равно `null`. Клиент выводит результат запуска отдельно от состояния отчета. Поэтому готовность предыдущего отчета не выглядит подтверждением нового запуска. При `started: false` сначала проверьте актуальные данные и только затем решайте, нужен ли новый расчет.

Даже `started: true` подтверждает только сохранение задания. Выполнение подтвердят состояние `ready` или `failed` и соответствующий текст.

В учебном примере запись `queued` — одно ожидающее задание. Обработчик запускается отдельной CLI-командой. Так можно проверить компонент до, во время и после выполнения. Автоматический запуск через агента или планировщик подключайте по статье [Агенты и фоновые задачи](./../../framework/background-jobs.md).

## Сохранить результат и отправить команду

Фоновый обработчик сначала сохраняет `ready` или `failed`, затем выбирает наблюдателей с действующим доступом и отправляет команду. Он не использует текущего браузерного пользователя.

Создайте `/local/pull-demo/worker.php`:

```php
<?php

use Bitrix\Main\Application;
use Bitrix\Main\Loader;

if (PHP_SAPI !== 'cli')
{
    http_response_code(404);
    exit;
}

// CLI запускается из корня сайта и загружает тот же пролог, что и HTTP-обработчик
$_SERVER['DOCUMENT_ROOT'] = dirname(__DIR__, 2);
$_SERVER['SERVER_NAME'] = 'example.test';
define('NOT_CHECK_PERMISSIONS', true);

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/local/php_interface/pull-report-demo.php';

$exitCode = 0;
$changed = false;
// Флаги нужны для проверки ошибки расчета и пропущенного уведомления
$fail = in_array('--fail', $argv, true);
$silent = in_array('--silent', $argv, true);

try
{
    // Меняем только ожидающее задание и фиксируем результат под одной блокировкой
    $state = PullReportDemo::state(static function (array $state) use ($fail, &$changed) {
        if ($state['status'] !== 'queued')
        {
            return $state;
        }

        try
        {
            if (!PullReportDemo::canStart((int)$state['initiatorId']) || $fail)
            {
                throw new RuntimeException('Расчет остановлен.');
            }
            // Учебный расчет не изменяет другие объекты
            $total = array_sum(range(1, 100));
            $state['status'] = 'ready';
            $state['text'] = 'Отчет 42 готов. Сумма: ' . $total . '.';
        }
        catch (Throwable $exception)
        {
            $state['status'] = 'failed';
            $state['text'] = 'Не удалось сформировать отчет 42.';
        }

        // Новая версия позволяет отличить завершенный расчет от queued
        $state['revision']++;
        $changed = true;
        return $state;
    });

    if ($changed && !$silent)
    {
        // Публикуем команду только после сохранения ready или failed
        if (!Loader::includeModule('pull'))
        {
            throw new RuntimeException('Результат сохранен, но модуль pull недоступен.');
        }

        // Серверная подписка не заменяет актуальную проверку прав
        $recipients = [];
        foreach (CPullWatch::GetUserList(PullReportDemo::TAG) as $userId)
        {
            if (PullReportDemo::canRead((int)$userId))
            {
                $recipients[] = (int)$userId;
            }
        }

        if ($recipients !== [])
        {
            // В команде нет результата: браузер прочитает его через HTTP API
            $accepted = CPullStack::AddByUsers($recipients, [
                'module_id' => 'example.reports',
                'command' => $state['status'] === 'ready' ? 'reportReady' : 'reportFailed',
                'params' => ['reportId' => 42],
            ]);
            if ($accepted === false)
            {
                fwrite(STDERR, "Результат сохранен, но команда не подготовлена к отправке.\n");
                $exitCode = 1;
            }
        }
    }

    fwrite(STDOUT, $changed ? "Результат сохранен.\n" : "Нет ожидающего задания.\n");
}
catch (Throwable $exception)
{
    fwrite(STDERR, $exception->getMessage() . "\n");
    $exitCode = 1;
}

Application::getInstance()->terminate($exitCode);
```

Замените `example.test` доменом тестовой установки. После нажатия кнопки запуска выполните из корня сайта:

```sh
php local/pull-demo/worker.php
```

Для проверки ошибки поставьте новое задание и запустите обработчик с `--fail`. Для проверки пропущенной команды используйте `--silent`:

```sh
php local/pull-demo/worker.php --fail
php local/pull-demo/worker.php --silent
```

Каждую команду выполняйте для отдельного нового задания. Повторный запуск обработчика после `ready` или `failed` не выполняет расчет и не увеличивает версию.

Константа `NOT_CHECK_PERMISSIONS` позволяет CLI-скрипту пройти пролог закрытого сайта без браузерной авторизации. Ограничьте доступ к запуску средствами сервера. Прикладную проверку прав инициатора выполняет `canStart`, проверку адресатов — `canRead`. Подробнее о CLI-контексте читайте в статье [Отправка команд из PHP](./sending-events.md#php-send-lifecycle).

Метод `CPullWatch::GetUserList` возвращает идентификаторы пользователей, у которых есть серверное наблюдение по указанному тегу. Пример дополнительно фильтрует их через `canRead`, затем использует адресную отправку. В команде нет текста результата. HTTP API повторно проверяет доступ перед его выдачей.

Если `AddByUsers` возвращает `false`, обработчик сообщает об отказе подготовки команды в STDERR и завершается с кодом `1`. Сохраненное состояние `ready` или `failed` остается доступным через HTTP. Значение `true` подтверждает подготовку команды, но не доставку. Результаты API и проверка публикации разобраны в разделе [Ошибки и проверка результата](./sending-events.md#errors-and-result).

Учебный расчет короткий и выполняется под файловой блокировкой. Второй процесс дождется освобождения блокировки и увидит уже завершенное задание. Длительную операцию не выполняйте под такой блокировкой. В рабочей очереди отдельно предусмотрите захват задания, состояние выполнения и восстановление после остановки обработчика.

### Учесть ошибки сохранения и повторные события

Исключение расчета переводит операцию в `failed`. Ошибка записи выходит во внешний `catch`, а отправка команды не выполняется. Если публикация не удалась после сохранения, результат остается доступен через HTTP. Не заменяйте готовый отчет ошибкой только из-за сбоя уведомления.

При хранении результата в базе данных отправляйте команду после успешной фиксации транзакции. Событие «после изменения» может сработать до завершения внешней транзакции. Момент отправки и завершение PHP-процесса разобраны в статье [Отправка команд из PHP](./sending-events.md#php-send-lifecycle).

Если уведомление отправляет обработчик события модуля, не сохраняйте из него тот же объект повторно ради отправки. Иначе обработчик может вызвать себя. Проверяйте переход состояния и идентификатор операции. Повтор события должен приводить максимум к повторному уведомлению, а не к повторному расчету.

Между сохранением результата и публикацией процесс может остановиться. В этом примере пропуск компенсирует чтение состояния. Если приложение требует повторной публикации, сохраняйте отдельное задание на уведомление вместе с результатом и обрабатывайте его с повторами.

## Ограничить ожидание и завершить наблюдение

Создайте `/local/pull-demo/operation-view.js`. Он использует ранее сохраненную функцию `mountReportView`. Последняя отвечает за обработчики Pull, повторное чтение и восстановление связи. Новый файл управляет кнопками и временем ожидания.

#|
|| **Функция** | **Назначение** | **Когда вызывается** ||
|| `api` | Отправляет HTTP-запрос и проверяет ответ | При чтении, подписке и запуске ||
|| `open` | Создает наблюдение с новым сроком ожидания | При открытии и нажатии кнопок ||
|| `readReport` | Подготавливает наблюдение, при необходимости однократно запускает операцию, затем читает состояние | Из `mountReportView` ||
|| `stop` | Снимает обработчики, отменяет запрос и останавливает таймер | При закрытии или завершении ||
|| `finalRead` | Один раз проверяет результат после окончания ожидания | Через 60 секунд ||
|| `apply` | Показывает сохраненное состояние и обновляет доступность запуска | После завершающего чтения ||
|#

В этой интеграции первый вызов `readReport` включает подготовку. Он выполняет `observe`, а после нажатия кнопки запуска — еще и `start`. К этому моменту `mountReportView` уже зарегистрировала JS-обработчики. Обычные повторные вызовы только читают состояние.

Переменная `launch` хранит версию, с которой пользователь нажал кнопку. Код сбрасывает ее до ожидания ответа `start`: при сетевой ошибке нельзя знать, сохранил ли сервер задание. Следующий вызов поэтому проверяет результат, не повторяя запуск. Серверная проверка версии дополнительно защищает от повторной отправки того же POST-запроса.

Счетчик `generation` обозначает очередное открытие интерфейса. Ответ предыдущего открытия игнорируется. Отложенный вызов с нулевой задержкой дает `mountReportView` завершить обработку данных перед снятием JS-подписки.

```js
function mountReportOperation(root)
{
    const output = root.querySelector('[data-role="output"]');
    const status = root.querySelector('[data-role="status"]');
    const launchResult = root.querySelector('[data-role="launch"]');
    const startButton = root.querySelector('[data-role="start"]');
    const openButton = root.querySelector('[data-role="open"]');
    const closeButton = root.querySelector('[data-role="close"]');
    const url = '/local/pull-demo/operation.php?reportId=42';
    let destroyView = null;
    let deadline = null;
    let request = null;
    let generation = 0;
    let revision = null;
    let disposed = false;

    async function api(action, signal, extra = {})
    {
        const options = { credentials: 'same-origin', cache: 'no-store', signal };
        if (action)
        {
            options.method = 'POST';
            options.body = new URLSearchParams({
                action, sessid: BX.bitrix_sessid(), ...extra
            });
        }
        const response = await fetch(url, options);
        const data = await response.json();
        if (!response.ok)
        {
            const error = new Error(data.error || 'Не удалось прочитать состояние.');
            error.status = response.status;
            throw error;
        }
        // Отсекаем неожиданный ответ до передачи данных в интерфейс
        if (data.reportId !== 42 || !Number.isSafeInteger(data.revision)
            || data.revision < 0 || typeof data.text !== 'string'
            || typeof data.canStart !== 'boolean'
            || !['idle', 'queued', 'ready', 'failed'].includes(data.status)
            || (action === 'start' && typeof data.started !== 'boolean'))
        {
            throw new Error('Некорректное состояние отчета.');
        }
        return data;
    }

    function stop()
    {
        // Увеличиваем поколение, чтобы поздние ответы не изменили закрытый интерфейс
        generation += 1;
        clearTimeout(deadline);
        if (destroyView)
        {
            // mountReportView освобождает обработчик команд Pull
            destroyView();
            destroyView = null;
        }
        if (request)
        {
            request.abort();
            request = null;
        }
        startButton.disabled = true;
    }

    function apply(data)
    {
        revision = data.revision;
        output.textContent = data.text;
        startButton.disabled = !data.canStart || data.status === 'queued';
    }

    // Одно чтение после окончания ожидания, без повторного запуска операции
    async function finalRead()
    {
        // Останавливаем наблюдение, затем однократно читаем сохраненный итог
        stop();
        const current = generation;
        const controller = new AbortController();
        request = controller;
        const timeout = setTimeout(() => controller.abort(), 10000);
        try
        {
            const data = await api(null, controller.signal);
            if (disposed || current !== generation) { return; }
            apply(data);
            status.textContent = data.status === 'queued'
                ? 'Ожидание завершено. Расчет еще не подтвержден. Нажмите «Проверить состояние».'
                : 'Состояние проверено. Наблюдение завершено.';
        }
        catch (error)
        {
            if (disposed || current !== generation) { return; }
            output.textContent = '';
            status.textContent = 'Не удалось проверить результат. Нажмите «Проверить состояние».';
        }
        finally
        {
            clearTimeout(timeout);
            if (request === controller) { request = null; }
        }
    }

    function open(launchRevision = null)
    {
        if (disposed) { return; }
        stop();
        output.textContent = '';
        status.textContent = 'Проверка состояния...';
        const current = generation;
        let firstRead = true;
        let launch = launchRevision;
        if (launch !== null)
        {
            launchResult.textContent = 'Подготовка запуска...';
        }
        deadline = setTimeout(finalRead, 60000);

        // mountReportView сначала регистрирует обработчики, затем вызывает readReport
        destroyView = mountReportView({
            reportId: 42,
            output,
            status,
            readReport: async function (reportId, signal) {
                try
                {
                    if (firstRead)
                    {
                        // На первом чтении подтверждаем серверное наблюдение
                        await api('observe', signal);
                        firstRead = false;
                    }
                    if (disposed || current !== generation || signal.aborted)
                    {
                        throw new Error('Наблюдение закрыто.');
                    }
                    if (launch !== null)
                    {
                        const expectedRevision = launch;
                        // При потере ответа следующие запросы только читают состояние
                        launch = null;
                        try
                        {
                            const result = await api('start', signal, { revision: String(expectedRevision) });
                            if (disposed || current !== generation) { return result; }
                            launchResult.textContent = result.started
                                ? 'Создана операция ' + result.operationId + '.'
                                : 'Новая операция не создана. Состояние изменилось или расчет уже ожидает обработки.';
                        }
                        catch (error)
                        {
                            if (!disposed && current === generation)
                            {
                                launchResult.textContent = 'Запуск не подтвержден. Проверьте состояние перед новым запуском.';
                            }
                            throw error;
                        }
                    }
                    const data = await api(null, signal);
                    if (disposed || current !== generation) { return data; }
                    revision = data.revision;

                    // Дайте mountReportView обработать ответ перед завершением
                    setTimeout(() => {
                        if (disposed || current !== generation) { return; }
                        if (data.status !== 'queued')
                        {
                            stop();
                            apply(data);
                            status.textContent = 'Состояние проверено. Наблюдение завершено.';
                        }
                    }, 0);
                    return data;
                }
                catch (error)
                {
                    if (error.status === 403 || error.status === 404)
                    {
                        // При потере доступа закрываем наблюдение и скрываем результат
                        setTimeout(() => {
                            if (disposed || current !== generation) { return; }
                            stop();
                            output.textContent = '';
                            status.textContent = 'Действие или отчет недоступны. Наблюдение завершено.';
                        }, 0);
                    }
                    throw error;
                }
            }
        });
    }

    function start()
    {
        if (!disposed && !startButton.disabled && revision !== null)
        {
            open(revision);
        }
    }

    function check()
    {
        open();
    }

    function close()
    {
        stop();
        output.textContent = '';
        status.textContent = 'Наблюдение закрыто. Операция на сервере не отменена.';
    }

    startButton.addEventListener('click', start);
    openButton.addEventListener('click', check);
    closeButton.addEventListener('click', close);
    if (BX.PULL && typeof BX.PULL.subscribe === 'function')
    {
        open();
    }
    else
    {
        status.textContent = 'Клиент Push and Pull недоступен.';
        openButton.disabled = true;
    }

    return {
        destroy() {
            disposed = true;
            stop();
            startButton.removeEventListener('click', start);
            openButton.removeEventListener('click', check);
            closeButton.removeEventListener('click', close);
        }
    };
}
```

Пока наблюдение открыто, функция `mountReportView` выполняет контрольное чтение каждые 30 секунд и ограничивает каждый вызов `readReport` десятью секундами. При первом вызове этот лимит общий для последовательности `observe → start → GET`, если запрошен запуск, или `observe → GET` при обычном открытии. Это не отдельные десять секунд для каждого HTTP-запроса.

Через 60 секунд после открытия функция `finalRead` завершает наблюдение и делает одно контрольное чтение с отдельным ограничением в десять секунд. Интервалы задают поведение учебного интерфейса, а не гарантии доставки или длительности расчета. В фоновой вкладке браузер может задерживать таймеры.

При `ready`, `failed` или `idle` наблюдение завершается раньше. Кнопка *Проверить состояние* открывает новое наблюдение и читает отчет без повторного запуска. Чтобы увидеть новый расчет во второй вкладке после завершенного наблюдения, нажмите эту кнопку.

Функция `stop` снимает JS-обработчики через `destroyView`, останавливает таймер ожидания и отменяет текущий запрос. Счетчик `generation` не позволяет ответам закрытого экземпляра менять интерфейс. Обработку команд, переподключения и конкурирующих чтений выполняет `mountReportView` из статьи [Обработка команд в JavaScript](./javascript-client.md#initial-load-and-subscribe).

Если ответ запуска потерян, код не отправляет `start` повторно. Следующее чтение проверит сохраненное состояние. Отмена HTTP-запроса в браузере не откатывает уже выполненное серверное действие.

### Завершить серверное наблюдение

Снятие JS-обработчика не удаляет серверную подписку пользователя по тегу. В примере просроченное наблюдение удаляет агент модуля. Его запуск и ограничения срока описаны в статье [Подписки по тегам](./watch-subscriptions.md). Одно открытие ждет не более минуты, а каждый новый вызов `observe` повторно проверяет доступ и добавляет подписку. Отдельное автопродление здесь не требуется.

Не удаляйте общую подписку пользователя при закрытии одной вкладки — отчет может оставаться открытым в другой. Если приложению нужно немедленно прекращать серверное наблюдение, учитывайте все активные представления пользователя. Порядок удаления описан в статье [Подписки по тегам](./watch-subscriptions.md#renew-and-stop).

При отзыве доступа запретите новые подписки, запуск и чтение, исключите пользователя из отправки и удалите его серверное наблюдение по правилам приложения. Проверка прав в HTTP API остается обязательной, даже если подписка уже удалена. Уже загруженные в браузер данные останутся видимыми до следующего чтения. Открытый наблюдатель очистит результат после отказа в очередном чтении, завершенный — при следующем открытии.

## Проверить сквозной пример

Сначала проверьте основной путь под двумя учетными записями. Затем воспроизведите пропуск команды и завершение ожидания.

### Получить результат двумя наблюдателями

1. Откройте `/local/pull-demo/operation-page.php` под пользователем, указанным в `OPERATOR`. Дождитесь первоначального чтения и доступной кнопки запуска.

2. Нажмите *Запустить новый расчет*. Компонент должен показать ожидание фонового обработчика.

3. В другом профиле браузера войдите под вторым пользователем из `READERS` и откройте ту же страницу. Он должен увидеть `queued`, а кнопка запуска должна остаться недоступной.

4. Пока оба наблюдателя открыты, выполните `php local/pull-demo/worker.php` из корня сайта.

5. Убедитесь, что оба компонента показали «Отчет 42 готов. Сумма: 5050.» и завершили наблюдение.

Чтобы подтвердить именно доставку команды, поставьте точку останова в `callback` функции `mountReportView`. Обновление текста само по себе не доказывает доставку — состояние также читает контрольный таймер.

### Проверить кеш отдельно от HTTP-подписки {#verify-component-cache}

Доставка команды не доказывает правильное размещение подписки в компоненте. Действие `observe` тоже вызывает `CPullWatch::Add` и может скрыть ошибку серверного кода. Проверяйте эти пути отдельно.

Установите одинаковый часовой пояс для обоих тестовых пользователей. Ключ кеша компонента учитывает смещение `CTimeZone::getOffset()`. При разных смещениях пользователи могут получить разные записи кеша даже с одинаковыми параметрами компонента. Повторное построение шаблона в таком случае не означает ошибку подписки.

1. Закройте остальные страницы учебного примера. Отключите JavaScript для страницы компонента в обоих тестовых профилях. Запросов к `operation.php` быть не должно.

2. Временно добавьте перед `CPullWatch::Add` в `component.php` строку `error_log('report.wait: subscribe user=' . (int)$USER->GetID());`. Внутри блока `if ($this->StartResultCache())` перед подключением шаблона добавьте `error_log('report.wait: build template');`. Журнал PHP покажет, какие участки выполняются.

3. Очистите кеш компонента штатными средствами сайта. Откройте страницу первым пользователем и дождитесь завершения запроса. В журнале должны появиться обе записи.

4. У второго пользователя удалите прежнее наблюдение через *Прекратить наблюдение* на странице `watch.php` из статьи [Подписки по тегам](./watch-subscriptions.md). Дождитесь завершения запроса и подтвердите отсутствие пользователя через *Проверить подписку*. Эта проверка сама не создает наблюдение.

5. Откройте страницу компонента вторым пользователем с отключенным JavaScript. Дождитесь завершения запроса. Ожидается запись `subscribe user=...` для второго пользователя без новой записи `build template`. Затем на странице `watch.php` проверьте появление серверной подписки.

6. Если появилась запись `build template`, попадание в кеш не подтверждено. Проверьте включение автокеширования, одинаковые параметры компонента, совпадение смещения `CTimeZone::getOffset()` у пользователей и отсутствие принудительного сброса кеша, затем повторите проверку.

7. Уберите временные вызовы `error_log`, включите JavaScript и отдельно повторите проверку доставки двум наблюдателям.

Страницу `watch.php` подготовьте по связанной статье с теми же идентификаторами пользователей. До конца проверки не нажимайте на ней *Начать наблюдение*.

### Проверить конфликт версий при запуске

1. Под пользователем `OPERATOR` откройте две вкладки компонента и дождитесь первого чтения. В состоянии `idle`, `ready` или `failed` наблюдение завершится, а кнопка запуска станет доступной.

2. В первой вкладке запустите расчет и выполните CLI-обработчик. Дождитесь нового результата.

3. Во второй вкладке нажмите *Запустить новый расчет*, не обновляя состояние. Она отправит прежнюю версию.

4. Убедитесь, что появилась надпись «Новая операция не создана». Компонент должен показать текущий результат, а `operationId` и `revision` в ответе `start` — остаться такими же, как после первого расчета.

5. Если нужен еще один расчет, повторно нажмите кнопку уже после чтения актуального состояния. Теперь ответ должен содержать `started: true` и новый `operationId`.

### Проверить ошибки и жизненный цикл

#|
|| **Проверка** | **Действие** | **Ожидаемый результат** ||
|| Ошибка операции | Поставьте новое задание и запустите `worker.php --fail` | Состояние `failed`, сообщение об ошибке, ожидание завершено ||
|| Пропущенная команда | Поставьте новое задание и запустите `worker.php --silent` | Контрольное чтение покажет `ready` без уведомления ||
|| Завершение до открытия | Закройте наблюдение, выполните задание, нажмите *Проверить состояние* | Первое чтение сразу покажет результат ||
|| Истечение ожидания | Поставьте задание, но не запускайте CLI-обработчик | После контрольного чтения компонент сообщит, что расчет не подтвержден. Сервер сохранит `queued` ||
|| Завершение после тайм-аута | Выполните оставшееся задание и нажмите *Проверить состояние* | Компонент покажет результат без нового запуска ||
|| Повтор CLI | Запустите обработчик дважды для одного задания | Второй запуск сообщит об отсутствии задания, версия не изменится ||
|| Повтор запроса запуска | Повторите POST с прежней `revision` | Новая операция не появится ||
|| Разрыв соединения | Разорвите pull-соединение, выполните задание и восстановите связь | Чтение при переподключении или контрольный запрос покажет состояние ||
|| Попадание в кеш | Выполните [отдельную проверку без JavaScript](#verify-component-cache) | Подписка появилась при подтвержденном попадании в кеш, без запроса `observe` ||
|| Нет доступа | Откройте страницу и API под третьим пользователем | Компонент откажет в доступе, API вернет `403` ||
|| Нет права запуска | Отправьте `start` под вторым читателем | API вернет `403`, состояние не изменится ||
|| Отзыв доступа | Во время `queued` удалите второго пользователя из `READERS` и выполните задание | Отправитель исключит его из адресатов. Следующее чтение вернет `403` и завершит наблюдение ||
|| Повторное открытие | Несколько раз закройте и откройте наблюдение | Работает один экземпляр обработчиков, закрытые экземпляры не отправляют запросы ||
|| Поздний ответ | Замедлите сеть, начните чтение и закройте наблюдение | Ответ не изменит закрытый интерфейс ||
|| Ошибка сохранения | На отдельной тестовой копии временно запретите запись в каталог данных | API или CLI сообщит об ошибке, команда об успехе не появится ||
|#

Для проверки отсутствия CSRF-токена отправьте POST без `sessid`. Ожидается `403` без изменения состояния. GET с `reportId=43` должен вернуть `404` авторизованному читателю.

## Перенести интеграцию в собственный модуль {#move-to-module}

Этот шаг нужен при переносе проверенного примера в приложение. Для учебного запуска отдельный модуль устанавливать не нужно.

При переносе в собственный модуль зарегистрируйте постоянную зависимость в его установщике. Класс обработчика должен быть доступен после подключения `include.php` модуля. Общая структура установщика приведена в статье [Создание модуля](./../../get-started/create-module.md).

Добавьте класс обработчика в код модуля:

```php
class ExampleReportsPullSchema
{
    public static function onGetDependentModule()
    {
        return [
            'MODULE_ID' => 'example.reports',
            'USE' => ['PUBLIC_SECTION'],
        ];
    }
}
```

При установке зарегистрируйте обработчик:

```php
RegisterModuleDependences(
    'pull',
    'OnGetDependentModule',
    'example.reports',
    'ExampleReportsPullSchema',
    'onGetDependentModule'
);
```

При удалении модуля удалите ту же зависимость:

```php
UnRegisterModuleDependences(
    'pull',
    'OnGetDependentModule',
    'example.reports',
    'ExampleReportsPullSchema',
    'onGetDependentModule'
);
```

После перехода на постоянную регистрацию уберите учебный обработчик из `init.php`. Вызовы `RegisterModuleDependences` и `UnRegisterModuleDependences` размещайте в установщике и деинсталляторе модуля. Зависимость регистрируют и удаляют вместе с модулем, а не при каждом показе компонента.

Если интерфейс работает и в административной части, укажите оба значения:

```php
'USE' => ['PUBLIC_SECTION', 'ADMIN_SECTION'],
```

`PUBLIC_SECTION` разрешает использовать Pull в публичном разделе, а `ADMIN_SECTION` — в административном. Эти значения не предоставляют пользователю права на отчет или страницу раздела. В административном разделе подключайте клиент на странице со штатными прологом и эпилогом и отдельно проверяйте права. Публичный пример не становится страницей административного раздела от добавления `ADMIN_SECTION`.

В рабочем приложении замените файловое хранилище и списки пользователей на данные модуля, а ручной запуск CLI — на выбранный механизм фоновой обработки. Сохраните порядок действий — проверка доступа, подписка, чтение, запуск, сохранение результата и уведомление. Предметный пример с формированием файлов приведен в статье [Файлы и преобразование документов](./../documentgenerator/files-and-transformation.md).

После проверки удалите учебные файлы и каталог данных, если они больше не нужны. Удалите также учебную зависимость из `init.php`, если ее не используют другие примеры раздела.
