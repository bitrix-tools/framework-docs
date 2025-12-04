---
title: Выполнение запросов
description: 'Выполнение запросов. Работа с базой данных в Bitrix: лучшие практики, инструкция и примеры запросов.'
---

Для начала работы с базой данных получите объект соединения:

```php
/** @var \Bitrix\Main\DB\Connection $db */
$db = \Bitrix\Main\Application::getConnection();
```

## Как выполнять SELECT-запросы

Сделать базовый запрос:

```php
$result = $db->query('SELECT `ID`, `NAME` FROM b_user');
```

Ограничить количество результатов:

```php
// Вернет первые 10 записей
$result = $db->query('SELECT `ID`, `NAME` FROM b_user', 10);
// SQL: SELECT `ID`, `NAME` FROM b_user LIMIT 0,10
```

Ограничить количество результатов со смещением:

```php
// Вернет 10 записей, начиная с 5-й
$result = $db->query('SELECT `ID`, `NAME` FROM b_user', 5, 10);
// SQL: SELECT `ID`, `NAME` FROM b_user LIMIT 5,10
```

Получить скалярное значение:

```php
// Вернет значение первого столбца первой строки
$id = $db->queryScalar('SELECT `ID`, `NAME` FROM b_user');
// SQL: SELECT `ID`, `NAME` FROM b_user LIMIT 0,1
```

Выполнить запрос без возврата результата:

```php
$db->queryExecute('UPDATE b_user SET ACTIVE = "Y" WHERE DATE_REGISTER > "2024-01-01"');
```

{% note warning "Важно" %}

Параметры `binds` в методах `query`, `queryScalar` и `queryExecute` не обеспечивают защиту от SQL-инъекций. Для защиты используйте `SqlExpression` или `SqlHelper`.

{% endnote %}

## Как выполнять INSERT-запросы

Добавить одну запись:

```php
$id = $db->add('my_table', [
    'NAME' => 'example',
    'CONTENT' => 'Про "базы" данных'
]);
// SQL: INSERT INTO `my_table`(`NAME`, `CONTENT`) VALUES ('example', 'про \" базы \'')
```

Сделать массовое добавление записей:

```php
$lastId = $db->addMulti('my_table', [
    [
        'NAME' => 'example one',
        'CONTENT' => 'Первая статья'
    ],
    [
        'NAME' => 'example two',
        'CONTENT' => "Вторая статья"
    ]
]);
// SQL: INSERT INTO `my_table` (`NAME`, `CONTENT`) VALUES ('example one', 'про \" базы \''), ('example two', '\';SELECT * FROM b_user WHERE ID = 1')
```

Методы `add()` и `addMulti()` преобразуют значения и проверяют существование столбцов в таблице. Если указанного столбца нет, метод исключает его из запроса:

```php
/**
 * Выполнится запрос:
 * INSERT INTO `b_user`(`NAME`) VALUES ('habr')
 */
$insertedId = $db->add('b_user', [
    'NAME' => 'example',
    'NOT_EXISTS_COLUMN' => 'что я тут делаю?', // Этот столбец пропустят, так как его нет в таблице
]);
```

## Методы работы с таблицами

### Создать новую таблицу

Создает новую таблицу метод `createTable`. Параметры метода:

-  `$tableName` -- имя создаваемой таблицы,

-  `$arFields` -- массив полей таблицы в формате `'FIELD_NAME' => FieldObject`.

```php
$db->createTable('my_table', [

    // Поле ID — целочисленный идентификатор
    // Используем IntegerField с параметрами:
    'ID' => new \Bitrix\Main\ORM\Fields\IntegerField('ID', [
        'primary' => true,      // Указываем что это первичный ключ
        'autocomplete' => true  // Включаем автоинкремент, то есть значение будет увеличиваться автоматически
    ]),

    // Поле NAME — строковое поле для хранения названия
    // Используем StringField с параметрами:
    'NAME' => new \Bitrix\Main\ORM\Fields\StringField('NAME', [
        'size' => 255  // Максимальная длина строки — 255 символов
    ]),
]);
```

### Удалить существующую таблицу

Удаляет таблицу метод `dropTable`. В методе нужно указать название таблицы.

```php
$db->dropTable('my_table');
```

### Создать индекс

Создает индекс метод `createIndex`. Параметры метода:

-  `$indexName` -- имя создаваемого индекса,

-  `$tableName` -- имя таблицы,

-  `$columns` -- массив имен столбцов для индекса,

-  `$unique` -- флаг уникальности индекса, по умолчанию `false`.

