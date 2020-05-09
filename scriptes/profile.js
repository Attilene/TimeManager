function connect_profile() {
    setTimeout(function () {
        let inputs = $('#user input');
        inputs.val('');
        inputs.removeClass('fill');
        $('#authorisation_menu').attr('class', 'empty')
    }, close_time('#authorisation_menu'));

    function act_set_field(field, func, empty_func=null) {
        if (typeof field === "string") {field = $(field)}
        field.on('input', function () {
            if (field.val() !== '') {
                field.addClass('fill');
                func()
            }
            else {
                field.removeClass('fill');
                warning(field);
                if (empty_func !== null) {empty_func()}
            }
        });
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
        $('body').off('mousedown');
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
    }

    // Добавление/смена аватара
    $('#get_file').on('change', function () {
        let size = (($(this)[0].files[0].size) / 1024 / 1024).toFixed(1);
        if (user_data.login !== '' && $(this).val() !== '' && size < 10) {
            let img = new FormData();
            img.set('img', $("#get_file")[0].files[0], `${user_data.login}.jpg`);
            send_image(img, function () {
                let rand = + new Date();
                $('#avatar_inside').css({'background-image': `url(time_manager/images/avatars/${user_data.login}.jpg?img${rand})`});
                $('header .right picture').css({'background-image': `url(time_manager/images/avatars/${user_data.login}.jpg?img${rand})`});
                $('#avatar').removeClass('none')
            })
        }
        if (size > 10) {alert(`Объем данного файла (${size} МБ) превышает допустимый объём в 10 МБ`)}
    });

    // Выход
    $('#btn_exit').on('click', function () {
        logout();
        if (user_data.login !== '') { receive('/logout') }
    });

    // Подтверждение удаления профиля
    $('#menu_confirm_delete .yes').on('click', function () {
        logout();
        if (user_data.login !== '') { receive('/delete_user') }
    });

    // Удаление аватара
    $('#remove_avatar').on('click', function () {
        $('#avatar').addClass('none');
        $('#avatar_inside').css({'background-image': ''});
        $('header .right picture').css({'background-image': ''});
        if (user_data.login !== '') {receive('/delete_avatar')}
    });

    // Советы
    let fields = $('#profile_menu input');
    fields.on('mouseenter', function () {
        $(this).prev().addClass('show');
        fields.one('mouseleave', function () {
            $(this).prev().removeClass('show')
        });
    });

    // Изменение никнейма
    $('#set_login').on('input', function () {
        let in_set_log = $(this);
        let temp = in_set_log.val();
        if (temp === '') {warning($(this))}
        else if (temp === user_data.login) {warning(in_set_log, 'Ваш никнейм', 'achive')}
        else if (temp.length <= 33) {
            receive('/check_user', function (data) {
                if (data) {warning(in_set_log, 'Никнейм занят')}
                else {send('/change_log', temp, function () {
                    warning(in_set_log, 'Никнейм изменён', 'achive');
                    user_data.login = temp
                })}
            })
        }
        else {warning('Длина никнейма не может превышать 33 символа')}
    });
    $('#set_login').on('blur', function () {
        $('label[for=set_login]').text('').removeClass('achive warning');
    });

    // Кнопки
    $('#erase_set_email').on('click', function () {
        let temp = $(this).prev();
        fade_change(temp, function () {
            temp.val('').removeClass('fill').css({pointerEvents: 'none'});
            setTimeout(function () { temp.css({pointerEvents: ''}) }, close_time(temp));
            warning(temp);
        });
    });

    $('#show_set_psw').on('mousedown', function () {
        let temp = $(this).prev();
        if (temp.attr('type') === 'text') {
            fade_change(temp, function () {temp.attr('type', 'password')})
        }
        else {
            fade_change(temp, function () {temp.attr('type', 'text')})
        }
    });

    // Смена почты
    let in_set_email = $('#set_email');
    act_set_field(in_set_email, function () {
        let temp = in_set_email.val();
        if (/[a-zA-Z0-9]+@([a-zA-Z]{2,10}.){1,3}(com|by|ru)$/.test(temp) && temp.length < 100) {
            receive('/check_user', function (data) {
                if (data) {
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
    });

    // Смена пароля
    let in_set_psw = $('#set_psw');
    act_set_field(in_set_psw, function () {
        let pass = in_set_psw.val();
        if (pass === '') {warning(in_set_psw)}
        else if (pass.length > 99) { warning(in_set_psw, 'Длина пароля должна быть не больше 99 символов')}
        else if (pass.length < 8) { warning(in_set_psw, 'Длина пароля должна быть не меньше 8 символов')}
        else if (!RegExp('[0-9]+').test(pass)) { warning(in_set_psw, 'Пароль должен содержать цифры')}
        else if (!RegExp('[a-zA-Zа-яА-Я]+').test(pass)) { warning(in_set_psw, 'Пароль должен содержать буквы')}
        else {
            receive('/check_user', function (data) {
                if (data) {
                    receive('/change_pass', function () {
                        warning(in_set_psw, 'Пароль изменен', 'achive')
                    }, pack_psw(pass, data[0]))
                }
            }, user_data.login);
        }
    });


}