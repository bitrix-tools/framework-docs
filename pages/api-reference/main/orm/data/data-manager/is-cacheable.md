---
title: Разрешить кеширование выборок DataManager::isCacheable
description: Метод DataManager::isCacheable разрешает или запрещает кеш выборок таблицы. Наследник переопределяет его, чтобы отключить кеш.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::isCacheable` разрешает или запрещает кеш выборок таблицы. Наследник переопределяет метод и возвращает `false`, если таблице кеш не нужен. Тогда методы записи не тратят время на очистку кеша.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function isCacheable(): bool
```

## Возвращаемое значение

Метод возвращает `true` или `false`. Базовый класс возвращает `true`.

## Особенности

Если метод возвращает `false`, ORM не кеширует выборки таблицы. Параметр `cache` в [getList](get-list.md) и [getCount](get-count.md) не действует, а [cleanCache](clean-cache.md) ничего не делает.

## Примеры

**Пример.** Код проверяет, разрешен ли кеш у таблицы языков:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(LanguageTable::isCacheable());
```

Код выведет `bool(true)`.

## Смотрите также

- [DataManager::cleanCache](clean-cache.md)
