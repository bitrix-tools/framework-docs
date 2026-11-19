---
title: Получить тип Content-Disposition HttpHeaders::getContentDisposition
description: Метод HttpHeaders::getContentDisposition возвращает тип из заголовка Content-Disposition, например attachment или inline.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpHeaders::getContentDisposition` возвращает тип из заголовка `Content-Disposition`. Тип `attachment` означает файл для скачивания, `inline` — содержимое для показа в браузере. Метод [getFilename](get-filename.md) возвращает имя файла.

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public function getContentDisposition()
```

## Возвращаемое значение

Метод возвращает часть заголовка до первой точки с запятой без пробелов по краям. Метод не меняет регистр. Если заголовка нет, метод возвращает `null`.

## Примеры

**Пример.** Код проверяет, что ответ — файл для скачивания:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$headers = new HttpHeaders(['Content-Disposition' => 'attachment; filename="units.csv"']);

echo $headers->getContentDisposition();
```

Код выведет `attachment`.

## Смотрите также

- [HttpHeaders::getFilename](get-filename.md)
