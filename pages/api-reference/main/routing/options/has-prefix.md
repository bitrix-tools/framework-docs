---
title: Проверить, задан ли префикс Options::hasPrefix
description: Метод Routing\Options::hasPrefix проверяет, есть ли у настроек собственный префикс или префиксы родительских групп.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::hasPrefix` проверяет, есть ли у маршрута префикс. Метод [Route::getUri](../route/get-uri.md) добавляет префикс к шаблону, только если метод вернул `true`.

Сигнатура метода в классе `Bitrix\Main\Routing\Options`:

```php
public function hasPrefix()
```

## Возвращаемое значение

Метод возвращает `true`, если задан собственный префикс или префикс родительской группы, иначе `false`.

## Примеры

**Пример.** Код проверяет префикс до и после вызова `prefix`:

```php
<?php
use Bitrix\Main\Routing\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options();
$before = $options->hasPrefix();
$options->prefix('api');

var_export([$before, $options->hasPrefix()]);
```

Код выведет:

```text
array (
  0 => false,
  1 => true,
)
```

## Смотрите также

- [Options::prefix](prefix.md)
- [Options::getFullPrefix](get-full-prefix.md)
