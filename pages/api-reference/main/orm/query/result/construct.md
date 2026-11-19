---
title: Создать результат ORM-выборки Result::__construct
description: Конструктор ORM\Query\Result оборачивает результат запроса к базе данных и связывает его с запросом ORM.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Конструктор `Result::__construct` создает результат ORM-выборки. Объект оборачивает результат запроса к базе данных и хранит запрос ORM, по которому [fetchObject](fetch-object.md) собирает объекты.

Прикладной код не создает объект сам. Метод `getList` таблицы ORM и метод `Query::exec` возвращают объект `Result`.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Result`:

```php
public function __construct(Query $query, BaseResult $result)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| query\* | `Bitrix\Main\ORM\Query\Query` | Задает запрос ORM, по которому ORM получила результат |
| result\* | `Bitrix\Main\DB\Result` | Задает результат запроса к базе данных |

## Примеры

**Пример.** Код получает результат через `getList` и проверяет его класс:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = LanguageTable::getList(['select' => ['LID']]);

echo get_class($result);
```

Код выведет `Bitrix\Main\ORM\Query\Result`.

## Смотрите также

- [Result::fetchObject](fetch-object.md)
