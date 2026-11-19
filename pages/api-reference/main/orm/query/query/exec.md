---
title: Выполнить запрос Query::exec
description: Метод Query::exec строит SQL, выполняет запрос и возвращает объект результата ORM.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::exec` строит SQL, выполняет запрос и возвращает [результат](../result/index.md). Если запрос включил кеш методом [setCacheTtl](set-cache-ttl.md), метод сначала ищет результат в кеше выборок.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function exec()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\ORM\Query\Result`. Строки из него читают методами `fetch`, `fetchAll`, `fetchObject`, `fetchCollection`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\SystemException` | Запрос содержит приватное поле без [enablePrivateFields](enable-private-fields.md), неизвестное поле или другую ошибку |
| `Bitrix\Main\DB\SqlQueryException` | База данных вернула ошибку |

## Особенности

- Запрос строит основные части SQL один раз. Изменения после первого `exec` или [getQuery](get-query.md) не попадут в SQL, кроме лимита, смещения и настроек объединения.
- Если в выборке нет первичного ключа, запрос добавляет его под служебным псевдонимом — и для основной, и для присоединенных сущностей. Объекты из `fetchObject` получат ключ, массивы из `fetch` — нет. С агрегацией, `DISTINCT` или объединением запрос ключ не добавляет. Если SQL раньше построил `getQuery()`, ключ тоже не появится.
- С [countTotal](count-total.md) результат хранит общее число записей — его возвращает `getCount()`.

## Примеры

**Пример.** Код выполняет запрос с подсчетом записей:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = LanguageTable::query()
    ->setSelect(['LID'])
    ->setOrder('LID')
    ->countTotal(true)
    ->exec();

echo get_class($result) . ' ' . $result->getCount() . ' ' . implode(',', array_column($result->fetchAll(), 'LID'));
```

Код выведет `Bitrix\Main\ORM\Query\Result 2 en,ru`. Список языков зависит от сайта.

## Смотрите также

- [Result](../result/index.md)
- [Query::fetchAll](fetch-all.md)
