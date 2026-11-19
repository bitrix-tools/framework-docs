---
title: Получить зарегистрированные пространства имен Loader::getNamespaces
description: Метод Loader::getNamespaces возвращает пространства имен, которые зарегистрировали registerNamespace и includeModule, с их каталогами.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loader::getNamespaces` возвращает пространства имен, в которых автозагрузчик ищет классы, и их каталоги. Метод нужен для отладки, когда класс не загружается.

Сигнатура метода в классе `Bitrix\Main\Loader`:

```php
public static function getNamespaces(): array
```

## Возвращаемое значение

Метод возвращает массив. Ключ — пространство имен в нижнем регистре с обратной косой чертой в конце, например `vendor\units\`. Значение — список каталогов. Каждый элемент списка содержит ключи из таблицы.

#|
|| Ключ | Описание ||
|| path<br>`string` | Содержит абсолютный путь к каталогу без косой черты в конце ||
|| depth<br>`int` | Содержит число обратных косых черт в пространстве имен без завершающей черты. Автозагрузчик по этому числу отрезает пространство имен от имени класса ||
|#

## Примеры

**Пример.** Код выводит каталог пространства имен модуля `main`:

```php
<?php
use Bitrix\Main\Loader;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$namespaces = Loader::getNamespaces();

echo $namespaces['bitrix\\main\\'][0]['path'];
```

Код выведет путь вида `/var/www/html/bitrix/modules/main/lib`.

## Смотрите также

- [Loader::registerNamespace](register-namespace.md)
