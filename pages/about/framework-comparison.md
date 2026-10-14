---
title: Отличия от других фреймворков
description: 'Отличия от других фреймворков. Обзор и сравнение технологий Bitrix. Подробно и понятно для разработчиков.'
---

Bitrix Framework часто ассоциируется с 1C-Битрикс: Управление сайтом, но ядро CMS — это полноценный PHP-фреймворк. Он включает модульную структуру, роутинг, MVC-элементы, систему событий и другие компоненты, характерные для современных фреймворков. Терминология и реализация может отличаться от привычных понятий в популярных фреймворках: Laravel, Symfony или Yii.

### Контроллеры

Контроллер отвечает за обработку запроса и возврат ответа. В Bitrix Framework контроллеры можно реализовать двумя способами:

-  через наследование от класса `Bitrix\Main\Engine\Controller` ,

-  через PHP-скрипты в папке `components`.

Первый способ аналогичен контроллерам в Laravel и Yii, где тоже используется наследование. В Symfony маршруты привязывают к методам с помощью аннотаций `@Route`.

| Фреймворк | Реализация контроллеров                                                        |
|-----------|--------------------------------------------------------------------------------|
| Bitrix    | Наследование от `\Bitrix\Main\Engine\Controller` или PHP-скрипты в компонентах |
| Yii       | Наследование от `yii\web\Controller`                                           |
| Laravel   | Наследование от `Illuminate\Routing\Controller`                                |
| Symfony   | Методы класса с аннотациями `@Route`                                           |

### Роутинг