```php
$db->createIndex('idx_name', 'my_table', ['NAME'], true);
```

### Создать первичный ключ для таблицы

Создает первичный ключ метод `createPrimaryIndex`. Параметры метода:

-  `$tableName` -- имя таблицы,

-  `$columnNames`  -- массив имен столбцов, входящих в первичный ключ.

```php
$db->createPrimaryIndex('my_table', ['ID']);
```

### Удалить столбец из таблицы

Удаляет столбец метод `dropColumn`. Параметры метода:

-  `$tableName` -- имя таблицы,

-  `$columnName`  -- имя удаляемого столбца.

```php
$db->dropColumn('my_table', 'DESCRIPTION');
```

### Переименовывать таблицу

Переименовывает таблицу метод `renameTable`. Параметры метода:

-  `$oldTableName` -- текущее имя таблицы,

-  `$newTableName` -- новое имя таблицы.

```php
$db->renameTable('old_table', 'new_table');
```

### Очистить данные в таблице

Очищает данные метод `truncateTable`. В методе нужно указать имя таблицы.

```php
$db->truncateTable('my_table');
```

### Проверить существование таблицы

Проверяет существование таблицы метод `isTableExists`. Метод возвращает `true` если таблица существует, `false` если нет.

```php
$db->isTableExists('my_table');
```

### Вернуть описание полей таблицы

Возвращает описание полей таблицы метод `getTableFields`. Метод возвращает ассоциативный массив с описанием полей таблицы.

```php
$fields = $db->getTableFields('my_table');
```

## Как работать с результатами запросов

Выполнение запроса на чтение возвращает объект `\Bitrix\Main\DB\Result`, который предоставляет несколько способов работы с данными.

Использовать как итератор:

```php
$result = $connection->query('SELECT * FROM b_user');
foreach ($result as $row) {
    $id = $row['ID'];
}
```

Читать построчно:

```php
while ($row = $result->fetch()) {
    $id = $row['ID'];
}
```

### Разница между `fetch()` и `fetchRaw()`

-  `fetch()` -- автоматически преобразует данные согласно настройкам системы.

-  `fetchRaw()` -- возвращает данные в оригинальном формате.

```php
// fetch() — с преобразованием типов
$row = $result->fetch();
// [
//    'ID' => 1,
//    'ACTIVE' => 'Y',
//    'DATE_REGISTER' => Bitrix\Main\Type\DateTime Object
// ]

// fetchRaw() — оригинальные данные
$row = $result->fetchRaw();
// [
//    'ID' => 1,
//    'ACTIVE' => 'Y', 
//    'DATE_REGISTER' => '2021-12-29 09:50:14'
// ]
```

## Конвертеры и модификаторы данных

Добавляйте свои конвертеры столбцов и модификаторы выборки, чтобы преобразовывать данные перед использованием.

**Конвертер столбца**. Преобразует значение одного столбца. Это полезно, если нужно изменить формат данных. Например, можно изменить формат даты:

```php
$resultIterator = \Bitrix\Main\Application::getConnection()->query(
    'SELECT ID, ACTIVE, DATE_REGISTER FROM b_user'
);

// Конвертер для столбца DATE_REGISTER (преобразует строку в timestamp)
$resultIterator->setConverters([
    'DATE_REGISTER' => static fn($value) => $value ? strtotime($value) : null,
]);
```

**Модификатор выборки**. Обрабатывает всю выборку данных. Это полезно, если требуется добавить вычисляемые поля или сложную логику обработки. Например, можно добавить новое поле на основе существующих:

```php
// Модификатор добавляет поле ACTIVE_BOOL (true/false на основе ACTIVE)
$resultIterator->addFetchDataModifier(static function(array $row) {
    $row['ACTIVE_BOOL'] = $row['ACTIVE'] === 'Y';
    return $row;
});
```

Данные после обработки:

```php
foreach ($resultIterator as $row) {
    /**
     * [ID] => 1
     * [ACTIVE] => Y
     * [DATE_REGISTER] => 1640771366
     * [ACTIVE_BOOL] => true
     */
    print_r($row);
    break;
}
```

### Дополнительные методы

```php
// Количество выбранных строк
$count = $result->getSelectedRowsCount();

// Объект драйвера БД. Например, для MySQL это экземпляр класса mysqli_result
$resource = $result->getResource();

// Список полей в результате
$fields = $result->getFields();
```

{% note warning "" %}

Объект `Result` поддерживает только последовательное чтение данных -- после прохода по результатам повторный запрос данных невозможен.

{% endnote %}
