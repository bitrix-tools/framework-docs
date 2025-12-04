---
title: Контроллеры
description: 'Контроллеры. Документация по Bitrix Framework: принципы работы, архитектура и примеры использования.'
---

В MVC-архитектуре контроллеры -- это связующее звено между моделью и представлением. Контроллер:

-  обрабатывает входящие запросы от пользователя, например, нажатие кнопки или ввод данных,

-  взаимодействует с моделью для получения или изменения данных

-  передает результаты представлению для отображения.

Контроллеры состоят из методов, называемых действиями, которые выполняют основную логику и возвращают данные. Например, метод `greetAction` может возвращать приветственное сообщение.

## Именование контроллеров и действий

{% note info "" %}

PSR-4 в AJAX-контроллерах поддерживается с версии 20.600.87 главного модуля.

{% endnote %}

Контроллеры и их действия именуются по определенному шаблону. Имена параметров и контроллеров чувствительны к регистру, а имена действий -- нет.

Примеры именования:

-  `\Bitrix\Disk\Controller\Folder::getAction()` преобразуется в `bitrix:disk.Controller.Folder.get`.

-  `\SomeVendor\Somedisk\Controller\SuperFolder::getAction()` преобразуется в `somevendor:somedisk.Controller.SuperFolder.get`.

Здесь `\Bitrix\Disk\Controller\Folder` и `\SomeVendor\Somedisk\Controller\SuperFolder` -- это классы контроллеров, а `getAction` -- это действие в этих классах.

Формат имени:

-  Имя действия формируется по шаблону: `vendor:module.Controller.Action`.

-  `vendor:` -- это часть, которая указывает на поставщика или разработчика модуля. Например, `bitrix:` или `somevendor:`.

-  `module` -- это название модуля, в котором находится контроллер.

-  `Controller` -- это часть пространства имен и название контроллера.

-  `Action` -- это конкретное действие, которое выполняется.

Особенности:

-  Если `vendor:` не указан, по умолчанию используется `bitrix:`.

-  Если задан `defaultNamespace`, его можно не указывать в имени действия, так как система автоматически его подставит.

## Действия в контроллерах

Контроллеры состоят из действий, которые пользователь запрашивает для получения результата. В одном контроллере может быть одно или несколько действий.

### Пример контроллера

Рассмотрим пример контроллера с действиями `item.add` и `item.view` в модуле `example`.

1. Создайте файл `.settings.php` в корне модуля.

   ```php
   <?php
   //modules/vendor.example/.settings.php
   return [
   	'controllers' => [
   		'value' => [
   			'defaultNamespace' => '\\Vendor\\Example\\Controller',
   		],
   		'readonly' => true,
   	]
   ];
   ```

2. Создайте файл контроллера `/modules/vendor.example/lib/controller/item.php`.

   ```php
   namespace Vendor\Example\Controller;
   use \Bitrix\Main\Error;
   
   class Item extends \Bitrix\Main\Engine\Controller
   {
       public function addAction(array $fields):? array
       {
           $item = Item::add($fields);
           if (!$item) {
               $this->addError(new Error('Could not create item.', {код_ошибки}));
               return null;
           }
           return $item->toArray();
       }
   
       public function viewAction($id):? array
       {
           $item = Item::getById($id);
           if (!$item) {
               $this->addError(new Error('Could not find item.', {код_ошибки}));
               return null;
           }
           return $item->toArray();
       }
   }
   ```

#### Действие addAction

1. Действие пытается создать `Item` из переданных `$fields`.

2. При ошибке возвращает `null` и добавляет ошибку в контроллер.

   ```php
   {
   	"status": "error", 
   	"data": null,
   	"errors": [
   		{
   			"message": "Could not create item.",
   			"code": {код}
   		}
   	]
   }
   ```

3. При успехе возвращает массив с данными `Item`.

   ```php
   {
   	"status": "success",
   	"data": {
   		"ID": 1,
   		"NAME": "Nobody",
   		//...поля элемента
   	},
   	"errors": null
   }
   ```

#### Действие viewAction

1. Действие пытается загрузить `Item` по `$id`. Параметр `$id` будет автоматически получен из `$_POST['id']` или `$_GET['id']`.

