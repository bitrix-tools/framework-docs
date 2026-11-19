---
title: Выполнить действие Action::runWithSourceParametersList
description: Метод Action::runWithSourceParametersList подбирает аргументы, вызывает onBeforeRun, run и onAfterRun и возвращает результат run.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Action::runWithSourceParametersList` выполняет действие. Контроллер вызывает метод после фильтров действия. Чтобы выполнить действие в коде приложения, вызывайте метод контроллера `run`. Он применяет фильтры и собирает ошибки действия.

Сигнатура метода в классе `Bitrix\Main\Engine\Action`:

```php
public function runWithSourceParametersList()
```

## Возвращаемое значение

Метод возвращает значение, которое вернул метод `run`. Если защищенный метод `onBeforeRun` вернул ложное значение, метод не вызывает `run` и возвращает `null`.

Метод выполняет шаги по порядку:

1. Создает объект, который подбирает аргументы, если его еще нет.
2. Вызывает `onBeforeRun`.
3. Подбирает аргументы, как метод [getArguments](get-arguments.md), если их еще не подобрали, и вызывает `run`.
4. Вызывает `onAfterRun`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\SystemException` | У класса действия нет метода `run` |
| `Bitrix\Main\Engine\AutoWire\BinderArgumentException` | `onBeforeRun` разрешил выполнение, и для обязательного аргумента `run` нет значения или значение не подходит под тип |

Метод не перехватывает исключения из `run`. Метод контроллера `run` перехватывает их и добавляет ошибку в свой список. Вне режима отладки контроллер заменяет текст ошибки общим сообщением, кроме исключений `ArgumentException`, его наследников и `ValidationException`. Ошибки, которые действие добавило до исключения, контроллер не переносит.

## Примеры

**Пример.** Код выполняет действие, которое пропускает `run` для пустого кода:

```php
<?php
use Bitrix\Main\Engine\Action;
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitViewAction extends Action
{
    protected function onBeforeRun()
    {
        return $this->getArguments()['code'] !== '';
    }

    public function run(string $code)
    {
        return 'unit ' . $code;
    }
}

foreach (['kg', ''] as $code)
{
    $controller = (new Controller())->setSourceParametersList([['code' => $code]]);
    $action = new UnitViewAction('view', $controller);

    echo var_export($action->runWithSourceParametersList(), true) . ' ';
}
```

Код выведет `'unit kg' NULL`.

## Смотрите также

- [Action::getArguments](get-arguments.md)
- [Action::getErrors](get-errors.md)
