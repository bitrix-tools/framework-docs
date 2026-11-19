---
title: Получить переменные окружения Context::getEnvironment
description: Метод Context::getEnvironment возвращает объект Environment с переменными окружения из массива $_ENV.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Context::getEnvironment` возвращает переменные окружения текущего запроса. Ядро передает в контекст массив `$_ENV`, метод создает из него объект при первом вызове.

Сигнатура метода в классе `Bitrix\Main\Context`:

```php
public function getEnvironment()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Environment` — словарь параметров. Запись по ключу через синтаксис массива объект запрещает. Метод `get` возвращает значение переменной или `null`, если переменной нет. Повторный вызов возвращает тот же объект.

Содержимое `$_ENV` зависит от настройки PHP `variables_order`. Если в ней нет буквы `E`, массив пустой, и метод `get` возвращает `null` для любой переменной.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `\TypeError` | Для контекста не вызывали [initialize](initialize.md) с ключом `env` в параметрах |

## Примеры

**Пример.** Код читает переменную окружения и подставляет значение по умолчанию:

```php
<?php
use Bitrix\Main\Context;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$mode = Context::getCurrent()->getEnvironment()->get('APP_MODE') ?? 'production';

echo $mode;
```

Если переменной `APP_MODE` нет в `$_ENV`, код выведет `production`.

## Смотрите также

- [Context::getServer](get-server.md)
