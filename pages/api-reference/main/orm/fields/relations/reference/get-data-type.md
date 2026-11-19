---
title: Получить имя связанной сущности Reference::getDataType
description: Метод Reference::getDataType возвращает имя связанной ORM-сущности без окончания Table.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Reference::getDataType` возвращает имя связанной сущности. Для поля связи тип данных — это связанная сущность.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\Relations\Reference`:

```php
public function getDataType()
```

## Возвращаемое значение

Метод возвращает строку с полным именем сущности с ведущей обратной косой чертой и без окончания `Table`. Например, для `Bitrix\Main\UserTable` метод вернет `\Bitrix\Main\User`.

## Примеры

**Пример.** Код передает имя ORM-класса без ведущей обратной косой черты и выводит имя сущности, на которую ссылается поле `GROUP`. Конструктор не проверяет, что класс существует, поэтому пример не объявляет его:

```php
<?php
use Bitrix\Main\ORM\Fields\Relations\Reference;
use Bitrix\Main\ORM\Query\Join;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$field = new Reference('GROUP', 'Demo\UnitGroupTable', Join::on('this.GROUP_ID', 'ref.ID'));

echo $field->getDataType();
```

Код выведет `\Demo\UnitGroup`.

## Смотрите также

- [Reference::__construct](construct.md)
