---
title: Провайдеры данных в ui.entity-selector
description: "Провайдеры данных в ui.entity-selector. Регистрация типа объекта, глобальные настройки типа объекта и методы Bitrix\\UI\\EntitySelector\\BaseProvider."
---

Провайдер данных — PHP-класс, который загружает элементы для `Dialog` с сервера. Провайдер нужен, когда список нельзя передать локально в `items`: данные зависят от прав пользователя, поисковой строки, выбранного контекста или внешнего хранилища.

Провайдер может заполнить диалог элементами и вкладками, выполнить поиск, вернуть заранее выбранные элементы и загрузить дочерние элементы древовидной структуры.

Для пользователей, отделов, проектов, чатов и чат-ботов провайдер уже зарегистрирован в Bitrix Framework. Эти типы объектов описаны в статье [Стандартные провайдеры](./standard-providers.md). Собственный провайдер нужен для типа объекта, которого нет среди стандартных.

## Зарегистрировать тип объекта {#register-entity}

Добавьте тип объекта в настройки модуля в ключ `ui.entity-selector`.

PHP-файл конфигурации модуля возвращает настройки, которые Bitrix Framework читает при регистрации модуля. В примере показан только фрагмент массива с настройкой `ui.entity-selector`.

```php
<?php

return [
    'ui.entity-selector' => [
        'value' => [
            'entities' => [
                [
                    'entityId' => 'project',
                    'provider' => [
                        'moduleId' => 'my.module',
                        'className' => \My\Module\Integration\UI\EntitySelector\ProjectProvider::class,
                    ],
                ],
            ],
            'extensions' => [
                'my.module.entity-selector',
            ],
        ],
        'readonly' => true,
    ],
];
```

`entityId` должен совпадать с `id` в JavaScript-массиве `entities`. По этому значению серверная часть находит провайдер.

`extensions` подключает JavaScript-расширения, в которых можно определить глобальные настройки типа объекта, классы футеров, заголовков или заглушек.

| Путь в настройках | Тип | Обязательный | Назначение |
| --- | --- | --- | --- |
| `ui.entity-selector.value.entities[].entityId` | `string` | да | Идентификатор типа объекта для серверного поиска провайдера |
| `ui.entity-selector.value.entities[].provider.moduleId` | `string` | да | Модуль, в котором находится класс провайдера |
| `ui.entity-selector.value.entities[].provider.className` | `string` | да | Полное имя PHP-класса провайдера |
| `ui.entity-selector.value.extensions` | `string[]` | нет | JavaScript-расширения с глобальными настройками типа объекта |
| `ui.entity-selector.readonly` | `boolean` | нет | Защищает настройку от изменения после регистрации |

## Задать глобальные настройки типа объекта

Глобальные настройки типа объекта задаются в `config.php` JavaScript-расширения. В `settings.entities` передайте массив настроек.

Ключи `dynamicLoad`, `dynamicSearch` и остальные параметры типа объекта передавайте внутри `options`. JavaScript-часть расширения читает только `id` и `options` этого элемента массива, остальные соседние ключи она игнорирует.

```php
<?php

if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
    die();
}

return [
    'settings' => [
        'entities' => [
            [
                'id' => 'project',
                'options' => [
                    'dynamicLoad' => true,
                    'dynamicSearch' => true,
                    'searchFields' => [
                        [
                            'name' => 'code',
                            'type' => 'string',
                        ],
                    ],
                    'itemOptions' => [
                        'default' => [
                            'avatar' => '/local/images/project.svg',
                            'link' => '/projects/#id#/',
                        ],
                    ],
                    'tagOptions' => [
                        'default' => [
                            'textColor' => '#1066bb',
                            'bgColor' => '#bcedfc',
                        ],
                    ],
                ],
            ],
        ],
    ],
];
```

Глобальные настройки применяются к типу объекта во всех диалогах. Локальные настройки из `entities` при создании `Dialog` уточняют сценарий конкретной формы.

