---
title: Проверить размещение по PSR-4 Controller::isLocatedUnderPsr4
description: Метод Controller::isLocatedUnderPsr4 проверяет, начинается ли имя файла класса контроллера с заглавной буквы, как требует PSR-4.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::isLocatedUnderPsr4` проверяет, лежит ли файл класса по правилам PSR-4. Метод смотрит на первую букву имени файла. Заглавная буква означает PSR-4, например `Unit.php`, строчная — старое размещение, например `unit.php`. От результата зависит регистр имени контроллера в адресе действия.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
final public function isLocatedUnderPsr4(): bool
```

## Возвращаемое значение

Метод возвращает `true`, если имя файла начинается с заглавной буквы, иначе `false`.

## Примеры

**Пример.** Код проверяет размещение файла контроллера ядра:

```php
<?php
use Bitrix\Main\Controller\UserOption;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump((new UserOption())->isLocatedUnderPsr4());
```

Код выведет `bool(false)`, потому что файл класса называется `useroption.php`.

## Смотрите также

- [Controller::getActionUri](get-action-uri.md)
