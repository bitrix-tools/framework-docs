---
title: Сбросить результат подключения модуля Loader::clearModuleCache
description: Метод Loader::clearModuleCache сбрасывает запомненный результат includeModule, чтобы следующий вызов подключил модуль заново.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loader::clearModuleCache` сбрасывает запомненный результат подключения модуля. Класс `ModuleManager` вызывает метод сам, когда регистрирует модуль или удаляет его регистрацию. Вызывайте метод, если модуль установили в обход `ModuleManager` в том же запросе после неудачного вызова [includeModule](include-module.md).

Сигнатура метода в классе `Bitrix\Main\Loader`:

```php
public static function clearModuleCache($moduleName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| moduleName\* | `string` | Задает код модуля. Для результата `includeModule` передайте код в нижнем регистре, для результата `includeSharewareModule` — в том регистре, в котором его передавали |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\LoaderException` | Код модуля пустой или не строка |

## Особенности

- Метод сбрасывает результаты `includeModule` и [includeSharewareModule](include-shareware-module.md) и запомненный каталог модуля. Для модуля `main` метод сбрасывает только результат `includeSharewareModule`.
- Метод не отменяет регистрацию пространства имен и уже подключенный `include.php`. Повторный `includeModule` добавит каталог `lib` в пространство имен еще раз.
- Пока модуль не подключат снова, автозагрузчик ищет классы модуля из `registerAutoLoadClasses` в `/bitrix/modules/`, даже если модуль лежит в `/local/modules/`.

## Примеры

**Пример.** Код сбрасывает результат после неудачного подключения и пробует снова:

```php
<?php
use Bitrix\Main\Loader;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$first = Loader::includeModule('vendor.units');

// здесь код может установить модуль

Loader::clearModuleCache('vendor.units');
$second = Loader::includeModule('vendor.units');

var_dump($first, $second);
```

Если модуль так и не установили, код выведет:

```text
bool(false)
bool(false)
```

## Смотрите также

- [Loader::includeModule](include-module.md)
- [ModuleManager](../module-manager/index.md)
