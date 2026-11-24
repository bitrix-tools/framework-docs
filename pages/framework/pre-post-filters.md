---
title: Пре- и постфильтры
description: 'Пре- и постфильтры контроллеров Bitrix Framework: набор по умолчанию Authentication, HttpMethod и Csrf, фильтры Scope, ContentType, Cors, CloseSession и CacheResponse, общий набор filters, ответ при блокировке действия, собственные фильтры и подмена результата.'
---

Фильтры — обработчики, которые [контроллер](./controllers.md) `\Bitrix\Main\Engine\Controller` вызывает до и после действия (Action). Префильтр проверяет запрос и может заблокировать действие. Постфильтр получает результат действия и может заменить его.

Без настройки каждое действие контроллера получает [набор префильтров по умолчанию](#default-filters). Он пропускает только авторизованного пользователя, только методы `GET` и `POST` и только запрос с CSRF-токеном. Настройте фильтры, если действие нужно:

-  открыть гостям, например для публичной страницы по [HTTP-маршруту](./routing.md#controller-public-pages),

-  ограничить методом `POST`, потому что действие меняет данные,

-  ограничить типом содержимого запроса или областью вызова, например только REST,

-  дополнить ответ CORS-заголовками или заменить его,

-  [закешировать ответ](#cache-response) и не запускать действие повторно,

-  [проверить собственное условие](#custom-prefilter) до запуска действия.

## Типы фильтров {#filter-types}

Фильтр — объект класса-наследника `\Bitrix\Main\Engine\ActionFilter\Base`. Тип фильтра определяет, когда контроллер его вызывает.

-  Префильтры (prefilter) — выполняются до запуска действия, метод `onBeforeAction()`. Могут отменить выполнение.

-  Постфильтры (postfilter) — выполняются после действия, метод `onAfterAction()`. Могут изменить результат.

Контроллер вызывает все префильтры действия, даже если один из них уже заблокировал запрос. Префильтр пропускает запрос, если возвращает `null`. Чтобы заблокировать действие, префильтр возвращает объект `\Bitrix\Main\EventResult` с типом `EventResult::ERROR`. Постфильтры выполняются и после блокировки, результат действия в этом случае равен `null`.

Префильтр может пропустить действие без ошибки. Для этого он возвращает результат метода `\Bitrix\Main\Engine\ActionEventResult::skipAction()`. Контроллер не запускает действие и не добавляет ошибку, затем вызывает постфильтры с результатом `null`. Постфильтр может подставить свой результат, так работает [фильтр кеширования ответа](#cache-response). Если результат так и остался `null`, клиент получит ответ со статусом `success` и `data` со значением `null`.

Фильтр работает только в областях вызова, которые возвращает его метод `listAllowedScopes()`. Класс `Base` разрешает все три области — `Controller::SCOPE_AJAX`, `Controller::SCOPE_REST` и `Controller::SCOPE_CLI`. Часть стандартных фильтров сужает этот список, ограничения указаны в разделе каждого фильтра.

Область зависит от способа вызова контроллера. Контроллер, вызванный через `BX.ajax.runAction()` или [HTTP-маршрут](./routing.md), работает в области `SCOPE_AJAX`. Контроллер, вызванный через REST, работает в области `SCOPE_REST`.

### Ответ при блокировке {#blocked-response}

Если префильтр заблокировал действие, контроллер не запускает его и возвращает JSON со статусом `error`. Поле `data` равно `null`, массив `errors` содержит ошибки фильтров. У каждой ошибки есть поля `message`, `code` и `customData`.

**Пример.** Ответ на запрос, который не прошел фильтр `HttpMethod`:

```json
{
    "status": "error",
    "data": null,
    "errors": [
        {
            "message": "Wrong method for current action",
            "code": "invalid_http_method",
            "customData": null
        }
    ]
}
```

Код ошибки задает фильтр, коды стандартных фильтров приведены в их разделах. Из фильтров, описанных ниже, HTTP-статус ответа меняет только `Authentication`, он устанавливает 401. Метод `BX.ajax.runAction()` отклоняет промис, если статус ответа отличается от `success`.

## Основные фильтры

Стандартные фильтры находятся в пространстве имен `\Bitrix\Main\Engine\ActionFilter`. Префильтры `Authentication`, `HttpMethod`, `Csrf`, `Scope` и `ContentType` блокируют действие. Фильтры `CloseSession`, `Cors` и `CacheResponse` действие не блокируют. У каждого фильтра, кроме `CacheResponse`, есть атрибут с тем же именем, о разнице между атрибутами — в разделе [«Атрибуты фильтров»](#filter-attributes).

### Фильтр HTTP-методов

`\Bitrix\Main\Engine\ActionFilter\HttpMethod`

Проверяет HTTP-метод запроса и блокирует действие, если метод не разрешен. Используйте фильтр, чтобы действие, которое меняет данные, принимало только `POST`.

Аргументы:

-  `$allowedMethods` — массив допустимых HTTP-методов. По умолчанию — `[HttpMethod::METHOD_GET]`. Значения задают константы класса `METHOD_GET`, `METHOD_POST`, `METHOD_PUT`, `METHOD_PATCH`, `METHOD_DELETE`, `METHOD_CONNECT`, `METHOD_OPTIONS` и `METHOD_TRACE`.

При создании фильтра без аргументов `new HttpMethod()` разрешает только `GET`. Базовый класс `Controller` в методе `getDefaultPreFilters()` передает фильтру `GET` и `POST`. Метод `BX.ajax.runAction()` по умолчанию отправляет `POST`, поэтому при самостоятельной настройке фильтра для такого вызова добавьте `HttpMethod::METHOD_POST` в список допустимых методов.

Фильтр работает в областях `SCOPE_AJAX` и `SCOPE_REST`. При блокировке он добавляет ошибку с кодом `invalid_http_method` и сообщением `Wrong method for current action`.

**Пример.** Атрибут `Prefilters` задает действию `index` собственный набор из одного фильтра `HttpMethod`. Действие принимает `GET` и `POST` и доступно гостям, потому что набор по умолчанию с `Authentication` больше не действует. Для POST-запросов контроллер добавляет в набор `Csrf`, подробнее в разделе [«Фильтры по умолчанию»](#default-filters).

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Prefilters;
use Bitrix\Main\Engine\ActionFilter\HttpMethod;

final class Entity extends \Bitrix\Main\Engine\Controller
{
    #[Prefilters([
        new HttpMethod([
            HttpMethod::METHOD_GET,
            HttpMethod::METHOD_POST,
        ]),
    ])]
    public function indexAction()
    {
        // ...
    }
}
```

**Пример.** Атрибут `Rule\HttpMethod` добавляет фильтр к набору по умолчанию, а не заменяет его. Действие выполняется, только если запрос прошел все префильтры, поэтому `save` принимает только POST-запрос авторизованного пользователя с CSRF-токеном.

```php
use Bitrix\Main\Engine\ActionFilter\HttpMethod;

final class Entity extends \Bitrix\Main\Engine\Controller
{
    #[\Bitrix\Main\Engine\ActionFilter\Attribute\Rule\HttpMethod([
        HttpMethod::METHOD_POST,
    ])]
    public function saveAction()
    {
        // ...
    }
}
```

### Фильтр аутентификации

`\Bitrix\Main\Engine\ActionFilter\Authentication`

Проверяет, что пользователь вошел на сайт, и блокирует действие для гостя. Используйте фильтр для действий с данными текущего пользователя, например в личном кабинете или настройках профиля. Права на конкретные данные фильтр не проверяет, проверяйте их в действии.

Аргументы:

-  `$enableRedirect` — включает редирект гостя на страницу входа `SITE_DIR . 'auth/?backurl=<текущий URL>'`. По умолчанию — `false`.

Без редиректа фильтр устанавливает HTTP-статус 401 и добавляет ошибку с кодом `invalid_authentication`. Текст ошибки фильтр берет из языкового файла, в русской локализации это «Необходимо авторизоваться на сайте».

С включенным редиректом фильтр перенаправляет гостя, только если в запросе нет заголовка `BX-Ajax`. Метод `BX.ajax.runAction()` добавляет этот заголовок в запросы к своему домену, поэтому для таких вызовов фильтр возвращает ошибку и статус 401.

Фильтр работает во всех областях — `SCOPE_AJAX`, `SCOPE_REST` и `SCOPE_CLI`.

**Пример.** Атрибут `Prefilters` задает действию `index` собственный набор из фильтра `Authentication` с редиректом. Фильтры `HttpMethod` и `Csrf` из набора по умолчанию к действию не применяются.

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Prefilters;
use Bitrix\Main\Engine\ActionFilter\Authentication;

final class Entity extends \Bitrix\Main\Engine\Controller
{
    #[Prefilters([
        new Authentication(true),
    ])]
    public function indexAction()
    {
        // ...
    }
}
```

**Пример.** Атрибут `Rule\Authentication` добавляет фильтр с редиректом к набору по умолчанию:

```php
final class Entity extends \Bitrix\Main\Engine\Controller
{
    #[\Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Authentication(true)]
    public function indexAction()
    {
        // ...
    }
}
```

#### Перенаправить гостя на другую страницу

Стандартный фильтр `Authentication` возвращает HTTP-статус 401 или перенаправляет гостя на страницу `SITE_DIR . 'auth/?backurl=<текущий URL>'`. Указать другой URL в фильтре нельзя.

Для перенаправления на произвольную страницу создайте собственный префильтр. В методе `onBeforeAction()` проверьте авторизацию и вызовите `LocalRedirect()` с нужным URL.

```php
use Bitrix\Main\Application;
use Bitrix\Main\Engine\ActionFilter\Base;
use Bitrix\Main\Event;

final class RedirectGuestToLogin extends Base
{
    public function onBeforeAction(Event $event)
    {
        $isAuthorized = $this->getAction()->getController()->getCurrentUser()?->getId() > 0;
        if ($isAuthorized)
        {
            return;
        }

        $requestUri = Application::getInstance()
            ->getContext()
            ->getRequest()
            ->getRequestUri()
        ;

        \LocalRedirect('/login/?backurl=' . urlencode($requestUri));
    }
}
```

Подключите префильтр к действию:

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Prefilters;

final class Entity extends \Bitrix\Main\Engine\Controller
{
    #[Prefilters([
        new RedirectGuestToLogin(),
    ])]
    public function indexAction()
    {
        // ...
    }
}
```

Добавьте фильтр в `getDefaultPreFilters()`, если перенаправление требуется для всех действий контроллера.

### Фильтр CSRF-защиты

[`\Bitrix\Main\Engine\ActionFilter\Csrf`](../api-reference/main/engine/action-filter/csrf/index.md)

Проверяет CSRF-токен запроса и блокирует действие, если токен не совпал с токеном сессии. Фильтр вызывает функцию `check_bitrix_sessid()`, которая ищет токен в параметре запроса `$tokenName` и в заголовке `X-Bitrix-Csrf-Token`.

Фильтр работает только в области `Controller::SCOPE_AJAX`. В этой области работает контроллер, вызванный через `BX.ajax.runAction()` или через [HTTP-маршрут](./routing.md). В областях `SCOPE_REST` и `SCOPE_CLI` контроллер фильтр не подключает.

Переход по обычной ссылке на страницу контроллера тоже выполняется в области `SCOPE_AJAX`. В таком GET-запросе нет токена, поэтому `Csrf` из набора по умолчанию блокирует публичную страницу. Для действия, которое только показывает данные, удалите `Csrf` из набора, как в статье [«Роутинг»](./routing.md#migrate-page-to-controller). Для действий, которые меняют данные, `Csrf` не отключайте.

Для AJAX-действий, которые меняют данные, сочетайте `Csrf` с `Authentication` и `HttpMethod`, разрешающим только `POST`. Метод `BX.ajax.runAction()` добавляет токен в заголовок `X-Bitrix-Csrf-Token` каждого запроса. Пример настройки приведен в статье [«CSRF и SSRF»](../security/csrf-ssrf.md#controller-actions).

Аргументы:

-  `$enabled` — включает проверку токена. По умолчанию — `true`. Со значением `false` фильтр пропускает любой запрос.

-  `$tokenName` — имя параметра запроса с токеном. По умолчанию — `'sessid'`. Заголовок `X-Bitrix-Csrf-Token` фильтр проверяет при любом значении аргумента.

-  `$returnNew` — передает в ответе актуальный токен сессии, если проверка не пройдена. По умолчанию — `true`.

При блокировке фильтр добавляет ошибку с кодом `invalid_csrf` и сообщением `Invalid csrf token`. Если `$returnNew` равен `true`, фильтр передает актуальный токен в поле `customData.csrf` ошибки и в заголовке ответа `X-Bitrix-New-Csrf`. Если `$returnNew` равен `false`, поле `customData` ошибки — пустой массив. Метод `BX.ajax.runAction()` по такой ошибке обновляет токен и повторяет запрос один раз.

**Пример.** Ответ при неверном токене и `$returnNew = true`:

```json
{
    "status": "error",
    "data": null,
    "errors": [
        {
            "message": "Invalid csrf token",
            "code": "invalid_csrf",
            "customData": {
                "csrf": "<актуальный токен сессии>"
            }
        }
    ]
}
```

**Пример.** Атрибут `Prefilters` задает действию `index` набор из одного фильтра `Csrf`, который не передает токен в ответе при ошибке. Фильтры `Authentication` и `HttpMethod` из набора по умолчанию к действию не применяются, поэтому действие доступно гостям.

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Prefilters;
use Bitrix\Main\Engine\ActionFilter\Csrf;

final class Entity extends \Bitrix\Main\Engine\Controller
{
    #[Prefilters([
        new Csrf(
            tokenName: 'sessid',
            returnNew: false,
        ),
    ])]
    public function indexAction()
    {
        // ...
    }
}
```

