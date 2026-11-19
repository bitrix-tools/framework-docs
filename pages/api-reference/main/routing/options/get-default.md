---
title: Получить значения параметров по умолчанию Options::getDefault
description: Метод Routing\Options::getDefault возвращает значение по умолчанию одного параметра или всех параметров маршрута.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getDefault` возвращает значения параметров по умолчанию, которые задал метод [default](default.md).

Сигнатура метода в классе `Bitrix\Main\Routing\Options`:

```php
public function getDefault($parameter = null)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| parameter | `?string` | Задает имя параметра. По умолчанию — `null`, тогда метод возвращает все значения |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Если передать имя параметра, метод возвращает его значение. Без аргумента метод возвращает массив, где ключи — имена параметров.

Если значения для параметра нет, метод возвращает `null`, а PHP выдает предупреждение о несуществующем ключе массива. Перед вызовом с именем проверьте параметр методом [hasDefault](has-default.md).

## Примеры

**Пример.** Код выводит значение одного параметра и все значения:

```php
<?php
use Bitrix\Main\Routing\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options();
$options->default('page', '1');
$options->default('view', 'list');

echo $options->getDefault('page') . ' ' . json_encode($options->getDefault());
```

Код выведет `1 {"page":"1","view":"list"}`.

## Смотрите также

- [Options::default](default.md)
- [Options::hasDefault](has-default.md)
