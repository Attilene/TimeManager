// Вычисление задержки
function close_time(selector) {
    if (typeof selector === "string") {selector = $(selector)}
    try {
        return (parseFloat(selector.css("transition-duration").slice(0, -1)) * 1000)
    }
    catch (e) {
        return 200
    }
}

// Форма при нажатии Enter
function submit_warn(form) {
    let warn_inputs = form.children('label.warning').next();
    warn_inputs.addClass('warning');
    setTimeout(function () {
        warn_inputs.removeClass('warning');
    }, 300);
}

// Анимированная смена
function fade_change(field, func) {
    if (typeof field === "string") {field = $(field)}
    field.addClass('change');
    setTimeout(function () {
        func();
        field.removeClass('change');
    }, close_time(field))
}

// Смена тем
function change_theme(theme, color) {
    if ((theme !== user_data.theme) || (color !== user_data.color)) {
        let temp_theme = user_data.theme;
        let temp_color = user_data.color;
        let temp_obj = $('body, header, header *, footer, footer *, aside, aside menu, ' +
            'div.theme, input, #developers *, #hat svg');
        temp_obj.addClass('change_theme');
        setTimeout(function () {
            temp_obj.removeClass('change_theme');
        }, close_time('.change_theme'));
        if (theme !== user_data.theme) {
            $('#theme_choice').attr('href', `time_manager/styles/themes/${theme}.css`);
        }
        if (color !== user_data.color) {
            $('#color_choice').attr('href', `time_manager/styles/colors/${color}.css`);
            $('#favicon_choice').attr('href', `time_manager/images/favicons/${color}.svg`);
        }
        $(`aside menu .theme button[data-theme="${temp_theme}"][data-color="${temp_color}"]`).removeClass('choice');
        $(`aside menu .theme button[data-theme="${theme}"][data-color="${color}`).addClass('choice');
        if (user_data.login !== '') {send('/change_theme', `${theme} ${color}`)}
        user_data.theme = theme;
        user_data.color = color;
    }
}

// Смена страницы
function change_page(button) {
    let page = button.attr('id').slice(7);
    let temp = $('main.opened').attr('id').slice(5);
    if (page !== temp) {
        $(`#page_${temp}`).addClass('closed');
        $(`#page_${page}`).fadeIn(0, function () {
            $(this).addClass('opened')
        });
        // Сбор мусора
        setTimeout(function () {
            $(`#page_${temp}`).removeAttr('class style');
            $(`#page_${page}`).fadeIn(0, function () {
                $(this).addClass('opened')
            });
        }, close_time('main.closed'));
    }
}

// Вход тестового пользователя
function guest_auth() {
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
    clear_fields()
}
