---
title: UserTable — ORM-класс пользователей
description: Класс Bitrix\Main\UserTable читает данные пользователей через ORM, возвращает группы пользователя и обновляет поисковый индекс пользователей.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main`

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

## Когда использовать

Класс `UserTable` — ORM-класс пользователей сайта. Методы `getList`, `getById`, `query` и другие методы выборки `DataManager` читают данные пользователей.

Чтобы создать, изменить или удалить пользователя, используйте методы `Add`, `Update` и `Delete` класса `CUser` из классического API. Методы `add`, `update` и `delete` класса `UserTable` выбрасывают исключение `Bitrix\Main\NotImplementedException`.

Собственные методы класса возвращают группы пользователя, настройки для определения пользователей онлайн и обновляют поисковый индекс пользователей.

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [getUserGroupIds](get-user-group-ids.md) | Возвращает идентификаторы групп пользователя, включая группы для всех посетителей | |
| [getSecondsForLimitOnline](get-seconds-for-limit-online.md) | Возвращает интервал в секундах, в течение которого пользователь считается онлайн | |
| [getExternalUserTypes](get-external-user-types.md) | Возвращает значения поля `EXTERNAL_AUTH_ID` служебных пользователей | |
| [getIndexedFields](get-indexed-fields.md) | Возвращает поля пользователя, которые попадают в поисковый индекс | |
| [shouldReindex](should-reindex.md) | Проверяет, нужно ли обновить поисковый индекс после изменения полей | |
| [indexRecord](index-record.md) | Обновляет запись пользователя в поисковом индексе | |
| [deleteIndexRecord](delete-index-record.md) | Удаляет запись пользователя из поискового индекса | |

## Поля

Таблицы ниже перечисляют основные, вычисляемые поля и связи класса.

### Основные поля

| Поле | Тип | Описание |
| --- | --- | --- |
| `ID` | `IntegerField` | Идентификатор пользователя, первичный ключ |
| `LOGIN` | `StringField` | Логин |
| `EMAIL` | `StringField` | Адрес электронной почты |
| `ACTIVE` | `BooleanField` | Активность пользователя, значения `N` и `Y` |
| `BLOCKED` | `BooleanField` | Блокировка пользователя, значения `N` и `Y` |
| `NAME`, `SECOND_NAME`, `LAST_NAME` | `StringField` | Имя, отчество и фамилия |
| `DATE_REGISTER` | `DatetimeField` | Дата регистрации |
| `LAST_LOGIN` | `DatetimeField` | Дата последней авторизации |
| `LAST_ACTIVITY_DATE` | `DatetimeField` | Дата последней активности |
| `LID` | `StringField` | Идентификатор сайта, на котором зарегистрировался пользователь |
| `LANGUAGE_ID` | `StringField` | Язык пользователя, две строчные латинские буквы или цифры |
| `EXTERNAL_AUTH_ID` | `StringField` | Код внешней авторизации. Служебные пользователи хранят здесь свой тип |
| `XML_ID` | `StringField` | Внешний идентификатор пользователя |

Персональные и рабочие данные хранят поля с префиксами `PERSONAL_` и `WORK_`, например `PERSONAL_PHONE`, `PERSONAL_BIRTHDAY`, `WORK_COMPANY`, `WORK_POSITION`. Поле `PASSWORD` закрытое. Выборка по маске `*` его не возвращает.

### Вычисляемые поля

| Поле | Описание |
| --- | --- |
| `IS_ONLINE` | `Y`, если с момента `LAST_ACTIVITY_DATE` прошло меньше секунд, чем возвращает [getSecondsForLimitOnline](get-seconds-for-limit-online.md) |
| `IS_REAL_USER` | `N`, если `EXTERNAL_AUTH_ID` входит в список [getExternalUserTypes](get-external-user-types.md), иначе `Y` |
| `REAL_USER` | Логическое условие для фильтра. Истинно, если `EXTERNAL_AUTH_ID` пустое или не входит в список служебных типов |
| `SHORT_NAME` | Фамилия и первая буква имени с точкой |
| `DATE_REG_SHORT`, `LAST_LOGIN_SHORT` | Дата регистрации и дата последней авторизации без времени |
| `NOTIFICATION_LANGUAGE_ID` | Язык для уведомлений. `LANGUAGE_ID`, если этот язык активен, иначе язык сайта по умолчанию |

### Связи

| Поле | Связанный ORM-класс | Описание |
| --- | --- | --- |
| `GROUPS` | `Bitrix\Main\UserGroupTable` | Привязки пользователя к группам |
| `INDEX` | `Bitrix\Main\UserIndexTable` | Запись поискового индекса пользователя |
| `ACTIVE_LANGUAGE` | `Bitrix\Main\Localization\LanguageTable` | Активный язык с кодом из `LANGUAGE_ID` |
| `PHONE_AUTH` | `Bitrix\Main\UserPhoneAuthTable` | Данные авторизации по номеру телефона |
| `COUNTER` | `Bitrix\Main\UserCounterTable` | Счетчик пользователя с кодом `tasks_effective` |

Пользовательские поля `UserTable` привязаны к объекту `USER`.

## Наследование

Класс наследует [Bitrix\Main\ORM\Data\DataManager](../orm/data/data-manager/index.md).

### Реализация методов базового класса

| Метод | Особенность реализации |
| --- | --- |
| `add` | Выбрасывает `Bitrix\Main\NotImplementedException` с сообщением `Use CUser class.` |
| `update` | Выбрасывает `Bitrix\Main\NotImplementedException` с сообщением `Use CUser class.` |
| `delete` | Выбрасывает `Bitrix\Main\NotImplementedException` с сообщением `Use CUser class.` |
| `postInitialize` | Если у сущности есть связь `UTS_OBJECT` с таблицей пользовательских полей, добавляет такую же связь `UTS_OBJECT_INNER` с внутренним соединением `INNER JOIN` |

### Унаследованные методы

Методы выборки `getList`, `getById`, `getByPrimary`, `getRow`, `getCount`, `query` и методы работы с объектами `createObject`, `wakeUpObject` работают как в классе [DataManager](../orm/data/data-manager/index.md).

## Смотрите также

- [Основные операции с данными ORM](../../../orm/entity-operations.md)
- [ORM\Event](../orm/event/index.md)
