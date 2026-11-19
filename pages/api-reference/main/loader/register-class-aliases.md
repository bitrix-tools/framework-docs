---
title: Зарегистрировать псевдонимы классов Loader::registerClassAliases
description: Метод Loader::registerClassAliases регистрирует псевдонимы классов, которые автозагрузчик создает функцией class_alias при первом обращении.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loader::registerClassAliases` регистрирует псевдонимы классов. Автозагрузчик создает псевдоним функцией `class_alias`, когда код обращается к псевдониму или загружает исходный класс. Метод нужен, чтобы старое имя класса продолжало работать после переименования.

Сигнатура метода в классе `Bitrix\Main\Loader`:

```php
public static function registerClassAliases(array $aliases): void
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| aliases\* | `array` | Задает псевдонимы. Ключ — полное имя псевдонима, значение — полное имя класса. Метод убирает обратную косую черту в начале имени |

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- Метод сравнивает имена псевдонима и класса с учетом регистра, в отличие от `registerNamespace` и `registerAutoLoadClasses`. Обращайтесь к псевдониму в том регистре, в котором его зарегистрировали.
- У одного класса может быть несколько псевдонимов, у одного псевдонима — один класс. Если зарегистрировать псевдоним повторно, новый класс заменит прежний.

## Примеры

**Пример.** Код регистрирует псевдоним для класса даты и создает объект через псевдоним:

```php
<?php
use Bitrix\Main\Loader;
use Bitrix\Main\Type\Date;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

Loader::registerClassAliases(['Vendor\Units\LegacyDate' => Date::class]);

$date = new \Vendor\Units\LegacyDate('2026-01-15', 'Y-m-d');

echo get_class($date);
```

Код выведет `Bitrix\Main\Type\Date`.

## Смотрите также

- [Loader::registerAutoLoadClasses](register-auto-load-classes.md)
