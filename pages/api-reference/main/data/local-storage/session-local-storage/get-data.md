---
title: Получить все данные SessionLocalStorage::getData
description: Метод SessionLocalStorage::getData возвращает копию всех данных хранилища массивом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionLocalStorage::getData` возвращает все данные хранилища массивом. Менеджер хранилищ сохраняет именно этот массив.

Сигнатура метода в классе `Bitrix\Main\Data\LocalStorage\SessionLocalStorage`:

```php
public function getData(): array
```

## Возвращаемое значение

Метод возвращает копию массива. Изменения в копии не попадают в хранилище. Чтобы заменить данные, используйте [setData](set-data.md). Если данных нет, метод возвращает пустой массив.

## Примеры

**Пример.** Код записывает значения и выводит все данные хранилища:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$storage = Application::getInstance()->getLocalSession('units');
$storage->clear();
$storage['code'] = 'kg';
$storage['sort'] = 10;

echo json_encode($storage->getData());
```

Код выведет `{"code":"kg","sort":10}`.

## Смотрите также

- [SessionLocalStorage::setData](set-data.md)
- [SessionLocalStorage::getIterator](get-iterator.md)
