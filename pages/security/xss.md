---
title: XSS
---

XSS (Cross-Site Scripting) -- уязвимость, которая позволяет выполнить вредоносный JavaScript-код на странице сайта. Если система не проверяет входные данные, код может получить доступ к пользовательским данным или изменить содержимое страницы.

Любые данные, полученные от пользователей через формы или другие источники, могут содержать опасный код. Чтобы предотвратить XSS, необходимо экранировать все внешние данные перед выводом в HTML или JavaScript.

## Экранировать HTML

Чтобы заменить спецсимволы на HTML-сущности используйте:

-  `htmlspecialcharsbx` -- функция преобразует спецсимволы `<`, `>`, `"`, `'`, `&` в HTML-сущности,

-  [`\Bitrix\Main\Text\HtmlFilter::encode`](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-Text-HtmlFilter.html#method_encode) -- работает аналогично, но поддерживает Unicode.

{% note warning "" %}

Избегайте `htmlspecialcharsEx` -- функция работает по черному списку, то есть запрещает только определенные символы. Лучше использовать полное экранирование `htmlspecialcharsbx` или белый список [CBXSanitizer](./sanitizer).

{% endnote %}

```html
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
const valueEscaped = BX.Text.encode(valueNotSave); // &lt;script&gt;alert(1)&lt;/script&gt;
const yetValueNotSafe = BX.Text.decode(valueEscaped); // <script>alert(1)</script>
```

Получить класс `Text` можно через импорт из библиотеки `main.core`.

```js
import { Text } from 'main.core';

const valueEscaped = Text.encode(valueNotSafe);
```

### Атрибуты

Заключайте значения атрибутов в двойные кавычки `"`. С одинарными кавычками экранирование не сработает.

```html
<!-- Правильно: значения в двойных кавычках -->
<input type="text" name="foo" value="<?= htmlspecialcharsbx($fooValue) ?>" />

<!-- Неправильно: в одинарных кавычках экранирование может не сработать -->
<input type="text" name="foo" value='<?= htmlspecialcharsbx($fooValue) ?>' />
```

## Экранировать JavaScript

Метод `CUtil::JSEscape` экранирует спецсимволы JavaScript `'`, `"`, `\`, `\n`, `\r`. Подходит для строк, заключенных в кавычки.

```html
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

{% note tip "Подробнее в статье" %}

[Санитайзер](./sanitizer)

{% endnote %}
