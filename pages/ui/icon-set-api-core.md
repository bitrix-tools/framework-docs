# Icon

## Описание

Расширение `ui.icon-set.api.core` предоставляет стандартизированный набор иконок для использования в интерфейсе. Оно позволяет создавать и настраивать иконки с помощью класса `Icon`.

**Расположение:** `/ui/install/js/ui/icon-set/api/core/src`

## Импорт

```javascript
import { Icon, Actions, Social, Main, IconHoverMode } from 'ui.icon-set.api.core';
```

## Основные свойства

Для создания иконки используется класс `Icon` с объектом опций `IconOptions`.

```javascript
new Icon(options: IconOptions): HTMLElement;
```

### icon

Определяет, какая иконка будет отображена. Значение должно быть одной из констант, экспортируемых из наборов иконок.

**Тип:** `String`
**Обязательное свойство.**

### size

Задает размер иконки в пикселях.

**Тип:** `Number`
**По умолчанию:** `null` (используется размер по умолчанию)

### color

Устанавливает цвет иконки.

**Тип:** `String`
**По умолчанию:** `null` (используется цвет по умолчанию)

### hoverMode

Определяет поведение иконки при наведении курсора.

**Тип:** `String`
**По умолчанию:** `null`

| Константа | Значение | Описание |
|-----------|----------|----------|
| `IconHoverMode.DEFAULT` | `'default'` | Стандартное поведение при наведении |
| `IconHoverMode.ALT` | `'alt'` | Альтернативное поведение при наведении |

### responsive

Определяет, будет ли иконка адаптивной.

**Тип:** `Boolean`
**По умолчанию:** `false`

## Примеры использования

### Базовый пример

Создание иконки "карандаш" из набора `Actions` и добавление ее на страницу.

```javascript
import { Icon, Actions } from 'ui.icon-set.api.core';

const pencilIcon = new Icon({
  icon: Actions.PENCIL_DRAW,
}).render();

document.body.appendChild(pencilIcon);
```

### Иконка с размером и цветом

Создание иконки "настройки" размером 24px и определенным цветом.

```javascript
import { Icon, Actions } from 'ui.icon-set.api.core';

const settingsIcon = new Icon({
  icon: Actions.SETTINGS_1,
  size: 24,
  color: '#525C69',
}).render();

document.body.appendChild(settingsIcon);
```

## TypeScript типы

```typescript
import type { IconOptions } from 'ui.icon-set.api.core';
```

### IconOptions

Интерфейс для объекта опций, передаваемого в конструктор `Icon`.

```typescript
type IconOptions = {
	icon: string,
	size?: number,
	color?: string,
	hoverMode?: IconHoverMode,
	responsive?: boolean,
};
```

## Экспортируемые модули

- `Icon`: Основной класс для создания иконок.
- `IconHoverMode`: Объект с константами для режимов наведения.
- `IconOptions`: TypeScript-тип для опций иконки.
- **Наборы иконок:**
    - `Actions`
    - `Social`
    - `Main`
    - `ContactCenter`
    - `CRM`
    - `Editor`
    - `Special`
    - `Animated`
    - `Outline`
    - `Solid`
    - `Disk`
    - `DiskCompact`
    - `SmallOutline`
