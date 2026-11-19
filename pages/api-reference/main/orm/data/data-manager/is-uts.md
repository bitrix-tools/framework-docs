---
title: Проверить таблицу одиночных пользовательских полей DataManager::isUts
description: Метод DataManager::isUts отмечает класс таблицы как таблицу одиночных пользовательских полей b_uts_*. Базовый класс возвращает false.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::isUts` отмечает класс таблицы как таблицу значений одиночных пользовательских полей `b_uts_*`. Запрос по этому флагу особым образом присоединяет таблицу. Прикладному коду переопределять метод не нужно.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function isUts()
```

## Возвращаемое значение

Метод возвращает `true`, только если класс таблицы переопределил его. Базовый класс возвращает `false`.

## Особенности

Служебные сущности `b_uts_*`, которые ORM создает для таблиц с [getUfId](get-uf-id.md), метод не переопределяют и тоже возвращают `false`.

## Примеры

**Пример.** Код проверяет флаг у таблицы пользователей:

```php
<?php
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(UserTable::isUts());
```

Код выведет `bool(false)`.

## Смотрите также

- [DataManager::isUtm](is-utm.md)
- [DataManager::getUfId](get-uf-id.md)
