---
title: Валидация
description: 'Валидация данных в Bitrix Framework: правила для объектов, вложенных значений, массивов и параметров контроллера.'
---

Валидация данных — это проверка информации на соответствие заданным правилам. Например, числовой идентификатор должен быть положительным, а email — соответствовать формату адреса.

## Как использовать валидацию

В Bitrix Framework данные можно проверять вручную в конструкторе или методах. Ручные проверки приводят к дублированию кода и усложняют его поддержку.

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

-  проверять объекты через единый сервис,

-  проверять параметры действий контроллера до вызова действия,

-  централизованно обрабатывать ошибки.

Правило и валидатор выполняют разные задачи. Правило — PHP-атрибут, который связывает свойство, параметр или класс с проверкой. Валидатор реализует интерфейс `ValidatorInterface`, проверяет переданное значение и возвращает `ValidationResult`.

### Как добавить правила в класс

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
   use Bitrix\Main\Result;
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
           if ($email !== null)
           {
               $user->setEmail($email);
           }
           if ($phone !== null)
           {
               $user->setPhone($phone);
           }

           $result = $this->validation->validate($user);
           if (!$result->isSuccess())
           {
               return $result;
           }

           // save logic ...
           return $result;
       }
    }
   ```

Валидация работает через рефлексию, поэтому модификаторы доступа не влияют на проверку свойств.

{% note warning "" %}

-  Если свойство с типом `nullable` не инициализировано, валидация пропускает его.

-  Если свойству явно присвоено значение `null`, оно считается инициализированным. Сервис передает `null` валидаторам этого свойства.

{% endnote %}

### Вложенные объекты

Используйте атрибут `#[Validatable]` для вложенных объектов.

```php
use Bitrix\Main\Validation\Rule\Recursive\Validatable;
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
// "id: Значение поля должно быть не меньше, чем 1"
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
// "order.id: Значение поля должно быть не меньше, чем 1"
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

### Валидация массивов

Атрибут `#[ElementsType]` проверяет, что все элементы массива соответствуют одному из типов перечисления `\Bitrix\Main\Validation\Rule\Enum\Type`.

-  `Type::Integer` — целое число.

-  `Type::String` — строка.

-  `Type::Float` — число с плавающей точкой.

-  `Type::Numeric` — число или строка с числом, для которой `is_numeric()` возвращает `true`.

```php
use Bitrix\Main\Validation\Rule\ElementsType;
use Bitrix\Main\Validation\Rule\Enum\Type;
use Bitrix\Main\Validation\Rule\NotEmpty;

final class UserSettingsDto
{
    public function __construct(
        // Свойство должно быть непустым массивом
        #[NotEmpty]
        // Все элементы массива должны быть целыми числами
        #[ElementsType(Type::Integer)] // Используем элемент перечисления
        public array $favoriteIds = []
    )
    {}
}

// Пример использования
$settings = new UserSettingsDto([1, 2, 3]);
$result = $validationService->validate($settings); // Успешно

$invalidSettings = new UserSettingsDto([1, 'текст', 3]);
$result = $validationService->validate($invalidSettings); // Ошибка
// Сообщение: "favoriteIds: Неправильный тип аргумента"
```

{% note info "" %}

Атрибут `#[ElementsType]` не проверяет, заполнен ли массив. Для этого требуется дополнительно использовать атрибут `#[NotEmpty]`.

{% endnote %}

Если элементы требуют нескольких правил, создайте для элемента отдельный объект передачи данных (DTO). Атрибут `#[ElementsType]` проверит класс каждого элемента, а `#[Validatable(iterable: true)]` запустит валидацию вложенных объектов.

