---
title: Получить результат драйвера Result::getResource
description: Метод ORM\Query\Result::getResource возвращает результат запроса драйвера базы данных, например mysqli_result.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::getResource` возвращает результат запроса драйвера базы данных. Метод вызывает [DB\Result::getResource](../../../db/result/get-resource.md). Прикладному коду метод нужен редко. Работа с драйвером напрямую делает код зависимым от типа базы данных.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Result`:

```php
public function getResource()
```

## Возвращаемое значение

Метод возвращает объект или ресурс драйвера. Для MySQL это `mysqli_result`, для PostgreSQL — результат `pg_query`.

## Примеры

**Пример.** Код выводит класс результата драйвера:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$resource = LanguageTable::getList(['select' => ['LID'], 'limit' => 1])->getResource();

echo is_object($resource) ? get_class($resource) : gettype($resource);
```

На сайте с MySQL код выведет `mysqli_result`.

## Смотрите также

- [DB\Result::getResource](../../../db/result/get-resource.md)
