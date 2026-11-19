---
title: Encoding — перекодировка строк
description: Класс Bitrix\Main\Text\Encoding переводит строки и массивы из одной кодировки в другую и проверяет строку на UTF-8.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Text`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.7

{% endnote %}

## Когда использовать

Класс `Encoding` переводит строки и массивы из одной кодировки в другую через расширение `mbstring`. Класс нужен, когда данные приходят в кодировке, отличной от UTF-8, например из файла CSV в Windows-1251 или из внешней системы. Все методы класса статические.

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [convertEncoding](convert-encoding.md) | Переводит строку или массив из одной кодировки в другую | |
| [convertToUtf](convert-to-utf.md) | Переводит строку в UTF-8, если она еще не в UTF-8 | |
| [convertEncodingToCurrent](convert-encoding-to-current.md) | Переводит строку в UTF-8, как `convertToUtf` | |
| [detectUtf8](detect-utf8.md) | Проверяет, что строка в кодировке UTF-8 | |

{% note warning "" %}

Метод `convertEncodingArray` устарел с версии 16.0.10. Метод продолжает работать и вызывает [convertEncoding](convert-encoding.md). Для нового кода используйте `convertEncoding`, он принимает и массивы.

{% endnote %}

## Смотрите также

- [Json](../../web/json/index.md)
