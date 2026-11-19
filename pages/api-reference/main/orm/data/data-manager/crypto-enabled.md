---
title: Проверить шифрование поля DataManager::cryptoEnabled
description: Метод DataManager::cryptoEnabled проверяет, включен ли флаг шифрования поля в настройках модуля main.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 17.5.14

{% endnote %}

Метод `DataManager::cryptoEnabled` проверяет, включен ли флаг шифрования поля. Флаг задает [enableCrypto](enable-crypto.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function cryptoEnabled($field, $table = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| field\* | `string` | Задает имя поля. Регистр не важен |
| table | `string` или `null` | Задает имя таблицы. По умолчанию — `null`, метод берет имя из [getTableName](get-table-name.md) |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает `true`, если флаг включен, иначе `false`.

## Примеры

**Пример.** Код проверяет флаг шифрования поля таблицы пользователей:

```php
<?php
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(UserTable::cryptoEnabled('UNITS_DEMO_FIELD'));
```

Код выведет `bool(false)`.

## Смотрите также

- [DataManager::enableCrypto](enable-crypto.md)
