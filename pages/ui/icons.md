---
title: Иконки
description: 'Иконки. UI Bitrix Framework: инструменты интерфейса, подключение расширений и примеры использования.'
---

`ui.icon-set` — это библиотека иконок для интерфейсов Bitrix Framework.

Выберите способ вывода иконки по сценарию:

-  `Icon` из `ui.icon-set.api.core` — когда иконку нужно создать из обычного JavaScript, добавить DOM-узел в интерфейс, задать размер, цвет или режим наведения.

-  `BIcon` из `ui.icon-set.api.vue` — когда иконку нужно вывести в Vue-шаблоне и настроить через свойства.

-  HTML-элемент с CSS-классами — когда иконка не требует управления из JavaScript.

Иконки разделены на наборы по назначению и стилю. Для отображения набора нужно подключить соответствующее CSS-расширение с классами и стилями, например `ui.icon-set.outline` для `Outline`.

## Подключить JavaScript-расширение

Если вы подключаете иконки из PHP, загрузите `ui.icon-set.api.core` и CSS-расширение с нужным набором иконок.

```php
\Bitrix\Main\UI\Extension::load([
    'ui.icon-set.api.core',
    'ui.icon-set.outline',
]);
```

Если вы работаете в модульном JavaScript, импортируйте класс `Icon`, объект с именами иконок и CSS-расширение для их отображения.

```js
import { Icon, Outline } from 'ui.icon-set.api.core';
import 'ui.icon-set.outline';
```

Без CSS-расширения с нужным набором иконка не отобразится.

### Создать иконку

Чтобы создать иконку:

1. Импортируйте `Icon` и объект с именами иконок.

2. Создайте экземпляр `Icon` и передайте имя иконки в параметр `icon`.

3. Получите DOM-узел через `render()`.

4. Добавьте полученный узел на страницу.

```js
import { Icon, Outline } from 'ui.icon-set.api.core';
import 'ui.icon-set.outline';

const icon = new Icon({
    icon: Outline.CHECK_L,
    size: 24,
    color: '#2fc6f6',
});

document.getElementById('icon-container').append(icon.render());
```

Метод `render()` возвращает DOM-узел иконки. Если нужно сразу вывести иконку в контейнер, используйте `renderTo(node)`.

```js
import { Icon, Outline } from 'ui.icon-set.api.core';
import 'ui.icon-set.outline';

const icon = new Icon({
    icon: Outline.TRASHCAN,
    size: 20,
});

icon.renderTo(document.getElementById('icon-container'));
```

### Передать параметры

Конструктор `Icon` принимает объект с параметрами иконки.

