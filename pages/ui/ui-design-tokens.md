---
title: Дизайн-токены ui.design-tokens и Air Design
description: 'Дизайн-токены ui.design-tokens. UI Bitrix Framework: CSS-переменные цветов, шрифтов, отступов и скруглений, набор ui.design-tokens.air, токены в стилях своих блоков, включение оформления Air Design константой AIR_SITE_TEMPLATE и параметром useAirDesign.'
---

Дизайн-токены — CSS-переменные с цветами, размерами шрифтов, отступами и скруглениями. Компоненты раздела берут оформление из токенов. Те же токены можно использовать в стилях своих блоков, чтобы блоки выглядели согласованно с интерфейсом.

## Выбрать набор токенов

Токены объявляют два расширения.

-  `ui.design-tokens` — основной набор с переменными `--ui-color-*`, `--ui-font-size-*`, `--ui-space-*`, `--ui-border-radius-*` и другими.

-  `ui.design-tokens.air` — набор для [Air Design](#air-design) с переменными `--ui-color-design-*`, `--ui-color-bg-*` и другими. Значения части переменных зависят от контекста — светлого или темного фона.

Полный список переменных основного набора лежит в файле `bitrix/js/ui/design-tokens/dist/ui.design-tokens.css`, набора для Air Design — в файле `bitrix/js/ui/design-tokens/air/dist/air-design-tokens.css`.

## Подключить токены

Многие расширения раздела, например [ui.alerts](./ui-alerts.md), [ui.notification](./ui-notification.md), [ui.switcher](./ui-switcher.md) и [ui.forms](./ui-forms.md), подключают `ui.design-tokens` как зависимость. Если токены нужны в стилях страницы без таких расширений, загрузите набор сами.

```php
\Bitrix\Main\UI\Extension::load('ui.design-tokens');
```

## Использовать токены в своих стилях

Подставляйте токены в свойства CSS через функцию `var()`. Основной набор содержит, например, такие цветовые переменные.

-  `--ui-color-primary` — основной акцентный цвет.

-  `--ui-color-base-*` — оттенки серого для текста и границ.

-  `--ui-color-palette-*` — исходная палитра, на которой построены остальные цвета.

**Пример.** Стили карточки документа используют токены цвета текста, фона, отступа и скругления.

```css
.document-card {
    padding: var(--ui-space-inset-md);
    border-radius: var(--ui-border-radius-md);
    background: var(--ui-color-background-primary);
    color: var(--ui-color-text-primary);
    font-size: var(--ui-font-size-md);
}

.document-card__hint {
    color: var(--ui-color-base-70);
}
```

## Включить Air Design {#air-design}

Air Design — вариант оформления интерфейса Битрикс24. Его включают двумя способами.

-  Константа `AIR_SITE_TEMPLATE` включает Air Design на стороне сервера. Модуль `intranet` определяет ее в публичной части сайта, если сайт работает на шаблоне `bitrix24`. Панель инструментов [ui.toolbar](./ui-toolbar.md) переводит добавленные кнопки в оформление Air. PHP-классы кнопок [ui.buttons](./ui-buttons.md) включают его параметром `'air' => true`, только если константа определена.

-  Параметр `useAirDesign: true` включает Air Design для отдельного JS-компонента. Параметр есть, например, у кнопок `ui.buttons`, переключателя [ui.switcher](./ui-switcher.md), счетчика [ui.counter](./ui-counter.md), кольцевого индикатора [ui.progressround](./ui-progress.md#progressround-air), уведомлений [ui.notification](./ui-notification.md) и окна сообщения [ui.dialogs.messagebox](./dialogs-messagebox.md).

У перечисленных JS-компонентов параметр `useAirDesign` по умолчанию равен `false`. Если на странице с Air Design компонент тоже должен быть в оформлении Air, передайте `useAirDesign: true` в параметрах компонента. Если кнопка, переключатель или счетчик создаются из готовой разметки, класс `--air` на их узле включает оформление Air.

## Связанные материалы

-  [Кнопки ui.buttons](./ui-buttons.md)

-  [Переключатель ui.switcher](./ui-switcher.md)

-  [Поля форм ui.forms](./ui-forms.md)

-  [Расширения](../framework/extensions.md)
