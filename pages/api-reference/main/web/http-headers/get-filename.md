---
title: Получить имя файла HttpHeaders::getFilename
description: Метод HttpHeaders::getFilename возвращает имя файла из заголовка Content-Disposition и декодирует его.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpHeaders::getFilename` возвращает имя файла из заголовка `Content-Disposition`. Метод нужен, чтобы сохранить файл, который вернул внешний сервис, под исходным именем.

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public function getFilename()
```

## Возвращаемое значение

Метод возвращает имя файла или `null`, если нет заголовка `Content-Disposition` или атрибутов `filename` и `filename*`.

## Особенности

- Метод читает атрибуты `filename*` и `filename`. Если есть оба, приоритет у `filename*` — в нем имя в кодировке, например `UTF-8''r%C3%A9sum%C3%A9.csv`.
- Имя декодируется функцией `urldecode`, поэтому знак `+` в имени станет пробелом. Имя из `filename*` также переводится из указанной кодировки в кодировку сайта.
- Символы пути в имени, например `../`, не проверяются. Перед сохранением файла очистите имя.

## Примеры

**Пример.** Код читает имя файла в UTF-8:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$headers = new HttpHeaders([
    'Content-Disposition' => "attachment; filename=\"units.csv\"; filename*=UTF-8''r%C3%A9sum%C3%A9.csv",
]);

echo $headers->getFilename();
```

Код выведет `résumé.csv`.

## Смотрите также

- [HttpHeaders::getContentDisposition](get-content-disposition.md)
