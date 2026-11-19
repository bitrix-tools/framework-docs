---
title: Получить текст на языке LocalizableMessageInterface::localize
description: Метод LocalizableMessageInterface::localize возвращает текст сообщения на заданном языке или null, если перевода нет.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `LocalizableMessageInterface::localize` возвращает текст сообщения на заданном языке. Источник перевода определяет класс-реализация.

Сигнатура метода в интерфейсе `Bitrix\Main\Localization\LocalizableMessageInterface`:

```php
public function localize(string $language): ?string;
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| language\* | `string` | Задает код языка, например `en` |

## Возвращаемое значение

Метод возвращает строку с текстом или `null`, если перевода на этот язык нет.

Реализации ядра ищут фразу по коду через `Loc::getMessage` или `Loc::getMessagePlural` на заданном языке. Если фразы нет, они подключают языковой файл, которому принадлежит фраза, и ищут еще раз. Если путь к этому файлу не передали в конструктор, файлом фразы считается файл, в котором создали объект.

## Примеры

**Пример.** Код реализует интерфейс для сообщения со статусом на двух языках и передает объект в ошибку. Метод `localize` возвращает текст на запрошенном языке:

```php
<?php
use Bitrix\Main\Error;
use Bitrix\Main\Localization\LocalizableMessageInterface;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class DemoStatusMessage implements LocalizableMessageInterface
{
    private const TEXTS = [
        'en' => 'Status is archived',
        'de' => 'Status ist archiviert',
    ];

    public function localize(string $language): ?string
    {
        return self::TEXTS[$language] ?? null;
    }

    public function __toString(): string
    {
        return (string)$this->localize('en');
    }
}

$error = new Error(new DemoStatusMessage());

echo $error->getLocalizableMessage()->localize('de') . PHP_EOL;
echo $error->getMessage();
```

Код выведет `Status ist archiviert` и `Status is archived`.

## Смотрите также

- [Error::getLocalizableMessage](../../error/get-localizable-message.md)
- [Error::getMessage](../../error/get-message.md)
