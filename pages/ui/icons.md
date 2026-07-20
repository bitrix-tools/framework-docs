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

## Список иконок

{% cut "Actions" %}

CSS-расширение: `ui.icon-set.actions`.

#|
|| **Иконка** | **Константа** | **Значение** | **HTML-класс** ||
|| ![](./_images/icons-list/actions/arrow-right.svg){width=24px height=24px} | `Actions.ARROW_RIGHT` | `arrow-right` | `ui-icon-set --arrow-right` ||
|| ![](./_images/icons-list/actions/arrow-left.svg){width=24px height=24px} | `Actions.ARROW_LEFT` | `arrow-left` | `ui-icon-set --arrow-left` ||
|| ![](./_images/icons-list/actions/arrow-top.svg){width=24px height=24px} | `Actions.ARROW_TOP` | `arrow-top` | `ui-icon-set --arrow-top` ||
|| ![](./_images/icons-list/actions/arrow-down.svg){width=24px height=24px} | `Actions.ARROW_DOWN` | `arrow-down` | `ui-icon-set --arrow-down` ||
|| ![](./_images/icons-list/actions/chevron-right.svg){width=24px height=24px} | `Actions.CHEVRON_RIGHT` | `chevron-right` | `ui-icon-set --chevron-right` ||
|| ![](./_images/icons-list/actions/chevron-left.svg){width=24px height=24px} | `Actions.CHEVRON_LEFT` | `chevron-left` | `ui-icon-set --chevron-left` ||
|| ![](./_images/icons-list/actions/chevron-up.svg){width=24px height=24px} | `Actions.CHEVRON_UP` | `chevron-up` | `ui-icon-set --chevron-up` ||
|| ![](./_images/icons-list/actions/chevron-down.svg){width=24px height=24px} | `Actions.CHEVRON_DOWN` | `chevron-down` | `ui-icon-set --chevron-down` ||
|| ![](./_images/icons-list/actions/left-semicircular-anticlockwise-arrow-2.svg){width=24px height=24px} | `Actions.LEFT_SEMICIRCULAR_ANTICLOCKWISE_ARROW_2` | `left-semicircular-anticlockwise-arrow-2` | `ui-icon-set --left-semicircular-anticlockwise-arrow-2` ||
|| ![](./_images/icons-list/actions/expand-1.svg){width=24px height=24px} | `Actions.EXPAND_1` | `expand-1` | `ui-icon-set --expand-1` ||
|| ![](./_images/icons-list/actions/expand-diagonal.svg){width=24px height=24px} | `Actions.EXPAND_DIAGONAL` | `expand-diagonal` | `ui-icon-set --expand-diagonal` ||
|| ![](./_images/icons-list/actions/collapse.svg){width=24px height=24px} | `Actions.COLLAPSE` | `collapse` | `ui-icon-set --collapse` ||
|| ![](./_images/icons-list/actions/collapse-diagonal.svg){width=24px height=24px} | `Actions.COLLAPSE_DIAGONAL` | `collapse-diagonal` | `ui-icon-set --collapse-diagonal` ||
|| ![](./_images/icons-list/actions/agenda-gap.svg){width=24px height=24px} | `Actions.AGENDA_GAP` | `agenda-gap` | `ui-icon-set --agenda-gap` ||
|| ![](./_images/icons-list/actions/expand-to-full-screen.svg){width=24px height=24px} | `Actions.EXPAND_TO_FULL_SCREEN` | `expand-to-full-screen` | `ui-icon-set --expand-to-full-screen` ||
|| ![](./_images/icons-list/actions/curved-arrow-left.svg){width=24px height=24px} | `Actions.CURVED_ARROW_LEFT` | `curved-arrow-left` | `ui-icon-set --curved-arrow-left` ||
|| ![](./_images/icons-list/actions/forward.svg){width=24px height=24px} | `Actions.FORWARD` | `forward` | `ui-icon-set --forward` ||
|| ![](./_images/icons-list/actions/forward-2.svg){width=24px height=24px} | `Actions.FORWARD_2` | `forward-2` | `ui-icon-set --forward-2` ||
|| ![](./_images/icons-list/actions/arrow-download.svg){width=24px height=24px} | `Actions.ARROW_DOWNLOAD` | `arrow-download` | `ui-icon-set --arrow-download` ||
|| ![](./_images/icons-list/actions/pause.svg){width=24px height=24px} | `Actions.PAUSE` | `pause` | `ui-icon-set --pause` ||
|| ![](./_images/icons-list/actions/stop.svg){width=24px height=24px} | `Actions.STOP` | `stop` | `ui-icon-set --stop` ||
|| ![](./_images/icons-list/actions/play.svg){width=24px height=24px} | `Actions.PLAY` | `play` | `ui-icon-set --play` ||
|| ![](./_images/icons-list/actions/left-semicircular-anticlockwise-arrow-1.svg){width=24px height=24px} | `Actions.LEFT_SEMICIRCULAR_ANTICLOCKWISE_ARROW_1` | `left-semicircular-anticlockwise-arrow-1` | `ui-icon-set --left-semicircular-anticlockwise-arrow-1` ||
|| ![](./_images/icons-list/actions/double-shevrons-right.svg){width=24px height=24px} | `Actions.DOUBLE_SHEVRONS_RIGHT` | `double-shevrons-right` | `ui-icon-set --double-shevrons-right` ||
|| ![](./_images/icons-list/actions/next.svg){width=24px height=24px} | `Actions.NEXT` | `next` | `ui-icon-set --next` ||
|| ![](./_images/icons-list/actions/download-3.svg){width=24px height=24px} | `Actions.DOWNLOAD_3` | `download-3` | `ui-icon-set --download-3` ||
|| ![](./_images/icons-list/actions/upload.svg){width=24px height=24px} | `Actions.UPLOAD` | `upload` | `ui-icon-set --upload` ||
|| ![](./_images/icons-list/actions/swap.svg){width=24px height=24px} | `Actions.SWAP` | `swap` | `ui-icon-set --swap` ||
|| ![](./_images/icons-list/actions/sort.svg){width=24px height=24px} | `Actions.SORT` | `sort` | `ui-icon-set --sort` ||
|| ![](./_images/icons-list/actions/left-semicircular-anticlockwise-arrow-3.svg){width=24px height=24px} | `Actions.LEFT_SEMICIRCULAR_ANTICLOCKWISE_ARROW_3` | `left-semicircular-anticlockwise-arrow-3` | `ui-icon-set --left-semicircular-anticlockwise-arrow-3` ||
|| ![](./_images/icons-list/actions/left-semicircular-anticlockwise-arrow-4.svg){width=24px height=24px} | `Actions.LEFT_SEMICIRCULAR_ANTICLOCKWISE_ARROW_4` | `left-semicircular-anticlockwise-arrow-4` | `ui-icon-set --left-semicircular-anticlockwise-arrow-4` ||
|| ![](./_images/icons-list/actions/download.svg){width=24px height=24px} | `Actions.DOWNLOAD` | `download` | `ui-icon-set --download` ||
|| ![](./_images/icons-list/actions/download-2.svg){width=24px height=24px} | `Actions.DOWNLOAD_2` | `download-2` | `ui-icon-set --download-2` ||
|| ![](./_images/icons-list/actions/download-double.svg){width=24px height=24px} | `Actions.DOWNLOAD_DOUBLE` | `download-double` | `ui-icon-set --download-double` ||
|| ![](./_images/icons-list/actions/arrow-top-2.svg){width=24px height=24px} | `Actions.ARROW_TOP_2` | `arrow-top-2` | `ui-icon-set --arrow-top-2` ||
|| ![](./_images/icons-list/actions/conversion-1.svg){width=24px height=24px} | `Actions.CONVERSION_1` | `conversion-1` | `ui-icon-set --conversion-1` ||
|| ![](./_images/icons-list/actions/conversion-2.svg){width=24px height=24px} | `Actions.CONVERSION_2` | `conversion-2` | `ui-icon-set --conversion-2` ||
|| ![](./_images/icons-list/actions/forward-3.svg){width=24px height=24px} | `Actions.FORWARD_3` | `forward-3` | `ui-icon-set --forward-3` ||
|| ![](./_images/icons-list/actions/reply.svg){width=24px height=24px} | `Actions.REPLY` | `reply` | `ui-icon-set --reply` ||
|| ![](./_images/icons-list/actions/forward-2-1.svg){width=24px height=24px} | `Actions.FORWARD_2_1` | `forward-2-1` | `ui-icon-set --forward-2-1` ||
|| ![](./_images/icons-list/actions/replay-all.svg){width=24px height=24px} | `Actions.REPLAY_ALL` | `replay-all` | `ui-icon-set --replay-all` ||
|| ![](./_images/icons-list/actions/open-in-50.svg){width=24px height=24px} | `Actions.OPEN_IN_50` | `open-in-50` | `ui-icon-set --open-in-50` ||
|| ![](./_images/icons-list/actions/open-in-40.svg){width=24px height=24px} | `Actions.OPEN_IN_40` | `open-in-40` | `ui-icon-set --open-in-40` ||
|| ![](./_images/icons-list/actions/open-in-30.svg){width=24px height=24px} | `Actions.OPEN_IN_30` | `open-in-30` | `ui-icon-set --open-in-30` ||
|| ![](./_images/icons-list/actions/refresh-1.svg){width=24px height=24px} | `Actions.REFRESH_1` | `refresh-1` | `ui-icon-set --refresh-1` ||
|| ![](./_images/icons-list/actions/refresh-2.svg){width=24px height=24px} | `Actions.REFRESH_2` | `refresh-2` | `ui-icon-set --refresh-2` ||
|| ![](./_images/icons-list/actions/refresh-3.svg){width=24px height=24px} | `Actions.REFRESH_3` | `refresh-3` | `ui-icon-set --refresh-3` ||
|| ![](./_images/icons-list/actions/refresh-4.svg){width=24px height=24px} | `Actions.REFRESH_4` | `refresh-4` | `ui-icon-set --refresh-4` ||
|| ![](./_images/icons-list/actions/redo-1.svg){width=24px height=24px} | `Actions.REDO_1` | `redo-1` | `ui-icon-set --redo-1` ||
|| ![](./_images/icons-list/actions/undo-1.svg){width=24px height=24px} | `Actions.UNDO_1` | `undo-1` | `ui-icon-set --undo-1` ||
|| ![](./_images/icons-list/actions/refresh-5.svg){width=24px height=24px} | `Actions.REFRESH_5` | `refresh-5` | `ui-icon-set --refresh-5` ||
|| ![](./_images/icons-list/actions/redo-2.svg){width=24px height=24px} | `Actions.REDO_2` | `redo-2` | `ui-icon-set --redo-2` ||
|| ![](./_images/icons-list/actions/refresh-6.svg){width=24px height=24px} | `Actions.REFRESH_6` | `refresh-6` | `ui-icon-set --refresh-6` ||
|| ![](./_images/icons-list/actions/refresh-7.svg){width=24px height=24px} | `Actions.REFRESH_7` | `refresh-7` | `ui-icon-set --refresh-7` ||
|| ![](./_images/icons-list/actions/refresh-8.svg){width=24px height=24px} | `Actions.REFRESH_8` | `refresh-8` | `ui-icon-set --refresh-8` ||
|| ![](./_images/icons-list/actions/sync-settings.svg){width=24px height=24px} | `Actions.SYNC_SETTINGS` | `sync-settings` | `ui-icon-set --sync-settings` ||
|| ![](./_images/icons-list/actions/refresh-closed.svg){width=24px height=24px} | `Actions.REFRESH_CLOSED` | `refresh-closed` | `ui-icon-set --refresh-closed` ||
|| ![](./_images/icons-list/actions/refresh-10.svg){width=24px height=24px} | `Actions.REFRESH_10` | `refresh-10` | `ui-icon-set --refresh-10` ||
|| ![](./_images/icons-list/actions/cross-circle-50.svg){width=24px height=24px} | `Actions.CROSS_CIRCLE_50` | `cross-circle-50` | `ui-icon-set --cross-circle-50` ||
|| ![](./_images/icons-list/actions/cross-circle-60.svg){width=24px height=24px} | `Actions.CROSS_CIRCLE_60` | `cross-circle-60` | `ui-icon-set --cross-circle-60` ||
|| ![](./_images/icons-list/actions/cross-circle-70.svg){width=24px height=24px} | `Actions.CROSS_CIRCLE_70` | `cross-circle-70` | `ui-icon-set --cross-circle-70` ||
|| ![](./_images/icons-list/actions/cross-20.svg){width=24px height=24px} | `Actions.CROSS_20` | `cross-20` | `ui-icon-set --cross-20` ||
|| ![](./_images/icons-list/actions/cross-25.svg){width=24px height=24px} | `Actions.CROSS_25` | `cross-25` | `ui-icon-set --cross-25` ||
|| ![](./_images/icons-list/actions/cross-30.svg){width=24px height=24px} | `Actions.CROSS_30` | `cross-30` | `ui-icon-set --cross-30` ||
|| ![](./_images/icons-list/actions/cross-40.svg){width=24px height=24px} | `Actions.CROSS_40` | `cross-40` | `ui-icon-set --cross-40` ||
|| ![](./_images/icons-list/actions/cross-45.svg){width=24px height=24px} | `Actions.CROSS_45` | `cross-45` | `ui-icon-set --cross-45` ||
|| ![](./_images/icons-list/actions/cross-50.svg){width=24px height=24px} | `Actions.CROSS_50` | `cross-50` | `ui-icon-set --cross-50` ||
|| ![](./_images/icons-list/actions/cross-55.svg){width=24px height=24px} | `Actions.CROSS_55` | `cross-55` | `ui-icon-set --cross-55` ||
|| ![](./_images/icons-list/actions/cross-60.svg){width=24px height=24px} | `Actions.CROSS_60` | `cross-60` | `ui-icon-set --cross-60` ||
|| ![](./_images/icons-list/actions/plus-in-circle.svg){width=24px height=24px} | `Actions.PLUS_IN_CIRCLE` | `plus-in-circle` | `ui-icon-set --plus-in-circle` ||
|| ![](./_images/icons-list/actions/minus-in-circle.svg){width=24px height=24px} | `Actions.MINUS_IN_CIRCLE` | `minus-in-circle` | `ui-icon-set --minus-in-circle` ||
|| ![](./_images/icons-list/actions/minus-20.svg){width=24px height=24px} | `Actions.MINUS_20` | `minus-20` | `ui-icon-set --minus-20` ||
|| ![](./_images/icons-list/actions/minus-30.svg){width=24px height=24px} | `Actions.MINUS_30` | `minus-30` | `ui-icon-set --minus-30` ||
|| ![](./_images/icons-list/actions/minus-40.svg){width=24px height=24px} | `Actions.MINUS_40` | `minus-40` | `ui-icon-set --minus-40` ||
|| ![](./_images/icons-list/actions/minus-50.svg){width=24px height=24px} | `Actions.MINUS_50` | `minus-50` | `ui-icon-set --minus-50` ||
|| ![](./_images/icons-list/actions/minus-60.svg){width=24px height=24px} | `Actions.MINUS_60` | `minus-60` | `ui-icon-set --minus-60` ||
|| ![](./_images/icons-list/actions/line.svg){width=24px height=24px} | `Actions.LINE` | `line` | `ui-icon-set --line` ||
|| ![](./_images/icons-list/actions/plus-20.svg){width=24px height=24px} | `Actions.PLUS_20` | `plus-20` | `ui-icon-set --plus-20` ||
|| ![](./_images/icons-list/actions/plus-30.svg){width=24px height=24px} | `Actions.PLUS_30` | `plus-30` | `ui-icon-set --plus-30` ||
|| ![](./_images/icons-list/actions/plus-40.svg){width=24px height=24px} | `Actions.PLUS_40` | `plus-40` | `ui-icon-set --plus-40` ||
|| ![](./_images/icons-list/actions/plus-50.svg){width=24px height=24px} | `Actions.PLUS_50` | `plus-50` | `ui-icon-set --plus-50` ||
|| ![](./_images/icons-list/actions/plus-60.svg){width=24px height=24px} | `Actions.PLUS_60` | `plus-60` | `ui-icon-set --plus-60` ||
|| ![](./_images/icons-list/actions/more-9-cubes.svg){width=24px height=24px} | `Actions.MORE_9_CUBES` | `more-9-cubes` | `ui-icon-set --more-9-cubes` ||
|| ![](./_images/icons-list/actions/more-9-cubes-2.svg){width=24px height=24px} | `Actions.MORE_9_CUBES_2` | `more-9-cubes-2` | `ui-icon-set --more-9-cubes-2` ||
|| ![](./_images/icons-list/actions/4-cubes-1.svg){width=24px height=24px} | `Actions.CUBES_4_1` | `4-cubes-1` | `ui-icon-set --4-cubes-1` ||
|| ![](./_images/icons-list/actions/4-cubes-2.svg){width=24px height=24px} | `Actions.CUBES_4_2` | `4-cubes-2` | `ui-icon-set --4-cubes-2` ||
|| ![](./_images/icons-list/actions/more.svg){width=24px height=24px} | `Actions.MORE` | `more` | `ui-icon-set --more` ||
|| ![](./_images/icons-list/actions/settings-1.svg){width=24px height=24px} | `Actions.SETTINGS_1` | `settings-1` | `ui-icon-set --settings-1` ||
|| ![](./_images/icons-list/actions/settings-2.svg){width=24px height=24px} | `Actions.SETTINGS_2` | `settings-2` | `ui-icon-set --settings-2` ||
|| ![](./_images/icons-list/actions/settings-3.svg){width=24px height=24px} | `Actions.SETTINGS_3` | `settings-3` | `ui-icon-set --settings-3` ||
|| ![](./_images/icons-list/actions/settings-4.svg){width=24px height=24px} | `Actions.SETTINGS_4` | `settings-4` | `ui-icon-set --settings-4` ||
|| ![](./_images/icons-list/actions/copy-plates.svg){width=24px height=24px} | `Actions.COPY_PLATES` | `copy-plates` | `ui-icon-set --copy-plates` ||
|| ![](./_images/icons-list/actions/plates.svg){width=24px height=24px} | `Actions.PLATES` | `plates` | `ui-icon-set --plates` ||
|| ![](./_images/icons-list/actions/numerable-list.svg){width=24px height=24px} | `Actions.NUMERABLE_LIST` | `numerable-list` | `ui-icon-set --numerable-list` ||
|| ![](./_images/icons-list/actions/lines.svg){width=24px height=24px} | `Actions.LINES` | `lines` | `ui-icon-set --lines` ||
|| ![](./_images/icons-list/actions/pencil-draw.svg){width=24px height=24px} | `Actions.PENCIL_DRAW` | `pencil-draw` | `ui-icon-set --pencil-draw` ||
|| ![](./_images/icons-list/actions/pencil-60.svg){width=24px height=24px} | `Actions.PENCIL_60` | `pencil-60` | `ui-icon-set --pencil-60` ||
|| ![](./_images/icons-list/actions/pencil-50.svg){width=24px height=24px} | `Actions.PENCIL_50` | `pencil-50` | `ui-icon-set --pencil-50` ||
|| ![](./_images/icons-list/actions/pencil-40.svg){width=24px height=24px} | `Actions.PENCIL_40` | `pencil-40` | `ui-icon-set --pencil-40` ||
|| ![](./_images/icons-list/actions/brush.svg){width=24px height=24px} | `Actions.BRUSH` | `brush` | `ui-icon-set --brush` ||
|| ![](./_images/icons-list/actions/pen.svg){width=24px height=24px} | `Actions.PEN` | `pen` | `ui-icon-set --pen` ||
|| ![](./_images/icons-list/actions/keyboard.svg){width=24px height=24px} | `Actions.KEYBOARD` | `keyboard` | `ui-icon-set --keyboard` ||
|| ![](./_images/icons-list/actions/keyboard-2.svg){width=24px height=24px} | `Actions.KEYBOARD_2` | `keyboard-2` | `ui-icon-set --keyboard-2` ||
|| ![](./_images/icons-list/actions/connection.svg){width=24px height=24px} | `Actions.CONNECTION` | `connection` | `ui-icon-set --connection` ||
|| ![](./_images/icons-list/actions/disconnection.svg){width=24px height=24px} | `Actions.DISCONNECTION` | `disconnection` | `ui-icon-set --disconnection` ||
|| ![](./_images/icons-list/actions/image-rotate-left.svg){width=24px height=24px} | `Actions.IMAGE_ROTATE_LEFT` | `image-rotate-left` | `ui-icon-set --image-rotate-left` ||
|| ![](./_images/icons-list/actions/image-rotate-right.svg){width=24px height=24px} | `Actions.IMAGE_ROTATE_RIGHT` | `image-rotate-right` | `ui-icon-set --image-rotate-right` ||
|| ![](./_images/icons-list/actions/zoom-in.svg){width=24px height=24px} | `Actions.ZOOM_IN` | `zoom-in` | `ui-icon-set --zoom-in` ||
|| ![](./_images/icons-list/actions/zoom-out.svg){width=24px height=24px} | `Actions.ZOOM_OUT` | `zoom-out` | `ui-icon-set --zoom-out` ||
|#

{% endcut %}

{% cut "Main" %}

CSS-расширение: `ui.icon-set.main`.

