---
title: Включить шифрование поля DataManager::enableCrypto
description: Метод DataManager::enableCrypto включает или выключает флаг шифрования поля в настройках модуля main.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 17.5.14

{% endnote %}

Метод `DataManager::enableCrypto` включает или выключает флаг шифрования поля. Метод сохраняет флаг в параметре `~crypto_<имя таблицы>` модуля `main`.

Флаг не действует на поле сам. Поле `Bitrix\Main\ORM\Fields\CryptoField` шифрует значение, пока его параметр `crypto_enabled` не равен `false`. Чтобы поле учитывало флаг, передайте в параметры поля в `getMap` значение `'crypto_enabled' => static::cryptoEnabled('ИМЯ_ПОЛЯ')`.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function enableCrypto($field, $table = null, $mode = true)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| field\* | `string` | Задает имя поля. Регистр не важен |
| table | `string` или `null` | Задает имя таблицы. По умолчанию — `null`, метод берет имя из [getTableName](get-table-name.md) |
| mode | `bool` | Значение `true` включает шифрование, `false` выключает. По умолчанию — `true` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- Метод не шифрует заново данные, которые уже есть в таблице. Включайте шифрование до заполнения таблицы.
- Выключенный флаг остается в параметре со значением `false`. Метод `Option::delete` не удалит этот параметр. Модуль `main` не удаляет параметры, имя которых начинается с `~`.

## Примеры

**Пример.** Код включает флаг, проверяет его и выключает:

```php
<?php
use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Fields\IntegerField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class DemoUnitTable extends DataManager
{
    public static function getTableName()
    {
        return 'demo_api_units';
    }

    public static function getMap()
    {
        return [(new IntegerField('ID'))->configurePrimary()];
    }
}

DemoUnitTable::enableCrypto('secret');
$enabled = DemoUnitTable::cryptoEnabled('SECRET');

DemoUnitTable::enableCrypto('secret', null, false);
$disabled = DemoUnitTable::cryptoEnabled('SECRET');

var_export([$enabled, $disabled]);
```

Код выведет:

```text
array (
  0 => true,
  1 => false,
)
```

## Смотрите также

- [DataManager::cryptoEnabled](crypto-enabled.md)
