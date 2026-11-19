---
title: Получить загруженные языковые файлы Loc::getIncludedFiles
description: Метод Loc::getIncludedFiles возвращает пути языковых файлов, которые класс Loc загрузил в текущем запросе.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loc::getIncludedFiles` возвращает языковые файлы, которые класс `Loc` загрузил в текущем запросе. Список нужен, например, чтобы проверить, какие переводы использует страница.

Сигнатура метода в классе `Bitrix\Main\Localization\Loc`:

```php
public static function getIncludedFiles()
```

## Возвращаемое значение

Метод возвращает массив путей к языковым файлам, ключ и значение — один и тот же путь. Файлы, которые [loadMessages](load-messages.md) только зарегистрировал, но еще не загрузил, в список не входят.

## Примеры

**Пример.** Код загружает фразы установщика модуля `main` и проверяет, что английский языковой файл попал в список:

```php
<?php
use Bitrix\Main\Localization\Loc;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

Loc::loadLanguageFile($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/install/index.php', 'en');

foreach (Loc::getIncludedFiles() as $file)
{
    if (str_ends_with($file, '/main/lang/en/install/index.php'))
    {
        echo 'Loaded';
    }
}
```

Код выведет `Loaded`.

## Смотрите также

- [Loc::loadLanguageFile](load-language-file.md)
