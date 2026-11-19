---
title: Получить итератор SessionLocalStorage::getIterator
description: Метод SessionLocalStorage::getIterator возвращает итератор по копии данных хранилища. PHP вызывает метод в foreach.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionLocalStorage::getIterator` возвращает итератор по данным хранилища. Метод реализует интерфейс `\IteratorAggregate`, и PHP вызывает его в `foreach ($storage as $key => $value)`.

Сигнатура метода в классе `Bitrix\Main\Data\LocalStorage\SessionLocalStorage`:

```php
public function getIterator(): \ArrayIterator
```

## Возвращаемое значение

Метод возвращает объект `\ArrayIterator` по копии данных. Если код меняет хранилище внутри `foreach`, цикл перебирает прежние данные. Изменение переменной цикла не меняет хранилище.

## Примеры

**Пример.** Код перебирает элементы хранилища:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$storage = Application::getInstance()->getLocalSession('units');
$storage->setData(['code' => 'kg', 'sort' => 10]);

foreach ($storage as $key => $value)
{
    echo $key . '=' . $value . ' ';
}
```

Код выведет `code=kg sort=10`.

## Смотрите также

- [SessionLocalStorage::getData](get-data.md)
- [SessionLocalStorage::count](count.md)
