---
title: Подключить расширение Extension::load
description: Метод Extension::load регистрирует JS-расширения по файлам config.php и подключает их на страницу вместе с зависимостями.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Extension::load` подключает расширения на страницу. Для каждого расширения метод вызывает [register](register.md) и, если регистрация прошла, вызывает `CJSCore::Init`. Метод `CJSCore::Init` добавляет на страницу файлы расширения, его языковые фразы и зависимости из `rel`.

Сигнатура метода в классе `Bitrix\Main\UI\Extension`:

```php
public static function load($extNames)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| extNames\* | `string`, `array` | Задает имя расширения или массив имен, например `'main.loader'` или `['ui.hint', 'main.loader']` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает. Если метод не нашел расширение, он пропускает его без ошибки.

## Особенности

Метод `CJSCore::RegisterExt` не регистрирует расширение, если ключ `use` в его конфигурации не совпадает с разделом сайта — административным или публичным. Метод [register](register.md) при этом вернет `true`, а `load` не подключит расширение.

## Примеры

{% list tabs %}

- D7

  **Пример.** Код подключает расширения `ui.hint` и `main.loader`:

  ```php
  <?php
  use Bitrix\Main\UI\Extension;

  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  Extension::load(['ui.hint', 'main.loader']);
  ```

- Классический API

  Метод `CJSCore::Init` подключает расширения. Незарегистрированное расширение он регистрирует через `Extension::register`.

  **Пример.** Код подключает расширение `popup` через `CJSCore`:

  ```php
  <?php
  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  CJSCore::Init(['popup']);
  ```

{% endlist %}

## Смотрите также

- [Extension::register](register.md)
- [Extension::getHtml](get-html.md)
- [Расширения](../../../../framework/extensions.md)