#|
|| **Иконка** | **Константа** | **Значение** | **HTML-класс** ||
|| ![](./_images/icons-list/main/person-location.svg){width=24px height=24px} | `Main.PERSON_LOCATION` | `person-location` | `ui-icon-set --person-location` ||
|| ![](./_images/icons-list/main/persons-hand.svg){width=24px height=24px} | `Main.PERSONS_HAND` | `persons-hand` | `ui-icon-set --persons-hand` ||
|| ![](./_images/icons-list/main/person-arrow-down.svg){width=24px height=24px} | `Main.PERSON_ARROW_DOWN` | `person-arrow-down` | `ui-icon-set --person-arrow-down` ||
|| ![](./_images/icons-list/main/person.svg){width=24px height=24px} | `Main.PERSON` | `person` | `ui-icon-set --person` ||
|| ![](./_images/icons-list/main/person-camera.svg){width=24px height=24px} | `Main.PERSON_CAMERA` | `person-camera` | `ui-icon-set --person-camera` ||
|| ![](./_images/icons-list/main/person-plus.svg){width=24px height=24px} | `Main.PERSON_PLUS` | `person-plus` | `ui-icon-set --person-plus` ||
|| ![](./_images/icons-list/main/persons-deny.svg){width=24px height=24px} | `Main.PERSONS_DENY` | `persons-deny` | `ui-icon-set --persons-deny` ||
|| ![](./_images/icons-list/main/person-clock.svg){width=24px height=24px} | `Main.PERSON_CLOCK` | `person-clock` | `ui-icon-set --person-clock` ||
|| ![](./_images/icons-list/main/person-clock-2.svg){width=24px height=24px} | `Main.PERSON_CLOCK_2` | `person-clock-2` | `ui-icon-set --person-clock-2` ||
|| ![](./_images/icons-list/main/persons-2.svg){width=24px height=24px} | `Main.PERSONS_2` | `persons-2` | `ui-icon-set --persons-2` ||
|| ![](./_images/icons-list/main/persons-3.svg){width=24px height=24px} | `Main.PERSONS_3` | `persons-3` | `ui-icon-set --persons-3` ||
|| ![](./_images/icons-list/main/person-letter.svg){width=24px height=24px} | `Main.PERSON_LETTER` | `person-letter` | `ui-icon-set --person-letter` ||
|| ![](./_images/icons-list/main/person-message.svg){width=24px height=24px} | `Main.PERSON_MESSAGE` | `person-message` | `ui-icon-set --person-message` ||
|| ![](./_images/icons-list/main/person-arrow-left-1.svg){width=24px height=24px} | `Main.PERSON_ARROW_LEFT_1` | `person-arrow-left-1` | `ui-icon-set --person-arrow-left-1` ||
|| ![](./_images/icons-list/main/person-arrow-right.svg){width=24px height=24px} | `Main.PERSON_ARROW_RIGHT` | `person-arrow-right` | `ui-icon-set --person-arrow-right` ||
|| ![](./_images/icons-list/main/person-arrow-left-2.svg){width=24px height=24px} | `Main.PERSON_ARROW_LEFT_2` | `person-arrow-left-2` | `ui-icon-set --person-arrow-left-2` ||
|| ![](./_images/icons-list/main/person-flag.svg){width=24px height=24px} | `Main.PERSON_FLAG` | `person-flag` | `ui-icon-set --person-flag` ||
|| ![](./_images/icons-list/main/person-handset.svg){width=24px height=24px} | `Main.PERSON_HANDSET` | `person-handset` | `ui-icon-set --person-handset` ||
|| ![](./_images/icons-list/main/person-message-arrow-1.svg){width=24px height=24px} | `Main.PERSON_MESSAGE_ARROW_1` | `person-message-arrow-1` | `ui-icon-set --person-message-arrow-1` ||
|| ![](./_images/icons-list/main/person-check.svg){width=24px height=24px} | `Main.PERSON_CHECK` | `person-check` | `ui-icon-set --person-check` ||
|| ![](./_images/icons-list/main/person-message-arrow-2.svg){width=24px height=24px} | `Main.PERSON_MESSAGE_ARROW_2` | `person-message-arrow-2` | `ui-icon-set --person-message-arrow-2` ||
|| ![](./_images/icons-list/main/persons-storage.svg){width=24px height=24px} | `Main.PERSONS_STORAGE` | `persons-storage` | `ui-icon-set --persons-storage` ||
|| ![](./_images/icons-list/main/person-call.svg){width=24px height=24px} | `Main.PERSON_CALL` | `person-call` | `ui-icon-set --person-call` ||
|| ![](./_images/icons-list/main/person-phone.svg){width=24px height=24px} | `Main.PERSON_PHONE` | `person-phone` | `ui-icon-set --person-phone` ||
|| ![](./_images/icons-list/main/person-descending.svg){width=24px height=24px} | `Main.PERSON_DESCENDING` | `person-descending` | `ui-icon-set --person-descending` ||
|| ![](./_images/icons-list/main/person-3-sticks.svg){width=24px height=24px} | `Main.PERSON_3_STICKS` | `person-3-sticks` | `ui-icon-set --person-3-sticks` ||
|| ![](./_images/icons-list/main/person-2-checks.svg){width=24px height=24px} | `Main.PERSON_2_CHECKS` | `person-2-checks` | `ui-icon-set --person-2-checks` ||
|| ![](./_images/icons-list/main/person-plus-3.svg){width=24px height=24px} | `Main.PERSON_PLUS_3` | `person-plus-3` | `ui-icon-set --person-plus-3` ||
|| ![](./_images/icons-list/main/cloud-sync.svg){width=24px height=24px} | `Main.CLOUD_SYNC` | `cloud-sync` | `ui-icon-set --cloud-sync` ||
|| ![](./_images/icons-list/main/cloud-transfer-data.svg){width=24px height=24px} | `Main.CLOUD_TRANSFER_DATA` | `cloud-transfer-data` | `ui-icon-set --cloud-transfer-data` ||
|| ![](./_images/icons-list/main/cloud-pause.svg){width=24px height=24px} | `Main.CLOUD_PAUSE` | `cloud-pause` | `ui-icon-set --cloud-pause` ||
|| ![](./_images/icons-list/main/cloud-error.svg){width=24px height=24px} | `Main.CLOUD_ERROR` | `cloud-error` | `ui-icon-set --cloud-error` ||
|| ![](./_images/icons-list/main/cloud-clock.svg){width=24px height=24px} | `Main.CLOUD_CLOCK` | `cloud-clock` | `ui-icon-set --cloud-clock` ||
|| ![](./_images/icons-list/main/cloud-empty.svg){width=24px height=24px} | `Main.CLOUD_EMPTY` | `cloud-empty` | `ui-icon-set --cloud-empty` ||
|| ![](./_images/icons-list/main/cloud-cloud.svg){width=24px height=24px} | `Main.CLOUD_CLOUD` | `cloud-cloud` | `ui-icon-set --cloud-cloud` ||
|| ![](./_images/icons-list/main/cloud-letter-post.svg){width=24px height=24px} | `Main.CLOUD_LETTER_POST` | `cloud-letter-post` | `ui-icon-set --cloud-letter-post` ||
|| ![](./_images/icons-list/main/cloud-sso.svg){width=24px height=24px} | `Main.CLOUD_SSO` | `cloud-sso` | `ui-icon-set --cloud-sso` ||
|| ![](./_images/icons-list/main/telephony-handset-1.svg){width=24px height=24px} | `Main.TELEPHONY_HANDSET_1` | `telephony-handset-1` | `ui-icon-set --telephony-handset-1` ||
|| ![](./_images/icons-list/main/telephony-handset-2.svg){width=24px height=24px} | `Main.TELEPHONY_HANDSET_2` | `telephony-handset-2` | `ui-icon-set --telephony-handset-2` ||
|| ![](./_images/icons-list/main/telephony-handset-3.svg){width=24px height=24px} | `Main.TELEPHONY_HANDSET_3` | `telephony-handset-3` | `ui-icon-set --telephony-handset-3` ||
|| ![](./_images/icons-list/main/telephony-handset-4.svg){width=24px height=24px} | `Main.TELEPHONY_HANDSET_4` | `telephony-handset-4` | `ui-icon-set --telephony-handset-4` ||
|| ![](./_images/icons-list/main/telephony-handset-5.svg){width=24px height=24px} | `Main.TELEPHONY_HANDSET_5` | `telephony-handset-5` | `ui-icon-set --telephony-handset-5` ||
|| ![](./_images/icons-list/main/telephony-handset-6.svg){width=24px height=24px} | `Main.TELEPHONY_HANDSET_6` | `telephony-handset-6` | `ui-icon-set --telephony-handset-6` ||
|| ![](./_images/icons-list/main/outgoing-call.svg){width=24px height=24px} | `Main.OUTGOING_CALL` | `outgoing-call` | `ui-icon-set --outgoing-call` ||
|| ![](./_images/icons-list/main/incoming-call.svg){width=24px height=24px} | `Main.INCOMING_CALL` | `incoming-call` | `ui-icon-set --incoming-call` ||
|| ![](./_images/icons-list/main/telephony-phonebook.svg){width=24px height=24px} | `Main.TELEPHONY_PHONEBOOK` | `telephony-phonebook` | `ui-icon-set --telephony-phonebook` ||
|| ![](./_images/icons-list/main/telephony-phonebook-2.svg){width=24px height=24px} | `Main.telephony_phonebook_2` | `telephony-phonebook-2` | `ui-icon-set --telephony-phonebook-2` ||
|| ![](./_images/icons-list/main/call-chat.svg){width=24px height=24px} | `Main.CALL_CHAT` | `call-chat` | `ui-icon-set --call-chat` ||
|| ![](./_images/icons-list/main/chats-1.svg){width=24px height=24px} | `Main.CHATS_1` | `chats-1` | `ui-icon-set --chats-1` ||
|| ![](./_images/icons-list/main/chats-2.svg){width=24px height=24px} | `Main.CHATS_2` | `chats-2` | `ui-icon-set --chats-2` ||
|| ![](./_images/icons-list/main/chat-message.svg){width=24px height=24px} | `Main.CHAT_MESSAGE` | `chat-message` | `ui-icon-set --chat-message` ||
|| ![](./_images/icons-list/main/chats-with-check.svg){width=24px height=24px} | `Main.CHATS_WITH_CHECK` | `chats-with-check` | `ui-icon-set --chats-with-check` ||
|| ![](./_images/icons-list/main/chats-3.svg){width=24px height=24px} | `Main.CHATS_3` | `chats-3` | `ui-icon-set --chats-3` ||
|| ![](./_images/icons-list/main/message-chat-with-point.svg){width=24px height=24px} | `Main.MESSAGE_CHAT_WITH_POINT` | `message-chat-with-point` | `ui-icon-set --message-chat-with-point` ||
|| ![](./_images/icons-list/main/message-chat-with-arrow.svg){width=24px height=24px} | `Main.MESSAGE_CHAT_WITH_ARROW` | `message-chat-with-arrow` | `ui-icon-set --message-chat-with-arrow` ||
|| ![](./_images/icons-list/main/chat-button.svg){width=24px height=24px} | `Main.CHAT_BUTTON` | `chat-button` | `ui-icon-set --chat-button` ||
|| ![](./_images/icons-list/main/feedback.svg){width=24px height=24px} | `Main.FEEDBACK` | `feedback` | `ui-icon-set --feedback` ||
|| ![](./_images/icons-list/main/add-chat.svg){width=24px height=24px} | `Main.ADD_CHAT` | `add-chat` | `ui-icon-set --add-chat` ||
|| ![](./_images/icons-list/main/bookmark-1.svg){width=24px height=24px} | `Main.BOOKMARK_1` | `bookmark-1` | `ui-icon-set --bookmark-1` ||
|| ![](./_images/icons-list/main/folder-curved-arrow.svg){width=24px height=24px} | `Main.FOLDER_CURVED_ARROW` | `folder-curved-arrow` | `ui-icon-set --folder-curved-arrow` ||
|| ![](./_images/icons-list/main/folder-24.svg){width=24px height=24px} | `Main.FOLDER_24` | `folder-24` | `ui-icon-set --folder-24` ||
|| ![](./_images/icons-list/main/folder-plus.svg){width=24px height=24px} | `Main.FOLDER_PLUS` | `folder-plus` | `ui-icon-set --folder-plus` ||
|| ![](./_images/icons-list/main/folder-empty.svg){width=24px height=24px} | `Main.FOLDER_EMPTY` | `folder-empty` | `ui-icon-set --folder-empty` ||
|| ![](./_images/icons-list/main/folder-left-arrow.svg){width=24px height=24px} | `Main.FOLDER_LEFT_ARROW` | `folder-left-arrow` | `ui-icon-set --folder-left-arrow` ||
|| ![](./_images/icons-list/main/folder-info.svg){width=24px height=24px} | `Main.FOLDER_INFO` | `folder-info` | `ui-icon-set --folder-info` ||
|| ![](./_images/icons-list/main/folder-right-arrow.svg){width=24px height=24px} | `Main.FOLDER_RIGHT_ARROW` | `folder-right-arrow` | `ui-icon-set --folder-right-arrow` ||
|| ![](./_images/icons-list/main/note-circle.svg){width=24px height=24px} | `Main.NOTE_CIRCLE` | `note-circle` | `ui-icon-set --note-circle` ||
|| ![](./_images/icons-list/main/warning-circle.svg){width=24px height=24px} | `Main.WARNING_CIRCLE` | `warning-circle` | `ui-icon-set --warning-circle` ||
|| ![](./_images/icons-list/main/info-circle.svg){width=24px height=24px} | `Main.INFO_CIRCLE` | `info-circle` | `ui-icon-set --info-circle` ||
|| ![](./_images/icons-list/main/warning.svg){width=24px height=24px} | `Main.WARNING` | `warning` | `ui-icon-set --warning` ||
|| ![](./_images/icons-list/main/warning-alarm.svg){width=24px height=24px} | `Main.WARNING_ALARM` | `warning-alarm` | `ui-icon-set --warning-alarm` ||
|| ![](./_images/icons-list/main/info.svg){width=24px height=24px} | `Main.INFO` | `info` | `ui-icon-set --info` ||
|| ![](./_images/icons-list/main/help.svg){width=24px height=24px} | `Main.HELP` | `help` | `ui-icon-set --help` ||
|| ![](./_images/icons-list/main/sms.svg){width=24px height=24px} | `Main.SMS` | `sms` | `ui-icon-set --sms` ||
|| ![](./_images/icons-list/main/file.svg){width=24px height=24px} | `Main.FILE` | `file` | `ui-icon-set --file` ||
|| ![](./_images/icons-list/main/list.svg){width=24px height=24px} | `Main.LIST` | `list` | `ui-icon-set --list` ||
|| ![](./_images/icons-list/main/black-list.svg){width=24px height=24px} | `Main.BLACK_LIST` | `black-list` | `ui-icon-set --black-list` ||
|| ![](./_images/icons-list/main/shield-2-plain.svg){width=24px height=24px} | `Main.SHIELD_2_PLAIN` | `shield-2-plain` | `ui-icon-set --shield-2-plain` ||
|| ![](./_images/icons-list/main/shield-2-contour.svg){width=24px height=24px} | `Main.SHIELD_2_CONTOUR` | `shield-2-contour` | `ui-icon-set --shield-2-contour` ||
|| ![](./_images/icons-list/main/shield-2-checked.svg){width=24px height=24px} | `Main.SHIELD_2_CHECKED` | `shield-2-checked` | `ui-icon-set --shield-2-checked` ||
|| ![](./_images/icons-list/main/shield-2-attention.svg){width=24px height=24px} | `Main.SHIELD_2_ATTENTION` | `shield-2-attention` | `ui-icon-set --shield-2-attention` ||
|| ![](./_images/icons-list/main/shield-2-menu.svg){width=24px height=24px} | `Main.SHIELD_2_MENU` | `shield-2-menu` | `ui-icon-set --shield-2-menu` ||
|| ![](./_images/icons-list/main/shield-2-time.svg){width=24px height=24px} | `Main.SHIELD_2_TIME` | `shield-2-time` | `ui-icon-set --shield-2-time` ||
|| ![](./_images/icons-list/main/shield-2-defended.svg){width=24px height=24px} | `Main.SHIELD_2_DEFENDED` | `shield-2-defended` | `ui-icon-set --shield-2-defended` ||
|| ![](./_images/icons-list/main/shield-2-update.svg){width=24px height=24px} | `Main.SHIELD_2_UPDATE` | `shield-2-update` | `ui-icon-set --shield-2-update` ||
|| ![](./_images/icons-list/main/shield-2-core-problem.svg){width=24px height=24px} | `Main.SHIELD_2_CORE_PROBLEM` | `shield-2-core-problem` | `ui-icon-set --shield-2-core-problem` ||
|| ![](./_images/icons-list/main/file-upload.svg){width=24px height=24px} | `Main.FILE_UPLOAD` | `file-upload` | `ui-icon-set --file-upload` ||
|| ![](./_images/icons-list/main/file-sync.svg){width=24px height=24px} | `Main.FILE_SYNC` | `file-sync` | `ui-icon-set --file-sync` ||
|| ![](./_images/icons-list/main/file-arrow-top.svg){width=24px height=24px} | `Main.FILE_ARROW_TOP` | `file-arrow-top` | `ui-icon-set --file-arrow-top` ||
|| ![](./_images/icons-list/main/file-delete.svg){width=24px height=24px} | `Main.FILE_DELETE` | `file-delete` | `ui-icon-set --file-delete` ||
|| ![](./_images/icons-list/main/file-check.svg){width=24px height=24px} | `Main.FILE_CHECK` | `file-check` | `ui-icon-set --file-check` ||
|| ![](./_images/icons-list/main/file-2.svg){width=24px height=24px} | `Main.FILE_2` | `file-2` | `ui-icon-set --file-2` ||
|| ![](./_images/icons-list/main/file-download.svg){width=24px height=24px} | `Main.FILE_DOWNLOAD` | `file-download` | `ui-icon-set --file-download` ||
|| ![](./_images/icons-list/main/file-arrow-down.svg){width=24px height=24px} | `Main.FILE_ARROW_DOWN` | `file-arrow-down` | `ui-icon-set --file-arrow-down` ||
|| ![](./_images/icons-list/main/file-3.svg){width=24px height=24px} | `Main.FILE_3` | `file-3` | `ui-icon-set --file-3` ||
|| ![](./_images/icons-list/main/hourglass-sandglass.svg){width=24px height=24px} | `Main.HOURGLASS_SANDGLASS` | `hourglass-sandglass` | `ui-icon-set --hourglass-sandglass` ||
|| ![](./_images/icons-list/main/clock-1.svg){width=24px height=24px} | `Main.CLOCK_1` | `clock-1` | `ui-icon-set --clock-1` ||
|| ![](./_images/icons-list/main/clock-2.svg){width=24px height=24px} | `Main.CLOCK_2` | `clock-2` | `ui-icon-set --clock-2` ||
|| ![](./_images/icons-list/main/clock-with-arrow.svg){width=24px height=24px} | `Main.CLOCK_WITH_ARROW` | `clock-with-arrow` | `ui-icon-set --clock-with-arrow` ||
|| ![](./_images/icons-list/main/stopwatch.svg){width=24px height=24px} | `Main.STOPWATCH` | `stopwatch` | `ui-icon-set --stopwatch` ||
|| ![](./_images/icons-list/main/alarm.svg){width=24px height=24px} | `Main.ALARM` | `alarm` | `ui-icon-set --alarm` ||
|| ![](./_images/icons-list/main/black-clock.svg){width=24px height=24px} | `Main.BLACK_CLOCK` | `black-clock` | `ui-icon-set --black-clock` ||
|| ![](./_images/icons-list/main/speed-meter.svg){width=24px height=24px} | `Main.SPEED_METER` | `speed-meter` | `ui-icon-set --speed-meter` ||
|| ![](./_images/icons-list/main/watch.svg){width=24px height=24px} | `Main.WATCH` | `watch` | `ui-icon-set --watch` ||
|| ![](./_images/icons-list/main/smart-process.svg){width=24px height=24px} | `Main.SMART_PROCESS` | `smart-process` | `ui-icon-set --smart-process` ||
|| ![](./_images/icons-list/main/search-1.svg){width=24px height=24px} | `Main.SEARCH_1` | `search-1` | `ui-icon-set --search-1` ||
|| ![](./_images/icons-list/main/search-2.svg){width=24px height=24px} | `Main.SEARCH_2` | `search-2` | `ui-icon-set --search-2` ||
|| ![](./_images/icons-list/main/restore-password.svg){width=24px height=24px} | `Main.RESTORE_PASSWORD` | `restore-password` | `ui-icon-set --restore-password` ||
|| ![](./_images/icons-list/main/tasks.svg){width=24px height=24px} | `Main.TASKS` | `tasks` | `ui-icon-set --tasks` ||
|| ![](./_images/icons-list/main/window-arrow.svg){width=24px height=24px} | `Main.WINDOW_ARROW` | `window-arrow` | `ui-icon-set --window-arrow` ||
|| ![](./_images/icons-list/main/window-double-check-1.svg){width=24px height=24px} | `Main.WINDOW_DOUBLE_CHECK_1` | `window-double-check-1` | `ui-icon-set --window-double-check-1` ||
|| ![](./_images/icons-list/main/window-ring.svg){width=24px height=24px} | `Main.WINDOW_RING` | `window-ring` | `ui-icon-set --window-ring` ||
|| ![](./_images/icons-list/main/window-double-check-2.svg){width=24px height=24px} | `Main.WINDOW_DOUBLE_CHECK_2` | `window-double-check-2` | `ui-icon-set --window-double-check-2` ||
|| ![](./_images/icons-list/main/window-check-pencil.svg){width=24px height=24px} | `Main.WINDOW_CHECK_PENCIL` | `window-check-pencil` | `ui-icon-set --window-check-pencil` ||
|| ![](./_images/icons-list/main/window-check-link.svg){width=24px height=24px} | `Main.WINDOW_CHECK_LINK` | `window-check-link` | `ui-icon-set --window-check-link` ||
|| ![](./_images/icons-list/main/window-flag.svg){width=24px height=24px} | `Main.WINDOW_FLAG` | `window-flag` | `ui-icon-set --window-flag` ||
|| ![](./_images/icons-list/main/window-check-with-folder.svg){width=24px height=24px} | `Main.WINDOW_CHECK_WITH_FOLDER` | `window-check-with-folder` | `ui-icon-set --window-check-with-folder` ||
|| ![](./_images/icons-list/main/window-with-point.svg){width=24px height=24px} | `Main.WINDOW_WITH_POINT` | `window-with-point` | `ui-icon-set --window-with-point` ||
|| ![](./_images/icons-list/main/window-check-arrow.svg){width=24px height=24px} | `Main.WINDOW_CHECK_ARROW` | `window-check-arrow` | `ui-icon-set --window-check-arrow` ||
|| ![](./_images/icons-list/main/video-1.svg){width=24px height=24px} | `Main.VIDEO_1` | `video-1` | `ui-icon-set --video-1` ||
|| ![](./_images/icons-list/main/video-3.svg){width=24px height=24px} | `Main.VIDEO_3` | `video-3` | `ui-icon-set --video-3` ||
|| ![](./_images/icons-list/main/video-and-chat.svg){width=24px height=24px} | `Main.VIDEO_AND_CHAT` | `video-and-chat` | `ui-icon-set --video-and-chat` ||
|| ![](./_images/icons-list/main/no-video.svg){width=24px height=24px} | `Main.NO_VIDEO` | `no-video` | `ui-icon-set --no-video` ||
|| ![](./_images/icons-list/main/picture.svg){width=24px height=24px} | `Main.PICTURE` | `picture` | `ui-icon-set --picture` ||
|| ![](./_images/icons-list/main/microphone-on.svg){width=24px height=24px} | `Main.MICROPHONE_ON` | `microphone-on` | `ui-icon-set --microphone-on` ||
|| ![](./_images/icons-list/main/camera.svg){width=24px height=24px} | `Main.CAMERA` | `camera` | `ui-icon-set --camera` ||
|| ![](./_images/icons-list/main/attach-picture.svg){width=24px height=24px} | `Main.ATTACH_PICTURE` | `attach-picture` | `ui-icon-set --attach-picture` ||
|| ![](./_images/icons-list/main/sound-on.svg){width=24px height=24px} | `Main.SOUND_ON` | `sound-on` | `ui-icon-set --sound-on` ||
|| ![](./_images/icons-list/main/sound-off.svg){width=24px height=24px} | `Main.SOUND_OFF` | `sound-off` | `ui-icon-set --sound-off` ||
|| ![](./_images/icons-list/main/sound-2.svg){width=24px height=24px} | `Main.SOUND_2` | `sound-2` | `ui-icon-set --sound-2` ||
|| ![](./_images/icons-list/main/video-2.svg){width=24px height=24px} | `Main.VIDEO_2` | `video-2` | `ui-icon-set --video-2` ||
|| ![](./_images/icons-list/main/speakerphone.svg){width=24px height=24px} | `Main.SPEAKERPHONE` | `speakerphone` | `ui-icon-set --speakerphone` ||
|| ![](./_images/icons-list/main/headset.svg){width=24px height=24px} | `Main.HEADSET` | `headset` | `ui-icon-set --headset` ||
|| ![](./_images/icons-list/main/microphone-off.svg){width=24px height=24px} | `Main.MICROPHONE_OFF` | `microphone-off` | `ui-icon-set --microphone-off` ||
|| ![](./_images/icons-list/main/music-note-2.svg){width=24px height=24px} | `Main.MUSIC_NOTE_2` | `music-note-2` | `ui-icon-set --music-note-2` ||
|| ![](./_images/icons-list/main/music-note-3.svg){width=24px height=24px} | `Main.MUSIC_NOTE_3` | `music-note-3` | `ui-icon-set --music-note-3` ||
|| ![](./_images/icons-list/main/music-note-1.svg){width=24px height=24px} | `Main.MUSIC_NOTE_1` | `music-note-1` | `ui-icon-set --music-note-1` ||
|| ![](./_images/icons-list/main/market-1.svg){width=24px height=24px} | `Main.MARKET_1` | `market-1` | `ui-icon-set --market-1` ||
|| ![](./_images/icons-list/main/copilot-ai.svg){width=24px height=24px} | `Main.COPILOT_AI` | `copilot-ai` | `ui-icon-set --copilot-ai` ||
|| ![](./_images/icons-list/main/copilot-ai-1.svg){width=24px height=24px} | `Main.COPILOT_AI_1` | `copilot-ai-1` | `ui-icon-set --copilot-ai-1` ||
|| ![](./_images/icons-list/main/copilot-ai-2.svg){width=24px height=24px} | `Main.COPILOT_AI_2` | `copilot-ai-2` | `ui-icon-set --copilot-ai-2` ||
|| ![](./_images/icons-list/main/list-ai.svg){width=24px height=24px} | `Main.LIST_AI` | `list-ai` | `ui-icon-set --list-ai` ||
|| ![](./_images/icons-list/main/info-circle-plus.svg){width=24px height=24px} | `Main.INFO_CIRCLE_PLUS` | `info-circle-plus` | `ui-icon-set --info-circle-plus` ||
|| ![](./_images/icons-list/main/screen-black-white.svg){width=24px height=24px} | `Main.SCREEN_BLACK_WHITE` | `screen-black-white` | `ui-icon-set --screen-black-white` ||
|| ![](./_images/icons-list/main/bell-1.svg){width=24px height=24px} | `Main.BELL_1` | `bell-1` | `ui-icon-set --bell-1` ||
|| ![](./_images/icons-list/main/heart.svg){width=24px height=24px} | `Main.HEART` | `heart` | `ui-icon-set --heart` ||
|| ![](./_images/icons-list/main/sync-circle.svg){width=24px height=24px} | `Main.SYNC_CIRCLE` | `sync-circle` | `ui-icon-set --sync-circle` ||
|| ![](./_images/icons-list/main/like.svg){width=24px height=24px} | `Main.LIKE` | `like` | `ui-icon-set --like` ||
|| ![](./_images/icons-list/main/dislike.svg){width=24px height=24px} | `Main.DISLIKE` | `dislike` | `ui-icon-set --dislike` ||
|| ![](./_images/icons-list/main/ruler-and-pencil.svg){width=24px height=24px} | `Main.RULER_AND_PENCIL` | `ruler-and-pencil` | `ui-icon-set --ruler-and-pencil` ||
|| ![](./_images/icons-list/main/key.svg){width=24px height=24px} | `Main.KEY` | `key` | `ui-icon-set --key` ||
|| ![](./_images/icons-list/main/mobile-2.svg){width=24px height=24px} | `Main.MOBILE_2` | `mobile-2` | `ui-icon-set --mobile-2` ||
|| ![](./_images/icons-list/main/lock.svg){width=24px height=24px} | `Main.LOCK` | `lock` | `ui-icon-set --lock` ||
|| ![](./_images/icons-list/main/pulse.svg){width=24px height=24px} | `Main.PULSE` | `pulse` | `ui-icon-set --pulse` ||
|| ![](./_images/icons-list/main/attach.svg){width=24px height=24px} | `Main.ATTACH` | `attach` | `ui-icon-set --attach` ||
|| ![](./_images/icons-list/main/flag-2.svg){width=24px height=24px} | `Main.FLAG_2` | `flag-2` | `ui-icon-set --flag-2` ||
|| ![](./_images/icons-list/main/favorite-0.svg){width=24px height=24px} | `Main.FAVORITE_0` | `favorite-0` | `ui-icon-set --favorite-0` ||
|| ![](./_images/icons-list/main/favorite-1.svg){width=24px height=24px} | `Main.FAVORITE_1` | `favorite-1` | `ui-icon-set --favorite-1` ||
|| ![](./_images/icons-list/main/pulse-circle.svg){width=24px height=24px} | `Main.PULSE_CIRCLE` | `pulse-circle` | `ui-icon-set --pulse-circle` ||
|| ![](./_images/icons-list/main/crown-2.svg){width=24px height=24px} | `Main.CROWN_2` | `crown-2` | `ui-icon-set --crown-2` ||
|| ![](./_images/icons-list/main/crown-1.svg){width=24px height=24px} | `Main.CROWN_1` | `crown-1` | `ui-icon-set --crown-1` ||
|| ![](./_images/icons-list/main/home.svg){width=24px height=24px} | `Main.HOME` | `home` | `ui-icon-set --home` ||
|| ![](./_images/icons-list/main/send.svg){width=24px height=24px} | `Main.SEND` | `send` | `ui-icon-set --send` ||
|| ![](./_images/icons-list/main/suitcase.svg){width=24px height=24px} | `Main.SUITCASE` | `suitcase` | `ui-icon-set --suitcase` ||
|| ![](./_images/icons-list/main/spanner.svg){width=24px height=24px} | `Main.SPANNER` | `spanner` | `ui-icon-set --spanner` ||
|| ![](./_images/icons-list/main/idea-lamp.svg){width=24px height=24px} | `Main.IDEA_LAMP` | `idea-lamp` | `ui-icon-set --idea-lamp` ||
|| ![](./_images/icons-list/main/book-closed.svg){width=24px height=24px} | `Main.BOOK_CLOSED` | `book-closed` | `ui-icon-set --book-closed` ||
|| ![](./_images/icons-list/main/edit-pencil.svg){width=24px height=24px} | `Main.EDIT_PENCIL` | `edit-pencil` | `ui-icon-set --edit-pencil` ||
|| ![](./_images/icons-list/main/compass.svg){width=24px height=24px} | `Main.COMPASS` | `compass` | `ui-icon-set --compass` ||
|| ![](./_images/icons-list/main/check.svg){width=24px height=24px} | `Main.CHECK` | `check` | `ui-icon-set --check` ||
|| ![](./_images/icons-list/main/funnel.svg){width=24px height=24px} | `Main.FUNNEL` | `funnel` | `ui-icon-set --funnel` ||
|| ![](./_images/icons-list/main/brightness.svg){width=24px height=24px} | `Main.BRIGHTNESS` | `brightness` | `ui-icon-set --brightness` ||
|| ![](./_images/icons-list/main/earth-language.svg){width=24px height=24px} | `Main.EARTH_LANGUAGE` | `earth-language` | `ui-icon-set --earth-language` ||
|| ![](./_images/icons-list/main/observer.svg){width=24px height=24px} | `Main.OBSERVER` | `observer` | `ui-icon-set --observer` ||
|| ![](./_images/icons-list/main/observer-closed.svg){width=24px height=24px} | `Main.OBSERVER_CLOSED` | `observer-closed` | `ui-icon-set --observer-closed` ||
|| ![](./_images/icons-list/main/barcode-1.svg){width=24px height=24px} | `Main.BARCODE_1` | `barcode-1` | `ui-icon-set --barcode-1` ||
|| ![](./_images/icons-list/main/door-opened.svg){width=24px height=24px} | `Main.DOOR_OPENED` | `door-opened` | `ui-icon-set --door-opened` ||
|| ![](./_images/icons-list/main/shield.svg){width=24px height=24px} | `Main.SHIELD` | `shield` | `ui-icon-set --shield` ||
|| ![](./_images/icons-list/main/trash-bin.svg){width=24px height=24px} | `Main.TRASH_BIN` | `trash-bin` | `ui-icon-set --trash-bin` ||
|| ![](./_images/icons-list/main/sunglasses.svg){width=24px height=24px} | `Main.SUNGLASSES` | `sunglasses` | `ui-icon-set --sunglasses` ||
|| ![](./_images/icons-list/main/device-rotate.svg){width=24px height=24px} | `Main.DEVICE_ROTATE` | `device-rotate` | `ui-icon-set --device-rotate` ||
|| ![](./_images/icons-list/main/play-circle.svg){width=24px height=24px} | `Main.PLAY_CIRCLE` | `play-circle` | `ui-icon-set --play-circle` ||
|| ![](./_images/icons-list/main/cut.svg){width=24px height=24px} | `Main.CUT` | `cut` | `ui-icon-set --cut` ||
|| ![](./_images/icons-list/main/circle-minus.svg){width=24px height=24px} | `Main.CIRCLE_MINUS` | `circle-minus` | `ui-icon-set --circle-minus` ||
|| ![](./_images/icons-list/main/circle-check.svg){width=24px height=24px} | `Main.CIRCLE_CHECK` | `circle-check` | `ui-icon-set --circle-check` ||
|| ![](./_images/icons-list/main/circle-plus.svg){width=24px height=24px} | `Main.CIRCLE_PLUS` | `circle-plus` | `ui-icon-set --circle-plus` ||
|| ![](./_images/icons-list/main/unavailable.svg){width=24px height=24px} | `Main.UNAVAILABLE` | `unavailable` | `ui-icon-set --unavailable` ||
|| ![](./_images/icons-list/main/calendar-2.svg){width=24px height=24px} | `Main.CALENDAR_2` | `calendar-2` | `ui-icon-set --calendar-2` ||
|| ![](./_images/icons-list/main/location-1.svg){width=24px height=24px} | `Main.LOCATION_1` | `location-1` | `ui-icon-set --location-1` ||
|| ![](./_images/icons-list/main/location-2.svg){width=24px height=24px} | `Main.LOCATION_2` | `location-2` | `ui-icon-set --location-2` ||
|| ![](./_images/icons-list/main/location-plus.svg){width=24px height=24px} | `Main.LOCATION_PLUS` | `location-plus` | `ui-icon-set --location-plus` ||
|| ![](./_images/icons-list/main/time-picker.svg){width=24px height=24px} | `Main.TIME_PICKER` | `time-picker` | `ui-icon-set --time-picker` ||
|| ![](./_images/icons-list/main/map.svg){width=24px height=24px} | `Main.MAP` | `map` | `ui-icon-set --map` ||
|| ![](./_images/icons-list/main/pin-2.svg){width=24px height=24px} | `Main.PIN_2` | `pin-2` | `ui-icon-set --pin-2` ||
|| ![](./_images/icons-list/main/double-rhombus.svg){width=24px height=24px} | `Main.DOUBLE_RHOMBUS` | `double-rhombus` | `ui-icon-set --double-rhombus` ||
|| ![](./_images/icons-list/main/fire.svg){width=24px height=24px} | `Main.FIRE` | `fire` | `ui-icon-set --fire` ||
|| ![](./_images/icons-list/main/light-bold-sparkle.svg){width=24px height=24px} | `Main.LIGHT_BOLD_SPARKLE` | `light-bold-sparkle` | `ui-icon-set --light-bold-sparkle` ||
|| ![](./_images/icons-list/main/light-bold.svg){width=24px height=24px} | `Main.LIGHT_BOLD` | `light-bold` | `ui-icon-set --light-bold` ||
|| ![](./_images/icons-list/main/box.svg){width=24px height=24px} | `Main.BOX` | `box` | `ui-icon-set --box` ||
|| ![](./_images/icons-list/main/delivery-1.svg){width=24px height=24px} | `Main.DELIVERY_1` | `delivery-1` | `ui-icon-set --delivery-1` ||
|| ![](./_images/icons-list/main/delivery-2.svg){width=24px height=24px} | `Main.DELIVERY_2` | `delivery-2` | `ui-icon-set --delivery-2` ||
|| ![](./_images/icons-list/main/cubes-3.svg){width=24px height=24px} | `Main.CUBES_3` | `cubes-3` | `ui-icon-set --cubes-3` ||
|| ![](./_images/icons-list/main/drawer.svg){width=24px height=24px} | `Main.DRAWER` | `drawer` | `ui-icon-set --drawer` ||
|| ![](./_images/icons-list/main/cube-plus.svg){width=24px height=24px} | `Main.CUBE_PLUS` | `cube-plus` | `ui-icon-set --cube-plus` ||
|| ![](./_images/icons-list/main/calendar-slots.svg){width=24px height=24px} | `Main.CALENDAR_SLOTS` | `calendar-slots` | `ui-icon-set --calendar-slots` ||
|| ![](./_images/icons-list/main/payment-terminal.svg){width=24px height=24px} | `Main.PAYMENT_TERMINAL` | `payment-terminal` | `ui-icon-set --payment-terminal` ||
|| ![](./_images/icons-list/main/calendar-sharing.svg){width=24px height=24px} | `Main.CALENDAR_SHARING` | `calendar-sharing` | `ui-icon-set --calendar-sharing` ||
|| ![](./_images/icons-list/main/target-timer.svg){width=24px height=24px} | `Main.TARGET_TIMER` | `target-timer` | `ui-icon-set --target-timer` ||
|| ![](./_images/icons-list/main/target.svg){width=24px height=24px} | `Main.TARGET` | `target` | `ui-icon-set --target` ||
|| ![](./_images/icons-list/main/market-2.svg){width=24px height=24px} | `Main.MARKET_2` | `market-2` | `ui-icon-set --market-2` ||
|| ![](./_images/icons-list/main/bell.svg){width=24px height=24px} | `Main.BELL` | `bell` | `ui-icon-set --bell` ||
|| ![](./_images/icons-list/main/sale-tag.svg){width=24px height=24px} | `Main.SALE_TAG` | `sale-tag` | `ui-icon-set --sale-tag` ||
|| ![](./_images/icons-list/main/open-lines.svg){width=24px height=24px} | `Main.OPEN_LINES` | `open-lines` | `ui-icon-set --open-lines` ||
|| ![](./_images/icons-list/main/chemistry.svg){width=24px height=24px} | `Main.CHEMISTRY` | `chemistry` | `ui-icon-set --chemistry` ||
|| ![](./_images/icons-list/main/graduation-cap.svg){width=24px height=24px} | `Main.GRADUATION_CAP` | `graduation-cap` | `ui-icon-set --graduation-cap` ||
|| ![](./_images/icons-list/main/paint-1.svg){width=24px height=24px} | `Main.PAINT_1` | `paint-1` | `ui-icon-set --paint-1` ||
|| ![](./_images/icons-list/main/paint-2.svg){width=24px height=24px} | `Main.PAINT_2` | `paint-2` | `ui-icon-set --paint-2` ||
|| ![](./_images/icons-list/main/flag-1.svg){width=24px height=24px} | `Main.FLAG_1` | `flag-1` | `ui-icon-set --flag-1` ||
|| ![](./_images/icons-list/main/credit-debit-card.svg){width=24px height=24px} | `Main.CREDIT_DEBIT_CARD` | `credit-debit-card` | `ui-icon-set --credit-debit-card` ||
|| ![](./_images/icons-list/main/lightning-plus.svg){width=24px height=24px} | `Main.LIGHTNING_PLUS` | `lightning-plus` | `ui-icon-set --lightning-plus` ||
|| ![](./_images/icons-list/main/donation.svg){width=24px height=24px} | `Main.DONATION` | `donation` | `ui-icon-set --donation` ||
|| ![](./_images/icons-list/main/b-24.svg){width=24px height=24px} | `Main.B_24` | `b-24` | `ui-icon-set --b-24` ||
|| ![](./_images/icons-list/main/tag.svg){width=24px height=24px} | `Main.TAG` | `tag` | `ui-icon-set --tag` ||
|| ![](./_images/icons-list/main/speaker-mouthpiece.svg){width=24px height=24px} | `Main.SPEAKER_MOUTHPIECE` | `speaker-mouthpiece` | `ui-icon-set --speaker-mouthpiece` ||
|| ![](./_images/icons-list/main/speaker-mouthpiece-plus.svg){width=24px height=24px} | `Main.SPEAKER_MOUTHPIECE_PLUS` | `speaker-mouthpiece-plus` | `ui-icon-set --speaker-mouthpiece-plus` ||
|| ![](./_images/icons-list/main/opened-eye.svg){width=24px height=24px} | `Main.OPENED_EYE` | `opened-eye` | `ui-icon-set --opened-eye` ||
|| ![](./_images/icons-list/main/crossed-eye.svg){width=24px height=24px} | `Main.CROSSED_EYE` | `crossed-eye` | `ui-icon-set --crossed-eye` ||
|| ![](./_images/icons-list/main/links-3.svg){width=24px height=24px} | `Main.LINKS_3` | `links-3` | `ui-icon-set --links-3` ||
|| ![](./_images/icons-list/main/implementation-request.svg){width=24px height=24px} | `Main.IMPLEMENTATION_REQUEST` | `implementation-request` | `ui-icon-set --implementation-request` ||
|| ![](./_images/icons-list/main/group.svg){width=24px height=24px} | `Main.GROUP` | `group` | `ui-icon-set --group` ||
|| ![](./_images/icons-list/main/document-stream.svg){width=24px height=24px} | `Main.DOCUMENT_STREAM` | `document-stream` | `ui-icon-set --document-stream` ||
|| ![](./_images/icons-list/main/book-open-1.svg){width=24px height=24px} | `Main.BOOK_OPEN_1` | `book-open-1` | `ui-icon-set --book-open-1` ||
|| ![](./_images/icons-list/main/folders.svg){width=24px height=24px} | `Main.FOLDERS` | `folders` | `ui-icon-set --folders` ||
|| ![](./_images/icons-list/main/qr-code-1.svg){width=24px height=24px} | `Main.QR_CODE_1` | `qr-code-1` | `ui-icon-set --qr-code-1` ||
|| ![](./_images/icons-list/main/qr-code-2.svg){width=24px height=24px} | `Main.QR_CODE_2` | `qr-code-2` | `ui-icon-set --qr-code-2` ||
|| ![](./_images/icons-list/main/descending-sort.svg){width=24px height=24px} | `Main.DESCENDING_SORT` | `descending-sort` | `ui-icon-set --descending-sort` ||
|| ![](./_images/icons-list/main/ascending-sort.svg){width=24px height=24px} | `Main.ASCENDING_SORT` | `ascending-sort` | `ui-icon-set --ascending-sort` ||
|| ![](./_images/icons-list/main/chats-persons.svg){width=24px height=24px} | `Main.CHATS_PERSONS` | `chats-persons` | `ui-icon-set --chats-persons` ||
|| ![](./_images/icons-list/main/marketing.svg){width=24px height=24px} | `Main.MARKETING` | `marketing` | `ui-icon-set --marketing` ||
|| ![](./_images/icons-list/main/sigma-summ-a.svg){width=24px height=24px} | `Main.SIGMA_SUMM_A` | `sigma-summ-a` | `ui-icon-set --sigma-summ-a` ||
|| ![](./_images/icons-list/main/sigma-summ.svg){width=24px height=24px} | `Main.SIGMA_SUMM` | `sigma-summ` | `ui-icon-set --sigma-summ` ||
|| ![](./_images/icons-list/main/smile.svg){width=24px height=24px} | `Main.SMILE` | `smile` | `ui-icon-set --smile` ||
|| ![](./_images/icons-list/main/gantt-graphs.svg){width=24px height=24px} | `Main.GANTT_GRAPHS` | `gantt-graphs` | `ui-icon-set --gantt-graphs` ||
|| ![](./_images/icons-list/main/filter-plus.svg){width=24px height=24px} | `Main.FILTER_PLUS` | `filter-plus` | `ui-icon-set --filter-plus` ||
|| ![](./_images/icons-list/main/backspace.svg){width=24px height=24px} | `Main.BACKSPACE` | `backspace` | `ui-icon-set --backspace` ||
|| ![](./_images/icons-list/main/elements.svg){width=24px height=24px} | `Main.ELEMENTS` | `elements` | `ui-icon-set --elements` ||
|| ![](./_images/icons-list/main/book-opened-with-arrow.svg){width=24px height=24px} | `Main.BOOK_OPENED_WITH_ARROW` | `book-opened-with-arrow` | `ui-icon-set --book-opened-with-arrow` ||
|| ![](./_images/icons-list/main/double-arrow-counter-clockwise-scrum.svg){width=24px height=24px} | `Main.DOUBLE_ARROW_COUNTER_CLOCKWISE_SCRUM` | `double-arrow-counter-clockwise-scrum` | `ui-icon-set --double-arrow-counter-clockwise-scrum` ||
|| ![](./_images/icons-list/main/barcode.svg){width=24px height=24px} | `Main.BARCODE` | `barcode` | `ui-icon-set --barcode` ||
|| ![](./_images/icons-list/main/sad-bold-emoji.svg){width=24px height=24px} | `Main.SAD_BOLD_EMOJI` | `sad-bold-emoji` | `ui-icon-set --sad-bold-emoji` ||
|| ![](./_images/icons-list/main/brightness-bold-emoji.svg){width=24px height=24px} | `Main.BRIGHTNESS_BOLD_EMOJI` | `brightness-bold-emoji` | `ui-icon-set --brightness-bold-emoji` ||
|| ![](./_images/icons-list/main/sun.svg){width=24px height=24px} | `Main.SUN` | `sun` | `ui-icon-set --sun` ||
|| ![](./_images/icons-list/main/filial-network.svg){width=24px height=24px} | `Main.FILIAL_NETWORK` | `filial-network` | `ui-icon-set --filial-network` ||
|| ![](./_images/icons-list/main/arrow-line.svg){width=24px height=24px} | `Main.ARROW_LINE` | `arrow-line` | `ui-icon-set --arrow-line` ||
|| ![](./_images/icons-list/main/ip.svg){width=24px height=24px} | `Main.IP` | `ip` | `ui-icon-set --ip` ||
|| ![](./_images/icons-list/main/filter-1.svg){width=24px height=24px} | `Main.FILTER_1` | `filter-1` | `ui-icon-set --filter-1` ||
|| ![](./_images/icons-list/main/filter-2.svg){width=24px height=24px} | `Main.FILTER_2` | `filter-2` | `ui-icon-set --filter-2` ||
|| ![](./_images/icons-list/main/screen-1.svg){width=24px height=24px} | `Main.SCREEN_1` | `screen-1` | `ui-icon-set --screen-1` ||
|| ![](./_images/icons-list/main/screen-2.svg){width=24px height=24px} | `Main.SCREEN_2` | `screen-2` | `ui-icon-set --screen-2` ||
|| ![](./_images/icons-list/main/print-1.svg){width=24px height=24px} | `Main.PRINT_1` | `print-1` | `ui-icon-set --print-1` ||
|| ![](./_images/icons-list/main/print-2.svg){width=24px height=24px} | `Main.PRINT_2` | `print-2` | `ui-icon-set --print-2` ||
|| ![](./_images/icons-list/main/disk.svg){width=24px height=24px} | `Main.DISK` | `disk` | `ui-icon-set --disk` ||
|| ![](./_images/icons-list/main/shining.svg){width=24px height=24px} | `Main.SHINING` | `shining` | `ui-icon-set --shining` ||
|| ![](./_images/icons-list/main/shining-2.svg){width=24px height=24px} | `Main.SHINING_2` | `shining-2` | `ui-icon-set --shining-2` ||
|| ![](./_images/icons-list/main/plug.svg){width=24px height=24px} | `Main.PLUG` | `plug` | `ui-icon-set --plug` ||
|| ![](./_images/icons-list/main/paste.svg){width=24px height=24px} | `Main.PASTE` | `paste` | `ui-icon-set --paste` ||
|| ![](./_images/icons-list/main/crossed-eye-2.svg){width=24px height=24px} | `Main.CROSSED_EYE_2` | `crossed-eye-2` | `ui-icon-set --crossed-eye-2` ||
|| ![](./_images/icons-list/main/filter-by-name.svg){width=24px height=24px} | `Main.FILTER_BY_NAME` | `filter-by-name` | `ui-icon-set --filter-by-name` ||
|| ![](./_images/icons-list/main/descending-sort-names.svg){width=24px height=24px} | `Main.DESCENDING_SORT_NAMES` | `descending-sort-names` | `ui-icon-set --descending-sort-names` ||
|| ![](./_images/icons-list/main/table.svg){width=24px height=24px} | `Main.TABLE` | `table` | `ui-icon-set --table` ||
|| ![](./_images/icons-list/main/feed.svg){width=24px height=24px} | `Main.FEED` | `feed` | `ui-icon-set --feed` ||
|| ![](./_images/icons-list/main/mobile-with-star.svg){width=24px height=24px} | `Main.MOBILE_WITH_STAR` | `mobile-with-star` | `ui-icon-set --mobile-with-star` ||
|| ![](./_images/icons-list/main/rocket.svg){width=24px height=24px} | `Main.ROCKET` | `rocket` | `ui-icon-set --rocket` ||
|| ![](./_images/icons-list/main/city.svg){width=24px height=24px} | `Main.CITY` | `city` | `ui-icon-set --city` ||
|| ![](./_images/icons-list/main/magic-wand.svg){width=24px height=24px} | `Main.MAGIC_WAND` | `magic-wand` | `ui-icon-set --magic-wand` ||
|| ![](./_images/icons-list/main/magic-image.svg){width=24px height=24px} | `Main.MAGIC_IMAGE` | `magic-image` | `ui-icon-set --magic-image` ||
|| ![](./_images/icons-list/main/ai.svg){width=24px height=24px} | `Main.AI` | `ai` | `ui-icon-set --ai` ||
|| ![](./_images/icons-list/main/earth.svg){width=24px height=24px} | `Main.EARTH` | `earth` | `ui-icon-set --earth` ||
|| ![](./_images/icons-list/main/share-1.svg){width=24px height=24px} | `Main.SHARE_1` | `share-1` | `ui-icon-set --share-1` ||
|| ![](./_images/icons-list/main/share-2.svg){width=24px height=24px} | `Main.SHARE_2` | `share-2` | `ui-icon-set --share-2` ||
|| ![](./_images/icons-list/main/mail.svg){width=24px height=24px} | `Main.MAIL` | `mail` | `ui-icon-set --mail` ||
|| ![](./_images/icons-list/main/eraser.svg){width=24px height=24px} | `Main.ERASER` | `eraser` | `ui-icon-set --eraser` ||
|| ![](./_images/icons-list/main/demonstration-on-1.svg){width=24px height=24px} | `Main.DEMONSTRATION_ON_1` | `demonstration-on-1` | `ui-icon-set --demonstration-on-1` ||
|| ![](./_images/icons-list/main/demonstration-off.svg){width=24px height=24px} | `Main.DEMONSTRATION_OFF` | `demonstration-off` | `ui-icon-set --demonstration-off` ||
|| ![](./_images/icons-list/main/file-check-1.svg){width=24px height=24px} | `Main.FILE_CHECK_1` | `file-check-1` | `ui-icon-set --file-check-1` ||
|| ![](./_images/icons-list/main/delete-hyperlink.svg){width=24px height=24px} | `Main.DELETE_HYPERLINK` | `delete-hyperlink` | `ui-icon-set --delete-hyperlink` ||
|| ![](./_images/icons-list/main/insert-hyperlink.svg){width=24px height=24px} | `Main.INSERT_HYPERLINK` | `insert-hyperlink` | `ui-icon-set --insert-hyperlink` ||
|| ![](./_images/icons-list/main/link-3.svg){width=24px height=24px} | `Main.LINK_3` | `link-3` | `ui-icon-set --link-3` ||
|| ![](./_images/icons-list/main/screen-arrow.svg){width=24px height=24px} | `Main.SCREEN_ARROW` | `screen-arrow` | `ui-icon-set --screen-arrow` ||
|| ![](./_images/icons-list/main/opened-letter-mail.svg){width=24px height=24px} | `Main.OPENED_LETTER_MAIL` | `opened-letter-mail` | `ui-icon-set --opened-letter-mail` ||
|| ![](./_images/icons-list/main/sitemap.svg){width=24px height=24px} | `Main.SITEMAP` | `sitemap` | `ui-icon-set --sitemap` ||
|| ![](./_images/icons-list/main/notifications-on.svg){width=24px height=24px} | `Main.NOTIFICATIONS_ON` | `notifications-on` | `ui-icon-set --notifications-on` ||
|| ![](./_images/icons-list/main/notifications-off.svg){width=24px height=24px} | `Main.NOTIFICATIONS_OFF` | `notifications-off` | `ui-icon-set --notifications-off` ||
|| ![](./_images/icons-list/main/a-letter.svg){width=24px height=24px} | `Main.A_LETTER` | `a-letter` | `ui-icon-set --a-letter` ||
|| ![](./_images/icons-list/main/topic.svg){width=24px height=24px} | `Main.TOPIC` | `topic` | `ui-icon-set --topic` ||
|| ![](./_images/icons-list/main/full-battery.svg){width=24px height=24px} | `Main.FULL_BATTERY` | `full-battery` | `ui-icon-set --full-battery` ||
|| ![](./_images/icons-list/main/battery-2-sticks.svg){width=24px height=24px} | `Main.BATTERY_2_STICKS` | `battery-2-sticks` | `ui-icon-set --battery-2-sticks` ||
|| ![](./_images/icons-list/main/battery-1-stick.svg){width=24px height=24px} | `Main.BATTERY_1_STICK` | `battery-1-stick` | `ui-icon-set --battery-1-stick` ||
|| ![](./_images/icons-list/main/low-battery.svg){width=24px height=24px} | `Main.LOW_BATTERY` | `low-battery` | `ui-icon-set --low-battery` ||
|| ![](./_images/icons-list/main/dead-battery.svg){width=24px height=24px} | `Main.DEAD_BATTERY` | `dead-battery` | `ui-icon-set --dead-battery` ||
|| ![](./_images/icons-list/main/document-plus.svg){width=24px height=24px} | `Main.DOCUMENT_PLUS` | `document-plus` | `ui-icon-set --document-plus` ||
|| ![](./_images/icons-list/main/demonstration-on-2.svg){width=24px height=24px} | `Main.DEMONSTRATION_ON_2` | `demonstration-on-2` | `ui-icon-set --demonstration-on-2` ||
|| ![](./_images/icons-list/main/receipt-1.svg){width=24px height=24px} | `Main.RECEIPT_1` | `receipt-1` | `ui-icon-set --receipt-1` ||
|| ![](./_images/icons-list/main/receipt-2.svg){width=24px height=24px} | `Main.RECEIPT_2` | `receipt-2` | `ui-icon-set --receipt-2` ||
|| ![](./_images/icons-list/main/cart-with-cursor.svg){width=24px height=24px} | `Main.CART_WITH_CURSOR` | `cart-with-cursor` | `ui-icon-set --cart-with-cursor` ||
|| ![](./_images/icons-list/main/expand.svg){width=24px height=24px} | `Main.EXPAND` | `expand` | `ui-icon-set --expand` ||
|| ![](./_images/icons-list/main/gift.svg){width=24px height=24px} | `Main.GIFT` | `gift` | `ui-icon-set --gift` ||
|| ![](./_images/icons-list/main/more-points.svg){width=24px height=24px} | `Main.MORE_POINTS` | `more-points` | `ui-icon-set --more-points` ||
|| ![](./_images/icons-list/main/pin-1.svg){width=24px height=24px} | `Main.PIN_1` | `pin-1` | `ui-icon-set --pin-1` ||
|| ![](./_images/icons-list/main/more-information.svg){width=24px height=24px} | `Main.MORE_INFORMATION` | `more-information` | `ui-icon-set --more-information` ||
|| ![](./_images/icons-list/main/markers.svg){width=24px height=24px} | `Main.MARKERS` | `markers` | `ui-icon-set --markers` ||
|| ![](./_images/icons-list/main/feed-bold.svg){width=24px height=24px} | `Main.FEED_BOLD` | `feed-bold` | `ui-icon-set --feed-bold` ||
|| ![](./_images/icons-list/main/stop-hand.svg){width=24px height=24px} | `Main.STOP_HAND` | `stop-hand` | `ui-icon-set --stop-hand` ||
|| ![](./_images/icons-list/main/target-1.svg){width=24px height=24px} | `Main.TARGET_1` | `target-1` | `ui-icon-set --target-1` ||
|| ![](./_images/icons-list/main/mail-out.svg){width=24px height=24px} | `Main.MAIL_OUT` | `mail-out` | `ui-icon-set --mail-out` ||
|| ![](./_images/icons-list/main/mail-in.svg){width=24px height=24px} | `Main.MAIL_IN` | `mail-in` | `ui-icon-set --mail-in` ||
|| ![](./_images/icons-list/main/mail-money.svg){width=24px height=24px} | `Main.MAIL_MONEY` | `mail-money` | `ui-icon-set --mail-money` ||
|| ![](./_images/icons-list/main/unpin.svg){width=24px height=24px} | `Main.UNPIN` | `unpin` | `ui-icon-set --unpin` ||
|| ![](./_images/icons-list/main/attention-i-circle.svg){width=24px height=24px} | `Main.ATTENTION_I_CIRCLE` | `attention-i-circle` | `ui-icon-set --attention-i-circle` ||
|| ![](./_images/icons-list/main/info-1.svg){width=24px height=24px} | `Main.INFO_1` | `info-1` | `ui-icon-set --info-1` ||
|| ![](./_images/icons-list/main/attention-i-black.svg){width=24px height=24px} | `Main.ATTENTION_I_BLACK` | `attention-i-black` | `ui-icon-set --attention-i-black` ||
|| ![](./_images/icons-list/main/menu.svg){width=24px height=24px} | `Main.MENU` | `menu` | `ui-icon-set --menu` ||
|| ![](./_images/icons-list/main/waves.svg){width=24px height=24px} | `Main.WAVES` | `waves` | `ui-icon-set --waves` ||
|| ![](./_images/icons-list/main/mail-reply.svg){width=24px height=24px} | `Main.MAIL_REPLY` | `mail-reply` | `ui-icon-set --mail-reply` ||
|| ![](./_images/icons-list/main/mail-2.svg){width=24px height=24px} | `Main.MAIL_2` | `mail-2` | `ui-icon-set --mail-2` ||
|| ![](./_images/icons-list/main/mail-read.svg){width=24px height=24px} | `Main.MAIL_READ` | `mail-read` | `ui-icon-set --mail-read` ||
|| ![](./_images/icons-list/main/quote.svg){width=24px height=24px} | `Main.QUOTE` | `quote` | `ui-icon-set --quote` ||
|| ![](./_images/icons-list/main/new-message-mail.svg){width=24px height=24px} | `Main.NEW_MESSAGE_MAIL` | `new-message-mail` | `ui-icon-set --new-message-mail` ||
|| ![](./_images/icons-list/main/indent.svg){width=24px height=24px} | `Main.INDENT` | `indent` | `ui-icon-set --indent` ||
|| ![](./_images/icons-list/main/outdent.svg){width=24px height=24px} | `Main.OUTDENT` | `outdent` | `ui-icon-set --outdent` ||
|| ![](./_images/icons-list/main/distribution.svg){width=24px height=24px} | `Main.DISTRIBUTION` | `distribution` | `ui-icon-set --distribution` ||
|| ![](./_images/icons-list/main/menu-point.svg){width=24px height=24px} | `Main.MENU_POINT` | `menu-point` | `ui-icon-set --menu-point` ||
|| ![](./_images/icons-list/main/lines-text.svg){width=24px height=24px} | `Main.LINES_TEXT` | `lines-text` | `ui-icon-set --lines-text` ||
|| ![](./_images/icons-list/main/diamond.svg){width=24px height=24px} | `Main.DIAMOND` | `diamond` | `ui-icon-set --diamond` ||
|| ![](./_images/icons-list/main/bottom.svg){width=24px height=24px} | `Main.BOTTOM` | `bottom` | `ui-icon-set --bottom` ||
|| ![](./_images/icons-list/main/numbers-123.svg){width=24px height=24px} | `Main.NUMBERS_123` | `numbers-123` | `ui-icon-set --numbers-123` ||
|| ![](./_images/icons-list/main/cursor-click.svg){width=24px height=24px} | `Main.CURSOR_CLICK` | `cursor-click` | `ui-icon-set --cursor-click` ||
|| ![](./_images/icons-list/main/flag-with-cross.svg){width=24px height=24px} | `Main.FLAG_WITH_CROSS` | `flag-with-cross` | `ui-icon-set --flag-with-cross` ||
|| ![](./_images/icons-list/main/temp-1.svg){width=24px height=24px} | `Main.TEMP_1` | `temp-1` | `ui-icon-set --temp-1` ||
|| ![](./_images/icons-list/main/temp-2.svg){width=24px height=24px} | `Main.TEMP_2` | `temp-2` | `ui-icon-set --temp-2` ||
|| ![](./_images/icons-list/main/calendar-1.svg){width=24px height=24px} | `Main.CALENDAR_1` | `calendar-1` | `ui-icon-set --calendar-1` ||
|| ![](./_images/icons-list/main/calendar-24.svg){width=24px height=24px} | `Main.CALENDAR_24` | `calendar-24` | `ui-icon-set --calendar-24` ||
|| ![](./_images/icons-list/main/window.svg){width=24px height=24px} | `Main.WINDOW` | `window` | `ui-icon-set --window` ||
|| ![](./_images/icons-list/main/planning.svg){width=24px height=24px} | `Main.PLANNING` | `planning` | `ui-icon-set --planning` ||
|| ![](./_images/icons-list/main/sort-calendar.svg){width=24px height=24px} | `Main.SORT_CALENDAR` | `sort-calendar` | `ui-icon-set --sort-calendar` ||
|| ![](./_images/icons-list/main/calendar-deadline.svg){width=24px height=24px} | `Main.CALENDAR_DEADLINE` | `calendar-deadline` | `ui-icon-set --calendar-deadline` ||
|| ![](./_images/icons-list/main/sort-activity.svg){width=24px height=24px} | `Main.SORT_ACTIVITY` | `sort-activity` | `ui-icon-set --sort-activity` ||
|| ![](./_images/icons-list/main/planning-2.svg){width=24px height=24px} | `Main.PLANNING_2` | `planning-2` | `ui-icon-set --planning-2` ||
|| ![](./_images/icons-list/main/my-plan.svg){width=24px height=24px} | `Main.MY_PLAN` | `my-plan` | `ui-icon-set --my-plan` ||
|| ![](./_images/icons-list/main/calendar-off.svg){width=24px height=24px} | `Main.CALENDAR_OFF` | `calendar-off` | `ui-icon-set --calendar-off` ||
|| ![](./_images/icons-list/main/signal-wifi.svg){width=24px height=24px} | `Main.SIGNAL_WIFI` | `signal-wifi` | `ui-icon-set --signal-wifi` ||
|| ![](./_images/icons-list/main/signal-wifi-off.svg){width=24px height=24px} | `Main.SIGNAL_WIFI_OFF` | `signal-wifi-off` | `ui-icon-set --signal-wifi-off` ||
|| ![](./_images/icons-list/main/img-format.svg){width=24px height=24px} | `Main.IMG_FORMAT` | `img-format` | `ui-icon-set --img-format` ||
|| ![](./_images/icons-list/main/attach-2.svg){width=24px height=24px} | `Main.ATTACH_2` | `attach-2` | `ui-icon-set --attach-2` ||
|| ![](./_images/icons-list/main/crm.svg){width=24px height=24px} | `Main.CRM` | `crm` | `ui-icon-set --crm` ||
|| ![](./_images/icons-list/main/apps.svg){width=24px height=24px} | `Main.APPS` | `apps` | `ui-icon-set --apps` ||
|| ![](./_images/icons-list/main/templates.svg){width=24px height=24px} | `Main.TEMPLATES` | `templates` | `ui-icon-set --templates` ||
|| ![](./_images/icons-list/main/hr-automation.svg){width=24px height=24px} | `Main.HR_AUTOMATION` | `hr-automation` | `ui-icon-set --hr-automation` ||
|| ![](./_images/icons-list/main/sites-stores.svg){width=24px height=24px} | `Main.SITES_STORES` | `sites-stores` | `ui-icon-set --sites-stores` ||
|| ![](./_images/icons-list/main/1c.svg){width=24px height=24px} | `Main.C1` | `1c` | `ui-icon-set --1c` ||
|| ![](./_images/icons-list/main/refresh.svg){width=24px height=24px} | `Main.REFRESH` | `refresh` | `ui-icon-set --refresh` ||
|| ![](./_images/icons-list/main/subscription.svg){width=24px height=24px} | `Main.SUBSCRIPTION` | `subscription` | `ui-icon-set --subscription` ||
|| ![](./_images/icons-list/main/settings.svg){width=24px height=24px} | `Main.SETTINGS` | `settings` | `ui-icon-set --settings` ||
|| ![](./_images/icons-list/main/services.svg){width=24px height=24px} | `Main.SERVICES` | `services` | `ui-icon-set --services` ||
|| ![](./_images/icons-list/main/graphs-diagram.svg){width=24px height=24px} | `Main.GRAPHS_DIAGRAM` | `graphs-diagram` | `ui-icon-set --graphs-diagram` ||
|| ![](./_images/icons-list/main/open-book.svg){width=24px height=24px} | `Main.OPEN_BOOK` | `open-book` | `ui-icon-set --open-book` ||
|| ![](./_images/icons-list/main/robot.svg){width=24px height=24px} | `Main.ROBOT` | `robot` | `ui-icon-set --robot` ||
|| ![](./_images/icons-list/main/developer-resources.svg){width=24px height=24px} | `Main.DEVELOPER_RESOURCES` | `developer-resources` | `ui-icon-set --developer-resources` ||
|| ![](./_images/icons-list/main/cash-terminal.svg){width=24px height=24px} | `Main.CASH_TERMINAL` | `cash-terminal` | `ui-icon-set --cash-terminal` ||
|| ![](./_images/icons-list/main/clock-black-white.svg){width=24px height=24px} | `Main.CLOCK_BLACK_WHITE` | `clock-black-white` | `ui-icon-set --clock-black-white` ||
|| ![](./_images/icons-list/main/inventory-management.svg){width=24px height=24px} | `Main.INVENTORY_MANAGEMENT` | `inventory-management` | `ui-icon-set --inventory-management` ||
|| ![](./_images/icons-list/main/collaboration.svg){width=24px height=24px} | `Main.COLLABORATION` | `collaboration` | `ui-icon-set --collaboration` ||
|| ![](./_images/icons-list/main/document.svg){width=24px height=24px} | `Main.DOCUMENT` | `document` | `ui-icon-set --document` ||
|| ![](./_images/icons-list/main/check-receipt.svg){width=24px height=24px} | `Main.CHECK_RECEIPT` | `check-receipt` | `ui-icon-set --check-receipt` ||
|| ![](./_images/icons-list/main/calculator.svg){width=24px height=24px} | `Main.CALCULATOR` | `calculator` | `ui-icon-set --calculator` ||
|| ![](./_images/icons-list/main/switch.svg){width=24px height=24px} | `Main.SWITCH` | `switch` | `ui-icon-set --switch` ||
|| ![](./_images/icons-list/main/sequential-queue.svg){width=24px height=24px} | `Main.SEQUENTIAL_QUEUE` | `sequential-queue` | `ui-icon-set --sequential-queue` ||
|| ![](./_images/icons-list/main/parallel-queue.svg){width=24px height=24px} | `Main.PARALLEL_QUEUE` | `parallel-queue` | `ui-icon-set --parallel-queue` ||
|| ![](./_images/icons-list/main/condition.svg){width=24px height=24px} | `Main.CONDITION` | `condition` | `ui-icon-set --condition` ||
|| ![](./_images/icons-list/main/complete.svg){width=24px height=24px} | `Main.COMPLETE` | `complete` | `ui-icon-set --complete` ||
|| ![](./_images/icons-list/main/translation.svg){width=24px height=24px} | `Main.TRANSLATION` | `translation` | `ui-icon-set --translation` ||
|| ![](./_images/icons-list/main/torrent.svg){width=24px height=24px} | `Main.TORRENT` | `torrent` | `ui-icon-set --torrent` ||
|| ![](./_images/icons-list/main/activity.svg){width=24px height=24px} | `Main.ACTIVITY` | `activity` | `ui-icon-set --activity` ||
|| ![](./_images/icons-list/main/add-to-checklist.svg){width=24px height=24px} | `Main.ADD_TO_CHECKLIST` | `add-to-checklist` | `ui-icon-set --add-to-checklist` ||
|| ![](./_images/icons-list/main/bp.svg){width=24px height=24px} | `Main.BP` | `bp` | `ui-icon-set --bp` ||
|| ![](./_images/icons-list/main/close-chat.svg){width=24px height=24px} | `Main.CLOSE_CHAT` | `close-chat` | `ui-icon-set --close-chat` ||
|| ![](./_images/icons-list/main/create-prompt.svg){width=24px height=24px} | `Main.CREATE_PROMPT` | `create-prompt` | `ui-icon-set --create-prompt` ||
|| ![](./_images/icons-list/main/devices.svg){width=24px height=24px} | `Main.DEVICES` | `devices` | `ui-icon-set --devices` ||
|| ![](./_images/icons-list/main/document-sign.svg){width=24px height=24px} | `Main.DOCUMENT_SIGN` | `document-sign` | `ui-icon-set --document-sign` ||
|| ![](./_images/icons-list/main/favourite-prompt.svg){width=24px height=24px} | `Main.FAVOURITE_PROMPT` | `favourite-prompt` | `ui-icon-set --favourite-prompt` ||
|| ![](./_images/icons-list/main/lines-vertical.svg){width=24px height=24px} | `Main.LINES_VERTICAL` | `lines-vertical` | `ui-icon-set --lines-vertical` ||
|| ![](./_images/icons-list/main/main.svg){width=24px height=24px} | `Main.MAIN` | `main` | `ui-icon-set --main` ||
|| ![](./_images/icons-list/main/move-to-checklist.svg){width=24px height=24px} | `Main.MOVE_TO_CHECKLIST` | `move-to-checklist` | `ui-icon-set --move-to-checklist` ||
|| ![](./_images/icons-list/main/open-chat.svg){width=24px height=24px} | `Main.OPEN_CHAT` | `open-chat` | `ui-icon-set --open-chat` ||
|| ![](./_images/icons-list/main/prompt.svg){width=24px height=24px} | `Main.PROMPT` | `prompt` | `ui-icon-set --prompt` ||
|| ![](./_images/icons-list/main/prompt-var.svg){width=24px height=24px} | `Main.PROMPT_VAR` | `prompt-var` | `ui-icon-set --prompt-var` ||
|| ![](./_images/icons-list/main/prompts-library.svg){width=24px height=24px} | `Main.PROMPTS_LIBRARY` | `prompts-library` | `ui-icon-set --prompts-library` ||
|| ![](./_images/icons-list/main/record-video.svg){width=24px height=24px} | `Main.RECORD_VIDEO` | `record-video` | `ui-icon-set --record-video` ||
|| ![](./_images/icons-list/main/roles-library.svg){width=24px height=24px} | `Main.ROLES_LIBRARY` | `roles-library` | `ui-icon-set --roles-library` ||
|| ![](./_images/icons-list/main/save-prompt.svg){width=24px height=24px} | `Main.SAVE_PROMPT` | `save-prompt` | `ui-icon-set --save-prompt` ||
|| ![](./_images/icons-list/main/screen-share.svg){width=24px height=24px} | `Main.SCREEN_SHARE` | `screen-share` | `ui-icon-set --screen-share` ||
|| ![](./_images/icons-list/main/sub-point.svg){width=24px height=24px} | `Main.SUB_POINT` | `sub-point` | `ui-icon-set --sub-point` ||
|| ![](./_images/icons-list/main/unsub-point.svg){width=24px height=24px} | `Main.UNSUB_POINT` | `unsub-point` | `ui-icon-set --unsub-point` ||
|| ![](./_images/icons-list/main/subtask.svg){width=24px height=24px} | `Main.SUB_TASK` | `subtask` | `ui-icon-set --subtask` ||
|| ![](./_images/icons-list/main/collab.svg){width=24px height=24px} | `Main.COLLAB` | `collab` | `ui-icon-set --collab` ||
|| ![](./_images/icons-list/main/no-picture.svg){width=24px height=24px} | `Main.NO_PICTURE` | `no-picture` | `ui-icon-set --no-picture` ||
|| ![](./_images/icons-list/main/thread.svg){width=24px height=24px} | `Main.THREAD` | `thread` | `ui-icon-set --thread` ||
|| ![](./_images/icons-list/main/thread-single.svg){width=24px height=24px} | `Main.THREAD_SINGLE` | `thread-single` | `ui-icon-set --thread-single` ||
|| ![](./_images/icons-list/main/business-process-1.svg){width=24px height=24px} | `Main.BUSINESS_PROCESS_1` | `business-process-1` | `ui-icon-set --business-process-1` ||
|| ![](./_images/icons-list/main/waiting-points.svg){width=24px height=24px} | `Main.WAITING_POINTS` | `waiting-points` | `ui-icon-set --waiting-points` ||
|| ![](./_images/icons-list/main/waiting-list.svg){width=24px height=24px} | `Main.WAITING_LIST` | `waiting-list` | `ui-icon-set --waiting-list` ||
|| ![](./_images/icons-list/main/link-bold.svg){width=24px height=24px} | `Main.LINK_BOLD` | `link-bold` | `ui-icon-set --link-bold` ||
|| ![](./_images/icons-list/main/note.svg){width=24px height=24px} | `Main.NOTE` | `note` | `ui-icon-set --note` ||
|| ![](./_images/icons-list/main/edit-menu.svg){width=24px height=24px} | `Main.EDIT_MENU` | `edit-menu` | `ui-icon-set --edit-menu` ||
|| ![](./_images/icons-list/main/demonstration-graphics.svg){width=24px height=24px} | `Main.DEMONSTRATION_GRAPHICS` | `demonstration-graphics` | `ui-icon-set --demonstration-graphics` ||
|| ![](./_images/icons-list/main/calendar-check.svg){width=24px height=24px} | `Main.CALENDAR_CHECK` | `calendar-check` | `ui-icon-set --calendar-check` ||
|| ![](./_images/icons-list/main/sign.svg){width=24px height=24px} | `Main.SIGN` | `sign` | `ui-icon-set --sign` ||
|| ![](./_images/icons-list/main/flipchart.svg){width=24px height=24px} | `Main.FLIPCHART` | `flipchart` | `ui-icon-set --flipchart` ||
|| ![](./_images/icons-list/main/numbers-05.svg){width=24px height=24px} | `Main.NUMBERS_05` | `numbers-05` | `ui-icon-set --numbers-05` ||
|| ![](./_images/icons-list/main/demonstration-graphics-2.svg){width=24px height=24px} | `Main.DEMONSTRATION_GRAPHICS_2` | `demonstration-graphics-2` | `ui-icon-set --demonstration-graphics-2` ||
|| ![](./_images/icons-list/main/earth-time.svg){width=24px height=24px} | `Main.EARTH_TIME` | `earth-time` | `ui-icon-set --earth-time` ||
|#