## Настроить фильтры типа объекта

Фильтр — PHP-класс, который наследует `Bitrix\UI\EntitySelector\BaseFilter` и изменяет набор элементов после загрузки провайдером. Используйте фильтр, когда один и тот же тип объекта нужно ограничивать по дополнительным правилам конкретного сценария.

Зарегистрируйте фильтр в настройках модуля. `entityId` должен совпадать с типом объекта, к которому применяется фильтр. `id` фильтра передается в JavaScript-настройках `entities[].filters`.

```php
<?php

return [
    'ui.entity-selector' => [
        'value' => [
            'filters' => [
                [
                    'entityId' => 'user',
                    'id' => 'my.module.activeUsers',
                    'className' => \My\Module\Integration\UI\EntitySelector\ActiveUsersFilter::class,
                ],
            ],
        ],
        'readonly' => true,
    ],
];
```

```js
const dialog = new Dialog({
    targetNode: button,
    entities: [
        {
            id: 'user',
            filters: [
                {
                    id: 'my.module.activeUsers',
                    options: {
                        departmentId: 15,
                    },
                },
            ],
        },
    ],
});
```

Класс фильтра должен реализовать `isAvailable()` и `apply(array $items, Dialog $dialog)`. В `apply()` передается массив элементов текущего типа объекта, которые уже добавлены в диалог.

```php
<?php

namespace My\Module\Integration\UI\EntitySelector;

use Bitrix\UI\EntitySelector\BaseFilter;
use Bitrix\UI\EntitySelector\Dialog;

final class ActiveUsersFilter extends BaseFilter
{
    public function isAvailable(): bool
    {
        return true;
    }

    public function apply(array $items, Dialog $dialog): void
    {
        foreach ($items as $item)
        {
            if ($item->getCustomData()->get('active') !== true)
            {
                $item->setHidden();
            }
        }
    }
}
```

## Создать провайдер

Класс провайдера наследуется от `Bitrix\UI\EntitySelector\BaseProvider`. Минимально он должен реализовать `isAvailable()` и `getItems()`.

```php
<?php

namespace My\Module\Integration\UI\EntitySelector;

use Bitrix\UI\EntitySelector\BaseProvider;
use Bitrix\UI\EntitySelector\Dialog;
use Bitrix\UI\EntitySelector\Item;
use Bitrix\UI\EntitySelector\SearchQuery;
use Bitrix\UI\EntitySelector\Tab;

final class ProjectProvider extends BaseProvider
{
    private const ITEMS = [
        1 => 'Проект внедрения',
        2 => 'Поддержка сайта',
    ];

    private array $options = [];

    public function __construct(array $options = [])
    {
        parent::__construct();

        $this->options = $options;
    }

    public function isAvailable(): bool
    {
        return true;
    }

    public function getItems(array $ids): array
    {
        $items = [];

        foreach ($ids as $id)
        {
            if (!isset(self::ITEMS[$id]))
            {
                continue;
            }

            $items[] = new Item([
                'id' => $id,
                'entityId' => 'project',
                'title' => self::ITEMS[$id],
                'tabs' => 'projects',
            ]);
        }

        return $items;
    }

    public function fillDialog(Dialog $dialog): void
    {
        $dialog->addTab(new Tab([
            'id' => 'projects',
            'title' => 'Проекты',
        ]));

        foreach (self::ITEMS as $id => $title)
        {
            $dialog->addItem(new Item([
                'id' => $id,
                'entityId' => 'project',
                'title' => $title,
                'tabs' => 'projects',
            ]));
        }
    }

    public function doSearch(SearchQuery $searchQuery, Dialog $dialog): void
    {
        $query = mb_strtolower($searchQuery->getQuery());

        foreach (self::ITEMS as $id => $title)
        {
            if ($query !== '' && mb_strpos(mb_strtolower($title), $query) === false)
            {
                continue;
            }

            $dialog->addItem(new Item([
                'id' => $id,
                'entityId' => 'project',
                'title' => $title,
                'tabs' => 'projects',
            ]));
        }
    }
}
```

