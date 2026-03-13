# Label

## Описание

Компонент `Label` используется для отображения меток (лейблов) с текстом и/или иконкой. Поддерживает различные размеры, стили, цветовые схемы и может содержать как текст, так и иконки.

**Расположение:** `/ui/install/js/ui/system/label/src`

## Импорт компонента

```javascript
import { Label, LabelStyle, LabelSize, LabelIcon } from 'ui.system.label.vue';
```

## Основные свойства

### size (размер)

Определяет размер компонента.

**Тип:** `String`  
**По умолчанию:** `LabelSize.Md`

| Константа | Значение | Описание |
|-----------|----------|----------|
| `LabelSize.Lg` | `'lg'` | Большой размер |
| `LabelSize.Md` | `'md'` | Средний размер |
| `LabelSize.Sm` | `'sm'` | Малый размер |

### style (стиль)

Определяет цветовую схему и визуальный стиль компонента.

**Тип:** `String`  
**По умолчанию:** `LabelStyle.Primary`

| Константа | Значение | Описание |
|-----------|----------|----------|
| `LabelStyle.Primary` | `'primary'` | Основной стиль (синий) |
| `LabelStyle.Secondary` | `'secondary'` | Второстепенный стиль (серый) |
| `LabelStyle.Success` | `'success'` | Стиль успеха (зеленый) |
| `LabelStyle.Danger` | `'danger'` | Стиль опасности (красный) |
| `LabelStyle.Warning` | `'warning'` | Стиль предупреждения (оранжевый) |
| `LabelStyle.Info` | `'info'` | Информационный стиль (голубой) |
| `LabelStyle.Light` | `'light'` | Светлый стиль |
| `LabelStyle.Dark` | `'dark'` | Темный стиль |

### icon (иконка)

Определяет иконку, отображаемую в компоненте.

**Тип:** `String`  
**По умолчанию:** `null`

Константы иконок доступны через `LabelIcon`:

| Константа | Значение | Описание |
|-----------|----------|----------|
| `LabelIcon.Check` | `'check'` | Иконка галочки |
| `LabelIcon.Cross` | `'cross'` | Иконка крестика |
| `LabelIcon.Info` | `'info'` | Информационная иконка |
| `LabelIcon.Warning` | `'warning'` | Иконка предупреждения |

### text (текст)

Текст внутри компонента.

**Тип:** `String`  
**По умолчанию:** `''`

## Примеры использования

### Базовый пример

```vue
<Label
  text="Метка"
  :size="LabelSize.Md"
  :style="LabelStyle.Primary"
/>
```

### С иконкой

```vue
<Label
  text="Успешно"
  :icon="LabelIcon.Check"
  :style="LabelStyle.Success"
/>
```

### Различные стили

```vue
<!-- Primary -->
<Label
  text="Основной"
  :style="LabelStyle.Primary"
/>

<!-- Success -->
<Label
  text="Успех"
  :style="LabelStyle.Success"
/>

<!-- Warning -->
<Label
  text="Предупреждение"
  :style="LabelStyle.Warning"
/>

<!-- Danger -->
<Label
  text="Ошибка"
  :style="LabelStyle.Danger"
/>
```

### Различные размеры

```vue
<Label text="Малый" :size="LabelSize.Sm" />
<Label text="Средний" :size="LabelSize.Md" />
<Label text="Большой" :size="LabelSize.Lg" />
```

### Комбинация параметров

```vue
<Label
  text="Важно"
  :icon="LabelIcon.Warning"
  :size="LabelSize.Lg"
  :style="LabelStyle.Warning"
/>
```

## TypeScript типы

```typescript
import type { LabelProps } from 'ui.system.label';
```

### LabelProps

Интерфейс свойств компонента Label.

## Экспортируемые модули

- `Vue` - Vue компоненты
- `Label` - основной компонент
- `LabelStyle` - константы стилей
- `LabelSize` - константы размеров
- `LabelIcon` - константы иконок
- `LabelProps` - TypeScript тип свойств

## Использование в проекте

Компонент автоматически регистрируется при подключении extension'а `ui.system.label` и доступен для использования в Vue-приложениях через импорт из `ui.system.label.vue`.