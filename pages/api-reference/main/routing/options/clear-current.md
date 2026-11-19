---
title: Сбросить собственные префикс и имя Options::clearCurrent
description: Метод Routing\Options::clearCurrent сбрасывает собственные префикс и имя в настройках и оставляет префиксы и имена родительских групп.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::clearCurrent` сбрасывает собственные префикс и имя в настройках. Конфигуратор маршрутов `RoutingConfigurator` вызывает метод для копии своих настроек, когда метод `group` клонирует конфигуратор для вложенной группы. В этих настройках собственных префикса и имени нет, поэтому в штатном потоке вызов ничего не меняет.

Сигнатура метода в классе `Bitrix\Main\Routing\Options`:

```php
public function clearCurrent()
```

## Возвращаемое значение

Метод ничего не возвращает. Метод не меняет префиксы и имена родительских групп, регулярные выражения, промежуточные обработчики, HTTP-методы и значения по умолчанию.

## Примеры

**Пример.** Код задает префикс, имя и выражение и сбрасывает собственные значения:

```php
<?php
use Bitrix\Main\Routing\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options();
$options->prefix('units');
$options->name('units.');
$options->where('code', '[a-z]+');
$options->clearCurrent();

var_export([$options->hasPrefix(), $options->hasName(), $options->hasWhere('code')]);
```

Код выведет:

```text
array (
  0 => false,
  1 => false,
  2 => true,
)
```

## Смотрите также

- [Options::mergeWith](merge-with.md)
