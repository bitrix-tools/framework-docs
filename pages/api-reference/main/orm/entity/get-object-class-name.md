---
title: Получить короткое имя класса объекта Entity::getObjectClassName
description: Метод Entity::getObjectClassName возвращает имя класса объекта сущности без пространства имен.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::getObjectClassName` возвращает имя класса объекта без пространства имен. Метод вызывает [DataManager::getObjectClassName](../data/data-manager/get-object-class-name.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getObjectClassName()
```

## Возвращаемое значение

Метод возвращает строку, например `EO_Language`.

## Примеры

**Пример.** Код читает короткое имя класса объекта:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::getEntity()->getObjectClassName();
```

Код выведет `EO_Language`.

## Смотрите также

- [Entity::getObjectClass](get-object-class.md)
