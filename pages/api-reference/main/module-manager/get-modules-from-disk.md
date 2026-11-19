---
title: Получить модули с диска ModuleManager::getModulesFromDisk
description: Метод ModuleManager::getModulesFromDisk возвращает модули из каталогов /bitrix/modules и /local/modules со сведениями из их установщиков.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ModuleManager::getModulesFromDisk` возвращает модули, которые есть на диске, установленные и неустановленные. Для каждого каталога модуля метод создает объект установщика через `CModule::CreateModuleObject` и берет сведения из него.

Сигнатура метода в классе `Bitrix\Main\ModuleManager`:

```php
public static function getModulesFromDisk($withLocal = true, $withPartners = true, $withKernel = true)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| withLocal | `bool` | Добавляет модули из `/local/modules` при `true`. По умолчанию — `true` |
| withPartners | `bool` | Добавляет партнерские модули — с точкой в коде, например `vendor.module`. По умолчанию — `true` |
| withKernel | `bool` | Добавляет модули без точки в коде, например `iblock`. По умолчанию — `true` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает массив, ключ — имя каталога модуля. Метод пропускает каталог, если не смог создать для него объект установщика.

Если каталог модуля есть и в `/bitrix/modules`, и в `/local/modules`, в массиве будет одна запись. Сведения в ней метод берет из установщика в `/local/modules`, потому что `CModule::CreateModuleObject` ищет установщик сначала там. Так происходит и при `withLocal`, равном `false`.

#|
|| Ключ | Описание ||
|| id<br>`string` | Код модуля из установщика ||
|| name<br>`string` | Название модуля ||
|| description<br>`string` | Описание модуля ||
|| version<br>`string` | Версия модуля ||
|| versionDate<br>`string` | Дата версии ||
|| sort<br>`int` | Индекс сортировки модуля. По умолчанию — `10000` ||
|| partner<br>`string`, `null` | Название партнера. `null`, если установщик его не задал ||
|| partnerUri<br>`string`, `null` | Адрес сайта партнера. `null`, если установщик его не задал ||
|| isInstalled<br>`bool` | `true`, если модуль установлен ||
|#

## Примеры

**Пример.** Код выводит партнерские модули с диска и их статус:

```php
<?php
use Bitrix\Main\ModuleManager;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$modules = ModuleManager::getModulesFromDisk(true, true, false);

foreach ($modules as $module)
{
    echo $module['id'] . ' ' . ($module['isInstalled'] ? 'installed' : 'not installed') . PHP_EOL;
}
```

## Смотрите также

- [ModuleManager::getInstalledModules](get-installed-modules.md)