**Пример.** Атрибут `Rule\Csrf` с аргументом `type: FilterType::DisablePrefilter` удаляет `Csrf` из набора по умолчанию. Действие `view` только показывает данные и открывается по обычной ссылке. Фильтр `Authentication` остается, поэтому действие доступно только авторизованному пользователю.

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Csrf;
use Bitrix\Main\Engine\ActionFilter\FilterType;

final class Entity extends \Bitrix\Main\Engine\Controller
{
    #[Csrf(type: FilterType::DisablePrefilter)]
    public function viewAction()
    {
        // ...
    }
}
```

### Фильтр закрытия сессии

`\Bitrix\Main\Engine\ActionFilter\CloseSession`

Закрывает [сессию](./sessions.md) функцией `session_write_close()` перед выполнением действия. Используйте фильтр для действий, которые не записывают данные в сессию. Изменения сессии, которые действие сделает после закрытия, не сохранятся. Действие фильтр не блокирует.

Аргументы:

-  `$enabled` — включает фильтр. По умолчанию — `true`. Со значением `false` фильтр сессию не закрывает.

**Пример.** Атрибут `Prefilters` задает действию `index` набор из одного фильтра `CloseSession`. Набор по умолчанию к действию не применяется, поэтому действие доступно гостям без CSRF-токена.

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Prefilters;
use Bitrix\Main\Engine\ActionFilter\CloseSession;

final class Entity extends \Bitrix\Main\Engine\Controller
{
    #[Prefilters([
        new CloseSession(),
    ])]
    public function indexAction()
    {
        // ...
    }
}
```

