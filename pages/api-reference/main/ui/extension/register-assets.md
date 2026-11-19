---
title: Зарегистрировать расширение по конфигурации Extension::registerAssets
description: Метод Extension::registerAssets регистрирует расширение в CJSCore по массиву конфигурации без файла config.php.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Extension::registerAssets` регистрирует расширение по готовому массиву конфигурации. Метод вызывает `CJSCore::RegisterExt`. Метод подходит для расширения без файла `config.php`, например со сгенерированным списком файлов.

Сигнатура метода в классе `Bitrix\Main\UI\Extension`:

```php
public static function registerAssets($id, array $options)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| id\* | `string` | Задает имя расширения |
| options\* | `array` | Задает конфигурацию в формате `config.php`, например ключи `js`, `css`, `lang` и `rel`. Метод не меняет пути, поэтому передавайте их от корня сайта |

Тип `id` в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код регистрирует расширение со стилями расширения `main.loader` и зависимостью `main.core` и проверяет регистрацию:

```php
<?php
use Bitrix\Main\UI\Extension;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

Extension::registerAssets('demo.units', [
    'css' => '/bitrix/js/main/loader/dist/loader.bundle.css',
    'rel' => ['main.core'],
]);

var_dump(CJSCore::IsExtRegistered('demo.units'));
```

Код выведет `bool(true)`.

## Смотрите также

- [Extension::register](register.md)
