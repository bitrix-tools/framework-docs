---
title: Получить поле с автоинкрементом Entity::getAutoIncrement
description: Метод Entity::getAutoIncrement возвращает имя поля первичного ключа, значение которого задает база данных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::getAutoIncrement` возвращает имя поля первичного ключа с автоинкрементом — поля с `primary` = `true` и `autocomplete` = `true`. Значение этого поля задает база данных при добавлении записи.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getAutoIncrement()
```

## Возвращаемое значение

Метод возвращает имя поля или `null`, если поля с автоинкрементом нет.

## Примеры

**Пример.** Код проверяет автоинкремент двух сущностей:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo var_export(LanguageTable::getEntity()->getAutoIncrement(), true) . ' ' . UserTable::getEntity()->getAutoIncrement();
```

Код выведет `NULL ID`.

## Смотрите также

- [Entity::getPrimary](get-primary.md)
