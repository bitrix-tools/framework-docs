---
title: Добавить свой автозагрузчик Loader::registerHandler
description: Метод Loader::registerHandler регистрирует функцию автозагрузки классов через spl_autoload_register.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loader::registerHandler` добавляет свою функцию автозагрузки классов. Метод передает функцию в `spl_autoload_register`. PHP вызывает функцию, если автозагрузчики, зарегистрированные раньше, не нашли класс. Для классов по правилам PSR-4 используйте [registerNamespace](register-namespace.md), а свою функцию — для других схем размещения файлов.

Сигнатура метода в классе `Bitrix\Main\Loader`:

```php
public static function registerHandler(callable $handler)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| handler\* | `callable` | Задает функцию, которая получает полное имя класса и подключает файл класса |

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код добавляет автозагрузчик, который подключает классы с префиксом `UnitsLegacy` из временного каталога:

```php
<?php
use Bitrix\Main\Loader;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$prefix = 'UnitsLegacy';
$directory = sys_get_temp_dir() . '/units_legacy_' . uniqid();
mkdir($directory, 0755);

try
{
    file_put_contents($directory . '/kg.php', '<?php class UnitsLegacyKg { const TITLE = "kg"; }');

    Loader::registerHandler(static function (string $className) use ($prefix, $directory)
    {
        if (str_starts_with($className, $prefix))
        {
            $file = $directory . '/' . strtolower(substr($className, strlen($prefix))) . '.php';
            if (file_exists($file))
            {
                require_once $file;
            }
        }
    });

    echo UnitsLegacyKg::TITLE;
}
finally
{
    @unlink($directory . '/kg.php');
    rmdir($directory);
}
```

Код выведет `kg`.

## Смотрите также

- [Loader::autoLoad](auto-load.md)
- [Loader::registerNamespace](register-namespace.md)
