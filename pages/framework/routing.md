---
title: Роутинг
---

Роутинг связывает URL-адреса с обработчиками -- функциями или контроллерами. В Bitrix Framework он управляет маршрутизацией запросов, что позволяет создавать гибкие и масштабируемые приложения.

{% note info "" %}

Главный модуль main поддерживает роутинг с версии 21.400.0.

{% endnote %}

## Как включить роутинг

Чтобы включить роутинг, перенаправьте обработку несуществующих файлов на `routing_index.php`.

Для Apache измените файл `.htaccess` в корне сайта.

```apache
# закомментированные строки — старая конфигурация через urlrewrite.php
#RewriteCond %{REQUEST_FILENAME} !/bitrix/urlrewrite.php$
#RewriteRule ^(.*)$ /bitrix/urlrewrite.php [L]

# новые правила для роутинга
RewriteCond %{REQUEST_FILENAME} !/bitrix/routing_index.php$
RewriteRule ^(.*)$ /bitrix/routing_index.php [L]
```

Для Nginx измените конфигурацию. В секции обработки php добавьте строку:

```nginx
try_files $uri $uri/ /bitrix/routing_index.php;
```

{% note info "" %}

В [Docker-окружении](./../get-started/install-env#docker-образы) роутинг включен по умолчанию.

{% endnote %}

## Конфигурация

Чтобы система начала обрабатывать маршруты, добавьте секцию `routing` в файл конфигурации [/bitrix/.settings.php](./settings).

```php
'routing' => [
    'value' => [
        'config' => ['web.php'], // Можно добавить другие файлы: 'api.php', 'admin.php'
    ],
        'readonly' => true, // Защищает настройки от изменений
],
```

При такой конфигурации система будет искать маршруты в файлах в следующем порядке:

-  `/local/routes/web.php`,

-  `/bitrix/routes/web.php`

Если есть оба файла, система подключит каждый из них.

{% note warning "" %}

Размещайте свои маршруты только в директории `/local/routes/`. Маршруты `/bitrix/routes/` зарезервированы для системы.

{% endnote %}

Создайте файл `/local/routes/web.php` с маршрутами, например:

```php
<?php

use Bitrix\Main\Routing\RoutingConfigurator;

return static function (RoutingConfigurator $routes) {

    $routes->any('/blog', static fn() => 'my blog'); // использует замыкание

};
```

При переходе по URL `/blog` вы увидите сообщение `my blog`.

## Типы обработчиков маршрутов

В качестве обработчика маршрута можно использовать разные подходы.

1. Замыкание -- анонимная функция.

   ```php
   $routes->any('/blog', static fn() => 'my blog');
   ```

2. Контроллер -- класс, который обрабатывает запросы.

   ```php
   $routes->any('/blog', [BlogController::class, 'index']);
   ```

   Метод контроллера может выглядеть так:

   ```php
   class BlogController extends \Bitrix\Main\Engine\Controller
   {
       public function indexAction()
       {
           // ...
       }
   }
   ```

3. Отдельное действие контроллера -- класс, который реализует конкретное действие.

   ```php
   $routes->any('/blog', BlogIndexAction::class);
   ```

   В этом случае класс-действия должен реализовывать интерфейс `\Bitrix\Main\Engine\Contract\RoutableAction`.

   ```php
   class BlogController extends \Bitrix\Main\Engine\Controller
   {
       public function configureActions()
       {
           return [
               'index' => [
                   'class' => BlogIndexAction::class,
                   'prefilters' => [],
               ],
           ];
       }
   }
   
   class BlogIndexAction extends \Bitrix\Main\Engine\Action implements \Bitrix\Main\Engine\Contract\RoutableAction
   {
       public static function getControllerClass()
       {
           return BlogController::class;
       }
   
       public static function getDefaultName()
       {
           return 'view';
       }
   
       public function run()
       {
           // ...
       }
   }
   ```

4. Статический файл -- физический файл для подключения.

   ```php
   $routes->any('/blog', new \Bitrix\Main\Routing\Controllers\PublicPageController('/blog/index.php'));
   ```

   {% note warning "" %}

   Используйте `PublicPageController` только для миграции со старого движка маршрутизации [urlrewrite.php](./routing#%D1%81%D1%82%D0%B0%D1%80%D1%8B%D0%B9-%D0%B4%D0%B2%D0%B8%D0%B6%D0%BE%D0%BA-%D0%BC%D0%B0%D1%80%D1%88%D1%80%D1%83%D1%82%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8-%D1%81-%D0%BF%D0%BE%D0%BC%D0%BE%D1%89%D1%8C%D1%8E-urlrewrite.php). В остальных случаях применяйте контроллеры.

   {% endnote %}

## HTTP-методы

Метод `$routes->any()` означает, что любой HTTP-метод будет обрабатывать маршрут. При необходимости укажите конкретный метод.

```php
$routes->post('/blog/post/', [PostController::class, 'create']);
$routes->get('/blog/post/{code}', [PostController::class, 'view']);
$routes->put('/blog/post/{code}', [PostController::class, 'update']);
$routes->patch('/blog/post/{code}', [PostController::class, 'update']);
$routes->delete('/blog/post/{code}', [PostController::class, 'delete']);

$routes->head('/blog/post/{code}', static fn() => 'health check');
$routes->options('/blog/post/{code}', [PostController::class, 'options']);
```

В этом примере шесть правил используют один маршрут `/blog/post/{code}`, но обработчик зависит от HTTP-метода запроса.

{% note info "" %}

При использовании `$routes->get` система добавляет обработчик для HTTP-методов `GET` и `HEAD`.

{% endnote %}

Для группировки методов используйте конструкцию `methods`.

```php
$routes
    ->any('/blog/post', [PostController::class, 'update'])
    ->methods(['PUT', 'PATCH']);
```

## Параметры маршрута

Параметры маршрута -- это динамические части URL, которые принимают различные значения. Заключайте параметры в фигурные скобки `{}`, например, `/blog/post/{code}`.

```php
$routes->get('/blog/post/{code}', static function(string $code) {
    return 'Post for code ' . $code;
});
```

При переходе по адресу `/blog/post/my-first-article` в переменной `$code` будет строка `my-first-article`.

В контроллерах параметры передаются в соответствующий метод.

```php
class PostController extends \Bitrix\Main\Engine\Controller
{
    public function viewAction(string $code)
    {
        return 'Post with code ' . $code;
    }
}
```

В отдельных экшенах контроллеров параметры передаются в метод `run`.

```php
class PostViewAction extends \Bitrix\Main\Engine\Action implements \Bitrix\Main\Engine\Contract\RoutableAction
{
    public function run(string $code)
    {
        return 'Post with code ' . $code;
    }
}
```

При использовании `PublicPageController` параметры добавляются в глобальные переменные `$_GET` и `$_REQUEST`.

Доступ к значениям параметров также можно получить через объект текущего маршрута.

```php
$app = \Bitrix\Main\Application::getInstance();
if ($app->hasCurrentRoute())
{
    $code = $app->getCurrentRoute()->getParameterValue('code');
}
```

{% note warning "" %}

Такой подход к получению параметров не рекомендуется. Параметры запроса должны обрабатываться только в контроллерах и обработчиках маршрутов.

{% endnote %}

### Паттерны для параметров

По умолчанию параметры используют паттерн `[^/]+`. Шаблон `/blog/post/{code}` преобразуется в строку с регулярным выражением `/blog/post/(?<code>[^/]+)`.

Если нужно свое регулярное выражение, укажите его методом `where`.

```php
$routes
    ->get('/blog/post/{code}', [PostController::class, 'view'])
    ->where('code', '[\w\d\-]+');
```

Теперь маршрут будет сопоставляться по регулярному выражению `/blog/post/(?<code>[\w\d\-]+)`.

### Значения по умолчанию

Параметры могут иметь значения по умолчанию. Это нужно для параметров, которые не всегда присутствуют в URL.

```php
$routes
    ->get('/blog/post/{code}/translate/{lang}', [PostController::class, 'translate'])
    ->default('lang', 'en');
```

-  При переходе на `/blog/post/my-first-article/translate/` параметр `lang` получит значение `en`.

-  При переходе на `/blog/post/my-first-article/translate/de` параметр `lang` будет `de`.

Также можно задать параметры, которые не участвуют в формировании адреса, но доступны в обработчике.

```php
$routes
    ->get('/blog/post/{code}', static function(string $code, string $lang) {
        // ...
    })
    ->default('lang', 'en');
```

### Именованные маршруты

Присвоение имен маршрутам помогает организовать и систематизировать их. Имена выступают в роли уникальных идентификаторов. Их можно использовать для генерации ссылок и упрощения навигации.

Чтобы задать имя маршруту, используйте метод `name`.

```php
$routes
    ->get('/blog/post/{code}', [PostController::class, 'view'])
    ->name('blog.post.view');
```

### Группировка маршрутов

Группы маршрутов объединяют несколько маршрутов с общими характеристиками. Это помогает избежать дублирования кода. Общие настройки можно изменить в одном месте.

В случае с блогом у нас есть маршруты без группировки.

```php
$routes->get('/blog/', [BlogController::class, 'index']);
$routes->post('/blog/post/', [PostController::class, 'create']);
$routes->get('/blog/post/{code}', [PostController::class, 'view']);
$routes->put('/blog/post/{code}', [PostController::class, 'update']);
$routes->patch('/blog/post/{code}', [PostController::class, 'update']);
$routes->delete('/blog/post/{code}', [PostController::class, 'delete']);
```

При использовании группировки маршруты могут выглядеть так:

```php
$routes
    ->group(function(RoutingConfigurator $routes) {
        $routes->get('/blog/', [BlogController::class, 'index']);

        // допустима вложенная группировка
        $routes->group(function(RoutingConfigurator $routes) {
            $routes->post('/blog/post/', [PostController::class, 'create']);
            $routes->get('/blog/post/{code}', [PostController::class, 'view']);
            $routes->put('/blog/post/{code}', [PostController::class, 'update']);
            $routes->patch('/blog/post/{code}', [PostController::class, 'update']);
            $routes->delete('/blog/post/{code}', [PostController::class, 'delete']);
        });
    });
```

С точки зрения логики ничего не изменилось, но теперь можно выносить на уровень группы общие элементы: префиксы, параметры и имена.

#### Префикс группы

Для уменьшения шаблонов URL добавляйте префиксы методом `prefix`.

```php
$routes
    ->prefix('blog')
    ->group(static function(RoutingConfigurator $routes) {
        $routes->get('', [BlogController::class, 'index']); // будет /blog/

        $routes
            ->prefix('post')
            ->group(static function(RoutingConfigurator $routes) {
                $routes->post('', [PostController::class, 'create']); // будет /blog/post/
                $routes->get('{code}', [PostController::class, 'view']);
                $routes->put('{code}', [PostController::class, 'update']);
                $routes->patch('{code}', [PostController::class, 'update']);
                $routes->delete('{code}', [PostController::class, 'delete']);
            })
        ;
    });
```

Указывайте префиксы без ведущих и конечных слешей `/`. Система добавит их автоматически. Корневые маршруты внутри группы указывайте пустой строкой: `$routes->get('', ...)`

#### Параметры группы

Выносите однотипные параметры на уровень группы методом `where`.

-  Без группировки.

```php
$routes->post('/blog/post/', [PostController::class, 'create'])->where('code', '[\w+\d+\-]');
$routes->get('/blog/post/{code}', [PostController::class, 'view'])->where('code', '[\w+\d+\-]');
$routes->put('/blog/post/{code}', [PostController::class, 'update'])->where('code', '[\w+\d+\-]');
$routes->patch('/blog/post/{code}', [PostController::class, 'update'])->where('code', '[\w+\d+\-]');
$routes->delete('/blog/post/{code}', [PostController::class, 'delete'])->where('code', '[\w+\d+\-]');
```

-  С группировкой.

```php
$routes
    ->where('code', '[\w+\d+\-]+')
    ->group(static function (RoutingConfigurator $routes) {
        $routes->post('/blog/post/', [PostController::class, 'create']);
        $routes->get('/blog/post/{code}', [PostController::class, 'view']);
        $routes->put('/blog/post/{code}', [PostController::class, 'update']);
        $routes->patch('/blog/post/{code}', [PostController::class, 'update']);
        $routes->delete('/blog/post/{code}', [PostController::class, 'delete']);
    });
```

#### Имена группы

Имена маршрутов формируются иерархично, аналогично префиксам. Чтобы задать имя, используйте метод `name`.

-  Без группировки.

```php
$routes
    ->group(function(RoutingConfigurator $routes) {
        $routes->get('/blog/', [BlogController::class, 'index'])->name('blog.index');

        $routes->group(function(RoutingConfigurator $routes) {
            $routes->post('/blog/post/', [PostController::class, 'create'])->name('blog.post.create');
            $routes->get('/blog/post/{code}', [PostController::class, 'view'])->name('blog.post.view');
            $routes->put('/blog/post/{code}', [PostController::class, 'update'])->name('blog.post.update');
            $routes->patch('/blog/post/{code}', [PostController::class, 'update'])->name('blog.post.update');
            $routes->delete('/blog/post/{code}', [PostController::class, 'delete'])->name('blog.post.delete');
        });
    });
```

-  С группировкой.

```php
$routes
    ->name('blog.')
    ->group(function(RoutingConfigurator $routes) {
        $routes->get('/blog/', [BlogController::class, 'index'])->name('index');

        $routes
            ->name('post.')
            ->group(function(RoutingConfigurator $routes) {
                $routes->post('/blog/post/', [PostController::class, 'create'])->name('create');
                $routes->get('/blog/post/{code}', [PostController::class, 'view'])->name('view');
                $routes->put('/blog/post/{code}', [PostController::class, 'update'])->name('update');
                $routes->patch('/blog/post/{code}', [PostController::class, 'update'])->name('update');
                $routes->delete('/blog/post/{code}', [PostController::class, 'delete'])->name('delete');
            })
        ;
    });
```

{% note info "" %}

Имена маршрутов конкатенируются без добавления разделителя. Указывайте разделитель в конце имени группы, например, точку `.`

{% endnote %}

## Генерация URL

Используйте объект роутера для создания ссылок по именам маршрутов.

{% note info "" %}

Генерация URL работает только для именованных маршрутов -- при формировании ссылки нужно указать имя маршрута.

{% endnote %}

Пример формирования URL для маршрута:

```php
$url = \Bitrix\Main\Application::getInstance()->getRouter()->route(
    'blog.post.view', // имя маршрута
    [
        // параметры для подстановки
        'code' => 'my-first-article',
    ]
);
```

Переменная `$url` будет содержать `/blog/post/my-first-article`.

Дополнительные параметры, которые не входят в маршрут, можно добавить в строку запроса.

```php
$url = \Bitrix\Main\Application::getInstance()->getRouter()->route('blog.post.view', [
    'code' => 'my-first-article',
    'utm_source' => 'ads123',
]);
```

Результат: `/blog/post/my-first-article?utm_source=ads123`.

Генерация URL дает возможность менять маршрут без переписывания логики приложения. Например, если изменить конфигурацию маршрута:

```php
$routes
    ->get('/blog/post-{code}/', [PostController::class, 'view'])
    ->name('blog.post.view');
```

Тот же код генерации будет создавать новый URL автоматически.

```php
$url = \Bitrix\Main\Application::getInstance()->getRouter()->route('blog.post.view', [
    'code' => 'my-first-article',
]);
```

Переменная `$url` будет содержать `/blog/post-my-first-article/`.

## Миграция с устаревшего urlrewrite.php

До появления роутинга в Bitrix Franework использовался файл `urlrewrite.php` для маршрутизации запросов до исполняемых файлов.

{% note warning "В новых проектах используйте роутинг" %}

Старые проекты могут продолжать использовать `urlrewrite.php`, но рекомендуется мигрировать на роутинг.

{% endnote %}

### Пример миграции

Старое правило в `urlrewrite.php`.

```php
array(
    "CONDITION" => "#^/blog/(\d+)/(\d+)/#",
    "RULE" => "SECTION_ID=$1&ELEMENT_ID=$2",
    "PATH" => "/blog/detail.php",
)
```

Его эквивалент в роутинге.

```php
$routes
    ->any('/blog/{SECTION_ID}/{ELEMENT_ID}/', new PublicPageController('/blog/detail.php'))
    ->where('SECTION_ID', '\d+')
    ->where('ELEMENT_ID', '\d+');
```

Контроллер `Bitrix\Main\Routing\Controllers\PublicPageController` подключит нужный физический файл. Но лучше перевести работу на контроллеры.

```php
$routes
    ->any('/blog/{sectionId}/{elementId}/', [BlogController::class, 'detail'])
    ->where('sectionId', '\d+')
    ->where('elementId', '\d+');
```

## Частые ошибки и решения

1. **Ошибка 404 после настройки роутинга**. Убедитесь, что изменения в `.htaccess` применены правильно и файл `routing_index.php` доступен.

2. **Некорректная работа параметров маршрута**. Проверьте, что паттерны в методе `where` соответствуют ожидаемым значениям.

3. **Проблемы с генерацией ссылок**. Убедитесь, что маршруты имеют уникальные имена и используются правильно при генерации ссылок.