# SidePanel

## Описание

Модуль `main.sidepanel` предоставляет функциональность для создания и управления слайдерами. Он позволяет открывать страницы и компоненты в модальных окнах, которые выдвигаются сбоку экрана, не перезагружая основную страницу. Управление всеми слайдерами осуществляется через единый менеджер — `SidePanel.Instance`.

**Расположение:** `/main/install/js/main/sidepanel/src/`

## Получение экземпляра

Доступ к менеджеру слайдеров можно получить импортировав его из модуля.

```javascript
// ES6
import { SidePanel } from 'main.sidepanel';
const sliderManager = SidePanel.Instance;
```

## Основные методы

### Открытие слайдера

Основной метод для открытия нового слайдера — `open`. Он принимает URL для загрузки в слайдере и объект с опциями.

```javascript
import { SidePanel } from 'main.sidepanel';

SidePanel.Instance.open("profile/user/1/", {
    width: 800,
    cacheable: false,
    allowChangeHistory: true,
    events: {
        onClose: function(event) {
            console.log("Slider was closed!");
        }
    }
});
```

### Закрытие слайдера

Для закрытия текущего (верхнего) слайдера используется метод `close`.

```javascript
SidePanel.Instance.close();
```

### Отправка сообщений между слайдерами

Модуль поддерживает обмен сообщениями между слайдерами и основной страницей с помощью `postMessage`.

```javascript
import { SidePanel } from 'main.sidepanel';

// Отправка сообщения из дочернего слайдера в родительский
SidePanel.Instance.postMessage(window, "my-event-name", { some: "data" });

// Подписка на событие в родительском окне
SidePanel.Instance.subscribe("my-event-name", function(event) {
    const data = event.getData();
    console.log(data); // { some: "data" }
});
```

## Основные опции при открытии (`open`)

| Параметр | Тип | Описание |
|---|---|---|
| `width` | `Number` | Ширина слайдера в пикселях. |
| `cacheable` | `Boolean` | Если `true`, содержимое слайдера будет кешироваться. По умолчанию `true`. |
| `allowChangeHistory` | `Boolean` | Если `true`, URL слайдера будет добавлен в историю браузера. Позволяет навигацию по кнопкам "назад/вперед". |
| `events` | `Object` | Объект с обработчиками событий слайдера (`onOpen`, `onClose`, `onLoad`, `onDestroy`). |
| `label` | `Object` | Позволяет добавить кастомную метку в шапку слайдера. Например: `{text: 'My Label', color: '#ff0000'}`. |
| `contentCallback` | `Function` | Функция, которая возвращает `Promise` или HTML-элемент для отображения в слайдере вместо загрузки URL. |
| `requestMethod` | `String` | Метод запроса для загрузки контента (`'get'` или `'post'`). По умолчанию `'get'`. |
| `requestParams` | `Object` | Параметры, которые будут отправлены с запросом (при `requestMethod: 'post'`). |

## События слайдера (`events`)

| Событие | Описание |
|---|---|
| `onOpenStart` | Вызывается перед началом анимации открытия. |
| `onOpenComplete` | Вызывается после завершения анимации открытия. |
| `onLoad` | Вызывается после полной загрузки контента в слайдере. |
| `onCloseStart` | Вызывается перед началом анимации закрытия. |
| `onCloseComplete` | Вызывается после полного закрытия слайдера. |
| `onDestroy` | Вызывается при уничтожении экземпляра слайдера. |

## Примеры использования

### Открытие простого слайдера

```javascript
import { SidePanel } from 'main.sidepanel';

SidePanel.Instance.open("/tasks/task/view/1/", {
    width: 1000,
    allowChangeHistory: false
});
```

### Слайдер с обратным вызовом при закрытии

```javascript
import { SidePanel } from 'main.sidepanel';

SidePanel.Instance.open("/crm/deal/details/1/", {
    events: {
        onClose: function(event) {
            console.log("Deal slider has been closed.");
            // Можно перезагрузить страницу или обновить данные
            // window.location.reload();
        }
    }
});
```

### Использование `contentCallback` для кастомного контента

```javascript
import { SidePanel } from 'main.sidepanel';

SidePanel.Instance.open("my-custom-slider", {
    contentCallback: function(slider) {
        return new Promise(function(resolve, reject) {
            const element = document.createElement('div');
            element.innerHTML = "<h2>Hello from SidePanel!</h2>";
            resolve(element);
        });
    }
});
```

## Экспортируемые модули

- `SidePanel` — Основной объект с доступом к `Instance`.
- `Slider` — Класс, представляющий отдельный слайдер.
- `SliderManager` — Класс менеджера слайдеров (синглтон).
- `Toolbar` — Класс панели инструментов для свернутых слайдеров.
- `MessageEvent` — Класс события для `postMessage`.
- `SliderEvent` — Базовый класс событий слайдера.
- `Label` — Класс для управления метками в шапке.
- `Dictionary` — Утилита для хранения данных.
- `...Options` — TypeScript-типы для опций.
