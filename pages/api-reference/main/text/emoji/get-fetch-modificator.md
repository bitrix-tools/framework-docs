---
title: Получить обработчик выборки Emoji::getFetchModificator
description: Метод Emoji::getFetchModificator возвращает массив обработчиков для параметра fetch_data_modification поля ORM.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Emoji::getFetchModificator` возвращает обработчики для параметра `fetch_data_modification` поля ORM. При выборке поле вызывает [decode](decode.md) и восстанавливает эмодзи из кодов.

Сигнатура метода в классе `Bitrix\Main\Text\Emoji`:

```php
public static function getFetchModificator()
```

## Возвращаемое значение

Метод возвращает массив из одного обработчика — `[Emoji::class, 'decode']`.

## Примеры

**Пример.** Код выводит обработчики, которые получит поле:

```php
<?php
use Bitrix\Main\Text\Emoji;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

print_r(Emoji::getFetchModificator());
```

Пример подключения к полю — на странице [getSaveModificator](get-save-modificator.md).

## Смотрите также

- [Emoji::getSaveModificator](get-save-modificator.md)
- [Emoji::decode](decode.md)
