# Typography

## Описание

Расширение `ui.system.typography` предоставляет компоненты для работы с заголовками и текстом. Оно включает в себя как нативные JavaScript-классы для создания HTML-элементов, так и Vue-компоненты для декларативного использования.

**Расположение:** `/ui/install/js/ui/system/typography/src`

## Импорт

### JavaScript

```javascript
import { Headline, Text } from 'ui.system.typography';
```

### Vue

```javascript
import { Headline, Text } from 'ui.system.typography.vue';
```

---

# Headline (Заголовок)

Компонент для отображения заголовков разных уровней.

## Основные свойства

### size (размер)

Определяет размер заголовка.

**Тип:** `String`
**По умолчанию:** `'md'`

| Значение | Описание |
|----------|----------|
| `'xl'`   | Очень большой |
| `'lg'`   | Большой |
| `'md'`   | Средний |
| `'sm'`   | Малый |
| `'xs'`   | Очень малый |

### accent (акцент)

Выделяет заголовок акцентным цветом.

**Тип:** `Boolean`
**По умолчанию:** `false`

### align (выравнивание)

Определяет горизонтальное выравнивание текста.

**Тип:** `String`
**По умолчанию:** `'left'`
**Варианты:** `'left'`, `'center'`, `'right'`, `'justify'`

### transform (трансформация)

Определяет регистр текста.

**Тип:** `String`
**По умолчанию:** `null`
**Варианты:** `'uppercase'`, `'lowercase'`, `'capitalize'`

### wrap (перенос)

Управляет переносом длинного текста.

**Тип:** `String`
**По умолчанию:** `null`
**Варианты:** `'truncate'` (обрезает с многоточием), `'break-words'` (переносит по словам), `'break-all'` (переносит по символам)

### tag (HTML-тег)

Позволяет задать собственный HTML-тег для элемента.

**Тип:** `String`
**По умолчанию:** `'div'`

## Примеры использования

### JavaScript

```javascript
import { Headline } from 'ui.system.typography';

const title = Headline.render('Мой заголовок', {
  size: 'lg',
  accent: true,
  align: 'center',
});

document.body.append(title);
```

### Vue

```vue
import { Headline } from 'ui.system.typography.vue';

export const MyComponent = {
	components: {
		Headline,
	},
	template: `
		<div>
			<Headline size="lg" class="form-title --padding">
				Мой заголовок
			</Headline>
		</div>
	`,
};
```

---

# Text (Текст)

Компонент для отображения текстовых блоков.

## Основные свойства

### size (размер)

Определяет размер текста.

**Тип:** `String`
**По умолчанию:** `'md'`

| Значение | Описание |
|----------|----------|
| `'2xl'`  | Наибольший |
| `'xl'`   | Очень большой |
| `'lg'`   | Большой |
| `'md'`   | Средний |
| `'sm'`   | Малый |
| `'xs'`   | Очень малый |
| `'2xs'`  | Наименьший |
| `'3xs'`  | Самый маленький |
| `'4xs'`  | Микроскопический |

### accent (акцент)

Выделяет текст акцентным цветом.

**Тип:** `Boolean`
**По умолчанию:** `false`

### align (выравнивание)

Определяет горизонтальное выравнивание текста.

**Тип:** `String`
**По умолчанию:** `'left'`
**Варианты:** `'left'`, `'center'`, `'right'`, `'justify'`

### transform (трансформация)

Определяет регистр текста.

**Тип:** `String`
**По умолчанию:** `null`
**Варианты:** `'uppercase'`, `'lowercase'`, `'capitalize'`

### wrap (перенос)

Управляет переносом длинного текста.

**Тип:** `String`
**По умолчанию:** `null`
**Варианты:** `'truncate'`, `'break-words'`, `'break-all'`

### tag (HTML-тег)

Позволяет задать собственный HTML-тег для элемента.

**Тип:** `String`
**По умолчанию:** `'span'`

## Примеры использования

### JavaScript

```javascript
import { Text } from 'ui.system.typography';

const paragraph = Text.render('Это простой текстовый блок.', {
  size: 'md',
  align: 'justify',
});

document.body.append(paragraph);
```

### Vue

```vue
import { Text } from 'ui.system.typography.vue';

export const MyComponent = {
components: {
    Text,
},
template: `
  <Text
      size="md"
      align="justify"
  >
    Это простой текстовый блок.
  </Text>
`,
};
```

## TypeScript типы

Для указания типов опций можно использовать следующие импорты:

```typescript
import type { DisplayTitleOptions, TextOptions } from 'ui.system.typography';
```

### DisplayTitleOptions

Интерфейс свойств для компонента `Headline`.

### TextOptions

Интерфейс свойств для компонента `Text`.

## Экспортируемые модули

- `Headline`: JS-класс и Vue-компонент для заголовков.
- `Text`: JS-класс и Vue-компонент для текста.
- `Vue`: Объект, содержащий все Vue-компоненты (`Vue.Headline`, `Vue.Text`).