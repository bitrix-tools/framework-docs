---
title: Создание контроллера
description: 'Создание контроллера. Пошаговое руководство по началу работы с Bitrix: установка, структура проектов и базовые принципы.'
---

Контроллер в Bitrix Framework -- это PHP-класс, который обрабатывает AJAX-запросы от браузера. Он получает данные, выполняют бизнес-логику и формирует ответ.

В статье приведен пример, как в компонент `my:user.card` добавить функционал лайков. Для этого создадим контроллер, который будет:

-  принимать запросы на добавление и удаление лайков,

-  сохранять отметки в cookie-файлах,

-  возвращать текущее состояние.

{% note tip "" %}

Пример основан на модуле `my.module` и компоненте `my:user.card`, которые описаны в статьях:

-  [Создание модуля](./create-module)

-  [Создание компонента](./create-component)

{% endnote %}

## Как работает вызов контроллера

Bitrix Framework связывает JavaScript-вызов и PHP-метод по имени -- без дополнительной настройки. Это работает, когда соблюдаете три правила:

-  размещаете контроллер в папке `/lib/controller/` модуля,

-  объявляете класс в правильном пространстве имен,

-  вызываете действие контроллера по шаблону `vendor:module.ControllerName.actionName`.

В примере модуль называется `my.module`. Bitrix Framework преобразует его имя в пространство имен. Первая часть `my` становится `My`, вторая `module` -- `Module`, итого: `My\Module`.

Создайте файл контроллера, например, `/lib/controller/user.php` со следующим содержимым:

```php
namespace My\Module\Controller;

class User extends \Bitrix\Main\Engine\Controller
{
    public function likeAction()
    {
        // …
    }
}
```

Теперь можно вызвать метод из JavaScript:

```javascript
BX.ajax.runAction('my:module.user.like', { /* данные */ });
```

Система разбирает имя действия по частям:

-  `my` -- первая часть символьного кода модуля `my.module`,

-  `module` -- вторая часть символьного кода,

-  `user` -- имя класса контроллера `User` в нижнем регистре,

-  `like` -- имя метода `likeAction()` без суффикса `Action`.

В результате система находит класс `\My\Module\Controller\User` и запускает метод `likeAction()`.

Сопоставление работает, если в файле модуля `.settings.php` указан параметр `defaultNamespace`. Без этого Bitrix Framework не найдет класс и вернет ошибку.

{% note tip "" %}

Подробнее о правилах читайте в статье [Контроллеры](./../framework/controllers).

{% endnote %}

## Структура модуля с контроллером

В структуре модуля `my.module` создайте файлы контроллера:

-  `/lib/Services/LikeService.php` -- для класса-сервиса лайков,

-  `/lib/controller/user.php` -- для описания контроллера.

```
/local/modules/my.module/
├── install/
│   ├── components/
│   │   └── my/
│   │       └── user.card/          // Компонент карточки пользователя
│   │           ├── .description.php
│   │           ├── .parameters.php
│   │           ├── class.php
│   │           ├── templates/
│   │           │   └── .default/
│   │           │       ├── template.php
│   │           │       ├── script.js
│   │           │       └── style.css
│   │           └── lang/
│   │               └── ru/
│   │                   └── messages.php
│   ├── index.php                   // Файл установки
│   └── version.php                 // Версия модуля
├── lib/
│   ├── controller/
│   │   └── user.php                // Контроллер для обработки лайков
│   └── Services/
│       └── LikeService.php         // Сервис для бизнес-логики
├── lang/
│   └── ru/
│       ├── install/
│       │   └── index.php           // Языковой файл установки
│       └── messages.php            // Общие языковые файлы
└── .settings.php                   // Настройка пространства имен контроллеров
```

## Сервис для бизнес-логики

В файле `/lib/Services/LikeService.php` опишите класс `LikeService` для реализации логики работы с лайками. Чтобы обрабатывать лайки пользователей, добавьте в класс:

-  константу `COOKIE_NAME` -- имя cookie для хранения `ID` пользователей, в чьих карточках поставлены лайки.

-  метод `isLiked` -- проверяет, поставлен ли лайк в карточке пользователя с идентификатором `userId`.

-  метод `likeUser` -- добавляет идентификатор пользователя в список пользователей, в чьих карточках поставлен лайк. Если пользователь уже в списке, он не будет добавлен повторно.

