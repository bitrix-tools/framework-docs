---
title: Сравнить тег с заголовком If-None-Match Etag::matches
description: Метод Etag::matches проверяет, совпадает ли тег сущности ресурса с одним из тегов в заголовке If-None-Match.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 26.900.0

{% endnote %}

Метод `Etag::matches` проверяет, совпадает ли тег сущности ресурса с одним из тегов в заголовке запроса `If-None-Match`. Если метод вернул `true`, ресурс у клиента не изменился и сервер может ответить кодом `304 Not Modified`.

Сигнатура метода в классе `Bitrix\Main\Web\Http\Etag`:

```php
public static function matches(?string $ifNoneMatch, string $entityTag): bool
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| ifNoneMatch\* | `string\|null` | Задает значение заголовка `If-None-Match` из запроса. Если заголовка нет, передайте `null` |
| entityTag\* | `string` | Задает тег сущности ресурса в кавычках или без них. Передавайте тег без префикса `W/` и без пробелов по краям |

## Возвращаемое значение

Метод возвращает `true`, если тег ресурса совпал с одним из тегов заголовка, иначе `false`.

Метод возвращает `false`, если `ifNoneMatch` равен `null` или пустой строке, а также если тег ресурса пустой или состоит из одних кавычек. Для пустого тега ресурса метод возвращает `false` даже при заголовке `*`.

## Особенности

- Метод сравнивает теги в слабом режиме по RFC 7232. Префикс `W/` у тега в заголовке не учитывается, поэтому `W/"abc"` совпадает с `"abc"`. Префикс распознается, только если он записан как `W/` вплотную к тегу: `w/"abc"` и `W/ "abc"` не совпадут.
- Кавычки по краям тега не влияют на сравнение. Тег без кавычек в заголовке тоже совпадет. Так метод поддерживает клиентов, которые сохранили тег, когда сервер отдавал его без кавычек. Кавычки внутри тега участвуют в сравнении.
- Заголовок может содержать список тегов через запятую. Метод делит список только по запятым вне кавычек, запятая внутри тега в кавычках остается частью тега. Пробелы вокруг элементов списка метод убирает.
- Если в заголовке есть непарная кавычка, остаток заголовка после нее метод считает одним тегом. Теги в этом остатке не найдутся.
- Значение `*` совпадает с любым тегом, только если это весь заголовок, пробелы вокруг допустимы. Внутри списка звездочка сравнивается как обычный тег.

## Примеры

**Пример.** Код сравнивает тег `"abc"` с разными значениями заголовка.

```php
<?php
use Bitrix\Main\Web\Http\Etag;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(
    Etag::matches('W/"abc"', '"abc"'),
    Etag::matches('"x", "y", "abc"', 'abc'),
    Etag::matches('*', '"abc"'),
    Etag::matches(null, '"abc"')
);
```

Код выведет `bool(true)`, `bool(true)`, `bool(true)` и `bool(false)`.

**Пример.** Страница отдает список единиц измерения в JSON. Если у клиента актуальная версия, страница отвечает кодом `304` без тела.

```php
<?php
use Bitrix\Main\Context;
use Bitrix\Main\Web\Http\Etag;
use Bitrix\Main\Web\Json;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$body = Json::encode(['units' => ['kg', 'g', 'm']]);
$entityTag = md5($body);

$ifNoneMatch = Context::getCurrent()->getRequest()->getHeader('If-None-Match');
if (Etag::matches($ifNoneMatch, $entityTag))
{
    \CHTTP::SetStatus('304 Not Modified');
    die();
}

header('Content-Type: application/json');
header('ETag: ' . Etag::quote($entityTag));
echo $body;
```

Первый запрос получит JSON и заголовок `ETag`. Повторный запрос с этим тегом в заголовке `If-None-Match` получит ответ `304 Not Modified`.

## Смотрите также

- [Etag::quote](quote.md)
- [HttpResponse::setLastModified](../../../http-response/set-last-modified.md)
