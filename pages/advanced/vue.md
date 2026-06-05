---
title: Vue.js
description: 'Vue.js. Продвинутые возможности Bitrix Framework: инструменты, сценарии и практические рекомендации.'
---

Vue.js — это JavaScript-фреймворк для создания пользовательских интерфейсов. Он предназначен для разработки динамических веб-приложений. В основе фреймворка — реактивность и компонентный подход.

Bitrix Framework предоставляет специальное расширение библиотеки Vue.js — BitrixVue.

## Расширение BitrixVue

BitrixVue 3 —  расширение библиотеки Vue.js 3. Оно полностью совместимо с оригинальным Vue 3 и добавляет инструменты для работы с Bitrix Framework. Возможности BitrixVue 3 доступны с версии модуля ui 22.100.0.

{% note warning "" %}

Vue 2 устарел и больше не поддерживается. Используйте BitrixVue 3.

-  [Переход с BitrixVue 2 на BitrixVue 3](https://dev.1c-bitrix.ru/learning/course/index.php?COURSE_ID=176&CHAPTER_ID=024460)

-  [BitrixVue 2](https://dev.1c-bitrix.ru/learning/course/index.php?COURSE_ID=176&CHAPTER_ID=024504)

{% endnote %}

-  **Интеграция с Bitrix Framework**. Позволяет легко работать с локализациями, событиями, Rest API и другими системными сервисами.

-  **Единая версия Vue**. Все модули и приложения в рамках Bitrix используют одну и ту же версию библиотеки без конфликтов.

-  **Возможность кастомизации**. Разработчики могут изменять встроенные компоненты и не затрагивать исходный код продукта.

-  **Изоляция**. Библиотека Vue из BitrixVue не попадает в глобальную область видимости `window.Vue`. Сторонние приложения могут безопасно использовать свою версию Vue.

{% note info "" %}

Решение не подходит для проектов, которые используют:

-  рендеринг на стороне сервера (SSR) — когда HTML генерируется сервером,

-  серверную компиляцию компонентов — например, работу с однофайловыми компонентами `.vue`, требующими сборки.

{% endnote %}

## Подсказки в IDE

Для автокомплита в модуле `UI` есть файл определений типов `ui.vue3.d.ts`.

```
/bitrix/modules/ui/install/js/ui/vue3/ui.vue3.d.ts
```

Файл содержит:

-  все методы для создания и управления приложением,

-  классы для интеграции с Bitrix Framework.

Если среда разработки не определит этот файл автоматически, добавьте его в проект вручную как внешнюю библиотеку.

## Подключить BitrixVue 3

BitrixVue 3 можно подключить двумя способами, в зависимости от того, работаете ли вы с расширениями extensions или пишете js-код прямо на PHP-странице.

**Extensions.** Предпочтительный способ организации JavaScript-кода в Bitrix Framework. Расширения позволяют использовать современный синтаксис ES6+ и модульную структуру. Система сборки `@bitrix/cli` автоматически транспилирует код для обеспечения браузерной совместимости, подключает необходимые зависимости и изолирует логику, предотвращая конфликты с другими расширениями.

{% note tip "" %}

Подробнее в статье [Расширения](./../framework/extensions.md)

{% endnote %}

```javascript
import {BitrixVue} from 'ui.vue3';

// Ваше приложение
BitrixVue.createApp({...}).mount('#application');
```

**На обычной PHP-странице.** Если вы не используете расширения и добавляете код прямо в шаблон или PHP-файл, BitrixVue доступен через глобальный объект `BX`.

1. Подключите расширение `ui.vue3` с помощью PHP-кода.

2. Используйте `BX.Vue3.BitrixVue` для создания приложения.

```php
<?php
\Bitrix\Main\UI\Extension::load("ui.vue3");
?>
<div id="application"></div>
<script type="text/javascript">
    BX.Vue3.BitrixVue.createApp({
        // опции компонента
        template: '<div>Hello World</div>'
    }).mount('#application');
</script>
```

## Создать Vue-приложение

Метод `BitrixVue.createApp(rootComponent, rootProps?)` создает экземпляр Vue-приложения.

-  `rootComponent` — объект, обязательный. Конфигурация корневого компонента: `data`, `methods`, `template` и так далее.

-  `rootProps` — объект. Входные данные `props` для корневого компонента. Доступен с версии модуля UI 22.300.0.

Метод возвращает экземпляр приложения. Смонтируйте его в DOM-элемент с помощью `.mount()`.

1. Добавьте в HTML контейнер для приложения.

   ```html
   <div id="my-app"></div>
   ```

2. Создайте и смонтируйте приложение.

   ```javascript
   import {BitrixVue} from 'ui.vue3';
   
   const app = BitrixVue.createApp({
       name: 'MyApp', // Имя для отладки в Vue DevTools
       data() {
           return { message: 'Hello from BitrixVue!' };
       },
       template: `
           <div>{{ message }}</div>
       `
   });
   
   app.mount('#my-app');
   ```

Можно передать начальные данные в корневой компонент через второй аргумент `rootProps`. Это полезно, когда нужно инициализировать приложение с данными из PHP.

```javascript
import {BitrixVue} from 'ui.vue3';

const app = BitrixVue.createApp({
    name: 'GreetingApp',
    props: ['userName'], // Объявляем входной параметр
    template: `<h1>Hello, {{ userName }}!</h1>`
}, {
    userName: 'Alex' // Передаем значение параметра
});

app.mount('#app');
```

## Структура приложения

В реальном проекте используйте контроллер — специальный класс для управления Vue-приложением. Он связывает страницу с компонентами. Контроллер хранит бизнес-логику и управляет жизненным циклом приложения. Компоненты отвечают только за отображение данных и обработку пользовательских действий.

1. Контроллер создает, монтирует и демонтирует Vue-приложение.

2. Компонент вызывает методы контроллера через `$Bitrix.Application`.

Пример контроллера:

```javascript
import {BitrixVue} from 'ui.vue3';
import {Dom, Loc} from 'main.core';
import {TaskManagerComponent} from './component/task-manager';

export class TaskManager {
    #application; // Приватное поле для экземпляра Vue

    constructor(rootNode) {
        this.rootNode = document.querySelector(rootNode);
    }

    // Запускает кнопку для активации Vue-приложения
    start() {
        const button = Dom.create('button', {
            text: Loc.getMessage('TASK_MANAGER_OPEN'),
            events: {
                click: () => this.attachTemplate()
            },
        });
        Dom.append(button, this.rootNode);
    }

    // Создает и монтирует Vue-приложение
    attachTemplate() {
        const context = this;

        this.#application = BitrixVue.createApp({
            name: 'TaskManager',
            components: {
                TaskManagerComponent
            },
            // В хуке beforeCreate используем $bitrix с маленькой b
            beforeCreate() {
                this.$bitrix.Application.set(context);
            },
            template: '<TaskManagerComponent/>'
        });

        this.#application.mount(this.rootNode);
    }

    // Демонтирует приложение
    detachTemplate() {
        if (this.#application) {
            this.#application.unmount();
        }
        this.start();
    }
}
```

{% note info "" %}

В хуке `beforeCreate` для доступа к интеграционным методам используется `this.$bitrix`, а не `this.$Bitrix`. Это особенность внутренней реализации.

{% endnote %}

Вызов методов контроллера в компоненте:

```javascript
export const TaskManagerComponent = {
    methods: {
        close() {
            // Получаем контроллер и вызываем его метод
            this.$Bitrix.Application.get().detachTemplate();
        }
    },
    template: `
        <div>
            <!-- ... интерфейс компонента ... -->
            <button @click="close">Close</button>
        </div>
    `
};
```

Подключение на PHP-странице:

```php
<?php
\Bitrix\Main\UI\Extension::load("local.taskmanager");
?>
<div id="app-container"></div>
<script>
    const manager = new BX.TaskManager('#app-container');
    manager.start();
</script>
```

## Компоненты

BitrixVue поддерживает два типа компонентов.

1. Классические компоненты Vue — на основе простых объектов без специальной обработки.

   ```javascript
   export const MyComponent = {
       template: '<div>Classic</div>'
   };
   ```

2. Мутабельные компоненты BitrixVue — специальный тип компонентов, который предназначен для кастомизации стандартных компонентов продукта без изменения исходного кода. Это позволяет разработчикам-партнерам адаптировать поведение и внешний вид встроенных компонентов под свои проекты.

   ```javascript
   import {BitrixVue} from 'ui.vue3';
   
   // Имя компонента должно быть в формате 'модуль-компонент'
   export const MyWidget = BitrixVue.mutableComponent('mymodule-widget', {
       name: 'MyWidget',
       data() {
           return { visible: true };
       },
       template: `<div v-if="visible">Стандартный виджет</div>`
   });
   ```

Выбор типа зависит от того, будете ли вы предоставлять доступ к мутации компонентов другим разработчикам. Если нет — выберите классические компоненты, если да — мутабельные.

### Порядок свойств в компоненте

В сообществе Vue используют [единый порядок свойств](https://vuejs.org/style-guide/rules-recommended.html#component-instance-options-order) в компонентах. Этот порядок помогает быстро понимать код.

Следуйте ему и в компонентах для BitrixVue 3: сначала объявляйте `props`, затем `data`, `computed`, методы и хуки. Так любой разработчик с первого взгляда поймет, какие данные принимает компонент и как работает.

### Пример классического компонента

Пример показывает классический Vue-компонент. Он использует:

-  локальные события  `emits`,

-  глобальные события `$Bitrix.eventEmitter`,

-  локализацию `$Bitrix.Loc.getMessage`.

```javascript
import {BitrixVue} from 'ui.vue3';

export const MyComponent = {
    
    emits: ['buttonClicked'], // Локальные события Vue

    props: {
        title: String
    },

    data() {
        return {
            count: 0
        };
    },

    created() {
        // Подписка на глобальное событие Bitrix
        this.$Bitrix.eventEmitter.subscribe('mymodule:mycomponent:action', this.handleGlobalAction);
    },

    beforeUnmount() {
        // Важно отписаться при удалении компонента
        this.$Bitrix.eventEmitter.unsubscribe('mymodule:mycomponent:action', this.handleGlobalAction);
    },

    methods: {
        handleGlobalAction(event) {
            const data = event.getData();
            console.log('Global action:', data);
        },
        onClick() {
            this.count++;
            this.$emit('buttonClicked', this.count);
        }
    },

    // language=Vue — директива для подсветки синтаксиса в PhpStorm
    template: `
        <div>
            <h3>{{ title }}</h3>
            <p>Локальная фраза: {{ $Bitrix.Loc.getMessage('MYMODULE_HELLO') }}</p>
            <p>Значение счетчика: {{ count }}</p>
            <button @click="onClick">Нажать</button>
        </div>
    `
};
```

### Мутация компонента

Поведение существующего мутабельного компонента можно изменить методом  `BitrixVue.mutateComponent`.

```javascript
BitrixVue.mutateComponent(source, mutations): boolean
```

-  `source` — имя компонента или ссылка на объект компонента. Для названий используйте формат `модуль-компонент` в `kebab-case`, например, `ui-hint`, `timeman-schedule`.

-  `mutations` — объект с изменениями: новые методы, вычисляемые свойства, шаблон.

Метод возвращает `true` если мутация зарегистрирована или `false` если пытаетесь мутировать обычный Vue-компонент.

Мутацию можно зарегистрировать до или после создания компонента, но она применится только перед первым рендерингом.

```javascript
import {BitrixVue} from 'ui.vue3';

// Мутируем компонент 'ui-alert' - меняем цвет текста на красный
BitrixVue.mutateComponent('ui-alert', {
    template: `
        <div style="color: red; padding: 10px;">
            Внимание: важное сообщение!
        </div>
    `
});
```

#### Плейсхолдеры для шаблонов

Чтобы расширить, а не заменить исходный шаблон, используйте плейсхолдер `#PARENT_TEMPLATE#`.

```javascript
// Добавим красную рамку вокруг оригинального содержимого компонента 'ui-digits'
BitrixVue.mutateComponent('ui-digits', {
    template: `
        <div style="border: 1px solid red;">
            #PARENT_TEMPLATE#
        </div>
    `
});
```

#### Доступ к исходным методам и свойствам

При мутации можно обратиться к оригинальной логике компонента через префикс `parent`. Первую букву из названия свойства или метода после префикса нужно перевести в верхний регистр.

```javascript
BitrixVue.mutateComponent('ui-example', {
    methods: {
        // Расширяем оригинальный метод sendText
        sendText(text) {
            const modifiedText = `[${text}]`;
            // Вызываем оригинальный метод с новым текстом
            this.parentSendText(modifiedText);
        }
    }
});
```

#### Мутация свойств props и watch

Свойство `props` может быть массивом или объектом. Если типы не совпали, BitrixVue сконвертирует `props` в объект.

В `watch` используйте префикс `parentWatch`, а не `parent`. Это правило помогает BitrixVue избежать путаницы между наблюдением за изменением свойства `watch` и другими мутациями.

```javascript
watch: {
    counter(current, previous)
    {
        this.parentWatchCounter(current, previous);

        if (current === 10)
        {
            this.watcherText = `Watcher detects change counter ${current}`;
        }
    }
}
```

#### Полная замена свойств

Если нужно не расширить, а полностью заменить свойство, используйте префикс `replace`. Свойство после префикса нужно указать с заглавной буквы, например, `replaceMixins`.

```javascript
BitrixVue.mutateComponent('ui-example', {
    replaceMixins: [ newMixin ] // Полностью заменит свойство mixins родителя
});
```

Префикс поддерживают свойства `mixins`, `inject`, `emits`.

### Клонирование компонентов

Клонирование создает новый компонент на основе существующего с внесенными изменениями. В отличие от мутации, клон — это отдельный компонент. Клонировать можно и BitrixVue, и обычные Vue-компоненты. В BitrixVue 3 клон всегда создается из оригинального компонента, даже если к оригиналу уже применили мутации.

Для клонирования используйте метод `BitrixVue.cloneComponent`.

```javascript
BitrixVue.cloneComponent(source, mutations): BitrixVueComponentProxy
```

-  `source` — имя, объект BitrixVue или обычный Vue-компонент.

-  `mutations` — объект с изменениями для клона.

{% note warning "" %}

BitrixVue старается соблюдать обратную совместимость мутабельных компонентов, но после обновлений продукта необходимо проверять, что ваши мутации работают корректно.

Если вы клонируете классические Vue-компоненты, обратная совместимость не гарантируется. Таким клонам требуется особое внимание при обновлениях.

{% endnote %}

```javascript
import {BitrixVue} from 'ui.vue3';
import {BaseComponent} from 'ui.original.component';

// Создаем клон с другим шаблоном
const MyClone = BitrixVue.cloneComponent(BaseComponent, {
    template: `<div>Клон! #PARENT_TEMPLATE#</div>`
});

// Используем клон как обычный компонент
BitrixVue.createApp({
    components: { MyClone },
    template: `<MyClone />`
}).mount('#app');
```

### Отложенная загрузка компонентов

Чтобы ускорить загрузку приложения, подключайте тяжелые компоненты по необходимости. Используйте метод `BitrixVue.defineAsyncComponent`.

```javascript
BitrixVue.defineAsyncComponent(extension, componentExportName, options?)
```

-  `extension` — имя Bitrix JS-расширения, где лежит компонент. Строка, обязательный параметр.

-  `componentExportName` — имя переменной, которую экспортирует это расширение. Строка, обязательный параметр.

-  `options` — объект, который описывает дополнительные опции.

   -  `loadingComponent` — компонент-заглушка на время загрузки.

   -  `errorComponent` — компонент для показа ошибки.

   -  `delay` — задержка перед показом заглушки в миллисекундах. По умолчанию — `200`.

   -  `timeout` — таймаут загрузки.

   -  `delayLoadExtension` — искусственная задержка загрузки для отладки.

```javascript
import {BitrixVue} from 'ui.vue3';

// Компоненты-заглушки
const Loader = { template: `<div>Загрузка...</div>` };
const Error = { template: `<div>Ошибка!</div>` };

const App = BitrixVue.createApp({
    components: {
        // Компонент загрузится только когда потребуется
        HeavyComponent: BitrixVue.defineAsyncComponent(
            'some.module.heavycomponent', // Расширение
            'HeavyComponent',             // Имя экспорта
            {
                loadingComponent: Loader,
                errorComponent: Error,
                delay: 200,
                timeout: 10000
            }
        )
    },
    data() {
        return { showHeavy: false };
    },
    template: `
        <button @click="showHeavy = true">Загрузить</button>
        <HeavyComponent v-if="showHeavy" />
    `
});
```

## Директивы

Директивы — это специальные атрибуты Vue, которые позволяют напрямую работать с DOM. Используйте их для простых задач, например, для установки фокуса или добавления поведения при наведении. Для сложного переиспользуемого интерфейса лучше подходят компоненты.

Локальную директиву можно определить как обычный объект с хуками жизненного цикла (например, `mounted`).

```javascript
export const focus = {
    // Элемент получит фокус после вставки в DOM
    mounted: (el) => el.focus()
};
```

Импортируйте директиву и зарегистрируйте ее в компоненте. Имя директивы в коде пишется в нижнем регистре — тогда в шаблоне можно будет использовать `v-focus` без дополнительного переименования.

```javascript
import {focus} from './directives/focus';

const Component = {
    directives: {
        focus // Регистрируем локальную директиву
    },
    template: `<input v-focus>` // Используем в шаблоне
}
```

{% note warning "" %}

Не используйте директивы автофокуса для элементов, которые появляются с анимацией. Браузер переместит фокус на невидимый элемент и нарушит анимацию.

{% endnote %}

Директивы, как и компоненты, нужно оформлять как [Bitrix Core.js Extension](./../framework/extensions.md). Размещайте их в папке `directives`. Файл директивы должен содержать JSDoc-комментарий с примером использования и экспортировать объект директивы.

```javascript
/**
 * Директива для автоматического фокуса на элементе.
 * @example <input v-focus>
 */
export const focus = {
    mounted: (el) => el.focus()
};
```

## Интеграция с Bitrix Framework

Все интеграционные методы Bitrix Framework доступны в компонентах через глобальную переменную `$Bitrix`. Это единая точка доступа к локализациям, событиям, данным и системным клиентам.

-  В шаблоне, computed, методах и хуках — используйте `this.$Bitrix`.

-  В хуке `beforeCreate` — используйте название переменной с маленькой буквы `this.$bitrix`. Это особенность внутренней реализации.

### Основные классы

-  `$Bitrix.Loc` — работа с языковыми фразами

-  `$Bitrix.eventEmitter` — события внутри приложения

-  `$Bitrix.Application` — связь с контроллером

-  `$`[`Bitrix.Data`](http://Bitrix.Data) — общие данные приложения

-  `$Bitrix.RestClient` — REST-клиент

-  `$Bitrix.PullClient` — Pull-клиент

### Локализация \$Bitrix.Loc

Используйте `$Bitrix.Loc.getMessage` для вывода языковых фраз.

```javascript
// В шаблоне
template: `<div>{{ $Bitrix.Loc.getMessage('GREETING') }}</div>`

// С заменой плейсхолдеров (реактивно)
template: `<div>{{ $Bitrix.Loc.getMessage('USER_COUNT', {'#COUNT#': userCount}) }}</div>`

// В компоненте
methods: {
    showMessage() {
        const text = this.$Bitrix.Loc.getMessage('SUCCESS');
        alert(text);
    }
}
```

Используйте `BitrixVue.getFilteredPhrases`, если компонент работает с большим количеством фраз.

```javascript
computed: {
    phrases() {
        return BitrixVue.getFilteredPhrases('MYMODULE_');
    }
},
template: `<div>{{ phrases.MYMODULE_HELLO }}</div>`
```

{% note tip "" %}

Подробнее в статье [Локализация](./localization.md#vue-js)

{% endnote %}

### События приложения \$Bitrix.eventEmitter

Обменивайтесь событиями между любыми компонентами одного приложения.

```javascript
// Отправка события
this.$Bitrix.eventEmitter.emit('module:component:action', { foo: 'bar' });

// Подписка на событие
created() {
    this.$Bitrix.eventEmitter.subscribe('module:component:action', this.handleAction);
},
beforeUnmount() {
    this.$Bitrix.eventEmitter.unsubscribe('module:component:action', this.handleAction);
},
methods: {
    handleAction(event) {
        const { foo } = event.getData();
        console.log('Получены данные:', foo);
    }
}
```

Формат имени события — `модуль:компонент:действие`. Например, `ui:button:click`.

### Контекст приложения \$Bitrix.Application

Связывайте компоненты с контроллером приложения.

-  `$Bitrix.Application.set` — метод сохраняет ссылку на контекст выполнения в контроллере.

```javascript
beforeCreate() {
    this.$bitrix.Application.set(myController);
}
```

-  `$Bitrix.Application.get` — метод получает ссылку на контекст выполнения в компоненте.

```javascript
methods: {
    close() {
        this.$Bitrix.Application.get().closeApp();
    }
}
```

### Общие данные \$Bitrix.Data

Класс сохраняет произвольные данные в контексте Vue-приложения и получает их из компонента любого уровня вложенности. Позволяет организовать взаимодействие между компонентами без сложной системы синхронизации.

{% note info "" %}

Класс \$Bitrix.Data не является заменой реактивным переменным из объектов `props` и `data`.

{% endnote %}

```javascript
// Сохранить данные
this.$Bitrix.Data.set('currentUser', { id: 1, name: 'Alex' });

// Получить данные
const user = this.$Bitrix.Data.get('currentUser');
const items = this.$Bitrix.Data.get('items', []); // Значение по умолчанию
```

### REST и Push-клиенты

Для внешних виджетов, например онлайн-форм или виджетов чата, которые работают за пределами продуктов Bitrix Framework, используйте классы `$Bitrix.RestClient` и `$Bitrix.PullClient`.

Во всех остальных случаях используйте стандартные импорты:

```javascript
import {rest as Rest} from 'rest.client';
import {PULL as Pull} from 'pull.client';
```

Классы `$Bitrix.RestClient` и `$Bitrix.PullClient` имеют одинаковый набор методов.

-  `.get()` — возвращает текущий клиент. Если клиент не установлен, возвращает `BX.rest` или `BX.PULL` соответственно, которые не подходят для внешних ресурсов.

-  `.set(instance)` — устанавливает кастомный клиент.

-  `.isCustom()` — возвращает `true`, если был установлен кастомный клиент.

Чтобы настроить клиенты, передайте их в хуке `beforeCreate`.

```javascript
beforeCreate() {
    this.$bitrix.RestClient.set(myRestClient);
    this.$bitrix.PullClient.set(myPullClient);
}
```

После настройки используйте клиенты в компонентах. Получите клиент методом `.get()` и работайте с ним.

```javascript
created() {
    const rest = this.$Bitrix.RestClient.get();
    rest.callMethod('user.get', { ID: 1 }).then(response => {
        console.log(response.data());
    });
    
    const pull = this.$Bitrix.PullClient.get();
    pull.subscribe({
        moduleId: 'im',
        command: 'message',
        callback: (params) => {
            console.log('Новое сообщение:', params.text);
        }
    });
}
```

Если нужно реагировать на смену клиента, подпишитесь на события.

```javascript
import {BitrixVue} from 'ui.vue3';

created() {
    this.$Bitrix.eventEmitter.subscribe(BitrixVue.events.restClientChange, () => {
        console.log('REST-клиент изменен');
    });
    this.$Bitrix.eventEmitter.subscribe(BitrixVue.events.pullClientChange, () => {
        console.log('Push-клиент изменен');
    });
}
```

## Работа с событиями в BitrixVue

В рамках приложений BitrixVue 3 можно работать с тремя уровнями событийной модели.

1. Уровень компонентов — стандартные события Vue. Используйте для связи между родителем и прямым потомком.

   ```javascript
   // Дочерний компонент
   this.$emit('update', data);
   
   // Родительский компонент
   <ChildComponent @update="handleUpdate" />
   ```

2. Уровень приложения — класс `$Bitrix.eventEmitter`. Используйте, чтобы не пробрасывать события через несколько уровней дерева компонентов.

   ```javascript
   // Отправка
   this.$Bitrix.eventEmitter.emit('module:component:action', data);
   
   // Подписка
   this.$Bitrix.eventEmitter.subscribe('module:component:action', handler);
   ```

3. Уровень сайта — глобальный `EventEmitter`. Используйте для связи между разными приложениями на странице.

   ```javascript
   import {EventEmitter} from 'main.core.events';
   
   // Отправка
   EventEmitter.emit('global:event', data);
   
   // Подписка
   EventEmitter.subscribe('global:event', handler);
   ```

## Роутинг для внешних сайтов VueRouter

Для создания одностраничных приложений (SPA) с маршрутизацией используйте [официальную библиотеку Vue Router](https://router.vuejs.org/introduction.html). Подключите расширение `ui.vue3.router`.

```javascript
import {BitrixVue} from 'ui.vue3';
import {createRouter, createWebHashHistory} from 'ui.vue3.router';

// 1. Определяем компоненты для маршрутов.
// В реальном проекте они будут импортированы из отдельных файлов.
const Foo = { template: '<div>Страница 1</div>' };
const Bar = { template: '<div>Страница 2</div>' };

// 2. Определяем маршруты.
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
];

