---
title: SQL-инъекции
description: 'SQL-инъекции. Руководство по безопасности Bitrix: защита, рекомендации и правильные настройки.'
---

SQL-инъекция -- уязвимость, которая позволяет внедрить вредоносный код через пользовательский ввод. В Bitrix Framework есть два способа работы с базой данных, каждый требует особого подхода к защите:

-  **Прямые запросы.** SQL-запросы выполняются напрямую методами класса `CDatabase` или через метод `Application::getConnection`. Разработчик контролирует формирование запросов, поэтому важно тщательно проверять и экранировать пользовательский ввод, чтобы избежать SQL-инъекций.

-  **ORM**. Объектная модель снижает риск SQL-инъекций, так как она автоматически обрабатывает данные и защищает от внедрения вредоносного кода. В ORM необходимо проверять права доступа и данные, которые попадают в базу.

## Прямые запросы

### Класс CDatabase

Чтобы SQL-запросы были безопасными используйте:

-  **Приведение типов для чисел.** Преобразуйте ввод в число, если ожидается числовое значение.

   ```php
   // Опасный SQL запрос
   SELECT * FROM b_user WHERE id=$_REQUEST['id'];
   
   // Безопасный вариант
   $id = intval($_REQUEST['id']);
   $res = $DB->Query("SELECT * FROM b_user WHERE id=$id");
   ```

-  **Экранирование строк.** Метод `ForSql()` экранирует строки. Результат нужно заключить в кавычки.

   ```php
   // Опасный запрос
   $login = $_REQUEST['login'];
   $res = $DB->Query("SELECT * FROM b_user WHERE LOGIN='$login'");
   
   // Безопасный запрос
   $login = $DB->ForSql($_REQUEST['login']);
   $res = $DB->Query("SELECT * FROM b_user WHERE LOGIN='$login'");
   ```

-  **Подготовленные выражения.** Для безопасной  работы с выражениями используйте методы `CDatabase`:

   -  `PrepareInsert` -- для вставки данных,

   -  `PrepareUpdate`  -- для обновления данных.

   Методы выполняют все необходимые преобразования входных данных.

   ```php
   // Код безопасно вставляет в таблицу пользовательский ввод
   $arInsert = $DB->PrepareInsert("b_user", ["LOGIN" => $_REQUEST["login"]]);
   $sql = "INSERT INTO b_user (".$arInsert[0].") VALUES (".$arInsert[1].")";
   $res = $DB->Query($sql);
   ```

   {% note warning "" %}

   Ключи с префиксом `~` не обрабатываются автоматически. Их могут использовать для внедрения вредоносного кода. Убедитесь, что такие ключи содержат только проверенные значения.

   {% endnote %}

### Метод Application::getConnection

```php
$connection = \Bitrix\Main\Application::getConnection();
$helper = $connection->getSqlHelper(); // получаем хелпер для экранирования

$login = $helper->forSql($_GET['login']); // очищаем данные
$res = $connection->query("SELECT * FROM b_user WHERE LOGIN='$login'");
```

1. Метод `Application::getConnection` возвращает объект `MysqliConnection` для выполнения запросов к базе данных.

2. Функция `getSqlHelper()` получает хелпер для экранирования запросов.

3. Функция `forSql` объекта хелпера очищает данные.

Аналогично `CDatabase`, можно использовать методы `prepareInsert` и `prepareUpdate`.

## ORM

ORM автоматически защищает от SQL-инъекций при работе с базой данных. Однако существуют другие риски:

-  **XSS.** В базу данных может попасть HTML или JS-код.

-  **IDOR.** Пользователь может получить доступ к данным из-за неверной проверки прав.

Параметры `select` и `filter` метода getlist уязвимы, если получают на вход пользовательские данные. Это позволяет получить записи как из основной таблицы, так и из связанных таблиц.

### Параметр select

Параметр `select` указывает, какие поля нужно выбрать из базы данных. Его можно задать двумя способами:

```php
// В методе getList
$result = \Bitrix\Landing\Internals\LandingTable::getList([
    'select' => $some_select
]);

// С помощью setSelect
$query = WorkgroupTable::query();
$query->setSelect($select);
```

Непроверенный ввод позволяет получить данные:

-  из любых неприватных столбцов текущей таблицы,

-  связанных таблиц через `ReferenceField`.

```php
// прямая подстановка пользовательского ввода
$select = $_REQUEST['select']
//['ID' => 'ID', 'TITLE' => 'TITLE', 'LAST_NAME' => 'RESPONSIBLE.LAST_NAME'];

$result = \Bitrix\Tasks\Internals\TaskTable::getList([
	'select' => $select // доступ к любым поля и связям
]);
var_dump($result->fetchAll());

// Результат может включать данные из связанных таблиц
/*  ...
    array(3) {
    ["ID"]=>
    string(1) "1"
    ["TITLE"]=>
    string(4) "Task Title"
    ["LAST_NAME"]=>
    string(20) "Lastname"
    ...
  }
*/
```

### Параметр filter

При наличии `ReferenceField` можно достать данные из связанных таблиц через параметр `filter`.

```php
// Пример подбора email через фильтр
$result = \Bitrix\Main\UserTable::getList([
    // Если что-то возвращается, значит email начинается с буквы А. Если нет — пробуем другой символ.
	'filter' => ['ID' => 1, '%=EMAIL' => "A%"]
]);
```

{% note info "" %}

Приватные поля в ORM защищены, доступ к ним ограничен. Частичная разметка базы данных может привести к утечке.

{% endnote %}

### Выражения SqlExpression и ExpressionField

Класс `\Bitrix\Main\DB\SqlExpression` позволяет создавать пользовательские SQL-выражения. Один непроверенный параметр приведет к инъекции.

```php
$filterIds = [1, 2, 3, $_GET['id']]; // $_GET['id'] содержит вредоносный код

//$_GET['id'] = (select * from b_user where login="admin") 

$filterList = \Bitrix\Disk\Internals\VolumeTable::getList([
   'filter' => [
      '@ID' => new \Bitrix\Main\DB\SqlExpression(implode(', ', $filterIds)), 
      // Может привести к выполнению произвольного SQL-кода
   ],
]);.
```

Класс `\Bitrix\Main\Entity\ExpressionField` создает вычисляемые поля. Как и `SqlExpression`, он уязвим к непроверенному вводу.

```php
$filterList = \Bitrix\Disk\Internals\VolumeTable::getList([
   'runtime' => array(
      new \Bitrix\Main\Entity\ExpressionField('CNT', $_GET['count'])
      // Позволяет внедрить вредоносный код
   )
]);
```

При использовании классов `SqlExpression` и `ExpressionField` необходимо тщательно проверять и экранировать пользовательский ввод, чтобы предотвратить SQL-инъекции и защитить приложение от выполнения нежелательного кода. Не передавайте данные напрямую -- обрабатывайте их с помощью методов экранирования.
