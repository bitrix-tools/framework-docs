---
title: Зарегистрировать цепочку Query::registerChain
description: Служебный метод Query::registerChain регистрирует цепочку поля в разделе запроса — выборке, фильтре, группировке или сортировке.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::registerChain` регистрирует цепочку поля в общем списке запроса и в разделе — выборке, фильтре, группировке или сортировке. Запрос вызывает метод сам, когда строит SQL. Прикладному коду вызывать метод не нужно.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function registerChain($section, Chain $chain, $opt_key = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| section\* | `string` | Задает раздел — `select`, `filter`, `where`, `having`, `group`, `order`, `hidden`, `runtime` или `global` |
| chain\* | `Bitrix\Main\ORM\Query\Chain` | Задает цепочку |
| opt_key | `string` или `null` | Задает дополнительный ключ цепочки в разделе. По умолчанию — `null` |

Тип `section` и `opt_key` в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает зарегистрированную цепочку. Если цепочка с таким псевдонимом и определением уже есть, метод возвращает ее.

## Особенности

Если псевдоним совпал, а определение другое, например `AUTHOR_ID` и `AUTHOR.ID`, метод даст цепочке уникальный псевдоним вида `UALIAS_0`.

## Примеры

**Пример.** Код регистрирует цепочку поля в разделе сортировки:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Chain;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query();
$chain = Chain::getChainByDefinition($query->getEntity(), 'NAME');
$query->registerChain('order', $chain);

echo implode(',', array_keys($query->getOrderChains())) . ' ' . implode(',', array_keys($query->getChains()));
```

Код выведет `NAME NAME`.

## Смотрите также

- [Query::getRegisteredChain](get-registered-chain.md)
- [Query::getChains](get-chains.md)
