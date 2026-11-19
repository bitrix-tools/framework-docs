---
title: Сохранить ответ в файл HttpClient::saveFile
description: Метод HttpClient::saveFile сохраняет тело последнего ответа в файл и создает каталог файла.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::saveFile` сохраняет тело последнего ответа в файл. Метод нужен, чтобы проверить ответ до сохранения, например заголовки. Метод [download](download.md) вызывает его после успешного запроса.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function saveFile($filePath)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| filePath\* | `string` | Задает абсолютный путь к файлу. Метод создает каталог и перезаписывает файл |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- Если запроса не было, метод создаст пустой файл.
- Метод задает файл как поток [setOutputStream](set-output-stream.md), записывает тело и закрывает файл. Клиент продолжает хранить ссылку на закрытый файл, поэтому следующий запрос этого клиента завершится ошибкой `TypeError`. Для следующего запроса создайте новый клиент.

## Примеры

**Пример.** Код сохраняет ответ, только если это HTML:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$path = $_SERVER['DOCUMENT_ROOT'] . '/upload/tmp/units/page.html';

$client = new HttpClient();

if ($client->get('https://example.org/') !== false && $client->getContentType() === 'text/html')
{
    $client->saveFile($path);
    echo (filesize($path) > 0 ? 'saved' : 'empty');
    unlink($path);
}
```

Код выведет `saved`.

## Смотрите также

- [HttpClient::download](download.md)
