---
title: Контроллеры
description: "Контроллеры Bitrix Framework: создание действий, настройка HTTP-маршрутов и AJAX-вызовов, обработка запросов, ответы и автоваринг."
---

Контроллер обрабатывает запрос, вызывает бизнес-логику и возвращает ответ. В Bitrix Framework за контроллеры отвечает класс `Bitrix\Main\Engine\Controller`. Действия контроллера — это методы с суффиксом `Action`, например `listAction`, `getAction`, `addAction`.

Действия контроллера можно вызывать через HTTP-маршрут или AJAX-диспетчер `BX.ajax.runAction()`. Оба способа показаны на отдельных контроллерах: `Web\Iblock` обрабатывает HTTP-запросы, а `Ajax\Iblock` — AJAX-вызовы.

## Подготовить модуль

Материал объединяет HTTP- и AJAX-примеры в одном учебном проекте. Выберите подходящий сценарий:

-  изучить оба способа вызова — выполните примеры по порядку,

-  использовать только HTTP-маршруты — создайте `Web\Iblock` и пропустите AJAX-разделы,

-  использовать только AJAX-вызовы — начните с раздела [Настроить AJAX-контроллер](#http-ajax).

Для примеров используется учебный модуль `my.content`. Установите его перед созданием контроллеров.

1. Скачайте [архив с модулем](https://dev.1c-bitrix.ru/docs/chm_files/my.content.zip).

2. Распакуйте папку `my.content` в `/local/modules/` проекта.

3. Установите модуль на странице *Marketplace > Установленные решения* в административном разделе.

Команды статьи используют пространство имен из `/local/modules/my.content/.settings.php`. Для собственного модуля замените `my.content`, префикс `My\Content`, предметное имя `Iblock` и идентификаторы действий `my:content.Iblock.*`.

Если пространство имен для генераторов не настроено, настройте его или создайте классы вручную по указанным путям. Добавьте нужные секции в существующий `.settings.php` и не заменяйте файл целиком.

## Создать контроллер через консоль

Перед запуском команды перейдите в каталог, в котором находится файл `bitrix.php`.

{% note tip "" %}

Подробнее о консольном инструменте и справке по его командам читайте в статье [Консольные команды](./console-commands.md).

{% endnote %}

Команда `make:controller` создает класс контроллера и заданные действия:

```bash prompt="$"
$ php bitrix.php make:controller <controller-name> \
    -m <module-id> \
    --actions=<action-names> \
    [-C <context>] \
    --no-interaction
```

Квадратные скобки обозначают необязательную часть команды. При запуске команды вводить их не нужно.

Параметры команды:

-  `<controller-name>` — имя контроллера.

-  `-m <module-id>` — идентификатор модуля, в котором команда создает контроллер.

-  `--actions=<action-names>` — имена действий через запятую. Для каждого имени команда создает метод с суффиксом `Action`.

-  `-C <context>` — контекст контроллера: подпространство имен и соответствующий подкаталог.

   Без этого параметра команда создает контроллер в корневом пространстве имен модуля. Например, для контроллера `iblock` из модуля `my.content` команда создает файл `/local/modules/my.content/lib/Infrastructure/Controller/Iblock.php`.

-  `--no-interaction` — отключает дополнительные запросы команды.

Контроллер может находиться в любом каталоге внутри `lib`, если класс доступен автозагрузке Bitrix Framework. В примерах используются контексты `Web` и `Ajax`. Команда создает для них отдельные пространства имен и подкаталоги, чтобы разделить HTTP- и AJAX-действия.

Создайте первый контроллер в модуле `my.content`:

```bash prompt="$"
$ php bitrix.php make:controller iblock \
    -m my.content \
    --actions=get \
    -C Web \
    --no-interaction
```

Команда создаст файл `/local/modules/my.content/lib/Infrastructure/Controller/Web/Iblock.php` с действием `getAction()`.

Замените содержимое `Web/Iblock.php` на пример ниже.

-  Метод `init()` из сгенерированного шаблона можно удалить, если в нем нет своей логики.

-  Метод `configureActions()` не нужен, потому что действие настроено атрибутами.

-  Метод `getAutoWiredParameters()` оставьте пустым. Он понадобится для собственных классов в разделе [Автоваринг](./controllers.md#autowiring).

Авторизация и ограничение HTTP-метода заданы атрибутами над `getAction()`. Не настраивайте это же действие одновременно через `configureActions()`, иначе контроллер вернет ошибку `Invalid configuration of actions`.

```php
<?php

namespace My\Content\Infrastructure\Controller\Web;

use Bitrix\Iblock\IblockTable;
use Bitrix\Main\Engine\ActionFilter\HttpMethod;
use Bitrix\Main\Engine\Controller;
use Bitrix\Main\Error;
use Bitrix\Main\Loader;

final class Iblock extends Controller
{
    public function getAutoWiredParameters(): array
    {
        return [];
    }

    #[\Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Authentication]
    #[\Bitrix\Main\Engine\ActionFilter\Attribute\Rule\HttpMethod([HttpMethod::METHOD_GET])]
    public function getAction(int $id = 0): ?array
    {
        if (!Loader::includeModule('iblock'))
        {
            $this->addError(new Error('Iblock module is not installed', 'IBLOCK_MODULE_NOT_INSTALLED'));

            return null;
        }

        $query =
            IblockTable::query()
                ->setSelect(['ID', 'NAME', 'IBLOCK_TYPE_ID'])
                ->setLimit(1)
        ;

        if ($id > 0)
        {
            $query->where('ID', $id);
        }

        $iblock = $query->fetch();
        if (!$iblock)
        {
            $this->addError(new Error('Iblock not found', 'IBLOCK_NOT_FOUND'));

            return null;
        }

        return $iblock;
    }
}
```

В примере действие `get` возвращает данные инфоблока. Оно доступно только авторизованным пользователям через GET-запрос. Если `$id` равен `0`, действие возвращает первый найденный инфоблок. Если `$id` больше `0`, действие возвращает инфоблок с этим идентификатором.

## Зарегистрировать контроллер

Создать класс контроллера недостаточно. Нужно зарегистрировать точку входа, через которую Bitrix Framework начнет обрабатывать действие.

Для контроллера доступны два варианта регистрации:

-  HTTP-маршрут в `/local/routes/web.php`,

-  AJAX-настройка пространства имен в `/local/modules/my.content/.settings.php`.

Сначала зарегистрируйте созданный `Web\Iblock` как HTTP-обработчик. AJAX-контроллер будет добавлен в разделе [ниже](./controllers.md#создать-класс-ajax-контроллера).

### Настроить HTTP-маршрут

Создайте файл `/local/routes/web.php` и зарегистрируйте маршруты для HTTP-примеров статьи:

```php
<?php

use Bitrix\Main\Routing\RoutingConfigurator;
use My\Content\Infrastructure\Controller\Web\Iblock;

return static function (RoutingConfigurator $routes)
{
    $routes->get('/content/iblock/{id}/', [Iblock::class, 'get'])
        ->where('id', '[0-9]+');

    $routes->get('/content/export/{type}/', [Iblock::class, 'export'])
        ->where('type', '[a-z0-9_-]+');
    $routes->get('/content/photo/resize/', [Iblock::class, 'resizePhoto']);
    $routes->get('/content/photo/', [Iblock::class, 'downloadPhoto']);
    $routes->get('/content/render/view/', [Iblock::class, 'renderView']);
    $routes->get('/content/render/component/{id}/', [Iblock::class, 'renderComponent']);
    $routes->get('/content/render/extension/{id}/', [Iblock::class, 'renderExtension']);
    $routes->get('/content/error/{id}/', [Iblock::class, 'error']);
    $routes->get('/content/autowire/{id}/', [Iblock::class, 'autowire']);
    $routes->get('/content/service/', [Iblock::class, 'service']);
};
```

Первый маршрут вызывает созданное действие `getAction()`. Остальные маршруты понадобятся для HTTP-примеров в разделах ниже.

Не вызывайте остальные маршруты, пока не добавите соответствующие методы в `Web\Iblock`.

Если файл маршрутов еще не подключен, добавьте секцию `routing` в `/bitrix/.settings.php`. Сохраните остальные настройки файла:

```php
<?php

return [
    // Другие настройки системы
    'routing' => [
        'value' => [
            'config' => ['web.php'],
        ],
        'readonly' => true,
    ],
];
```

Система будет искать пользовательские маршруты в файле `/local/routes/web.php`.

{% note tip "" %}

Подробнее о настройке веб-сервера и маршрутах читайте в статье [Роутинг](./routing.md).

{% endnote %}

Чтобы получить успешный ответ, создайте хотя бы один инфоблок. Затем проверьте вызов через HTTP. Контроллер проверяет авторизацию, поэтому передайте логин и пароль пользователя через Basic Authentication:

```bash prompt="$"
$ curl --request GET \
    --url 'http://localhost/content/iblock/0/' \
    --user 'login:password'
```

Контроллер вернет JSON-ответ:

```json
{"status":"success","data":{"ID":"1","NAME":"Новости","IBLOCK_TYPE_ID":"news"},"errors":[]}
```

При значении `0` контроллер вернет первый найденный инфоблок. Если на сайте нет инфоблоков, ответ будет содержать ошибку `IBLOCK_NOT_FOUND`. Значения полей зависят от инфоблока на сайте.

## Настроить AJAX-контроллер       {#http-ajax}

Не регистрируйте один контроллер одновременно для HTTP-маршрутов и AJAX-вызовов. У этих точек входа разные способы вызова. Возможность вызвать одно и то же действие двумя способами создает путаницу и затрудняет отладку. Отдельные контроллеры позволяют независимо настраивать действия и не смешивать HTTP- и AJAX-сценарии. Поэтому для AJAX-действий создайте отдельный `Ajax\Iblock`.

### Создать класс AJAX-контроллера

{% note warning "" %}

Если в проекте нужны только AJAX-вызовы, создавать `Web\Iblock` и настраивать HTTP-маршруты не требуется. Создайте один AJAX-контроллер и зарегистрируйте его пространство имен в `.settings.php`.

{% endnote %}

Создайте контроллер `Iblock` с действием `ping` в контексте `Ajax`:

```bash prompt="$"
$ php bitrix.php make:controller iblock \
    -m my.content \
    --actions=ping \
    -C Ajax \
    --no-interaction
```

Команда создаст файл `/local/modules/my.content/lib/Infrastructure/Controller/Ajax/Iblock.php`. Замените его содержимое на пример:

```php
<?php

namespace My\Content\Infrastructure\Controller\Ajax;

use Bitrix\Main\Engine\Controller;

final class Iblock extends Controller
{
    public function pingAction(): array
    {
        return [
            'transport' => 'ajax',
        ];
    }
}
```

`pingAction()` — минимальное действие для проверки точки входа.

Все AJAX-действия в статье учебные. Перед использованием в рабочем проекте настройте проверку авторизации для действий с защищенными данными, а для изменяющих действий ограничьте допустимый HTTP-метод.

{% note tip "" %}

Подробнее о настройке читайте в статье [Пре- и постфильтры](./pre-post-filters.md).

{% endnote %}

### Настроить AJAX-вызовы

AJAX-диспетчер находит контроллер по пространству имен из секции `controllers` и идентификатору действия. Добавьте или обновите секцию `controllers` в файле `/local/modules/my.content/.settings.php`. Сохраните остальные настройки файла:

```php
<?php

return [
    // Другие настройки модуля
    'controllers' => [
        'value' => [
            'defaultNamespace' => '\\My\\Content\\Infrastructure\\Controller\\Ajax',
        ],
        'readonly' => true,
    ],
];
```

После настройки вызовите `pingAction()` по идентификатору `my:content.Iblock.ping`. Откройте страницу сайта с подключенным JS-ядром Bitrix и выполните код в консоли браузера:

```javascript
BX.ajax.runAction('my:content.Iblock.ping')
    .then((response) => console.log(response));
```

Контроллер вернет JSON-ответ:

```json
{"status":"success","data":{"transport":"ajax"},"errors":[]}
```

Способ вызова определяет точку входа, но не меняет устройство действия. Контроллер получает параметры, выполняет метод с суффиксом `Action` и формирует ответ.

В учебном проекте методы распределены между `Web\Iblock` и `Ajax\Iblock`. При добавлении собственных действий учитывайте точку входа и выбирайте совместимый с ней тип ответа.

## Жизненный цикл контроллера

При вызове действия система выполняет шаги:

1. Создает экземпляр конкретного контроллера.

2. Вызывает `Controller::init()`.

3. Создает объект действия по имени `*Action`.

4. Выполняет `Controller::prepareParams()`.

5. Выполняет `Controller::processBeforeAction($action)`.

6. Вызывает событие `onBeforeAction`. Обработчик может отменить выполнение.

7. Вызывает метод действия `actionNameAction(...)`.

8. Вызывает событие `onAfterAction`.

9. Выполняет `Controller::processAfterAction($action, $result)`.

10. Формирует ответ.

11. Выполняет `Controller::finalizeResponse($response)`.

12. Отправляет ответ пользователю.

При необходимости переопределите методы `init()`, `processBeforeAction()`, `processAfterAction()` и `finalizeResponse()`.

## Реквесты

Аргументы методов с суффиксом `Action` формируются из запроса по имени и типу.

Добавьте методы из примеров кода в файл `/local/modules/my.content/lib/Infrastructure/Controller/Ajax/Iblock.php`.

```php
final class Iblock extends Controller
{
    // ...

    public function getByCodeAction(string $code): array
    {
        return [
            'code' => $code,
        ];
    }

    public function listAction(int $limit = 10, ?int $categoryId = null): array
    {
        return [
            'limit' => $limit,
            'categoryId' => $categoryId,
        ];
    }
}
```

Вызовите действия из консоли браузера:

```javascript
BX.ajax.runAction('my:content.Iblock.getByCode', {
    data: { code: 'news' }
}).then((response) => console.log(response));

BX.ajax.runAction('my:content.Iblock.list', {
    data: { limit: 20, categoryId: 5 }
}).then((response) => console.log(response));
```

В первом вызове `code` передает обязательный символьный код. Во втором вызове `limit` и `categoryId` передают необязательные параметры.

Первый вызов вернет переданный символьный код:

```json
{"status":"success","data":{"code":"news"},"errors":[]}
```

Второй вызов вернет переданные значения ограничения и категории:

```json
{"status":"success","data":{"limit":20,"categoryId":5},"errors":[]}
```

Правила:

-  если обязательный параметр отсутствует, система вернет ошибку `Could not find value for parameter`,

-  если у параметра есть значение по умолчанию, действие использует это значение,

-  если тип значения не совпадает с типом аргумента, система вернет ошибку `Invalid value to match with parameter`.

### Получить текущего пользователя

Чтобы получить текущего пользователя, добавьте аргумент `Bitrix\Main\Engine\CurrentUser` в сигнатуру метода-действия контроллера:

```php
final class Iblock extends Controller
{
    // ...

    public function currentUserAction(\Bitrix\Main\Engine\CurrentUser $user): ?array
    {
        if (empty($user->getId()))
        {
            $this->addError(new \Bitrix\Main\Error('Need authenticated'));

            return null;
        }

        return [
            'userId' => $user->getId(),
        ];
    }
}
```

Чтобы проверить действие, выполните код в консоли браузера на странице сайта:

```javascript
BX.ajax.runAction('my:content.Iblock.currentUser')
    .then((response) => console.log(response));
```

Контроллер вернет идентификатор текущего пользователя:

```json
{"status":"success","data":{"userId":"1"},"errors":[]}
```

Если сессия не авторизована, ответ будет содержать ошибку `Need authenticated`.

### Получить JSON-тело запроса

Чтобы получить данные из тела запроса с `Content-Type: application/json`, добавьте аргумент `Bitrix\Main\Engine\JsonPayload`.

```php
final class Iblock extends Controller
{
    // ...

    public function jsonAction(\Bitrix\Main\Engine\JsonPayload $json): array
    {
        return [
            'name' => $json->getDataList()->get('name'),
            'type' => $json->getDataList()->get('type'),
        ];
    }
}
```

Чтобы проверить действие, передайте JSON в параметре `json`:

```javascript
BX.ajax.runAction('my:content.Iblock.json', {
    json: {
        name: 'Новости',
        type: 'news'
    }
}).then((response) => console.log(response));
```

Параметр `json` передает данные в теле запроса с `Content-Type: application/json`.

Контроллер вернет JSON-ответ:

```json
{
  "status": "success",
  "data": {
    "name": "Новости",
    "type": "news"
  },
  "errors": []
}
```

### Получить постраничную навигацию

Чтобы получить объект навигации, добавьте аргумент `Bitrix\Main\UI\PageNavigation`:

```php
final class Iblock extends Controller
{
    // ...

    public function paginationAction(\Bitrix\Main\UI\PageNavigation $pagination): array
    {
        return [
            'page' => $pagination->getCurrentPage(),
            'size' => $pagination->getPageSize(),
            'limit' => $pagination->getLimit(),
            'offset' => $pagination->getOffset(),
        ];
    }
}
```

Чтобы проверить действие, передайте навигацию в поле `navigation`:

```javascript
BX.ajax.runAction('my:content.Iblock.pagination', {
    navigation: {
        page: 3,
        size: 33
    }
}).then((response) => console.log(response));
```

Bitrix Framework создаст объект `PageNavigation`. Контроллер вернет номер и размер страницы, лимит и смещение:

```json
{"status":"success","data":{"page":3,"size":33,"limit":33,"offset":66},"errors":[]}
```

Размер страницы применяется, если значение входит в разрешенный диапазон от `1` до `50`.

{% note tip "" %}

О классе `PageNavigation` читайте в статье [Постраничная навигация](./../cms-basics/page-navigation.md).

{% endnote %}

### DTO реквеста       {#dto}

DTO реквеста описывает входные данные, применяет валидацию и передает подготовленный объект в действие. Для подключения DTO к действию используется [автоваринг](./controllers.md#autowiring).

В имени `IblockCreateRequest` часть `Iblock` обозначает предметную область. В собственном модуле замените ее и используйте тот же принцип для классов `IblockData` и `IblockService` из следующих разделов.

Создайте реквест командой `make:request`.

```bash prompt="$"
$ php bitrix.php make:request IblockCreate -m my.content --fields=name,type,description --no-interaction
```

Команда использует AJAX-пространство имен из `.settings.php` и создаст файл `/local/modules/my.content/lib/Infrastructure/Controller/Ajax/Request/IblockCreateRequest.php`.

Сгенерированное содержимое уже подходит для передачи данных в действие. Чтобы добавить валидацию, дополните файл атрибутами `NotEmpty` и `Length`, как в примере ниже.

Если создаете файл вручную, используйте тот же путь.

```php
<?php

namespace My\Content\Infrastructure\Controller\Ajax\Request;

use Bitrix\Main\Validation\Rule\Length;
use Bitrix\Main\Validation\Rule\NotEmpty;

final class IblockCreateRequest
{
    public function __construct(
        #[NotEmpty]
        public readonly ?string $name,
        #[NotEmpty]
        public readonly ?string $type,
        #[Length(max: 10000)]
        public readonly ?string $description,
    )
    {
    }

    public static function createFromRequest(\Bitrix\Main\Request $request): self
    {
        return new self(
            $request->get('name'),
            $request->get('type'),
            $request->get('description'),
        );
    }
}
```

Зарегистрируйте DTO в контроллере через `getAutoWiredParameters()`:

```php
use My\Content\Infrastructure\Controller\Ajax\Request\IblockCreateRequest;

final class Iblock extends Controller
{
    // ...

    public function getAutoWiredParameters(): array
    {
        return [
            new \Bitrix\Main\Validation\Engine\AutoWire\ValidationParameter(
                IblockCreateRequest::class,
                fn () => IblockCreateRequest::createFromRequest($this->getRequest()),
            ),
        ];
    }

    public function createAction(IblockCreateRequest $request): array
    {
        return [
            'name' => $request->name,
            'type' => $request->type,
            'description' => $request->description,
        ];
    }
}
```

Валидация выполняется до вызова действия. При ошибках действие не запускается.

{% note tip "" %}

Подробнее о правилах автоваринга смотрите в разделе [Автоваринг](#autowiring).

{% endnote %}

Чтобы проверить DTO, вызовите `createAction()` через AJAX:

```javascript
BX.ajax.runAction('my:content.Iblock.create', {
    data: {
        name: 'Новости',
        type: 'news',
        description: 'Раздел новостей'
    }
}).then((response) => console.log(response));
```

Контроллер вернет JSON-ответ:

```json
{
  "status": "success",
  "data": {
    "name": "Новости",
    "type": "news",
    "description": "Раздел новостей"
  },
  "errors": []
}
```

## Респонсы

Контроллер поддерживает разные типы ответов:

-  `Bitrix\Main\Engine\Response\AjaxJson`,

-  `Bitrix\Main\HttpResponse`,

-  `Bitrix\Main\Engine\Response\File`,

-  `Bitrix\Main\Engine\Response\BFile`,

-  `Bitrix\Main\Engine\Response\ResizedImage`,

-  `Bitrix\Main\Engine\Response\Component`,

-  `Bitrix\Main\Engine\Response\HtmlContent`,

-  `Bitrix\Main\Engine\Response\Json`,

-  `Bitrix\Main\Engine\Response\OpenDesktopApp`,

-  `Bitrix\Main\Engine\Response\OpenMobileApp`,

-  `Bitrix\Main\Engine\Response\Redirect`,

-  `Bitrix\Main\Engine\Response\Zip\Archive`.

Добавьте методы из примеров раздела в `/local/modules/my.content/lib/Infrastructure/Controller/Web/Iblock.php`. Маршруты для проверки уже [добавлены](./controllers.md#настроить-http-маршрут) в `/local/routes/web.php`.

### Вернуть JSON

Этот тип используется по умолчанию. Явно создавайте `Json`, если нужен ответ без полей `status` и `errors`.

### Вернуть файлы

Чтобы вернуть файлы, используйте классы `Response\File` и `Response\BFile`. `Response\File` возвращает файл с диска, а `Response\BFile` — файл из таблицы файлов.

В первом примере `Bitrix\Main\IO\File` получает файл с диска, а `Response\File` формирует ответ.

Маршрут `/content/export/{type}/` передает символьный тип экспорта в параметр `$type` действия `exportAction()`.

```php
use Bitrix\Main\Application;
use Bitrix\Main\Engine\Response\File as FileResponse;
use Bitrix\Main\Error;
use Bitrix\Main\IO\File;

final class Iblock extends Controller
{
    // ...

    public function exportAction(string $type): ?FileResponse
    {
        $filePath = Application::getDocumentRoot() . '/upload/export/iblock-' . $type . '.csv';
        $file = new File($filePath);
        if (!$file->isExists())
        {
            $this->addError(new Error('Export file not found', 'EXPORT_FILE_NOT_FOUND'));

            return null;
        }

        return new FileResponse($file->getPath(), $file->getName(), 'text/csv');
    }
}
```

Чтобы проверить пример, создайте файл `/upload/export/iblock-news.csv` и откройте `/content/export/news/`. Контроллер вернет созданный файл.

Пример с `Response\BFile`:

```php
use Bitrix\Main\Error;
use Bitrix\Main\Engine\Response\BFile;
use Bitrix\Main\UserTable;
use Bitrix\Main\Engine\CurrentUser;

final class Iblock extends Controller
{
    // ...

    #[\Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Authentication]
    public function downloadPhotoAction(CurrentUser $user): ?BFile
    {
        $user = UserTable::getList([
            'select' => ['PERSONAL_PHOTO'],
            'filter' => ['ID' => $user->getId()],
        ])->fetch();

        if (!$user || empty($user['PERSONAL_PHOTO']))
        {
            $this->addError(new Error('User photo not found', 'USER_PHOTO_NOT_FOUND'));

            return null;
        }

        return BFile::createByFileId((int)$user['PERSONAL_PHOTO']);
    }
}
```

Для проверки добавьте фотографию текущему пользователю. Если фотографии нет, контроллер вернет ошибку `USER_PHOTO_NOT_FOUND`.

Откройте `/content/photo/`, чтобы получить фотографию текущего пользователя.

### Вернуть изображение

Используйте `Response\ResizedImage`, чтобы вернуть изображение заданного размера:

```php
use Bitrix\Main\Error;
use Bitrix\Main\Engine\Response\ResizedImage;
use Bitrix\Main\UserTable;
use Bitrix\Main\Engine\CurrentUser;

final class Iblock extends Controller
{
    // ...

    #[\Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Authentication]
    public function resizePhotoAction(CurrentUser $user): ?ResizedImage
    {
        $user = UserTable::getList([
            'select' => ['PERSONAL_PHOTO'],
            'filter' => ['ID' => $user->getId()],
        ])->fetch();

        if (!$user || empty($user['PERSONAL_PHOTO']))
        {
            $this->addError(new Error('User photo not found', 'USER_PHOTO_NOT_FOUND'));

            return null;
        }

        return ResizedImage::createByImageId((int)$user['PERSONAL_PHOTO'], 100, 100);
    }
}
```

Откройте `/content/photo/resize/`, чтобы получить фотографию текущего пользователя размером 100 на 100 пикселей.

{% note warning "" %}

Не передавайте размеры изображения напрямую из запроса. Используйте фиксированные значения или подписанные параметры.

{% endnote %}

## Использовать рендеринг

Рендеринг выводит HTML-страницы, компоненты или JS-расширения из контроллера.

{% note info "" %}

Функционал рендеринга доступен с версии `25.700.0` главного модуля.

{% endnote %}

Добавьте методы из примеров раздела в файл `/local/modules/my.content/lib/Infrastructure/Controller/Web/Iblock.php`. Исключение — `componentAction()` из подраздела [Отрисовать компонент для AJAX](./controllers.md#отрисовать-компонент-для-ajax). Его нужно добавить в `Ajax/Iblock.php`.

Методы `renderView()` и `renderComponent()` возвращают HTML-ответ на основе `HttpResponse` и предназначены для HTTP-маршрутов. Не вызывайте действия с такими ответами через `BX.ajax.runAction()`: он ожидает JSON. Чтобы вернуть результат компонента через AJAX, используйте `renderComponentAjax()` — он формирует JSON-ответ с HTML и подключаемыми ресурсами.

### Отрисовать представление

Метод `renderView()` возвращает HTML из файла представления. Переменные из второго аргумента доступны в шаблоне как обычные PHP-переменные.

```php
final class Iblock extends Controller
{
    // ...

    public function renderViewAction(): \Bitrix\Main\Engine\Response\Render\View
    {
        return $this->renderView('content/index', [
            'title' => 'Новости',
        ]);
    }
}
```

Откройте URL в браузере:

```
http://localhost/content/render/view/
```

Контроллер вернет HTML-страницу с заголовком `Новости`.

Система ищет шаблон по пути `/local/modules/my.content/views/content/index.php`. Этот файл уже есть в учебном модуле:

```php
<?php

/** @var string $title */
?>
<h1><?= htmlspecialcharsbx($title) ?></h1>
```

Чтобы отключить общий шаблон сайта, замените `return $this->renderView(...)` в методе `renderViewAction()` на вызов с `withSiteTemplate: false`.

```php
return $this->renderView('content/index', [
    'title' => 'Новости',
], withSiteTemplate: false);
```

### Отрисовать компонент

Если страница состоит из одного компонента, используйте `renderComponent()`. Отдельное представление не требуется.

Компонент `my.content:iblock.view` есть в учебном модуле.

Параметры метода:

-  `$name` — символьное имя компонента, обязательный параметр,

-  `$template` — название шаблона компонента,

-  `$params` — ассоциативный массив параметров для передачи в компонент.

```php
final class Iblock extends Controller
{
    // ...

    public function renderComponentAction(int $id): \Bitrix\Main\Engine\Response\Render\Component
    {
        return $this->renderComponent('my.content:iblock.view', '', [
            'IBLOCK_ID' => $id,
        ]);
    }
}
```

Откройте URL в браузере и замените `1` на ID существующего инфоблока:

```
http://localhost/content/render/component/1/
```

Контроллер вернет HTML-страницу с результатом работы компонента `my.content:iblock.view`.

### Отрисовать компонент для AJAX

Метод `renderComponentAjax()` формирует ответ для обработки в браузере.

Добавьте `componentAction()` в `/local/modules/my.content/lib/Infrastructure/Controller/Ajax/Iblock.php`.

Первые три параметра совпадают с параметрами `renderComponent()`. Дополнительно метод принимает:

-  `$additionalResponseParams` — дополнительные данные, которые попадают в ответ,

-  `$dataKeys` — список ключей из результата работы компонента, которые попадают в ответ.

```php
final class Iblock extends Controller
{
    // ...

    public function componentAction(int $id): \Bitrix\Main\Engine\Response\Component
    {
        return $this->renderComponentAjax('my.content:iblock.view', '', [
            'IBLOCK_ID' => $id,
        ]);
    }
}
```

Чтобы проверить пример, вызовите действие из консоли браузера. Замените `1` на ID существующего инфоблока:

```javascript
BX.ajax.runAction('my:content.Iblock.component', {
    data: { id: 1 }
}).then((response) => console.log(response));
```

Пример структуры ответа:

```javascript
{
    status: 'success',
    data: {
        html: 'HTML код компонента',
        assets: {
            js: [],
            css: [],
            string: []
        },
        additionalParams: {},
        componentResult: {}
    },
    errors: []
}
```

### Отрисовать расширение

Для страниц, которые выводят только JS-расширение, используйте `renderExtension()`:

```php
final class Iblock extends Controller
{
    // ...

    public function renderExtensionAction(int $id): \Bitrix\Main\Engine\Response\Render\Extension
    {
        return $this->renderExtension('my.content.iblock.editor', [
            'iblockId' => $id,
        ]);
    }
}
```

Откройте URL в браузере:

```text
http://localhost/content/render/extension/1/
```

Контроллер вернет страницу, на которой подключено JS-расширение `my.content.iblock.editor`. В конце страницы появится текст `Iblock editor: 1`.

Если открыть URL `http://localhost/content/render/extension/2/`, текст изменится на `Iblock editor: 2`. Так можно проверить, что значение из маршрута передано в метод контроллера и использовано в расширении.

Если страница пустая, проверьте, что при установке модуля расширение скопировалось в `/local/js/my/content/iblock/editor/`, в браузер загрузилась актуальная версия файла `dist/editor.bundle.js` и в консоли нет JavaScript-ошибок. В учебном расширении скрипт сам создает контейнер, если страница от `renderExtension()` открылась без `body`.

При сборке расширения запись файла скрипта в `config.php` формируется автоматически. Точку входа `controllerEntrypoint` укажите вручную:

```php
<?php

return [
    'js' => './dist/editor.bundle.js',
    'rel' => [
        'main.core',
    ],
    'skip_core' => false,
    'controllerEntrypoint' => 'MyContent.Iblock.Editor.render',
];
```

Расширение `my.content.iblock.editor` есть в учебном модуле.

{% note info "" %}

Рендеринг расширений работает в браузере. Это не Server-Side Rendering. Используйте его для интерфейсов без требований к SEO.

{% endnote %}

## Обработать ошибки

Чтобы вернуть ошибку в стандартном JSON-ответе, добавьте объект `Bitrix\Main\Error` через `addError()`:

Добавьте метод в `/local/modules/my.content/lib/Infrastructure/Controller/Web/Iblock.php`.

```php
final class Iblock extends Controller
{
    // ...

    public function errorAction(int $id): ?array
    {
        if ($id <= 0)
        {
            $this->addError(new \Bitrix\Main\Error('Iblock id is required', 'IBLOCK_ID_REQUIRED'));

            return null;
        }

        return [
            'success' => true,
        ];
    }
}
```

Откройте `/content/error/0/`, чтобы получить ответ с ошибкой.

Ответ при ошибке:

```json
{
    "status": "error",
    "data": null,
    "errors": [
        {
            "message": "Iblock id is required",
            "code": "IBLOCK_ID_REQUIRED"
        }
    ]
}
```

Для отладки включите режим разработки в `/bitrix/.settings.php`:

```php
'exception_handling' => [
    'value' => [
        'debug' => true,
    ],
    'readonly' => false,
],
```

В режиме разработки система добавляет в ошибки стек вызовов. Не включайте этот режим на рабочем сайте.

## Автоваринг       {#autowiring}

Автоваринг автоматически создает или получает объект и подставляет его в аргумент действия контроллера.

Добавьте методы из примеров раздела в `/local/modules/my.content/lib/Infrastructure/Controller/Web/Iblock.php`.

Bitrix Framework поддерживает встроенный автоваринг для `CurrentUser`, `JsonPayload` и `PageNavigation`. Для собственных классов добавьте правило в `getAutoWiredParameters()` или зарегистрируйте сервис в `Bitrix\Main\DI\ServiceLocator`.

### Настроить автоваринг кастомных классов

Чтобы преобразовать входной параметр в объект, добавьте правило в `getAutoWiredParameters()`.

Создайте файл `/local/modules/my.content/lib/Value/IblockData.php`. Класс `My\Content\Value\IblockData` хранит данные инфоблока:

```php
<?php

namespace My\Content\Value;

final class IblockData
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $type,
    )
    {
    }
}
```

`ExactParameter` использует строгое имя аргумента. Замените пустой массив в `getAutoWiredParameters()` класса `Web\Iblock` на правило из примера:

```php
use Bitrix\Iblock\IblockTable;
use Bitrix\Main\Engine\AutoWire\ExactParameter;
use Bitrix\Main\Loader;
use My\Content\Value\IblockData;

final class Iblock extends Controller
{
    // ...

    public function getAutoWiredParameters(): array
    {
        return [
            new ExactParameter(
                IblockData::class,
                'iblock',
                static function (string $className, int $id): ?IblockData
                {
                    if (!Loader::includeModule('iblock'))
                    {
                        return null;
                    }

                    $row = IblockTable::getRow([
                        'select' => ['ID', 'NAME', 'IBLOCK_TYPE_ID'],
                        'filter' => ['=ID' => $id],
                    ]);

                    if (!$row)
                    {
                        return null;
                    }

                    return new IblockData(
                        (int)$row['ID'],
                        (string)$row['NAME'],
                        (string)$row['IBLOCK_TYPE_ID'],
                    );
                }
            ),
        ];
    }

    public function autowireAction(IblockData $iblock): array
    {
        return [
            'id' => $iblock->id,
            'name' => $iblock->name,
            'type' => $iblock->type,
        ];
    }
}
```

Откройте URL в браузере. Вместо `1` укажите ID существующего инфоблока:

```text
http://localhost/content/autowire/1/
```

Контроллер вернет JSON-ответ:

```json
{
    "status": "success",
    "data": {
        "id": 1,
        "name": "Новости",
        "type": "news"
    },
    "errors": []
}
```

Если объект не создан, система вернет ошибку `Could not construct parameter {iblock}`. Для валидации параметров используйте `Bitrix\Main\Validation\Engine\AutoWire\ValidationParameter`.

{% note tip "" %}

Подробнее о правилах валидации читайте в статье [Валидация](./validation.md).

{% endnote %}

## Использовать сервис-локатор

Если объект нельзя получить с помощью встроенного автоваринга или правила `getAutoWiredParameters()`, система пробует получить его из `Bitrix\Main\DI\ServiceLocator`.

Добавьте `serviceAction()` в `/local/modules/my.content/lib/Infrastructure/Controller/Web/Iblock.php`.

Создайте файл `/local/modules/my.content/lib/Service/IblockService.php`.

```php
<?php

namespace My\Content\Service;

use Bitrix\Iblock\IblockTable;
use Bitrix\Main\Loader;

final class IblockService
{
    public function getFirstIblock(): ?array
    {
        if (!Loader::includeModule('iblock'))
        {
            return null;
        }

        $row = IblockTable::getRow([
            'select' => ['ID', 'NAME', 'IBLOCK_TYPE_ID'],
            'order' => ['ID' => 'ASC'],
        ]);

        if (!$row)
        {
            return null;
        }

        return [
            'id' => (int)$row['ID'],
            'name' => (string)$row['NAME'],
            'type' => (string)$row['IBLOCK_TYPE_ID'],
        ];
    }
}
```

Использование сервиса в контроллере:

```php
use My\Content\Service\IblockService;

final class Iblock extends Controller
{
    // ...

    public function serviceAction(IblockService $service): ?array
    {
        $iblock = $service->getFirstIblock();
        if (!$iblock)
        {
            $this->addError(new \Bitrix\Main\Error('Iblock not found', 'IBLOCK_NOT_FOUND'));

            return null;
        }

        return $iblock;
    }
}
```

Откройте URL в браузере:

```text
http://localhost/content/service/
```

Контроллер вернет JSON-ответ с первым инфоблоком по возрастанию ID:

```json
{
    "status": "success",
    "data": {
        "id": 1,
        "name": "Новости",
        "type": "news"
    },
    "errors": []
}
```

Если класс не зарегистрирован в контейнере, система создаст его напрямую. Для управления жизненным циклом зарегистрируйте сервис в DI.

{% note tip "" %}

Подробнее читайте в статье [Service Locator](./service-locator.md).

{% endnote %}

## Проверить итоговую структуру

Схема ниже соответствует полному сценарию статьи. Для HTTP-сценария используйте ветку `Web` и файл `/local/routes/web.php`. Для AJAX-сценария используйте ветку `Ajax` и секцию `controllers` в `.settings.php`.

```text
/local/
├── routes/
│   └── web.php
│       # HTTP-маршруты для Web\Iblock
└── modules/my.content/
    ├── .settings.php
    │   # Пространство имен AJAX-контроллеров
    └── lib/
        ├── Infrastructure/Controller/
        │   ├── Web/
        │   │   └── Iblock.php
        │   │       # HTTP-действия и автоваринг IblockData
        │   └── Ajax/
        │       ├── Iblock.php
        │       │   # AJAX-действия и автоваринг IblockCreateRequest
        │       └── Request/
        │           └── IblockCreateRequest.php
        │               # DTO входных данных для createAction()
        ├── Service/
        │   └── IblockService.php
        │       # Получение данных инфоблока
        └── Value/
            └── IblockData.php
                # Данные инфоблока для автоваринга
```

Методы распределены между контроллерами:

-  `Web\Iblock` — `getAction()`, `exportAction()`, `downloadPhotoAction()`, `resizePhotoAction()`, `renderViewAction()`, `renderComponentAction()`, `renderExtensionAction()`, `errorAction()`, `autowireAction()` и `serviceAction()`.

-  `Ajax\Iblock` — `pingAction()`, `getByCodeAction()`, `listAction()`, `currentUserAction()`, `jsonAction()`, `paginationAction()`, `createAction()` и `componentAction()`.

У каждого контроллера свой метод `getAutoWiredParameters()`. В `Web\Iblock` он создает `IblockData`, а в `Ajax\Iblock` — проверяет `IblockCreateRequest`. Не объединяйте правила двух контроллеров в одном методе.