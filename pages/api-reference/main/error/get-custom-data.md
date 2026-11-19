---
title: Получить дополнительные данные ошибки Error::getCustomData
description: Метод Error::getCustomData возвращает дополнительные данные, переданные в конструктор ошибки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Error::getCustomData` возвращает дополнительные данные ошибки, например имя поля с неверным значением.

Сигнатура метода в классе `Bitrix\Main\Error`:

```php
public function getCustomData()
```

## Возвращаемое значение

Метод возвращает значение, переданное в конструктор, или `null`, если данных нет.

## Примеры

**Пример.** Код выводит имя поля из дополнительных данных ошибки:

```php
<?php
use Bitrix\Main\Error;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$error = new Error('Unit code is required', 'UNIT_CODE_EMPTY', ['field' => 'CODE']);

echo $error->getCustomData()['field'];
```

## Смотрите также

- [Error::__construct](construct.md)
