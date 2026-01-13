---
title: Аннотации классов
description: 'Аннотации классов. ORM Bitrix Framework: ключевые концепции, примеры и рекомендации.'
---

Большинство методов объекта и коллекции в ORM -- виртуальные. Это значит, что их не существует в коде класса, но PHP создает их автоматически через магический метод `__call` при обращении к несуществующим методам.

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
    class EO_User extends \Bitrix\Main\ORM\Objectify\EntityObject {
        /* @var \Bitrix\Main\UserTable */
        static public $dataClass = '\Bitrix\Main\UserTable';
        /**
         * @param bool|array $setDefaultValues
         */
        public function __construct($setDefaultValues = true) {}
    }
}
```

Фрагмент выше показывает описание класса `EO_User` -- наследника стандартного `EntityObject`. ORM возвращает объекты этого типа при получении записей, а аннотации помогают IDE понять их структуру и доступные методы.

Для каждой таблицы, которая наследует `Bitrix\Main\ORM\Data\DataManager`, генерируется набор классов:

-  `EO_User_Collection`

-  `EO_User_Query`

-  `EO_User_Result`

-  `EO_User_Entity`

Эти классы можно использовать для указания типов аргументов и возвращаемых значений.

```php
class MyClass
{
    // ...
    
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
}
```

## Аннотации для классов таблиц

Аннотации также добавляют phpDoc-блок перед классом таблицы.

```php
//  Пример для UserTable
/**
 * Class UserTable
 *
 * DO NOT WRITE ANYTHING BELOW THIS
 *
 * <<< ORMENTITYANNOTATION
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
class UserTable extends DataManager
{
    // ...
}
```

Эти аннотации позволяют IDE подсказывать методы для работы с сущностью: построение запросов, получение данных, создание объектов и коллекций.

## Создать аннотации

Чтобы создать аннотации, нужно перейти в папку `/bitrix/` проекта и использовать CLI-команду `orm:annotate`.

```bash
cd bitrix
php bitrix.php orm:annotate
```

{% note warning "" %}

Перед использованием CLI-команд необходимо установить зависимости проекта через [composer](./../get-started/composer).

{% endnote %}

### Как работает команда

Система сканирует файлы в папках `/bitrix/modules/[module]/lib`. Когда она находит класс `Table`, унаследованный от `Bitrix\Main\ORM\Data\DataManager`, то анализирует его карту полей -- массив, который описывает структуру таблицы базы данных.

Результат работы -- файл `/bitrix/modules/orm_annotations.php`. Файл содержит описания классов объекта и коллекции сущностей, а также вспомогательные классы для автодополнения.

При изменении карты полей в классе `Table` нужно сгенерировать аннотации снова, чтобы IDE отображала актуальные поля и методы.

## Настроить сканирование модулей

По умолчанию команда сканирует только Главный модуль `main`. Указать другие модули можно  с помощью ключа `-m`.

```bash
# Один модуль
php bitrix.php orm:annotate -m tasks

# Несколько модулей, перечисляйте через запятую
php bitrix.php orm:annotate -m main,intranet

# Все модули
php bitrix.php orm:annotate -m all
```

## Управлять аннотациями

Система обновляет аннотации выборочно. При повторном запуске команды перезаписываются только аннотации для указанных модулей. Аннотации остальных модулей сохраняются без изменений.

Чтобы полностью сбросить все аннотации, используйте ключ `-c`.

```bash
php bitrix.php orm:annotate -c -m all
```

## Получить справку по команде

Посмотреть все параметры команды можно с помощью `help`.

```bash
php bitrix.php help orm:annotate
```