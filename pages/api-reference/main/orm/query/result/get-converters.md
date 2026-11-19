---
title: Получить функции преобразования Result::getConverters
description: Метод ORM\Query\Result::getConverters возвращает функции, которые fetch применяет к значениям колонок.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::getConverters` возвращает функции преобразования значений колонок. Метод [fetch](fetch.md) применяет их к каждой строке, например превращает строку с датой в объект `DateTime`. Метод вызывает [DB\Result::getConverters](../../../db/result/get-converters.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Result`:

```php
public function getConverters()
```

## Возвращаемое значение

Метод возвращает массив `имя колонки => функция`. Если в результате нет колонок, которые нужно преобразовать, метод возвращает пустой массив.

## Примеры

**Пример.** Код выводит колонки с преобразованием в выборке пользователей:

```php
<?php
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = UserTable::getList(['select' => ['ID', 'DATE_REGISTER'], 'limit' => 1]);

echo implode(',', array_keys($result->getConverters()));
```

Код выведет `DATE_REGISTER`.

## Смотрите также

- [Result::setConverters](set-converters.md)
