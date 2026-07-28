---
title: Общие параметры в ui.entity-selector
description: "Общие параметры ui.entity-selector: TextNodeOptions, AvatarOptions, CaptionOptions, BadgesOptions, ItemBadgeOptions, HeaderOptions и FooterOptions."
---

В этой статье описаны общие структуры параметров для диалога, элементов, вкладок и тегов. Эти структуры используют несколько классов `ui.entity-selector`.

Параметры, которые относятся только к `Dialog`, описаны в статье [Dialog](./dialog.md). Параметры, которые относятся только к `TagSelector`, описаны в статье [TagSelector](./tag-selector.md).

Общие структуры используются в параметрах `ItemOptions`, `TagItemOptions`, `TabOptions`, `TagSelectorOptions`, `HeaderOptions` и `FooterOptions`.

Выбирайте уровень настройки по сценарию. Для одного элемента задавайте параметр в самом элементе. Для всех элементов типа объекта используйте `EntityOptions.itemOptions` или `EntityOptions.tagOptions`.

В примерах ниже классы импортируются из расширения `ui.entity-selector`.

```js
import { Dialog, TagSelector, DefaultFooter } from 'ui.entity-selector';
```

Поля общих структур передаются только там, где нужно переопределить стандартное отображение. Обязательные поля сценарных объектов описаны в статьях [Dialog](./dialog.md#dialogoptions) и [TagSelector](./tag-selector.md#tagselectoroptions).

## TextNodeOptions

`TextNodeOptions` задает текстовое или HTML-содержимое для заголовков, подзаголовков, подписей и бейджей.

| Параметр | Тип | Описание |
| --- | --- | --- |
| `text` | `string` | Текст или HTML-строка |
| `type` | `TextNodeType` | Тип содержимого: `TEXT` или `HTML` |

{% note warning "" %}

Передавайте `type: 'HTML'` только для доверенной HTML-строки. Для пользовательского ввода используйте `type: 'TEXT'` или строку.

{% endnote %}

```js
const dialog = new Dialog({
    targetNode: button,
    items: [
        {
            id: 1,
            entityId: 'project',
            title: {
                text: '<b>Проект внедрения</b>',
                type: 'HTML',
            },
        },
    ],
});
```

## AvatarOptions

`AvatarOptions` задает визуальные параметры аватара элемента или тега.

В поля с CSS-значениями передавайте только значения, которые ожидает соответствующее CSS-свойство. Для изображений используйте заранее подготовленные пути или доверенные URL.

| Параметр | Тип | Описание |
| --- | --- | --- |
| `bgSize` | `string` | CSS-значение размера фонового изображения |
| `bgColor` | `string` | Цвет фона |
| `bgImage` | `string` | CSS-значение фонового изображения |
| `border` | `string` | CSS-значение рамки |
| `borderRadius` | `string` | CSS-значение скругления |
| `outline` | `string` | CSS-значение внешней рамки |
| `outlineOffset` | `string` | CSS-смещение внешней рамки |
| `icon` | `string` | Иконка аватара |
| `iconColor` | `string` | Цвет иконки |

```js
const selector = new TagSelector({
    tagAvatarOptions: {
        bgColor: '#e7f5ff',
        iconColor: '#1d6fd6',
    },
});
```

## CaptionOptions

`CaptionOptions` задает отображение подписи элемента или DOM-узла элемента.

Параметры подписи можно передать в `ItemOptions.captionOptions` или в параметры DOM-узла элемента.

| Параметр | Тип | Описание |
| --- | --- | --- |
| `fitContent` | `boolean` | Запрещает подписи растягиваться на свободную ширину |
| `maxWidth` | `number` или `string` | Максимальная ширина подписи |
| `justifyContent` | `'left'`, `'right'` или `'center'` | Выравнивание подписи |

## BadgesOptions

`BadgesOptions` задает отображение группы бейджей элемента.

Параметры группы бейджей передавайте в `ItemOptions.badgesOptions`, если нужно настроить расположение всех бейджей элемента.

| Параметр | Тип | Описание |
| --- | --- | --- |
| `fitContent` | `boolean` | Запрещает группе бейджей растягиваться на свободную ширину |
| `maxWidth` | `number` или `string` | Максимальная ширина группы бейджей |
| `justifyContent` | `'left'`, `'right'` или `'center'` | Выравнивание группы бейджей |

## ItemBadgeOptions

`ItemBadgeOptions` задает один бейдж элемента.

Бейджи передаются в `ItemOptions.badges`. Для текста бейджа используйте строку или `TextNodeOptions`; HTML-содержимое передавайте только для доверенной разметки.

| Параметр | Тип | Описание |
| --- | --- | --- |
| `title` | `string` или `TextNodeOptions` | Текст бейджа |
| `textColor` | `string` | Цвет текста бейджа |
| `bgColor` | `string` | Цвет фона бейджа |
| `border` | `string` | CSS-значение рамки бейджа |

```js
const dialog = new Dialog({
    targetNode: button,
    items: [
        {
            id: 1,
            entityId: 'project',
            title: 'Проект внедрения',
            badges: [
                {
                    title: 'Новый',
                    bgColor: '#e7f5ff',
                    textColor: '#1d6fd6',
                },
            ],
        },
    ],
});
```

## HeaderOptions и FooterOptions

`HeaderOptions` и `FooterOptions` — объекты с параметрами, которые получает класс заголовка или футера.

Строку в `content`, `header` или `footer` используйте для доверенной статической разметки. Если содержимое зависит от пользовательского ввода, создавайте DOM-узел и передавайте пользовательский текст как текстовое содержимое, а не как HTML-строку.

Для `DefaultHeader` и `DefaultFooter` доступны параметры:

| Параметр | Тип | Описание |
| --- | --- | --- |
| `content` | `string`, `HTMLElement` или `HTMLElement[]` | Содержимое заголовка или футера |
| `containerClass` | `string` | CSS-класс контейнера |
| `containerStyles` | `Object` | CSS-стили контейнера |

Пользовательский класс заголовка или футера наследуйте от `DefaultHeader`, `DefaultFooter`, `BaseHeader` или `BaseFooter`. В классе на основе `DefaultHeader` или `DefaultFooter` переопределите `getContent()`. В классе на основе `BaseHeader` или `BaseFooter` переопределите `render()`. Собственные параметры читайте через `getOption()`.

`header` и `footer` принимают строку, DOM-узел, массив DOM-узлов или класс. Если передан класс, параметры из `headerOptions` или `footerOptions` доступны через метод `getOption()`.

```js
class ProjectFooter extends DefaultFooter
{
    getContent()
    {
        return this.getOption('label', 'Создать проект');
    }
}

const dialog = new Dialog({
    targetNode: button,
    footer: ProjectFooter,
    footerOptions: {
        label: 'Добавить проект',
    },
});
```
