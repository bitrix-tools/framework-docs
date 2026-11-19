---
title: Принять настройки действия Action::configure
description: Метод Action::configure получает значение ключа configure из описания действия в configureActions. Базовая реализация ничего не делает.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Action::configure` принимает дополнительные настройки действия. Конструктор вызывает метод, если в описании действия есть ключ `configure` со значением, отличным от `null`. Базовая реализация ничего не делает. Переопределите метод, чтобы одно действие работало по-разному в разных контроллерах.

Сигнатура метода в классе `Bitrix\Main\Engine\Action`:

```php
public function configure($params)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| params\* | `mixed` | Задает значение ключа `configure` из описания действия в `configureActions` |

## Возвращаемое значение

Метод ничего не возвращает.

Конструктор вызывает `configure` до защищенного метода `init`. В `init` настройки уже доступны.

## Примеры

**Пример.** Код передает действию единицу измерения через ключ `configure` и выполняет действие:

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
                'configure' => ['unit' => 'kg'],
                'prefilters' => [],
            ],
        ];
    }
}

class UnitViewAction extends Action
{
    private string $unit = '';

    public function configure($params)
    {
        $this->unit = (string)($params['unit'] ?? '');
    }

    public function run(int $amount)
    {
        return $amount . ' ' . $this->unit;
    }
}

echo (new UnitsController())->run('view', [['amount' => 5]]);
```

Код выведет `5 kg`. Пустой список `prefilters` отключает префильтры действия, чтобы пример работал из консоли. В рабочем контроллере оставьте фильтры авторизации и проверки CSRF.

## Смотрите также

- [Action::__construct](construct.md)
- [Action::getConfig](get-config.md)
