---
title: Cookie-файлы
description: 'Cookie-файлы. Документация по Bitrix Framework: принципы работы, архитектура и примеры использования.'
---

Для работы с файлами cookie предназначен класс `Bitrix\Main\Web\Cookie`. Он позволяет создавать cookie с такими параметрами, как имя, значение, срок действия и путь.

## Как установить cookie

Чтобы задать cookie, используйте класс `Bitrix\Main\HttpResponse`.

1. Импортируйте классы `Cookie` и `Context`.

   ```php
   use Bitrix\Main\Context;
   use Bitrix\Main\Web\Cookie;
   ```

2. Создайте объект cookie. Укажите имя, значение и срок действия cookie.

   ```php
   $cookie = new Cookie('example_cookie', 'cookie_value', time() + 3600); // действует 1 час
   ```

3. Настройте параметры cookie. При необходимости задайте домен, путь, флаги безопасности и доступности.

   ```php
   $cookie->setDomain('example.com');
   $cookie->setPath('/');
   $cookie->setSecure(false); // true, если нужно передавать только по HTTPS
   $cookie->setHttpOnly(true); // запретить доступ к cookie из JavaScript
   ```

4. Добавьте cookie в ответ. Используйте объект ответа текущего контекста, чтобы добавить созданный cookie.

   ```php
   $response = Context::getCurrent()->getResponse();
   $response->addCookie($cookie);
   ```

Когда вы добавляете cookie в ответ, они отправляются клиенту и сохраняются у него. Однако сервер сможет прочитать эти файлы cookie только при следующем запросе клиента, так как текущий запрос их еще не получил.

### Значения по умолчанию

Если параметры не заданы явно, `Web\Cookie` использует следующие значения:

| Параметр | Значение по умолчанию |
|---|---|
| Срок действия `$expires` | Текущее время плюс 360 дней, если аргумент конструктора не передан. Для сессионной cookie передайте `0`. |
| Путь | `/`. |
| Домен | Подходящий домен из настроек доменов сайтов. Если совпадения нет, домен не указывается. |
| `HttpOnly` | `true`. |
| `Secure` | `false`. |
| `SameSite` | Не задан. |

Значения `Secure`, `HttpOnly` и `SameSite` можно задать через секцию `cookies` в `/bitrix/.settings.php`: ключи `secure`, `http_only` и `samesite`. Явный вызов `setSecure()`, `setHttpOnly()` или `setSameSite()` меняет соответствующее значение для объекта cookie.

{% note info "" %}

Если включена опция главного модуля `ask_to_store_cookies`, при добавлении постоянной cookie через `HttpResponse::addCookie()` ядро проверяет согласие посетителя. Пока согласие не получено, срок действия становится `0`: браузеру отправляется сессионная cookie. Проверка включена по умолчанию третьим аргументом метода `$checkExpires`.

{% endnote %}

## Как получить cookie

Чтобы получить cookie, используйте класс `Bitrix\Main\HttpRequest`.

1. Получите объект запроса. Используйте текущий контекст для доступа к запросу.

   ```php
   use Bitrix\Main\Context;

   $request = Context::getCurrent()->getRequest();
   ```

2. Извлеките значение cookie. Используйте метод `getCookie` объекта запроса, указав имя cookie.

   ```php
   $cookieValue = $request->getCookie('example_cookie');

   // Проверка наличия и вывод значения
   if ($cookieValue !== null)
   {
       echo 'Значение cookie: ' . $cookieValue;
   }
   else
   {
       echo 'Cookie не найдено.';
   }
   ```

### Префикс имени

По умолчанию `Web\Cookie` добавляет к имени префикс `BITRIX_SM_`: cookie с именем `example_cookie` сохраняется в браузере как `BITRIX_SM_example_cookie`. Значение `BITRIX_SM` задается опцией главного модуля `cookie_name` и может отличаться на конкретном сайте. Если имя уже начинается с нужного префикса, повторно он не добавляется. Четвертый аргумент конструктора `$addPrefix = false` отключает добавление префикса.

Метод `setName()` заменяет имя cookie без автоматического добавления префикса. Если передать ему имя `session_id`, метод `getCookie('session_id')` не найдет такую cookie в следующем запросе. Для cookie без префикса используйте `getCookieRaw('session_id')`.

`HttpRequest::getCookie('example_cookie')` получает только cookie с префиксом и принимает имя без него. Чтобы получить cookie без префикса или прочитать исходное значение по полному имени из запроса, используйте `getCookieRaw()`. В отличие от `getCookie()`, этот метод не расшифровывает защищенные cookie.

```php
$request->getCookieRaw('example_cookie'); // cookie без префикса
$request->getCookieRaw('BITRIX_SM_example_cookie'); // полное имя при стандартном префиксе
```

## Методы для работы с cookie

