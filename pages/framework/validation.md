---
title: Валидация
description: 'Валидация. Документация по Bitrix Framework: принципы работы, архитектура и примеры использования.'
---

Валидация данных -- это проверка информации на соответствие заданным правилам. Например, числовой идентификатор должен быть положительным, а email -- соответствовать формату адреса.

## Как использовать валидацию

В Bitrix Framework валидацию можно реализовать разными способами. Самый простой способ -- ручные проверки в конструкторе или методах. Такой подход приводит к дублированию кода и усложняет его поддержку.

```php
public function __construct(int $userId)
{
    if ($userId <= 0)
    {
        throw new \Exception();
    }
    $this->userId = $userId;
}
```

Чтобы сократить код, используйте систему валидации на основе атрибутов. Она позволяет:

-  задавать правила в классах,

-  автоматически проверять данные при создании объектов,

-  централизованно обрабатывать ошибки.

### Как создать правила в классе

1. Создайте класс. Например, `User` со свойствами `id`, `email` и `phone`.

   ```php
   final class User
   {
       private ?int $id;
       private ?string $email;
       private ?string $phone;
        
       // getters & setters ...
   }
   ```

2. Добавьте атрибуты валидации: `#[PositiveNumber]`, `#[Email]` и `#[Phone]`.

   ```php
   use Bitrix\Main\Validation\Rule\AtLeastOnePropertyNotEmpty;
   use Bitrix\Main\Validation\Rule\Email;
   use Bitrix\Main\Validation\Rule\Phone;
   use Bitrix\Main\Validation\Rule\PositiveNumber;
   
   #[AtLeastOnePropertyNotEmpty(['email', 'phone'])]
   final class User
   {
       #[PositiveNumber]
       private ?int $id;
       
       #[Email]
       private ?string $email;
    
       #[Phone]
       private ?string $phone;
    
       // getters & setters...
   }
   ```

3. Проверьте валидацию. Объект можно проверить через `\Bitrix\Main\Validation\ValidationService` по ключу `main.validation.service`.

   `ValidationService` предоставляет метод `validate()`, который возвращает `ValidationResult`. Результат валидации содержит ошибки всех сработавших валидаторов.

   ```php
   use Bitrix\Main\DI\ServiceLocator;
   use Bitrix\Main\Validation\ValidationService;
   class UserService
   {
       private ValidationService $validation;
       
       public function __construct()
       {
           $this->validation = ServiceLocator::getInstance()->get('main.validation.service');
       }
       
       public function create(?string $email, ?string $phone): Result
       {
           $user = new User();
           $user->setEmail($email);
           $user->setPhone($phone);
           
           $result = $this->validation->validate($user);
           if (!$result->isSuccess())
           {
               return $result;
           }
           
           // save logic ...
       }
   }
   ```

{% note warning "" %}

-  Валидация работает через рефлексию, модификаторы доступа не учитываются.

-  Если свойство помечено как `nullable` и не заполнено, валидация пропускает его.

{% endnote %}

### Вложенные объекты

Используйте атрибут `#[Validatable]` для вложенных объектов.

```php
use Bitrix\Main\Validation\Rule\Composite\Validatable;
use Bitrix\Main\Validation\Rule\NotEmpty;
use Bitrix\Main\Validation\Rule\PositiveNumber;
class Buyer
{
    #[PositiveNumber]
    public ?int $id;
    #[Validatable]
    public ?Order $order;
}
class Order
{
    #[PositiveNumber]
    public int $id;
    #[Validatable]
    public ?Payment $payment;
}
class Payment
{
    #[NotEmpty]
    public string $status;
    #[NotEmpty(errorMessage: 'Custom message error')]
    public string $systemCode;
}
// validation
/** @var \Bitrix\Main\Validation\ValidationService $validationService */
$validationService = \Bitrix\Main\DI\ServiceLocator::getInstance()->get('main.validation.service');
$buyer = new Buyer();
$buyer->id = 0;
$result1 = $validationService->validate($buyer);
// "id: Значение поля меньше допустимого"
foreach ($result1->getErrors() as $error)
{
    echo $error->getCode() . ': ' . $error->getMessage(). PHP_EOL;
}
echo PHP_EOL;
$buyer->id = 1;
$order = new Order();
$order->id = -1;
$buyer->order = $order;
$result2 = $validationService->validate($buyer);
// "order.id: Значение поля меньше допустимого"
foreach ($result2->getErrors() as $error)
{
    echo $error->getCode() . ': ' . $error->getMessage(). PHP_EOL;
}
echo PHP_EOL;
$buyer->order->id = 123;
$payment = new Payment();
$payment->status = '';
$payment->systemCode = '';
$buyer->order->payment = $payment;
$result3 = $validationService->validate($buyer);
// "order.payment.status: Значение поля не может быть пустым"
// "order.payment.systemCode: Custom message error"
foreach ($result3->getErrors() as $error)
{
    echo $error->getCode() . ': ' . $error->getMessage(). PHP_EOL;
}
```

