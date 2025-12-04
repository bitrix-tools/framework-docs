---
title: Результат работы и ошибки
description: 'Результат работы и ошибки. Документация по Bitrix Framework: принципы работы, архитектура и примеры использования.'
---

При разработке веб-приложений, которые выполняют не только CRUD-операции, важно правильно передавать результаты работы и ошибки.

Для передачи результата обычно используют массивы или объекты данных DTO. Ошибки передают через исключения. У такого подхода есть особенности:

-  массивы не дают типизации и контроля содержимого,

-  исключения не позволяют передать несколько ошибок сразу, например, когда при проверке данных несколько полей неверны.

Используйте объект результата `\Bitrix\Main\Result` для решения проблем. Он позволяет передавать данные и ошибки одновременно.

## Класс \\Bitrix\\Main\\Result

Класс `Result` хранит результаты операций и ошибки. Он помогает определить, прошла ли операция успешно.

Методы класса:

-  `setData($data)` -- сохраняет данные результата,

-  `isSuccess()` -- проверяет, успешна ли операция,

-  `getError()` -- возвращает первую ошибку,

-  `getErrors()` -- возвращает ошибки,

-  `getErrorMessages()` -- получает сообщения об ошибках,

-  `getErrorCollection()` -- возвращает коллекцию ошибок,

-  `getData()` -- получает данные результата,

-  `addErrors(array $errors)` -- добавляет несколько ошибок,

-  `addError(Error $error)` -- добавляет одну ошибку.

### Пример использования Result

Функция `updateUserData` проверяет идентификатор пользователя, обновляет данные и возвращает результат.

-  Если идентификатор пользователя неверный, добавляется ошибка.

-  Если обновление не удалось, добавляется другая ошибка.

-  При успешном выполнении сохраняются обновленные данные.

```php
use Bitrix\Main\Result;
use Bitrix\Main\Error;

function updateUserData(int $userId, array $fields): Result
{
    $result = new Result();
    
    if ($userId <= 0) {
        $result->addError(new Error('Неверный ID пользователя', 'INVALID_USER_ID'));
        return $result;
    }
    
    // Обновляем данные
    $updateResult = someUpdateFunction($userId, $fields);
    
    if ($updateResult === false) {
        $result->addError(new Error('Ошибка при обновлении данных', 'UPDATE_FAILED'));
    } else {
        $result->setData(['UPDATED_FIELDS' => $fields]);
    }
    
    return $result;
}

// Используем функцию
$result = updateUserData(123, ['NAME' => 'Иван', 'LAST_NAME' => 'Иванов']);

if ($result->isSuccess()) {
    $data = $result->getData();
    echo 'Данные обновлены: ' . print_r($data, true);
} else {
    $errors = $result->getErrorMessages();
    echo 'Ошибки: ' . implode(', ', $errors);
}
```

### Типизация данных

По умолчанию данные представлены в виде обычного массива. Отсутствие строгой типизации может привести к проблемам.

Если нужно передать большой объем данных, создайте класс-наследник от объекта результата. Используйте свойства и методы `get`, `set`, чтобы добавить в объект конкретные и типизированные данные.

```php
use Bitrix\Main\Result;
use Bitrix\Main\Error;
use Bitrix\Main\Type\DateTime;

class UserUpdateResult extends Result
{
    private array $updatedFields = [];
    private ?DateTime $timestamp = null;
    public function setUpdatedData(array $fields, DateTime $timestamp): void
    {
        $this->updatedFields = $fields;
        $this->timestamp = $timestamp;
    }
    public function getUpdatedFields(): array
    {
        return $this->updatedFields;
    }
    public function getTimestamp(): ?DateTime
    {
        return $this->timestamp;
    }
}

function updateUserInDatabase(int $userId, array $fields): array
{
    return ['ID' => $userId, ...$fields];
}

function updateUserWithTypedResult(int $userId, array $fields): UserUpdateResult
{
    $result = new UserUpdateResult();
    if ($userId <= 0) 
    {
        $result->addError(new Error('Invalid user ID', 100));
        return $result;
    }
    try {
        $updatedData = updateUserInDatabase(\$userId, \$fields);
        $result->setUpdatedData(
            $updatedData,
            new DateTime()
        );
    } catch (Exception $e) {
        $result->addError(new Error($e->getMessage(), $e->getCode()));
    }
    return $result;
}

$typedResult = updateUserWithTypedResult(123, ['NAME' => 'Иван']);

if ($typedResult->isSuccess()) {
    $fields = $typedResult->getUpdatedFields();
    $time = $typedResult->getTimestamp()->format('Y-m-d H:i:s');
    echo 'Данные обновлены. Поля: ' . print_r($fields, true) . ', Время: ' . $time;
}
else {
    echo 'Ошибки: ' . implode(', ', $typedResult->getErrorMessages());
}
```

## Класс \\Bitrix\\Main\\ErrorCollection

Класс `ErrorCollection` внутри объекта `Result` собирает ошибки и управляет ими. При необходимости можно работать с этой коллекцией напрямую.

Методы класса:

-  `add(array $errors)` -- добавляет ошибки,

-  `getErrorByCode($code)` -- получает ошибку по коду,

-  `setError(Error $error)` -- добавляет одну ошибку.

### Пример работы с ErrorCollection

В примере создана коллекция и в нее добавлено две ошибки. Затем получена вторая ошибка и выведены все ошибки.

```php
use Bitrix\Main\ErrorCollection;
use Bitrix\Main\Error;

$errorCollection = new ErrorCollection();

// Добавляем ошибки
$errorCollection->add([
    new Error('Первая ошибка', 'ERROR_1'),
    new Error('Вторая ошибка', 'ERROR_2')
]);

// Добавляем ошибку по одному
$errorCollection->setError(new Error('Третья ошибка', 'ERROR_3'));

// Получаем ошибку по коду
$error = $errorCollection->getErrorByCode('ERROR_2');
if ($error) {
    echo 'Найдена ошибка: ' . $error->getMessage();
}

// Перебираем ошибки
foreach ($errorCollection as $error) {
    echo 'Код: ' . $error->getCode() . ', Сообщение: ' . $error->getMessage() . '<br>';
}
```

## Практические рекомендации

-  Проверяйте `isSuccess()` перед получением данных.

-  Используйте коды ошибок для их идентификации.

-  Группируйте ошибки в `ErrorCollection`.

-  Записывайте ошибки в логи при необходимости.

-  Используйте понятные сообщения об ошибках для пользователей. Технические детали оставляйте в кодах ошибок.
