---
title: Получить имя класса фильтра Base::className
description: Метод ActionFilter\Base::className возвращает полное имя класса фильтра, у которого его вызвали.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Base::className` возвращает полное имя класса, у которого его вызвали. Для наследника метод возвращает имя наследника.

Сигнатура метода в классе `Bitrix\Main\Engine\ActionFilter\Base`:

```php
final public static function className()
```

## Возвращаемое значение

Метод возвращает строку с именем класса без ведущей обратной косой черты, например `Bitrix\Main\Engine\ActionFilter\Csrf`.

## Примеры

**Пример.** Код выводит имя класса фильтра `Csrf`:

```php
<?php
use Bitrix\Main\Engine\ActionFilter\Csrf;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Csrf::className();
```

Код выведет `Bitrix\Main\Engine\ActionFilter\Csrf`.

## Смотрите также

- [Base::listAllowedScopes](list-allowed-scopes.md)
