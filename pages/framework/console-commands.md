---
title: Консольные команды
---

Консольные команды в Bitrix Framework -- это инструмент для выполнения операционных задач, генерации кода и автоматизации процессов разработки через терминал. Реализованы на базе Symfony Console.

## Что такое консольные команды

Консольная команда -- это PHP-скрипт, который выполняется из терминала и может:

-  принимать аргументы и опции от пользователя,

-  выполнять длительные операции без ограничений времени веб-запроса,

-  автоматизировать задачи разработки и администрирования,

-  запускаться по расписанию через cron.

Команды особенно полезны для:

-  управления кешем и индексами,

-  генерации кода (компоненты, контроллеры, ORM-классы),

-  миграции и обслуживания базы данных,

-  интеграции с внешними системами.

## Как работать с командами

Все консольные команды в Bitrix Framework запускаются через файл `bitrix.php`, который находится в директории `bitrix` вашего проекта.

```bash
cd /path/to/document_root/bitrix
php bitrix.php [команда] [аргументы] [опции]
```

{% note info "" %}

Для работы с консольными командами необходимо настроить Composer. Подробнее читайте в статье [Composer](../get-started/composer).

{% endnote %}

### Просмотр доступных команд

Чтобы увидеть список всех зарегистрированных команд, выполните:

```bash
php bitrix.php list
```

Команда выведет список встроенных команд Bitrix и команд из установленных модулей.

### Справка по команде

Для получения подробной информации о конкретной команде используйте:

```bash
php bitrix.php help [имя-команды]
```

Справка покажет описание команды, список доступных аргументов и опций с их описанием.

## Встроенные команды

Bitrix Framework уже включает набор команд для разработки, например:

-  `orm:annotate` -- сканирует проект на наличие ORM-сущностей и генерирует аннотации для улучшения автодополнения в IDE.

-  `make:component` -- создает компонент с базовой структурой.

-  `make:controller` -- генерирует REST-контроллер для API.

-  `make:tablet` -- создает ORM-класс (DataManager) для таблицы базы данных.

{% note tip "" %}

Это неполный список команд. Чтобы увидеть все доступные команды, используйте `php bitrix.php list`.

{% endnote %}

## Создание собственной команды

Консольная команда в Bitrix Framework -- это PHP-класс, который наследуется от `Symfony\Component\Console\Command\Command`.

### Структура команды

Класс команды реализует два основных метода:

-  `configure()` -- определение имени команды, описания и параметров.

-  `execute()` -- логика выполнения команды.

### Пример команды

Рассмотрим команду для пересоздания фасетного индекса инфоблока. Создайте файл в модуле `/local/modules/partner.module/lib/Command/Iblock/FacetIndexRebuildCommand.php`:

```php
<?php

declare(strict_types=1);

namespace Partner\Module\Command\Iblock;

use Bitrix\Iblock\PropertyIndex\Manager;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class FacetIndexRebuildCommand extends Command
{
    protected function configure(): void
    {
        $this
            ->setName('iblock:facet-rebuild')
            ->setDescription('Пересоздание фасетного индекса для инфоблока')
            // Аргумент
            ->addArgument(
                'iblock_id',
                InputArgument::OPTIONAL,
                'ID инфоблока для пересоздания индекса'
            )
            // Опции
            ->addOption(
                'all',
                'a',
                InputOption::VALUE_NONE,
                'Пересоздать индексы для всех инфоблоков'
            )
            ->addOption(
                'force',
                'f',
                InputOption::VALUE_NONE,
                'Пропустить подтверждение'
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        
        // Получение значений аргументов и опций
        $iblockId = $input->getArgument('iblock_id');
        $all = $input->getOption('all');
        $force = $input->getOption('force');
        
        // Валидация: либо ID, либо флаг --all
        if (!$iblockId && !$all) {
            $io->error('Укажите ID инфоблока или используйте опцию --all');
            return self::FAILURE;
        }
        
        if ($iblockId && $all) {
            $io->error('Нельзя использовать ID и --all одновременно');
            return self::FAILURE;
        }
        
        // Запрос подтверждения (если не указан --force)
        if (!$force && !$io->confirm('Продолжить пересоздание индекса?', false)) {
            $io->note('Операция отменена');
            return self::SUCCESS;
        }
        
        try {
            $io->title('Пересоздание фасетного индекса');
            
            if ($all) {
                $io->writeln('Пересоздание индексов для всех инфоблоков...');
                // Логика для всех инфоблоков
                $manager = Manager::getInstance();
                // ... код пересоздания
            } else {
                $io->writeln(sprintf('Пересоздание индекса для инфоблока ID: %d', $iblockId));
                $manager = Manager::getInstance()->delete((int)$iblockId);
                $manager->build((int)$iblockId);
            }
            
            $io->success('Фасетный индекс успешно пересоздан!');
            return self::SUCCESS;
            
        } catch (\Throwable $e) {
            $io->error(sprintf('Ошибка: %s', $e->getMessage()));
            return self::FAILURE;
        }
    }
}
```

