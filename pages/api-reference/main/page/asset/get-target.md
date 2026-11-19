---
title: Получить текущий набор Asset::getTarget
description: Метод Asset::getTarget возвращает массив с данными текущего набора — имя, режим, признаки и результаты подготовки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::getTarget` возвращает данные текущего набора. Метод нужен для отладки, например чтобы проверить режим набора на композитной странице.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function getTarget()
```

## Возвращаемое значение

Метод возвращает массив набора.

| Ключ | Значение |
| --- | --- |
| `NAME` | Имя набора |
| `START` | `true`, если набор открыт |
| `MODE` | Режим — константа `AssetMode` |
| `UNIQUE` | `true`, если у набора отдельный файл объединения |
| `PREFIX` | Префикс имени файла объединения. У своих наборов ключа нет |
| `BODY` | Признак вывода в конце страницы |
| `CSS_LIST`, `JS_LIST` | Вложенные наборы |
| `CSS_RES`, `JS_RES` | HTML подключения после подготовки |
| `STRING_LIST` | Служебный список строк |

## Примеры

**Пример.** Код читает имя и режим текущего набора:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$target = Asset::getInstance()->getTarget();

echo $target['NAME'] . ' ' . $target['MODE'];
```

Код выведет `TEMPLATE 7`.

## Смотрите также

- [Asset::getTargetName](get-target-name.md)
- [Asset::getTargetList](get-target-list.md)