-  метод `dislikeUser` -- удаляет идентификатор пользователя из списка пользователей, которым поставлен лайк.

-  метод `getLikedUsersIds` -- извлекает и декодирует список идентификаторов пользователей из cookie.

-  метод `setLikedUsersIds` -- кодирует массив идентификаторов пользователей в формат JSON и сохраняет его в cookie, которые будут храниться 30 дней.

```php
<?php

namespace My\Module\Services;

use Bitrix\Main\ArgumentException;
use Bitrix\Main\Context;
use Bitrix\Main\Web\Cookie;
use Bitrix\Main\Web\Json;

class LikeService
{
    private const COOKIE_NAME = 'liked_users';

    public function isLiked(int $userId): bool
    {
        return in_array($userId, $this->getLikedUsersIds());
    }

    public function likeUser(int $userId): void
    {
        $likedUsers = $this->getLikedUsersIds();
        $likedUsers[] = $userId;

        $this->setLikedUsersIds(
            array_unique($likedUsers)
        );
    }

    public function dislikeUser(int $userId): void
    {
        $likedUsers = array_filter($this->getLikedUsersIds(), static fn($i) => (int)$i !== $userId);

        $this->setLikedUsersIds(
            array_unique($likedUsers)
        );
    }

    private function getLikedUsersIds(): array
    {
        try
        {
            $cookieValue = Context::getCurrent()->getRequest()->getCookie(self::COOKIE_NAME);
            if (empty($cookieValue))
            {
                return [];
            }

            $value = Json::decode($cookieValue);
            if (!is_array($value))
            {
                return [];
            }

            return $value;
        }
        catch (ArgumentException)
        {
            return [];
        }
    }

    private function setLikedUsersIds(array $likedUsers): void
    {
        Context::getCurrent()->getResponse()->addCookie(
            new Cookie(
                self::COOKIE_NAME,
                Json::encode($likedUsers),
                time() + 60 * 60 * 24 * 30 // 30 days
            )
        );
    }
}
```

## Контроллер обработки лайков

В файле `/lib/controller/user.php` опишите контроллер `User`, который управляет действиями для обработки лайков.

Контроллер наследуется от `\Bitrix\Main\Engine\Controller`. Он не содержит бизнес-логику -- только маршрутизацию, валидацию и вызов сервиса.

Добавьте два метода:

-  `getDefaultPreFilters` -- определяет стандартные фильтры для всех действий,

-  `likeAction` -- обрабатывает действие лайка пользователя.

```php
<?php

namespace My\Module\Controller;

use Bitrix\Main\Engine\Controller;
use Bitrix\Main\Engine\ActionFilter;
use Bitrix\Main\Error;
use My\Module\Services\LikeService;

class User extends Controller
{
    /**
     * Настройка фильтров для действий
     *
     * @return array
     */
    protected function getDefaultPreFilters()
    {
        return [
            // Разрешает запросы только авторизованным пользователям
            new ActionFilter\Authentication(),

            // Принимает только POST-запросы
            new ActionFilter\HttpMethod([
                ActionFilter\HttpMethod::METHOD_POST,
            ]),

            // Проверяет CSRF-токен — защищает от подделки запроса
            new ActionFilter\Csrf(),
        ];
    }

    /**
     * Действие для обработки лайков
     *
     * @param  int $likedUserId
     *
     * @return void
     */
    public function likeAction(LikeService $service, int $likedUserId)
    {
        // Базовая валидация: ID должен быть положительным целым
        if ($likedUserId < 1)
        {
            $this->addError(new Error('Неверный ID пользователя'));

            return null;
        }

        // Если лайка нет — добавляем, иначе удаляем
        $isLikeAction = !$service->isLiked($likedUserId);
        if ($isLikeAction)
        {
            $service->likeUser($likedUserId);
        }
        else
        {
            $service->dislikeUser($likedUserId);
        }

        // Возвращаем состояние после изменения
        return [
            'liked' => $isLikeAction,
        ];
    }
}
```

## Интеграция с компонентом

Компонент `my:user.card` был создан [ранее](./create-component). Чтобы показывать информацию о лайках, внесите изменения в файлы компонента.

### Шаблон template.php

В файле `/install/components/my/user.card/templates/.default/template.php` добавьте блок лайка с текстом Нравится.

