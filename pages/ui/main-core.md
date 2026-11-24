---
title: JS-ядро main.core и события
description: 'JS-ядро main.core: разметка Tag.render и экранирование, Dom, Type, Text, Loc, Runtime.loadExtension, Runtime.extractAssets, BX.ready, BX.ajax.runAction, HTTP-клиент HttpClient, события EventEmitter и BaseEvent из main.core.events.'
---

Расширение `main.core` — JavaScript-ядро Bitrix Framework. Его классы используют все расширения раздела. Класс `Tag` собирает разметку, `Dom` меняет элементы, `Type` и `Text` проверяют и преобразуют значения, `Loc` возвращает языковые фразы, `Runtime` загружает расширения по требованию, `HttpClient` отправляет запросы к серверу. Классы событий `EventEmitter` и `BaseEvent` импортируют из `main.core.events`.

У каждого класса ядра больше методов. Ниже — только те, которые встречаются в примерах раздела.

## Подключить ядро

Расширения раздела зависят от `main.core`, поэтому ядро загружается вместе с ними. Сборщик по умолчанию добавляет `main.core` в зависимости расширения. Как настроить зависимости, описано в статье [Расширения](../framework/extensions.md).

Если страница использует только ядро, загрузите его из PHP.

```php
\Bitrix\Main\UI\Extension::load('main.core');
```

В модульном JavaScript импортируйте классы из `main.core`, а классы событий — из `main.core.events`.

```js
import { Tag, Dom, Type, Text, Loc, Runtime, Event } from 'main.core';
import { EventEmitter, BaseEvent } from 'main.core.events';
```

Вне модульного JavaScript те же классы доступны через глобальный объект `BX` под именами `BX.Tag`, `BX.Dom`, `BX.Type`, `BX.Text`, `BX.Loc` и `BX.Runtime`. Классы событий входят в ядро и доступны как `BX.Event.EventEmitter` и `BX.Event.BaseEvent`.

Класс `Event` из `main.core` — это `BX.Event`. Он содержит методы для DOM-событий. Импорт `Event` перекрывает в модуле стандартный конструктор `Event` браузера. Чтобы создать DOM-событие, используйте `window.Event`.

Методы `Event` для DOM-событий:

-  `Event.bind(element, eventName, handler)` — подписывает обработчик на DOM-событие. Если вместо элемента передан `null`, метод ничего не делает.

-  `Event.unbind(element, eventName, handler)` — снимает обработчик, подписанный через `bind()`.

-  `Event.bindOnce(element, eventName, handler)` — подписывает обработчик на одно срабатывание. Такой обработчик нельзя снять через `unbind()`, потому что метод подписывает не саму функцию, а обертку.

## Выполнить код после загрузки страницы

Метод `Event.ready(handler)` вызывает функцию после события `DOMContentLoaded`, когда DOM страницы построен. Если событие уже произошло, метод вызывает функцию сразу. Во встроенных скриптах страницы тот же метод доступен как `BX.ready()`.

**Пример.** Скрипт страницы ищет контейнер только после того, как DOM построен.

```html
<div id="units"></div>

<script>
BX.ready(() => {
    const container = document.getElementById('units');
    container.textContent = 'Единицы измерения загружены';
});
</script>
```

Метод не ждет загрузки картинок и стилей. Если код зависит от размеров элементов, которые меняют картинки, дождитесь события `load` окна.

## Собрать разметку

Метод `Tag.render` — тег шаблонной строки, который превращает HTML в DOM-узлы. Он возвращает элемент, если в шаблоне один корневой тег, и массив узлов, если корневых тегов несколько.

**Пример.** Код собирает карточку статуса документа из шаблона и подписывает кнопку внутри нее на клик.

```js
import { Tag, Text } from 'main.core';

const statusName = 'На согласовании';

const card = Tag.render`
    <div class="document-status">
        <span class="document-status__name">${Text.encode(statusName)}</span>
        <button type="button" onclick="${() => console.log('Статус открыт')}">Открыть</button>
    </div>
`;

document.getElementById('status').append(card);
```

Метод `Tag.render` обрабатывает подстановки `${...}` по-разному в зависимости от типа значения и места в шаблоне.

