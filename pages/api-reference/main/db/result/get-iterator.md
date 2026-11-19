---
title: Обойти результат в цикле Result::getIterator
description: Метод Result::getIterator возвращает итератор для обхода строк результата в цикле foreach.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::getIterator` возвращает итератор по строкам результата. PHP вызывает метод сам, когда код обходит объект `Result` в цикле `foreach`.

Сигнатура метода в классе `Bitrix\Main\DB\Result`:

```php
public function getIterator(): \Traversable
```

## Возвращаемое значение

Метод при каждом вызове возвращает новый объект `Bitrix\Main\DB\ResultIterator`. Итератор получает строки через [fetch](fetch.md), поэтому значения преобразованы так же.

Итератор читает строки с текущей позиции результата. Ключи каждый итератор отсчитывает с нуля, даже если часть строк код уже прочитал через `fetch`. Повторный `foreach` по тому же объекту `Result` создает новый итератор и продолжает чтение с текущей позиции. Строки, прочитанные в первом цикле, второй цикл не получит.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\NotSupportedException` | Код повторно перематывает тот же объект итератора, который уже продвинулся хотя бы на один шаг. Например, дважды обходит в `foreach` переменную `$iterator = $result->getIterator()` |

## Примеры

**Пример.** Код обходит результат в `foreach` и выводит номер и логин пользователя:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = Application::getConnection()->query(
    'SELECT ID, LOGIN FROM ' . UserTable::getTableName() . ' ORDER BY ID',
    3
);

foreach ($result as $index => $row)
{
    echo $index . ': ' . $row['LOGIN'] . PHP_EOL;
}
```

## Смотрите также

- [Result::fetch](fetch.md)
- [Result::fetchAll](fetch-all.md)
