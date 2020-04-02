function close_time(selector) {
    return (parseFloat($(selector).css("transition-duration").slice(0, -1)) * 1000)
}

function hide_click (area) {
    // Сворачивание при клике в другой зоне
    $(document).one('click', function (event){
        if ($(area).hasClass('opened')) {
            const temp = $(`${area}.opened`);
            if ((temp.has(event.target).length > 0) || (temp.is(event.target))) {
                hide_click(area)
            }
            if (!(temp.is(event.target)) && (temp.has(event.target).length === 0) &&
                !($('#authorisation span, header .right').is(event.target))) {
                $(`${area}.opened`).addClass('closed');
                // Сбор мусора
                setTimeout(function () {
                    $(`${area}.closed`).removeClass('opened closed').css({display: ''})
                }, close_time(`${area}.closed`));
            }
        }
    });
}

function change_theme(theme, color) {
    if ((theme !== user_data['theme']) || (color !== user_data['color'])) {
        const temp_theme = user_data['theme'];
        const temp_color = user_data['color'];
        $('link#theme_choice').attr('href', `time_manager/styles/themes/${theme}.css`);
        $('link#color_choice').attr('href', `time_manager/styles/colors/${color}.css`);
        $(`aside menu .theme button.${temp_theme}.${temp_color}`).removeClass('choice');
        $(`aside menu .theme button.${theme}.${color}`).addClass('choice');
        user_data['theme'] = theme;
        user_data['color'] = color;
    }
}

function toggle_menu() {
    // Показ и скрытие меню

    $(document).on('click', 'header .right, #authorisation span', function () {
        const menu = '#' + $(this).attr('id').slice(7) + '_menu';
        if ($('aside').hasClass('opened')) {
            if ($(menu).hasClass('opened')) {
                $(menu).addClass('closed');
                // Сбор мусора
                setTimeout(function () {$(menu).removeClass('opened closed').css({display: ''})}, close_time(menu))
            }
        }
        else {
            $(menu).fadeIn(0, function () {$(this).addClass('opened')});
            hide_click('aside');
        }
    })

}

function connect_pages() {
    // Смена страницы
    $(document).on('click', 'header .center, footer .right', function() {
        const page = $(this).attr('id').slice(7);
        const temp = $('main.opened').attr('id').slice(5);
        if (page !== temp) {
            $(`main#page_${temp}`).addClass('closed');
            $(`main#page_${page}`).fadeIn(0, function () {$(this).addClass('opened')});
            // Сбор мусора
            setTimeout(function () {
                $('main.closed').removeAttr('class style');
            }, close_time('main.closed'));
        }
    })
}

function connect_actions() {
    // Возврат выхода при клике вне зоны
    $(document).on('click', 'aside.opened', function () {

    });
    // Указатель выбранной темы
    $(`aside menu .theme button.${user_data['theme']}.${user_data['color']}`).addClass('choice');
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
        if (((new_theme !== user_data['theme']) || (new_color !== user_data['color'])) && (user_logined)) {
            send('/change_theme', `${new_theme} ${new_color}`, change_theme(new_theme, new_color))
        }
        else {change_theme(new_theme, new_color)}
    });
}

function authorisation(login, password) {
    // Вход пользователя
    // Запрос
    receive('/login', [login, password], function (data) {
        // Синхронизация данных
        if (data['login'] === 'Guest') {
            user_data['login'] = 'Guest'
        }
        else {
            user_data = data;
            change_theme(user_data['theme'], user_data['color']);
        }
        if (!(user_logined)) {
            // Установка имени пользователя и аватарки
            $('header .right a div.nickname').text(user_data['login']);
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
            // Сбор мусора
            setTimeout(function () {
                $('#authorisation, header .center, header .right').removeAttr('style')
            }, close_time('#authorisation'));
        }
        user_logined = true;
    });

}

