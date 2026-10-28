---
title: XSS
description: 'XSS. Руководство по безопасности Bitrix: защита, рекомендации и правильные настройки.'
---

XSS (Cross-Site Scripting) — уязвимость, которая позволяет выполнить вредоносный JavaScript-код на странице сайта. Если система не проверяет входные данные, код может получить доступ к пользовательским данным или изменить содержимое страницы.

Любые данные, полученные от пользователей через формы или другие источники, могут содержать опасный код. Чтобы предотвратить XSS, необходимо экранировать все внешние данные перед выводом в HTML или JavaScript.

## Экранировать HTML

Чтобы заменить спецсимволы на HTML-сущности используйте:

-  `htmlspecialcharsbx` — функция преобразует спецсимволы `<`, `>`, `"`, `&` в HTML-сущности. По умолчанию использует флаг `ENT_COMPAT` и не экранирует одинарную кавычку `'`. Чтобы экранировать оба вида кавычек, передайте вторым аргументом `ENT_QUOTES`.

-  [`\Bitrix\Main\Text\HtmlFilter::encode`](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Text-HtmlFilter.html#method_encode) — работает аналогично, включая флаг `ENT_COMPAT` по умолчанию. Оба способа используют кодировку UTF-8.

{% note warning "" %}

Избегайте `htmlspecialcharsEx` — функция работает по черному списку, то есть запрещает только определенные символы. Лучше использовать полное экранирование `htmlspecialcharsbx` или белый список [CBXSanitizer](./sanitizer.md).

{% endnote %}

```php
<!-- Правильно: спецсимволы экранированы, скрипты не выполнятся -->
<div><?= \Bitrix\Main\Text\HtmlFilter::encode($foo) ?></div>
<textarea><?= \Bitrix\Main\Text\HtmlFilter::encode($foo) ?></textarea>

<!-- Неправильно: если $foo содержит <script>, он выполнится -->
<div><?= $foo ?></div>
<textarea><?= $foo ?></textarea>
```

Экранирование можно пропускать только для доверенных данных, например, для строк из исходного кода.

Для экранирования HTML внутри Javascript, можно использовать методы класса `Text` встроенной  библиотеки `main.core`.

```js
const valueNotSafe = '<script>alert(1)</script>';
const valueEscaped = BX.Text.encode(valueNotSafe); // &lt;script&gt;alert(1)&lt;/script&gt;
const yetValueNotSafe = BX.Text.decode(valueEscaped); // <script>alert(1)</script>
```

Получить класс `Text` можно через импорт из библиотеки `main.core`.

```js
import { Text } from 'main.core';

const valueEscaped = Text.encode(valueNotSafe);
```

### Атрибуты

Заключайте значения атрибутов в двойные кавычки `"`. При вызове `htmlspecialcharsbx` без второго аргумента одинарная кавычка из входных данных останется без изменений и сможет закрыть значение атрибута, заключенное в одинарные кавычки.

```php
<!-- Правильно: значения в двойных кавычках -->
<input type="text" name="foo" value="<?= htmlspecialcharsbx($fooValue) ?>" />

<!-- Неправильно: одинарная кавычка во входных данных может закрыть атрибут -->
<input type="text" name="foo" value='<?= htmlspecialcharsbx($fooValue) ?>' />
```

Если нужны одинарные кавычки вокруг значения атрибута, передайте `ENT_QUOTES`:

```php
<input type="text" name="foo" value='<?= htmlspecialcharsbx($fooValue, ENT_QUOTES) ?>' />
```

## Вывести данные в шаблоне компонента

Массив `$arResult` содержит данные, которые подготовил компонент. Если компонент получает поля через `CDBResult::GetNext()` или `CIBlockResult::GetNext()`, при стандартных аргументах метод возвращает две версии значения:

-  `NAME` — значение для вывода в HTML. Для обычных строковых полей метод применяет `htmlspecialcharsEx`.

-  `~NAME` — исходное значение без HTML-экранирования.

Например, компонент `bitrix:news.detail` получает поля через `GetNextElement()->GetFields()` и передает их в `$arResult`. Если название содержит `<b>Название</b>`, поле `$arResult['NAME']` содержит `&lt;b&gt;Название&lt;/b&gt;`, а `$arResult['~NAME']` — исходную строку с тегами.

Для обычного текстового поля, подготовленного таким способом, используйте готовое значение или экранируйте исходное перед выводом:

```php
<!-- Поле NAME уже экранировано компонентом -->
<h2><?= $arResult['NAME'] ?></h2>

<!-- Исходное значение экранируем перед выводом -->
<h2><?= htmlspecialcharsbx($arResult['~NAME']) ?></h2>
```

Повторный вызов `htmlspecialcharsbx($arResult['NAME'])` экранирует HTML-сущности еще раз. Вместо `<b>Название</b>` читатель увидит `&lt;b&gt;Название&lt;/b&gt;`. Прямой вывод `$arResult['~NAME']` позволит браузеру обработать теги из исходных данных.

В базовой реализации `CDBResult::GetNext($bTextHtmlAuto = true, $use_tilda = true)` аргументы управляют разными преобразованиями:

-  `$bTextHtmlAuto` — включает обработку полей с парным полем `ИМЯ_ПОЛЯ_TYPE` через `FormatText`. Для типа `html` метод сохраняет HTML, для остальных типов преобразует текст через `TxtToHtml`. Вызов `GetNext(false)` отключает эту обработку, но сохраняет экранирование обычных строковых полей.

-  `$use_tilda` — включает дополнительные ключи с префиксом `~`. Вызов `GetNext(true, false)` убирает эти ключи, но сохраняет обработку значений без префикса.

Метод `CIBlockResult::GetNext()` дополнительно формирует URL. При `$use_tilda = false` он возвращает вычисленные URL без HTML-экранирования. Перед выводом таких значений в HTML-атрибуты применяйте `htmlspecialcharsbx`.

Проверяйте, как конкретный компонент заполняет `$arResult`: сам массив не экранирует данные, а отсутствие `~` в ключе не гарантирует безопасный вывод. Поля с HTML и значения, добавленные компонентом вручную, могут содержать исходную разметку. Для пользовательского HTML применяйте [санитайзер](./sanitizer.md). Для передачи исходных значений в JavaScript используйте экранирование JavaScript, описанное ниже.

## Экранировать JavaScript

Метод `CUtil::JSEscape` экранирует спецсимволы JavaScript `'`, `"`, `\`, `\n`, `\r`. Подходит для строк, заключенных в кавычки.

```php
// Правильно: строка в кавычках, спецсимволы экранированы
<script>
  var foo = '<?= CUtil::JSEscape($foo) ?>';
</script>

// Неправильно: без кавычек код выполнится как есть
<script>
  var foo = <?= CUtil::JSEscape($foo) ?>;
</script>
```

## Двойное экранирование

Используйте совместно экранирование HTML и JavaScript:

-  в обработчиках событий `onclick`, `onload` и так далее,

-  атрибутах, содержащих JavaScript, например, `href="javascript:..."`,

-  шаблонах динамических скриптов.

```php
<?php
// Сначала экранируем для JS, затем для HTML
$someData = CUtil::JSEscape($foo);
$someData = htmlspecialcharsbx($someData);
?>
<a href="#" onclick="doSome('<?= $someData ?>');">Click</a>
```

## Вывести JSON

Неэкранированный JSON может содержать закрывающие теги `</script>`, уязвимости XSS и вредоносный JavaScript.

Метод [`Json::encode`](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Web-Json.html#method_encode):

-  преобразует данные в JSON,

-  экранирует спецсимволы,

-  добавляет Unicode-экранирование.

```php
<?php
// Массив с пользовательскими данными
$foo = ['key' => $userInput];
?>
<script>
  // Безопасный вывод: <script> и другие спецсимволы экранированы
      var foo = <?= Bitrix\Main\Web\Json::encode($foo) ?>;
</script>
```

## Очистить HTML теги

Если необходимо вывести HTML-код пользователя, используйте санитайзер `CBXSanitizer`. Он удалит опасные теги и оставит только разрешенные.

Метод `sanitizeHtml` преобразует полученный HTML-текст.

```php
<div><?= (new CBXSanitizer)->sanitizeHtml($foo) ?></div>
```

{% note tip "" %}

Подробнее в статье [Санитайзер](./sanitizer.md)

{% endnote %}
