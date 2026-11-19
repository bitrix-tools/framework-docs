---
title: Получить функции преобразования Result::getConverters
description: Метод Result::getConverters возвращает функции, которыми fetch преобразует значения колонок.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::getConverters` возвращает функции, которыми [fetch](fetch.md) преобразует значения колонок. Результат заполняет список при создании по описанию колонок из [getFields](get-fields.md).

Сигнатура метода в классе `Bitrix\Main\DB\Result`:

```php
public function getConverters()
```

## Возвращаемое значение

Метод возвращает массив `имя колонки => функция`. Каждая функция принимает значение колонки и возвращает преобразованное значение.

По умолчанию в MySQL и PostgreSQL список содержит функции только для колонок даты и даты и времени. Они превращают значение в объект `Bitrix\Main\Type\Date` или `Bitrix\Main\Type\DateTime`. Если у объекта результата нет соединения, список пуст.

## Примеры

**Пример.** Код выводит колонки, значения которых `fetch` преобразует:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = Application::getConnection()->query(
    'SELECT ID, LOGIN, DATE_REGISTER, LAST_LOGIN FROM ' . UserTable::getTableName(),
    1
);

print_r(array_keys($result->getConverters()));
```

## Смотрите также

- [Result::setConverters](set-converters.md)
- [Result::fetch](fetch.md)
