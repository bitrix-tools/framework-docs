---
title: Зарегистрировать расширение Extension::register
description: Метод Extension::register регистрирует JS-расширение в CJSCore по файлу config.php, но не подключает его на страницу.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Extension::register` регистрирует расширение в `CJSCore` по его файлу `config.php`. Метод не подключает расширение на страницу. Это делает [load](load.md).

Сигнатура метода в классе `Bitrix\Main\UI\Extension`:

```php
public static function register($extName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| extName\* | `string` | Задает имя расширения |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если метод зарегистрировал расширение или оно уже было зарегистрировано. Метод возвращает `false`, если:

- `extName` не строка,
- в имени есть символы, кроме латинских букв, цифр, `_`, `.` и `-`,
- метод [getConfig](get-config.md) не нашел конфигурацию расширения.

## Особенности

Метод `CJSCore::RegisterExt` не регистрирует расширение, если ключ `use` в его конфигурации не совпадает с разделом сайта — административным или публичным. Метод при этом все равно возвращает `true`.

## Примеры

**Пример.** Код регистрирует существующее и несуществующее расширение:

```php
<?php
use Bitrix\Main\UI\Extension;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Extension::register('main.loader'));
var_dump(Extension::register('demo.missing'));
```

Код выведет `bool(true)` и `bool(false)`.

## Смотрите также

- [Extension::load](load.md)
- [Extension::registerAssets](register-assets.md)
