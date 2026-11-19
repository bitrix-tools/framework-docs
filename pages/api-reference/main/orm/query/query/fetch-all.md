---
title: Получить все строки Query::fetchAll
description: Метод Query::fetchAll выполняет запрос и возвращает все строки результата массивом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::fetchAll` выполняет запрос и возвращает все строки результата. Метод — короткая запись `exec()->fetchAll()`.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function fetchAll(?Converter $converter = null)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| converter | `Bitrix\Main\Text\Converter` или `null` | Задает преобразование значений. По умолчанию — `null` |

## Возвращаемое значение

Метод возвращает массив строк. Если строк нет, метод возвращает пустой массив.

## Примеры

**Пример.** Код получает коды языков:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::query()->setSelect(['LID'])->setOrder('LID')->fetchAll();

echo implode(',', array_column($rows, 'LID'));
```

Код выведет коды языков через запятую, например `en,ru`.

## Смотрите также

- [Query::fetch](fetch.md)
- [Query::fetchCollection](fetch-collection.md)
