---
title: Монитор фокуса FocusMonitor
description: 'Монитор фокуса FocusMonitor. ui.a11y: отслеживание фокуса, история фокуса и восстановление потерянного фокуса.'
---

Класс `FocusMonitor` отслеживает фокус на странице и запоминает последние элементы, которые получали фокус. Используйте его, когда компонент удаляет активный элемент из DOM и нужно вернуть фокус на подходящий элемент интерфейса.

Расширение `ui.a11y` использует общий экземпляр `FocusMonitor`. При загрузке расширения монитор инициализируется автоматически, поэтому в обычном сценарии не нужно создавать экземпляр через `new FocusMonitor()`.

Автоматическое восстановление потерянного фокуса зависит от настройки расширения `restoreLostFocus`. Если настройка включена, монитор переносит фокус после потери активного элемента только для клавиатурного сценария. При работе мышью, стилусом или касанием автоматическое восстановление не выполняется.

## Подключить расширение

Если вы подключаете JavaScript API из PHP, загрузите расширение `ui.a11y`.

```php
\Bitrix\Main\UI\Extension::load('ui.a11y');
```

Если вы работаете в модульном JavaScript, импортируйте `FocusMonitor` из `ui.a11y`.

```js
import { FocusMonitor } from 'ui.a11y';
```

## Методы

