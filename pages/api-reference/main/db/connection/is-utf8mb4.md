---
title: Проверить кодировку utf8mb4 Connection::isUtf8mb4
description: Метод Connection::isUtf8mb4 проверяет по настройкам соединения, включена ли кодировка utf8mb4 для таблицы или колонки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Connection::isUtf8mb4` проверяет ключ `utf8mb4` в настройках соединения в `.settings.php`. Метод не обращается к базе данных и не проверяет фактическую кодировку таблицы.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function isUtf8mb4($table = null, $column = null)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| table | `string`, `null` | Задает имя таблицы. По умолчанию — `null`, метод проверяет только общую настройку |
| column | `string`, `null` | Задает имя колонки таблицы `table`. По умолчанию — `null` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает `true`, если в настройках выполняется одно из условий.

- `utf8mb4['global']` равно `true`.
- `utf8mb4['tables'][$table]` равно `true`.
- `utf8mb4['tables'][$table][$column]` равно `true`.

Иначе метод возвращает `false`. Метод сравнивает значения строго, строка `'Y'` не включает настройку.

## Примеры

**Пример.** Фрагмент `.settings.php` включает `utf8mb4` для одной колонки:

```php
'connections' => [
    'value' => [
        'default' => [
            // Остальные параметры соединения
            'utf8mb4' => [
                'tables' => [
                    'demo_api_notes' => [
                        'TEXT' => true,
                    ],
                ],
            ],
        ],
    ],
],
```

**Пример.** Код проверяет настройку для этой колонки:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Application::getConnection()->isUtf8mb4('demo_api_notes', 'TEXT'));
```

## Смотрите также

- [Конфигурация ядра](../../../../framework/settings.md)
