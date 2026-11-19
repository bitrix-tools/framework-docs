---
title: Получить цепочку поля Query::getRegisteredChain
description: Метод Query::getRegisteredChain возвращает цепочку поля по имени или псевдониму и может создать ее.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::getRegisteredChain` возвращает цепочку поля по имени или псевдониму, например `NAME` или `GROUPS.GROUP_ID`. Если цепочки нет и `force_create` = `true`, метод строит ее и регистрирует.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function getRegisteredChain($key, $force_create = false)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| key\* | `string` | Задает имя поля, путь через связи или псевдоним |
| force_create | `bool` | Значение `true` создает цепочку, если ее нет. По умолчанию — `false` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\ORM\Query\Chain` или `false`, если цепочки нет и создание не разрешено.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException`, `Bitrix\Main\SystemException` | С `force_create` = `true` поле не найдено |

## Примеры

**Пример.** Код получает цепочку с созданием и без него:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query();

echo var_export($query->getRegisteredChain('NAME'), true) . ' ' . get_class($query->getRegisteredChain('NAME', true));
```

Код выведет `false Bitrix\Main\ORM\Query\Chain`.

## Смотрите также

- [Query::registerChain](register-chain.md)
