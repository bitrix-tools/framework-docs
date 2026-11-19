---
title: Удалить все данные SessionLocalStorage::clear
description: Метод SessionLocalStorage::clear удаляет все данные хранилища.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionLocalStorage::clear` удаляет все данные хранилища. Менеджер хранилищ сохранит пустой массив после эпилога.

Сигнатура метода в классе `Bitrix\Main\Data\LocalStorage\SessionLocalStorage`:

```php
public function clear(): void
```

## Возвращаемое значение

Метод ничего не возвращает и не меняет имя и ключ хранения.

## Примеры

**Пример.** Код очищает хранилище и выводит число элементов:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$storage = Application::getInstance()->getLocalSession('units');
$storage['code'] = 'kg';
$storage->clear();

echo count($storage);
```

Код выведет `0`.

## Смотрите также

- [SessionLocalStorage::setData](set-data.md)
- [SessionLocalStorage::offsetUnset](offset-unset.md)
