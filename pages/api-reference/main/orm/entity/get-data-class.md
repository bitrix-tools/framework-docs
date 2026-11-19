---
title: Получить класс таблицы Entity::getDataClass
description: Метод Entity::getDataClass возвращает класс таблицы сущности — наследник DataManager.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::getDataClass` возвращает класс таблицы сущности — наследник [DataManager](../data/data-manager/index.md). Через класс код вызывает `getList`, `add` и другие методы, если у кода есть только объект сущности.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getDataClass()
```

## Возвращаемое значение

Метод возвращает имя класса. Сущности, которые построил [getInstance](get-instance.md), хранят имя с ведущим `\`.

## Примеры

**Пример.** Код получает класс таблицы и выбирает записи:

```php
<?php
use Bitrix\Main\ORM\Entity;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$dataClass = Entity::get('Bitrix\Main\Localization\Language')->getDataClass();
$count = $dataClass::getCount();

echo $dataClass . ' ' . ($count > 0 ? 'has rows' : 'empty');
```

Код выведет `\Bitrix\Main\Localization\LanguageTable has rows`.

## Смотрите также

- [DataManager](../data/data-manager/index.md)
- [Entity::getFullName](get-full-name.md)
