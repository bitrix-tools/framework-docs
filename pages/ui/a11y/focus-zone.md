---
title: Зона фокуса FocusZone
description: 'Зона фокуса FocusZone. UI Bitrix Framework: инструменты интерфейса, подключение расширений и примеры использования.'
---

`FocusZone` управляет клавиатурной навигацией между фокусируемыми элементами внутри DOM-контейнера. Используйте его для меню, панели инструментов, списка или сетки, где стрелки, `Home`, `End` или другие клавиши должны перемещать фокус по элементам интерфейса.

`FocusZone` также подходит для комбобокса — поля ввода со списком вариантов. В этом сценарии DOM-фокус остается на поле, а выбранный пункт списка передается через `aria-activedescendant`.

В Bitrix Framework за зону фокуса отвечает расширение `ui.a11y`. В нем доступны класс `FocusZone` и константы `FocusKeys` для настройки клавиш навигации.

## Подключить расширение

Если вы подключаете JavaScript API из PHP, загрузите расширение `ui.a11y`.

```php
\Bitrix\Main\UI\Extension::load('ui.a11y');
```

Если вы работаете в модульном JavaScript, импортируйте `FocusZone` из `ui.a11y`.

```js
import { FocusZone } from 'ui.a11y';
```

Если нужно настроить клавиши навигации, импортируйте также `FocusKeys`.

```js
import { FocusZone, FocusKeys } from 'ui.a11y';
```

## Создать зону фокуса

Создайте экземпляр `FocusZone`, передав DOM-контейнер, и включите обработку клавиатуры методом `activate()`. Перед созданием экземпляра проверьте, что контейнер найден.

По умолчанию `FocusZone` управляет вертикальной навигацией:

-  `ArrowDown` перемещает фокус к следующему элементу.

-  `ArrowUp` перемещает фокус к предыдущему элементу.

-  `Home` перемещает фокус к первому элементу.

-  `End` перемещает фокус к последнему элементу.

```js
import { FocusZone } from 'ui.a11y';

const menu = document.querySelector('#navigation-menu');
if (!menu)
{
    throw new Error('Navigation menu was not found.');
}

const focusZone = new FocusZone(menu);
focusZone.activate();
```

## Управлять жизненным циклом

Методы жизненного цикла включают и выключают управление фокусом. В активном состоянии зона обрабатывает клавиши из `bindKeys` и выбирает текущий элемент. Затем `FocusZone` перемещает DOM-фокус или обновляет `aria-activedescendant` в режиме активного потомка.

#|
|| **Метод** | **Что делает** ||
|| `activate()` | Включает управление фокусом внутри контейнера и начинает обрабатывать клавиши навигации. ||
|| `deactivate()` | Выключает управление фокусом и восстанавливает исходные значения `tabindex` у элементов. ||
|| `isActive()` | Возвращает `true`, если зона активна. ||
|| `getCurrentFocusedElement()` | Возвращает текущий элемент зоны или `null`, если элемент не выбран. ||
|| `refreshElements()` | Обновляет набор элементов, которыми управляет зона. Метод можно вызвать после изменения состава контейнера. ||
|#

{% note info "" %}

Вызывайте `deactivate()`, когда зона больше не должна обрабатывать клавиатуру или контейнер удаляется из DOM.

{% endnote %}

Если состав контейнера изменился после активации, вызовите `refreshElements()`. Например, обновите набор элементов после перерисовки списка или изменения доступности кнопок. Если в зоне нет подходящих элементов или начальный элемент еще не выбран, `getCurrentFocusedElement()` возвращает `null`.

```js
focusZone.activate();

if (focusZone.isActive())
{
    const currentElement = focusZone.getCurrentFocusedElement();
}

focusZone.refreshElements();
focusZone.deactivate();
```

## Передать параметры

Конструктор `FocusZone` принимает необязательный объект `FocusZoneOptions`. Используйте параметры, чтобы выбрать клавиши навигации, поведение на краях списка и начальный элемент. Отдельные параметры задают модель активного потомка и правила отбора элементов.

