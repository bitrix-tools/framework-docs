---
title: Получить описание колонок Result::getFields
description: Метод ORM\Query\Result::getFields возвращает описание колонок результата объектами полей по типам в базе данных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::getFields` возвращает описание колонок результата. Метод вызывает [DB\Result::getFields](../../../db/result/get-fields.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Result`:

```php
public function getFields()
```

## Возвращаемое значение

Метод возвращает массив `имя колонки => объект`, где объект — наследник `Bitrix\Main\ORM\Fields\ScalarField`. Класс объекта зависит от типа колонки в базе данных, а не от описания поля в `getMap`.

## Примеры

**Пример.** Код выводит имена колонок результата:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = LanguageTable::getList(['select' => ['LID', 'NAME'], 'limit' => 1]);

echo implode(',', array_keys($result->getFields()));
```

Код выведет `LID,NAME`.

## Смотрите также

- [DB\Result::getFields](../../../db/result/get-fields.md)
