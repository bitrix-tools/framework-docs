# main.popup

## Описание

Компонент `main.popup` предоставляет мощный и гибкий инструмент для создания и управления всплывающими окнами (попапами) и контекстными меню в Битрикс. Он позволяет настраивать внешний вид, поведение, анимацию и взаимодействие с пользователем.

**Расположение:** `/main/install/js/main/popup/src/`

## Импорт и использование

### ES6

```javascript
import { Popup, PopupManager, Menu, MenuItem, MenuManager, CloseIconSize } from 'main.popup';

// Создание попапа
const popup = new Popup({
    id: 'my-popup',
    content: 'Содержимое попапа',
    closeByEsc: true,
    autoHide: true,
});
popup.show();

// Создание меню
const menu = new Menu({
    id: 'my-menu',
    bindElement: document.querySelector('#menu-target'),
    items: [
        { text: 'Пункт 1', onclick: () => console.log('Пункт 1') },
        { text: 'Пункт 2', delimiter: true },
        { text: 'Пункт 3' },
    ]
});
menu.show();
```

---

## Popup

Основной класс для создания всплывающих окон.

### Основные параметры `PopupOptions`

| Параметр | Тип | По умолчанию | Описание |
|---|---|---|---|
| `id` | `string` | `popup-window-{random}` | Уникальный идентификатор попапа. |
| `bindElement` | `HTMLElement \| {left: number, top: number}` | `null` | Элемент, к которому будет привязан попап. |
| `content` | `string \| HTMLElement` | `null` | Содержимое окна. |
| `buttons` | `Array<BX.UI.Button>` | `[]` | Массив кнопок (`BX.UI.Button`). |
| `width` / `height` | `number` | `null` | Ширина/высота окна. |
| `minWidth` / `minHeight` | `number` | `null` | Минимальная ширина/высота. |
| `maxWidth` / `maxHeight` | `number` | `null` | Максимальная ширина/высота. |
| `padding` | `number` | `15` | Внутренний отступ контейнера попапа. |
| `contentPadding` | `number` | `0` | Внутренний отступ контента. |
| `borderRadius` | `string` | `null` | Радиус скругления углов. |
| `background` | `string` | `null` | CSS-фон для всего попапа. |
| `contentBackground` | `string` | `null` | CSS-фон для области контента. |
| `className` | `string` | `''` | Дополнительный CSS-класс для контейнера. |
| `darkMode` | `boolean` | `false` | Темный режим. |
| `autoHide` | `boolean` | `false` | Автоматически закрывать при клике вне окна. |
| `closeByEsc` | `boolean` | `false` | Закрывать по нажатию на `Esc`. |
| `draggable` | `boolean \| {element: HTMLElement}` | `false` | Разрешить перетаскивание. По умолчанию за заголовок. |
| `resizable` | `boolean` | `false` | Разрешить изменение размера. |
| `titleBar` | `string \| boolean` | `false` | Заголовок окна. |
| `closeIcon` | `boolean \| {size: CloseIconSize}` | `false` | Показать иконку закрытия. |
| `angle` | `boolean \| {position, offset}` | `false` | Показать "стрелку" у попапа. |
| `overlay` | `boolean \| {backgroundColor, opacity}` | `false` | Показать подложку (overlay). |
| `animation` | `string \| {showClassName, closeClassName}` | `null` | Настройки анимации появления/скрытия. Варианты: `fading`, `fading-slide`, `scale`. |
| `cacheable` | `boolean` | `true` | Не уничтожать DOM попапа при закрытии. |
| `events` | `object` | `{}` | Объект с обработчиками событий. |

### Методы `Popup`

- `show()`: Показать попап.
- `close()`: Закрыть попап.
- `toggle()`: Переключить видимость.
- `destroy()`: Уничтожить попап.
- `isShown()`: `boolean` - Проверить, показан ли попап.
- `adjustPosition()`: Пересчитать позицию относительно `bindElement`.
- `setContent(content)`: Установить новое содержимое.
- `setButtons(buttons)`: Установить новый набор кнопок.
- `setWidth(width)` / `setHeight(height)`: Установить размеры.
- `getPopupContainer()`: `HTMLElement` - Получить DOM-элемент контейнера попапа.
- `getContentContainer()`: `HTMLElement` - Получить DOM-элемент контейнера контента.

### События `Popup`

- `onInit`: Сразу после создания экземпляра.
- `onAfterInit`: После полной инициализации.
- `onFirstShow`: При первом показе.
- `onShow`: Перед началом анимации показа.
- `onAfterShow`: После завершения анимации показа.
- `onClose`: Перед началом анимации закрытия.
- `onAfterClose`: После завершения анимации закрытия.
- `onDestroy`: Перед уничтожением.
- `onDragStart` / `onDrag` / `onDragEnd`: События перетаскивания.
- `onResizeStart` / `onResize` / `onResizeEnd`: События изменения размера.

---

## Menu

Класс для создания контекстных меню. Наследуется от `Popup` и имеет схожие параметры и методы.

### Основные параметры `MenuOptions`

| Параметр | Тип | По умолчанию | Описание |
|---|---|---|---|
| `items` | `Array<MenuItemOptions>` | `[]` | Массив пунктов меню. |
| `closeSubMenuOnMouseLeave` | `boolean` | `true` | Закрывать подменю при уводе курсора. |
| `maxHeight` | `number` | `null` | Максимальная высота меню. |
| `allowResizeX` | `boolean` | `false` | Разрешить изменение ширины. |

### `MenuItemOptions`

| Параметр | Тип | Описание |
|---|---|---|
| `id` | `string` | Уникальный идентификатор пункта. |
| `text` | `string` | Текст пункта. |
| `html` | `string` | HTML-содержимое пункта (имеет приоритет над `text`). |
| `href` | `string` | Ссылка (пункт будет тегом `<a>`). |
| `onclick` | `Function` | Обработчик клика. |
| `delimiter` | `boolean` | Является ли пункт разделителем. |
| `disabled` | `boolean` | Сделать пункт неактивным. |
| `items` | `Array<MenuItemOptions>` | Массив для создания подменю. |

---

## Менеджеры

- `PopupManager`: Позволяет управлять всеми созданными попапами.
  - `PopupManager.create(options)`: Фабричный метод для создания `Popup`.
  - `PopupManager.getPopupById(id)`: Получить экземпляр попапа по ID.
- `MenuManager`: Аналогично для меню.
  - `MenuManager.create(options)`: Фабричный метод для создания `Menu`.
  - `MenuManager.getMenuById(id)`: Получить экземпляр меню по ID.

---

## TypeScript типы

```typescript
import type { 
    PopupOptions, 
    PopupTarget, 
    PopupAnimationOptions,
    MenuOptions, 
    MenuItemOptions 
} from 'main.popup';
```

## Совместимость

Для обратной совместимости `main.popup` предоставляет старые имена классов в глобальном пространстве `BX`:

- `BX.PopupWindow` (алиас для `Popup`)
- `BX.PopupMenuWindow` (алиас для `Menu`)
- `BX.PopupWindowManager` (алиас для `PopupManager`)
- `BX.PopupMenu` (алиас для `MenuManager`)
- `BX.PopupMenuItem` (алиас для `MenuItem`)