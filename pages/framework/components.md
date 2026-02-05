---
title: Компоненты
description: 'Компоненты. Документация по Bitrix Framework: принципы работы, архитектура и примеры использования.'
---

Компоненты в Bitrix Framework -- это основной инструмент для отображения информации. Они позволяют настраивать вывод данных и добавлять функциональность в систему.

## Что такое компонент

Компонент -- это виджет, который берет данные из различных источников Bitrix Framework и преобразует их в HTML для веб-страниц. Он состоит из двух частей: логики и шаблона. Логика обрабатывает данные с помощью API модулей, а шаблон отображает их на странице.

### Как работают компоненты

![](./components-2.png){width=473px height=513px}

### Когда использовать компоненты

Компоненты подходят для:

-  часто используемых областей, например, форм авторизации и подписки.

-  динамически обновляемой информации: новостные ленты, случайные фото.

-  любых операций с данными.

Компонент создает какую-либо область на одной странице. Если требуется создать полнофункциональный раздел на сайте, например, каталог товаров, то следует использовать [контроллер](./controllers). Использовать комплексный компонент, который строится на основе простых, не рекомендуется.

На странице может быть несколько компонентов, каждый выполняет свою задачу. Один компонент можно использовать на разных страницах и сайтах в одной установке.

## Структура компонента

Компонент в Bitrix Framework хранит все необходимые файлы в одной папке. Эти файлы не могут использоваться отдельно.

Папка компонента может содержать:

-  `/lang/` -- языковые файлы для переводов.

-  `/templates/` -- шаблоны отображения компонента. Может отсутствовать, если шаблонов нет.

-  `.description.php` -- название, описание и положение компонента в дереве визуального редактора. Обязателен для использования в редакторе.

-  `.parameters.php` -- входные параметры компонента для редактора. Обязателен для использования в редакторе. Параметры в логике будут работать и без файла.

-  `class.php` -- логика работы компонента.

## Размещение и подключение компонентов

В Bitrix Framework компоненты размещаются в определенных папках:

-  Системные компоненты находятся в `/bitrix/components/bitrix/`. Эта папка обновляется системой, изменять ее нельзя.

-  Пользовательские компоненты следует хранить в `/local/components/`

### Именование

Название подпапки в `/local/components/` образует пространство имен (namespace) компонентов. Например, системные компоненты находятся в пространстве имен `bitrix`. Для пользовательских компонентов необходимо создать свое пространство имен.

Имена компонентов имеют вид `идентификатор1.идентификатор2...`. Например, `catalog`, `catalog.list`, `catalog.section.element`. Рекомендуется строить имена иерархически, начиная с общего понятия и заканчивая конкретным назначением компонента. Полное имя компонента включает пространство имен: `пространство_имен:имя_компонента`. Например, `bitrix:catalog.list`.

### Как подключить компонент

Подключение компонента выполняется так:

```php
<?php
$APPLICATION->IncludeComponent(
    $componentName,         
    $componentTemplate,     
    $arParams = array(),    
    $parentComponent = null,
    $arFunctionParams = array()
);
?>
```

1. `$componentName` -- полное имя компонента с указанием пространства имен.

2. `$componentTemplate` -- имя шаблона компонента. Если используется шаблон по умолчанию, оставьте пустую строку.

3. `$arParams` -- массив параметров, передаваемых компоненту.

4. `$parentComponent` -- объект родительского компонента или `null`, если родительский компонент отсутствует.

5. `$arFunctionParams` -- дополнительные параметры, такие как кеширование и другие настройки.

Пример подключения компонента меню:

```php
<?php
$APPLICATION->IncludeComponent(
	"bitrix:menu",
	"horizontal_multilevel",
	Array(
		"ROOT_MENU_TYPE" => "top", 
		"MAX_LEVEL" => "3", 
		"CHILD_MENU_TYPE" => "left", 
		"USE_EXT" => "Y", 
		"MENU_CACHE_TYPE" => "A",
		"MENU_CACHE_TIME" => "3600",
		"MENU_CACHE_USE_GROUPS" => "Y",
		"MENU_CACHE_GET_VARS" => Array()
	)
);?>
```

## Файл class.php

Файл содержит логику компонента.

### Пример файла class.php

```php
<?php

if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
    die();
}

class MyComponent extends CBitrixComponent
{
    public function executeComponent()
    {
        // если используется кеш, а также есть сохраненные данные, то выводим данные из кеша
        if ($this->startResultCache())
        {
            // иначе формируем массив $arResult
            $this->initResult();
            // подключаем шаблон компонента
            $this->includeComponentTemplate();
        }
    }
    
    private function initResult(): void
    {
        $this->arResult['KEY'] = 'value';
    }
}
```

### Пояснение к коду

1. Первая строка защищает компонент от прямого доступа для безопасности.

2. Компоненты используют кеширование для повышения производительности. Если данные закешированы, они извлекаются, ускоряя загрузку.

3. Если данных нет в кеше, компонент запрашивает их и формирует массив `$arResult`, который передается в шаблон.

4. `$this->IncludeComponentTemplate();` подключает шаблон для отображения данных. Шаблон использует массив `$arResult` для генерации HTML.

5. После получения и отображения данных компонент может сохранить их в кеше для последующего использования.

## Файл .description.php

