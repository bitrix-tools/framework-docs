---
title: Контроллеры
description: 'Контроллеры. Документация по Bitrix Framework: принципы работы, архитектура и примеры использования.'
---

В архитектуре MVC контроллер связывает модель и представление:

-  принимает запрос от пользователя: AJAX-вызов, GET- или POST-запрос,

-  обращается к модели: получает или изменяет данные,

-  формирует ответ и отдает его представлению.

Основную логику реализуют действия -- публичные методы с суффиксом `Action`, например, `listAction`, `getAction`, `addAction`.

## Создать контроллер через консоль

Создайте контроллер с помощью консольной команды `make:controller`. Укажите модуль и действия:

-  `-m my.blog` -- модуль, в котором создается контроллер,

-  `--actions=index,view` -- список действий.

```bash
php bitrix.php make:controller post -m my.blog --actions=index,view
```

Чтобы создать типовой CRUD-контроллер, используйте `--actions=crud`. Команда добавит пять действий: `list`, `get`, `add`, `update`, `delete`.

```bash
php bitrix.php make:controller post -m my.blog --actions=crud
```

Чтобы создать пустой контроллер, не указывайте опцию `--actions`.

{% note tip "" %}

О том, как получить справку по опциям команды `make:controller`, читайте в статье [Консольные команды](./console-commands).

{% endnote %}

Команда сгенерирует файл `/local/modules/my.blog/lib/Infrastructure/Controller/Post.php`.

```php
namespace My\Blog\Infrastructure\Controller;

use Bitrix\Main\Engine\Controller;

final class Post extends Controller
{
    protected function init()
    {
        parent::init();

        // initialize services and/or load modules
    }

    public function getAutoWiredParameters(): array
    {
        return [];
    }

    public function configureActions(): array
    {
        return [
            'list' => [],
            'get' => [],
            'add' => [],
            'update' => [],
            'delete' => [],
        ];
    }

    // replace aliases with alias form settings

    /**
     * @ajaxAction my.blog.alias.Post.list
     */
    public function listAction()
    {
        return 'listAction';
    }

    /**
     * @ajaxAction my.blog.alias.Post.get
     */
    public function getAction()
    {
        return 'getAction';
    }

    /**
     * @ajaxAction my.blog.alias.Post.add
     */
    public function addAction()
    {
        return 'addAction';
    }

    /**
     * @ajaxAction my.blog.alias.Post.update
     */
    public function updateAction()
    {
        return 'updateAction';
    }

    /**
     * @ajaxAction my.blog.alias.Post.delete
     */
    public function deleteAction()
    {
        return 'deleteAction';
    }
}
```

### Настроить безопасность

По умолчанию каждое действие контроллера требует:

-  проверку CSRF-токена,

-  разрешенные HTTP-методы: `GET` или `POST`,

-  обязательную аутентификацию.

Чтобы изменить это поведение, переопределите метод `Controller::getDefaultPreFilters`. Пустой массив отключает префильтры.

```php
final class Post extends Controller
{
    protected function getDefaultPreFilters()
    {
        return [];
    }
}
```

## Настроить роутинг

1. Зарегистрируйте маршруты в файле `/local/routes/web.php`, чтобы сделать действия доступными по URL. Если файл отсутствует, создайте его вручную.

   ```php
   use Bitrix\Main\Routing\RoutingConfigurator;
   use My\Blog\Infrastructure\Controller\Post;
   
   return static function (RoutingConfigurator $routes) {
       $routes
           ->prefix('blog')
           ->name('blog.post')
           ->group(static function (RoutingConfigurator $routes) {
               $routes->any('', [Post::class, 'list'])->name('list');
               $routes->post('create/', [Post::class, 'add'])->name('add');
               $routes->get('{code}/', [Post::class, 'get'])->name('get');
               $routes->put('{code}/', [Post::class, 'update'])->name('update');
               $routes->delete('{code}/', [Post::class, 'delete'])->name('delete');
           });
   };
   ```