-  `icon` — обязательное имя иконки. Передавайте значение из экспортируемого набора, например `Outline.CHECK_L`, `Main.PERSON` или `Actions.PENCIL_DRAW`. Список наборов смотрите в разделе [Выбрать набор иконок](#choose-icons-set).

-  `size` — размер иконки в пикселях. Если параметр не передан или передано значение меньше либо равно `0`, используется базовый размер набора: `24px`.

-  `color` — цвет иконки. Можно передать значение дизайн-токена или любой CSS-цвет, например `var(--ui-color-base-70)` или `#525c69`.

-  `hoverMode` — режим изменения цвета при наведении и нажатии. Доступны значения `IconHoverMode.DEFAULT` и `IconHoverMode.ALT`.

-  `responsive` — режим, в котором иконка занимает размер родительского контейнера.

```js
import { Icon, IconHoverMode, Main } from 'ui.icon-set.api.core';
import 'ui.icon-set.main';

const icon = new Icon({
    icon: Main.SEARCH_1,
    size: 32,
    color: 'var(--ui-color-base-60)',
    hoverMode: IconHoverMode.DEFAULT,
});
```

### Выбрать набор иконок {#choose-icons-set}

`ui.icon-set.api.core` экспортирует несколько объектов с именами иконок.

#|
|| **Экспорт** | **CSS-расширение** | **Когда использовать** ||
|| `Actions` | `ui.icon-set.actions` | Действия интерфейса: стрелки, обновление, редактирование, воспроизведение. ||
|| `Main` | `ui.icon-set.main` | Основные продуктовые иконки: пользователи, файлы, коммуникации, CRM, задачи. ||
|| `Social` | `ui.icon-set.social` | Социальные сети и внешние каналы. ||
|| `ContactCenter` | `ui.icon-set.contact-center` | Иконки контакт-центра. ||
|| `CRM` | `ui.icon-set.crm` | CRM-объекты и сценарии. ||
|| `Editor` | `ui.icon-set.editor` | Действия текстового редактора. ||
|| `Animated` | `ui.icon-set.animated` | Анимированные индикаторы. ||
|| `Outline` | `ui.icon-set.outline` | Контурные иконки. ||
|| `Solid` | `ui.icon-set.solid` | Залитые иконки. ||
|| `Disk` | `ui.icon-set.disk` | Цветные иконки типов файлов Диска. ||
|| `DiskCompact` | `ui.icon-set.disk` | Компактные цветные иконки типов файлов Диска. ||
|| `SmallOutline` | `ui.icon-set.small-outline` | Малые контурные иконки. ||
|#


Импортируйте конкретный объект с именами иконок, если заранее знаете, из какого набора берете иконку.

```js
import { Icon, Actions, Disk } from 'ui.icon-set.api.core';
import 'ui.icon-set.actions';
import 'ui.icon-set.disk';

const editIcon = new Icon({
    icon: Actions.PENCIL_DRAW,
});

const pdfIcon = new Icon({
    icon: Disk.PDF,
});
```

У иконок `Disk` и `DiskCompact` фиксированные цвета. Параметр `color` для них не применяется.

### Изменить цвет и поведение

После создания иконки можно изменить цвет, режим наведения и адаптивный размер.

-  `setColor(color)` — меняет цвет иконки.

-  `setHoverMode(hoverMode)` — включает режим наведения. Доступны значения `IconHoverMode.DEFAULT` и `IconHoverMode.ALT`.

-  `setResponsive(responsive)` — переключает адаптивный размер от родительского контейнера.

Методы изменения применяются к уже созданному DOM-узлу. Сначала вызовите `render()` или `renderTo()`, затем меняйте параметры.

```js
import { Icon, IconHoverMode, Outline } from 'ui.icon-set.api.core';
import 'ui.icon-set.outline';

const icon = new Icon({
    icon: Outline.SETTINGS,
    size: 24,
});

document.getElementById('icon-container').append(icon.render());

icon.setColor('var(--ui-color-accent-main-primary)');
icon.setHoverMode(IconHoverMode.ALT);
```

Если вызвать методы изменения до `render()` или `renderTo()`, у экземпляра еще нет элемента на странице.

### Проверить параметры

Для предварительной проверки параметров используйте статические методы `Icon`.

-  `Icon.validateParams(params)` возвращает `null`, если параметры проходят проверку, или строку с текстом ошибки.

-  `Icon.isValid(params)` возвращает `true`, если `validateParams()` вернул `null`.

```js
import { Icon, Outline } from 'ui.icon-set.api.core';

const params = {
    icon: Outline.CHECK_L,
    size: 20,
};

if (Icon.isValid(params))
{
    const icon = new Icon(params);
}
```

Используйте эти методы, если параметры формируются динамически и перед созданием иконки нужно проверить их корректность.

## Использовать Vue-компонент BIcon

Если вы подключаете Vue-компонент из PHP, загрузите `ui.icon-set.api.vue` и CSS-расширение с нужным набором. В примере используется набор `Outline`, поэтому подключается `ui.icon-set.outline`.

```php
\Bitrix\Main\UI\Extension::load([
    'ui.icon-set.api.vue',
    'ui.icon-set.outline',
]);
```

Если вы работаете в модульном JavaScript, импортируйте `BIcon`, объект с именами иконок и CSS-расширение для их отображения.

```js
import { BIcon, Outline } from 'ui.icon-set.api.vue';
import 'ui.icon-set.outline';
```

Основные экспорты `ui.icon-set.api.vue`:

#|
|| **Экспорт** | **Описание** ||
|| `BIcon` | Vue-компонент для вывода иконки. ||
|| `Actions` | Объект с именами иконок действий интерфейса. ||
|| `Main` | Объект с именами основных продуктовых иконок. ||
|| `Social` | Объект с именами иконок социальных сетей и внешних каналов. ||
|| `ContactCenter` | Объект с именами иконок контакт-центра. ||
|| `CRM` | Объект с именами CRM-иконок. ||
|| `Editor` | Объект с именами иконок текстового редактора. ||
|| `Animated` | Объект с именами анимированных индикаторов. ||
|| `Outline` | Объект с именами контурных иконок. ||
|| `Solid` | Объект с именами залитых иконок. ||
|| `Disk` | Объект с именами цветных иконок типов файлов Диска. ||
|| `DiskCompact` | Объект с именами компактных цветных иконок типов файлов Диска. ||
|| `SmallOutline` | Объект с именами малых контурных иконок. ||
|#


Передайте в `name` значение из набора иконок.

```js
import { BIcon, Outline } from 'ui.icon-set.api.vue';
import 'ui.icon-set.outline';

export const ExampleComponent = {
    components: {
        BIcon,
    },
    setup()
    {
        return {
            Outline,
        };
    },
    template: `
        <BIcon
            :name="Outline.CHECK_L"
            :size="24"
            color="var(--ui-color-base-70)"
        />
    `,
};
```

`BIcon` принимает свойства:

#|
|| **Свойство** | **Тип** | **По умолчанию** | **Описание** ||
|| `name` | `String` | Нет | Обязательное имя иконки. Передавайте значение из `Actions`, `Main`, `Social`, `ContactCenter`, `CRM`, `Editor`, `Animated`, `Outline`, `Solid`, `Disk`, `DiskCompact` или `SmallOutline`. ||
|| `size` | `Number` | `null` | Размер иконки в пикселях. Не используется, если `responsive` равен `true`. ||
|| `color` | `String` | `null` | Цвет иконки. Передавайте CSS-цвет или дизайн-токен, например `var(--ui-color-base-70)`. ||
|| `hoverable` | `Boolean` | `false` | Включает основной режим изменения цвета при наведении. ||
|| `hoverableAlt` | `Boolean` | `false` | Включает альтернативный режим изменения цвета при наведении. Если `hoverable` тоже равен `true`, применяется основной режим. ||
|| `responsive` | `Boolean` | `false` | Растягивает иконку до размера родительского контейнера. ||
|#


`ui.icon-set.api.vue` реэкспортирует наборы из `ui.icon-set.api.core`. Для `BIcon` используйте те же CSS-расширения с иконками, что и для класса `Icon`.

`BIcon` настраивается через свойства. Компонент не описывает события и слоты.

{% note tip "" %}

Подробнее о работе с Vue в Bitrix Framework читайте в статье [Vue.js](../advanced/vue.md).

{% endnote %}

## Вывести иконку через HTML

Если иконка не требует управления из JavaScript, можно вывести ее обычным DOM-элементом. Подключите CSS-расширение с нужным набором и добавьте классы `ui-icon-set` и `--<имя иконки>`.

Значение из объекта с именами иконок совпадает с CSS-модификатором без начального `--`.

```html
<div class="ui-icon-set --check-l"></div>
```

Размер и цвет задаются через CSS-переменные.

```html
<div
    class="ui-icon-set --o-person"
    style="--ui-icon-set__icon-size: 32px; --ui-icon-set__icon-color: var(--ui-color-base-70);"
></div>
```

Базовый размер иконки — `24px`, базовый цвет — `var(--ui-color-base-90)`.