{% endcut %}

{% cut "Social" %}

CSS-расширение: `ui.icon-set.social`.

#|
|| **Иконка** | **Константа** | **Значение** | **HTML-класс** ||
|| ![](./_images/icons-list/social/cloud-sifre.svg){width=24px height=24px} | `Social.CLOUD_SIFRE` | `cloud-sifre` | `ui-icon-set --cloud-sifre` ||
|| ![](./_images/icons-list/social/vk-lists.svg){width=24px height=24px} | `Social.VK_LISTS` | `vk-lists` | `ui-icon-set --vk-lists` ||
|| ![](./_images/icons-list/social/telegram-in-circle-1.svg){width=24px height=24px} | `Social.TELEGRAM_IN_CIRCLE_1` | `telegram-in-circle-1` | `ui-icon-set --telegram-in-circle-1` ||
|| ![](./_images/icons-list/social/telegram.svg){width=24px height=24px} | `Social.TELEGRAM` | `telegram` | `ui-icon-set --telegram` ||
|| ![](./_images/icons-list/social/telegram-in-circle.svg){width=24px height=24px} | `Social.TELEGRAM_IN_CIRCLE` | `telegram-in-circle` | `ui-icon-set --telegram-in-circle` ||
|| ![](./_images/icons-list/social/snowflake.svg){width=24px height=24px} | `Social.SNOWFLAKE` | `snowflake` | `ui-icon-set --snowflake` ||
|| ![](./_images/icons-list/social/globe.svg){width=24px height=24px} | `Social.GLOBE` | `globe` | `ui-icon-set --globe` ||
|| ![](./_images/icons-list/social/vk.svg){width=24px height=24px} | `Social.VK` | `vk` | `ui-icon-set --vk` ||
|| ![](./_images/icons-list/social/avito.svg){width=24px height=24px} | `Social.AVITO` | `avito` | `ui-icon-set --avito` ||
|| ![](./_images/icons-list/social/odnoklassniki.svg){width=24px height=24px} | `Social.ODNOKLASSNIKI` | `odnoklassniki` | `ui-icon-set --odnoklassniki` ||
|| ![](./_images/icons-list/social/shape-1.svg){width=24px height=24px} | `Social.SHAPE_1` | `shape-1` | `ui-icon-set --shape-1` ||
|| ![](./_images/icons-list/social/kik.svg){width=24px height=24px} | `Social.KIK` | `kik` | `ui-icon-set --kik` ||
|| ![](./_images/icons-list/social/slack.svg){width=24px height=24px} | `Social.SLACK` | `slack` | `ui-icon-set --slack` ||
|| ![](./_images/icons-list/social/messenger-meta.svg){width=24px height=24px} | `Social.MESSENGER_META` | `messenger-meta` | `ui-icon-set --messenger-meta` ||
|| ![](./_images/icons-list/social/messenger.svg){width=24px height=24px} | `Social.MESSENGER` | `messenger` | `ui-icon-set --messenger` ||
|| ![](./_images/icons-list/social/vk-shop.svg){width=24px height=24px} | `Social.VK_SHOP` | `vk-shop` | `ui-icon-set --vk-shop` ||
|| ![](./_images/icons-list/social/windows.svg){width=24px height=24px} | `Social.WINDOWS` | `windows` | `ui-icon-set --windows` ||
|| ![](./_images/icons-list/social/call-infomation.svg){width=24px height=24px} | `Social.CALL_INFOMATION` | `call-infomation` | `ui-icon-set --call-infomation` ||
|| ![](./_images/icons-list/social/evernote.svg){width=24px height=24px} | `Social.EVERNOTE` | `evernote` | `ui-icon-set --evernote` ||
|| ![](./_images/icons-list/social/google-ads.svg){width=24px height=24px} | `Social.GOOGLE_ADS` | `google-ads` | `ui-icon-set --google-ads` ||
|| ![](./_images/icons-list/social/shape.svg){width=24px height=24px} | `Social.SHAPE` | `shape` | `ui-icon-set --shape` ||
|| ![](./_images/icons-list/social/window-screen.svg){width=24px height=24px} | `Social.WINDOW_SCREEN` | `window-screen` | `ui-icon-set --window-screen` ||
|| ![](./_images/icons-list/social/edna.svg){width=24px height=24px} | `Social.EDNA` | `edna` | `ui-icon-set --edna` ||
|| ![](./_images/icons-list/social/chats-24.svg){width=24px height=24px} | `Social.CHATS_24` | `chats-24` | `ui-icon-set --chats-24` ||
|| ![](./_images/icons-list/social/chats-computer.svg){width=24px height=24px} | `Social.CHATS_COMPUTER` | `chats-computer` | `ui-icon-set --chats-computer` ||
|| ![](./_images/icons-list/social/apple-and-ios.svg){width=24px height=24px} | `Social.APPLE_AND_IOS` | `apple-and-ios` | `ui-icon-set --apple-and-ios` ||
|| ![](./_images/icons-list/social/android.svg){width=24px height=24px} | `Social.ANDROID` | `android` | `ui-icon-set --android` ||
|| ![](./_images/icons-list/social/zoom.svg){width=24px height=24px} | `Social.ZOOM` | `zoom` | `ui-icon-set --zoom` ||
|| ![](./_images/icons-list/social/linux.svg){width=24px height=24px} | `Social.LINUX` | `linux` | `ui-icon-set --linux` ||
|#

{% endcut %}

{% cut "ContactCenter" %}

CSS-расширение: `ui.icon-set.contact-center`.

#|
|| **Иконка** | **Константа** | **Значение** | **HTML-класс** ||
|| ![](./_images/icons-list/contact-center/dial-5.svg){width=24px height=24px} | `ContactCenter.DIAL_5` | `dial-5` | `ui-icon-set --dial-5` ||
|| ![](./_images/icons-list/contact-center/dial-10.svg){width=24px height=24px} | `ContactCenter.DIAL_10` | `dial-10` | `ui-icon-set --dial-10` ||
|| ![](./_images/icons-list/contact-center/call-forwarding.svg){width=24px height=24px} | `ContactCenter.CALL_FORWARDING` | `call-forwarding` | `ui-icon-set --call-forwarding` ||
|| ![](./_images/icons-list/contact-center/mobile-store.svg){width=24px height=24px} | `ContactCenter.MOBILE_STORE` | `mobile-store` | `ui-icon-set --mobile-store` ||
|| ![](./_images/icons-list/contact-center/mail-sent.svg){width=24px height=24px} | `ContactCenter.MAIL_SENT` | `mail-sent` | `ui-icon-set --mail-sent` ||
|| ![](./_images/icons-list/contact-center/incoming-call-sound-on.svg){width=24px height=24px} | `ContactCenter.INCOMING_CALL_SOUND_ON` | `incoming-call-sound-on` | `ui-icon-set --incoming-call-sound-on` ||
|| ![](./_images/icons-list/contact-center/send-attach-file.svg){width=24px height=24px} | `ContactCenter.SEND_ATTACH_FILE` | `send-attach-file` | `ui-icon-set --send-attach-file` ||
|#

{% endcut %}

{% cut "CRM" %}

CSS-расширение: `ui.icon-set.crm`.

#|
|| **Иконка** | **Константа** | **Значение** | **HTML-класс** ||
|| ![](./_images/icons-list/crm/send-contact.svg){width=24px height=24px} | `CRM.SEND_CONTACT` | `send-contact` | `ui-icon-set --send-contact` ||
|| ![](./_images/icons-list/crm/book-open.svg){width=24px height=24px} | `CRM.BOOK_OPEN` | `book-open` | `ui-icon-set --book-open` ||
|| ![](./_images/icons-list/crm/funnel-1.svg){width=24px height=24px} | `CRM.funnel_1` | `funnel-1` | `ui-icon-set --funnel-1` ||
|| ![](./_images/icons-list/crm/crm-search.svg){width=24px height=24px} | `CRM.CRM_SEARCH` | `crm-search` | `ui-icon-set --crm-search` ||
|| ![](./_images/icons-list/crm/refresh-9.svg){width=24px height=24px} | `CRM.REFRESH_9` | `refresh-9` | `ui-icon-set --refresh-9` ||
|| ![](./_images/icons-list/crm/check-in-box.svg){width=24px height=24px} | `CRM.CHECK_IN_BOX` | `check-in-box` | `ui-icon-set --check-in-box` ||
|| ![](./_images/icons-list/crm/arrows-meet.svg){width=24px height=24px} | `CRM.ARROWS_MEET` | `arrows-meet` | `ui-icon-set --arrows-meet` ||
|| ![](./_images/icons-list/crm/chat-line.svg){width=24px height=24px} | `CRM.CHAT_LINE` | `chat-line` | `ui-icon-set --chat-line` ||
|| ![](./_images/icons-list/crm/commercial-offer.svg){width=24px height=24px} | `CRM.COMMERCIAL_OFFER` | `commercial-offer` | `ui-icon-set --commercial-offer` ||
|| ![](./_images/icons-list/crm/funnels.svg){width=24px height=24px} | `CRM.FUNNELS` | `funnels` | `ui-icon-set --funnels` ||
|| ![](./_images/icons-list/crm/item.svg){width=24px height=24px} | `CRM.ITEM` | `item` | `ui-icon-set --item` ||
|| ![](./_images/icons-list/crm/proposal-settings.svg){width=24px height=24px} | `CRM.PROPOSAL_SETTINGS` | `proposal-settings` | `ui-icon-set --proposal-settings` ||
|| ![](./_images/icons-list/crm/proposal-done.svg){width=24px height=24px} | `CRM.PROPOSAL_DONE` | `proposal-done` | `ui-icon-set --proposal-done` ||
|| ![](./_images/icons-list/crm/proposal.svg){width=24px height=24px} | `CRM.PROPOSAL` | `proposal` | `ui-icon-set --proposal` ||
|| ![](./_images/icons-list/crm/crm-group.svg){width=24px height=24px} | `CRM.CRM_GROUP` | `crm-group` | `ui-icon-set --crm-group` ||
|| ![](./_images/icons-list/crm/contact.svg){width=24px height=24px} | `CRM.CONTACT` | `contact` | `ui-icon-set --contact` ||
|| ![](./_images/icons-list/crm/lead.svg){width=24px height=24px} | `CRM.LEAD` | `lead` | `ui-icon-set --lead` ||
|| ![](./_images/icons-list/crm/invoice.svg){width=24px height=24px} | `CRM.INVOICE` | `invoice` | `ui-icon-set --invoice` ||
|| ![](./_images/icons-list/crm/stages.svg){width=24px height=24px} | `CRM.STAGES` | `stages` | `ui-icon-set --stages` ||
|| ![](./_images/icons-list/crm/exclusion-list.svg){width=24px height=24px} | `CRM.EXCLUSION_LIST` | `exclusion-list` | `ui-icon-set --exclusion-list` ||
|| ![](./_images/icons-list/crm/open-channels.svg){width=24px height=24px} | `CRM.OPEN_CHANNELS` | `open-channels` | `ui-icon-set --open-channels` ||
|| ![](./_images/icons-list/crm/approved-list-crm-checked_1.svg){width=24px height=24px} | `CRM.APPROVED_LIST` | `approved-list crm-checked_1` | `ui-icon-set --approved-list crm-checked_1` ||
|| ![](./_images/icons-list/crm/company.svg){width=24px height=24px} | `CRM.COMPANY` | `company` | `ui-icon-set --company` ||
|| ![](./_images/icons-list/crm/copy-file.svg){width=24px height=24px} | `CRM.COPY_FILE` | `copy-file` | `ui-icon-set --copy-file` ||
|| ![](./_images/icons-list/crm/gird.svg){width=24px height=24px} | `CRM.GIRD` | `gird` | `ui-icon-set --gird` ||
|| ![](./_images/icons-list/crm/funnel-2.svg){width=24px height=24px} | `CRM.FUNNEL_2` | `funnel-2` | `ui-icon-set --funnel-2` ||
|| ![](./_images/icons-list/crm/stage.svg){width=24px height=24px} | `CRM.STAGE` | `stage` | `ui-icon-set --stage` ||
|| ![](./_images/icons-list/crm/customer-card.svg){width=24px height=24px} | `CRM.CUSTOMER_CARD` | `customer-card` | `ui-icon-set --customer-card` ||
|| ![](./_images/icons-list/crm/smart-activities.svg){width=24px height=24px} | `CRM.SMART_ACTIVITIES` | `smart-activities` | `ui-icon-set --smart-activities` ||
|| ![](./_images/icons-list/crm/choose.svg){width=24px height=24px} | `CRM.CHOOSE` | `choose` | `ui-icon-set --choose` ||
|| ![](./_images/icons-list/crm/add-from-adressbook.svg){width=24px height=24px} | `CRM.ADD_FROM_ADRESSBOOK` | `add-from-adressbook` | `ui-icon-set --add-from-adressbook` ||
|| ![](./_images/icons-list/crm/add-file.svg){width=24px height=24px} | `CRM.ADD_FILE` | `add-file` | `ui-icon-set --add-file` ||
|| ![](./_images/icons-list/crm/receive-payment-settings.svg){width=24px height=24px} | `CRM.RECEIVE_PAYMENT_SETTINGS` | `receive-payment-settings` | `ui-icon-set --receive-payment-settings` ||
|| ![](./_images/icons-list/crm/timeline.svg){width=24px height=24px} | `CRM.TIMELINE` | `timeline` | `ui-icon-set --timeline` ||
|| ![](./_images/icons-list/crm/form-settings.svg){width=24px height=24px} | `CRM.FORM_SETTINGS` | `form-settings` | `ui-icon-set --form-settings` ||
|| ![](./_images/icons-list/crm/customer-cards.svg){width=24px height=24px} | `CRM.CUSTOMER_CARDS` | `customer-cards` | `ui-icon-set --customer-cards` ||
|| ![](./_images/icons-list/crm/shop-list.svg){width=24px height=24px} | `CRM.SHOP_LIST` | `shop-list` | `ui-icon-set --shop-list` ||
|| ![](./_images/icons-list/crm/shop-seen.svg){width=24px height=24px} | `CRM.SHOP_SEEN` | `shop-seen` | `ui-icon-set --shop-seen` ||
|| ![](./_images/icons-list/crm/add-from-crm.svg){width=24px height=24px} | `CRM.ADD_FROM_CRM` | `add-from-crm` | `ui-icon-set --add-from-crm` ||
|| ![](./_images/icons-list/crm/payment-and-delivery.svg){width=24px height=24px} | `CRM.PAYMENT_AND_DELIVERY` | `payment-and-delivery` | `ui-icon-set --payment-and-delivery` ||
|| ![](./_images/icons-list/crm/smart-sort.svg){width=24px height=24px} | `CRM.SMART_SORT` | `smart-sort` | `ui-icon-set --smart-sort` ||
|| ![](./_images/icons-list/crm/cart-text.svg){width=24px height=24px} | `CRM.CART_TEXT` | `cart-text` | `ui-icon-set --cart-text` ||
|| ![](./_images/icons-list/crm/cart.svg){width=24px height=24px} | `CRM.CART` | `cart` | `ui-icon-set --cart` ||
|| ![](./_images/icons-list/crm/cart-image.svg){width=24px height=24px} | `CRM.CART_IMAGE` | `cart-image` | `ui-icon-set --cart-image` ||
|| ![](./_images/icons-list/crm/comment-plus.svg){width=24px height=24px} | `CRM.COMMENT_PLUS` | `comment-plus` | `ui-icon-set --comment-plus` ||
|| ![](./_images/icons-list/crm/deal-1.svg){width=24px height=24px} | `CRM.DEAL_1` | `deal-1` | `ui-icon-set --deal-1` ||
|| ![](./_images/icons-list/crm/deal-plus-1.svg){width=24px height=24px} | `CRM.DEAL_PLUS_1` | `deal-plus-1` | `ui-icon-set --deal-plus-1` ||
|| ![](./_images/icons-list/crm/timeline-plus.svg){width=24px height=24px} | `CRM.TIMELINE_PLUS` | `timeline-plus` | `ui-icon-set --timeline-plus` ||
|| ![](./_images/icons-list/crm/plus-based-on.svg){width=24px height=24px} | `CRM.PLUS_BASED_ON` | `plus-based-on` | `ui-icon-set --plus-based-on` ||
|| ![](./_images/icons-list/crm/deal.svg){width=24px height=24px} | `CRM.DEAL` | `deal` | `ui-icon-set --deal` ||
|| ![](./_images/icons-list/crm/customer-card-1.svg){width=24px height=24px} | `CRM.CUSTOMER_CARD_1` | `customer-card-1` | `ui-icon-set --customer-card-1` ||
|| ![](./_images/icons-list/crm/deal-plus.svg){width=24px height=24px} | `CRM.DEAL_PLUS` | `deal-plus` | `ui-icon-set --deal-plus` ||
|| ![](./_images/icons-list/crm/person-plus-2.svg){width=24px height=24px} | `CRM.PERSON_PLUS_2` | `person-plus-2` | `ui-icon-set --person-plus-2` ||
|| ![](./_images/icons-list/crm/city-plus.svg){width=24px height=24px} | `CRM.CITY_PLUS` | `city-plus` | `ui-icon-set --city-plus` ||
|| ![](./_images/icons-list/crm/customer-card-plus.svg){width=24px height=24px} | `CRM.CUSTOMER_CARD_PLUS` | `customer-card-plus` | `ui-icon-set --customer-card-plus` ||
|| ![](./_images/icons-list/crm/chat-1.svg){width=24px height=24px} | `CRM.CHAT_1` | `chat-1` | `ui-icon-set --chat-1` ||
|| ![](./_images/icons-list/crm/dialogue-1.svg){width=24px height=24px} | `CRM.DIALOGUE_1` | `dialogue-1` | `ui-icon-set --dialogue-1` ||
|| ![](./_images/icons-list/crm/business-process.svg){width=24px height=24px} | `CRM.BUSINESS_PROCESS` | `business-process` | `ui-icon-set --business-process` ||
|| ![](./_images/icons-list/crm/form.svg){width=24px height=24px} | `CRM.FORM` | `form` | `ui-icon-set --form` ||
|| ![](./_images/icons-list/crm/wallet.svg){width=24px height=24px} | `CRM.WALLET` | `wallet` | `ui-icon-set --wallet` ||
|| ![](./_images/icons-list/crm/taxi.svg){width=24px height=24px} | `CRM.TAXI` | `taxi` | `ui-icon-set --taxi` ||
|| ![](./_images/icons-list/crm/interconnection.svg){width=24px height=24px} | `CRM.INTERCONNECTION` | `interconnection` | `ui-icon-set --interconnection` ||
|| ![](./_images/icons-list/crm/reduce.svg){width=24px height=24px} | `CRM.REDUCE` | `reduce` | `ui-icon-set --reduce` ||
|| ![](./_images/icons-list/crm/dialogue.svg){width=24px height=24px} | `CRM.DIALOGUE` | `dialogue` | `ui-icon-set --dialogue` ||
|| ![](./_images/icons-list/crm/delivery-car.svg){width=24px height=24px} | `CRM.DELIVERY_CAR` | `delivery-car` | `ui-icon-set --delivery-car` ||
|| ![](./_images/icons-list/crm/car.svg){width=24px height=24px} | `CRM.CAR` | `car` | `ui-icon-set --car` ||
|| ![](./_images/icons-list/crm/crm-payment.svg){width=24px height=24px} | `CRM.CRM_PAYMENT` | `crm-payment` | `ui-icon-set --crm-payment` ||
|| ![](./_images/icons-list/crm/insert.svg){width=24px height=24px} | `CRM.INSERT` | `insert` | `ui-icon-set --insert` ||
|| ![](./_images/icons-list/crm/crm-letters.svg){width=24px height=24px} | `CRM.CRM_LETTERS` | `crm-letters` | `ui-icon-set --crm-letters` ||
|| ![](./_images/icons-list/crm/crm-map.svg){width=24px height=24px} | `CRM.CRM_MAP` | `crm-map` | `ui-icon-set --crm-map` ||
|| ![](./_images/icons-list/crm/send-file.svg){width=24px height=24px} | `CRM.SEND_FILE` | `send-file` | `ui-icon-set --send-file` ||
|| ![](./_images/icons-list/crm/bitrix-1c.svg){width=24px height=24px} | `CRM.BITRIX_1C` | `bitrix-1c` | `ui-icon-set --bitrix-1c` ||
|#

