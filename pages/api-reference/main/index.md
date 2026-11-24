---
title: Главный модуль main
description: Классы главного модуля Bitrix Framework, сгруппированные по подсистемам.
---

## Классы

| Класс | Пространство имен | Назначение |
| --- | --- | --- |
| [Application](application/index.md) | `Bitrix\Main` | Дает доступ к контексту запроса, базе данных, кешу, сессиям и фоновым задачам |
| [Error](error/index.md) | `Bitrix\Main` | Хранит сообщение, код и дополнительные данные ошибки |
| [ErrorCollection](error-collection/index.md) | `Bitrix\Main` | Хранит список ошибок и ищет ошибку по коду |
| [EventManager](event-manager/index.md) | `Bitrix\Main` | Добавляет и регистрирует обработчики событий и отправляет события |
| [ModuleManager](module-manager/index.md) | `Bitrix\Main` | Проверяет, установлен ли модуль, возвращает версии, регистрирует модули и удаляет их регистрацию |
| [Result](result/index.md) | `Bitrix\Main` | Хранит признак успеха, ошибки и данные результата операции |
| [EventResult](event-result/index.md) | `Bitrix\Main` | Хранит тип результата и данные обработчика события |
| [UserTable](user-table/index.md) | `Bitrix\Main` | Читает данные пользователей через ORM и обновляет поисковый индекс пользователей |
| [HttpResponse](http-response/index.md) | `Bitrix\Main` | Хранит статус, заголовки, cookie и тело HTTP-ответа и отправляет их клиенту |
| [Context](context/index.md) | `Bitrix\Main` | Хранит запрос, ответ, сервер, сайт, язык и региональные настройки текущего запроса |
| [Event](event/index.md) | `Bitrix\Main` | Создает событие модуля, отправляет его обработчикам и собирает результаты |
| [Loader](loader/index.md) | `Bitrix\Main` | Подключает модули и регистрирует пространства имен и классы для автозагрузки |
| [Configuration](config/configuration/index.md) | `Bitrix\Main\Config` | Читает и меняет секции конфигурационных PHP-файлов |
| [Option](config/option/index.md) | `Bitrix\Main\Config` | Читает и меняет параметры модулей в базе данных |
| [Cache](data/cache/index.md) | `Bitrix\Main\Data` | Кеширует данные и HTML-вывод в файлах, Redis или Memcache |
| [SessionLocalStorage](data/local-storage/session-local-storage/index.md) | `Bitrix\Main\Data\LocalStorage` | Хранит данные текущей сессии под отдельным именем и работает как массив |
| [Connection](db/connection/index.md) | `Bitrix\Main\DB` | Выполняет SQL-запросы, управляет транзакциями и структурой таблиц |
| [MysqliConnection](db/mysqli-connection/index.md) | `Bitrix\Main\DB` | Реализует соединение с MySQL через расширение `mysqli` |
| [PgsqlConnection](db/pgsql-connection/index.md) | `Bitrix\Main\DB` | Реализует соединение с PostgreSQL |
| [Result](db/result/index.md) | `Bitrix\Main\DB` | Читает строки результата запроса и преобразует значения |
| [MysqliResult](db/mysqli-result/index.md) | `Bitrix\Main\DB` | Реализует результат запроса MySQL |
| [PgsqlResult](db/pgsql-result/index.md) | `Bitrix\Main\DB` | Реализует результат запроса PostgreSQL |
| [SqlHelper](db/sql-helper/index.md) | `Bitrix\Main\DB` | Экранирует значения и имена, строит SQL под тип базы данных |
| [MysqliSqlHelper](db/mysqli-sql-helper/index.md) | `Bitrix\Main\DB` | Реализует экранирование и SQL-выражения для MySQL |
| [PgsqlSqlHelper](db/pgsql-sql-helper/index.md) | `Bitrix\Main\DB` | Реализует экранирование и SQL-выражения для PostgreSQL |
| [SqlExpression](db/sql-expression/index.md) | `Bitrix\Main\DB` | Подставляет произвольное SQL-выражение в запрос с экранированием значений |
| [ServiceLocator](di/service-locator/index.md) | `Bitrix\Main\DI` | Регистрирует сервисы и создает их объекты с подстановкой зависимостей |
| [Base](engine/action-filter/base/index.md) | `Bitrix\Main\Engine\ActionFilter` | Задает общие методы фильтров, которые выполняются до и после действия контроллера |
| [Csrf](engine/action-filter/csrf/index.md) | `Bitrix\Main\Engine\ActionFilter` | Проверяет CSRF-токен перед AJAX-действием контроллера |
| [Controllerable](engine/contract/controllerable/index.md) | `Bitrix\Main\Engine\Contract` | Описывает класс с AJAX-действиями и настройками фильтров |
| [CurrentUser](engine/current-user/index.md) | `Bitrix\Main\Engine` | Возвращает данные, группы и права текущего пользователя |
| [Action](engine/action/index.md) | `Bitrix\Main\Engine` | Подбирает аргументы и выполняет метод `run` действия контроллера, служит базовым классом действий |
| [Controller](engine/controller/index.md) | `Bitrix\Main\Engine` | Выполняет действие AJAX-контроллера с фильтрами, событиями и подбором аргументов, служит базовым классом контроллеров |
| [Action](grid/action/action/index.md) | `Bitrix\Main\Grid\Action` | Описывает действие самого грида и обработку запроса к нему |
| [Action](grid/panel/action/action/index.md) | `Bitrix\Main\Grid\Panel\Action` | Описывает действие панели грида для выбранных строк |
| [Action](grid/row/action/action/index.md) | `Bitrix\Main\Grid\Row\Action` | Описывает действие из контекстного меню строки грида |
| [Options](grid/options/index.md) | `Bitrix\Main\Grid` | Читает и сохраняет пользовательские настройки грида — колонки, сортировку и размер страницы |
| [File](io/file/index.md) | `Bitrix\Main\IO` | Читает, записывает и удаляет файл, открывает его для потоковой работы |
| [Path](io/path/index.md) | `Bitrix\Main\IO` | Нормализует и объединяет пути, проверяет имена файлов и переводит пути в URI |
| [Loc](localization/loc/index.md) | `Bitrix\Main\Localization` | Загружает фразы языковых файлов и возвращает фразы по коду |
| [LocalizableMessageInterface](localization/localizable-message-interface/index.md) | `Bitrix\Main\Localization` | Описывает сообщение, которое возвращает текст на заданном языке |
| [DataManager](orm/data/data-manager/index.md) | `Bitrix\Main\ORM\Data` | Описывает таблицу и поля ORM, выбирает, добавляет, изменяет и удаляет записи, служит базовым классом таблиц |
| [Entity](orm/entity/index.md) | `Bitrix\Main\ORM` | Описывает сущность ORM — таблицу, поля, первичный ключ, классы объекта и коллекции |
| [Event](orm/event/index.md) | `Bitrix\Main\ORM` | Передает обработчикам событие ORM и собирает ошибки и изменения полей |
| [DatetimeField](orm/fields/datetime-field/index.md) | `Bitrix\Main\ORM\Fields` | Описывает поле с датой и временем и настраивает часовой пояс |
| [ExpressionField](orm/fields/expression-field/index.md) | `Bitrix\Main\ORM\Fields` | Описывает поле, значение которого вычисляет SQL-выражение над другими полями |
| [Reference](orm/fields/relations/reference/index.md) | `Bitrix\Main\ORM\Fields\Relations` | Описывает связь с записью другой ORM-сущности |
| [LengthValidator](orm/fields/validators/length-validator/index.md) | `Bitrix\Main\ORM\Fields\Validators` | Проверяет длину значения поля |
| [ConditionTree](orm/query/filter/condition-tree/index.md) | `Bitrix\Main\ORM\Query\Filter` | Хранит условия фильтра ORM, объединяет их через AND или OR и строит SQL |
| [Query](orm/query/query/index.md) | `Bitrix\Main\ORM\Query` | Строит и выполняет запрос к сущности ORM — выборку, фильтр, группировку, сортировку и объединение |
| [Join](orm/query/join/index.md) | `Bitrix\Main\ORM\Query` | Строит условие связи и хранит типы SQL-соединения |
| [Result](orm/query/result/index.md) | `Bitrix\Main\ORM\Query` | Читает строки ORM-выборки массивами, объектами и коллекциями |
| [Asset](page/asset/index.md) | `Bitrix\Main\Page` | Подключает CSS- и JS-файлы и строки на страницу и объединяет их в наборы |
| [Router](routing/router/index.md) | `Bitrix\Main\Routing` | Находит маршрут для запроса и строит URL по имени маршрута |
| [Route](routing/route/index.md) | `Bitrix\Main\Routing` | Хранит шаблон URL, обработчик и настройки маршрута, возвращает значения параметров из пути запроса |
| [Options](routing/options/index.md) | `Bitrix\Main\Routing` | Хранит HTTP-методы, префикс, имя и настройки параметров маршрута |
| [Random](security/random/index.md) | `Bitrix\Main\Security` | Генерирует случайные числа, строки и байты |
| [SessionInterface](session/session-interface/index.md) | `Bitrix\Main\Session` | Описывает сессию пользователя — запуск, сохранение, идентификатор, значения по ключу |
| [Emoji](text/emoji/index.md) | `Bitrix\Main\Text` | Заменяет эмодзи текстовыми кодами для хранения и восстанавливает их |
| [Encoding](text/encoding/index.md) | `Bitrix\Main\Text` | Переводит строки и массивы из одной кодировки в другую |
| [HtmlFilter](text/html-filter/index.md) | `Bitrix\Main\Text` | Экранирует специальные символы HTML |
| [Collection](type/collection/index.md) | `Bitrix\Main\Type` | Сортирует массивы по колонкам и работает со значениями по вложенному ключу |
| [Date](type/date/index.md) | `Bitrix\Main\Type` | Хранит дату без времени, разбирает и форматирует ее по региональным настройкам |
| [DateTime](type/date-time/index.md) | `Bitrix\Main\Type` | Хранит дату со временем и часовым поясом, переводит время сервера во время пользователя |
| [Extension](ui/extension/index.md) | `Bitrix\Main\UI` | Подключает JS-расширения и возвращает их конфигурацию и зависимости |
| [PageNavigation](ui/page-navigation/index.md) | `Bitrix\Main\UI` | Читает номер и размер страницы из адреса, рассчитывает смещение и лимит выборки |
| [Options](ui/filter/options/index.md) | `Bitrix\Main\UI\Filter` | Читает значения фильтра `main.ui.filter`, хранит пресеты и сохраняет настройки фильтра |
| [Router](url-preview/router/index.md) | `Bitrix\Main\UrlPreview` | Регистрирует обработчики предпросмотра внутренних ссылок и находит обработчик по адресу |
| [HttpClient](web/http-client/index.md) | `Bitrix\Main\Web` | Отправляет HTTP-запросы к внешним сервисам, скачивает файлы, поддерживает PSR-18 и асинхронные запросы |
| [HttpCookies](web/http-cookies/index.md) | `Bitrix\Main\Web` | Хранит cookie HTTP-клиента, разбирает заголовки `Set-Cookie` и собирает заголовок `Cookie` |
| [HttpHeaders](web/http-headers/index.md) | `Bitrix\Main\Web` | Хранит HTTP-заголовки и статус, разбирает `Content-Type`, `Content-Disposition` и `Set-Cookie` |
| [Etag](web/http/etag/index.md) | `Bitrix\Main\Web\Http` | Заключает тег сущности в кавычки для заголовка `ETag` и сравнивает его с заголовком `If-None-Match` |
| [Json](web/json/index.md) | `Bitrix\Main\Web` | Кодирует, разбирает и проверяет JSON |
| [Uri](web/uri/index.md) | `Bitrix\Main\Web` | Разбирает адрес на части, меняет параметры запроса, хост и путь и собирает адрес обратно |

## Смотрите также

- [Справочник API](../index.md)
- [Конфигурация ядра](../../framework/settings.md)