Файл `.description.php` используется для описания компонента и его отображения в визуальном редакторе и других инструментах Bitrix. Этот файл не участвует в работе компонента на странице.

{% note info "" %}

Визуальный редактор -- это специальный инструмент для редактирования информации на сайте. Позволяет выполнять задачи от простого набора текста и вставки изображений до настройки компонентов.

{% endnote %}

### Пример файла .description.php

```php
<?php
$arComponentDescription = array(
	"NAME" => GetMessage("COMP_NAME"),
	"DESCRIPTION" => GetMessage("COMP_DESCR"),
	"ICON" => "/images/icon.gif",
	"PATH" => array(
		"ID" => "content",
		"CHILD" => array(
			"ID" => "catalog",
			"NAME" => "Каталог товаров"
		)
	),
	"AREA_BUTTONS" => array(
		array(
			'URL' => "javascript:alert('Это кнопка!!!');",
			'SRC' => '/images/button.jpg',
			'TITLE' => "Это кнопка!"
		),
	),
	"CACHE_PATH" => "Y",
	"COMPLEX" => "Y"
);
?>
```

### Массив \$arComponentDescription

Файл содержит массив `$arComponentDescription`, который описывает основные характеристики компонента. Ключи массива:

-  `NAME` -- название компонента,

-  `DESCRIPTION` -- описание компонента,

-  `ICON` -- путь к значку,

-  `PATH` -- массив описывает расположение в дереве компонентов:

   -  `ID` -- уникальный код ветки,

   -  `NAME` -- название ветки,

   -  `CHILD` -- подчиненная ветка,

-  `AREA_BUTTONS` -- пользовательские кнопки для режима редактирования,

-  `CACHE_PATH` -- если `Y`, отображается кнопка очистки кеша,

-  `COMPLEX` -- `Y` для комплексного компонента, для обычного компонента ключ значения не имеет.

### Особенности

**PATH**. Если этот ключ не задан, компонент не будет отображаться в визуальном редакторе.\
**Дерево компонентов.** Ограничено тремя уровнями. Чаще всего оно двухуровневое. Служебные названия первого уровня зарезервированы и их использовать нельзя: content, service, communication, e-store, utility.

## Файл .parameters.php

Файл `.parameters.php` содержит описание входных параметров компонента. Параметры необходимы для создания формы ввода свойств компонента в визуальном редакторе и других инструментах среды Bitrix. Описание параметров не используется при непосредственной работе компонента на странице.

### Пример файла .parameters.php

```php
<?php
CModule::IncludeModule("iblock");

$dbIBlockType = CIBlockType::GetList(
    array("sort" => "asc"),
    array("ACTIVE" => "Y")
);
while ($arIBlockType = $dbIBlockType->Fetch()) {
    if ($arIBlockTypeLang = CIBlockType::GetByIDLang($arIBlockType["ID"], LANGUAGE_ID)) {
        $arIblockType[$arIBlockType["ID"]] = "[".$arIBlockType["ID"]."] ".$arIBlockTypeLang["NAME"];
    }
}

$arComponentParameters = array(
    "GROUPS" => array(
        "SETTINGS" => array(
            "NAME" => GetMessage("SETTINGS_PHR")
        ),
        "PARAMS" => array(
            "NAME" => GetMessage("PARAMS_PHR")
        ),
    ),
    "PARAMETERS" => array(
        "IBLOCK_TYPE_ID" => array(
            "PARENT" => "SETTINGS",
            "NAME" => GetMessage("INFOBLOCK_TYPE_PHR"),
            "TYPE" => "LIST",
            "ADDITIONAL_VALUES" => "Y",
            "VALUES" => $arIblockType,
            "REFRESH" => "Y"
        ),
        "BASKET_PAGE_TEMPLATE" => array(
            "PARENT" => "PARAMS",
            "NAME" => GetMessage("BASKET_LINK_PHR"),
            "TYPE" => "STRING",
            "MULTIPLE" => "N",
            "DEFAULT" => "/personal/basket.php",
            "COLS" => 25
        ),
        "SET_TITLE" => array(),
        "CACHE_TIME" => array(),
        "VARIABLE_ALIASES" => array(
            "IBLOCK_ID" => array(
                "NAME" => GetMessage("CATALOG_ID_VARIABLE_PHR"),
            ),
            "SECTION_ID" => array(
                "NAME" => GetMessage("SECTION_ID_VARIABLE_PHR"),
            ),
        ),
        "SEF_MODE" => array(
            "list" => array(
                "NAME" => GetMessage("CATALOG_LIST_PATH_TEMPLATE_PHR"),
                "DEFAULT" => "index.php",
                "VARIABLES" => array()
            ),
            "section1" => array(
                "NAME" => GetMessage("SECTION_LIST_PATH_TEMPLATE_PHR"),
                "DEFAULT" => "#IBLOCK_ID#",
                "VARIABLES" => array("IBLOCK_ID")
            ),
            "section2" => array(
                "NAME" => GetMessage("SUB_SECTION_LIST_PATH_TEMPLATE_PHR"),
                "DEFAULT" => "#IBLOCK_ID#/#SECTION_ID#",
                "VARIABLES" => array("IBLOCK_ID", "SECTION_ID")
            ),
        ),
    )
);
?>
```

### Массив \$arComponentParameters