#|
|| **Метод** | **Что делает** ||
|| [`FocusMonitor.initialize()`](#использовать-автоматическую-инициализацию) | Инициализирует общий экземпляр монитора и возвращает его. Обычно вызывается автоматически при загрузке `ui.a11y` ||
|| [`FocusMonitor.Instance`](#использовать-автоматическую-инициализацию) | Возвращает общий экземпляр монитора ||
|| [`FocusMonitor.shouldRestoreLostFocus()`](#проверить-автоматическое-восстановление) | Возвращает `true`, если в настройках расширения включено автоматическое восстановление потерянного фокуса ||
|| [`restoreFocus()`](#восстановить-фокус-вручную) | Переносит фокус на последний подходящий элемент из истории или на корневой элемент документа ||
|| [`getRoot(doc?)`](#задать-корневой-элемент-восстановления) | Возвращает корневой элемент восстановления для документа ||
|| [`getLastInputModality()`](#определить-способ-ввода) | Возвращает последний способ ввода: `'keyboard'`, `'pointer'` или `'unknown'` ||
|| [`getModalityTracker()`](#определить-способ-ввода) | Возвращает трекер способа ввода с методами для проверки последней клавиши, направления `Shift+Tab` и типа указателя ||
|| [`attachIframe(iframe)`](#подключить-iframe) | Подключает документ same-origin `iframe` к отслеживанию фокуса ||
|| [`detachIframe(iframe)`](#подключить-iframe) | Отключает документ `iframe` от отслеживания фокуса ||
|| [`FocusMonitor.enableDebug()`](#включить-логирование) | Включает отладочный вывод событий монитора фокуса в консоль ||
|| [`FocusMonitor.disableDebug()`](#включить-логирование) | Отключает отладочный вывод событий монитора фокуса ||
|#

## Контракты методов

#|
|| **Метод** | **Параметры** | **Результат** | **Ограничения** ||
|| `FocusMonitor.initialize()` | Нет | Возвращает общий экземпляр `FocusMonitor` | В `iframe` использует экземпляр верхнего окна, если он доступен ||
|| `FocusMonitor.Instance` | Нет | Возвращает общий экземпляр `FocusMonitor` | При первом обращении вызывает `initialize()` ||
|| `FocusMonitor.shouldRestoreLostFocus()` | Нет | Возвращает `true`, если настройка `restoreLostFocus` равна `true` | Проверяет настройки расширения `ui.a11y` ||
|| `restoreFocus()` | Нет | Ничего не возвращает. Переносит фокус на элемент из истории или на корневой элемент документа | Не переносит фокус, если элемент из истории уже не подключен к DOM или не может получить фокус ||
|| `getRoot(doc?)` | `doc` — объект `Document`. Необязательный параметр, по умолчанию используется текущий `document` | Возвращает `HTMLElement`: элемент с `data-focus-root`, первый `main` или `body` | Если передан документ без доступного `body`, результат зависит от состояния этого документа ||
|| `getLastInputModality()` | Нет | Возвращает `'keyboard'`, `'pointer'` или `'unknown'` | Обычный ввод текста не считается клавиатурной навигацией ||
|| `getModalityTracker()` | Нет | Возвращает экземпляр `InputModalityTracker`, который использует монитор | Используйте его вместо отдельного трекера, если компонент работает на странице с `ui.a11y` ||
|| `attachIframe(iframe)` | `iframe` — объект `HTMLIFrameElement` | Ничего не возвращает. Подключает документ `iframe` к отслеживанию | Работает только с доступным same-origin документом. Если передан не `HTMLIFrameElement`, документ недоступен или `iframe` cross-origin, метод завершится без действия ||
|| `detachIframe(iframe)` | `iframe` — объект `HTMLIFrameElement` | Ничего не возвращает. Отключает документ `iframe` от отслеживания | Если документ недоступен, cross-origin или не был подключен, метод завершится без действия ||
|| `FocusMonitor.enableDebug()` | Нет | Ничего не возвращает | Включает вывод только для канала `focus-monitor` ||
|| `FocusMonitor.disableDebug()` | Нет | Ничего не возвращает | Отключает вывод только для канала `focus-monitor` ||
|#

## Использовать автоматическую инициализацию

Расширение `ui.a11y` вызывает `FocusMonitor.initialize()` при загрузке. Метод создает общий экземпляр монитора и возвращает его. Для доступа к этому экземпляру используйте `FocusMonitor.Instance`.

```js
import { FocusMonitor } from 'ui.a11y';

const monitor = FocusMonitor.Instance;
```

В `iframe` монитор использует экземпляр верхнего окна, если он доступен. Так история фокуса остается общей для страницы и доступных `iframe`.

## Проверить автоматическое восстановление

Метод `FocusMonitor.shouldRestoreLostFocus()` возвращает `true`, если в настройках расширения включено автоматическое восстановление потерянного фокуса.

Автоматическое восстановление срабатывает только для клавиатурного сценария. При работе мышью, стилусом или касанием монитор не восстанавливает фокус автоматически.

Настройка `restoreLostFocus` передается в `settings` расширения `ui.a11y`. Чтобы включить автоматическое восстановление, добавьте значение в секцию `ui` конфигурации ядра в `/bitrix/.settings_extra.php`.

```php
return [
    'ui' => [
        'value' => [
            'a11y' => [
                'restoreLostFocus' => true,
            ],
        ],
    ],
];
```

Значение `restoreLostFocus` по умолчанию зависит от конфигурации расширения. Для предсказуемого поведения проекта задайте настройку в конфигурации явно.

## Восстановить фокус вручную

Метод `restoreFocus()` переносит фокус на последний подходящий элемент из истории и ничего не возвращает. Если такого элемента нет, монитор переносит фокус на корневой элемент страницы.

```js
import { FocusMonitor } from 'ui.a11y';

const closeButton = document.querySelector('#close-panel-button');
if (!closeButton)
{
    throw new Error('Close button was not found.');
}

closeButton.addEventListener('click', () => {
    const panel = document.querySelector('#details-panel');
    if (panel)
    {
        panel.remove();
    }

    FocusMonitor.Instance.restoreFocus();
});
```

Используйте ручное восстановление, когда компонент закрывает панель, удаляет строку или перерисовывает список, из-за чего активный элемент может исчезнуть.

Метод не переносит фокус на элемент из истории, если этот элемент уже удален из DOM или не может получить фокус.

## Задать корневой элемент восстановления

Если в истории нет подходящего элемента, `FocusMonitor` ищет корневую точку восстановления в таком порядке:

1. Элемент с атрибутом `data-focus-root`.

2. Элемент `main`.

3. `body` текущего документа.

Добавьте `data-focus-root` к основному контейнеру приложения, если фокус после восстановления не должен попадать на `body`.

```html
<main data-focus-root id="workarea">
    ...
</main>
```

Метод `getRoot(doc?)` возвращает элемент, который монитор использует как корень восстановления для документа из параметра `doc`.

```js
import { FocusMonitor } from 'ui.a11y';

const root = FocusMonitor.Instance.getRoot();
root.classList.add('focus-root-ready');
```

## Определить способ ввода

Метод `getLastInputModality()` возвращает последний способ ввода, который зафиксировал монитор.

#|
|| **Значение** | **Когда возвращается** ||
|| `'keyboard'` | Пользователь нажал навигационную клавишу: `Tab`, `Escape`, стрелки, `Home` или `End` ||
|| `'pointer'` | Пользователь нажал кнопку мыши, коснулся экрана или использовал другой указатель ||
|| `'unknown'` | Монитор еще не зафиксировал клавиатурное или указательное действие ||
|#

```js
import { FocusMonitor } from 'ui.a11y';

const modality = FocusMonitor.Instance.getLastInputModality();

if (modality === 'keyboard')
{
    FocusMonitor.Instance.restoreFocus();
}
```

Если код компонента должен учитывать детали последнего действия, получите трекер через `getModalityTracker()`.

```js
import { FocusMonitor } from 'ui.a11y';

const tracker = FocusMonitor.Instance.getModalityTracker();

if (tracker.getLastModality() === 'keyboard')
{
    const key = tracker.getLastNavigationKey();
    const reversed = tracker.isLastNavigationReversed();
}
```

Метод трекера `getLastPointerType()` возвращает тип указателя, который пользователь применил последним.

- `'mouse'` — мышь.
- `'pen'` — стилус.
- `'touch'` — касание экрана.
- `null` — последнее действие не было указательным.

```js
import { FocusMonitor } from 'ui.a11y';

const tracker = FocusMonitor.Instance.getModalityTracker();
const pointerType = tracker.getLastPointerType();

if (pointerType === 'touch')
{
    document.body.classList.add('touch-input');
}
```

## Подключить iframe

Монитор `FocusMonitor` автоматически подключает `iframe`, когда сам `iframe` получает фокус и его документ доступен.

Метод `attachIframe()` подключает `iframe` к отслеживанию фокуса. Используйте его для динамически созданного `iframe`, когда отслеживание нужно начать до получения фокуса.

Метод `attachIframe()` работает только с `iframe`, к документу которого есть доступ из текущей страницы. Если передан не `HTMLIFrameElement`, документ недоступен или `iframe` cross-origin, метод завершится без действия.

```js
import { FocusMonitor } from 'ui.a11y';

const frame = document.querySelector('#editor-frame');
if (!(frame instanceof HTMLIFrameElement))
{
    throw new Error('Editor iframe was not found.');
}

FocusMonitor.Instance.attachIframe(frame);
```

Метод `detachIframe()` отключает `iframe` от отслеживания фокуса. Вызывайте его перед удалением `iframe` или когда монитор больше не должен учитывать этот `iframe`.

```js
FocusMonitor.Instance.detachIframe(frame);
```

## Включить логирование

Класс `FocusMonitor` поддерживает отладочный вывод в консоль через статические методы. Включайте логирование только на время проверки сценария с потерей или восстановлением фокуса.

```js
import { FocusMonitor } from 'ui.a11y';

FocusMonitor.enableDebug();
FocusMonitor.disableDebug();
```

Для отладки способа ввода используйте методы `InputModalityTracker`.

```js
import { InputModalityTracker } from 'ui.a11y';

InputModalityTracker.enableDebug();
InputModalityTracker.disableDebug();
```

## Связанные материалы

- [Навигация фокуса FocusNavigator](./focus-navigator.md) — поиск и программное перемещение фокуса внутри DOM-контейнера.
- [Зона фокуса FocusZone](./focus-zone.md) — клавиатурная навигация между элементами внутри DOM-контейнера.
- [Ловушка фокуса FocusTrap](./focus-trap.md) — удержание фокуса внутри модального окна, диалога или выпадающего меню.
- [Объявления для скринридера LiveAnnouncer](./live-announcer.md) — передача сообщений через скринридер без перемещения фокуса.
- [Расширения](../../framework/extensions.md) — подключение JavaScript-расширений Bitrix Framework.
