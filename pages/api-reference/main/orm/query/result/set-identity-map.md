---
title: Задать реестр объектов Result::setIdentityMap
description: Метод ORM\Query\Result::setIdentityMap задает реестр объектов, чтобы разные выборки возвращали один объект для одной записи.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::setIdentityMap` задает реестр объектов `Bitrix\Main\ORM\Objectify\IdentityMap`. Реестр хранит объекты, которые прочитал [fetchObject](fetch-object.md), по первичному ключу. Если передать один реестр нескольким выборкам, они вернут один и тот же объект для одной записи. Значения из разных выборок попадут в этот объект.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Result`:

```php
public function setIdentityMap(IdentityMap $map)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| map\* | `Bitrix\Main\ORM\Objectify\IdentityMap` | Задает реестр объектов |

## Возвращаемое значение

Метод возвращает тот же объект `Result`.

## Особенности

Вызывайте метод до первого `fetchObject` или `fetchCollection`. Без вызова каждый результат создает свой реестр, и две выборки одной записи вернут разные объекты.

## Примеры

**Пример.** Код читает один язык двумя запросами в один объект:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Objectify\IdentityMap;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$map = new IdentityMap();

$first = LanguageTable::getList(['select' => ['LID', 'NAME'], 'filter' => ['=LID' => 'en']])
    ->setIdentityMap($map)
    ->fetchObject();

$second = LanguageTable::getList(['select' => ['LID', 'SORT'], 'filter' => ['=LID' => 'en']])
    ->setIdentityMap($map)
    ->fetchObject();

echo var_export($first === $second, true) . ' ' . $second->getName();
```

Код выведет `true English`.

## Смотрите также

- [Result::getIdentityMap](get-identity-map.md)
