---
title: Завершить набор Asset::stopTarget
description: Метод Asset::stopTarget завершает текущий набор и возвращает набор шаблона или страницы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::stopTarget` завершает текущий набор. Следующие файлы попадут в набор шаблона, если он открыт, иначе — в набор страницы.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function stopTarget($id = '')
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| id | `string` | Значение `TEMPLATE` завершает набор шаблона. Другие значения метод не учитывает и завершает текущий набор. По умолчанию — пустая строка |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`. Если текущий набор — `TEMPLATE`, а `id` не равен `TEMPLATE`, метод ничего не делает и возвращает `false`.

## Примеры

**Пример.** Код начинает свой набор, завершает его и читает текущий набор:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->startTarget('units');
$asset->stopTarget();

echo $asset->getTargetName();
```

Код выведет `TEMPLATE`. В консольном скрипте набор шаблона открыт с начала запроса.

## Смотрите также

- [Asset::startTarget](start-target.md)