`isAvailable()` должен учитывать права текущего пользователя. Если метод вернет `false`, серверная часть не использует провайдер.

## Как JavaScript связан с PHP {#js-php}

Серверная часть не вызывает все методы провайдера сразу. Нужный метод зависит от настроек, которые переданы в `Dialog`, и от действия пользователя в интерфейсе.

| JavaScript-настройка | PHP API | Что происходит |
| --- | --- | --- |
| `entities[].dynamicLoad` | `BaseProvider::fillDialog(Dialog $dialog)` | Провайдер заполняет диалог элементами и вкладками при загрузке |
| `entities[].dynamicSearch` | `BaseProvider::doSearch(SearchQuery $searchQuery, Dialog $dialog)` | Провайдер добавляет найденные элементы в серверное представление диалога |
| `preselectedItems` | `BaseProvider::getPreselectedItems(array $ids)` | Провайдер возвращает данные заранее выбранных элементов по идентификаторам |
| Динамические дочерние элементы | `BaseProvider::getChildren(Item $parentItem, Dialog $dialog)` | Провайдер добавляет дочерние элементы для узла дерева |
| Недавние элементы и `context` | `Dialog::getRecentItems()`, `Dialog::getGlobalRecentItems()` | Провайдер получает локальную и глобальную историю выбора пользователя |

## Методы BaseProvider {#methods}

| Метод | Что делает |
| --- | --- |
| `isAvailable()` | Возвращает `true`, если провайдер доступен текущему пользователю и сценарию |
| `getItems(array $ids)` | Возвращает массив `Item` для переданных идентификаторов |
| `getPreselectedItems(array $ids)` | Возвращает заранее выбранные элементы |
| `getOptions()` | Возвращает параметры провайдера |
| `getOption(string $option, $defaultValue = null)` | Возвращает один параметр провайдера или значение по умолчанию |
| `fillDialog(Dialog $dialog)` | Добавляет вкладки и элементы в диалог при загрузке |
| `getChildren(Item $parentItem, Dialog $dialog)` | Добавляет дочерние элементы для древовидных типов объектов |
| `doSearch(SearchQuery $searchQuery, Dialog $dialog)` | Добавляет найденные элементы при серверном поиске |
| `handleBeforeItemSave(Item $item)` | Изменяет элемент перед сохранением в недавних |

`getPreselectedItems()` возвращает элементы, которые уже сохранены в форме и должны отображаться как выбранные.

Метод используют, когда сохраненное значение нужно показать в интерфейсе, но элемент не должен попадать в обычный список выбора. Например, при редактировании записи можно показать ранее выбранного уволенного сотрудника и не показывать его во вкладке недавних элементов или в структуре компании.

Если в вашем типе объекта нет разной видимости для выбора и для уже сохраненных значений, `getPreselectedItems()` может возвращать те же элементы, что и `getItems()`.

```php
public function getPreselectedItems(array $ids): array
{
    return $this->loadUsers($ids, [
        'includeInactive' => true,
    ]);
}

public function getItems(array $ids): array
{
    return $this->loadUsers($ids, [
        'activeOnly' => true,
    ]);
}
```

## SearchQuery {#searchquery}

`SearchQuery` содержит поисковую строку, разобранные слова запроса и флаг кеширования. Диалог создает объект и передает его в `doSearch(SearchQuery $searchQuery, Dialog $dialog)`.

| Метод | Что делает |
| --- | --- |
| `getQuery()` | Возвращает нормализованную поисковую строку |
| `getRawQuery()` | Возвращает исходную поисковую строку |
| `getQueryWords()` | Возвращает слова поискового запроса |
| `isCacheable()` | Возвращает `true`, если ответ можно кешировать |
| `setCacheable(bool $flag = true)` | Разрешает или запрещает кеширование текущего ответа |

## PHP Dialog {#php-dialog}