2. При ошибке возвращает `null` с соответствующей ошибкой.

   ```php
   {
   	"status": "error",
   	"data": null,
   	"errors": [
   		{
   			"message": "Could not find value for parameter {id}",
   			"code": 0
   		}
   	]
   }
   ```

#### Как обратиться к действию контроллера

Для вызова действий используйте соглашение по именованию:

-  `Item::addAction` -> `vendor:example.Item.add`

-  `Item::viewAction` -> `vendor:example.Item.view`

Пример вызова через `BX.ajax.runAction`:

```javascript
BX.ajax.runAction('vendor:example.Item.add', {
	data: {
		fields: {
			ID: 1,
			NAME: "test"
		} 
	}
}).then(function (response) {
	console.log(response);
	/**
	{
		"status": "success", 
		"data": {
			"ID": 1,
			"NAME": "test"
		}, 
		"errors": []
	}
	**/			
}, function (response) {
	//все ответы, у которых status !== 'success'
	console.log(response);
	/**
	{
		"status": "error", 
		"errors": [...]
	}
	**/				
});
```

Можно получить ссылку на действие и выполнить HTTP-запрос самостоятельно.

```php
/** @var \Bitrix\Main\Web\Uri $uri **/
$uri = \Bitrix\Main\Engine\UrlManager::getInstance()->create('vendor:example.Item.view', ['id' => 1]);
echo $uri;
// /bitrix/services/main/ajax.php?action=vendor:example.Item.view&id=1
// выполняем GET-запрос
```

### Как создавать контроллеры и действия

Контроллеры:

-  должны быть унаследованы от `\Bitrix\Main\Engine\Controller` или его потомков.

-  могут располагаться в модуле или внутри компонента в файле `ajax.php`.

Требования к действиям:

-  методы должны быть `public` и оканчиваться на `Action`,

   ```php
   namespace Vendor\Example\Controller;
   class Item extends \Bitrix\Main\Engine\Controller
   {
   	public function addAction(array $fields)
   	{
   		//...
   	}
   }
   ```

-  могут возвращать:

   -  данные для JSON-ответа,

   -  объект `\Bitrix\Main\HttpResponse` или его наследников,

   -  объекты, которые реализуют интерфейсы: `\JsonSerializable`, `\Bitrix\Main\Type\Contract\Arrayable` и `\Bitrix\Main\Type\Contract\Jsonable`.

### Как создавать классы-действия

Классы-действия наследуются от `\Bitrix\Main\Engine\Action` и позволяют повторно использовать логику в нескольких контроллерах.

```php
class Test extends \Bitrix\Main\Engine\Controller
{
    public function configureActions()
    {
        return [
            'testoPresto' => [
                'class' => \TestAction::class,
                'configure' => ['who' => 'Me'],
            ],
        ];
    }
}

class TestAction extends \Bitrix\Main\Engine\Action
{
    protected $who;

    public function configure($params)
    {
        parent::configure($params);
        $this->who = $params['who'] ?: 'nobody';
    }

    public function run($objectId = null)
    {
        return "Test action! Know object {$objectId}? Mr. {$this->who}";
    }
}
```

### Жизненный цикл контроллера

1. Создание контроллера

2. Инициализация `Controller::init()`

3. Создание объекта действия. Если не удалось, выбрасывается исключение

4. Подготовка параметров `Controller::prepareParams`

5. Метод `Controller::processBeforeAction(Action $action)`

6. Событие `onBeforeAction`

7. Выполнение действия

8. Событие `onAfterAction`

9. Метод `Controller::processAfterAction(Action $action, $result)`

10. Формирование ответа

11. Метод `Controller::finalizeResponse($response)`

12. Вывод `$response` пользователю

### Несколько пространств имен

В `.settings.php` можно указать несколько `namespaces`, помимо `defaultNamespace`. Это необходимо, когда контроллеры расположены рядом со своими бизнес-сущностями. Например, в модуле Диск есть интеграция с облаками.

