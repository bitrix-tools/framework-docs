---
title: Получить пространство имен Entity::getNamespace
description: Метод Entity::getNamespace возвращает пространство имен класса таблицы сущности.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::getNamespace` возвращает пространство имен класса таблицы. По нему сущность находит связанные сущности, если связь в старом формате `getMap` не указывает пространство имен.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getNamespace()
```

## Возвращаемое значение

Метод возвращает строку с ведущим и конечным `\`, например `\Bitrix\Main\Localization\`.

## Примеры

**Пример.** Код читает пространство имен сущности языков:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::getEntity()->getNamespace();
```

Код выведет `\Bitrix\Main\Localization\`.

## Смотрите также

- [Entity::getModule](get-module.md)
