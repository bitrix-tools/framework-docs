---
title: Получить настройки всех пользователей Options::getAllUserOptions
description: Метод Options::getAllUserOptions возвращает сохраненные настройки фильтра всех пользователей в виде CDBResult.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getAllUserOptions` возвращает сохраненные настройки фильтра всех пользователей. Метод нужен, например, чтобы обновить пресеты у всех пользователей методом [saveOptionsForUser](save-options-for-user.md).

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function getAllUserOptions()
```

## Возвращаемое значение

Метод возвращает объект `CDBResult`. Каждая запись содержит ключи `USER_ID`, `CATEGORY`, `NAME` и `VALUE` — сериализованные настройки. Общие настройки в результат не попадают.

## Примеры

**Пример.** Код сохраняет настройки для пользователя и находит их среди всех:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', ['active' => ['name' => 'Active', 'fields' => ['ACTIVE' => 'Y']]]);
$options->saveOptionsForUser($options->getOptions(), 1);

$result = $options->getAllUserOptions();
while ($row = $result->Fetch())
{
    echo $row['USER_ID'] . ' ' . $row['NAME'];
}
CUserOptions::DeleteOption('main.ui.filter', 'units_filter', false, 1);
```

Код выведет `1 units_filter`.

## Смотрите также

- [Options::saveOptionsForUser](save-options-for-user.md)
- [Options::isCommon](is-common.md)