// 3. Создаём экземпляр маршрутизатора.
const router = createRouter({
    history: createWebHashHistory(), // Используем хеш-режим для простоты
    routes,
});

// 4. Создаём корневой компонент приложения и подключаем роутер.
const application = BitrixVue.createApp({
    template: `
        <div>
            <h3>Моё SPA на Vue Router</h3>
            <div>
                <router-link to="/foo">Страница 1</router-link> |
                <router-link to="/bar">Страница 2</router-link>
            </div>
            <hr>
            <!-- Здесь будет отображаться компонент текущего маршрута -->
            <router-view></router-view>
        </div>
    `
});

application.use(router);
application.mount('#application');
```

Для кода без транспиляции используйте глобальный объект `BX.Vue3.VueRouter`.

## Централизованное хранение данных

В небольших приложениях данные можно хранить внутри компонентов. Когда приложение разрастается, управлять состоянием становится сложнее: данные дублируются, синхронизация требует передачи событий через цепочку компонентов.

Централизованное хранилище решает эту задачу. Компоненты получают доступ к общему состоянию и обновляются при его изменении. BitrixVue поддерживает два решения: [Pinia](https://pinia.vuejs.org/introduction.html) и [Vuex](https://vuex.vuejs.org/). Pinia — рекомендуемое хранилище с версии Vue 3.

### Pinia

Для работы с Pinia подключите расширение `ui.vue3.pinia`. Сначала создайте экземпляр хранилища с помощью `createPinia`. Затем определите само хранилище через `defineStore`, задав уникальное имя и описав состояние, геттеры и действия.

```javascript
import {BitrixVue} from 'ui.vue3';
import {createPinia, defineStore} from 'ui.vue3.pinia';

