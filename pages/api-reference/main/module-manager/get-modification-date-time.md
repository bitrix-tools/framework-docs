---
title: Получить время изменения файла версии ModuleManager::getModificationDateTime
description: Метод ModuleManager::getModificationDateTime возвращает время изменения файла версии модуля.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ModuleManager::getModificationDateTime` возвращает время, когда файл версии модуля изменили последний раз.

Сигнатура метода в классе `Bitrix\Main\ModuleManager`:

```php
public static function getModificationDateTime(string $moduleName): ?DateTime
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| moduleName\* | `string` | Задает код модуля |

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Type\DateTime` или `null`. Для `main` метод берет время изменения файла `/bitrix/modules/main/classes/general/version.php`, для другого модуля — файла `install/version.php` модуля.

Метод возвращает `null`, если код модуля содержит недопустимые символы или файла версии нет. Метод не проверяет, установлен ли модуль.

## Примеры

**Пример.** Код выводит дату изменения файла версии модуля `main`:

```php
<?php
use Bitrix\Main\ModuleManager;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$dateTime = ModuleManager::getModificationDateTime('main');

echo $dateTime === null ? 'Unknown' : $dateTime->format('Y-m-d');
```

## Смотрите также

- [ModuleManager::getVersion](get-version.md)
