---
title: Получить данные результата Result::getData
description: Метод Result::getData возвращает массив данных, который сохранил метод setData.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.6

{% endnote %}

Метод `Result::getData` возвращает данные результата, которые сохранил метод [setData](set-data.md).

Сигнатура метода в классе `Bitrix\Main\Result`:

```php
public function getData()
```

## Возвращаемое значение

Метод возвращает массив. Если код не вызывал `setData`, метод возвращает пустой массив.

## Примеры

**Пример.** Код выводит данные успешного результата и пропускает их у результата с ошибкой:

```php
<?php
use Bitrix\Main\Error;
use Bitrix\Main\Result;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$results = [
    (new Result())->setData(['CODE' => 'kg']),
    (new Result())->addError(new Error('Unit not found')),
];

foreach ($results as $result)
{
    echo $result->isSuccess() ? $result->getData()['CODE'] : 'error';
    echo PHP_EOL;
}
```

Код выведет `kg` и `error`.

## Смотрите также

- [Result::setData](set-data.md)
- [Result::isSuccess](is-success.md)
