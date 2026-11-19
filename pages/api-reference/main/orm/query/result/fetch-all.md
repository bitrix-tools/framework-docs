---
title: Получить все строки массивом Result::fetchAll
description: Метод ORM\Query\Result::fetchAll возвращает все оставшиеся строки выборки массивом без служебных полей.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::fetchAll` возвращает все оставшиеся строки выборки массивом. Метод вызывает [DB\Result::fetchAll](../../../db/result/fetch-all.md) и убирает из строк служебные поля, которые задал [setHiddenObjectFields](set-hidden-object-fields.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Result`:

```php
public function fetchAll(?\Bitrix\Main\Text\Converter $converter = null)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| converter | `Bitrix\Main\Text\Converter` или `null` | Задает преобразование значений. По умолчанию — `null` |

## Возвращаемое значение

Метод возвращает массив строк с числовыми ключами. Если строк нет, метод возвращает пустой массив.

## Особенности

Метод загружает все строки в память. Для большой выборки читайте строки по одной методом [fetch](fetch.md) или ограничьте выборку параметром `limit`.

## Примеры

**Пример.** Код получает коды языков массивом:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::getList([
    'select' => ['LID'],
    'filter' => ['@LID' => ['en', 'ru']],
    'order' => ['LID' => 'ASC'],
])->fetchAll();

echo implode(',', array_column($rows, 'LID'));
```

Код выведет `en,ru`.

## Смотрите также

- [Result::fetch](fetch.md)
- [DB\Result::fetchAll](../../../db/result/fetch-all.md)
