---
title: Формирование запросов
description: 'Формирование запросов. Работа с базой данных в Bitrix: лучшие практики, инструкция и примеры запросов.'
---

В Bitrix Framework есть два инструмента для работы с SQL-запросами.

**SqlHelper.** Отвечает за экранирование данных и форматирование SQL-выражений.

**SqlExpression.** Позволяет строить безопасные запросы через плейсхолдеры и автоматически защищает от инъекций.

## SqlHelper. Экранирование и базовые операции

ORM автоматически использует SqlHelper для стандартных операций. Обращайтесь к SqlHelper напрямую, если нужно:

-  выполнить сложный SQL-запрос,

-  оптимизировать производительность запросов.

Получить SqlHelper:

```php
$helper = \Bitrix\Main\Application::getConnection()->getSqlHelper();
```

### Как экранировать данные

Экранировать названия столбцов:

```php
$helper->quote('id'); // `id`
$helper->quote('table_name.id'); // `table_name`.`id`
$helper->quote('не ` безопасная " строка'); // `не  безопасная " строка`
```

Экранировать значения:

```php
$safeValue = $helper->forSql('не " безопасная \' строка'); // не \" безопасная \' строка
```

### Как конвертировать данные для SQL

Общий метод `convertToDb` обрамляет строки в кавычки, `NULL` преобразует в `'NULL'`:

```php
$helper->convertToDb('не " безопасная \' строка'); // 'не \" безопасная \' строка'
$helper->convertToDb(null); // 'NULL'
$helper->convertToDb(123); // '123'
```

Указать тип поля:

```php
$helper->convertToDb('строка', new \Bitrix\Main\ORM\Fields\FloatField('column_name')); // 0
$helper->convertToDb(123, new \Bitrix\Main\ORM\Fields\TextField('column_name')); // '123'
```

### Как работать со строками и числами

Конвертировать в строку. Метод преобразует `NULL` в пустую строку:

```php
$helper->convertToDbString('строка'); // 'строка'
$helper->convertToDbString(null); // ''
$helper->convertToDbString(123); // '123'
```

Обрезать строку до нужной длины:

```php
$helper->convertToDbString('Длинная строка', 10); // 'Длинная и '
```

Конвертировать для текстовых полей. Аналогично `convertToDbString`, но без указания длины:

```php
$helper->convertToDbText('строка'); // 'строка'
$helper->convertToDbText(null); // ''
$helper->convertToDbText(123); // '123'
```

### Как конвертировать данные для работы с БД

Конвертировать бинарные данные:

```php
$binaryData = base64_decode('iVBORw0KGgoAAA==');
$helper->convertToDbBinary($binaryData); // 'PNG\r\n\Z\n\0\0'
```

Конвертировать в целое число:

```php
$helper->convertToDbInteger('строка'); // 0
$helper->convertToDbInteger(null); // 0
$helper->convertToDbInteger(123); // 123
$helper->convertToDbInteger(123.456); // 123
```

Ограничить размер числа в байтах:

```php
$helper->convertToDbInteger(10_000_000_000, 2); // 32767 (макс. для 2 байт)
$helper->convertToDbInteger(10_000_000_000, 4); // 2147483647 (макс. для 4 байт)
```

Конвертировать в число с плавающей точкой:

```php
$helper->convertToDbFloat('строка'); // '0'
$helper->convertToDbFloat(123.456); // '123.456'
```

Указать количество знаков после запятой:

```php
$helper->convertToDbFloat(123.456789, 1); // '123.5'
```

### Как выполнять операции с датами и временем

Конвертировать дату:

```php
$helper->convertToDbDate(new \Bitrix\Main\Type\Date('01.01.2015')); // '2015-01-01'
```

Конвертировать время:

```php
$helper->convertToDbDateTime(new \Bitrix\Main\Type\DateTime('01.01.2015 01:23:45')); // '2015-01-01 01:23:45'
```

Два последних метода -- `convertToDbDate` и `convertToDbDateTime` -- принимают `null` или объекты `Date`/`DateTime`. При других типах данных выбрасывают исключение.

Получить формат даты для текущей БД:

```php
$helper->formatDate('DD.MM.YYYY HH:MI'); // %d.%m.%Y %H:%i
```

Форматировать столбец или значение:

```php
// Форматирование столбца
$helper->formatDate('DD.MM.YYYY HH:MI', $helper->quote('column_name')); 
// DATE_FORMAT(`column_name`, '%d.%m.%Y %H:%i')

// Форматирование конкретного значения
$helper->formatDate('DD.MM.YYYY HH:MI', $helper->convertToDb('2024-01-01')); 
// DATE_FORMAT('2024-01-01', '%d.%m.%Y %H:%i')
```

Добавить секунды:

```php
// К текущей дате
$helper->addSecondsToDateTime(60); // DATE_ADD(NOW(), INTERVAL 60 SECOND)

// К значению столбца
$helper->addSecondsToDateTime(60, $helper->quote('column')); 
// DATE_ADD(`column`, INTERVAL 60 SECOND)

// К конкретной дате
$helper->addSecondsToDateTime(60, $helper->convertToDb('2024-01-01')); 
// DATE_ADD('2024-01-01', INTERVAL 60 SECOND)
```