-  Атрибут `data-user-id` хранит идентификатор пользователя, карточку которого лайкают. Он нужен JavaScript.

-  Класс `my-user-card__like-text--liked` определяет внешний вид активного лайка.

```php
<?php
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
die();

use Bitrix\Main\Localization\Loc;

/**
 * @var array $arParams
 * @var array $arResult
 * @var CMain $APPLICATION
 * @var CBitrixComponent $component
 * @var CBitrixComponentTemplate $this
 */

$additionalUserCardContainers = $arResult['HAS_LIKE'] ? 'my-user-card__like-text--liked' : '';

?>

<div class="my-user-card">
    <?php if (isset($arResult['PERSONAL_PHOTO_SRC'])): ?>
    <div class="my-user-card__avatar">
        <img
            class="js-my-user-card-avatar-show-in-new-page"
            src="<?= $arResult['PERSONAL_PHOTO_SRC'] ?>"
            alt="<?= $arResult['NAME'] ?>"
        >
    </div>
    <?php endif; ?>
    
    <div class="my-user-card__info">
        <h2 class="my-user-card__name">
            <?= $arResult['NAME'] ?>
        </h2>
        
        <?php if ($arParams['SHOW_EMAIL'] === 'Y'): ?>
        <p class="my-user-card__email">
            <span><?= Loc::getMessage('USER_CARD_EMAIL_LABEL') ?></span>
            <span><?= $arResult['EMAIL'] ?></span>
        </p>
        <?php endif; ?>
    </div>
    <?php if ($USER->IsAuthorized()): ?>
    <div class="my-user-card__like-container">
        <span 
            class="my-user-card__like-text js-my-user-card-like <?= $additionalUserCardContainers ?>"
            data-user-id="<?= $arParams['USER_ID'] ?>"
        >
            Нравится
        </span>
    </div>
    <?php endif; ?>
</div>
```

### Скрипт script.js

В файл `/install/components/my/user.card/templates/.default/script.js` добавьте обработку клика на текст Нравится.

```javascript
BX.ready(() => {
    // Обработка клика на аватар
    document.querySelectorAll('.js-my-user-card-avatar-show-in-new-page').forEach((item) => {
        BX.Event.bind(item, 'click', (e) => {
            window.open(item.src, '_blank');
        });
    });

    // Обработка клика на текст "Нравится"
    document.querySelectorAll('.js-my-user-card-like').forEach((element) => {
        BX.Event.bind(element, 'click', (e) => {
            const userId = element.dataset.userId;
            
            // Отправляем AJAX-запрос к контроллеру
            BX.ajax.runAction(
                'my:module.user.like',
                {
                    data: { likedUserId: userId }
                }
            ).then((response) => {
                // Успешный ответ: обновляем внешний вид
                if (response.status === 'success') {
                    if (response.data.liked)
                    {
                        element.classList.add('my-user-card__like-text--liked');
                    }
                    else
                    {
                        element.classList.remove('my-user-card__like-text--liked');
                    }
                }
            }).catch((response) => {
                console.error('Error:', response.errors);
            });
        });
    });
});
```

### Стили style.css

В файл `/install/components/my/user.card/templates/.default/style.css` добавьте стили для текста лайка .

```css
.my-user-card {
    background: #cff9f2;
    padding: 15px;
    width: 230px;
}

.my-user-card__avatar {
    margin: 0 0 15px 0;
}

.my-user-card__avatar img {
    cursor: pointer;
    max-width: 200px;
}

.my-user-card__info {
    text-align: left;
}

.my-user-card__name {
    font-size: 1.5rem;
    margin: 0 0 10px 0;
}

.my-user-card__email {
    font-size: 1rem;
}

.my-user-card__like-container {
    margin-top: 10px;
}

.my-user-card__like-text {
    cursor: pointer;
    transition: color 0.3s ease, font-weight 0.3s ease;
    user-select: none;
    color: #999;
    font-weight: normal;
}

.my-user-card__like-text:hover {
    text-decoration: underline;
}

/* Активный лайк — синий и жирный */
.my-user-card__like-text--liked {
    color: #0066cc;
    font-weight: bold;
}
```

### Класс компонента class.php

Внесите изменения в основной класс компонента `/install/components/my/user.card/class.php`:

