---
title: Навигация фокуса FocusNavigator
description: "FocusNavigator. ui.a11y: поиск и перемещение фокуса внутри DOM-контейнера."
---

`FocusNavigator` ищет элементы, которые могут получить фокус, и программно перемещает фокус внутри DOM-контейнера. Используйте его, когда нужно управлять фокусом в панели, форме, меню или виджете без включения ловушки фокуса.

В Bitrix Framework за навигацию фокуса отвечает расширение `ui.a11y`. В нем доступны класс `FocusNavigator` и событие `RESTORE_FOCUS_EVENT` для возврата фокуса.

## Подключить расширение

Если вы подключаете расширение из PHP, загрузите `ui.a11y`.

```php
\Bitrix\Main\UI\Extension::load('ui.a11y');
```

Если вы работаете в модульном JavaScript, импортируйте `FocusNavigator` из `ui.a11y`.

```js
import { FocusNavigator } from 'ui.a11y';
```

Если нужно обработать событие возврата фокуса, импортируйте также `RESTORE_FOCUS_EVENT`.

```js
import { FocusNavigator, RESTORE_FOCUS_EVENT } from 'ui.a11y';
```

## Найти элемент без перемещения фокуса

Методы поиска возвращают подходящий `HTMLElement` или `null`, если элемент не найден. Они не вызывают `focus()` и не меняют активный элемент страницы.

#|
|| **Метод** | **Что возвращает** ||
|| `getFirst(container, options?)` | Первый элемент внутри контейнера, доступный для фокуса. ||
|| `getLast(container, options?)` | Последний элемент внутри контейнера, доступный для фокуса. ||
|| `getNext(container, options?)` | Следующий элемент относительно текущего активного элемента или `options.from`. ||
|| `getPrevious(container, options?)` | Предыдущий элемент относительно текущего активного элемента или `options.from`. ||
|#


Методы поиска не меняют `tabindex` контейнера и не вызывают событие возврата фокуса. Если подходящего элемента нет или фильтр `accept` отклонил все элементы, метод возвращает `null`.

```js
import { FocusNavigator } from 'ui.a11y';

const container = document.querySelector('#settings-panel');
if (!container)
{
    throw new Error('Settings panel was not found.');
}

const firstField = FocusNavigator.getFirst(container);
if (firstField)
{
    firstField.classList.add('panel-field--first');
}
```

## Переместить фокус

Методы перемещения находят элемент и вызывают для него `focus()`. Если подходящий элемент не найден, метод возвращает `null` и текущий фокус не меняется.

#|
|| **Метод** | **Что делает** | **Возвращает** ||
|| `focusFirst(container, options?)` | Перемещает фокус на первый подходящий элемент внутри контейнера. | <code>HTMLElement &#124; null</code> ||
|| `focusLast(container, options?)` | Перемещает фокус на последний подходящий элемент внутри контейнера. | <code>HTMLElement &#124; null</code> ||
|| `focusNext(container, options?)` | Перемещает фокус на следующий подходящий элемент. | <code>HTMLElement &#124; null</code> ||
|| `focusPrevious(container, options?)` | Перемещает фокус на предыдущий подходящий элемент. | <code>HTMLElement &#124; null</code> ||
|| `focusContainer(container, options?)` | Перемещает фокус на контейнер. Если у контейнера нет `tabindex`, добавляет `tabindex="-1"`. | `HTMLElement` ||
|| `focusBySelector(container, selector, options?)` | Перемещает фокус на первый элемент, который совпадает с CSS-селектором и проходит параметры обхода. | <code>HTMLElement &#124; null</code> ||
|| `focusTarget(target, options?)` | Перемещает фокус на переданный элемент. Если передан `null`, возвращает `null`. | <code>HTMLElement &#124; null</code> ||
|#


Проверяйте результат методов перемещения перед действиями с найденным элементом. Если метод вернул `null`, оставьте текущий фокус без изменений или выберите запасную точку фокуса, например контейнер.

Передавайте в `focusBySelector()` валидный CSS-селектор. Если селектор не совпал ни с одним подходящим элементом, метод возвращает `null`.

```js
import { FocusNavigator } from 'ui.a11y';

const container = document.querySelector('#filter-panel');
if (!container)
{
    throw new Error('Filter panel was not found.');
}

const focusedElement = FocusNavigator.focusBySelector(container, '[name="search"]');
if (!focusedElement)
{
    FocusNavigator.focusContainer(container);
}
```

## Передать параметры обхода

Параметры обхода задают начальную точку, направление и дополнительные правила выбора элементов.

