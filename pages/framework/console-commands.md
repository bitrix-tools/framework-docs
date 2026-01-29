---
title: Консольные команды
description: 'Консольные команды. Документация по Bitrix Framework: принципы работы, архитектура и примеры использования.'
---

Консольные команды в Bitrix Framework -- это инструменты для выполнения операционных задач через терминал. Они работают как PHP-скрипты и умеют:

-  принимать аргументы и опции,

-  выполнять долгие операции без ограничений веб-сервера,

-  автоматизировать процессы разработки и администрирования,

-  запускаться по расписанию через cron.

С их помощью можно:

-  управлять кешем и индексами,

-  генерировать код компонентов, контроллеров, ORM-классов,

-  выполнять миграции базы данных,

-  обмениваться данными с внешними системами.

## Запустить команду

Консольные команды в Bitrix Framework запускаются через файл `bitrix.php` в папке `/bitrix/` вашего проекта.

```bash
cd /path/to/document_root/bitrix
php bitrix.php [команда] [аргументы] [опции]
```

Для работы с консольными командами необходимо настроить Composer.

{% note tip "Подробнее в статье" %}

[Composer](./../get-started/composer)

{% endnote %}

### Как просмотреть список команд

Чтобы увидеть список доступных в системе команд, выполните:

```bash
php bitrix.php list
```

В списке отобразятся встроенные команды Bitrix Framework и команды из установленных модулей.

### Встроенные команды

Bitrix Framework включает готовые команды для разработки.

#### Генерация кода

Команды `make` генерируют код объектов.

{% note info "" %}

Команды `make:entity`, `make:мodule`, `make:request`, `make:service`, `make:event`, `make:eventandler`, `make:message`, `make:messagehandler,` `make:agent` можно использовать с версии main 25.900.0.

{% endnote %}

-  `make:component` -- создает компонент с классом и шаблоном. Компонент можно разместить внутри модуля, в общей папке компонентов или локально.

   ```bash
   # Создать компонент внутри модуля
   php bitrix.php make:component MyNamespace:MyComponent --module=my.module
   
   # Создать компонент в общей папке /bitrix/components/
   php bitrix.php make:component MyNamespace:MyComponent --no-module
   
   # Создать компонент в папке /local/components/
   php bitrix.php make:component MyNamespace:MyComponent --local -n
   ```

-  `make:controller` -- генерирует REST-контроллер для API.

   ```bash
   # Создать контроллер с CRUD-действиями
   php bitrix.php make:controller Post -m my.module --actions=crud -n
   
   # Создать контроллер с конкретными действиями
   php bitrix.php make:controller Post -m my.module --actions=list,get -n
   ```

-  `make:tablet` -- создает ORM-класс для таблицы базы данных.

   ```bash
   php bitrix.php make:tablet my_post my.module
   ```

-  `make:agent` -- создает класс агента для периодических задач. После генерации выводит PHP-код для регистрации агента.

   ```bash
   php bitrix.php make:agent MyAgent -m my.module -n
   ```

-  `make:entity` -- генерирует класс сущности бизнес-логики.

   ```bash
   # Создать сущность с полями
   php bitrix.php make:entity post -m my.module --fields=title,description,author -n
   ```

-  `make:event` -- создает класс события системы.

   ```bash
   php bitrix.php make:event PostCreated -m my.module -n
   ```

-  `make:eventhandler` -- генерирует класс обработчика события.

   ```bash
   # Укажите модуль события и модуль обработчика
   php bitrix.php make:eventhandler PostCreated -n
   ```

-  `make:message` -- создает класс сообщения для брокера сообщений.

   ```bash
   php bitrix.php make:message PostCreated -m my.module -n
   ```

-  `make:messagehandler` -- генерирует класс обработчика сообщений.

   ```bash
   # Укажите модуль сообщения и модуль обработчика
   php bitrix.php make:messagehandler PostCreated -n
   ```

-  `make:module` -- создает структуру нового модуля с базовыми файлами.

   ```bash
   php bitrix.php make:module my.module
   ```

-  `make:request` -- генерирует класс Request для валидации параметров запроса.

   ```bash
   # Создать Request с полями
   php bitrix.php make:request CreatePost -m my.module --fields=title,description -n
   ```

-  `make:service` -- создает класс сервиса для бизнес-логики.

   ```bash
   php bitrix.php make:service MyPost -m my.module -n
   ```

Команды `make` работают в интерактивном режиме -- запрашивают нужные параметры. Чтобы выполнить команду сразу, используйте опцию `-n` и укажите обязательные параметры.