```php
use Bitrix\Main\Validation\Rule\ElementsType;
use Bitrix\Main\Validation\Rule\Length;
use Bitrix\Main\Validation\Rule\Recursive\Validatable;
use Bitrix\Main\Validation\Rule\RegExp;

// DTO для одного элемента (тега)
final class TagDto
{
    public function __construct(
        #[RegExp('/^[a-z0-9\-_]+$/')]
        #[Length(max: 20)]
        public string $name
    )
    {}
}

final class ArticleDto
{
    public function __construct(
        #[ElementsType(className: TagDto::class)]
        #[Validatable(iterable: true)]
        public array $tags = []
    )
    {}
}

// Использование
$article = new ArticleDto();
$article->tags = [
    new TagDto('tag1'),
    new TagDto('tag2'),
    new TagDto('Invalid Tag!'), // Вызовет ошибку: не соответствует RegExp
];

$result = $validationService->validate($article);
if (!$result->isSuccess())
{
    foreach ($result->getErrors() as $error)
    {
        // Путь к ошибке будет включать индекс элемента, например: "tags.2.name"
        echo $error->getCode() . ': ' . $error->getMessage() . PHP_EOL;
    }
}
```

Массив с разнородными параметрами не задает тип каждого значения. Измените структуру объекта одним из способов:

-  **Преобразуйте массив в свойства объекта.** Если массив содержит пары `ключ => значение`, создайте для каждого параметра отдельное типизированное свойство класса с конкретными атрибутами валидации.

-  **Вынесите массив в отдельный объект.** Создайте класс для данных из массива и добавьте его как типизированное свойство в исходный DTO.

### Валидация в контроллерах

В контроллерах система валидации проверяет данные из запроса до их обработки.

Для скалярного значения добавьте правило непосредственно к параметру действия. Механизм привязки аргументов проверяет значение до вызова действия.

```php
use Bitrix\Main\Engine\Controller;
use Bitrix\Main\Validation\Rule\PositiveNumber;

class UserController extends Controller
{
    public function getAction(#[PositiveNumber] int $id): array
    {
        return ['id' => $id];
    }
}
```

Для набора связанных значений создайте DTO.

```php
use Bitrix\Main\Validation\Rule\NotEmpty;
use Bitrix\Main\Validation\Rule\PhoneOrEmail;

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
}
```

Проверьте DTO в действии контроллера.

```php
use Bitrix\Main\DI\ServiceLocator;
use Bitrix\Main\Engine\Controller;
use Bitrix\Main\Validation\ValidationService;

class UserController extends Controller
{
    private ValidationService $validation;

    protected function init()
    {
        parent::init();

        $this->validation = ServiceLocator::getInstance()->get('main.validation.service');
    }

    public function createAction(): ?array
    {
        $dto = new CreateUserDto();
        $dto->login = (string)$this->getRequest()->get('login');
        $dto->password = (string)$this->getRequest()->get('password');
        $dto->passwordRepeat = (string)$this->getRequest()->get('passwordRepeat');

        $result = $this->validation->validate($dto);
        if (!$result->isSuccess())
        {
            $this->addErrors($result->getErrors());

            return null;
        }

        // create logic ...
        return [];
    }
}
```

Создайте фабричный метод в DTO, чтобы избежать повторения кода.

```php
use Bitrix\Main\HttpRequest;
use Bitrix\Main\Validation\Rule\NotEmpty;
use Bitrix\Main\Validation\Rule\PhoneOrEmail;

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

    public static function createFromRequest(HttpRequest $request): self
    {
        return new static(
            login: (string)$request->get('login'),
            password: (string)$request->get('password'),
            passwordRepeat: (string)$request->get('passwordRepeat'),
        );
    }
}
```

Класс `Bitrix\Main\Validation\Engine\AutoWire\ValidationParameter` создает DTO через указанную фабрику и проверяет его перед передачей в действие.

```php
use Bitrix\Main\Engine\Controller;

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

    public function createAction(CreateUserDto $dto): array
    {
        // create logic ...
        return [];
    }
}
```

При ошибке валидации контроллер не вызывает метод `createAction` и возвращает ошибку.

```json
{
    "data": null,
    "errors": [
        {
            "code": "password",
            "customData": null,
            "message": "Значение поля не может быть пустым"
        }
    ],
    "status": "error"
}
```

### Валидаторы без атрибутов

Применяйте валидаторы без атрибутов для разовой проверки данных, когда нет необходимости описывать правила в объекте. Такой вариант подходит для существующего кода с массивами и нетипизированными переменными.

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

В параметре `errorMessage` можно указать текст, который валидатор вернет при ошибке.

