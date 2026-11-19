---
title: Выполнить действие Controller::run
description: Метод Controller::run выполняет действие контроллера с фильтрами и событиями и возвращает результат. Ошибки и исключения метод собирает в коллекцию.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::run` выполняет действие по имени. Ядро вызывает метод само, когда обрабатывает AJAX-запрос. Прикладной код вызывает метод, например в тестах или консольных командах.

Метод выполняет шаги по порядку.

1. Сохраняет источники параметров и расшифровывает подписанные параметры компонента.
2. Создает объект действия. Ищет метод `<имя>Action`, затем настройки в [configureActions](configure-actions.md).
3. Подключает префильтры и постфильтры действия.
4. Вызывает защищенный метод `processBeforeAction` и отправляет событие `onBeforeAction`. Если фильтр или обработчик вернул ошибку, метод не выполняет действие.
5. Подбирает аргументы метода действия из параметров по именам и выполняет действие.
6. Отправляет событие `onAfterAction` и вызывает `processAfterAction`.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
final public function run($actionName, array $sourceParametersList)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| actionName\* | `string` | Задает имя действия, например `list`. Регистр не важен |
| sourceParametersList\* | `array[]` | Задает список источников параметров. Источник — массив `имя => значение`, например `[['limit' => 10]]`. Метод ищет аргумент в источниках по порядку |

## Возвращаемое значение

Метод возвращает результат действия — массив, скаляр, объект ответа `HttpResponse` или `null`, если действие не выполнилось. Ошибки возвращает метод [getErrors](get-errors.md).

## Особенности

- Метод не выбрасывает исключений. Метод превращает исключение из действия в ошибку коллекции и пишет его в журнал. Ошибки подбора аргументов и неизвестного действия метод в журнал не пишет.
- Вне режима отладки ошибка содержит текст `Internal server error.`, а не текст исключения. Исключения `ArgumentException`, ошибки подбора аргументов и ошибки проверок сохраняют свой текст. В более ранних версиях, например 26.150.0, ошибка содержит текст любого исключения.
- Ключ `debug` секции `exception_handling` файла `.settings.php` включает режим отладки. В этом режиме метод добавляет в коллекцию и подробности исключения.
- Неизвестное действие вызывает ошибку с кодом `22002`.
- Аргумент неверного типа вызывает ошибку подбора, например `Invalid value {abc} to match with parameter {limit}`.

## Примеры

**Пример.** Код выполняет действие с параметром и с неверным значением:

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
        return array_slice(['kg', 'g', 't'], 0, $limit);
    }
}

$controller = new UnitController();
echo implode(',', $controller->run('list', [['limit' => 3]])) . "\n";

$controller = new UnitController();
$result = $controller->run('list', [['limit' => 'abc']]);
echo var_export($result, true) . ' ' . count($controller->getErrors());
```

Код выведет:

```text
kg,g,t
NULL 1
```

В примере код отключает фильтры, чтобы запустить действие из консоли. Из консоли фильтр `HttpMethod` не пропустит запрос без метода GET или POST.

## Смотрите также

- [Controller::forward](forward.md)
- [Controller::getErrors](get-errors.md)
- [Action](../action/index.md)