```php
return [
     'controllers' => [
         'value' => [
             'namespaces' => [
                 '\\Bitrix\\Disk\\CloudIntegration\\Controller' => 'cloud',
             ],
             'defaultNamespace' => '\\Bitrix\\Disk\\Controller',
         ],
         'readonly' => true,
     ]
];
```

В результате доступны для вызова контроллеры, которые расположены в обоих пространствах имен. Пространства поддерживают вызов через полное имя действия и через сокращенную запись.

Эквивалентные вызовы:

-  `disk.CloudIntegration.Controller.GoogleFile.get`

-  `disk.cloud.GoogleFile.get`

-  `disk.Controller.File.get`

-  `disk.File.get`

### Вызов контроллера из компонента

Используйте `BX.ajax.runAction` с подписанными параметрами:

```javascript
BX.ajax.runAction('socialnetwork.api.user.stresslevel.get', {
     signedParameters: this.signedParameters,
     data: {
         c: myComponentName,
         fields: {
             //..
         }
     }
});
```

Внутри кода действия используйте метод `Controller::getUnsignedParameters()`.

```php
<?php
	//...
	public function getAction(array $fields)
	{
		//внутри распакованный, проверенный массив параметров
		$parameters = $this->getUnsignedParameters();
        
		return $parameters['level'] * 100;
	}
```

## Отладка и ответы контроллера

Для удобной отладки ошибок включайте `debug => true` в `.settings.php`. Это позволит увидеть трейс ошибок и исключений.

Если нужно отдать файл, воспользуйтесь классами `\Bitrix\Main\Engine\Response\File` и `\Bitrix\Main\Engine\Response\BFile`.

```php
class Controller extends Engine\Controller
{
    public function downloadAction($orderId)
    {
        // Найдите прикрепленный fileId по $orderId
        return \Bitrix\Main\Engine\Response\BFile::createByFileId($fileId);
    }
    public function downloadGeneratedTemplateAction()
    {
        // Генерация файла ... $generatedPath
        return new \Bitrix\Main\Engine\Response\File(
            $generatedPath,
            'Test.pdf',
            \Bitrix\Main\Web\MimeType::getByFileExtension('pdf')
        );
    }
    public function showImageAction($orderId)
    {
        // Найдите прикрепленный imageId по $orderId
        return \Bitrix\Main\Engine\Response\BFile::createByFileId($imageId)
            ->showInline(true);
    }
}
```

Для отдачи отресайзенного изображения используйте `\Bitrix\Main\Engine\Response\ResizedImage`.

Никогда не позволяйте пользователю запрашивать произвольные размеры для ресайза. Всегда подписывайте параметры или явно указывайте размеры в коде.

```php
class Controller extends Engine\Controller
{
    public function showAvatarAction($userId)
    {
        // Найдите прикрепленный imageId по $userId
        return \Bitrix\Main\Engine\Response\ResizedImage::createByImageId($imageId, 100, 100);
    }
}
```

## Рендеринг

Для работы с HTML-представлениями, компонентами и расширениями контроллеры предоставляют методы рендеринга. Это позволяет реализовать полноценные страницы в рамках MVC-архитектуры.

{% note info "" %}

Функционал рендеринга доступен с версии 25.700.0 главного модуля.

{% endnote %}

### Рендеринг файла

Чтобы вывести страницу используйте метод `renderView()`. Система автоматически найдет файл в директориях модуля.

```php
class Entity extends Controller
{
    public function indexAction(): View
    {
        return $this->renderView('entity/index');
    }
}
```

Система будет искать файл по пути `[module-folder]/views/entity/index.php`, где `[module-folder]` -- это путь до модуля в директории `bitrix` или `local`.

Если указать ведущий `/`, поиск будет осуществляться от корня сайта. Такой вызов подключит тот же самый файл:

```php
class Entity extends Controller
{
    public function indexAction(): View
    {
        return $this->renderView('/local/modules/my.module/views/entity/index.php');
    }
}
```

Если система не найдет путь к указанному файлу, она выбросит исключение `NotFoundPathToViewException`.

Система автоматически подключает основной шаблон сайта -- добавлять header и footer вручную не нужно. Для представлений в директории модуля система обеспечивает защиту, поэтому проверка пролога не требуется.