```php
use Bitrix\Main\Validation\Rule\PositiveNumber;

class User
{
    public function __construct(
        #[PositiveNumber(errorMessage: 'Invalid ID!')]
        public readonly int $id
    )
    {}
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

Если сообщение должно зависеть от языка, передайте в параметр `errorMessage` объект `LocalizableMessage`. Параметр `phraseSrcFile` задает PHP-файл, которому принадлежит фраза. Создайте для него языковой файл в каталоге `lang/<код языка>` с сохранением относительного пути и определите в нем элемент массива `$MESS` с указанным кодом.

```php
use Bitrix\Main\Localization\LocalizableMessage;
use Bitrix\Main\Validation\Rule\PositiveNumber;

class User
{
    public function __construct(
        #[PositiveNumber(errorMessage: new LocalizableMessage(
            'MY_MODULE_INVALID_ID',
            phraseSrcFile: __FILE__
        ))]
        public readonly int $id
    )
    {}
}
```

**Пример.** Без параметра `errorMessage` валидатор возвращает стандартное сообщение:

```php
use Bitrix\Main\Validation\Rule\PositiveNumber;
class User
{
    public function __construct(
        #[PositiveNumber]
        public readonly int $id
    )
    {}
}
$user = new User(-150);
/** @var \Bitrix\Main\Validation\ValidationService $service */
$result = $service->validate($user);
foreach ($result->getErrors() as $error)
{
    echo $error->getMessage();
}
// output: 'Значение поля должно быть не меньше, чем 1'
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

Атрибуты свойств:

-  `ElementsType` — проверка типа элементов массива,

-  `Email` — валидация email с отключением предварительной обработки адреса через параметр `strict` и проверкой домена через параметр `domainCheck`,

-  `InArray` — значение входит в массив допустимых значений,

-  `Length` — проверка длины строки,

-  `Max` — максимальное значение,

-  `Min` — минимальное значение,

-  `NotEmpty` — проверка непустого значения с разрешением нуля через параметр `allowZero` и строки из пробелов через параметр `allowSpaces`,

-  `Phone` — валидация телефона,

-  `PhoneOrEmail` — телефон или email,

-  `PositiveNumber` — положительное число,

-  `Range` — значение в диапазоне,

-  `RegExp` — проверка по регулярному выражению с параметрами `flags` и `offset`, которые передаются в `preg_match()`,

-  `Url` — валидный URL,

-  `Json` — валидный JSON.

Атрибуты классов:

-  `AtLeastOnePropertyNotEmpty` — хотя бы одно свойство не пусто,

-  `OnlyOneOfPropertyRequired` — ровно одно из перечисленных свойств не пусто.

Валидаторы:

-  `EmailValidator` — валидация email,

-  `InArrayValidator` — проверка вхождения в массив,

-  `LengthValidator` — проверка длины строки,

-  `MaxValidator` — максимальное значение,

-  `MinValidator` — минимальное значение,

-  `NotEmptyValidator` — не пустое значение,

-  `PhoneValidator` — валидация телефона,

-  `RegExpValidator` — проверка по регулярному выражению,

-  `UrlValidator` — валидация URL,

-  `JsonValidator` — валидация JSON.

## Как создать собственные валидаторы

Каждый валидатор реализует интерфейс `\Bitrix\Main\Validation\Validator\ValidatorInterface` с методом `public function validate(mixed $value): ValidationResult`.

Валидатор проверяет значение. Он не определяет, относится ли значение к свойству или классу, и не зависит от атрибутов.

### Пример валидатора `MinValueValidator`

1. Класс `MinValueValidator` реализует интерфейс `ValidatorInterface`.

2. Конструктор принимает минимальное значение.

3. Метод `validate()` создает объект `ValidationResult`, проверяет тип и минимальное значение, добавляет найденные ошибки и возвращает результат.

