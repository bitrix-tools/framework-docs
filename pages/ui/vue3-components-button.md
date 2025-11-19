# Button

## Описание

Компонент `Button` представляет собой Vue 3 обёртку для UI-кнопок Bitrix. Поддерживает различные размеры, состояния, цветовые схемы, иконки, счётчики и другие визуальные эффекты.

**Расположение:** `/ui/install/js/ui/vue3/components/button/src`

## Импорт компонента

```javascript
import { 
  Button, 
  ButtonColor, 
  ButtonSize, 
  ButtonIcon, 
  ButtonState,
  AirButtonStyle,
  ButtonCounterColor,
  ButtonTag
} from 'ui.vue3.components.button';
```

## Основные свойства

### text (текст)

Текст на кнопке.

**Тип:** `String`  
**По умолчанию:** `''`

### size (размер)

Определяет размер кнопки.

**Тип:** `String`  
**По умолчанию:** `undefined`

Доступные значения из `ButtonSize`:
- `ButtonSize.EXTRA_SMALL` - очень малый размер
- `ButtonSize.SMALL` - малый размер
- `ButtonSize.MEDIUM` - средний размер
- `ButtonSize.LARGE` - большой размер

### state (состояние)

Определяет визуальное состояние кнопки.

**Тип:** `String`  
**По умолчанию:** `undefined`

Доступные значения из `ButtonState`:
- `ButtonState.HOVER` - состояние наведения
- `ButtonState.ACTIVE` - активное состояние
- `ButtonState.DISABLED` - отключенное состояние
- `ButtonState.WAITING` - состояние ожидания

### style (стиль)

Определяет цветовую схему кнопки в стиле Air Design.

**Тип:** `String`  
**По умолчанию:** `null`

Доступные значения из `AirButtonStyle`.

### disabled (отключена)

Отключает кнопку.

**Тип:** `Boolean`  
**По умолчанию:** `false`

### loading (загрузка)

Переводит кнопку в состояние загрузки.

**Тип:** `Boolean`  
**По умолчанию:** `false`

### dropdown (выпадающее меню)

Добавляет индикатор выпадающего меню.

**Тип:** `Boolean`  
**По умолчанию:** `false`

### wide (широкая)

Делает кнопку на всю ширину контейнера.

**Тип:** `Boolean`  
**По умолчанию:** `false`

### collapsed (свёрнутая)

Показывает только иконку, скрывая текст.

**Тип:** `Boolean`  
**По умолчанию:** `false`

### noCaps (без капитализации)

Отключает автоматическое преобразование текста в верхний регистр.

**Тип:** `Boolean`  
**По умолчанию:** `true`

## Иконки

### leftIcon

Иконка слева от текста.

**Тип:** `String`  
**По умолчанию:** `null`

Принимает значения из:
- `ButtonIcon` - стандартные иконки кнопок
- `IconSet` (из `ui.icon-set.api.core`) - набор иконок
- `Outline` (из `ui.icon-set.api.core`) - контурные иконки

### rightIcon

Иконка справа от текста.

**Тип:** `String`  
**По умолчанию:** `null`

### collapsedIcon

Иконка для свёрнутого состояния кнопки.

**Тип:** `String`  
**По умолчанию:** `null`

## Счётчики

### leftCounterValue

Числовое значение для счётчика слева.

**Тип:** `Number`  
**По умолчанию:** `0`

### leftCounterColor

Цвет счётчика слева.

**Тип:** `String`  
**По умолчанию:** `null`

Доступные значения из `ButtonCounterColor`.

### rightCounterValue

Числовое значение для счётчика справа.

**Тип:** `Number`  
**По умолчанию:** `0`

### rightCounterColor

Цвет счётчика справа.

**Тип:** `String`  
**По умолчанию:** `null`

## Дополнительные свойства

### type

HTML тип кнопки.

**Тип:** `String`  
**По умолчанию:** `'button'`

Допустимые значения: `'button'`, `'submit'`, `'reset'`

### link

URL для создания кнопки-ссылки.

**Тип:** `String`  
**По умолчанию:** `''`

### tag

HTML тег для рендеринга кнопки.

**Тип:** `String`  
**По умолчанию:** `''`

Доступные значения из `ButtonTag`.

### dataset

HTML data-атрибуты для кнопки.

**Тип:** `Object`  
**По умолчанию:** `{}`

### removeLeftCorners

Убирает скругление левых углов.

**Тип:** `Boolean`  
**По умолчанию:** `false`

### removeRightCorners

Убирает скругление правых углов.

**Тип:** `Boolean`  
**По умолчанию:** `false`

### shimmer

Включает эффект мерцания (shimmer effect).

**Тип:** `Boolean`  
**По умолчанию:** `false`

## События

### @click

Срабатывает при клике на кнопку.

```vue
<Button @click="handleClick" />
```

### @clickSecondary

Срабатывает при вторичном клике.

```vue
<Button @clickSecondary="handleSecondaryClick" />
```

## Примеры использования

### Базовый пример

```vue
<Button 
  text="Сохранить"
  :size="ButtonSize.MEDIUM"
  @click="save"
/>
```

### Кнопка с иконкой

```vue
<Button 
  text="Добавить"
  :leftIcon="ButtonIcon.ADD"
  @click="add"
/>
```

### Кнопка в состоянии загрузки

```vue
<Button 
  text="Отправка..."
  :loading="isLoading"
  :disabled="isLoading"
/>
```

### Кнопка со счётчиками

```vue
<Button 
  text="Уведомления"
  :leftCounterValue="5"
  :leftCounterColor="ButtonCounterColor.SUCCESS"
/>
```

### Широкая кнопка с эффектом мерцания

```vue
<Button 
  text="Загрузка данных"
  :wide="true"
  :shimmer="true"
/>
```

### Свёрнутая кнопка (только иконка)

```vue
<Button 
  :collapsed="true"
  :collapsedIcon="ButtonIcon.SETTINGS"
  @click="openSettings"
/>
```

### Кнопка-ссылка

```vue
<Button 
  text="Перейти"
  link="/dashboard"
  :tag="ButtonTag.LINK"
/>
```

### Кнопка с выпадающим меню

```vue
<Button 
  text="Действия"
  :dropdown="true"
  @click="toggleMenu"
/>
```

### Группа кнопок без скругления

```vue
<Button 
  text="Первая"
  :removeRightCorners="true"
/>
<Button 
  text="Вторая"
  :removeLeftCorners="true"
  :removeRightCorners="true"
/>
<Button 
  text="Третья"
  :removeLeftCorners="true"
/>
```

## Экспортируемые модули

- `Button` - основной Vue-компонент кнопки
- `ButtonColor` - константы цветов кнопок
- `ButtonSize` - константы размеров кнопок
- `ButtonIcon` - константы стандартных иконок
- `ButtonState` - константы состояний кнопок
- `AirButtonStyle` - константы стилей Air Design
- `ButtonCounterColor` - константы цветов счётчиков
- `ButtonTag` - константы HTML-тегов для кнопок