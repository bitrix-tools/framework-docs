---
title: Получить схему Uri::getScheme
description: Метод Uri::getScheme возвращает схему адреса, например https.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.15

{% endnote %}

Метод `Uri::getScheme` возвращает схему адреса, например `https`.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function getScheme(): string
```

## Возвращаемое значение

Метод возвращает схему без `:` или пустую строку для относительного адреса. Конструктор приводит схему к нижнему регистру, а [withScheme](with-scheme.md) сохраняет регистр.

## Примеры

**Пример.** Код проверяет, что адрес использует HTTPS:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$uri = new Uri('HTTPS://example.com/units/');

echo ($uri->getScheme() === 'https' ? 'secure' : 'insecure');
```

Код выведет `secure`.

## Смотрите также

- [Uri::withScheme](with-scheme.md)
