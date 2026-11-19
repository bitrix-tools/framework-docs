---
title: Csrf — фильтр проверки CSRF-токена
description: Класс Bitrix\Main\Engine\ActionFilter\Csrf проверяет CSRF-токен в AJAX-запросе и не дает выполнить действие контроллера без верного токена.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Engine\ActionFilter`

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

## Когда использовать

Класс `Csrf` — префильтр действия контроллера. Фильтр проверяет CSRF-токен текущей сессии и останавливает действие, если токен не передан или неверный. Класс финальный, наследовать его нельзя.

Контроллер включает `Csrf` в фильтры по умолчанию вместе с `Authentication` и `HttpMethod`. Если `configureActions` задает префильтры с `HttpMethod` для метода `POST`, но без `Csrf`, контроллер сам добавляет `Csrf` для POST-запроса.

Чтобы изменить имя параметра с токеном или отключить проверку, передайте в `configureActions` объект `Csrf` с нужными аргументами конструктора.

Подробнее о фильтре — в разделе «Фильтр CSRF-защиты» статьи [Префильтры и постфильтры](../../../../../framework/pre-post-filters.md).

## Как фильтр проверяет запрос

Фильтр работает, только когда область контроллера `Controller::SCOPE_AJAX`. Эту область контроллер получает в конструкторе, другую задает метод `setScope`. Если область контроллера `SCOPE_REST` или `SCOPE_CLI`, контроллер не подключает фильтр.

Перед действием фильтр вызывает функцию `check_bitrix_sessid`. Фильтр берет токен из параметра запроса с именем из `tokenName` или из заголовка `X-Bitrix-Csrf-Token`.

Если токен неверный, фильтр:

1. Добавляет ошибку `Bitrix\Main\Error` с сообщением `Invalid csrf token` и кодом `invalid_csrf`.
2. Добавляет текущий токен в дополнительные данные ошибки с ключом `csrf` и в заголовок ответа `X-Bitrix-New-Csrf`, если `returnNew` равен `true`.
3. Возвращает `EventResult` с типом `EventResult::ERROR`, и контроллер не выполняет действие.

## Константы

| Константа | Значение | Описание |
| --- | --- | --- |
| `ERROR_INVALID_CSRF` | `invalid_csrf` | Код ошибки неверного токена |
| `HEADER_WITH_NEW_CSRF` | `X-Bitrix-New-Csrf` | Заголовок ответа с текущим токеном |

## Наследование

Класс наследует [Base](../base/index.md).

### Реализация методов базового класса

| Метод | Особенность реализации |
| --- | --- |
| `__construct(bool $enabled = true, string $tokenName = 'sessid', bool $returnNew = true)` | Параметр `enabled` включает проверку, при `false` фильтр пропускает любой запрос. Параметр `tokenName` задает имя параметра запроса с токеном. Параметр `returnNew` включает передачу текущего токена в ошибке и заголовке ответа |
| `listAllowedScopes` | Возвращает только `Controller::SCOPE_AJAX`. Если область контроллера `SCOPE_REST` или `SCOPE_CLI`, контроллер не подключает фильтр |

### Унаследованные методы

Методы `className`, `bindAction`, `getAction`, `getErrors` и `getErrorByCode` работают как в классе [Base](../base/index.md).

## Примеры

**Пример.** Код подключает фильтр к действию `save` и запускает действие без токена. Контроллер работает в области `ajax` по умолчанию, поэтому подключает фильтр, не выполняет действие и возвращает ошибку фильтра:

```php
<?php
use Bitrix\Main\Engine\ActionFilter\Csrf;
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

final class DemoUnitController extends Controller
{
    public function configureActions()
    {
        return [
            'save' => [
                'prefilters' => [new Csrf()],
            ],
        ];
    }

    public function saveAction()
    {
        return ['saved' => true];
    }
}

$controller = new DemoUnitController();
var_dump($controller->run('save', []));

foreach ($controller->getErrors() as $error)
{
    echo $error->getCode() . PHP_EOL;
}
```

Код выведет `NULL` и `invalid_csrf`.

## Смотрите также

- [Base](../base/index.md)
- [Префильтры и постфильтры](../../../../../framework/pre-post-filters.md)
- [CSRF и SSRF](../../../../../security/csrf-ssrf.md)
