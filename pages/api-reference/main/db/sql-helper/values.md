---
title: Сослаться на значение добавляемой строки SqlHelper::values
description: Метод SqlHelper::values возвращает ссылку на значение колонки из добавляемой строки для части UPDATE в запросе вставки с обновлением.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::values` возвращает ссылку на значение колонки из строки, которую добавляет запрос. Ссылка нужна в части обновления запроса вставки, если строка с таким ключом уже есть. Плейсхолдер `?v` объекта [SqlExpression](../sql-expression/index.md) вызывает этот метод.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function values($identifier)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| identifier\* | `string` | Задает имя колонки. Метод берет его в кавычки через [quote](quote.md) |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку `string`.

| Реализация | Значение |
| --- | --- |
| `MysqliSqlHelper` | `` VALUES(`<identifier>`) `` для `ON DUPLICATE KEY UPDATE` |
| `PgsqlSqlHelper` | `EXCLUDED."<identifier>"` для `ON CONFLICT ... DO UPDATE`. Имя колонки метод приводит к нижнему регистру |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\ConnectionException` | В PostgreSQL подключиться к базе данных не удалось |
| `Bitrix\Main\NotImplementedException` | Соединение работает не с MySQL и не с PostgreSQL. Базовый класс не реализует метод |

## Примеры

**Пример.** Код выводит выражение, которое увеличивает счетчик на значение из добавляемой строки:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$helper = Application::getConnection()->getSqlHelper();

echo $helper->quote('CNT') . ' = ' . $helper->quote('CNT') . ' + ' . $helper->values('CNT');
```

Для MySQL код выведет `` `CNT` = `CNT` + VALUES(`CNT`) ``.

## Смотрите также

- [SqlHelper::prepareMerge](prepare-merge.md)
- [SqlHelper::prepareMergeValues](prepare-merge-values.md)
