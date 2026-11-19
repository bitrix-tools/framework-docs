---
title: Записать значение по ключу SessionInterface::set
description: Метод SessionInterface::set записывает значение в сессию по ключу.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionInterface::set` записывает значение в сессию по ключу. Запись `$session['key'] = $value` выполняет то же действие. Сессия сохраняет данные при [save](save.md) или в конце запроса.

Сигнатура метода в интерфейсе `Bitrix\Main\Session\SessionInterface`:

```php
public function set($name, $value);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает ключ |
| value\* | `mixed` | Задает значение |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает. Метод заменяет прежнее значение по ключу.

## Примеры

**Пример.** Код запоминает выбранный режим отображения:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$session = Application::getInstance()->getSession();
$session->set('units_view', 'grid');

echo $session['units_view'];
```

Код выведет `grid`.

## Смотрите также

- [SessionInterface::get](get.md)
- [SessionInterface::remove](remove.md)
