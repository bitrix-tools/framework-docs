---
title: Работа с изображениями
description: 'Работа с изображениями. Продвинутые возможности Bitrix Framework: инструменты, сценарии и практические рекомендации.'
---

В Bitrix Framework доступна библиотека для обработки изображений. Она позволяет загружать изображения, изменять их и сохранять результат. Работа не зависит от выбранного движка обработки.

Основной класс библиотеки — `Bitrix\Main\File\Image`.

## Выбрать движок обработки изображений

Библиотека поддерживает два движка. Интерфейс класса `Bitrix\Main\File\Image` одинаковый для обоих вариантов.

-  GD2 — для базовых операций, работает без настройки. Используется по умолчанию, если движок не указан в `.settings.php`.

-  Imagick — для обработки больших изображений, анимированных GIF и сложных фильтров.

### Движок GD2

Движок `Bitrix\Main\File\Image\Gd` использует встроенное в PHP-расширение GD2. Он работает без дополнительной настройки и подходит для большинства задач:

-  изменить размер,

-  повернуть изображение,

-  наложить водяной знак,

-  применить базовые фильтры.

GD2 поддерживает формат WebP, если PHP собран с соответствующей библиотекой.

Чтобы начать работу, создайте объект `Bitrix\Main\File\Image`. Дополнительная настройка не нужна.

Если нужно явно указать движок, добавьте настройку в файл `/bitrix/.settings.php`:

```php
return [
    'services' => [
        'value' => [
            'main.imageEngine' => [
                'className' => '\Bitrix\Main\File\Image\Gd',
            ],
        ],
        'readonly' => true,
    ],
];
```

### Движок Imagick

Движок `Bitrix\Main\File\Image\Imagick` использует расширение Imagick на основе библиотеки ImageMagick. Он потребляет меньше памяти, поддерживает анимированные GIF и сложные операции. Формат WebP поддерживается всегда.

#### Установить расширение

Расширение Imagick не входит в стандартную поставку PHP, но доступно в виртуальной машине VMBitrix.

Чтобы включить расширение, выполните команды в меню виртуальной машины:

```swift
/root/menu.sh
Manage pool web servers
Manage PHP extensions
Enable imagick extension
```

#### Настроить движок

Чтобы использовать Imagick, укажите его в настройках сервиса `main.imageEngine` в файле `/bitrix/.settings.php`.

Параметры конструктора Imagick:

-  `allowAnimatedImages` — обрабатывать все кадры анимированных GIF,

-  `maxSize` — максимальные допустимые размеры изображения,

-  `substImage` — путь к изображению-заглушке при превышении `maxSize`,

-  `jpegLoadSize` — принудительное масштабирование JPEG при загрузке для экономии памяти.

```php
return [
    'services' => [
        'value' => [
            'main.imageEngine' => [
                'className' => '\Bitrix\Main\File\Image\Imagick',
                'constructorParams' => [
                    null,
                    [
                        'allowAnimatedImages' => true,
                        'maxSize' => [10000, 10000],
                        'substImage' => '/home/bitrix/www/image.png',
                        'jpegLoadSize' => [2000, 2000],
                    ],
                ],
            ],
        ],
        'readonly' => true,
    ],
];
```

Если настройки отсутствуют, система автоматически использует движок `Bitrix\Main\File\Image\Gd`.

## Загрузить изображение в память

Чтобы безопасно загрузить изображение и сэкономить ресурсы, выполните три шага.

### 1\. Создать объект изображения

Создайте объект `\Bitrix\Main\File\Image` и передайте путь к файлу:

```php
use Bitrix\Main\File\Image;

$image = new Image("/home/bitrix/www/sticker.gif");
```

Этот шаг не загружает изображение в память. Он связывает объект с файлом на диске.

### 2\. Получить метаданные

Получите информацию о файле, чтобы проверить параметры до выделения ресурсов.

```php
$info = $image->getInfo();
echo $info->getWidth(); // ширина
```

Метод `getInfo()` возвращает объект `Bitrix\Main\File\Image\Info`. Используйте геттеры:

-  `getWidth()` — ширина в пикселях,

-  `getHeight()` — высота в пикселях,

-  `getMime()` — MIME-тип,

-  `getFormat()` — числовой код формата.

Для JPEG-файлов получите EXIF-данные:

```php
$exif = $image->getExifData();
$orientation = $exif['Orientation'] ?? 1;
```

Некоторые камеры не поворачивают изображение, а записывают ориентацию в EXIF. Без обработки такие изображения отображаются под углом. Чтобы исправить ориентацию, вызовите `$image->autoRotate($orientation)`. Метод `autoRotate()` ожидает значение ориентации от 1 до 8, как определено в стандарте EXIF.

{% note info "" %}

Чтобы избежать ошибок при загрузке больших файлов, проверьте размеры изображения заранее с помощью `exceedsMaxSize()`.

{% endnote %}

### 3\. Загрузить изображение

Вызовите метод `load()`, чтобы загрузить изображение в память:

```php
if ($image->load())
{
    // изображение успешно загружено и готово к обработке
}
```

