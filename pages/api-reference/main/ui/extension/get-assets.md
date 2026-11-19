---
title: Получить файлы расширения Extension::getAssets
description: Метод Extension::getAssets возвращает JS- и CSS-файлы расширения вместе с файлами его зависимостей.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Extension::getAssets` возвращает JS- и CSS-файлы расширения. Метод добавляет файлы зависимостей из `rel` перед файлами расширения и файлы из `post_rel` после них.

Сигнатура метода в классе `Bitrix\Main\UI\Extension`:

```php
public static function getAssets($extName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| extName\* | `string`, `array` | Задает имя расширения или массив имен |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив с ключами `js` и `css`. В каждом — пути к файлам без повторов.

Если у расширения нет `config.php`, метод берет конфигурацию из `CJSCore::getExtInfo`. Так метод находит файлы расширений ядра, например `popup`.

## Примеры

**Пример.** Код выводит CSS-файлы расширения `ui.hint` и его зависимостей:

```php
<?php
use Bitrix\Main\UI\Extension;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$assets = Extension::getAssets('ui.hint');

echo implode(PHP_EOL, $assets['css']);
```

## Смотрите также

- [Extension::getResourceList](get-resource-list.md)
- [Extension::getDependencyList](get-dependency-list.md)
