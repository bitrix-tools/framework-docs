---
title: Получить аргументы действия Action::getArguments
description: Метод Action::getArguments возвращает аргументы метода run действия, подобранные из параметров запроса и автоматически подставляемых объектов.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Action::getArguments` возвращает аргументы, с которыми действие вызовет метод `run`. Метод подбирает значения по именам аргументов из списков параметров контроллера и из автоматически подставляемых объектов, например `CurrentUser`.

Метод нужен в фильтрах действия, которые проверяют или меняют аргументы до выполнения.

Сигнатура метода в классе `Bitrix\Main\Engine\Action`:

```php
final public function getArguments()
```

## Возвращаемое значение

Метод возвращает ассоциативный массив. Ключи — имена аргументов `run`, элементы — подобранные значения. Для аргумента, которого нет в параметрах, метод берет значение по умолчанию из объявления `run`.

Метод подбирает значения при первом вызове и дальше возвращает их же. Метод [setArguments](set-arguments.md) заменяет значения.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\SystemException` | У класса действия нет метода `run` |
| `Bitrix\Main\Engine\AutoWire\BinderArgumentException` | Для обязательного аргумента нет значения, значение не подходит под тип или не прошло проверку атрибутов валидации, у аргумента union- или intersection-тип или не удалось построить автоматически подставляемый объект |

## Примеры

**Пример.** Код задает контроллеру параметры запроса и выводит аргументы действия:

```php
<?php
use Bitrix\Main\Engine\Action;
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitViewAction extends Action
{
    public function run(string $code, int $page = 1)
    {
        return ['code' => $code, 'page' => $page];
    }
}

$controller = new Controller();
$controller->setSourceParametersList([['code' => 'kg']]);

$action = new UnitViewAction('view', $controller);

var_export($action->getArguments());
```

Код выведет:

```text
array (
  'code' => 'kg',
  'page' => 1,
)
```

## Смотрите также

- [Action::setArguments](set-arguments.md)
- [Action::getBinder](get-binder.md)
- [Контроллеры](../../../../framework/controllers.md#autowiring)
