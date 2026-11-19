---
title: Получить управляемый кеш Application::getManagedCache
description: Метод Application::getManagedCache возвращает управляемый кеш. Код, который меняет данные, сбрасывает его запись по ключу, например по имени таблицы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Application::getManagedCache` возвращает управляемый кеш. Управляемый кеш привязывает запись к ключу, например к имени таблицы. Код, который меняет данные, сбрасывает запись по ключу методом `clean`, и следующий запрос читает свежие данные.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public function getManagedCache()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Data\ManagedCache`. Объект один на запрос.

## Особенности

Метод [terminate](terminate.md) сохраняет записи управляемого кеша в конце запроса.

## Примеры

**Пример.** Код читает запись, сохраняет ее и сбрасывает:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$cache = Application::getInstance()->getManagedCache();

if ($cache->read(3600, 'vendor_units'))
{
    $units = $cache->get('vendor_units');
}
else
{
    $units = ['kg', 'g'];
    $cache->setImmediate('vendor_units', $units);
}

echo implode(',', $units);
$cache->clean('vendor_units');
```

Код выведет `kg,g`.

## Смотрите также

- [Application::getTaggedCache](get-tagged-cache.md)
- [Кеширование](../../../performance/caching.md)
