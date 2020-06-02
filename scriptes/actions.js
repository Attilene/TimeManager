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
    let warn_inputs = form.children('label.warning, label.empty').next('input');
    warn_inputs.addClass('warning');
    setTimeout(function () {
        warn_inputs.removeClass('warning');
    }, 300);
    return false
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
            'div.theme, input, #developers *, .time *, textarea, ::placeholder, main *,' +
            '.clock_load, .man_card');
        temp_obj.addClass('change_theme');
        setTimeout(function () {
            temp_obj.removeClass('change_theme');
        }, close_time('.change_theme'));
        if (theme !== user_data.theme) {
            $('#theme_choice').attr('href', `time_manager/styles/themes/${theme}.css`);
            $('#help_body').css({'background-image': `url(${background[theme].src})`})
        }
        if (color !== user_data.color) {
            $('#color_choice').attr('href', `time_manager/styles/colors/${color}.css`);
            $('#favicon_choice').attr('href', `time_manager/images/favicons/${color}.svg`);
        }
        $(`aside menu .theme button[data-theme="${temp_theme}"][data-color="${temp_color}"]`).removeClass('choice');
        $(`aside menu .theme button[data-theme="${theme}"][data-color="${color}`).addClass('choice');
        if (user_data.login !== undefined) {send('/change_theme', `${theme} ${color}`)}
        user_data.theme = theme;
        user_data.color = color;
    }
}

// Смена страницы
function change_page(page) {
    let temp = sessionStorage.page;
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
        sessionStorage.page = page;
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
    // Вставка страниц
    $('#page_day')[0].innerHTML = '<div class="body">\n' +
        '<button id="add_day_task" onmousedown="click_add_day($(this))">\n' +
        '        <svg>\n' +
        '            <use xlink:href="time_manager/images/sprites.svg#sprite_btn_add"></use>\n' +
        '        </svg>\n' +
        '    </button>\n' +
        '    <a class="alert"\n' +
        '       onmouseenter="if ($(this).prev().hasClass(\'new\')) {blur_input_day($(this).siblings(\'.item.new\'))}"\n' +
        '    >Введите данные</a>\n' +
        '</div>';
    $('#page_month')[0].innerHTML = '<div class="body">\n' +
        '    <button id="add_month_task" onmousedown="click_add_month($(this))">\n' +
        '        <svg>\n' +
        '            <use xlink:href="time_manager/images/sprites.svg#sprite_btn_add"></use>\n' +
        '        </svg>\n' +
        '    </button>\n' +
        '    <a class="alert"\n' +
        '       onmouseenter="if ($(this).prev().hasClass(\'new\')) {blur_input_month($(this).siblings(\'.item.new\'))}"\n' +
        '    >Введите данные</a>\n' +
        '</div>';
    $('#page_lists')[0].innerHTML = '<div class="body lists">\n' +
        '    <button id="add_list" onmousedown="click_add_list($(this))">\n' +
        '        <svg>\n' +
        '            <use xlink:href="time_manager/images/sprites.svg#sprite_btn_add"></use>\n' +
        '        </svg>\n' +
        '    </button>\n' +
        '    <a class="alert"\n' +
        '       onmouseenter="if ($(this).prev().hasClass(\'new\')) {blur_input_list($(this).siblings(\'.item.new\'))}"\n' +
        '    >Введите данные</a>\n' +
        '</div>\n';
    $('#page_help').addClass('help_login');
    // Сбор мусора
    setTimeout(function () {
        $('#authorisation, header .center, header .right').removeAttr('style')
    }, close_time('#authorisation'));
    user_logined = true;
    clear_fields()
}
