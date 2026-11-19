---
title: Проверить право на операцию CurrentUser::canDoOperation
description: Метод CurrentUser::canDoOperation проверяет, есть ли у текущего пользователя право на операцию модуля.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `CurrentUser::canDoOperation` проверяет, может ли текущий пользователь выполнить операцию. Операции — это права из уровней доступа модулей, например `view_all_users` или `edit_php`. Метод вызывает `CUser::CanDoOperation`.

Сигнатура метода в классе `Bitrix\Main\Engine\CurrentUser`:

```php
public function canDoOperation($operationName): bool
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| operationName\* | `string` | Задает код операции, например `view_all_users` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если у пользователя есть право на операцию. Для администратора метод всегда возвращает `true`. Если объект не связан с `$USER`, метод возвращает `false`.

## Особенности

Метод `CUser::CanDoOperation` вычисляет операции пользователя один раз и хранит их в сессии. Список обновится после повторной авторизации или после обновления данных сессии, например когда меняются группы пользователя. Изменение операций в уровнях доступа без смены групп список не обновляет.

## Примеры

**Пример.** Код проверяет право на просмотр всех пользователей:

```php
<?php
use Bitrix\Main\Engine\CurrentUser;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo CurrentUser::get()->canDoOperation('view_all_users') ? 'Allowed' : 'Denied';
```

При запуске из консоли код выведет `Denied`.

## Смотрите также

- [CurrentUser::isAdmin](is-admin.md)
