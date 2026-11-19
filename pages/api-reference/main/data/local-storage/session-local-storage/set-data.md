---
title: Заменить все данные SessionLocalStorage::setData
description: Метод SessionLocalStorage::setData заменяет все данные хранилища переданным массивом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionLocalStorage::setData` заменяет все данные хранилища и возвращает тот же объект. Метод удаляет прежние ключи, которых нет в новом массиве. Менеджер хранилищ вызывает метод, когда загружает данные.

Сигнатура метода в классе `Bitrix\Main\Data\LocalStorage\SessionLocalStorage`:

```php
public function setData(array $data)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| data\* | `array` | Задает новые данные хранилища |

## Возвращаемое значение

Метод возвращает текущий объект.

## Примеры

**Пример.** Код заменяет данные хранилища:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$storage = Application::getInstance()->getLocalSession('units');
$storage['code'] = 'kg';
$storage->setData(['sort' => 10]);

echo json_encode($storage->getData());
```

Код выведет `{"sort":10}`.

## Смотрите также

- [SessionLocalStorage::getData](get-data.md)
- [SessionLocalStorage::clear](clear.md)
