---
title: Получить объект EventManager::getInstance
description: Метод EventManager::getInstance возвращает единственный объект EventManager и создает его при первом вызове.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `EventManager::getInstance` возвращает объект класса. Конструктор класса защищенный, поэтому код получает объект `EventManager` этим методом.

Сигнатура метода в классе `Bitrix\Main\EventManager`:

```php
public static function getInstance()
```

## Возвращаемое значение

Метод возвращает объект `EventManager`. При первом вызове метод создает объект, при следующих возвращает тот же объект. Если объект заменили методом [setInstance](set-instance.md), метод возвращает замену.

## Примеры

**Пример.** Код получает объект дважды и проверяет, что это один объект:

```php
<?php
use Bitrix\Main\EventManager;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(EventManager::getInstance() === EventManager::getInstance());
```

Код выведет `bool(true)`.

## Смотрите также

- [EventManager::setInstance](set-instance.md)