2. Подключите файл конфигурации в `/bitrix/.settings.php`.

   ```php
   'routing' => [
       'value' => [
           'config' => ['web.php'],
       ],
       'readonly' => true,
   ],
   ```

После настройки начнут работать следующие маршруты:

-  `GET /blog/` -> `listAction`

-  `POST /blog/create/` -> `addAction`

-  `GET /blog/{code}/` -> `getAction`

-  `PUT /blog/{code}/` -> `updateAction`

-  `DELETE /blog/{code}/` -> `deleteAction`

Параметр `{code}` из маршрута передается в действие как аргумент с тем же именем.

{% note tip "" %}

Подробнее о роутинге и маршрутах читайте в статье [Роутинг](./routing).

{% endnote %}

### Вернуть ответ

Контроллер автоматически преобразует скалярные значения и массивы в JSON-ответ через `Bitrix\Main\Engine\Response\AjaxJson`.

Например, при запросе к `/blog/` получите:

```json
{"status":"success","data":"listAction","errors":[]}
```

Чтобы вернуть HTML, текст или установить заголовки, используйте `HttpResponse`:

```php
final class Post extends Controller
{
    public function listAction()
    {
        $response = new \Bitrix\Main\HttpResponse();
        $response->appendContent('listAction');

        return $response;
    }
}
```

Другие типы ответов описаны ниже в разделе Респонсы.

### Передать параметр из URL

Добавьте аргумент в метод действия:

```php
final class Post extends Controller
{
    public function getAction(string $code)
    {
        return 'getAction: ' . $code;
    }

    // ...
}
```

При запросе по URL `/blog/my-first-blog/` в ответе получите:

```json
{"status":"success","data":"getAction: my-first-blog","errors":[]}
```

## Вызвать действие через AJAX

Если не хотите использовать роутинг, вызывайте действия через `/bitrix/services/main/ajax.php`.

### Настроить пространства имен

Укажите пространство имен в `/local/modules/my.blog/.settings.php`:

```php
return [
    'controllers' => [
        'value' => [
            'defaultNamespace' => '\\My\\Blog\\Infrastructure\\Controller',
            // Можно добавить дополнительные пространства:
            // 'namespaces' => [
            //     '\\My\\Blog\\Integration\\Controller' => 'integration',
            // ],
        ],
        'readonly' => true,
    ],
];
```

Система сопоставляет имена по шаблону:\
`[vendor]:[module].[namespace].[className].[actionName]`

#### Пример преобразования

| Класс и метод | Идентификатор действия |
| ------------- | ---------------------- |
| `\My\Blog\Infrastructure\Controller\Post::getAction()` | `my:blog.Post.get` |
| `\My\Blog\Integration\Controller\Lang::translateAction()` | `my:blog.integration.Lang.translate` |


{% note warning "" %}

Поддержка PSR-4 в AJAX-контроллерах доступна с версии 20.600.87 главного модуля.\
Если префикс `vendor:` не указан, система подставляет `bitrix:`.

{% endnote %}

### Вызвать действие из JavaScript

Для вызова действия используйте `BX.ajax.runAction`.

```javascript
const response = await BX.ajax.runAction('my:blog.Post.get', {
    data: {
        code: 'my-first-blog'
    }
});
console.log(response);
```

В результате получите объект.

```javascript
{
    status: "success",
    data: "getAction: my-first-blog",
    errors: []
}
```

Чтобы получить объект с ошибками, используйте `try/catch`.

```javascript
try {
    const response = await BX.ajax.runAction('my:blog.Post.get');
} catch (error) {
    console.log(error);
}
```

Пример объекта ошибки:

```javascript
{
    status:"error",
    data:null,
    errors:[
        {
            message:"Could not find value for parameter {code}",
            code:100,
            customData:null
        }
    ]
}
```

### Вызвать напрямую через HTTP

Действие можно вызвать напрямую:

```
GET /bitrix/services/main/ajax.php?action=my:blog.Post.get&code=my-first-blog
```

{% note warning "" %}

Такой способ не рекомендуется. Он не дает преимуществ перед `BX.ajax.runAction`. Если использовать `BX` невозможно, настройте отдельный маршрут.

