---
title: Получить сущность запроса Query::getEntity
description: Метод Query::getEntity возвращает сущность ORM запроса — копию сущности таблицы с полями этого запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::getEntity` возвращает [сущность](../../entity/index.md) запроса. Это копия сущности таблицы. В нее входят и поля, которые добавил [registerRuntimeField](register-runtime-field.md). Если запрос создали из другого запроса, это временная сущность подзапроса.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function getEntity()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\ORM\Entity`.

## Примеры

**Пример.** Код добавляет поле запроса и проверяет его в сущности запроса и таблицы:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Fields\ExpressionField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()->registerRuntimeField(new ExpressionField('LID_UP', 'UPPER(%s)', 'LID'));

var_dump($query->getEntity()->hasField('LID_UP'), LanguageTable::getEntity()->hasField('LID_UP'));
```

Код выведет:

```text
bool(true)
bool(false)
```

## Смотрите также

- [Entity](../../entity/index.md)
- [Query::registerRuntimeField](register-runtime-field.md)