{% endcut %}

{% cut "Editor" %}

CSS-расширение: `ui.icon-set.editor`.

#|
|| **Иконка** | **Константа** | **Значение** | **HTML-класс** ||
|| ![](./_images/icons-list/editor/bold.svg){width=24px height=24px} | `Editor.BOLD` | `bold` | `ui-icon-set --bold` ||
|| ![](./_images/icons-list/editor/italic.svg){width=24px height=24px} | `Editor.ITALIC` | `italic` | `ui-icon-set --italic` ||
|| ![](./_images/icons-list/editor/underline.svg){width=24px height=24px} | `Editor.UNDERLINE` | `underline` | `ui-icon-set --underline` ||
|| ![](./_images/icons-list/editor/strikethrough.svg){width=24px height=24px} | `Editor.STRIKETHROUGH` | `strikethrough` | `ui-icon-set --strikethrough` ||
|| ![](./_images/icons-list/editor/text-color.svg){width=24px height=24px} | `Editor.TEXT_COLOR` | `text-color` | `ui-icon-set --text-color` ||
|| ![](./_images/icons-list/editor/remove-formatting.svg){width=24px height=24px} | `Editor.REMOVE_FORMATTING` | `remove-formatting` | `ui-icon-set --remove-formatting` ||
|| ![](./_images/icons-list/editor/font-size.svg){width=24px height=24px} | `Editor.FONT_SIZE` | `font-size` | `ui-icon-set --font-size` ||
|| ![](./_images/icons-list/editor/numbered-list.svg){width=24px height=24px} | `Editor.NUMBERED_LIST` | `numbered-list` | `ui-icon-set --numbered-list` ||
|| ![](./_images/icons-list/editor/bulleted-list.svg){width=24px height=24px} | `Editor.BULLETED_LIST` | `bulleted-list` | `ui-icon-set --bulleted-list` ||
|| ![](./_images/icons-list/editor/left-align.svg){width=24px height=24px} | `Editor.LEFT_ALIGN` | `left-align` | `ui-icon-set --left-align` ||
|| ![](./_images/icons-list/editor/text-amount.svg){width=24px height=24px} | `Editor.TEXT_AMOUNT` | `text-amount` | `ui-icon-set --text-amount` ||
|| ![](./_images/icons-list/editor/incert-image.svg){width=24px height=24px} | `Editor.INCERT_IMAGE` | `incert-image` | `ui-icon-set --incert-image` ||
|| ![](./_images/icons-list/editor/insert-emoji.svg){width=24px height=24px} | `Editor.INSERT_EMOJI` | `insert-emoji` | `ui-icon-set --insert-emoji` ||
|| ![](./_images/icons-list/editor/insert-spoiler.svg){width=24px height=24px} | `Editor.INSERT_SPOILER` | `insert-spoiler` | `ui-icon-set --insert-spoiler` ||
|| ![](./_images/icons-list/editor/remove-fontsize.svg){width=24px height=24px} | `Editor.REMOVE_FONTSIZE` | `remove-fontsize` | `ui-icon-set --remove-fontsize` ||
|| ![](./_images/icons-list/editor/viewmode-wysiwyg.svg){width=24px height=24px} | `Editor.VIEWMODE_WYSIWYG` | `viewmode-wysiwyg` | `ui-icon-set --viewmode-wysiwyg` ||
|| ![](./_images/icons-list/editor/viewmode-code.svg){width=24px height=24px} | `Editor.VIEWMODE_CODE` | `viewmode-code` | `ui-icon-set --viewmode-code` ||
|| ![](./_images/icons-list/editor/viewmode-split-hor.svg){width=24px height=24px} | `Editor.VIEWMODE_SPLIT_HOR` | `viewmode-split-hor` | `ui-icon-set --viewmode-split-hor` ||
|| ![](./_images/icons-list/editor/viewmode-split-ver.svg){width=24px height=24px} | `Editor.VIEWMODE_SPLIT_VER` | `viewmode-split-ver` | `ui-icon-set --viewmode-split-ver` ||
|| ![](./_images/icons-list/editor/undo.svg){width=24px height=24px} | `Editor.UNDO` | `undo` | `ui-icon-set --undo` ||
|| ![](./_images/icons-list/editor/redo.svg){width=24px height=24px} | `Editor.REDO` | `redo` | `ui-icon-set --redo` ||
|| ![](./_images/icons-list/editor/header.svg){width=24px height=24px} | `Editor.HEADER` | `header` | `ui-icon-set --header` ||
|| ![](./_images/icons-list/editor/eraser.svg){width=24px height=24px} | `Editor.ERASER` | `eraser` | `ui-icon-set --eraser` ||
|| ![](./_images/icons-list/editor/ruler-and-pencil.svg){width=24px height=24px} | `Editor.RULER_AND_PENCIL` | `ruler-and-pencil` | `ui-icon-set --ruler-and-pencil` ||
|| ![](./_images/icons-list/editor/paint-bucket.svg){width=24px height=24px} | `Editor.PAINT_BUCKET` | `paint-bucket` | `ui-icon-set --paint-bucket` ||
|| ![](./_images/icons-list/editor/service.svg){width=24px height=24px} | `Editor.SERVICE` | `service` | `ui-icon-set --service` ||
|| ![](./_images/icons-list/editor/text-check.svg){width=24px height=24px} | `Editor.TEXT_CHECK` | `text-check` | `ui-icon-set --text-check` ||
|| ![](./_images/icons-list/editor/paint-bucket-formatting.svg){width=24px height=24px} | `Editor.PAINT_BUCKET_FORMATTING` | `paint-bucket-formatting` | `ui-icon-set --paint-bucket-formatting` ||
|| ![](./_images/icons-list/editor/new-file.svg){width=24px height=24px} | `Editor.NEW_FILE` | `new-file` | `ui-icon-set --new-file` ||
|| ![](./_images/icons-list/editor/settings-5.svg){width=24px height=24px} | `Editor.SETTINGS_5` | `settings-5` | `ui-icon-set --settings-5` ||
|| ![](./_images/icons-list/editor/anchor.svg){width=24px height=24px} | `Editor.ANCHOR` | `anchor` | `ui-icon-set --anchor` ||
|| ![](./_images/icons-list/editor/superscript.svg){width=24px height=24px} | `Editor.SUPERSCRIPT` | `superscript` | `ui-icon-set --superscript` ||
|| ![](./_images/icons-list/editor/subscript.svg){width=24px height=24px} | `Editor.SUBSCRIPT` | `subscript` | `ui-icon-set --subscript` ||
|| ![](./_images/icons-list/editor/hr.svg){width=24px height=24px} | `Editor.HR` | `hr` | `ui-icon-set --hr` ||
|| ![](./_images/icons-list/editor/special-characters.svg){width=24px height=24px} | `Editor.SPECIAL_CHARACTERS` | `special-characters` | `ui-icon-set --special-characters` ||
|| ![](./_images/icons-list/editor/check-grammar.svg){width=24px height=24px} | `Editor.CHECK_GRAMMAR` | `check-grammar` | `ui-icon-set --check-grammar` ||
|| ![](./_images/icons-list/editor/breaks.svg){width=24px height=24px} | `Editor.BREAKS` | `breaks` | `ui-icon-set --breaks` ||
|| ![](./_images/icons-list/editor/print.svg){width=24px height=24px} | `Editor.PRINT` | `print` | `ui-icon-set --print` ||
|| ![](./_images/icons-list/editor/union.svg){width=24px height=24px} | `Editor.UNION` | `union` | `ui-icon-set --union` ||
|| ![](./_images/icons-list/editor/mention.svg){width=24px height=24px} | `Editor.MENTION` | `mention` | `ui-icon-set --mention` ||
|| ![](./_images/icons-list/editor/add-tag.svg){width=24px height=24px} | `Editor.ADD_TAG` | `add-tag` | `ui-icon-set --add-tag` ||
|| ![](./_images/icons-list/editor/enclose-text-in-code-tag.svg){width=24px height=24px} | `Editor.ENCLOSE_TEXT_IN_CODE_TAG` | `enclose-text-in-code-tag` | `ui-icon-set --enclose-text-in-code-tag` ||
|| ![](./_images/icons-list/editor/table-editor.svg){width=24px height=24px} | `Editor.TABLE_EDITOR` | `table-editor` | `ui-icon-set --table-editor` ||
|| ![](./_images/icons-list/editor/bb-code-mode.svg){width=24px height=24px} | `Editor.BB_CODE_MODE` | `bb-code-mode` | `ui-icon-set --bb-code-mode` ||
|| ![](./_images/icons-list/editor/full-screen.svg){width=24px height=24px} | `Editor.FULL_SCREEN` | `full-screen` | `ui-icon-set --full-screen` ||
|| ![](./_images/icons-list/editor/center-align.svg){width=24px height=24px} | `Editor.CENTER_ALIGN` | `center-align` | `ui-icon-set --center-align` ||
|| ![](./_images/icons-list/editor/right-align.svg){width=24px height=24px} | `Editor.RIGHT_LIGN` | `right-align` | `ui-icon-set --right-align` ||
|| ![](./_images/icons-list/editor/justify.svg){width=24px height=24px} | `Editor.JUSTIFY` | `justify` | `ui-icon-set --justify` ||
|| ![](./_images/icons-list/editor/decrease-indent.svg){width=24px height=24px} | `Editor.DECREASE_INDENT` | `decrease-indent` | `ui-icon-set --decrease-indent` ||
|| ![](./_images/icons-list/editor/increase-indent.svg){width=24px height=24px} | `Editor.INCREASE_INDENT` | `increase-indent` | `ui-icon-set --increase-indent` ||
|| ![](./_images/icons-list/editor/paragraph-background-colour.svg){width=24px height=24px} | `Editor.PARAGRAPH_BACKGROUND_COLOUR` | `paragraph-background-colour` | `ui-icon-set --paragraph-background-colour` ||
|| ![](./_images/icons-list/editor/formatting.svg){width=24px height=24px} | `Editor.FORMATTING` | `formatting` | `ui-icon-set --formatting` ||
|| ![](./_images/icons-list/editor/insert-video.svg){width=24px height=24px} | `Editor.INSERT_VIDEO` | `insert-video` | `ui-icon-set --insert-video` ||
|| ![](./_images/icons-list/editor/speed-0-5.svg){width=24px height=24px} | `Editor.SPEED_0_5` | `speed-0-5` | `ui-icon-set --speed-0-5` ||
|| ![](./_images/icons-list/editor/speed-0-7.svg){width=24px height=24px} | `Editor.SPEED_0_7` | `speed-0-7` | `ui-icon-set --speed-0-7` ||
|| ![](./_images/icons-list/editor/speed-1-0.svg){width=24px height=24px} | `Editor.SPEED_1_0` | `speed-1-0` | `ui-icon-set --speed-1-0` ||
|| ![](./_images/icons-list/editor/speed-1-2.svg){width=24px height=24px} | `Editor.SPEED_1_2` | `speed-1-2` | `ui-icon-set --speed-1-2` ||
|| ![](./_images/icons-list/editor/speed-1-5.svg){width=24px height=24px} | `Editor.SPEED_1_5` | `speed-1-5` | `ui-icon-set --speed-1-5` ||
|| ![](./_images/icons-list/editor/speed-1-7.svg){width=24px height=24px} | `Editor.SPEED_1_7` | `speed-1-7` | `ui-icon-set --speed-1-7` ||
|| ![](./_images/icons-list/editor/speed-2-0.svg){width=24px height=24px} | `Editor.SPEED_2_0` | `speed-2-0` | `ui-icon-set --speed-2-0` ||
|| ![](./_images/icons-list/editor/make-longer.svg){width=24px height=24px} | `Editor.MAKE_LONGER` | `make-longer` | `ui-icon-set --make-longer` ||
|| ![](./_images/icons-list/editor/make-shorter.svg){width=24px height=24px} | `Editor.MAKE_SHORTER` | `make-shorter` | `ui-icon-set --make-shorter` ||
|#

{% endcut %}

{% cut "Animated" %}

CSS-расширение: `ui.icon-set.animated`.

#|
|| **Иконка** | **Константа** | **Значение** | **HTML-класс** ||
|| ![](./_images/icons-list/animated/loader-clock.svg){width=24px height=24px} | `Animated.LOADER_CLOCK` | `loader-clock` | `ui-icon-set --loader-clock` ||
|| ![](./_images/icons-list/animated/loader-wait.svg){width=24px height=24px} | `Animated.LOADER_WAIT` | `loader-wait` | `ui-icon-set --loader-wait` ||
|#

{% endcut %}

{% cut "Outline" %}

CSS-расширение: `ui.icon-set.outline`.