{% endnote %}

## Разделить HTTP- и AJAX-контроллеры

Чтобы избежать дублирования точек входа, вынесите логику в разные контроллеры. Это упростит управление доступом и аналитику.

1. Создайте два контроллера:

   ```bash
   php bitrix.php make:controller post -m my.blog --actions=get,list -C Web
   php bitrix.php make:controller post -m my.blog --actions=add,update,delete -C Ajax
   ```

   Получите два файла:

   -  `/local/modules/my.blog/lib/Infrastructure/Controller/Web/Post.php`

   -  `/local/modules/my.blog/lib/Infrastructure/Controller/Ajax/Post.php`

2. Укажите AJAX-пространство в `/local/modules/my.blog/.settings.php`.

   ```php
   'controllers' => [
       'value' => [
           'defaultNamespace' => '\\My\\Blog\\Infrastructure\\Controller\\Ajax',
       ],
       'readonly' => true,
   ],
   ```

3. В роутинге оставьте только Web-контроллер.

   ```php
   use Bitrix\Main\Routing\RoutingConfigurator;
   use My\Blog\Infrastructure\Controller\Web\Post;
   
   return static function (RoutingConfigurator $routes) {
       $routes
           ->prefix('blog')
           ->name('blog.post')
           ->group(static function (RoutingConfigurator $routes) {
               $routes->any('', [Post::class, 'list'])->name('list');
               $routes->get('{code}/', [Post::class, 'get'])->name('get');
           });
   };
   ```

Теперь вызов `BX.ajax.runAction('my:blog.Post.get')` вернет ошибку, потому что действие `get` доступно через HTTP-маршрут.

```json
{
    status:"error",
    data:null,
    errors:[
        {
            message:"Could not find description of get in My\\Blog\\Infrastructure\\Controller\\Ajax\\Post",
            code:22002,
            customData:null
        }
    ]
}
```

## Аргументы действий

Аргументы методов с суффиксом `Action` формируются автоматически из запроса по имени и типу.

```php
final class Post extends Controller
{
    public function getAction(string $code)
    {
        return 'getAction: ' . $code;
    }

    public function listAction(int $limit = 10, ?int $categoryId = null)
    {
        return 'listAction: ' . $limit;
    }

    // ...
}
```

Правила:

-  В методе `getAction` параметр `code` обязателен. При его отсутствии получите ошибку `Could not find value for parameter`.

-  В `listAction` можно не передавать параметры: `limit` примет значение `10`, `categoryId` -- `null`.

-  Если тип данных не совпадает, возникнет ошибка `Invalid value to match with parameter`.

### Автоваринг встроенных классов

Bitrix Framework создает объекты автоматически, если указать их в аргументах.

#### Текущий пользователь

Чтобы получить данные текущего пользователя, в аргументе укажите `\Bitrix\Main\Engine\CurrentUser`.

```php
final class Post extends Controller
{
    public function listAction(\Bitrix\Main\Engine\CurrentUser $user)
    {
        $isGuest = empty($user->getId());
        if ($isGuest)
        {
            $this->addError(
                new \Bitrix\Main\Error('Need authenticated')
            );

            return false;
        }
    }

    // ...
}
```

#### Постраничная навигация

Чтобы получить объект навигации, укажите `Bitrix\Main\UI\PageNavigation`.

```php
final class Post extends Controller
{
    public function listAction(\Bitrix\Main\UI\PageNavigation $pagination)
    {
        return [
            'page' => $pagination->getCurrentPage(),
            'size' => $pagination->getPageSize(),
            'limit' => $pagination->getLimit(),
            'offset' => $pagination->getOffset(),
        ];
    }
}
```

При запросе к `/blog/` в ответе получите `{"page":1,"size":20,"limit":20,"offset":0}`.

Если запросить `/blog/?nav=page-3-size-33`, получите `{"page":3,"size":33,"limit":33,"offset":66}`.

При вызове через `BX.ajax.runAction` параметры навигации передавайте в поле `navigation`.

