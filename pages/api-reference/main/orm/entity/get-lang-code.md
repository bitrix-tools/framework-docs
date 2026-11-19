---
title: Получить код языковой фразы Entity::getLangCode
description: Метод Entity::getLangCode возвращает код языковой фразы с названием сущности — код сущности с суффиксом _ENTITY.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::getLangCode` возвращает код языковой фразы с названием сущности — код из [getCode](get-code.md) с суффиксом `_ENTITY`. Метод [getTitle](get-title.md) берет название по этому коду, если класс таблицы не задал свое.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getLangCode()
```

## Возвращаемое значение

Метод возвращает строку.

## Примеры

**Пример.** Код читает код фразы сущности языков:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::getEntity()->getLangCode();
```

Код выведет `MAIN_LOCALIZATION_LANGUAGE_ENTITY`.

## Смотрите также

- [Entity::getTitle](get-title.md)
- [Entity::getCode](get-code.md)
