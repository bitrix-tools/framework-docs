---
title: Получить число элементов SessionLocalStorage::count
description: Метод SessionLocalStorage::count возвращает число элементов хранилища. PHP вызывает метод для count($storage).
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionLocalStorage::count` возвращает число элементов хранилища. Метод реализует интерфейс `\Countable`, и PHP вызывает его для `count($storage)`.

Сигнатура метода в классе `Bitrix\Main\Data\LocalStorage\SessionLocalStorage`:

```php
public function count(): int
```

## Возвращаемое значение

Метод возвращает число элементов верхнего уровня и не считает элементы вложенных массивов. Метод учитывает и элементы со значением `null`, в том числе созданные при чтении отсутствующего ключа.

## Примеры

**Пример.** Код считает элементы хранилища:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$storage = Application::getInstance()->getLocalSession('units');
$storage->setData(['code' => 'kg', 'selected' => ['g', 't']]);

echo count($storage);
```

Код выведет `2`.

## Смотрите также

- [SessionLocalStorage::getData](get-data.md)
