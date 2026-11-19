---
title: Получить имя действия Action::getName
description: Метод Action::getName возвращает имя действия, под которым его вызвал контроллер.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Action::getName` возвращает имя действия, переданное в конструктор. Контроллер передает имя из запроса в том виде, в котором его получил метод контроллера `run`. Исключение — `FallbackAction`, его имя всегда `fallback`.

Сигнатура метода в классе `Bitrix\Main\Engine\Action`:

```php
final public function getName()
```

## Возвращаемое значение

Метод возвращает строку, например `view`. Регистр имени совпадает с запросом. Контроллер ищет описание действия без учета регистра, а имя передает как есть.

## Примеры

**Пример.** Код выполняет действие под именем в другом регистре и выводит имя:

```php
<?php
use Bitrix\Main\Engine\Action;
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitsController extends Controller
{
    public function configureActions()
    {
        return [
            'view' => [
                'class' => UnitViewAction::class,
                'prefilters' => [],
            ],
        ];
    }
}

class UnitViewAction extends Action
{
    public function run()
    {
        return $this->getName();
    }
}

echo (new UnitsController())->run('View', [[]]);
```

Код выведет `View`. Пустой список `prefilters` отключает префильтры действия, чтобы пример работал из консоли. В рабочем контроллере оставьте фильтры авторизации и проверки CSRF.

## Смотрите также

- [Action::getController](get-controller.md)
- [Action::getConfig](get-config.md)
