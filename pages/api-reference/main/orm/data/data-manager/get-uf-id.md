---
title: Задать идентификатор пользовательских полей DataManager::getUfId
description: Метод DataManager::getUfId возвращает идентификатор объекта пользовательских полей. Наследник переопределяет его, чтобы подключить поля UF_* к таблице.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::getUfId` возвращает идентификатор объекта пользовательских полей, например `USER` или `BLOG_POST`. Если наследник возвращает идентификатор, ORM добавляет к таблице пользовательские поля `UF_*`. Их можно выбирать в `getList` и записывать в `add` и `update`.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function getUfId()
```

## Возвращаемое значение

Метод возвращает строку или `null`, если у таблицы нет пользовательских полей. Базовый класс возвращает `null`.

## Особенности

- ORM хранит значения одиночных полей в таблице `b_uts_<идентификатор>`. Значения множественных полей ORM хранит построчно в `b_utm_<идентификатор>` и сериализованной копией в `b_uts_<идентификатор>`.
- Если метод возвращает `null`, ORM ищет идентификатор сама среди зарегистрированных объектов пользовательских полей.
- Методы [add](add.md) и [update](update.md) проверяют и сохраняют пользовательские поля через `$USER_FIELD_MANAGER`.

## Примеры

**Пример.** Код сравнивает идентификаторы пользовательских полей двух таблиц:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_export([UserTable::getUfId(), LanguageTable::getUfId()]);
```

Код выведет:

```text
array (
  0 => 'USER',
  1 => NULL,
)
```

## Смотрите также

- [DataManager::isUts](is-uts.md)
- [DataManager::isUtm](is-utm.md)
