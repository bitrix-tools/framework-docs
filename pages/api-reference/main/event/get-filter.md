---
title: Получить фильтр модулей обработчиков Event::getFilter
description: Метод Event::getFilter возвращает массив кодов модулей, обработчики которых вызовет событие, или null.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Event::getFilter` возвращает фильтр модулей обработчиков. Класс `EventManager` вызывает только обработчики модулей из фильтра.

Сигнатура метода в классе `Bitrix\Main\Event`:

```php
public function getFilter()
```

## Возвращаемое значение

Метод возвращает массив кодов модулей или `null`, если фильтр не задан. Если фильтр задали строкой в конструкторе или в [setFilter](set-filter.md), метод возвращает массив из одного элемента.

## Примеры

**Пример.** Код задает фильтр строкой и выводит его:

```php
<?php
use Bitrix\Main\Event;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$event = new Event('vendor.units', 'OnUnitAdd', [], 'vendor.catalog');

var_export($event->getFilter());
```

Код выведет:

```text
array (
  0 => 'vendor.catalog',
)
```

## Смотрите также

- [Event::setFilter](set-filter.md)
