# Input

## Описание

Компонент `Input` используется для создания текстовых полей ввода с поддержкой различных размеров и стилей оформления. Компонент предоставляет единообразный интерфейс для работы с пользовательским вводом в рамках UI системы Bitrix.

**Расположение:** `/ui/install/js/ui/system/input/src`

## Импорт компонента

```javascript
import { Input, InputSize, InputDesign } from 'ui.system.input.vue';
```

## Основные константы

### InputSize (размер)

Определяет размер поля ввода.

**Тип:** `String`

| Константа | Значение | Описание |
|-----------|----------|----------|
| `InputSize.Lg` | `'lg'` | Большой размер |
| `InputSize.Md` | `'md'` | Средний размер |
| `InputSize.Sm` | `'sm'` | Малый размер |
| `InputSize.Xs` | `'xs'` | Очень малый размер |

### InputDesign (дизайн)

Определяет стиль оформления поля ввода.

**Тип:** `String`

| Константа | Значение | Описание |
|-----------|----------|----------|
| `InputDesign.Default` | `'default'` | Стандартный стиль |
| `InputDesign.Primary` | `'primary'` | Основной стиль |
| `InputDesign.Success` | `'success'` | Стиль успеха (зеленый) |
| `InputDesign.Warning` | `'warning'` | Стиль предупреждения (оранжевый) |
| `InputDesign.Danger` | `'danger'` | Стиль ошибки (красный) |

## Примеры использования

### Базовый пример

```vue
<Input
  v-model="value"
  :size="InputSize.Md"
  :design="InputDesign.Default"
  placeholder="Введите текст"
/>
```

### Различные размеры

```vue
<Input v-model="value1" :size="InputSize.Xs" placeholder="XS размер" />
<Input v-model="value2" :size="InputSize.Sm" placeholder="SM размер" />
<Input v-model="value3" :size="InputSize.Md" placeholder="MD размер" />
<Input v-model="value4" :size="InputSize.Lg" placeholder="LG размер" />
```

### Различные стили

```vue
<!-- Default -->
<Input
  v-model="defaultValue"
  :design="InputDesign.Default"
  placeholder="Обычное поле"
/>

<!-- Success -->
<Input
  v-model="successValue"
  :design="InputDesign.Success"
  placeholder="Успешная валидация"
/>

<!-- Warning -->
<Input
  v-model="warningValue"
  :design="InputDesign.Warning"
  placeholder="Предупреждение"
/>

<!-- Danger -->
<Input
  v-model="errorValue"
  :design="InputDesign.Danger"
  placeholder="Ошибка валидации"
/>
```

## Экспортируемые модули

- `Vue` - Vue компоненты для работы с полями ввода
- `InputSize` - константы размеров
- `InputDesign` - константы стилей оформления

## Интеграция

Компонент является частью UI системы Bitrix и следует общим принципам дизайна платформы. Для использования необходимо подключить расширение `ui.system.input` через систему управления расширениями Bitrix.

```php
\Bitrix\Main\UI\Extension::load('ui.system.input');
```