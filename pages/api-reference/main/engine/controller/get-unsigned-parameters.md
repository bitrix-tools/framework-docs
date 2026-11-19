---
title: Получить параметры компонента Controller::getUnsignedParameters
description: Метод Controller::getUnsignedParameters возвращает параметры компонента, которые JavaScript передал подписанными в signedParameters.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::getUnsignedParameters` возвращает параметры компонента, которые клиент передал подписанной строкой. Компонент подписывает параметры методом `ParameterSigner::signParameters`, JavaScript передает строку в параметре `signedParameters`, а контроллер проверяет подпись и расшифровывает строку. Так клиент не может подменить параметры компонента.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
final public function getUnsignedParameters()
```

## Возвращаемое значение

Метод возвращает массив параметров или `null`, если подписанных параметров нет или подпись неверна. Если строка с верной подписью не расшифровывается, метод возвращает пустой массив или `false`.

## Особенности

- Солью подписи служит имя компонента из параметра `c`, например `vendor:units.list`. Компонент должен подписать параметры с тем же именем.
- Метод не считает неверную подпись ошибкой. Он не добавляет ошибку в коллекцию и возвращает `null`.

## Примеры

**Пример.** Код подписывает параметры, передает их контроллеру и читает:

```php
<?php
use Bitrix\Main\Component\ParameterSigner;
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitController extends Controller
{
    public function configureActions()
    {
        return ['list' => ['prefilters' => []]];
    }

    public function listAction(): ?array
    {
        return $this->getUnsignedParameters();
    }
}

$signed = ParameterSigner::signParameters('vendor:units.list', ['PAGE_SIZE' => 20]);
$result = (new UnitController())->run('list', [['signedParameters' => $signed, 'c' => 'vendor:units.list']]);

echo $result['PAGE_SIZE'];
```

Код выведет `20`.

## Смотрите также

- [Контроллеры](../../../../framework/controllers.md)