### Валидация в контроллерах

В контроллерах валидация помогает убедиться в корректности данных из запроса.

```php
use Bitrix\Main\Validation\Rule\NotEmpty;
use Bitrix\Main\Validation\Rule\PhoneOrEmail;
final class CreateUserDto
{
    public function __construct(
        #[PhoneOrEmail]
        public ?string $login,
        
        #[NotEmpty]
        public ?string $password,
        
        #[NotEmpty]
        public ?string $passwordRepeat,
    )
    {}
}
```

В коде класс будет выглядеть следующим образом:

```php
class UserController extends Controller
{
    private ValidationService $validation;
    
    protected function init()
    {
        parent::init();
        
        $this->validation = ServiceLocator::getInstance()->get('main.validation.service');
    }
    
    public function createAction(): Result
    {
        $dto = new CreateUserDto();
        $dto->login = (string)$this->getRequest()->get('login');
        $dto->password = (string)$this->getRequest()->get('password');
        $dto->passwordRepeat = (string)$this->getRequest()->get('passwordRepeat');
        
        $result = $this->validation->validate($dto);
        if (!$result->isSuccess())
        {
            $this->addErrors($result->getErrors());
            
            return false;
        }
        
        // create logic ...
    }
}
```

Создайте фабричный метод в DTO, чтобы избежать повторения кода.

```php
final class CreateUserDto
{
    public function __construct(
        #[PhoneOrEmail]
        public ?string $login = null,
        
        #[NotEmpty]
        public ?string $password = null,
        
        #[NotEmpty]
        public ?string $passwordRepeat = null,
    )
    {}
    
    public static function createFromRequest(\Bitrix\Main\HttpRequest $request): self
    {
        return new static(
            login: (string)$request->getRequest()->get('login'),
            password: (string)$request->getRequest()->get('password'),
            passwordRepeat: (string)$request->getRequest()->get('passwordRepeat'),
        );
    }
}
```

Класс `Bitrix\Main\Validation\Engine\AutoWire\ValidationParameter` устранит повторяющуюся логику валидации.

```php
class UserController extends Controller
{
    public function getAutoWiredParameters()
    {
        return [
            new \Bitrix\Main\Validation\Engine\AutoWire\ValidationParameter(
                CreateUserDto::class,
                fn() => CreateUserDto::createFromRequest($this->getRequest()),
            ),
        ];
    }
    
    public function createAction(CreateUserDto $dto): Result
    {
        // create logic ...
    }
}
```

Если объект `CreateUserDto` невалиден, метод `createAction` не будет выполнен. Контроллер вернет ошибку.

```php
{
    data: null,
    errors:
    [
        {
            code: "name",
            customData: null,
            message: "Значение поля не должно быть пустым",
        },
    ],
    status: "error"
}
```

### Валидаторы без атрибутов

Валидаторы можно применять без атрибутов для разовой проверки данных, когда нет необходимости описывать правила в объекте. Это подходит для старого кода с массивами и нетипизированными переменными.

```php
use Bitrix\Main\Validation\Validator\EmailValidator;
$email = 'bitrix@bitrix.ru';
$validator = new EmailValidator();
$result = $validator->validate($email);
if (!$result->isSuccess())
{
    // ...
}
```

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

## Как создать собственные валидаторы

Каждый валидатор реализует интерфейс `\Bitrix\Main\Validation\Validator\ValidatorInterface` с методом `public function validate(mixed $value): ValidationResult`.

Валидатор выполняет простую задачу -- проверяет значение. Он не определяет, относится ли значение к свойству или классу, и не зависит от атрибутов.

### Пример валидатора Min

1. Класс `Min` реализует интерфейс `ValidatorInterface`.

2. Конструктор принимает минимальное значение.

3. Метод `validate` создает объект `ValidationResult`, который хранит результаты проверки.

   -  Сначала он проверяет, является ли значение числом. Если нет, добавляется ошибка.

   -  Затем проверяет, меньше ли значение заданного минимума. Если да, добавляется соответствующая ошибка.

