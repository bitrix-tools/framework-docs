---
title: Валидация данных в Bitrix Framework
description: 'Документация по системе валидации Bitrix Framework: принципы работы, архитектура, встроенные правила и создание собственных валидаторов.'
---

Валидация данных — это проверка входной информации на соответствие ожидаемым правилам. Например, числовой идентификатор должен быть положительным, а email соответствовать формату адреса.

В Bitrix Framework валидацию можно выполнять вручную, но такой подход быстро приводит к дублированию кода и усложняет поддержку. Гораздо удобнее использовать встроенную систему валидации на основе PHP-атрибутов: она позволяет описать правила прямо в классе и централизованно их проверить.

Этот подход гарантирует, что запрос с несоответствующими параметрами будет остановлен с ошибкой раньше выполнения бизнес-логики, делает код чище и обеспечивает унифицированный формат ответов для клиентской части.

## Основные понятия

В системе валидации используются два ключевых понятия:

- **Валидатор** — это объект, реализующий интерфейс `\Bitrix\Main\Validation\Validator\ValidatorInterface`, который проверяет конкретное значение. Он не зависит от имени свойства или класса. Например, `EmailValidator` проверяет, соответствует ли значение формату email.
- **Правило** — это PHP-атрибут, применяющийся к свойству или классу и определяющий: *какие валидаторы использовать*, *в каком контексте* и *с какими настройками*.

Таким образом:
- валидатор — это механизм проверки,
- правило — это инструкция, где и как его использовать.

{% note warning %}

Важные особенности работы системы:

- Валидация работает через рефлексию: модификаторы доступа (private, protected) игнорируются.
- Если свойство помечено как `nullable` и не было явно установлено, оно пропускается при валидации.
- Если вы присвоили `null` явно — свойство считается инициализированным, и валидация к нему **применяется**.

{% endnote %}

## Быстрый старт: от ручной проверки к атрибутам

Рассмотрим задачу создания пользователя с полями email и телефон. Условия:
- Если указан email — он должен быть корректным.
- Если указан телефон — он должен быть корректным.
- Хотя бы одно из этих полей обязательно для заполнения.

### Ручная проверка (устаревший подход)

```php
use Bitrix\Main\Result;
use Bitrix\Main\Error;

class UserService
{
    public function create(array $userData): Result
    {
        $createResult = new Result();

        $emailOrPhoneExist = false;
        if (
            array_key_exists('email', $userData)
            && !is_null($userData['email'])
            && is_string($userData['email'])
        )
        {
            $emailOrPhoneExist = true;
            if (!check_email($userData['email']))
            {
                $createResult->addError(new Error(
                    'E-mail заполнен некорректно'
                ));
            }
        }

        if (
            array_key_exists('phone', $userData)
            && !is_null($userData['phone'])
            && is_string($userData['phone'])
        )
        {
            $emailOrPhoneExist = true;
            // Обратите внимание: функции check_phone() в ядре Bitrix нет —
            // это лишь условный пример ручной проверки.
            if (!check_phone($userData['phone']))
            {
                $createResult->addError(new Error(
                    'Телефон заполнен некорректно'
                ));
            }
        }

        if (!$emailOrPhoneExist)
        {
            $createResult->addError(new Error(
                'Телефон или email обязателен к заполнению'
            ));
        }

        if (!$createResult->isSuccess())
        {
            return $createResult;
        }

        // other logic ...
    }
}
```

Этот код работает, но содержит повторяющуюся логику, сложно расширяется и смешивает проверку данных с бизнес-логикой.

### Валидация через атрибуты

Система валидации Bitrix Framework работает с объектами. Нам потребуется создать класс для передачи данных (DTO — Data Transfer Object).

```php
use Bitrix\Main\Validation\Rule\AtLeastOnePropertyNotEmpty;
use Bitrix\Main\Validation\Rule\Email;
use Bitrix\Main\Validation\Rule\Phone;

#[AtLeastOnePropertyNotEmpty(['email', 'phone'])]
class CreateUser
{
   #[Email]
   private ?string $email;

   #[Phone]
   private ?string $phone;

   // getters & setters...
}
```

Теперь проверка сведется к передаче объекта сервису валидации:

