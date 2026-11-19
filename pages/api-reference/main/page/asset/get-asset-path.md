---
title: Удалить параметры из пути Asset::getAssetPath
description: Статический метод Asset::getAssetPath удаляет из локального пути к файлу параметры после знака вопроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Asset::getAssetPath` удаляет из пути к файлу параметры после `?`, например метку времени. Методы [addCss](add-css.md) и [addJs](add-js.md) вызывают его сами, поэтому файл с разными параметрами подключится один раз.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public static function getAssetPath($src)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| src\* | `string` | Задает путь к файлу |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает путь без параметров. Внешний адрес метод возвращает без изменений.

## Примеры

**Пример.** Код удаляет параметры из локального пути и внешнего адреса:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Asset::getAssetPath('/local/js/units.js?1700000000') . ' ' . Asset::getAssetPath('https://cdn.example.com/units.js?v=2');
```

Код выведет `/local/js/units.js https://cdn.example.com/units.js?v=2`.

## Смотрите также

- [Asset::getAssetTime](get-asset-time.md)
