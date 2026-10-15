---
title: Аннотации классов
description: 'Аннотации классов. ORM Bitrix Framework: ключевые концепции, примеры и рекомендации.'
---

Большинство методов объекта и коллекции в ORM — виртуальные. Это значит, что их не существует в коде класса, но PHP создает их автоматически через магический метод `__call` при обращении к несуществующим методам.

Система аннотаций в Bitrix Framework помогает IDE понимать доступные методы и показывать подсказки для автодополнения.

## Аннотации ORM-классов ядра

Файл с аннотациями ORM-классов ядра находится по пути `/bitrix/modules/main/meta/orm.php`. Этот файл содержит множество объявлений классов с блоками аннотаций в phpDoc.

```php
/* ORMENTITYANNOTATION:Bitrix\Main\UserTable:main/lib/UserTable.php */
namespace Bitrix\Main {
    /**
     * EO_User
     * @see \Bitrix\Main\UserTable
     *
     * Custom methods:
     * ---------------
     *
     * @method \int getId()
     * @method \Bitrix\Main\EO_User setId(\int|\Bitrix\Main\DB\SqlExpression $id)
     * ...
     *
     * Common methods:
     * ---------------
     *
     * @property-read \Bitrix\Main\ORM\Entity $entity
     * ...
     * @method mixed get($fieldName)
     * ...
     */
    class EO_User extends \Bitrix\Main\ORM\Objectify\EntityObject
    {
        /* @var \Bitrix\Main\UserTable */
        static public $dataClass = '\Bitrix\Main\UserTable';
        /**
         * @param bool|array $setDefaultValues
         */
        public function __construct($setDefaultValues = true) {}
    }
}
```

Фрагмент выше показывает описание класса `EO_User` — наследника стандартного `EntityObject`. ORM возвращает объекты этого типа при получении записей, а аннотации помогают IDE понять их структуру и доступные методы.

Для каждой таблицы, которая наследует `Bitrix\Main\ORM\Data\DataManager`, генерируется набор классов:

-  `EO_User_Collection`

-  `EO_User_Query`

-  `EO_User_Result`

-  `EO_User_Entity`

Эти классы можно использовать для указания типов аргументов и возвращаемых значений.

```php
class MyClass
{
    private function getName(EO_User $user): string
    {
        return CUser::FormatName(
            CSite::GetNameFormat(),
            [
                'NAME' => $user->getName(),
                'LAST_NAME' => $user->getLastName(),
                'SECOND_NAME' => $user->getSecondName(),
            ],
        );
    }
    // ...
}
```

## Аннотации для классов таблиц

Команда `orm:annotate` записывает в файл аннотаций заглушку класса таблицы с phpDoc-блоком. Исходный файл класса таблицы команда не изменяет.

**Пример.** Заглушка `UserTable` описывает типы результатов статических методов.

```php
/**
 * @method static EO_User_Query query()
 * @method static EO_User_Result getByPrimary($primary, array $parameters = [])
 * @method static EO_User_Result getById($id)
 * @method static EO_User_Result getList(array $parameters = [])
 * @method static EO_User_Entity getEntity()
 * @method static \Bitrix\Main\EO_User createObject($setDefaultValues = true)
 * @method static \Bitrix\Main\EO_User_Collection createCollection()
 * @method static \Bitrix\Main\EO_User wakeUpObject($row)
 * @method static \Bitrix\Main\EO_User_Collection wakeUpCollection($rows)
 */
class UserTable extends \Bitrix\Main\ORM\Data\DataManager
{
}
```

Эти аннотации позволяют IDE подсказывать методы для работы с сущностью: построение запросов, получение данных, создание объектов и коллекций.

## Создать аннотации

Для запуска `bitrix.php` настройте [Composer](../get-started/composer.md) и установите зависимости проекта, включая Symfony Console.

Чтобы создать аннотации для установленного модуля `vendor.module` из `/local/modules/`, перейдите в папку `/bitrix/` проекта и выполните команду `orm:annotate`.

```bash prompt="$"
$ cd bitrix
$ php bitrix.php orm:annotate -m vendor.module
```

### Как работает команда

Команда сканирует PHP-файлы в папках `/local/modules/<id>/lib` и `/local/modules/<id>/dev/lib` выбранных модулей. Неустановленные модули и модули, которые не удалось подключить, она пропускает. Для каждого неабстрактного наследника `Bitrix\Main\ORM\Data\DataManager` с именем, которое заканчивается на `Table`, команда получает сущность ORM и формирует аннотации по ее полям.

Папки `/bitrix/modules/<id>/lib` команда не сканирует. Для модулей ядра она отдельно читает списки классов из файлов `meta/ormuf.php` и формирует аннотации пользовательских полей. Также команда обрабатывает виртуальные ORM-классы через событие `main:onVirtualClassBuildList`.

По умолчанию команда записывает результат в `/bitrix/modules/orm_annotations.php`. Файл содержит описания классов объекта и коллекции сущностей, а также вспомогательные классы для автодополнения.

При изменении карты полей в классе `Table` нужно сгенерировать аннотации снова, чтобы IDE отображала актуальные поля и методы.

## Настроить сканирование модулей

Опция `-m` или `--modules` задает модули для обработки. По умолчанию она имеет значение `main`. Чтобы обработать собственный модуль, передайте его идентификатор. Несколько идентификаторов перечислите через запятую, а для обработки всех модулей укажите `all`.

Выберите нужный вариант запуска.

```bash prompt="$"
# Один модуль
$ php bitrix.php orm:annotate -m vendor.module

# Несколько модулей, перечисляйте через запятую
$ php bitrix.php orm:annotate -m vendor.module,vendor.other

# Все модули
$ php bitrix.php orm:annotate -m all
```

## Выбрать файл для аннотаций

Необязательный аргумент `output` задает путь к файлу результата. Относительный путь команда отсчитывает от текущей рабочей папки.

Чтобы сохранить аннотации в `/bitrix/modules/vendor_orm.php` при запуске из `/bitrix/`, передайте путь после имени команды.

```bash prompt="$"
$ php bitrix.php orm:annotate modules/vendor_orm.php -m vendor.module
```

Опция `--inside` сохраняет аннотации внутри модуля, в `/local/modules/<id>/meta/orm.php`. Для этого выберите один модуль через `-m`. В таком режиме команда использует путь внутри модуля вместо аргумента `output`. При выборе нескольких модулей или значения `all` опция не действует, и команда записывает результат по пути `output`.

Чтобы сохранить аннотации в `/local/modules/vendor.module/meta/orm.php`, выполните команду с опцией `--inside`.

```bash prompt="$"
$ php bitrix.php orm:annotate -m vendor.module --inside
```

## Управлять аннотациями

Система обновляет аннотации выборочно. При повторном запуске команды перезаписываются только аннотации для указанных модулей. Аннотации остальных модулей сохраняются без изменений.

Чтобы полностью сбросить все аннотации, используйте ключ `-c`.

```bash prompt="$"
$ php bitrix.php orm:annotate -c -m all
```

## Получить справку по команде

Посмотреть все параметры команды можно с помощью `help`.

```bash prompt="$"
$ php bitrix.php help orm:annotate
```
