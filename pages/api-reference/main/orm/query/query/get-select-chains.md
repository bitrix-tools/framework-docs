---
title: Получить цепочки выборки Query::getSelectChains
description: Метод Query::getSelectChains возвращает цепочки полей выборки запроса по псевдонимам.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::getSelectChains` возвращает цепочки полей выборки. Ключи — псевдонимы полей в результате.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function getSelectChains()
```

## Возвращаемое значение

Метод возвращает массив объектов `Bitrix\Main\ORM\Query\Chain`. До построения SQL массив пустой.

## Особенности

Метод [exec](exec.md) добавляет в цепочки выборки первичный ключ под псевдонимом вида `UALIAS_0`, если его нет в выборке и в запросе нет агрегации, `DISTINCT` и объединения.

## Примеры

**Пример.** Код строит запрос и выводит псевдонимы выборки:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()->setSelect(['LID', 'TITLE' => 'NAME']);
$query->getQuery();

echo implode(',', array_keys($query->getSelectChains()));
```

Код выведет `LID,TITLE`.

## Смотрите также

- [Query::getChains](get-chains.md)
