---
title: Получить код сущности Entity::getCode
description: Метод Entity::getCode возвращает код сущности — пространство имен и имя в верхнем регистре через подчеркивание.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::getCode` возвращает код сущности. Метод строит код из пространства имен без `Bitrix` и имени сущности в `SNAKE_CASE`, например `MAIN_LOCALIZATION_LANGUAGE`. Ядро строит из кода коды языковых фраз сущности и ее полей.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getCode()
```

## Возвращаемое значение

Метод возвращает строку в верхнем регистре.

## Примеры

**Пример.** Код читает коды двух сущностей:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::getEntity()->getCode() . ' ' . UserTable::getEntity()->getCode();
```

Код выведет `MAIN_LOCALIZATION_LANGUAGE MAIN_USER`.

## Смотрите также

- [Entity::getLangCode](get-lang-code.md)
