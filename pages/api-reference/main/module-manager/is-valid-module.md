---
title: Проверить код модуля ModuleManager::isValidModule
description: Метод ModuleManager::isValidModule проверяет, что код модуля состоит из латинских букв, цифр, точки и подчеркивания.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ModuleManager::isValidModule` проверяет, что в коде модуля нет недопустимых символов. Проверяйте код из внешнего источника, например из запроса, перед тем как строить по нему путь к файлам модуля.

Сигнатура метода в классе `Bitrix\Main\ModuleManager`:

```php
public static function isValidModule(string $moduleName): bool
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| moduleName\* | `string` | Задает код модуля |

## Возвращаемое значение

Метод возвращает `true`, если код состоит только из латинских букв, цифр, точки и подчеркивания. Иначе метод возвращает `false`. Метод не проверяет, существует ли модуль, и считает пустую строку допустимой.

## Примеры

**Пример.** Код проверяет три кода модуля:

```php
<?php
use Bitrix\Main\ModuleManager;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

foreach (['demo.units', 'demo-units', '../main'] as $code)
{
    echo $code . ' — ' . (ModuleManager::isValidModule($code) ? 'valid' : 'invalid') . PHP_EOL;
}
```

Код выведет `valid` для `demo.units` и `invalid` для двух других кодов.

## Смотрите также

- [ModuleManager::getVersion](get-version.md)