`Bitrix\UI\EntitySelector\Dialog` — серверное представление диалога. Провайдер получает объект в методах `fillDialog()`, `doSearch()` и `getChildren()` и добавляет в него элементы, вкладки, ошибки, заголовок или футер.

| Метод | Что делает |
| --- | --- |
| `getId()` | Возвращает идентификатор диалога |
| `getContext()` | Возвращает контекст недавних элементов |
| `getCurrentUserId()` | Возвращает идентификатор текущего пользователя |
| `addItem(Item $item)` | Добавляет один элемент в диалог |
| `addItems(array $items)` | Добавляет массив элементов в диалог |
| `getItemCollection()` | Возвращает коллекцию элементов диалога |
| `addRecentItem(Item $item)` | Добавляет один элемент на вкладку недавних элементов |
| `addRecentItems(array $items)` | Добавляет массив элементов на вкладку недавних элементов |
| `getRecentItems()` | Возвращает недавние элементы текущего `context` |
| `getGlobalRecentItems()` | Возвращает недавние элементы из других контекстов |
| `cleanRecentItems()` | Очищает коллекцию недавних элементов диалога |
| `setHeader(string $header, array $options = [])` | Задает заголовок диалога |
| `getHeader()` | Возвращает заголовок диалога |
| `setFooter(string $footer, array $options = [])` | Задает футер диалога |
| `getFooter()` | Возвращает футер диалога |
| `addTab(Tab $tab)` | Добавляет вкладку в диалог |
| `getTabs()` | Возвращает вкладки диалога |
| `getTab(string $tabId)` | Возвращает вкладку по идентификатору |
| `addEntity(Entity $entity)` | Добавляет тип объекта в диалог |
| `getEntities()` | Возвращает типы объектов диалога |
| `getEntity(string $entityId)` | Возвращает тип объекта по идентификатору |
| `setCustomData(array $customData)` | Задает дополнительные данные сценария |
| `getCustomData()` | Возвращает дополнительные данные сценария |
| `load()` | Загружает данные через провайдеры типов объектов |
| `doSearch(SearchQuery $searchQuery)` | Запускает серверный поиск по зарегистрированным типам объектов |
| `getChildren(Item $parentItem)` | Загружает дочерние элементы для переданного элемента |
| `setPreselectedItems(array $preselectedItems)` | Задает заранее выбранные элементы |
| `loadPreselectedItems()` | Загружает заранее выбранные элементы |
| `shouldClearUnavailableItems()` | Возвращает `true`, если недоступные элементы нужно удалить из недавних |
| `getErrors()` | Возвращает ошибки типов объектов |
| `addError(EntityError $error)` | Добавляет ошибку типа объекта |
| `saveRecentItems(array $recentItems)` | Сохраняет выбранные элементы в историю недавних |

```php
public function fillDialog(Dialog $dialog): void
{
    $dialog->addTab(new Tab([
        'id' => 'projects',
        'title' => 'Проекты',
    ]));

    $dialog->addItem(new Item([
        'id' => 1,
        'entityId' => 'project',
        'title' => 'Проект внедрения',
        'tabs' => 'projects',
    ]));
}
```

## ItemCollection {#itemcollection}

`Bitrix\UI\EntitySelector\ItemCollection` хранит элементы диалога на сервере. Коллекцию возвращает `Dialog::getItemCollection()`.

| Метод | Что делает |
| --- | --- |
| `add(Item $item)` | Добавляет элемент в коллекцию. Возвращает `false`, если элемент с таким `entityId` и `id` уже есть |
| `get(string $entityId, $itemId)` | Возвращает элемент по идентификатору типа объекта и идентификатору элемента |
| `has(Item $item)` | Возвращает `true`, если элемент уже есть в коллекции |
| `getAll()` | Возвращает массив всех элементов |
| `count()` | Возвращает количество элементов |
| `getEntityItems(string $entityId)` | Возвращает элементы одного типа объекта |
| `toArray()` | Возвращает элементы как массивы для передачи на клиент |
| `toJsObject()` | Возвращает JavaScript-представление массива элементов |

