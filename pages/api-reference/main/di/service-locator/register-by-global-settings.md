---
title: Зарегистрировать сервисы сайта ServiceLocator::registerByGlobalSettings
description: Метод ServiceLocator::registerByGlobalSettings регистрирует сервисы из секции services файла .settings.php сайта.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ServiceLocator::registerByGlobalSettings` регистрирует сервисы из секции `services` файлов `.settings.php` и `.settings_extra.php` сайта. Значения из `.settings_extra.php` переопределяют значения из `.settings.php`. Ядро вызывает метод при запуске приложения.

Сигнатура метода в классе `Bitrix\Main\DI\ServiceLocator`:

```php
public function registerByGlobalSettings(): void
```

## Возвращаемое значение

Метод ничего не возвращает.

Каждый сервис метод регистрирует через [addInstanceLazy](add-instance-lazy.md). В отличие от [registerByModuleSettings](register-by-module-settings.md), метод не пропускает уже зарегистрированные коды и заменяет их описания. Уже созданные объекты сервисов замена не затрагивает.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DI\Exception\RegistrationException` | В описании сервиса нет ни `className`, ни `constructor` |

## Примеры

**Пример.** Фрагмент `.settings.php` сайта описывает сервис. После запуска приложения метод `ServiceLocator::get` возвращает этот сервис по коду `demo.unitFormatter`:

```php
<?php
return [
    'services' => [
        'value' => [
            'demo.unitFormatter' => [
                'className' => \Vendor\Module\UnitFormatter::class,
            ],
        ],
        'readonly' => true,
    ],
];
```

## Смотрите также

- [ServiceLocator::registerByModuleSettings](register-by-module-settings.md)
- [Сервис-локатор](../../../../framework/service-locator.md)
