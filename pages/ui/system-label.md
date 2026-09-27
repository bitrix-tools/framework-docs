---
title: "Системная метка"
description: 'Системная метка. UI Bitrix Framework: инструменты интерфейса, подключение расширений и примеры использования.'
---

Системная метка — это компактный компонент для короткого статуса, признака или категории. Метка выводит текст в скругленном контейнере и поддерживает три размера, цветовые стили, рамку и режим иконки.

Компонент используют в интерфейсах, где нужно показать состояние объекта рядом с названием, строкой списка, карточкой или элементом формы. Если метка должна запускать действие по клику, обработчик нужно добавить на внешний контейнер или выбрать другой интерактивный компонент.

В Bitrix Framework за системную метку отвечает расширение `ui.system.label`. Оно экспортирует класс `Label`, объекты `LabelSize`, `LabelStyle`, `LabelIcon` и Vue-компонент. Разметку метки можно собрать и на сервере — PHP-классом `\Bitrix\UI\Public\System\Label\Label`.

{% note tip "" %}

Короткий статус выводит и второе расширение — `ui.label`. Его выбирают, когда нужен цвет из `LabelColor`, метка-ссылка или индикатор загрузки: у системной метки этих возможностей нет. Подробности — в статье [Метка ui.label](./ui-label.md).

{% endnote %}

## Подключить расширение

Если вы подключаете компонент из PHP, загрузите расширение `ui.system.label`.

```php
\Bitrix\Main\UI\Extension::load('ui.system.label');
```

Если вы работаете в модульном JavaScript, импортируйте нужные классы и константы из `ui.system.label`.

```js
import { Label, LabelSize, LabelStyle, LabelIcon } from 'ui.system.label';
```

## Создать метку

Чтобы создать метку, выполните основные действия:

1. Создайте экземпляр `Label`.

2. Передайте текст `value`, размер `size` и стиль `style`.

3. Получите DOM-узел через `render()`.

4. Добавьте полученный узел на страницу.

```js
import { Label, LabelSize, LabelStyle } from 'ui.system.label';

const label = new Label({
    value: 'Новый',
    size: LabelSize.MD,
    style: LabelStyle.TINTED_SUCCESS,
});

document.getElementById('label-container').append(label.render());
```

![](./_images/system-label-7.png){width=121px height=52px}

## Передать параметры

Конструктор `Label` принимает объект с параметрами, которые задают текст, размер и оформление метки.

-  `value` — строка с текстом метки. Если параметр не передан, используется пустая строка.

-  `size` — размер метки, значение из `LabelSize`. По умолчанию используется `LabelSize.MD`.

-  `style` — цветовой стиль метки, значение из `LabelStyle`. По умолчанию используется `LabelStyle.FILLED`.

-  `border` — логическое значение для рамки внутри метки.

-  `icon` — иконка, значение из `LabelIcon`.

## Выбрать размер

Размер определяет высоту метки, горизонтальные отступы и размер текста.

-  `LabelSize.MD` — значение `md`.

-  `LabelSize.SM` — значение `sm`.

-  `LabelSize.XS` — значение `xs`.

```js
import { Label, LabelSize } from 'ui.system.label';

const label = new Label({
    value: 'CRM',
    size: LabelSize.SM,
});
```

## Выбрать стиль

Стиль задает фон и цвет содержимого. Используйте константы `LabelStyle`, а не строковые значения: компонент поддерживает только значения из этого объекта.

### Заполненные стили

Заполненные стили используют плотный цветной фон.

![](./_images/system-label-3.png){width=700px height=58px}

-  `LabelStyle.FILLED_EXTRA` — акцентная метка.

-  `LabelStyle.FILLED` — основная метка. Используется по умолчанию.

-  `LabelStyle.FILLED_ALERT` — метка для ошибки или критического статуса.

-  `LabelStyle.FILLED_WARNING` — метка для предупреждения.

-  `LabelStyle.FILLED_SUCCESS` — метка для успешного статуса.

-  `LabelStyle.FILLED_NO_ACCENT` — метка без акцента.

### Инвертированные стили

Инвертированные стили меняют местами основной цвет фона и текста.

![](./_images/system-label-4.png){width=582px height=50px}

-  `LabelStyle.FILLED_INVERTED` — основная метка.

-  `LabelStyle.FILLED_ALERT_INVERTED` — метка для ошибки или критического статуса.

-  `LabelStyle.FILLED_WARNING_INVERTED` — метка для предупреждения.

-  `LabelStyle.FILLED_SUCCESS_INVERTED` — метка для успешного статуса.

-  `LabelStyle.FILLED_NO_ACCENT_INVERTED` — метка без акцента.