| Подстановка | Что делает `Tag.render` |
|---|---|
| Строка или число в тексте шаблона | Вставляет значение как HTML-разметку, без экранирования |
| Строка или число в значении атрибута в кавычках | Записывает значение в атрибут методом `setAttribute()`. Значение не может добавить в разметку новые элементы. Без кавычек вокруг значения метод вставляет строку в HTML как есть |
| DOM-узел или массив узлов | Вставляет узлы на место подстановки |
| Функция в атрибуте, который начинается с `on` | Подписывает функцию на событие, например `onclick` — на `click`. Атрибут, который заканчивается на `once`, например `onclickonce`, подписывает функцию на одно срабатывание |

{% note warning "" %}

Строку в тексте шаблона `Tag.render` не экранирует. Пользовательские данные пропускайте через `Text.encode()` или собирайте строку тегом `Tag.safe`, иначе HTML из данных попадет на страницу. Не подставляйте строки в атрибуты `on*`, потому что строка станет встроенным обработчиком и выполнится как код. Подробнее о таких уязвимостях — в статье [XSS](../security/xss.md).

{% endnote %}

Метод `Tag.safe` — тег шаблонной строки, который экранирует все подстановки методом `Text.encode()` и возвращает строку, а не DOM-узел.

### Получить ссылки на вложенные элементы

Атрибут `ref` помечает элемент внутри шаблона. Если в шаблоне есть хотя бы один `ref`, метод `Tag.render` возвращает объект. Поле `root` содержит корневой элемент, а если корневых элементов несколько, — их массив. Поля с именами из `ref` содержат помеченные элементы.

**Пример.** Шаблон возвращает корневой элемент и поле ввода, чтобы код мог поставить в него фокус.

```js
import { Tag } from 'main.core';

const { root, input } = Tag.render`
    <div class="unit-form">
        <input ref="input" type="text" placeholder="Единица измерения">
    </div>
`;

document.getElementById('form').append(root);
input.focus();
```

## Изменить элементы страницы

Класс `Dom` добавляет, удаляет и заменяет элементы, меняет их классы, стили и атрибуты. Методы проверяют, что получили элемент. Если передан `null`, например результат неудачного поиска, вызов `Dom.append()` или `Dom.addClass()` ничего не делает и не выбрасывает ошибку. Основные методы:

-  `Dom.append(child, parent)`, `Dom.prepend(child, parent)` — добавляют элемент в конец или начало родителя.

-  `Dom.insertBefore(element, target)`, `Dom.insertAfter(element, target)` — вставляют элемент перед или после другого элемента.

-  `Dom.remove(element)`, `Dom.replace(oldElement, newElement)`, `Dom.clean(element)` — удаляют элемент, заменяют его или очищают содержимое.

-  `Dom.addClass(element, className)`, `Dom.removeClass()`, `Dom.toggleClass()`, `Dom.hasClass()` — работают с CSS-классами. Каждый из четырех методов принимает один класс, строку классов через пробел или массив классов. Метод `hasClass()` возвращает `true`, только если у элемента есть все переданные классы.

-  `Dom.style(element, property, value)` — задает или читает CSS-свойство. Вместо пары имени и значения можно передать объект свойств.

-  `Dom.attr(element, name, value)` — задает или читает атрибут. Вместо пары имени и значения можно передать объект атрибутов.

-  `Dom.show(element)`, `Dom.hide(element)`, `Dom.isShown(element)` — снимают и устанавливают атрибут `hidden` и проверяют его. Если CSS-класс задает элементу свойство `display`, метод `hide()` элемент не скроет.

**Пример.** Код снимает выделение со всех строк списка, а строке `selectedRow` добавляет класс `--selected` и атрибут `aria-selected`.

```js
import { Dom } from 'main.core';

document.querySelectorAll('.unit-row').forEach((row) => {
    Dom.removeClass(row, '--selected');
});

// selectedRow — элемент строки, которую выбрал пользователь
Dom.addClass(selectedRow, '--selected');
Dom.attr(selectedRow, 'aria-selected', 'true');
```

## Проверить и преобразовать значения

Методы класса `Type` определяют тип данных и возвращают `true` или `false`. Методы `isString()`, `isBoolean()`, `isFunction()` и `isArray()` проверяют тип, который указан в имени метода. Метод `isNumber()` возвращает `false` для `NaN`, а `isInteger()` — для дробного числа. Другие методы класса `Type`:

-  `Type.isStringFilled(value)` — возвращает `true` для непустой строки.

-  `Type.isArrayFilled(value)` — возвращает `true` для массива хотя бы с одним элементом.

-  `Type.isNil(value)` — возвращает `true` для `null` и `undefined`.

-  `Type.isPlainObject(value)` — возвращает `true` для объекта-литерала, но не для массива и не для экземпляра класса.

-  `Type.isDomNode(value)` — возвращает `true` для любого узла DOM, в том числе текстового.

-  `Type.isElementNode(value)` — возвращает `true` только для узла-элемента, например `div` или `input`. Методы `Dom.addClass()`, `Dom.removeClass()`, `Dom.toggleClass()` и `Dom.hasClass()` проверяют аргумент этим методом.

Класс `Text` преобразует строки и значения.

-  `Text.encode(value)` — заменяет символы `&`, `<`, `>`, `'` и `"` на их HTML-коды, например `&lt;`. Нестроковое значение возвращает без изменений.

-  `Text.decode(value)` — выполняет обратное преобразование.

-  `Text.toNumber(value)`, `Text.toInteger(value)`, `Text.toBoolean(value)` — приводят значение к числу, целому числу или логическому значению.

-  `Text.toCamelCase(value)`, `Text.toPascalCase(value)`, `Text.toKebabCase(value)` — меняют стиль записи строки.

-  `Text.getRandom(length)` — возвращает случайную строку указанной длины, по умолчанию из восьми символов.

## Получить языковую фразу

Метод `Loc.getMessage(code, replacements)` возвращает фразу по коду из языковых сообщений, которые загружены на страницу. Во втором аргументе передайте объект замен. Метод заменяет каждое вхождение ключа значением и ищет ключ без учета регистра.

**Пример.** Фраза с кодом `MY_UNITS_COUNT` содержит метку `#COUNT#`, и метод подставляет в нее число.

```js
import { Loc } from 'main.core';

const title = Loc.getMessage('MY_UNITS_COUNT', {
    '#COUNT#': 12,
});
```

Если фразы с таким кодом нет, метод возвращает пустую строку и при включенной отладке выводит сообщение в консоль.

Другие методы класса `Loc`:

-  `Loc.hasMessage(code)` — проверяет, загружена ли фраза. Вызывайте его до `getMessage()`. После промаха метод `getMessage()` записывает под этим кодом пустую строку, и `hasMessage()` вернет `true`.

-  `Loc.setMessage(code, value)` — добавляет фразу на страницу.

Во встроенных скриптах тот же набор фраз доступен через функцию `BX.message()`. Вызов `BX.message('CODE')` возвращает фразу без замен, а `BX.message({ CODE: 'текст' })` добавляет фразы. Откуда фразы попадают на страницу и как их подключить к расширению, описано в статье [Локализация](../advanced/localization.md).

## Загрузить расширение по требованию {#zagruzit-rasshirenie-po-trebovaniyu}

Метод `Runtime.loadExtension(...names)` подключает расширения в момент вызова, например по клику. Метод возвращает `Promise` с объектом экспортов загруженных расширений. Метод не запрашивает повторно расширения, которые уже загружены. Если расширение не загрузилось, метод трижды повторяет запрос и затем отклоняет `Promise` с ошибкой. До перезагрузки страницы повторный вызов для того же расширения возвращает ту же ошибку и запрос не отправляет.

**Пример.** Код загружает расширение `ui.dialogs.messagebox` и показывает окно подтверждения только при клике по кнопке удаления.

```js
import { Runtime } from 'main.core';

document.getElementById('delete-unit').addEventListener('click', () => {
    Runtime.loadExtension('ui.dialogs.messagebox').then(({ MessageBox }) => {
        MessageBox.confirm('Удалить единицу измерения?');
    });
});
```

Класс `Runtime` содержит и вспомогательные функции:

-  `Runtime.debounce(fn, wait)` — возвращает функцию, которая вызывает `fn` только после паузы в `wait` миллисекунд,

-  `Runtime.throttle(fn, wait)` — возвращает функцию, которая вызывает `fn` не чаще одного раза за `wait` миллисекунд,

-  `Runtime.clone(value)` — возвращает глубокую копию значения,

