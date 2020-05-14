// Показ и скрытие меню
function toggle_aside(menu) {
    if (menu.hasClass('opened')) {
        $('body').off('click');
        menu.addClass('closed');
        // Сбор мусора
        setTimeout(function () {
            menu.removeClass('opened closed').css({display: ''})
        }, close_time(menu))
    } else {
        menu.fadeIn(0, function () {
            menu.addClass('opened')
        });
        $('body').off('click');
        hide_click(menu);
    }
}

// Сворачивание при клике в другой зоне
function hide_click (menu) {
    $('body').one('click', function hide_menu(event){
        if (menu.hasClass('opened') &&
            $('header .right').has(event.target).length === 0 &&
            !$('#button_authorisation').is(event.target) &&
            menu.has(event.target).length === 0) {
            toggle_aside(menu)
        }
        else hide_click(menu)
    });
}

function toggle_set_menu(set_button, set_menu) {
    if (typeof set_button === "string") {set_button = $(set_button)}
    if (typeof set_menu === "string") {set_menu = $(set_menu)}
    if (!set_menu.hasClass('nonactive')) {
        if (set_menu.hasClass('opened')) {
            set_menu.stop().slideUp(200, function () {
                set_menu.removeAttr('style')
            });
            set_menu.removeClass('opened');
            let temp = set_menu.children('form').children('input');
            fade_change(temp, function () {temp.removeClass('fill').val('')});
        }
        else {
            set_menu.stop().slideDown(200, function () {
                set_menu.removeAttr('style').css({display: 'block'})
            });
            set_menu.addClass('opened');
            hide_set_click(set_button, set_menu)
        }
    }
}

// Сворачивание при клике в другой зоне
function hide_set_click (button, area) {
    if (typeof button === "string") {button = $(button)}
    if (typeof area === "string") {area = $(area)}
    $('body').one('mousedown', function (event){
        if ($(area).hasClass('opened')) {
            if ((area.has(event.target).length > 0) || (area.is(event.target))) {
                hide_set_click(button, area)
            }
            else if (!(button === event.target)) {
                toggle_set_menu(button, area)
            }
        }
    });
}

function clear_fields() {
    let inputs = $('#user input, #set_psw, #set_email');
    inputs.val('');
    inputs.removeClass('fill');
    change_auth('empty');
    toggle_aside($('aside.opened'));
    warning(inputs);
    check_repass();
    inputs.prev('label').removeClass('show')
}

function act_field(field, func, empty_func=null) {
    if (field.val() !== '') {
        field.addClass('fill');
        func(field)
    }
    else {
        field.removeClass('fill');
        warning(field);
        if (empty_func !== null) {empty_func()}
        if ($('#user').has(field)) check_empty()
    }
}

function logout() {
    // Закрытие меню
    let menu = $('#profile_menu');
    if (menu.hasClass('opened')) {
        menu.addClass('closed');
        // Сбор мусора
        setTimeout(function () {
            menu.removeClass('opened closed').css({display: ''})
        }, close_time(menu))
    }
    let set_menu = $('aside menu.opened');
    set_menu.stop().slideUp(200, function () {
        set_menu.removeAttr('style')
    });
    // Сброс данных
    user_data = {'login': '', 'theme': user_data.theme, 'color': user_data.color};
    set_menu.removeClass('opened');
    // Очистка страниц
    $('#page_lists').html('');
    $('#page_day').html('');
    $('#page_month').html('');
    // Восстанавление темы
    change_theme('light', 'blue');
    // Сброс аватара
    $('#avatar_inside').css({background: ''});
    $('header .right picture').css({background: ''});
    // Исчезновение кнопок
    $('header .center, header .right').css({display: 'block'});
    $('#authorisation').fadeIn(0);
    $('header').addClass('logout');
    // Сбор мусора
    setTimeout(function () {
        $('#authorisation, header .center, header .right').removeAttr('style')
    }, close_time('#authorisation'));
    user_logined = false;
    clear_fields()
}