### Тонированные стили

Тонированные стили используют мягкий фон.

![](./_images/system-label-5.png){width=452px height=50px}

-  `LabelStyle.TINTED` — основная метка.

-  `LabelStyle.TINTED_SUCCESS` — метка для успешного статуса.

-  `LabelStyle.TINTED_WARNING` — метка для предупреждения.

-  `LabelStyle.TINTED_ALERT` — метка для ошибки или критического статуса.

-  `LabelStyle.TINTED_VIOLET` — сиреневая метка.

-  `LabelStyle.TINTED_NO_ACCENT` — метка без акцента.

### Дополнительные стили

![](./_images/system-label-6.png){width=202px height=50px}

-  `LabelStyle.COLLAB` — стиль для коллабораций.

-  `LabelStyle.OUTLINE_NO_ACCENT` — менее акцентная метка в контурном оформлении.

### Стили Bitrix GPT

Стили Bitrix GPT оформляют метку градиентом. Их выбирают для элементов, которые относятся к Bitrix GPT.

-  `LabelStyle.FILLED_BITRIX_GPT` — метка с цветным градиентом на фоне и однотонным текстом.

-  `LabelStyle.TINTED_BITRIX_GPT` — метка со светлым градиентом на фоне и градиентным текстом.

-  `LabelStyle.OUTLINE_BITRIX_GPT` — контурная метка с градиентной рамкой и градиентным текстом.

## Добавить рамку

Передайте `border: true`, чтобы добавить внутреннюю рамку.

```js
import { Label, LabelStyle } from 'ui.system.label';

const label = new Label({
    value: 'Черновик',
    style: LabelStyle.TINTED_NO_ACCENT,
    border: true,
});
```

![](./_images/system-label-8.png){width=266px height=72px}

## Показать иконку

Передайте `icon`, чтобы вывести метку как квадратную иконку. В этом режиме метка показывает только иконку.

```js
import { Label, LabelIcon, LabelStyle } from 'ui.system.label';

const label = new Label({
    style: LabelStyle.FILLED_SUCCESS,
    icon: LabelIcon.CHECK,
});
```

![](./_images/system-label-9.png){width=380px height=59px}

Доступные иконки:

-  `LabelIcon.NONE` — без иконки, пустое значение.

-  `LabelIcon.CHECK` — галочка, значение `check`.

-  `LabelIcon.ATTENTION` — предупреждение, значение `attention`.

-  `LabelIcon.CROSS` — крестик, значение `cross`.

-  `LabelIcon.QUESTION` — вопрос, значение `question`.

-  `LabelIcon.CHECK_STROKE` — контурная галочка, значение `checkStroke`.

-  `LabelIcon.CROSS_STROKE` — контурный крестик, значение `crossStroke`.

-  `LabelIcon.PROCESS_STROKE` — контурный индикатор процесса, значение `processStroke`.

## Управлять компонентом

Используйте методы `Label`, чтобы изменить уже созданную метку после вызова `render()`.

-  `render()` создает и возвращает корневой DOM-узел метки.

-  `destroy()` удаляет текущий DOM-узел метки со страницы.

-  `setValue(value)` и `getValue()` меняют и возвращают текст метки.

-  `setSize(size)` и `getSize()` меняют и возвращают размер.

-  `setStyle(style)` и `getStyle()` меняют и возвращают стиль.

-  `setBordered(flag)` показывает или скрывает рамку. По умолчанию `flag` равен `true`.

-  `setIcon(icon)` меняет иконку. Чтобы вернуться к текстовому режиму, передайте `LabelIcon.NONE` или пустое значение.

```js
import { Label, LabelStyle, LabelIcon } from 'ui.system.label';

const label = new Label({
    value: 'В обработке',
});

document.getElementById('label-container').append(label.render());

label.setStyle(LabelStyle.TINTED_WARNING);
label.setIcon(LabelIcon.PROCESS_STROKE);
label.setValue('Проверяется');
```

Методы `setSize()` и `setStyle()` применяют только значения из `LabelSize` и `LabelStyle`. Если передать другое значение, текущее оформление не изменится.

Вызывайте `setIcon()` после `render()`: метод меняет отображение уже созданной метки.

## Вывести метку из PHP

Класс `\Bitrix\UI\Public\System\Label\Label` собирает разметку метки на сервере и возвращает ее строкой. Этот способ подходит для шаблонов компонентов и страниц, где метку выводят вместе с остальным HTML, а не создают из JavaScript.

Метод `render()` сам загружает расширение `ui.system.label`, поэтому отдельный вызов `Extension::load()` не нужен. Метку класс выводит тегом `div`.