Добавить дни:

```php
// К текущей дате
$helper->addDaysToDateTime(60); // DATE_ADD(NOW(), INTERVAL 60 DAY)

// К значению столбца
$helper->addDaysToDateTime(60, $helper->quote('column')); 
// DATE_ADD(`column`, INTERVAL 60 DAY)

// К конкретной дате
$helper->addDaysToDateTime(60, $helper->convertToDb('2024-01-01')); 
// DATE_ADD('2024-01-01', INTERVAL 60 DAY)
```

### Как работать с SQL-функциями

Получить текущую дату или время:

```php
$helper->getCurrentDateFunction();      // CURDATE()
$helper->getCurrentDateTimeFunction(); // NOW()
```

Преобразовать дату и время в дату:

```php
$helper->getDatetimeToDateFunction($helper->quote('column_name'));  // DATE(`column_name`)
$helper->getDatetimeToDateFunction($helper->convertToDb('2024-01-01')); // DATE('2024-01-01')
```

Эти методы преобразуют данные для совместимости в PostgreSQL. В MySQL они не требуются:

```php
$helper->getCharToDateFunction(date('Y-m-d H:i:s')); // timestamp '2024-01-01 00:00:00'
$helper->getDateToCharFunction($helper->quote('column_name')); // TO_CHAR([column_name], 'YYYY-MM-DD HH24:MI:SS')
```

Получить подстроку:

```php
$helper->getSubstrFunction($helper->quote('column_name'), 1);     // SUBSTR(`column_name`, 1)
$helper->getSubstrFunction($helper->quote('column_name'), 1, 10); // SUBSTR(`column_name`, 1, 10)
```

Провести конкатенацию -- объединение строк:

```php
$helper->getConcatFunction(); // ''
$helper->getConcatFunction(1, 2, 3); // CONCAT(1, 2, 3)
$helper->getConcatFunction(
    $helper->quote('column_name'),
    $helper->convertToDb('delimiter'),
    $helper->quote('another_column')
); // CONCAT(`column_name`, 'delimiter', `another_column`)
```

Проверить на `NULL`:

```php
$helper->getIsNullFunction($helper->quote('column_name'), 1); // IFNULL(`column_name`, 1)
$helper->getIsNullFunction($helper->quote('column_name'), $helper->convertToDb('value')); // IFNULL(`column_name`, 'value')
```

Получить длину строки:

```php
$helper->getLengthFunction($helper->quote('column_name')); // LENGTH(`column_name`)
```

Сгенерировать случайное число:

```php
$helper->getRandomFunction(); // rand()
```

Преобразовать строку в хеш:

```php
$helper->getSha1Function($helper->quote('column_name')); // sha1(`column_name`)
```

Найти совпадения в тексте:

```php
$helper->getMatchFunction($helper->quote('column_name'), $helper->convertToDb('value')); 
// MATCH (`column_name`) AGAINST ('value' IN BOOLEAN MODE)
```

{% note warning "" %}

**Важно**

Описанные выше методы работы с датами и функциями принимают аргументы без автоматического экранирования, чтобы сохранить возможность использовать SQL-конструкции в качестве параметров.

{% endnote %}

### Как совершать пакетные операции с данными

`prepareMerge()` -- добавляет или обновляет одну запись:

```php
[ $sql ] = $helper->prepareMerge(
    tableName: 'b_user_counter',
    primaryFields: ['USER_ID', 'SITE_ID', 'CODE'],
    insertFields: [
        'USER_ID' => 1,
        'SITE_ID' => 's1',
        'CODE' => 'counter_name',
        'CNT' => 10,
    ],
    updateFields: [
        'CNT' => new \Bitrix\Main\DB\SqlExpression('?# + ?i', 'CNT', 10),
    ],
);
```

Генерирует запрос:

```sql
INSERT INTO `b_user_counter` (`USER_ID`, `SITE_ID`, `CODE`, `CNT`)
VALUES (1, 's1', 'counter_name', 10)
ON DUPLICATE KEY UPDATE `CNT` = `CNT` + 10
```

`prepareMergeValues()` -- добавляет или обновляет несколько записей:

```php
$sql = $helper->prepareMergeValues(
    tableName: 'b_user_counter',
    primaryFields: ['USER_ID', 'SITE_ID', 'CODE'],
    insertRows: [
        ['USER_ID' => 1, 'SITE_ID' => 's1', 'CODE' => 'counter_name', 'CNT' => 1],
        ['USER_ID' => 2, 'SITE_ID' => 's1', 'CODE' => 'counter_name', 'CNT' => 1],
        ['USER_ID' => 2, 'SITE_ID' => 's1', 'CODE' => 'another_counter', 'CNT' => 1],
    ],
    updateFields: [
        'CNT' => new \Bitrix\Main\DB\SqlExpression('?# + ?i', 'CNT', 1),
    ],
);
```

Генерирует запрос:

