---
title: Получить значение по ключу SessionInterface::get
description: Метод SessionInterface::get возвращает значение сессии по ключу или null.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionInterface::get` возвращает значение сессии по ключу. Чтение `$session['key']` вызывает этот же метод.

Сигнатура метода в интерфейсе `Bitrix\Main\Session\SessionInterface`:

```php
public function get($name);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает ключ |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает значение или `null`, если ключа нет.

## Особенности

- В классах `Session` и `KernelSession` метод возвращает значение по ссылке. Поэтому `$session['list'][] = $value` меняет данные сессии.
- Для отсутствующего ключа метод создает в сессии элемент со значением `null`. Перед сохранением сессия удаляет такие элементы, если код их не заполнил. Метод [has](has.md) не считает их существующими.
- При ленивом запуске сессии метод запускает ее при первом обращении.

## Примеры

**Пример.** Код записывает значение в сессию и читает его:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$session = Application::getInstance()->getSession();
$session->set('units_view', 'list');

echo $session->get('units_view') . ' ' . var_export($session->get('units_missing'), true);
```

Код выведет `list NULL`.

## Смотрите также

- [SessionInterface::set](set.md)
- [SessionInterface::has](has.md)
