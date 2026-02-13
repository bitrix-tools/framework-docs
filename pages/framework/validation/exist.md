---
title: Валидация. Существующие правила
description: 'Валидация. Документация по Bitrix Framework: собственные правила валидации'
---

Bitrix Framework предоставляет готовые атрибуты и валидаторы для самых частых сценариев проверки данных.

## Для классов

### `AtLeastOnePropertyNotEmpty`

Проверяет заполненность хотя бы одного аттрибута.

Полный класс правила: `Bitrix\Main\Validation\Rule\AtLeastOnePropertyNotEmpty`
Используемые валидаторы: 
- `Bitrix\Main\Validation\Validator\AtLeastOneNotEmptyValidator`

Сигнатура метода:
```php
__construct(
	private readonly array $propertyNames,
	private readonly bool $allowZero = false,
	private readonly bool $allowEmptyString = false,
	protected string|LocalizableMessageInterface|null $errorMessage = null,
)
```

Пример использования:
```php
use Bitrix\Main\Validation\Rule\AtLeastOnePropertyNotEmpty;
use Bitrix\Main\Validation\Rule\PositiveNumber;

#[AtLeastOnePropertyNotEmpty(
	propertyNames: ['id', 'uuid'],
	errorMessage: "Нельзя однозначно идентифицировать пользователя"
)]
class UpdateUserName
{
    public function __construct(
        #[PositiveNumber]
        public ?int $id = null,
        public ?string $uuid = null,
        public string $fullName
    ) {}
}
```

### `OnlyOneOfPropertyRequired`

Проверяет, что ровно одно из указанных свойств объекта содержит непустое значение (пустыми считаются: `null`, `0`, `''`, `false` и пустые массивы).

Полный класс правила: `Bitrix\Main\Validation\Rule\OnlyOneOfPropertyRequired`  
Используемые валидаторы: Отсутствуют (валидация реализована внутри правила)

Сигнатура метода:
```php
__construct(
	private readonly array $propertyNames,
	protected string|LocalizableMessageInterface|null $errorMessage = null,
)
```

Пример использования:
```php
use Bitrix\Main\Validation\Rule\OnlyOneOfPropertyRequired;
use Bitrix\Main\Validation\Rule\PositiveNumber;
use Bitrix\Main\Validation\Rule\Email;

#[OnlyOneOfPropertyRequired(
	propertyNames: ['userId', 'email'],
	errorMessage: 'Укажите ТОЛЬКО один идентификатор: либо userId, либо email'
)]
class UserLookupRequest
{
    #[PositiveNumber]
    public ?int $userId = null;

    #[Email]
    public ?string $email = null;

    public ?string $newEmail = null;
}
```

Поле `newEmail` не участвует в проверке, так как не указано в `propertyNames`.


## Для свойств и параметров

### `ElementsType`

Проверяет, что все элементы в массиве (или итерируемом объекте) соответствуют указанному скалярному типу данных или являются экземплярами определенного класса.

Полный класс правила: `Bitrix\Main\Validation\Rule\ElementsType`
Используемые валидаторы:
- Встроенная логика проверки (без подключения отдельных классов валидаторов)

Сигнатура метода:
```php
__construct(
	private readonly ?Type $typeEnum = null,
	private readonly ?string $className = null,
	string|LocalizableMessageInterface|null $errorMessage = null
)
```

Доступные типы:
- `Type::Integer` - проверка осуществляется php функцией `is_int`
- `Type::String` - проверка осуществляется php функцией `is_string`
- `Type::Float` - проверка осуществляется php функцией `is_float`
- `Type::Numeric` - проверка осуществляется php функцией `is_numeric`

Пример использования (проверка скалярного типа):
```php
use Bitrix\Main\Validation\Rule\ElementsType;
use Bitrix\Main\Validation\Rule\Enum\Type;

class UpdateUserRolesDto
{
    public function __construct(
        public int $userId,
        
        #[ElementsType(
            typeEnum: Type::Integer,
            errorMessage: "ID ролей должны быть целыми числами"
        )]
        public array $roleIds
    ) {}
}
```

Пример использования (проверка класса):
```php
use Bitrix\Main\Validation\Rule\ElementsType;
use Bitrix\Tasks\Item\Task;

class ProcessTasksDto
{
    public function __construct(
        #[ElementsType(
            className: Task::class,
            errorMessage: "Все элементы должны быть объектами Task"
        )]
        public array $tasks
    ) {}
}
```

### `Email`

Проверяет, что значение является корректным адресом электронной почты.

Полный класс правила: `Bitrix\Main\Validation\Rule\Email`
Используемые валидаторы:
- `Bitrix\Main\Validation\Validator\EmailValidator`

Сигнатура метода:
```php
__construct(
	private readonly bool $strict = false,
	private readonly bool $domainCheck = false,
	protected string|LocalizableMessageInterface|null $errorMessage = null
)
```

