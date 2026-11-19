---
title: Получить смещение Query::getOffset
description: Метод Query::getOffset возвращает смещение выборки запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::getOffset` возвращает смещение, которое задал [setOffset](set-offset.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function getOffset()
```

## Возвращаемое значение

Метод возвращает число или `null`, если смещение не задано.

## Примеры

**Пример.** Код задает смещение и читает его:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::query()->setOffset(40)->getOffset();
```

Код выведет `40`.

## Смотрите также

- [Query::setOffset](set-offset.md)
