
### Сообщение об ошибке после валидации

Можно указать свой текст ошибки, который будет возвращен после валидации.

```php
use Bitrix\Main\Validation\Rule\PositiveNumber;
class User
{
    public function __construct(
        #[PositiveNumber(errorMessage: 'Invalid ID!')]
        public readonly int $id
    )
    {
    }
}
$user = new User(-150);
/** @var \Bitrix\Main\Validation\ValidationService $service */
$result = $service->validate($user);
foreach ($result->getErrors() as $error)
{
    echo $error->getMessage();
}
// output: 'Invalid ID!'
```

Стандартный текст ошибки валидатора:

```php
use Bitrix\Main\Validation\Rule\PositiveNumber;
class User
{
    public function __construct(
        #[PositiveNumber]
        public readonly int $id
    )
    {
    }
}
$user = new User(-150);
/** @var \Bitrix\Main\Validation\ValidationService $service */
$result = $service->validate($user);
foreach ($result->getErrors() as $error)
{
    echo $error->getMessage();
}
// output: 'Значение поля меньше допустимого'
```

### Получить сработавший валидатор

Результат валидации хранит ошибки `\Bitrix\Main\Validation\ValidationError`. Каждая ошибка содержит свойство `failedValidator`.

```php
$errors = $service->validate($dto)->getErrors();
foreach ($errors as $error)
{
    $failedValidator = $error->getFailedValidator();
    // ...
}
```

### Доступные атрибуты и валидаторы

Bitrix Framework предоставляет готовые атрибуты и валидаторы для самых частых сценариев проверки данных.

Свойства:

-  `ElementsType` -- проверка типа элементов массива,

-  `Email` -- валидация email,

-  `InArray` -- значение входит в массив допустимых значений,

-  `Length` -- проверка длины строки,

-  `Max` -- максимальное значение,

-  `Min` -- минимальное значение,

-  `NotEmpty` -- не пустое значение,

-  `Phone` -- валидация телефона,

-  `PhoneOrEmail` -- телефон или email,

-  `PositiveNumber` -- положительное число,

-  `Range` -- значение в диапазоне,

-  `RegExp` -- регулярное выражение,

-  `Url` -- валидный URL,

-  `Json` -- валидный JSON.

Класс:

`AtLeastOnePropertyNotEmpty` -- хотя бы одно свойство не пусто.

Валидаторы:

-  `EmailValidator` -- валидация email,

-  `InArrayValidator` -- проверка вхождения в массив,

-  `LengthValidator` -- проверка длины строки,

-  `MaxValidator` -- максимальное значение,

-  `MinValidator` -- минимальное значение,

-  `NotEmptyValidator` -- не пустое значение,

-  `PhoneValidator` -- валидация телефона,

-  `RegExpValidator` -- проверка по регулярному выражению,

-  `UrlValidator` -- валидация URL,

-  `JsonValidator` -- валидация JSON.