// Изменение никнейма
function input_set_login(in_set_log) {
    let temp = in_set_log.val();
    if (temp === '') {warning($(this))}
    else if (temp === user_data.login) {warning(in_set_log, 'Ваш никнейм', 'achive')}
    else if (temp.length <= 33) {
        receive('/check_user', function (data) {
            if (data) {warning(in_set_log, 'Никнейм занят')}
            else {send('/change_log', temp, function () {
                $('header .right a div.nickname').text(temp);
                warning(in_set_log, 'Никнейм изменён', 'achive');
                user_data.login = temp
            })}
        })
    }
    else {warning('Длина никнейма не может превышать 33 символа')}
}

// Добавление/смена аватара
function onchange_get_file(file) {
    if (file) {
        let size = ((file.size) / 1024 / 1024).toFixed(1);
        if (size <= 10) {
            if (user_data.login !== '') {
                let img = new FormData();
                img.set('img', file, `${user_data.login}.jpg`);
                send_image(img, function () {
                    const fr = new FileReader();
                    fr.onload = (function(theFile) {
                    return function(e) {
                        $('#avatar_inside').css({'background-image': `url(${e.target.result})`});
                        $('header .right picture').css({'background-image': `url(${e.target.result})`});
                    };
                    })(file);
                    fr.readAsDataURL(file);
                    $('#avatar').removeClass('none')
                })
            }
        }
        else {alert(`Объем данного файла (${size} МБ) превышает допустимый объём в 10 МБ`)}
    }
}

// Удаление аватара
function click_remove_avatar() {
    $('#avatar').addClass('none');
    $('#avatar_inside').css({'background-image': ''});
    $('header .right picture').css({'background-image': ''});
    if (user_data.login !== '') {receive('/delete_avatar')}
}

// Кнопки
function click_show_psw(field) {
    if (field.hasClass('show_psw')) {
        field.removeClass('show_psw');
        field.off('mouseleave');
        fade_change(field, function () {
            field.attr('type', 'password')
        })
    }
    else {
        field.addClass('show_psw');
        field.one('mouseleave', function () {
            click_show_psw(field)
        });
        fade_change(field, function () {
            if (field.hasClass('show_psw')) field.attr('type', 'text')
        });
    }
}

// Смена почты
function input_set_email(in_set_email) {
    let temp = in_set_email.val();
    if (/[a-zA-Z0-9-]+@([a-zA-Z]{2,10}.){1,3}(com|by|ru|cc|net|ws})$/.test(temp) && temp.length < 100) {
        receive('/check_user', function (data) {
            if (user_data.login === '') {
                warning(in_set_email, 'Смена почты гостевой записи невозможна')
            }
            else if (data) {
                warning(in_set_email, 'Почта занята');
            }
            else {
                receive('/change_email', function () {
                    warning(in_set_email, 'Почта изменена', 'achive');
                }, temp)
            }
        }, temp)
    }
    else {
        warning(in_set_email, 'Некорректный формат почты');
    }
}

// Смена пароля
function input_set_psw(in_set_psw) {
    let temp = in_set_psw.val();
    if (temp === '') {warning(in_set_psw)}
    else if (temp.length > 99) { warning(in_set_psw, 'Длина пароля должна быть не больше 99 символов')}
    else if (temp.length < 8) { warning(in_set_psw, 'Длина пароля должна быть не меньше 8 символов')}
    else if (!RegExp('[0-9]+').test(temp)) { warning(in_set_psw, 'Пароль должен содержать цифры')}
    else if (!RegExp('[a-zA-Zа-яА-Я]+').test(temp)) { warning(in_set_psw, 'Пароль должен содержать буквы')}
    else if (user_data.login === '') {warning(in_set_psw, 'Смена пароля гостевой записи невозможна')}
    else {
        receive('/check_user', function (data) {
            if (data) {
                receive('/change_pass', function () {
                    warning(in_set_psw, 'Пароль изменен', 'achive')
                }, pack_psw(temp, data[0]))
            }
        }, user_data.login);
    }
}
