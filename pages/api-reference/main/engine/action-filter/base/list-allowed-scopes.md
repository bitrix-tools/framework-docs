---
title: Получить области работы фильтра Base::listAllowedScopes
description: Метод ActionFilter\Base::listAllowedScopes возвращает области контроллера, в которых фильтр работает.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Base::listAllowedScopes` возвращает области, в которых фильтр работает. Перед действием контроллер сравнивает свою область с этим списком. Если области контроллера в списке нет, контроллер не подключает фильтр к действию.

Переопределите метод в наследнике, чтобы ограничить области работы фильтра.

Сигнатура метода в классе `Bitrix\Main\Engine\ActionFilter\Base`:

```php
public function listAllowedScopes()
```

## Возвращаемое значение

Метод возвращает массив областей. В классе `Base` массив содержит три константы контроллера:

- `Controller::SCOPE_REST` — вызов через REST API, значение `rest`,
- `Controller::SCOPE_AJAX` — AJAX-запрос, значение `ajax`,
- `Controller::SCOPE_CLI` — запуск из консоли, значение `cli`.

Фильтр [Csrf](../csrf/index.md) возвращает только `Controller::SCOPE_AJAX`.

## Примеры

**Пример.** Фильтр работает только в AJAX-запросах. Код выводит его области:

```php
<?php
use Bitrix\Main\Engine\ActionFilter\Base;
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

final class DemoAjaxOnlyFilter extends Base
{
    public function listAllowedScopes()
    {
        return [
            Controller::SCOPE_AJAX,
        ];
    }
}

$filter = new DemoAjaxOnlyFilter();

echo implode(', ', $filter->listAllowedScopes());
```

Код выведет `ajax`.

## Смотрите также

- [Base::bindAction](bind-action.md)
