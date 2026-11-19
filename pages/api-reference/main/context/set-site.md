---
title: Задать сайт Context::setSite
description: Метод Context::setSite задает сайт контекста по идентификатору или объекту EO_Site.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Context::setSite` задает сайт контекста и возвращает тот же контекст. Ядро вызывает метод в начале запроса, когда определяет сайт.

Сигнатура метода в классе `Bitrix\Main\Context`:

```php
public function setSite($site)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| site\* | `string` или `Bitrix\Main\EO_Site` | Задает идентификатор сайта, например `s1`, или объект сайта. Для строки метод загружает поля сайта из базы данных |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает текущий контекст.

## Особенности

- Метод не проверяет, что сайт существует. Для несуществующего идентификатора [getSite](get-site.md) возвращает этот идентификатор, а поля объекта сайта равны `null`.
- Метод меняет только контекст и не меняет константы `SITE_ID`, `SITE_DIR` и региональные настройки контекста.

## Примеры

**Пример.** Код временно переключает контекст на сайт `s1` и восстанавливает прежний сайт, если он был задан:

```php
<?php
use Bitrix\Main\Context;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$context = Context::getCurrent();
$previousSite = $context->getSiteObject();

try
{
    $context->setSite('s1');
    echo $context->getSite() . ' ' . $context->getSiteObject()->getDir();
}
finally
{
    if ($previousSite !== null)
    {
        $context->setSite($previousSite);
    }
}
```

Если сайт `s1` находится в корне, код выведет `s1 /`.

## Смотрите также

- [Context::getSite](get-site.md)
- [Context::setLanguage](set-language.md)
