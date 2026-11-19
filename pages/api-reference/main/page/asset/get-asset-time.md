---
title: Получить метку времени из пути Asset::getAssetTime
description: Статический метод Asset::getAssetTime возвращает часть пути к файлу после знака вопроса — метку времени изменения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Asset::getAssetTime` возвращает часть пути к файлу после `?`. Ядро добавляет туда метку времени изменения файла, чтобы браузер загрузил новую версию после изменения.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public static function getAssetTime($file = '')
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| file | `string` | Задает путь к файлу. По умолчанию — пустая строка |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку после `?`. Если в пути нет `?`, метод возвращает `false`.

## Примеры

**Пример.** Код читает метку из пути с меткой и без нее:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Asset::getAssetTime('/local/js/units.js?1700000000') . ' ' . var_export(Asset::getAssetTime('/local/js/units.js'), true);
```

Код выведет `1700000000 false`.

## Смотрите также

- [Asset::getAssetPath](get-asset-path.md)
- [Asset::getFullAssetPath](get-full-asset-path.md)