В примерах ниже `$cookie` — объект `Bitrix\Main\Web\Cookie`, созданный в разделе [Как установить cookie](#как-установить-cookie). Методы `set*()` меняют параметры этого объекта, а соответствующие `get*()` возвращают их текущие значения. После настройки добавьте cookie в ответ через `addCookie()`.

### Домен

`setDomain()` принимает имя домена без порта. `getDomain()` возвращает установленный домен или домен, найденный в настройках сайтов. Если подходящего домена нет, метод возвращает пустую строку.

```php
$cookie->setDomain('example.com');
$cookie->getDomain();
```

### Срок действия

`setExpires()` принимает время истечения в формате Unix timestamp. `getExpires()` возвращает его как целое число. Значение `0` означает сессионную cookie.

```php
$cookie->setExpires(time() + 3600);
$cookie->getExpires();
```

### Доступность из JavaScript

`setHttpOnly()` принимает `true` или `false`, а `getHttpOnly()` возвращает текущее значение флага.

```php
$cookie->setHttpOnly(true);
$cookie->getHttpOnly();
```

При `HttpOnly = true` браузер отправляет cookie в подходящих HTTP- и HTTPS-запросах, но JavaScript не может прочитать ее через `document.cookie`.

### Имя

`setName()` принимает новое имя без автоматического добавления префикса. `getName()` возвращает текущее полное имя cookie. Если имя не меняли через `setName()`, оно содержит префикс, добавленный конструктором.

```php
$cookie->setName('session_id');
$cookie->getName();
```

### Путь

`setPath()` принимает путь, в пределах которого браузер отправляет cookie. `getPath()` возвращает установленный путь. По умолчанию это `/`.

```php
$cookie->setPath('/');
$cookie->getPath();
```

### Передача по HTTPS

`setSecure(true)` разрешает браузеру отправлять cookie только по HTTPS. `getSecure()` возвращает текущее значение флага `true` или `false`.

```php
$cookie->setSecure(true);
$cookie->getSecure();
```

### Значение

`setValue()` принимает строку или `null`. `getValue()` возвращает текущее значение того же типа.

```php
$cookie->setValue('abc123');
$cookie->getValue();
```

### Атрибут SameSite

`setSameSite()` принимает строку или `null` и не проверяет переданное значение. Для стандартных вариантов используйте `Cookie::SAME_SITE_NONE` (`None`), `Cookie::SAME_SITE_LAX` (`Lax`) и `Cookie::SAME_SITE_STRICT` (`Strict`). Значение `null` оставляет атрибут незаданным. `getSameSite()` возвращает текущее значение или `null`. Атрибут определяет, когда браузер отправляет cookie в запросах между сайтами.

```php
$cookie->setSameSite(Cookie::SAME_SITE_LAX);
$cookie->getSameSite();
```

## Работа с cookie через AJAX

Рассмотрим установку cookie через AJAX на учебном контроллере `Iblock` из статьи [Контроллеры](./controllers.md#создать-класс-ajax-контроллера). В примере он находится в файле `/local/modules/my.content/lib/Infrastructure/Controller/Ajax/Iblock.php`. Если есть собственный AJAX-контроллер, добавьте действие в него. Если контроллера нет, сначала создайте его и [настройте AJAX-вызовы](./controllers.md#настроить-ajax-вызовы).

В примере домен не задается явно: `Web\Cookie` использует подходящий домен из настроек сайтов или отправляет cookie без атрибута `Domain`.

Добавьте импорты после строки `namespace` в файле выбранного контроллера. Уже присутствующие импорты не дублируйте:

```php
use Bitrix\Main\Context;
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\DisablePrefilters;
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\HttpMethod;
use Bitrix\Main\Engine\ActionFilter\Authentication as AuthenticationFilter;
use Bitrix\Main\Engine\ActionFilter\HttpMethod as HttpMethodFilter;
use Bitrix\Main\Error;
use Bitrix\Main\Web\Cookie;
```

Добавьте метод внутрь класса выбранного контроллера:

```php
#[DisablePrefilters([AuthenticationFilter::class])]
#[HttpMethod([HttpMethodFilter::METHOD_POST])]
public function setCityCookieAction(): ?array
{
    $request = $this->getRequest();
    $city = $request->getPost('city');
    if (!is_string($city) || trim($city) === '')
    {
        $this->addError(new Error('Укажите город'));

        return null;
    }

    $cookie = new Cookie('filter__city', $city, time() + 60 * 60 * 24 * 30);
    Context::getCurrent()->getResponse()->addCookie($cookie);

    return ['message' => 'Cookie успешно добавлена'];
}
```

Действие доступно гостям и принимает только POST-запросы. Стандартный CSRF-фильтр контроллера проверяет запрос до выполнения действия. Вызовите действие на странице сайта с подключенным JS-ядром Bitrix. Если используете собственный контроллер, замените идентификатор `my:content.Iblock.setCityCookie` на идентификатор своего действия:

```javascript
function setCityCookie(city)
{
    return BX.ajax.runAction('my:content.Iblock.setCityCookie', {
        data: { city }
    });
}

setCityCookie('Granada')
    .then((response) => console.log(response.data.message))
    .catch((error) => console.error(error));
```

## Шифрованные cookie

Шифрованные cookie `\Bitrix\Main\Web\CryptoCookie` позволяют передавать данные пользователю без раскрытия их содержимого и без изменения.

Для шифрования данных ядром необходимо указать `crypto_key` в файле настроек `/bitrix/.settings.php`.

{% note tip "" %}

Подробнее о шифрованных cookie читайте в статье [Защищенные cookie](./../security/secure-cookies).

{% endnote %}
