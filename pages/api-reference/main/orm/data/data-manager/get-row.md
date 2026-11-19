---
title: Получить одну запись DataManager::getRow
description: Метод DataManager::getRow выбирает одну запись по параметрам getList и возвращает ее массивом или null.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::getRow` выбирает одну запись по параметрам [getList](get-list.md) и возвращает ее массивом. Метод сам задает `limit` равным 1.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function getRow(array $parameters)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| parameters\* | `array` | Задает параметры, как в `getList`. Метод заменяет значение ключа `limit` на 1 |

## Возвращаемое значение

Метод возвращает массив или `null`, если записи нет.

## Особенности

Если условиям соответствуют несколько записей, метод вернет первую. Задайте `order`, чтобы результат не зависел от порядка строк в базе данных.

## Примеры

**Пример.** Код получает последний по коду язык:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$row = LanguageTable::getRow([
    'select' => ['LID', 'NAME'],
    'filter' => ['@LID' => ['en', 'ru']],
    'order' => ['LID' => 'DESC'],
]);

echo $row['LID'] . ' ' . var_export(LanguageTable::getRow(['filter' => ['=LID' => 'zz']]), true);
```

Код выведет `ru NULL`.

## Смотрите также

- [DataManager::getRowById](get-row-by-id.md)
- [DataManager::getList](get-list.md)