```javascript
BX.ajax.runAction('my:blog.Post.list', {
    navigation: { page: 3, size: 33 }
});
```

{% note tip "" %}

О классе `PageNavigation` читайте в статье [Постраничная навигация](./../cms-basics/page-navigation).

{% endnote %}

#### Тело JSON-запроса

Чтобы получить данные  из тела запроса с `Content-Type: application/json`, используйте `Bitrix\Main\Engine\JsonPayload`.

```php
final class Post extends Controller
{
    public function listAction(\Bitrix\Main\Engine\JsonPayload $json)
    {
        return [
            'from array' => $json->getData()['value'] ?? null,
            'from dictionary' => $json->getDataList()->get('value'),
        ];
    }
}
```

Проверьте через `curl`:

```bash
curl --request POST \
    --url 'http://localhost/blog/' \
    --header 'Content-Type: application/json' \
    --data '{"value": 123}'
```

### Автоваринг кастомных классов

Чтобы внедрить кастомный объект, укажите правила в `getAutoWiredParameters`.

Допустим, есть таблет `MyPost`:

```php
final class Post extends Controller
{
    public function getAction(string $code)
    {
        $post = \MyPost::query()->where('CODE', $code)->fetchObject();
        if (!$post)
        {
            $this->addError(
                new \Bitrix\Main\Error('Not found post')
            );

            return false;
        }

        // ...
    }
}
```

Вместо поиска статьи по коду внутри действия, можно автоматически преобразовать параметр `code` в объект `MyPost`.

**Вариант 1**. `ExactParameter` -- строгое соответствие имени.

```php
final class Post extends Controller
{
    public function getAutoWiredParameters(): array
    {
        return [
            new \Bitrix\Main\Engine\AutoWire\ExactParameter(
                \MyPost::class,
                'code',
                static function(string $className, string $code) {
                    return \MyPost::query()->where('CODE', $code)->fetchObject();
                }
            )
        ];
    }

    public function getAction(\MyPost $code)
    {
        // ...
    }
}
```

Если запись не найдена, система вернет ошибку `Could not construct parameter {code}`.

**Вариант 2.** `Parameter` -- произвольное имя аргумента.

```php
final class Post extends Controller
{
    public function getAutoWiredParameters(): array
    {
        return [
            new \Bitrix\Main\Engine\AutoWire\Parameter(
                \MyPost::class,
                function() {
                    $code = (string)$this->getRequest()->get('code');

                    return \MyPost::query()->where('CODE', $code)->fetchObject();
                }
            )
        ];
    }

    public function getAction(\MyPost $post)
    {
        // ...
    }
}
```

Для валидации параметров используйте `Bitrix\Main\Validation\Engine\AutoWire\ValidationParameter`.

{% note tip "" %}

Подробнее о валидации в контроллерах читайте в статье [Валидация](./validation).

{% endnote %}

### Использовать сервис-локатор

Сервис-локатор `Bitrix\Main\DI\ServiceLocator` подключается автоматически, если:

-  класс не является экземпляром `CurrentUser`, `JsonPayload` или `PageNavigation`,

-  класс не указан в `Controller::getAutoWiredParameters`.

Это позволяет внедрять собственные сервисы:

```php
class PostRepository
{}

class PostService
{
    public function __construct(
        private readonly PostRepository $repo,
    )
    {}
}

final class Post extends Controller
{
    public function getAction(PostService $service, string $code)
    {
        $response = new \Bitrix\Main\HttpResponse();
        $response->addHeader('Content-type', 'text/plain');
        $response->setContent(
            var_export($service, true)
        );

        return $response;
    }
}
```

{% note warning "" %}

Если класс не зарегистрирован в контейнере, он создается напрямую. Для управления жизненным циклом зарегистрируйте его в DI.

{% endnote %}

## Реквесты

Реквест -- это класс, который описывает входные данные, применяет валидацию и передает их в действие.

### Создать реквест

Чтобы создать реквест, используйте консольную команду `make:request`.

```bash
php bitrix.php make:request PostCreate -m my.blog --fields
```

