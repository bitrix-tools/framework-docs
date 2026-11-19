---
title: Получить регулярные выражения параметров Options::getWhere
description: Метод Routing\Options::getWhere возвращает регулярное выражение одного параметра или всех параметров маршрута.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getWhere` возвращает регулярные выражения параметров маршрута, которые задал метод [where](where.md).

Сигнатура метода в классе `Bitrix\Main\Routing\Options`:

```php
public function getWhere($parameter = null)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| parameter | `?string` | Задает имя параметра. По умолчанию — `null`, тогда метод возвращает все выражения |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Если передать имя параметра, метод возвращает его выражение строкой. Без аргумента метод возвращает массив, где ключи — имена параметров, значения — выражения.

Если выражения для параметра нет, метод возвращает `null`, а PHP выдает предупреждение о несуществующем ключе массива. Перед вызовом с именем проверьте параметр методом [hasWhere](has-where.md).

## Примеры

**Пример.** Код выводит выражение одного параметра и все выражения:

```php
<?php
use Bitrix\Main\Routing\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options();
$options->where('code', '[a-z]+');
$options->where('page', '\d+');

echo $options->getWhere('code') . ' ' . json_encode($options->getWhere());
```

Код выведет `[a-z]+ {"code":"[a-z]+","page":"\\d+"}`.

## Смотрите также

- [Options::where](where.md)
- [Options::hasWhere](has-where.md)
