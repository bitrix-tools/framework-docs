---
title: Получить конфигурацию расширения Extension::getConfig
description: Метод Extension::getConfig возвращает массив из файла config.php расширения с путями от корня сайта.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Extension::getConfig` возвращает конфигурацию расширения из его файла `config.php`. Метод приводит относительные пути к путям от корня сайта.

Сигнатура метода в классе `Bitrix\Main\UI\Extension`:

```php
public static function getConfig($extName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| extName\* | `string` | Задает имя расширения из двух и более частей через точку |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив из `config.php` или `null`, если:

- `extName` не строка или в нем меньше двух частей,
- часть имени содержит символы, кроме латинских букв, цифр, `_`, `.` и `-`,
- каталога расширения или файла `config.php` нет,
- `config.php` не вернул массив.

Метод меняет массив так:

- относительные пути в `js` и `css` дополняет путем к каталогу расширения,
- если у расширения есть каталог `lang`, дополняет относительные пути в `lang` и добавляет туда путь к `config.php`,
- если ключа `settings` нет или он не массив, задает пустой массив.

## Особенности

Метод запоминает результат для каждого имени до конца запроса.

## Примеры

**Пример.** Код выводит JS-файлы и зависимости расширения `main.loader`:

```php
<?php
use Bitrix\Main\UI\Extension;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$config = Extension::getConfig('main.loader');

echo $config['js'] . PHP_EOL;
echo implode(', ', $config['rel']);
```

Код выведет путь `/bitrix/js/main/loader/dist/loader.bundle.js` и зависимость `main.core`.

## Смотрите также

- [Extension::getBundleConfig](get-bundle-config.md)
- [Extension::getAssets](get-assets.md)
