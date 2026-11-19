---
title: Получить связанные поля Reference::getElementals
description: Метод Reference::getElementals возвращает пары полей текущей и связанной сущности, которые условие связи соединяет равенством.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Reference::getElementals` возвращает пары полей, которые условие связи соединяет равенством, например `GROUP_ID` текущей сущности и `ID` связанной. Объект ORM вызывает метод, когда ему присваивают связанный объект. По этим парам объект заполняет свои поля, например `GROUP_ID`.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\Relations\Reference`:

```php
public function getElementals()
```

## Возвращаемое значение

Метод возвращает массив, ключ — имя поля текущей сущности, значение — имя поля связанной сущности.

В массив попадают только условия вида `'this.FIELD' = 'ref.FIELD'`, у которых:

- оператор `=`,
- справа поле, а не значение,
- одна сторона начинается с `this.`, другая — с `ref.`, а в именах нет других точек.

Если условие связи задали массивом в старом формате, метод возвращает `false`.

## Примеры

**Пример.** Условие связи содержит равенство полей и фильтр по значению. Метод возвращает только пару полей. Класс связанной сущности пример не объявляет, метод его не загружает:

```php
<?php
use Bitrix\Main\ORM\Fields\Relations\Reference;
use Bitrix\Main\ORM\Query\Join;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$field = new Reference(
    'GROUP',
    '\Demo\UnitGroupTable',
    Join::on('this.GROUP_ID', 'ref.ID')->where('ref.ACTIVE', 'Y')
);

print_r($field->getElementals());
```

Код выведет массив с ключом `GROUP_ID` и значением `ID`.

## Смотрите также

- [Reference::getReference](get-reference.md)