#### Передать параметры в представление

Второй аргумент метода `renderView()` позволяет передавать данные в шаблон.

```php
class EntityController extends Controller
{
    public function indexAction(): View
    {
        return $this->renderView('entity/index', [
            'param' => 'value',
        ]);
    }
}
```

### Рендеринг компонентов

Если страница содержит только один компонент, вы можете сразу вывести его с помощью `renderComponent()` и не создавать отдельное представление. Параметры метода:

-  `$name` -- символьное имя компонента, обязательный параметр.

-  `$template` -- название шаблона компонента.

-  `$params` -- ассоциативный массив параметров для передачи в компонент.

```php
class EntityController extends Controller
{
    public function indexAction(): Component
    {
        return $this->renderComponent('bitrix:component.name', 'template-name', [
            'param' => 'value',
        ]);
    }
}
```

### Рендеринг расширений

Для компонентов и страниц, которые выводят только расширение, используйте прямой рендеринг расширения `renderExtension` без создания представлений или компонентов.

```php
class EntityController extends Controller
{
    public function indexAction(): Extension
    {
        return $this->renderExtension('mymodule.vue.widget', [
            'option' => 'name',
        ]);
    }
}
```

В метод можно передать только название расширения, без параметров.

#### Настроить расширение

Чтобы включить функцию, добавьте в файл `config.php` расширения параметр `controllerEntrypoint`. Укажите в нем функцию или метод, который выполняет рендеринг расширения.

```php
return [
    // ...
    'controllerEntrypoint' => 'MyModule.Vue.Widget.render',
];
```

Если вы не укажете параметр `controllerEntrypoint`, система выбросит исключение `Bitrix\Main\Engine\Response\Render\Exception\InvalidConfigExtensionException`.

#### Как работает рендеринг расширений

При вызове `renderExtension()` система генерирует HTML-страницу, которая автоматически инициализирует ваше расширение.

```html
<html>
    <head>...</head>
    <body>
        <!-- header -->

        <div id="render_container_hb2j34235"></div>
        <script>
        BX.ready(function(){
            // После загрузки страницы запускается функция рендеринга
            MyModule.Vue.Widget.render('#render_container_hb2j34235', {'option': 'name'});
        });
        </script>

        <!-- footer -->
    </body>
</html>
```

Функцию рендеринга на стороне клиента можно реализовать двумя способами.

1. Использовать готовое приложение.

   ```javascript
   export function renderExtension(selector, options)
   {
       const app = BitrixVue.createApp(App);
       app.use(router);
       app.use(pinia);
   
       const store = useAppStore();
       store.$patch(options); // Применяем переданные параметры
   
       app.mount(selector); // Монтируем приложение в контейнер
   }
   ```

2. Создать приложение напрямую.

   ```javascript
   import { BitrixVue } from 'ui.vue3';
   
   export class Widget {
       static renderExtension(selector, options) {
           const app = BitrixVue.createApp({
               data() {
                   return { ...options }; // Данные из параметров
               },
               template: `<div>Ваш шаблон</div>`,
           });
           app.mount(selector);
       }
   }
   ```

Для неадаптированных расширений создайте отдельное представление с прямым вызовом расширения.

{% note info "" %}

Этот подход не является Server-Side Rendering (SSR). Расширения рендерятся в браузере после загрузки страницы, что оптимально для интерфейсов без требований к SEO.

{% endnote %}

### Отключить шаблон сайта

Все методы рендеринга по умолчанию используют основной шаблон сайта. Чтобы отключить шаблон сайта передайте параметр `withSiteTemplate` со значением `false`.

```php
// Файл
return $this->renderView('entity/index', withSiteTemplate: false);

// Компонент
return $this->renderComponent('bitrix:component.name', withSiteTemplate: false);

// Расширение
return $this->renderExtension('mymodule.vue.widget', withSiteTemplate: false);
```

Отключение шаблона сайта не препятствует загрузке расширений и скриптов -- они остаются в выводе.

### Обработка ошибок

При ошибках рендеринга контроллер возвращает стандартный JSON-ответ с описанием ошибки, как в AJAX-действиях.

## Постраничная навигация

