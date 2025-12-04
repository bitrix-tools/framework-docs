---
title: Пре- и постфильтры
description: 'Пре- и постфильтры. Документация по Bitrix Framework: принципы работы, архитектура и примеры использования.'
---

Фильтры -- это обработчики, которые выполняются до или после действия контроллера (Action). Они могут отменить выполнение действия или изменить его результат. Фильтры помогают сделать код более модульным и управляемым, обеспечивая дополнительный уровень контроля над выполнением действий.

## Типы фильтров

-  Префильтры (prefilter) -- выполняются до запуска действия. Могут отменить выполнение.

-  Постфильтры (postfilter) -- выполняются после действия. Могут изменить результат.



## Основные фильтры

### Фильтр HTTP-методов

`\Bitrix\Main\Engine\ActionFilter\HttpMethod`

Проверяет HTTP-метод действия и блокирует выполнение, если метод не разрешен. Полезен, когда необходимо ограничить выполнение действия только определенными HTTP-методами, например, POST для изменения данных.



Аругменты:

-  `$allowedMethods` -- список допустимых HTTP-методов. По умолчанию GET.



Пример использования:

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Prefilters;
use Bitrix\Main\Engine\ActionFilter\HttpMethod;

final class Entity extends \Bitrix\Main\Engine\Controller
{
	#[Prefilters([
		new HttpMethod([
			HttpMethod::GET,
			HttpMethod::POST,
		]),
	])]
	public function indexAction()
	{
		// ...
	}
}
```



Имеет аналог в виде атрибута:

```php
use Bitrix\Main\Engine\ActionFilter\HttpMethod;

final class Entity extends \Bitrix\Main\Engine\Controller
{
	#[\Bitrix\Main\Engine\ActionFilter\Attribute\Rule\HttpMethod(
		HttpMethod::METHOD_GET,
		HttpMethod::METHOD_POST,
	)]
	public function indexAction()
	{
		// ...
	}
}
```



### Фильтр аутентификации

`\Bitrix\Main\Engine\ActionFilter\Authentication`

Проверяет аутентификацию пользователя и блокирует действие, если проверка не пройдена (HTTP статус 401). Может перенаправить на страницу авторизации. Используется для защиты действий, требующих аутентификации, например, доступ к личным данным пользователя.



Аругменты:

-  `$enableRedirect` -- включает редирект на авторизацию. По умолчанию `false`.



Пример использования:

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Prefilters;
use Bitrix\Main\Engine\ActionFilter\Authentication;

final class Entity extends \Bitrix\Main\Engine\Controller
{
	#[Prefilters([
		new Authentication(true),
	])]
	public function indexAction()
	{
		// ...
	}
}
```



Имеет аналог в виде атрибута:

```php
final class Entity extends \Bitrix\Main\Engine\Controller
{
	#[\Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Authentication(true)]
	public function indexAction()
	{
		// ...
	}
}
```



### Фильтр CSRF-защиты

`\Bitrix\Main\Engine\ActionFilter\Csrf`

Проверяет наличие и корректность CSRF-токена и блокирует действие, если проверка не пройдена. Необходим для защиты от CSRF-атак, особенно в формах и AJAX-запросах.



Аргументы:

-  `$enabled` -- включает проверку токена. По умолчанию `true`.

-  `$tokenName` -- имя токена. По умолчанию `'sessid`'.

-  `$returnNew` -- возвращает новый токен при неудаче. По умолчанию `true`.



Пример использования:

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Prefilters;
use Bitrix\Main\Engine\ActionFilter\Csrf;

final class Entity extends \Bitrix\Main\Engine\Controller
{
	#[Prefilters([
		new Csrf(
			tokenName: 'sessid',
			returnNew: false,
		),
	])]
	public function indexAction()
	{
		// ...
	}
}
```



Имеет аналог в виде атрибута:

```php
final class Entity extends \Bitrix\Main\Engine\Controller
{
	#[\Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Csrf(
		tokenName: 'sessid',
		returnNew: false,
	)]
	public function indexAction()
	{
		// ...
	}
}
```



### Фильтр закрытия сессии

`\Bitrix\Main\Engine\ActionFilter\CloseSession`

Закрывает сессию перед выполнением действия.  Полезен для повышения производительности, когда изменения в сессии не требуются. Будьте внимательны, так как изменения в сессии после закрытия не сохранятся.



Атрибуты:

-  `$enabled` -- включает фильтр. По умолчанию `true`.



Пример использования:

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Prefilters;
use Bitrix\Main\Engine\ActionFilter\CloseSession;

final class Entity extends \Bitrix\Main\Engine\Controller
{
	#[Prefilters([
		new CloseSession(),
	])]
	public function indexAction()
	{
		// ...
	}
}
```



