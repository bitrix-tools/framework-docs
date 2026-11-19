---
title: Перевести хост в Unicode Uri::convertToUnicode
description: Метод Uri::convertToUnicode переводит хост из Punycode в национальные символы и сохраняет его в объекте.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Uri::convertToUnicode` переводит хост из Punycode в национальные символы, например `xn--e1afmkfd.xn--p1ai` в `пример.рф`. Метод нужен, чтобы показать хост пользователю в читаемом виде.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function convertToUnicode()
```

## Возвращаемое значение

Метод возвращает хост в Unicode и сохраняет его в объекте. Если в хосте нет `xn--`, метод возвращает его без изменений. При ошибке преобразования метод возвращает объект `Bitrix\Main\Error` и не меняет хост.

## Примеры

**Пример.** Код переводит хост в Unicode и сравнивает его с ожидаемым:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$uri = new Uri('https://xn--e1afmkfd.xn--p1ai/');
$uri->convertToUnicode();

echo ($uri->getHost() === 'пример.рф' ? 'unicode host' : 'punycode host');
```

Код выведет `unicode host`.

## Смотрите также

- [Uri::convertToPunycode](convert-to-punycode.md)
