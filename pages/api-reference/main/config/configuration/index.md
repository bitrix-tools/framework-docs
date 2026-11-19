---
title: Configuration — конфигурация ядра и модулей
description: Класс Bitrix\Main\Config\Configuration для чтения и изменения секций конфигурационных PHP-файлов.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Config`

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

## Когда использовать

Класс `Configuration` читает и меняет секции из `.settings.php`, общей конфигурации и файлов установленных модулей. Он подходит для параметров соединений, кеша, обработки ошибок и других настроек ядра.

Объект получают через `getInstance` или `getInstanceByPath`. Класс объявлен `final` и реализует `ArrayAccess`, `Iterator` и `Countable`. Операции с объектом меняют данные в памяти. Метод `saveConfiguration` записывает их в файл, а `setValue` объединяет изменение и сохранение.

Для параметров модулей в базе данных используют класс [Option](../option/index.md). Формат секций и сценарии настройки приведены в статье [Конфигурация ядра](../../../../framework/settings.md).

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [getValue](get-value.md) | Возвращает значение секции | |
| [setValue](set-value.md) | Изменяет и сохраняет секцию | |
| [getInstance](get-instance.md) | Возвращает объект конфигурации | |
| [getInstanceByPath](get-instance-by-path.md) | Возвращает конфигурацию по пути | |
| [saveConfiguration](save-configuration.md) | Сохраняет конфигурацию | |
| [add](add.md) | Добавляет или изменяет секцию | |
| [addReadonly](add-readonly.md) | Добавляет защищенную секцию | |
| [isReadonly](is-readonly.md) | Проверяет, защищена ли секция | |
| [delete](delete.md) | Удаляет секцию | |
| [get](get.md) | Возвращает значение секции объекта | |
| [offsetExists](offset-exists.md) | Проверяет наличие секции | |
| [offsetGet](offset-get.md) | Возвращает значение через ArrayAccess | |
| [offsetSet](offset-set.md) | Изменяет секцию через ArrayAccess | |
| [offsetUnset](offset-unset.md) | Удаляет секцию через ArrayAccess | |
| [current](current.md) | Возвращает текущее значение итератора | |
| [next](next.md) | Переходит к следующей секции | |
| [key](key.md) | Возвращает ключ текущей секции | |
| [valid](valid.md) | Проверяет позицию итератора | |
| [rewind](rewind.md) | Возвращает итератор к началу | |
| [count](count.md) | Считает секции | |
| [wnc](wnc.md) | Переносит настройки классического API | |

## Смотрите также

- [Конфигурация ядра](../../../../framework/settings.md)
- [Option](../option/index.md)
