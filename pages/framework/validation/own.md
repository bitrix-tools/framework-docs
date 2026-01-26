---
title: Валидация. Собственные правила и валидаторы
description: 'Валидация. Документация по Bitrix Framework: собственные правила валидации'
---

Иногда встроенных валидаторов и правил недостаточно для реализации специфической бизнес-логики. В таких случаях Bitrix Framework позволяет расширять возможности системы создавая собственные валидаторы и правила.

## Валидатор

Валидатор выполняет простую задачу - проверяет значение. Он не определяет, относится ли значение к свойству или классу, и не зависит от атрибутов.

Создать валидатор очень просто: создайте класс реализующий интерфейс `\Bitrix\Main\Validation\Validator\ValidatorInterface` с публичный методом `validate(mixed $value): ValidationResult`.
Вы можете добавить в конструктор класса необходимые параметры, если ваш валидатор это подразумевает.
В методе `validate` создать объект `ValidationResult`, который будет хранить результаты проверки.
Выполнить необходимые проверки и добавить в `ValidationResult` ошибки.

Пример валидатора для определения является ли значение UUID версии 4:

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
            !is_string($uuid)
            || preg_match('/^[a-f\d]{8}(-[a-f\d]{4}){4}[a-f\d]{8}$/i', $uuid) !== 1
        ) {
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

> В разработке валидаторов старайтесь придерживаться правила fail fast - не ждите пока будут выполнены все проверки, если хотя бы один из критериев не соответствует добавляйте ошибку и возвращайте не успешный результат валидации.


## Правила

В отличии от валидаторов правила не так универсальны и просты, поскольку зависят от применения: к свойствам и к классу. В Bitrix Framework для этого требуется реализация разных интерфейсов.

### Правила для свойства

Правило для свойства реализует интерфейс `Bitrix\Main\Validation\Rule\PropertyValidationAttributeInterface` с публичным методом `validateProperty(mixed $propertyValue): ValidationResult;`.

Пример простого правила для свойства объекта:
```php
use Attribute;
use Bitrix\Main\Validation\Rule\PropertyValidationAttributeInterface;
use Bitrix\Main\Validation\ValidationError;
use Bitrix\Main\Validation\ValidationResult;

#[Attribute(Attribute::TARGET_PROPERTY)]
class UUIDv4 implements PropertyValidationAttributeInterface
{
    public function validateProperty(mixed $propertyValue): ValidationResult
    {
        $result = new ValidationResult();

        if (
            !is_string($propertyValue)
            || preg_match('/^[a-f\d]{8}(-[a-f\d]{4}){4}[a-f\d]{8}$/i', $propertyValue) !== 1
        ) {
            $result->addError(new ValidationError('Значение не должно быть равно 1'));
            return $result;
        }

        return $result;
    }
}
```

Что происходит в этом коде?
Мы описывает класс `UUIDv4`, реализующий интерфейрс `PropertyValidationAttributeInterface` (валидация свойства), который проверяет что указанное значение явялется UUID версии 4. Мы указали что данный класс может являться php-атрибутом чтобы была возможность использовать его в качестве атрибута на проверяемом объекте.

И хотя этого кода вполне достаточно для расширения системы использовать его все равно не очень удобно.
Что не так с этим правилом?
1. Отсутствие валидаторов. Без валидаторов мы переносим проблему дублирования кода контроллеров/сервисов в правила.
2. Отсутствие возможности изменить текст ошибки. 

Для удобства разработчиков был создан абстрактный класс `Bitrix\Main\Validation\Rule\AbstractPropertyValidationAttribute` позволяющий легко избавиться от этих недостатков.

```php
use Attribute;
use Bitrix\Main\Localization\LocalizableMessageInterface;
use UUIDv4Validator;

#[Attribute(Attribute::TARGET_PROPERTY | Attribute::TARGET_PARAMETER)]
class UUIDv4 extends AbstractPropertyValidationAttribute
{
    public function __construct(
        protected string|LocalizableMessageInterface|null $errorMessage = null
    ) {
    }

    protected function getValidators(): array
    {
        return [
            new UUIDv4Validator(),
        ];
    }
}

```

> Наследование `AbstractPropertyValidationAttribute` позволяет вам вернуть одно сообщение об ошибке errorMessage, вместо стандартных ответов валидатора

### Правила для класса

Подобно атрибуту, правило для класса так же имеет свой интерфейс `Bitrix\Main\Validation\Rule\ClassValidationAttributeInterface` с похожим методом `public function validateObject(object $object): ValidationResult;` и так же имеет абстрактный класс для упрощения создания своих правил - `Bitrix\Main\Validation\Rule\AbstractClassValidationAttribute`.

Рассмотрим пример создания правила для класса реализующего логику интервала дат

```php
use Attribute;
use Bitrix\Main\Validation\Rule\AbstractClassValidationAttribute;
use Bitrix\Main\Localization\LocalizableMessage;
use Bitrix\Main\Localization\LocalizableMessageInterface;
use Bitrix\Main\Validation\ValidationError;
use Bitrix\Main\Validation\ValidationResult;
use Bitrix\Main\Type\DateTime;
use ReflectionClass;
use ReflectionProperty;
use Bitrix\Main\Localization\Loc;

Loc::loadMessages(__FILE__);

#[Attribute(Attribute::TARGET_CLASS)]
class DateInterval extends AbstractClassValidationAttribute
{
    public function __construct(
        private readonly string $startDateProperty,
        private readonly string $endDateProperty,
        private readonly bool $allowSameDate = false,
        private readonly bool $allowNullDate = false,
        protected string|LocalizableMessageInterface|null $errorMessage = null
    ) {}

    public function validateObject(object $object): ValidationResult
    {
        $result = new ValidationResult();

        $properties = $this->getProperties($object);

        if (empty($properties)) {
            $result->addError(new ValidationError(
                new LocalizableMessage(
                    "FUSION_INTRANET_VALIDATION_RULE_DATE_INTERVAL_EMPTY_PROPERTIES",
                ),
            ));

            return $this->replaceWithCustomError($result);
        }

        $values = $this->getValues($object, ...$properties);

        $leftValue = $values[$this->startDateProperty] ?? null;
        $rightValue = $values[$this->endDateProperty] ?? null;

        if ($leftValue === null) {
            if ($this->allowNullDate) {
                $leftValue = DateTime::createFromTimestamp(0);
            } else {
                $result->addError(new ValidationError(
                    new LocalizableMessage(
                        "FUSION_INTRANET_VALIDATION_RULE_DATE_INTERVAL_LEFT_BORDER_REQUIRED",
                    ),
                ));
            }
        }

        if ($rightValue === null) {
            if ($this->allowNullDate) {
                $rightValue = DateTime::createFromTimestamp(
                    strtotime("9999-12-31 23:59:59"),
                );
            } else {
                $result->addError(new ValidationError(
                    new LocalizableMessage(
                        "FUSION_INTRANET_VALIDATION_RULE_DATE_INTERVAL_RIGHT_BORDER_REQUIRED",
                    ),
                ));
            }
        }

        if (!$result->isSuccess()) {
            return $this->replaceWithCustomError($result);
        }

        $cmp = $rightValue <=> $leftValue;
        if ($cmp < 0) {
            $result->addError(new ValidationError(
                new LocalizableMessage(
                    "FUSION_INTRANET_VALIDATION_RULE_DATE_INTERVAL_DATE_INTERVAL_INVALID",
                ),
            ));
        } elseif ($cmp === 0 && !$this->allowSameDate) {
            $result->addError(new ValidationError(
                new LocalizableMessage(
                    "FUSION_INTRANET_VALIDATION_RULE_DATE_INTERVAL_DATE_INTERVAL_SAME_NOT_ALLOWED",
                ),
            ));
        }

        return $this->replaceWithCustomError($result);
    }

    private function getProperties(object $object): array
    {
        $reflection = new ReflectionClass($object);

        return array_filter(
            $reflection->getProperties(),
            fn(ReflectionProperty $property): bool => in_array(
                $property->getName(),
                [$this->startDateProperty, $this->endDateProperty],
                true,
            ),
        );
    }

    private function getValues(
        object $object,
        ReflectionProperty ...$properties,
    ): array {
        $values = [];
        foreach ($properties as $property) {
            if ($property->isInitialized($object)) {
                $values[$property->getName()] = $property->getValue($object);
            } else {
                $values[$property->getName()] = null;
            }
        }

        return $values;
    }
}


```

> Наследование `AbstractClassValidationAttribute` позволяет вам вернуть одно сообщение об ошибке errorMessage, вместо стандартных ответов валидатора


