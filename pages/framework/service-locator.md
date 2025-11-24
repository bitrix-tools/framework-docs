---
title: Service Locator
---

Service Locator -- это шаблон проектирования для управления сервисами приложения. Вместо создания сервисов напрямую, используется специальный объект -- Service Locator. Он отвечает за создание и поиск сервисов, что упрощает их использование и замену.

Класс [\\Bitrix\\Main\\DI\\ServiceLocator](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-DI-ServiceLocator.html) реализует интерфейс PSR-11. Доступен с версии main 20.5.400.

Пример использования:
```php
$serviceLocator = \Bitrix\Main\DI\ServiceLocator::getInstance();
if ($serviceLocator->has('someService'))
{
    $someService = $serviceLocator->get('someService');
}
```

## Autowire

По умолчанию сервис-локатор работает в режиме автоваринга, т.е. он автоматически разрешает все зависимости у сервисов.
Помимо этого, контейнер может автоматически создавать объекты указанных классов, даже если их нет в самом контейнере:
```php
$serviceInstance = \Bitrix\Main\DI\ServiceLocator::getInstance()->get(\VendorName\SomeModule\Services\SomeService::class);
```

## Конфигурация сервиса

Конфигурация определяет способ создания объекта. Возможны три варианта:

1. **Указать класс сервиса.** Service Locator создаст сервис вызвав `new $className`.

   ```php
   'someModule.someServiceName' => [
       'className' => \VendorName\SomeModule\Services\SomeService::class,
   ]
   ```

2. **Указать класс сервиса и параметры конструктора.** Service Locator создаст сервис вызвав `new $className('foo', 'bar')`.

   ```php
   'someModule.someServiceName' => [
       'className' => \VendorName\SomeModule\Services\SomeService::class,
       'constructorParams' => ['foo', 'bar'],
   ]
   ```

3. **Указать замыкание-конструктор.** Он создаст и вернет объект сервиса.

   ```php
   'someModule.someAnotherServiceName' => [
       'constructor' => static function () {
           return new \VendorName\SomeModule\Services\SecondService('foo', 'bar');
       },
   ]
   ```

В качестве ключа можно использовать либо строку, либо имя класса или интерфейса, который будет реализовывать сервис:
```php
'someModule.someServiceName' => [
   'className' => \VendorName\SomeModule\Services\SomeService::class,
],
\VendorName\SomeModule\Contracts\SomeInterface::class => [
   'className' => \VendorName\SomeModule\Services\SomeService::class,
],
```

## Регистрация сервиса

Чтобы обратиться к сервису, его нужно зарегистрировать одним из способов.

1. **Через файл настроек bitrix/.settings.php**

   В Bitrix Framework файлы `.settings.php` используются для хранения конфигураций. Они находятся в корне проекта и содержат секции для различных настроек, таких как базы данных, кеширование и сервисы.

   Сервисы регистрируются в секции services.

   ```php
   // /bitrix/.settings.php
   return [
       'services' => [
           'value' => [
               'someServiceName' => [
                   'className' => \VendorName\Services\SomeService::class,
               ],
               \VendorName\SomeModule\Contracts\SecondInterface::class => [
                   'className' => \VendorName\Services\SecondService::class,
                   'constructorParams' => ['foo', 'bar'],
               ],
           ],
           'readonly' => true,
       ],
   ];
   ```

   После инициализации ядра сервисы становятся доступны.

   ```php
   $serviceLocator = \Bitrix\Main\DI\ServiceLocator::getInstance();
   $someGoodServiceName = $serviceLocator->get('someGoodServiceName');
   $someServiceName = $serviceLocator->get('someServiceName');
   ```

2. **Через файл настроек модуля \{moduleName}/.settings.php**

   Файл `.settings.php` в корне модуля описывает сервисы модуля. Это позволяет модулям иметь свои собственные настройки и сервисы, которые не зависят от глобальных настроек.

   ```php
   // someModule/.settings.php
   return [
       'services' => [
           'value' => [
               'someModule.someServiceName' => [
                   'className' => \VendorName\SomeModule\Services\SomeService::class,
               ],
               \VendorName\SomeModule\Contracts\SecondInterface::class => [
                   'constructor' => static function () {
                       return new \VendorName\SomeModule\Services\SecondService('foo', 'bar');
                   },
               ],
               'someModule.someGoodServiceName' => [
                   'className' => \VendorName\SomeModule\Services\SecondService::class,
                   'constructorParams' => static function () {
                       return ['foo', 'bar'];
                   },
               ],
           ],
           'readonly' => true,
       ],
   ];
   ```

   Сервисы регистрируются после подключения модуля. Используйте префикс имени модуля для уникальности, например: `disk.urlManager`, `crm.urlManager`.

3. **Через API**

   Регистрация через API осуществляется методами класса [\\Bitrix\\Main\\DI\\ServiceLocator](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-DI-ServiceLocator.html).

   -  `getInstance()` -- получить экземпляр локатора.

   -  `addInstance(string $code, $service)` -- зарегистрировать экземпляр сервиса.

   -  `addInstanceLazy(string $code, $configuration)` -- выполнить ленивую регистрацию с конфигурацией, при которой сервис будет создан, только в случае обращения к нему.

   -  `has(string $code)` -- проверить наличие сервиса.

   -  `get(string $code)` -- получить сервис. Метод создает сервис при первом обращении. Если сервиса нет, выбрасывается исключение \\Psr\\Container\\NotFoundExceptionInterface.

   Подробное описание методов -- в [справочнике API](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-DI-ServiceLocator.html).
