---
title: Получить класс построителя запроса DataManager::getQueryClass
description: Метод DataManager::getQueryClass возвращает класс, объект которого создает query. Наследник переопределяет его, чтобы добавить запросам свои методы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::getQueryClass` возвращает класс построителя запроса. Метод [query](query.md) создает объект этого класса. Наследник переопределяет метод и возвращает свой класс, производный от `Query`, чтобы добавить запросам методы, например готовые фильтры.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function getQueryClass()
```

## Возвращаемое значение

Метод возвращает имя класса. Базовый класс возвращает `Bitrix\Main\ORM\Query\Query`.

## Примеры

**Пример.** Код задает свой класс запроса с готовым фильтром:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class LanguageQuery extends Query
{
    public function whereEnglish(): static
    {
        return $this->where('LID', 'en');
    }
}

class DemoLanguageTable extends LanguageTable
{
    public static function getQueryClass()
    {
        return LanguageQuery::class;
    }
}

echo DemoLanguageTable::query()->setSelect(['NAME'])->whereEnglish()->fetch()['NAME'];
```

Код выведет `English`.

## Смотрите также

- [DataManager::query](query.md)
