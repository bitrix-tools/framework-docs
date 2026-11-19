---
title: File — работа с файлом
description: Класс Bitrix\Main\IO\File читает, записывает и удаляет файл, открывает его для потоковой работы и проверяет существование.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\IO`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.7

{% endnote %}

## Когда использовать

Класс `File` работает с одним файлом на диске сервера. Конструктор класса принимает полный путь к файлу, например `Application::getDocumentRoot() . '/upload/demo-units.txt'`. Для однократной операции используйте статические методы [getFileContents](get-file-contents.md), [putFileContents](put-file-contents.md), [isFileExists](is-file-exists.md) и [deleteFile](delete-file.md). Они создают объект сами.

Класс приводит путь к единому виду методом `Path::normalize` и переводит его в кодировку файловой системы.

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [isFileExists](is-file-exists.md) | Проверяет, существует ли файл по пути | |
| [getFileContents](get-file-contents.md) | Возвращает содержимое файла по пути | |
| [putFileContents](put-file-contents.md) | Записывает данные в файл по пути | 15.0.15 |
| [deleteFile](delete-file.md) | Удаляет файл по пути | |
| [open](open.md) | Открывает файл и возвращает указатель | |
| [seek](seek.md) | Перемещает указатель открытого файла | 15.0.15 |
| [close](close.md) | Закрывает открытый файл | 15.0.15 |
| [getContentType](get-content-type.md) | Возвращает MIME-тип файла | |

## Константы

| Константа | Значение | Описание |
| --- | --- | --- |
| `REWRITE` | `0` | Режим записи с заменой содержимого |
| `APPEND` | `1` | Режим записи в конец файла |

Класс `Bitrix\Main\IO\FileStreamOpenMode` хранит режимы открытия для метода [open](open.md):

- `FileStreamOpenMode::READ` — чтение, значение `r`,
- `FileStreamOpenMode::WRITE` — запись с очисткой файла, значение `w`,
- `FileStreamOpenMode::APPEND` — запись в конец файла, значение `a`.

## Наследование

Класс наследует `Bitrix\Main\IO\FileEntry`, а `FileEntry` наследует `Bitrix\Main\IO\FileSystemEntry`. Класс реализует интерфейс `Bitrix\Main\IO\IFileStream`.

### Реализация методов базового класса

| Метод | Особенность реализации |
| --- | --- |
| `__construct($path, $siteId = null)` | Принимает полный путь к файлу. Выбрасывает `Bitrix\Main\IO\InvalidPathException`, если путь пустой, не строка, содержит нулевой байт или через `..` выходит за корень. Параметр `siteId` задает сайт, корень которого метод `isSystem` использует для проверки системных путей |
| `isExists` | Возвращает `true`, если по пути есть файл или рабочая символическая ссылка, в том числе на каталог. Запоминает результат, пока код не запишет, не удалит или не переименует файл через объект |
| `getContents` | Возвращает содержимое файла строкой. Если файла нет, выбрасывает `Bitrix\Main\IO\FileNotFoundException` |
| `putContents($data, $flags = File::REWRITE)` | Создает каталог файла, если его нет. Снимает защиту от записи с существующего файла. Записывает данные и возвращает число записанных байтов или `false`. С флагом `File::APPEND` дописывает данные в конец |
| `getSize` | Возвращает размер файла в байтах. Если файла нет, выбрасывает `FileNotFoundException` |
| `isWritable`, `isReadable` | Проверяют права на запись и чтение. Если файла нет, выбрасывают `FileNotFoundException` |
| `readFile` | Выводит содержимое файла и возвращает число байтов. Если файла нет, выбрасывает `FileNotFoundException` |
| `markWritable` | Устанавливает файлу права из константы `BX_FILE_PERMISSIONS`. Если файла нет, выбрасывает `FileNotFoundException` |
| `delete` | Удаляет файл и возвращает результат `unlink`. Если файла нет или по пути каталог, возвращает `true` и ничего не удаляет |

### Унаследованные методы

Методы `getName`, `getExtension`, `getPath`, `getPhysicalPath`, `getDirectory`, `getDirectoryName`, `rename`, `getModificationTime`, `getCreationTime`, `getLastAccessTime`, `getPermissions` и `isSystem` работают как в классах `FileEntry` и `FileSystemEntry`. Методы `isFile`, `isDirectory` и `isLink` у файла возвращают `true`, `false` и `false`. Устаревший метод `getFileSize` вызывает `getSize`.

## Смотрите также

- [File::putFileContents](put-file-contents.md)
- [File::open](open.md)
