---
title: Проверить таблицу одиночных пользовательских полей Entity::isUts
description: Метод Entity::isUts проверяет, хранит ли таблица сущности значения одиночных пользовательских полей.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::isUts` проверяет, хранит ли таблица сущности значения одиночных пользовательских полей. Такие значения хранят таблицы `b_uts_*`. Значение задает [DataManager::isUts](../data/data-manager/is-uts.md), сущность читает его при создании.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function isUts()
```

## Возвращаемое значение

Метод возвращает `true`, только если класс таблицы переопределил `DataManager::isUts`. Иначе метод возвращает `false`.

Служебные сущности `b_uts_*`, которые ядро создает для таблиц с пользовательскими полями, этот метод не переопределяют. Для них метод тоже возвращает `false`.

## Примеры

**Пример.** Код проверяет сущность пользователей:

```php
<?php
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(UserTable::getEntity()->isUts());
```

Код выведет `bool(false)`.

## Смотрите также

- [Entity::isUtm](is-utm.md)
- [Entity::getUfId](get-uf-id.md)
