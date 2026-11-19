---
title: Найти обработчики события EventManager::findEventHandlers
description: Метод EventManager::findEventHandlers возвращает обработчики события из базы данных и текущего запроса в порядке вызова.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `EventManager::findEventHandlers` возвращает обработчики события. Метод [send](send.md) вызывает его, чтобы получить обработчики. Аналог в классическом API — функция `GetModuleEvents`.

Сигнатура метода в классе `Bitrix\Main\EventManager`:

```php
public function findEventHandlers($eventModuleId, $eventType, ?array $filter = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| eventModuleId\* | `string` | Задает код модуля, который отправляет событие. Регистр не важен |
| eventType\* | `string` | Задает имя события. Регистр не важен |
| filter | `array`, `null` | Задает коды модулей обработчиков. Если массив не пустой, метод вернет только обработчики этих модулей. По умолчанию — `null` |

Типы `eventModuleId` и `eventType` в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает массив обработчиков, отсортированный по `SORT`. Если обработчиков нет, метод возвращает пустой массив.

Каждый обработчик — массив с ключами `SORT`, `VERSION` и `TO_NAME`. У обработчика из базы данных есть ключи `TO_MODULE_ID`, `TO_CLASS`, `TO_METHOD`, `TO_PATH` и `TO_METHOD_ARG`. У обработчика из текущего запроса — `CALLBACK` и `FULL_PATH`. Ключ `VERSION` равен `2` для обработчиков, которые получают объект события, и `1` для режима совместимости.

С фильтром метод пропускает обработчики, добавленные в текущем запросе, потому что у них нет кода модуля.

## Особенности

При первом вызове метод загружает регистрации из базы данных и кеширует их в управляемом кеше на 3600 секунд. Метод загружает только регистрации установленных модулей.

## Примеры

**Пример.** Код выводит обработчики события `OnPageStart` модуля `main`:

```php
<?php
use Bitrix\Main\EventManager;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

foreach (EventManager::getInstance()->findEventHandlers('main', 'OnPageStart') as $handler)
{
    echo $handler['SORT'] . ' ' . $handler['TO_NAME'] . PHP_EOL;
}
```

## Смотрите также

- [EventManager::send](send.md)
- [EventManager::clearLoadedHandlers](clear-loaded-handlers.md)
