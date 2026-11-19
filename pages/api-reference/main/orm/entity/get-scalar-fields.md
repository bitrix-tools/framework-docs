---
title: Получить скалярные поля Entity::getScalarFields
description: Метод Entity::getScalarFields возвращает поля сущности, которые хранят значения в колонках таблицы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::getScalarFields` возвращает скалярные поля — поля, которые хранят значения в колонках таблицы. Выражения и связи в результат не попадают. По этим полям [compileDbTableStructureDump](compile-db-table-structure-dump.md) строит таблицу.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function getScalarFields()
```

## Возвращаемое значение

Метод возвращает массив `имя поля => объект поля`. Ключи — имена полей в исходном регистре.

## Примеры

**Пример.** Код выводит скалярные поля сущности языков:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo implode(',', array_keys(LanguageTable::getEntity()->getScalarFields()));
```

Код выведет имена полей через запятую, например `LID,SORT,DEF,ACTIVE,NAME,CULTURE_ID,CODE`.

## Смотрите также

- [Entity::getFields](get-fields.md)
