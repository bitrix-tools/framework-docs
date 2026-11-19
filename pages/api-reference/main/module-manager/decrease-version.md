---
title: Уменьшить версию модуля ModuleManager::decreaseVersion
description: Метод ModuleManager::decreaseVersion уменьшает последнюю часть номера версии в файле версии модуля и записывает файл.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ModuleManager::decreaseVersion` уменьшает номер версии модуля в файле версии и записывает файл. Ядро вызывает метод на странице списка модулей в административном разделе в действии `version_down` и в консольной команде `update:versions`.

{% note warning "" %}

Метод меняет файл версии модуля на диске. Перед вызовом сохраните копию файла.

{% endnote %}

Сигнатура метода в классе `Bitrix\Main\ModuleManager`:

```php
public static function decreaseVersion(string $moduleId, int $count, ?string $fromVersion = null): ?string
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| moduleId\* | `string` | Задает код модуля |
| count\* | `int` | Задает, на сколько уменьшить последнюю часть версии. Метод заменяет значение меньше `1` на `1` |
| fromVersion | `string`, `null` | Задает версию, от которой метод отсчитывает новую, вместо версии из файла. По умолчанию — `null` |

## Возвращаемое значение

Метод возвращает новую версию строкой. Метод возвращает `null`, если:

- код модуля не проходит проверку [isValidModule](is-valid-module.md),
- файла версии нет,
- в файле нет версии вида `X.Y.Z`,
- `fromVersion` не соответствует виду `X.Y.Z`.

Если последняя часть версии меньше `count`, метод занимает единицу из средней части. Например, `26.150.0` с `count`, равным `1`, дает `26.149.9999`. Если средняя часть равна нулю, метод занимает единицу из первой части: `26.0.0` дает `25.9999.9999`.

## Особенности

Метод записывает файл, только если все части новой версии неотрицательные и первая больше нуля. Иначе метод возвращает новую версию, но файл не меняет.

После записи метод сбрасывает для файла кеш OPcache, если сброс не отключен константой `BX_NO_ACCELERATOR_RESET` или настройкой `no_accelerator_reset`.

Ядро хранит версию `main` в `/bitrix/modules/main/classes/general/version.php`, версию другого модуля — в `install/version.php` модуля.

## Примеры

**Пример.** Код сохраняет файл версии модуля `main`, уменьшает версию на единицу, выводит новую версию и в блоке `finally` восстанавливает файл:

```php
<?php
use Bitrix\Main\IO\File;
use Bitrix\Main\ModuleManager;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$versionFile = $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/classes/general/version.php';
$backup = File::getFileContents($versionFile);

try
{
    echo ModuleManager::decreaseVersion('main', 1);
}
finally
{
    File::putFileContents($versionFile, $backup);
}
```

Для версии `26.150.0` код выведет `26.149.9999`.

## Смотрите также

- [ModuleManager::getVersion](get-version.md)
