---
title: Проверить таблицу множественных пользовательских полей DataManager::isUtm
description: Метод DataManager::isUtm отмечает класс таблицы как таблицу множественных пользовательских полей b_utm_*. Базовый класс возвращает false.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::isUtm` отмечает класс таблицы как таблицу значений множественных пользовательских полей `b_utm_*`. Запрос по этому флагу особым образом присоединяет таблицу. Прикладному коду переопределять метод не нужно.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function isUtm()
```

## Возвращаемое значение

Метод возвращает `true`, только если класс таблицы переопределил его. Базовый класс возвращает `false`.

## Особенности

Служебные сущности `b_utm_*`, которые ORM создает для таблиц с [getUfId](get-uf-id.md), метод не переопределяют и тоже возвращают `false`.

## Примеры

**Пример.** Код проверяет флаг у таблицы пользователей:

```php
<?php
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(UserTable::isUtm());
```

Код выведет `bool(false)`.

## Смотрите также

- [DataManager::isUts](is-uts.md)
- [DataManager::getUfId](get-uf-id.md)
