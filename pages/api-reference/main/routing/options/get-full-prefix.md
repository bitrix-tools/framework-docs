---
title: Получить полный префикс Options::getFullPrefix
description: Метод Routing\Options::getFullPrefix возвращает префиксы родительских групп и собственный префикс через косую черту.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getFullPrefix` возвращает полный префикс маршрута — префиксы родительских групп и собственный префикс. Метод [Route::getUri](../route/get-uri.md) добавляет полный префикс перед шаблоном маршрута.

Сигнатура метода в классе `Bitrix\Main\Routing\Options`:

```php
public function getFullPrefix()
```

## Возвращаемое значение

Метод возвращает строку, которая начинается с `/`, части в ней разделяет `/`. Например, префиксы групп `v1` и `units` дают `/v1/units`. Если префиксов нет, метод возвращает `/`.

## Примеры

**Пример.** Код добавляет настройки родительской группы и выводит полный префикс:

```php
<?php
use Bitrix\Main\Routing\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$group = new Options();
$group->prefix('v1');

$options = new Options();
$options->prefix('units');
$options->mergeWith($group);

echo $options->getFullPrefix();
```

Код выведет `/v1/units`.

## Смотрите также

- [Options::prefix](prefix.md)
- [Options::mergeWith](merge-with.md)
