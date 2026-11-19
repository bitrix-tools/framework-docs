---
title: Сохранить параметр Option::set
description: Метод Option::set сохраняет общее значение параметра или значение для сайта, сбрасывает кеш и отправляет события.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Option::set` сохраняет значение параметра модуля в базе данных. Аналог в классическом API — `COption::SetOptionString`. Его пятый аргумент задает сайт, а четвертый аргумент `desc` не влияет на запись.

Сигнатура метода в классе `Bitrix\Main\Config\Option`:

```php
public static function set($moduleId, $name, $value = "", $siteId = "")
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| moduleId\* | `string` | Задает идентификатор модуля без учета регистра |
| name\* | `string` | Задает имя параметра без учета регистра. При длине больше 100 символов метод вызывает предупреждение `E_USER_WARNING` и продолжает запись |
| value | `string` | Задает значение параметра. По умолчанию — `""` |
| siteId | `string`, `bool` | Выбирает сайт. По умолчанию — `""`, то есть общий параметр. Значение `false` выбирает сайт из текущего контекста |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их типы. Предупреждение о длинном имени сообщает об усечении при сохранении, но сам метод не обрезает имя перед запросом. Результат зависит от базы данных.

## Возвращаемое значение

Метод не возвращает значение. Результат вызова — `null`. Метод `COption::SetOptionString` после успешного вызова возвращает `true`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentNullException` | Аргумент `moduleId` или `name` равен пустой строке |
| `Bitrix\Main\ArgumentOutOfRangeException` | При загрузке обработчиков `moduleId` содержит символы вне `a-z`, `A-Z`, `0-9`, точки и подчеркивания. Проверка идет после записи |
| `Bitrix\Main\DB\ConnectionException` | Не удалось установить соединение с базой данных |
| `Bitrix\Main\DB\SqlQueryException` | Не удалось сохранить параметр в базе данных |

## Особенности

Метод сбрасывает кеш параметров модуля после записи, затем загружает `option_triggers.php` модуля через `Loader::getLocal`. Этот файл он подключает не более одного раза для модуля в пределах выполнения скрипта.

Затем метод отправляет события модуля `main` в таком порядке.

| Событие | Параметры |
| --- | --- |
| `OnAfterSetOption_<name>` | Передает `value`. Имя параметра в названии события имеет нижний регистр |
| `OnAfterSetOption` | Передает `moduleId`, `name`, `value`, `siteId`. Идентификатор модуля и имя параметра имеют нижний регистр |

Ошибка загрузки файла обработчиков или исключение обработчика могут возникнуть после сохранения значения. Метод не оборачивает запись и отправку событий в транзакцию и не отменяет запись при такой ошибке.

## Примеры

Примеры создают общий параметр `display_mode` в демонстрационном модуле `example.optiondocs`. Чтобы удалить его после проверки, используйте пример [Option::delete](delete.md).

{% list tabs %}

- D7

  **Пример.** Код сохраняет режим отображения без привязки к сайту:

  ```php
  <?php
  use Bitrix\Main\Config\Option;

  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  Option::set('example.optiondocs', 'display_mode', 'compact', '');
  var_dump(Option::getRealValue('example.optiondocs', 'display_mode', ''));
  ```

- Классический API

  {% note warning "" %}

  Класс `COption` устарел. Его методы продолжают работать. Для нового кода используйте `Option`.

  {% endnote %}

  **Пример.** Код сохраняет тот же параметр через `COption`:

  ```php
  <?php
  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  COption::SetOptionString('example.optiondocs', 'display_mode', 'compact', false, '');
  var_dump(COption::GetOptionString('example.optiondocs', 'display_mode', '', '', true));
  ```

{% endlist %}

## Смотрите также

- [Option::get](get.md).
- [Option::delete](delete.md).
