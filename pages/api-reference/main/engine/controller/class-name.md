---
title: Получить полное имя класса Controller::className
description: Статический метод Controller::className возвращает полное имя класса контроллера.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Controller::className` возвращает полное имя класса, у которого его вызвали. Метод работает как `static::class`. Метод остался для совместимости со старым кодом.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
final public static function className(): string
```

## Возвращаемое значение

Метод возвращает имя класса без ведущего `\`.

## Примеры

**Пример.** Код выводит имя класса контроллера ядра:

```php
<?php
use Bitrix\Main\Controller\UserOption;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo UserOption::className();
```

Код выведет `Bitrix\Main\Controller\UserOption`.

## Смотрите также

- [Action::className](../action/class-name.md)