Команда генерирует файл `/local/modules/my.blog/lib/Request/PostCreateRequest.php` со следующим содержимым:

```php
namespace My\Blog\Infrastructure\Controller\Request;

final class PostCreateRequest
{
    public function __construct(
        public readonly ?string $title,
        public readonly ?string $code,
        public readonly ?string $content,
    )
    {}

    public static function createFromRequest(\Bitrix\Main\Request $request): self
    {
        return new self(
            $request->get('title'),
            $request->get('code'),
            $request->get('content'),
        );
    }
}
```

Добавьте правила валидации.

```php
namespace My\Blog\Infrastructure\Controller\Request;

use Bitrix\Main\Validation\Rule\Length;
use Bitrix\Main\Validation\Rule\NotEmpty;

final class PostCreateRequest
{
    public function __construct(
        #[NotEmpty]
        public readonly ?string $title,
        #[NotEmpty]
        public readonly ?string $code,
        #[Length(max: 10_000)]
        public readonly ?string $content,
    )
    {}

    public static function createFromRequest(\Bitrix\Main\Request $request): self
    {
        return new self(
            $request->get('title'),
            $request->get('code'),
            $request->get('content'),
        );
    }
}
```

### Зарегистрировать реквест

Добавьте реквест в контроллер через автоваринг аргументов `getAutoWiredParameters()`.

```php
final class Post extends Controller
{
    public function getAutoWiredParameters(): array
    {
        return [
            new \Bitrix\Main\Validation\Engine\AutoWire\ValidationParameter(
                PostCreateRequest::class,
                fn() => PostCreateRequest::createFromRequest($this->getRequest()),
            )
        ];
    }

    public function addAction(PostCreateRequest $request): ?array
    {
        // ...
    }
}
```

Валидация выполняется до вызова действия. При ошибках действие не запускается.

## Респонсы

Контроллер поддерживает разные типы ответов:

-  `Bitrix\Main\Engine\Response\AjaxJson`

-  `Bitrix\Main\HttpResponse`

-  `Bitrix\Main\Engine\Response\File`

-  `Bitrix\Main\Engine\Response\BFile`

-  `Bitrix\Main\Engine\Response\ResizedImage`

-  `Bitrix\Main\Engine\Response\Component`

-  `Bitrix\Main\Engine\Response\HtmlContent`

-  `Bitrix\Main\Engine\Response\Json`

-  `Bitrix\Main\Engine\Response\OpenDesktopApp`

-  `Bitrix\Main\Engine\Response\OpenMobileApp`

-  `Bitrix\Main\Engine\Response\Redirect`

-  `Bitrix\Main\Engine\Response\Zip\Archive`

### Вернуть JSON

Этот тип используется по умолчанию. Явно создавайте `Json`, если нужен ответ без полей `status` и `errors`.

### Вернуть файлы

Чтобы вернуть файл, используйте `Response\File` или `Response\BFile`.

```php
use Bitrix\Main\Engine\Response\BFile;
use Bitrix\Main\Engine\Response\File;

public function downloadExportAction(string $blogCode)
{
    // Генерируем CSV-файл
    $filePath = $this->generateBlogExport($blogCode);
    return new File($filePath, "blog-{$blogCode}.csv", 'text/csv');
}

public function downloadAvatarAction(int $userId)
{
    $fileId = UserTable::getList(['filter' => ['ID' => $userId]])->fetch()['AVATAR_FILE_ID'];
    return BFile::createByFileId($fileId);
}
```

### Вернуть изображение

Чтобы вернуть ресайз изображения, используйте `Response\ResizedImage`.

```php
use Bitrix\Main\Engine\Response\ResizedImage;

public function avatarAction(int $userId)
{
    $imageId = /* ... */;
    return ResizedImage::createByImageId($imageId, 100, 100);
}
```

{% note warning "" %}

Никогда не позволяйте пользователю задавать размеры напрямую. Используйте фиксированные значения или подписанные параметры.

{% endnote %}

## Рендеринг