Имеет аналог в виде атрибута:

```php
final class Entity extends \Bitrix\Main\Engine\Controller
{
	#[\Bitrix\Main\Engine\ActionFilter\Attribute\Rule\CloseSession]
	public function indexAction()
	{
		// ...
	}
}
```



### Фильтр области действия

`\Bitrix\Main\Engine\ActionFilter\Scope`

Блокирует действия для определенного scope. Полезен для ограничения доступа к действиям в зависимости от контекста выполнения, например, только для AJAX-запросов.



Аргументы:

-  `$scopes` -- перечисление допустимых scopes.



Пример использования:

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Prefilters;
use Bitrix\Main\Engine\ActionFilter\Scope;

final class Entity extends \Bitrix\Main\Engine\Controller
{
	#[Prefilters([
		new Scope(
			Scope::AJAX | Scope::REST
		),
	])]
	public function indexAction()
	{
		// ...
	}
}
```



Имеет аналог в виде атрибута:

```php
final class Entity extends \Bitrix\Main\Engine\Controller
{
	#[\Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Scope(
		Scope::AJAX | Scope::REST
	)]
	public function indexAction()
	{
		// ...
	}
}
```



### Фильтр CORS-настроек

`\Bitrix\Main\Engine\ActionFilter\Cors`

Устанавливает заголовки для управления CORS. Используется для настройки CORS, когда требуется доступ к ресурсам с другого домена.



Аргументы:

-  `$origin` -- заголовок Access-Control-Allow-Origin. По умолчанию `null`.

-  `$credentials` -- устанавливает заголовок Access-Control-Allow-Credentials. По умолчанию `false`.



Пример использования:

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Postfilters;
use Bitrix\Main\Engine\ActionFilter\Cors;

final class Entity extends \Bitrix\Main\Engine\Controller
{
	#[Postfilters([
		new Cors()
	])]
	public function indexAction()
	{
		// ...
	}
}
```



Имеет аналог в виде атрибута:

```php
final class Entity extends \Bitrix\Main\Engine\Controller
{
	#[\Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Cors]
	public function indexAction()
	{
		// ...
	}
}
```



### Фильтр типа контента

`\Bitrix\Main\Engine\ActionFilter\ContentType`

Разрешает выполнение действия только для допустимых content-type. Полезен для обеспечения корректной обработки данных в зависимости от типа контента, например, JSON.



Аргументы:

-  `$allowedTypes` -- допустимые content-type.



Пример использования:

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Prefilters;
use Bitrix\Main\Engine\ActionFilter\ContentType;

final class Entity extends \Bitrix\Main\Engine\Controller
{
	#[Prefilters([
		new ContentType([
			'application/json',
		])
	])]
	public function indexAction()
	{
		// ...
	}
}
```

### 

## Как использовать фильтры в контроллерах

Указать фильтры для конкретных действий можно с помощью метода контроллера `configureActions`:

```php
use Bitrix\Main\Engine\ActionFilter\Authentication;
use Bitrix\Main\Engine\ActionFilter\Cors;

final class Entity extends \Bitrix\Main\Engine\Controller
{
	public function configureActions()
	{
		return [
			'index' => [
				'prefilters' => [
					new Authentication(),
				],
				'postfilters' => [
					new Cors(),
				],
			],
		];
	}
	
	public function indexAction()
	{
		// ...
	}
}
```



Тоже самое можно сделать с помощью атрибутов `Prefilters` и `Postfilters`:

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Postfilters;
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\Prefilters;
use Bitrix\Main\Engine\ActionFilter\Authentication;
use Bitrix\Main\Engine\ActionFilter\Cors;

final class Entity extends \Bitrix\Main\Engine\Controller
{
	#[Prefilters([
		new Authentication(),
	])]
	#[Postfilters([
		new Cors(),
	])]
	public function indexAction()
	{
		// ...
	}
}
```