const pinia = createPinia();
const useCounterStore = defineStore('counter', {
    state: () => ({ count: 0 }),
    getters: { double: (state) => state.count * 2 },
    actions: { increment() { this.count++; } }
});
```

Подключите хранилище к приложению через `app.use(pinia)`. После этого компоненты могут использовать данные и методы хранилища. Для удобства применяйте вспомогательные функции `mapState` и `mapActions`.

```javascript
import {useCounterStore} from './stores/counter';
import {mapState, mapActions} from 'ui.vue3.pinia';

export default {
    computed: {
        ...mapState(useCounterStore, ['count', 'double'])
    },
    methods: {
        ...mapActions(useCounterStore, ['increment'])
    },
    template: `
        <div>{{ count }} x 2 = {{ double }}</div>
        <button @click="increment">+1</button>
    `
};
```

Имя хранилища в `defineStore` должно быть уникальным. Если несколько приложений используют одно и то же хранилище, они будут работать с общими данными.

### Vuex

Для работы с Vuex подключите расширение `ui.vue3.vuex`. Создайте хранилище с помощью `createStore`, определив состояние, мутации и действия.

```javascript
import {BitrixVue} from 'ui.vue3';
import {createStore} from 'ui.vue3.vuex';

const store = createStore({
    state: { count: 0 },
    mutations: { increment(state) { state.count++; } },
    actions: { increment(context) { context.commit('increment'); } }
});
```

Подключите хранилище к приложению через `app.use(store)`. В компонентах обращайтесь к хранилищу через `this.$store`.

```javascript
export default {
    computed: {
        count() { return this.$store.state.count; }
    },
    methods: {
        increment() { this.$store.dispatch('increment'); }
    },
    template: `
        <div>{{ count }}</div>
        <button @click="increment">+1</button>
    `
};
```

Для разбиения логики на модули используйте опцию `modules`. Каждый модуль должен иметь свойство `namespaced: true`.

```javascript
const moduleA = {
    namespaced: true,
    state: { ... },
    mutations: { ... }
};

