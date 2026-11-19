---
title: Скачать файл HttpClient::download
description: Метод HttpClient::download отправляет запрос и сохраняет тело ответа в файл, если сервер вернул код 2xx.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::download` отправляет запрос и сохраняет тело ответа в файл. Метод создает каталог файла, если его нет.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function download($url, $filePath, string $method = Http\Method::GET, $entityBody = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| url\* | `string` | Задает абсолютный адрес |
| filePath\* | `string` | Задает абсолютный путь к файлу на сервере. Метод перезаписывает существующий файл |
| method | `string` | Задает метод HTTP. По умолчанию — `GET` |
| entityBody | `array`, `string`, `resource` или `null` | Задает тело запроса, как в [query](query.md). По умолчанию — `null` |

Сигнатура PHP объявляет только тип `method`.

## Возвращаемое значение

Метод возвращает `true`, если сервер ответил кодом от 200 до 299 и метод сохранил файл. Иначе метод возвращает `false` и файл не создает.

## Особенности

- Метод записывает тело в файл через [saveFile](save-file.md). После этого клиент хранит ссылку на закрытый файл, и следующий запрос этого клиента завершится ошибкой `TypeError`. Для следующего запроса создайте новый клиент.
- Метод не проверяет путь. Если путь строится из данных пользователя, проверьте его до вызова.

## Примеры

**Пример.** Код скачивает страницу в каталог `/upload/` и удаляет файл:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$path = $_SERVER['DOCUMENT_ROOT'] . '/upload/tmp/units/example.html';

$client = new HttpClient();
$saved = $client->download('https://example.org/', $path);

echo ($saved && filesize($path) > 0 ? 'saved' : 'not saved');

unlink($path);
```

Код выведет `saved`.

## Смотрите также

- [HttpClient::saveFile](save-file.md)
- [HttpClient::setOutputStream](set-output-stream.md)
