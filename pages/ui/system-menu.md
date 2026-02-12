# Menu

## Описание

Компонент `Menu` предназначен для создания и управления всплывающими меню. Он позволяет гибко настраивать пункты, разделы, добавлять иконки, счетчики, подменю и кастомный заголовок.

**Расположение:** `/ui/install/js/ui/system/menu/src`

## Импорт компонента

```javascript
import { Menu, MenuItemDesign, MenuSectionDesign, MenuRichHeaderDesign } from 'ui.system.menu';
```

## TypeScript типы

```typescript
import type { MenuOptions, MenuItemOptions, MenuSectionOptions } from 'ui.system.menu';
```

## Основные сущности

### Menu

Основной класс для создания и управления меню.

**Конструктор:** `new Menu(options: MenuOptions)`

**Основные методы:**
- `show(bindElement: HTMLElement)`: Показывает меню, привязанное к `bindElement`.
- `close()`: Закрывает меню.
- `destroy()`: Уничтожает экземпляр меню.
- `updateItems(items: MenuItemOptions[])`: Обновляет пункты меню.
- `getPopup(): Popup`: Возвращает экземпляр `main.popup`.

### MenuOptions

Объект с настройками для создания меню. Наследует опции `main.popup.PopupOptions`.

| Свойство | Тип | Описание |
|---|---|---|
| `items` | `MenuItemOptions[]` | Массив объектов для конфигурации пунктов меню. |
| `sections` | `MenuSectionOptions[]` | Массив объектов для конфигурации разделов меню. |
| `richHeader` | `Object` | Конфигурация для "богатого" заголовка. |
| `closeOnItemClick` | `Boolean` | Закрывать ли меню при клике на пункт. По умолчанию `true`. |

### MenuItemOptions

Объект с настройками для пункта меню.

| Свойство | Тип | Описание |
|---|---|---|
| `id` | `String` | Уникальный идентификатор пункта. |
| `sectionCode` | `String` | Код раздела, к которому относится пункт. |
| `design` | `String` | Дизайн пункта. См. `MenuItemDesign`. |
| `title` | `String` | Основной текст пункта. |
| `subtitle` | `String` | Дополнительный текст (подсказка). |
| `onClick` | `Function` | Обработчик клика по пункту. |
| `isSelected` | `Boolean` | Выделен ли пункт как выбранный. |
| `icon` | `String` | CSS-класс иконки. |
| `svg` | `SVGElement` | SVG-элемент для иконки. |
| `subMenu` | `MenuOptions` | Конфигурация для вложенного меню. |
| `isLocked` | `Boolean` | Отображать ли иконку замка (для платных функций). |
| `badgeText` | `Object` | Настройки для текстового бейджа. `{ title: string, color: string }` |
| `counter` | `CounterOptions` | Настройки для счетчика `ui.cnt`. |
| `extraIcon` | `Object` | Настройки для дополнительной иконки. |
| `uiButtonOptions`| `ButtonOptions` | Настройки для рендера кнопки `ui.buttons`. |

### MenuSectionOptions

Объект с настройками для раздела меню.

| Свойство | Тип | Описание |
|---|---|---|
| `code` | `String` | Уникальный код раздела. |
| `title` | `String` | Заголовок раздела. |
| `design` | `String` | Дизайн раздела. См. `MenuSectionDesign`. |

### Rich Header

Объект `richHeader` в `MenuOptions` для настройки кастомного заголовка.

| Свойство | Тип | Описание |
|---|---|---|
| `title` | `String` | Заголовок. |
| `subtitle` | `String` | Подзаголовок. |
| `icon` | `String` | CSS-класс иконки. |
| `design` | `String` | Дизайн. См. `MenuRichHeaderDesign`. |
| `onClick` | `Function` | Обработчик клика по заголовку. |

## Константы дизайна

### MenuItemDesign

Определяет внешний вид пункта меню.

| Константа | Значение | Описание |
|---|---|---|
| `Default` | `'default'` | Стандартный вид |
| `Accent1` | `'accent-1'` | Акцентный (синий) |
| `Accent2` | `'accent-2'` | Акцентный (зеленый) |
| `Alert` | `'alert'` | Для опасных действий (красный) |
| `Copilot` | `'copilot'` | Стиль для AI-функций |
| `Disabled` | `'disabled'` | Неактивное состояние |

### MenuSectionDesign

Определяет внешний вид разделителя секции.

| Константа | Значение | Описание |
|---|---|---|
| `Default` | `'default'` | Стандартный разделитель |
| `Accent` | `'accent'` | Акцентный разделитель |

### MenuRichHeaderDesign

Определяет дизайн "богатого" заголовка.

| Константа | Значение | Описание |
|---|---|---|
| `Default` | `'default'` | Стандартный дизайн |
| `Copilot` | `'copilot'` | Стиль для AI-функций |

## Примеры использования

### Базовое меню

```javascript
const menu = new Menu({
    bindElement: document.getElementById('menu-button'),
    items: [
        {
            id: 'profile',
            title: 'Профиль',
            onClick: () => console.log('Профиль'),
        },
        {
            id: 'settings',
            title: 'Настройки',
            onClick: () => console.log('Настройки'),
        },
        null, // Рендерится как разделитель
        {
            id: 'logout',
            title: 'Выйти',
            design: MenuItemDesign.Alert,
            onClick: () => console.log('Выйти'),
        },
    ],
});

menu.show();
```

### Меню с секциями и подменю

```javascript
const menu = new Menu({
    bindElement: document.getElementById('menu-button'),
    sections: [
        { code: 'main', title: 'Основное' },
        { code: 'extra', title: 'Дополнительно', design: MenuSectionDesign.Accent },
    ],
    items: [
        {
            sectionCode: 'main',
            id: 'edit',
            title: 'Редактировать',
            icon: 'ui-icon-set --pencil-40',
        },
        {
            sectionCode: 'main',
            id: 'copy',
            title: 'Копировать',
            icon: 'ui-icon-set --copy-2',
            subMenu: {
                closeOnItemClick: true,
                items: [
                    { id: 'copy-link', title: 'Копировать ссылку' },
                    { id: 'copy-text', title: 'Копировать текст' },
                ],
            },
        },
        {
            sectionCode: 'extra',
            id: 'export',
            title: 'Экспорт',
            subtitle: 'Сохранить в файл',
        },
    ],
});

menu.show();
```