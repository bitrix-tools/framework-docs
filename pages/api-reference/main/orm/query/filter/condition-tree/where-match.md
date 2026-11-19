---
title: Добавить полнотекстовый поиск ConditionTree::whereMatch
description: Метод ConditionTree::whereMatch добавляет условие полнотекстового поиска MATCH AGAINST в логическом режиме.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 17.5.5

{% endnote %}

Метод `ConditionTree::whereMatch` добавляет условие полнотекстового поиска. В MySQL метод строит `MATCH (поле) AGAINST ('значение' IN BOOLEAN MODE)`.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function whereMatch($column, $value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| column\* | `string` | Задает имя поля |
| value\* | `string` | Задает строку поиска в синтаксисе логического режима, например `'kilo*'` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает тот же объект `ConditionTree`.

## Особенности

- Для поиска колонка таблицы должна иметь полнотекстовый индекс. Без индекса база данных вернет ошибку при выполнении запроса.
- Метод `Bitrix\Main\ORM\Query\Filter\Helper::matchAgainstWildcard` готовит строку из слов пользователя. Для MySQL он ставит перед словами `+`, после них `*` и отбрасывает слова короче 3 символов. Если подходящих слов нет, он вернет пустую строку — проверьте результат до вызова.

## Примеры

**Пример.** Код строит запрос с полнотекстовым поиском и проверяет SQL без выполнения:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$sql = LanguageTable::query()
    ->setSelect(['LID'])
    ->whereMatch('NAME', 'eng*')
    ->getQuery();

echo str_contains($sql, "AGAINST ('eng*' IN BOOLEAN MODE)") ? 'match query' : 'other';
```

На сайте с MySQL код выведет `match query`.

## Смотрите также

- [ConditionTree::whereNotMatch](where-not-match.md)
- [ConditionTree::whereLike](where-like.md)
