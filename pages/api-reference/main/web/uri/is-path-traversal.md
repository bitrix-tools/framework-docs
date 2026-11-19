---
title: Проверить путь на переход вверх Uri::isPathTraversal
description: Метод Uri::isPathTraversal проверяет, есть ли в пути сегмент .. в открытом или URL-кодированном виде.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Uri::isPathTraversal` проверяет, есть ли в пути переход в родительский каталог `..`. Метод нужен, чтобы отклонить путь от пользователя, если путь выходит за пределы разрешенного каталога.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function isPathTraversal(): bool
```

## Возвращаемое значение

Метод возвращает `true`, если путь содержит сегмент из двух и более точек между разделителями `/` или `\`. Метод находит и закодированные варианты, например `%2e%2e` и `%252e%252e`. Иначе метод возвращает `false`.

## Особенности

Метод проверяет только путь и пропускает строку запроса и фрагмент.

## Примеры

**Пример.** Код проверяет несколько путей:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

foreach (['/upload/../bitrix/', '/upload/%2e%2e/x', '/upload/b..c/'] as $path)
{
    echo $path . '=' . var_export((new Uri($path))->isPathTraversal(), true) . ' ';
}
```

Код выведет `/upload/../bitrix/=true /upload/%2e%2e/x=true /upload/b..c/=false`.

## Смотрите также

- [Uri::getPath](get-path.md)