```php
use Bitrix\Main\Result;
use Bitrix\Main\DI\ServiceLocator;
use Bitrix\Main\Validation\ValidationService;

class UserService
{
    private ValidationService $validation;

    public function __construct()
    {
       $this->validation = ServiceLocator::getInstance()->get('main.validation.service');
    }

    public function create(CreateUser $userData): Result
    {
        $result = $this->validation->validate($userData);

        if (!$result->isSuccess())
        {
            return $result;
        }

        // other logic ...
    }
}
```

{% cut "Примечание к переходу на валидацию с использованием сервиса" %}

Если вы не хотите или не можете изменять сигнатуру метода, можно создавать DTO внутри метода:

```php
public function create(array $userData): Result
{
    $createUser = new CreateUser();
    $createUser->setEmail($userData['email']);
    $createUser->setPhone($userData['phone']);

    // ... вызов валидации
}
```

{% endcut %}

## Использование в контроллерах

Валидация входящих данных обязательна не только для слоя бизнес-функций, но и для обработки HTTP-запроса. Передача валидации на уровень контроллера позволяет избавиться от ручных проверок внутри методов действий.

### Валидация простых типов данных

Для проверки скалярных значений (чисел, строк) достаточно добавить атрибут валидации к аргументу метода действия.

**Пример:** идентификатор пользователя должен быть положительным числом.

```php
use Bitrix\Main\Validation\Rule\PositiveNumber;
use Bitrix\Main\Controller;

class AwardController extends Controller
{
    public function getByUserIdAction(
        #[PositiveNumber]
        int $userId
    ): array
    {
        // Метод выполнится только если валидация прошла успешно.
        // Логика получения данных...
        
        return [];
    }
}
```

Если валидация не пройдет, метод не выполнится, а клиент получит ошибку в стандартном формате JSON.

### Автоматическая валидация DTO через AutoWire

Чтобы избежать ручного заполнения DTO из запроса, используется механизм `AutoWire` с параметром `ValidationParameter`.

```php
use Bitrix\Main\HttpRequest;
use Bitrix\Main\Validation\Rule\NotEmpty;
use Bitrix\Main\Validation\Rule\PhoneOrEmail;
use Bitrix\Main\Controller;
use Bitrix\Main\Validation\Engine\AutoWire\ValidationParameter;

final class CreateUserDto
{
    public function __construct(
        #[PhoneOrEmail]
        public ?string $login = null,

        #[NotEmpty]
        public ?string $password = null,

        #[NotEmpty]
        public ?string $passwordRepeat = null,
    ) {}

    public static function createFromRequest(HttpRequest $request): self
    {
        return new static(
            login: (string) $request->get('login'),
            password: (string) $request->get('password'),
            passwordRepeat: (string) $request->get('passwordRepeat'),
        );
    }
}

class UserController extends Controller
{
    public function getAutoWiredParameters()
    {
        return [
            new ValidationParameter(
                CreateUserDto::class,
                fn() => CreateUserDto::createFromRequest($this->getRequest()),
            ),
        ];
    }

    public function createAction(CreateUserDto $dto): ?array
    {
        // Метод выполнится только если $dto прошел валидацию.
        // Иначе контроллер автоматически вернет ошибку.
        
        // Логика создания пользователя...
    }
}
```

## Рекурсивная валидация