Управлять структурой файлов при генерации кода можно с помощью опций:

-  `--prefix` -- добавляет префикс к стандартному пространству имен,

-  `--context` -- помещает класс в подпространство.

```bash
# Создает класс в папке lib/V2/Infrastructure/Controller/
php bitrix.php make:controller MyPost -m my.module --prefix=V2 -n

# Создает класс в папке lib/Infrastructure/Agent/FeatureName/
php bitrix.php make:agent MyAgent -m my.module --context=FeatureName -n
```

#### ORM

Команда `orm:annotate` сканирует ORM-сущности и генерирует аннотации для их полей.

```bash
# Сгенерировать аннотации для всех модулей
php bitrix.php orm:annotate

# Сгенерировать аннотации для конкретных модулей
php bitrix.php orm:annotate -m main,iblock,crm

# Перегенерировать все аннотации
php bitrix.php orm:annotate --clean
```

#### Обмен сообщениями

Команда `messenger:consume` запускает обработку очереди сообщений.

```bash
# Запустить обработчик для всех очередей
php bitrix.php messenger:consume

# Обработать конкретные очереди
php bitrix.php messenger:consume first_queue,second_queue

# Установить паузу между проходами в 11 секунд
php bitrix.php messenger:consume --sleep 11

# Ограничить время работы 10 минутами
php bitrix.php messenger:consume --time-limit 600
```

#### Локализация

Команда `translate:index` индексирует языковые файлы для локализации. По умолчанию сканирует папку `/bitrix/modules/`.

```bash
# Проиндексировать языковые файлы в стандартной папке
php bitrix.php translate:index

# Проиндексировать файлы по конкретному пути
php bitrix.php translate:index --path=/local/modules/my.module
```

#### Обновления

Команды обновления `update` показывают список изменений и запрашивают подтверждение перед выполнением.

-  `update:modules` -- обновляет модули.

   ```bash
   # Обновить все модули
   php bitrix.php update:modules
   
   # Обновить конкретные модули
   php bitrix.php update:modules -m main,iblock,ui
   ```

-  `update:versions` -- обновляет модули до указанных версий. Требует JSON-файл со списком версий.

   ```bash
   php bitrix.php update:versions ~/bitrix_modules_versions.json
   ```

-  `update:languages` -- обновляет языковые файлы.

   ```
   # Обновить все языковые пакеты
   php bitrix.php update:languages
   
   # Обновить конкретные языки
   php bitrix.php update:languages -l it,br,tr
   ```

### Как получить справку по команде

Чтобы получить подробную информацию о конкретной команде, используйте опцию `help`. Справка покажет описание команды, список аргументов и опций.

```bash
php bitrix.php help [имя-команды]
# или альтернативный вариант
php bitrix.php [имя-команды] --help
```

## Создать новую команду

Консольная команда в Bitrix Framework -- это PHP-класс, который наследуется от `Symfony\Component\Console\Command\Command`.

{% note tip "" %}

Подробную информацию о создании команд, их структуре и возможностях смотрите в [официальной документации Symfony](https://symfony.com/doc/current/console.html#creating-a-command).

{% endnote %}

### Как зарегистрировать команду

После создания класса зарегистрируйте команду в файле `.settings.php` в корне вашего модуля. Если файла нет, создайте его. Если файл уже существует, дополните его:

```php

return [
    'console' => [
        'value' => [
            'commands' => [
                // Регистрация команды
                \Partner\Module\Cli\Command\Feature\RebuildCommand::class,
            ],
        ],
        'readonly' => true,
    ],
];
```

После добавления команда появится в выводе `php bitrix.php list`.

### Где разместить файлы команд

Файлы команд рекомендуется хранить в каталоге модуля в папке `/lib/command/`.

Пример структуры модуля с одним классом команды:

```
/local/modules/partner.module/
├── .settings.php          # Регистрация команд
├── install/
│   └── index.php
└── lib/
    └── Cli/
        └── Command/
            └── Feature/
                └── RebuildCommand.php
```

Имя команды формируется на основе пространства имен. Для примера выше имя будет `feature:rebuild`.

## Настроить запуск по расписанию

Команды можно запускать по расписанию через cron для регулярных задач.

Пример настройки cron:

```bash
# Выполнять команду каждый день в 3:00
0 3 * * * php /path/to/document_root/bitrix/bitrix.php [command] --no-interaction

# Выполнять команду каждое воскресенье в 4:00
0 4 * * 0 php /path/to/document_root/bitrix/bitrix.php [command] --no-interaction
```

Опция `--no-interaction` отключает интерактивные запросы.