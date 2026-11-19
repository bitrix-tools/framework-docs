---
title: Задать ключ хранения SessionLocalStorage::setUniqueName
description: Метод SessionLocalStorage::setUniqueName задает ключ, под которым менеджер сохранит данные хранилища.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionLocalStorage::setUniqueName` задает ключ хранения и возвращает тот же объект. Менеджер хранилищ вызывает метод, когда сессия получает новый идентификатор, и переносит данные под новый ключ.

В коде приложения метод вызывать не нужно. Менеджер сохранит данные под новым ключом. При следующем запросе метод `getLocalSession` ищет данные под ключом из идентификатора сессии и имени и не найдет данные, сохраненные под другим ключом.

Сигнатура метода в классе `Bitrix\Main\Data\LocalStorage\SessionLocalStorage`:

```php
public function setUniqueName(string $uniqueName): self
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| uniqueName\* | `string` | Задает новый ключ хранения |

## Возвращаемое значение

Метод возвращает текущий объект и не меняет данные и имя хранилища.

## Примеры

**Пример.** Код меняет ключ хранения у хранилища, созданного конструктором:

```php
<?php
use Bitrix\Main\Data\LocalStorage\SessionLocalStorage;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$storage = new SessionLocalStorage('old_units', 'units');
$storage->setUniqueName('new_units');

echo $storage->getUniqueName() . ' ' . $storage->getName();
```

Код выведет `new_units units`.

## Смотрите также

- [SessionLocalStorage::getUniqueName](get-unique-name.md)