Постраничная навигация позволяет управлять отображением данных, разбивая их на страницы. В Bitrix это реализуется с помощью `\Bitrix\Main\UI\PageNavigation`.

### Использование PageNavigation

Для организации постраничной навигации в AJAX-действии необходимо использовать `\Bitrix\Main\UI\PageNavigation`. Это позволяет задавать лимит и смещение для выборки данных.

```php
use \Bitrix\Main\Engine\Response;
use \Bitrix\Main\UI\PageNavigation;

public function listChildrenAction(Folder $folder, PageNavigation $pageNavigation)
{
	$children = $folder->getChildren([
		'limit' => $pageNavigation->getLimit(),
		'offset' => $pageNavigation->getOffset(),
	]);

	return new Response\DataType\Page('files', $children, function() use ($folder) {
		return $folder->countChildren();
	});
}
```

### Передача номера страницы

Для передачи номера страницы в JavaScript API используйте параметр `navigation`. Это позволяет указать, какую страницу данных необходимо загрузить.

```javascript
BX.ajax.runAction('vendor:someController.listChildren', {
data: {
    folderId: 12 
},
navigation: {
    page: 3
}
});
```

### Оптимизация подсчета записей

В `Response\DataType\Page($id, $items, $totalCount)` параметр `$totalCount` может быть числом или `\Closure`. Это позволяет отложить вычисление общего количества записей, что повышает производительность.

## Внедрение зависимостей

Внедрение зависимостей позволяет автоматически передавать объекты и параметры в методы действий контроллеров.

### Автоматическое извлечение параметров

Скалярные параметры, такие как `$userId`, `$newName`, `$groups`, автоматически извлекаются из REQUEST. Если параметр не найден и не имеет значения по умолчанию, действие не будет запущено, и сервер отправит сообщение об ошибке.

```php
public function renameUserAction($userId, $newName = 'guest', array $groups = array(2))
{
	$user = User::getById($userId);
	$user->rename($newName);

	return $user;
}
```

### Внедрение стандартных объектов

По умолчанию можно внедрять объекты, такие как `\Bitrix\Main\Engine\CurrentUser`, `\Bitrix\Main\UI\PageNavigation`, и `\CRestServer`. Имя параметра может быть произвольным, связывание происходит по классу.

### Внедрение пользовательских типов

Для внедрения своих типов объектов используйте метод `getPrimaryAutoWiredParameter`, который возвращает объект `ExactParameter`. Это позволяет автоматически создавать объекты на основе переданных данных.

```php
class Folder extends Controller
{
	public function getPrimaryAutoWiredParameter()
	{
	    return new ExactParameter(
	        Folder::class,
	        'folder',
	        function($className, $id) {
	            return Folder::loadById($id);
	        }
	    );
	}

	public function renameAction(Folder $folder);

	public function downloadAction(Folder $folder);

	public function deleteAction(Folder $folder);
}
```

### Вызов в JavaScript

При вызове действий с внедрением зависимостей в JavaScript необходимо передавать идентификаторы объектов, которые будут использоваться для создания экземпляров.

```javascript
BX.ajax.runAction('folder.rename', {
data: {
    id: 1 
}
});
```

### Множественное внедрение

Если требуется описать несколько параметров для создания, используйте метод `getAutoWiredParameters`. Это позволяет гибко настраивать внедрение нескольких объектов в одно действие.

## Часто встречающиеся ошибки

**Не найден обязательный параметр**

Решение: убедиться, что все обязательные параметры передаются в запросе. Проверьте, что параметры указаны в `$_POST` или `$_GET`, и их имена соответствуют ожидаемым.

**Неверный тип параметра**

Решение: проверить, что передаваемые параметры соответствуют ожидаемым типам. Используйте type-hinting для автоматической проверки типов.

**Не удалось создать объект**

Решение: убедиться, что функция создания объекта возвращает корректный экземпляр. Проверьте, что все необходимые данные для создания объекта передаются в запросе.

**Проблемы с подписанными параметрами**

Решение: убедиться, что подписанные параметры корректно передаются и проверяются. Используйте метод `getUnsignedParameters()` для работы с ними внутри контроллера.