#|
|| **Иконка** | **Константа** | **Значение** | **HTML-класс** ||
|| ![](./_images/icons-list/outline/o-double-gis.svg){width=24px height=24px} | `Outline.DOUBLE_GIS` | `o-double-gis` | `ui-icon-set --o-double-gis` ||
|| ![](./_images/icons-list/outline/o-three-persons.svg){width=24px height=24px} | `Outline.THREE_PERSONS` | `o-three-persons` | `ui-icon-set --o-three-persons` ||
|| ![](./_images/icons-list/outline/o-a-letter.svg){width=24px height=24px} | `Outline.A_LETTER` | `o-a-letter` | `ui-icon-set --o-a-letter` ||
|| ![](./_images/icons-list/outline/o-achievement.svg){width=24px height=24px} | `Outline.ACHIEVEMENT` | `o-achievement` | `ui-icon-set --o-achievement` ||
|| ![](./_images/icons-list/outline/o-activity.svg){width=24px height=24px} | `Outline.ACTIVITY` | `o-activity` | `ui-icon-set --o-activity` ||
|| ![](./_images/icons-list/outline/o-add-chat.svg){width=24px height=24px} | `Outline.ADD_CHAT` | `o-add-chat` | `ui-icon-set --o-add-chat` ||
|| ![](./_images/icons-list/outline/o-add-event.svg){width=24px height=24px} | `Outline.ADD_EVENT` | `o-add-event` | `ui-icon-set --o-add-event` ||
|| ![](./_images/icons-list/outline/o-add-funnel.svg){width=24px height=24px} | `Outline.ADD_FUNNEL` | `o-add-funnel` | `ui-icon-set --o-add-funnel` ||
|| ![](./_images/icons-list/outline/o-add-person.svg){width=24px height=24px} | `Outline.ADD_PERSON` | `o-add-person` | `ui-icon-set --o-add-person` ||
|| ![](./_images/icons-list/outline/o-add-product.svg){width=24px height=24px} | `Outline.ADD_PRODUCT` | `o-add-product` | `ui-icon-set --o-add-product` ||
|| ![](./_images/icons-list/outline/o-add-timeline.svg){width=24px height=24px} | `Outline.ADD_TIMELINE` | `o-add-timeline` | `ui-icon-set --o-add-timeline` ||
|| ![](./_images/icons-list/outline/o-ai-stars-question.svg){width=24px height=24px} | `Outline.AI_STARS_QUESTION` | `o-ai-stars-question` | `ui-icon-set --o-ai-stars-question` ||
|| ![](./_images/icons-list/outline/o-ai-stars.svg){width=24px height=24px} | `Outline.AI_STARS` | `o-ai-stars` | `ui-icon-set --o-ai-stars` ||
|| ![](./_images/icons-list/outline/o-alarm.svg){width=24px height=24px} | `Outline.ALARM` | `o-alarm` | `ui-icon-set --o-alarm` ||
|| ![](./_images/icons-list/outline/o-alert-accent.svg){width=24px height=24px} | `Outline.ALERT_ACCENT` | `o-alert-accent` | `ui-icon-set --o-alert-accent` ||
|| ![](./_images/icons-list/outline/o-alert.svg){width=24px height=24px} | `Outline.ALERT` | `o-alert` | `ui-icon-set --o-alert` ||
|| ![](./_images/icons-list/outline/o-align-center.svg){width=24px height=24px} | `Outline.ALIGN_CENTER` | `o-align-center` | `ui-icon-set --o-align-center` ||
|| ![](./_images/icons-list/outline/o-align-justify.svg){width=24px height=24px} | `Outline.ALIGN_JUSTIFY` | `o-align-justify` | `ui-icon-set --o-align-justify` ||
|| ![](./_images/icons-list/outline/o-align-left.svg){width=24px height=24px} | `Outline.ALIGN_LEFT` | `o-align-left` | `ui-icon-set --o-align-left` ||
|| ![](./_images/icons-list/outline/o-align-right.svg){width=24px height=24px} | `Outline.ALIGN_RIGHT` | `o-align-right` | `ui-icon-set --o-align-right` ||
|| ![](./_images/icons-list/outline/o-apps.svg){width=24px height=24px} | `Outline.APPS` | `o-apps` | `ui-icon-set --o-apps` ||
|| ![](./_images/icons-list/outline/o-attach-2.svg){width=24px height=24px} | `Outline.ATTACH_2` | `o-attach-2` | `ui-icon-set --o-attach-2` ||
|| ![](./_images/icons-list/outline/o-attach.svg){width=24px height=24px} | `Outline.ATTACH` | `o-attach` | `ui-icon-set --o-attach` ||
|| ![](./_images/icons-list/outline/o-autofill.svg){width=24px height=24px} | `Outline.AUTOFILL` | `o-autofill` | `ui-icon-set --o-autofill` ||
|| ![](./_images/icons-list/outline/o-back-10.svg){width=24px height=24px} | `Outline.BACK_10` | `o-back-10` | `ui-icon-set --o-back-10` ||
|| ![](./_images/icons-list/outline/o-back-15.svg){width=24px height=24px} | `Outline.BACK_15` | `o-back-15` | `ui-icon-set --o-back-15` ||
|| ![](./_images/icons-list/outline/o-barcode.svg){width=24px height=24px} | `Outline.BARCODE` | `o-barcode` | `ui-icon-set --o-barcode` ||
|| ![](./_images/icons-list/outline/o-battery-1-stick.svg){width=24px height=24px} | `Outline.BATTERY_1_STICK` | `o-battery-1-stick` | `ui-icon-set --o-battery-1-stick` ||
|| ![](./_images/icons-list/outline/o-battery-2-sticks.svg){width=24px height=24px} | `Outline.BATTERY_2_STICKS` | `o-battery-2-sticks` | `ui-icon-set --o-battery-2-sticks` ||
|| ![](./_images/icons-list/outline/o-battery-no-charge.svg){width=24px height=24px} | `Outline.BATTERY_NO_CHARGE` | `o-battery-no-charge` | `ui-icon-set --o-battery-no-charge` ||
|| ![](./_images/icons-list/outline/o-bluetooth.svg){width=24px height=24px} | `Outline.BLUETOOTH` | `o-bluetooth` | `ui-icon-set --o-bluetooth` ||
|| ![](./_images/icons-list/outline/o-board.svg){width=24px height=24px} | `Outline.BOARD` | `o-board` | `ui-icon-set --o-board` ||
|| ![](./_images/icons-list/outline/o-bold.svg){width=24px height=24px} | `Outline.BOLD` | `o-bold` | `ui-icon-set --o-bold` ||
|| ![](./_images/icons-list/outline/o-bookmark-2.svg){width=24px height=24px} | `Outline.BOOKMARK_2` | `o-bookmark-2` | `ui-icon-set --o-bookmark-2` ||
|| ![](./_images/icons-list/outline/o-bookmark.svg){width=24px height=24px} | `Outline.BOOKMARK` | `o-bookmark` | `ui-icon-set --o-bookmark` ||
|| ![](./_images/icons-list/outline/o-bottleneck.svg){width=24px height=24px} | `Outline.BOTTLENECK` | `o-bottleneck` | `ui-icon-set --o-bottleneck` ||
|| ![](./_images/icons-list/outline/o-bottom-menu.svg){width=24px height=24px} | `Outline.BOTTOM_MENU` | `o-bottom-menu` | `ui-icon-set --o-bottom-menu` ||
|| ![](./_images/icons-list/outline/o-box-with-lid.svg){width=24px height=24px} | `Outline.BOX_WITH_LID` | `o-box-with-lid` | `ui-icon-set --o-box-with-lid` ||
|| ![](./_images/icons-list/outline/o-box.svg){width=24px height=24px} | `Outline.BOX` | `o-box` | `ui-icon-set --o-box` ||
|| ![](./_images/icons-list/outline/o-bug.svg){width=24px height=24px} | `Outline.BUG` | `o-bug` | `ui-icon-set --o-bug` ||
|| ![](./_images/icons-list/outline/o-bulleted-list.svg){width=24px height=24px} | `Outline.BULLETED_LIST` | `o-bulleted-list` | `ui-icon-set --o-bulleted-list` ||
|| ![](./_images/icons-list/outline/o-busines-process-stages.svg){width=24px height=24px} | `Outline.BUSINES_PROCESS_STAGES` | `o-busines-process-stages` | `ui-icon-set --o-busines-process-stages` ||
|| ![](./_images/icons-list/outline/o-business-process-progress.svg){width=24px height=24px} | `Outline.BUSINESS_PROCESS_PROGRESS` | `o-business-process-progress` | `ui-icon-set --o-business-process-progress` ||
|| ![](./_images/icons-list/outline/o-business-process.svg){width=24px height=24px} | `Outline.BUSINESS_PROCESS` | `o-business-process` | `ui-icon-set --o-business-process` ||
|| ![](./_images/icons-list/outline/o-calendar-empty.svg){width=24px height=24px} | `Outline.CALENDAR_EMPTY` | `o-calendar-empty` | `ui-icon-set --o-calendar-empty` ||
|| ![](./_images/icons-list/outline/o-calendar-share.svg){width=24px height=24px} | `Outline.CALENDAR_SHARE` | `o-calendar-share` | `ui-icon-set --o-calendar-share` ||
|| ![](./_images/icons-list/outline/o-calendar-with-checks.svg){width=24px height=24px} | `Outline.CALENDAR_WITH_CHECKS` | `o-calendar-with-checks` | `ui-icon-set --o-calendar-with-checks` ||
|| ![](./_images/icons-list/outline/o-calendar-with-slots.svg){width=24px height=24px} | `Outline.CALENDAR_WITH_SLOTS` | `o-calendar-with-slots` | `ui-icon-set --o-calendar-with-slots` ||
|| ![](./_images/icons-list/outline/o-calendar.svg){width=24px height=24px} | `Outline.CALENDAR` | `o-calendar` | `ui-icon-set --o-calendar` ||
|| ![](./_images/icons-list/outline/o-camera-off.svg){width=24px height=24px} | `Outline.CAMERA_OFF` | `o-camera-off` | `ui-icon-set --o-camera-off` ||
|| ![](./_images/icons-list/outline/o-camera.svg){width=24px height=24px} | `Outline.CAMERA` | `o-camera` | `ui-icon-set --o-camera` ||
|| ![](./_images/icons-list/outline/o-card.svg){width=24px height=24px} | `Outline.CARD` | `o-card` | `ui-icon-set --o-card` ||
|| ![](./_images/icons-list/outline/o-cash-terminal.svg){width=24px height=24px} | `Outline.CASH_TERMINAL` | `o-cash-terminal` | `ui-icon-set --o-cash-terminal` ||
|| ![](./_images/icons-list/outline/o-change-funnel.svg){width=24px height=24px} | `Outline.CHANGE_FUNNEL` | `o-change-funnel` | `ui-icon-set --o-change-funnel` ||
|| ![](./_images/icons-list/outline/o-change-order-2.svg){width=24px height=24px} | `Outline.CHANGE_ORDER_2` | `o-change-order-2` | `ui-icon-set --o-change-order-2` ||
|| ![](./_images/icons-list/outline/o-change-order.svg){width=24px height=24px} | `Outline.CHANGE_ORDER` | `o-change-order` | `ui-icon-set --o-change-order` ||
|| ![](./_images/icons-list/outline/o-chat-list.svg){width=24px height=24px} | `Outline.CHAT_LIST` | `o-chat-list` | `ui-icon-set --o-chat-list` ||
|| ![](./_images/icons-list/outline/o-chats.svg){width=24px height=24px} | `Outline.CHATS` | `o-chats` | `ui-icon-set --o-chats` ||
|| ![](./_images/icons-list/outline/o-check-list.svg){width=24px height=24px} | `Outline.CHECK_LIST` | `o-check-list` | `ui-icon-set --o-check-list` ||
|| ![](./_images/icons-list/outline/o-circle-check.svg){width=24px height=24px} | `Outline.CIRCLE_CHECK` | `o-circle-check` | `ui-icon-set --o-circle-check` ||
|| ![](./_images/icons-list/outline/o-circle-cross.svg){width=24px height=24px} | `Outline.CIRCLE_CROSS` | `o-circle-cross` | `ui-icon-set --o-circle-cross` ||
|| ![](./_images/icons-list/outline/o-circle-minus.svg){width=24px height=24px} | `Outline.CIRCLE_MINUS` | `o-circle-minus` | `ui-icon-set --o-circle-minus` ||
|| ![](./_images/icons-list/outline/o-circle-more.svg){width=24px height=24px} | `Outline.CIRCLE_MORE` | `o-circle-more` | `ui-icon-set --o-circle-more` ||
|| ![](./_images/icons-list/outline/o-circle-plus.svg){width=24px height=24px} | `Outline.CIRCLE_PLUS` | `o-circle-plus` | `ui-icon-set --o-circle-plus` ||
|| ![](./_images/icons-list/outline/o-clock-back.svg){width=24px height=24px} | `Outline.CLOCK_BACK` | `o-clock-back` | `ui-icon-set --o-clock-back` ||
|| ![](./_images/icons-list/outline/o-clock.svg){width=24px height=24px} | `Outline.CLOCK` | `o-clock` | `ui-icon-set --o-clock` ||
|| ![](./_images/icons-list/outline/o-close-chat.svg){width=24px height=24px} | `Outline.CLOSE_CHAT` | `o-close-chat` | `ui-icon-set --o-close-chat` ||
|| ![](./_images/icons-list/outline/o-cloud-download.svg){width=24px height=24px} | `Outline.CLOUD_DOWNLOAD` | `o-cloud-download` | `ui-icon-set --o-cloud-download` ||
|| ![](./_images/icons-list/outline/o-cloud-sync.svg){width=24px height=24px} | `Outline.CLOUD_SYNC` | `o-cloud-sync` | `ui-icon-set --o-cloud-sync` ||
|| ![](./_images/icons-list/outline/o-cloud-time.svg){width=24px height=24px} | `Outline.CLOUD_TIME` | `o-cloud-time` | `ui-icon-set --o-cloud-time` ||
|| ![](./_images/icons-list/outline/o-cloud-with-check.svg){width=24px height=24px} | `Outline.CLOUD_WITH_CHECK` | `o-cloud-with-check` | `ui-icon-set --o-cloud-with-check` ||
|| ![](./_images/icons-list/outline/o-cloud.svg){width=24px height=24px} | `Outline.CLOUD` | `o-cloud` | `ui-icon-set --o-cloud` ||
|| ![](./_images/icons-list/outline/o-collab.svg){width=24px height=24px} | `Outline.COLLAB` | `o-collab` | `ui-icon-set --o-collab` ||
|| ![](./_images/icons-list/outline/o-collaboration.svg){width=24px height=24px} | `Outline.COLLABORATION` | `o-collaboration` | `ui-icon-set --o-collaboration` ||
|| ![](./_images/icons-list/outline/o-columns-sidebar-pending.svg){width=24px height=24px} | `Outline.COLUMNS_SIDEBAR_PENDING` | `o-columns-sidebar-pending` | `ui-icon-set --o-columns-sidebar-pending` ||
|| ![](./_images/icons-list/outline/o-columns.svg){width=24px height=24px} | `Outline.COLUMNS` | `o-columns` | `ui-icon-set --o-columns` ||
|| ![](./_images/icons-list/outline/o-company.svg){width=24px height=24px} | `Outline.COMPANY` | `o-company` | `ui-icon-set --o-company` ||
|| ![](./_images/icons-list/outline/o-complete-task-list.svg){width=24px height=24px} | `Outline.COMPLETE_TASK_LIST` | `o-complete-task-list` | `ui-icon-set --o-complete-task-list` ||
|| ![](./_images/icons-list/outline/o-contact.svg){width=24px height=24px} | `Outline.CONTACT` | `o-contact` | `ui-icon-set --o-contact` ||
|| ![](./_images/icons-list/outline/o-copilot.svg){width=24px height=24px} | `Outline.COPILOT` | `o-copilot` | `ui-icon-set --o-copilot` ||
|| ![](./_images/icons-list/outline/o-copy.svg){width=24px height=24px} | `Outline.COPY` | `o-copy` | `ui-icon-set --o-copy` ||
|| ![](./_images/icons-list/outline/o-create-chat.svg){width=24px height=24px} | `Outline.CREATE_CHAT` | `o-create-chat` | `ui-icon-set --o-create-chat` ||
|| ![](./_images/icons-list/outline/o-create-file.svg){width=24px height=24px} | `Outline.CREATE_FILE` | `o-create-file` | `ui-icon-set --o-create-file` ||
|| ![](./_images/icons-list/outline/o-crm-letters.svg){width=24px height=24px} | `Outline.CRM_LETTERS` | `o-crm-letters` | `ui-icon-set --o-crm-letters` ||
|| ![](./_images/icons-list/outline/o-crm.svg){width=24px height=24px} | `Outline.CRM` | `o-crm` | `ui-icon-set --o-crm` ||
|| ![](./_images/icons-list/outline/o-crossed-eye.svg){width=24px height=24px} | `Outline.CROSSED_EYE` | `o-crossed-eye` | `ui-icon-set --o-crossed-eye` ||
|| ![](./_images/icons-list/outline/o-crown.svg){width=24px height=24px} | `Outline.CROWN` | `o-crown` | `ui-icon-set --o-crown` ||
|| ![](./_images/icons-list/outline/o-cursor-click.svg){width=24px height=24px} | `Outline.CURSOR_CLICK` | `o-cursor-click` | `ui-icon-set --o-cursor-click` ||
|| ![](./_images/icons-list/outline/o-cursors-strike.svg){width=24px height=24px} | `Outline.CURSORS_STRIKE` | `o-cursors-strike` | `ui-icon-set --o-cursors-strike` ||
|| ![](./_images/icons-list/outline/o-day-off.svg){width=24px height=24px} | `Outline.DAY_OFF` | `o-day-off` | `ui-icon-set --o-day-off` ||
|| ![](./_images/icons-list/outline/o-delay.svg){width=24px height=24px} | `Outline.DELAY` | `o-delay` | `ui-icon-set --o-delay` ||
|| ![](./_images/icons-list/outline/o-delegate.svg){width=24px height=24px} | `Outline.DELEGATE` | `o-delegate` | `ui-icon-set --o-delegate` ||
|| ![](./_images/icons-list/outline/o-delivery.svg){width=24px height=24px} | `Outline.DELIVERY` | `o-delivery` | `ui-icon-set --o-delivery` ||
|| ![](./_images/icons-list/outline/o-demonstration-on.svg){width=24px height=24px} | `Outline.DEMONSTRATION_ON` | `o-demonstration-on` | `ui-icon-set --o-demonstration-on` ||
|| ![](./_images/icons-list/outline/o-department.svg){width=24px height=24px} | `Outline.DEPARTMENT` | `o-department` | `ui-icon-set --o-department` ||
|| ![](./_images/icons-list/outline/o-design.svg){width=24px height=24px} | `Outline.DESIGN` | `o-design` | `ui-icon-set --o-design` ||
|| ![](./_images/icons-list/outline/o-developer-resources.svg){width=24px height=24px} | `Outline.DEVELOPER_RESOURCES` | `o-developer-resources` | `ui-icon-set --o-developer-resources` ||
|| ![](./_images/icons-list/outline/o-device-rotate.svg){width=24px height=24px} | `Outline.DEVICE_ROTATE` | `o-device-rotate` | `ui-icon-set --o-device-rotate` ||
|| ![](./_images/icons-list/outline/o-disk-shared.svg){width=24px height=24px} | `Outline.DISK_SHARED` | `o-disk-shared` | `ui-icon-set --o-disk-shared` ||
|| ![](./_images/icons-list/outline/o-dislike.svg){width=24px height=24px} | `Outline.DISLIKE` | `o-dislike` | `ui-icon-set --o-dislike` ||
|| ![](./_images/icons-list/outline/o-distribution.svg){width=24px height=24px} | `Outline.DISTRIBUTION` | `o-distribution` | `ui-icon-set --o-distribution` ||
|| ![](./_images/icons-list/outline/o-document-update.svg){width=24px height=24px} | `Outline.DOCUMENT_UPDATE` | `o-document-update` | `ui-icon-set --o-document-update` ||
|| ![](./_images/icons-list/outline/o-double-check.svg){width=24px height=24px} | `Outline.DOUBLE_CHECK` | `o-double-check` | `ui-icon-set --o-double-check` ||
|| ![](./_images/icons-list/outline/o-download.svg){width=24px height=24px} | `Outline.DOWNLOAD` | `o-download` | `ui-icon-set --o-download` ||
|| ![](./_images/icons-list/outline/o-duplicate.svg){width=24px height=24px} | `Outline.DUPLICATE` | `o-duplicate` | `ui-icon-set --o-duplicate` ||
|| ![](./_images/icons-list/outline/o-earth-with-check.svg){width=24px height=24px} | `Outline.EARTH_WITH_CHECK` | `o-earth-with-check` | `ui-icon-set --o-earth-with-check` ||
|| ![](./_images/icons-list/outline/o-earth-with-clock.svg){width=24px height=24px} | `Outline.EARTH_WITH_CLOCK` | `o-earth-with-clock` | `ui-icon-set --o-earth-with-clock` ||
|| ![](./_images/icons-list/outline/o-earth-with-cross.svg){width=24px height=24px} | `Outline.EARTH_WITH_CROSS` | `o-earth-with-cross` | `ui-icon-set --o-earth-with-cross` ||
|| ![](./_images/icons-list/outline/o-earth-with-stop.svg){width=24px height=24px} | `Outline.EARTH_WITH_STOP` | `o-earth-with-stop` | `ui-icon-set --o-earth-with-stop` ||
|| ![](./_images/icons-list/outline/o-earth-with-tree.svg){width=24px height=24px} | `Outline.EARTH_WITH_TREE` | `o-earth-with-tree` | `ui-icon-set --o-earth-with-tree` ||
|| ![](./_images/icons-list/outline/o-earth.svg){width=24px height=24px} | `Outline.EARTH` | `o-earth` | `ui-icon-set --o-earth` ||
|| ![](./_images/icons-list/outline/o-empty-battery.svg){width=24px height=24px} | `Outline.EMPTY_BATTERY` | `o-empty-battery` | `ui-icon-set --o-empty-battery` ||
|| ![](./_images/icons-list/outline/o-empty-message.svg){width=24px height=24px} | `Outline.EMPTY_MESSAGE` | `o-empty-message` | `ui-icon-set --o-empty-message` ||
|| ![](./_images/icons-list/outline/o-enterprise.svg){width=24px height=24px} | `Outline.ENTERPRISE` | `o-enterprise` | `ui-icon-set --o-enterprise` ||
|| ![](./_images/icons-list/outline/o-expert-mode.svg){width=24px height=24px} | `Outline.EXPERT_MODE` | `o-expert-mode` | `ui-icon-set --o-expert-mode` ||
|| ![](./_images/icons-list/outline/o-favorite.svg){width=24px height=24px} | `Outline.FAVORITE` | `o-favorite` | `ui-icon-set --o-favorite` ||
|| ![](./_images/icons-list/outline/o-feedback.svg){width=24px height=24px} | `Outline.FEEDBACK` | `o-feedback` | `ui-icon-set --o-feedback` ||
|| ![](./_images/icons-list/outline/o-file-with-check-2.svg){width=24px height=24px} | `Outline.FILE_WITH_CHECK_2` | `o-file-with-check-2` | `ui-icon-set --o-file-with-check-2` ||
|| ![](./_images/icons-list/outline/o-file-with-check.svg){width=24px height=24px} | `Outline.FILE_WITH_CHECK` | `o-file-with-check` | `ui-icon-set --o-file-with-check` ||
|| ![](./_images/icons-list/outline/o-file-with-clock.svg){width=24px height=24px} | `Outline.FILE_WITH_CLOCK` | `o-file-with-clock` | `ui-icon-set --o-file-with-clock` ||
|| ![](./_images/icons-list/outline/o-file.svg){width=24px height=24px} | `Outline.FILE` | `o-file` | `ui-icon-set --o-file` ||
|| ![](./_images/icons-list/outline/o-filter-2-lines.svg){width=24px height=24px} | `Outline.FILTER_2_LINES` | `o-filter-2-lines` | `ui-icon-set --o-filter-2-lines` ||
|| ![](./_images/icons-list/outline/o-filter-funnel.svg){width=24px height=24px} | `Outline.FILTER_FUNNEL` | `o-filter-funnel` | `ui-icon-set --o-filter-funnel` ||
|| ![](./_images/icons-list/outline/o-filter.svg){width=24px height=24px} | `Outline.FILTER` | `o-filter` | `ui-icon-set --o-filter` ||
|| ![](./_images/icons-list/outline/o-find-filters.svg){width=24px height=24px} | `Outline.FIND_FILTERS` | `o-find-filters` | `ui-icon-set --o-find-filters` ||
|| ![](./_images/icons-list/outline/o-fire.svg){width=24px height=24px} | `Outline.FIRE` | `o-fire` | `ui-icon-set --o-fire` ||
|| ![](./_images/icons-list/outline/o-fire-solid.svg){width=24px height=24px} | `Outline.FIRE_SOLID` | `o-fire-solid` | `ui-icon-set --o-fire-solid` ||
|| ![](./_images/icons-list/outline/o-flag-with-cross.svg){width=24px height=24px} | `Outline.FLAG_WITH_CROSS` | `o-flag-with-cross` | `ui-icon-set --o-flag-with-cross` ||
|| ![](./_images/icons-list/outline/o-flag.svg){width=24px height=24px} | `Outline.FLAG` | `o-flag` | `ui-icon-set --o-flag` ||
|| ![](./_images/icons-list/outline/o-folder-24.svg){width=24px height=24px} | `Outline.FOLDER_24` | `o-folder-24` | `ui-icon-set --o-folder-24` ||
|| ![](./_images/icons-list/outline/o-folder-plus.svg){width=24px height=24px} | `Outline.FOLDER_PLUS` | `o-folder-plus` | `ui-icon-set --o-folder-plus` ||
|| ![](./_images/icons-list/outline/o-folder-success.svg){width=24px height=24px} | `Outline.FOLDER_SUCCESS` | `o-folder-success` | `ui-icon-set --o-folder-success` ||
|| ![](./_images/icons-list/outline/o-folder-with-card.svg){width=24px height=24px} | `Outline.FOLDER_WITH_CARD` | `o-folder-with-card` | `ui-icon-set --o-folder-with-card` ||
|| ![](./_images/icons-list/outline/o-folder.svg){width=24px height=24px} | `Outline.FOLDER` | `o-folder` | `ui-icon-set --o-folder` ||
|| ![](./_images/icons-list/outline/o-form.svg){width=24px height=24px} | `Outline.FORM` | `o-form` | `ui-icon-set --o-form` ||
|| ![](./_images/icons-list/outline/o-forward-10.svg){width=24px height=24px} | `Outline.FORWARD_10` | `o-forward-10` | `ui-icon-set --o-forward-10` ||
|| ![](./_images/icons-list/outline/o-forward-15.svg){width=24px height=24px} | `Outline.FORWARD_15` | `o-forward-15` | `ui-icon-set --o-forward-15` ||
|| ![](./_images/icons-list/outline/o-forward.svg){width=24px height=24px} | `Outline.FORWARD` | `o-forward` | `ui-icon-set --o-forward` ||
|| ![](./_images/icons-list/outline/o-freelance.svg){width=24px height=24px} | `Outline.FREELANCE` | `o-freelance` | `ui-icon-set --o-freelance` ||
|| ![](./_images/icons-list/outline/o-full-battery.svg){width=24px height=24px} | `Outline.FULL_BATTERY` | `o-full-battery` | `ui-icon-set --o-full-battery` ||
|| ![](./_images/icons-list/outline/o-gift.svg){width=24px height=24px} | `Outline.GIFT` | `o-gift` | `ui-icon-set --o-gift` ||
|| ![](./_images/icons-list/outline/o-glasses.svg){width=24px height=24px} | `Outline.GLASSES` | `o-glasses` | `ui-icon-set --o-glasses` ||
|| ![](./_images/icons-list/outline/o-globe-extranet.svg){width=24px height=24px} | `Outline.GLOBE_EXTRANET` | `o-globe-extranet` | `ui-icon-set --o-globe-extranet` ||
|| ![](./_images/icons-list/outline/o-go-to-message.svg){width=24px height=24px} | `Outline.GO_TO_MESSAGE` | `o-go-to-message` | `ui-icon-set --o-go-to-message` ||
|| ![](./_images/icons-list/outline/o-google-maps.svg){width=24px height=24px} | `Outline.GOOGLE_MAPS` | `o-google-maps` | `ui-icon-set --o-google-maps` ||
|| ![](./_images/icons-list/outline/o-graduation-cap.svg){width=24px height=24px} | `Outline.GRADUATION_CAP` | `o-graduation-cap` | `ui-icon-set --o-graduation-cap` ||
|| ![](./_images/icons-list/outline/o-graphs-diagram.svg){width=24px height=24px} | `Outline.GRAPHS_DIAGRAM` | `o-graphs-diagram` | `ui-icon-set --o-graphs-diagram` ||
|| ![](./_images/icons-list/outline/o-group.svg){width=24px height=24px} | `Outline.GROUP` | `o-group` | `ui-icon-set --o-group` ||
|| ![](./_images/icons-list/outline/o-hamburger-menu.svg){width=24px height=24px} | `Outline.HAMBURGER_MENU` | `o-hamburger-menu` | `ui-icon-set --o-hamburger-menu` ||
|| ![](./_images/icons-list/outline/o-handshake.svg){width=24px height=24px} | `Outline.HANDSHAKE` | `o-handshake` | `ui-icon-set --o-handshake` ||
|| ![](./_images/icons-list/outline/o-headset.svg){width=24px height=24px} | `Outline.HEADSET` | `o-headset` | `ui-icon-set --o-headset` ||
|| ![](./_images/icons-list/outline/o-heart.svg){width=24px height=24px} | `Outline.HEART` | `o-heart` | `ui-icon-set --o-heart` ||
|| ![](./_images/icons-list/outline/o-high-temperature.svg){width=24px height=24px} | `Outline.HIGH_TEMPERATURE` | `o-high-temperature` | `ui-icon-set --o-high-temperature` ||
|| ![](./_images/icons-list/outline/o-home-star.svg){width=24px height=24px} | `Outline.HOME_STAR` | `o-home-star` | `ui-icon-set --o-home-star` ||
|| ![](./_images/icons-list/outline/o-home.svg){width=24px height=24px} | `Outline.HOME` | `o-home` | `ui-icon-set --o-home` ||
|| ![](./_images/icons-list/outline/o-hourglass.svg){width=24px height=24px} | `Outline.HOURGLASS` | `o-hourglass` | `ui-icon-set --o-hourglass` ||
|| ![](./_images/icons-list/outline/o-idea-lamp.svg){width=24px height=24px} | `Outline.IDEA_LAMP` | `o-idea-lamp` | `ui-icon-set --o-idea-lamp` ||
|| ![](./_images/icons-list/outline/o-image.svg){width=24px height=24px} | `Outline.IMAGE` | `o-image` | `ui-icon-set --o-image` ||
|| ![](./_images/icons-list/outline/o-info-circle.svg){width=24px height=24px} | `Outline.INFO_CIRCLE` | `o-info-circle` | `ui-icon-set --o-info-circle` ||
|| ![](./_images/icons-list/outline/o-interval.svg){width=24px height=24px} | `Outline.INTERVAL` | `o-interval` | `ui-icon-set --o-interval` ||
|| ![](./_images/icons-list/outline/o-intranet.svg){width=24px height=24px} | `Outline.INTRANET` | `o-intranet` | `ui-icon-set --o-intranet` ||
|| ![](./_images/icons-list/outline/o-inventory-management.svg){width=24px height=24px} | `Outline.INVENTORY_MANAGEMENT` | `o-inventory-management` | `ui-icon-set --o-inventory-management` ||
|| ![](./_images/icons-list/outline/o-invoice.svg){width=24px height=24px} | `Outline.INVOICE` | `o-invoice` | `ui-icon-set --o-invoice` ||
|| ![](./_images/icons-list/outline/o-issue-invoice.svg){width=24px height=24px} | `Outline.ISSUE_INVOICE` | `o-issue-invoice` | `ui-icon-set --o-issue-invoice` ||
|| ![](./_images/icons-list/outline/o-italic.svg){width=24px height=24px} | `Outline.ITALIC` | `o-italic` | `ui-icon-set --o-italic` ||
|| ![](./_images/icons-list/outline/o-kanban.svg){width=24px height=24px} | `Outline.KANBAN` | `o-kanban` | `ui-icon-set --o-kanban` ||
|| ![](./_images/icons-list/outline/o-key.svg){width=24px height=24px} | `Outline.KEY` | `o-key` | `ui-icon-set --o-key` ||
|| ![](./_images/icons-list/outline/o-knowledge-base.svg){width=24px height=24px} | `Outline.KNOWLEDGE_BASE` | `o-knowledge-base` | `ui-icon-set --o-knowledge-base` ||
|| ![](./_images/icons-list/outline/o-layers.svg){width=24px height=24px} | `Outline.LAYERS` | `o-layers` | `ui-icon-set --o-layers` ||
|| ![](./_images/icons-list/outline/o-lead.svg){width=24px height=24px} | `Outline.LEAD` | `o-lead` | `ui-icon-set --o-lead` ||
|| ![](./_images/icons-list/outline/o-left-right.svg){width=24px height=24px} | `Outline.LEFT_RIGHT` | `o-left-right` | `ui-icon-set --o-left-right` ||
|| ![](./_images/icons-list/outline/o-like.svg){width=24px height=24px} | `Outline.LIKE` | `o-like` | `ui-icon-set --o-like` ||
|| ![](./_images/icons-list/outline/o-link-settings.svg){width=24px height=24px} | `Outline.LINK_SETTINGS` | `o-link-settings` | `ui-icon-set --o-link-settings` ||
|| ![](./_images/icons-list/outline/o-link.svg){width=24px height=24px} | `Outline.LINK` | `o-link` | `ui-icon-set --o-link` ||
|| ![](./_images/icons-list/outline/o-links-list.svg){width=24px height=24px} | `Outline.LINKS_LIST` | `o-links-list` | `ui-icon-set --o-links-list` ||
|| ![](./_images/icons-list/outline/o-location-time.svg){width=24px height=24px} | `Outline.LOCATION_TIME` | `o-location-time` | `ui-icon-set --o-location-time` ||
|| ![](./_images/icons-list/outline/o-location.svg){width=24px height=24px} | `Outline.LOCATION` | `o-location` | `ui-icon-set --o-location` ||
|| ![](./_images/icons-list/outline/o-log-in.svg){width=24px height=24px} | `Outline.LOG_IN` | `o-log-in` | `ui-icon-set --o-log-in` ||
|| ![](./_images/icons-list/outline/o-log-out.svg){width=24px height=24px} | `Outline.LOG_OUT` | `o-log-out` | `ui-icon-set --o-log-out` ||
|| ![](./_images/icons-list/outline/o-lower-right-arrow.svg){width=24px height=24px} | `Outline.LOWER_RIGHT_ARROW` | `o-lower-right-arrow` | `ui-icon-set --o-lower-right-arrow` ||
|| ![](./_images/icons-list/outline/o-magic-wand.svg){width=24px height=24px} | `Outline.MAGIC_WAND` | `o-magic-wand` | `ui-icon-set --o-magic-wand` ||
|| ![](./_images/icons-list/outline/o-mail-counter.svg){width=24px height=24px} | `Outline.MAIL_COUNTER` | `o-mail-counter` | `ui-icon-set --o-mail-counter` ||
|| ![](./_images/icons-list/outline/o-mail-forward.svg){width=24px height=24px} | `Outline.MAIL_FORWARD` | `o-mail-forward` | `ui-icon-set --o-mail-forward` ||
|| ![](./_images/icons-list/outline/o-mail-in-progress.svg){width=24px height=24px} | `Outline.MAIL_IN_PROGRESS` | `o-mail-in-progress` | `ui-icon-set --o-mail-in-progress` ||
|| ![](./_images/icons-list/outline/o-mail-open.svg){width=24px height=24px} | `Outline.MAIL_OPEN` | `o-mail-open` | `ui-icon-set --o-mail-open` ||
|| ![](./_images/icons-list/outline/o-mail-return.svg){width=24px height=24px} | `Outline.MAIL_RETURN` | `o-mail-return` | `ui-icon-set --o-mail-return` ||
|| ![](./_images/icons-list/outline/o-mail-send.svg){width=24px height=24px} | `Outline.MAIL_SEND` | `o-mail-send` | `ui-icon-set --o-mail-send` ||
|| ![](./_images/icons-list/outline/o-mail.svg){width=24px height=24px} | `Outline.MAIL` | `o-mail` | `ui-icon-set --o-mail` ||
|| ![](./_images/icons-list/outline/o-main-tool.svg){width=24px height=24px} | `Outline.MAIN_TOOL` | `o-main-tool` | `ui-icon-set --o-main-tool` ||
|| ![](./_images/icons-list/outline/o-map.svg){width=24px height=24px} | `Outline.MAP` | `o-map` | `ui-icon-set --o-map` ||
|| ![](./_images/icons-list/outline/o-market.svg){width=24px height=24px} | `Outline.MARKET` | `o-market` | `ui-icon-set --o-market` ||
|| ![](./_images/icons-list/outline/o-maximize.svg){width=24px height=24px} | `Outline.MAXIMIZE` | `o-maximize` | `ui-icon-set --o-maximize` ||
|| ![](./_images/icons-list/outline/o-maximize-2.svg){width=24px height=24px} | `Outline.MAXIMIZE_2` | `o-maximize-2` | `ui-icon-set --o-maximize-2` ||
|| ![](./_images/icons-list/outline/o-max.svg){width=24px height=24px} | `Outline.MAX` | `o-max` | `ui-icon-set --o-max` ||
|| ![](./_images/icons-list/outline/o-meeting-point.svg){width=24px height=24px} | `Outline.MEETING_POINT` | `o-meeting-point` | `ui-icon-set --o-meeting-point` ||
|| ![](./_images/icons-list/outline/o-mention.svg){width=24px height=24px} | `Outline.MENTION` | `o-mention` | `ui-icon-set --o-mention` ||
|| ![](./_images/icons-list/outline/o-message.svg){width=24px height=24px} | `Outline.MESSAGE` | `o-message` | `ui-icon-set --o-message` ||
|| ![](./_images/icons-list/outline/o-messages.svg){width=24px height=24px} | `Outline.MESSAGES` | `o-messages` | `ui-icon-set --o-messages` ||
|| ![](./_images/icons-list/outline/o-messenger-meta.svg){width=24px height=24px} | `Outline.MESSENGER_META` | `o-messenger-meta` | `ui-icon-set --o-messenger-meta` ||
|| ![](./_images/icons-list/outline/o-messenger.svg){width=24px height=24px} | `Outline.MESSENGER` | `o-messenger` | `ui-icon-set --o-messenger` ||
|| ![](./_images/icons-list/outline/o-microphone-off.svg){width=24px height=24px} | `Outline.MICROPHONE_OFF` | `o-microphone-off` | `ui-icon-set --o-microphone-off` ||
|| ![](./_images/icons-list/outline/o-microphone-on.svg){width=24px height=24px} | `Outline.MICROPHONE_ON` | `o-microphone-on` | `ui-icon-set --o-microphone-on` ||
|| ![](./_images/icons-list/outline/o-minimize.svg){width=24px height=24px} | `Outline.MINIMIZE` | `o-minimize` | `ui-icon-set --o-minimize` ||
|| ![](./_images/icons-list/outline/o-minimize-2.svg){width=24px height=24px} | `Outline.MINIMIZE_2` | `o-minimize-2` | `ui-icon-set --o-minimize-2` ||
|| ![](./_images/icons-list/outline/o-mobile-constructor.svg){width=24px height=24px} | `Outline.MOBILE_CONSTRUCTOR` | `o-mobile-constructor` | `ui-icon-set --o-mobile-constructor` ||
|| ![](./_images/icons-list/outline/o-mobile-service.svg){width=24px height=24px} | `Outline.MOBILE_SERVICE` | `o-mobile-service` | `ui-icon-set --o-mobile-service` ||
|| ![](./_images/icons-list/outline/o-mobile-stars.svg){width=24px height=24px} | `Outline.MOBILE_STARS` | `o-mobile-stars` | `ui-icon-set --o-mobile-stars` ||
|| ![](./_images/icons-list/outline/o-mobile.svg){width=24px height=24px} | `Outline.MOBILE` | `o-mobile` | `ui-icon-set --o-mobile` ||
|| ![](./_images/icons-list/outline/o-moderator.svg){width=24px height=24px} | `Outline.MODERATOR` | `o-moderator` | `ui-icon-set --o-moderator` ||
|| ![](./_images/icons-list/outline/o-money.svg){width=24px height=24px} | `Outline.MONEY` | `o-money` | `ui-icon-set --o-money` ||
|| ![](./_images/icons-list/outline/o-moon.svg){width=24px height=24px} | `Outline.MOON` | `o-moon` | `ui-icon-set --o-moon` ||
|| ![](./_images/icons-list/outline/o-move-to-checklist.svg){width=24px height=24px} | `Outline.MOVE_TO_CHECKLIST` | `o-move-to-checklist` | `ui-icon-set --o-move-to-checklist` ||
|| ![](./_images/icons-list/outline/o-move-to.svg){width=24px height=24px} | `Outline.MOVE_TO` | `o-move-to` | `ui-icon-set --o-move-to` ||
|| ![](./_images/icons-list/outline/o-multichoice-off.svg){width=24px height=24px} | `Outline.MULTICHOICE_OFF` | `o-multichoice-off` | `ui-icon-set --o-multichoice-off` ||
|| ![](./_images/icons-list/outline/o-multichoice-on.svg){width=24px height=24px} | `Outline.MULTICHOICE_ON` | `o-multichoice-on` | `ui-icon-set --o-multichoice-on` ||
|| ![](./_images/icons-list/outline/o-music.svg){width=24px height=24px} | `Outline.MUSIC` | `o-music` | `ui-icon-set --o-music` ||
|| ![](./_images/icons-list/outline/o-my-deals.svg){width=24px height=24px} | `Outline.MY_DEALS` | `o-my-deals` | `ui-icon-set --o-my-deals` ||
|| ![](./_images/icons-list/outline/o-my-plan.svg){width=24px height=24px} | `Outline.MY_PLAN` | `o-my-plan` | `ui-icon-set --o-my-plan` ||
|| ![](./_images/icons-list/outline/o-neutral.svg){width=24px height=24px} | `Outline.NEUTRAL` | `o-neutral` | `ui-icon-set --o-neutral` ||
|| ![](./_images/icons-list/outline/o-new-message.svg){width=24px height=24px} | `Outline.NEW_MESSAGE` | `o-new-message` | `ui-icon-set --o-new-message` ||
|| ![](./_images/icons-list/outline/o-newsfeed.svg){width=24px height=24px} | `Outline.NEWSFEED` | `o-newsfeed` | `ui-icon-set --o-newsfeed` ||
|| ![](./_images/icons-list/outline/o-next.svg){width=24px height=24px} | `Outline.NEXT` | `o-next` | `ui-icon-set --o-next` ||
|| ![](./_images/icons-list/outline/o-no-wifi.svg){width=24px height=24px} | `Outline.NO_WIFI` | `o-no-wifi` | `ui-icon-set --o-no-wifi` ||
|| ![](./_images/icons-list/outline/o-non-favorite.svg){width=24px height=24px} | `Outline.NON_FAVORITE` | `o-non-favorite` | `ui-icon-set --o-non-favorite` ||
|| ![](./_images/icons-list/outline/o-note.svg){width=24px height=24px} | `Outline.NOTE` | `o-note` | `ui-icon-set --o-note` ||
|| ![](./_images/icons-list/outline/o-notification-off.svg){width=24px height=24px} | `Outline.NOTIFICATION_OFF` | `o-notification-off` | `ui-icon-set --o-notification-off` ||
|| ![](./_images/icons-list/outline/o-notification-settings.svg){width=24px height=24px} | `Outline.NOTIFICATION_SETTINGS` | `o-notification-settings` | `ui-icon-set --o-notification-settings` ||
|| ![](./_images/icons-list/outline/o-notification-with-cross.svg){width=24px height=24px} | `Outline.NOTIFICATION_WITH_CROSS` | `o-notification-with-cross` | `ui-icon-set --o-notification-with-cross` ||
|| ![](./_images/icons-list/outline/o-notification.svg){width=24px height=24px} | `Outline.NOTIFICATION` | `o-notification` | `ui-icon-set --o-notification` ||
|| ![](./_images/icons-list/outline/o-numbered-list.svg){width=24px height=24px} | `Outline.NUMBERED_LIST` | `o-numbered-list` | `ui-icon-set --o-numbered-list` ||
|| ![](./_images/icons-list/outline/o-observer.svg){width=24px height=24px} | `Outline.OBSERVER` | `o-observer` | `ui-icon-set --o-observer` ||
|| ![](./_images/icons-list/outline/o-online-booking.svg){width=24px height=24px} | `Outline.ONLINE_BOOKING` | `o-online-booking` | `ui-icon-set --o-online-booking` ||
|| ![](./_images/icons-list/outline/o-open-channels.svg){width=24px height=24px} | `Outline.OPEN_CHANNELS` | `o-open-channels` | `ui-icon-set --o-open-channels` ||
|| ![](./_images/icons-list/outline/o-open-channels-cross.svg){width=24px height=24px} | `Outline.OPEN_CHANNELS_CROSS` | `o-open-channels-cross` | `ui-icon-set --o-open-channels-cross` ||
|| ![](./_images/icons-list/outline/o-open-chat.svg){width=24px height=24px} | `Outline.OPEN_CHAT` | `o-open-chat` | `ui-icon-set --o-open-chat` ||
|| ![](./_images/icons-list/outline/o-chats-with-check.svg){width=24px height=24px} | `Outline.CHATS_WITH_CHECK` | `o-chats-with-check` | `ui-icon-set --o-chats-with-check` ||
|| ![](./_images/icons-list/outline/o-reply.svg){width=24px height=24px} | `Outline.REPLY` | `o-reply` | `ui-icon-set --o-reply` ||
|| ![](./_images/icons-list/outline/o-package.svg){width=24px height=24px} | `Outline.PACKAGE` | `o-package` | `ui-icon-set --o-package` ||
|| ![](./_images/icons-list/outline/o-palette.svg){width=24px height=24px} | `Outline.PALETTE` | `o-palette` | `ui-icon-set --o-palette` ||
|| ![](./_images/icons-list/outline/o-partner-nfc.svg){width=24px height=24px} | `Outline.PARTNER_NFC` | `o-partner-nfc` | `ui-icon-set --o-partner-nfc` ||
|| ![](./_images/icons-list/outline/o-path.svg){width=24px height=24px} | `Outline.PATH` | `o-path` | `ui-icon-set --o-path` ||
|| ![](./_images/icons-list/outline/o-payment-terminal.svg){width=24px height=24px} | `Outline.PAYMENT_TERMINAL` | `o-payment-terminal` | `ui-icon-set --o-payment-terminal` ||
|| ![](./_images/icons-list/outline/o-payment.svg){width=24px height=24px} | `Outline.PAYMENT` | `o-payment` | `ui-icon-set --o-payment` ||
|| ![](./_images/icons-list/outline/o-person-checks.svg){width=24px height=24px} | `Outline.PERSON_CHECKS` | `o-person-checks` | `ui-icon-set --o-person-checks` ||
|| ![](./_images/icons-list/outline/o-person-descending.svg){width=24px height=24px} | `Outline.PERSON_DESCENDING` | `o-person-descending` | `ui-icon-set --o-person-descending` ||
|| ![](./_images/icons-list/outline/o-person-search.svg){width=24px height=24px} | `Outline.PERSON_SEARCH` | `o-person-search` | `ui-icon-set --o-person-search` ||
|| ![](./_images/icons-list/outline/o-person-settings.svg){width=24px height=24px} | `Outline.PERSON_SETTINGS` | `o-person-settings` | `ui-icon-set --o-person-settings` ||
|| ![](./_images/icons-list/outline/o-person-speak.svg){width=24px height=24px} | `Outline.PERSON_SPEAK` | `o-person-speak` | `ui-icon-set --o-person-speak` ||
|| ![](./_images/icons-list/outline/o-person.svg){width=24px height=24px} | `Outline.PERSON` | `o-person` | `ui-icon-set --o-person` ||
|| ![](./_images/icons-list/outline/o-phone-add.svg){width=24px height=24px} | `Outline.PHONE_ADD` | `o-phone-add` | `ui-icon-set --o-phone-add` ||
|| ![](./_images/icons-list/outline/o-phone-broken.svg){width=24px height=24px} | `Outline.PHONE_BROKEN` | `o-phone-broken` | `ui-icon-set --o-phone-broken` ||
|| ![](./_images/icons-list/outline/o-phone-down.svg){width=24px height=24px} | `Outline.PHONE_DOWN` | `o-phone-down` | `ui-icon-set --o-phone-down` ||
|| ![](./_images/icons-list/outline/o-phone-in.svg){width=24px height=24px} | `Outline.PHONE_IN` | `o-phone-in` | `ui-icon-set --o-phone-in` ||
|| ![](./_images/icons-list/outline/o-phone-out.svg){width=24px height=24px} | `Outline.PHONE_OUT` | `o-phone-out` | `ui-icon-set --o-phone-out` ||
|| ![](./_images/icons-list/outline/o-phone-up.svg){width=24px height=24px} | `Outline.PHONE_UP` | `o-phone-up` | `ui-icon-set --o-phone-up` ||
|| ![](./_images/icons-list/outline/o-pin-list.svg){width=24px height=24px} | `Outline.PIN_LIST` | `o-pin-list` | `ui-icon-set --o-pin-list` ||
|| ![](./_images/icons-list/outline/o-pin.svg){width=24px height=24px} | `Outline.PIN` | `o-pin` | `ui-icon-set --o-pin` ||
|| ![](./_images/icons-list/outline/o-ping.svg){width=24px height=24px} | `Outline.PING` | `o-ping` | `ui-icon-set --o-ping` ||
|| ![](./_images/icons-list/outline/o-pitch-zoom.svg){width=24px height=24px} | `Outline.PITCH_ZOOM` | `o-pitch-zoom` | `ui-icon-set --o-pitch-zoom` ||
|| ![](./_images/icons-list/outline/o-planning.svg){width=24px height=24px} | `Outline.PLANNING` | `o-planning` | `ui-icon-set --o-planning` ||
|| ![](./_images/icons-list/outline/o-point-left.svg){width=24px height=24px} | `Outline.POINT_LEFT` | `o-point-left` | `ui-icon-set --o-point-left` ||
|| ![](./_images/icons-list/outline/o-point-right.svg){width=24px height=24px} | `Outline.POINT_RIGHT` | `o-point-right` | `ui-icon-set --o-point-right` ||
|| ![](./_images/icons-list/outline/o-power.svg){width=24px height=24px} | `Outline.POWER` | `o-power` | `ui-icon-set --o-power` ||
|| ![](./_images/icons-list/outline/o-printer.svg){width=24px height=24px} | `Outline.PRINTER` | `o-printer` | `ui-icon-set --o-printer` ||
|| ![](./_images/icons-list/outline/o-processes.svg){width=24px height=24px} | `Outline.PROCESSES` | `o-processes` | `ui-icon-set --o-processes` ||
|| ![](./_images/icons-list/outline/o-product.svg){width=24px height=24px} | `Outline.PRODUCT` | `o-product` | `ui-icon-set --o-product` ||
|| ![](./_images/icons-list/outline/o-prompt-library.svg){width=24px height=24px} | `Outline.PROMPT_LIBRARY` | `o-prompt-library` | `ui-icon-set --o-prompt-library` ||
|| ![](./_images/icons-list/outline/o-prompt-var.svg){width=24px height=24px} | `Outline.PROMPT_VAR` | `o-prompt-var` | `ui-icon-set --o-prompt-var` ||
|| ![](./_images/icons-list/outline/o-pulse.svg){width=24px height=24px} | `Outline.PULSE` | `o-pulse` | `ui-icon-set --o-pulse` ||
|| ![](./_images/icons-list/outline/o-qr-code.svg){width=24px height=24px} | `Outline.QR_CODE` | `o-qr-code` | `ui-icon-set --o-qr-code` ||
|| ![](./_images/icons-list/outline/o-quantity.svg){width=24px height=24px} | `Outline.QUANTITY` | `o-quantity` | `ui-icon-set --o-quantity` ||
|| ![](./_images/icons-list/outline/o-question-l.svg){width=24px height=24px} | `Outline.QUESTION_L` | `o-question-l` | `ui-icon-set --o-question-l` ||
|| ![](./_images/icons-list/outline/o-question.svg){width=24px height=24px} | `Outline.QUESTION` | `o-question` | `ui-icon-set --o-question` ||
|| ![](./_images/icons-list/outline/o-quote.svg){width=24px height=24px} | `Outline.QUOTE` | `o-quote` | `ui-icon-set --o-quote` ||
|| ![](./_images/icons-list/outline/o-record-video.svg){width=24px height=24px} | `Outline.RECORD_VIDEO` | `o-record-video` | `ui-icon-set --o-record-video` ||
|| ![](./_images/icons-list/outline/o-redo.svg){width=24px height=24px} | `Outline.REDO` | `o-redo` | `ui-icon-set --o-redo` ||
|| ![](./_images/icons-list/outline/o-refresh.svg){width=24px height=24px} | `Outline.REFRESH` | `o-refresh` | `ui-icon-set --o-refresh` ||
|| ![](./_images/icons-list/outline/o-related-tasks.svg){width=24px height=24px} | `Outline.RELATED_TASKS` | `o-related-tasks` | `ui-icon-set --o-related-tasks` ||
|| ![](./_images/icons-list/outline/o-remove-person.svg){width=24px height=24px} | `Outline.REMOVE_PERSON` | `o-remove-person` | `ui-icon-set --o-remove-person` ||
|| ![](./_images/icons-list/outline/o-repeat-cycle.svg){width=24px height=24px} | `Outline.REPEAT_CYCLE` | `o-repeat-cycle` | `ui-icon-set --o-repeat-cycle` ||
|| ![](./_images/icons-list/outline/o-repeat-sales.svg){width=24px height=24px} | `Outline.REPEAT_SALES` | `o-repeat-sales` | `ui-icon-set --o-repeat-sales` ||
|| ![](./_images/icons-list/outline/o-repeat.svg){width=24px height=24px} | `Outline.REPEAT` | `o-repeat` | `ui-icon-set --o-repeat` ||
|| ![](./_images/icons-list/outline/o-resume.svg){width=24px height=24px} | `Outline.RESUME` | `o-resume` | `ui-icon-set --o-resume` ||
|| ![](./_images/icons-list/outline/o-robot.svg){width=24px height=24px} | `Outline.ROBOT` | `o-robot` | `ui-icon-set --o-robot` ||
|| ![](./_images/icons-list/outline/o-rocket.svg){width=24px height=24px} | `Outline.ROCKET` | `o-rocket` | `ui-icon-set --o-rocket` ||
|| ![](./_images/icons-list/outline/o-running-man.svg){width=24px height=24px} | `Outline.RUNNING_MAN` | `o-running-man` | `ui-icon-set --o-running-man` ||
|| ![](./_images/icons-list/outline/o-sad.svg){width=24px height=24px} | `Outline.SAD` | `o-sad` | `ui-icon-set --o-sad` ||
|| ![](./_images/icons-list/outline/o-sale-tag.svg){width=24px height=24px} | `Outline.SALE_TAG` | `o-sale-tag` | `ui-icon-set --o-sale-tag` ||
|| ![](./_images/icons-list/outline/o-screen.svg){width=24px height=24px} | `Outline.SCREEN` | `o-screen` | `ui-icon-set --o-screen` ||
|| ![](./_images/icons-list/outline/o-scrum.svg){width=24px height=24px} | `Outline.SCRUM` | `o-scrum` | `ui-icon-set --o-scrum` ||
|| ![](./_images/icons-list/outline/o-search.svg){width=24px height=24px} | `Outline.SEARCH` | `o-search` | `ui-icon-set --o-search` ||
|| ![](./_images/icons-list/outline/o-send.svg){width=24px height=24px} | `Outline.SEND` | `o-send` | `ui-icon-set --o-send` ||
|| ![](./_images/icons-list/outline/o-sended.svg){width=24px height=24px} | `Outline.SENDED` | `o-sended` | `ui-icon-set --o-sended` ||
|| ![](./_images/icons-list/outline/o-services.svg){width=24px height=24px} | `Outline.SERVICES` | `o-services` | `ui-icon-set --o-services` ||
|| ![](./_images/icons-list/outline/o-set-columns.svg){width=24px height=24px} | `Outline.SET_COLUMNS` | `o-set-columns` | `ui-icon-set --o-set-columns` ||
|| ![](./_images/icons-list/outline/o-settings.svg){width=24px height=24px} | `Outline.SETTINGS` | `o-settings` | `ui-icon-set --o-settings` ||
|| ![](./_images/icons-list/outline/o-share-task.svg){width=24px height=24px} | `Outline.SHARE_TASK` | `o-share-task` | `ui-icon-set --o-share-task` ||
|| ![](./_images/icons-list/outline/o-share.svg){width=24px height=24px} | `Outline.SHARE` | `o-share` | `ui-icon-set --o-share` ||
|| ![](./_images/icons-list/outline/o-shield-attention.svg){width=24px height=24px} | `Outline.SHIELD_ATTENTION` | `o-shield-attention` | `ui-icon-set --o-shield-attention` ||
|| ![](./_images/icons-list/outline/o-shield-checked.svg){width=24px height=24px} | `Outline.SHIELD_CHECKED` | `o-shield-checked` | `ui-icon-set --o-shield-checked` ||
|| ![](./_images/icons-list/outline/o-shield.svg){width=24px height=24px} | `Outline.SHIELD` | `o-shield` | `ui-icon-set --o-shield` ||
|| ![](./_images/icons-list/outline/o-shopping-cart.svg){width=24px height=24px} | `Outline.SHOPPING_CART` | `o-shopping-cart` | `ui-icon-set --o-shopping-cart` ||
|| ![](./_images/icons-list/outline/o-shuffle.svg){width=24px height=24px} | `Outline.SHUFFLE` | `o-shuffle` | `ui-icon-set --o-shuffle` ||
|| ![](./_images/icons-list/outline/o-sick.svg){width=24px height=24px} | `Outline.SICK` | `o-sick` | `ui-icon-set --o-sick` ||
|| ![](./_images/icons-list/outline/o-sigma-summ.svg){width=24px height=24px} | `Outline.SIGMA_SUMM` | `o-sigma-summ` | `ui-icon-set --o-sigma-summ` ||
|| ![](./_images/icons-list/outline/o-sign.svg){width=24px height=24px} | `Outline.SIGN` | `o-sign` | `ui-icon-set --o-sign` ||
|| ![](./_images/icons-list/outline/o-smart-activity.svg){width=24px height=24px} | `Outline.SMART_ACTIVITY` | `o-smart-activity` | `ui-icon-set --o-smart-activity` ||
|| ![](./_images/icons-list/outline/o-smart-process.svg){width=24px height=24px} | `Outline.SMART_PROCESS` | `o-smart-process` | `ui-icon-set --o-smart-process` ||
|| ![](./_images/icons-list/outline/o-smile.svg){width=24px height=24px} | `Outline.SMILE` | `o-smile` | `ui-icon-set --o-smile` ||
|| ![](./_images/icons-list/outline/o-sms.svg){width=24px height=24px} | `Outline.SMS` | `o-sms` | `ui-icon-set --o-sms` ||
|| ![](./_images/icons-list/outline/o-sort-activity.svg){width=24px height=24px} | `Outline.SORT_ACTIVITY` | `o-sort-activity` | `ui-icon-set --o-sort-activity` ||
|| ![](./_images/icons-list/outline/o-sort-calendar.svg){width=24px height=24px} | `Outline.SORT_CALENDAR` | `o-sort-calendar` | `ui-icon-set --o-sort-calendar` ||
|| ![](./_images/icons-list/outline/o-sound-off.svg){width=24px height=24px} | `Outline.SOUND_OFF` | `o-sound-off` | `ui-icon-set --o-sound-off` ||
|| ![](./_images/icons-list/outline/o-sound-on.svg){width=24px height=24px} | `Outline.SOUND_ON` | `o-sound-on` | `ui-icon-set --o-sound-on` ||
|| ![](./_images/icons-list/outline/o-speaker.svg){width=24px height=24px} | `Outline.SPEAKER` | `o-speaker` | `ui-icon-set --o-speaker` ||
|| ![](./_images/icons-list/outline/o-speed-0_5.svg){width=24px height=24px} | `Outline.SPEED_0_5` | `o-speed-0_5` | `ui-icon-set --o-speed-0_5` ||
|| ![](./_images/icons-list/outline/o-speed-0_7.svg){width=24px height=24px} | `Outline.SPEED_0_7` | `o-speed-0_7` | `ui-icon-set --o-speed-0_7` ||
|| ![](./_images/icons-list/outline/o-speed-1.svg){width=24px height=24px} | `Outline.SPEED_1` | `o-speed-1` | `ui-icon-set --o-speed-1` ||
|| ![](./_images/icons-list/outline/o-speed-1_2.svg){width=24px height=24px} | `Outline.SPEED_1_2` | `o-speed-1_2` | `ui-icon-set --o-speed-1_2` ||
|| ![](./_images/icons-list/outline/o-speed-1_5.svg){width=24px height=24px} | `Outline.SPEED_1_5` | `o-speed-1_5` | `ui-icon-set --o-speed-1_5` ||
|| ![](./_images/icons-list/outline/o-speed-1_7.svg){width=24px height=24px} | `Outline.SPEED_1_7` | `o-speed-1_7` | `ui-icon-set --o-speed-1_7` ||
|| ![](./_images/icons-list/outline/o-speed-2.svg){width=24px height=24px} | `Outline.SPEED_2` | `o-speed-2` | `ui-icon-set --o-speed-2` ||
|| ![](./_images/icons-list/outline/o-speed-meter.svg){width=24px height=24px} | `Outline.SPEED_METER` | `o-speed-meter` | `ui-icon-set --o-speed-meter` ||
|| ![](./_images/icons-list/outline/o-sport-marathon.svg){width=24px height=24px} | `Outline.SPORT_MARATHON` | `o-sport-marathon` | `ui-icon-set --o-sport-marathon` ||
|| ![](./_images/icons-list/outline/o-stage-minus.svg){width=24px height=24px} | `Outline.STAGE_MINUS` | `o-stage-minus` | `ui-icon-set --o-stage-minus` ||
|| ![](./_images/icons-list/outline/o-stage-plus.svg){width=24px height=24px} | `Outline.STAGE_PLUS` | `o-stage-plus` | `ui-icon-set --o-stage-plus` ||
|| ![](./_images/icons-list/outline/o-stage.svg){width=24px height=24px} | `Outline.STAGE` | `o-stage` | `ui-icon-set --o-stage` ||
|| ![](./_images/icons-list/outline/o-stages.svg){width=24px height=24px} | `Outline.STAGES` | `o-stages` | `ui-icon-set --o-stages` ||
|| ![](./_images/icons-list/outline/o-stock.svg){width=24px height=24px} | `Outline.STOCK` | `o-stock` | `ui-icon-set --o-stock` ||
|| ![](./_images/icons-list/outline/o-stop-hand-crossed.svg){width=24px height=24px} | `Outline.STOP_HAND_CROSSED` | `o-stop-hand-crossed` | `ui-icon-set --o-stop-hand-crossed` ||
|| ![](./_images/icons-list/outline/o-stop-hand.svg){width=24px height=24px} | `Outline.STOP_HAND` | `o-stop-hand` | `ui-icon-set --o-stop-hand` ||
|| ![](./_images/icons-list/outline/o-storage.svg){width=24px height=24px} | `Outline.STORAGE` | `o-storage` | `ui-icon-set --o-storage` ||
|| ![](./_images/icons-list/outline/o-stress.svg){width=24px height=24px} | `Outline.STRESS` | `o-stress` | `ui-icon-set --o-stress` ||
|| ![](./_images/icons-list/outline/o-strikethrough.svg){width=24px height=24px} | `Outline.STRIKETHROUGH` | `o-strikethrough` | `ui-icon-set --o-strikethrough` ||
|| ![](./_images/icons-list/outline/o-structure-horizontal.svg){width=24px height=24px} | `Outline.STRUCTURE_HORIZONTAL` | `o-structure-horizontal` | `ui-icon-set --o-structure-horizontal` ||
|| ![](./_images/icons-list/outline/o-structure-vertical.svg){width=24px height=24px} | `Outline.STRUCTURE_VERTICAL` | `o-structure-vertical` | `ui-icon-set --o-structure-vertical` ||
|| ![](./_images/icons-list/outline/o-subtask.svg){width=24px height=24px} | `Outline.SUBTASK` | `o-subtask` | `ui-icon-set --o-subtask` ||
|| ![](./_images/icons-list/outline/o-suitcase.svg){width=24px height=24px} | `Outline.SUITCASE` | `o-suitcase` | `ui-icon-set --o-suitcase` ||
|| ![](./_images/icons-list/outline/o-sun.svg){width=24px height=24px} | `Outline.SUN` | `o-sun` | `ui-icon-set --o-sun` ||
|| ![](./_images/icons-list/outline/o-switch-camera.svg){width=24px height=24px} | `Outline.SWITCH_CAMERA` | `o-switch-camera` | `ui-icon-set --o-switch-camera` ||
|| ![](./_images/icons-list/outline/o-switcher.svg){width=24px height=24px} | `Outline.SWITCHER` | `o-switcher` | `ui-icon-set --o-switcher` ||
|| ![](./_images/icons-list/outline/o-tablet.svg){width=24px height=24px} | `Outline.TABLET` | `o-tablet` | `ui-icon-set --o-tablet` ||
|| ![](./_images/icons-list/outline/o-tag.svg){width=24px height=24px} | `Outline.TAG` | `o-tag` | `ui-icon-set --o-tag` ||
|| ![](./_images/icons-list/outline/o-tariff-scaner.svg){width=24px height=24px} | `Outline.TARIFF_SCANER` | `o-tariff-scaner` | `ui-icon-set --o-tariff-scaner` ||
|| ![](./_images/icons-list/outline/o-task-list.svg){width=24px height=24px} | `Outline.TASK_LIST` | `o-task-list` | `ui-icon-set --o-task-list` ||
|| ![](./_images/icons-list/outline/o-task.svg){width=24px height=24px} | `Outline.TASK` | `o-task` | `ui-icon-set --o-task` ||
|| ![](./_images/icons-list/outline/o-telegram.svg){width=24px height=24px} | `Outline.TELEGRAM` | `o-telegram` | `ui-icon-set --o-telegram` ||
|| ![](./_images/icons-list/outline/o-telephony.svg){width=24px height=24px} | `Outline.TELEPHONY` | `o-telephony` | `ui-icon-set --o-telephony` ||
|| ![](./_images/icons-list/outline/o-text.svg){width=24px height=24px} | `Outline.TEXT` | `o-text` | `ui-icon-set --o-text` ||
|| ![](./_images/icons-list/outline/o-theme.svg){width=24px height=24px} | `Outline.THEME` | `o-theme` | `ui-icon-set --o-theme` ||
|| ![](./_images/icons-list/outline/o-thread-single.svg){width=24px height=24px} | `Outline.THREAD_SINGLE` | `o-thread-single` | `ui-icon-set --o-thread-single` ||
|| ![](./_images/icons-list/outline/o-thread.svg){width=24px height=24px} | `Outline.THREAD` | `o-thread` | `ui-icon-set --o-thread` ||
|| ![](./_images/icons-list/outline/o-timeline.svg){width=24px height=24px} | `Outline.TIMELINE` | `o-timeline` | `ui-icon-set --o-timeline` ||
|| ![](./_images/icons-list/outline/o-timer-dot.svg){width=24px height=24px} | `Outline.TIMER_DOT` | `o-timer-dot` | `ui-icon-set --o-timer-dot` ||
|| ![](./_images/icons-list/outline/o-timer.svg){width=24px height=24px} | `Outline.TIMER` | `o-timer` | `ui-icon-set --o-timer` ||
|| ![](./_images/icons-list/outline/o-topic.svg){width=24px height=24px} | `Outline.TOPIC` | `o-topic` | `ui-icon-set --o-topic` ||
|| ![](./_images/icons-list/outline/o-translation.svg){width=24px height=24px} | `Outline.TRANSLATION` | `o-translation` | `ui-icon-set --o-translation` ||
|| ![](./_images/icons-list/outline/o-trashcan.svg){width=24px height=24px} | `Outline.TRASHCAN` | `o-trashcan` | `ui-icon-set --o-trashcan` ||
|| ![](./_images/icons-list/outline/o-trend-down.svg){width=24px height=24px} | `Outline.TREND_DOWN` | `o-trend-down` | `ui-icon-set --o-trend-down` ||
|| ![](./_images/icons-list/outline/o-trend-up.svg){width=24px height=24px} | `Outline.TREND_UP` | `o-trend-up` | `ui-icon-set --o-trend-up` ||
|| ![](./_images/icons-list/outline/o-underline.svg){width=24px height=24px} | `Outline.UNDERLINE` | `o-underline` | `ui-icon-set --o-underline` ||
|| ![](./_images/icons-list/outline/o-undo.svg){width=24px height=24px} | `Outline.UNDO` | `o-undo` | `ui-icon-set --o-undo` ||
|| ![](./_images/icons-list/outline/o-unlink.svg){width=24px height=24px} | `Outline.UNLINK` | `o-unlink` | `ui-icon-set --o-unlink` ||
|| ![](./_images/icons-list/outline/o-unpin.svg){width=24px height=24px} | `Outline.UNPIN` | `o-unpin` | `ui-icon-set --o-unpin` ||
|| ![](./_images/icons-list/outline/o-upload-document.svg){width=24px height=24px} | `Outline.UPLOAD_DOCUMENT` | `o-upload-document` | `ui-icon-set --o-upload-document` ||
|| ![](./_images/icons-list/outline/o-upload-file.svg){width=24px height=24px} | `Outline.UPLOAD_FILE` | `o-upload-file` | `ui-icon-set --o-upload-file` ||
|| ![](./_images/icons-list/outline/o-upload.svg){width=24px height=24px} | `Outline.UPLOAD` | `o-upload` | `ui-icon-set --o-upload` ||
|| ![](./_images/icons-list/outline/o-user-mask.svg){width=24px height=24px} | `Outline.USER_MASK` | `o-user-mask` | `ui-icon-set --o-user-mask` ||
|| ![](./_images/icons-list/outline/o-vacation.svg){width=24px height=24px} | `Outline.VACATION` | `o-vacation` | `ui-icon-set --o-vacation` ||
|| ![](./_images/icons-list/outline/o-wallet.svg){width=24px height=24px} | `Outline.WALLET` | `o-wallet` | `ui-icon-set --o-wallet` ||
|| ![](./_images/icons-list/outline/o-wifi.svg){width=24px height=24px} | `Outline.WIFI` | `o-wifi` | `ui-icon-set --o-wifi` ||
|| ![](./_images/icons-list/outline/o-window-flag.svg){width=24px height=24px} | `Outline.WINDOW_FLAG` | `o-window-flag` | `ui-icon-set --o-window-flag` ||
|| ![](./_images/icons-list/outline/o-window-ring.svg){width=24px height=24px} | `Outline.WINDOW_RING` | `o-window-ring` | `ui-icon-set --o-window-ring` ||
|| ![](./_images/icons-list/outline/o-yandex-maps.svg){width=24px height=24px} | `Outline.YANDEX_MAPS` | `o-yandex-maps` | `ui-icon-set --o-yandex-maps` ||
|| ![](./_images/icons-list/outline/o-zoom-in.svg){width=24px height=24px} | `Outline.ZOOM_IN` | `o-zoom-in` | `ui-icon-set --o-zoom-in` ||
|| ![](./_images/icons-list/outline/o-zoom-out.svg){width=24px height=24px} | `Outline.ZOOM_OUT` | `o-zoom-out` | `ui-icon-set --o-zoom-out` ||
|| ![](./_images/icons-list/outline/arrow-down-l.svg){width=24px height=24px} | `Outline.ARROW_DOWN_L` | `arrow-down-l` | `ui-icon-set --arrow-down-l` ||
|| ![](./_images/icons-list/outline/arrow-down-m.svg){width=24px height=24px} | `Outline.ARROW_DOWN_M` | `arrow-down-m` | `ui-icon-set --arrow-down-m` ||
|| ![](./_images/icons-list/outline/arrow-down-s.svg){width=24px height=24px} | `Outline.ARROW_DOWN_S` | `arrow-down-s` | `ui-icon-set --arrow-down-s` ||
|| ![](./_images/icons-list/outline/arrow-down-xs.svg){width=24px height=24px} | `Outline.ARROW_DOWN_XS` | `arrow-down-xs` | `ui-icon-set --arrow-down-xs` ||
|| ![](./_images/icons-list/outline/arrow-left-l.svg){width=24px height=24px} | `Outline.ARROW_LEFT_L` | `arrow-left-l` | `ui-icon-set --arrow-left-l` ||
|| ![](./_images/icons-list/outline/arrow-left-m.svg){width=24px height=24px} | `Outline.ARROW_LEFT_M` | `arrow-left-m` | `ui-icon-set --arrow-left-m` ||
|| ![](./_images/icons-list/outline/arrow-left-s.svg){width=24px height=24px} | `Outline.ARROW_LEFT_S` | `arrow-left-s` | `ui-icon-set --arrow-left-s` ||
|| ![](./_images/icons-list/outline/arrow-left-xs.svg){width=24px height=24px} | `Outline.ARROW_LEFT_XS` | `arrow-left-xs` | `ui-icon-set --arrow-left-xs` ||
|| ![](./_images/icons-list/outline/arrow-right-l.svg){width=24px height=24px} | `Outline.ARROW_RIGHT_L` | `arrow-right-l` | `ui-icon-set --arrow-right-l` ||
|| ![](./_images/icons-list/outline/arrow-right-m.svg){width=24px height=24px} | `Outline.ARROW_RIGHT_M` | `arrow-right-m` | `ui-icon-set --arrow-right-m` ||
|| ![](./_images/icons-list/outline/arrow-right-s.svg){width=24px height=24px} | `Outline.ARROW_RIGHT_S` | `arrow-right-s` | `ui-icon-set --arrow-right-s` ||
|| ![](./_images/icons-list/outline/arrow-right-xs.svg){width=24px height=24px} | `Outline.ARROW_RIGHT_XS` | `arrow-right-xs` | `ui-icon-set --arrow-right-xs` ||
|| ![](./_images/icons-list/outline/arrow-top-l.svg){width=24px height=24px} | `Outline.ARROW_TOP_L` | `arrow-top-l` | `ui-icon-set --arrow-top-l` ||
|| ![](./_images/icons-list/outline/arrow-top-m.svg){width=24px height=24px} | `Outline.ARROW_TOP_M` | `arrow-top-m` | `ui-icon-set --arrow-top-m` ||
|| ![](./_images/icons-list/outline/arrow-top-s.svg){width=24px height=24px} | `Outline.ARROW_TOP_S` | `arrow-top-s` | `ui-icon-set --arrow-top-s` ||
|| ![](./_images/icons-list/outline/arrow-top-xs.svg){width=24px height=24px} | `Outline.ARROW_TOP_XS` | `arrow-top-xs` | `ui-icon-set --arrow-top-xs` ||
|| ![](./_images/icons-list/outline/ban-l.svg){width=24px height=24px} | `Outline.BAN_L` | `ban-l` | `ui-icon-set --ban-l` ||
|| ![](./_images/icons-list/outline/ban-m.svg){width=24px height=24px} | `Outline.BAN_M` | `ban-m` | `ui-icon-set --ban-m` ||
|| ![](./_images/icons-list/outline/ban-s.svg){width=24px height=24px} | `Outline.BAN_S` | `ban-s` | `ui-icon-set --ban-s` ||
|| ![](./_images/icons-list/outline/ban-xs.svg){width=24px height=24px} | `Outline.BAN_XS` | `ban-xs` | `ui-icon-set --ban-xs` ||
|| ![](./_images/icons-list/outline/check-l.svg){width=24px height=24px} | `Outline.CHECK_L` | `check-l` | `ui-icon-set --check-l` ||
|| ![](./_images/icons-list/outline/check-m.svg){width=24px height=24px} | `Outline.CHECK_M` | `check-m` | `ui-icon-set --check-m` ||
|| ![](./_images/icons-list/outline/check-s.svg){width=24px height=24px} | `Outline.CHECK_S` | `check-s` | `ui-icon-set --check-s` ||
|| ![](./_images/icons-list/outline/check-xs.svg){width=24px height=24px} | `Outline.CHECK_XS` | `check-xs` | `ui-icon-set --check-xs` ||
|| ![](./_images/icons-list/outline/chevron-down-l.svg){width=24px height=24px} | `Outline.CHEVRON_DOWN_L` | `chevron-down-l` | `ui-icon-set --chevron-down-l` ||
|| ![](./_images/icons-list/outline/chevron-down-m.svg){width=24px height=24px} | `Outline.CHEVRON_DOWN_M` | `chevron-down-m` | `ui-icon-set --chevron-down-m` ||
|| ![](./_images/icons-list/outline/chevron-down-s.svg){width=24px height=24px} | `Outline.CHEVRON_DOWN_S` | `chevron-down-s` | `ui-icon-set --chevron-down-s` ||
|| ![](./_images/icons-list/outline/chevron-down-xs.svg){width=24px height=24px} | `Outline.CHEVRON_DOWN_XS` | `chevron-down-xs` | `ui-icon-set --chevron-down-xs` ||
|| ![](./_images/icons-list/outline/chevron-left-l.svg){width=24px height=24px} | `Outline.CHEVRON_LEFT_L` | `chevron-left-l` | `ui-icon-set --chevron-left-l` ||
|| ![](./_images/icons-list/outline/chevron-left-m.svg){width=24px height=24px} | `Outline.CHEVRON_LEFT_M` | `chevron-left-m` | `ui-icon-set --chevron-left-m` ||
|| ![](./_images/icons-list/outline/chevron-left-s.svg){width=24px height=24px} | `Outline.CHEVRON_LEFT_S` | `chevron-left-s` | `ui-icon-set --chevron-left-s` ||
|| ![](./_images/icons-list/outline/chevron-left-xs.svg){width=24px height=24px} | `Outline.CHEVRON_LEFT_XS` | `chevron-left-xs` | `ui-icon-set --chevron-left-xs` ||
|| ![](./_images/icons-list/outline/chevron-right-l.svg){width=24px height=24px} | `Outline.CHEVRON_RIGHT_L` | `chevron-right-l` | `ui-icon-set --chevron-right-l` ||
|| ![](./_images/icons-list/outline/chevron-right-m.svg){width=24px height=24px} | `Outline.CHEVRON_RIGHT_M` | `chevron-right-m` | `ui-icon-set --chevron-right-m` ||
|| ![](./_images/icons-list/outline/chevron-right-s.svg){width=24px height=24px} | `Outline.CHEVRON_RIGHT_S` | `chevron-right-s` | `ui-icon-set --chevron-right-s` ||
|| ![](./_images/icons-list/outline/chevron-right-xs.svg){width=24px height=24px} | `Outline.CHEVRON_RIGHT_XS` | `chevron-right-xs` | `ui-icon-set --chevron-right-xs` ||
|| ![](./_images/icons-list/outline/chevron-top-l.svg){width=24px height=24px} | `Outline.CHEVRON_TOP_L` | `chevron-top-l` | `ui-icon-set --chevron-top-l` ||
|| ![](./_images/icons-list/outline/chevron-top-m.svg){width=24px height=24px} | `Outline.CHEVRON_TOP_M` | `chevron-top-m` | `ui-icon-set --chevron-top-m` ||
|| ![](./_images/icons-list/outline/chevron-top-s.svg){width=24px height=24px} | `Outline.CHEVRON_TOP_S` | `chevron-top-s` | `ui-icon-set --chevron-top-s` ||
|| ![](./_images/icons-list/outline/chevron-top-xs.svg){width=24px height=24px} | `Outline.CHEVRON_TOP_XS` | `chevron-top-xs` | `ui-icon-set --chevron-top-xs` ||
|| ![](./_images/icons-list/outline/collapse-l.svg){width=24px height=24px} | `Outline.COLLAPSE_L` | `collapse-l` | `ui-icon-set --collapse-l` ||
|| ![](./_images/icons-list/outline/collapse-m.svg){width=24px height=24px} | `Outline.COLLAPSE_M` | `collapse-m` | `ui-icon-set --collapse-m` ||
|| ![](./_images/icons-list/outline/collapse-s.svg){width=24px height=24px} | `Outline.COLLAPSE_S` | `collapse-s` | `ui-icon-set --collapse-s` ||
|| ![](./_images/icons-list/outline/collapse-xs.svg){width=24px height=24px} | `Outline.COLLAPSE_XS` | `collapse-xs` | `ui-icon-set --collapse-xs` ||
|| ![](./_images/icons-list/outline/cross-l.svg){width=24px height=24px} | `Outline.CROSS_L` | `cross-l` | `ui-icon-set --cross-l` ||
|| ![](./_images/icons-list/outline/cross-m.svg){width=24px height=24px} | `Outline.CROSS_M` | `cross-m` | `ui-icon-set --cross-m` ||
|| ![](./_images/icons-list/outline/cross-s.svg){width=24px height=24px} | `Outline.CROSS_S` | `cross-s` | `ui-icon-set --cross-s` ||
|| ![](./_images/icons-list/outline/cross-xs.svg){width=24px height=24px} | `Outline.CROSS_XS` | `cross-xs` | `ui-icon-set --cross-xs` ||
|| ![](./_images/icons-list/outline/drag-l.svg){width=24px height=24px} | `Outline.DRAG_L` | `drag-l` | `ui-icon-set --drag-l` ||
|| ![](./_images/icons-list/outline/drag-m.svg){width=24px height=24px} | `Outline.DRAG_M` | `drag-m` | `ui-icon-set --drag-m` ||
|| ![](./_images/icons-list/outline/drag-s.svg){width=24px height=24px} | `Outline.DRAG_S` | `drag-s` | `ui-icon-set --drag-s` ||
|| ![](./_images/icons-list/outline/drag-xs.svg){width=24px height=24px} | `Outline.DRAG_XS` | `drag-xs` | `ui-icon-set --drag-xs` ||
|| ![](./_images/icons-list/outline/edit-l.svg){width=24px height=24px} | `Outline.EDIT_L` | `edit-l` | `ui-icon-set --edit-l` ||
|| ![](./_images/icons-list/outline/edit-m.svg){width=24px height=24px} | `Outline.EDIT_M` | `edit-m` | `ui-icon-set --edit-m` ||
|| ![](./_images/icons-list/outline/edit-s.svg){width=24px height=24px} | `Outline.EDIT_S` | `edit-s` | `ui-icon-set --edit-s` ||
|| ![](./_images/icons-list/outline/edit-xs.svg){width=24px height=24px} | `Outline.EDIT_XS` | `edit-xs` | `ui-icon-set --edit-xs` ||
|| ![](./_images/icons-list/outline/exclamation-l.svg){width=24px height=24px} | `Outline.EXCLAMATION_L` | `exclamation-l` | `ui-icon-set --exclamation-l` ||
|| ![](./_images/icons-list/outline/exclamation-m.svg){width=24px height=24px} | `Outline.EXCLAMATION_M` | `exclamation-m` | `ui-icon-set --exclamation-m` ||
|| ![](./_images/icons-list/outline/exclamation-s.svg){width=24px height=24px} | `Outline.EXCLAMATION_S` | `exclamation-s` | `ui-icon-set --exclamation-s` ||
|| ![](./_images/icons-list/outline/exclamation-xs.svg){width=24px height=24px} | `Outline.EXCLAMATION_XS` | `exclamation-xs` | `ui-icon-set --exclamation-xs` ||
|| ![](./_images/icons-list/outline/o-exclamation-circle.svg){width=24px height=24px} | `Outline.EXCLAMATION_CIRCLE` | `o-exclamation-circle` | `ui-icon-set --o-exclamation-circle` ||
|| ![](./_images/icons-list/outline/expand-l.svg){width=24px height=24px} | `Outline.EXPAND_L` | `expand-l` | `ui-icon-set --expand-l` ||
|| ![](./_images/icons-list/outline/expand-m.svg){width=24px height=24px} | `Outline.EXPAND_M` | `expand-m` | `ui-icon-set --expand-m` ||
|| ![](./_images/icons-list/outline/expand-s.svg){width=24px height=24px} | `Outline.EXPAND_S` | `expand-s` | `ui-icon-set --expand-s` ||
|| ![](./_images/icons-list/outline/expand-xs.svg){width=24px height=24px} | `Outline.EXPAND_XS` | `expand-xs` | `ui-icon-set --expand-xs` ||
|| ![](./_images/icons-list/outline/filter-2-l.svg){width=24px height=24px} | `Outline.FILTER_2_L` | `filter-2-l` | `ui-icon-set --filter-2-l` ||
|| ![](./_images/icons-list/outline/filter-2-m.svg){width=24px height=24px} | `Outline.FILTER_2_M` | `filter-2-m` | `ui-icon-set --filter-2-m` ||
|| ![](./_images/icons-list/outline/filter-2-s.svg){width=24px height=24px} | `Outline.FILTER_2_S` | `filter-2-s` | `ui-icon-set --filter-2-s` ||
|| ![](./_images/icons-list/outline/filter-2-xs.svg){width=24px height=24px} | `Outline.FILTER_2_XS` | `filter-2-xs` | `ui-icon-set --filter-2-xs` ||
|| ![](./_images/icons-list/outline/go-to-l.svg){width=24px height=24px} | `Outline.GO_TO_L` | `go-to-l` | `ui-icon-set --go-to-l` ||
|| ![](./_images/icons-list/outline/go-to-m.svg){width=24px height=24px} | `Outline.GO_TO_M` | `go-to-m` | `ui-icon-set --go-to-m` ||
|| ![](./_images/icons-list/outline/go-to-s.svg){width=24px height=24px} | `Outline.GO_TO_S` | `go-to-s` | `ui-icon-set --go-to-s` ||
|| ![](./_images/icons-list/outline/go-to-xs.svg){width=24px height=24px} | `Outline.GO_TO_XS` | `go-to-xs` | `ui-icon-set --go-to-xs` ||
|| ![](./_images/icons-list/outline/lock-l.svg){width=24px height=24px} | `Outline.LOCK_L` | `lock-l` | `ui-icon-set --lock-l` ||
|| ![](./_images/icons-list/outline/lock-m.svg){width=24px height=24px} | `Outline.LOCK_M` | `lock-m` | `ui-icon-set --lock-m` ||
|| ![](./_images/icons-list/outline/lock-s.svg){width=24px height=24px} | `Outline.LOCK_S` | `lock-s` | `ui-icon-set --lock-s` ||
|| ![](./_images/icons-list/outline/lock-xs.svg){width=24px height=24px} | `Outline.LOCK_XS` | `lock-xs` | `ui-icon-set --lock-xs` ||
|| ![](./_images/icons-list/outline/lock-2.svg){width=24px height=24px} | `Outline.LOCK_2` | `lock-2` | `ui-icon-set --lock-2` ||
|| ![](./_images/icons-list/outline/minus-l.svg){width=24px height=24px} | `Outline.MINUS_L` | `minus-l` | `ui-icon-set --minus-l` ||
|| ![](./_images/icons-list/outline/minus-m.svg){width=24px height=24px} | `Outline.MINUS_M` | `minus-m` | `ui-icon-set --minus-m` ||
|| ![](./_images/icons-list/outline/minus-s.svg){width=24px height=24px} | `Outline.MINUS_S` | `minus-s` | `ui-icon-set --minus-s` ||
|| ![](./_images/icons-list/outline/minus-xs.svg){width=24px height=24px} | `Outline.MINUS_XS` | `minus-xs` | `ui-icon-set --minus-xs` ||
|| ![](./_images/icons-list/outline/more-l.svg){width=24px height=24px} | `Outline.MORE_L` | `more-l` | `ui-icon-set --more-l` ||
|| ![](./_images/icons-list/outline/more-m.svg){width=24px height=24px} | `Outline.MORE_M` | `more-m` | `ui-icon-set --more-m` ||
|| ![](./_images/icons-list/outline/more-s.svg){width=24px height=24px} | `Outline.MORE_S` | `more-s` | `ui-icon-set --more-s` ||
|| ![](./_images/icons-list/outline/more-xs.svg){width=24px height=24px} | `Outline.MORE_XS` | `more-xs` | `ui-icon-set --more-xs` ||
|| ![](./_images/icons-list/outline/pause-l.svg){width=24px height=24px} | `Outline.PAUSE_L` | `pause-l` | `ui-icon-set --pause-l` ||
|| ![](./_images/icons-list/outline/pause-m.svg){width=24px height=24px} | `Outline.PAUSE_M` | `pause-m` | `ui-icon-set --pause-m` ||
|| ![](./_images/icons-list/outline/pause-s.svg){width=24px height=24px} | `Outline.PAUSE_S` | `pause-s` | `ui-icon-set --pause-s` ||
|| ![](./_images/icons-list/outline/pause-xs.svg){width=24px height=24px} | `Outline.PAUSE_XS` | `pause-xs` | `ui-icon-set --pause-xs` ||
|| ![](./_images/icons-list/outline/play-l.svg){width=24px height=24px} | `Outline.PLAY_L` | `play-l` | `ui-icon-set --play-l` ||
|| ![](./_images/icons-list/outline/play-m.svg){width=24px height=24px} | `Outline.PLAY_M` | `play-m` | `ui-icon-set --play-m` ||
|| ![](./_images/icons-list/outline/play-s.svg){width=24px height=24px} | `Outline.PLAY_S` | `play-s` | `ui-icon-set --play-s` ||
|| ![](./_images/icons-list/outline/play-xs.svg){width=24px height=24px} | `Outline.PLAY_XS` | `play-xs` | `ui-icon-set --play-xs` ||
|| ![](./_images/icons-list/outline/plus-l.svg){width=24px height=24px} | `Outline.PLUS_L` | `plus-l` | `ui-icon-set --plus-l` ||
|| ![](./_images/icons-list/outline/plus-m.svg){width=24px height=24px} | `Outline.PLUS_M` | `plus-m` | `ui-icon-set --plus-m` ||
|| ![](./_images/icons-list/outline/plus-s.svg){width=24px height=24px} | `Outline.PLUS_S` | `plus-s` | `ui-icon-set --plus-s` ||
|| ![](./_images/icons-list/outline/plus-xs.svg){width=24px height=24px} | `Outline.PLUS_XS` | `plus-xs` | `ui-icon-set --plus-xs` ||
|| ![](./_images/icons-list/outline/stop-l.svg){width=24px height=24px} | `Outline.STOP_L` | `stop-l` | `ui-icon-set --stop-l` ||
|| ![](./_images/icons-list/outline/stop-m.svg){width=24px height=24px} | `Outline.STOP_M` | `stop-m` | `ui-icon-set --stop-m` ||
|| ![](./_images/icons-list/outline/stop-s.svg){width=24px height=24px} | `Outline.STOP_S` | `stop-s` | `ui-icon-set --stop-s` ||
|| ![](./_images/icons-list/outline/stop-xs.svg){width=24px height=24px} | `Outline.STOP_XS` | `stop-xs` | `ui-icon-set --stop-xs` ||
|| ![](./_images/icons-list/outline/unlock-l.svg){width=24px height=24px} | `Outline.UNLOCK_L` | `unlock-l` | `ui-icon-set --unlock-l` ||
|| ![](./_images/icons-list/outline/unlock-m.svg){width=24px height=24px} | `Outline.UNLOCK_M` | `unlock-m` | `ui-icon-set --unlock-m` ||
|| ![](./_images/icons-list/outline/unlock-s.svg){width=24px height=24px} | `Outline.UNLOCK_S` | `unlock-s` | `ui-icon-set --unlock-s` ||
|| ![](./_images/icons-list/outline/unlock-xs.svg){width=24px height=24px} | `Outline.UNLOCK_XS` | `unlock-xs` | `ui-icon-set --unlock-xs` ||
|| ![](./_images/icons-list/outline/settings-l.svg){width=24px height=24px} | `Outline.SETTINGS_L` | `settings-l` | `ui-icon-set --settings-l` ||
|| ![](./_images/icons-list/outline/settings-m.svg){width=24px height=24px} | `Outline.SETTINGS_M` | `settings-m` | `ui-icon-set --settings-m` ||
|| ![](./_images/icons-list/outline/settings-s.svg){width=24px height=24px} | `Outline.SETTINGS_S` | `settings-s` | `ui-icon-set --settings-s` ||
|| ![](./_images/icons-list/outline/settings-xs.svg){width=24px height=24px} | `Outline.SETTINGS_XS` | `settings-xs` | `ui-icon-set --settings-xs` ||
|| ![](./_images/icons-list/outline/ai-process.svg){width=24px height=24px} | `Outline.AI_PROCESS` | `ai-process` | `ui-icon-set --ai-process` ||
|| ![](./_images/icons-list/outline/auto-selection.svg){width=24px height=24px} | `Outline.AUTO_SELECTION` | `auto-selection` | `ui-icon-set --auto-selection` ||
|| ![](./_images/icons-list/outline/business-process-money.svg){width=24px height=24px} | `Outline.BUSINESS_PROCESS_MONEY` | `business-process-money` | `ui-icon-set --business-process-money` ||
|| ![](./_images/icons-list/outline/call-back.svg){width=24px height=24px} | `Outline.CALL_BACK` | `call-back` | `ui-icon-set --call-back` ||
|| ![](./_images/icons-list/outline/collab-add.svg){width=24px height=24px} | `Outline.COLLAB_ADD` | `collab-add` | `ui-icon-set --collab-add` ||
|| ![](./_images/icons-list/outline/contact-details.svg){width=24px height=24px} | `Outline.CONTACT_DETAILS` | `contact-details` | `ui-icon-set --contact-details` ||
|| ![](./_images/icons-list/outline/contrast.svg){width=24px height=24px} | `Outline.CONTRAST` | `contrast` | `ui-icon-set --contrast` ||
|| ![](./_images/icons-list/outline/crm-field-except.svg){width=24px height=24px} | `Outline.CRM_FIELD_EXCEPT` | `crm-field-except` | `ui-icon-set --crm-field-except` ||
|| ![](./_images/icons-list/outline/crm-field-linked.svg){width=24px height=24px} | `Outline.CRM_FIELD_LINKED` | `crm-field-linked` | `ui-icon-set --crm-field-linked` ||
|| ![](./_images/icons-list/outline/crm-field-simple.svg){width=24px height=24px} | `Outline.CRM_FIELD_SIMPLE` | `crm-field-simple` | `ui-icon-set --crm-field-simple` ||
|| ![](./_images/icons-list/outline/customization.svg){width=24px height=24px} | `Outline.CUSTOMIZATION` | `customization` | `ui-icon-set --customization` ||
|| ![](./_images/icons-list/outline/ddos-attack.svg){width=24px height=24px} | `Outline.DDOS_ATTACK` | `ddos-attack` | `ui-icon-set --ddos-attack` ||
|| ![](./_images/icons-list/outline/delete-event.svg){width=24px height=24px} | `Outline.DELETE_EVENT` | `delete-event` | `ui-icon-set --delete-event` ||
|| ![](./_images/icons-list/outline/delivery-with-item.svg){width=24px height=24px} | `Outline.DELIVERY_WITH_ITEM` | `delivery-with-item` | `ui-icon-set --delivery-with-item` ||
|| ![](./_images/icons-list/outline/digits-24.svg){width=24px height=24px} | `Outline.DIGITS_24` | `digits-24` | `ui-icon-set --digits-24` ||
|| ![](./_images/icons-list/outline/dots.svg){width=24px height=24px} | `Outline.DOTS` | `dots` | `ui-icon-set --dots` ||
|| ![](./_images/icons-list/outline/feedback-form.svg){width=24px height=24px} | `Outline.FEEDBACK_FORM` | `feedback-form` | `ui-icon-set --feedback-form` ||
|| ![](./_images/icons-list/outline/ip-address.svg){width=24px height=24px} | `Outline.IP_ADDRESS` | `ip-address` | `ui-icon-set --ip-address` ||
|| ![](./_images/icons-list/outline/ip-address-crossed.svg){width=24px height=24px} | `Outline.IP_ADDRESS_CROSSED` | `ip-address-crossed` | `ui-icon-set --ip-address-crossed` ||
|| ![](./_images/icons-list/outline/letter-sort-down.svg){width=24px height=24px} | `Outline.LETTER_SORT_DOWN` | `letter-sort-down` | `ui-icon-set --letter-sort-down` ||
|| ![](./_images/icons-list/outline/letter-sort-up.svg){width=24px height=24px} | `Outline.LETTER_SORT_UP` | `letter-sort-up` | `ui-icon-set --letter-sort-up` ||
|| ![](./_images/icons-list/outline/list-ai.svg){width=24px height=24px} | `Outline.LIST_AI` | `list-ai` | `ui-icon-set --list-ai` ||
|| ![](./_images/icons-list/outline/logo-android.svg){width=24px height=24px} | `Outline.LOGO_ANDROID` | `logo-android` | `ui-icon-set --logo-android` ||
|| ![](./_images/icons-list/outline/logo-apple.svg){width=24px height=24px} | `Outline.LOGO_APPLE` | `logo-apple` | `ui-icon-set --logo-apple` ||
|| ![](./_images/icons-list/outline/multi-page-form.svg){width=24px height=24px} | `Outline.MULTI_PAGE_FORM` | `multi-page-form` | `ui-icon-set --multi-page-form` ||
|| ![](./_images/icons-list/outline/no-screenshot.svg){width=24px height=24px} | `Outline.NO_SCREENSHOT` | `no-screenshot` | `ui-icon-set --no-screenshot` ||
|| ![](./_images/icons-list/outline/online-events.svg){width=24px height=24px} | `Outline.ONLINE_EVENTS` | `online-events` | `ui-icon-set --online-events` ||
|| ![](./_images/icons-list/outline/o-payment-and-delivery.svg){width=24px height=24px} | `Outline.PAYMENT_AND_DELIVERY` | `o-payment-and-delivery` | `ui-icon-set --o-payment-and-delivery` ||
|| ![](./_images/icons-list/outline/personal-form.svg){width=24px height=24px} | `Outline.PERSONAL_FORM` | `personal-form` | `ui-icon-set --personal-form` ||
|| ![](./_images/icons-list/outline/private-message.svg){width=24px height=24px} | `Outline.PRIVATE_MESSAGE` | `private-message` | `ui-icon-set --private-message` ||
|| ![](./_images/icons-list/outline/process.svg){width=24px height=24px} | `Outline.PROCESS` | `process` | `ui-icon-set --process` ||
|| ![](./_images/icons-list/outline/process-stop.svg){width=24px height=24px} | `Outline.PROCESS_STOP` | `process-stop` | `ui-icon-set --process-stop` ||
|| ![](./_images/icons-list/outline/products-cube.svg){width=24px height=24px} | `Outline.PRODUCTS_CUBE` | `products-cube` | `ui-icon-set --products-cube` ||
|| ![](./_images/icons-list/outline/products-payment.svg){width=24px height=24px} | `Outline.PRODUCTS_PAYMENT` | `products-payment` | `ui-icon-set --products-payment` ||
|| ![](./_images/icons-list/outline/products-photo.svg){width=24px height=24px} | `Outline.PRODUCTS_PHOTO` | `products-photo` | `ui-icon-set --products-photo` ||
|| ![](./_images/icons-list/outline/products-shirt.svg){width=24px height=24px} | `Outline.PRODUCTS_SHIRT` | `products-shirt` | `ui-icon-set --products-shirt` ||
|| ![](./_images/icons-list/outline/products-quick-crm-fill.svg){width=24px height=24px} | `Outline.PRODUCTS_QUICK_CRM_FILL` | `products-quick-crm-fill` | `ui-icon-set --products-quick-crm-fill` ||
|| ![](./_images/icons-list/outline/receipt.svg){width=24px height=24px} | `Outline.RECEIPT` | `receipt` | `ui-icon-set --receipt` ||
|| ![](./_images/icons-list/outline/receipt-note.svg){width=24px height=24px} | `Outline.RECEIPT_NOTE` | `receipt-note` | `ui-icon-set --receipt-note` ||
|| ![](./_images/icons-list/outline/record-on.svg){width=24px height=24px} | `Outline.RECORD_ON` | `record-on` | `ui-icon-set --record-on` ||
|| ![](./_images/icons-list/outline/registration-on-site.svg){width=24px height=24px} | `Outline.REGISTRATION_ON_SITE` | `registration-on-site` | `ui-icon-set --registration-on-site` ||
|| ![](./_images/icons-list/outline/screen-phone.svg){width=24px height=24px} | `Outline.SCREEN_PHONE` | `screen-phone` | `ui-icon-set --screen-phone` ||
|| ![](./_images/icons-list/outline/server-settings.svg){width=24px height=24px} | `Outline.SERVER_SETTINGS` | `server-settings` | `ui-icon-set --server-settings` ||
|| ![](./_images/icons-list/outline/speaker-add.svg){width=24px height=24px} | `Outline.SPEAKER_ADD` | `speaker-add` | `ui-icon-set --speaker-add` ||
|| ![](./_images/icons-list/outline/template-task.svg){width=24px height=24px} | `Outline.TEMPLATE_TASK` | `template-task` | `ui-icon-set --template-task` ||
|| ![](./_images/icons-list/outline/text-format-bottom.svg){width=24px height=24px} | `Outline.TEXT_FORMAT_BOTTOM` | `text-format-bottom` | `ui-icon-set --text-format-bottom` ||
|| ![](./_images/icons-list/outline/text-format-cancel.svg){width=24px height=24px} | `Outline.TEXT_FORMAT_CANCEL` | `text-format-cancel` | `ui-icon-set --text-format-cancel` ||
|| ![](./_images/icons-list/outline/text-format-top.svg){width=24px height=24px} | `Outline.TEXT_FORMAT_TOP` | `text-format-top` | `ui-icon-set --text-format-top` ||
|| ![](./_images/icons-list/outline/text-format-top-left.svg){width=24px height=24px} | `Outline.TEXT_FORMAT_TOP_LEFT` | `text-format-top-left` | `ui-icon-set --text-format-top-left` ||
|| ![](./_images/icons-list/outline/text-format-top-right.svg){width=24px height=24px} | `Outline.TEXT_FORMAT_TOP_RIGHT` | `text-format-top-right` | `ui-icon-set --text-format-top-right` ||
|| ![](./_images/icons-list/outline/trainee.svg){width=24px height=24px} | `Outline.TRAINEE` | `trainee` | `ui-icon-set --trainee` ||
|| ![](./_images/icons-list/outline/user-profile.svg){width=24px height=24px} | `Outline.USER_PROFILE` | `user-profile` | `ui-icon-set --user-profile` ||
|| ![](./_images/icons-list/outline/verification.svg){width=24px height=24px} | `Outline.VERIFICATION` | `verification` | `ui-icon-set --verification` ||
|| ![](./_images/icons-list/outline/virtual-server.svg){width=24px height=24px} | `Outline.VIRTUAL_SERVER` | `virtual-server` | `ui-icon-set --virtual-server` ||
|| ![](./_images/icons-list/outline/virtual-storage.svg){width=24px height=24px} | `Outline.VIRTUAL_STORAGE` | `virtual-storage` | `ui-icon-set --virtual-storage` ||
|| ![](./_images/icons-list/outline/vk-lead-form.svg){width=24px height=24px} | `Outline.VK_LEAD_FORM` | `vk-lead-form` | `ui-icon-set --vk-lead-form` ||
|| ![](./_images/icons-list/outline/watermark.svg){width=24px height=24px} | `Outline.WATERMARK` | `watermark` | `ui-icon-set --watermark` ||
|| ![](./_images/icons-list/outline/wiki.svg){width=24px height=24px} | `Outline.WIKI` | `wiki` | `ui-icon-set --wiki` ||
|| ![](./_images/icons-list/outline/poll.svg){width=24px height=24px} | `Outline.POLL` | `poll` | `ui-icon-set --poll` ||
|| ![](./_images/icons-list/outline/action-required.svg){width=24px height=24px} | `Outline.ACTION_REQUIRED` | `action-required` | `ui-icon-set --action-required` ||
|| ![](./_images/icons-list/outline/ai-internet-search.svg){width=24px height=24px} | `Outline.AI_INTERNET_SEARCH` | `ai-internet-search` | `ui-icon-set --ai-internet-search` ||
|| ![](./_images/icons-list/outline/ai-reflection.svg){width=24px height=24px} | `Outline.AI_REFLECTION` | `ai-reflection` | `ui-icon-set --ai-reflection` ||
|| ![](./_images/icons-list/outline/contact-center.svg){width=24px height=24px} | `Outline.CONTACT_CENTER` | `contact-center` | `ui-icon-set --contact-center` ||
|| ![](./_images/icons-list/outline/delete-person.svg){width=24px height=24px} | `Outline.DELETE_PERSON` | `delete-person` | `ui-icon-set --delete-person` ||
|| ![](./_images/icons-list/outline/digits123.svg){width=24px height=24px} | `Outline.DIGITS_123` | `digits123` | `ui-icon-set --digits123` ||
|| ![](./_images/icons-list/outline/o-location-plus.svg){width=24px height=24px} | `Outline.LOCATION_PLUS` | `o-location-plus` | `ui-icon-set --o-location-plus` ||
|| ![](./_images/icons-list/outline/transcription.svg){width=24px height=24px} | `Outline.TRANSCRIPTION` | `transcription` | `ui-icon-set --transcription` ||
|| ![](./_images/icons-list/outline/auto-check-in.svg){width=24px height=24px} | `Outline.AUTO_CHECK_IN` | `auto-check-in` | `ui-icon-set --auto-check-in` ||
|| ![](./_images/icons-list/outline/broom.svg){width=24px height=24px} | `Outline.BROOM` | `broom` | `ui-icon-set --broom` ||
|| ![](./_images/icons-list/outline/check-deferred.svg){width=24px height=24px} | `Outline.CHECK_DEFERRED` | `check-deferred` | `ui-icon-set --check-deferred` ||
|| ![](./_images/icons-list/outline/check-in-cancel.svg){width=24px height=24px} | `Outline.CHECK_IN_CANCEL` | `check-in-cancel` | `ui-icon-set --check-in-cancel` ||
|| ![](./_images/icons-list/outline/check-in-negative.svg){width=24px height=24px} | `Outline.CHECK_IN_NEGATIVE` | `check-in-negative` | `ui-icon-set --check-in-negative` ||
|| ![](./_images/icons-list/outline/compass.svg){width=24px height=24px} | `Outline.COMPASS` | `compass` | `ui-icon-set --compass` ||
|| ![](./_images/icons-list/outline/face-ident.svg){width=24px height=24px} | `Outline.FACE_IDENT` | `face-ident` | `ui-icon-set --face-ident` ||
|| ![](./_images/icons-list/outline/fingerprint.svg){width=24px height=24px} | `Outline.FINGERPRINT` | `fingerprint` | `ui-icon-set --fingerprint` ||
|| ![](./_images/icons-list/outline/graphs-settings.svg){width=24px height=24px} | `Outline.GRAPHS_SETTINGS` | `graphs-settings` | `ui-icon-set --graphs-settings` ||
|| ![](./_images/icons-list/outline/o-keyboard.svg){width=24px height=24px} | `Outline.KEYBOARD` | `o-keyboard` | `ui-icon-set --o-keyboard` ||
|| ![](./_images/icons-list/outline/media-message.svg){width=24px height=24px} | `Outline.MEDIA_MESSAGE` | `media-message` | `ui-icon-set --media-message` ||
|| ![](./_images/icons-list/outline/mobile-selected.svg){width=24px height=24px} | `Outline.MOBILE_SELECTED` | `mobile-selected` | `ui-icon-set --mobile-selected` ||
|| ![](./_images/icons-list/outline/no-compass.svg){width=24px height=24px} | `Outline.NO_COMPASS` | `no-compass` | `ui-icon-set --no-compass` ||
|| ![](./_images/icons-list/outline/person-detect.svg){width=24px height=24px} | `Outline.PERSON_DETECT` | `person-detect` | `ui-icon-set --person-detect` ||
|| ![](./_images/icons-list/outline/reply-all.svg){width=24px height=24px} | `Outline.REPLY_ALL` | `reply-all` | `ui-icon-set --reply-all` ||
|| ![](./_images/icons-list/outline/screen-selected.svg){width=24px height=24px} | `Outline.SCREEN_SELECTED` | `screen-selected` | `ui-icon-set --screen-selected` ||
|| ![](./_images/icons-list/outline/screen-share-pause.svg){width=24px height=24px} | `Outline.SCREEN_SHARE_PAUSE` | `screen-share-pause` | `ui-icon-set --screen-share-pause` ||
|| ![](./_images/icons-list/outline/sign-default.svg){width=24px height=24px} | `Outline.SIGN_DEFAULT` | `sign-default` | `ui-icon-set --sign-default` ||
|| ![](./_images/icons-list/outline/size-w-l.svg){width=24px height=24px} | `Outline.SIZE_W_L` | `size-w-l` | `ui-icon-set --size-w-l` ||
|| ![](./_images/icons-list/outline/statistics-arrow.svg){width=24px height=24px} | `Outline.STATISTICS_ARROW` | `statistics-arrow` | `ui-icon-set --statistics-arrow` ||
|| ![](./_images/icons-list/outline/sticker.svg){width=24px height=24px} | `Outline.STICKER` | `sticker` | `ui-icon-set --sticker` ||
|| ![](./_images/icons-list/outline/browser.svg){width=24px height=24px} | `Outline.BROWSER` | `browser` | `ui-icon-set --browser` ||
|| ![](./_images/icons-list/outline/more-vertical-xs.svg){width=24px height=24px} | `Outline.MORE_VERTICAL_XS` | `more-vertical-xs` | `ui-icon-set --more-vertical-xs` ||
|| ![](./_images/icons-list/outline/more-vertical-s.svg){width=24px height=24px} | `Outline.MORE_VERTICAL_S` | `more-vertical-s` | `ui-icon-set --more-vertical-s` ||
|| ![](./_images/icons-list/outline/more-vertical-m.svg){width=24px height=24px} | `Outline.MORE_VERTICAL_M` | `more-vertical-m` | `ui-icon-set --more-vertical-m` ||
|| ![](./_images/icons-list/outline/more-vertical-l.svg){width=24px height=24px} | `Outline.MORE_VERTICAL_L` | `more-vertical-l` | `ui-icon-set --more-vertical-l` ||
|| ![](./_images/icons-list/outline/o-database.svg){width=24px height=24px} | `Outline.DATABASE` | `o-database` | `ui-icon-set --o-database` ||
|| ![](./_images/icons-list/outline/o-client-chat.svg){width=24px height=24px} | `Outline.CLIENT_CHAT` | `o-client-chat` | `ui-icon-set --o-client-chat` ||
|| ![](./_images/icons-list/outline/o-legal-processes.svg){width=24px height=24px} | `Outline.LEGAL_PROCESSES` | `o-legal-processes` | `ui-icon-set --o-legal-processes` ||
|| ![](./_images/icons-list/outline/o-marketing.svg){width=24px height=24px} | `Outline.MARKETING` | `o-marketing` | `ui-icon-set --o-marketing` ||
|| ![](./_images/icons-list/outline/o-roles-library.svg){width=24px height=24px} | `Outline.ROLES_LIBRARY` | `o-roles-library` | `ui-icon-set --o-roles-library` ||
|| ![](./_images/icons-list/outline/o-ai-robot.svg){width=24px height=24px} | `Outline.AI_ROBOT` | `o-ai-robot` | `ui-icon-set --o-ai-robot` ||
|| ![](./_images/icons-list/outline/o-condition.svg){width=24px height=24px} | `Outline.CONDITION` | `o-condition` | `ui-icon-set --o-condition` ||
|| ![](./_images/icons-list/outline/o-data-reading.svg){width=24px height=24px} | `Outline.DATA_READING` | `o-data-reading` | `ui-icon-set --o-data-reading` ||
|| ![](./_images/icons-list/outline/o-frame-create.svg){width=24px height=24px} | `Outline.FRAME_CREATE` | `o-frame-create` | `ui-icon-set --o-frame-create` ||
|| ![](./_images/icons-list/outline/o-mcp.svg){width=24px height=24px} | `Outline.MCP` | `o-mcp` | `ui-icon-set --o-mcp` ||
|| ![](./_images/icons-list/outline/o-mcp-letters.svg){width=24px height=24px} | `Outline.MCP_LETTERS` | `o-mcp-letters` | `ui-icon-set --o-mcp-letters` ||
|| ![](./_images/icons-list/outline/o-merge.svg){width=24px height=24px} | `Outline.MERGE` | `o-merge` | `ui-icon-set --o-merge` ||
|| ![](./_images/icons-list/outline/o-sticker-smile.svg){width=24px height=24px} | `Outline.STICKER_SMILE` | `o-sticker-smile` | `ui-icon-set --o-sticker-smile` ||
|| ![](./_images/icons-list/outline/o-client-letter.svg){width=24px height=24px} | `Outline.CLIENT_LETTER` | `o-client-letter` | `ui-icon-set --o-client-letter` ||
|| ![](./_images/icons-list/outline/o-connection.svg){width=24px height=24px} | `Outline.CONNECTION` | `o-connection` | `ui-icon-set --o-connection` ||
|| ![](./_images/icons-list/outline/o-copied.svg){width=24px height=24px} | `Outline.COPIED` | `o-copied` | `ui-icon-set --o-copied` ||
|| ![](./_images/icons-list/outline/o-crm-online-store.svg){width=24px height=24px} | `Outline.CRM_ONLINE_STORE` | `o-crm-online-store` | `ui-icon-set --o-crm-online-store` ||
|| ![](./_images/icons-list/outline/o-crm-payment-and-delivery.svg){width=24px height=24px} | `Outline.CRM_PAYMENT_AND_DELIVERY` | `o-crm-payment-and-delivery` | `ui-icon-set --o-crm-payment-and-delivery` ||
|| ![](./_images/icons-list/outline/o-lightning-plus.svg){width=24px height=24px} | `Outline.LIGHTNING_PLUS` | `o-lightning-plus` | `ui-icon-set --o-lightning-plus` ||
|| ![](./_images/icons-list/outline/o-unc-1.svg){width=24px height=24px} | `Outline.UNC_1` | `o-unc-1` | `ui-icon-set --o-unc-1` ||
|| ![](./_images/icons-list/outline/o-document-sign.svg){width=24px height=24px} | `Outline.DOCUMENT_SIGN` | `o-document-sign` | `ui-icon-set --o-document-sign` ||
|| ![](./_images/icons-list/outline/o-black-list.svg){width=24px height=24px} | `Outline.BLACK_LIST` | `o-black-list` | `ui-icon-set --o-black-list` ||
|| ![](./_images/icons-list/outline/o-important-task.svg){width=24px height=24px} | `Outline.IMPORTANT_TASK` | `o-important-task` | `ui-icon-set --o-important-task` ||
|| ![](./_images/icons-list/outline/o-add-database.svg){width=24px height=24px} | `Outline.ADD_DATABASE` | `o-add-database` | `ui-icon-set --o-add-database` ||
|| ![](./_images/icons-list/outline/o-bank-card.svg){width=24px height=24px} | `Outline.BANK_CARD` | `o-bank-card` | `ui-icon-set --o-bank-card` ||
|| ![](./_images/icons-list/outline/o-circlecheck-forward.svg){width=24px height=24px} | `Outline.CIRCLECHECK_FORWARD` | `o-circlecheck-forward` | `ui-icon-set --o-circlecheck-forward` ||
|| ![](./_images/icons-list/outline/o-crown-1.svg){width=24px height=24px} | `Outline.CROWN_1` | `o-crown-1` | `ui-icon-set --o-crown-1` ||
|| ![](./_images/icons-list/outline/o-dial-10.svg){width=24px height=24px} | `Outline.DIAL_10` | `o-dial-10` | `ui-icon-set --o-dial-10` ||
|| ![](./_images/icons-list/outline/o-dial-20.svg){width=24px height=24px} | `Outline.DIAL_20` | `o-dial-20` | `ui-icon-set --o-dial-20` ||
|| ![](./_images/icons-list/outline/o-document-link.svg){width=24px height=24px} | `Outline.DOCUMENT_LINK` | `o-document-link` | `ui-icon-set --o-document-link` ||
|| ![](./_images/icons-list/outline/o-document-print.svg){width=24px height=24px} | `Outline.DOCUMENT_PRINT` | `o-document-print` | `ui-icon-set --o-document-print` ||
|| ![](./_images/icons-list/outline/o-list-ai-2.svg){width=24px height=24px} | `Outline.LIST_AI_2` | `o-list-ai-2` | `ui-icon-set --o-list-ai-2` ||
|| ![](./_images/icons-list/outline/o-parts-record.svg){width=24px height=24px} | `Outline.PARTS_RECORD` | `o-parts-record` | `ui-icon-set --o-parts-record` ||
|| ![](./_images/icons-list/outline/o-parts-record-play.svg){width=24px height=24px} | `Outline.PARTS_RECORD_PLAY` | `o-parts-record-play` | `ui-icon-set --o-parts-record-play` ||
|| ![](./_images/icons-list/outline/o-parts-record-stop.svg){width=24px height=24px} | `Outline.PARTS_RECORD_STOP` | `o-parts-record-stop` | `ui-icon-set --o-parts-record-stop` ||
|| ![](./_images/icons-list/outline/o-planning-2.svg){width=24px height=24px} | `Outline.PLANNING_2` | `o-planning-2` | `ui-icon-set --o-planning-2` ||
|| ![](./_images/icons-list/outline/o-seen-items.svg){width=24px height=24px} | `Outline.SEEN_ITEMS` | `o-seen-items` | `ui-icon-set --o-seen-items` ||
|| ![](./_images/icons-list/outline/o-shop-order.svg){width=24px height=24px} | `Outline.SHOP_ORDER` | `o-shop-order` | `ui-icon-set --o-shop-order` ||
|| ![](./_images/icons-list/outline/o-sso.svg){width=24px height=24px} | `Outline.SSO` | `o-sso` | `ui-icon-set --o-sso` ||
|| ![](./_images/icons-list/outline/o-table.svg){width=24px height=24px} | `Outline.TABLE` | `o-table` | `ui-icon-set --o-table` ||
|| ![](./_images/icons-list/outline/o-task-fire.svg){width=24px height=24px} | `Outline.TASK_FIRE` | `o-task-fire` | `ui-icon-set --o-task-fire` ||
|| ![](./_images/icons-list/outline/o-universal-access.svg){width=24px height=24px} | `Outline.UNIVERSAL_ACCESS` | `o-universal-access` | `ui-icon-set --o-universal-access` ||
|| ![](./_images/icons-list/outline/o-visited-items.svg){width=24px height=24px} | `Outline.VISITED_ITEMS` | `o-visited-items` | `ui-icon-set --o-visited-items` ||
|| ![](./_images/icons-list/outline/o-webhook.svg){width=24px height=24px} | `Outline.WEBHOOK` | `o-webhook` | `ui-icon-set --o-webhook` ||
|| ![](./_images/icons-list/outline/o-text-format-reset.svg){width=24px height=24px} | `Outline.TEXT_FORMAT_RESET` | `o-text-format-reset` | `ui-icon-set --o-text-format-reset` ||
|| ![](./_images/icons-list/outline/o-spoiler.svg){width=24px height=24px} | `Outline.SPOILER` | `o-spoiler` | `ui-icon-set --o-spoiler` ||
|| ![](./_images/icons-list/outline/o-open-new.svg){width=24px height=24px} | `Outline.OPEN_NEW` | `o-open-new` | `ui-icon-set --o-open-new` ||
|| ![](./_images/icons-list/outline/o-list-viewer.svg){width=24px height=24px} | `Outline.LIST_VIEWER` | `o-list-viewer` | `ui-icon-set --o-list-viewer` ||
|| ![](./_images/icons-list/outline/o-video-record-2.svg){width=24px height=24px} | `Outline.VIDEO_RECORD_2` | `o-video-record-2` | `ui-icon-set --o-video-record-2` ||
|| ![](./_images/icons-list/outline/o-three-persons-check.svg){width=24px height=24px} | `Outline.THREE_PERSONS_CHECK` | `o-three-persons-check` | `ui-icon-set --o-three-persons-check` ||
|| ![](./_images/icons-list/outline/o-package-receive.svg){width=24px height=24px} | `Outline.PACKAGE_RECEIVE` | `o-package-receive` | `ui-icon-set --o-package-receive` ||
|| ![](./_images/icons-list/outline/o-package-cancel.svg){width=24px height=24px} | `Outline.PACKAGE_CANCEL` | `o-package-cancel` | `ui-icon-set --o-package-cancel` ||
|| ![](./_images/icons-list/outline/o-lower-left-arrow.svg){width=24px height=24px} | `Outline.LOWER_LEFT_ARROW` | `o-lower-left-arrow` | `ui-icon-set --o-lower-left-arrow` ||
|| ![](./_images/icons-list/outline/o-mail-plus.svg){width=24px height=24px} | `Outline.MAIL_PLUS` | `o-mail-plus` | `ui-icon-set --o-mail-plus` ||
|| ![](./_images/icons-list/outline/o-messages-multi.svg){width=24px height=24px} | `Outline.MESSAGES_MULTI` | `o-messages-multi` | `ui-icon-set --o-messages-multi` ||
|| ![](./_images/icons-list/outline/o-crm-form.svg){width=24px height=24px} | `Outline.CRM_FORM` | `o-crm-form` | `ui-icon-set --o-crm-form` ||
|| ![](./_images/icons-list/outline/bitrix-gpt.svg){width=24px height=24px} | `Outline.BITRIX_GPT` | `bitrix-gpt` | `ui-icon-set --bitrix-gpt` ||
|| ![](./_images/icons-list/outline/o-recent-items.svg){width=24px height=24px} | `Outline.RECENT_ITEMS` | `o-recent-items` | `ui-icon-set --o-recent-items` ||
|| ![](./_images/icons-list/outline/o-set-kanban.svg){width=24px height=24px} | `Outline.SET_KANBAN` | `o-set-kanban` | `ui-icon-set --o-set-kanban` ||
|| ![](./_images/icons-list/outline/o-template-plus.svg){width=24px height=24px} | `Outline.TEMPLATE_PLUS` | `o-template-plus` | `ui-icon-set --o-template-plus` ||
|| ![](./_images/icons-list/outline/o-template-task.svg){width=24px height=24px} | `Outline.O_TEMPLATE_TASK` | `o-template-task` | `ui-icon-set --o-template-task` ||
|| ![](./_images/icons-list/outline/o-cookies.svg){width=24px height=24px} | `Outline.COOKIES` | `o-cookies` | `ui-icon-set --o-cookies` ||
|| ![](./_images/icons-list/outline/o-pages.svg){width=24px height=24px} | `Outline.PAGES` | `o-pages` | `ui-icon-set --o-pages` ||
|| ![](./_images/icons-list/outline/o-vibecode-catalog.svg){width=24px height=24px} | `Outline.VIBECODE_CATALOG` | `o-vibecode-catalog` | `ui-icon-set --o-vibecode-catalog` ||
|| ![](./_images/icons-list/outline/o-commands.svg){width=24px height=24px} | `Outline.COMMANDS` | `o-commands` | `ui-icon-set --o-commands` ||
|| ![](./_images/icons-list/outline/o-file-with-calendar.svg){width=24px height=24px} | `Outline.FILE_WITH_CALENDAR` | `o-file-with-calendar` | `ui-icon-set --o-file-with-calendar` ||
|| ![](./_images/icons-list/outline/o-file-with-crown.svg){width=24px height=24px} | `Outline.FILE_WITH_CROWN` | `o-file-with-crown` | `ui-icon-set --o-file-with-crown` ||
|| ![](./_images/icons-list/outline/o-file-with-person.svg){width=24px height=24px} | `Outline.FILE_WITH_PERSON` | `o-file-with-person` | `ui-icon-set --o-file-with-person` ||
|#