## RecentCollection {#recentcollection}

`Bitrix\UI\EntitySelector\RecentCollection` хранит элементы вкладки «Последние». Коллекции создаются автоматически и доступны в провайдере через `Dialog::getRecentItems()` и `Dialog::getGlobalRecentItems()`.

Для добавления элементов во вкладку «Последние» используйте `Dialog::addRecentItem()` или `Dialog::addRecentItems()`.

| Метод | Что делает |
| --- | --- |
| `add(RecentItem $recentItem)` | Добавляет элемент в коллекцию, если такого элемента еще нет |
| `get(string $entityId, $itemId)` | Возвращает элемент по идентификатору типа объекта и идентификатору элемента |
| `has(RecentItem $recentItem)` | Возвращает `true`, если элемент уже есть в коллекции |
| `clear()` | Очищает коллекцию |
| `getByItem(Item $item)` | Возвращает недавний элемент по элементу диалога |
| `getAll()` | Возвращает массив всех недавних элементов |
| `count()` | Возвращает количество недавних элементов |
| `getEntityItems(string $entityId)` | Возвращает недавние элементы одного типа объекта |

При сериализации коллекция возвращает только элементы, для которых `RecentItem::isLoaded()` и `RecentItem::isAvailable()` возвращают `true`.

## RecentItem {#recentitem}

`Bitrix\UI\EntitySelector\RecentItem` представляет один элемент вкладки «Последние». Обычно объект создается внутри `Dialog::addRecentItem()` или `Dialog::addRecentItems()`.

В конструктор передается массив с полями:

| Поле | Тип | Что делает |
| --- | --- | --- |
| `id` | `string` или `int` | Идентификатор элемента внутри типа объекта |
| `entityId` | `string` | Идентификатор типа объекта. Значение приводится к нижнему регистру |
| `loaded` | `boolean` | Помечает элемент как загруженный |
| `available` | `boolean` | Помечает элемент как доступный для показа |
| `lastUseDate` | `int` | Дата последнего выбора элемента |

| Метод | Что делает |
| --- | --- |
| `getId()` | Возвращает идентификатор элемента |
| `getEntityId()` | Возвращает идентификатор типа объекта |
| `getLastUseDate()` | Возвращает дату последнего выбора |
| `setLastUseDate(int $lastUseDate)` | Задает дату последнего выбора |
| `isLoaded()` | Возвращает `true`, если элемент загружен |
| `setLoaded(bool $flag)` | Задает признак загруженного элемента |
| `isAvailable()` | Возвращает `true`, если элемент доступен для показа |
| `setAvailable(bool $flag)` | Задает доступность элемента для показа |

При сериализации `RecentItem` возвращает пару `[entityId, id]`.

## PHP Item {#php-item}

`Bitrix\UI\EntitySelector\Item` — серверное представление элемента. Провайдер создает такие объекты и передает их в `Dialog::addItem()` или возвращает из `getItems()` и `getPreselectedItems()`.

