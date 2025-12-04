---
title: Composer
description: 'Composer. Пошаговое руководство по началу работы с Bitrix: установка, структура проектов и базовые принципы.'
---

Composer -- стандартный менеджер зависимостей для PHP, который позволяет управлять библиотеками и их версиями. В Bitrix Framework он открывает доступ к современным инструментам разработки:

-  ORM-аннотациям,

-  интерфейсу командой строки CLI,

-  сторонним библиотекам.

## Установить Composer

Composer можно установить:

-  глобально -- для работы в любой папке сервера,

-  локально -- только для текущего проекта.

{% note tip "" %}

Используйте [официальную инструкцию](https://getcomposer.org/download/) для установки Composer на сервере.

{% endnote %}

Проверьте, что Composer работает командой:

```bash
composer -V
# Должна отобразиться версия, например:
# Composer version 2.8.5 2025-01-21 15:23:40
```

## Настроить зависимости в проекте

Для корректной и безопасной работы Composer в Bitrix необходимо правильно организовать структуру проекта.

### Где разместить composer.json

По умолчанию система ищет файл `composer.json` в папке `/home/bitrix/www/bitrix/`. Рекомендуется размещать `composer.json` за пределами `DOCUMENT_ROOT`, например, в `/home/bitrix/`. Это предотвратит публичный доступ к конфигурации.

{% note info "" %}

В системе есть пример файла конфигурации `/bitrix/composer.json.example`. Его можно использовать как основу для своего `composer.json`.

{% endnote %}

Добавьте в файл `/home/bitrix/www/bitrix/.settings.php` путь к `composer.json`.

```php
return [
    'composer' => [
        'value' => [
            'config_path' => '/home/bitrix/composer.json'
        ]
    ]
];
```

Если вы разрабатываете собственные модули -- размещайте `composer.json` в папке `/local/`.

### Как подключить стандартные зависимости

Подключите файл со стандартными зависимостями Bitrix Framework `composer-bx.json`.

1. Установите плагин [Composer Merge Plugin](https://github.com/wikimedia/composer-merge-plugin).

2. В файл `composer.json` добавьте:

   ```php
   {
       "require": {
           "wikimedia/composer-merge-plugin": "^2.0"
       },
       "extra": {
           "merge-plugin": {
               "include": [
                   "/path/to/bitrix/composer-bx.json"
               ]
           }
       }
   }
   ```

   Путь `/path/to/bitrix/` -- полный путь к папке `bitrix` на вашем сервере, например, `/home/bitrix/www/bitrix/`.

### Как установить зависимости

Чтобы установить зависимости, выполните команду в терминале из каталога, где расположен `composer.json`:

```bash
composer install
```

Все зависимости установятся в папку `/vendor/`, которую Composer создаст рядом с файлом `composer.json`. Автозагрузчик `/vendor/autoload.php` будет подключаться автоматически.
