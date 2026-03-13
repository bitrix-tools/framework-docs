# Icon Set (BIcon)

## Описание

Компонент `BIcon` предназначен для отображения иконок из стандартного набора иконок Bitrix. Он позволяет легко вставлять иконки, настраивать их размер, цвет и поведение при наведении.

**Расположение:** `/ui/install/js/ui/icon-set/api/vue/`

## Импорт компонента

```javascript
import { BIcon, Set, Outline, Solid, SmallOutline } from 'ui.icon-set.api.vue';
```

## Основные свойства

### name

Определяет, какая иконка будет отображена. Имя иконки следует брать из одного из экспортируемых наборов.

**Тип:** `String`
**Обязательное:** `true`

Иконки сгруппированы в наборы:
- `Set`: Основной набор иконок.
- `Outline`: Контурные иконки.
- `Solid`: Залитые иконки.
- `SmallOutline`: Маленькие контурные иконки.

### color

Задает цвет иконки.

**Тип:** `String`
**По умолчанию:** `null`

### size

Устанавливает размер иконки в пикселях.

**Тип:** `Number`
**По умолчанию:** `null`

### hoverable

При значении `true` добавляет стандартный эффект при наведении курсора.

**Тип:** `Boolean`
**По умолчанию:** `false`

### hoverableAlt

При значении `true` добавляет альтернативный эффект при наведении курсора.

**Тип:** `Boolean`
**По умолчанию:** `false`

### responsive

При значении `true` делает иконку адаптивной, позволяя ей масштабироваться относительно родительского контейнера. Свойство `size` при этом игнорируется.

**Тип:** `Boolean`
**По умолчанию:** `false`

## Примеры использования

### Базовый пример

Этот пример показывает, как отобразить иконку закрытия размером 24px, используя `v-bind` для передачи свойств.

```javascript
import { BIcon, Set } from 'ui.icon-set.api.vue';

export const MyComponent = {
	components: { BIcon },
	computed: {
		closeIconProps(): { name: string, size: number } {
			return {
				name: Set.CROSS_40,
				size: 24,
			};
		},
	},
	template: `
		<BIcon v-bind="closeIconProps" />
	`,
};
```

### Иконка с цветом и эффектом наведения

В этом примере иконка настраивается через вычисляемое свойство, которое включает цвет, размер и эффект при наведении.

```javascript
import { BIcon, Outline } from 'ui.icon-set.api.vue';

export const MyComponentWithIcon = {
	components: { BIcon },
	computed: {
		iconProps(): { name: string, color: string, size: number, hoverable: boolean } {
			return {
				name: Outline.CHECK,
				color: '#2FC6F6',
				size: 32,
				hoverable: true,
			};
		},
	},
	template: `
		<BIcon v-bind="iconProps" />
	`,
};
```

## Экспортируемые модули

- `BIcon`: Основной Vue-компонент для отображения иконок.
- `Set`: Объект с константами для основного набора иконок.
- `Outline`: Объект с константами для контурных иконок.
- `Solid`: Объект с константами для залитых иконок.
- `SmallOutline`: Объект с константами для маленьких контурных иконок.
