# Архитектура Vue приложений в Bitrix24

## Описание

Архитектурный подход к созданию сложных SPA приложений в среде Bitrix24 на базе **Vue 3** и **Vuex**.  
Подход основан на четком разделении ответственности:  
- **Model** (данные и состояние)
- **Provider** (взаимодействие с API)
- **Component** (отображение)
- **Application** (сборка и точка входа)

## Структура директорий

```text
local/js/module_name/
├── application/       # Точки входа приложений (App components)
├── component/         # Общие UI компоненты (UI Kit модуля)
├── const/             # Константы и словари
├── core/              # Ядро: инициализация Store, Pull-клиент
├── lib/               # Вспомогательные утилиты (напр. API Client)
├── model/             # Vuex модули (state, getters, mutations)
└── provider/          # Сервисы для работы с API (fetching data)
```

## Основные сущности

### 1. Application (Приложение)

Корневой компонент приложения. Отвечает за верстку макета и подключение основных видов (Views). Обычно не содержит сложной бизнес-логики, делегируя её в дочерние компоненты или Store.

**Пример:** `application/answer-card/src/app.js`

```javascript
import { ViewMode } from './enum/view-mode';
import { QuestionsView } from './view/questions-view';
import { AnswerView } from './view/answer-view';

// @vue/component
export const App = {
	components: {
		QuestionsView,
		AnswerView,
	},
	props: {
		relationId: { type: Number, default: 0 },
		mode: { type: String, default: ViewMode.FILL },
	},
	setup() {
		return { ViewMode };
	},
	computed: {
		isViewMode() {
			return this.mode === ViewMode.VIEW;
		},
	},
	template: `
		<div class="performan__answer-card-app">
			<AnswerView v-if="isViewMode" :relationId="relationId" />
			<QuestionsView v-else :relationId="relationId" />
		</div>
	`,
};
```

### 2. Component (Компонент)

Переиспользуемые UI элементы. Принимают данные через `props` и сообщают о действиях через `emit`.

**Пример:** `component/ui-date-picker/src/ui-date-picker.js`

```javascript
import { DatePicker } from 'ui.date-picker';
import './style.css';

// @vue/component
export const UiDatePicker = {
	name: 'UiDatePicker',
	props: {
		date: { type: String, required: true },
	},
	emits: ['update:date'],
	mounted() {
		this.initPicker();
	},
	methods: {
		initPicker() {
			new DatePicker({
				targetNode: this.$refs.container,
				onSelect: (date) => this.$emit('update:date', date)
			});
		}
	},
	template: `
		<div ref="container" class="ui-date-picker-wrapper">
			{{ date }}
		</div>
	`,
};
```

### 3. Provider (Сервис)

Слой для общения с Бэкендом.  
- Выполняет Ajax запросы.
- Преобразует DTO (от сервера) в Model (для фронтенда).
- Сохраняет данные в Vuex Store.
- Содержит логику обработки pull-событий.
- Реализован как Singleton.

**Пример:** `provider/service/campaign/src/campaign.js`

```javascript
import { apiClient } from 'performan.lib.api-client';
import { Core } from 'performan.core';
import { Models } from 'performan.const';

export const campaignService = new class {
	get $store() {
		return Core.getStore();
	}

	async getById(id) {
		try {
			// 1. Запрос к API
			const data = await apiClient.post('Campaign.get', { id });
			
			// 2. Сохранение в Store (нормализация данных)
			await this.$store.dispatch(`${Models.Campaigns}/upsert`, data);
			
			return data;
		} catch (error) {
			console.error('Campaign load error', error);
			return null;
		}
	}
}();
```

### 4. Model (Vuex Модуль)

Хранилище данных. Использует Vuex 4 (в составе `ui.vue3.vuex`).
Рекомендуется хранить данные в плоском виде (normalized), используя `Map` или объекты с ID в качестве ключей.

**Пример использования в компоненте:**

```javascript
import { mapGetters } from 'ui.vue3.vuex';
import { Models } from 'performan.const';

export const UserList = {
	computed: {
		...mapGetters({
			users: `${Models.Users}/getAll`, // Получение данных из стора
		}),
	},
	template: `
		<div v-for="user in users" :key="user.id">
			{{ user.name }}
		</div>
	`
};
```

## Интеграция в PHP компонент

Пример того, как подключить и инициализировать Vue приложение внутри шаблона Bitrix компонента (`template.php`).

### 1. Шаблон компонента (template.php)

В файле `template.php` создается контейнер для приложения, подключается расширение и вызывается JS инициализатор.

```php
<?php
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) {
	die();
}

use Bitrix\Main\UI\Extension;
use Bitrix\Main\Web\Json;

/** @var array $arResult */
/** @var string $templateFolder */

// Подключение расширения с приложением
Extension::load('module.application.my-app');

// Уникальный ID для контейнера
$containerId = 'my-app-container-' . $arResult['ID'];
?>

<div id="<?= $containerId ?>"></div>

<script>
	BX.ready(function() {
		// Инициализация приложения с передачей параметров из PHP
		BX.Module.Application.MyApp.create(
			document.getElementById('<?= $containerId ?>'),
			<?= Json::encode([
				'id' => $arResult['ID'],
				'initialData' => $arResult['DATA'],
				'mode' => 'view'
			]) ?>
		);
	});
</script>
```

### 2. Точка входа JS

В JavaScript файле расширения (обычно в корне `src/`) создается метод для монтирования приложения.

```javascript
import { BitrixVue } from 'ui.vue3';
import { App } from './app';
import { Store } from './store'; // Ваш Vuex store

export class MyApp
{
	static create(container, options = {})
	{
		// Создание экземпляра Vue приложения
		const app = BitrixVue.createApp(App, {
			id: options.id,
			mode: options.mode,
			// Передача начальных данных через props
			initialData: options.initialData 
		});

		// Подключение Vuex Store
		app.use(Store);

		// Монтирование в DOM элемент
		app.mount(container);
		
		return app;
	}
}
```

## Рекомендации для AI агентов

1.  **Не используйте прямые мутации DOM.** Всегда используйте реактивность Vue.
2.  **Разделяйте логику.** API запросы — в `Provider`, состояние — в `Model` (Store), верстка — в `Component`.
3.  **Импорты.** Используйте алиасы модулей Bitrix (напр. `import { ... } from 'module.namespace'`).
4.  **Типизация.** Если доступен FlowJs или TypeScript, используйте интерфейсы для DTO и Моделей.
