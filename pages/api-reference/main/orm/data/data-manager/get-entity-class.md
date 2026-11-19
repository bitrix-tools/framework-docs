---
title: Получить класс сущности DataManager::getEntityClass
description: Метод DataManager::getEntityClass возвращает класс, объект которого создает getEntity.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::getEntityClass` возвращает класс сущности. Метод [getEntity](get-entity.md) создает объект этого класса. Наследник переопределяет метод редко — например, когда модуль расширяет сущность своими методами.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function getEntityClass()
```

## Возвращаемое значение

Метод возвращает имя класса. Базовый класс возвращает `Bitrix\Main\ORM\Entity`.

## Примеры

**Пример.** Код сравнивает класс сущности и класс объекта из `getEntity`:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::getEntityClass() . ' ' . get_class(LanguageTable::getEntity());
```

Код выведет `Bitrix\Main\ORM\Entity Bitrix\Main\ORM\Entity`.

## Смотрите также

- [DataManager::getEntity](get-entity.md)
