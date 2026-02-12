# BMenu

## Описание

Компонент `BMenu` — это декларативная Vue-обёртка над системным JavaScript-модулем `ui.system.menu`. Он упрощает создание и управление выпадающими меню в Vue-приложениях.

Основной принцип работы заключается в том, что меню создаётся и отображается при монтировании компонента (`mounted`) и уничтожается при его размонтировании (`unmounted`). Поэтому для управления видимостью меню рекомендуется использовать директиву `v-if`.

**Расположение:** `/ui/install/js/ui/system/menu/vue/src`

## Импорт компонента

```javascript
import { BMenu } from 'ui.system.menu.vue';
import type { MenuOptions, MenuItem } from 'ui.system.menu';
```

## Основные свойства

### id

Уникальный идентификатор меню.

**Тип:** `String`
**По умолчанию:** `ui-vue3-menu-` со случайной строкой.

### options

Основной объект с настройками меню, который передаётся в `ui.system.menu`.

**Тип:** `MenuOptions`
**Обязательный:** `true`

#### Структура `MenuOptions`

| Свойство | Тип | Описание |
|---|---|---|
| `bindElement` | `HTMLElement` | **Обязательно.** Элемент, к которому будет привязано меню. |
| `items` | `MenuItem[]` | Массив объектов, описывающих пункты меню. |
| `offsetLeft` | `Number` | Смещение меню по горизонтали относительно `bindElement`. |
| `offsetTop` | `Number` | Смещение меню по вертикали относительно `bindElement`. |
| `angle` | `Boolean` \| `Object` | Отображать ли "стрелку" у меню. По умолчанию `false`. |
| `fixed` | `Boolean` | Фиксированное позиционирование меню. По умолчанию `false`. |
| `cacheable` | `Boolean` | Следует ли кешировать меню. Для Vue-компонента по умолчанию `false`. |

#### Структура `MenuItem`

| Свойство | Тип | Описание |
|---|---|---|
| `title` | `String` | Текст пункта меню. |
| `onClick` | `Function` | Обработчик клика по пункту меню. |
| `delimiter` | `Boolean` | Если `true`, пункт будет отображаться как разделитель. |
| `href` | `String` | URL для создания ссылки. |
| `target` | `String` | Атрибут `target` для ссылки (например, `_blank`). |
| `disabled` | `Boolean` | Делает пункт меню неактивным. |

## События

### close

Событие генерируется при закрытии меню (например, при клике вне его области). Используется для управления состоянием, которое контролирует директиву `v-if`.

## Пример использования

```javascript
import { BMenu } from 'ui.system.menu.vue';
import type { MenuOptions } from 'ui.system.menu';

// @vue/component
export const MyComponentWithMenu = {
	name: 'MyComponentWithMenu',
	components: {
		BMenu,
	},
	data()
	{
		return {
			isMenuShown: false,
		};
	},
	computed: {
		menuOptions(): MenuOptions
		{
			return {
				bindElement: this.$refs.myButton,
				items: [
					{
						title: 'Пункт 1',
						onClick: () => console.log('Нажат пункт 1'),
					},
					{
						title: 'Пункт 2',
						onClick: () => console.log('Нажат пункт 2'),
					},
					{
						delimiter: true,
					},
					{
						title: 'Ссылка на сайт',
						href: 'https://bitrix24.ru',
						target: '_blank',
					},
				],
			};
		},
	},
	template: `
		<div>
			<button ref="myButton" @click="isMenuShown = true">Показать меню</button>
			<BMenu
				v-if="isMenuShown"
				:options="menuOptions"
				@close="isMenuShown = false"
			/>
		</div>
	`,
};
```

## TypeScript типы

Для работы с типами импортируйте их из `ui.system.menu`.

```typescript
import type { MenuOptions, MenuItem } from 'ui.system.menu';
```

### MenuOptions

Интерфейс объекта настроек для компонента `BMenu`.

### MenuItem

Интерфейс для объекта, описывающего один пункт меню.

## Экспортируемые модули

- `BMenu` — основной Vue-компонент.
- `Menu` — базовый JavaScript-класс меню (реэкспорт из `ui.system.menu`).
- `MenuOptions` — TypeScript-тип для опций меню.
- `MenuItem` — TypeScript-тип для элемента меню.
- `MenuEvents` — TypeScript-тип для событий меню.