Методы поиска и перемещения фокуса принимают необязательный объект `FocusNavigatorOptions`.

```ts
type FocusNavigatorOptions = {
    from?: HTMLElement;
    tabbableOnly?: boolean;
    wrap?: boolean;
    accept?: (el: HTMLElement) => boolean;
    preventScroll?: boolean;
    focusVisible?: boolean;
};
```

#|
|| **Параметр** | **Тип** | **По умолчанию** | **Описание** ||
|| `from` | `HTMLElement` | Текущий активный элемент внутри контейнера. | Задает элемент, от которого начинается поиск следующего или предыдущего элемента. ||
|| `tabbableOnly` | `boolean` | `true` для методов поиска и перехода. Для `focusBySelector()` и `createWalker()` задайте значение явно. | Учитывает только элементы, доступные для перехода по `Tab`. Передайте `false`, чтобы учитывать элементы с `tabindex="-1"`, которые могут получить фокус программно. ||
|| `wrap` | `boolean` | `false` | Разрешает циклический переход: после последнего элемента поиск продолжается с первого, а перед первым — с последнего. ||
|| `accept` | `(el: HTMLElement) => boolean` | Все найденные элементы проходят фильтр. | Фильтрует найденные элементы. Верните `true`, чтобы элемент участвовал в навигации. ||
|| `preventScroll` | `boolean` | Поведение `focus()` без дополнительного запрета прокрутки. | Передается в `focus()` и управляет прокруткой при перемещении фокуса. ||
|| `focusVisible` | `boolean` | Поведение `focus()` без дополнительного управления видимостью фокуса. | Передается в `focus()` для управления видимостью фокусного состояния. ||
|#


Если `from` не передан и текущий активный элемент находится вне контейнера, поиск следующего элемента начинается с начала контейнера. Для `getPrevious()` и `focusPrevious()` в такой ситуации подходящий предыдущий элемент не определяется, если не включен `wrap`.

Если `from` передан, используйте элемент из того же контейнера. Так следующий или предыдущий элемент будет выбран относительно ожидаемой точки.

```js
import { FocusNavigator } from 'ui.a11y';

const container = document.querySelector('#toolbar');
if (!container)
{
    throw new Error('Toolbar was not found.');
}

const currentButton = container.querySelector('[data-role="save"]');
if (!currentButton)
{
    throw new Error('Save button was not found.');
}

FocusNavigator.focusNext(container, {
    from: currentButton,
    wrap: true,
    preventScroll: true,
});
```

Используйте `accept`, если нужно исключить часть элементов из навигации без изменения их DOM-атрибутов.

```js
import { FocusNavigator } from 'ui.a11y';

const container = document.querySelector('#actions-menu');
if (!container)
{
    throw new Error('Actions menu was not found.');
}

FocusNavigator.focusFirst(container, {
    accept: (element) => element.dataset.hiddenAction !== 'true',
});
```

## Вернуть фокус

Метод `restoreFocus(target, options?)` возвращает фокус на переданный элемент. Перед вызовом `focus()` метод отправляет на этот элемент событие `a11y:restore-focus`. Если обработчик события вызывает `preventDefault()`, фокус не перемещается, а метод возвращает `null`.

Используйте метод `restoreFocus()`, когда после закрытия панели, меню или временного элемента нужно вернуть фокус на кнопку, которая открыла интерфейс.

```js
import { FocusNavigator, RESTORE_FOCUS_EVENT } from 'ui.a11y';

const openButton = document.querySelector('#open-menu-button');
if (!openButton)
{
    throw new Error('Open menu button was not found.');
}

openButton.addEventListener(RESTORE_FOCUS_EVENT, (event) => {
    if (openButton.disabled)
    {
        event.preventDefault();
    }
});

FocusNavigator.restoreFocus(openButton, {
    preventScroll: true,
});
```

## Контракты методов