{% endcut %}

{% cut "Solid" %}

CSS-расширение: `ui.icon-set.solid`.

#|
|| **Иконка** | **Константа** | **Значение** | **HTML-класс** ||
|| ![](./_images/icons-list/solid/s-3-persons.svg){width=24px height=24px} | `Solid.THREE_PERSONS` | `s-3-persons` | `ui-icon-set --s-3-persons` ||
|| ![](./_images/icons-list/solid/s-activity.svg){width=24px height=24px} | `Solid.ACTIVITY` | `s-activity` | `ui-icon-set --s-activity` ||
|| ![](./_images/icons-list/solid/s-ai-stars.svg){width=24px height=24px} | `Solid.AI_STARS` | `s-ai-stars` | `ui-icon-set --s-ai-stars` ||
|| ![](./_images/icons-list/solid/s-alert-accent.svg){width=24px height=24px} | `Solid.ALERT_ACCENT` | `s-alert-accent` | `ui-icon-set --s-alert-accent` ||
|| ![](./_images/icons-list/solid/s-alert.svg){width=24px height=24px} | `Solid.ALERT` | `s-alert` | `ui-icon-set --s-alert` ||
|| ![](./_images/icons-list/solid/s-apps.svg){width=24px height=24px} | `Solid.APPS` | `s-apps` | `ui-icon-set --s-apps` ||
|| ![](./_images/icons-list/solid/s-attach.svg){width=24px height=24px} | `Solid.ATTACH` | `s-attach` | `ui-icon-set --s-attach` ||
|| ![](./_images/icons-list/solid/s-board.svg){width=24px height=24px} | `Solid.BOARD` | `s-board` | `ui-icon-set --s-board` ||
|| ![](./_images/icons-list/solid/s-bookmark.svg){width=24px height=24px} | `Solid.BOOKMARK` | `s-bookmark` | `ui-icon-set --s-bookmark` ||
|| ![](./_images/icons-list/solid/s-bottleneck.svg){width=24px height=24px} | `Solid.BOTTLENECK` | `s-bottleneck` | `ui-icon-set --s-bottleneck` ||
|| ![](./_images/icons-list/solid/s-browser.svg){width=24px height=24px} | `Solid.BROWSER` | `s-browser` | `ui-icon-set --s-browser` ||
|| ![](./_images/icons-list/solid/s-bug.svg){width=24px height=24px} | `Solid.BUG` | `s-bug` | `ui-icon-set --s-bug` ||
|| ![](./_images/icons-list/solid/s-business-process.svg){width=24px height=24px} | `Solid.BUSINESS_PROCESS` | `s-business-process` | `ui-icon-set --s-business-process` ||
|| ![](./_images/icons-list/solid/s-calendar-with-slots.svg){width=24px height=24px} | `Solid.CALENDAR_WITH_SLOTS` | `s-calendar-with-slots` | `ui-icon-set --s-calendar-with-slots` ||
|| ![](./_images/icons-list/solid/s-camera.svg){width=24px height=24px} | `Solid.CAMERA` | `s-camera` | `ui-icon-set --s-camera` ||
|| ![](./_images/icons-list/solid/s-chats.svg){width=24px height=24px} | `Solid.CHATS` | `s-chats` | `ui-icon-set --s-chats` ||
|| ![](./_images/icons-list/solid/s-check.svg){width=24px height=24px} | `Solid.CHECK` | `s-check` | `ui-icon-set --s-check` ||
|| ![](./_images/icons-list/solid/s-circle-check.svg){width=24px height=24px} | `Solid.CIRCLE_CHECK` | `s-circle-check` | `ui-icon-set --s-circle-check` ||
|| ![](./_images/icons-list/solid/s-clock.svg){width=24px height=24px} | `Solid.CLOCK` | `s-clock` | `ui-icon-set --s-clock` ||
|| ![](./_images/icons-list/solid/s-cloud-sync.svg){width=24px height=24px} | `Solid.CLOUD_SYNC` | `s-cloud-sync` | `ui-icon-set --s-cloud-sync` ||
|| ![](./_images/icons-list/solid/s-cloud.svg){width=24px height=24px} | `Solid.CLOUD` | `s-cloud` | `ui-icon-set --s-cloud` ||
|| ![](./_images/icons-list/solid/s-collab.svg){width=24px height=24px} | `Solid.COLLAB` | `s-collab` | `ui-icon-set --s-collab` ||
|| ![](./_images/icons-list/solid/s-collaboration.svg){width=24px height=24px} | `Solid.COLLABORATION` | `s-collaboration` | `ui-icon-set --s-collaboration` ||
|| ![](./_images/icons-list/solid/s-company.svg){width=24px height=24px} | `Solid.COMPANY` | `s-company` | `ui-icon-set --s-company` ||
|| ![](./_images/icons-list/solid/s-complete-task-list.svg){width=24px height=24px} | `Solid.COMPLETE_TASK_LIST` | `s-complete-task-list` | `ui-icon-set --s-complete-task-list` ||
|| ![](./_images/icons-list/solid/s-contact-center.svg){width=24px height=24px} | `Solid.CONTACT_CENTER` | `s-contact-center` | `ui-icon-set --s-contact-center` ||
|| ![](./_images/icons-list/solid/s-copilot.svg){width=24px height=24px} | `Solid.COPILOT` | `s-copilot` | `ui-icon-set --s-copilot` ||
|| ![](./_images/icons-list/solid/s-crm-letters.svg){width=24px height=24px} | `Solid.CRM_LETTERS` | `s-crm-letters` | `ui-icon-set --s-crm-letters` ||
|| ![](./_images/icons-list/solid/s-crm.svg){width=24px height=24px} | `Solid.CRM` | `s-crm` | `ui-icon-set --s-crm` ||
|| ![](./_images/icons-list/solid/s-crown.svg){width=24px height=24px} | `Solid.CROWN` | `s-crown` | `ui-icon-set --s-crown` ||
|| ![](./_images/icons-list/solid/s-cursor-click.svg){width=24px height=24px} | `Solid.CURSOR_CLICK` | `s-cursor-click` | `ui-icon-set --s-cursor-click` ||
|| ![](./_images/icons-list/solid/s-database.svg){width=24px height=24px} | `Solid.DATABASE` | `s-database` | `ui-icon-set --s-database` ||
|| ![](./_images/icons-list/solid/s-department.svg){width=24px height=24px} | `Solid.DEPARTMENT` | `s-department` | `ui-icon-set --s-department` ||
|| ![](./_images/icons-list/solid/s-developer-resources.svg){width=24px height=24px} | `Solid.DEVELOPER_RESOURCES` | `s-developer-resources` | `ui-icon-set --s-developer-resources` ||
|| ![](./_images/icons-list/solid/s-document-sign.svg){width=24px height=24px} | `Solid.DOCUMENT_SIGN` | `s-document-sign` | `ui-icon-set --s-document-sign` ||
|| ![](./_images/icons-list/solid/s-earth.svg){width=24px height=24px} | `Solid.EARTH` | `s-earth` | `ui-icon-set --s-earth` ||
|| ![](./_images/icons-list/solid/s-employee.svg){width=24px height=24px} | `Solid.EMPLOYEE` | `s-employee` | `ui-icon-set --s-employee` ||
|| ![](./_images/icons-list/solid/s-enterprise.svg){width=24px height=24px} | `Solid.ENTERPRISE` | `s-enterprise` | `ui-icon-set --s-enterprise` ||
|| ![](./_images/icons-list/solid/s-favorite.svg){width=24px height=24px} | `Solid.FAVORITE` | `s-favorite` | `ui-icon-set --s-favorite` ||
|| ![](./_images/icons-list/solid/s-file.svg){width=24px height=24px} | `Solid.FILE` | `s-file` | `ui-icon-set --s-file` ||
|| ![](./_images/icons-list/solid/s-fire.svg){width=24px height=24px} | `Solid.FIRE` | `s-fire` | `ui-icon-set --s-fire` ||
|| ![](./_images/icons-list/solid/s-folder.svg){width=24px height=24px} | `Solid.FOLDER` | `s-folder` | `ui-icon-set --s-folder` ||
|| ![](./_images/icons-list/solid/s-full-battery.svg){width=24px height=24px} | `Solid.FULL_BATTERY` | `s-full-battery` | `ui-icon-set --s-full-battery` ||
|| ![](./_images/icons-list/solid/s-graduation-cap.svg){width=24px height=24px} | `Solid.GRADUATION_CAP` | `s-graduation-cap` | `ui-icon-set --s-graduation-cap` ||
|| ![](./_images/icons-list/solid/s-graphs-diagram.svg){width=24px height=24px} | `Solid.GRAPHS_DIAGRAM` | `s-graphs-diagram` | `ui-icon-set --s-graphs-diagram` ||
|| ![](./_images/icons-list/solid/s-group.svg){width=24px height=24px} | `Solid.GROUP` | `s-group` | `ui-icon-set --s-group` ||
|| ![](./_images/icons-list/solid/s-handshake.svg){width=24px height=24px} | `Solid.HANDSHAKE` | `s-handshake` | `ui-icon-set --s-handshake` ||
|| ![](./_images/icons-list/solid/s-heart.svg){width=24px height=24px} | `Solid.HEART` | `s-heart` | `ui-icon-set --s-heart` ||
|| ![](./_images/icons-list/solid/s-home.svg){width=24px height=24px} | `Solid.HOME` | `s-home` | `ui-icon-set --s-home` ||
|| ![](./_images/icons-list/solid/s-kanban.svg){width=24px height=24px} | `Solid.KANBAN` | `s-kanban` | `ui-icon-set --s-kanban` ||
|| ![](./_images/icons-list/solid/s-key.svg){width=24px height=24px} | `Solid.KEY` | `s-key` | `ui-icon-set --s-key` ||
|| ![](./_images/icons-list/solid/s-knowledge-base.svg){width=24px height=24px} | `Solid.KNOWLEDGE_BASE` | `s-knowledge-base` | `ui-icon-set --s-knowledge-base` ||
|| ![](./_images/icons-list/solid/s-lead.svg){width=24px height=24px} | `Solid.LEAD` | `s-lead` | `ui-icon-set --s-lead` ||
|| ![](./_images/icons-list/solid/s-like.svg){width=24px height=24px} | `Solid.LIKE` | `s-like` | `ui-icon-set --s-like` ||
|| ![](./_images/icons-list/solid/s-location.svg){width=24px height=24px} | `Solid.LOCATION` | `s-location` | `ui-icon-set --s-location` ||
|| ![](./_images/icons-list/solid/s-magic-wand.svg){width=24px height=24px} | `Solid.MAGIC_WAND` | `s-magic-wand` | `ui-icon-set --s-magic-wand` ||
|| ![](./_images/icons-list/solid/s-mail.svg){width=24px height=24px} | `Solid.MAIL` | `s-mail` | `ui-icon-set --s-mail` ||
|| ![](./_images/icons-list/solid/s-main-tool.svg){width=24px height=24px} | `Solid.MAIN_TOOL` | `s-main-tool` | `ui-icon-set --s-main-tool` ||
|| ![](./_images/icons-list/solid/s-market.svg){width=24px height=24px} | `Solid.MARKET` | `s-market` | `ui-icon-set --s-market` ||
|| ![](./_images/icons-list/solid/s-marketing.svg){width=24px height=24px} | `Solid.MARKETING` | `s-marketing` | `ui-icon-set --s-marketing` ||
|| ![](./_images/icons-list/solid/s-message.svg){width=24px height=24px} | `Solid.MESSAGE` | `s-message` | `ui-icon-set --s-message` ||
|| ![](./_images/icons-list/solid/s-microphone-on.svg){width=24px height=24px} | `Solid.MICROPHONE_ON` | `s-microphone-on` | `ui-icon-set --s-microphone-on` ||
|| ![](./_images/icons-list/solid/s-moon.svg){width=24px height=24px} | `Solid.MOON` | `s-moon` | `ui-icon-set --s-moon` ||
|| ![](./_images/icons-list/solid/s-neutral.svg){width=24px height=24px} | `Solid.NEUTRAL` | `s-neutral` | `ui-icon-set --s-neutral` ||
|| ![](./_images/icons-list/solid/s-newsfeed.svg){width=24px height=24px} | `Solid.NEWSFEED` | `s-newsfeed` | `ui-icon-set --s-newsfeed` ||
|| ![](./_images/icons-list/solid/s-note.svg){width=24px height=24px} | `Solid.NOTE` | `s-note` | `ui-icon-set --s-note` ||
|| ![](./_images/icons-list/solid/s-notification.svg){width=24px height=24px} | `Solid.NOTIFICATION` | `s-notification` | `ui-icon-set --s-notification` ||
|| ![](./_images/icons-list/solid/s-observer.svg){width=24px height=24px} | `Solid.OBSERVER` | `s-observer` | `ui-icon-set --s-observer` ||
|| ![](./_images/icons-list/solid/s-online-booking.svg){width=24px height=24px} | `Solid.ONLINE_BOOKING` | `s-online-booking` | `ui-icon-set --s-online-booking` ||
|| ![](./_images/icons-list/solid/s-open-channels.svg){width=24px height=24px} | `Solid.OPEN_CHANNELS` | `s-open-channels` | `ui-icon-set --s-open-channels` ||
|| ![](./_images/icons-list/solid/s-pause.svg){width=24px height=24px} | `Solid.PAUSE` | `s-pause` | `ui-icon-set --s-pause` ||
|| ![](./_images/icons-list/solid/s-payment-terminal.svg){width=24px height=24px} | `Solid.PAYMENT_TERMINAL` | `s-payment-terminal` | `ui-icon-set --s-payment-terminal` ||
|| ![](./_images/icons-list/solid/s-person.svg){width=24px height=24px} | `Solid.PERSON` | `s-person` | `ui-icon-set --s-person` ||
|| ![](./_images/icons-list/solid/s-phone-add.svg){width=24px height=24px} | `Solid.PHONE_ADD` | `s-phone-add` | `ui-icon-set --s-phone-add` ||
|| ![](./_images/icons-list/solid/s-phone-broken.svg){width=24px height=24px} | `Solid.PHONE_BROKEN` | `s-phone-broken` | `ui-icon-set --s-phone-broken` ||
|| ![](./_images/icons-list/solid/s-phone-in.svg){width=24px height=24px} | `Solid.PHONE_IN` | `s-phone-in` | `ui-icon-set --s-phone-in` ||
|| ![](./_images/icons-list/solid/s-phone-out.svg){width=24px height=24px} | `Solid.PHONE_OUT` | `s-phone-out` | `ui-icon-set --s-phone-out` ||
|| ![](./_images/icons-list/solid/s-phone-up.svg){width=24px height=24px} | `Solid.PHONE_UP` | `s-phone-up` | `ui-icon-set --s-phone-up` ||
|| ![](./_images/icons-list/solid/s-pin.svg){width=24px height=24px} | `Solid.PIN` | `s-pin` | `ui-icon-set --s-pin` ||
|| ![](./_images/icons-list/solid/s-play.svg){width=24px height=24px} | `Solid.PLAY` | `s-play` | `ui-icon-set --s-play` ||
|| ![](./_images/icons-list/solid/s-plus.svg){width=24px height=24px} | `Solid.PLUS` | `s-plus` | `ui-icon-set --s-plus` ||
|| ![](./_images/icons-list/solid/s-processes.svg){width=24px height=24px} | `Solid.PROCESSES` | `s-processes` | `ui-icon-set --s-processes` ||
|| ![](./_images/icons-list/solid/s-product-wrapped.svg){width=24px height=24px} | `Solid.PRODUCT_WRAPPED` | `s-product-wrapped` | `ui-icon-set --s-product-wrapped` ||
|| ![](./_images/icons-list/solid/s-product.svg){width=24px height=24px} | `Solid.PRODUCT` | `s-product` | `ui-icon-set --s-product` ||
|| ![](./_images/icons-list/solid/s-record-video.svg){width=24px height=24px} | `Solid.RECORD_VIDEO` | `s-record-video` | `ui-icon-set --s-record-video` ||
|| ![](./_images/icons-list/solid/s-refresh.svg){width=24px height=24px} | `Solid.REFRESH` | `s-refresh` | `ui-icon-set --s-refresh` ||
|| ![](./_images/icons-list/solid/s-repeat.svg){width=24px height=24px} | `Solid.REPEAT` | `s-repeat` | `ui-icon-set --s-repeat` ||
|| ![](./_images/icons-list/solid/s-robot.svg){width=24px height=24px} | `Solid.ROBOT` | `s-robot` | `ui-icon-set --s-robot` ||
|| ![](./_images/icons-list/solid/s-rocket.svg){width=24px height=24px} | `Solid.ROCKET` | `s-rocket` | `ui-icon-set --s-rocket` ||
|| ![](./_images/icons-list/solid/s-roles-library.svg){width=24px height=24px} | `Solid.ROLES_LIBRARY` | `s-roles-library` | `ui-icon-set --s-roles-library` ||
|| ![](./_images/icons-list/solid/s-sad.svg){width=24px height=24px} | `Solid.SAD` | `s-sad` | `ui-icon-set --s-sad` ||
|| ![](./_images/icons-list/solid/s-screen.svg){width=24px height=24px} | `Solid.SCREEN` | `s-screen` | `ui-icon-set --s-screen` ||
|| ![](./_images/icons-list/solid/s-service.svg){width=24px height=24px} | `Solid.SERVICE` | `s-service` | `ui-icon-set --s-service` ||
|| ![](./_images/icons-list/solid/s-settings.svg){width=24px height=24px} | `Solid.SETTINGS` | `s-settings` | `ui-icon-set --s-settings` ||
|| ![](./_images/icons-list/solid/s-shield-checked.svg){width=24px height=24px} | `Solid.SHIELD_CHECKED` | `s-shield-checked` | `ui-icon-set --s-shield-checked` ||
|| ![](./_images/icons-list/solid/s-shield.svg){width=24px height=24px} | `Solid.SHIELD` | `s-shield` | `ui-icon-set --s-shield` ||
|| ![](./_images/icons-list/solid/s-shopping-cart.svg){width=24px height=24px} | `Solid.SHOPPING_CART` | `s-shopping-cart` | `ui-icon-set --s-shopping-cart` ||
|| ![](./_images/icons-list/solid/s-sign.svg){width=24px height=24px} | `Solid.SIGN` | `s-sign` | `ui-icon-set --s-sign` ||
|| ![](./_images/icons-list/solid/s-smart-process.svg){width=24px height=24px} | `Solid.SMART_PROCESS` | `s-smart-process` | `ui-icon-set --s-smart-process` ||
|| ![](./_images/icons-list/solid/s-smile.svg){width=24px height=24px} | `Solid.SMILE` | `s-smile` | `ui-icon-set --s-smile` ||
|| ![](./_images/icons-list/solid/s-sound-off.svg){width=24px height=24px} | `Solid.SOUND_OFF` | `s-sound-off` | `ui-icon-set --s-sound-off` ||
|| ![](./_images/icons-list/solid/s-sound-on.svg){width=24px height=24px} | `Solid.SOUND_ON` | `s-sound-on` | `ui-icon-set --s-sound-on` ||
|| ![](./_images/icons-list/solid/s-stage.svg){width=24px height=24px} | `Solid.STAGE` | `s-stage` | `ui-icon-set --s-stage` ||
|| ![](./_images/icons-list/solid/s-stock.svg){width=24px height=24px} | `Solid.STOCK` | `s-stock` | `ui-icon-set --s-stock` ||
|| ![](./_images/icons-list/solid/s-stop-hand.svg){width=24px height=24px} | `Solid.STOP_HAND` | `s-stop-hand` | `ui-icon-set --s-stop-hand` ||
|| ![](./_images/icons-list/solid/s-storage.svg){width=24px height=24px} | `Solid.STORAGE` | `s-storage` | `ui-icon-set --s-storage` ||
|| ![](./_images/icons-list/solid/s-stress.svg){width=24px height=24px} | `Solid.STRESS` | `s-stress` | `ui-icon-set --s-stress` ||
|| ![](./_images/icons-list/solid/s-subscription.svg){width=24px height=24px} | `Solid.SUBSCRIPTION` | `s-subscription` | `ui-icon-set --s-subscription` ||
|| ![](./_images/icons-list/solid/s-task-list.svg){width=24px height=24px} | `Solid.TASK_LIST` | `s-task-list` | `ui-icon-set --s-task-list` ||
|| ![](./_images/icons-list/solid/s-task.svg){width=24px height=24px} | `Solid.TASK` | `s-task` | `ui-icon-set --s-task` ||
|| ![](./_images/icons-list/solid/s-trashcan.svg){width=24px height=24px} | `Solid.TRASHCAN` | `s-trashcan` | `ui-icon-set --s-trashcan` ||
|| ![](./_images/icons-list/solid/s-verification.svg){width=24px height=24px} | `Solid.VERIFICATION` | `s-verification` | `ui-icon-set --s-verification` ||
|| ![](./_images/icons-list/solid/s-wallet.svg){width=24px height=24px} | `Solid.WALLET` | `s-wallet` | `ui-icon-set --s-wallet` ||
|| ![](./_images/icons-list/solid/s-window-flag.svg){width=24px height=24px} | `Solid.WINDOW_FLAG` | `s-window-flag` | `ui-icon-set --s-window-flag` ||
|| ![](./_images/icons-list/solid/s-crown-1.svg){width=24px height=24px} | `Solid.CROWN_1` | `s-crown-1` | `ui-icon-set --s-crown-1` ||
|#

