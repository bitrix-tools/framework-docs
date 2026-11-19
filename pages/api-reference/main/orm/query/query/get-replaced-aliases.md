---
title: Получить замененные псевдонимы Query::getReplacedAliases
description: Метод Query::getReplacedAliases возвращает псевдонимы полей, которые запрос заменил короткими, потому что база данных не принимает длинные.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::getReplacedAliases` возвращает псевдонимы полей, которые запрос заменил короткими. Запрос заменяет псевдоним, если он длиннее, чем допускает база данных, — для MySQL это 256 символов. Результат запроса сам возвращает в строках исходные псевдонимы.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function getReplacedAliases()
```

## Возвращаемое значение

Метод возвращает массив `короткий псевдоним => исходный псевдоним`. Если замен не было, массив пустой.

## Примеры

**Пример.** Код выбирает поле с очень длинным псевдонимом:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$alias = str_repeat('LONG_', 60) . 'NAME';
$query = LanguageTable::query()->setSelect([$alias => 'NAME'])->setLimit(1);
$row = $query->fetch();

echo count($query->getReplacedAliases()) . ' ' . var_export(array_key_exists($alias, $row), true);
```

Код выведет `1 true`.

## Смотрите также

- [Query::getQuery](get-query.md)
