---
title: Получить время жизни кеша Entity::getCacheTtl
description: Метод Entity::getCacheTtl возвращает время жизни кеша выборок сущности с учетом ограничений из .settings.php.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 16.5.10

{% endnote %}

Метод `Entity::getCacheTtl` возвращает время жизни кеша выборок сущности. Метод ограничивает желаемое время настройками секции `cache_flags` файла `.settings.php`. Настройки ниже ограничивают время жизни кеша таблицы `b_language` от 600 до 3600 секунд.

```php
'cache_flags' => [
    'value' => [
        'b_language_min_ttl' => 600,
        'b_language_max_ttl' => 3600,
    ],
],
```

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getCacheTtl($ttl)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| ttl\* | `int` | Задает желаемое время жизни в секундах |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает время жизни в секундах.

- Если [DataManager::isCacheable](../data/data-manager/is-cacheable.md) возвращает `false`, метод возвращает `0`.
- Ключ `<таблица>_min_ttl` поднимает время до минимума.
- Ключ `<таблица>_max_ttl` опускает время до максимума. Максимум важнее минимума, значение `0` выключает кеш таблицы.

## Примеры

**Пример.** Код получает время жизни кеша без ограничений в настройках:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::getEntity()->getCacheTtl(3600);
```

Код выведет `3600`.

## Смотрите также

- [Entity::readFromCache](read-from-cache.md)
- [Entity::cleanCache](clean-cache.md)
