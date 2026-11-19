---
title: Получить пространство имен расширения Extension::getBundleConfig
description: Метод Extension::getBundleConfig возвращает JS-пространство имен расширения из файла bundle.config.js или bundle.config.ts.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Extension::getBundleConfig` читает файл сборки расширения `bundle.config.js` или `bundle.config.ts` и возвращает пространство имен JS, в которое сборщик экспортирует код.

Сигнатура метода в классе `Bitrix\Main\UI\Extension`:

```php
public static function getBundleConfig($extName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| extName\* | `string` | Задает имя расширения |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив с ключом `namespace` или `null`, если каталога расширения или файла сборки нет. Метод находит значение `namespace` регулярным выражением по строке `namespace: '...'`. Если строки нет, значение — пустая строка.

Метод сначала ищет `bundle.config.js`, затем `bundle.config.ts`.

## Примеры

**Пример.** Код выводит пространство имен расширения `main.loader`:

```php
<?php
use Bitrix\Main\UI\Extension;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Extension::getBundleConfig('main.loader')['namespace'] ?? 'No bundle config';
```

Код выведет `BX`.

## Смотрите также

- [Extension::getConfig](get-config.md)