-  `Runtime.merge(...targets)` — объединяет объекты с учетом вложенности.

## Извлечь скрипты и стили из HTML {#extract-assets}

Метод `Runtime.extractAssets(html, options)` разбирает HTML-код и отделяет от разметки скрипты и стили. Метод нужен, когда HTML приходит с сервера, например из ответа действия контроллера, и скрипты нужно подключить отдельно. Метод доступен с версии `main` 26.1000.0.

Метод возвращает объект с полями:

-  `html` — разметка без тегов `<script>` и `<link rel="stylesheet">`,

-  `scripts` — массив скриптов. У внешнего скрипта поля `isInternal: false`, `src`, `runFirst` и `type`, у встроенного — `isInternal: true`, `text`, `runFirst` и `type`,

-  `styles` — массив стилей с полями `href` и `media`,

-  `registrations` — расширения, которые зарегистрированы в блоках `<script type="extension/registered">`. Ключ — имя расширения, значение — пространство имен.

Объект `options` принимает два ключа:

-  `runFirst` — если `true`, все скрипты получают признак `runFirst: true`,

-  `templateTypes` — типы тегов `<script>`, которые остаются в разметке. По умолчанию это `text/html`, `text/template`, `extension/settings` и `importmap`.

Если передать пустую строку или не строку, метод вернет пустой результат.

{% note warning "" %}

Метод не выполняет скрипты, не загружает стили и не очищает разметку от опасного кода. Подключать скрипты и стили должен вызывающий код. Метод разбирает HTML как текст. Тег `<script>` внутри значения атрибута он тоже извлечет как скрипт, поэтому передавайте в метод только HTML из доверенного источника.

{% endnote %}

**Пример.** Код вставляет в контейнер разметку из HTML-блока, подключает его стили и внешние скрипты.

```js
import { Runtime } from 'main.core';

// responseHtml — HTML-блок, который вернул сервер
const { html, scripts, styles } = Runtime.extractAssets(responseHtml);

document.getElementById('unit-card').innerHTML = html;

BX.loadCSS(styles.map((style) => style.href));

scripts
    .filter((script) => !script.isInternal)
    .forEach((script) => BX.loadScript(script.src));
```

Функция `BX.processHTML` устарела, теперь она работает через `Runtime.extractAssets`. В новом коде используйте `Runtime.extractAssets`.

## Вызвать действие контроллера {#vyzvat-dejstvie-kontrollera}

Функция `BX.ajax.runAction(action, config)` отправляет AJAX-запрос к действию контроллера модуля. Параметры действия передайте в ключе `data` объекта `config`. Функция возвращает объект `BX.Promise` с методами `then()` и `catch()`. Метода `finally()` у него нет. Как создать контроллер, передать параметры и обработать ответ, описано в статье [Контроллеры](../framework/controllers.md).

{% note info "" %}

