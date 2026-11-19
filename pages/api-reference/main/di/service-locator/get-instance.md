---
title: Получить реестр сервисов ServiceLocator::getInstance
description: Метод ServiceLocator::getInstance возвращает единственный объект реестра сервисов.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ServiceLocator::getInstance` возвращает единственный объект реестра сервисов. При первом вызове метод создает объект, при следующих возвращает тот же.

Сигнатура метода в классе `Bitrix\Main\DI\ServiceLocator`:

```php
public static function getInstance(): self
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\DI\ServiceLocator`.

## Примеры

**Пример.** Код получает реестр и проверяет, что повторный вызов вернул тот же объект:

```php
<?php
use Bitrix\Main\DI\ServiceLocator;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(ServiceLocator::getInstance() === ServiceLocator::getInstance());
```

## Смотрите также

- [ServiceLocator::get](get.md)
