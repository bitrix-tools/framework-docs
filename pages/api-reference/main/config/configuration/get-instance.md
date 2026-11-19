---
title: Получить объект конфигурации Configuration::getInstance
description: Метод Configuration::getInstance возвращает объект общей конфигурации или конфигурации установленного модуля. Повторный вызов с тем же аргументом возвращает тот же объект.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Configuration::getInstance` возвращает объект общей конфигурации или конфигурации установленного модуля. Повторный вызов с тем же аргументом возвращает тот же объект.

Сигнатура метода в классе `Bitrix\Main\Config\Configuration`:

```php
public static function getInstance(?string $moduleId = null): self;
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| moduleId | `?string` | Выбирает конфигурацию установленного модуля по его идентификатору. По умолчанию `null`, общая конфигурация |

## Возвращаемое значение

Возвращает объект `Configuration`. Метод не загружает файл при создании объекта.

## Особенности

Объект общей конфигурации загружает данные из `.settings.php` и `.settings_extra.php`. Объект модуля загружает данные из `modules/<moduleId>/.settings.php`. Объект ищет файлы сначала в `/local/`, затем в `/bitrix/`. Если модуль не установлен или его файл не найден, объект содержит пустой набор секций. Конструктор обрезает пробелы и удаляет из идентификатора символы, кроме латинских букв, цифр, `_` и `.`. Ключ кеша использует исходный аргумент. Пустая строка или строка `'0'` после обработки выбирает общую конфигурацию.

## Примеры

**Пример.** Повторный вызов возвращает тот же объект.

```php
<?php

use Bitrix\Main\Config\Configuration;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Configuration::getInstance() === Configuration::getInstance());
```

## Смотрите также

- [Configuration::getInstanceByPath](get-instance-by-path.md)
- [Configuration::get](get.md)
