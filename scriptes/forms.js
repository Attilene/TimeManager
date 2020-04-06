function connect_authorisation () {
    const fields = $('#user input');
    var errors = false;
    var salt = '';
    var in_login = $('#form_login');
    var in_email = $('#form_email');
    var in_pass = $('#form_password');
    var in_repass = $('#form_repass');


    function cor_check(str) {
        let chrs = ['#', '-', ';', '(', ')', '{', '}', '\\', '/', '|', '[', ']', '\'', '\"', '%', '@', '.', '$'];
        for (let i = 0; i < chrs.length; i++) {if (str.includes(chrs[i])) {return false}}
        return true
    }

    function fade_change(field, func) {
        if (typeof field === "string") {field = $(field)}
        field.addClass('change');
        setTimeout(function () {
            func();
            field.removeClass('change');
        }, close_time(field))
    }

    function warning(field, text=null, type='warning') {
        let label = $(`#authorisation_menu form#user label[for=form_${field}]`);
        if (text == null) {label.removeClass(type)}
        else {
            if (label.hasClass(type)) {
                fade_change(label, function () {
                    label.addClass(type);
                    label.text(text);
                })
            }
            else {label.text('').removeClass()}
        }
    }

    // function check_empty() {
    //     console.log(1);
    //     if (in_login.val() === '' && in_email.val() === '') {
    //         console.log(2);
    //         change_auth('');
    //         in_pass.val('').attr('disabled', 'disabled');
    //         in_repass.val('').attr('disabled', 'disabled');
    //     }
    // }

    function check_pass() {
        receive('/check_password', in_pass.val(), function (data) {
            if (data) {authorisation(in_login.val, in_pass.val)}
        })
    }

    function change_auth(menu) {
        let temp_menu = $('#authorisation_menu');
        if (temp_menu.hasClass(menu)) {return}
        switch (true) {
            case (temp_menu.hasClass('login')):
                temp_menu.addClass(menu).removeClass('login'); break;
            case (temp_menu.hasClass('register')):
                temp_menu.addClass(menu).removeClass('register'); break;
            default:
                temp_menu.addClass(menu); break;
        }

        $('#remember_me').prop('checked', false);
        if (menu === 'register' || menu === 'login') {in_pass.removeAttr('disabled')}
        if (menu === 'login' || menu === '') {in_pass.removeAttr('disabled')}
        if (menu === '') {$('#form_password').val('').removeClass('fill').attr('disabled', 'disabled')}
    }

    // Проверка пустоты полей
    fields.on('hastext', function () {$(this).addClass('fill')});
    fields.on('notext', function () {$(this).removeClass('fill')});

    // Кнопки в инпутах
    $('#erase_login').on('click', function () {
        let temp = in_login;
        fade_change(temp, function () {temp.val('').removeClass('fill')});
        // check_empty()
    });
    $('#erase_email').on('click', function () {
        let temp = in_email;
        fade_change(temp, function () {temp.val('').removeClass('fill')});
        // check_empty()
    });


    $('#show_pass, #show_repass').on('mousedown', function () {
        let temp = $(this).prev();
        fade_change(temp, function () {temp.attr('type', 'text')});
        $(document).one('mouseup', function () {
            fade_change(temp, function () {temp.attr('type', 'password')})
        })
    });

    in_login.on('textchange', function () {
        if (in_login.val() !== '') {
            receive('/check_user', in_login.val(), function (data) {
                if (data) {
                    change_auth('login');
                    salt = data[0]
                }
                else {change_auth('register')}
            })
        }
        // check_empty()
    });

    in_email.on('textchange', function () {
        if (in_email !== '') {
            // receive('/check_email', {'email': $(this).val()}, function (data) {
            //     if (data) {
            //         in_login.val(in_email.val());
            //         change_auth('login')
            //     }
            // })
        }
        // check_empty()
    });

    // in_pass.on('textchange', function () {
    //     check_pass()
    // })



}

