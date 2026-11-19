---
title: Подключить модуль Loader::includeModule
description: Метод Loader::includeModule подключает установленный модуль, регистрирует пространство имен его каталога lib и возвращает результат.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loader::includeModule` подключает модуль. Когда модуль подключен, автозагрузчик находит его классы. Аналог в классическом API — `CModule::IncludeModule`, он вызывает этот метод.

Сигнатура метода в классе `Bitrix\Main\Loader`:

```php
public static function includeModule($moduleName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| moduleName\* | `string` | Задает код модуля, например `iblock` или `vendor.units`. Регистр не важен |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает `true`, если модуль подключен, и `false`, если модуль не установлен, его каталога нет или файл `include.php` модуля вернул `false`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\LoaderException` | Код модуля пустой, не строка или содержит недопустимые символы, например пробел |

## Особенности

Метод выполняет шаги по порядку:

1. Возвращает запомненный результат, если модуль уже подключали в этом запросе, в том числе `false`.
2. Проверяет, что модуль установлен.
3. Ищет каталог модуля сначала в `/local/modules/`, затем в `/bitrix/modules/`.
4. Регистрирует пространство имен PSR-4 для каталога `lib` модуля. Модуль `iblock` получает пространство имен `Bitrix\Iblock`, модуль `vendor.units` — `Vendor\Units`.
5. Подключает файл `include.php` модуля, если он есть. Если файл вернул `false`, метод удаляет регистрацию пространства имен и возвращает `false`.
6. Регистрирует сервисы модуля из его файла `.settings.php` в [ServiceLocator](../di/service-locator/index.md). Сервисы, которые уже зарегистрированы, метод не заменяет.

Метод [clearModuleCache](clear-module-cache.md) сбрасывает запомненный результат. Если модуль вызывает `includeModule` для самого себя во время подключения, PHP выдает предупреждение `E_USER_WARNING`.

## Примеры

**Пример.** Код подключает модуль инфоблоков и проверяет результат:

```php
<?php
use Bitrix\Main\Loader;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

if (Loader::includeModule('iblock'))
{
    echo class_exists(\Bitrix\Iblock\IblockTable::class) ? 'iblock ready' : 'no class';
}
else
{
    echo 'iblock is not installed';
}
```

Если модуль установлен, код выведет `iblock ready`.

## Смотрите также

- [Loader::requireModule](require-module.md)
- [ModuleManager::isModuleInstalled](../module-manager/is-module-installed.md)
- [Автозагрузка классов](../../../framework/autoloading.md)
