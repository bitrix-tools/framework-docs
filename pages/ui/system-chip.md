# Chip

## Описание

Компонент `Chip` используется для отображения небольших блоков информации, таких как теги или категории. Поддерживает различные размеры, цветовые схемы, скругление углов и может содержать текст.

**Расположение:** `/ui/install/js/ui/system/chip/src`

## Импорт компонента

```javascript
import { Chip, ChipSize, ChipDesign } from 'ui.system.chip.vue';
```

## Основные свойства

### size (размер)

Определяет размер компонента.

**Тип:** `String`  
**По умолчанию:** `ChipSize.Lg`

| Константа | Значение | Описание | Высота |
|-----------|----------|----------|--------|
| `ChipSize.Lg` | `'lg'` | Большой размер | 32px |
| `ChipSize.Md` | `'md'` | Средний размер | 28px |
| `ChipSize.Sm` | `'sm'` | Малый размер | 24px |
| `ChipSize.Xs` | `'xs'` | Очень малый размер | 20px |

### design (дизайн)

Определяет цветовую схему и стиль компонента.

**Тип:** `String`  
**По умолчанию:** `ChipDesign.Filled`

| Константа | Значение | Описание |
|-----------|----------|----------|
| `ChipDesign.Filled` | `'filled'` | Заливка акцентным цветом, белый текст |
| `ChipDesign.Outline` | `'outline'` | Серая обводка, серый текст |
| `ChipDesign.OutlineAccent` | `'outline-accent'` | Синяя обводка, синий текст |
| `ChipDesign.OutlineSuccess` | `'outline-success'` | Зеленая обводка, зеленый текст |
| `ChipDesign.OutlineAlert` | `'outline-alert'` | Красная обводка, красный текст |
| `ChipDesign.OutlineWarning` | `'outline-warning'` | Оранжевая обводка, оранжевый текст |
| `ChipDesign.OutlineNoAccent` | `'outline-no-accent'` | Серая обводка без акцента |
| `ChipDesign.Shadow` | `'shadow'` | С тенью, синяя иконка |
| `ChipDesign.ShadowAccent` | `'shadow-accent'` | С тенью, синий текст и обводка |
| `ChipDesign.ShadowNoAccent` | `'shadow-no-accent'` | С тенью, нейтральный стиль |
| `ChipDesign.ShadowDisabled` | `'shadow-disabled'` | С тенью, состояние disabled |

### rounded (скругление)

Определяет форму границ компонента.

**Тип:** `Boolean`  
**По умолчанию:** `false`

| Значение | Описание |
|----------|----------|
| `false` | Стандартное скругление |
| `true` | Полное скругление |

### text (текст)

Текст внутри компонента.

**Тип:** `String`  
**По умолчанию:** `''`

## Примеры использования

### Базовый пример

```vue
<Chip
  text="Метка"
  :size="ChipSize.Lg"
  :design="ChipDesign.Filled"
/>
```

### С обводкой и скруглением

```vue
<Chip
  text="Категория"
  :size="ChipSize.Md"
  :design="ChipDesign.Outline"
  :rounded="true"
/>
```

### Различные состояния

```vue
<!-- Success -->
<Chip
  text="Активен"
  :design="ChipDesign.OutlineSuccess"
/>

<!-- Warning -->
<Chip
  text="Внимание"
  :design="ChipDesign.OutlineWarning"
/>

<!-- Alert -->
<Chip
  text="Ошибка"
  :design="ChipDesign.OutlineAlert"
/>
```

### Различные размеры

```vue
<Chip text="XS" :size="ChipSize.Xs" />
<Chip text="SM" :size="ChipSize.Sm" />
<Chip text="MD" :size="ChipSize.Md" />
<Chip text="LG" :size="ChipSize.Lg" />
```

## TypeScript типы

```typescript
import type { ChipProps, ChipImage } from 'ui.system.chip';
```

### ChipProps

Интерфейс свойств компонента Chip.

### ChipImage

Тип для изображений в компоненте Chip.

## Экспортируемые модули

- `Vue` - Vue компоненты
- `Chip` - основной компонент
- `ChipDesign` - константы дизайна
- `ChipSize` - константы размеров
- `ChipProps` - TypeScript тип свойств
- `ChipImage` - TypeScript тип изображения