{% endcut %}

{% cut "Disk" %}

CSS-расширение: `ui.icon-set.disk`.

#|
|| **Иконка** | **Константа** | **Значение** | **HTML-класс** ||
|| ![](./_images/icons-list/disk/doc.svg){width=24px height=24px} | `Disk.DOC` | `doc` | `ui-icon-set --doc` ||
|| ![](./_images/icons-list/disk/docx.svg){width=24px height=24px} | `Disk.DOCX` | `docx` | `ui-icon-set --docx` ||
|| ![](./_images/icons-list/disk/pdf.svg){width=24px height=24px} | `Disk.PDF` | `pdf` | `ui-icon-set --pdf` ||
|| ![](./_images/icons-list/disk/xls.svg){width=24px height=24px} | `Disk.XLS` | `xls` | `ui-icon-set --xls` ||
|| ![](./_images/icons-list/disk/xlsx.svg){width=24px height=24px} | `Disk.XLSX` | `xlsx` | `ui-icon-set --xlsx` ||
|| ![](./_images/icons-list/disk/ppt.svg){width=24px height=24px} | `Disk.PPT` | `ppt` | `ui-icon-set --ppt` ||
|| ![](./_images/icons-list/disk/pptx.svg){width=24px height=24px} | `Disk.PPTX` | `pptx` | `ui-icon-set --pptx` ||
|| ![](./_images/icons-list/disk/zip.svg){width=24px height=24px} | `Disk.ZIP` | `zip` | `ui-icon-set --zip` ||
|| ![](./_images/icons-list/disk/rar.svg){width=24px height=24px} | `Disk.RAR` | `rar` | `ui-icon-set --rar` ||
|| ![](./_images/icons-list/disk/archive.svg){width=24px height=24px} | `Disk.ARCHIVE` | `archive` | `ui-icon-set --archive` ||
|| ![](./_images/icons-list/disk/psd.svg){width=24px height=24px} | `Disk.PSD` | `psd` | `ui-icon-set --psd` ||
|| ![](./_images/icons-list/disk/txt.svg){width=24px height=24px} | `Disk.TXT` | `txt` | `ui-icon-set --txt` ||
|| ![](./_images/icons-list/disk/php.svg){width=24px height=24px} | `Disk.PHP` | `php` | `ui-icon-set --php` ||
|| ![](./_images/icons-list/disk/board.svg){width=24px height=24px} | `Disk.BOARD` | `board` | `ui-icon-set --board` ||
|| ![](./_images/icons-list/disk/odf.svg){width=24px height=24px} | `Disk.ODF` | `odf` | `ui-icon-set --odf` ||
|| ![](./_images/icons-list/disk/odt.svg){width=24px height=24px} | `Disk.ODT` | `odt` | `ui-icon-set --odt` ||
|| ![](./_images/icons-list/disk/ods.svg){width=24px height=24px} | `Disk.ODS` | `ods` | `ui-icon-set --ods` ||
|| ![](./_images/icons-list/disk/odp.svg){width=24px height=24px} | `Disk.ODP` | `odp` | `ui-icon-set --odp` ||
|| ![](./_images/icons-list/disk/audio.svg){width=24px height=24px} | `Disk.AUDIO` | `audio` | `ui-icon-set --audio` ||
|| ![](./_images/icons-list/disk/image.svg){width=24px height=24px} | `Disk.IMAGE` | `image` | `ui-icon-set --image` ||
|| ![](./_images/icons-list/disk/video.svg){width=24px height=24px} | `Disk.VIDEO` | `video` | `ui-icon-set --video` ||
|| ![](./_images/icons-list/disk/complex-graphic.svg){width=24px height=24px} | `Disk.COMPLEX_GRAPHIC` | `complex-graphic` | `ui-icon-set --complex-graphic` ||
|| ![](./_images/icons-list/disk/sign.svg){width=24px height=24px} | `Disk.SIGN` | `sign` | `ui-icon-set --sign` ||
|| ![](./_images/icons-list/disk/scripts.svg){width=24px height=24px} | `Disk.SCRIPTS` | `scripts` | `ui-icon-set --scripts` ||
|| ![](./_images/icons-list/disk/text.svg){width=24px height=24px} | `Disk.TEXT` | `text` | `ui-icon-set --text` ||
|| ![](./_images/icons-list/disk/add.svg){width=24px height=24px} | `Disk.ADD` | `add` | `ui-icon-set --add` ||
|| ![](./_images/icons-list/disk/photo.svg){width=24px height=24px} | `Disk.PHOTO` | `photo` | `ui-icon-set --photo` ||
|| ![](./_images/icons-list/disk/empty.svg){width=24px height=24px} | `Disk.EMPTY` | `empty` | `ui-icon-set --empty` ||
|| ![](./_images/icons-list/disk/loading.svg){width=24px height=24px} | `Disk.LOADING` | `loading` | `ui-icon-set --loading` ||
|| ![](./_images/icons-list/disk/folder.svg){width=24px height=24px} | `Disk.FOLDER` | `folder` | `ui-icon-set --folder` ||
|| ![](./_images/icons-list/disk/folder-group.svg){width=24px height=24px} | `Disk.FOLDER_GROUP` | `folder-group` | `ui-icon-set --folder-group` ||
|| ![](./_images/icons-list/disk/folder-shared.svg){width=24px height=24px} | `Disk.FOLDER_SHARED` | `folder-shared` | `ui-icon-set --folder-shared` ||
|| ![](./_images/icons-list/disk/folder-collab.svg){width=24px height=24px} | `Disk.FOLDER_COLLAB` | `folder-collab` | `ui-icon-set --folder-collab` ||
|| ![](./_images/icons-list/disk/folder-24.svg){width=24px height=24px} | `Disk.FOLDER_24` | `folder-24` | `ui-icon-set --folder-24` ||
|| ![](./_images/icons-list/disk/folder-person.svg){width=24px height=24px} | `Disk.FOLDER_PERSON` | `folder-person` | `ui-icon-set --folder-person` ||
|#

