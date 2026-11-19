---
title: Получить ресурсы расширений Extension::getResourceList
description: Метод Extension::getResourceList собирает JS, CSS, языковые файлы, настройки и другие ресурсы расширений с учетом зависимостей.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Extension::getResourceList` собирает файлы, языковые фразы, настройки и другие ресурсы для подключения расширений. Метод подходит, когда расширения подключает код модуля, например при загрузке расширений из JavaScript.

Сигнатура метода в классе `Bitrix\Main\UI\Extension`:

```php
public static function getResourceList($extName, $option = [])
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

#|
|| Параметр | Тип | Описание ||
|| extName\* | `string`, `array` | Задает имя расширения или массив имен ||
|| option | `array` | Задает настройки сбора. По умолчанию — пустой массив. Ключи:
- `with_dependency` — `false` отключает сбор зависимостей,
- `skip_core_js` — `true` пропускает расширение `core`,
- `skip_extensions` — массив имен пропускает эти расширения,
- `get_resolved_extension_list` — `true` добавляет в результат ключ `resolved_extension` ||
|#

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает массив с ключами `js`, `css`, `lang`, `lang_additional`, `layout`, `options` и `settings`. В каждом ключе метод объединяет значения из конфигураций всех расширений по порядку зависимостей. Ключ `settings` содержит настройки по именам расширений.

Если в конфигурации расширения есть функция `oninit`, метод вызывает ее и добавляет возвращенные значения к конфигурации.

С ключом `get_resolved_extension_list` результат содержит `resolved_extension` — имена обработанных расширений без расширений из `skip_extensions`. Если задан `skip_core_js`, имя `core` в списке остается.

## Особенности

Метод вызывает `CJSCore::Init()` без аргументов. Этот вызов регистрирует расширения ядра и подключает на страницу ядро JS, если оно еще не подключено.

## Примеры

**Пример.** Код выводит JS-файлы расширения `main.loader` и его зависимостей без расширения `core`:

```php
<?php
use Bitrix\Main\UI\Extension;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$resources = Extension::getResourceList('main.loader', ['skip_core_js' => true]);

echo implode(PHP_EOL, $resources['js']);
```

## Смотрите также

- [Extension::getAssets](get-assets.md)
- [Extension::getDependencyList](get-dependency-list.md)