```php
namespace Vendor\Module\Validation\Validator;

use Bitrix\Main\Validation\ValidationError;
use Bitrix\Main\Validation\ValidationResult;
use Bitrix\Main\Validation\Validator\ValidatorInterface;

final class MinValueValidator implements ValidatorInterface
{
    public function __construct(
        private readonly int $min
    )
    {}

    public function validate(mixed $value): ValidationResult
    {
        $result = new ValidationResult();
        if (!is_numeric($value))
        {
            $result->addError(
                new ValidationError(
                    'Значение должно быть числом',
                    failedValidator: $this
                )
            );
            return $result;
        }
        if ($value < $this->min)
        {
            $result->addError(
                new ValidationError(
                    'Значение меньше допустимого минимума',
                    failedValidator: $this
                )
            );
        }
        return $result;
    }
}
```

## Как создать атрибуты валидации

Система поддерживает два типа атрибутов валидации: для свойств и для классов.

### Атрибуты свойств

Атрибуты свойств реализуют интерфейс `\Bitrix\Main\Validation\Rule\PropertyValidationAttributeInterface`. Они используют метод `validateProperty(mixed $propertyValue): ValidationResult` для проверки значений свойств.

Пример атрибута для проверки значения свойства:

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
        if ($propertyValue === 1)
        {
            $result->addError(new ValidationError('Значение не должно быть равно 1'));
        }
        return $result;
    }
}
```

Этот атрибут проверяет, что значение свойства не равно `1`. Если условие нарушено, метод возвращает ошибку.

Если для проверки нужно несколько валидаторов, используйте абстрактный класс `\Bitrix\Main\Validation\Rule\AbstractPropertyValidationAttribute`. Реализуйте метод `getValidators(): array`, чтобы вернуть список валидаторов.

Пример атрибута `Range`, который проверяет, что значение находится в заданном диапазоне:

```php
use Attribute;
use Bitrix\Main\Localization\LocalizableMessageInterface;
use Bitrix\Main\Validation\Rule\AbstractPropertyValidationAttribute;
use Bitrix\Main\Validation\Validator\MaxValidator;
use Bitrix\Main\Validation\Validator\MinValidator;

#[Attribute(Attribute::TARGET_PROPERTY)]
final class Range extends AbstractPropertyValidationAttribute
{
    public function __construct(
        private readonly int $min,
        private readonly int $max,
        protected string|LocalizableMessageInterface|null $errorMessage = null
    )
    {}

    protected function getValidators(): array
    {
        return [
            new MinValidator($this->min),
            new MaxValidator($this->max),
        ];
    }
}
```

### Атрибуты класса

Атрибуты класса реализуют интерфейс `\Bitrix\Main\Validation\Rule\ClassValidationAttributeInterface`. Они используют метод `validateObject(object $object): ValidationResult` для проверки объектов.

Пример атрибута `MaximumProperties` для проверки количества свойств:

```php
use Bitrix\Main\Validation\ValidationResult;
use Bitrix\Main\Validation\ValidationError;
use Bitrix\Main\Validation\Rule\AbstractClassValidationAttribute;
use ReflectionClass;

#[Attribute(Attribute::TARGET_CLASS)]
class MaximumProperties extends AbstractClassValidationAttribute
{
    public function validateObject(object $object): ValidationResult
    {
        $result = new ValidationResult();
        $properties = (new ReflectionClass($object))->getProperties();

        if (count($properties) > 2)
        {
            $result->addError(new ValidationError('Класс содержит слишком много свойств'));
        }
        return $result;
    }
}
```

Этот атрибут проверяет, что в классе не больше двух свойств. Если условие нарушено, метод вернет ошибку.

### Сообщение об ошибке для атрибута

Если атрибут наследуется от `AbstractClassValidationAttribute` или `AbstractPropertyValidationAttribute`, задайте сообщение об ошибке через свойство `$errorMessage`. Абстрактный класс заменяет стандартные ошибки валидаторов одной ошибкой с указанным текстом.

**Пример.** Передайте сообщение в конструктор атрибута `Range`:

```php
final class ProductDto
{
    public function __construct(
        #[Range(1, 10, errorMessage: 'Количество должно быть от 1 до 10')]
        public int $quantity
    )
    {}
}
```

Используйте атрибут свойства для проверки одного значения, атрибут класса — для связи между несколькими свойствами, а `#[Validatable]` — для перехода к вложенному объекту.
