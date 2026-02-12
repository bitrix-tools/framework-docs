# ui.dialogs.messagebox

## Описание

Компонент `ui.dialogs.messagebox` предоставляет простой способ для создания и управления стандартными модальными окнами, такими как предупреждения (`alert`) и подтверждения (`confirm`). Он позволяет настраивать заголовок, сообщение, кнопки и обработчики событий.

**Расположение:** `/ui/install/js/ui/dialogs/messagebox/src/`

## Импорт компонента

```javascript
import { MessageBox, MessageBoxButtons } from 'ui.dialogs.messagebox';
```

## Основные статические методы

### MessageBox.alert()

Показывает диалоговое окно с сообщением и кнопкой «ОК».

```javascript
MessageBox.alert(message, title, onOk, okCaption);
```

| Параметр | Тип | Описание |
|-----------|----------|----------|
| `message` | `String` | Текст сообщения. |
| `title` | `String` | (опционально) Заголовок окна. |
| `onOk` | `Function` | (опционально) Callback-функция при нажатии «ОК». |
| `okCaption` | `String` | (опционально) Текст для кнопки «ОК». |

### MessageBox.confirm()

Показывает диалоговое окно с сообщением и кнопками «ОК» и «Отмена».

```javascript
MessageBox.confirm(message, title, onOk, onCancel, okCaption, cancelCaption);
```

| Параметр | Тип | Описание |
|-----------|----------|----------|
| `message` | `String` | Текст сообщения. |
| `title` | `String` | (опционально) Заголовок окна. |
| `onOk` | `Function` | (опционально) Callback-функция при нажатии «ОК». |
| `onCancel` | `Function` | (опционально) Callback-функция при нажатии «Отмена». |
| `okCaption` | `String` | (опционально) Текст для кнопки «ОК». |
| `cancelCaption` | `String` | (опционально) Текст для кнопки «Отмена». |

### MessageBox.show()

Создает и сразу показывает диалоговое окно с указанными параметрами.

```javascript
MessageBox.show({
   message: 'Текст сообщения',
   title: 'Заголовок',
   buttons: MessageBoxButtons.OK_CANCEL,
   // ... другие параметры
});
```

## Параметры конструктора

Экземпляр `MessageBox` можно создать с помощью `new MessageBox(options)`.

| Параметр | Тип | По умолчанию | Описание |
|-----------|----------|----------|----------|
| `message` | `String` \| `Element` | `''` | Основной текст или DOM-элемент в окне. |
| `title` | `String` | `null` | Заголовок окна. |
| `buttons` | `Array` \| `String` | `[]` | Массив кнопок или строка-пресет (`MessageBoxButtons`). |
| `onOk` | `Function` | `null` | Callback для кнопки «ОК». |
| `onCancel` | `Function` | `null` | Callback для кнопки «Отмена». |
| `onYes` | `Function` | `null` | Callback для кнопки «Да». |
| `onNo` | `Function` | `null` | Callback для кнопки «Нет». |
| `okCaption` | `String` | `(локализовано)` | Текст для кнопки «ОK». |
| `cancelCaption` | `String` | `(локализовано)` | Текст для кнопки «Отмена». |
| `yesCaption` | `String` | `(локализовано)` | Текст для кнопки «Да». |
| `noCaption` | `String` | `(локализовано)` | Текст для кнопки «Нет». |
| `modal` | `Boolean` | `true` | Делает окно модальным (с оверлеем). |
| `mediumButtonSize` | `Boolean` | `false` | Использовать средний размер для кнопок. |
| `popupOptions` | `Object` | `{}` | Дополнительные параметры для `main.popup`. |

## Примеры использования

### Простое предупреждение

```javascript
import { MessageBox } from 'ui.dialogs.messagebox';

MessageBox.alert('Операция успешно завершена!');
```

### Запрос подтверждения

```javascript
import { MessageBox } from 'ui.dialogs.messagebox';

MessageBox.confirm('Вы уверены, что хотите удалить этот элемент?', (messageBox) => {
  console.log('Пользователь нажал ОК');
  messageBox.close();
}, 'Удалить', (messageBox) => {
  console.log('Пользователь нажал Отмена');
  messageBox.close();
});
```

### Создание кастомного окна

```javascript
import { MessageBox, MessageBoxButtons } from 'ui.dialogs.messagebox';

const box = new MessageBox({
  message: 'Вы хотите сохранить изменения?',
  title: 'Сохранение',
  buttons: MessageBoxButtons.YES_NO_CANCEL,
  onYes: (messageBox) => {
    console.log('Сохраняем...');
    messageBox.close();
  },
  onNo: (messageBox) => {
    console.log('Не сохраняем.');
    messageBox.close();
  },
  onCancel: (messageBox) => {
    console.log('Действие отменено.');
    messageBox.close();
  }
});

box.show();
```

## Экспортируемые компоненты

- `MessageBox`: Основной класс для создания диалоговых окон.
- `MessageBoxButtons`: Объект с константами для стандартных наборов кнопок (`OK`, `OK_CANCEL`, `YES_NO`, `YES_NO_CANCEL` и т.д.).