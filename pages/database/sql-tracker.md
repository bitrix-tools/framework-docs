---
title: Отладка запросов
description: 'Отладка запросов. Работа с базой данных в Bitrix: лучшие практики, инструкция и примеры запросов.'
---

Класс `Bitrix\Main\Diag\SqlTracker` используется для отладки и анализа SQL-запросов:

-  замеряет время выполнения,

-  собирает стек вызовов,

-  сохраняет параметры запросов `binds`.

## Запустить трекинг

Метод `startTracker` запускает трекинг.

```php
$tracker = \Bitrix\Main\Application::getConnection()->startTracker(true);  
```

-  `true` -- начинает новый трекинг и прерывает предыдущий.

-  `false` -- продолжает текущий трекинг.

## Выполнить запрос

```php
// Пример явного SQL-запроса  
\Bitrix\Main\Application::getConnection()->query("UPDATE b_user SET NAME='Test' WHERE ID=1");  
```

## Получить результат

```php
foreach ($tracker->getQueries() as $query) {
    print_r([
        $query->getSql(),      // текст запроса  
        $query->getTime(),     // время в секундах  
        $query->getTrace(),   // стек вызовов  
        $query->getNode(),    // ID ноды кластера или null  
        $query->getBinds(),  // параметры запроса
    ]);
}
```

Трекинг автоматически останавливается при завершении скрипта.

-  `getNode()` -- возвращает `null`, если БД не кластеризована.

-  `getBinds()` -- содержит параметры, переданные в `Connection::query()`.

**Пример.** Выбрать три самых медленных запроса.

```php
$queries = $tracker->getQueries();
usort($queries, fn($a, $b) => $b->getTime() <=> $a->getTime());
$slowestQueries = array_slice($queries, 0, 3); // Получаем три самых медленных запроса
```

## Дополнительные методы

-  Получить общее количество запросов:

   ```php
   $count = $tracker->getCounter();
   ```

-  Получить общее время выполнения:

   ```php
   $totalTime = $tracker->getTime();
   ```

-  Управлять глубиной стека:

   ```php
   $tracker->setDepthBackTrace(10); // Установить глубину стека
   $depth = $tracker->getDepthBackTrace(); // Получить текущую глубину
   ```

## Записать лог трекера в файл

Записывать лог можно с помощью методов `startFileLog` и `stopFileLog`.

```php
// Запускаем трекинг
$tracker = \Bitrix\Main\Application::getConnection()->startTracker(true);

// Указываем путь к файлу лога
$logPath = $_SERVER['DOCUMENT_ROOT'].'/upload/sql_queries.log';

// Начинаем запись логов в файл
$tracker->startFileLog($logPath);

// Получаем объект соединения с БД
$connection = \Bitrix\Main\Application::getConnection();

// Выполняем SQL-запросы. Они будут записаны в лог
$connection->query("SELECT * FROM b_file");
$connection->query("SELECT * FROM b_module_to_module");

// Останавливаем запись логов
$tracker->stopFileLog();
```