**Пример.** Атрибут `Rule\CloseSession` добавляет фильтр к набору по умолчанию:

```php
final class Entity extends \Bitrix\Main\Engine\Controller
{
    #[\Bitrix\Main\Engine\ActionFilter\Attribute\Rule\CloseSession]
    public function indexAction()
    {
        // ...
    }
}
```

### Фильтр области вызова

`\Bitrix\Main\Engine\ActionFilter\Scope`

Пропускает действие, только если область вызова контроллера входит в переданный набор. Используйте фильтр, чтобы действие было доступно, например, только через REST или только через AJAX.

Аргументы:

-  `$scopes` — битовая маска допустимых областей, обязательный аргумент. Константы объединяйте оператором `|`.

Значения задают константы класса `Scope`:

-  `Scope::AJAX` — область `Controller::SCOPE_AJAX`, вызовы через `BX.ajax.runAction()` и HTTP-маршруты,

-  `Scope::REST` — область `Controller::SCOPE_REST`, вызовы через REST,

-  `Scope::CLI` — область `Controller::SCOPE_CLI`,

-  `Scope::ALL` — все три области,

-  `Scope::NOT_AJAX`, `Scope::NOT_REST`, `Scope::NOT_CLI` — все области, кроме названной в имени константы.

Фильтр работает во всех областях. При блокировке он добавляет ошибку с сообщением `Requested scope is invalid` и кодом `0`.

