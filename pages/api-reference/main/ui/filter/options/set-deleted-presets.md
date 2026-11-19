---
title: Заменить список удаленных пресетов Options::setDeletedPresets
description: Метод Options::setDeletedPresets заменяет список удаленных пресетов фильтра.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::setDeletedPresets` заменяет список удаленных пресетов. Пустой массив очищает список.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function setDeletedPresets($deletedPresets = [])
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| deletedPresets | `array` | Задает список — массив `код пресета => true`. По умолчанию — пустой массив |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код отмечает пресет как удаленный и очищает список:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter');
$options->setDeletedPresets(['heavy' => true]);
$marked = $options->isDeletedPreset('heavy');
$options->setDeletedPresets();

var_dump($marked, $options->isDeletedPreset('heavy'));
```

Код выведет:

```text
bool(true)
bool(false)
```

## Смотрите также

- [Options::isDeletedPreset](is-deleted-preset.md)
