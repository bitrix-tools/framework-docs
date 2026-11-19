---
title: Проверить таблицу множественных пользовательских полей Entity::isUtm
description: Метод Entity::isUtm проверяет, хранит ли таблица сущности значения множественных пользовательских полей.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::isUtm` проверяет, хранит ли таблица сущности значения множественных пользовательских полей. Такие значения хранят таблицы `b_utm_*`. Значение задает [DataManager::isUtm](../data/data-manager/is-utm.md), сущность читает его при создании.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function isUtm()
```

## Возвращаемое значение

Метод возвращает `true`, только если класс таблицы переопределил `DataManager::isUtm`. Иначе метод возвращает `false`.

Служебные сущности `b_utm_*`, которые ядро создает для таблиц с пользовательскими полями, этот метод не переопределяют. Для них метод тоже возвращает `false`.

## Примеры

**Пример.** Код проверяет сущность пользователей:

```php
<?php
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(UserTable::getEntity()->isUtm());
```

Код выведет `bool(false)`.

## Смотрите также

- [Entity::isUts](is-uts.md)