Параметры:
- `strict` (bool) - проверяет что значение содержит только почтовый адрес. Например "Ivan Ivanov <i.ivanov@bitrix.com>" при нестрогой проверке успешно ее пройдет, а при строгой проверке даже пробел перед адресом электронной почты будет ошибкой.
- `domainCheck` (bool) - дополнительно проверят MX и A запись для почтового домена при помощи php функции `checkdnsrr`


Пример использования:
```php
use Bitrix\Main\Validation\Rule\Email;

class UserProfileDto
{
    public function __construct(
        public string $name,
        
        #[Email(
            errorMessage: "Пожалуйста, укажите корректный email"
        )]
        public string $email
    ) {}
}
```

### `InArray`

Проверяет, что значение присутствует в списке допустимых значений.

Полный класс правила: `Bitrix\Main\Validation\Rule\InArray`
Используемые валидаторы:
- `Bitrix\Main\Validation\Validator\InArrayValidator`

Сигнатура метода:
```php
__construct(
	private readonly array $validValues,
	private readonly bool $strict = false,
	protected string|LocalizableMessageInterface|null $errorMessage = null,
)
```

Пример использования:
```php
use Bitrix\Main\Validation\Rule\InArray;

class TaskDto
{
    public function __construct(
        public string $title,
        
        #[InArray(
            validValues: ['low', 'medium', 'high'],
            errorMessage: "Укажите корректный приоритет задачи"
        )]
        public string $priority
    ) {}
}
```

### `Json`

Проверяет, что значение является строкой, содержащей корректный JSON.

Полный класс правила: `Bitrix\Main\Validation\Rule\Json`
Используемые валидаторы:
- `Bitrix\Main\Validation\Validator\JsonValidator`

Сигнатура метода:
```php
__construct()
```

Пример использования:
```php
use Bitrix\Main\Validation\Rule\Json;

class WidgetSettingsDto
{
    public function __construct(
        public string $widgetCode,
        
        #[Json]
        public string $settings
    ) {}
}
```

### `Length`

Проверяет, что длина строки находится в заданном диапазоне. Можно задать только минимальную, только максимальную границу или обе сразу.

Полный класс правила: `Bitrix\Main\Validation\Rule\Length`
Используемые валидаторы:
- `Bitrix\Main\Validation\Validator\LengthValidator`

Сигнатура метода:
```php
__construct(
	private readonly ?int $min = null,
	private readonly ?int $max = null,
	protected string|LocalizableMessageInterface|null $errorMessage = null,
)
```

Пример использования:
```php
use Bitrix\Main\Validation\Rule\Length;

class ChangePasswordDto
{
    public function __construct(
        #[Length(
            min: 8,
            max: 50,
            errorMessage: "Пароль должен содержать от 8 до 50 символов"
        )]
        public string $newPassword
    ) {}
}
```

### `Max`

Проверяет, что числовое значение меньше или равно указанному максимуму.

Полный класс правила: `Bitrix\Main\Validation\Rule\Max`
Используемые валидаторы:
- `Bitrix\Main\Validation\Validator\MaxValidator`

Сигнатура метода:
```php
__construct(
	private readonly int $max,
	protected string|LocalizableMessageInterface|null $errorMessage = null
)
```

Пример использования:
```php
use Bitrix\Main\Validation\Rule\Max;

class DiscountDto
{
    public function __construct(
        public string $name,
        
        #[Max(
            max: 100,
            errorMessage: "Скидка не может превышать 100%"
        )]
        public int $discountPercent
    ) {}
}
```

### `Min`

Проверяет, что числовое значение больше или равно указанному минимуму.

Полный класс правила: `Bitrix\Main\Validation\Rule\Min`
Используемые валидаторы:
- `Bitrix\Main\Validation\Validator\MinValidator`

Сигнатура метода:
```php
__construct(
	private readonly int $min,
	protected string|LocalizableMessageInterface|null $errorMessage = null
)
```

Пример использования:
```php
use Bitrix\Main\Validation\Rule\Min;

class OrderDto
{
    public function __construct(
        public string $itemName,
        
        #[Min(
            min: 10,
            errorMessage: "Минимальная сумма заказа должна быть не меньше 10"
        )]
        public int $totalAmount
    ) {}
}
```

### `NotEmpty`

Проверяет, что значение не является пустым. Позволяет настраивать допустимость нулевого значения и строк, содержащих только пробелы.

Полный класс правила: `Bitrix\Main\Validation\Rule\NotEmpty`
Используемые валидаторы:
- `Bitrix\Main\Validation\Validator\NotEmptyValidator`

Сигнатура метода:
```php
__construct(
	private readonly bool $allowZero = false,
	private readonly bool $allowSpaces = false,
	protected string|LocalizableMessageInterface|null $errorMessage = null
)
```

Пример использования:
```php
use Bitrix\Main\Validation\Rule\NotEmpty;

class TaskDto
{
	public function __construct(
        #[NotEmpty(
            allowSpaces: false,
            errorMessage: "Название задачи не может быть пустым")
        ]
        public string $title
    ) {}
}
```

### `Phone`

Проверяет, что значение является корректным номером телефона.

