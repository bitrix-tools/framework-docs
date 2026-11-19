---
title: Создать хранилище SessionLocalStorage::__construct
description: Конструктор SessionLocalStorage создает пустое хранилище с ключом хранения и именем. Хранилище текущей сессии возвращает Application::getLocalSession.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Конструктор `SessionLocalStorage::__construct` создает пустое хранилище с ключом хранения и именем. Менеджер хранилищ создает хранилище текущей сессии. Метод `Application::getInstance()->getLocalSession($name)` возвращает его с загруженными данными.

Менеджер не загружает и не сохраняет объект, созданный конструктором. Такой объект подходит, например, для тестов кода, который принимает `SessionLocalStorage`.

Сигнатура метода в классе `Bitrix\Main\Data\LocalStorage\SessionLocalStorage`:

```php
public function __construct(string $uniqueName, string $name)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| uniqueName\* | `string` | Задает ключ хранения. Менеджер составляет его из идентификатора сессии и имени через `_` |
| name\* | `string` | Задает имя хранилища |

## Примеры

**Пример.** Код создает хранилище для теста и записывает в него значение:

```php
<?php
use Bitrix\Main\Data\LocalStorage\SessionLocalStorage;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$storage = new SessionLocalStorage('test_units', 'units');
$storage['code'] = 'kg';

echo $storage->getName() . ' ' . $storage->getUniqueName() . ' ' . $storage['code'];
```

Код выведет `units test_units kg`.

## Смотрите также

- [SessionLocalStorage::getUniqueName](get-unique-name.md)
- [Сессии](../../../../../framework/sessions.md)
