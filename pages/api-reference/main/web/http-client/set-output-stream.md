---
title: Направить тело ответа в поток HttpClient::setOutputStream
description: Метод HttpClient::setOutputStream задает поток, в который клиент записывает тело ответа вместо строки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpClient::setOutputStream` задает поток для тела ответа. Метод нужен для больших ответов. Клиент не возвращает тело строкой и не держит его в памяти PHP.

Сигнатура метода в классе `Bitrix\Main\Web\HttpClient`:

```php
public function setOutputStream($handler)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| handler\* | `resource` | Задает открытый поток для записи, например результат `fopen` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `HttpClient`.

## Особенности

- Клиент сначала получает тело во временный поток `php://temp` и копирует его в ваш поток при вызове [getResult](get-result.md). Методы [get](get.md) и [post](post.md) сами вызывают `getResult` и возвращают пустую строку. Каждый повторный вызов `getResult` дописывает тело в поток снова.
- Временный поток при большом ответе пишет данные на диск. Ограничивайте размер ответа методом [setBodyLengthMax](set-body-length-max.md).
- Поток остается заданным для следующих запросов клиента. Закройте поток сами и не используйте клиент после закрытия потока.

## Примеры

**Пример.** Код записывает ответ в поток в памяти:

```php
<?php
use Bitrix\Main\Web\HttpClient;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$stream = fopen('php://memory', 'w+');

$client = new HttpClient();
$client->setOutputStream($stream);
$result = $client->get('https://example.org/');

rewind($stream);
$body = stream_get_contents($stream);
fclose($stream);

echo var_export($result, true) . ' ' . (str_contains($body, '<html') ? 'html in stream' : 'empty');
```

Код выведет `'' html in stream`.

## Смотрите также

- [HttpClient::download](download.md)
- [HttpClient::setBodyLengthMax](set-body-length-max.md)
