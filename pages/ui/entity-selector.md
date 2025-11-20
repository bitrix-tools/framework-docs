# ui.entity-selector

## Описание

Компонент `ui.entity-selector` предоставляет многофункциональный диалог для выбора различных сущностей, таких как пользователи, отделы, элементы CRM, задачи и другие. Он поддерживает одиночный и множественный выбор, поиск, кастомные табы и интеграцию с `TagSelector` для отображения выбранных элементов.

**Расположение:** `/ui/install/js/ui/entity-selector/src`

## Импорт классов

```javascript
import {
	Dialog,
	Item,
	Tab,
	Entity,
	TagSelector
} from 'ui.entity-selector';
```

## Основные классы

### Dialog

Основной класс, который создает и управляет диалогом выбора.

**Конструктор:** `new Dialog(options: DialogOptions)`

#### Ключевые опции `DialogOptions`:

| Опция | Тип | Описание |
|---|---|---|
| `targetNode` | `HTMLElement` | Элемент, к которому будет привязан диалог. |
| `multiple` | `boolean` | `true` для множественного выбора, `false` для одиночного. По умолчанию `true`. |
| `entities` | `EntityOptions[]` | Массив объектов, описывающих сущности для выбора (например, пользователи, отделы). |
| `preselectedItems` | `Array<[string, string | number]>` | Массив для предвыбранных элементов в формате `['entityId', 'itemId']`. |
| `dropdownMode` | `boolean` | Упрощенный режим отображения в виде выпадающего списка. По умолчанию `false`. |
| `enableSearch` | `boolean` | Включает встроенный поиск в диалоге. По умолчанию `false`. |
| `context` | `string` | Контекст для сохранения последних выбранных элементов (например, `CRM_DEAL`). |
| `events` | `object` | Объект с обработчиками событий, например `onSelect`, `onDeselect`. |
| `tagSelector` | `TagSelector` | Экземпляр `TagSelector` для отображения выбранных элементов вне диалога. |

### TagSelector

Компонент для отображения выбранных элементов в виде тегов. Может использоваться как внутри диалога, так и отдельно.

**Конструктор:** `new TagSelector(options: TagSelectorOptions)`

### Item

Представляет один выбираемый элемент в диалоге (например, конкретного пользователя).

### Entity

Определяет тип сущности, доступной для выбора (например, 'user', 'department').

### Tab

Представляет вкладку в диалоге (например, "Последние" или "Поиск").

## Примеры использования

### 1. Простой выбор одного пользователя

Создание диалога для выбора одного пользователя, который открывается по клику на кнопку.

```javascript
import { Dialog } from 'ui.entity-selector';

const button = document.getElementById('select-user-button');
button.addEventListener('click', () => {
	const dialog = new Dialog({
		targetNode: button,
		multiple: false,
		context: 'MY_MODULE_CONTEXT',
		entities: [
			{
				id: 'user',
				options: {
					inviteEmployeeLink: false
				}
			}
		],
		events: {
			'Item:onSelect': (event) => {
				const { item } = event.getData();
				console.log('Выбран пользователь:', item.getTitle());
				dialog.hide();
			}
		}
	});

	dialog.show();
});
```

### 2. Множественный выбор с внешним TagSelector

Создание диалога для выбора нескольких пользователей и отделов с отображением результатов в `TagSelector`.

```javascript
import { Dialog, TagSelector } from 'ui.entity-selector';

// Инициализация TagSelector
const tagSelector = new TagSelector({
	dialogOptions: {
		context: 'MY_MODULE_USERS_DEPARTMENTS',
		entities: [
			{
				id: 'user',
			},
			{
				id: 'department',
				options: {
					selectMode: 'usersAndDepartments'
				}
			}
		],
		preselectedItems: [
			['user', 1], // Предвыбран пользователь с ID 1
			['department', 5] // Предвыбран отдел с ID 5
		],
	}
});

// Рендеринг TagSelector в контейнер
const container = document.getElementById('tag-selector-container');
tagSelector.renderTo(container);

```

### 3. Режим выпадающего списка (Dropdown Mode)

Диалог в компактном режиме, который лучше подходит для встраивания в формы.

```javascript
import { Dialog } from 'ui.entity-selector';

const dropdownNode = document.getElementById('my-dropdown');
dropdownNode.addEventListener('click', () => {
	const dialog = new Dialog({
		targetNode: dropdownNode,
		dropdownMode: true,
		multiple: false,
		entities: [
			{
				id: 'user',
			}
		],
		events: {
			'Item:onSelect': (event) => {
				const { item } = event.getData();
				dropdownNode.innerText = item.getTitle();
			}
		}
	});

	dialog.show();
});
```

## TypeScript типы

Для разработки можно использовать следующие TypeScript-типы:

```typescript
import type {
	DialogOptions,
	ItemOptions,
	EntityOptions,
	TabOptions,
	TagSelectorOptions,
	ItemId
} from 'ui.entity-selector';
```

## Экспортируемые модули

Модуль `ui.entity-selector` экспортирует следующие классы и типы:

- **Классы:**
    - `Dialog`
    - `Item`
    - `Tab`
    - `Entity`
    - `TagSelector`
    - `TagItem`
    - `BaseHeader`, `DefaultHeader`
    - `BaseFooter`, `DefaultFooter`
    - `BaseStub`, `DefaultStub`
- **TypeScript-типы:**
    - `DialogOptions`
    - `ItemOptions`
    - `EntityOptions`
    - `TabOptions`
    - `TagSelectorOptions`
    - `ItemId`
    - и другие.
