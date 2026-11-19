---
title: Получить объект пользовательских полей Entity::getUfId
description: Метод Entity::getUfId возвращает идентификатор объекта пользовательских полей сущности, например USER.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::getUfId` возвращает идентификатор объекта пользовательских полей сущности, например `USER`. По нему ядро подключает к сущности поля `UF_*`.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getUfId()
```

## Возвращаемое значение

Метод возвращает строку или `null`, если у сущности нет пользовательских полей.

## Особенности

Значение задает [DataManager::getUfId](../data/data-manager/get-uf-id.md). Если класс таблицы его не задал, [postInitialize](post-initialize.md) ищет объект в списке сущностей менеджера пользовательских полей.

## Примеры

**Пример.** Код читает объект пользовательских полей двух сущностей:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo UserTable::getEntity()->getUfId() . ' ' . var_export(LanguageTable::getEntity()->getUfId(), true);
```

Код выведет `USER NULL`.

## Смотрите также

- [Пользовательские поля](../../../../cms-basics/userfields.md)
- [Entity::isUts](is-uts.md)
