---
title: Получить строку без преобразований Result::fetchRaw
description: Метод ORM\Query\Result::fetchRaw возвращает следующую строку выборки в том виде, в котором ее вернул драйвер базы данных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::fetchRaw` возвращает следующую строку в том виде, в котором ее вернул драйвер базы данных. Метод не преобразует значения, не переименовывает колонки и не убирает служебные поля. Метод вызывает [DB\Result::fetchRaw](../../../db/result/fetch-raw.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Result`:

```php
public function fetchRaw()
```

## Возвращаемое значение

Метод возвращает массив или `false`, если строк больше нет.

## Примеры

**Пример.** Код читает строку без преобразований:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$row = LanguageTable::getList(['select' => ['LID'], 'filter' => ['=LID' => 'en']])->fetchRaw();

var_export($row);
```

Код выведет:

```text
array (
  'LID' => 'en',
)
```

## Смотрите также

- [Result::fetch](fetch.md)
- [DB\Result::fetchRaw](../../../db/result/fetch-raw.md)
