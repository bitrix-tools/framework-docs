---
title: Получить имя по формату из региональных настроек CurrentUser::getFormattedName
description: Метод CurrentUser::getFormattedName возвращает имя текущего пользователя по формату имени из региональных настроек сайта.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `CurrentUser::getFormattedName` возвращает имя текущего пользователя по формату имени из региональных настроек сайта. Формат может включать обращение, имя, отчество, фамилию и логин.

Сигнатура метода в классе `Bitrix\Main\Engine\CurrentUser`:

```php
public function getFormattedName(): string
```

## Возвращаемое значение

Метод возвращает строку. Метод вызывает `CUser::GetFormattedName` без переносов строк и без экранирования HTML. Перед выводом в HTML экранируйте значение, например методом [HtmlFilter::encode](../../text/html-filter/encode.md).

Если имя пустое, метод возвращает логин, а если нет и логина — текст-заглушку на языке сайта, например `<Без имени>`. Если объект не связан с `$USER`, метод возвращает пустую строку.

## Примеры

**Пример.** Код выводит имя пользователя с экранированием HTML:

```php
<?php
use Bitrix\Main\Engine\CurrentUser;
use Bitrix\Main\Text\HtmlFilter;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo HtmlFilter::encode(CurrentUser::get()->getFormattedName());
```

## Смотрите также

- [CurrentUser::getFullName](get-full-name.md)
