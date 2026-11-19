---
title: Собрать SQL-фрагмент SqlExpression::compile
description: Метод SqlExpression::compile подставляет значения в плейсхолдеры шаблона и возвращает SQL-фрагмент.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlExpression::compile` подставляет значения в плейсхолдеры шаблона и возвращает готовый SQL-фрагмент. Метод экранирует значения через `SqlHelper` соединения, которое возвращает [getConnection](get-connection.md).

Если соединение с базой данных еще не установлено, метод устанавливает его перед экранированием. В MySQL соединение нужно для плейсхолдеров `?`, `?s` и `?@`, в PostgreSQL — также для `?#` и `?v`.

Приведение объекта к строке, например `(string) $expression`, тоже вызывает `compile`.

Сигнатура метода в классе `Bitrix\Main\DB\SqlExpression`:

```php
public function compile()
```

## Возвращаемое значение

Метод возвращает строку `string` — шаблон, в котором плейсхолдеры заменены значениями. Таблица на странице [SqlExpression::__construct](construct.md#плейсхолдеры) описывает замену для каждого плейсхолдера.

Если в шаблоне нет плейсхолдеров, метод возвращает его без изменений. Последовательность `\?` в результате превращается в `?`.

При первом вызове метод запоминает в объекте соединение по умолчанию, если соединение не задано через [setConnection](set-connection.md). Для скалярных значений и дат повторный вызов возвращает тот же результат.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Значение для плейсхолдера `?@` не массив и не объект `Traversable` или не содержит элементов |
| `Bitrix\Main\DB\ConnectionException` | Метод устанавливает соединение с базой данных, и установить его не удалось |
| `Bitrix\Main\Config\ConfigurationException` | Метод получает соединение по умолчанию, а класс соединения из `.settings.php` не найден |
| `Bitrix\Main\NotImplementedException` | В шаблоне есть плейсхолдер `?v`, а соединение работает не с MySQL и не с PostgreSQL |

## Примеры

**Пример.** Код собирает условие для запроса и выводит результат:

```php
<?php
use Bitrix\Main\DB\SqlExpression;
use Bitrix\Main\Type\Date;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$expression = new SqlExpression(
    '?# = ?s AND ?# > ?',
    'NAME',
    "kg's",
    'DATE_REGISTER',
    new Date('2024-01-01', 'Y-m-d')
);

echo $expression->compile();
```

Для MySQL код выведет `` `NAME` = 'kg\'s' AND `DATE_REGISTER` > '2024-01-01' ``. Метод экранировал апостроф и преобразовал дату в формат базы данных.

**Пример.** Код выбирает пользователей по списку идентификаторов через плейсхолдер `?@`. Скобки вокруг списка стоят в самом шаблоне.

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\DB\SqlExpression;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$expression = new SqlExpression(
    'SELECT ID, LOGIN FROM ?# WHERE ID IN (?@)',
    UserTable::getTableName(),
    [1, 2, 3]
);

$result = Application::getConnection()->query($expression->compile());
while ($row = $result->fetch())
{
    echo $row['ID'] . ' ' . $row['LOGIN'] . PHP_EOL;
}
```

## Смотрите также

- [SqlExpression::__construct](construct.md)
- [SqlExpression::setConnection](set-connection.md)
