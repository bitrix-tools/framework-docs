---
title: Проверить право менять чужие настройки Options::isCurrentUserEditOtherSettings
description: Статический метод Options::isCurrentUserEditOtherSettings проверяет право текущего пользователя edit_other_settings.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Options::isCurrentUserEditOtherSettings` проверяет у текущего пользователя право `edit_other_settings` — право менять настройки других пользователей. Компонент `main.ui.filter` показывает отметку «Для всех» только пользователю с этим правом.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public static function isCurrentUserEditOtherSettings()
```

## Возвращаемое значение

Метод возвращает `true`, если право есть, иначе `false`.

## Примеры

**Пример.** Код проверяет право в консольном скрипте:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Options::isCurrentUserEditOtherSettings());
```

Код выведет `bool(false)`, потому что скрипт работает от гостя.

## Смотрите также

- [Options::saveForAll](save-for-all.md)