С версии `main` 26.900.0 класс `BX.Promise` устарел. В своем коде используйте нативный `Promise`. Для нового кода есть клиент [HttpClient](#http-client), его методы возвращают нативный `Promise`.

{% endnote %}

Если действие вернуло ошибку или запрос не дошел до сервера, функция отклоняет результат. Обработчик `catch()` получает ответ с полем `errors` — массивом объектов с полями `message`, `code` и `customData`. При сетевой ошибке массив содержит одну ошибку с кодом `NETWORK_ERROR`.

**Пример.** Запрос вызывает действие `list` контроллера `Unit` модуля `my.module`. При ошибке код выводит тексты ошибок в элемент с идентификатором `unit-errors`.

```js
const errorNode = document.getElementById('unit-errors');

// renderUnits — функция страницы, которая выводит список единиц измерения
BX.ajax.runAction('my:module.Unit.list', {
    data: {
        status: 'active',
    },
}).then((response) => {
    renderUnits(response.data);
}).catch((response) => {
    const errors = response.errors || [];
    errorNode.textContent = errors.map((error) => error.message).join('\n');
});
```

## Отправить запрос через HttpClient {#http-client}

Класс `HttpClient` — HTTP-клиент ядра на основе `fetch`. Он заменяет `BX.ajax` в новом коде: вызывает действия контроллеров и отправляет произвольные HTTP-запросы. Методы класса возвращают нативный `Promise`. Класс доступен с версии `main` 26.900.0. Функции `BX.ajax` продолжают работать.

Класс входит в ядро, отдельно подключать его не нужно. В модульном JavaScript импортируйте его из `main.core`, во встроенных скриптах используйте `BX.HttpClient`.

```js
import { HttpClient } from 'main.core';
```

### Вызвать действие контроллера через HttpClient

Метод `HttpClient.action(action, options)` вызывает действие контроллера и возвращает содержимое поля `data` ответа. Параметры действия передайте в ключе `data` объекта `options`. Метод `HttpClient.actionRaw(action, options)` возвращает весь ответ контроллера с полями `status`, `data` и `errors`.

Объект `options` принимает те же ключи, что и `BX.ajax.runAction`: `data`, `json`, `navigation`, `analytics`. Вместо `getParameters` передайте `query`. Еще можно задать `method`, по умолчанию `POST`, а также `headers`, `timeout` в миллисекундах и `signal` для отмены запроса.

Если действие вернуло ошибку, метод отклоняет `Promise` с ошибкой `HttpClient.ControllerError`. Массив ошибок контроллера лежит в поле `errors` ошибки, у каждого элемента есть поля `code`, `message` и `customData`. При сбое сети метод отклоняет `Promise` с ошибкой `HttpClient.NetworkError`, при таймауте — с `HttpClient.TimeoutError`.

**Пример.** Код вызывает действие `list` контроллера `Unit` модуля `my.module` и выводит тексты ошибок, если действие вернуло ошибку.

```js
import { HttpClient } from 'main.core';

const errorNode = document.getElementById('unit-errors');

try
{
    // renderUnits — функция страницы, которая выводит список единиц измерения
    const units = await HttpClient.action('my:module.Unit.list', {
        data: {
            status: 'active',
        },
    });
    renderUnits(units);
}
catch (error)
{
    if (error instanceof HttpClient.ControllerError)
    {
        errorNode.textContent = error.errors.map((item) => item.message).join('\n');
    }
    else
    {
        throw error;
    }
}
```

### Отправить произвольный запрос

Методы `get(url, config)`, `delete(url, config)`, `head(url, config)`, `post(url, body, config)`, `put(url, body, config)` и `patch(url, body, config)` отправляют HTTP-запрос по адресу. Их можно вызвать у класса или у экземпляра. Конструктор `new HttpClient(options)` задает настройки экземпляра, например `baseUrl`, `headers`, `timeout` и `query`.

Методы возвращают ответ с полями `status`, `ok`, `headers`, `data`, `raw` и `retryCount`. По умолчанию клиент разбирает тело ответа как JSON и кладет результат в `data`. Если сервер ответил кодом не из диапазона 2xx, метод отклоняет `Promise` с ошибкой `HttpClient.HttpError`.

**Пример.** Код запрашивает вторую страницу списка и выводит число элементов.

```js
import { HttpClient } from 'main.core';

const client = new HttpClient({ baseUrl: '/local/api/', timeout: 5000 });

const { status, data } = await client.get('units', { query: { page: 2 } });
if (status === 200 && data !== null)
{
    console.log(data.items.length);
}
```

## Работать с событиями {#rabotat-s-sobytiyami}

Расширения раздела вызывают события при своих действиях. За события отвечают классы `EventEmitter` и `BaseEvent` из `main.core.events`.

### Подписаться на событие

Метод `subscribe(eventName, handler)` подписывает обработчик на событие экземпляра. Обработчик получает объект `BaseEvent`. Методы этого объекта:

-  `getData()` — возвращает данные события.

-  `getTarget()` — возвращает объект, который вызвал событие.

-  `getType()` — возвращает полное имя события в нижнем регистре.

-  `preventDefault()` — помечает действие по умолчанию как отмененное. Объект, который вызвал событие, проверяет пометку методом `isDefaultPrevented()`. Отменяется ли действие, зависит от расширения. Смотрите описание события в статье расширения.

**Пример.** Обработчик реагирует на выбор значения в списке `ui.select`.

```js
// Список select — экземпляр Select из ui.select
select.subscribe('update', (event) => {
    console.log('Выбрано значение', event.getData());
});
```

Метод `unsubscribe(eventName, handler)` отписывает обработчик. Передайте в него ту же функцию, что и в `subscribe()`. Метод `subscribeOnce(eventName, handler)` подписывает обработчик на одно срабатывание.

Часть классов принимает обработчики в опции `events` конструктора. В опцию передайте объект. Ключ объекта — имя события, значение — функция-обработчик. Класс передает этот объект методу `subscribeFromOptions()`, и тот подписывает каждый обработчик на событие с именем ключа. Поддерживает ли класс опцию `events`, указано в статье расширения.

**Пример.** Окно `Popup` из `main.popup` получает обработчики событий `onShow` и `onClose` в конструкторе.

```js
import { Popup } from 'main.popup';

const popup = new Popup({
    id: 'unit-popup',
    content: 'Единица измерения сохранена.',
    events: {
        onShow: () => {
            console.log('Окно открыто');
        },
        onClose: () => {
            console.log('Окно закрыто');
        },
    },
});

popup.show();
```

### Подписаться на события всех экземпляров

У каждого класса, который вызывает события, есть пространство имен, например `BX.UI.Select`. Полное имя события состоит из пространства имен и имени через двоеточие, у события `update` это `BX.UI.Select:update`. Статический метод `EventEmitter.subscribe(fullName, handler)` подписывает обработчик на событие всех экземпляров класса на странице.

**Пример.** Глобальный обработчик срабатывает при выборе в любом списке `ui.select` и получает сам список методом `getTarget()`.

```js
import { EventEmitter } from 'main.core.events';

EventEmitter.subscribe('BX.UI.Select:update', (event) => {
    const select = event.getTarget();
    console.log(select.getValue());
});
```

Имена событий не зависят от регистра, поэтому `BX.UI.Select:update` и `bx.ui.select:update` — одно и то же событие. Событие `update` и другие события списка описаны в статье [Выпадающий список ui.select](./ui-select.md).

Статический метод `EventEmitter.unsubscribe(fullName, handler)` снимает глобальную подписку. Передайте то же полное имя и ту же функцию.

### Вызвать свое событие

Чтобы класс вызывал события, унаследуйте его от `EventEmitter` и задайте пространство имен методом `setEventNamespace()` в конструкторе. Метод `emit(eventName, event)` вызывает событие. Во втором аргументе передайте `BaseEvent` или объект данных. Метод оборачивает объект данных в `BaseEvent`.

**Пример.** Класс списка единиц измерения вызывает событие `onSelect` и передает выбранную единицу. Обработчик может отменить выбор методом `preventDefault()`.

```js
import { EventEmitter, BaseEvent } from 'main.core.events';

export class UnitList extends EventEmitter
{
    constructor()
    {
        super();
        this.setEventNamespace('My.Module.UnitList');
    }

    select(unit)
    {
        const event = new BaseEvent({ data: { unit } });
        this.emit('onSelect', event);

        if (event.isDefaultPrevented())
        {
            return;
        }

        this.selectedUnit = unit;
    }
}

const list = new UnitList();
list.subscribe('onSelect', (event) => {
    if (event.getData().unit === 'pcs')
    {
        event.preventDefault();
    }
});
```

Метод `emitAsync(eventName, event)` вызывает событие и возвращает `Promise` с массивом результатов обработчиков. Объект `Promise` выполняется, когда выполнятся все `Promise`, которые вернули обработчики, и отклоняется, если отклонен хотя бы один из них. Используйте метод, если класс должен дождаться результата асинхронных обработчиков.

### Подписки через BX.addCustomEvent

В существующем коде встречаются подписки через `BX.addCustomEvent()` и вызовы через `BX.onCustomEvent()`. Они работают поверх того же механизма событий. Обработчик, подписанный через `BX.addCustomEvent()`, получает не `BaseEvent`, а набор аргументов, который задал класс-источник для совместимости. Если источник такой набор не задал, обработчик получает `BaseEvent` единственным аргументом. Пример таких событий и их старых имен — в статье [Всплывающие окна и меню main.popup](./main-popup.md#podpisatsya-na-sobytie-po-staromu-imeni).

## Связанные материалы

-  [Расширения](../framework/extensions.md)

-  [Контроллеры](../framework/controllers.md)

-  [Локализация](../advanced/localization.md)

-  [Vue.js](../advanced/vue.md)
