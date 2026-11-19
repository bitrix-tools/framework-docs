---
title: Задать обработчик фраз Loc::setMessageDecorator
description: Метод Loc::setMessageDecorator задает функцию, через которую Loc::getMessage пропускает каждую фразу перед возвратом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loc::setMessageDecorator` задает функцию-обработчик фраз. Метод [getMessage](get-message.md) передает обработчику каждую фразу и возвращает то, что вернул обработчик. Обработчик подходит, например, для подсветки непереведенных фраз или для вывода кода фразы рядом с текстом.

Метод появился в версии `main` новее 26.150.0.

Сигнатура метода в классе `Bitrix\Main\Localization\Loc`:

```php
public static function setMessageDecorator(?callable $decorator): void
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| decorator\* | `callable`, `null` | Задает обработчик фраз. Значение `null` отключает обработчик |

Метод `getMessage` вызывает обработчик с пятью аргументами.

| Аргумент | Тип | Описание |
| --- | --- | --- |
| code | `string` | Код фразы |
| raw | `string`, `null` | Фраза из языкового файла. Если фразы нет, передается `null` |
| message | `string`, `null` | Фраза, которую вернет `getMessage`. Сейчас совпадает с `raw` |
| file | `string`, `null` | Путь языкового файла фразы, как у [getMessageSourceFile](get-message-source-file.md) |
| language | `string` | Код языка |

Обработчик возвращает строку или `null`. Результат заменяет фразу.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- Обработчик действует до конца запроса или до следующего вызова метода. Класс хранит один обработчик, новый вызов заменяет прежний.
- Метод `getMessage` вызывает обработчик и для фразы, которой нет в языковых файлах. Если обработчик вернул строку, `getMessage` вернет ее вместо `null`.
- Метод `getMessage` подставляет значения из параметра `replace` после обработчика. Обработчик получает фразу с метками вида `#NUM#`.
- Пока обработчик задан, класс запоминает языковой файл каждой загруженной фразы. Фразы, которые класс загрузил до вызова метода, остаются без файла, и обработчик получает `null` в аргументе `file`.
- Классическая функция `GetMessage` возвращает фразу из глобального массива `$MESS` без обработчика. Обработчик срабатывает, только если `GetMessage` передает вызов в `Loc::getMessage`.

## Примеры

**Пример.** Код задает обработчик, который добавляет к фразе ее код, получает фразу и в блоке `finally` отключает обработчик:

```php
<?php
use Bitrix\Main\Localization\Loc;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

Loc::setMessageDecorator(
    static function (string $code, ?string $raw, ?string $message, ?string $file, string $language): ?string
    {
        return $message === null ? null : $message . ' [' . $code . ']';
    }
);

try
{
    Loc::loadMessages($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/install/index.php');
    echo Loc::getMessage('MAIN_EVERYONE_GROUP_NAME', null, 'en');
}
finally
{
    Loc::setMessageDecorator(null);
}
```

Код выведет `All users (with non-authorized users) [MAIN_EVERYONE_GROUP_NAME]`.

## Смотрите также

- [Loc::getMessage](get-message.md)
- [Loc::getMessageSourceFile](get-message-source-file.md)
