---
title: Получить полное имя класса Action::className
description: Метод Action::className возвращает полное имя класса, у которого его вызвали.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Action::className` возвращает полное имя класса, у которого его вызвали. Для наследника метод возвращает имя наследника, а не `Bitrix\Main\Engine\Action`. Результат совпадает с константой `::class` этого класса.

Сигнатура метода в классе `Bitrix\Main\Engine\Action`:

```php
final public static function className()
```

## Возвращаемое значение

Метод возвращает строку с полным именем класса без ведущей обратной косой черты.

## Примеры

**Пример.** Код задает класс действия в описании через `className`:

```php
<?php
use Bitrix\Main\Engine\Action;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitViewAction extends Action
{
    public function run()
    {
        return 'unit';
    }
}

$config = ['view' => ['class' => UnitViewAction::className()]];

echo $config['view']['class'];
```

Код выведет `UnitViewAction`.

## Смотрите также

- [Action::getConfig](get-config.md)