#|
|| **Метод** | **Параметры** | **Результат** | **Эффект и ограничения** ||
|| `getFirst(container, options?)` | `container` — DOM-контейнер, `options` — параметры обхода. | <code>HTMLElement &#124; null</code> | Только ищет элемент. Фокус и `tabindex` не меняет. ||
|| `getLast(container, options?)` | `container` — DOM-контейнер, `options` — параметры обхода. | <code>HTMLElement &#124; null</code> | Только ищет элемент. Фокус и `tabindex` не меняет. ||
|| `getNext(container, options?)` | `container` — DOM-контейнер, `options.from` может задать начальную точку. | <code>HTMLElement &#124; null</code> | Если `from` не передан, поиск идет относительно активного элемента внутри контейнера. ||
|| `getPrevious(container, options?)` | `container` — DOM-контейнер, `options.from` может задать начальную точку. | <code>HTMLElement &#124; null</code> | Если активный элемент вне контейнера и `wrap` не включен, предыдущий элемент не определяется. ||
|| `focusFirst(container, options?)` | `container` — DOM-контейнер, `options` — параметры обхода и вызова `focus()`. | <code>HTMLElement &#124; null</code> | Находит первый подходящий элемент и вызывает для него `focus()`. ||
|| `focusLast(container, options?)` | `container` — DOM-контейнер, `options` — параметры обхода и вызова `focus()`. | <code>HTMLElement &#124; null</code> | Находит последний подходящий элемент и вызывает для него `focus()`. ||
|| `focusNext(container, options?)` | `container` — DOM-контейнер, `options.from` может задать начальную точку. | <code>HTMLElement &#124; null</code> | Перемещает фокус на следующий подходящий элемент. При `wrap: true` может перейти с последнего элемента на первый. ||
|| `focusPrevious(container, options?)` | `container` — DOM-контейнер, `options.from` может задать начальную точку. | <code>HTMLElement &#124; null</code> | Перемещает фокус на предыдущий подходящий элемент. При `wrap: true` может перейти с первого элемента на последний. ||
|| `focusContainer(container, options?)` | `container` — DOM-контейнер, `options` — параметры вызова `focus()`. | `HTMLElement` | Перемещает фокус на контейнер. Если у контейнера нет `tabindex`, добавляет `tabindex="-1"`. ||
|| `focusBySelector(container, selector, options?)` | `container` — DOM-контейнер, `selector` — валидный CSS-селектор, `options` — параметры обхода. | <code>HTMLElement &#124; null</code> | Перемещает фокус на первый подходящий элемент по селектору. Если совпадений нет, фокус не меняется. ||
|| `focusTarget(target, options?)` | `target` — элемент или `null`, `options` — параметры вызова `focus()`. | <code>HTMLElement &#124; null</code> | Перемещает фокус на переданный элемент. Если передан `null`, фокус не меняется. ||
|| `restoreFocus(target, options?)` | `target` — элемент для возврата фокуса, `options` — параметры вызова `focus()`. | <code>HTMLElement &#124; null</code> | Перед перемещением фокуса отправляет событие `a11y:restore-focus`. Если событие отменено через `preventDefault()`, фокус не меняется. ||
|| `getActiveElement(node?)` | `node` — документ или узел. | `HTMLElement` | Возвращает активный элемент документа или активный элемент внутри доступного `iframe`. ||
|| `createWalker(container, options?)` | `container` — DOM-контейнер, `options` — параметры обхода. | Объект обхода элементов. | Учитывает `tabbableOnly` и `accept`. Используйте, когда стандартных методов поиска недостаточно. ||
|#

## Служебные методы

Используйте служебные методы, если ваш компонент строит собственную навигацию по фокусируемым элементам.

#|
|| **Метод** | **Что делает** ||
|| `getActiveElement(node?)` | Возвращает активный `HTMLElement` для документа или узла. Если фокус находится внутри доступного iframe, возвращает активный элемент внутри него. ||
|| `createWalker(container, options?)` | Создает объект обхода элементов внутри контейнера с учетом `tabbableOnly` и `accept`. Используйте его, если стандартных методов поиска недостаточно. ||
|#


`getActiveElement()` проверяет активный элемент внутри доступного `iframe`. Если документ `iframe` недоступен, используйте активный элемент текущего документа как запасной сценарий.

`createWalker()` нужен для собственного обхода, когда стандартных методов `getFirst()`, `getNext()` или `focusNext()` недостаточно. Передайте `tabbableOnly: true`, если обход должен учитывать только элементы, доступные через `Tab`.

## Связанные материалы

-  [Ловушка фокуса FocusTrap](./focus-trap.md) — удержание фокуса внутри модального окна, диалога или выпадающего меню.

-  [Объявления для скринридера LiveAnnouncer](./live-announcer.md) — передача сообщений через скринридер без перемещения фокуса.

-  [Всплывающие окна и меню main.popup](../main-popup.md) — всплывающее окно или выпадающее меню рядом с элементом страницы.

-  [Системный диалог](../system-dialog.md) — модальное окно в актуальном системном оформлении.

-  [Расширения](../../framework/extensions.md) — подключение JavaScript-расширений Bitrix Framework.
