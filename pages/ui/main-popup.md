---
title: Всплывающие окна и меню main.popup
description: "Всплывающие окна и меню main.popup. UI Bitrix Framework: подключение расширения, Popup, PopupManager, Menu и MenuManager."
---

`main.popup` — это клиентское JavaScript-расширение Bitrix Framework для всплывающих окон и выпадающих меню. Оно подходит для сценариев, где нужно показать небольшое окно рядом с элементом страницы, вывести контекстное меню или управлять уже созданным окном по идентификатору.

PHP-код только загружает ресурсы расширения на страницу, а окно или меню создает JavaScript-код в браузере.

{% note tip "" %}

Для новых интерфейсов выберите компонент по сценарию:

-  [Системный диалог](./system-dialog.md) — модальное окно в актуальном системном оформлении: подтверждение действия, форма, настройки или результат операции.

-  [Системное меню](./system-menu.md) — меню в актуальном системном оформлении с современными параметрами пунктов.

-  `main.popup` — базовый механизм всплывающего окна или меню: точное позиционирование, работа через `PopupManager` или `MenuManager`, совместимость с существующим кодом или сценарий, который не покрывают системные компоненты.

{% endnote %}

## На этой странице

- [Подключить расширение](#подключить-расширение) — как загрузить `main.popup` из PHP и импортировать классы в JavaScript.
  
- [Popup](#popup) — окно с произвольным содержимым. Создайте окно, настройте положение, закрытие, кнопки, контейнер и размер кнопки закрытия через `CloseIconSize`.
  
- [PopupManager](#использовать-popupmanager) — менеджер окон, созданных по идентификатору.
  
- [Menu](#menu) и `MenuItem` — выпадающее меню, его пункты, вложенные пункты и методы изменения уже созданного меню.
  
- [MenuManager](#использовать-menumanager) — менеджер меню, созданных по идентификатору.
  
- [Совместимость](#совместимость-со-старым-кодом) — какие устаревшие глобальные классы могут встретиться в существующих проектах.

## Подключить расширение

Если вы подключаете расширение из PHP, загрузите `main.popup`.

```php
\Bitrix\Main\UI\Extension::load('main.popup');
```

Если вы работаете в модульном JavaScript, импортируйте нужные классы из `main.popup`.

```js
import { Popup, PopupManager, Menu, MenuManager, CloseIconSize } from 'main.popup';
```

Если проект использует типизацию, импортируйте типы из того же расширения.

```ts
import type {
    PopupOptions,
    PopupTarget,
    PopupTargetOptions,
    PopupAnimationOptions,
    MenuOptions,
    MenuItemOptions,
} from 'main.popup';
```

## Popup

`Popup` создает окно с произвольным содержимым.

Используйте этот класс, если нужно управлять положением окна, размерами, закрытием, затемнением страницы, кнопками или событиями.

### Создать всплывающее окно

Чтобы открыть окно, создайте экземпляр `Popup`, передайте содержимое в `content` и вызовите `show()`.

```js
import { Popup } from 'main.popup';

const content = document.createElement('div');
content.textContent = 'Настройки сохранены.';

const popup = new Popup({
    id: 'settings-saved-popup',
    content,
    width: 360,
    closeIcon: true,
    autoHide: true,
});

popup.show();
```

`content` принимает строку, DOM-элемент или DOM-узел. Если передать строку, `Popup` вставит ее как HTML в контейнер содержимого.

Для пользовательских данных безопаснее создать DOM-узел и записать текст через `textContent`.

### Привязать окно к элементу

Параметр `bindElement` задает элемент или координаты, рядом с которыми нужно открыть окно. Передайте DOM-элемент, объект с `left` и `top`, событие мыши или `null`.

Перед показом окна проверьте, что DOM-элемент привязки найден. Если `document.getElementById()` вернет `null`, окно откроется без привязки к нужному элементу.

```js
import { Popup } from 'main.popup';

const button = document.getElementById('open-popup-button');
if (!button)
{
    return;
}

const content = document.createElement('div');
content.textContent = 'Действие применяется только к выбранным элементам.';

const popup = new Popup({
    id: 'action-help-popup',
    bindElement: button,
    bindOptions: {
        position: 'top',
    },
    content,
    angle: true,
    autoHide: true,
    closeByEsc: true,
});

popup.show();
```

`bindOptions.position: 'top'` размещает окно над элементом. Если позицию не передать, окно открывается под элементом.

Параметры `offsetTop` и `offsetLeft` сдвигают окно относительно рассчитанной позиции. Их задают на верхнем уровне объекта параметров `Popup`: рядом с `bindElement` и `bindOptions`, а не внутри `bindOptions`.

### Передать параметры Popup

Конструктор `Popup` принимает объект с параметрами содержимого, положения, размеров и поведения окна.

{% note info "" %}

У конструктора `Popup` нет обязательных параметров.

Если окно создается через `PopupManager.create(options)`, в объекте `options` обязателен `id`.

{% endnote %}

**Идентификатор, содержимое и привязка**

-  `id` — идентификатор окна. Если не передать `id`, класс создаст служебный идентификатор.

-  `bindElement` — DOM-элемент, объект с координатами, событие мыши или `null`. По этому значению `Popup` рассчитывает положение окна.

-  `bindOptions` — параметры привязки:

   -  `position: 'top'` — открывает окно над элементом. Если не передать, окно открывается под элементом.

   -  `forceBindPosition`, `forceLeft`, `forceTop` — ограничивают автоматическую коррекцию положения.

-  `content` — строка, DOM-элемент или DOM-узел для основной области окна.

-  `buttons` — массив кнопок. `Popup` выводит совместимые объекты кнопок `main.popup` и кнопки из `ui.buttons`.

**Размеры и контейнер**

-  `width`, `height`, `minWidth`, `minHeight`, `maxWidth`, `maxHeight` — размеры окна в пикселях.

-  `resizable` — включает изменение размера окна пользователем.

-  `targetContainer` — DOM-элемент, в который нужно добавить контейнер окна. Если параметр не передан, используется `document.body`.

-  `disableScroll` — блокирует прокрутку контейнера на время показа окна.

**Закрытие и поведение**

-  `closeIcon` — кнопка закрытия в правой части окна. По умолчанию не выводится.

-  `closeIconSize` — размер кнопки закрытия. Допустимые значения: `CloseIconSize.SMALL` и `CloseIconSize.LARGE`.

-  `closeByEsc` — закрывает окно по клавише `Esc`. По умолчанию `false`.

-  `autoHide` — закрывает окно по клику вне области окна. По умолчанию `false`.

-  `autoHideHandler` — значение типа `Function`, которое проверяет клик перед автоматическим закрытием. Верните `true`, чтобы разрешить закрытие.

-  `cacheable` — сохраняет окно после закрытия. Передайте `false`, чтобы окно удалялось после закрытия.

-  `fixed` — добавляет окну фиксированное позиционирование. По умолчанию `false`.

-  `draggable` — перетаскивание окна. Принимает `boolean` или объект с `element` и `restrict`.

**Оформление и события**

-  `padding` и `contentPadding` — отступы всего окна и области содержимого.

-  `borderRadius` и `contentBorderRadius` — радиус скругления всего окна и области содержимого.

-  `background` и `contentBackground` — CSS-фон всего окна и области содержимого.

-  `contentColor` — CSS-цвет фона области содержимого. Значение применяется к свойству `background-color`. Базовые значения: `white` и `gray`, также можно передать любой валидный CSS-цвет.

-  `className` — дополнительный CSS-класс контейнера окна.

-  `darkMode` — включает темный режим оформления окна.

-  `titleBar` — заголовок окна. Принимает `string` или объект с полем `content`.

-  `angle` — стрелка к элементу привязки. Принимает `boolean` или объект с настройками:

   -  `offset` — сдвиг стрелки в пикселях.

   -  `position` — сторона окна, на которой находится стрелка. Допустимые значения: `top`, `right`, `bottom`, `left`.

-  `overlay` — затемнение страницы под окном. Принимает `boolean` или объект с настройками:

   -  `backgroundColor` — CSS-цвет фона затемнения.

   -  `opacity` — прозрачность от `0` до `100`.

   -  `blur` — CSS-значение для `backdrop-filter`.

-  `animation` — анимация открытия и закрытия. Принимает:

   -  `fading` — изменение прозрачности.

   -  `fading-slide` — изменение прозрачности и сдвиг при показе.

   -  `scale` — масштабирование при показе.

   -  `false` — отключает анимацию.

   -  объект с CSS-классами `showClassName`, `closeClassName` и типом события `closeAnimationType`.

-  `events` — объект с обработчиками событий окна.

По умолчанию `autoHide`, `closeByEsc`, `closeIcon`, `resizable`, `fixed` и `disableScroll` выключены.

Окно остается кешируемым, если не изменить значение `cacheable`.

### Выбрать контейнер окна

По умолчанию `Popup` добавляет контейнер окна в `document.body`.

Передайте `targetContainer`, если окно должно находиться внутри конкретного DOM-элемента: например, внутри iframe или области со своей прокруткой.

`iframe` — это встроенный фрейм со своим документом внутри страницы.

```js
import { Popup } from 'main.popup';

const container = document.getElementById('popup-area');
const content = document.createElement('div');
content.textContent = 'Окно добавлено в выбранный контейнер.';

const popup = new Popup({
    id: 'container-popup',
    targetContainer: container,
    content,
    disableScroll: true,
});

popup.show();
```

-  Метод `setTargetContainer(container)` — меняет контейнер уже созданного окна. Если у окна есть затемнение страницы, метод переносит его в новый контейнер вместе с окном.

-  Метод `getTargetContainer()` — возвращает текущий контейнер.

### Добавить кнопки

Для кнопок используйте `Button` из `ui.buttons`.

Классы кнопок `main.popup` оставлены для совместимости с существующим кодом. При клике можно выполнить действие и закрыть окно через экземпляр `Popup`.

```js
import { Popup } from 'main.popup';
import { Button } from 'ui.buttons';

const content = document.createElement('div');
content.textContent = 'Удалить выбранный элемент?';

const popup = new Popup({
    id: 'delete-confirm-popup',
    content,
    closeIcon: true,
    buttons: [
        new Button({
            text: 'Удалить',
            onclick: () => {
                console.log('Элемент удален');
                popup.close();
            },
        }),
        new Button({
            text: 'Отмена',
            onclick: () => {
                popup.close();
            },
        }),
    ],
});

popup.show();
```

-  Метод `getButtons()` — возвращает массив переданных кнопок.

-  Метод `getButton(id)` — ищет кнопку по идентификатору, если объект кнопки поддерживает метод `getId()`.

### Управлять окном

После создания экземпляра используйте методы `Popup`, чтобы менять содержимое, положение и состояние окна.

-  `show()` — показывает окно.

-  `close()` — закрывает окно.

-  `toggle()` — переключает состояние окна: закрывает открытое окно и показывает закрытое.

-  `destroy()` — удаляет окно, обработчики и служебные элементы. Если `cacheable` равен `false`, окно удаляется после закрытия.

-  `bringToFront()` — поднимает окно поверх других окон.

-  `isShown()` — возвращает `true`, если окно открыто.

-  `isDestroyed()` — возвращает `true`, если окно удалено.

-  `setContent(content)` — заменяет содержимое.

-  `setButtons(buttons)` — заменяет кнопки.

-  `getPopupContainer()` — возвращает DOM-контейнер окна.

-  `getContentContainer()` — возвращает DOM-контейнер области содержимого.

-  `setBindElement(bindElement)` — меняет элемент или координаты привязки.

-  `adjustPosition(bindOptions)` — пересчитывает положение окна.

-  `setWidth(width)`, `setHeight(height)`, `setMinWidth(width)`, `setMaxWidth(width)`, `setMinHeight(height)`, `setMaxHeight(height)` — меняют размеры.

-  `setTargetContainer(container)` — переносит окно в другой DOM-контейнер.

-  `getTargetContainer()` — возвращает текущий DOM-контейнер окна.

-  `setDisableScroll(flag)` — включает или выключает блокировку прокрутки текущего контейнера.

-  `setAutoHide(enable)` — включает или выключает закрытие по клику вне окна.

-  `setClosingByEsc(enable)` — включает или выключает закрытие по клавише `Esc`.

-  `removeOverlay()` — удаляет затемнение страницы, если оно было создано.

```js
import { Popup } from 'main.popup';

const popup = new Popup({
    id: 'status-popup',
    content: 'Идет загрузка.',
    width: 300,
});

popup.show();

const result = document.createElement('div');
result.textContent = 'Загрузка завершена.';

popup.setContent(result);
popup.adjustPosition();
```

### Обработать события Popup

Передайте обработчики в `events`, если нужно синхронизировать состояние страницы с жизненным циклом окна.

```js
import { Popup } from 'main.popup';

const popup = new Popup({
    id: 'export-popup',
    content: 'Файл готовится.',
    events: {
        onShow: () => {
            console.log('Окно открыто');
        },
        onAfterClose: () => {
            console.log('Окно закрыто');
        },
    },
});

popup.show();
```

Основные события `Popup`:

-  `onInit` — вызывается при инициализации окна.

-  `onAfterInit` — вызывается после создания служебных элементов окна.

-  `onFirstShow` — вызывается при первом показе.

-  `onBeforeShow` — вызывается перед показом.

-  `onShow` — вызывается при показе.

-  `onAfterShow` — вызывается после показа.

-  `onClose` — вызывается при закрытии.

-  `onAfterClose` — вызывается после закрытия.

-  `onDestroy` — вызывается при удалении.

-  `onBeforeAdjustPosition` — вызывается перед пересчетом положения.

-  `onDragStart`, `onDrag`, `onDragEnd` — вызываются при перетаскивании.

-  `onResizeStart`, `onResize`, `onResizeEnd` — вызываются при изменении размера.

-  `onFullscreenEnter` — вызывается при переходе окна в полноэкранный режим браузера.

-  `onFullscreenLeave` — вызывается при выходе окна из полноэкранного режима браузера.

## Использовать PopupManager

`PopupManager` хранит созданные окна и помогает получать их по идентификатору. Используйте его, если окно должно быть доступно из разных обработчиков.

```js
import { PopupManager } from 'main.popup';

const popup = PopupManager.create({
    id: 'shared-popup',
    content: 'Общее окно',
    closeIcon: true,
});

popup.show();

const samePopup = PopupManager.getPopupById('shared-popup');
samePopup.close();
```

Метод `PopupManager.create(options)` требует `id`, если вы передаете объект параметров. Если окно с таким `id` уже создано, метод вернет существующий экземпляр.

{% note warning "" %}

Когда окно, созданное через `PopupManager.create()`, открывается, менеджер закрывает предыдущее текущее окно.

Если на странице должны одновременно оставаться открытыми несколько окон, создавайте и показывайте их напрямую через `new Popup()`.

{% endnote %}

-  `getPopupById(id)` — возвращает окно по идентификатору или `null`.

-  `isPopupExists(id)` — проверяет, создано ли окно с таким идентификатором.

-  `getCurrentPopup()` — возвращает последнее показанное окно, которое отслеживает менеджер.

-  `isAnyPopupShown()` — проверяет, открыто ли хотя бы одно окно.

-  `getPopups()` — возвращает массив созданных окон.

## Menu

`Menu` строит выпадающий список пунктов на основе `Popup`. Используйте этот класс, если нужно контекстное меню, вложенные пункты или динамическое изменение списка после создания.

Для новых интерфейсов используйте [Системное меню](./system-menu.md) на расширении `ui.system.menu`.

### Создать меню

Чтобы создать меню, передайте `id`, `bindElement` и массив `items`, затем вызовите `show()`.

Перед показом меню проверьте, что DOM-элемент привязки найден. Иначе меню может открыться не рядом с нужной кнопкой.

```js
import { Menu } from 'main.popup';

const button = document.getElementById('actions-button');

const menu = new Menu({
    id: 'actions-menu',
    bindElement: button,
    items: [
        {
            id: 'edit',
            text: 'Редактировать',
            onclick: () => {
                console.log('Редактировать объект');
            },
        },
        {
            id: 'delete',
            text: 'Удалить',
            onclick: () => {
                console.log('Удалить объект');
            },
        },
    ],
});

menu.show();
```

{% note warning "" %}

В `main.popup` пункт меню использует `text` для текста и `onclick` для обработчика клика.

{% endnote %}

### Передать параметры Menu

`Menu` использует параметры `Popup` для положения, закрытия, размеров и событий. Дополнительно меню принимает параметры пунктов и вложенных меню.

{% note info "" %}

У конструктора `Menu` нет обязательных параметров. Чтобы меню было привязано к кнопке и содержало пункты, передайте `bindElement` и `items`.

Если меню создается через `MenuManager.create(options)` или `MenuManager.show(options)`, в объекте `options` обязателен `id`.

{% endnote %}

-  `id` — идентификатор меню. Если не передать `id`, класс создаст служебный идентификатор.

-  `bindElement` — DOM-элемент, объект с координатами или событие мыши. По этому значению меню рассчитывает положение окна.

-  `items` — массив объектов с параметрами пунктов меню.

-  `subMenuOptions` — объект с параметрами `Popup` для вложенных меню.

По умолчанию меню использует:

-  `autoHide: true` — закрывается по клику вне меню.

-  `closeByEsc: true` — закрывается по клавише `Esc`.

-  `angle: false` — стрелка к элементу привязки не выводится.

-  `offsetTop: 1` — вертикальный сдвиг от рассчитанной позиции.

-  `offsetLeft: 0` — горизонтальный сдвиг от рассчитанной позиции.

-  `animation: 'fading'` — анимация прозрачности.

Эти значения можно переопределить через параметры меню.

### Настроить пункт меню

Пункт меню задается объектом внутри массива `items`.

**Содержимое и состояние**

-  `id` — идентификатор пункта. Если не передать `id`, класс создаст служебный идентификатор.

-  `text` — текст пункта. HTML-теги в строке экранируются.

-  `html` — HTML-содержимое пункта. Используйте только для доверенной разметки.

-  `title` — значение атрибута `title` у DOM-элемента пункта.

-  `disabled` — отключает пункт и не открывает вложенное меню при наведении.

-  `delimiter` — выводит разделитель вместо обычного пункта.

**Ссылка и обработчики**

-  `href` — адрес ссылки. Если параметр передан, пункт создается как ссылка.

-  `target` — значение атрибута `target` для ссылки.

-  `onclick` — значение типа `Function` или строковый обработчик клика. Для нового кода используйте функцию.

-  `events` — объект с обработчиками событий пункта.

**Оформление и данные**

-  `className` — дополнительный CSS-класс пункта.

-  `dataset` — объект с `data-*` атрибутами.

-  `focusable` — определяет, может ли пункт получать фокус при навигации с клавиатуры. По умолчанию `true`, для разделителя `delimiter` — `false`.

-  `attrs` — объект дополнительных HTML-атрибутов для DOM-элемента пункта. По умолчанию `null`.

**Вложенное меню**

-  `items` — массив объектов с параметрами пунктов вложенного меню.

-  `menuShowDelay` — задержка показа вложенного меню в миллисекундах. По умолчанию `300`.

-  `subMenuOffsetX` — горизонтальный сдвиг вложенного меню. По умолчанию `4`.

-  `cacheable` — сохраняет созданное вложенное меню для повторного открытия.

### Добавить вложенное меню

Чтобы открыть вложенное меню при наведении на пункт, передайте массив `items` в этом пункте.

```js
import { Menu } from 'main.popup';

const menu = new Menu({
    id: 'status-menu',
    bindElement: document.getElementById('status-button'),
    items: [
        {
            id: 'move',
            text: 'Переместить',
            items: [
                {
                    id: 'move-active',
                    text: 'В активные',
                    onclick: () => {
                        console.log('Переместить в активные');
                    },
                },
                {
                    id: 'move-archive',
                    text: 'В архив',
                    onclick: () => {
                        console.log('Переместить в архив');
                    },
                },
            ],
        },
    ],
});

menu.show();
```

Вложенное меню создается как отдельный `Menu`, привязанный к родительскому пункту.

Параметр `menuShowDelay` управляет задержкой открытия. События `SubMenu:onShow` и `SubMenu:onClose` помогают отследить состояние вложенного меню.

### Открыть и изменить меню

Используйте методы `Menu`, чтобы показать меню, закрыть его или изменить список пунктов.

-  `show()` — показывает меню.

-  `close()` — закрывает меню.

-  `destroy()` — удаляет меню и вложенные меню.

-  `getPopupWindow()` — возвращает внутренний экземпляр `Popup`.

-  `addMenuItem(menuItemOptions, targetItemId)` — добавляет пункт. Если передать `targetItemId`, метод добавит новый пункт перед указанным пунктом.

-  `removeMenuItem(itemId, options)` — удаляет пункт по идентификатору. Параметр `options.destroyEmptyPopup` удаляет меню, если после удаления пункта в нем не осталось других пунктов.

-  `getMenuItem(itemId)` — возвращает пункт по идентификатору или `null`.

-  `getMenuItems()` — возвращает массив пунктов.

-  `toggle()` — переключает состояние меню: закрывает открытое меню и показывает закрытое.

```js
import { Menu } from 'main.popup';

const menu = new Menu({
    id: 'dynamic-menu',
    bindElement: document.getElementById('dynamic-button'),
    items: [
        {
            id: 'refresh',
            text: 'Обновить',
        },
    ],
});

menu.addMenuItem({
    id: 'copy',
    text: 'Скопировать ссылку',
    onclick: () => {
        console.log('Ссылка скопирована');
    },
});

menu.show();
```

{% note warning "" %}

Метод `addMenuItem()` не добавляет пункт, если в меню уже есть пункт с таким же `id`. Задавайте уникальные идентификаторы, если планируете обновлять меню после создания.

{% endnote %}

### Изменить пункт меню

Чтобы изменить уже созданный пункт, получите его через `getMenuItem(itemId)` и вызовите методы `MenuItem`.

```js
const copyItem = menu.getMenuItem('copy');

if (copyItem)
{
    copyItem.setText('Ссылка скопирована');
    copyItem.disable();
}
```

-  `setText(text, allowHtml)` — меняет текст пункта. По умолчанию `allowHtml` равен `false`, поэтому строка экранируется.

   Передавайте `true` вторым аргументом только для доверенного HTML.

-  `disable()` — делает пункт неактивным, добавляет CSS-класс `menu-popup-item-disabled` и закрывает его вложенное меню, если оно открыто.

-  `enable()` — возвращает пункт в активное состояние и убирает CSS-класс `menu-popup-item-disabled`.

-  `showSubMenu()` — открывает вложенное меню пункта. Метод работает только когда родительское меню уже показано.

-  `closeSubMenu()` — закрывает вложенное меню пункта и вложенные меню его дочерних пунктов.

-  `destroySubMenu()` — удаляет вложенное меню пункта и очищает список дочерних пунктов.

-  `getSubMenu()` — возвращает объект вложенного меню `Menu` или `null`, если вложенное меню еще не создано.

## Использовать MenuManager

`MenuManager` хранит меню по идентификатору и показывает только одно текущее меню через `show()`.

```js
import { MenuManager } from 'main.popup';

MenuManager.show({
    id: 'row-actions-menu',
    bindElement: document.getElementById('row-actions-button'),
    items: [
        {
            id: 'open',
            text: 'Открыть',
            onclick: () => {
                console.log('Открыть объект');
            },
        },
    ],
});

const currentMenu = MenuManager.getCurrentMenu();
```

Метод `MenuManager.create(options)` требует `id`, если вы передаете объект параметров. Если меню с таким `id` уже создано, метод вернет существующий экземпляр.

-  `show(options)` — создает или получает меню по `id` и сразу показывает его.

-  `create(options)` — создает или возвращает меню по `id`.

-  `getCurrentMenu()` — возвращает текущее меню или `null`.

-  `getMenuById(id)` — возвращает меню по идентификатору или `null`.

-  `destroy(id)` — удаляет меню из менеджера и удаляет внутреннее окно.

## Совместимость со старым кодом

{% note warning "" %}

В существующем коде могут встречаться устаревшие глобальные классы:

-  `BX.PopupWindow` — алиас `Popup`.

-  `BX.PopupWindowManager` — алиас `PopupManager`.

-  `BX.PopupMenuWindow` — алиас `Menu`.

-  `BX.PopupMenu` — алиас `MenuManager`.

-  `BX.PopupMenuItem` — алиас `MenuItem`.

Старые имена оставлены для совместимости. В новом коде используйте импорт из `main.popup` или классы в пространстве имен `BX.Main`.

{% endnote %}
