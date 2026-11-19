---
title: Очереди сообщений
description: 'Очереди сообщений Bitrix Framework (Messenger): сообщение AbstractMessage, обработчик AbstractReceiver, брокер db, настройка очередей в .settings.php, повторы retry_strategy, запуск messenger:consume в режиме cli.'
---

Очереди в Bitrix Framework выполняют задачи в фоне. Код сайта отправляет сообщение в очередь и сразу продолжает работу, а обработчик выполняет задачу позже, в отдельном процессе или после ответа пользователю.

Очередь подходит, когда задач много, их нужно повторять при ошибке и ограничивать нагрузку. Для других сценариев есть другие механизмы:

- [фоновая задача](./background-jobs.md#fonovye-zadachi) — одно действие после отправки ответа текущему пользователю, без хранения и повторов,
- [агент](./background-jobs.md#agenty) — периодическое действие по расписанию.

{% note warning "" %}

Функционал очередей находится в альфа-версии разработки. Очереди можно использовать с версии 25.100.300 главного модуля, но без гарантий обратной совместимости. Разработчики могут изменить функционал в следующих обновлениях. Классы `AbstractReceiver`, `ReceiverInterface`, `MessageInterface` и `MessageBox` помечены в коде как `@internal`.

{% endnote %}

## Как работают очереди

Очередь — это канал передачи данных от отправителя к обработчику. Сообщение помещается в брокер, а обработчик забирает его и выполняет задачу.

Основные компоненты:

-  сообщение — контейнер данных,

-  обработчик — класс, который обрабатывает сообщение,

-  брокер — хранилище сообщений,

-  очередь — логическая группа сообщений, привязанная к обработчику,

-  воркер — запускает обработчики настроенных очередей. Обработчик получает доступные сообщения из брокера и выполняет задачу.

В режиме `web` система запускает воркер через [фоновые задачи](./background-jobs.md#fonovye-zadachi) после отправки ответа пользователю. В режиме `cli` воркер запускает консольная команда `messenger:consume`.

## Быстрый старт

Создайте сообщение и обработчик, настройте очередь и отправьте сообщение. Для проверки запустите обработку в консольном режиме и найдите запись в логе.

Для других сценариев можно настроить повторные попытки, отложить обработку и использовать свою таблицу для хранения сообщений.

### Пример настройки очереди сообщений

Используйте установленный пользовательский модуль `vendor.module`. Классы разместите в его папке `lib/` по правилам [автозагрузки](./autoloading.md#razmestit-klassy-v-lib/).

#### 1\. Создать класс сообщения

Класс `AbstractMessage` передает публичные свойства для JSON-сериализации и восстанавливает объект перед обработкой. Для полей типов `string`, `int`, `float`, `bool` и массивов таких значений переопределять методы `jsonSerialize()` и `createFromData()` не нужно. Имена параметров конструктора должны совпадать с именами сохраненных полей.

Создайте файл `/local/modules/vendor.module/lib/Public/Message/MyMessage.php`:

```php
<?php

namespace Vendor\Module\Public\Message;

use Bitrix\Main\Messenger\Entity\AbstractMessage;

class MyMessage extends AbstractMessage
{
    public function __construct(
        public readonly string $text,
        public readonly int $itemId,
    )
    {
    }
}
```

Поле `text` содержит текст сообщения, а `itemId` — идентификатор объекта, к которому оно относится.

Если данные требуют собственного преобразования, переопределите `jsonSerialize()` для сохранения и `createFromData()` для восстановления объекта.

#### 2\. Создать класс обработчика

Обработчик получает сообщение и записывает его данные в лог. Создайте файл `/local/modules/vendor.module/lib/Internals/Messenger/Receiver/MyReceiver.php`:

```php
<?php

namespace Vendor\Module\Internals\Messenger\Receiver;

use Bitrix\Main\Diag\LoggerFactory;
use Bitrix\Main\Messenger\Entity\MessageInterface;
use Bitrix\Main\Messenger\Internals\Exception\Receiver\UnprocessableMessageException;
use Bitrix\Main\Messenger\Receiver\AbstractReceiver;
use Vendor\Module\Public\Message\MyMessage;

class MyReceiver extends AbstractReceiver
{
    protected function process(MessageInterface $message): void
    {
        if (!($message instanceof MyMessage))
        {
            throw new UnprocessableMessageException($message);
        }

        $logger = (new LoggerFactory())->createDefault();
        $logger->info(
            'Queue message: item {itemId}, text {text}',
            [
                'itemId' => $message->itemId,
                'text' => $message->text,
            ],
        );
    }
}
```

Для файлового логирования задайте непустую константу `LOG_FILENAME` в общем файле `/local/php_interface/init.php`. Укажите абсолютный путь к файлу вне публичной папки сайта, доступный для записи пользователю PHP. Если константа уже задана, используйте существующий путь.

Без `LOG_FILENAME` метод `createDefault()` возвращает `NullLogger`, который не сохраняет сообщения. Подробнее о настройке — в статье [Логгеры](../advanced/logger.md).
#### 3\. Добавить конфигурацию в .settings.php

Добавьте секцию `messenger` в файл `/local/modules/vendor.module/.settings.php`. В параметре `handler` укажите полное имя созданного обработчика. Если файл уже содержит другие настройки, сохраните их:

```php
<?php

return [
    'messenger' => [
        'value' => [
            'queues' => [ // список очередей
                'first_queue' => [ // очередь с именем 'first_queue'
                    'handler' => \Vendor\Module\Internals\Messenger\Receiver\MyReceiver::class,
                ],
            ],
        ],
        'readonly' => true, // защита от перезаписи настроек через API
    ],
];
```

В глобальном файле `/bitrix/.settings.php` настройте брокер `default` и режим `cli`. Добавьте секцию в существующий массив настроек или дополните ее, если она уже есть:

```php
'messenger' => [
    'value' => [
        'run_mode' => 'cli',
        'brokers' => [
            'default' => [
                'type' => 'db',
                'params' => [
                    'table' => \Bitrix\Main\Messenger\Internals\Storage\Db\Model\MessengerMessageTable::class,
                ],
            ],
        ],
    ],
    'readonly' => true,
],
```

{% note warning "" %}

Режим `run_mode` действует на все очереди проекта. Если используется `web`, переключение на `cli` требует запуска консольного обработчика и для остальных очередей.

{% endnote %}

Подробнее — в разделе [Конфигурация очередей](#settings).

#### 4\. Отправить сообщение

В коде сайта после подключения ядра подключите модуль и отправьте сообщение. Имя очереди в `send()` должно совпадать с ключом в конфигурации:

```php
use Bitrix\Main\Loader;
use Vendor\Module\Public\Message\MyMessage;

Loader::requireModule('vendor.module');

$message = new MyMessage('Мое первое сообщение!', 12345);
$message->send('first_queue');
```

Метод `send()` сохраняет сообщение через брокер. В режиме `cli` оно будет ждать запуска консольного обработчика.

#### 5\. Запустить обработку и проверить результат

Выполните команду из папки `/bitrix/` сайта. Для проверки ограничьте время работы десятью секундами:

```bash prompt="$"
$ php bitrix.php messenger:consume first_queue --time-limit 10
```

Откройте файл, указанный в `LOG_FILENAME`, и найдите сообщение `Queue message: item 12345, text Мое первое сообщение!`. Форматтер может добавлять к нему дату и другие данные. Если записи нет, проверьте настройки логирования, права на файл и совпадение имени очереди в конфигурации и вызове `send()`.

### Создать классы через консоль

Для создания классов можно использовать команды [`make:message` и `make:messagehandler`](./console-commands.md#generaciya-koda). Они доступны с версии 25.900.0 главного модуля. Выполните команды из папки `/bitrix/` сайта для установленного модуля `vendor.module`:

```bash prompt="$"
$ php bitrix.php make:message My -m vendor.module -n
$ php bitrix.php make:messagehandler My --handler-module=vendor.module --message-module=vendor.module -n
```

Первая команда создает класс `MyMessage`, вторая — `MyMessageHandler`. Если классы из быстрого старта уже созданы, команды без вопроса перезапишут файлы с теми же именами. В команде `make:message` опция `-m` задает модуль сообщения. В команде `make:messagehandler` опция `--handler-module` задает модуль обработчика, ее сокращение — `-m`, а `--message-module` задает модуль сообщения. Опция `-n` отключает интерактивные вопросы.

Команда `make:messagehandler` убирает с конца имени все буквы из набора `M`, `e`, `s`, `a`, `g`, а не только слово `Message`. Например, для имени `Update` она создает обработчик `UpdatMessageHandler` и ожидает сообщение `UpdatMessage`, а `make:message Update` создает `UpdateMessage`. После генерации проверьте имя класса сообщения в обработчике.

Добавьте поля сообщения и код обработки в сгенерированные классы. В обработчике подключите класс сообщения через `use Vendor\Module\Public\Message\MyMessage;`.

Генератор размещает обработчик в пространстве имен `Vendor\Module\Internals\Integration\Vendor\Module\MessageHandler`. Укажите полное имя `\Vendor\Module\Internals\Integration\Vendor\Module\MessageHandler\MyMessageHandler::class` в параметре `handler` конфигурации.

## Конфигурация очередей {#settings}

Систему очередей нужно настроить в файле `.settings.php`. Конфигурация может быть:

-  глобальной — в файле `bitrix/.settings.php` для общих настроек и межмодульных очередей,

-  модульной — в файле `.settings.php` модуля, для очередей из этого модуля.

{% note info "" %}

Конфигурацию очередей нужно указывать в файле `.settings.php` того модуля, к которому относятся очереди. В глобальном файле указываются только те очереди, которые одновременно используются в нескольких модулях.

{% endnote %}

### Глобальная конфигурация

Глобальную конфигурацию настраивают, когда очереди и брокер планируют использовать в разных модулях, например, для интеграции между модулями.

Мастер установки продукта создает в `/bitrix/.settings.php` секцию `messenger` с параметрами `run_mode`, `shuffle`, `brokers` и пустым списком `queues`. В `brokers` описан один брокер по умолчанию `default`.

**Пример.** Глобальная секция `messenger` задает режим `web`, брокер по умолчанию и межмодульную очередь `first_queue`. Обработчик очереди находится в модуле `vendor.module`, поэтому модуль указан в параметре `module`:

```php
// bitrix/.settings.php
return [
    'messenger' => [
        'value' => [
            'run_mode' => 'web',
            'shuffle' => true,
            'brokers' => [
                'default' => [
                    'type' => \Bitrix\Main\Messenger\Internals\Broker\DbBroker::TYPE_CODE,
                    'params' => [
                        'table' => \Bitrix\Main\Messenger\Internals\Storage\Db\Model\MessengerMessageTable::class,
                    ],
                ],
            ],
            'queues' => [
                'first_queue' => [
                    'handler' => \Vendor\Module\Internals\Messenger\Receiver\MyReceiver::class,
                    'module' => 'vendor.module',
                ],
            ],
        ],
        'readonly' => true,
    ],
];
```

#### Параметры глобальной секции

Параметры глобальной секции `messenger`:

| Параметр | Описание |
|---|---|
| run_mode<br>`string` | Режим обработки. `web` — обработчики запускает фоновая задача после ответа на каждый хит, `cli` — обработчики запускает команда `messenger:consume`. По умолчанию `web`. Действует на все очереди проекта |
| shuffle<br>`bool` | Перемешивать порядок очередей при каждом проходе, чтобы одна очередь не задерживала остальные. По умолчанию `true` |
| brokers<br>`array` | Хранилища сообщений. Ключ — имя брокера, значение — параметры брокера. Если секция `messenger` есть, брокер `default` в ней обязателен, без него ядро выбрасывает `ConfigurationException` с текстом `Default broker for messenger did not configured`. Если секции нет совсем, ядро использует брокер `default` с таблицей `MessengerMessageTable` и режим `web` |
| queues<br>`array` | Межмодульные очереди. Ключ — имя очереди, значение — параметры очереди, описанные в разделе [Модульная конфигурация](#modulnaya-konfiguraciya) |

Параметры брокера:

*Обязательные параметры обозначены \*.*

| Параметр | Описание |
|---|---|
| type*<br>`string` | Тип брокера. Пустое значение вызывает `ConfigurationException` с текстом `Wrong configuration of broker`. Поддерживается только `db` — хранение в базе данных, то же значение дает константа `DbBroker::TYPE_CODE`. Другое значение вызывает `ConfigurationException` с текстом `Unknown broker type` |
| params.table*<br>`string` | Имя ORM-класса таблицы сообщений. Без параметра ядро выбрасывает `ConfigurationException`. Класс должен быть `MessengerMessageTable` или его наследником, иначе ядро выбрасывает `ConfigurationException`. Строка с именем таблицы базы данных не подходит |
| params.module<br>`string` | Модуль, который ядро подключает перед загрузкой класса таблицы. Укажите модуль, если класс таблицы находится в модуле. Если параметр не задан, ядро модуль не подключает |

Если в глобальной очереди не задан параметр `module`, ядро подключает модуль `main` и может не найти класс обработчика из другого модуля. Тогда очередь не обрабатывается, а ошибка `The class ... does not exist` попадает в лог. Ошибка проявляется не на каждом хите, а только когда модуль обработчика не подключен раньше, например в режиме `cli`. Всегда задавайте `module` для глобальных очередей.

### Модульная конфигурация {#modulnaya-konfiguraciya}

В `.settings.php` модуля описывают очереди модуля и, при необходимости, брокеры модуля. Ядро читает секцию `messenger` только у установленных модулей. Параметр `module` очереди в модульной конфигурации не нужен, ядро берет идентификатор модуля, которому принадлежит файл.

**Пример.** Модуль календаря описывает в своем `.settings.php` брокер `calendar_db` со своей таблицей и очередь, которая хранит сообщения в этом брокере:

```php
// bitrix/modules/calendar/.settings.php
return [
    // ...
    'messenger' => [
        'value' => [
            'brokers' => [
                'calendar_db' => [
                    'type' => \Bitrix\Main\Messenger\Internals\Broker\DbBroker::TYPE_CODE,
                    'params' => [
                        'table' => \Bitrix\Calendar\Synchronization\Internal\Model\MessengerTable::class,
                        'module' => 'calendar',
                    ],
                ],
            ],
            'queues' => [
                'google_section_sync' => [
                    'broker' => 'calendar_db',
                    'handler' => \Bitrix\Calendar\Synchronization\Internal\Service\Messenger\Receiver\GoogleSectionReceiver::class,
                    'retry_strategy' => [
                        'max_retries' => 30,
                        'delay' => 5,
                        'multiplier' => 2,
                        'max_delay' => 1200,
                    ],
                ],
            ],
        ],
        'readonly' => true,
    ],
];
```

#### Параметры брокеров и очередей модуля

Брокеры `brokers` в модульной конфигурации описывают так же, как в глобальной, ключами `type`, `params.table` и `params.module`. Брокеры и очереди с одинаковыми именами из разных файлов не объединяются. Брокер или очередь, прочитанные позже, заменяют прежние без сообщения об ошибке. Ядро читает сначала глобальную конфигурацию, затем модули, поэтому используйте в именах префикс модуля, например `vendor_module_db`. Брокер модуля с именем `default` заменит глобальный брокер по умолчанию для всех очередей.

Параметры очереди:

| Параметр | Описание |
|---|---|
| handler*<br>`string` | Полное имя класса обработчика. Класс должен реализовать `ReceiverInterface`, обычно через наследование от `AbstractReceiver`. Без параметра ядро выбрасывает `ConfigurationException` с текстом `Param "handler" should be set` |
| broker<br>`string` | Имя брокера очереди. По умолчанию `default` |
| limit<br>`int` | Сколько сообщений обработчик выбирает из очереди за один проход. Целое число больше нуля. Значение меньше единицы вызывает `ConfigurationException`, значение больше 1000 ядро уменьшает до 1000. По умолчанию `50` |
| total_processing_limit<br>`int` | Сколько сообщений очереди могут обрабатываться одновременно всеми обработчиками. Целое число больше нуля, не меньше `limit`. Значение меньше единицы вызывает `ConfigurationException`. По умолчанию `100` |
| retry_strategy<br>`array` | Настройки повторной обработки, описаны в разделе [Повторная обработка сообщений](#povtornaya-obrabotka) |
| module<br>`string` | Модуль обработчика. Учитывается только в глобальной конфигурации. По умолчанию `main` |

*Обязательный параметр обозначен \*.*

### Ограничение количества обрабатываемых сообщений

Количество обрабатываемых сообщений ограничивают два параметра очереди.

1. Параметр `limit` задает количество сообщений, которые обработчик выбирает из очереди за один проход.

   **Пример.** В режиме `web` обработка идет после ответа на хит. Если одно сообщение обрабатывается около 10 секунд, значение `50` занимает процесс PHP надолго. Значение `2` или `3` разбирает очередь равномерно и не мешает другим запросам.

2. Параметр `total_processing_limit` задает максимальное количество сообщений, которые могут одновременно обрабатываться в очереди всеми обработчиками.

   **Пример.** Если `limit` равен `30` и `total_processing_limit` — `50`, то при наличии `100` готовых сообщений первый обработчик заберет `30`, а второй сможет забрать только `20`. Параметр ограничивает общую нагрузку, когда очередь разбирают несколько процессов одновременно.

Если `limit` больше `total_processing_limit`, брокер не может выбрать сообщения, когда в очереди есть готовые сообщения. Ядро пишет в лог исключение `BrokerReadException`, текст которого начинается с `Unable to read messages` и содержит фразу `is greater than the processing limit`. Сообщения этой очереди не обрабатываются, остальные очереди работают.

### Повторная обработка сообщений {#povtornaya-obrabotka}

Сообщение может не обработаться с первой попытки, например из-за временной недоступности сервиса. Тогда брокер возвращает сообщение в очередь, и обработчик получает его повторно после задержки.

Используйте повторную обработку:

-  при работе с внешними API,

-  при нестабильных соединениях,

-  для ресурсоемких задач.

#### Параметры retry_strategy

Для каждой очереди можно указать в конфигурации параметр `retry_strategy` с настройками повторной обработки.

-  `max_retries` — максимальное количество попыток обработки, включая исходную попытку. По умолчанию — `3`. При значении `1` брокер удаляет сообщение после первой ошибки.

-  `delay` — базовая задержка между попытками в секундах. По умолчанию — `1`.

-  `multiplier` — множитель задержки между попытками. По умолчанию — `2`.

-  `max_delay` — максимальное значение задержки между повторами в секундах. Ограничивает задержку, но не отменяет повторные попытки. По умолчанию — `0`, то есть без ограничения.

Задержка перед повтором с номером `n` равна `delay * multiplier ** n` секунд, но не больше `max_delay`. Если параметр `retry_strategy` не задан, ядро использует значения по умолчанию и добавляет к задержке случайное отклонение в пределах ±10%, чтобы повторы разных сообщений не совпадали по времени. Если параметр задан, отклонение не добавляется.

#### Пример конфигурации

**Пример.** Очередь `second_queue` в `.settings.php` модуля повторяет обработку до девяти раз с задержкой от 10 до 300 секунд:

```php
// local/modules/vendor.module/.settings.php
return [
    'messenger' => [
        'value' => [
            'queues' => [
                'second_queue' => [
                    'handler' => \Vendor\Module\Internals\Messenger\Receiver\MyReceiver::class,
                    'retry_strategy' => [
                        'max_retries' => 10,
                        'delay' => 5,       // базовая задержка — пять секунд
                        'multiplier' => 2,  // удваиваем с каждой попыткой
                        'max_delay' => 300, // максимум пять минут между попытками
                    ],
                ],
            ],
        ],
        'readonly' => true,
    ],
];
```

-  Первая повторная попытка станет доступна через 10 секунд после ошибки. Задержка равна `delay * multiplier`, то есть `5 * 2`.

-  Вторая — через 20 секунд после следующей ошибки.

-  Третья — через 40 секунд. Далее задержка увеличивается с учетом `multiplier`.

-  Шестая и последующие повторные попытки станут доступны через 300 секунд после ошибки. Расчетная задержка для шестого повтора равна `5 * 2 ** 6 = 320` секундам, поэтому применяется ограничение `max_delay`.

При значении `max_retries = 10` обработчик может выполнить исходную попытку и до девяти повторов для обычных исключений. Если все десять попыток завершатся ошибкой, брокер удалит сообщение из очереди. Для исключения `RecoverableMessageException` ограничение количества попыток не действует.

Число попыток `max_retries` брокер записывает в сообщение при отправке. Если изменить `retry_strategy`, новое число попыток действует только для сообщений, отправленных после изменения.

### Своя таблица для сообщений

Брокер типа `db` хранит сообщения в базе данных. По умолчанию он работает с ORM-классом `MessengerMessageTable`. Модуль может хранить свои сообщения в отдельной таблице, чтобы большие очереди не замедляли общую таблицу.

1. Создайте класс-наследник `MessengerMessageTable` в папке `lib/` модуля и переопределите метод `getTableName()`. Структура таблицы должна совпадать со структурой таблицы `MessengerMessageTable`.

   **Пример.** Класс таблицы сообщений модуля `vendor.module`:

   ```php
   <?php

   namespace Vendor\Module\Internals\Messenger\Storage;

   use Bitrix\Main\Messenger\Internals\Storage\Db\Model\MessengerMessageTable;

   class ModuleMessageTable extends MessengerMessageTable
   {
       public static function getTableName(): string
       {
           return 'b_vendor_module_messenger_message';
       }
   }
   ```

2. Опишите брокер с этой таблицей в `.settings.php` модуля. Укажите модуль в `params.module`, чтобы ядро подключило его перед загрузкой класса таблицы.

   **Пример.** Брокер `vendor_module_db` в файле `/local/modules/vendor.module/.settings.php`:

   ```php
   return [
       'messenger' => [
           'value' => [
               'brokers' => [
                   'vendor_module_db' => [
                       'type' => 'db',
                       'params' => [
                           'table' => \Vendor\Module\Internals\Messenger\Storage\ModuleMessageTable::class,
                           'module' => 'vendor.module',
                       ],
                   ],
               ],
           ],
           'readonly' => true,
       ],
   ];
   ```

3. Укажите имя брокера `vendor_module_db` в параметре `broker` очередей модуля. После этого сообщения этих очередей сохраняются в созданную таблицу.

{% note info "" %}

Таблицу создает и удаляет модуль, к которому она относится. Добавьте создание таблицы в метод `InstallDB()` установщика модуля, а удаление — в `UnInstallDB()`. Установщик описан в статье [Создание модуля](../get-started/create-module.md).

{% endnote %}

## Запуск обработчика очередей

Система поддерживает два режима обработки.

1. `web` — обработка через фоновые задачи. Режим включен по умолчанию. Ядро на каждом хите после ответа пользователю выполняет один проход по всем очередям.

2. `cli` — консольный режим. Обработку выполняет отдельный процесс команды `messenger:consume`, поэтому она не занимает процессы веб-сервера. Для рабочего сайта рекомендуется режим `cli` и супервизор процессов, который перезапускает команду.

### Консольный режим

Чтобы использовать консольный режим, установите в глобальной конфигурации `'run_mode' => 'cli'` и запустите команду из папки `/bitrix/` сайта.

**Пример.** Команда обрабатывает все очереди в бесконечном цикле:

```bash prompt="$"
$ php bitrix.php messenger:consume
```

Команда выполняет проход по очередям, ждет паузу и повторяет проход. Если в конфигурации не указан режим `cli`, команда выводит сообщение `Messenger not configured to run in CLI` и завершается без обработки. Если секции `messenger` в `/bitrix/.settings.php` нет, команда выводит только строку `Started` с датой и завершается без сообщения об ошибке.

Аргументы и опции команды:

-  `queues` — имена очередей через пробел. Если аргумент не задан, команда обрабатывает все очереди,
-  `-t`, `--time-limit` — время работы в секундах, число не меньше 1. Другое значение вызывает ошибку `Option "time-limit" must be a positive integer`. По умолчанию без ограничения,
-  `--sleep` — пауза между проходами в секундах. По умолчанию `1`.

**Пример.** Команда обрабатывает две очереди 60 секунд с паузой две секунды между проходами:

```bash prompt="$"
$ php bitrix.php messenger:consume first_queue second_queue -t 60 --sleep 2
```

Остальные консольные команды описаны в статье [Консольные команды](./console-commands.md).

## Обработчики сообщений

Каждая очередь использует свой обработчик. Обработчик получает сообщение, выполняет задачу и при ошибке выбрасывает исключение. От типа исключения зависит, что брокер сделает с сообщением.

Чтобы создать обработчик, унаследуйте класс от `\Bitrix\Main\Messenger\Receiver\AbstractReceiver` и реализуйте метод `process()`. Если метод завершился без исключения, брокер удаляет сообщение из очереди как обработанное.

**Пример.** Обработчик `ItemReceiver` обрабатывает только сообщения `MyMessage` из быстрого старта и отклоняет остальные:

```php
<?php

namespace Vendor\Module\Internals\Messenger\Receiver;

use Bitrix\Main\Messenger\Entity\MessageInterface;
use Bitrix\Main\Messenger\Internals\Exception\Receiver\UnprocessableMessageException;
use Bitrix\Main\Messenger\Receiver\AbstractReceiver;
use Vendor\Module\Public\Message\MyMessage;

class ItemReceiver extends AbstractReceiver
{
    protected function process(MessageInterface $message): void
    {
        if (!($message instanceof MyMessage))
        {
            throw new UnprocessableMessageException($message);
        }

        // обработка объекта с идентификатором $message->itemId
    }
}
```

Ядро создает объект обработчика через [Service Locator](./service-locator.md), поэтому в конструктор обработчика можно добавить зависимости, которые Service Locator умеет создать.

Перед обработкой каждого сообщения `AbstractReceiver` обнуляет глобальную переменную `$USER`. Обработчик не знает, какой пользователь отправил сообщение, поэтому передавайте идентификатор пользователя и другие нужные данные в самом сообщении.

Если процесс обработки упал до завершения, сообщение остается в статусе обработки. Брокер возвращает такие сообщения в очередь через двое суток. До этого они занимают места в лимите `total_processing_limit`.

### Типы исключений

Исключения обработчика находятся в пространстве имен `Bitrix\Main\Messenger\Internals\Exception\Receiver`. Выбирайте исключение по тому, нужен ли повтор:

| Исключение | Когда выбрасывать | Что делает брокер |
|---|---|---|
| UnprocessableMessageException | Сообщение не подходит обработчику, например в очередь задач пришло сообщение о пользователе. Конструктор принимает объект сообщения | Возвращает сообщение в очередь по правилам `retry_strategy` и пишет исключение в лог |
| UnrecoverableMessageException | Повтор бесполезен, например объект из сообщения уже удален | Удаляет сообщение из очереди. Если включен логгер `main.Messenger.Receiver`, пишет в него запись уровня `notice` |
| RecoverableMessageException | Временная ошибка, повтор нужен | Возвращает сообщение в очередь без учета лимита `max_retries`. Задержку в секундах передают четвертым аргументом конструктора `retryDelay`, удобнее именованным аргументом. Вызов `new RecoverableMessageException('...', 60)` передает 60 в код ошибки, а не в задержку. Если задержка не передана, брокер берет ее из `retry_strategy` |
| NoLoggableException | Ожидаемая ошибка, которую не нужно писать в лог | Возвращает сообщение в очередь по правилам `retry_strategy`, в лог не пишет |
| Другие исключения | Непредвиденная ошибка обработки | Возвращает сообщение в очередь по правилам `retry_strategy` и пишет исключение в лог |

**Пример.** Обработчик повторяет сообщение через 60 секунд, если внешний сервис недоступен:

```php
use Bitrix\Main\Messenger\Internals\Exception\Receiver\RecoverableMessageException;

throw new RecoverableMessageException('Service is unavailable', retryDelay: 60);
```

Ошибки конфигурации действуют по-разному:

-  ошибки в параметрах очереди, например не задан `handler` или `limit` меньше единицы, останавливают обработку всех очередей. В режиме `cli` команда `messenger:consume` завершается с исключением `ConfigurationException`,
-  ошибки создания обработчика, например класс обработчика не существует или брокер не настроен, ядро пишет в лог и переходит к следующей очереди.

### Пример обработчика сообщений в консольном режиме

**Пример.** Обработчик `JsonOutputReceiver` в файле `/local/modules/vendor.module/lib/Internals/Messenger/Receiver/JsonOutputReceiver.php` выводит данные каждого сообщения в формате JSON:

```php
<?php

namespace Vendor\Module\Internals\Messenger\Receiver;

use Bitrix\Main\Messenger\Entity\MessageInterface;
use Bitrix\Main\Messenger\Receiver\AbstractReceiver;

class JsonOutputReceiver extends AbstractReceiver
{
    protected function process(MessageInterface $message): void
    {
        echo json_encode($message, JSON_THROW_ON_ERROR) . PHP_EOL;
    }
}
```

Зарегистрируйте обработчик для нужной очереди в параметре `handler` и запустите команду `messenger:consume` в режиме `cli`. Команда выводит JSON каждого обработанного сообщения в консоль.

### Собственная реализация

Для особых сценариев можно реализовать обработчик без `AbstractReceiver`, через интерфейс `\Bitrix\Main\Messenger\Receiver\ReceiverInterface`. Интерфейс помечен `@internal` и может измениться.

**Пример.** Методы интерфейса `ReceiverInterface`:

```php
interface ReceiverInterface
{
    /**
     * Основной метод обработки
     * @throws ReceiverException
     */
    public function run(): void;

    // Установка лимита сообщений за одну итерацию
    public function setLimit(int $limit): self;

    // Назначение очереди
    public function setQueueId(string $queueId): self;

    // Выбор брокера
    public function setBroker(BrokerInterface $broker): self;
}
```

При реализации интерфейса необходимо самостоятельно управлять:

-  получением сообщений из брокера,

-  подтверждением успешной обработки `ack`,

-  обработкой ошибок `reject`.

Методы интерфейса:

-  `run()` — получает сообщения из очереди, выполняет обработку и выбрасывает `ReceiverException` при неудачной обработке.

-  `setLimit(int $limit)` — задает, сколько сообщений обработчик выбирает из очереди за один вызов `run()`. Ядро передает значение параметра `limit` очереди. В `AbstractReceiver` значение меньше единицы заменяется на `50`, в своей реализации проверьте значение сами.

-  `setQueueId(string $queueId)` — назначает очередь для обработки.

-  `setBroker(BrokerInterface $broker)` — передает брокер очереди. Ядро вызывает метод само и передает брокер из конфигурации очереди. Сейчас существует только брокер `DbBroker`.

## Работа с сообщениями

Сообщения — это контейнеры данных для передачи через очередь. Сообщение реализует интерфейс `\Bitrix\Main\Messenger\Entity\MessageInterface`. Обычно класс сообщения наследуют от `\Bitrix\Main\Messenger\Entity\AbstractMessage`, который уже реализует сохранение и восстановление данных.

Требования к сообщениям:

-  Данные сообщения сохраняются в JSON. Класс `AbstractMessage` без доработки сохраняет публичные свойства типов `string`, `int`, `float`, `bool` и массивы таких значений. Для объектов и других типов переопределите методы `jsonSerialize()` и `createFromData()`.

-  Имена параметров конструктора должны совпадать с именами публичных свойств. Для параметра без пары в сохраненных данных `createFromData()` передает `null`. Если тип параметра не допускает `null`, восстановление завершается ошибкой `TypeError`. Ядро пишет ее в лог и прерывает проход очереди, а сообщение остается в очереди без уменьшения числа попыток. На следующем проходе ошибка повторяется, и очередь не продвигается.

-  Не переименовывайте и не удаляйте класс сообщения и не добавляйте в конструктор обязательные параметры, пока в очереди есть сообщения этого класса. Сообщение, класс которого не найден, останавливает очередь так же.

-  Сообщение должно содержать все данные для обработки, потому что обработка может начаться позже.

### Отправить сообщение

Метод `send($queueId, $params)` сохраняет сообщение в брокер очереди. Параметр `$queueId` — имя очереди из конфигурации, `$params` — необязательный массив параметров обработки. Перед отправкой подключите модуль, в котором находится класс сообщения, например `Loader::requireModule('vendor.module')`.

**Пример.** Код отправляет сообщение `MyMessage` в очередь `first_queue`:

```php
use Bitrix\Main\Loader;
use Vendor\Module\Public\Message\MyMessage;

Loader::requireModule('vendor.module');

$message = new MyMessage('Текст сообщения', 12345);
$message->send('first_queue');
```

Метод `send()` выбрасывает исключения:

-  `\Bitrix\Main\Config\ConfigurationException` — очередь `$queueId` не описана в конфигурации или в конфигурации проекта есть ошибка. Перед отправкой ядро проверяет все брокеры и все очереди всех установленных модулей, поэтому ошибка в чужом `.settings.php`, например очередь без `handler` или отсутствие брокера `default`, тоже ломает `send()`,
-  `\Bitrix\Main\Messenger\Internals\Exception\Broker\SendFailedException` — брокер не смог сохранить сообщение,
-  `\Bitrix\Main\ArgumentException` — элемент массива `$params` не реализует `ProcessingParamInterface`.

### Отложить обработку сообщения

Параметр `DelayParam` откладывает обработку на заданное число секунд. Значение `0` и меньше обработку не откладывает, поэтому `delayUntil()` с прошедшей датой отправляет сообщение на обработку сразу. Сообщение сохраняется в очереди сразу, но обработчик получит его только после задержки. Объект также можно создать статическими методами `DelayParam::delayFor(\DateInterval $interval)` и `DelayParam::delayUntil(\Bitrix\Main\Type\Date $date)`.

**Пример.** Код откладывает обработку сообщения на один час, то есть 3600 секунд:

```php
use Bitrix\Main\Messenger\Entity\ProcessingParam\DelayParam;
use Vendor\Module\Public\Message\MyMessage;

$message = new MyMessage('Текст сообщения', 12345);
$message->send('first_queue', [new DelayParam(3600)]);
```

### Пометить сообщение идентификатором объекта

Параметр `ItemIdParam` сохраняет вместе с сообщением идентификатор объекта, строку или число длиной до 64 символов. Ядро выводит этот идентификатор в записях лога об ошибках обработки, кроме `UnprocessableMessageException` и `NoLoggableException`. По нему в логе можно найти сообщения конкретного объекта.

**Пример.** Код откладывает обработку на час и отмечает сообщение идентификатором `myid-123`:

```php
use Bitrix\Main\Messenger\Entity\ProcessingParam\DelayParam;
use Bitrix\Main\Messenger\Entity\ProcessingParam\ItemIdParam;
use Vendor\Module\Public\Message\MyMessage;

$message = new MyMessage('Текст сообщения', 12345);
$message->send('first_queue', [new DelayParam(3600), new ItemIdParam('myid-123')]);
```

### Создать свой параметр

Чтобы добавить новый параметр, создайте класс, реализующий интерфейс `\Bitrix\Main\Messenger\Entity\ProcessingParam\ProcessingParamInterface`. Интерфейс требует один метод `applyTo()`. Метод принимает объект `\Bitrix\Main\Messenger\Entity\MessageBox` — обертку сообщения перед сохранением в брокер, меняет ее и возвращает.

**Пример.** Интерфейс `ProcessingParamInterface`:

```php
interface ProcessingParamInterface
{
    public function applyTo(MessageBox $messageBox): MessageBox;
}
```

### Передать в сообщении все данные для отложенной обработки

Обработка сообщения может начаться через секунды или через часы. К этому моменту данные в базе могут измениться или удалиться. Поэтому передавайте в сообщении все данные, которые нужны обработчику, а не только идентификатор объекта.

**Пример.** При удалении задачи с идентификатором `123` нужно уведомить внешний сервис, где задача связана с идентификатором `trk-042`. Если передать только идентификатор задачи, к моменту обработки задача уже будет удалена и внешний идентификатор станет недоступен. Сообщение `TaskDeletedMessage` хранит оба идентификатора:

```php
<?php

namespace Vendor\Module\Public\Message;

use Bitrix\Main\Messenger\Entity\AbstractMessage;

class TaskDeletedMessage extends AbstractMessage
{
    public function __construct(
        public readonly int $taskId,
        public readonly string $externalId,
    )
    {
    }
}
```

**Пример.** Код отправляет сообщение с обоими идентификаторами в очередь `task_deleted_queue`. Очередь описана в `.settings.php` модуля, а ее обработчик принимает сообщения `TaskDeletedMessage`. Обработчик `MyReceiver` из быстрого старта отклонил бы такое сообщение:

```php
use Bitrix\Main\Loader;
use Vendor\Module\Public\Message\TaskDeletedMessage;

Loader::requireModule('vendor.module');

(new TaskDeletedMessage(123, 'trk-042'))->send('task_deleted_queue');
```

## Что дальше

- [Агенты и фоновые задачи](./background-jobs.md) — другие способы выполнять код в фоне.
- [Консольные команды](./console-commands.md) — запуск `messenger:consume` и генерация классов `make:message` и `make:messagehandler`.
- [Конфигурация ядра](./settings.md) — структура файла `.settings.php`.
- [Логгеры](../advanced/logger.md) — настройка логов, в которые пишутся ошибки обработки.
