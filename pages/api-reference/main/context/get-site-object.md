---
title: Получить объект сайта Context::getSiteObject
description: Метод Context::getSiteObject возвращает объект ORM текущего сайта с каталогом, названием, доменом и другими полями.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Context::getSiteObject` возвращает объект ORM текущего сайта. Через объект код читает поля сайта, например каталог и название, без отдельного запроса к `SiteTable`.

Сигнатура метода в классе `Bitrix\Main\Context`:

```php
public function getSiteObject(): ?EO_Site
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\EO_Site` или `null`, если сайт не задан, например в административном разделе.

Методы вида `get` и имя поля возвращают поля объекта, например `getDir` возвращает каталог сайта, `getName` — название, `getServerName` — доменное имя. Ядро задает константу `SITE_DIR` классического API из поля каталога, а `SITE_SERVER_NAME` — из доменного имени, если константу не задали раньше. Без сайта обе константы равны пустой строке.

## Примеры

**Пример.** Код выводит каталог и название текущего сайта:

```php
<?php
use Bitrix\Main\Context;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$site = Context::getCurrent()->getSiteObject();

echo $site ? $site->getDir() . ' ' . $site->getName() : 'No site';
```

Код выведет каталог и название сайта, например `/ Units`.

## Смотрите также

- [Context::getSite](get-site.md)
- [Context::setSite](set-site.md)
