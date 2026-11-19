---
title: Создать объект из строки без исключения DateTime::tryParse
description: Метод DateTime::tryParse создает объект DateTime из строки, а если строка не подходит под формат, возвращает null.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DateTime::tryParse` создает объект из строки конструктором и перехватывает исключение `Bitrix\Main\ObjectException`. Вместо исключения метод возвращает `null`.

Сигнатура метода в классе `Bitrix\Main\Type\DateTime`:

```php
public static function tryParse($timeString, $format = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| timeString\* | `string` | Задает дату со временем строкой |
| format | `?string` | Задает маску PHP, например `'Y-m-d H:i:s'`. Если передать `null`, метод берет формат даты и времени из региональных настроек. По умолчанию — `null` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает объект `DateTime` или `null`, если строка пустая или конструктор не разобрал ее.

## Особенности

- Для значения `null` в `timeString` метод возвращает текущее время, а не `null`. Проверяйте значение на `null` до вызова.
- Метод разбирает строку так же нестрого, как конструктор. Например, несуществующий день переходит на следующий месяц.

## Примеры

**Пример.** Код разбирает значение из запроса и подставляет текущее время, если значение не подошло:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\Type\DateTime;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$value = (string)Application::getInstance()->getContext()->getRequest()->get('date_from');

$dateFrom = DateTime::tryParse($value, 'Y-m-d H:i') ?? new DateTime();

echo $dateFrom->format('Y-m-d H:i');
```

Код выведет значение параметра `date_from`, например `2026-01-15 10:00`. Без параметра код выведет текущие дату и время.

## Смотрите также

- [Date::isCorrect](../date/is-correct.md)
- [Date::__construct](../date/construct.md)