const store = createStore({
    modules: { moduleA }
});
```

В компонентах вызывайте действия модуля с указанием его имени.

```javascript
methods: {
    update() {
        this.$store.dispatch('moduleA/someAction');
    }
}
```

## Интеграция с Dexie (IndexedDB)

Для работы с локальной базой данных IndexedDB в BitrixVue используйте расширение `ui.dexie`. Оно предоставляет интеграцию с библиотекой Dexie, начиная с версии модуля ui 22.500.0.

Подключите расширения `ui.dexie` и `ui.vue3`. Для реактивной работы с данными импортируйте `liveQuery` из `ui.dexie` и `useObservable` из `ui.vue3`.

Сначала создайте базу данных и определите схему. Затем используйте `liveQuery` для создания реактивного запроса. Функция `useObservable` превращает результат запроса в реактивные данные, которые Vue сможет автоматически обновлять.

```javascript
import {BitrixVue, useObservable} from 'ui.vue3';
import {Dexie, liveQuery} from 'ui.dexie';

// Создание и настройка базы данных
const db = new Dexie('vuedbsample');
db.version(1).stores({
    items: '++id, name' // Поле id автоинкрементное, поле name индексируется
});

const DBItems = {
    data() {
        return {
            db,
            // Реактивный запрос: выбираем элементы, имена которых начинаются на 'A'
            items: useObservable(
                liveQuery(() => 
                    db.items
                        .where('name')
                        .startsWithAnyOf('A', 'a')
                        .sortBy('id')
                )
            ),
        };
    },
    methods: {
        addItem() {
            const name = prompt('Укажите элемент, название которого начинается на букву "A":');
            if (name) {
                this.db.items.add({ name });
            }
        },
        clearItems() {
            this.db.items.clear();
        }
    },
    template: `
        <h2>Интеграция с Dexie (IndexedDB)</h2>
        <button @click="addItem">Добавить элемент</button>
        <button @click="clearItems">Очистить список</button>
        <ul>
            <li v-for="item in items" :key="item.id">
                {{ item.id }}, {{ item.name }}
            </li>
        </ul>
    `
};

