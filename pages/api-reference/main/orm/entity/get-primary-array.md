---
title: Получить поля первичного ключа Entity::getPrimaryArray
description: Метод Entity::getPrimaryArray возвращает имена полей первичного ключа массивом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::getPrimaryArray` возвращает имена полей первичного ключа массивом. В отличие от [getPrimary](get-primary.md), метод возвращает массив и для ключа из одного поля.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getPrimaryArray()
```

## Возвращаемое значение

Метод возвращает массив имен полей.

## Примеры

**Пример.** Код читает поля первичного ключа сущности языков:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo json_encode(LanguageTable::getEntity()->getPrimaryArray());
```

Код выведет `["LID"]`.

## Смотрите также

- [Entity::getPrimary](get-primary.md)