Используя атрибут `#[Validatable]`, можно добиться проверки вложенных объектов.

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
```

При валидации объекта `Buyer` система автоматически проверит вложенные `Order` и `Payment`. Ошибки будут содержать путь к полю (например, `order.payment.status`).

## Справочник встроенных правил

Bitrix Framework предоставляет готовые атрибуты для частых сценариев.

### Правила для классов

Эти атрибуты навешиваются на класс DTO.

#### `AtLeastOnePropertyNotEmpty`
Проверяет заполненность хотя бы одного из указанных свойств.
- **Класс:** `Bitrix\Main\Validation\Rule\AtLeastOnePropertyNotEmpty`
- **Параметры:** `propertyNames` (array), `allowZero` (bool), `allowEmptyString` (bool), `errorMessage`.

```php
#[AtLeastOnePropertyNotEmpty(
    propertyNames: ['id', 'uuid'],
    errorMessage: "Нельзя однозначно идентифицировать пользователя"
)]
class UpdateUserName { ... }
```

#### `OnlyOneOfPropertyRequired`
Проверяет, что ровно одно из указанных свойств содержит непустое значение.
- **Класс:** `Bitrix\Main\Validation\Rule\OnlyOneOfPropertyRequired`
- **Параметры:** `propertyNames` (array), `errorMessage`.

```php
#[OnlyOneOfPropertyRequired(
    propertyNames: ['userId', 'email'],
    errorMessage: 'Укажите ТОЛЬКО один идентификатор'
)]
class UserLookupRequest { ... }
```

### Правила для свойств и параметров

Эти атрибуты навешиваются на свойства классов или аргументы методов.

#### `ElementsType`
Проверяет, что все элементы в массиве соответствуют типу или классу.
- **Класс:** `Bitrix\Main\Validation\Rule\ElementsType`
- **Параметры:** `typeEnum` (Integer, String, Float, Numeric), `className`, `errorMessage`.

```php
#[ElementsType(typeEnum: Type::Integer, errorMessage: "ID должны быть числами")]
public array $roleIds;
```

#### `Email`
Проверяет формат электронной почты.
- **Класс:** `Bitrix\Main\Validation\Rule\Email`
- **Параметры:** `strict` (bool), `domainCheck` (bool), `errorMessage`.
- **Опции:** `domainCheck` проверяет MX и A записи домена.

#### `InArray`
Проверяет вхождение значения в список допустимых.
- **Класс:** `Bitrix\Main\Validation\Rule\InArray`
- **Параметры:** `validValues` (array), `strict` (bool), `errorMessage`.

#### `Json`
Проверяет, что строка является корректным JSON.
- **Класс:** `Bitrix\Main\Validation\Rule\Json`

#### `Length`
Проверяет длину строки (мин/макс).
- **Класс:** `Bitrix\Main\Validation\Rule\Length`
- **Параметры:** `min` (float), `max` (int), `errorMessage`.

#### `Max` / `Min`
Проверяют числовые границы.
- **Классы:** `Bitrix\Main\Validation\Rule\Max`, `Bitrix\Main\Validation\Rule\Min`
- **Параметры:** `max`/`min` (int), `errorMessage`.

#### `NotEmpty`
Проверяет, что значение не пустое.
- **Класс:** `Bitrix\Main\Validation\Rule\NotEmpty`
- **Параметры:** `allowZero` (bool), `allowSpaces` (bool), `errorMessage`.

#### `Phone` / `PhoneOrEmail`
Проверяют формат телефона или комбинацию телефон/email.
- **Классы:** `Bitrix\Main\Validation\Rule\Phone`, `Bitrix\Main\Validation\Rule\PhoneOrEmail`
- **Параметры:** `strict` (bool), `domainCheck` (bool), `errorMessage`.

#### `PositiveNumber`
Проверяет, что число строго больше нуля.
- **Класс:** `Bitrix\Main\Validation\Rule\PositiveNumber`

#### `Range`
Проверяет диапазон чисел (от min до max включительно).
- **Класс:** `Bitrix\Main\Validation\Rule\Range`
- **Параметры:** `min`, `max`, `errorMessage`.

#### `RegExp`
Проверяет соответствие регулярному выражению.
- **Класс:** `Bitrix\Main\Validation\Rule\RegExp`
- **Параметры:** `pattern`, `flags`, `offset`, `errorMessage`.

#### `Url`
Проверяет корректность URL-адреса.
- **Класс:** `Bitrix\Main\Validation\Rule\Url`

## Создание собственных валидаторов и правил

Если встроенных инструментов недостаточно, вы можете расширить систему.

### Создание валидатора

Валидатор выполняет простую задачу — проверяет значение. Он не зависит от атрибутов.
Необходимо реализовать интерфейс `\Bitrix\Main\Validation\Validator\ValidatorInterface`.

```php
use Bitrix\Main\Localization\Loc;
use Bitrix\Main\Validation\ValidationError;
use Bitrix\Main\Validation\ValidationResult;
use Bitrix\Main\Validation\Validator\ValidatorInterface;

class UUIDv4Validator implements ValidatorInterface
{
    public function validate(mixed $value): ValidationResult
    {
        $result = new ValidationResult();

        if (
            !is_string($value)
            || preg_match('/^[a-f\d]{8}(-[a-f\d]{4}){4}[a-f\d]{8}$/i', $value) !== 1
        )
        {
            $result->addError(new ValidationError(
                message: Loc::getMessage('FUSION_VALIDATION_VALIDATOR_UUIDV4_NOT_VALID'),
                failedValidator: $this
            ));
            return $result;
        }

        return $result;
    }
}
```

> В разработке валидаторов старайтесь придерживаться правила fail fast: если критерий не соответствует, сразу добавляйте ошибку и возвращайте результат.

### Создание правил (Атрибутов)

Правила зависят от контекста применения: к свойствам или к классу.

#### Правило для свойства

Реализует интерфейс `PropertyValidationAttributeInterface`. Для удобства рекомендуется наследоваться от `AbstractPropertyValidationAttribute`.

```php
use Attribute;
use Bitrix\Main\Validation\Rule\AbstractPropertyValidationAttribute;
use Bitrix\Main\Localization\LocalizableMessageInterface;
use UUIDv4Validator;