4. В конце метод возвращает объект `ValidationResult` с результатами проверки.

```php
namespace Bitrix\Main\Validation\Validator;
use Bitrix\Main\Localization\Loc;
use Bitrix\Main\Validation\ValidationError;
use Bitrix\Main\Validation\ValidationResult;
use Bitrix\Main\Validation\Validator\ValidatorInterface;
final class Min implements ValidatorInterface
{
    public function __construct(
        private readonly int $min
    )
    {
    }
    public function validate(mixed $value): ValidationResult
    {
        $result = new ValidationResult();
        if (!is_numeric($value))
        {
            $result->addError(
                new ValidationError(
                    Loc::getMessage('MAIN_VALIDATION_MIN_NOT_A_NUMBER'),
                    failedValidator: $this
                )
            );
            return $result;
        }
        if ($value < $this->min)
        {
            $result->addError(
                new ValidationError(
                    Loc::getMessage('MAIN_VALIDATION_MIN_LESS_THAN_MIN'),
                    failedValidator: $this
                )
            );
        }
        return $result;
    }
}
```

## Как создать атрибуты валидации

Атрибуты валидации разделены на два типа: для свойств и для классов.

### Атрибуты свойств

Атрибуты свойств реализуют интерфейс `\Bitrix\Main\Validation\Rule\PropertyValidationAttributeInterface`. Они используют метод `validateProperty(mixed $propertyValue): ValidationResult` для проверки значений свойств.

Пример простого атрибута для проверки значения свойства:

```php
use Bitrix\Main\Validation\Rule\PropertyValidationAttributeInterface;
use Bitrix\Main\Validation\ValidationError;
use Bitrix\Main\Validation\ValidationResult;

#[Attribute(Attribute::TARGET_PROPERTY)]
class NotOne implements PropertyValidationAttributeInterface
{
    public function validateProperty(mixed $propertyValue): ValidationResult
    {
        $result = new ValidationResult();
        if ($propertyValue === 1) {
            $result->addError(new ValidationError('Значение не должно быть равно 1'));
        }
        return $result;
    }
}
```

Этот атрибут проверяет, что значение свойства не равно 1. Если условие нарушено, возвращается ошибка.

Для сложных проверок используйте абстрактный класс `\Bitrix\Main\Validation\Rule\AbstractPropertyValidationAttribute`. Реализуйте метод `getValidators(): array`, чтобы вернуть список валидаторов.

Пример атрибута `Range`, который проверяет, что значение находится в заданном диапазоне:

```php
use Attribute;
use Bitrix\Main\Validation\Rule\AbstractPropertyValidationAttribute;
use Bitrix\Main\Validation\Validator\Implementation\Max;
use Bitrix\Main\Validation\Validator\Implementation\Min;

#[Attribute(Attribute::TARGET_PROPERTY)]
final class Range extends AbstractPropertyValidationAttribute
{
    public function __construct(
        private readonly int $min,
        private readonly int $max,
        protected ?string $errorMessage = null
    ) {}

    protected function getValidators(): array
    {
        return [
            new Min($this->min),
            new Max($this->max),
        ];
    }
}
```

### Атрибуты класса

Атрибуты класса реализуют интерфейс `\Bitrix\Main\Validation\Rule\ClassValidationAttributeInterface`. Они используют метод `validateObject(object $object): ValidationResult` для проверки объектов.

Пример атрибута для проверки количества свойств:

```php
use Bitrix\Main\Validation\ValidationResult;
use Bitrix\Main\Validation\ValidationError;
use Bitrix\Main\Validation\Rule\AbstractClassValidationAttribute;
use ReflectionClass;

#[Attribute(Attribute::TARGET_CLASS)]
class NotOne extends AbstractClassValidationAttribute
{
    public function validateObject(object $object): ValidationResult
    {
        $result = new ValidationResult();
        $properties = (new ReflectionClass($object))->getProperties();
        
        if (count($properties) > 2) {
            $result->addError(new ValidationError('Класс содержит слишком много свойств'));
        }
        return $result;
    }
}
```

Этот атрибут проверяет, что в классе не больше двух свойств. Если условие нарушено, метод вернет ошибку.

### Сообщение об ошибке для атрибута

Если вы наследуетесь от `AbstractClassValidationAttribute` или `AbstractPropertyValidationAttribute`, можно задать собственное сообщение об ошибке через свойство `$errorMessage`. Это позволит вернуть одну ошибку с вашим текстом вместо стандартных ошибок валидаторов.
