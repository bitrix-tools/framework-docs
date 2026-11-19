---
title: Получить адрес действия Controller::getActionUri
description: Метод Controller::getActionUri возвращает адрес AJAX-запроса к действию через /bitrix/services/main/ajax.php.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::getActionUri` возвращает адрес, по которому клиент вызовет действие, например `/bitrix/services/main/ajax.php?action=main.controller.useroption.set`. Метод нужен для ссылок и форм, которые вызывают действие без `BX.ajax.runAction`.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
final public function getActionUri(string $actionName, array $params = [], bool $absolute = false): Uri
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| actionName\* | `string` | Задает имя действия без имени контроллера |
| params | `array` | Задает параметры запроса. По умолчанию — пустой массив |
| absolute | `bool` | Значение `true` добавляет схему и хост. По умолчанию — `false` |

## Возвращаемое значение

Метод возвращает объект [Uri](../../web/uri/index.md). Адрес содержит имя действия и параметры из `params`. Параметр `SITE_ID` метод добавляет, если определена константа `SITE_ID` и запрос пришел не из административного раздела.

## Особенности

- Метод строит имя контроллера из модуля и пространства имен класса. Для класса вне каталога модуля адрес будет неверным.
- Для контроллера компонента, файл которого лежит в каталоге `/components/`, метод добавляет в адрес параметр `c` с именем компонента и `mode=ajax`. Параметр `action` тогда содержит только имя действия.
- Адрес не содержит CSRF-токен. Для POST-запроса передайте `sessid` сами.

## Примеры

**Пример.** Код строит адрес действия контроллера ядра:

```php
<?php
use Bitrix\Main\Controller\UserOption;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo (new UserOption())->getActionUri('set', ['name' => 'x'])->getUri();
```

Код выведет `/bitrix/services/main/ajax.php?action=main.controller.useroption.set&SITE_ID=s1&name=x`. Значение `SITE_ID` зависит от сайта.

## Смотрите также

- [Controller::getModuleId](get-module-id.md)
- [Uri](../../web/uri/index.md)
