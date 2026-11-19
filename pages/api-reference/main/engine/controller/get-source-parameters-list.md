---
title: Получить источники параметров Controller::getSourceParametersList
description: Метод Controller::getSourceParametersList возвращает список массивов, из которых ядро подбирает аргументы действия.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::getSourceParametersList` возвращает источники параметров действия. Источник — массив или объект `ParameterDictionary` вида `имя => значение`. Ядро ищет аргумент действия в источниках по порядку. Для AJAX-запроса источники — параметры POST и GET.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
final public function getSourceParametersList()
```

## Возвращаемое значение

Метод возвращает массив источников. До вызова [run](run.md) или [setSourceParametersList](set-source-parameters-list.md) метод возвращает `null`.

## Примеры

**Пример.** Код читает источники параметров после выполнения:

```php
<?php
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitController extends Controller
{
    public function configureActions()
    {
        return ['list' => ['prefilters' => []]];
    }

    public function listAction(int $limit = 2): array
    {
        return [];
    }
}

$controller = new UnitController();
$controller->run('list', [['limit' => 3], ['sort' => 'name']]);

echo json_encode($controller->getSourceParametersList());
```

Код выведет `[{"limit":3},{"sort":"name"}]`.

## Смотрите также

- [Controller::setSourceParametersList](set-source-parameters-list.md)
