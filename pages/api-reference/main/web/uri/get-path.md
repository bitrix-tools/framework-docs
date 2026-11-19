---
title: Получить путь Uri::getPath
description: Метод Uri::getPath возвращает путь адреса без строки запроса и фрагмента.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.15

{% endnote %}

Метод `Uri::getPath` возвращает путь адреса, например `/units/list.php`.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function getPath(): string
```

## Возвращаемое значение

Метод возвращает путь в том виде, в котором его передали. Метод не раскодирует путь. Если пути нет, метод возвращает пустую строку.

## Примеры

**Пример.** Код проверяет, что ссылка ведет в раздел `/units/`:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$path = (new Uri('https://example.com/units/list.php?page=2'))->getPath();

echo $path . ' ' . (str_starts_with($path, '/units/') ? 'units' : 'other');
```

Код выведет `/units/list.php units`.

## Смотрите также

- [Uri::setPath](set-path.md)
- [Uri::getPathQuery](get-path-query.md)
