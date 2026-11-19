---
title: Перевести путь из кодировки файловой системы в UTF-8 Path::convertPhysicalToLogical
description: Метод Path::convertPhysicalToLogical переводит путь из кодировки файловой системы в UTF-8, если они различаются.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Path::convertPhysicalToLogical` переводит путь из кодировки файловой системы в кодировку сайта UTF-8. Вызывайте метод для путей, которые вернули функции PHP, например `scandir`, прежде чем выводить путь на страницу или записывать его в базу данных.

Сигнатура метода в классе `Bitrix\Main\IO\Path`:

```php
public static function convertPhysicalToLogical($path)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| path\* | `string` | Задает путь в кодировке файловой системы |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает путь в кодировке UTF-8. Если кодировки совпадают, метод возвращает путь без изменений. Кодировку файловой системы метод определяет так же, как [convertLogicalToPhysical](convert-logical-to-physical.md).

## Примеры

**Пример.** Код выводит в кодировке UTF-8 имена из каталога модуля `main`, которые начинаются с `include`:

```php
<?php
use Bitrix\Main\IO\Path;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$directory = Path::convertLogicalToPhysical($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main');
$names = scandir($directory);

if ($names !== false)
{
    foreach ($names as $name)
    {
        if (str_starts_with($name, 'include'))
        {
            echo Path::convertPhysicalToLogical($name) . PHP_EOL;
        }
    }
}
```

Код выведет:

```text
include
include.php
```

## Смотрите также

- [Path::convertLogicalToPhysical](convert-logical-to-physical.md)