Файл содержит массив `$arComponentParameters`, который описывает входные параметры компонента. Он может включать выборку дополнительных данных, например, для формирования выпадающего списка типов информационных блоков.

#### Ключ GROUPS

Массив групп параметров компонента. Группы помогают организовать параметры в визуальных средствах Bitrix. Пример группы:

```php
"SETTINGS" => array(
  "NAME" => "Настройки",
  "SORT" => 100
)
```

**Перечень стандартных групп**

| Код | Сортировка | Название | Описание |
| --- | ---------- | -------- | -------- |
| BASE | 100 | Основные параметры | Базовые параметры для работы компонента |
| DATA_SOURCE | 200 | Источник данных | Параметры, указывающие, откуда выбирать данные для компонента |
| VISUAL | 300 | Настройки внешнего вида | Параметры, отвечающие за внешний вид |
| USER_CONSENT | 350 | Согласие пользователя | Настройка параметров на получение согласия пользователя согласно законодательству РФ |
| URL_TEMPLATES | 400 | Шаблоны ссылок | Служебная |
| SEF_MODE | 500 | Управление адресами страниц | Группа для всех параметров, связанных с использованием ЧПУ |
| AJAX_SETTINGS | 550 | Управление режимом AJAX | Все, что касается AJAX |
| CACHE_SETTINGS | 600 | Настройки кеширования | Появляется при указании параметра `CACHE_TIME` |
| ADDITIONAL_SETTINGS | 700 | Дополнительные настройки | Группа появляется, например, при указании параметра `SET_TITLE` |


#### Ключ PARAMETERS

Массив параметров компонента. Каждый параметр описывается следующим образом:

```php
"код параметра" => array(
   "PARENT" => "код группы",  // если нет — ставится ADDITIONAL_SETTINGS
   "NAME" => "название параметра на текущем языке",
   "TYPE" => "тип элемента управления, в котором будет устанавливаться параметр",
   "REFRESH" => "перегружать настройки или нет после выбора (N/Y)",
   "MULTIPLE" => "одиночное/множественное значение (N/Y)",
   "VALUES" => "массив значений для списка (TYPE = LIST)",
   "ADDITIONAL_VALUES" => "показывать поле для значений, вводимых вручную (Y/N)",
   "SIZE" => "число строк для списка (если нужен не выпадающий список)",
   "DEFAULT" => "значение по умолчанию",
   "COLS" => "ширина поля в символах",
),
```

**Параметр TYPE**

Тип элемента управления `TYPE` может принимать значения:

-  `LIST` -- выпадающий список,

-  `STRING` -- текстовое поле ввода,

-  `CHECKBOX` -- переключатель да/нет,