Роутинг определяет, какой код выполнить при обращении к URL. В Bitrix Framework маршруты описывают в файлах `/local/routes/*.php` и подключают через секцию `routing` в `/bitrix/.settings.php`. Маршруты связывают URL с функциями или контроллерами. Файл `/bitrix/routing_index.php` служит точкой входа для обработки запросов. Настройка описана в разделе [Роутинг](../framework/routing.md#configuration).

| Фреймворк | Реализация роутинга                                              |
|-----------|------------------------------------------------------------------|
| Bitrix    | Файлы `/local/routes/*.php`, подключенные через секцию `routing` в `/bitrix/.settings.php` |
| Yii       | Конфигурация в `config/web.php` через `urlManager`               |
| Laravel   | Файл `routes/web.php`, использование `Route::` фасада            |
| Symfony   | Конфигурация в `config/routes.yaml` или через аннотации `@Route` |

### Middlewares или ActionFilter в Bitrix

Middleware — это слой между запросом и контроллером. Он проверяет доступ, логирует и модифицирует данные. В Bitrix Framework используются классы на основе `\Bitrix\Main\Engine\ActionFilter`, которые привязываются к методам контроллера. Это аналогично фильтрам в Yii. В Laravel middleware работают на уровне HTTP-ядра. В Symfony используют `EventSubscriber` или `KernelEvents`.

| Фреймворк | Реализация middleware                                 |
|-----------|-------------------------------------------------------|
| Bitrix    | `\Bitrix\Main\Engine\ActionFilter`                    |
| Yii       | `yii\filters\AccessControl` и другие фильтры          |
| Laravel   | Создание через `php artisan make:middleware`          |
| Symfony   | Реализация через `EventSubscriber` или `KernelEvents` |

### Задачи по расписанию

Задачи по расписанию выполняют фоновые операции в заданное время. В Bitrix Framework для этого используют агенты — PHP-функции или статические методы классов модуля. Агенты регистрируют через `CAgent::AddAgent()` и запускают на хитах при посещении сайта или через cron.

Для кода в D7 создайте класс с пространством имен в папке `lib` собственного модуля. Статический метод `run()` возвращает строку с вызовом для следующего запуска. Команда [`make:agent`](../framework/console-commands.md#генерация-кода) создает класс агента и выводит PHP-код регистрации. Пример класса и настройка запуска приведены в статье [Агенты и фоновые задачи](../framework/background-jobs.md#agent-class).

Laravel и Yii запускают задачи  через системный cron. В Symfony планированием задач управляет  компонент `scheduler`.

| Фреймворк | Реализация задач                                  |
|-----------|---------------------------------------------------|
| Bitrix    | Функции или классы агентов в модуле, регистрация через `CAgent::AddAgent()`, генерация класса через `make:agent` |
| Yii       | Консольные команды (`yii migrate`) + cron         |
| Laravel   | `app/Console/Kernel.php` (`$schedule->command()`) |
| Symfony   | Компонент `scheduler`                             |

### Очереди

Очереди позволяют откладывать выполнение задач. В Bitrix используется класс `\Bitrix\Main\Messenger`. Это похоже на `yii\queue` в Yii и `symfony/messenger` в Symfony. Laravel использует `queue:work` и Horizon для управления задачами.

| Фреймворк | Реализация очередей                 |
|-----------|-------------------------------------|
| Bitrix    | `\Bitrix\Main\Messenger`            |
| Yii       | `yii\queue\Redis` и другие драйверы |
| Laravel   | `php artisan queue:work` + Horizon  |
| Symfony   | Компонент `symfony/messenger`       |

### События и обработчики

События позволяют одному участку кода реагировать на действия другого.\
В Bitrix Framework события создают через `\Bitrix\Main\EventManager` с регистрацией обработчиков по коду события. Это аналогично `Event::listen()` в Laravel, `EventDispatcher` в Symfony и `Yii::$app->on()` в Yii.

| Фреймворк | Реализация событий                                                             |
|-----------|--------------------------------------------------------------------------------|
| Bitrix    | `\Bitrix\Main\EventManager`                                                    |
| Yii       | `Yii::$app->on()`                                                              |
| Laravel   | `Event::listen()`                                                              |
| Symfony   | `EventDispatcher` (тег `kernel.event_listener`, PHP-атрибут `AsEventListener`) |

### CLI инструменты

Командная строка нужна для запуска задач, миграций, тестов. CLI упрощает автоматизацию и разработку.

В Bitrix Framework [консольные команды](../framework/console-commands.md) запускают через `php bitrix.php` из папки `/bitrix/`. Этот инструмент основан на Symfony Console и соответствует `php artisan` в Laravel. Команды работают в контексте Bitrix Framework, имеют доступ к ядру и API.

Пакет `@bitrix/cli` используют для создания и сборки [JS-расширений](../framework/extensions.md).

| Фреймворк | CLI инструменты                 |
|-----------|---------------------------------|
| Bitrix    | `php bitrix.php` на основе Symfony Console |
| Yii       | `./yii`, например `yii migrate` |
| Laravel   | `php artisan`                   |
| Symfony   | `bin/console`                   |

### ORM

ORM позволяет работать с данными из базы в виде объектов. Bitrix Framework использует собственную реализацию в пространстве имен `\Bitrix\Main\ORM` с поддержкой объектов, полей и связей.

Это похоже на `ActiveRecord` в Yii и `Eloquent` в Laravel. Symfony чаще использует `Doctrine ORM` с паттерном `Data Mapper`.

| Фреймворк | Реализация ORM        |
|-----------|-----------------------|
| Bitrix    | `\Bitrix\Main\ORM` |
| Yii       | `yii\db\ActiveRecord` |
| Laravel   | `Eloquent`            |
| Symfony   | `Doctrine ORM`        |

### Работа с Email

Отправка email — стандартная задача в веб-приложениях. В Bitrix она реализована через `\Bitrix\Main\Mail\Event` с использованием шаблонов из административной панели.

В Laravel, Symfony и Yii письма формируют в коде, используя Mail-компоненты и шаблоны в файловой системе.

| Фреймворк | Реализация отправки email                              |
|-----------|--------------------------------------------------------|
| Bitrix    | `\Bitrix\Main\Mail\Event`                              |
| Yii       | `Yii::$app->mailer`                                    |
| Laravel   | Mailable-классы, `Mail::to()->send(new WelcomeMail())` |
| Symfony   | Компонент `symfony/mailer`                             |

### Работа с SMS и мессенджерами

Интеграция с SMS-шлюзами и мессенджерами требует подключения внешних сервисов.

В Bitrix Framework добавить интеграции можно через [REST API](https://apidocs.bitrix24.ru/) или с помощью модулей из [Marketplace](https://marketplace.1c-bitrix.ru/).

В Laravel, Yii и Symfony используют сторонние пакеты и бандлы для подключения к провайдерам.

| Фреймворк | Реализация SMS/мессенджеров                      |
|-----------|--------------------------------------------------|
| Bitrix    | Интеграция через REST API или модули Marketplace |
| Yii       | Сторонние пакеты, например, `yii2-smspilot`      |
| Laravel   | Пакеты типа `laravel-notification-channels`      |
| Symfony   | Сторонние бандлы, например, `smsapi-client`      |

### Итоги

Bitrix Framework включает те же архитектурные компоненты, что и другие PHP-фреймворки. Различия есть в терминологии и реализации, например:

-  контроллер в Bitrix Framework может быть компонентом или классом на основе `Engine\Controller`,

-  middleware называется `ActionFilter`,

-  задачи по расписанию реализованы через агенты,

-  события управляются через `EventManager`,

-  CLI-команды запускают через `php bitrix.php`, а `@bitrix/cli` используют для создания и сборки JS-расширений.
