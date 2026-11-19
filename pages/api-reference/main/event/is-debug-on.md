---
title: Проверить режим отладки Event::isDebugOn
description: Метод Event::isDebugOn проверяет, включен ли у события режим отладки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Event::isDebugOn` проверяет, включен ли у события режим отладки. Класс `EventManager` вызывает метод, когда обработчик выбросил исключение, и решает, сохранить исключение или передать дальше.

Сигнатура метода в классе `Bitrix\Main\Event`:

```php
public function isDebugOn()
```

## Возвращаемое значение

Метод возвращает `true`, если метод [turnDebugOn](turn-debug-on.md) включил режим отладки, иначе `false`. У нового события режим выключен.

## Примеры

**Пример.** Код проверяет режим до и после включения:

```php
<?php
use Bitrix\Main\Event;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$event = new Event('vendor.units', 'OnUnitAdd');
$before = $event->isDebugOn();
$event->turnDebugOn();

var_export([$before, $event->isDebugOn()]);
```

Код выведет:

```text
array (
  0 => false,
  1 => true,
)
```

## Смотрите также

- [Event::turnDebugOn](turn-debug-on.md)