-  подключите `ServiceLocator` и `LikeService`,

-  в выборку пользователя добавьте поле `ID`,

-  в `arResult` добавьте проверку лайков `HAS_LIKE`,

-  добавьте метод `isUserLiked()`, который проверяет лайк через `LikeService`.

```php
<?php

use Bitrix\Main\DI\ServiceLocator;
use Bitrix\Main\Loader;
use My\Module\Services\LikeService;

if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
    die();
}

class UserCardComponent extends CBitrixComponent
{
    /**
     * Подготавливаем входные параметры
     *
     * @param  array $arParams
     *
     * @return array
     */
    public function onPrepareComponentParams($arParams)
    {
        $arParams['USER_ID'] ??= 0;
        $arParams['SHOW_EMAIL'] ??= 'Y';

        return $arParams;
    }
    /**
     * Основной метод выполнения компонента
     *
     * @return void
     */

    public function executeComponent()
    {
        if (!Loader::includeModule('my.module'))
        {
            ShowError('Модуль my.module не установлен');

            return;
        }

        // кешируем результат, чтобы не делать постоянные запросы к базе
        if ($this->startResultCache())
        {
           $this->initResult();

            // в случае если ничего не найдено, отменяем кеширование
            if (empty($this->arResult))
            {
                $this->abortResultCache();
                ShowError('Пользователь не найден');

                return;
            }
            $this->includeComponentTemplate();
        }
    }

    /**
     * Инициализируем результат
     *
     * @return void
     */
    private function initResult(): void
    {
        $userId = (int)$this->arParams['USER_ID'];
        if ($userId < 1)
        {
            return;
        }

        $user = \Bitrix\Main\UserTable::query()
            ->setSelect([
                'ID',
                'NAME',
                'EMAIL',
                'PERSONAL_PHOTO',
            ])
            ->where('ID', $userId)
            ->fetch()
        ;
        if (empty($user))
        {
            return;
        }

        $this->arResult = [
            'NAME' => $user['NAME'],
            'EMAIL' => $user['EMAIL'],
            'HAS_LIKE' => $this->isUserLiked((int)$user['ID']),
        ];

        // получаем путь до аватарки, в случае если она указана
        if (!empty($user['PERSONAL_PHOTO']))
        {
            $this->arResult['PERSONAL_PHOTO_SRC'] = \CFile::GetPath($user['PERSONAL_PHOTO']);
        }
    }

     /**
     * Проверяем, поставил ли текущий пользователь лайк
     *
     * @return void
     */
    private function isUserLiked(int $userId): bool
    {
        /**
         * @var LikeService $service
         */

        // Используем ServiceLocator, а не new LikeService(),
        // чтобы компонент и контроллер работали с одним состоянием:
        // если контроллер изменил cookie — компонент сразу увидит изменения
        $service = ServiceLocator::getInstance()->get(LikeService::class);

        return $service->isLiked($userId);
    }
}
```

## Настройка .settings.php

Файл `/local/modules/my.module/.settings.php` обязателен для работы контроллеров. Добавьте регистрацию контроллера. В результате становится возможен вызов `my:module.user.like`.

-  `defaultNamespace` должен соответствовать пространству имен контроллера.

-  Двойные обратные слеши `\\` -- экранирование в PHP-строках.

-  `readonly: true` запрещает изменение настроек через интерфейс.

```php
<?php
return [
    'controllers' => [
        'value' => [
            'defaultNamespace' => '\\My\\Module\\Controller',
        ],
        'readonly' => true,
    ]
];
```

## Архив модуля с контроллером

Готовый модуль с контроллером можно [скачать в архиве](https://dev.1c-bitrix.ru//docs/chm_files/my.module.v2.zip). Для работы распакуйте архив в папку `/local/modules/`.

![](./create-controller.png){width=700px height=409px}

### Как разместить компонент на сайте

1. В административном разделе откройте страницу *Marketplace > Установленные решения*.

2. Установите модуль *Мой модуль (my.module)*.

3. Создайте страницу и разместите на ней компонент *Карточка пользователя*.

После настройки компонента авторизованные пользователи увидят текст «Нравится» в карточке. Изначально текст будет серым, но, если поставить лайк, цвет изменится на синий.

![](./create-controller-3.png){width=548px height=424px}
