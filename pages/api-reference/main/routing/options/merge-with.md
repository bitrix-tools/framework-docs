---
title: Добавить настройки родительской группы Options::mergeWith
description: Метод Routing\Options::mergeWith добавляет к настройкам префикс, имя, регулярные выражения и промежуточные обработчики родительской группы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::mergeWith` добавляет к текущим настройкам настройки родительской группы. Конфигуратор маршрутов `RoutingConfigurator` вызывает метод, когда метод `group` открывает вложенную группу.

Сигнатура метода в классе `Bitrix\Main\Routing\Options`:

```php
public function mergeWith($anotherOptions)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| anotherOptions\* | `Bitrix\Main\Routing\Options` | Задает настройки родительской группы |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

Метод переносит из настроек группы:

- регулярные выражения `where` — объединяет с текущими, при совпадении имен метод оставляет выражения группы,
- промежуточные обработчики — добавляет к текущим,
- собственный префикс группы — добавляет в префиксы родительских групп,
- собственное имя группы — добавляет в имена родительских групп.

Метод не переносит HTTP-методы, значения по умолчанию и домен.

## Особенности

Во вложенных группах маршрут получает промежуточные обработчики внешней группы дважды. Например, группа с обработчиком `A` и вложенная в нее группа с обработчиком `B` дают маршруту список `A, A, B`, и ядро вызовет `A` два раза.

## Примеры

**Пример.** Код добавляет настройки группы и выводит полный префикс, полное имя и выражения:

```php
<?php
use Bitrix\Main\Routing\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$group = new Options();
$group->prefix('v1');
$group->name('v1.');
$group->where('id', '\d+');

$options = new Options();
$options->prefix('units');
$options->name('list');
$options->mergeWith($group);

echo $options->getFullPrefix() . ' ' . $options->getFullName() . ' ' . json_encode($options->getWhere());
```

Код выведет `/v1/units v1.list {"id":"\\d+"}`.

## Смотрите также

- [Options::getFullPrefix](get-full-prefix.md)
- [Options::getFullName](get-full-name.md)
- [Роутинг](../../../../framework/routing.md#group-parameters)
