---
title: Консольные команды
description: 'Консольные команды Bitrix Framework: запуск через bitrix.php, генерация кода make:*, orm:annotate, messenger:consume, update:*, создание и регистрация собственной команды на Symfony Console, запуск по cron.'
---

Консольные команды в Bitrix Framework — это инструменты для выполнения операционных задач через терминал. Они работают как PHP-скрипты и умеют:

-  принимать аргументы и опции,

-  выполнять долгие операции без ограничений веб-сервера,

-  автоматизировать процессы разработки и администрирования,

-  запускаться по расписанию через cron.

С их помощью можно:

-  генерировать код модулей, компонентов, контроллеров, ORM-классов,

-  обрабатывать очереди сообщений,

-  управлять параметрами модулей и кешем,

-  выполнять собственные задачи модуля, например обмен данными с внешними системами.

## Запустить команду

Консольные команды в Bitrix Framework запускаются через файл `bitrix.php` в папке `/bitrix/` вашего проекта.

**Пример.** Переход в папку `/bitrix/` и запуск команды:

```bash prompt="$"
$ cd /path/to/document_root/bitrix
$ php bitrix.php [команда] [аргументы] [опции]
```

Команды работают на библиотеке Symfony Console. Установите ее через Composer, как описано в статье [Composer](../get-started/composer.md). Если библиотеки нет, `bitrix.php` выводит сообщение `Symfony Console is not installed` и завершается без кода ошибки, поэтому cron такой сбой не заметит.

В файле стандартных зависимостей `bitrix/composer-bx.json` пакет `symfony/console` указан в разделе `require-dev`. Поэтому команда `composer install --no-dev` библиотеку не устанавливает. Устанавливайте зависимости без опции `--no-dev`.

Консольный запуск определяет константы `NOT_CHECK_PERMISSIONS`, `NO_AGENT_CHECK` и `BX_CRONTAB`. Константа `NOT_CHECK_PERMISSIONS` отключает проверку прав доступа при подключении ядра, а `NO_AGENT_CHECK` — выполнение агентов на этом запуске. Значение, которое возвращает метод `execute()` команды, становится кодом завершения процесса.

### Как просмотреть список команд

Команда `list` выводит все доступные команды с кратким описанием.

**Пример.** Вывод списка команд:

```bash prompt="$"
$ php bitrix.php list
```

В списке отобразятся встроенные команды Bitrix Framework и команды из установленных модулей. Команды модуля появляются в списке, только если модуль установлен. Состав команд зависит от версии модулей.

Кроме команд из этой статьи, главный модуль регистрирует служебные команды. Список ниже неполный, полный список выводит команда `list`. Назначение команд видно по префиксу:

-  `main:option:get`, `main:option:set`, `main:option:delete`, `main:option:list` — читают, сохраняют и удаляют параметры модулей,
-  `main:cache:clear`, `main:managed-cache:clear`, `main:tagged-cache:clear` — очищают кеш,
-  `main:settings:<секция>-get` и `main:settings:<секция>-set`, например `main:settings:cache-get` — читают и меняют секции [`.settings.php`](./settings.md) `cache`, `session`, `crypto`, `smtp`, `exception-handling`, `routing`,
-  `main:module:list`, `main:site:list`, `main:language:list`, `main:agent:list` — выводят списки модулей, сайтов, языков и агентов,
-  `main:agent:get <id>` — выводит данные агента по его идентификатору,
-  `main:event-handler:list <module> <event>` — выводит обработчики события `<event>` модуля `<module>`, которые зарегистрированы в текущем процессе CLI,
-  `main:feature:enable`, `main:feature:disable`, `main:feature:reset` — включают, выключают и сбрасывают флаги функций,
-  `main:sql` и `main:php-eval` — выполняют SQL-запрос или PHP-код в окружении сайта. Команды работают, только если константа `BX_LOCAL_CLI_ALLOW_UNSAFE_COMMANDS` определена со значением `true`, иначе выводят ошибку `SQL execution is disabled` или `PHP code execution is disabled`.

