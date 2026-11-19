---
title: Задать сериализованные колонки Result::setSerializedFields
description: Метод Result::setSerializedFields задает колонки, значения которых fetch десериализует функцией unserialize.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Result::setSerializedFields` задает колонки, значения которых [fetch](fetch.md) десериализует функцией `unserialize`. Метод заменяет весь список колонок.

Сигнатура метода в классе `Bitrix\Main\DB\Result`:

```php
public function setSerializedFields(array $serializedFields)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| serializedFields\* | `string[]` | Задает имена колонок |

## Возвращаемое значение

Метод ничего не возвращает.

Метод `fetch` десериализует значение с параметром `allowed_classes => false`. Он восстанавливает массивы и скаляры, а объекты превращает в `__PHP_Incomplete_Class`. Метод `fetch` пропускает значение `null` и отсутствующую колонку.

## Примеры

**Пример.** Код получает сериализованный массив и читает его уже массивом PHP:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

$serialized = serialize(['unit' => 'kg', 'sort' => 10]);

$result = $connection->query("SELECT '" . $helper->forSql($serialized) . "' AS SETTINGS");
$result->setSerializedFields(['SETTINGS']);

$row = $result->fetch();
echo $row['SETTINGS']['unit'];
```

## Смотрите также

- [Result::fetch](fetch.md)
