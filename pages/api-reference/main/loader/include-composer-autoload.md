---
title: Подключить автозагрузчик Composer Loader::includeComposerAutoload
description: Метод Loader::includeComposerAutoload подключает vendor/autoload.php рядом с файлом composer.json из секции composer конфигурации ядра.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loader::includeComposerAutoload` подключает автозагрузчик Composer. Ядро вызывает метод в файле `/bitrix/modules/main/include/autoload.php`, вызывать его в коде не нужно. Путь к `composer.json` задает ключ `config_path` секции `composer` файла `.settings.php`.

Сигнатура метода в классе `Bitrix\Main\Loader`:

```php
public static function includeComposerAutoload(): void
```

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод подключает файл `vendor/autoload.php` из каталога, где лежит файл из `config_path`. Путь без `/` в начале — это путь от корня сайта. Путь Windows вида `C:\...` метод тоже считает относительным и не находит.

Если ключ `config_path` не задан или файла по относительному пути нет, вызов ничего не делает. Наличие `vendor/autoload.php` не проверяется. Если `composer.json` есть, а зависимости не установлены, PHP выбросит ошибку `Error`.

## Примеры

**Пример.** Код проверяет, задан ли путь к Composer в конфигурации ядра:

```php
<?php
use Bitrix\Main\Config\Configuration;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$composer = Configuration::getValue('composer');

echo $composer['config_path'] ?? 'composer is not configured';
```

Если секции `composer` нет, код выведет `composer is not configured`.

## Смотрите также

- [Автозагрузка классов](../../../framework/autoloading.md)
- [Configuration](../config/configuration/index.md)