| Метод | Что делает |
| --- | --- |
| `getId()` | Возвращает идентификатор элемента |
| `getEntityId()` | Возвращает идентификатор типа объекта |
| `getEntityType()` | Возвращает тип элемента внутри объекта |
| `setEntityType(string $type)` | Задает тип элемента внутри объекта |
| `getTitle()` | Возвращает заголовок |
| `setTitle($title)` | Задает заголовок |
| `getSubtitle()` | Возвращает подзаголовок |
| `setSubtitle($subtitle)` | Задает подзаголовок |
| `getSupertitle()` | Возвращает текст над заголовком |
| `setSupertitle($supertitle)` | Задает текст над заголовком |
| `getCaption()` | Возвращает подпись |
| `setCaption($caption)` | Задает подпись |
| `setCaptionOptions(array $captionOptions)` | Задает параметры подписи |
| `getCaptionOptions()` | Возвращает параметры подписи |
| `getAvatar()` | Возвращает аватар |
| `setAvatar(?string $avatar)` | Задает аватар |
| `setAvatarOptions(array $avatarOptions)` | Задает параметры аватара |
| `getAvatarOptions()` | Возвращает параметры аватара |
| `getTextColor()` | Возвращает цвет текста |
| `setTextColor(?string $textColor)` | Задает цвет текста |
| `getLink()` | Возвращает ссылку элемента |
| `setLink(?string $link)` | Задает ссылку элемента |
| `getBadges()` | Возвращает бейджи |
| `addBadges(array $badges)` | Добавляет бейджи |
| `setBadges(array $badges)` | Задает бейджи |
| `getTabs()` | Возвращает вкладки элемента |
| `addTab($tabId)` | Добавляет вкладку элемента |
| `getChildren()` | Возвращает дочерние элементы |
| `addChildren(array $children)` | Добавляет массив дочерних элементов |
| `addChild(Item $item)` | Добавляет дочерний элемент |
| `setNodeOptions(array $nodeOptions)` | Задает параметры DOM-узла |
| `getNodeOptions()` | Возвращает параметры DOM-узла |
| `setTagOptions(array $nodeOptions)` | Задает параметры тега |
| `getTagOptions()` | Возвращает параметры тега |
| `isSelected()` | Возвращает `true`, если элемент выбран |
| `setSelected(bool $flag = true)` | Задает выбранное состояние |
| `isSearchable()` | Возвращает `true`, если элемент участвует в поиске |
| `setSearchable(bool $flag = true)` | Управляет участием элемента в поиске |
| `isSaveable()` | Возвращает `true`, если элемент сохраняется в недавних |
| `setSaveable(bool $flag = true)` | Управляет сохранением элемента в недавних |
| `isDeselectable()` | Возвращает `true`, если с элемента можно снять выбор |
| `setDeselectable(bool $flag = true)` | Управляет возможностью снять выбор |
| `isHidden()` | Возвращает `true`, если элемент скрыт |
| `setHidden(bool $flag = true)` | Управляет видимостью |
| `isLocked()` | Возвращает `true`, если элемент заблокирован |
| `setLocked(bool $flag = true)` | Управляет блокировкой |
| `setCustomData(array $customData)` | Задает пользовательские данные элемента |
| `getCustomData()` | Возвращает пользовательские данные элемента |
| `setSort(?int $sort)` | Задает сортировку |
| `getSort()` | Возвращает сортировку |
| `setDialog(Dialog $dialog)` | Привязывает элемент к серверному диалогу |
| `getDialog()` | Возвращает серверный диалог элемента |
| `toArray()` | Возвращает массив для передачи на клиент |

## PHP Tab {#php-tab}

`Bitrix\UI\EntitySelector\Tab` — серверное представление вкладки. Провайдер создает вкладки в `fillDialog()` и добавляет их в диалог через `Dialog::addTab()`.