### Параметры команды

**Аргументы** (`InputArgument`) -- позиционные параметры команды:

-  `InputArgument::REQUIRED` -- обязательный аргумент,

-  `InputArgument::OPTIONAL` -- необязательный аргумент.

**Опции** (`InputOption`) -- именованные параметры с двойным дефисом:

-  `InputOption::VALUE_NONE` -- флаг без значения (например, `--all`, `--force`),

-  `InputOption::VALUE_REQUIRED` -- опция с обязательным значением (например, `--name=value`),

-  `InputOption::VALUE_OPTIONAL` -- опция с необязательным значением,

-  Второй параметр -- короткий вариант (например, `-a` для `--all`).

**Получение значений:**

-  `$input->getArgument('имя')` -- получить значение аргумента,

-  `$input->getOption('имя')` -- получить значение опции.

### Форматированный вывод

Класс `SymfonyStyle` предоставляет методы для красивого вывода информации:

-  `$io->title()` -- заголовок,

-  `$io->success()` -- сообщение об успехе,

-  `$io->error()` -- сообщение об ошибке,

-  `$io->note()` -- информационное сообщение,

-  `$io->confirm()` -- запрос подтверждения у пользователя,

-  `$io->ask()` -- запрос ввода данных.

### Примеры использования

```bash
# Пересоздать индекс для инфоблока с ID 5
php bitrix.php iblock:facet-rebuild 5

# Пересоздать индексы для всех инфоблоков
php bitrix.php iblock:facet-rebuild --all

# Пересоздать без запроса подтверждения (для автоматизации)
php bitrix.php iblock:facet-rebuild 5 --force

# Использование коротких опций
php bitrix.php iblock:facet-rebuild --all -f
```

## Регистрация команды

Создания класса команды недостаточно. Команду необходимо зарегистрировать в файле `.settings.php` в корне вашего модуля.

{% note warning "" %}

Без регистрации в `.settings.php` команда не появится в списке доступных команд при выполнении `php bitrix.php list`.

{% endnote %}

### Файл .settings.php

Создайте или дополните файл `/local/modules/partner.module/.settings.php`:

```php
<?php

return [
    'console' => [
        'value' => [
            'commands' => [
                // Регистрация команды
                \Partner\Module\Command\Iblock\FacetIndexRebuildCommand::class,
                // Можно зарегистрировать несколько команд
                \Partner\Module\Command\Cache\CacheClearCommand::class,
            ],
        ],
        'readonly' => true,
    ],
];
```

После регистрации команда станет доступна через `php bitrix.php list`.

## Размещение файлов

Структура модуля с командами должна выглядеть следующим образом:

```
/local/modules/partner.module/
├── .settings.php          # Регистрация команд
├── install/
│   └── index.php
└── lib/
    └── Command/
        └── Iblock/
            └── FacetIndexRebuildCommand.php
```

{% note tip "" %}

Организуйте команды по папкам в соответствии с их назначением: `/Command/Cache/`, `/Command/Iblock/`, `/Command/Search/` и так далее.

{% endnote %}

## Использование в автоматизации

Команды можно запускать по расписанию через cron. Это полезно для регулярного обслуживания системы.

### Пример настройки cron

```bash
# Очистка кеша каждый день в 3:00
0 3 * * * cd /path/to/document_root/bitrix && php bitrix.php cache:clear --force

# Пересоздание поискового индекса каждую неделю
0 4 * * 0 cd /path/to/document_root/bitrix && php bitrix.php search:reindex --all
```

{% note info "" %}

При использовании команд в cron всегда указывайте опцию `--force` или аналогичную, чтобы пропустить интерактивные запросы подтверждения.

{% endnote %}