Если файл поврежден или превышает лимит `maxSize`, метод вернет `false`.

## Обработать изображение

После успешной загрузки выполните обработку изображения с помощью методов класса `Bitrix\Main\File\Image`.

### Доступные методы

-  `rotate($angle, $bgColor)` — повернуть по часовой стрелке,

-  `flipVertical()` — отразить по вертикали,

-  `flipHorizontal()` — отразить по горизонтали,

-  `autoRotate($orientation)` — исправить ориентацию по EXIF,

-  `setOrientation($orientation)` — задать ориентацию вручную,

-  `resize($source, $destination)` — изменить размер,

-  `blur($sigma)` — размыть изображение,

-  `filter($mask)` — применить фильтр на основе свертки,

-  `drawWatermark($watermark)` — наложить водяной знак,

-  `getWidth()`, `getHeight()`, `getDimensions()` — получить актуальные размеры.

Все методы возвращают `bool`: `true` при успехе, `false` — при ошибке.

### Подготовить параметры

Для работы с методами обработки используйте дополнительные классы:

-  `Bitrix\Main\File\Image\Color` — задает цвет в формате RGBA,

-  `Bitrix\Main\File\Image\Rectangle` — описывает область изображения: ширину, высоту, смещение,

-  `Bitrix\Main\File\Image\Mask` — определяет матрицу фильтра 3×3,

-  `Bitrix\Main\File\Image\ImageWatermark` — графический водяной знак,

-  `Bitrix\Main\File\Image\TextWatermark` — текстовый водяной знак.

### Примеры обработки

Рассмотрите типовые сценарии работы с изображениями.

#### Изменить размер изображения

```php
use Bitrix\Main\File\Image;
use Bitrix\Main\File\Image\Rectangle;

$image = new Image('/home/bitrix/www/sticker.gif');

if ($image->load())
{
    // Исходный прямоугольник по текущим размерам изображения
    $source = new Rectangle($image->getWidth(), $image->getHeight());
    
    // Целевой прямоугольник с максимальными размерами
    $destination = new Rectangle(400, 400);

    // Корректируем $destination с учетом режима пропорций
    if ($source->resize($destination, Image::RESIZE_PROPORTIONAL))
    {
        $image->resize($source, $destination);
    }
}
```

Метод `Rectangle::resize()` вычисляет, нужно ли изменять размеры, и при необходимости корректирует целевой прямоугольник `$destination`.

Режимы изменения размера:

-  `Image::RESIZE_PROPORTIONAL` — вписать по меньшей стороне,

-  `Image::RESIZE_PROPORTIONAL_ALT` — вписать по большей стороне,

-  `Image::RESIZE_EXACT` — заполнить с возможной обрезкой.

#### Применить фильтр резкости

```php
use Bitrix\Main\File\Image;
use Bitrix\Main\File\Image\Mask;

$image = new Image('/home/bitrix/www/sticker.gif');

if ($image->load())
{
    $image->filter(Mask::createSharpen(15));
}
```

Фильтр `createSharpen(15)` создает стандартную матрицу повышения резкости. Значение `15` регулирует интенсивность.

#### Наложить водяной знак

Добавьте полупрозрачный графический водяной знак. Прозрачность укажите в процентах: `0` — полностью прозрачный, `100` — непрозрачный.

```php
use Bitrix\Main\File\Image;
use Bitrix\Main\File\Image\ImageWatermark;

$image = new Image('/home/bitrix/www/sticker.gif');

if ($image->load())
{
    $watermark = new ImageWatermark("/home/bitrix/www/watermark.png");
    $watermark->setAlpha(70); // прозрачность 70%
    $image->drawWatermark($watermark);
}
```

Для текстового водяного знака используйте `Image\TextWatermark($text, $font, Color $color = null)`. Текст автоматически конвертируется в UTF-8 из кодировки текущего сайта.

## Сохранить изображение

После обработки сохраните результат с помощью метода `saveAs()` или `save()`.

Метод `saveAs()` принимает три параметра:

-  `$file` — путь к файлу, куда сохранить изображение,

-  `$quality` — качество сжатия от `1` до `100`, по умолчанию `95`,

-  `$format` — формат изображения: `Image::FORMAT_PNG`, `Image::FORMAT_JPEG`, `Image::FORMAT_GIF`, `Image::FORMAT_BMP` или `Image::FORMAT_WEBP`.

Метод `save()` принимает один параметр `$quality`. Система сохраняет изображение в исходный файл, который задан при создании объекта. Проверьте, что перезапись файла допустима в сценарии скрипта.

После завершения работы с изображением обязательно вызовите метод `clear()`. Он освобождает память, которая занята изображением. Это важно при обработке множества файлов в цикле.

```php
use Bitrix\Main\File\Image;

$image = new Image('/home/bitrix/www/sticker.gif');

if ($image->load())
{
    // ... после обработки 
    $image->saveAs("/home/bitrix/www/resized_sticker.gif", 95, Image::FORMAT_GIF);
    // Освобождаем память
    $image->clear(); 
}
```

{% note info "" %}

Убедитесь, что веб-сервер может записывать файлы в указанную папку.

{% endnote %}