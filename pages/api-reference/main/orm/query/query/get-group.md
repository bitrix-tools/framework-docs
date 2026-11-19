---
title: Получить поля группировки Query::getGroup
description: Метод Query::getGroup возвращает поля, которые задали для GROUP BY.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::getGroup` возвращает поля группировки — те, что задали [setGroup](set-group.md) и [addGroup](add-group.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function getGroup()
```

## Возвращаемое значение

Метод возвращает массив имен полей.

## Особенности

Если в запросе есть агрегация, запрос сам добавит в `GROUP BY` поля выборки, сортировки и `HAVING` без агрегатных функций. Метод их не возвращает.

## Примеры

**Пример.** Код задает группировку и читает ее:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo json_encode(LanguageTable::query()->setGroup('ACTIVE')->addGroup('DEF')->getGroup());
```

Код выведет `["ACTIVE","DEF"]`.

## Смотрите также

- [Query::setGroup](set-group.md)