const application = BitrixVue.createApp({
    components: { DBItems },
    template: `<DBItems/>`
});
application.mount('#application');
```

В этом примере список `items` реактивно связан с результатом запроса к IndexedDB. При добавлении или удалении элементов из базы данных интерфейс автоматически обновится.

Для работы в скриптах без транспиляции используйте глобальные пространства имен:

-  `BX.Dexie3` — для доступа к Dexie,

-  `BX.Vue3` — для доступа к функциям Vue.

## Teleport: Перемещение части шаблона

Компонент `<teleport>` позволяет отрисовать часть шаблона компонента в другом месте DOM-дерева, вне текущего Vue-приложения. Это полезно для создания модальных окон, всплывающих подсказок или уведомлений, которые должны быть отрисованы в `body` или другом корневом элементе.

Укажите целевой DOM-элемент через атрибут `to`. Используйте селектор, например, `#modal-container`. Для условного рендеринга применяйте атрибут `:disabled`.

```javascript
import {BitrixVue} from 'ui.vue3';

BitrixVue.createApp({
    data: () => ({
        showModal: false,
    }),
    template: `
        <div style="border: 1px solid green; padding: 10px;">
            <div>Контент внутри Vue-приложения</div>
            <button @click="showModal = true">Открыть модальное окно</button>
            
            <teleport to="#modal-container" :disabled="!showModal">
                <div v-if="showModal" class="modal" style="border: 2px solid blue; padding: 20px;">
                    <p>Содержимое модального окна, отрендеренное через teleport</p>
                    <button @click="showModal = false">Закрыть</button>
                </div>
            </teleport>
        </div>
    `
}).mount('#application');
```