| Метод | Что делает |
| --- | --- |
| `getId()` | Возвращает идентификатор вкладки |
| `getTitle()` | Возвращает название вкладки |
| `setTitle($title)` | Задает название вкладки |
| `getIcon()` | Возвращает иконку вкладки |
| `setIcon(array $icon)` | Задает иконку вкладки |
| `getTextColor()` | Возвращает цвет текста |
| `setTextColor(array $textColor)` | Задает цвет текста |
| `getBgColor()` | Возвращает цвет фона |
| `setBgColor(array $bgColor)` | Задает цвет фона |
| `setVisible(bool $flag)` | Управляет видимостью вкладки |
| `isVisible()` | Возвращает `true`, если вкладка видима |
| `setItemOrder(array $order)` | Задает сортировку элементов на вкладке |
| `getItemOrder()` | Возвращает сортировку элементов на вкладке |
| `setItemMaxDepth(int $depth)` | Задает максимальную глубину вложенности |
| `getItemMaxDepth()` | Возвращает максимальную глубину вложенности |
| `setStub($stub)` | Задает заглушку вкладки |
| `getStub()` | Возвращает заглушку вкладки |
| `setStubOptions(array $options)` | Задает параметры заглушки |
| `getStubOptions()` | Возвращает параметры заглушки |
| `setHeader(string $header, array $options = [])` | Задает заголовок вкладки |
| `getHeader()` | Возвращает заголовок вкладки |
| `enableDefaultHeader()` | Включает показ стандартного заголовка |
| `disableDefaultHeader()` | Отключает показ стандартного заголовка |
| `canShowDefaultHeader()` | Возвращает `true`, если можно показать стандартный заголовок |
| `setFooter(string $footer, array $options = [])` | Задает футер вкладки |
| `getFooter()` | Возвращает футер вкладки |
| `enableDefaultFooter()` | Включает показ стандартного футера |
| `disableDefaultFooter()` | Отключает показ стандартного футера |
| `canShowDefaultFooter()` | Возвращает `true`, если можно показать стандартный футер |
| `setShowAvatars(bool $flag)` | Управляет показом аватаров на вкладке |
| `getShowAvatars()` | Возвращает настройку показа аватаров на вкладке |

## PHP Entity {#php-entity}

`Bitrix\UI\EntitySelector\Entity` — серверное представление типа объекта. Сервер создает его по настройкам `entities` и связывает с провайдером.

| Метод | Что делает |
| --- | --- |
| `Entity::create(array $entityOptions)` | Создает тип объекта по массиву настроек |
| `getId()` | Возвращает идентификатор типа объекта |
| `getOptions()` | Возвращает параметры провайдера |
| `getProvider()` | Возвращает провайдер типа объекта |
| `setProvider(BaseProvider $provider)` | Задает провайдер типа объекта |
| `getSubstituteEntityId()` | Возвращает идентификатор типа объекта-замены |
| `getFilters()` | Возвращает фильтры |
| `addFilter(BaseFilter $filter)` | Добавляет фильтр |
| `isSearchable()` | Возвращает `true`, если тип объекта участвует в поиске |
| `setSearchable(bool $flag = true)` | Управляет участием типа объекта в поиске |
| `hasDynamicSearch()` | Возвращает `true`, если включен серверный поиск |
| `setDynamicSearch(bool $flag = true)` | Управляет серверным поиском |
| `hasDynamicLoad()` | Возвращает `true`, если включена серверная загрузка |
| `setDynamicLoad(bool $flag = true)` | Управляет серверной загрузкой |
| `shouldFillRecentItems()` | Возвращает `true`, если провайдер может заполнять недавние элементы |

## Подключить провайдер в JavaScript

Передайте тип объекта в `entities`. Для начальной загрузки используйте `dynamicLoad`, для серверного поиска — `dynamicSearch`.

```js
import { Dialog } from 'ui.entity-selector';

const button = document.getElementById('project-selector-button');

if (button)
{
    const dialog = new Dialog({
        targetNode: button,
        context: 'MY_MODULE_PROJECTS',
        enableSearch: true,
        entities: [
            {
                id: 'project',
                dynamicLoad: true,
                dynamicSearch: true,
            },
        ],
        preselectedItems: [
            ['project', 1],
        ],
    });
}
```

При открытии диалога сервер найдет провайдер типа объекта `project` и загрузит элементы. При поиске диалог вызовет метод `doSearch()` провайдера.

Если провайдер не подключается, проверьте:

- `entities[].id` в JavaScript совпадает с `entityId` в настройках модуля;
- класс провайдера доступен в модуле из `provider.moduleId`;
- `isAvailable()` возвращает `true` для текущего пользователя и сценария;
- для начальной загрузки включен `dynamicLoad`, для серверного поиска — `dynamicSearch`;
- стандартный тип объекта не требует собственного провайдера, используйте `entityId` из статьи [Стандартные провайдеры](./standard-providers.md).
