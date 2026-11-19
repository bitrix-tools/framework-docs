---
title: Получить первичный ключ Entity::getPrimary
description: Метод Entity::getPrimary возвращает имя поля первичного ключа или массив имен для составного ключа.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::getPrimary` возвращает первичный ключ сущности. Первичный ключ составляют поля с `primary` = `true`.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getPrimary()
```

## Возвращаемое значение

Метод возвращает имя поля, если ключ из одного поля, иначе — массив имен. Чтобы всегда получать массив, используйте [getPrimaryArray](get-primary-array.md).

## Примеры

**Пример.** Код читает первичные ключи двух сущностей:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::getEntity()->getPrimary() . ' ' . UserTable::getEntity()->getPrimary();
```

Код выведет `LID ID`.

## Смотрите также

- [Entity::getPrimaryArray](get-primary-array.md)
- [Entity::getAutoIncrement](get-auto-increment.md)
