function connect_authorisation () {
    const fields = '#user input';
    var errors = false;
    var in_login = $('#form_login');
    var in_email = $('#form_email');
    var in_pass = $('#form_password');
    var in_repass = $('#form_repass');

    function hash(psw, salt) {
        return encrypt(psw + salt)
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

    function check_empty(field=null) {
        const user_fields = $('#form_login, #form_email');
        if (!(user_fields.hasClass('fill'))) {
            change_auth('');
            in_pass.val('').attr('disabled', 'disabled');
            in_repass.val('').attr('disabled', 'disabled');
        }
        if (field === null) {return}

        if (field.val() === '') {
            field.removeClass('fill');
            return true
        }
        else {
            field.addClass('fill');
            return false
        }
    }

    function check_pass(field) {

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

    $(fields).on('notext', function () {$(this).removeClass('fill')});
    $(fields).on('hastext', function () {$(this).addClass('fill')});

    $('#erase_login, #erase_email').on('click', function () {
        let temp = $(this).prev();
        fade_change(temp, function () {temp.val('').removeClass('fill')});
        check_empty();
    });
    $('#show_pass, #show_repass').on('mousedown', function () {
        let temp = $(this).prev();
        let temp_btn = $(this);
        fade_change(temp, function () {temp.attr('type', 'text')});
        temp_btn.one('mouseup mouseleave', function () {
            fade_change(temp, function () {temp.attr('type', 'password')});
        })
    });


    in_login.on('textchange', function () {
        if (!check_empty(in_login)) {
            receive('/check_user', {'name': in_login.val()}, function (data) {
                if (data['exist']) {
                    change_auth('login')
                    data['salt']
                }
                else {change_auth('register')}
            })
        }
    });

    in_email.on('textchange', function () {
        if (!check_empty(in_email)) {
            receive('/check_email', {'email': $(this).val()}, function (data) {
                if (data) {
                    in_login.val(in_email.val());
                    change_auth('login')
                }
            })
        }
    });



}

