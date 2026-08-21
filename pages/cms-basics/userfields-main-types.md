---
title: Типы и компоненты пользовательских полей в главном модуле
description: 'Типы и компоненты пользовательских полей в главном модуле. Как связать тип поля с компонентом main.field.* и шаблонами отрисовки.'
---

Главный модуль связывает тип пользовательского поля с PHP-классом и компонентом отрисовки. Тип задает идентификатор, базовый тип, настройки и способ хранения. Компонент `main.field.*` формирует HTML для просмотра, редактирования, фильтра и формы настройки.

Механизм нужен, когда стандартных типов недостаточно и поле должно получить собственную разметку.

Как создать поле, задать его настройки и работать со значениями, читайте в статье [Пользовательские поля](./userfields).
Как вывести готовое поле методами менеджера и классом `Renderer`, читайте в статье [Отрисовка пользовательских полей в главном модуле](./userfields-main-rendering).

## Из чего состоит тип поля

Класс типа наследует `Bitrix\Main\UserField\Types\BaseType` или один из готовых типов главного модуля. Родительский класс формирует часть описания для менеджера пользовательских полей. Наследник задает код типа, базовый тип и компонент отрисовки.

```php
namespace Vendor\Project\UserField\Types;

use Bitrix\Main\Localization\Loc;
use Bitrix\Main\UserField\Types\StringType;
use CUserTypeManager;

Loc::loadMessages(__FILE__);

class CodeType extends StringType
{
    public const USER_TYPE_ID = 'vendor_code';
    public const RENDER_COMPONENT = 'vendor:main.field.code';

    public static function getDescription(): array
    {
        return [
            'DESCRIPTION' => Loc::getMessage('VENDOR_CODE_TYPE_DESCRIPTION'),
            'BASE_TYPE' => CUserTypeManager::BASE_TYPE_STRING,
        ];
    }
}
```

В примере тип наследует `StringType`, поэтому хранит, проверяет и готовит настройки так же, как строковое поле.

{% note info "" %}

Метод `getDbColumnType()` объявлен в `BaseType` абстрактным. Готовые типы главного модуля его уже реализуют, но если наследовать `BaseType` напрямую, метод придется описать самому — он задает тип колонки в базе данных.

{% endnote %}

Чтобы главный модуль нашел класс, зарегистрируйте его в автозагрузке. Для файлов вне модулей передайте `null` первым аргументом, а путь укажите от корня сайта.

```php
use Bitrix\Main\Loader;

Loader::registerAutoLoadClasses(null, [
    'Vendor\Project\UserField\Types\CodeType' => '/local/php_interface/lib/UserField/Types/CodeType.php',
]);
```

Разместите вызов в файле `local/php_interface/init.php`: главный модуль подключает его на каждой странице.

Вызов `Loc::loadMessages(__FILE__)` ищет папку `lang` рядом с файлом класса, а затем выше по дереву каталогов. Положите сообщение для ключа `VENDOR_CODE_TYPE_DESCRIPTION` в файл `lang/ru/CodeType.php` рядом с классом типа.

```php
$MESS['VENDOR_CODE_TYPE_DESCRIPTION'] = 'Код';
```

Если языковые файлы не нужны, подставьте в `getDescription()` строку с названием типа вместо вызова `Loc::getMessage()`.

## Зарегистрировать тип поля

Менеджер пользовательских полей получает типы через событие `OnUserTypeBuildList`. Обработчик `getUserTypeDescription()` возвращает массив описания типа.

Для локальной регистрации обработчика используйте `addEventHandlerCompatible()`, потому что событие вызывается через классический механизм `GetModuleEvents()`.

```php
use Bitrix\Main\EventManager;
use Vendor\Project\UserField\Types\CodeType;

EventManager::getInstance()->addEventHandlerCompatible(
    'main',
    'OnUserTypeBuildList',
    [CodeType::class, 'getUserTypeDescription']
);
```

Разместите вызов в том же файле `local/php_interface/init.php`, где зарегистрирована автозагрузка класса. Без обработчика менеджер не узнает о типе.

После регистрации тип можно указать в параметре `USER_TYPE_ID` при создании пользовательского поля.

## Создать компонент отрисовки

Компонент `main.field.*` формирует HTML поля во всех режимах. Класс типа указывает на компонент константой `RENDER_COMPONENT`, а шаблоны компонента задают разметку каждого режима.

### Связать тип с компонентом

Константа `RENDER_COMPONENT` задает компонент, который главный модуль подключает при отрисовке поля. Класс `BaseType` дополняет ее значение префиксом `bitrix:`, если пространство имен не указано:

-  `vendor:main.field.code` — остается без изменений,

-  `main.field.code` — становится `bitrix:main.field.code`.

Компоненты главного модуля именуют так:

| Тип поля | Компонент |
| --- | --- |
| `string` | `bitrix:main.field.string` |
| `string_formatted` | `bitrix:main.field.stringformatted` |
| `integer` | `bitrix:main.field.integer` |
| `double` | `bitrix:main.field.double` |
| `boolean` | `bitrix:main.field.boolean` |
| `date` | `bitrix:main.field.date` |
| `datetime` | `bitrix:main.field.datetime` |
| `enumeration` | `bitrix:main.field.enum` |
| `file` | `bitrix:main.field.file` |
| `url` | `bitrix:main.field.url` |

В поставке также есть компоненты `bitrix:main.field.element` и `bitrix:main.field.section`. Они выводят поля, которые связывают значение с элементами и разделами инфоблоков. Полный список системных типов данных смотрите в статье [Пользовательские поля](./userfields#типы-данных).

Полный порядок, в котором менеджер выбирает способ отрисовки, описан в статье [Отрисовка пользовательских полей в главном модуле](./userfields-main-rendering).

### Написать класс компонента

Компонент пользовательского поля наследует `Bitrix\Main\Component\BaseUfComponent` и возвращает код типа поля в методе `getUserTypeId()`.

```php
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
    die();
}

use Bitrix\Main\Component\BaseUfComponent;
use Vendor\Project\UserField\Types\CodeType;

class CodeUfComponent extends BaseUfComponent
{
    protected static function getUserTypeId(): string
    {
        return CodeType::USER_TYPE_ID;
    }
}
```

Базовый компонент передает в шаблон массив `$arResult` с подготовленными значениями:

-  `userField` — описание пользовательского поля,

-  `fieldName` — имя HTML-контрола,

-  `value` — значение поля в виде массива,

-  `additionalParameters` — дополнительные параметры вызова, среди них `NAME` для формы настроек.

### Добавить шаблоны для режимов

Папки шаблонов компонента соответствуют режимам отрисовки. Например, тип и компонент `vendor:main.field.code` рассчитаны на просмотр, редактирование и форму настроек поля, поэтому получают такую структуру:

```text
local/
├── php_interface/
│   ├── init.php
│   └── lib/
│       └── UserField/
│           └── Types/
│               ├── CodeType.php
│               └── lang/
│                   └── ru/
│                       └── CodeType.php
└── components/
    └── vendor/
        └── main.field.code/
            ├── class.php
            └── templates/
                ├── main.view/
                │   └── .default.php
                ├── main.edit/
                │   └── .default.php
                └── main.admin_settings/
                    └── .default.php
```

Базовый компонент выбирает папку шаблона по имени режима. Всего режимов восемь:

-  `main.view` — просмотр значения в публичной части,

-  `main.edit` — контрол редактирования в публичной части,

-  `main.edit_form` — контрол в административной форме,

-  `main.admin_settings` — форма настроек поля,

-  `main.filter_html` — контрол в фильтре административного списка,

-  `main.admin_list_view_html` — значение в ячейке административного списка,

-  `main.admin_list_edit_html` — контрол в ячейке административного списка,

-  `main.public_text` — значение без разметки.

Режимы `main.view` и `main.edit` доступны в коде как константы `BaseType::MODE_VIEW` и `BaseType::MODE_EDIT`. Их передают в класс `Renderer`, когда режим вывода задают явно.

Остальные шесть режимов главный модуль подставляет сам. Обратиться к ним из кода нельзя: их константы закрыты.

Добавьте папки для всех режимов, в которых поле должно появляться. Если папки нужного режима нет, компонент ищет папку `.default`, а без нее выводит ошибку шаблона. Шаблоны родительского типа в этот момент не подключаются: константа `RENDER_COMPONENT` уже указывает на ваш компонент.

Есть и обратный вариант: не переопределяйте `RENDER_COMPONENT`, и тогда главный модуль во всех режимах подключит компонент родительского типа. Такой тип меняет хранение или проверку значения, но не разметку.

{% note tip "" %}

Какие методы вывода отвечают за каждый режим, читайте в статье [Отрисовка пользовательских полей в главном модуле](./userfields-main-rendering).

{% endnote %}

### Использовать данные в шаблоне

Шаблон получает подготовленные данные в `$arResult`. Для редактирования берите имя контрола из `fieldName`, чтобы оно совпало с тем, которое ожидает главный модуль.

```php
<?php

if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
    die();
}

$value = $arResult['value'][0] ?? '';
?>

<input
    type="text"
    name="<?= htmlspecialcharsbx($arResult['fieldName']) ?>"
    value="<?= htmlspecialcharsbx((string)$value) ?>"
>
```

Для множественного поля `BaseUfComponent` добавляет к имени `[]`, если суффикса еще нет. Значение всегда приходит в шаблон массивом.

### Настроить форму параметров поля

Режим `main.admin_settings` выводит дополнительные настройки типа поля в форме создания или изменения пользовательского поля. Имя для контрола настройки берите из `$arResult['additionalParameters']['NAME']`.

```php
<?php

if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
    die();
}

$size = (int)($arResult['userField']['SETTINGS']['SIZE'] ?? 20);
$name = $arResult['additionalParameters']['NAME'] ?? 'SETTINGS';
?>

<tr>
    <td>Размер поля:</td>
    <td>
        <input
            type="text"
            name="<?= htmlspecialcharsbx($name) ?>[SIZE]"
            value="<?= $size ?>"
        >
    </td>
</tr>
```

Метод `prepareSettings()` отбирает настройки, которые тип поддерживает. Переопределите его в классе типа, чтобы в поле не попадали чужие настройки.

**Пример.** Родительский `StringType` уже готовит настройки строкового поля, поэтому метод вызывает `parent::prepareSettings()`, а затем ограничивает значение настройки `SIZE` диапазоном от 1 до 64. Добавьте метод в класс `CodeType`.

```php
class CodeType extends StringType
{
    // ...

    public static function prepareSettings(array $userField): array
    {
        $settings = parent::prepareSettings($userField);

        $settings['SIZE'] = min(64, max(1, (int)$settings['SIZE']));

        return $settings;
    }
}
```

## Добавить проверку значения

Метод `checkFields()` возвращает массив ошибок для значения поля, а когда ошибок нет — пустой массив. Переопределите его в классе `CodeType`, если тип задает собственный формат значения.

```php
class CodeType extends StringType
{
    // ...

    public static function checkFields(array $userField, $value): array
    {
        $errors = parent::checkFields($userField, $value);
        $value = (string)$value;

        if ($value !== '' && !preg_match('/^[A-Z0-9_-]+$/', $value))
        {
            $errors[] = [
                'id' => $userField['FIELD_NAME'],
                'text' => 'Значение может содержать только заглавные латинские буквы, цифры, дефис и подчеркивание',
            ];
        }

        return $errors;
    }
}
```

Если тип меняет только отрисовку, а хранение и проверка значения совпадают с базовым типом, переопределять `checkFields()` не нужно.

## Добавить текстовое представление

Метод `getPublicText()` возвращает значение без разметки — для уведомлений, журналов и других мест. Класс `BaseType` уже объявляет этот метод: по умолчанию он выводит шаблон режима `main.public_text` вашего компонента.

Переопределите метод в классе `CodeType`, если текстовое представление проще собрать в PHP, чем в шаблоне. Тогда папка `main.public_text` компоненту не нужна.

```php
class CodeType extends StringType
{
    // ...

    public static function getPublicText(array $userField): string
    {
        return implode(', ', array_map('strtoupper', (array)$userField['VALUE']));
    }
}
```

Как получить текстовое значение готового поля, читайте в статье [Отрисовка пользовательских полей в главном модуле](./userfields-main-rendering).

## Проверить работу типа

Проверьте тип после регистрации и создания пользовательского поля.

1. Убедитесь, что менеджер пользовательских полей получил описание типа.

   ```php
   <?php

   use Vendor\Project\UserField\Types\CodeType;

   global $USER_FIELD_MANAGER;

   $type = $USER_FIELD_MANAGER->GetUserType(CodeType::USER_TYPE_ID);

   if (!$type)
   {
       throw new RuntimeException('Тип пользовательского поля не зарегистрирован');
   }
   ```

2. Создайте пользовательское поле с `USER_TYPE_ID`, равным `CodeType::USER_TYPE_ID`.

3. Откройте форму просмотра или редактирования объекта и проверьте, что главный модуль подключает шаблон нужного режима.

4. Если шаблон не используется, проверьте совпадение `RENDER_COMPONENT`, имени компонента и результата `getUserTypeId()`.

Когда класс типа, обработчик события и шаблоны компонента на месте, поле работает во всех формах, где главный модуль выводит пользовательские поля, и в публичной части, и в административных списках.
