---
title: Composer
description: 'Composer в Bitrix Framework: зачем нужен, как подключить автозагрузчик и стандартные зависимости, как устанавливать сторонние пакеты.'
---

Статья состоит из трёх частей: зачем нужен Composer, как подключить его к Bitrix Framework и как устанавливать сторонние пакеты.

## Что такое Composer и зачем он нужен

Composer — стандартный менеджер зависимостей для PHP. Он устанавливает библиотеки из каталога [Packagist](https://packagist.org/), следит за согласованностью их версий и генерирует скрипт-автозагрузчик классов `vendor/autoload.php`.

В Bitrix Framework Composer открывает доступ к:

-  [ORM-аннотациям](../orm/annotations.md),

-  [интерфейсу командной строки CLI](../framework/console-commands.md),

-  сторонним библиотекам — тысячам готовых пакетов с Packagist: генерация документов, работа с внешними API, логирование.

### Установить Composer

Composer можно установить:

-  глобально — для работы в любой папке сервера,

-  локально — только для текущего проекта.

{% note tip "" %}

Используйте [официальную инструкцию](https://getcomposer.org/download/) для установки Composer на сервере.

{% endnote %}

Проверьте, что Composer работает:

```bash prompt="$"
$ composer -V
# Должна отобразиться версия, например:
# Composer version 2.8.5 2025-01-21 15:23:40
```

## Подключить Composer к Bitrix Framework

Bitrix Framework не ищет `composer.json` сам: пока вы не укажете путь к файлу в `.settings.php`, автозагрузчик не подключится. Настройка состоит из трёх шагов: разместить файл, указать путь к нему, подключить стандартные зависимости.

### Шаг 1. Разместить composer.json

Создайте `composer.json` за пределами `DOCUMENT_ROOT`, например в `/home/bitrix/`. Так конфигурация не будет доступна из браузера.

{% note warning "" %}

Если вынести файл за `DOCUMENT_ROOT` нельзя, разместите его в `/local/php_interface/` и закройте файл `composer.json` и папку `vendor` от веб-доступа.

{% endnote %}

{% note info "" %}

В дистрибутиве есть пример файла конфигурации `/bitrix/composer.json.example`. Используйте его как основу для своего `composer.json`.

{% endnote %}

### Шаг 2. Указать путь к composer.json

Добавьте в файл `/home/bitrix/www/bitrix/.settings.php` настройку `composer.config_path`:

```php
return [
    'composer' => [
        'value' => [
            'config_path' => '/home/bitrix/composer.json'
        ]
    ]
];
```

{% note info "" %}

Bitrix Framework не читает содержимое `composer.json`. По расположению файла он находит `vendor/autoload.php` и подключает его автоматически.

{% endnote %}

Автозагрузчик появится после первой установки зависимостей на следующем шаге.

### Шаг 3. Подключить стандартные зависимости

Стандартные зависимости ядра описаны в файле `bitrix/composer-bx.json`. Подключите его к своему `composer.json` через плагин [Composer Merge Plugin](https://github.com/wikimedia/composer-merge-plugin). Для этого в ваш `composer.json` добавьте подключение плагина:

```json
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

{% note warning "" %}

Путь `/path/to/bitrix/` — полный путь к папке `bitrix` на вашем сервере, например, `/home/bitrix/www/bitrix/`.

{% endnote %}

Установите зависимости из папки с `composer.json`:

```bash prompt="$"
$ cd /home/bitrix
$ composer install
```

Composer создаст папку `vendor/` рядом с `composer.json` и установит туда зависимости. Автозагрузчик `vendor/autoload.php` подключится автоматически — в коде подключать его вручную не нужно.

## Установить сторонние пакеты

После настройки новые пакеты устанавливают одной командой. Например, чтобы генерировать Word-документы, установите пакет [phpoffice/phpword](https://packagist.org/packages/phpoffice/phpword):

```bash prompt="$"
$ composer require phpoffice/phpword
```

Команда добавит пакет в `composer.json`, скачает его в `vendor/` и обновит автозагрузчик. Классы пакета сразу доступны в коде:

```php
<?php
// Подключение верхней части сайта
require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/header.php');


use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;

$phpWord = new PhpWord();
$section = $phpWord->addSection();
$section->addText('Документ создан в Bitrix Framework');

$writer = IOFactory::createWriter($phpWord, 'Word2007');
$writer->save($_SERVER['DOCUMENT_ROOT'] . '/upload/example.docx');

echo "Файл сохранен - <a href='/upload/example.docx' download>скачать</a>";

// подключение нижней части сайта
require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/footer.php');
```

### Обновлять пакеты

Чтобы обновить пакет до свежей версии с учётом ограничений из `composer.json`, перейдите в директорию с `composer.json` и выполните:

```bash prompt="$"
$ composer update phpoffice/phpword
```

Composer проверит совместимость версии PHP и пакетов и зафиксирует точные версии в файле `composer.lock`. Храните `composer.lock` в репозитории проекта, тогда на всех серверах будут одинаковые версии.

## Что почитать

-  [Документация Composer](https://getcomposer.org/doc/) — команды, настройка `composer.json`, работа с версиями.

-  [Packagist](https://packagist.org/) — каталог пакетов для Composer.

-  [ORM-аннотации](../orm/annotations.md) — возможности ядра, которые включаются через Composer.

-  [Интерфейс командной строки CLI](../framework/console-commands.md) — команды ядра, доступные после установки зависимостей.
