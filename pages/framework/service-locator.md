---
title: Service Locator
description: 'Service Locator. Документация по Bitrix Framework: принципы работы, архитектура и примеры использования.'
---

Service Locator — это шаблон проектирования для управления сервисами приложения. Вместо создания сервисов напрямую, используется специальный объект — Service Locator. Он отвечает за создание и поиск сервисов, что упрощает их использование и замену.

Класс [\\Bitrix\\Main\\DI\\ServiceLocator](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-DI-ServiceLocator.html) реализует интерфейс PSR-11. Доступен с версии main 20.5.400.

Пример использования:

```php
$serviceLocator = \Bitrix\Main\DI\ServiceLocator::getInstance();
if ($serviceLocator->has('someService'))
{
    $someService = $serviceLocator->get('someService');
}
```

## Режим Autowire

По умолчанию Service Locator работает в режиме Autowire — автоматически разрешает все зависимости у сервисов.

Если передать в метод `get()` полное имя существующего класса, контейнер может создать его объект без предварительной регистрации. Для этого конструктор и его зависимости должны допускать автоматическое разрешение.

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

В качестве ключа, который реализует сервис, можно использовать строку, имя класса или интерфейса.

```php
'someModule.someServiceName' => [
    'className' => \VendorName\SomeModule\Services\SomeService::class,
],
\VendorName\SomeModule\Contracts\SomeInterface::class => [
    'className' => \VendorName\SomeModule\Services\SomeService::class,
],
```

## Регистрация сервиса

Чтобы получить сервис по строковому коду, зарегистрируйте его одним из способов ниже. Для получения объекта по имени класса доступен режим Autowire.

1. **Через файл настроек /bitrix/.settings.php или /local/.settings.php**

   Глобальная конфигурация хранится в файле `/bitrix/.settings.php` или `/local/.settings.php`. Если существует `/local/.settings.php`, система использует его вместо `/bitrix/.settings.php`. Настройки этих файлов не объединяются. Подробнее читайте в статье [Настройки](./settings.md).

   Добавьте сервисы в секцию `services` существующего файла настроек. Сохраните остальные секции:

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
               'someModule.someAnotherServiceName' => [
                   'constructor' => static function () {
                       return new \VendorName\SomeModule\Services\SecondService('foo', 'bar');
                   },
               ],
               \VendorName\SomeModule\Contracts\SecondInterface::class => [
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

   -  `getInstance()` — получить экземпляр локатора.

   -  `addInstance(string $code, $service)` — зарегистрировать экземпляр сервиса.

   -  `addInstanceLazy(string $code, $configuration)` — выполнить ленивую регистрацию с конфигурацией, при которой система создаст сервис только при обращении к нему.

   -  `has(string $code)` — проверить наличие сервиса.

   -  `get(string $code)` — получить сервис. Метод создает сервис при первом обращении. Если передать имя существующего класса без регистрации, метод создаст объект в режиме Autowire. Если передать незарегистрированный строковый код, который не является именем существующего класса, метод выбросит исключение `\Bitrix\Main\DI\Exception\ServiceNotFoundException`, которое реализует интерфейс `\Psr\Container\NotFoundExceptionInterface`.

   Подробное описание методов — в [справочнике API](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-DI-ServiceLocator.html).
