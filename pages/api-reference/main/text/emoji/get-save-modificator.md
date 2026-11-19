---
title: Получить обработчик сохранения Emoji::getSaveModificator
description: Метод Emoji::getSaveModificator возвращает массив обработчиков для параметра save_data_modification поля ORM.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Emoji::getSaveModificator` возвращает обработчики для параметра `save_data_modification` поля ORM. Перед сохранением поле вызывает [encode](encode.md) и заменяет эмодзи кодами.

Сигнатура метода в классе `Bitrix\Main\Text\Emoji`:

```php
public static function getSaveModificator()
```

## Возвращаемое значение

Метод возвращает массив из одного обработчика — `[Emoji::class, 'encode']`.

## Примеры

**Пример.** Код подключает к полю ORM обработчики сохранения и выборки и выводит число обработчиков сохранения:

```php
<?php
use Bitrix\Main\ORM\Fields\StringField;
use Bitrix\Main\Text\Emoji;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$field = new StringField('TITLE', [
    'save_data_modification' => [Emoji::class, 'getSaveModificator'],
    'fetch_data_modification' => [Emoji::class, 'getFetchModificator'],
]);

echo count($field->getSaveDataModifiers());
```

## Смотрите также

- [Emoji::getFetchModificator](get-fetch-modificator.md)
- [Emoji::encode](encode.md)
