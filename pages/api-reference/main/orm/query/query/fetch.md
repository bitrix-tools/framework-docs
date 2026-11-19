---
title: Получить первую строку Query::fetch
description: Метод Query::fetch выполняет запрос и возвращает первую строку результата массивом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::fetch` выполняет запрос и возвращает первую строку результата. Метод — короткая запись `exec()->fetch()`.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function fetch(?Converter $converter = null)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| converter | `Bitrix\Main\Text\Converter` или `null` | Задает преобразование значений, например `Converter::getHtmlConverter()` для экранирования HTML. По умолчанию — `null` |

## Возвращаемое значение

Метод возвращает массив `поле => значение` или `false`, если строк нет.

## Особенности

Каждый вызов выполняет запрос заново. Чтобы прочитать несколько строк, используйте [exec](exec.md) и `fetch()` результата.

## Примеры

**Пример.** Код получает одну строку:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$row = LanguageTable::query()->setSelect(['LID'])->where('LID', 'ru')->fetch();

echo json_encode($row);
```

Код выведет `{"LID":"ru"}`.

## Смотрите также

- [Query::fetchAll](fetch-all.md)
- [Query::exec](exec.md)
