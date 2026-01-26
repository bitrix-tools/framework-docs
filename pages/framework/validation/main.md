---
title: Валидация. Основное
description: 'Валидация. Документация по Bitrix Framework: принципы работы, архитектура и примеры использования.'
---

Валидация данных — это проверка входной информации на соответствие ожидаемым правилам. Например, числовой идентификатор должен быть положительным, а email соответствовать формату адреса.

В Bitrix Framework валидацию можно выполнять вручную, но такой подход быстро приводит к дублированию кода и усложняет поддержку. Гораздо удобнее использовать встроенную систему валидации на основе php-атрибутов: она позволяет описать правила прямо в классе и централизованно их проверить.

## Разбираемся на примере

Представим, что нужно создать пользователя с полями email и телефон, при этом должны выполняться условия:
- Если указан email — он должен быть корректным.
- Если указан телефон — он должен быть корректным.
- Хотя бы одно из этих полей обязательно для заполнения.

Это может выглядть следующим образом:
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
        )) {
            $emailOrPhoneExist = true;
            if (!check_email($userData['email'])) {
                $createResult->addError(new Error(
                    "E-mail заполнен некорректно"
                ));
            }
        }

        if (
            array_key_exists('phone', $userData)
            && !is_null($userData['phone'])
            && is_string($userData['phone'])
        )) {
            $emailOrPhoneExist = true;
            // Обратите внимание: функции check_phone() в ядре Bitrix нет —
            // это лишь условный пример ручной проверки.
            if (!check_phone($userData['phone'])) {
                $createResult->addError(new Error(
                    "Телефон заполнен некорректно"
                ));
            }
        }

        if (!$emailOrPhoneExist) {
            $createResult->addError(new Error(
                "Телефон или email обязателен к заполнению"
            ));
        }

        if (!$createResult->isSuccess()) {
            return $createResult;
        }

        // other logic ...
    }
}
```

Этот код работает, но:
- содержит повторяющуюся логику,
- сложно расширять,
- смешивает проверку данных и бизнес-логику.

Перепишем этот код с использованием валидаторов.

{% note warning %}

Система валидации Bitrix Framework работает с объектами, а не с массивами, нам придется создать и использовать специальный класс для передачи данных — его называют DTO (Data Transfer Object).

{% endnote %}

Создадим простую структуру для передачи данных в нашу функцию:

```php
class CreateUser
{
   private ?string $email;
   private ?string $phone;
    
   // getters & setters ...
}
```

Теперь добавим атрибуты с правилами валидации: `#[AtLeastOnePropertyNotEmpty]`, `#[Email]` и `#[Phone]`.
В системе существуют и другие правила валидации, но для демонстрации нашего примера достаточно и этих.
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

Теперь вся наша проверка сведется к передачи значения сервису валидации:
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
        if (!$result->isSuccess()) {
            return $result;
        }

        // other logic ...
    }

}
```

{% cut "Примечание к переходу на валидацию с использованием сервиса" %}

Если вы не хотите или не можете изменять сигнатуру метода, можно создавать DTO внутри:
```php
public function create(array $userData): Result
{
    $createUser = new CreateUser();
    $createUser->setEmail($userData['email']);
    $createUser->setPhone($userData['phone']);

    // ...
}
```
{% endcut %}


## Как это работает?

В системе валидации используются два ключевых понятия:

- **Валидатор** — это объект реализующий интерфейс `\Bitrix\Main\Validation\Validator\ValidatorInterface`, который проверяет конкретное значение. Он не зависит от имени свойства или класса. Например, `EmailValidator` проверяет, соответствует ли значение формату email.
- **Правило** — это php-аттрибут, применяющийся к свойству или классу и определяющий: *какие валидаторы использовать*, *в каком контексте* и *с какими настройками*.

Таким образом:
- валидатор — это механизм проверки,
- правило — это инструкция, где и как его использовать.

{% note warning %}

- Валидация работает через рефлексию: модификаторы доступа игнорируются.

- Если свойство помечено как `nullable` и не было явно установлено, оно пропускается при валидации.

- Если вы присвоили `null` явно — свойство считается инициализированным, и валидация к нему **применяется**.

{% endnote %}

## Рекурсивная валидация

Используйя атрибут `#[Validatable]` можно так же добиться проверки вложенных объектов.

```php
use Bitrix\Main\Validation\Rule\Recursive\Validatable;
use Bitrix\Main\Validation\Rule\NotEmpty;
use Bitrix\Main\Validation\Rule\PositiveNumber;
use Bitrix\Main\DI\ServiceLocator;
use Bitrix\Main\Validation\ValidationService;

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

$payment = new Payment();
$payment->status = '';
$payment->systemCode = '';

$order = new Order();
$order->id = -1;
$order->payment = $payment;

$buyer = new Buyer();
$buyer->id = 0;
$buyer->order = $order;

$result = ServiceLocator::getInstance()
    ->get('main.validation.service')
    ->validate($buyer);

// id: Значение поля должно быть не меньше, чем 1
// order.id: Значение поля должно быть не меньше, чем 1
// order.payment.status: Значение поля не может быть пустым
// order.payment.systemCode: Custom message error
foreach ($result->getErrors() as $error) {
    echo $error->getCode() . ': ' . $error->getMessage(). PHP_EOL;
}
```

## Валидаторы без атрибутов

Валидаторы можно применять без атрибутов для разовой проверки данных, когда нет необходимости описывать правила в объекте. Это подходит для старого кода с массивами и нетипизированными переменными.

```php
use Bitrix\Main\Validation\Validator\EmailValidator;

$email = 'bitrix@bitrix.ru';

$validator = new EmailValidator();
$result = $validator->validate($email);
if (!$result->isSuccess()) {
    // ...
}
```
