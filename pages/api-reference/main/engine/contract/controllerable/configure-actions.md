---
title: Настроить действия Controllerable::configureActions
description: Метод Controllerable::configureActions возвращает настройки префильтров и постфильтров для действий контроллера или компонента.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controllerable::configureActions` возвращает настройки фильтров для действий. Контроллер читает настройки при создании своего объекта. Действие, которого нет в настройках, получает фильтры по умолчанию.

Сигнатура метода в интерфейсе `Bitrix\Main\Engine\Contract\Controllerable`:

```php
public function configureActions();
```

## Возвращаемое значение

Метод возвращает массив. Ключ — имя действия без суффикса `Action`, значение — массив настроек действия. Контроллер сравнивает имя действия с ключами массива без учета регистра.

#|
|| Ключ | Описание ||
|| prefilters<br>`array` | Заменяет префильтры по умолчанию. Фильтры выполняются до действия ||
|| postfilters<br>`array` | Заменяет постфильтры по умолчанию. Фильтры выполняются после действия ||
|| +prefilters<br>`array` | Добавляет фильтры к префильтрам действия. Без ключа `prefilters` — к префильтрам по умолчанию ||
|| -prefilters<br>`array` | Убирает префильтры действия. Элементы — имена классов фильтров ||
|| +postfilters<br>`array` | Добавляет фильтры к постфильтрам действия. Без ключа `postfilters` — к постфильтрам по умолчанию ||
|| -postfilters<br>`array` | Убирает постфильтры действия. Элементы — имена классов фильтров ||
|| filters<br>`array` | Заменяет и префильтры, и постфильтры по умолчанию одним списком. Нельзя указывать вместе с `prefilters` или `postfilters` ||
|| +filters<br>`array` | Добавляет фильтры и к префильтрам, и к постфильтрам действия ||
|| -filters<br>`array` | Убирает фильтры из префильтров и постфильтров действия. Элементы — имена классов фильтров ||
|#

Элемент списков `prefilters` и `postfilters` — объект наследника [ActionFilter\Base](../../action-filter/base/index.md) или замыкание. Элемент списков `filters` и `+filters` — объект наследника `ActionFilter\Base`. Если метод вернул `null` или пустой массив, все действия получают фильтры по умолчанию.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\Engine\Exception\ActionConfigurationException` | Ключ массива не строка, значение не массив, элемент `prefilters`, `postfilters`, `filters` или `+filters` не фильтр. Ключ `filters` указан вместе с `prefilters` или `postfilters`, текст ошибки `filters cannot be combined with prefilters or postfilters`. Также если у метода-действия есть атрибуты фильтров и одновременно ключ в `configureActions` |

Контроллер выбрасывает исключение в своем конструкторе, когда читает настройки.

## Особенности

Контроллер применяет ключи с модификаторами по порядку.

1. Убирает фильтры из списка `-filters`.
2. Убирает фильтры из списков `-prefilters` и `-postfilters`.
3. Добавляет фильтры из `+prefilters` и `+postfilters`.
4. Добавляет фильтры из `+filters`.

Поэтому фильтр, добавленный через `+`, вычитание не убирает.

Контроллер сравнивает фильтры с именами классов через `is_a`, поэтому `-prefilters` и `-filters` убирают и наследников указанного класса. Ключ `-prefilters` с классом `Csrf` убирает и фильтр `Csrf`, который контроллер добавил сам для POST-запроса.

## Примеры

**Пример.** Компонент объявляет действие `list` без префильтров. Код запускает действие через `ComponentController` так же, как роутер AJAX-запросов, и выводит результат:

```php
<?php
use Bitrix\Main\Engine\Component\ComponentController;
use Bitrix\Main\Engine\Contract\Controllerable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class DemoUnitListComponent extends CBitrixComponent implements Controllerable
{
    public function configureActions()
    {
        return [
            'list' => [
                'prefilters' => [],
            ],
        ];
    }

    public function listAction()
    {
        return ['kg', 'm'];
    }
}

$controller = new ComponentController(new DemoUnitListComponent());

print_r($controller->run('list', []));
```

Код выведет массив из двух элементов `kg` и `m`.

## Смотрите также

- [ActionFilter\Base](../../action-filter/base/index.md)
- [ActionFilter\Csrf](../../action-filter/csrf/index.md)
- [Дополняющие и вычитающие фильтры](../../../../../framework/pre-post-filters.md#filter-modifiers)
- [Общий набор префильтров и постфильтров](../../../../../framework/pre-post-filters.md#common-filters)
