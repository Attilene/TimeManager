function close_time(selector) {
    if (typeof selector === "string") {selector = $(selector)}
    return (parseFloat(selector.css("transition-duration").slice(0, -1)) * 1000)
}

function hide_click (area) {
    // Сворачивание при клике в другой зоне
    $('body').one('mousedown', function hide_click_inside(event){
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
                $('#set_email, #set_psw').removeClass("fill");
                $('#set_email, #set_psw').val('')
            }
        }
    });
}

function change_theme(theme, color) {
    if ((theme !== user_data.theme) || (color !== user_data.color)) {
        let temp_theme = user_data.theme;
        let temp_color = user_data.color;
        let temp_obj = $('body, header, header *, footer, footer *, aside, aside menu, div.theme, input, #developers *');
        temp_obj.addClass('change_theme');
        setTimeout(function () {
            temp_obj.removeClass('change_theme');
        }, close_time('.change_theme'));
        $('#theme_choice').attr('href', `time_manager/styles/themes/${theme}.css`);
        $('#color_choice').attr('href', `time_manager/styles/colors/${color}.css`);
        $('#favicon_choice').attr('href', `time_manager/images/favicons/${color}.svg`);
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
                $('#set_email, #set_psw').removeClass("fill");
                $('#set_email, #set_psw').val('')
            }
        }
        else {
            $(menu).fadeIn(0, function () {$(this).addClass('opened')});
            if ($(this).attr('id') === 'button_authorisation') {
                connect_authorisation();
            }
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
                $(`#page_${temp}`).removeAttr('class style');
                $(`#page_${page}`).fadeIn(0, function () {$(this).addClass('opened')});
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
            if (user_data.login !== '') {
                send('/change_theme', `${new_theme} ${new_color}`)
            }
        }
        change_theme(new_theme, new_color)
    });
}

function guest_auth() {
    user_data = {'login': '', 'theme': 'light', 'color': 'blue'};
    // Появление кнопок
    $('#authorisation').css({display: 'block'});
    $('header .center, header .right').fadeIn(0);
    $('header').removeClass('logout');
    // Установка имени
    $('header .right a div.nickname').text('Guest');
    $('#set_login').val('Guest');
    // Сбор мусора
    setTimeout(function () {
        $('#authorisation, header .center, header .right').removeAttr('style')
    }, close_time('#authorisation'));
    user_logined = true;
    connect_profile();
}
