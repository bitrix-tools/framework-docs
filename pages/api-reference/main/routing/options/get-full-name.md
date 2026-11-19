---
title: Получить полное имя маршрута Options::getFullName
description: Метод Routing\Options::getFullName возвращает имена родительских групп и собственное имя маршрута без разделителя.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getFullName` возвращает полное имя маршрута — имена родительских групп и собственное имя. По этому имени метод [Router::route](../router/route.md) находит маршрут.

Сигнатура метода в классе `Bitrix\Main\Routing\Options`:

```php
public function getFullName()
```

## Возвращаемое значение

Метод возвращает строку из имен без разделителя. Например, группа `api.` и маршрут `unit` дают `api.unit`. Если собственного имени нет, метод возвращает пустую строку, даже если имена групп есть.

## Примеры

**Пример.** Код добавляет настройки родительской группы и выводит полное имя:

```php
<?php
use Bitrix\Main\Routing\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$group = new Options();
$group->name('api.');

$options = new Options();
$options->name('unit');
$options->mergeWith($group);

echo $options->getFullName();
```

Код выведет `api.unit`.

## Смотрите также

- [Options::name](name.md)
- [Options::mergeWith](merge-with.md)
