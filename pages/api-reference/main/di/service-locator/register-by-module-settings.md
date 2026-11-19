---
title: Зарегистрировать сервисы модуля ServiceLocator::registerByModuleSettings
description: Метод ServiceLocator::registerByModuleSettings регистрирует сервисы из секции services файла .settings.php модуля.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ServiceLocator::registerByModuleSettings` регистрирует сервисы из секции `services` файла `.settings.php` модуля. Метод `Loader::includeModule` вызывает его при первом успешном подключении модуля. Для модуля `main` метод вызывает ядро при запуске приложения.

Сигнатура метода в классе `Bitrix\Main\DI\ServiceLocator`:

```php
public function registerByModuleSettings(string $moduleName): void
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| moduleName\* | `string` | Задает идентификатор модуля, например `vendor.module` |

## Возвращаемое значение

Метод ничего не возвращает.

Каждый сервис метод регистрирует через [addInstanceLazy](add-instance-lazy.md). Сервис, код которого уже зарегистрирован, метод пропускает. Так сервис из `.settings.php` сайта или зарегистрированный из кода переопределяет сервис модуля.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DI\Exception\RegistrationException` | В описании сервиса нет ни `className`, ни `constructor` |

## Примеры

**Пример.** Фрагмент `.settings.php` модуля описывает сервис:

```php
<?php
return [
    'services' => [
        'value' => [
            'vendor.module.unitFormatter' => [
                'className' => \Vendor\Module\UnitFormatter::class,
            ],
        ],
        'readonly' => true,
    ],
];
```

**Пример.** Код подключает модуль и получает его сервис. Если модуль не установлен, код сообщает об этом:

```php
<?php
use Bitrix\Main\DI\ServiceLocator;
use Bitrix\Main\Loader;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

if (Loader::includeModule('vendor.module'))
{
    $formatter = ServiceLocator::getInstance()->get('vendor.module.unitFormatter');
    echo get_class($formatter);
}
else
{
    echo 'Module vendor.module is not installed';
}
```

## Смотрите также

- [ServiceLocator::registerByGlobalSettings](register-by-global-settings.md)
- [Сервис-локатор](../../../../framework/service-locator.md)
