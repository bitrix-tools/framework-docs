---
title: Роутинг
description: 'Роутинг. Документация по Bitrix Framework: принципы работы, архитектура и примеры использования.'
---

Роутинг связывает URL-адреса с обработчиками — функциями или контроллерами. В Bitrix Framework он управляет маршрутизацией запросов, что позволяет создавать гибкие и масштабируемые приложения.

{% note info "" %}

Главный модуль main поддерживает роутинг с версии 21.400.0.

{% endnote %}

## Как включить роутинг {#enable-routing}

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

В [Docker-окружении](./../get-started/install-env#docker-images) роутинг включен по умолчанию.

{% endnote %}

## Конфигурация {#configuration}

Чтобы система начала обрабатывать маршруты, добавьте секцию `routing` в файл конфигурации [/bitrix/.settings.php](./settings).

```php
'routing' => [
    'value' => [
        'config' => ['web.php'], // Можно добавить другие файлы: 'api.php', 'admin.php'
    ],
    'readonly' => true, // Защищает настройки от изменений
],
```

{% note info "" %}

С версии 24.100.0 главного модуля можно не изменять `/bitrix/.settings.php`: добавьте секцию `routing` в файл `/local/.settings_extra.php`. Система загружает дополнительный файл после основного и целиком заменяет одноименные секции. Файл `/local/.settings.php` не дополняет `/bitrix/.settings.php`, а используется вместо него, поэтому должен содержать полную обязательную конфигурацию, включая секцию `connections`.

{% endnote %}

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

## Типы обработчиков маршрутов {#route-handlers}

В качестве обработчика маршрута можно использовать разные подходы.

1. Замыкание — анонимная функция.

   ```php
   $routes->any('/blog', static fn() => 'my blog');
   ```

2. Контроллер — класс, который обрабатывает запросы.

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

3. Отдельное действие контроллера — класс, который реализует конкретное действие.

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

4. Статический файл — физический файл для подключения.

   ```php
   $routes->any('/blog', new \Bitrix\Main\Routing\Controllers\PublicPageController('/blog/index.php'));
   ```

   {% note warning "" %}

   Используйте `PublicPageController` только для миграции со старого движка маршрутизации [urlrewrite.php](./routing#urlrewrite-migration). В остальных случаях применяйте контроллеры. Как перенести существующую страницу на контроллер, описано в разделе [Публичные страницы на контроллерах](./routing#controller-public-pages).

   {% endnote %}

## HTTP-методы {#http-methods}

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
    ->methods(['PUT', 'PATCH'])
;
```

## Параметры маршрута {#route-parameters}

Параметры маршрута — это динамические части URL, которые принимают различные значения. Заключайте параметры в фигурные скобки `{}`, например, `/blog/post/{code}`.

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

### Паттерны для параметров {#parameter-patterns}

По умолчанию параметры используют паттерн `[^/]+`. Шаблон `/blog/post/{code}` преобразуется в строку с регулярным выражением `/blog/post/(?<code>[^/]+)`.

Если нужно свое регулярное выражение, укажите его методом `where`.

```php
$routes
    ->get('/blog/post/{code}', [PostController::class, 'view'])
    ->where('code', '[\w\d\-]+')
;
```

Теперь маршрут будет сопоставляться по регулярному выражению `/blog/post/(?<code>[\w\d\-]+)`.

### Значения по умолчанию {#default-values}

Параметры могут иметь значения по умолчанию. Это нужно для параметров, которые не всегда присутствуют в URL.

```php
$routes
    ->get('/blog/post/{code}/translate/{lang}', [PostController::class, 'translate'])
    ->default('lang', 'en')
;
```

-  При переходе на `/blog/post/my-first-article/translate/` параметр `lang` получит значение `en`.

-  При переходе на `/blog/post/my-first-article/translate/de` параметр `lang` будет `de`.

Также можно задать параметры, которые не участвуют в формировании адреса, но доступны в обработчике.

```php
$routes
    ->get('/blog/post/{code}', static function(string $code, string $lang) {
        // ...
    })
    ->default('lang', 'en')
    ;
```

### Именованные маршруты {#named-routes}

Присвоение имен маршрутам помогает организовать и систематизировать их. Имена выступают в роли уникальных идентификаторов. Их можно использовать для генерации ссылок и упрощения навигации.

Чтобы задать имя маршруту, используйте метод `name`.

```php
$routes
    ->get('/blog/post/{code}', [PostController::class, 'view'])
    ->name('blog.post.view')
;
```

### Группировка маршрутов {#route-groups}

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

#### Префикс группы {#group-prefix}

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

#### Параметры группы {#group-parameters}

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

#### Имена группы {#group-names}

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

## Генерация URL {#url-generation}

Используйте объект роутера для создания ссылок по именам маршрутов.

{% note info "" %}

Генерация URL работает только для именованных маршрутов — при формировании ссылки нужно указать имя маршрута.

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
    ->name('blog.post.view')
;
```

Тот же код генерации будет создавать новый URL автоматически.

```php
$url = \Bitrix\Main\Application::getInstance()->getRouter()->route('blog.post.view', [
    'code' => 'my-first-article',
]);
```

Переменная `$url` будет содержать `/blog/post-my-first-article/`.

## Публичные страницы на контроллерах {#controller-public-pages}

Маршрут передает обработку публичной страницы действию контроллера. Контроллер возвращает представление модуля с версткой и вызовами компонентов. Отдельный файл страницы в публичной части не нужен.

Ответ формируют методы рендеринга, описанные в статье [Контроллеры](./controllers#rendering):

-  `renderView()` возвращает [HTML из файла представления](./controllers#render-view),

-  `renderComponent()` возвращает [результат работы одного компонента](./controllers#render-component),

-  `renderExtension()` возвращает [страницу с подключенным JS-расширением](./controllers#render-extension).

{% note info "" %}

Рендеринг из контроллеров доступен с версии 25.700.0 главного модуля.

{% endnote %}

### Как перенести страницу на контроллер {#migrate-page-to-controller}

Исходная страница `/blog/index.php` содержит верстку и компонент.

```php
<?php

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/header.php';

$APPLICATION->SetTitle('Блог');
?>
<h1>Блог</h1>
<?php
$APPLICATION->IncludeComponent('bitrix:news.list', '', [
    'IBLOCK_ID' => 1,
    'SET_TITLE' => 'N',
]);

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/footer.php';
```

Чтобы отдать ту же страницу через роутинг, выполните четыре шага.

1. Опишите маршрут в файле `/local/routes/web.php`.

   ```php
   <?php

   use Bitrix\Main\Routing\RoutingConfigurator;
   use My\Blog\Controller\BlogController;

   return static function (RoutingConfigurator $routes)
   {
       $routes
           ->get('/blog/', [BlogController::class, 'index'])
           ->name('blog.index')
       ;
   };
   ```

2. Создайте действие контроллера в установленном модуле, например, в файле `/local/modules/my.blog/lib/Controller/BlogController.php`.

   ```php
   <?php

   namespace My\Blog\Controller;

   use Bitrix\Main\Engine\ActionFilter\Authentication;
   use Bitrix\Main\Engine\ActionFilter\Csrf;
   use Bitrix\Main\Engine\Controller;
   use Bitrix\Main\Engine\Response\Render\View;

   final class BlogController extends Controller
   {
       public function configureActions(): array
       {
           return [
               'index' => [
                   '-prefilters' => [
                       Authentication::class,
                       Csrf::class,
                   ],
               ],
           ];
       }

       public function indexAction(): View
       {
           return $this->renderView('blog/index');
       }
   }
   ```

   Действия контроллера используют [фильтры по умолчанию](./pre-post-filters#default-filters) `Authentication`, `HttpMethod` и `Csrf`. Фильтр `Authentication` требует авторизации, а `Csrf` проверяет идентификатор сессии. Поэтому без изменения конфигурации гость не получит публичную страницу. В примере оба фильтра удалены для действия `index`, а фильтр `HttpMethod` сохранен. Отключайте `Csrf` только для действий, которые не изменяют данные.

   {% note info "" %}

   Класс контроллера должен относиться к установленному модулю. Иначе загрузчик вернет ошибку о недоступном модуле. При относительном пути `renderView('blog/index')` система определяет модуль по расположению файла контроллера. Для контроллера `/local/modules/my.blog/lib/Controller/BlogController.php` представление ищется по пути `/local/modules/my.blog/views/blog/index.php`. Как подготовить и установить модуль, описано в статье [Создать модуль](./../get-started/create-module).

   {% endnote %}

3. Перенесите содержимое страницы в представление `/local/modules/my.blog/views/blog/index.php`. Не переносите код подключения `header.php` и `footer.php`: метод `renderView()` выводит представление внутри шаблона сайта.

   ```php
   <?php

   global $APPLICATION;

   $APPLICATION->SetTitle('Блог');
   ?>
   <h1>Блог</h1>
   <?php
   $APPLICATION->IncludeComponent('bitrix:news.list', '', [
       'IBLOCK_ID' => 1,
       'SET_TITLE' => 'N',
   ]);
   ```

   Параметр `SET_TITLE` отключает автоматическую установку заголовка компонентом. Без него `bitrix:news.list` заменит заголовок «Блог» названием инфоблока. Замените значение `IBLOCK_ID` на идентификатор инфоблока своего проекта.

4. Временно переименуйте файл `/blog/index.php` и проверьте страницу по адресу `/blog/`. Если маршрут работает корректно, удалите старый файл. Пока файл существует, веб-сервер может обработать его вместо маршрута.

Если страница состоит из одного компонента, представление не нужно. Верните компонент прямо из действия.

```php
public function indexAction(): \Bitrix\Main\Engine\Response\Render\Component
{
    return $this->renderComponent('bitrix:news.list', '', [
        'IBLOCK_ID' => 1,
    ]);
}
```

Система передает параметры маршрута в действие контроллера как аргументы метода, поэтому разбирать URL внутри страницы не нужно.

### Работа в режиме правки {#edit-mode-features}

Страницу маршрута формирует контроллер, а не физический файл по адресу запроса. Поэтому доступные команды [режима правки](./../cms-basics/admin-panel#edit-mode) зависят от способа формирования ответа.

-  Верхняя панель может показывать виртуальное имя файла, например `/blog/index.php` или `/blog/component/index.php`. Система формирует его по адресу маршрута, физического файла по этому пути нет.

-  Метод `renderView()` выводит представление через `$APPLICATION->IncludeFile()`. Область редактирования связана с PHP-файлом представления внутри модуля. Если файл содержит PHP-код, открывайте его в режиме исходного кода: визуальный режим предназначен для редактирования HTML. Команды компонентов могут быть доступны в меню области представления. Их набор зависит от компонента.

-  Метод `renderComponent()` подключает компонент напрямую. Его параметры задают в действии контроллера. Область вокруг результата относится к странице маршрута и может открывать системный файл `/bitrix/routing_index.php`, а не настройки компонента.

{% note warning "Не изменяйте системный обработчик" %}

Не изменяйте `/bitrix/routing_index.php` в режиме правки: это общий системный обработчик маршрутов. Если параметры компонента или физический файл страницы нужно редактировать стандартными средствами, оставьте страницу в публичной части или используйте `PublicPageController` как переходный вариант.

{% endnote %}

### Как выбрать обработчик для страницы {#choose-page-handler}

| Задача | Обработчик |
|---|---|
| Страница с редактируемым файлом представления | Маршрут на действие контроллера с `renderView()` |
| Страница из одного компонента с параметрами в коде контроллера | Маршрут на действие контроллера с `renderComponent()` |
| Страница с настройкой параметров компонента и областями редактирования элементов стандартными средствами | Публичная страница или `PublicPageController` |
| Редактирование физического файла публичной страницы | Публичная страница или `PublicPageController` |
| Постепенный перенос существующего сайта на роутинг | `PublicPageController` на время миграции |

## Миграция с устаревшего urlrewrite.php {#urlrewrite-migration}

До появления роутинга в Bitrix Framework использовался файл `urlrewrite.php` для маршрутизации запросов до исполняемых файлов.

{% note warning "В новых проектах используйте роутинг" %}

Старые проекты могут продолжать использовать `urlrewrite.php`, но рекомендуется мигрировать на роутинг.

{% endnote %}

### Пример миграции {#migration-example}

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
    ->where('ELEMENT_ID', '\d+')
;
```

Контроллер `Bitrix\Main\Routing\Controllers\PublicPageController` подключит нужный физический файл. Это переходный вариант: после миграции правил переведите страницы на контроллеры по сценарию из раздела [Публичные страницы на контроллерах](./routing#controller-public-pages).

**Пример.** Тот же маршрут с контроллером в качестве обработчика:

```php
use My\Blog\Controller\BlogController;

$routes
    ->any('/blog/{sectionId}/{elementId}/', [BlogController::class, 'detail'])
    ->where('sectionId', '\d+')
    ->where('elementId', '\d+')
;
```

## Частые ошибки и решения {#troubleshooting}

1. **Ошибка 404 после настройки роутинга**. Убедитесь, что изменения в `.htaccess` применены правильно и файл `routing_index.php` доступен.

2. **Некорректная работа параметров маршрута**. Проверьте, что паттерны в методе `where` соответствуют ожидаемым значениям.

3. **Проблемы с генерацией ссылок**. Убедитесь, что маршруты имеют уникальные имена и используются правильно при генерации ссылок.

4. **На странице маршрута отсутствуют ожидаемые команды режима правки**. Страница, которую собирает контроллер, не связана с собственным файлом публичной части. Проверьте [особенности режима правки](./routing#edit-mode-features) и способ подключения компонентов.

5. **Публичная страница по маршруту возвращает JSON с ошибкой фильтра**. У действий контроллера включены [фильтры по умолчанию](./pre-post-filters#default-filters). Для публичного GET-действия удалите фильтры `Authentication` и `Csrf` в методе `configureActions()`. Не отключайте `Csrf` для действий, которые изменяют данные.
