---
title: Зарегистрировать каталог пространства имен Loader::registerNamespace
description: Метод Loader::registerNamespace связывает пространство имен с каталогом, из которого автозагрузчик загружает классы по правилам PSR-4.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loader::registerNamespace` связывает пространство имен с каталогом. Автозагрузчик [autoLoad](auto-load.md) ищет классы этого пространства имен в каталоге по правилам PSR-4. Метод [includeModule](include-module.md) сам регистрирует каталог `lib` модуля, для него вызывать `registerNamespace` не нужно.

Сигнатура метода в классе `Bitrix\Main\Loader`:

```php
public static function registerNamespace($namespace, $path)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| namespace\* | `string` | Задает пространство имен, например `Vendor\Units`. Метод убирает обратные косые черты в начале и в конце. Регистр не важен |
| path\* | `string` | Задает абсолютный путь к каталогу. Метод убирает косую черту в конце |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает. Метод не проверяет, что каталог существует.

## Особенности

- Повторный вызов с тем же пространством имен добавляет еще один каталог. Автозагрузчик проверяет каталоги в порядке регистрации.
- Для класса `Vendor\Units\Unit\Converter` автозагрузчик ищет файл `Unit/Converter.php`, а если его нет — `unit/converter.php`.

## Примеры

**Пример.** Код создает каталог классов во временном каталоге, регистрирует его и вызывает класс:

```php
<?php
use Bitrix\Main\Loader;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$directory = sys_get_temp_dir() . '/units_lib_' . uniqid();
$file = $directory . '/Unit/Converter.php';
mkdir($directory . '/Unit', 0755, true);

try
{
    file_put_contents(
        $file,
        '<?php namespace Vendor\Units\Unit; class Converter { public static function kgToG($v) { return $v * 1000; } }'
    );

    Loader::registerNamespace('Vendor\Units', $directory);

    echo \Vendor\Units\Unit\Converter::kgToG(2);
}
finally
{
    @unlink($file);
    rmdir($directory . '/Unit');
    rmdir($directory);
}
```

Код выведет `2000`. Пример создает файл класса и затем удаляет его, поэтому код работает без подготовки.

## Смотрите также

- [Loader::unregisterNamespace](unregister-namespace.md)
- [Loader::getNamespaces](get-namespaces.md)
- [Автозагрузка классов](../../../framework/autoloading.md)
