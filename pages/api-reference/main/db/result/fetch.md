---
title: Получить строку результата Result::fetch
description: Метод Result::fetch возвращает следующую строку результата с преобразованными значениями или false, если строк больше нет.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Result::fetch` возвращает следующую строку результата ассоциативным массивом и преобразует значения. Аналог в классическом API — `CDBResult::Fetch`.

Сигнатура метода в классе `Bitrix\Main\DB\Result`:

```php
public function fetch(?\Bitrix\Main\Text\Converter $converter = null)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| converter | `Bitrix\Main\Text\Converter`, `null` | Задает объект, который кодирует каждое значение строки, например для вывода в HTML. По умолчанию — `null`, метод не кодирует значения |

## Возвращаемое значение

Метод возвращает массив `имя колонки => значение` или `false`, если строк больше нет.

Метод получает строку через [fetchRaw](fetch-raw.md) и меняет ее в таком порядке.

1. Применяет функции преобразования из [getConverters](get-converters.md). По умолчанию они превращают даты в объекты `Bitrix\Main\Type\Date` и `Bitrix\Main\Type\DateTime`.
2. Десериализует значения колонок из [setSerializedFields](set-serialized-fields.md).
3. Переименовывает колонки по [setReplacedAliases](set-replaced-aliases.md).
4. Вызывает функции из [addFetchDataModifier](add-fetch-data-modifier.md).
5. Кодирует значения объектом `converter`, если он передан. Тип текста метод берет из колонки `<имя>_TYPE`, если она есть в строке, иначе использует `Converter::TEXT`.

## Примеры

{% list tabs %}

- D7

  **Пример.** Код читает трех пользователей и выводит дату регистрации. Метод вернул дату объектом `DateTime`:

  ```php
  <?php
  use Bitrix\Main\Application;
  use Bitrix\Main\UserTable;

  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  $result = Application::getConnection()->query(
      'SELECT ID, LOGIN, DATE_REGISTER FROM ' . UserTable::getTableName() . ' ORDER BY ID',
      3
  );

  while ($row = $result->fetch())
  {
      echo $row['LOGIN'] . ' — ' . $row['DATE_REGISTER']->format('Y-m-d') . PHP_EOL;
  }
  ```

- Классический API

  **Пример.** Код читает те же строки через `CDBResult::Fetch`. Дата приходит строкой из базы данных:

  ```php
  <?php
  use Bitrix\Main\UserTable;

  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  global $DB;

  $result = $DB->Query('SELECT ID, LOGIN, DATE_REGISTER FROM ' . UserTable::getTableName() . ' ORDER BY ID LIMIT 3');

  while ($row = $result->Fetch())
  {
      echo $row['LOGIN'] . ' — ' . $row['DATE_REGISTER'] . PHP_EOL;
  }
  ```

{% endlist %}

**Пример.** Код кодирует значения для вывода в HTML. Объект `HtmlConverter` экранирует строку и не трогает объекты дат:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\Text\Converter;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = Application::getConnection()->query("SELECT '<b>kg</b>' AS TITLE");

$row = $result->fetch(Converter::getHtmlConverter());
echo $row['TITLE'];
```

Код выведет `&lt;b&gt;kg&lt;/b&gt;`.

## Смотрите также

- [Result::fetchAll](fetch-all.md)
- [Result::fetchRaw](fetch-raw.md)
- [Connection::query](../connection/query.md)
