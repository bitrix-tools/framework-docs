---
title: Отправить статус, заголовки и cookie HttpResponse::writeHeaders
description: Метод HttpResponse::writeHeaders отправляет клиенту строку статуса, заголовок Last-Modified, заголовки и cookie ответа.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpResponse::writeHeaders` отправляет клиенту статус, заголовки и cookie ответа функциями PHP `header` и `setcookie`. Тело ответа метод не отправляет.

Методы `flush` и `send` вызывают `writeHeaders` сами. Вызывайте метод отдельно, если тело ответа выводит другой код, например функция `readfile`.

Сигнатура метода в классе `Bitrix\Main\HttpResponse`:

```php
public function writeHeaders()
```

## Возвращаемое значение

Метод ничего не возвращает.

Метод отправляет данные в таком порядке:

1. Строку статуса, если код статуса больше нуля.
2. Заголовок `Last-Modified`, если время задал метод [setLastModified](set-last-modified.md).
3. Заголовки ответа. Каждое значение метод отправляет отдельным вызовом `header` в виде `Имя: значение`, в том числе пустое значение. По умолчанию функция `header` заменяет заголовок с тем же именем, поэтому из нескольких значений клиент получит последнее.
4. Cookie ответа. Метод шифрует значения cookie класса `Bitrix\Main\Web\CryptoCookie`. Метод не отправляет cookie без флага `Cookie::SPREAD_DOMAIN`.

## Особенности

- После начала вывода PHP не отправляет заголовки. Вызывайте метод до вывода тела ответа.
- При запуске из консоли функция `header` не отправляет заголовки, и метод ничего не выводит.

## Примеры

**Пример.** Код отправляет заголовки ответа для текстового файла, а тело выводит отдельно:

```php
<?php
use Bitrix\Main\HttpResponse;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$response = new HttpResponse();
$response
    ->addHeader('Content-Type', 'text/plain; charset=utf-8')
    ->addHeader('Content-Disposition', 'attachment; filename="units.txt"')
;

$response->writeHeaders();

echo "kg\ng\nt";
```

В браузере код отдаст файл `units.txt` из трех строк. При запуске из консоли код выведет только текст.

## Смотрите также

- [HttpResponse::addHeader](add-header.md)
- [HttpResponse::addCookie](add-cookie.md)
- [HttpResponse::setStatus](set-status.md)
