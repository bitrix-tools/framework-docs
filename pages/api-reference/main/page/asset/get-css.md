---
title: Получить HTML подключения CSS Asset::getCss
description: Метод Asset::getCss возвращает теги link для CSS-файлов страницы. Если объединение включено, метод собирает файлы набора в один файл.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::getCss` возвращает HTML подключения CSS-файлов — теги `link`. Метод `$APPLICATION->ShowHead()` вызывает его сам в конце формирования страницы. Прикладному коду вызывать метод нужно, только если шаблон выводит CSS без `ShowHead`.

Если объединение CSS включено, метод собирает файлы каждого набора в один файл в каталоге `/bitrix/cache/css/` и возвращает тег для него.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function getCss($type = AssetShowTargetType::ALL)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| type | `int` | Задает, какие наборы вывести, — константу `AssetShowTargetType`. По умолчанию — `AssetShowTargetType::ALL` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

| Константа `AssetShowTargetType` | Наборы |
| --- | --- |
| `ALL` | Все наборы. Набор шаблона — последним |
| `KERNEL` | Только набор ядра — файлы ядра и внешние файлы |
| `TEMPLATE_PAGE` | Все наборы, кроме ядра |

## Возвращаемое значение

Метод возвращает строку HTML. В режиме AJAX метод возвращает скрипт `BX.loadCSS` со списком файлов.

## Особенности

- Метод готовит список файлов при первом вызове. Файлы, которые добавили потом, метод не выведет.
- Набор шаблона метод выводит с атрибутом `data-template-style="true"`.
- Если шаблон сайта начал набор `TEMPLATE`, метод сам добавляет файлы `styles.css` и `template_styles.css` шаблона.

## Примеры

**Пример.** Код добавляет внешний CSS-файл и выводит теги подключения:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->addCss('https://cdn.example.com/units.css');

preg_match('#<link href="https://cdn.example.com/units.css"[^>]*>#', $asset->getCss(), $match);

echo $match[0];
```

Код выведет `<link href="https://cdn.example.com/units.css" type="text/css" rel="stylesheet"/>`.

## Смотрите также

- [Asset::addCss](add-css.md)
- [Asset::getJs](get-js.md)
- [Работа со стилями](../../../../cms-basics/styles.md)