```ts
type FocusZoneOptions = {
    bindKeys?: number;
    focusOutBehavior?: 'stop' | 'wrap';
    focusInStrategy?: 'first' | 'closest' | 'previous' | 'initial' | ((previousFocusedElement: Element) => HTMLElement | null);
    activeDescendantControl?: HTMLElement;
    onActiveDescendantChanged?: (
        newActiveDescendant: HTMLElement | null,
        previousActiveDescendant: HTMLElement | null,
        directlyActivated: boolean,
    ) => void;
    getNextFocusable?: (
        direction: FocusZoneDirection,
        from: Element | null,
        event: KeyboardEvent,
    ) => HTMLElement | null;
    focusableElementFilter?: (element: HTMLElement) => boolean;
    preventScroll?: boolean;
    ignoreHoverEvents?: boolean;
    tabbableOnly?: boolean;
};

type FocusZoneDirection = 'previous' | 'next' | 'start' | 'end';
```

#|
|| **Параметр** | **Тип** | **Описание** ||
|| [`bindKeys`](#настроить-клавиши) | `number` | Задает клавиши навигации через `FocusKeys`. По умолчанию используются <code>FocusKeys.ArrowVertical &#124; FocusKeys.HomeAndEnd</code>. ||
|| [`focusOutBehavior`](#выбрать-поведение-на-краях) | <code>'stop' &#124; 'wrap'</code> | Определяет поведение на первом и последнем элементе. По умолчанию — `'stop'`. ||
|| [`focusInStrategy`](#выбрать-начальный-элемент) | <code>string &#124; function</code> | Определяет начальный элемент при входе фокуса в контейнер. По умолчанию — `'previous'`. ||
|| [`activeDescendantControl`](#использовать-активный-потомок) | `HTMLElement` | Задает управляющий элемент, на котором остается DOM-фокус. Активный потомок передается через `aria-activedescendant`. ||
|| [`onActiveDescendantChanged`](#использовать-активный-потомок) | `function` | Вызывается при изменении активного потомка. Получает новый элемент, предыдущий элемент и `directlyActivated`: `true`, если активный потомок изменился после клавиши навигации. ||
|| [`getNextFocusable`](#настроить-свою-навигацию) | `function` | Возвращает следующий элемент для своей навигации. ||
|| [`focusableElementFilter`](#отфильтровать-элементы) | `function` | Исключает элементы из управления зоной. ||
|| `preventScroll` | `boolean` | Передается в `focus()` и управляет прокруткой при перемещении фокуса. По умолчанию — `false`. ||
|| [`ignoreHoverEvents`](#использовать-активный-потомок) | `boolean` | Отключает изменение активного потомка при наведении мыши. Используется только с `activeDescendantControl`. По умолчанию — `false`. ||
|| [`tabbableOnly`](#отфильтровать-элементы) | `boolean` | Ограничивает набор элементов теми, которые доступны через `Tab`. По умолчанию — `false`. ||
|#

## Настроить клавиши

Параметр `bindKeys` задает, какие клавиши управляют переходом по элементам. Используйте константы `FocusKeys` и объединяйте их через побитовое ИЛИ.

```js
import { FocusZone, FocusKeys } from 'ui.a11y';

const toolbar = document.querySelector('#editor-toolbar');
if (!toolbar)
{
    throw new Error('Editor toolbar was not found.');
}

const focusZone = new FocusZone(toolbar, {
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
    focusOutBehavior: 'wrap',
});

focusZone.activate();
```

Для горизонтальной панели инструментов используйте `FocusKeys.ArrowHorizontal`. Для вертикального меню оставьте поведение по умолчанию или передайте `FocusKeys.ArrowVertical | FocusKeys.HomeAndEnd`.

#|
|| **Константа** | **Клавиши** ||
|| `FocusKeys.ArrowHorizontal` | `ArrowLeft`, `ArrowRight`. ||
|| `FocusKeys.ArrowVertical` | `ArrowUp`, `ArrowDown`. ||
|| `FocusKeys.JK` | `J`, `K`. ||
|| `FocusKeys.HL` | `H`, `L`. ||
|| `FocusKeys.HomeAndEnd` | `Home`, `End`. ||
|| `FocusKeys.WS` | `W`, `S`. ||
|| `FocusKeys.AD` | `A`, `D`. ||
|| `FocusKeys.Tab` | `Tab`, `Shift+Tab`. ||
|| `FocusKeys.PageUpDown` | `PageUp`, `PageDown`. ||
|| `FocusKeys.Backspace` | `Backspace`. ||
|| `FocusKeys.ArrowAll` | Горизонтальные и вертикальные стрелки. ||
|| `FocusKeys.HJKL` | `H`, `J`, `K`, `L`. ||
|| `FocusKeys.WASD` | `W`, `A`, `S`, `D`. ||
|| `FocusKeys.All` | Все поддерживаемые клавиши. ||
|#

## Выбрать поведение на краях

Параметр `focusOutBehavior` определяет, что делать на первом и последнем элементе зоны.

#|
|| **Значение** | **Поведение** ||
|| `'stop'` | Фокус остается на текущем элементе. Поведение по умолчанию. ||
|| `'wrap'` | Фокус переходит с последнего элемента на первый и с первого на последний. ||
|#

{% note info "" %}

`Tab` сохраняет возможность выйти из контейнера. Даже при `focusOutBehavior: 'wrap'` циклический переход применяется к остальным клавишам навигации.

{% endnote %}

## Выбрать начальный элемент

Параметр `focusInStrategy` определяет, какой элемент становится текущим, когда фокус входит в контейнер.

#|
|| **Значение** | **Поведение** ||
|| `'previous'` | Выбирает элемент, который был активен раньше. Если такого элемента нет, выбирает первый элемент зоны. Поведение по умолчанию. ||
|| `'first'` | Выбирает первый элемент зоны. ||
|| `'closest'` | Выбирает первый или последний элемент в зависимости от направления входа в контейнер. ||
|| `'initial'` | Не выбирает потомка до навигации пользователя. Используйте только с `activeDescendantControl`. ||
|| Функция | Возвращает элемент, который должен стать текущим. Элемент должен входить в набор элементов зоны. ||
|#

```js
import { FocusZone } from 'ui.a11y';

const list = document.querySelector('#recent-items');
if (!list)
{
    throw new Error('Recent items list was not found.');
}

const focusZone = new FocusZone(list, {
    focusInStrategy: 'first',
});

focusZone.activate();
```

## Использовать активный потомок

Передайте параметр `activeDescendantControl`, если DOM-фокус должен оставаться на управляющем элементе, а активный пункт должен передаваться через `aria-activedescendant`. В такой модели активный потомок показывает выбранный пункт списка, но браузерный фокус остается на поле ввода.

Для корректной ARIA-разметки оформите управляющий элемент и список по паттерну нужного виджета, например комбобокса или списка вариантов. Элементы, которые могут стать активными потомками, должны иметь уникальные `id`, потому что значение `aria-activedescendant` ссылается на `id` выбранного элемента.

```js
import { FocusZone, FocusKeys } from 'ui.a11y';

const input = document.querySelector('#city-input');
const listbox = document.querySelector('#city-listbox');
if (!input || !listbox)
{
    throw new Error('City input or listbox was not found.');
}

const focusZone = new FocusZone(listbox, {
    activeDescendantControl: input,
    bindKeys: FocusKeys.ArrowVertical | FocusKeys.HomeAndEnd,
    focusInStrategy: 'first',
    onActiveDescendantChanged(newElement) {
        if (newElement)
        {
            input.value = (newElement.textContent ?? '').trim();
        }
    },
});

focusZone.activate();
```

В этом режиме `FocusZone` обновляет `aria-activedescendant` у управляющего элемента. DOM-фокус остается на `activeDescendantControl`, поэтому пользователь продолжает вводить текст в поле.

Если нужно запретить выбор элемента при наведении мыши, передайте `ignoreHoverEvents: true`. Параметр действует только в режиме `activeDescendantControl`.

## Настроить свою навигацию

Параметр `getNextFocusable` задает функцию, которая выбирает следующий элемент. Используйте его для сеток и сложных виджетов, где линейного перехода недостаточно.

Функция получает направление, текущий элемент и событие клавиатуры. Если функция возвращает `null`, `FocusZone` использует стандартную линейную навигацию. Отдельное значение для остановки перехода не предусмотрено.

```js
import { FocusZone, FocusKeys } from 'ui.a11y';

const grid = document.querySelector('#calendar-grid');
if (!grid)
{
    throw new Error('Calendar grid was not found.');
}

const focusZone = new FocusZone(grid, {
    bindKeys: FocusKeys.ArrowAll | FocusKeys.HomeAndEnd,
    getNextFocusable(direction, from, event) {
        const currentCell = from?.closest('[data-row][data-column]');
        if (!currentCell)
        {
            return null;
        }

        let row = Number(currentCell.dataset.row);
        let column = Number(currentCell.dataset.column);

        switch (event.key)
        {
            case 'ArrowRight':
                column += 1;
                break;
            case 'ArrowLeft':
                column -= 1;
                break;
            case 'ArrowDown':
                row += 1;
                break;
            case 'ArrowUp':
                row -= 1;
                break;
            default:
                return null;
        }

        return grid.querySelector(`[data-row="${row}"][data-column="${column}"]`);
    },
});

focusZone.activate();
```

Значение `direction` принимает один из вариантов: `'previous'`, `'next'`, `'start'`, `'end'`. Используйте его, если навигация зависит не от конкретной клавиши, а от направления перехода.

## Отфильтровать элементы

Параметр `focusableElementFilter` исключает часть фокусируемых элементов из управления зоной. Верните `false`, чтобы элемент не участвовал в навигации.

```js
import { FocusZone } from 'ui.a11y';

const actions = document.querySelector('#actions-list');
if (!actions)
{
    throw new Error('Actions list was not found.');
}

const focusZone = new FocusZone(actions, {
    focusableElementFilter: (element) => element.dataset.disabledAction !== 'true',
});

focusZone.activate();
```

Передайте `tabbableOnly: true`, если зона должна управлять только элементами с `tabindex` больше или равным `0`. По умолчанию `FocusZone` учитывает все фокусируемые элементы, включая элементы с `tabindex="-1"`.

Элемент с `tabindex="-1"` можно сфокусировать программно, но обычный переход по клавише `Tab` пропускает такой элемент.

## Проверить ограничения

Перед включением зоны проверьте DOM-контейнер и элементы, которыми будет управлять `FocusZone`.

-  Контейнер должен существовать в DOM до создания экземпляра `FocusZone`.

-  В контейнере должны быть элементы, которые могут получить фокус или пройти фильтр `focusableElementFilter`.

-  Если элементы добавляются, удаляются или меняют доступность после активации, вызовите `refreshElements()`.

-  Если используется `activeDescendantControl`, активные элементы должны иметь `id`, а управляющий элемент должен оставаться доступным для ввода или фокуса.

-  Если часть элементов не должна участвовать в навигации, исключите ее через `focusableElementFilter` или используйте `tabbableOnly`.

## Включить логирование

`FocusZone` поддерживает отладочный вывод в консоль через статические методы. Включайте логирование на время проверки клавиатурной навигации и отключайте после отладки.

```js
import { FocusZone } from 'ui.a11y';

// Включить вывод событий зоны фокуса в консоль.
FocusZone.enableDebug();

// Отключить вывод событий зоны фокуса в консоль.
FocusZone.disableDebug();
```

## Связанные материалы

-  [Навигация фокуса FocusNavigator](./focus-navigator.md) — поиск и программное перемещение фокуса внутри DOM-контейнера.

-  [Проверка интерактивности InteractivityChecker](./interactivity-checker.md) — проверка DOM-элементов перед управлением фокусом.

-  [Монитор фокуса FocusMonitor](./focus-monitor.md) — отслеживание фокуса и восстановление потерянного фокуса в интерфейсе.

-  [Ловушка фокуса FocusTrap](./focus-trap.md) — удержание фокуса внутри модального окна, диалога или выпадающего меню.

-  [Объявления для скринридера LiveAnnouncer](./live-announcer.md) — передача сообщений через скринридер без перемещения фокуса.

-  [Расширения](../../framework/extensions.md) — подключение JavaScript-расширений Bitrix Framework.