**Пример.** Атрибут `Prefilters` задает действию `index` набор из одного фильтра `Scope`. Действие доступно через AJAX и REST и недоступно в области `SCOPE_CLI`. Набор по умолчанию к действию не применяется, поэтому вход пользователя, HTTP-метод и CSRF-токен фильтры не проверяют.

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Prefilters;
use Bitrix\Main\Engine\ActionFilter\Scope;

final class Entity extends \Bitrix\Main\Engine\Controller
{
    #[Prefilters([
        new Scope(
            Scope::AJAX | Scope::REST
        ),
    ])]
    public function indexAction()
    {
        // ...
    }
}
```

**Пример.** Атрибут `Rule\Scope` добавляет фильтр с той же маской к набору по умолчанию:

```php
use Bitrix\Main\Engine\ActionFilter\Scope;

final class Entity extends \Bitrix\Main\Engine\Controller
{
    #[\Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Scope(
        Scope::AJAX | Scope::REST
    )]
    public function indexAction()
    {
        // ...
    }
}
```

### Фильтр CORS-настроек

`\Bitrix\Main\Engine\ActionFilter\Cors`

Добавляет в ответ заголовки CORS, чтобы действие можно было вызывать со страниц другого домена. Действие фильтр не блокирует.

Аргументы:

-  `$origin` — значение заголовка `Access-Control-Allow-Origin`, например `'*'` или `'https://example.com'`. По умолчанию — `null`, и фильтр берет значение из заголовка запроса `Origin`.

-  `$credentials` — при значении `true` добавляет заголовок `Access-Control-Allow-Credentials` со значением `true`. По умолчанию — `false`.

Методы `setAllowedMethods()` и `setAllowedHeaders()` принимают массивы и задают заголовки `Access-Control-Allow-Methods` и `Access-Control-Allow-Headers`. Фильтр не перезаписывает заголовок, который уже есть в ответе. Если `$origin` не задан и в запросе нет заголовка `Origin`, фильтр заголовки не добавляет.

Фильтр устанавливает заголовки и в `onBeforeAction()`, и в `onAfterAction()`, поэтому работает и префильтром, и постфильтром во всех областях.

**Пример.** Атрибут `Postfilters` подключает `Cors` постфильтром действия `index`:

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Postfilters;
use Bitrix\Main\Engine\ActionFilter\Cors;

final class Entity extends \Bitrix\Main\Engine\Controller
{
    #[Postfilters([
        new Cors()
    ])]
    public function indexAction()
    {
        // ...
    }
}
```

**Пример.** Атрибут `Rule\Cors` добавляет `Cors` к префильтрам действия. Передайте в атрибут аргумент `credentials`. Без него атрибут передает в конструктор фильтра `null`, и PHP выбрасывает `TypeError`.

```php
final class Entity extends \Bitrix\Main\Engine\Controller
{
    #[\Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Cors(credentials: false)]
    public function indexAction()
    {
        // ...
    }
}
```

### Фильтр типа контента

`\Bitrix\Main\Engine\ActionFilter\ContentType`

Пропускает действие, только если тип содержимого из заголовка запроса `Content-Type` входит в список допустимых. Фильтр сравнивает тип без параметров и в нижнем регистре, поэтому `application/json; charset=utf-8` проходит проверку как `application/json`.

Аргументы:

-  `$allowedTypes` — массив допустимых типов в нижнем регистре. По умолчанию — пустой массив, и с ним фильтр блокирует любой запрос. Для JSON используйте константу `ContentType::JSON` со значением `'application/json'`.

Если тип запроса — `application/json`, фильтр добавляет поля верхнего уровня JSON-объекта к параметрам действия. Аргументы метода действия получают значения из тела запроса.

Фильтр работает во всех областях. При блокировке он добавляет ошибку с кодом `invalid_content_type`. Атрибут `Rule\ContentType` добавляет фильтр к префильтрам действия.

**Пример.** Атрибут `Prefilters` задает действию `index` набор из одного фильтра `ContentType`, и действие принимает только запросы с JSON-телом. Набор по умолчанию к действию не применяется, поэтому вход пользователя, HTTP-метод и CSRF-токен фильтры не проверяют.

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Prefilters;
use Bitrix\Main\Engine\ActionFilter\ContentType;