Полный класс правила: `Bitrix\Main\Validation\Rule\Phone`
Используемые валидаторы:
- `Bitrix\Main\Validation\Validator\PhoneValidator`

Сигнатура метода:
```php
__construct(
	protected string|LocalizableMessageInterface|null $errorMessage = null
)
```

Пример использования:
```php
use Bitrix\Main\Validation\Rule\Phone;

class UserContactDto
{
    public function __construct(
        public string $name,
        
        #[Phone(errorMessage: "Пожалуйста, укажите корректный номер телефона")]
        public string $workPhone
    ) {}
}
```

### `PhoneOrEmail`

Проверяет, что значение является корректным номером телефона или адресом электронной почты. Валидация проходит успешно, если значение соответствует хотя бы одному из двух форматов.

Полный класс правила: `Bitrix\Main\Validation\Rule\PhoneOrEmail`
Используемые валидаторы:
- `Bitrix\Main\Validation\Validator\PhoneValidator`
- `Bitrix\Main\Validation\Validator\EmailValidator`

Сигнатура метода:
```php
__construct(
	private readonly bool $strict = false,
	private readonly bool $domainCheck = false,
	string|LocalizableMessageInterface|null $errorMessage = null
)
```

Параметры:
- `strict` (bool) - проверяет что значение содержит только почтовый адрес. Например "Ivan Ivanov <i.ivanov@bitrix.com>" при нестрогой проверке успешно ее пройдет, а при строгой проверке даже пробел перед адресом электронной почты будет ошибкой.
- `domainCheck` (bool) - дополнительно проверят MX и A запись для почтового домена при помощи php функции `checkdnsrr`

Пример использования:
```php
use Bitrix\Main\Validation\Rule\PhoneOrEmail;

class UserContactDto
{
    public function __construct(
        public string $name,
        
        #[PhoneOrEmail(
            errorMessage: "Укажите корректный номер телефона или email"
        )]
        public string $contact,
    ) {}
}
```

### `PositiveNumber`

Проверяет, что числовое значение является строго положительным (больше нуля).

Полный класс правила: `Bitrix\Main\Validation\Rule\PositiveNumber`
Используемые валидаторы:
- `Bitrix\Main\Validation\Validator\MinValidator`

Сигнатура метода:
```php
__construct(
	protected string|LocalizableMessageInterface|null $errorMessage = null
)
```

Пример использования:
```php
use Bitrix\Main\Validation\Rule\PositiveNumber;

class AwardController extends Controller
{
    public function getByUserIdAction(
        #[PositiveNumber(errorMessage: "Идентификатор пользователя должен быть положительным числом")]
        int $userId
    ): array {
        // ...
    }
}
```

### `Range`

Проверяет, что числовое значение находится в заданном диапазоне (от `min` до `max` включительно).

Полный класс правила: `Bitrix\Main\Validation\Rule\Range`
Используемые валидаторы:
- `Bitrix\Main\Validation\Validator\MinValidator`
- `Bitrix\Main\Validation\Validator\MaxValidator`

Сигнатура метода:
```php
__construct(
	private readonly int $min,
	private readonly int $max,
	protected string|LocalizableMessageInterface|null $errorMessage = null
)
```

Пример использования:
```php
use Bitrix\Main\Validation\Rule\Range;

class OrderDto
{
    public function __construct(
        public string $itemName,
        
        #[Range(
            min: 1,
            max: 100,
            errorMessage: "Количество товара должно быть от 1 до 100"
        )]
        public int $quantity
    ) {}
}
```

### `RegExp`

Проверяет, что значение строки соответствует указанному регулярному выражению.

Полный класс правила: `Bitrix\Main\Validation\Rule\RegExp`
Используемые валидаторы:
- `Bitrix\Main\Validation\Validator\RegExpValidator`

Сигнатура метода:
```php
__construct(
	private readonly string $pattern,
	private readonly int $flags = 0,
	private readonly int $offset = 0,
	protected string|LocalizableMessageInterface|null $errorMessage = null
)
```

Параметры `flags` и `offset` передаются в php-функицю `preg_match`.

Пример использования:
```php
use Bitrix\Main\Validation\Rule\RegExp;

class ProductDto
{
    public function __construct(
        public string $name,
        
        #[RegExp(
            pattern: '/^[A-Z]{2}\d{4}$/',
            errorMessage: "Артикул должен быть в формате: две заглавные буквы и четыре цифры"
        )]
        public string $sku
    ) {}
}
```

### `Url`

Проверяет, что значение является корректным URL-адресом.

Полный класс правила: `Bitrix\Main\Validation\Rule\Url`
Используемые валидаторы:
- `Bitrix\Main\Validation\Validator\UrlValidator`

Сигнатура метода:
```php
__construct(
	protected string|LocalizableMessageInterface|null $errorMessage = null,
)
```

Пример использования:
```php
use Bitrix\Main\Validation\Rule\Url;

class SiteFeedbackDto
{
    public function __construct(
        public string $userName,
        
        #[Url(errorMessage: "Пожалуйста, укажите корректный адрес сайта")]
        public string $userSite,
    ) {}
}
```