В HTML-коде страницы создайте целевой контейнер:

```html
<div id="application"></div>
<!-- Контейнер для телепортируемого контента -->
<div id="modal-container"></div>
```

Когда `showModal` становится `true`, Vue перемещает содержимое элемента `<teleport>` в контейнер `#modal-container`. При этом логическая связь компонента с его содержимым сохраняется: события и данные продолжают работать.

Атрибут `:disabled` отключает телепортацию. Если установить `:disabled="true"`, содержимое будет отрисовано на том же месте, где и объявлено.

## Внешние библиотеки

Чтобы использовать внешнюю библиотеку, соберите ее как Bitrix JS Extension.

1. Найдите ESM-версию библиотеки.

2. Удалите лишние импорты и добавьте зависимости от модулей Bitrix, например, `import {...} from 'ui.vue3'`.

3. Экспортируйте нужные функции.

4. В комментарии укажите ссылку на исходник `@source` и список изменений `Modify list`.

Пример готового расширения для `vue-router` лежит в `/bitrix/modules/ui/install/js/ui/vue3/router/`.

## Отладка

По умолчанию BitrixVue запускается в режиме production. Для отладки включите режим разработчика.

Добавьте в файл `/bitrix/php_interface/init.php`:

```php
define('VUEJS_DEBUG', true);
```

Для отображения кодов фраз вместо текста добавьте:

```php
define('VUEJS_LOCALIZATION_DEBUG', true);
```

Также установите расширение Vue.js Devtools для вашего браузера. Оно позволит инспектировать дерево компонентов, состояния, события и производительность.