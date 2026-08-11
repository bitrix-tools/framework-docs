---
title: Проверка интерактивности InteractivityChecker
description: 'Проверка интерактивности InteractivityChecker. UI Bitrix Framework: инструменты интерфейса, подключение расширений и примеры использования.'
---

`InteractivityChecker` проверяет состояние DOM-элемента перед сценариями фокуса: отключен ли он, видим ли на странице, может ли получить фокус и участвует ли в обычном переходе по `Tab`. Используйте его перед вызовом `focus()`, настройкой навигации или выбором элемента для восстановления фокуса.

В Bitrix Framework за проверку интерактивности отвечает расширение `ui.a11y`. В нем доступен статический класс `InteractivityChecker`.

## Подключить расширение

Если вы подключаете JavaScript API из PHP, загрузите расширение `ui.a11y`.

```php
\Bitrix\Main\UI\Extension::load('ui.a11y');
```

Если вы работаете в модульном JavaScript, импортируйте `InteractivityChecker` из `ui.a11y`.

```js
import { InteractivityChecker } from 'ui.a11y';
```

## Выбрать метод проверки

Используйте методы `InteractivityChecker` в зависимости от того, какое условие нужно проверить.

#|
|| **Метод** | **Что проверяет** ||
|| [`isDisabled(element)`](#проверить-отключенное-состояние) | Возвращает `true`, если у элемента есть атрибут `disabled` или `aria-disabled="true"` ||
|| [`isVisible(element)`](#проверить-видимость) | Возвращает `true`, если элемент находится в DOM и видим на странице ||
|| [`hasNegativeTabIndex(element)`](#проверить-отрицательный-tabindex) | Возвращает `true`, если у элемента задан отрицательный `tabindex` ||
|| [`isFocusable(element)`](#проверить-фокусируемость) | Возвращает `true`, если элемент может получить фокус программно или через клавиатурный сценарий ||
|| [`isTabbable(element)`](#отличить-фокусируемый-элемент-от-доступного-по-tab) | Возвращает `true`, если элемент может получить фокус и доступен в обычном переходе по `Tab` ||
|#

## Контракты методов

Методы `InteractivityChecker` ожидают DOM-элемент, возвращают `boolean` и не меняют состояние страницы. Если вы получаете элемент через `querySelector()`, сначала обработайте ситуацию, когда элемент не найден, и не передавайте `null` в метод проверки.

#|
|| **Метод** | **Параметры** | **Результат** | **Что учитывает и не меняет** ||
|| `isDisabled(element)` | `element` — DOM-элемент | `boolean` | Учитывает `disabled` и `aria-disabled="true"`. Не меняет атрибуты элемента ||
|| `isVisible(element)` | `element` — DOM-элемент | `boolean` | Проверяет подключение к DOM и видимость на странице. Не показывает и не скрывает элемент ||
|| `hasNegativeTabIndex(element)` | `element` — DOM-элемент | `boolean` | Проверяет только атрибут `tabindex`. Не определяет видимость и фокусируемость ||
|| `isFocusable(element)` | `element` — DOM-элемент | `boolean` | Проверяет, может ли элемент получить фокус программно или через клавиатурный сценарий. Не вызывает `focus()` ||
|| `isTabbable(element)` | `element` — DOM-элемент | `boolean` | Проверяет, может ли элемент участвовать в обычном переходе по `Tab`. Не меняет `tabindex` ||
|#

Используйте результат проверки перед действием: вызовом `focus()`, `click()`, изменением ARIA-атрибутов или выбором элемента для навигации.

## Проверить фокусируемость

Перед вызовом `focus()` проверьте, что элемент найден и может получить фокус. Так код не будет пытаться сфокусировать скрытый, удаленный из DOM или недоступный для фокуса элемент.

```js
import { InteractivityChecker } from 'ui.a11y';

const submitButton = document.querySelector('#submit-button');
if (!submitButton)
{
    throw new Error('Submit button was not found.');
}

if (InteractivityChecker.isFocusable(submitButton))
{
    submitButton.focus({ preventScroll: true });
}
```

Метод `isFocusable()` возвращает `true`, если элемент подходит для фокуса, находится в DOM, видим и не расположен внутри контейнера с атрибутом `inert`.

## Отличить фокусируемый элемент от доступного по Tab

Элемент с `tabindex="-1"` может получить фокус программно, но не участвует в обычном переходе по `Tab`.

Выберите метод по сценарию:

-  `isFocusable()` — если планируете вызвать `focus()` из кода.

-  `isTabbable()` — если нужно проверить доступность элемента для клавиатурного обхода.

```js
import { InteractivityChecker } from 'ui.a11y';

const panel = document.querySelector('#details-panel');
if (!panel)
{
    throw new Error('Details panel was not found.');
}

panel.setAttribute('tabindex', '-1');

const canFocusFromCode = InteractivityChecker.isFocusable(panel);
const canReachByTab = InteractivityChecker.isTabbable(panel);
```

В этом примере:

-  `canFocusFromCode` будет `true`, если панель находится в DOM и видима.

-  `canReachByTab` будет `false`, потому что отрицательный `tabindex` исключает элемент из обычной последовательности `Tab`.

## Проверить отключенное состояние

Метод `isDisabled()` помогает отличить доступный элемент от отключенного перед обработкой действия. Проверка учитывает стандартный атрибут `disabled` и ARIA-состояние `aria-disabled="true"`.

```js
import { InteractivityChecker } from 'ui.a11y';

const saveButton = document.querySelector('#save-button');
if (!saveButton)
{
    throw new Error('Save button was not found.');
}

if (!InteractivityChecker.isDisabled(saveButton))
{
    saveButton.click();
}
```

Метод `isDisabled()` возвращает `true` для `aria-disabled="true"`. Значение `aria-disabled="false"` не считается отключенным состоянием. Метод `isFocusable()` может вернуть `true`, потому что ARIA-состояние само по себе не исключает элемент из фокуса.

## Проверить видимость

Метод `isVisible()` возвращает `false`, если элемент не подключен к DOM или скрыт. Например, скрытым считается элемент без видимой геометрии, с `visibility: hidden` или с `opacity: 0` в браузерах, где доступна такая проверка.

```js
import { InteractivityChecker } from 'ui.a11y';

const popup = document.querySelector('#help-popup');
if (!popup)
{
    throw new Error('Help popup was not found.');
}

if (InteractivityChecker.isVisible(popup))
{
    popup.setAttribute('aria-live', 'polite');
}
```

## Проверить отрицательный tabindex

Метод `hasNegativeTabIndex()` возвращает `true`, если у элемента есть атрибут `tabindex` с отрицательным значением. Метод проверяет только атрибут `tabindex` и не определяет, видим ли элемент или может ли он получить фокус.

Используйте метод `hasNegativeTabIndex()`, когда нужно отдельно проверить, исключен ли элемент из обычной последовательности `Tab`.

```js
import { InteractivityChecker } from 'ui.a11y';

const closeButton = document.querySelector('#close-button');
if (!closeButton)
{
    throw new Error('Close button was not found.');
}

if (InteractivityChecker.hasNegativeTabIndex(closeButton))
{
    closeButton.removeAttribute('tabindex');
}
```

## Учитывать inert при проверке фокуса

Метод `isFocusable()` дополнительно возвращает `false`, если элемент находится внутри предка с атрибутом `inert`. Такой элемент не должен получать фокус, пока внешняя область интерфейса изолирована.

```js
import { InteractivityChecker } from 'ui.a11y';

const target = document.querySelector('#menu-item');
if (!target)
{
    throw new Error('Menu item was not found.');
}

if (InteractivityChecker.isVisible(target) && InteractivityChecker.isFocusable(target))
{
    target.focus();
}
```

## Учитывать ограничения проверок

Методы `InteractivityChecker` проверяют разные условия и не заменяют друг друга:

-  отключенное состояние определяет `isDisabled()`, но `aria-disabled="true"` само по себе не исключает элемент из фокуса;

-  видимость определяет `isVisible()`, но этот метод не проверяет, доступен ли элемент для фокуса;

-  отрицательный `tabindex` проверяет `hasNegativeTabIndex()`, но этот метод не гарантирует, что элемент находится в DOM;

-  перед программным вызовом `focus()` используйте `isFocusable()`;

-  для проверки обычного перехода по `Tab` используйте `isTabbable()`.

Для программного перемещения фокуса сначала найдите элемент, затем проверьте фокусируемость. Для клавиатурного обхода используйте `isTabbable()` или инструменты навигации фокуса.

## Связанные материалы

-  [Расширение ui.a11y](./index.md) — обзор инструментов доступности в интерфейсе.

-  [Навигация фокуса FocusNavigator](./focus-navigator.md) — поиск и программное перемещение фокуса внутри DOM-контейнера.

-  [Зона фокуса FocusZone](./focus-zone.md) — клавиатурная навигация между элементами внутри DOM-контейнера.

-  [Ловушка фокуса FocusTrap](./focus-trap.md) — удержание фокуса внутри модального окна, диалога или выпадающего меню.

-  [Монитор фокуса FocusMonitor](./focus-monitor.md) — отслеживание фокуса и восстановление потерянного фокуса в интерфейсе.

-  [Расширения](../../framework/extensions.md) — подключение JavaScript-расширений Bitrix Framework.
