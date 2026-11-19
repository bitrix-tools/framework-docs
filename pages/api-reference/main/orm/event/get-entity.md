---
title: Получить сущность события Event::getEntity
description: Метод ORM\Event::getEntity возвращает ORM-сущность, для которой создали событие.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.4

{% endnote %}

Метод `Event::getEntity` возвращает ORM-сущность, для которой создали событие. Если один обработчик подписан на события нескольких ORM-классов, сущность дает ему класс данных, поля и имя таблицы.

Сигнатура метода в классе `Bitrix\Main\ORM\Event`:

```php
public function getEntity()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\ORM\Entity`, который передали в конструктор.

## Примеры

**Пример.** Обработчик выводит класс данных сущности. Код объявляет ORM-класс единиц измерения и отправляет его событие без записи в базу данных:

```php
<?php
use Bitrix\Main\ORM\Data\DataManager;
use Bitrix\Main\ORM\Event;
use Bitrix\Main\ORM\EventManager;
use Bitrix\Main\ORM\Fields\IntegerField;
use Bitrix\Main\ORM\Fields\StringField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class DemoUnitTable extends DataManager
{
    public static function getTableName()
    {
        return 'demo_unit';
    }

    public static function getMap()
    {
        return [
            (new IntegerField('ID'))->configurePrimary(),
            new StringField('CODE'),
        ];
    }
}

EventManager::getInstance()->addEventHandler(
    DemoUnitTable::class,
    DataManager::EVENT_ON_BEFORE_ADD,
    function (Event $event)
    {
        echo $event->getEntity()->getDataClass() . PHP_EOL;
    }
);

$event = new Event(DemoUnitTable::getEntity(), DataManager::EVENT_ON_BEFORE_ADD, [], true);
$event->send();
echo $event->getEventType();
```

Код выведет класс `\DemoUnitTable` и имя события `\DemoUnit::OnBeforeAdd`.

## Смотрите также

- [Event::getErrors](get-errors.md)