{% endcut %}

{% cut "DiskCompact" %}

CSS-расширение: `ui.icon-set.disk`.

#|
|| **Иконка** | **Константа** | **Значение** | **HTML-класс** ||
|| ![](./_images/icons-list/disk-compact/doc-compact.svg){width=24px height=24px} | `DiskCompact.DOC` | `doc-compact` | `ui-icon-set --doc-compact` ||
|| ![](./_images/icons-list/disk-compact/docx-compact.svg){width=24px height=24px} | `DiskCompact.DOCX` | `docx-compact` | `ui-icon-set --docx-compact` ||
|| ![](./_images/icons-list/disk-compact/pdf-compact.svg){width=24px height=24px} | `DiskCompact.PDF` | `pdf-compact` | `ui-icon-set --pdf-compact` ||
|| ![](./_images/icons-list/disk-compact/xls-compact.svg){width=24px height=24px} | `DiskCompact.XLS` | `xls-compact` | `ui-icon-set --xls-compact` ||
|| ![](./_images/icons-list/disk-compact/xlsx-compact.svg){width=24px height=24px} | `DiskCompact.XLSX` | `xlsx-compact` | `ui-icon-set --xlsx-compact` ||
|| ![](./_images/icons-list/disk-compact/ppt-compact.svg){width=24px height=24px} | `DiskCompact.PPT` | `ppt-compact` | `ui-icon-set --ppt-compact` ||
|| ![](./_images/icons-list/disk-compact/pptx-compact.svg){width=24px height=24px} | `DiskCompact.PPTX` | `pptx-compact` | `ui-icon-set --pptx-compact` ||
|| ![](./_images/icons-list/disk-compact/zip-compact.svg){width=24px height=24px} | `DiskCompact.ZIP` | `zip-compact` | `ui-icon-set --zip-compact` ||
|| ![](./_images/icons-list/disk-compact/rar-compact.svg){width=24px height=24px} | `DiskCompact.RAR` | `rar-compact` | `ui-icon-set --rar-compact` ||
|| ![](./_images/icons-list/disk-compact/archive-compact.svg){width=24px height=24px} | `DiskCompact.ARCHIVE` | `archive-compact` | `ui-icon-set --archive-compact` ||
|| ![](./_images/icons-list/disk-compact/psd-compact.svg){width=24px height=24px} | `DiskCompact.PSD` | `psd-compact` | `ui-icon-set --psd-compact` ||
|| ![](./_images/icons-list/disk-compact/txt-compact.svg){width=24px height=24px} | `DiskCompact.TXT` | `txt-compact` | `ui-icon-set --txt-compact` ||
|| ![](./_images/icons-list/disk-compact/php-compact.svg){width=24px height=24px} | `DiskCompact.PHP` | `php-compact` | `ui-icon-set --php-compact` ||
|| ![](./_images/icons-list/disk-compact/board-compact.svg){width=24px height=24px} | `DiskCompact.BOARD` | `board-compact` | `ui-icon-set --board-compact` ||
|| ![](./_images/icons-list/disk-compact/odf-compact.svg){width=24px height=24px} | `DiskCompact.ODF` | `odf-compact` | `ui-icon-set --odf-compact` ||
|| ![](./_images/icons-list/disk-compact/odt-compact.svg){width=24px height=24px} | `DiskCompact.ODT` | `odt-compact` | `ui-icon-set --odt-compact` ||
|| ![](./_images/icons-list/disk-compact/ods-compact.svg){width=24px height=24px} | `DiskCompact.ODS` | `ods-compact` | `ui-icon-set --ods-compact` ||
|| ![](./_images/icons-list/disk-compact/odp-compact.svg){width=24px height=24px} | `DiskCompact.ODP` | `odp-compact` | `ui-icon-set --odp-compact` ||
|| ![](./_images/icons-list/disk-compact/audio-compact.svg){width=24px height=24px} | `DiskCompact.AUDIO` | `audio-compact` | `ui-icon-set --audio-compact` ||
|| ![](./_images/icons-list/disk-compact/image-compact.svg){width=24px height=24px} | `DiskCompact.IMAGE` | `image-compact` | `ui-icon-set --image-compact` ||
|| ![](./_images/icons-list/disk-compact/video-compact.svg){width=24px height=24px} | `DiskCompact.VIDEO` | `video-compact` | `ui-icon-set --video-compact` ||
|| ![](./_images/icons-list/disk-compact/complex-graphic-compact.svg){width=24px height=24px} | `DiskCompact.COMPLEX_GRAPHIC` | `complex-graphic-compact` | `ui-icon-set --complex-graphic-compact` ||
|| ![](./_images/icons-list/disk-compact/sign-compact.svg){width=24px height=24px} | `DiskCompact.SIGN` | `sign-compact` | `ui-icon-set --sign-compact` ||
|| ![](./_images/icons-list/disk-compact/scripts-compact.svg){width=24px height=24px} | `DiskCompact.SCRIPTS` | `scripts-compact` | `ui-icon-set --scripts-compact` ||
|| ![](./_images/icons-list/disk-compact/text-compact.svg){width=24px height=24px} | `DiskCompact.TEXT` | `text-compact` | `ui-icon-set --text-compact` ||
|| ![](./_images/icons-list/disk-compact/add-compact.svg){width=24px height=24px} | `DiskCompact.ADD` | `add-compact` | `ui-icon-set --add-compact` ||
|| ![](./_images/icons-list/disk-compact/photo-compact.svg){width=24px height=24px} | `DiskCompact.PHOTO` | `photo-compact` | `ui-icon-set --photo-compact` ||
|| ![](./_images/icons-list/disk-compact/empty-compact.svg){width=24px height=24px} | `DiskCompact.EMPTY` | `empty-compact` | `ui-icon-set --empty-compact` ||
|| ![](./_images/icons-list/disk-compact/loading-compact.svg){width=24px height=24px} | `DiskCompact.LOADING` | `loading-compact` | `ui-icon-set --loading-compact` ||
|| ![](./_images/icons-list/disk-compact/folder-compact.svg){width=24px height=24px} | `DiskCompact.FOLDER` | `folder-compact` | `ui-icon-set --folder-compact` ||
|| ![](./_images/icons-list/disk-compact/folder-group-compact.svg){width=24px height=24px} | `DiskCompact.FOLDER_GROUP` | `folder-group-compact` | `ui-icon-set --folder-group-compact` ||
|| ![](./_images/icons-list/disk-compact/folder-shared-compact.svg){width=24px height=24px} | `DiskCompact.FOLDER_SHARED` | `folder-shared-compact` | `ui-icon-set --folder-shared-compact` ||
|| ![](./_images/icons-list/disk-compact/folder-collab-compact.svg){width=24px height=24px} | `DiskCompact.FOLDER_COLLAB` | `folder-collab-compact` | `ui-icon-set --folder-collab-compact` ||
|| ![](./_images/icons-list/disk-compact/folder-24-compact.svg){width=24px height=24px} | `DiskCompact.FOLDER_24` | `folder-24-compact` | `ui-icon-set --folder-24-compact` ||
|| ![](./_images/icons-list/disk-compact/folder-person-compact.svg){width=24px height=24px} | `DiskCompact.FOLDER_PERSON` | `folder-person-compact` | `ui-icon-set --folder-person-compact` ||
|#

{% endcut %}

{% cut "SmallOutline" %}

CSS-расширение: `ui.icon-set.small-outline`.

#|
|| **Иконка** | **Константа** | **Значение** | **HTML-класс** ||
|| ![](./_images/icons-list/small-outline/so-audio-to-script.svg){width=24px height=24px} | `SmallOutline.AUDIO_TO_SCRIPT` | `so-audio-to-script` | `ui-icon-set --so-audio-to-script` ||
|| ![](./_images/icons-list/small-outline/so-check.svg){width=24px height=24px} | `SmallOutline.CHECK` | `so-check` | `ui-icon-set --so-check` ||
|| ![](./_images/icons-list/small-outline/so-circle-check.svg){width=24px height=24px} | `SmallOutline.CIRCLE_CHECK` | `so-circle-check` | `ui-icon-set --so-circle-check` ||
|| ![](./_images/icons-list/small-outline/so-clock.svg){width=24px height=24px} | `SmallOutline.CLOCK` | `so-clock` | `ui-icon-set --so-clock` ||
|| ![](./_images/icons-list/small-outline/so-cloud-time.svg){width=24px height=24px} | `SmallOutline.CLOUD_TIME` | `so-cloud-time` | `ui-icon-set --so-cloud-time` ||
|| ![](./_images/icons-list/small-outline/so-cross.svg){width=24px height=24px} | `SmallOutline.CROSS` | `so-cross` | `ui-icon-set --so-cross` ||
|| ![](./_images/icons-list/small-outline/so-digits-24.svg){width=24px height=24px} | `SmallOutline.DIGITS_24` | `so-digits-24` | `ui-icon-set --so-digits-24` ||
|| ![](./_images/icons-list/small-outline/so-double-check.svg){width=24px height=24px} | `SmallOutline.DOUBLE_CHECK` | `so-double-check` | `ui-icon-set --so-double-check` ||
|| ![](./_images/icons-list/small-outline/so-earth.svg){width=24px height=24px} | `SmallOutline.EARTH` | `so-earth` | `ui-icon-set --so-earth` ||
|| ![](./_images/icons-list/small-outline/so-gift.svg){width=24px height=24px} | `SmallOutline.GIFT` | `so-gift` | `ui-icon-set --so-gift` ||
|| ![](./_images/icons-list/small-outline/so-globe-extranet.svg){width=24px height=24px} | `SmallOutline.GLOBE_EXTRANET` | `so-globe-extranet` | `ui-icon-set --so-globe-extranet` ||
|| ![](./_images/icons-list/small-outline/so-groupme.svg){width=24px height=24px} | `SmallOutline.GROUPME` | `so-groupme` | `ui-icon-set --so-groupme` ||
|| ![](./_images/icons-list/small-outline/so-kik.svg){width=24px height=24px} | `SmallOutline.KIK` | `so-kik` | `ui-icon-set --so-kik` ||
|| ![](./_images/icons-list/small-outline/so-mail.svg){width=24px height=24px} | `SmallOutline.MAIL` | `so-mail` | `ui-icon-set --so-mail` ||
|| ![](./_images/icons-list/small-outline/so-mention.svg){width=24px height=24px} | `SmallOutline.MENTION` | `so-mention` | `ui-icon-set --so-mention` ||
|| ![](./_images/icons-list/small-outline/so-message-2.svg){width=24px height=24px} | `SmallOutline.MESSAGE_2` | `so-message-2` | `ui-icon-set --so-message-2` ||
|| ![](./_images/icons-list/small-outline/so-message.svg){width=24px height=24px} | `SmallOutline.MESSAGE` | `so-message` | `ui-icon-set --so-message` ||
|| ![](./_images/icons-list/small-outline/so-messenger-meta.svg){width=24px height=24px} | `SmallOutline.MESSENGER_META` | `so-messenger-meta` | `ui-icon-set --so-messenger-meta` ||
|| ![](./_images/icons-list/small-outline/so-notification-off.svg){width=24px height=24px} | `SmallOutline.NOTIFICATION_OFF` | `so-notification-off` | `ui-icon-set --so-notification-off` ||
|| ![](./_images/icons-list/small-outline/so-notification.svg){width=24px height=24px} | `SmallOutline.NOTIFICATION` | `so-notification` | `ui-icon-set --so-notification` ||
|| ![](./_images/icons-list/small-outline/so-open-channels.svg){width=24px height=24px} | `SmallOutline.OPEN_CHANNELS` | `so-open-channels` | `ui-icon-set --so-open-channels` ||
|| ![](./_images/icons-list/small-outline/so-person.svg){width=24px height=24px} | `SmallOutline.PERSON` | `so-person` | `ui-icon-set --so-person` ||
|| ![](./_images/icons-list/small-outline/so-pin.svg){width=24px height=24px} | `SmallOutline.PIN` | `so-pin` | `ui-icon-set --so-pin` ||
|| ![](./_images/icons-list/small-outline/so-robot.svg){width=24px height=24px} | `SmallOutline.ROBOT` | `so-robot` | `ui-icon-set --so-robot` ||
|| ![](./_images/icons-list/small-outline/so-slack.svg){width=24px height=24px} | `SmallOutline.SLACK` | `so-slack` | `ui-icon-set --so-slack` ||
|| ![](./_images/icons-list/small-outline/so-small-crown.svg){width=24px height=24px} | `SmallOutline.SMALL_CROWN` | `so-small-crown` | `ui-icon-set --so-small-crown` ||
|| ![](./_images/icons-list/small-outline/so-small-heart.svg){width=24px height=24px} | `SmallOutline.SMALL_HEART` | `so-small-heart` | `ui-icon-set --so-small-heart` ||
|| ![](./_images/icons-list/small-outline/so-small-phone-up.svg){width=24px height=24px} | `SmallOutline.SMALL_PHONE_UP` | `so-small-phone-up` | `ui-icon-set --so-small-phone-up` ||
|| ![](./_images/icons-list/small-outline/so-sound-off.svg){width=24px height=24px} | `SmallOutline.SOUND_OFF` | `so-sound-off` | `ui-icon-set --so-sound-off` ||
|| ![](./_images/icons-list/small-outline/so-stop.svg){width=24px height=24px} | `SmallOutline.STOP` | `so-stop` | `ui-icon-set --so-stop` ||
|| ![](./_images/icons-list/small-outline/so-telegram.svg){width=24px height=24px} | `SmallOutline.TELEGRAM` | `so-telegram` | `ui-icon-set --so-telegram` ||
|| ![](./_images/icons-list/small-outline/so-timer-dot.svg){width=24px height=24px} | `SmallOutline.TIMER_DOT` | `so-timer-dot` | `ui-icon-set --so-timer-dot` ||
|| ![](./_images/icons-list/small-outline/so-transcription.svg){width=24px height=24px} | `SmallOutline.TRANSCRIPTION` | `so-transcription` | `ui-icon-set --so-transcription` ||
|| ![](./_images/icons-list/small-outline/so-twillio.svg){width=24px height=24px} | `SmallOutline.TWILLIO` | `so-twillio` | `ui-icon-set --so-twillio` ||
|| ![](./_images/icons-list/small-outline/so-undo.svg){width=24px height=24px} | `SmallOutline.UNDO` | `so-undo` | `ui-icon-set --so-undo` ||
|| ![](./_images/icons-list/small-outline/so-unpin.svg){width=24px height=24px} | `SmallOutline.UNPIN` | `so-unpin` | `ui-icon-set --so-unpin` ||
|| ![](./_images/icons-list/small-outline/so-vacation.svg){width=24px height=24px} | `SmallOutline.VACATION` | `so-vacation` | `ui-icon-set --so-vacation` ||
|| ![](./_images/icons-list/small-outline/so-vk.svg){width=24px height=24px} | `SmallOutline.VK` | `so-vk` | `ui-icon-set --so-vk` ||
|| ![](./_images/icons-list/small-outline/so-window-screen.svg){width=24px height=24px} | `SmallOutline.WINDOW_SCREEN` | `so-window-screen` | `ui-icon-set --so-window-screen` ||
|#

{% endcut %}