final class Entity extends \Bitrix\Main\Engine\Controller
{
    #[Prefilters([
        new ContentType([
            ContentType::JSON,
        ])
    ])]
    public function indexAction()
    {
        // ...
    }
}
```

### Фильтр кеширования ответа {#cache-response}

`\Bitrix\Main\Engine\ActionFilter\CacheResponse`

Сохраняет результат действия в кеш и при повторном запросе отдает его без запуска действия. Фильтр работает в двух фазах, поэтому подключайте его одновременно префильтром и постфильтром — ключом `+filters` или атрибутом `Rule\EnableFilter`, подробнее в разделе [«Дополняющие и вычитающие фильтры»](#filter-modifiers).

-  Как префильтр — проверяет кеш. Если запись найдена, фильтр [пропускает действие](#filter-types) без ошибки.

-  Как постфильтр — подставляет результат из кеша вместо `null` или сохраняет новый результат действия в кеш.

Аргументы:

-  `$ttl` — время жизни записи в секундах. По умолчанию 3600. Значение должно быть больше нуля, иначе конструктор выбрасывает `\Bitrix\Main\Engine\Exception\ActionConfigurationException` с сообщением `CacheResponse TTL must be positive`.

-  `$cacheKeyRequestFields` — массив имен параметров запроса, от которых зависит результат. Фильтр получает значения через `Request::get()`: из GET- и POST-параметров, при совпадении имен — из POST. Поля JSON-тела в этот список не попадают. По умолчанию — пустой массив.

-  `$cacheKeyContextFields` — массив значений перечисления `\Bitrix\Main\Engine\ActionFilter\CacheResponse\ContextField`, которые добавляют в ключ кеша данные окружения. По умолчанию — пустой массив. Значения перечисления:

   -  `ContextField::User` — идентификатор текущего пользователя,

   -  `ContextField::Ip` — IP-адрес клиента,

   -  `ContextField::Site` — идентификатор текущего сайта,

   -  `ContextField::Language` — идентификатор текущего языка,

   -  `ContextField::Host` — имя хоста из запроса.

-  `$cacheKeyAdditionalDataCallback` — функция, которая получает объект действия `\Bitrix\Main\Engine\Action` и возвращает массив дополнительных данных для ключа. Если функция возвращает не массив, фильтр выбрасывает `ActionConfigurationException`. По умолчанию — `null`.

-  `$cachedResponseHeaders` — массив заголовков ответа, которые фильтр сохраняет вместе с телом. По умолчанию — `['Content-Type']`. Пустой массив исключает все заголовки.

Без `$cacheKeyRequestFields` и `$cacheKeyContextFields` все пользователи получают одну запись кеша на действие. Если результат зависит от пользователя, сайта или параметра запроса, добавьте их в ключ.

Фильтр не сохраняет в кеш:

-  результат действия, которое заблокировал префильтр,

-  результат с ошибками действия или контроллера,

-  ответ-перенаправление со статусом 3xx,

-  файлы и архивы — ответы `\Bitrix\Main\Engine\Response\File` и `\Bitrix\Main\Engine\Response\Zip\Archive`.

Значение `null` и пустой результат фильтр кеширует так же, как остальные.

{% note warning "" %}

При попадании в кеш действие не выполняется. Проверку доступа к данным выполняйте в префильтрах, которые стоят в наборе раньше `CacheResponse`, а не внутри метода действия.

{% endnote %}

Чтобы закешировать итоговый результат, ставьте `CacheResponse` последним в списке постфильтров. Постфильтры, которые выполняются до него, при попадании в кеш получают результат `null`.

**Пример.** Действие `list` кеширует ответ на час с фильтрами по умолчанию. Действие `details` хранит отдельную запись для каждого пользователя и значения параметра `code` в течение 10 минут:

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\EnableFilter;
use Bitrix\Main\Engine\ActionFilter\CacheResponse;
use Bitrix\Main\Engine\ActionFilter\CacheResponse\ContextField;

final class Entity extends \Bitrix\Main\Engine\Controller
{
    #[EnableFilter([
        new CacheResponse(),
    ])]
    public function listAction(): array
    {
        return [
            'items' => [],
        ];
    }

    #[EnableFilter([
        new CacheResponse(
            ttl: 600,
            cacheKeyRequestFields: ['code'],
            cacheKeyContextFields: [ContextField::User],
        ),
    ])]
    public function detailsAction(string $code): array
    {
        return [
            'code' => $code,
        ];
    }
}
```

Записи кеша фильтр хранит отдельно для каждого класса контроллера. Чтобы удалить все записи контроллера после изменения данных, вызовите статический метод `CacheResponse::cleanCacheController()` и передайте в него имя класса контроллера.

**Пример.** Сброс кеша ответов контроллера `Entity`:

```php
\Bitrix\Main\Engine\ActionFilter\CacheResponse::cleanCacheController(Entity::class);
```

## Как использовать фильтры в контроллерах

Фильтры действия задают двумя способами — ключами в методе `configureActions()` или атрибутами метода действия. Для одного действия используйте один способ. Если действие настроено и в `configureActions()`, и атрибутами, конструктор контроллера выбрасывает `\Bitrix\Main\Engine\Exception\ActionConfigurationException` с сообщением `Invalid configuration of actions. Configuration is multiple`.

**Пример.** Метод `configureActions()` задает действию `index` префильтр `Authentication` и постфильтр `Cors`:

```php
use Bitrix\Main\Engine\ActionFilter\Authentication;
use Bitrix\Main\Engine\ActionFilter\Cors;

final class Entity extends \Bitrix\Main\Engine\Controller
{
    public function configureActions()
    {
        return [
            'index' => [
                'prefilters' => [
                    new Authentication(),
                ],
                'postfilters' => [
                    new Cors(),
                ],
            ],
        ];
    }

    public function indexAction()
    {
        // ...
    }
}
```

**Пример.** Тот же набор фильтров атрибутами `Prefilters` и `Postfilters`:

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Postfilters;
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Prefilters;
use Bitrix\Main\Engine\ActionFilter\Authentication;
use Bitrix\Main\Engine\ActionFilter\Cors;

final class Entity extends \Bitrix\Main\Engine\Controller
{
    #[Prefilters([
        new Authentication(),
    ])]
    #[Postfilters([
        new Cors(),
    ])]
    public function indexAction()
    {
        // ...
    }
}
```

### Атрибуты фильтров {#filter-attributes}

Атрибуты делятся на три группы:

-  `Prefilters` и `Postfilters` задают собственный набор фильтров действия вместо набора по умолчанию, как ключи `prefilters` и `postfilters`. Атрибут `Filter` задает один общий набор для префильтров и постфильтров, как ключ [`filters`](#common-filters),

-  `EnablePrefilters`, `DisablePrefilters`, `EnablePostfilters` и `DisablePostfilters` дополняют и сокращают набор, как ключи `+prefilters`, `-prefilters`, `+postfilters` и `-postfilters`. Атрибуты `EnableFilter` и `DisableFilter` меняют сразу оба набора, как ключи `+filters` и `-filters`. Подробнее в разделе [«Дополняющие и вычитающие фильтры»](#filter-modifiers),

-  атрибуты отдельных фильтров из пространства имен `\Bitrix\Main\Engine\ActionFilter\Attribute\Rule` — `Authentication`, `HttpMethod`, `Csrf`, `CloseSession`, `Scope`, `Cors` и `ContentType` — добавляют фильтр к префильтрам действия, как ключ `+prefilters`. С аргументом `type: FilterType::DisablePrefilter` такой атрибут удаляет фильтр этого класса, как ключ `-prefilters`.

### Фильтры по умолчанию {#default-filters}

Если для действия не задан собственный набор префильтров, контроллер берет его из метода `getDefaultPreFilters()`. В базовом классе `Controller` этот набор включает:

-  `Authentication` — требует входа пользователя, работает во всех областях,

-  `HttpMethod` — разрешает `GET` и `POST`, работает в областях `SCOPE_AJAX` и `SCOPE_REST`,

-  [`Csrf`](../api-reference/main/engine/action-filter/csrf/index.md) — проверяет CSRF-токен, работает только в области `SCOPE_AJAX`.

Набор действует и для вызовов через `BX.ajax.runAction()`, и для HTTP-маршрутов, потому что в обоих случаях контроллер работает в области `SCOPE_AJAX`. Без изменения набора публичная страница на контроллере доступна только авторизованному пользователю и только с CSRF-токеном в запросе. Метод `getDefaultPostFilters()` в базовом классе возвращает пустой массив, постфильтров по умолчанию нет.

Повторно подключать эти фильтры к действию не нужно. Фильтр `Authentication` проверяет только вход пользователя, права на конкретные данные проверяйте в действии.

Ключ `prefilters` в `configureActions()` и атрибут `Prefilters` задают собственный набор префильтров действия вместо набора по умолчанию. При такой настройке перечислите в наборе все необходимые проверки. Чтобы дополнить или сократить существующий набор, используйте [дополняющие и вычитающие фильтры](#filter-modifiers).

Если в собственном наборе есть `HttpMethod` с методом `POST`, но нет `Csrf`, контроллер добавляет `Csrf` в набор для POST-запросов. Ключ `-prefilters` контроллер применяет после этого шага, поэтому `Csrf::class` в `-prefilters` удаляет и добавленный фильтр.

Чтобы изменить набор по умолчанию для всего контроллера, переопределите метод `getDefaultPreFilters()`. Метод `getDefaultPostFilters()` задает постфильтры по умолчанию.

**Пример.** Все действия контроллера используют префильтр `Authentication` и постфильтр `Cors`:

```php
use Bitrix\Main\Engine\ActionFilter\Authentication;
use Bitrix\Main\Engine\ActionFilter\Cors;

final class Entity extends \Bitrix\Main\Engine\Controller
{
    protected function getDefaultPreFilters()
    {
        return [
            new Authentication(),
        ];
    }

    protected function getDefaultPostFilters()
    {
        return [
            new Cors(),
        ];
    }

    public function indexAction()
    {
        // ...
    }

