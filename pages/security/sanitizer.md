---
title: Санитайзер
description: 'Санитайзер. Руководство по безопасности Bitrix: защита, рекомендации и правильные настройки.'
---

Санитайзер в Bitrix Framework защищает сайт от XSS-атак:

-  удаляет или экранирует опасные теги и атрибуты,

-  автоматически закрывает незакрытые теги,

-  корректирует структуру HTML,

-  экранирует специальные символы.

## Методы класса CBXSanitizer

Для работы с санитайзером используются методы класса [CBXSanitizer](https://dev.1c-bitrix.ru/api_help/main/reference/cbxsanitizer/index.php).

-  `AddTags(array $tags)` -- добавляет теги и атрибуты в список разрешенных.

-  `DelAllTags(array $tagNames)` -- удаляет все теги из списка разрешенных.

-  `DeleteAttributes(array $arDeleteAttrs)` -- удаляет атрибуты из списка разрешенных HTML-тегов.

-  `DeleteSanitizedTags(bool $apply)` -- включает удаление тегов, не содержащихся в списке разрешенных.

-  `DelTags(array $tagNames)` -- удаляет теги из списка разрешенных.

-  `GetTags()` -- возвращает список разрешенных тегов и атрибутов в виде отформатированного текста.

-  `SanitizeHtml(string $html)` -- выполняет фильтрацию HTML-кода на основе заданных правил.

-  `setDelTagsWithContent(array $tags)` -- устанавливает список тегов, которые нужно удалять вместе с содержимым.

-  `SetLevel(int $level)` -- автоматически заполняет список разрешенных тегов в соответствии с одним из предустановленных уровней фильтрации.

-  `UpdateTags(array $tags)` -- изменяет теги и атрибуты, которые уже добавлены в список разрешенных.

## Как использовать санитайзер

1. Создайте объект санитайзера.

   ```php
   $Sanitizer = new CBXSanitizer();
   ```

2. Задайте правила фильтрации. Например, разрешите определенные теги и атрибуты с помощью функции [AddTags](https://dev.1c-bitrix.ru/api_help/main/reference/cbxsanitizer/addtags.php).

   ```php
   $Sanitizer->AddTags([
       'a' => ['href', 'id', 'style', 'alt'],
       'br' => [],
   ]);
   ```

3. Примените санитайзер к HTML-коду.

   ```php
   $pureHtml = $Sanitizer->SanitizeHtml($html);
   ```

## Уровни фильтрации

Уровни фильтрации -- это предустановленные наборы, содержащие разрешенные теги и атрибуты. Санитайзер поддерживает четыре уровня фильтрации:

1. Высокий уровень `SECURE_LEVEL_HIGH`

   Разрешает только базовые текстовые теги без атрибутов. Подходит для строгой защиты.

   ```php
   $arTags = [
       'b'          => [],
       'br'         => [],
       'big'        => [],
       'blockquote' => [],
       'code'       => [],
       'del'        => [],
       'dt'         => [],
       'dd'         => [],
       'font'       => [],
       'h1'         => [],
       'h2'         => [],
       'h3'         => [],
       'h4'         => [],
       'h5'         => [],
       'h6'         => [],
       'hr'         => [],
       'i'          => [],
       'ins'        => [],
       'li'         => [],
       'ol'         => [],
       'p'          => [],
       'small'      => [],
       's'          => [],
       'sub'        => [],
       'sup'        => [],
       'strong'     => [],
       'pre'        => [],
       'u'          => [],
       'ul'         => [],
   ];
   ```

2. Средний уровень `SECURE_LEVEL_MIDDLE`

   Разрешает больше тегов, например, изображения и ссылки. Подходит для большинства случаев.

   ```php
   $arTags = [
       'a'        => ['href', 'title', 'name', 'alt'],
       'b'        => [],
       'br'       => [],
       'big'      => [],
       'code'     => [],
       'caption'  => [],
       'del'      => ['title'],
       'dt'       => [],
       'dd'       => [],
       'font'     => ['color', 'size'],
       'color'    => [],
       'h1'       => [],
       'h2'       => [],
       'h3'       => [],
       'h4'       => [],
       'h5'       => [],
       'h6'       => [],
       'hr'       => [],
       'i'        => [],
       'img'      => ['src', 'alt', 'height', 'width', 'title'],
       'ins'      => ['title'],
       'li'       => [],
       'ol'       => [],
       'p'        => [],
       'pre'      => [],
       's'        => [],
       'small'    => [],
       'strong'   => [],
       'sub'      => [],
       'sup'      => [],
       'table'    => ['border', 'width'],
       'tbody'    => ['align', 'valign'],
       'td'       => ['width', 'height', 'align', 'valign'],
       'tfoot'    => ['align', 'valign'],
       'th'       => ['width', 'height'],
       'thead'    => ['align', 'valign'],
       'tr'       => ['align', 'valign'],
       'u'        => [],
       'ul'       => [],
   ];
   ```

3. Низкий уровень `SECURE_LEVEL_LOW`

   Разрешает практически все теги и требует осторожности. Не включает потенциально опасные теги `<script>`, `<iframe>` и `<embed>`.

   ```php
   $arTags = [
       'a'           => ['href', 'title', 'name', 'style', 'id', 'class', 'shape', 'coords', 'alt', 'target'],
       'b'           => ['style', 'id', 'class'],
       'br'          => ['style', 'id', 'class'],
       'big'         => ['style', 'id', 'class'],
       'blockquote'  => ['title', 'style', 'id', 'class'],
       'caption'     => ['style', 'id', 'class'],
       'code'        => ['style', 'id', 'class'],
       'del'         => ['title', 'style', 'id', 'class'],
       'div'         => ['title', 'style', 'id', 'class', 'align'],
       'dt'          => ['style', 'id', 'class'],
       'dd'          => ['style', 'id', 'class'],
       'font'        => ['color', 'size', 'face', 'style', 'id', 'class'],
       'h1'          => ['style', 'id', 'class', 'align'],
       'h2'          => ['style', 'id', 'class', 'align'],
       'h3'          => ['style', 'id', 'class', 'align'],
       'h4'          => ['style', 'id', 'class', 'align'],
       'h5'          => ['style', 'id', 'class', 'align'],
       'h6'          => ['style', 'id', 'class', 'align'],
       'hr'          => ['style', 'id', 'class'],
       'i'           => ['style', 'id', 'class'],
       'img'         => ['src', 'alt', 'height', 'width', 'title'],
       'ins'         => ['title', 'style', 'id', 'class'],
       'li'          => ['style', 'id', 'class'],
       'map'         => ['shape', 'coords', 'href', 'alt', 'title', 'style', 'id', 'class', 'name'],
       'ol'          => ['style', 'id', 'class'],
       'p'           => ['style', 'id', 'class', 'align'],
       'pre'         => ['style', 'id', 'class'],
       's'           => ['style', 'id', 'class'],
       'small'       => ['style', 'id', 'class'],
       'strong'      => ['style', 'id', 'class'],
       'span'        => ['title', 'style', 'id', 'class', 'align'],
       'sub'         => ['style', 'id', 'class'],
       'sup'         => ['style', 'id', 'class'],
       'table'       => ['border', 'width', 'style', 'id', 'class', 'cellspacing', 'cellpadding'],
       'tbody'       => ['align', 'valign', 'style', 'id', 'class'],
       'td'          => ['width', 'height', 'style', 'id', 'class', 'align', 'valign', 'colspan', 'rowspan'],
       'tfoot'       => ['align', 'valign', 'style', 'id', 'class', 'align', 'valign'],
       'th'          => ['width', 'height', 'style', 'id', 'class', 'colspan', 'rowspan'],
       'thead'       => ['align', 'valign', 'style', 'id', 'class'],
       'tr'          => ['align', 'valign', 'style', 'id', 'class'],
       'u'           => ['style', 'id', 'class'],
       'ul'          => ['style', 'id', 'class'],
   ];
   ```

4. Пользовательский уровень `SECURE_LEVEL_CUSTOM`

   Ограничения задаются вручную методом `AddTags()`. По умолчанию соответствует высокому уровню фильтрации.

### Как применить уровень фильтрации

Чтобы применить один из уровней, используйте метод `setLevel`:

```php
// Создаем объект санитайзера
$Sanitizer = new CBXSanitizer;

// Устанавливаем средний уровень фильтрации
$Sanitizer->SetLevel(CBXSanitizer::SECURE_LEVEL_MIDDLE);

// Очищаем HTML-код с помощью санитайзера
$pureHtml = $Sanitizer->SanitizeHtml($html);
```

## Пример работы санитайзера

Санитайзеру с уровнем фильтрации `SECURE_LEVEL_MIDDLE` поступает HTML-код.

```html
<div>
    <p>Это безопасный текст.</p>
    <script>alert('XSS');</script>
    <img src="images/photo.jpg" onerror="alert('XSS')">
</div>
```

Санитайзер удалит:

1. тег `<div>`,

2. тег `<script>` и его содержимое,

3. атрибут `onerror` из тега `<img>`.

```html
    <p>Это безопасный текст.</p>
    <img src="images/photo.jpg">
```

## Рекомендации

-  Используйте санитайзер везде, где пользователи могут вводить HTML. Это защитит ваш сайт от вредоносного кода.

-  Начинайте с высокого уровня фильтрации. Он обеспечивает максимальную защиту. Если он удаляет нужные теги, перейдите на средний или низкий уровень.

-  Проверяйте результат очистки. Убедитесь, что нужные элементы остались на месте, например, ссылки или изображения.
