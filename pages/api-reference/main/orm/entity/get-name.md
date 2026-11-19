---
title: Получить имя сущности Entity::getName
description: Метод Entity::getName возвращает короткое имя сущности — имя класса таблицы без пространства имен и суффикса Table.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::getName` возвращает короткое имя сущности — имя класса таблицы без пространства имен и суффикса `Table`. Для `Bitrix\Main\Localization\LanguageTable` это `Language`.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getName()
```

## Возвращаемое значение

Метод возвращает строку.

## Примеры

**Пример.** Код читает имя сущности языков:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::getEntity()->getName();
```

Код выведет `Language`.

## Смотрите также

- [Entity::getFullName](get-full-name.md)
