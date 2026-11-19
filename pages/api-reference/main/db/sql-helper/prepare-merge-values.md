---
title: Подготовить вставку значений с обновлением SqlHelper::prepareMergeValues
description: Метод SqlHelper::prepareMergeValues строит один запрос, который добавляет несколько строк и обновляет строки с совпадающим ключом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::prepareMergeValues` строит один запрос, который добавляет несколько строк и обновляет строки с совпадающим ключом. Метод готовит значения через [prepareInsert](prepare-insert.md) и собирает запрос через [prepareMergeSelect](prepare-merge-select.md).

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function prepareMergeValues(string $tableName, array $primaryFields, array $insertRows, array $updateFields = []): string
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| tableName\* | `string` | Задает имя таблицы. Таблица должна существовать |
| primaryFields\* | `string[]` | Задает колонки уникального ключа. Метод сравнивает их с именами колонок строк с учетом регистра |
| insertRows\* | `array[]` | Задает строки в виде массивов `имя колонки => значение`. Список колонок метод берет из первой строки, поэтому у всех строк он должен совпадать |
| updateFields | `array` | Задает обновление при совпадении ключа. Элемент без ключа, например `'CNT'`, обновляет колонку значением из добавляемой строки. Элемент `имя колонки => значение` задает новое значение. По умолчанию — пустой массив, метод обновляет все колонки, кроме `primaryFields`, значениями из добавляемой строки |

## Возвращаемое значение

Метод возвращает строку `string` — текст запроса. Значение из добавляемой строки метод подставляет через плейсхолдер `?v` объекта `SqlExpression`.

Если `updateFields` пуст и в строках нет колонок кроме `primaryFields`, метод выдает предупреждение `E_USER_WARNING`. В таком случае используйте [getInsertIgnore](get-insert-ignore.md) или задайте `updateFields`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\NotImplementedException` | Соединение работает не с MySQL и не с PostgreSQL. Базовый класс не реализует метод [prepareMergeSelect](prepare-merge-select.md) |
| `Bitrix\Main\DB\SqlQueryException` | В MySQL таблицы нет |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |
| `Bitrix\Main\ArgumentException` | Код передал для колонки даты и времени непустое значение, но не объект `Bitrix\Main\Type\Date` |
| `\Error` | Код передал для колонки даты без времени непустое значение, но не объект `Bitrix\Main\Type\Date` |

## Примеры

**Пример.** Код добавляет две строки. У существующей строки `kg` запрос заменяет значение счетчика значением из добавляемой строки:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

$connection->queryExecute('CREATE TABLE demo_api_counters (CODE VARCHAR(20) NOT NULL PRIMARY KEY, CNT INT NOT NULL)');

try
{
    $connection->queryExecute("INSERT INTO demo_api_counters (CODE, CNT) VALUES ('kg', 1)");

    $sql = $helper->prepareMergeValues('demo_api_counters', ['CODE'], [
        ['CODE' => 'kg', 'CNT' => 10],
        ['CODE' => 'm', 'CNT' => 20],
    ]);
    $connection->queryExecute($sql);

    print_r($connection->query('SELECT CODE, CNT FROM demo_api_counters ORDER BY CODE')->fetchAll());
}
finally
{
    $connection->dropTable('demo_api_counters');
}
```

## Смотрите также

- [SqlHelper::prepareMergeSelect](prepare-merge-select.md)
- [SqlHelper::values](values.md)
