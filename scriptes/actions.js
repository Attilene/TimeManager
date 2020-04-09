function close_time(selector) {
    if (typeof selector === "string") {selector = $(selector)}
    return (parseFloat(selector.css("transition-duration").slice(0, -1)) * 1000)
}

function hide_click (area) {
    // Сворачивание при клике в другой зоне
    $(document).one('mousedown', function (event){
        if ($(area).hasClass('opened')) {
            let temp = $(`${area}.opened`);
            if ((temp.has(event.target).length > 0) || (temp.is(event.target))) {
                hide_click(area)
            }
            if (!(temp.is(event.target)) && (temp.has(event.target).length === 0) &&
                !($('#authorisation span, header .right').is(event.target))) {
                temp.addClass('closed');
                // Сбор мусора
                setTimeout(function () {
                    $(`${area}.closed`).removeClass('opened closed').css({display: ''})
                }, close_time(`${area}.closed`));
            }
        }
    });
}

function change_theme(theme, color) {
    if ((theme !== user_data.theme) || (color !== user_data.color)) {
        let temp_theme = user_data.theme;
        let temp_color = user_data.color;
        $('#theme_choice').attr('href', `time_manager/styles/themes/${theme}.css`);
        $('#color_choice').attr('href', `time_manager/styles/colors/${color}.css`);
        $(`aside menu .theme button.${temp_theme}.${temp_color}`).removeClass('choice');
        $(`aside menu .theme button.${theme}.${color}`).addClass('choice');
        user_data.theme = theme;
        user_data.color = color;
    }
}

function toggle_menu() {
    // Показ и скрытие меню
    $(document).on('mousedown', 'header .right, #authorisation span', function () {
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
            if ($(this).attr('id') === 'button_authorisation') {
                connect_authorisation()}
            hide_click('aside');
        }
    })

}

function connect_pages() {
    // Смена страницы
    $('header .center, footer .right').on('mousedown', function() {
        const page = $(this).attr('id').slice(7);
        let temp = $('main.opened').attr('id').slice(5);
        if (page !== temp) {
            $(`#page_${temp}`).addClass('closed');
            $(`#page_${page}`).fadeIn(0, function () {$(this).addClass('opened')});
            // Сбор мусора
            setTimeout(function () {
                $('main.closed').removeAttr('class style');
            }, close_time('main.closed'));
        }
    })
}

function connect_actions() {
    // Указатель выбранной темы
    $(`aside menu .theme button.${user_data.theme}.${user_data.color}`).addClass('choice');
    // Функционал нажатий
    // Вход тестового пользователя
    $(document).on('mousedown', 'header .left', function () {
        if (!user_logined) {
            guest_auth()
        }
    });
    // Кнопки изменения цвета
    $(document).on('mousedown', 'aside .theme button', function () {
        const new_theme = $(this).attr('class').split(' ')[0];
        const new_color = $(this).attr('class').split(' ')[1];
        if (((new_theme !== user_data['theme']) || (new_color !== user_data['color'])) && (user_logined)) {
            if (user_data.login !== 'Guest') {
                send('/change_theme', `${new_theme} ${new_color}`)
            }
        }
        change_theme(new_theme, new_color)
    });
}

function authorisation(login, password) {
    // Вход пользователя
    // Запрос
    receive('/login', [login, password], function (data) {
        // Синхронизация данных
        user_data = data;
        change_theme(data.theme, data.color);
        // Установка имени пользователя и аватарки
        $('header .right a div.nickname').text(login);
        // Загрузка аватара
        if (data.avatar) {
            $('header .right img.avatar').attr('src', `time_manager/images/avatars/${data.login}.jpg`);
            $('#hat .avatar:first-child').attr('src', `time_manager/images/avatars/${data.login}.jpg`);
        }
        else {
            $('header .right img.avatar').attr('src', `time_manager/images/avatars/default.jpg`);
            $('#hat .avatar:first-child').attr('src', `time_manager/images/avatars/default.jpg`);
        }
        // Появление кнопок
        $('#authorisation').css({display: 'block'});
        $('header .center, header .right').fadeIn(0);
        $('header').removeClass('logout');
        // Сбор мусора
        setTimeout(function () {
            $('#authorisation, header .center, header .right').removeAttr('style')
        }, close_time('#authorisation'));
        user_logined = true;
    });
}

function guest_auth() {
    user_data = {'login': 'Guest', 'theme': 'light', 'color': 'blue'};
    // Установка имени пользователя и аватарки
    $('header .right a div.nickname').text('Guest');
    // Загрузка аватара
    $('header .right img.avatar').attr('src', `time_manager/images/avatars/default.jpg`);
    $('#hat .avatar:first-child').attr('src', `time_manager/images/avatars/default.jpg`);
    // Появление кнопок
    $('#authorisation').css({display: 'block'});
    $('header .center, header .right').fadeIn(0);
    $('header').removeClass('logout');
    // Сбор мусора
    setTimeout(function () {
        $('#authorisation, header .center, header .right').removeAttr('style')
    }, close_time('#authorisation'));
    user_logined = true;
}

function registration(login, email, password) {
    let hashed_pass = encrypt(password + salt);
    send('/register', {
        'log':     login,
        'email':   email,
        'psw':     hashed_pass,
        'theme':   user_data.theme,
        'color':   user_data.color,
        'salt':    salt
    })
}