```sql
INSERT INTO `b_user_counter` (`USER_ID`,`SITE_ID`,`CODE`,`CNT`)
VALUES (1, 's1', 'counter_name', 1),(2, 's1', 'counter_name', 1),(2, 's1', 'another_counter', 1)
ON DUPLICATE KEY UPDATE `CNT` = `CNT` + 1
```

`prepareMergeSelect()` -- добавляет или обновляет из подзапроса:

```php
$sql = $helper->prepareMergeSelect(
    tableName: 'b_user_counter',
    primaryFields: ['USER_ID', 'SITE_ID', 'CODE'],
    selectFields: ['USER_ID', 'SITE_ID', 'CODE', 'CNT'],
    select: '(SELECT * FROM my_counters)',
    updateFields: [
        'CNT' => new \Bitrix\Main\DB\SqlExpression('?# + ?i', 'CNT', 10),
    ],
);
```

Генерирует запрос:

```sql
INSERT INTO `b_user_counter` (`USER_ID`,`SITE_ID`,`CODE`,`CNT`)
(SELECT * FROM my_counters)
ON DUPLICATE KEY UPDATE `CNT` = `CNT` + 10
```

`prepareMergeMultiple()` -- полностью заменяет записи:

```php
$sqlQueries = $helper->prepareMergeMultiple(
    tableName: 'b_user_counter',
    primaryFields: ['USER_ID', 'SITE_ID', 'CODE'],
    insertRows: [
        ['USER_ID' => 1, 'SITE_ID' => 's1', 'CODE' => 'counter_name', 'CNT' => 5],
        ['USER_ID' => 2, 'SITE_ID' => 's1', 'CODE' => 'counter_name', 'CNT' => 10],
        ['USER_ID' => 2, 'SITE_ID' => 's1', 'CODE' => 'another_counter', 'CNT' => 15],
    ],
);
```

Генерирует запросы, может разделить на несколько при большом объеме данных:

```sql
REPLACE INTO `b_user_counter` (`USER_ID`, `SITE_ID`, `CODE`, `CNT`)
VALUES (1, 's1', 'counter_name', 5), (2, 's1', 'counter_name', 10), (2, 's1', 'another_counter', 15)
```

## SqlExpression. Безопасное построение запросов

SqlExpression использует специальные метки -- плейсхолдеры. При компиляции запроса плейсхолдеры заменяются на экранированные значения для предотвращения SQL-инъекций.

-  `?` -- автоматическое преобразование.

-  `?s` -- строка.

-  `?i` -- целое число.

-  `?f` -- число с плавающей точкой.

-  `?#` -- имя столбца.

-  `?v` -- подстановка значений VALUES для запросов типа INSERT и UPDATE.

Создать новый объект:

```php
$sql = new SqlExpression('SELECT * FROM b_user');
$result = Application::getConnection()->query($sql);
```

Получить готовый SQL-запрос можно двумя способами:

```php
echo $sql->compile(); // Явный вызов компиляции
echo (string)$sql;    // Неявное преобразование в строку
```

Создать новое SQL-выражение с использованием SqlExpression для безопасного формирования запроса:

```php
$sql = new SqlExpression(
    // Шаблон SQL-запроса с плейсхолдерами для безопасной подстановки параметров
    'SELECT * FROM ?# WHERE (ID = ?i OR ID > ?f) AND `NAME` = ?s AND DATE_REGISTER > ?',
    
    // Параметры, которые будут подставлены вместо плейсхолдеров:
    
    'b_user',       // ?# — имя таблицы (экранируется как идентификатор)
    
    1,              // ?i — целочисленное значение (ID = 1)
    
    1.23,           // ?f — число с плавающей точкой (ID > 1.23)
    
    'admin',        // ?s — строковое значение (NAME = 'admin', с экранированием)
    
    new \Bitrix\Main\Type\Date('01.01.2024') // ? — объект даты (DATE_REGISTER > '2024-01-01')
);
```

Результат:

```sql
SELECT * FROM `b_user` WHERE (ID = 1 OR ID > 1.23) AND `NAME` = 'admin' AND DATE_REGISTER > '2024-01-01'
```

Передача `NULL` преобразует в `NULL` все плейсхолдеры, кроме `?#`:

```php
$sql = new SqlExpression(
    'SELECT * FROM ?# WHERE ID = ?i OR NAME = ?',
    null,
    null,
    null
);
```

Результат:

```sql
SELECT * FROM `` WHERE ID = NULL OR NAME = NULL
```

Для дат используйте базовый плейсхолдер `?` для автоматического форматирования. Для строкового представления -- `?s`:

```php
$sql = new SqlExpression(
    'WHERE (DATE = ? OR DATE_TIME = ?)
     AND (DATE = ?s OR DATE_TIME = ?s)',
    new \Bitrix\Main\Type\Date('01.01.2024'),
    new \Bitrix\Main\Type\DateTime('01.01.2024'),
    new \Bitrix\Main\Type\Date('01.01.2024'),
    new \Bitrix\Main\Type\DateTime('01.01.2024')
);
```

Результат:

```sql
WHERE (DATE = '2024-01-01' OR DATE_TIME = '2024-01-01 00:00:00')
AND (DATE = '01.01.2024' OR DATE_TIME = '01.01.2024 00:00:00')
```