    public function getAction()
    {
        // ...
    }
}
```

**Пример.** Метод `getDefaultPreFilters()` возвращает пустой массив, и действия контроллера выполняются без префильтров по умолчанию. При POST-запросе к действию без собственного набора контроллер `Csrf` не добавляет, потому что в наборе нет `HttpMethod`.

```php
final class Entity extends \Bitrix\Main\Engine\Controller
{
    protected function getDefaultPreFilters()
    {
        return [];
    }
}
```

### Общий набор префильтров и постфильтров {#common-filters}

Ключ `filters` в `configureActions()` и атрибут `Rule\Filter` задают один список фильтров, который контроллер использует и как префильтры, и как постфильтры. Такой ключ подходит для фильтров, которые работают в обеих фазах, например `Cors` или [`CacheResponse`](#cache-response).

Ключ `filters` заменяет оба набора по умолчанию. Если передать в него только `Cors`, действие выполнится без `Authentication`, `HttpMethod` и `Csrf`. Чтобы добавить фильтр и сохранить проверки по умолчанию, используйте ключ [`+filters`](#filter-modifiers).

Ключ `filters` нельзя совмещать с ключами `prefilters` и `postfilters` в настройке одного действия. При такой настройке конструктор контроллера выбрасывает `\Bitrix\Main\Engine\Exception\ActionConfigurationException` с сообщением `filters cannot be combined with prefilters or postfilters`. Правило действует и для атрибутов `Filter`, `Prefilters` и `Postfilters`.

**Пример.** Действие `index` выполняется только с фильтром `Cors` в обеих фазах. Вход пользователя, HTTP-метод и CSRF-токен фильтры не проверяют:

```php
use Bitrix\Main\Engine\ActionFilter\Cors;

final class Entity extends \Bitrix\Main\Engine\Controller
{
    public function configureActions()
    {
        return [
            'index' => [
                'filters' => [
                    new Cors(),
                ],
            ],
        ];
    }

    public function indexAction()
    {
        // ...
    }
}
```

### Дополняющие и вычитающие фильтры {#filter-modifiers}

Ключи `+prefilters` и `-prefilters` в `configureActions()` дополняют и сокращают набор действия, не заменяя его целиком. Контроллер сначала удаляет фильтры из `-prefilters`, затем добавляет фильтры из `+prefilters`. Ключ `-prefilters` удаляет все фильтры набора, которые являются объектами указанного класса или его наследников.

**Пример.** Действие `index` получает набор по умолчанию без `Authentication` и с фильтром `CloseSession`:

```php
use Bitrix\Main\Engine\ActionFilter\Authentication;
use Bitrix\Main\Engine\ActionFilter\CloseSession;
use Bitrix\Main\Engine\ActionFilter\Csrf;

final class Entity extends \Bitrix\Main\Engine\Controller
{
    protected function getDefaultPreFilters()
    {
        return [
            new Authentication(),
            new Csrf(),
        ];
    }

    public function configureActions()
    {
        return [
            // Итого для действия `index` будут применены фильтры: CloseSession и Csrf
            'index' => [
                '+prefilters' => [
                    new CloseSession()
                ],
                '-prefilters' => [
                    Authentication::class,
                ],
            ],
        ];
    }

    public function indexAction()
    {
        // ...
    }
}
```

**Пример.** Тот же результат атрибутами `EnablePrefilters` и `DisablePrefilters`:

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\DisablePrefilters;
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\EnablePrefilters;
use Bitrix\Main\Engine\ActionFilter\Authentication;
use Bitrix\Main\Engine\ActionFilter\CloseSession;
use Bitrix\Main\Engine\ActionFilter\Csrf;

final class Entity extends \Bitrix\Main\Engine\Controller
{
    protected function getDefaultPreFilters()
    {
        return [
            new Authentication(),
            new Csrf(),
        ];
    }

    #[EnablePrefilters([
        new CloseSession(),
    ])]
    #[DisablePrefilters([
        Authentication::class,
    ])]
    public function indexAction()
    {
        // ...
    }
}
```

**Пример.** Ключи `+postfilters` и `-postfilters` и атрибуты `EnablePostfilters` и `DisablePostfilters` меняют набор постфильтров так же. Действие `index` настроено ключами, действие `get` — атрибутами. Класс `AnotherPostFilter` в примере — собственный постфильтр, наследник `Base`.

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\DisablePostfilters;
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\EnablePostfilters;
use Bitrix\Main\Engine\ActionFilter\Cors;

final class Entity extends \Bitrix\Main\Engine\Controller
{
    protected function getDefaultPostFilters()
    {
        return [
            new Cors(),
        ];
    }

    public function configureActions()
    {
        return [
            // Итого для действия `index` будет применен только фильтр AnotherPostFilter
            'index' => [
                '+postfilters' => [
                    new AnotherPostFilter(),
                ],
                '-postfilters' => [
                    Cors::class,
                ],
            ],
        ];
    }

    public function indexAction()
    {
        // ...
    }

    #[EnablePostfilters([
        new AnotherPostFilter(),
    ])]
    #[DisablePostfilters([
        Cors::class,
    ])]
    public function getAction()
    {
        // ...
    }
}
```

Ключи `+filters` и `-filters` и атрибуты `EnableFilter` и `DisableFilter` меняют сразу оба набора — префильтры и постфильтры. Ключ `+filters` добавляет фильтр в конец обоих наборов, ключ `-filters` удаляет фильтры указанного класса из обоих наборов. Используйте их для фильтров, которые работают в обеих фазах, например [`CacheResponse`](#cache-response).

Контроллер применяет ключи в таком порядке:

1. Удаляет фильтры из `-filters`.

2. Удаляет фильтры из `-prefilters` и `-postfilters`.

3. Добавляет фильтры из `+prefilters` и `+postfilters`.

4. Добавляет фильтры из `+filters`.

**Пример.** Действие `index` получает набор по умолчанию без `Csrf`. Фильтр `CloseSession` добавлен в оба набора и выполняется до и после действия:

```php
use Bitrix\Main\Engine\ActionFilter\CloseSession;
use Bitrix\Main\Engine\ActionFilter\Csrf;