### Фильтры по умолчанию

По умолчанию все действия контроллера используют фильтры `HttpMethod`, `Authentication` и `Csrf`. Чтобы изменить такое поведение, нужно переопределить метод контроллера `getDefaultPreFilters`.

В примере ниже, все действия контроллера будут использовать фильтры `Authentication` и `Cors`:

```php
use Bitrix\Main\Engine\ActionFilter\Authentication;
use Bitrix\Main\Engine\ActionFilter\Cors;

final class Entity extends \Bitrix\Main\Engine\Controller
{
	protected function getDefaultPreFilters()
	{
		return [
			new Authentication(),
		];
	}
	
	protected function getDefaultPostFilters()
	{
		return [
			new Cors(),
		];
	}
	
	public function indexAction()
	{
		// ...
	}

	public function getAction()
	{
		// ...
	}
}
```



Если по какой-то причине нам не нужно использовать префильтры по умолчанию, то нужно передать пустой массив:

```php
final class Entity extends \Bitrix\Main\Engine\Controller
{
	protected function getDefaultPreFilters()
	{
		return [];
	}
}
```



### Дополняющие и вычитающие фильтры

Для гибкой работы с фильтрами можно точечно включать и отключать различные фильтры, сделать это можно с помощью префиксов `+` и `-` при использовании метода `configureActions`:

```phpp
use Bitrix\Main\Engine\ActionFilter\Authentication;
use Bitrix\Main\Engine\ActionFilter\CloseSession;
use Bitrix\Main\Engine\ActionFilter\Csrf;

final class Entity extends \Bitrix\Main\Engine\Controller
{
	protected function getDefaultPreFilters()
	{
		return [
			new Authentication(),
			new Csrf(),
		];
	}
	
	public function configureActions()
	{
		return [
			// Итого для действия `index` будут применены фильтры: CloseSession и Csrf
			'index' => [
				'+prefilters' => [
					new CloseSession()
				],
				'-prefilters' => [
					Authentication::class,
				],
			],
		];
	}
	
	public function indexAction()
	{
		// ...
	}
}
```



И аналогично с использованием атрибутов `EnablePrefilters` и `DisablePrefilters`

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\DisablePrefilters;
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\EnablePrefilters;
use Bitrix\Main\Engine\ActionFilter\Authentication;
use Bitrix\Main\Engine\ActionFilter\CloseSession;
use Bitrix\Main\Engine\ActionFilter\Csrf;

final class Entity extends \Bitrix\Main\Engine\Controller
{
	protected function getDefaultPreFilters()
	{
		return [
			new Authentication(),
			new Csrf(),
		];
	}
	
	#[EnablePrefilters([
		new CloseSession(),
	])]
	#[DisablePrefilters([
		Authentication::class,
	])]
	public function indexAction()
	{
		// ...
	}
}
```



И аналогичным образом работает механика дополнения и вычитания для постфильтров:

```php
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\DisablePostfilters;
use Bitrix\Main\Engine\ActionFilter\Attribute\Rule\EnablePostfilters;
use Bitrix\Main\Engine\ActionFilter\Cors;

final class Entity extends \Bitrix\Main\Engine\Controller
{
	protected function getDefaultPostFilters()
	{
		return [
			new Cors(),
		];
	}
	
	public function configureActions()
	{
		return [
			// Итого для действия `index` будут применен только фильтр AnotherPostFilter
			'index' => [
				'+postfilters' => [
					new AnotherPostFilter(),
				],
				'-postfilters' => [
					Cors::class,
				],
			],
		];
	}
	
	public function indexAction()
	{
		// ...
	}
	
	#[EnablePostfilters([
		new AnotherPostFilter(),
	])]
	#[DisablePostfilters([
		Cors::class,
	])]
	public function getAction()
	{
		// ...
	}
}
```



{% note warning "" %}

Важно отметить, то в случае дополнения фильтров нужно отправлять **объект** фильтра, а в случае вычитания **имя класса**

{% endnote %}
