---
title: Получить полное имя сущности Entity::getFullName
description: Метод Entity::getFullName возвращает полное имя сущности — класс таблицы без суффикса Table.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::getFullName` возвращает полное имя сущности — класс таблицы с пространством имен, но без суффикса `Table`.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getFullName()
```

## Возвращаемое значение

Метод возвращает строку с ведущим `\`, например `\Bitrix\Main\Localization\Language`.

## Примеры

**Пример.** Код читает полное имя сущности языков:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::getEntity()->getFullName();
```

Код выведет `\Bitrix\Main\Localization\Language`.

## Смотрите также

- [Entity::getName](get-name.md)
- [Entity::getDataClass](get-data-class.md)