final class Entity extends \Bitrix\Main\Engine\Controller
{
    public function configureActions()
    {
        return [
            // Итого префильтры Authentication, HttpMethod и CloseSession, постфильтр CloseSession
            'index' => [
                '+filters' => [
                    new CloseSession(),
                ],
                '-filters' => [
                    Csrf::class,
                ],
            ],
        ];
    }

    public function indexAction()
    {
        // ...
    }
}
```

**Пример.** Тот же результат атрибутами `EnableFilter` и `DisableFilter`:

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\DisableFilter;
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\EnableFilter;
use Bitrix\Main\Engine\ActionFilter\CloseSession;
use Bitrix\Main\Engine\ActionFilter\Csrf;

final class Entity extends \Bitrix\Main\Engine\Controller
{
    #[EnableFilter([
        new CloseSession(),
    ])]
    #[DisableFilter([
        Csrf::class,
    ])]
    public function indexAction()
    {
        // ...
    }
}
```

{% note warning "" %}

В ключи `+filters`, `+prefilters` и `+postfilters` и атрибуты `EnableFilter`, `EnablePrefilters` и `EnablePostfilters` передавайте объекты фильтров. В ключи `-filters`, `-prefilters` и `-postfilters` и атрибуты `DisableFilter`, `DisablePrefilters` и `DisablePostfilters` передавайте имена классов, например `Authentication::class`.

{% endnote %}

### Заблокировать действие собственным префильтром {#custom-prefilter}

Создайте класс-наследник `Base` и переопределите метод `onBeforeAction()`. Чтобы пропустить запрос, верните `null`. Чтобы заблокировать действие, добавьте ошибку методом `addError()` и верните `EventResult` с типом `EventResult::ERROR` и фильтром в аргументе `handler`.

Ошибки фильтра контроллер берет из объекта в аргументе `handler`. Без него действие не выполнится, но клиент получит ответ со статусом `success`, `data` со значением `null` и пустым массивом `errors`.

**Пример.** Префильтр пропускает действие, только если параметр запроса `type` входит в список типов документов:

```php
use Bitrix\Main\Engine\ActionFilter\Base;
use Bitrix\Main\Error;
use Bitrix\Main\Event;
use Bitrix\Main\EventResult;

final class AllowedDocumentType extends Base
{
    public const ERROR_INVALID_TYPE = 'invalid_document_type';

    public function __construct(private readonly array $allowedTypes)
    {
        parent::__construct();
    }

    public function onBeforeAction(Event $event)
    {
        $type = $this->getAction()->getController()->getRequest()->get('type');
        if (in_array($type, $this->allowedTypes, true))
        {
            return null;
        }

        $this->addError(new Error('Document type is not allowed', self::ERROR_INVALID_TYPE));

        return new EventResult(EventResult::ERROR, handler: $this);
    }
}
```

**Пример.** Атрибут `EnablePrefilters` добавляет префильтр к набору по умолчанию, поэтому проверки входа, HTTP-метода и CSRF-токена сохраняются:

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\EnablePrefilters;

final class Entity extends \Bitrix\Main\Engine\Controller
{
    #[EnablePrefilters([
        new AllowedDocumentType(['contract', 'invoice']),
    ])]
    public function indexAction()
    {
        // ...
    }
}
```

При запросе с `type=report` действие не выполняется. Клиент получает ошибку с кодом `invalid_document_type` в формате из раздела [«Ответ при блокировке»](#blocked-response).

### Подменить ответ через фильтр

Постфильтр получает результат действия в параметре события `result` и заменяет его вызовом `$event->setParameter('result', ...)`. Объект [`\Bitrix\Main\HttpResponse`](../api-reference/main/http-response/index.md) приложение отдает клиенту как есть. Другое значение приложение оборачивает в стандартный JSON-ответ.

Постфильтры выполняются и после блокировки действия префильтром. В этом случае параметр `result` равен `null`, а ошибки префильтров возвращает метод контроллера `getErrors()`.

**Пример.** Постфильтр заменяет JSON с ошибками текстовым ответом с сообщением первой ошибки:

```php
use Bitrix\Main\Engine\ActionFilter\Base;
use Bitrix\Main\Event;
use Bitrix\Main\HttpResponse;

final class PlainTextErrors extends Base
{
    public function onAfterAction(Event $event)
    {
        $errors = $this->getAction()->getController()->getErrors();
        if (empty($errors))
        {
            return;
        }

        $response = new HttpResponse();
        $response->addHeader('Content-Type', 'text/plain; charset=UTF-8');
        $response->setContent($errors[0]->getMessage());

        $event->setParameter('result', $response);
    }
}
```

**Пример.** Атрибут `Postfilters` подключает постфильтр к действию `index`:

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Postfilters;

final class Entity extends \Bitrix\Main\Engine\Controller
{
    #[Postfilters([
        new PlainTextErrors(),
    ])]
    public function indexAction()
    {
        // ...
    }
}
```

HTTP-статус, который установил префильтр, сохраняется и в подмененном ответе. Например, гость получит текст ошибки фильтра `Authentication` со статусом 401.

Контроллер вызывает префильтры и постфильтры в методе [`\Bitrix\Main\Engine\Controller::run()`](../api-reference/main/engine/controller/run.md).
