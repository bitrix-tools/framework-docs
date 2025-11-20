# Менеджер уведомлений (Notification Manager)

## Описание

Модуль `ui.notification-manager` предоставляет единый API для работы с уведомлениями. Он автоматически выбирает наилучший способ доставки уведомлений в зависимости от окружения.

**Расположение:** `/ui/install/js/ui/notification-manager/src`

## Импорт компонента

```javascript
import { Notifier, Notification } from 'ui.notification-manager';
```

## Основные сущности

### Notifier

Основной класс для управления уведомлениями. Он отвечает за создание и отправку уведомлений, а также за подписку на события.

#### `Notifier.notify(options)`

Отправляет уведомление.

**Параметры:**

| Имя | Тип | Описание |
| --- | --- | --- |
| `options` | `NotificationOptions` | Объект с параметрами уведомления. |

#### `Notifier.subscribe(eventName, handler)`

Подписывается на события уведомлений.

**Параметры:**

| Имя | Тип | Описание |
| --- | --- | --- |
| `eventName` | `String` | Имя события (например, `click`, `close`, `reply`). |
| `handler` | `Function` | Обработчик события. |

### NotificationOptions

Объект с параметрами для создания уведомления.

| Свойство | Тип | Обязательное | Описание |
| --- | --- | --- | --- |
| `id` | `string` | Да | Уникальный идентификатор уведомления. |
| `category` | `string` | Нет | Категория уведомления (например, `im`, `calendar`). |
| `title` | `string` | Нет | Заголовок уведомления. |
| `text` | `string` | Нет | Основной текст уведомления. |
| `icon` | `string` | Нет | URL иконки для уведомления. |
| `inputPlaceholderText` | `string` | Нет | Текст-заполнитель для поля ввода (если уведомление поддерживает ответ). |
| `button1Text` | `string` | Нет | Текст для первой кнопки. |
| `button2Text` | `string` | Нет | Текст для второй кнопки. |

## Примеры использования

### Отправка простого уведомления

```javascript
import { Notifier } from 'ui.notification-manager';

Notifier.notify({
	id: 'my-notification-1',
	title: 'Привет!',
	text: 'Это простое уведомление.',
	icon: '/path/to/icon.png'
});
```

### Уведомление с кнопками и подпиской на клик

```javascript
import { Notifier } from 'ui.notification-manager';

const notificationId = 'my-interactive-notification';

Notifier.notify({
	id: notificationId,
	title: 'Встреча',
	text: 'У вас запланирована встреча через 15 минут.',
	button1Text: 'Открыть календарь',
	button2Text: 'Отложить'
});

Notifier.subscribe('click', (event) => {
	const { id, buttonId } = event.getData();
	if (id === notificationId)
	{
		if (buttonId === 1)
		{
			console.log('Пользователь нажал "Открыть календарь"');
			// window.open('/calendar/');
		}
		else if (buttonId === 2)
		{
			console.log('Пользователь нажал "Отложить"');
		}
	}
});
```

### Уведомление с полем для ответа

```javascript
import { Notifier } from 'ui.notification-manager';

const notificationId = 'new-message-123';

Notifier.notify({
	id: notificationId,
	category: 'im',
	title: 'Новое сообщение от Анны',
	text: 'Привет, как дела?',
	inputPlaceholderText: 'Введите ответ...'
});

Notifier.subscribe('reply', (event) => {
	const { id, reply } = event.getData();
	if (id === notificationId)
	{
		console.log(`Пользователь ответил: "${reply}"`);
		// Логика отправки ответа
	}
});
```

## TypeScript типы

```typescript
import type { NotificationOptions } from 'ui.notification-manager';
```

### NotificationOptions

Интерфейс для объекта опций при создании уведомления.

## Экспортируемые модули

- `Notifier` - Основной класс для отправки уведомлений и подписки на события.
- `Notification` - Класс, представляющий объект уведомления (в основном для внутреннего использования).
- `NotificationOptions` - TypeScript тип для опций уведомления.
