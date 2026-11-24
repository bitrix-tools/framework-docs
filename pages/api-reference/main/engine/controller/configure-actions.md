---
title: Настроить действия Controller::configureActions
description: Метод Controller::configureActions возвращает настройки действий контроллера — префильтры, постфильтры и классы действий. Наследник переопределяет его.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::configureActions` возвращает настройки действий. Наследник переопределяет метод, чтобы сменить фильтры действия или объявить действие отдельным классом. Конструктор читает настройки один раз.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
public function configureActions()
```

## Возвращаемое значение

Метод возвращает массив `имя действия => настройки`. Базовый класс возвращает пустой массив.

Настройки действия принимают ключи из таблицы.

| Ключ | Описание |
| --- | --- |
| `prefilters` | Префильтры действия. Заменяют фильтры по умолчанию. Пустой массив отключает все префильтры |
| `+prefilters` | Префильтры, которые контроллер добавит к префильтрам действия. Без ключа `prefilters` — к фильтрам по умолчанию |
| `-prefilters` | Классы префильтров, которые нужно убрать из префильтров действия. Без ключа `prefilters` — из фильтров по умолчанию |
| `postfilters`, `+postfilters`, `-postfilters` | То же для постфильтров |
| `filters` | Один список фильтров, который заменяет и префильтры, и постфильтры по умолчанию. Нельзя указывать вместе с `prefilters` или `postfilters` |
| `+filters` | Фильтры, которые контроллер добавит и к префильтрам, и к постфильтрам действия |
| `-filters` | Классы фильтров, которые нужно убрать из префильтров и постфильтров действия |
| `class` | Класс действия — наследник [Action](../action/index.md), если действие описывает отдельный класс |
| `callable` | Функция, которая выполняет действие |
| `configure` | Настройки, которые получит метод `configure` класса действия |

## Особенности

- По умолчанию действие получает три префильтра — `Authentication`, `HttpMethod` и `Csrf`. Они проверяют авторизацию, метод запроса GET или POST и CSRF-токен.
- Если префильтры разрешают POST, а проверки CSRF среди них нет, контроллер сам добавит ее для POST-запроса.
- Действие-метод `xxxAction` не нужно объявлять в настройках. Настройки нужны, только чтобы сменить его фильтры.
- Если в настройках действия есть ключ `filters` вместе с `prefilters` или `postfilters`, конструктор выбросит исключение `ActionConfigurationException` с текстом `filters cannot be combined with prefilters or postfilters`.
- Сначала контроллер убирает фильтры из `-filters`, затем из `-prefilters` и `-postfilters`. После этого добавляет фильтры из `+prefilters` и `+postfilters`, последними — из `+filters`.

## Примеры

**Пример.** Код открывает действие для гостей и проверяет, что оно выполнилось:

```php
<?php
use Bitrix\Main\Engine\ActionFilter;
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitController extends Controller
{
    public function configureActions()
    {
        return [
            'list' => [
                'prefilters' => [],
            ],
            'save' => [
                '-prefilters' => [ActionFilter\Authentication::class],
            ],
        ];
    }

    public function listAction(): array
    {
        return ['kg', 'g'];
    }
}

$controller = new UnitController();
$result = $controller->run('list', [[]]);

echo implode(',', $result) . ' ' . implode(',', array_keys($controller->getConfigurationOfActions()));
```

Код выведет `kg,g list,save`. В примере код отключает фильтры действия `list`, чтобы запустить его из консоли.

## Смотрите также

- [Controller::getConfigurationOfActions](get-configuration-of-actions.md)
- [ActionFilter\Base](../action-filter/base/index.md)
- [Пре- и постфильтры](../../../../framework/pre-post-filters.md)
