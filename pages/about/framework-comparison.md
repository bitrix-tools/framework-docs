---
title: Отличия от других фреймворков
description: 'Чем Bitrix Framework отличается от Laravel, Symfony и Yii — контроллеры, роутинг, фильтры действий ActionFilter, агенты, очереди Messenger, события EventManager, консольные команды bitrix.php, ORM, почтовые события и СМС. Какой механизм Bitrix Framework соответствует привычному приему другого фреймворка.'
---

Bitrix Framework часто ассоциируется с 1C-Битрикс: Управление сайтом, но ядро CMS — это полноценный PHP-фреймворк. Он включает модульную структуру, роутинг, MVC-элементы, систему событий и другие компоненты, характерные для современных фреймворков. Терминология и реализация могут отличаться от привычных понятий в Laravel, Symfony или Yii.

Для каждого механизма Bitrix Framework ниже указаны аналоги в Laravel, Symfony и Yii и ссылка на статью с подробностями и примерами кода. Краткий список соответствий — в разделе [Итоги](#summary).

## Контроллеры {#controllers}

Контроллер обрабатывает запрос и возвращает ответ. В Bitrix Framework контроллер — класс-наследник [`\Bitrix\Main\Engine\Controller`](../api-reference/main/engine/controller/index.md). Действия контроллера — методы с суффиксом `Action`, например `getAction()`.

Контроллер размещают в модуле или в компоненте. От места зависит способ вызова действий:

-  Контроллер модуля — класс в папке `lib` модуля. Действия вызывают по HTTP-маршруту или из JavaScript методом `BX.ajax.runAction()`. Для вызова через `BX.ajax.runAction()` модуль объявляет пространство имен контроллеров в секции `controllers` своего файла `.settings.php`. Без этой секции вызов завершается ошибкой.

-  Контроллер компонента — класс компонента в `class.php`, который реализует интерфейс `\Bitrix\Main\Engine\Contract\Controllerable`, или наследник `\Bitrix\Main\Engine\Controller` в файле `ajax.php` в папке компонента. Действия вызывают из JavaScript методом `BX.ajax.runComponentAction()`. Параметр `mode` указывает, где находится действие. Значение `class` вызывает метод из `class.php`, значение `ajax` — метод контроллера из `ajax.php`. Без параметра `mode` метод передает значение `ajax`.

Контроллеры Laravel и Yii тоже наследуют базовый класс. В Symfony маршрут привязывают к методу контроллера атрибутом `#[Route]` или аннотацией `@Route`.

Как создать контроллер модуля, зарегистрировать маршрут и настроить AJAX-вызов, читайте в статье [Контроллеры](../framework/controllers.md). Действия компонента описаны в разделе [Работа с контроллерами](../framework/components.md#component-controllers) статьи «Компоненты».

| Фреймворк | Реализация контроллеров |
|-----------|-------------------------|
| Bitrix    | Наследник `\Bitrix\Main\Engine\Controller` в модуле. В компоненте — класс с интерфейсом `Controllerable` в `class.php` или наследник `Controller` в `ajax.php` |
| Yii       | Наследование от `yii\web\Controller` |
| Laravel   | Наследование от `App\Http\Controllers\Controller`, до версии 11 он наследовал `Illuminate\Routing\Controller` |
| Symfony   | Методы класса с атрибутом `#[Route]` или аннотацией `@Route` |

## Роутинг {#routing}

Роутинг определяет, какой код выполнить при обращении к URL. В Bitrix Framework маршруты описывают в файлах `/local/routes/*.php` и подключают через секцию `routing` в `/bitrix/.settings.php`. Маршруты связывают URL с функциями или контроллерами. Файл `/bitrix/routing_index.php` служит точкой входа для обработки запросов. Настройка описана в разделе [Роутинг](../framework/routing.md#configuration). Маршрут на действие контроллера показан в разделе [Маршрут на контроллер своего модуля](../framework/routing.md#custom-module-controller).

| Фреймворк | Реализация роутинга                                              |
|-----------|------------------------------------------------------------------|
| Bitrix    | Файлы `/local/routes/*.php`, подключенные через секцию `routing` в `/bitrix/.settings.php` |
| Yii       | Конфигурация в `config/web.php` через `urlManager`               |
| Laravel   | Файл `routes/web.php`, использование `Route::` фасада            |
| Symfony   | Конфигурация в `config/routes.yaml` или через аннотации `@Route` |

## Middleware и ActionFilter {#middleware}

Middleware — слой между запросом и контроллером. Он проверяет доступ, ведет журнал и изменяет данные. В Bitrix Framework эту роль выполняют фильтры действий — классы пространства имен `\Bitrix\Main\Engine\ActionFilter`:

-  префильтры выполняются до действия и могут отменить его,

-  постфильтры выполняются после действия и могут изменить результат.

Фильтры привязывают к действиям в методе `configureActions()` контроллера или PHP-атрибутами. Если для действия не задан собственный набор префильтров, контроллер применяет набор по умолчанию `Authentication`, `HttpMethod` и `Csrf`. Свой фильтр наследует класс `\Bitrix\Main\Engine\ActionFilter\Base`. Подробнее — в статье [Пре- и постфильтры](../framework/pre-post-filters.md).

Фильтры Bitrix Framework аналогичны фильтрам в Yii. В Laravel middleware работают на уровне HTTP-ядра. В Symfony используют `EventSubscriber` или `KernelEvents`.

| Фреймворк | Реализация middleware                                 |
|-----------|-------------------------------------------------------|
| Bitrix    | Классы пространства имен `\Bitrix\Main\Engine\ActionFilter`, свой фильтр — наследник `ActionFilter\Base` |
| Yii       | `yii\filters\AccessControl` и другие фильтры          |
| Laravel   | Создание через `php artisan make:middleware`          |
| Symfony   | Реализация через `EventSubscriber` или `KernelEvents` |

## Задачи по расписанию {#scheduled-tasks}

Задачи по расписанию выполняют фоновые операции в заданное время. В Bitrix Framework для этого используют агенты — PHP-функции или статические методы классов модуля. Агенты регистрируют через `CAgent::AddAgent()` и запускают на хитах при посещении сайта или через cron.

Для кода в D7 создайте класс с пространством имен в папке `lib` собственного модуля. Статический метод `run()` возвращает строку с вызовом для следующего запуска. Если метод вернет `null` или пустую строку, система удалит агент. Команда [`make:agent`](../framework/console-commands.md#generaciya-koda) создает класс агента и выводит PHP-код регистрации. Пример класса и настройка запуска приведены в статье [Агенты и фоновые задачи](../framework/background-jobs.md#agent-class).

Laravel и Yii запускают задачи через системный cron. В Symfony планированием задач управляет компонент `scheduler`.

| Фреймворк | Реализация задач                                  |
|-----------|---------------------------------------------------|
| Bitrix    | Функции или классы агентов в модуле, регистрация через `CAgent::AddAgent()`, генерация класса через `make:agent` |
| Yii       | Консольные команды `./yii` + системный cron       |
| Laravel   | `Schedule::command()` в `routes/console.php`, до версии 11 — `$schedule->command()` в `app/Console/Kernel.php` |
| Symfony   | Компонент `scheduler`                             |

## Очереди {#queues}

Очереди откладывают выполнение задач. В Bitrix Framework очереди работают на классах пространства имен `\Bitrix\Main\Messenger`. Это похоже на `yii\queue` в Yii и `symfony/messenger` в Symfony. Laravel использует `queue:work` и Horizon для управления задачами.

Очередь в Bitrix Framework состоит из трех частей:

-  сообщение — объект класса-наследника `\Bitrix\Main\Messenger\Entity\AbstractMessage` с методом `send()`, который отправляет сообщение в очередь с переданным именем,

-  обработчик — класс-наследник `\Bitrix\Main\Messenger\Receiver\AbstractReceiver`,

-  конфигурация — секция `messenger` в `.settings.php` модуля, которая связывает имя очереди с обработчиком.

По умолчанию ядро обрабатывает очереди в режиме `web` — после ответа пользователю. В режиме `cli` очереди обрабатывает консольная команда `php bitrix.php messenger:consume`. Функционал очередей находится в альфа-версии. Настройка, режимы и ограничения описаны в статье [Очереди сообщений](../framework/messenger.md).

| Фреймворк | Реализация очередей                 |
|-----------|-------------------------------------|
| Bitrix    | Классы `\Bitrix\Main\Messenger`, команда `messenger:consume` |
| Yii       | Расширение `yii2-queue`, например драйвер `yii\queue\redis\Queue` |
| Laravel   | `php artisan queue:work` + Horizon  |
| Symfony   | Компонент `symfony/messenger`       |

## События и обработчики {#events}

События позволяют одному участку кода реагировать на действия другого. В Bitrix Framework событие создают как объект [`\Bitrix\Main\Event`](../api-reference/main/event/index.md), а метод `send()` вызывает его обработчики. Обработчики регистрирует класс [`\Bitrix\Main\EventManager`](../api-reference/main/event-manager/index.md):

-  метод `addEventHandler()` добавляет обработчик только на время текущего запроса,

-  метод `registerEventHandler()` сохраняет обработчик в базе данных, поэтому метод вызывают один раз при установке модуля.

Регистрация обработчиков аналогична `Event::listen()` в Laravel, `EventDispatcher` в Symfony и `Yii::$app->on()` в Yii. Создание событий, результаты обработчиков и системные события описаны в статье [События](../framework/events.md).

| Фреймворк | Реализация событий                                                             |
|-----------|--------------------------------------------------------------------------------|
| Bitrix    | `\Bitrix\Main\Event` и `\Bitrix\Main\EventManager`                             |
| Yii       | `Yii::$app->on()`                                                              |
| Laravel   | `Event::listen()`                                                              |
| Symfony   | `EventDispatcher` (тег `kernel.event_listener`, PHP-атрибут `AsEventListener`) |

## CLI-инструменты {#cli}

Командная строка нужна для запуска задач, миграций и тестов.

В Bitrix Framework [консольные команды](../framework/console-commands.md) запускают через `php bitrix.php` из папки `/bitrix/`. Этот инструмент основан на Symfony Console и соответствует `php artisan` в Laravel. Команды работают в контексте Bitrix Framework, имеют доступ к ядру и API.

Пакет `@bitrix/cli` используют для создания и сборки [JS-расширений](../framework/extensions.md).

| Фреймворк | CLI-инструменты                 |
|-----------|---------------------------------|
| Bitrix    | `php bitrix.php` на основе Symfony Console |
| Yii       | `./yii`, например `yii migrate` |
| Laravel   | `php artisan`                   |
| Symfony   | `bin/console`                   |

## ORM {#orm}

ORM позволяет работать с данными из базы в виде объектов. Bitrix Framework использует собственную реализацию в пространстве имен `\Bitrix\Main\ORM`. Таблицу описывает класс-наследник `\Bitrix\Main\ORM\Data\DataManager` с полями и связями. Метод `getList()` выбирает записи. Метод `fetchObject()` результата возвращает запись как объект, а метод `save()` объекта сохраняет изменения.

Это похоже на `ActiveRecord` в Yii и `Eloquent` в Laravel. Symfony чаще использует `Doctrine ORM` с паттерном `Data Mapper`.

Описание полей и связей читайте в статье [Концепция ORM](../orm/orm-concepts.md), параметры выборки — в статье [Выборка данных](../orm/querying-data.md).

| Фреймворк | Реализация ORM        |
|-----------|-----------------------|
| Bitrix    | `\Bitrix\Main\ORM`, классы-наследники `DataManager` |
| Yii       | `yii\db\ActiveRecord` |
| Laravel   | `Eloquent`            |
| Symfony   | `Doctrine ORM`        |

## Работа с email {#email}

Отправка email — стандартная задача в веб-приложениях. В Bitrix Framework письмо отправляют через почтовое событие. Метод `\Bitrix\Main\Mail\Event::send()` принимает массив, где `EVENT_NAME` — код типа почтового события, `LID` — идентификатор сайта, `C_FIELDS` — данные для макросов. Текст письма задает почтовый шаблон, который настраивают в административном разделе или через API.

Метод `send()` добавляет событие в очередь, а письмо уходит при обработке очереди. Метод `sendImmediate()` отправляет письмо сразу. Параметры и примеры — в разделе [API почтовой системы](../cms-basics/mail.md#api) статьи «Работа с почтой».

В Laravel, Symfony и Yii письма формируют в коде, используя Mail-компоненты и шаблоны в файловой системе.

| Фреймворк | Реализация отправки email                              |
|-----------|--------------------------------------------------------|
| Bitrix    | `\Bitrix\Main\Mail\Event`, почтовые шаблоны в административном разделе или через API |
| Yii       | `Yii::$app->mailer`                                    |
| Laravel   | Mailable-классы, `Mail::to()->send(new WelcomeMail())` |
| Symfony   | Компонент `symfony/mailer`                             |

## Работа с СМС и мессенджерами {#sms}

Интеграция с СМС-шлюзами и мессенджерами требует подключения внешних сервисов.

В Bitrix Framework СМС отправляет класс `\Bitrix\Main\Sms\Event` по СМС-шаблонам. Доставку выполняет модуль Служба сообщений `messageservice` через подключенных провайдеров. Свой провайдер — класс-наследник `\Bitrix\MessageService\Sender\Base`, объект которого возвращает обработчик события `onGetSmsSenders` модуля `messageservice`. Подробнее — в статье [Работа с СМС](../cms-basics/sms.md).

Интеграции с мессенджерами и другими сервисами добавляют через [REST API](https://apidocs.bitrix24.ru/) или с помощью модулей из [Marketplace](https://marketplace.1c-bitrix.ru/).

В Laravel и Yii провайдеров подключают сторонними пакетами. В Symfony СМС отправляет компонент `symfony/notifier` через транспорты провайдеров.

| Фреймворк | Реализация СМС и мессенджеров                    |
|-----------|--------------------------------------------------|
| Bitrix    | `\Bitrix\Main\Sms\Event` и модуль `messageservice` для СМС. Мессенджеры — через REST API или модули Marketplace |
| Yii       | Сторонние пакеты, например `yii2-smspilot`       |
| Laravel   | Пакеты из набора `laravel-notification-channels` |
| Symfony   | Компонент `symfony/notifier` с транспортами провайдеров |

## Итоги {#summary}

Bitrix Framework включает те же архитектурные компоненты, что и другие PHP-фреймворки. Различия есть в терминологии и реализации, например:

-  контроллер — наследник `Engine\Controller` в модуле или действия компонента через интерфейс `Controllerable` и файл `ajax.php`,

-  middleware называется `ActionFilter`,

-  задачи по расписанию реализованы через агенты,

-  очереди работают на классах `\Bitrix\Main\Messenger`,

-  обработчики событий регистрирует класс `EventManager`,

-  CLI-команды запускают через `php bitrix.php`, а `@bitrix/cli` используют для создания и сборки JS-расширений.

Сравнение 1C-Битрикс: Управление сайтом с WordPress и Joomla приведено в статье [Отличия от других CMS](./cms-comparison.md).
