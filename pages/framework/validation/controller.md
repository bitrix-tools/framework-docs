---
title: Валидация в контроллерах
description: 'Валидация. Документация по Bitrix Framework: использование в контроллерах'
---

Валидация входящих данных — обязательный этап не только для слоя бизнес-функций, но и обработки HTTP-запроса. Она гарантирует, что запрос с несоответствующими ожидаемым форматам и правилам параметры будет остановлен с ошибкой раньше.

Передача валидации на уровень контроллера (с использованием PHP-атрибутов и встроенного механизма) позволяет избавиться от ручных проверок внутри методов. Это делает код чище, снижает риск ошибок и гарантирует унифицированный формат ответов с ошибками для клиентской части.

## Валидация простых типов данных

Для проверки скалярных значений (чисел, строк) достаточно добавить атрибут валидации к аргументу метода действия.
Рассмотрим пример, где идентификатор пользователя должен быть положительным числом.

**Ручная проверка (устаревший подход):**

```php
class AwardController extends Controller
{
    public function getByUserIdAction(int $userId): array
    {
        $awards = [];

        if ($userId <= 0) {
            throw new Exception("Неправильно указан идентификатор пользователя");
        }

        // Логика получения данных...

        return $awards;
    }
}
```

**Валидация через атрибуты:**

Используйте атрибут `#[PositiveNumber]`. Контроллер автоматически проверит значение до выполнения метода.

```php
use Bitrix\Main\Validation\Rule\PositiveNumber;

class AwardController extends Controller
{
    public function getByUserIdAction(
        #[PositiveNumber]
        int $userId
    ): array
    {
        $awards = [];

        // Логика получения данных...

        return $awards;
    }
}
```

Если валидация не пройдет, метод не выполнится, а клиент получит ошибку в стандартном формате.

Пример AJAX-запроса с невалидными данными:

```js
BX.ajax.runAction(
    'fusion:badge.Award.getByUserId',
    {
        data: {
            userId: -1
        }
    }
);
```

Ответ сервера:

```json
{
    "status":"error",
    "data":null,
    "errors":[
        {
            "message":"Invalid value to match parameter: [userId] Значение поля должно быть не меньше, чем 1.",
            "code":100,
            "customData":null
        }
    ]
}
```

## Автоматическая валидация через AutoWire

Чтобы избежать ручного заполнения DTO (Data Transfer Object) из запроса в каждом действии, используется механизм `AutoWire` с параметром `ValidationParameter`.

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
```

Затем подключите фабричный метод в контроллере через `getAutoWiredParameters`:

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

    public function createAction(CreateUserDto $dto): ?array
    {
        // Метод выполнится только если $dto прошел валидацию.
        // Иначе контроллер автоматически вернет ошибку.
        
        // Логика создания пользователя...
    }
}
```

Если данные в запросе не соответствуют правилам валидации, указанным в DTO, действие `createAction` не будет вызвано, а клиенту сразу вернется JSON с перечнем ошибок.