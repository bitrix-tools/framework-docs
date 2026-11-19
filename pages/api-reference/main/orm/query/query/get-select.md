---
title: Получить поля выборки Query::getSelect
description: Метод Query::getSelect возвращает поля выборки запроса в том виде, в каком их задали.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::getSelect` возвращает поля выборки в том виде, в каком их задали [setSelect](set-select.md) и [addSelect](add-select.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function getSelect()
```

## Возвращаемое значение

Метод возвращает массив. Поля без псевдонима лежат под числовыми ключами, поля с псевдонимом — под ключом-псевдонимом.

## Примеры

**Пример.** Код задает поля и читает их:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()->setSelect(['LID', 'NAME'])->addSelect('ACTIVE', 'IS_ACTIVE');

echo json_encode($query->getSelect());
```

Код выведет `{"0":"LID","1":"NAME","IS_ACTIVE":"ACTIVE"}`.

## Смотрите также

- [Query::setSelect](set-select.md)