Рендеринг -- это отрисовка HTML-страниц, компонентов или расширений из контроллера.

{% note info "" %}

Функционал рендеринга доступен с версии 25.700.0 главного модуля.

{% endnote %}

### Рендеринг представления

Чтобы вывести HTML-страницу, используйте метод `renderView()`. Переменные из второго аргумента доступны в шаблоне как `$blogs`.

```php
public function indexAction(): \Bitrix\Main\Engine\Response\Render\View
{
    $blogs = BlogTable::getList()->fetchAll();
    return $this->renderView('blog/index', [
        'blogs' => $blogs
    ]);
}
```

Система ищет шаблон по пути `/local/modules/my.blog/views/blog/index.php`.

### Рендеринг компонента

Если страница состоит из одного компонента, отрисуйте его напрямую через `renderComponent()`. Отдельное представление не требуется.

Параметры метода:

-  `$name` -- символьное имя компонента, обязательный параметр.

-  `$template` -- название шаблона компонента.

-  `$params` -- ассоциативный массив параметров для передачи в компонент.

```php
public function viewAction(string $code): \Bitrix\Main\Engine\Response\Render\Component
{
    return $this->renderComponent('my.blog:post.list', '', [
        'BLOG_CODE' => $code
    ]);
}
```

### Рендеринг расширений

Для компонентов и страниц, которые выводят только расширение, используйте прямой рендеринг расширения `renderExtension` без создания представлений или компонентов.

```php
public function editorAction(string $blogCode): \Bitrix\Main\Engine\Response\Render\Extension
{
    return $this->renderExtension('my.blog.vue.editor', [
        'blogCode' => $blogCode
    ]);
}
```

В `config.php` расширения укажите точку входа:

```php
'render' => [
    'controllerEntrypoint' => 'MyBlog.Vue.Editor.render',
],
```

{% note info "" %}

Рендеринг расширений работает в браузере -- это не Server-Side Rendering (SSR). Используйте его для интерфейсов без требований к SEO.

{% endnote %}

### Отключить шаблон сайта

Чтобы отключить общий шаблон сайта, укажите `withSiteTemplate: false`.

```php
$this->renderView('blog/index', withSiteTemplate: false);
```

## Ошибки и исключения

Чтобы получить сообщение об ошибке, добавьте ошибку в контроллер с помощью `addError`:

```php
use Bitrix\Main\Error;

public function deleteAction(string $code)
{
    $blog = Blog::getByCode($code);
    if (!$blog) {
        $this->addError(new Error('Блог не найден', 'BLOG_NOT_FOUND'));
        return null;
    }
    $blog->delete();
    return ['success' => true];
}
```

Ответ при ошибке:

```json
{
    "status": "error",
    "data": null,
    "errors": [{
        "message": "Блог не найден",
        "code": "BLOG_NOT_FOUND"
    }]
}
```

Для отладки включите режим разработки `debug => true` в `/.settings.php`, чтобы видеть стек вызовов при ошибках.

## Жизненный цикл контроллера

При вызове действия система выполняет последовательность шагов.

1. Создает экземпляр контроллера через  `new Controller()`.

2. Вызывает `Controller::init()` -- инициализация, которую можно переопределить.

3. Создает объект действия по имени `*Action`.

4. Выполняет `Controller::prepareParams()` -- извлечение и валидация параметров.

5. Выполняет `Controller::processBeforeAction($action)` -- предварительная обработка.

6. Вызывает событие `onBeforeAction`, которое позволяет отменить выполнение.

7. Выполняет действие -- вызов `actionNameAction(...)`.

8. Вызывает событие `onAfterAction` после выполнения действия.

9. Выполняет `Controller::processAfterAction(\$action, \$result)` -- постобработка результата.

10. Формирует ответ -- преобразование в JSON, HTML или файл.

11. Выполняет `Controller::finalizeResponse(\$response)` -- финальная настройка заголовков.

12. Отправляет ответ пользователю.

Переопределите шаги `2`, `5`, `9`, `11`, чтобы подключить сервисы, проверить права доступа, логировать запросы или изменить ответ.