Команды `main:settings:<секция>-set` заменяют секцию `.settings.php` целиком. По умолчанию они записывают секцию с флагом [`readonly`](./settings.md), который защищает ее от изменений через API. Чтобы записать секцию без флага, передайте опцию `--no-readonly`. Если секция уже защищена флагом, команда с `--no-readonly` завершается ошибкой `Settings section is readonly; use --readonly to replace it`. Метод [`Configuration::isReadonly()`](../api-reference/main/config/configuration/is-readonly.md) проверяет флаг секции в коде.

Команды `main:*` принимают опцию `--format` со значением `table` или `json`. Формат `json` удобен для разбора вывода скриптом. Описание аргументов каждой команды выводит команда `help`, она описана в разделе [Как получить справку по команде](#kak-poluchit-spravku-po-komande).

### Встроенные команды

Bitrix Framework включает готовые команды для разработки.

#### Генерация кода

Команды `make` генерируют файлы классов в модуле. Для модуля с точкой в идентификаторе, например `my.module`, команды создают файлы в `/local/modules/<id>/`, для модуля без точки — в `/bitrix/modules/<id>/`. Наличие и установку модуля команды не проверяют. Исключения — `make:module`, которая всегда создает модуль в `/local/modules/`, и `make:component`, которая выбирает папку по своим опциям. Опция `-n` отключает интерактивные вопросы. Модуль задают по-разному:

-  `-m` или `--module` — в командах `make:controller`, `make:agent`, `make:entity`, `make:event`, `make:message`, `make:request`, `make:service`,
-  `--handler-module` или `-m` вместе с `--event-module` или `--message-module` — в командах `make:eventhandler` и `make:messagehandler`,
-  `--module` без сокращения — в команде `make:component`,
-  второй аргумент — в команде `make:tablet`, первый аргумент — в команде `make:module`.

Команды добавляют к имени из аргумента суффикс и помещают класс в стандартное пространство имен модуля:

| Команда | Пространство имен после `Vendor\Module` | Имя класса для аргумента `Post` |
|---|---|---|
| make:controller | `Infrastructure\Controller` | `Post` |
| make:agent | `Infrastructure\Agent` | `PostAgent` |
| make:entity | `Internals\Entity` | `Post` |
| make:event | `Public\Event` | `PostEvent` |
| make:eventhandler | `Internals\Integration\<Модуль события>\EventHandler` | `PostEventHandler` |
| make:message | `Public\Message` | `PostMessage` |
| make:messagehandler | `Internals\Integration\<Модуль сообщения>\MessageHandler` | `PostMessageHandler` |
| make:request | `Infrastructure\Controller\Request` | `PostRequest` |
| make:service | `Public\Service` | `PostService` |

Файл сгенерированного класса команды создают в папке `lib/` модуля по пути, который повторяет пространство имен. Опция `--no-psr4` создает путь строчными буквами в старом стиле. Опции `--prefix`, `--context` и `--no-psr4` есть у всех команд из таблицы. У `make:tablet` есть только `--no-psr4`, у `make:component` и `make:module` этих опций нет.

{% note info "" %}

Команды `make:entity`, `make:module`, `make:request`, `make:service`, `make:event`, `make:eventhandler`, `make:message`, `make:messagehandler`, `make:agent` можно использовать с версии main 25.900.0.

{% endnote %}

{% note warning "" %}

Команды `make` перезаписывают существующий файл без вопроса. Перед повторным запуском проверьте путь. У команд `make:component` и `make:tablet` есть опция `--show`, она выводит код в консоль без записи файла.

{% endnote %}

-  `make:component` — создает [компонент](./components.md) с классом и шаблоном. Компонент можно разместить внутри модуля, в общей папке компонентов или локально.

   Имя компонента указывают в формате `пространство_имен:имя_компонента`, например `my:user.card`. Часть до двоеточия — пространство имен компонента, а не пространство имен PHP. Если опустить пространство имен, команда использует `bitrix`. Команда вопросов не задает, папку компонента определяют опции:

   - `--module` — модуль, в папку `install/components/` которого попадет компонент. Если опция не указана, команда берет модуль из части имени компонента до первой точки, например для `my:user.card` — модуль `user`,
   - `--no-module` — компонент создается в общей папке `components/`, а не в модуле,
   - `--local` — корень `/local/` вместо `/bitrix/`. Для пространства имен не `bitrix` команда выбирает `/local/` и без этой опции,
   - `--show` — выводит код в консоль без создания файлов.

   Компонент попадает в `/local/components/<пространство имен>/` только с опцией `--no-module`.

   **Пример.** Команды создают компонент в модуле и в папке `/local/components/`:

   ```bash prompt="$"
   # Создать компонент внутри модуля
   $ php bitrix.php make:component my:user.card --module=my.module

   # Создать компонент в папке /local/components/my/
   $ php bitrix.php make:component my:user.card --no-module
   ```

   {% note warning "" %}

   Для собственных компонентов используйте пространство имен проекта и папку `/local/components/`. Команда `make:component user.card --no-module` без пространства имен и опции `--local` создает компонент в `/bitrix/components/bitrix/`. Эта папка предназначена для системных компонентов. Не размещайте в ней собственный код — соблюдайте [правила кастомизации](../get-started/how-customize.md#where-to-place-changes).

   {% endnote %}

-  `make:controller` — генерирует класс [контроллера](./controllers.md), который наследуется от [`Bitrix\Main\Engine\Controller`](../api-reference/main/engine/controller/index.md). Опция `--actions` задает действия через запятую, значение `crud` создает действия `list`, `get`, `add`, `update` и `delete`.

   **Пример.** Команды создают контроллер `Post` с CRUD-действиями и с двумя действиями:

   ```bash prompt="$"
   # Создать контроллер с CRUD-действиями
   $ php bitrix.php make:controller Post -m my.module --actions=crud -n

   # Создать контроллер с конкретными действиями
   $ php bitrix.php make:controller Post -m my.module --actions=list,get -n
   ```

-  `make:tablet` — создает ORM-класс для существующей таблицы базы данных по ее структуре. Команде нужен установленный модуль `perfmon`. Первый аргумент — имя таблицы, второй — идентификатор модуля. Класс получает имя таблицы в стиле CamelCase с суффиксом `Table` и пространство имен `<Модуль>\Tablet`. Опция `--namespace` задает другое пространство имен, без нее второй аргумент обязателен. Опция `--show` выводит класс в консоль без сохранения файла.

   **Пример.** Команда создает класс `My\Module\Tablet\MyPostTable` для таблицы `my_post` в файле `/local/modules/my.module/lib/Tablet/MyPostTable.php`:

   ```bash prompt="$"
   $ php bitrix.php make:tablet my_post my.module
   ```

-  `make:agent` — создает класс [агента](./background-jobs.md) для периодических задач. После генерации выводит PHP-код для регистрации агента.

   **Пример.** Команда создает класс агента `UpdateRatingAgent`:

   ```bash prompt="$"
   $ php bitrix.php make:agent UpdateRating -m my.module -n
   ```

-  `make:entity` — генерирует класс объекта бизнес-логики. Опция `--fields` задает поля через запятую.

   **Пример.** Команда создает класс `Post` с тремя полями:

   ```bash prompt="$"
   # Создать класс объекта с полями
   $ php bitrix.php make:entity post -m my.module --fields=title,description,author -n
   ```

-  `make:event` — создает класс [события](./events.md).

   **Пример.** Команда создает класс события `PostCreatedEvent`:

   ```bash prompt="$"
   $ php bitrix.php make:event PostCreated -m my.module -n
   ```

-  `make:eventhandler` — генерирует класс обработчика события. Опции `--handler-module` или `-m` и `--event-module` обязательны. Первая задает модуль, в котором создается обработчик, вторая — модуль, который отправляет событие. Без них при `-n` команда завершается ошибкой `Option 'handler-module' is required`. Модуль события подставляется в пространство имен по частям идентификатора, например для `--event-module=my.module` обработчик получит пространство имен `My\Module\Internals\Integration\My\Module\EventHandler`.

   **Пример.** Команда создает обработчик `PostCreatedEventHandler` для события модуля `my.module`:

   ```bash prompt="$"
   $ php bitrix.php make:eventhandler PostCreated --handler-module=my.module --event-module=my.module -n
   ```

-  `make:message` — создает класс сообщения для [очереди сообщений](./messenger.md).

   **Пример.** Команда создает класс сообщения `PostCreatedMessage`:

   ```bash prompt="$"
   $ php bitrix.php make:message PostCreated -m my.module -n
   ```

-  `make:messagehandler` — генерирует класс обработчика сообщений. Опции `--handler-module` или `-m` и `--message-module` обязательны. Первая задает модуль обработчика, вторая — модуль, в котором находится класс сообщения.

   **Пример.** Команда создает обработчик `PostCreatedMessageHandler`:

   ```bash prompt="$"
   $ php bitrix.php make:messagehandler PostCreated --handler-module=my.module --message-module=my.module -n
   ```

-  `make:module` — создает заготовку модуля в папке `/local/modules/<id>/`, где `<id>` — идентификатор модуля, например `my.module`. Идентификатор должен содержать ровно одну точку, иначе команда завершается ошибкой `Invalid module name`.

   **Пример.** Команда создает заготовку модуля `my.module` и задает вопросы о названии, описании и версии:

   ```bash prompt="$"
   $ php bitrix.php make:module my.module
   ```

   Команда запрашивает название, описание и версию модуля в интерактивном режиме. Эти значения можно передать через опции.

   - `--name` — название модуля. Обязательно при запуске без интерактивных запросов.
   - `--description` — описание модуля. Можно не указывать.
   - `--module-version` — версия в формате `N.M.Z`, например `1.0.0`. По умолчанию `1.0.0`.

   Чтобы создать заготовку без интерактивных запросов, укажите опции и добавьте `-n`. Порядок создания модуля вручную описан в статье [Создание модуля](../get-started/create-module.md).

   **Пример.** Команда создает заготовку модуля без интерактивных вопросов:

   ```bash prompt="$"
   $ php bitrix.php make:module my.module --name="Мой модуль" --description="Функционал проекта" --module-version=1.0.0 -n
   ```

   **Пример.** Для идентификатора `my.module` команда создает следующую структуру:

   ```text
   /local/modules/my.module/
   ├── default_option.php
   ├── install/
   │   ├── index.php
   │   ├── version.php
   │   └── mysql/
   │       ├── install.sql
   │       └── uninstall.sql
   └── lang/
       └── ru/
           └── install/
               └── index.php
   ```

   Файл `install/index.php` содержит класс установки модуля, `install/version.php` — версию и дату ее создания. Файлы `install/mysql/install.sql` и `install/mysql/uninstall.sql` — пустые заготовки SQL-скриптов.

   Файл `default_option.php` содержит заготовку настроек по умолчанию. Файл `lang/ru/install/index.php` содержит языковую фразу для названия модуля и, если описание задано, фразу для описания.

-  `make:request` — генерирует класс Request для валидации параметров запроса. Опция `--fields` задает поля через запятую.

   **Пример.** Команда создает класс `CreatePostRequest` с двумя полями:

   ```bash prompt="$"
   # Создать Request с полями
   $ php bitrix.php make:request CreatePost -m my.module --fields=title,description -n
   ```

-  `make:service` — создает класс сервиса для бизнес-логики.

   **Пример.** Команда создает класс `MyPostService`:

   ```bash prompt="$"
   $ php bitrix.php make:service MyPost -m my.module -n
   ```

Большинство команд `make` работают в интерактивном режиме — запрашивают нужные параметры. Команды `make:component` и `make:tablet` вопросов не задают. Чтобы выполнить команду сразу, используйте опцию `-n` и укажите обязательные параметры. Если обязательная опция не указана, команда с `-n` завершается ошибкой `Option '<имя>' is required`.

Управлять структурой файлов при генерации кода можно с помощью опций. Без `-n` команды спрашивают их значения в интерактивном режиме, даже если модуль указан:

-  `--prefix` или `-P` — добавляет префикс к стандартному пространству имен,

-  `--context` или `-C` — помещает класс в подпространство.

**Пример.** Команды создают контроллер с префиксом `V2` и агента в подпространстве `FeatureName`:

```bash prompt="$"
# Создает класс в папке lib/V2/Infrastructure/Controller/
$ php bitrix.php make:controller MyPost -m my.module --prefix=V2 --actions=list -n

# Создает класс UpdateRatingAgent в папке lib/Infrastructure/Agent/FeatureName/
$ php bitrix.php make:agent UpdateRating -m my.module --context=FeatureName -n
```

#### ORM

Команда `orm:annotate` генерирует [аннотации](../orm/annotations.md) для полей ORM-классов. Опция `-m` или `--modules` задает модули через запятую. Если опция не указана, команда обрабатывает только модуль `main`. Значение `all` обрабатывает все модули.

Классы из папки `lib/` команда сканирует только у модулей в `/local/modules/`. Для модулей из `/bitrix/modules/` она добавляет аннотации пользовательских полей и динамических классов, например инфоблоков и highload-блоков.

Аннотации команда сохраняет в файл из аргумента `output`, по умолчанию `/bitrix/modules/orm_annotations.php`. Опция `--inside` сохраняет файл в `/local/modules/<id>/meta/orm.php`, она работает только для одного модуля. Для нескольких модулей команда игнорирует опцию и пишет файл по пути по умолчанию. Опция `--clean` или `-c` очищает текущую карту аннотаций перед генерацией.

**Пример.** Команды генерируют аннотации для собственного модуля, сохраняют их в папку модуля и генерируют заново для всех модулей:

```bash prompt="$"
# Сгенерировать аннотации для модуля my.module
$ php bitrix.php orm:annotate -m my.module

# Сохранить аннотации в /local/modules/my.module/meta/orm.php
$ php bitrix.php orm:annotate -m my.module --inside

# Перегенерировать все аннотации
$ php bitrix.php orm:annotate --clean -m all
```

#### Обмен сообщениями

Команда `messenger:consume` запускает обработку [очереди сообщений](./messenger.md). Команда работает, только если в секции `messenger` глобального файла [`.settings.php`](./settings.md) указано `'run_mode' => 'cli'`. Если секции `messenger` нет, команда завершается без обработки и без сообщения об ошибке. Если секция есть, но режим другой, команда выводит сообщение `Messenger not configured to run in CLI` и завершается. В обоих случаях код завершения успешный.

Аргументы команды — имена очередей через пробел. Опция `--sleep` задает паузу между проходами в секундах, по умолчанию `1`. Опция `--time-limit` или `-t` ограничивает время работы в секундах. Без нее команда работает в бесконечном цикле.

**Пример.** Команды запускают обработку всех очередей, двух очередей, с паузой и с ограничением времени:

```bash prompt="$"
# Запустить обработчик для всех очередей
$ php bitrix.php messenger:consume

# Обработать конкретные очереди — имена разделяются пробелами
$ php bitrix.php messenger:consume first_queue second_queue

# Установить паузу между проходами в 11 секунд
$ php bitrix.php messenger:consume --sleep 11

# Ограничить время работы 10 минутами
$ php bitrix.php messenger:consume --time-limit 600
```

#### Локализация

Команда `translate:index` индексирует языковые файлы для локализации. Команду регистрирует модуль `translate`, без него команды нет в списке. По умолчанию команда сканирует папку `/bitrix/modules/`, опция `--path` или `-p` задает другую папку.

**Пример.** Команды индексируют языковые файлы в стандартной папке и в папке модуля:

```bash prompt="$"
# Проиндексировать языковые файлы в стандартной папке
$ php bitrix.php translate:index

# Проиндексировать файлы по конкретному пути
$ php bitrix.php translate:index --path=/local/modules/my.module
```

#### Обновления

Команды `update:modules` и `update:languages` загружают обновления с сервера обновлений, показывают список доступных обновлений с версиями и запрашивают подтверждение перед установкой.

{% note warning "" %}

С опцией `-n` или `--no-interaction` команды не задают вопрос и сразу устанавливают обновления. Если нужно обновить систему обновлений, команда с `-n` обновляет только ее и завершается с успешным кодом, а обновления модулей ставит следующий запуск. Учитывайте это при запуске из cron.

{% endnote %}

Если сначала нужно обновить саму систему обновлений, команда задает вопрос `Upgrade the Update System?`. После согласия она обновляет только систему обновлений и выводит сообщение `Update System upgraded successfully. Restart the command.`. Запустите команду повторно, чтобы установить обновления модулей. При отказе команда завершается с кодом ошибки.

-  `update:modules` — обновляет модули. Опция `-m` или `--modules` задает модули через запятую, команда сама добавляет к ним модули, от которых зависят их обновления.

   **Пример.** Команды обновляют все модули и три конкретных модуля:

   ```bash prompt="$"
   # Обновить все модули
   $ php bitrix.php update:modules

   # Обновить конкретные модули
   $ php bitrix.php update:modules -m main,iblock,ui
   ```

-  `update:versions` — понижает номер версии модулей в файлах версий, например `install/version.php`, до значения на единицу ниже указанного, чтобы система обновлений снова предложила обновления начиная с указанной версии. Команда ничего не скачивает и не устанавливает и не запрашивает подтверждение. Аргумент — путь к JSON-файлу, где ключ — идентификатор модуля, значение — версия, например `{"main": "25.100.0", "iblock": "25.100.0"}`. Номер меняется, только если установленная версия модуля не ниже указанной.

   **Пример.** Команда понижает версии модулей из файла:

   ```bash prompt="$"
   $ php bitrix.php update:versions ~/bitrix_modules_versions.json
   ```

-  `update:languages` — обновляет языковые файлы. Опция `-l` задает языки через запятую.

   **Пример.** Команды обновляют все языковые пакеты и три конкретных языка:

   ```bash prompt="$"
   # Обновить все языковые пакеты
   $ php bitrix.php update:languages

   # Обновить конкретные языки
   $ php bitrix.php update:languages -l it,br,tr
   ```

### Как получить справку по команде

Чтобы получить подробную информацию о конкретной команде, используйте команду `help` или опцию `--help`. Справка покажет описание команды, список аргументов и опций.

**Пример.** Два способа вывести справку по команде:

```bash prompt="$"
$ php bitrix.php help [имя-команды]
# или альтернативный вариант
$ php bitrix.php [имя-команды] --help
```

## Создать новую команду

Консольная команда в Bitrix Framework — это PHP-класс, который наследуется от `Symfony\Component\Console\Command\Command`. Класс задает имя команды в методе `configure()` и выполняет работу в методе `execute()`.

-  `setName()` — задает имя, по которому команду вызывают, например `partner:feature:rebuild`. Имя не формируется из пространства имен или пути к файлу. Если у зарегистрированной команды нет имени, `bitrix.php` завершается ошибкой Symfony Console для всех команд,
-  `setDescription()` — задает описание для вывода `list`,
-  `addArgument()` и `addOption()` — объявляют аргументы и опции,
-  `execute()` — выполняет команду и возвращает код завершения `Command::SUCCESS` или `Command::FAILURE`.

**Пример.** Класс команды `partner:feature:rebuild` в модуле `partner.module`. Команда принимает необязательный аргумент `id` и выводит сообщение о результате:

```php
<?php

namespace Partner\Module\Cli\Command\Feature;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class RebuildCommand extends Command
{
    protected function configure(): void
    {
        $this
            ->setName('partner:feature:rebuild')
            ->setDescription('Rebuild feature data')
            ->addArgument('id', InputArgument::OPTIONAL, 'Feature ID')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $id = (int)$input->getArgument('id');

        // перестроение данных

        $output->writeln('Rebuild finished for ID ' . $id);

        return self::SUCCESS;
    }
}
```

Ядро создает объект команды через [Service Locator](./service-locator.md), поэтому в конструктор команды можно добавить зависимости, которые Service Locator умеет создать. Если в классе есть конструктор, вызовите в нем `parent::__construct()`. Объекты всех зарегистрированных команд создаются при каждом запуске `bitrix.php`, даже для `list`. Не выполняйте работу в конструкторе, потому что исключение в нем ломает запуск всех команд.

{% note tip "" %}

Подробную информацию о создании команд, их структуре и возможностях смотрите в [официальной документации Symfony](https://symfony.com/doc/current/console.html#creating-a-command).

{% endnote %}

### Как зарегистрировать команду

После создания класса зарегистрируйте команду в секции `console` файла `.settings.php` в корне модуля. Если файла нет, создайте его. Если файл уже существует, дополните его.

**Пример.** Регистрация класса команды в `.settings.php` модуля:

```php
<?php

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

При запуске `bitrix.php` подключает каждый установленный модуль с секцией `console` и добавляет классы из списка `commands`, которые наследуются от `Command`. Классы, которые не наследуются от `Command` или не загружаются, например из-за опечатки в имени, `bitrix.php` пропускает без ошибки. Если команда не появилась в `list`, проверьте имя класса и его автозагрузку. Если модуль не установлен, его команды не появятся. После регистрации команда появится в выводе `php bitrix.php list`.

### Где разместить файлы команд

Размещайте файлы команд в папке `lib/Cli/Command/` внутри модуля. Путь к файлу повторяет пространство имен класса по правилам [автозагрузки](./autoloading.md).

**Пример.** Структура модуля с одним классом команды:

```text
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

Имя команды не зависит от папки и пространства имен. Класс из примера вызывается командой `php bitrix.php partner:feature:rebuild`, потому что это имя задано в `setName()`.

## Настроить запуск по расписанию

Команды можно запускать по расписанию через cron для регулярных задач.

**Пример.** Строки crontab запускают команду каждый день в 3:00 и каждое воскресенье в 4:00:

```bash
# Выполнять команду каждый день в 3:00
0 3 * * * cd /path/to/document_root && php bitrix/bitrix.php [command] --no-interaction

# Выполнять команду каждое воскресенье в 4:00
0 4 * * 0 cd /path/to/document_root && php bitrix/bitrix.php [command] --no-interaction

# Обрабатывать очереди сообщений 10 минут каждые 10 минут
*/10 * * * * cd /path/to/document_root && php bitrix/bitrix.php messenger:consume --time-limit=600
```

Опция `--no-interaction` отключает интерактивные запросы.

{% note tip "" %}

В cron сначала перейдите в корень сайта, затем запускайте bitrix.php по относительному пути. Скрипт вычисляет DOCUMENT_ROOT из текущей папки и пути к скрипту, поэтому вызов по абсолютному пути, например `php /var/www/bitrix/bitrix.php`, из любой папки, кроме корня файловой системы `/`, дает неверный путь к ядру. Скрипт завершается фатальной ошибкой PHP `Failed opening required '/bitrix/modules/main/cli/bitrix.php'` с кодом 255. При выключенном `display_errors` текста ошибки в консоли нет.

{% endnote %}

## Что дальше

- [Composer](../get-started/composer.md) — установка Symfony Console и других библиотек.
- [Очереди сообщений](./messenger.md) — настройка очередей для `messenger:consume`.
- [Агенты и фоновые задачи](./background-jobs.md) — регулярные задачи без cron.
- [Создание модуля](../get-started/create-module.md) — модуль, в котором регистрируют собственные команды.
