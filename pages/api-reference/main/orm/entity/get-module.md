---
title: Получить модуль сущности Entity::getModule
description: Метод Entity::getModule определяет модуль сущности по пространству имен класса таблицы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::getModule` определяет модуль сущности по пространству имен класса таблицы.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getModule()
```

## Возвращаемое значение

Метод возвращает идентификатор модуля строчными буквами.

| Класс таблицы | Модуль |
| --- | --- |
| `\Bitrix\Main\...` | `main` — часть пространства имен после `Bitrix` |
| `\Vendor\Units\...` | `vendor.units` — две первые части пространства имен через точку |
| Класс без пространства имен | Пустая строка |

## Примеры

**Пример.** Код определяет модуль сущности ядра и сущности партнера:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Entity;
use Bitrix\Main\ORM\Fields\IntegerField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$entity = Entity::compileEntity('DemoUnit', [new IntegerField('ID', ['primary' => true])], ['namespace' => 'Vendor\Units']);

echo LanguageTable::getEntity()->getModule() . ' ' . $entity->getModule();
```

Код выведет `main vendor.units`.

## Смотрите также

- [Entity::getNamespace](get-namespace.md)
- [Entity::getCode](get-code.md)