**Пример.** Статический метод `create()` собирает метку и отдает готовую разметку.

```php
use Bitrix\UI\Public\System\Label\Label;
use Bitrix\UI\Public\System\Label\Size;
use Bitrix\UI\Public\System\Label\Style;

echo Label::create([
    'value' => 'Проведен',
    'style' => Style::TINTED_SUCCESS,
    'size' => Size::SM,
])->render();
```

Конструктор и метод `create()` принимают один и тот же массив параметров.

-  `value` — строка с текстом метки. Класс экранирует значение, поэтому HTML-теги в строке не обрабатываются.

-  `style` — стиль метки, значение перечисления `Style`. По умолчанию используется `Style::FILLED`.

-  `size` — размер метки, значение перечисления `Size`. По умолчанию используется `Size::MD`.

-  `icon` — иконка, значение перечисления `Icon`. Значение `Icon::NONE` оставляет метку текстовой.

-  `bordered` — логическое значение для внутренней рамки.

-  `title` — строка для атрибута `title`, всплывающей подсказки браузера.

-  `className` — строка с CSS-классами через пробел.

-  `classList` — массив CSS-классов.

-  `dataset` — массив data-атрибутов.

-  `attributes` — массив произвольных атрибутов тега.

{% note warning "" %}

Параметры `style`, `size` и `icon` принимают только значения перечислений. Строку в массиве параметров класс молча пропустит и оставит значение по умолчанию, а строка в сеттере `setStyle()`, `setSize()` или `setIcon()` вызовет `TypeError`.

{% endnote %}

Перечисления `Size` и `Icon` повторяют объекты `LabelSize` и `LabelIcon` из JavaScript. Перечисление `Style` короче: значений `TINTED_ALERT`, `TINTED_VIOLET`, `FILLED_BITRIX_GPT`, `TINTED_BITRIX_GPT` и `OUTLINE_BITRIX_GPT` в нем нет.

Сеттеры класса возвращают сам объект, поэтому вызовы объединяются в цепочку.

-  `setValue(value)` меняет текст метки.

-  `setStyle(style)` меняет стиль, значение перечисления `Style`.

-  `setSize(size)` меняет размер, значение перечисления `Size`.

-  `setIcon(icon)` меняет иконку. Чтобы вернуться к текстовому режиму, передайте `Icon::NONE`.

-  `setBordered(flag)` показывает или скрывает внутреннюю рамку. Без аргумента метод включает рамку.

-  `setTitle(title)` задает атрибут `title`. Значение `null` убирает атрибут.

-  `addClass(className)` добавляет один CSS-класс.

-  `addClasses(classList)` добавляет CSS-классы массивом.

-  `addDataAttribute(name, value)` добавляет data-атрибут: к имени класс подставляет префикс `data-`.

-  `setAttribute(name, value)` задает произвольный атрибут тега. С именем `class` метод не перезаписывает атрибут, а добавляет классы к уже собранному списку.

**Пример.** Метка собирается по шагам и получает свой CSS-класс и data-атрибут.

```php
use Bitrix\UI\Public\System\Label\Icon;
use Bitrix\UI\Public\System\Label\Label;
use Bitrix\UI\Public\System\Label\Style;

$label = new Label();

echo $label
    ->setValue('Проверяется')
    ->setStyle(Style::TINTED_WARNING)
    ->setIcon(Icon::PROCESS_STROKE)
    ->setBordered()
    ->addClass('document-status')
    ->addDataAttribute('document-id', 12)
    ->render()
;
```

## Использовать Vue-компонент

Vue-компонент доступен через пространство `Vue` расширения `ui.system.label`. Отдельное расширение `ui.system.label.vue` подключает тот же Vue-компонент и зависит от `ui.system.label`.

```javascript
import { LabelSize, LabelStyle, LabelIcon } from 'ui.system.label';
import { Label as UiLabel } from 'ui.system.label.vue';

export const ExampleComponent = {
    components: {
        UiLabel,
    },
    setup() {
        return {
            LabelSize,
            LabelStyle,
            LabelIcon,
        };
    },
    template: `
        <UiLabel
            value="Готово"
            :size="LabelSize.MD"
            :style="LabelStyle.TINTED_SUCCESS"
            :icon="LabelIcon.CHECK"
            bordered
        />
    `,
};
```

Свойства Vue-компонента соответствуют параметрам `Label`.

Для рамки используйте `bordered`.

При изменении свойств компонент обновляет уже созданную метку.

{% note tip "" %}

Подробнее о работе с Vue в Bitrix Framework читайте в статье [Vue.js](../advanced/vue.md).

{% endnote %}
