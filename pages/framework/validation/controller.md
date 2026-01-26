---
title: Валидация. Контроллеры
description: 'Валидация. Документация по Bitrix Framework: использование в контроллерах'
---

В контроллерах валидация используется для проверки корректности данных, поступающих из HTTP-запроса. Это позволяет убедиться, что входные параметры соответствуют ожидаемым форматам и бизнес-правилам до выполнения основной логики действия.

Для валидации в контроллере создаётся DTO-класс с атрибутами правил:

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
    ) {}
}
```

Затем в контроллере данные из запроса передаются в DTO, и выполняется валидация:

```php
use Bitrix\Main\DI\ServiceLocator;
use Bitrix\Main\Validation\ValidationService;

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
        
        // Логика создания пользователя...
    }
}
```

## Автоматическая валидация через AutoWire

Чтобы избежать дублирования кода преобразования запроса в DTO, рекомендуется добавить статический фабричный метод в DTO:

```php
use Bitrix\Main\HttpRequest;
final class CreateUserDto
{
    // ... свойства и конструктор

    public static function createFromRequest(HttpRequest $request): self
    {
        return new static(
            login: (string) $request->get('login'),
            password: (string) $request->get('password'),
            passwordRepeat: (string) $request->get('passwordRepeat'),
        );
    }
}
```

Bitrix Framework предоставляет механизм автоматической инъекции и валидации параметров с помощью `ValidationParameter`:

```php
use Bitrix\Main\Validation\Engine\AutoWire\ValidationParameter;
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
    
    public function createAction(CreateUserDto $dto): Result
    {
        // Метод вызовется только если $dto прошёл валидацию.
        // В противном случае контроллер вернёт ошибку в формате JSON:
        // {
        //     "data": null,
        //     "errors": [...],
        //     "status": "error"
        // }
        
        // Логика создания пользователя...
    }
}
```

Если объект DTO не проходит валидацию, метод действия **не выполняется**, а контроллер автоматически возвращает клиенту список ошибок. Это позволяет полностью отделить логику валидации от бизнес-кода и упростить обработку некорректных запросов.