---
title: Получить название сущности Entity::getTitle
description: Метод Entity::getTitle возвращает название сущности из класса таблицы или из языковой фразы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::getTitle` возвращает название сущности для интерфейса. Метод берет название из [DataManager::getTitle](../data/data-manager/get-title.md). Если класс таблицы его не задал, метод берет языковую фразу с кодом из [getLangCode](get-lang-code.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getTitle()
```

## Возвращаемое значение

Метод возвращает строку или `null`, если класс таблицы не задал название и языковой фразы нет.

## Примеры

**Пример.** Код читает название сущности, у которой его нет:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(LanguageTable::getEntity()->getTitle());
```

Код выведет `NULL`.

## Смотрите также

- [Entity::getLangCode](get-lang-code.md)
- [DataManager::getTitle](../data/data-manager/get-title.md)
