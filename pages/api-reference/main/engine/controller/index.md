---
title: Controller — базовый класс контроллера
description: Класс Bitrix\Main\Engine\Controller — родитель AJAX- и REST-контроллеров. Наследник объявляет действия методами с суффиксом Action и настраивает фильтры в configureActions.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Engine`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 20.5.400

{% endnote %}

## Когда использовать

Класс `Controller` — родитель контроллеров, которые обрабатывают AJAX-запросы `BX.ajax.runAction`, REST-вызовы и консольные команды. Свой контроллер создают наследником. Действие — публичный метод с суффиксом `Action`, например `listAction`. Ядро подбирает аргументы метода из параметров запроса по именам и возвращает результат клиенту в JSON.

```php
namespace Vendor\Units\Controller;

use Bitrix\Main\Engine\Controller;

class Unit extends Controller
{
    public function configureActions()
    {
        return [
            'list' => [
                '-prefilters' => [\Bitrix\Main\Engine\ActionFilter\Authentication::class],
            ],
        ];
    }

    public function listAction(int $limit = 20): array
    {
        return ['items' => []];
    }
}
```

Метод [run](run.md) выполняет действие по шагам.

1. Находит действие по имени и создает объект [Action](../action/index.md).
2. Подключает префильтры и постфильтры. По умолчанию это проверка авторизации, проверка метода HTTP (GET или POST) и проверка CSRF-токена.
3. Отправляет событие `onBeforeAction` и выполняет действие.
4. Отправляет событие `onAfterAction` и возвращает результат.

Метод не выбрасывает исключения, а собирает их вместе с ошибками в коллекцию. Коллекцию возвращает метод [getErrors](get-errors.md).

Подробнее — в статье [Контроллеры](../../../../framework/controllers.md).

## Методы класса

### Действия и выполнение

| Метод | Описание | С версии |
| --- | --- | --- |
| [__construct](construct.md) | Создает контроллер | |
| [configureActions](configure-actions.md) | Задает фильтры и классы действий | |
| [getConfigurationOfActions](get-configuration-of-actions.md) | Возвращает настройки действий | |
| [listNameActions](list-name-actions.md) | Возвращает имена всех действий | |
| [run](run.md) | Выполняет действие | |
| [forward](forward.md) | Выполняет действие другого контроллера | |
| [getCurrentAction](get-current-action.md) | Возвращает выполняемое действие | |
| [generateActionMethodName](generate-action-method-name.md) | Возвращает имя метода действия | |
| [getFullEventName](get-full-event-name.md) | Возвращает полное имя события контроллера | |
| [finalizeResponse](finalize-response.md) | Меняет ответ перед отправкой клиенту | |
| [redirectTo](redirect-to.md) | Возвращает ответ с переадресацией | |
| [convertKeysToCamelCase](convert-keys-to-camel-case.md) | Переводит ключи массива в camelCase | |

### Запрос и окружение

| Метод | Описание | С версии |
| --- | --- | --- |
| [getRequest](get-request.md) | Возвращает запрос | |
| [getSourceParametersList](get-source-parameters-list.md) | Возвращает источники параметров действия | |
| [setSourceParametersList](set-source-parameters-list.md) | Задает источники параметров действия | |
| [getUnsignedParameters](get-unsigned-parameters.md) | Возвращает расшифрованные параметры компонента | |
| [getCurrentUser](get-current-user.md) | Возвращает текущего пользователя | |
| [setCurrentUser](set-current-user.md) | Задает текущего пользователя | |
| [getScope](get-scope.md) | Возвращает область вызова | |
| [setScope](set-scope.md) | Задает область вызова | |
| [getModuleId](get-module-id.md) | Возвращает модуль контроллера | |
| [isLocatedUnderPsr4](is-located-under-psr4.md) | Проверяет, лежит ли файл класса по правилам PSR-4 | |
| [getActionUri](get-action-uri.md) | Возвращает адрес действия для AJAX | |
| [className](class-name.md) | Возвращает полное имя класса | |

### Автоподстановка параметров

| Метод | Описание | С версии |
| --- | --- | --- |
| [getAutoWiredParameters](get-auto-wired-parameters.md) | Возвращает правила автоподстановки объектов в аргументы действий | |
| [getPrimaryAutoWiredParameter](get-primary-auto-wired-parameter.md) | Возвращает основное правило автоподстановки | |
| [getDefaultAutoWiredParameters](get-default-auto-wired-parameters.md) | Возвращает правила автоподстановки по умолчанию | |

### Ошибки

| Метод | Описание | С версии |
| --- | --- | --- |
| [getErrors](get-errors.md) | Возвращает ошибки | |
| [hasErrors](has-errors.md) | Проверяет, есть ли ошибки | |
| [getErrorByCode](get-error-by-code.md) | Возвращает ошибку по коду | |

## Защищенные методы для наследника

Наследник переопределяет защищенные методы, чтобы изменить поведение, или вызывает их в действиях.

| Метод | Назначение |
| --- | --- |
| `init` | Конструктор вызывает его в конце. Метод читает настройки действий. Наследник переопределяет его, чтобы подготовить контроллер, и вызывает `parent::init()` |
| `getDefaultPreFilters`, `getDefaultPostFilters` | Возвращают фильтры по умолчанию для всех действий. Переопределяют, чтобы сменить фильтры |
| `processBeforeAction` | Метод `run` вызывает его перед действием. Значение `false` отменяет действие |
| `processAfterAction` | Метод `run` вызывает его после действия. Значение, отличное от `null`, заменяет результат |
| `addError`, `addErrors` | Добавляют ошибки в коллекцию. Вызывают в действиях |
| `renderComponent`, `renderComponentAjax`, `renderView`, `renderExtension` | Возвращают ответ с HTML компонента, представления или расширения. Вызывают в действиях |

## Константы

| Константа | Значение | Описание |
| --- | --- | --- |
| `SCOPE_AJAX`, `SCOPE_REST`, `SCOPE_CLI` | `'ajax'`, `'rest'`, `'cli'` | Области вызова для [setScope](set-scope.md) |
| `EVENT_ON_BEFORE_ACTION`, `EVENT_ON_AFTER_ACTION` | `'onBeforeAction'`, `'onAfterAction'` | Короткие имена событий для [getFullEventName](get-full-event-name.md) |
| `ERROR_REQUIRED_PARAMETER` | `'MAIN_CONTROLLER_22001'` | Код ошибки из исключения `ArgumentNullException` |
| `ERROR_UNKNOWN_ACTION` | `'MAIN_CONTROLLER_22002'` | Контроллер не использует константу. Ошибка неизвестного действия получает код `22002` |
| `EXCEPTION_UNKNOWN_ACTION` | `22002` | Код исключения и ошибки неизвестного действия |
| `INTERNAL_ERROR_MESSAGE` | `'Internal server error.'` | Текст ошибки вместо текста исключения вне режима отладки. В более ранних версиях, например 26.150.0, константы нет, и ошибка содержит текст исключения |

## Смотрите также

- [Контроллеры](../../../../framework/controllers.md)
- [Action](../action/index.md)
- [CurrentUser](../current-user/index.md)
- [Controllerable](../contract/controllerable/index.md)
