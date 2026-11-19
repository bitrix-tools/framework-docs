---
title: Проверить обработчики строк Query::isFetchModificationRequired
description: Служебный метод Query::isFetchModificationRequired проверяет, есть ли у полей выборки обработчики строк результата, и запоминает их.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.5.1

{% endnote %}

Метод `Query::isFetchModificationRequired` проверяет, есть ли у полей выборки обработчики строк результата, и запоминает их для [fetchDataModificationCallback](fetch-data-modification-callback.md). Запрос вызывает метод сам после выполнения. Прикладному коду вызывать метод не нужно.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function isFetchModificationRequired()
```

## Возвращаемое значение

Метод возвращает `true`, если хотя бы у одного поля выборки есть обработчик, иначе `false`.

## Особенности

Метод проверяет цепочки выборки, поэтому до построения SQL вернет `false`.

## Примеры

**Пример.** Код проверяет запрос с обработчиком поля:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Fields\ExpressionField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$field = new ExpressionField('LID_UP', 'UPPER(%s)', 'LID');
$field->addFetchDataModifier(fn($value) => $value);

$query = LanguageTable::query()->setSelect([$field]);
$query->getQuery();

var_dump($query->isFetchModificationRequired());
```

Код выведет `bool(true)`.

## Смотрите также

- [Query::fetchDataModificationCallback](fetch-data-modification-callback.md)