#[Attribute(Attribute::TARGET_PROPERTY | Attribute::TARGET_PARAMETER)]
class UUIDv4 extends AbstractPropertyValidationAttribute
{
    public function __construct(
        protected string|LocalizableMessageInterface|null $errorMessage = null
    )
    {
    }

    protected function getValidators(): array
    {
        return [
            new UUIDv4Validator(),
        ];
    }
}
```

Наследование `AbstractPropertyValidationAttribute` позволяет вернуть кастомное сообщение об ошибке `errorMessage` вместо стандартных ответов валидатора.

#### Правило для класса

Реализует интерфейс `ClassValidationAttributeInterface`. Рекомендуется наследоваться от `AbstractClassValidationAttribute`.
Пример правила для проверки интервала дат:

```php
use Attribute;
use Bitrix\Main\Validation\Rule\AbstractClassValidationAttribute;
use Bitrix\Main\Localization\LocalizableMessage;
use Bitrix\Main\Validation\ValidationError;
use Bitrix\Main\Validation\ValidationResult;
use Bitrix\Main\Type\DateTime;
use ReflectionClass;
use ReflectionProperty;

#[Attribute(Attribute::TARGET_CLASS)]
class DateInterval extends AbstractClassValidationAttribute
{
    public function __construct(
        private readonly string $startDateProperty,
        private readonly string $endDateProperty,
        protected string|LocalizableMessageInterface|null $errorMessage = null
    )
    {
    }

    public function validateObject(object $object): ValidationResult
    {
        $result = new ValidationResult();
        // Логика получения значений через рефлексию
        $properties = $this->getProperties($object);
        $values = $this->getValues($object, ...$properties);

        $leftValue = $values[$this->startDateProperty] ?? null;
        $rightValue = $values[$this->endDateProperty] ?? null;

        // Пример проверки логики дат
        if (
            $leftValue
            && $rightValue
            && $rightValue < $leftValue
        )
        {
             $result->addError(new ValidationError(
                new LocalizableMessage('Дата окончания не может быть раньше даты начала')
            ));
        }

        return $this->replaceWithCustomError($result);
    }
    
    // ... вспомогательные методы getProperties, getValues
}
```

## Дополнительные возможности

### Кастомизация сообщений об ошибках

Можно указать свой текст ошибки прямо в атрибуте.

```php
use Bitrix\Main\Validation\Rule\PositiveNumber;

class User
{
    public function __construct(
        #[PositiveNumber(errorMessage: 'Invalid ID!')]
        public readonly int $id,
    )
    {}
}
```

Если требуется указать языкозависимый текст, сделать это можно указав вместо конкретного текста объект реализующий языкозависимый интерфейс `Bitrix\Main\Localization\LocalizableMessageInterface`.

```php
use Bitrix\Main\Validation\Rule\PositiveNumber;
use Bitrix\Main\Localization\LocalizableMessage;

class User
{
    public function __construct(
        #[PositiveNumber(
            errorMessage: new LocalizableMessage('FUSION_USER_ERROR_PARAMETER_ID')
        )]
        public readonly int $id,
    )
    {}
}
```

### Получение сработавшего валидатора

Результат валидации хранит ошибки `\Bitrix\Main\Validation\ValidationError`. Каждая ошибка содержит свойство `failedValidator`.

```php
$errors = $service->validate($dto)->getErrors();
foreach ($errors as $error) {
    $failedValidator = $error->getFailedValidator();
    // ...
}
```

### Валидаторы без атрибутов

Валидаторы можно применять без атрибутов для разовой проверки данных, когда нет необходимости описывать правила в объекте (например, для старого кода с массивами).

```php
use Bitrix\Main\Validation\Validator\EmailValidator;

$email = 'bitrix@bitrix.ru';

$validator = new EmailValidator();
$result = $validator->validate($email);
if (!$result->isSuccess()) {
    // Обработка ошибки
}
```