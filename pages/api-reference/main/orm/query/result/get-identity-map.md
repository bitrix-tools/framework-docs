---
title: Получить реестр объектов Result::getIdentityMap
description: Метод ORM\Query\Result::getIdentityMap возвращает реестр объектов, который заполнили fetchObject и fetchCollection.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::getIdentityMap` возвращает реестр объектов результата. Реестр нужен, чтобы передать его следующей выборке через [setIdentityMap](set-identity-map.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Result`:

```php
public function getIdentityMap()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\ORM\Objectify\IdentityMap`. До первого вызова [fetchObject](fetch-object.md) или [fetchCollection](fetch-collection.md) метод возвращает `null`, если метод `setIdentityMap` не задал реестр.

## Примеры

**Пример.** Код передает реестр первой выборки второй:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = LanguageTable::getList(['select' => ['LID'], 'filter' => ['=LID' => 'en']]);
$before = $result->getIdentityMap();
$first = $result->fetchObject();

$second = LanguageTable::getList(['select' => ['LID'], 'filter' => ['=LID' => 'en']])
    ->setIdentityMap($result->getIdentityMap())
    ->fetchObject();

echo var_export($before, true) . ' ' . var_export($first === $second, true);
```

Код выведет `NULL true`.

## Смотрите также

- [Result::setIdentityMap](set-identity-map.md)