-  `CUSTOM` -- [кастомные элементы управления](./components#тип-параметров-custom),

-  `FILE` -- выбор файла,

-  `COLORPICKER` -- выбор цвета:

   ```php
   $arComponentParameters["PARAMETERS"]["COLOR"]  = Array(
       "PARENT" => "BASE",
       "NAME" => 'Выбор цвета',
       "TYPE" => "COLORPICKER",
       "DEFAULT" => 'FFFF00'
   );
   ```

**Пример использования параметра REFRESH**

Параметр `REFRESH` позволяет перегружать форму параметров после выбора значения. Это полезно, например, для фильтрации списка инфоблоков по типу.

```php
if (isset($arCurrentValues['IBLOCK_ID']) && intval($arCurrentValues['IBLOCK_ID']) > 0) {
    $arPropList = [];
    $rsProps = CIBlockProperty::GetList([], ['IBLOCK_ID' => $arCurrentValues['IBLOCK_ID']]);

    while ($arProp = $rsProps->Fetch()) {
        $arPropList[$arProp['ID']] = $arProp['NAME'];
    }

    $arComponentParameters['PARAMETERS']['PROP_LIST'] = [
        'NAME' => 'Список свойств',
        'TYPE' => 'LIST',
        'VALUES' => $arPropList,
    ];
}
```

**Особые параметры**

-  `SET_TITLE` и `CACHE_TIME` -- cтандартизованные параметры компонентов, которые не требуют полного описания. `SET_TITLE` управляет заголовком страницы, а `CACHE_TIME` определяет время кеширования.

-  `VARIABLE_ALIASES` -- описывает переменные, которые комплексный компонент может получать из HTTP-запроса. Каждый элемент массива имеет вид:

   ```php
   "внутреннее название переменной" => array(
       "NAME" => "название переменной на текущем языке",
   );
   ```

-  `SEF_MODE` -- описывает шаблоны путей в режиме ЧПУ. Каждый элемент массива имеет вид:

   ```php
   "код шаблона пути" => array(
       "NAME" => "название шаблона пути на текущем языке",
       "DEFAULT" => "шаблон пути по умолчанию",
       "VARIABLES" => "массив внутренних названий переменных, которые могут использоваться в шаблоне"
   );
   ```

#### Тип параметров CUSTOM

В параметре `TYPE` используйте значение `CUSTOM`, когда стандартных настроек компонента недостаточно. Например, в форму настроек нужно добавить интерактивный элемент: кнопку, карту или ползунок.

Для `TYPE=CUSTOM` укажите три параметра:

-  `JS_FILE` -- путь к JS-файлу с кодом отрисовки интерфейса,

-  `JS_EVENT` -- имя функции, которую система вызывает после загрузки файла.

-  `JS_DATA` -- дополнительные данные для функции, которая указана в `JS_EVENT`.

Функция `JS_EVENT` получает объект с данными.

```php
{
	data:JS_DATA,                     // JS_DATA из .parameters.php
	oCont: td,                        // контейнер для отрисовки интерфейса
	oInput: input,                    // input, в котором передается значение параметра на сервер при сохранении
	propertyID:"MAP_DATA",            // название параметра
	propertyParams: { /*...*/ },      // полное описание параметра из .parameters.php
	fChange:function(){ /*...*/ },    // callback для вызова при изменении параметра
	getElements:function(){ /*...*/ } // возвращает объект со всеми параметрами компонента
}
```

Пример массива `$arComponentParameters` с `TYPE=CUSTOM` можно посмотреть в системном компоненте `map.google.view`.

Файл `.parameters.php` содержит параметр `MAP_DATA`.

```php
$arComponentParameters = array(
//...
'MAP_DATA' => array(
	'NAME' => GetMessage('MYMS_PARAM_DATA'),
	'TYPE' => 'CUSTOM',
	'JS_FILE' => '/bitrix/components/bitrix/map.google.view/settings/settings.js',
	'JS_EVENT' => 'OnGoogleMapSettingsEdit',
	'JS_DATA' => LANGUAGE_ID.'||'.GetMessage('MYMS_PARAM_DATA_SET'),
	'DEFAULT' => serialize(array(
		'google_lat' => GetMessage('MYMS_PARAM_DATA_DEFAULT_LAT'),
		'google_lon' => GetMessage('MYMS_PARAM_DATA_DEFAULT_LON'),
		'google_scale' => 13
	)),
	'PARENT' => 'BASE',
	)
//...
);
```

Файл с кодом интерфейса -- `/bitrix/components/bitrix/map.google.view/settings/settings.js`. Функция `JCEditorOpener` создает кнопку, которая открывает модальное окно с настройками карты.

```javascript
function JCEditorOpener(arParams)
{
	this.jsOptions = arParams.data.split('||');
	this.arParams = arParams;
	var obButton = document.createElement('BUTTON');     //создать кнопку
	this.arParams.oCont.appendChild(obButton);           // добавить в контейнер
   
	obButton.innerHTML = this.jsOptions[1];              //текст из JS_DATA
   
	obButton.onclick = BX.delegate(this.btnClick, this); // callback
	this.saveData = BX.delegate(this.__saveData, this);
}
```

Код файла `/bitrix/components/bitrix/map.google.view/settings/settings.php` определяет внешний вид окна.

```html
<!-- Заголовок и описание -->
<?
$obJSPopup->ShowTitlebar();
$obJSPopup->StartDescription('bx-edit-menu');
?>
	<p><b><?echo GetMessage('MYMV_SET_POPUP_WINDOW_TITLE')?></b></p>             
	<p class="note"><?echo GetMessage('MYMV_SET_POPUP_WINDOW_DESCRIPTION')?></p> 

<!-- Блок контента  -->
<?
$obJSPopup->StartContent();
?>
...

<!-- Блок кнопок  -->
<?
$obJSPopup->StartButtons();
?>

<!-- Кнопка сохранения настроек  -->
<input type="submit" value="<?echo GetMessage('MYMV_SET_SUBMIT')?>" onclick="return jsGoogleCE.__saveChanges();" class="adm-btn-save"/>

<!-- Кнопка отмены  -->
<?
$obJSPopup->ShowStandardButtons(array('cancel'));
$obJSPopup->EndButtons();
?>
```

Функция `__saveChanges()` собирает, сериализует данные в строку и записывает в `oInput`. Код сериализации можно посмотреть в файле `settings_load.js`. Десериализация происходит  из `$arParams['~MAP_DATA']`.

Все надписи для типа `CUSTOM` выводите через `GetMessage` и размещайте в папке компонента в файле `lang/ru/.parameters.php`.

## Папки локализаций

Компоненты и их шаблоны поддерживают вывод сообщений на разных языках, автоматически отображая текст на языке пользователя.

### Структура языковых файлов

-  Каждой языковой версии соответствует своя папка:  `/ru/`, `/en/` и так далее.

-  Языковые файлы называют так, как и файлы компонента.

-  В языковых файлах описаны массивы. Ключи массивов -- идентификаторы констант, а значения ключей -- сами константы, переведенными на соответствующий язык.

-  Файлы располагают в той же иерархии относительно `/lang/код языка/`, что и исходные файлы относительно папки компонента.

Папки локализаций создаются отдельно для компонентов и для каждого из шаблонов.

Подробнее про работу с локализацией читайте в разделе [Локализация](./../rasshirennye-znaniya/regionalnye-nastroyki-culture).

### Подсказки в параметрах компонента

Bitrix Framework позволяет добавлять подсказки к параметрам компонента. Для этого в языковой папке `/lang/` создайте массив `$MESS`, где ключи -- это параметры компонента с суффиксом `_TIP`, а значения -- сами подсказки.

```php
$MESS["IBLOCK_TYPE_TIP"] = "Это подсказка для типа инфоблока";
$MESS["IBLOCK_ID_TIP"] = "Это подсказка для ID инфоблока";
$MESS["SORT_BY1_TIP"] = "Это подсказка для первой сортировки";
```

Подсказки сохраняются в языковом файле `.parameters.php` как для компонента, так и для его шаблона. Нельзя оставлять подсказки пустыми, иначе настройки компонента не будут показываться.

## Шаблоны компонента

Шаблон компонента в Bitrix Framework -- это программный код, который преобразует подготовленные компонентом данные в HTML-код для отображения на веб-странице.

#### Виды шаблонов

1. **Системные шаблоны**: поставляются вместе с дистрибутивом и находятся в подпапке `templates` папки компонента.

2. **Пользовательские шаблоны**: изменены под нужды конкретного сайта и должны находиться в папках шаблонов сайтов, например, `/local/templates/шаблон_сайта/`. При копировании такого шаблона средствами системы, они будут расположены по следующему пути: `/local/templates/шаблон_сайта/components/namespace/название_компонента/название_шаблона/`.

#### Определение шаблонов

-  Шаблоны компонента определяются по именам. Шаблон по умолчанию имеет имя `.default`. Остальные шаблоны могут называться произвольно. Если в настройках компонента не указывается имя шаблона, то вызывается шаблон по умолчанию.

-  Шаблоны являются папками с файлами.

-  Каждый шаблон компонента является неделимым целым. Если требуется изменить системный шаблон под конкретный сайт, то его нужно целиком скопировать в папку шаблона сайта и только потом изменить под потребности проекта.

#### Переменные в шаблоне

-  `$templateFile` -- путь к шаблону относительно корня сайта.

-  `$arResult` -- массив результатов работы компонента.

-  `$arParams` -- массив входящих параметров компонента.

-  `$arLangMessages` -- массив языковых сообщений.

-  `$templateFolder` -- путь к папке с шаблоном от `DOCUMENT_ROOT`.

-  `$parentTemplateFolder` -- путь к папке шаблона родительского компонента.

-  `$component` -- ссылка на текущий вызванный компонент.

-  `$this` -- ссылка на текущий шаблон.

-  `$templateName` -- имя шаблона.

-  `$componentPath` -- путь к папке с компонентом от `DOCUMENT_ROOT`.

-  `$templateData` -- массив для передачи данных из `template.php` в `component_epilog.php`. Данные кешируются, так как файл `component_epilog.php` исполняется на каждом хите.

-  `$APPLICATION`, `$USER`, `$DB` -- глобальные переменные.

#### Структура шаблона

-  `/lang/` -- файлы языковых сообщений.

-  `result_modifier.php` -- подключается перед шаблоном для изменения `$arResult` и `$arParams`.

-  `component_epilog.php` -- подключается после исполнения шаблона.

-  `style.css` -- определяет стили.

-  `script.js` -- определяет и подключает JavaScript.

-  `.description.php` -- содержит название и описание шаблона. Пример файла:

   ```php
   <?php if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();
   $arTemplateDescription = array(
      "NAME" => GetMessage("ADV_BANNER_NAME"),
      "DESCRIPTION" => GetMessage("ADV_BANNER_DESC"),
   );
   ?>
   ```

-  `.parameters.php` -- описание дополнительных параметров. Пример файла:

   ```php
   <?php if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();
   
   if (!CModule::IncludeModule("advertising"))
      return;
   
   $arTypeFields = Array("-" =>GetMessage("ADV_SELECT_DEFAULT"));
   $res = CAdvType::GetList($by, $order, Array("ACTIVE" => "Y"),$is_filtered, "Y");
   
   while (is_object($res) && $ar = $res->GetNext())
   {
      $arTypeFields[$ar["SID"]] = "[".$ar["SID"]."] ".$ar["NAME"];
   }
   
   $arTemplateParameters = [
      "TYPE" => [
         "NAME" => GetMessage("ADV_TYPE"),
         "PARENT" => "BASE",
         "TYPE" => "LIST",
         "DEFAULT" => "",
         "VALUES" => $arTypeFields,
         "ADDITIONAL_VALUES" => "N",
      ],
      "NOINDEX" => [
         "NAME" => GetMessage("adv_banner_params_noindex"),
         "PARENT" => "BASE",
         "TYPE" => "CHECKBOX",
         "DEFAULT" => "N",
      ],
      "QUANTITY" => [
         "NAME" => GetMessage("ADV_QUANTITY"),
         "PARENT" => "BASE",
         "TYPE" => "STRING",
         "DEFAULT" => "1",
      ],
      "CACHE_TIME" => ["DEFAULT"=>"0"],
   ];
   
   if ($templateProperties['NEED_TEMPLATE'] == 'Y')
   {
      $templates = array('-' => GetMessage("ADV_NOT_SELECTED"));
      $arTemplates = CComponentUtil::GetTemplatesList('bitrix:advertising.banner.view');
   
      if (is_array($arTemplates) && !empty($arTemplates))
      {
         foreach ($arTemplates as $template)
         {
               $templates[$template['NAME']] = $template['NAME'];
         }
      }
   
      $arTemplateParameters['DEFAULT_TEMPLATE'] = [
         "NAME" => GetMessage("ADV_DEFAULT_TEMPLATE"),
         "PARENT" => "BASE",
         "TYPE" => "LIST",
         "VALUES" => $templates,
         "DEFAULT" => '',
         "ADDITIONAL_VALUES" => "N",
      ];
   
      unset($templateProperties['NEED_TEMPLATE']);
   }
   ```

-  `template.php` -- основной файл шаблона.

-  Дополнительные ресурсы, например, папка `/images/`.

#### Поиск шаблона системой

Система ищет подходящий шаблон по алгоритму.

1. Ищет в `/local/templates/текущий_шаблон_сайта/components/`.

2. Если не найден, ищет в `/local/templates/.default/components/`.

3. Если не найден, ищет в `/bitrix/templates/текущий_шаблон_сайта/components/`.

4. Если не найден, ищет в `/bitrix/templates/.default/components/`.

5. Если не найден, ищет среди системных шаблонов.

Особенности:

-  Если имя шаблона не задано, ищется `.default`.

-  Если шаблон задан именем папки, ищется файл`template.ext`. Расширение ext сначала принимается равным php, а затем расширениям других доступных на сайте движков шаблонизации.

Если компонент вызывается в составе комплексного компонента, то его шаблон сначала ищется в составе шаблона родительского компонента, а потом -- в собственных шаблонах. Чтобы это правило работало, при вызове компонентов в составе комлексных компонентов не забывайте указывать четвертым параметром переменную `$component`, указывающую на родительский компонент:

```php
$APPLICATION->IncludeComponent("custom:catalog.element", "", array(...), $component);
```

{% note info "" %}

В одной папке, например, `/bitrix/templates/текущий_шаблон_сайта/components/` есть шаблоны двух компонентов:

-  `catalog` -- комплексный компонент, в нем есть catalog.section,

-  `catalog.section` -- обычный компонент.

По условиям работы сайта необходимо, чтобы для двух вхождений `catalog.section` использовался один единственный шаблон. В этом случае нужно, чтобы этот шаблон имел имя, отличное от `.default`, иначе он не будет подхвачен.

{% endnote %}

#### Работа с AJAX

Для корректной работы AJAX необходимо, чтобы в шаблоне компонента присутствовали элементы с `id="navigation"` для навигации и `id="pagetitle"` для заголовка. Например:

```php
<?php if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die(); ?>

<div id="component-template">
    <!-- Заголовок страницы -->
    <div id="pagetitle">
        <h1><?php $APPLICATION->ShowTitle(false); ?></h1>
    </div>

    <!-- Основное содержимое компонента -->
    <div id="component-content">
        <!-- Здесь может быть основной контент компонента -->
        <?php foreach ($arResult['ITEMS'] as $item): ?>
            <div class="item">
                <h2><?= htmlspecialchars($item['NAME']) ?></h2>
                <p><?= htmlspecialchars($item['DESCRIPTION']) ?></p>
            </div>
        <?php endforeach; ?>
    </div>

    <!-- Навигация -->
    <div id="navigation">
        <?php if ($arResult['NAV_STRING']): ?>
            <?= $arResult['NAV_STRING'] ?>
        <?php endif; ?>
    </div>
</div>
```

## Файл result_modifier.php

Файл `result_modifier.php` позволяет модифицировать данные компонента. Разработчик создает его самостоятельно. Файл работает, когда кеширование отключено.

### Как работать с result_modifier.php

В `result_modifier.php` можно запросить дополнительные данные и добавить их в массив `$arResult`. Это полезно, если нужно вывести дополнительные данные без изменения компонента, сохраняя его поддержку и обновления.

{% note warning "" %}

Файл `result_modifier.php` запускается только перед подключением шаблона. При включенном кешировании шаблон не подключается, поэтому нельзя устанавливать динамические свойства, такие как `title`, `keywords`, `description`.

{% endnote %}

### Переменные в result_modifier.php

-  `$arParams` -- параметры для чтения и изменения. Изменения влияют на `$arParams` в `template.php`, но не на одноименный член компонента.

-  `$arResult` -- результат для чтения и изменения. Изменения затрагивают одноименный член класса компонента.

-  `$APPLICATION`, `$USER`, `$DB` -- глобальные переменные.

-  `$this` -- ссылка на текущий шаблон (объект типа `CBitrixComponentTemplate`).

## Файл component_epilog.php

Файл `component_epilog.php` позволяет модифицировать данные компонента при включенном кешировании. Разработчик создает его самостоятельно.

### Как работать с component_epilog.php

Файл  `component_epilog.php` подключается после выполнения шаблона. Родительский компонент:

1. Сохраняет в своем кеше список файлов эпилогов всех дочерних компонентов.

2. Подключает файлы при хите в кеш в том же порядке, как они исполнялись без кеширования.

При вызове дочерних компонентов в шаблоне нужно передавать значение `$component`.

В `component_epilog.php` доступны `$arParams` и `$arResult`, но их значения берутся из кеша. Набор ключей массива `$arResult`, попадающих в кеш, определяется в `class.php` с помощью:

```php
$this->SetResultCacheKeys(array(
    "ID",
    "IBLOCK_TYPE_ID",
    "LIST_PAGE_URL",
    "NAV_CACHED_DATA",
    "NAME",
    "SECTION",
    "ELEMENTS",
));
```

Используйте эту конструкцию, чтобы ограничить размер кеша только необходимыми данными.

{% note info "" %}

В `component_epilog.php` может быть любой код, но он будет исполняться на каждом хите, независимо от наличия кеша.

{% endnote %}

### Переменные в component_epilog.php

-  `$arParams` -- параметры для чтения и изменения.

-  `$arResult` -- результат для чтения и изменения.

-  `$componentPath` -- путь к папке с компонентом от `DOCUMENT_ROOT`.

-  `$component` -- ссылка на `$this`.

-  `$this` -- ссылка на текущий компонент, можно использовать все методы класса `CBitrixComponent`.

-  `$epilogFile` -- путь к `component_epilog.php` относительно `DOCUMENT_ROOT`.

-  `$templateName` -- имя шаблона компонента.

-  `$templateFile` -- путь к файлу шаблона от `DOCUMENT_ROOT`.

-  `$templateFolder` -- путь к папке с шаблоном от `DOCUMENT_ROOT`.

-  `$templateData` --  массив для передачи данных из `template.php` в `component_epilog.php`. Данные  кешируются и доступны на каждом хите.

-  `$APPLICATION`, `$USER`, `$DB` -- глобальные переменные.

### Пример файла component_epilog.php

```php
<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();
global $APPLICATION;
if (isset($arResult['MY_TITLE']))
    $APPLICATION->SetTitle($arResult['MY_TITLE']);
?>
```

### Пример работы с переменной \$templateData

В файле `template.php`:

```php
<?php
// Предположим, что мы собираем какие-то данные в шаблоне
$templateData = [
    'ITEM_COUNT' => count($arResult['ITEMS']),
    'LAST_UPDATED' => $arResult['LAST_UPDATED'],
];
?>
```

В файле `component_epilog.php`:

```php
<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

// Проверяем, что $templateData определена и содержит данные
if (isset($templateData) && is_array($templateData)) {
    // Используем данные из $templateData
    $itemCount = $templateData['ITEM_COUNT'];
    $lastUpdated = $templateData['LAST_UPDATED'];

    // Например, логируем количество элементов и дату последнего обновления
    AddMessage2Log("Компонент обработал $itemCount элементов. Последнее обновление: $lastUpdated.");
}
?>
```

### Особенности использования component_epilog.php

Файл `component_epilog.php` подключается сразу после выполнения шаблона. Если в компоненте после подключения шаблона идут другие операции, они выполнятся после `component_epilog.php`. В случае совпадения изменяемых данных выведутся только последние данные, то есть из кода компонента.

Пример:

```php
$this->IncludeComponentTemplate();
if($arParams["SET_TITLE"]) {
    $APPLICATION->SetTitle($arResult["NAME"]);
}
```

В этом случае выведутся данные компонента, а не `component_epilog.php`.

### Особенности подключения языковых файлов

Если языковые фразы в `component_epilog.php` должны отличаться от фраз в компоненте, создайте файл `/lang/ru/component_epilog.php` и подключите его:

```php
use \Bitrix\Main\Localization\Loc;
Loc::loadLanguageFile(__FILE__);
Loc::getMessage("MY_MESS");
```

## Кеширование компонентов

В  массиве`$arParams` содержится набор параметров компонента. Файл `class.php` работает с входными параметрами запроса и базой данных, формируя результат в массив `$arResult`. Шаблон компонента преобразует результат в HTML.

При первом хите сформированный HTML попадает в кеш. При последующих хитах запросов в базу не делается или делается мало, данные читаются из кеша.

### Устройство и место хранения

Кеш компонентов хранится в `/bitrix/cache/`. Идентификатор кеша формируется на основе:

-  `ID` текущего сайта,

-  имени компонента,

-  имени шаблона компонента,

-  параметров компонента,

-  внешних условий (например, список групп пользователя).

Зная эти параметры, можно очистить кеш любого компонента. Иначе кеш сбрасывается по истечении времени кеширования или вручную.

{% note info "" %}

При сбросе кеша страницы учитывайте, что компонент может использовать привязку к группам, и незарегистрированные пользователи будут видеть устаревший вариант страницы.

{% endnote %}

### Автокеширование

Автокеширование можно отключить на весь сайт в административной части *Настройки > Настройки продукта > Автокеширование*. Обычно оно выключено на этапе разработки и включается перед сдачей проекта. Разработчик должен самостоятельно указывать время кеширования, исходя из потребностей проекта.

### Важные моменты

-  Избегайте вызова отложенных функций в шаблоне при включенном кешировании.

-  Формируйте уникальный `ID` кеша, чтобы избежать избыточных данных и повысить эффективность кеширования.

## Работа с контроллерами

Внутри компонента можно использовать контроллеры.

### Реализация в class.php

Обработчик запросов в классе компонента (файл `class.php`) позволяет инкапсулировать весь код в одном классе, повторно использовать методы, данные и параметры компонента, а также использовать языковые фразы и шаблоны компонента.

Чтобы класс компонента мог обрабатывать запросы, необходимо реализовать интерфейс `\Bitrix\Main\Engine\Contract\Controllerable`, определить метод-действия с суффиксом `Action`, и реализовать метод `configureActions` для настройки доступа к действиям.

Вот пример кода, который демонстрирует, как это можно сделать:

```php
// components/bitrix/example/class.php
use Bitrix\Main\Error;
use Bitrix\Main\ErrorCollection;

if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

class ExampleComponent extends \CBitrixComponent implements \Bitrix\Main\Engine\Contract\Controllerable, \Bitrix\Main\Errorable
{
    /** @var ErrorCollection */
    protected $errorCollection;

    public function configureActions()
    {
        // Если действия не нужно конфигурировать, возвращаем пустой массив
        return [];
    }

    public function onPrepareComponentParams($arParams)
    {
        $this->errorCollection = new ErrorCollection();
        // Подготовка параметров
        // Этот код выполняется при запуске AJAX-действий
    }

    public function executeComponent()
    {
        // Внимание! Этот код не выполняется при запуске AJAX-действий
    }

    // В параметр $person автоматически подставляются данные из REQUEST
    public function greetAction($person = 'guest')
    {
        return "Hi {$person}!";
    }

    // Пример обработки ошибок
    public function showMeYourErrorAction():? string
    {
        if (rand(3, 43) === 42) {
            $this->errorCollection[] = new Error('You are so beautiful or so handsome');
            // В ответе будут ошибки, и статус ответа будет 'error'
            return null;
        }
        return "Ok";
    }

    /**
     * Получение массива ошибок.
     * @return Error[]
     */
    public function getErrors()
    {
        return $this->errorCollection->toArray();
    }

    /**
     * Получение ошибки по коду.
     * @param string $code Код ошибки.
     * @return Error
     */
    public function getErrorByCode($code)
    {
        return $this->errorCollection->getErrorByCode($code);
    }
```

### Реализация в ajax.php

Обработчик контроллера запросов в файле `ajax.php` позволяет создать легковесный обработчик AJAX-запросов, выделяя логику из компонента. Чтобы его реализовать, создайте в корне компонента файл `ajax.php` и определите метод-действия с суффиксом `Action`.

Пример кода для реализации:

```php
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

class ExampleAjaxController extends \Bitrix\Main\Engine\Controller
{
// В параметр $person автоматически подставляются данные из REQUEST
public function sayByeAction($person = 'guest')
{
return "Goodbye {$person}";
}

public function listUsersAction(array $filter)
{
// Логика действия
}
}
```

### Взаимодействие с JavaScript

Взаимодействие между компонентами Bitrix и JavaScript часто требует передачи параметров и выполнения AJAX-запросов. Ниже описаны основные шаги для организации такого взаимодействия.

#### Подготовка параметров для AJAX

Чтобы передать параметры из компонента в JavaScript, необходимо описать их в методе `listKeysSignedParameters`. Это позволяет использовать те же параметры, которые были при отображении компонента на странице.

```php
class ExampleComponent extends \CBitrixComponent implements \Bitrix\Main\Engine\Contract\Controllerable
{
protected function listKeysSignedParameters()
{
    return [
        'STORAGE_ID',
        'PATH_TO_SOME_ENTITY',
    ];
}
```

#### Передача параметров в JavaScript

В шаблоне компонента можно получить подписанные параметры и передать их в ваш JavaScript-класс компонента.

```javascript
<script type="text/javascript">
new BX.ExampleComponent({
	signedParameters: '<?= $this->getComponent()->getSignedParameters() ?>',
	componentName: '<?= $this->getComponent()->getName() ?>'
});
</script>
```

#### Выполнение AJAX-запросов

Для выполнения AJAX-запросов используйте `BX.ajax.runComponentAction`, передавая подписанные параметры.

```javascript
BX.ajax.runComponentAction(this.componentName, action, {
	mode: 'class',
	signedParameters: this.signedParameters,
	data: data
	}).then(function (response) {
	// Обработка ответа
});
```

## Замечания по \$arParams и \$arResult

`$arParams` и `$arResult` -- это ключевые переменные для работы с компонентами. Они играют важную роль в передаче данных и результатов между компонентом и его шаблоном.

### \$arParams

Переменная `$arParams` -- это массив входных параметров компонента. Ключи массива -- названия параметров, значения -- их содержимое.

Функция `htmlspecialcharsEx` применяется ко всем значениям параметров перед подключением компонента. Исходные значения сохраняются в том же массиве с префиксом `~`. Например, `$arParams["NAME"]` -- параметр с примененной функцией `htmlspecialcharsEx`, а `$arParams["~NAME"]` -- исходный параметр.

`$arParams` -- это псевдоним для члена класса компонента. Изменения этой переменной отражаются на члене класса. В начале кода компонента нужно проверить входные параметры, инициализировать неустановленные и привести их к нужному типу. Эти изменения будут доступны в шаблоне, поэтому дублировать подготовку параметров в шаблоне не нужно.

### \$arResult

Переменная `$arResult` -- это массив с результатами работы компонента для передачи в шаблон. Перед вызовом шаблона инициализируется пустым массивом `array()`.

`$arResult` также является псевдонимом для члена класса компонента. Изменения переменной автоматически отражаются на члене класса, поэтому передавать ее в шаблон не нужно.

### Ссылки в PHP

Ссылки (references) в PHP позволяют обращаться к одним и тем же данным по разным именам. Если `$arParams` и `$arResult` изменены в коде компонента, они будут доступны измененными и в шаблоне.

Учтите следующие нюансы:

-  Если написать `$arParams = & $arSomeArray;`, то `$arParams` будет отвязана от члена класса компонента и привязана к `$arSomeArray`. В этом случае изменения `$arParams` не попадут в шаблон.

-  Если написать `unset($arParams);`, это разорвет связь между `$arParams` и членом класса компонента.
