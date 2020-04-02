function change_theme(theme) {
    // Смена темы на сервере
    $('link#theme_choice').attr('href', `time_manager/styles/themes/${theme}.css`);
}

function change_color(color) {
    // Смена цвета на сервере
    $('link#favicon_choice').attr('href', `time_manager/images/favicons/${color}.svg`);
    $('link#color_choice').attr('href', `time_manager/styles/colors/${color}.css`);
}

function toggle_menu() {
    // Показ и скрытие меню
    function hide_click () {
        // Сворачивание при клике в другой зоне
        $(document).one('click', function (event){
                if ($('aside').hasClass('opened')) {const temp = $("aside.opened");
                if (!(temp.is(event.target)) && (temp.has(event.target).length === 0) && !($('#authorisation span, header .right').is(event.target))) {
                    $('aside.opened').addClass('closed');
                    const close_time = parseFloat($('aside.closed').css("transition-duration").slice(0, -1)) * 1000;
                    // Сбор мусора
                    setTimeout(function () {$('aside.closed').removeAttr('class style')}, close_time);
                }}
        });
    }
    $(document).on('click', 'header .right, #authorisation span', function () {
        const menu = '#' + $(this).attr('id').slice(7) + '_menu';
        if ($('aside').hasClass('opened')) {
            if ($(menu).hasClass('opened')) {
                $(menu).addClass('closed');
                const close_time = parseFloat($(menu).css("transition-duration").slice(0, -1)) * 1000;
                // Сбор мусора
                setTimeout(function () {$(menu).removeAttr('class style')}, close_time)
            }
        }
        else {
            $(menu).fadeIn(0, function () {$(this).addClass('opened')});
            hide_click();
        }
    })

}

function connect_pages() {
    // Смена страницы
    $(document).on('click', 'header .center, footer .right', function() {
        const page = $(this).attr('id').slice(7);
        if (page !== now_page) {
            const temp = now_page;
            now_page = page;
            $(`main#page_${temp}`).addClass('closed');
            const close_time = parseFloat($('main.closed').css("transition-duration").slice(0, -1)) * 1000;
            $(`main#page_${page}`).fadeIn(0, function () {$(this).addClass('opened')});
            // Сбор мусора
            setTimeout(function () {
                $('main.closed').removeAttr('class style');
            }, close_time);
        }
    })
}

function connect_actions() {
    // Функционал нажатий
    // Вход тестового пользователя
    $(document).on('click', 'header .left', function () {
        if (!user_logined) {
            authorisation('Guest', 'Год рождения Сталина')
        }
    });
    // Кнопки изменения цвета
    $(document).on('click', 'aside .theme button', function () {
        const new_theme = $(this).attr('class').split(' ')[0];
        const new_color = $(this).attr('class').split(' ')[1];
        if (new_theme !== user_data['theme']) {change_theme(new_theme)}
        if (new_color !== user_data['color']) {change_color(new_color)}
        if ((new_theme !== user_data['theme']) || (new_color !== user_data['color'])) {
            if (user_logined)
            {send('/change_theme', `${new_theme} ${new_color}`)}}
        user_data['theme'] = new_theme;
        user_data['color'] = new_color;
    });
}

function authorisation(login, password) {
    // Вход пользователя
    // Запрос
    page_data = {...user_data};
    get('/login', [login, password], function (data) {
        // Синхронизация данных
        if (data['login'] === 'Guest') {user_data = {
            'login': data['login'],
            'theme': page_data['theme'],
            'color': page_data['color'],
            'avatar': data['avatar']
            }
        }
        else {
            user_data = data;
            if (user_data['theme'] !== page_data['theme']) {change_theme(user_data['theme'])}
            if (user_data['color'] !== page_data['color']) {change_color(user_data['color'])}
        }
        if (!(user_logined)) {
            // Установка имени пользователя и аватарки
            $('header .right a div').text(user_data['login']);
            // Загрузка аватара
            if (user_data['avatar']) {
                $('header .right img.avatar').attr('src', `time_manager/images/avatars/${user_data['login']}.jpg`);
                $('aside #hat .avatar:first-child').attr('src', `time_manager/images/avatars/${user_data['login']}.jpg`);
            }
            else {
                $('header .right img.avatar').attr('src', `time_manager/images/avatars/default.jpg`);
                $('aside #hat .avatar:first-child').attr('src', `time_manager/images/avatars/default.jpg`);
            }
            // Появление кнопок
            $('#authorisation').css({display: 'block'});
            $('header .center, header .right').fadeIn(0);
            $('header').removeClass('logout');
            const close_time = parseFloat($('#authorisation').css("transition-duration").slice(0, -1)) * 1000;
            // Сбор мусора
            setTimeout(function () {
                $('#authorisation, header .center, header .right').removeAttr('style')
            }, close_time);
        }
        user_logined = true;
    });

}

