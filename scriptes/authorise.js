function connect_authorisation () {
    const fields = $('#user input');
    const in_login = $('#form_login');
    const in_email = $('#form_email');
    const in_pass = $('#form_password');
    const in_repass = $('#form_repass');
    let salt = '';

    fields.ready(function () {
        in_login.focus();
    });

    // function validate(field) {
    //     if (typeof field === "string") {field = $(field)}
    //     let str = field.val();
    //     let cor_str = '';
    //     let chrs = ['#', ';', '(', ')', '{', '}', '\\', '/', '|', '[', ']', '\'', '\"', '%', '$'];
    //     for (let i = 0; i < str.length; i++) {if (!chrs.includes(str[i])) {cor_str += str[i]}}
    //     field.val(cor_str)
    // }
    
    function fade_change(field, func) {
        if (typeof field === "string") {field = $(field)}
        field.addClass('change');
        setTimeout(function () {
            func();
            field.removeClass('change');
        }, close_time(field))
    }

    function warning(field, text='Поле не должно быть пустым', type='warning') {
        if (typeof field === "string") {field = $(field)}
        let label = field.prev();
        if (!label.hasClass(type) || label.text() !== text) {
            label.removeClass('warning achive').addClass(type);
            fade_change(label, function () {
                label.css({width: label.css('width')})
                    .text(text)
                    .animate({
                        width: (30 + (text.length * 9)) + 'px'
                    }, close_time(label));
            })
        }
    }

    function check_empty() {
        if (in_login.val() === '' && in_email.val() === '') {
            change_auth('empty');
            return true
        }
        else return false
    }

    function check_cor_pass() {
        let pass = in_pass.val();
        if (pass === '') {warning(in_pass)}
        else if (pass.length > 99) { warning(in_pass, 'Длина пароля должна быть не больше 99 символов')}
        else if (pass.length < 8) { warning(in_pass, 'Длина пароля должна быть не меньше 8 символов')}
        else if (!RegExp('[0-9]+').test(pass)) { warning(in_pass, 'Пароль должен содержать цифры')}
        else if (!RegExp('[a-zA-Zа-яА-Я]+').test(pass)) { warning(in_pass, 'Пароль должен содержать буквы')}
        else {let test = !RegExp('[a-zа-я0-9]+').test(in_pass.val());
            let len = in_pass.val().length;
            if (len < 11 && !test) {warning(in_pass, 'Ненадежный пароль', 'achive')}
            else if (len < 16 || len < 11 && test) {warning(in_pass, 'Надежный пароль', 'achive')}
            else if (len < 20 || len < 16 && test) {warning(in_pass, 'Очень надежный пароль', 'achive')}
            toggle_repass('on');
            check_repass();
            return true}
        toggle_repass('off');
        return false
    }

    function check_repass() {
        if (in_pass.val() === in_repass.val()) {
            warning(in_repass, 'Пароли совпадают', 'achive');
            try_reg()
        }
        else {warning(in_repass, 'Пароли не совпадают')}
    }

    function toggle_repass(toggle='off') {
        if (toggle === 'on') {in_repass.removeAttr('disabled')}
        else {
            if (in_repass.attr('disabled') !== 'disabled') {
                in_repass.removeClass('fill');
                setTimeout(function () {
                    fade_change(in_repass, function () {
                        in_repass.attr('disabled', 'disabled').val('')
                    })
                }, close_time(in_repass));
            }
        }
    }

    function try_log() {
        if (salt !== '') {
            if (in_pass.val() !== '') {
                warning(in_pass, 'Проверка', 'achive');
                let pswsalt = pack_psw(salt);
                receive('/check_password', function (data) {
                    if (data) {
                        warning(in_pass, 'Выполняется вход', 'achive');
                        authorisation(in_login.val(), pswsalt)
                    } else {
                        warning(in_pass, 'Неверный пароль')
                    }
                }, {'log_email': in_login.val(), 'pswsalt': pswsalt})
            }
        }
        else {
            if (in_pass.val() === '') {warning(in_pass)}
            else {warning(in_pass, 'Проверка', 'achive')}
            setTimeout(try_log, 200)
        }
    }

    function try_reg() {
        if (!$('#user label').hasClass('warning')) {
            registration()
        }
    }

    function change_auth(menu) {
        let temp_menu = $('#authorisation_menu');
        if (temp_menu.hasClass(menu)) {return}
        if (temp_menu.hasClass('login')) {temp_menu.addClass(menu).removeClass('login')}
        else if (temp_menu.hasClass('register')) {temp_menu.addClass(menu).removeClass('register')}
        else if (temp_menu.hasClass('empty')) {temp_menu.addClass(menu).removeClass('empty')}

        $('#remember_me').prop('checked', false);
        switch (menu) {
            case 'empty':
                in_pass.val('').removeClass('fill').attr('disabled', 'disabled');
                break;
            case 'login':
                in_pass.removeAttr('disabled');
                try_log();
                break;
            case 'register':
                in_pass.removeAttr('disabled');
                check_cor_pass();
                break;
        }
    }

    function act_field(field, func, empty_func=null) {
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
                check_empty()
            }
        });
    }

    function registration() {
        let temp_psw = pack_psw(gen_salt());
        send('/register', {
            'log':     in_login.val(),
            'email':   in_email.val(),
            'pswsalt': temp_psw,
            'theme':   user_data.theme,
            'color':   user_data.color,
        }, function () {
            // Загрузка страниц
            insert_page('#page_lists', 'lists');
            insert_page('#page_month', 'month');
            insert_page('#page_day', 'day');
            // Закрытие меню
            user_data.login = in_login.val(); user_data.avatar = false;
            let menu = $('#authorisation_menu');
            if (menu.hasClass('opened')) {
                menu.addClass('closed');
                // Сбор мусора
                setTimeout(function () {menu.removeClass('opened closed').css({display: ''})}, close_time(menu))
            }
            $('body').off('mousedown');
            // Установка имени пользователя
            $('header .right a div.nickname').text(in_login.val());
            $('#set_login').val(in_login.val());
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

    function authorisation(login, password) {
        // Вход пользователя
        // Запрос
        receive('/login', function (data) {
            // Закрытие меню
            let menu = $('#authorisation_menu');
            if (menu.hasClass('opened')) {
                menu.addClass('closed');
                // Сбор мусора
                setTimeout(function () {menu.removeClass('opened closed').css({display: ''})}, close_time(menu))
            }
            $('body').off('mousedown');
            // Загрузка страниц
            insert_page('#page_lists', 'lists');
            insert_page('#page_month', 'month');
            insert_page('#page_day', 'day');
            // Синхронизация данных
            change_theme(data.theme, data.color);
            user_data = data;
            // Установка имени пользователя и аватарки
            $('header .right a div.nickname').text(login);
            $('#set_login').val(login);
            // Загрузка аватара
            if (true) {
                $('#avatar_inside').css({'background-image': `url(time_manager/images/avatars/${data.login}.jpg)`});
                $('header .right picture').css({'background-image': `url(time_manager/images/avatars/${data.login}.jpg)`})
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
        }, [login, password]);
    }

    // Советы
    fields.on('mouseenter', function () {
        $(this).prev().addClass('show');
        fields.one('mouseleave', function () {
            $(this).prev().removeClass('show')
        });
    });

    // Кнопки в инпутах
    $('#erase_login, #erase_email').on('click', function () {
        let temp = $(this).prev();
        fade_change(temp, function () {
            temp.val('').removeClass('fill').css({pointerEvents: 'none'});
            setTimeout(function () { temp.css({pointerEvents: ''}) }, close_time(temp));
            warning(temp);
            check_empty()
        });
    });

    $('#show_pass, #show_repass').on('mousedown', function () {
        let temp = $(this).prev();
        if (temp.attr('type') === 'text') {
                fade_change(temp, function () {
                    temp.attr('type', 'password')
                })
            }
        else if(temp.attr('type') === 'password') {fade_change(temp, function () {temp.attr('type', 'text')})}
            temp.one('mouseleave',function () {
            if (temp.attr('type') === 'text') {
                fade_change(temp, function () {
                    temp.attr('type', 'password')
                })
            }
        })
    });

    // Поля ввода
    act_field(in_login, function () {
        if (in_login.val().length < 100) {
            receive('/check_user', function (data) {
                if (data) {
                    in_pass.focus();
                    warning(in_login, 'Пользователь существует', 'achive');
                    change_auth('login');
                    salt = data[0];
                } else {
                    change_auth('register');
                    warning(in_login, 'Никнейм свободен', 'achive');
                    try_reg()
                }
            }, in_login.val())
        }
        else {warning('Длина никнейма не может превышать 99 символов')}
    }, function () {
        check_empty()
    });


    act_field(in_email, function () {
        let temp = in_email.val();
        if (/[a-zA-Z0-9]+@([a-zA-Z]{2,10}.){1,3}(com|by|ru)$/.test(temp) && temp.length < 100) {
            warning(in_email, 'Корректный формат почты', 'achive');
            receive('/check_user', function (data) {
                if (data) {
                    in_pass.focus();
                    warning(in_login, 'Пользователь существует', 'achive');
                    in_login.addClass('change');
                    in_email.val('');
                    setTimeout(function () {
                        in_login.val(temp).removeClass('change')
                    }, 200);
                    change_auth('login');
                    salt = data[0];
                }
                else {try_reg()}
            }, temp)
        }
        else {
            warning(in_email, 'Некорректный формат почты');
        }
    }, function () {
        check_empty();
    });


    act_field(in_pass, function () {
        check_repass();
        if ($('#authorisation_menu').hasClass('login')) { try_log() }
        else if (check_cor_pass()) { try_reg() }
    }, function () {
        warning(in_pass);
        toggle_repass('off');
        check_repass();
    });


    act_field(in_repass, function () {
        check_repass()
    });


    fields.keyup(function(event){
        if(event.keyCode === 13){
            event.preventDefault();
            $('#user label.warning').next().addClass('warning');
            setTimeout(function () {
                $('#user label.warning').next().removeClass('warning');
            }, 300)
        }
    });
}

