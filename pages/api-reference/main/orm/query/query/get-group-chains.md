---
title: Получить цепочки группировки Query::getGroupChains
description: Метод Query::getGroupChains возвращает цепочки полей группировки запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::getGroupChains` возвращает цепочки полей группировки из [setGroup](set-group.md) и цепочки, которые запрос добавил сам при агрегации.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function getGroupChains()
```

## Возвращаемое значение

Метод возвращает массив объектов `Bitrix\Main\ORM\Query\Chain`. До построения SQL массив пустой.

## Примеры

**Пример.** Код группирует языки и выводит цепочки группировки:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()->setSelect(['ACTIVE', Query::expr('CNT')->count('LID')])->setGroup('ACTIVE');
$query->getQuery();

echo implode(',', array_keys($query->getGroupChains()));
```

Код выведет `ACTIVE`.

## Смотрите также

- [Query::setGroup](set-group.md)
