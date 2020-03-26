var authorisation = false;
var theme = 'light';
var color = 'blue';

function login() {
    // Вход пользователя
    var get_theme = get('/get_data');
    var login = get_theme['login'];
    theme = get_theme['theme'][0];
    color = get_theme['theme'][1];
    $('header .right img.avatar').attr('src', `time_manager/images/avatars/${login}.jpg`);
    $('aside #hat .avatar:first-child').attr('src', `time_manager/images/avatars/${login}.jpg`);
}

function get(url, send_data=null, func=null) {
    // Отправка JSON формы на сервер
    return($.post(url, send_data, func))
}

function send(url, data) {
    // Отправка JSON формы на сервер
    $.ajax({
        url: url,
        type: "POST",
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data)
    });
}

jQuery(document).ready(function () {

    console.log(get('/get_data', null,
        ));

    // Отключение анимации при перезагрузке
    $('body').attr('id', 'preload')
    setTimeout(function () {
        $('#preload').removeAttr('id')
    }, 300);

    // Анимация окна профиля
        $('main, header .left, header .center, footer').on('click', function () {
        const aside = $('body aside');
        if (aside.attr('class') === 'opened') {aside.removeClass('opened').animate({top: "50px", opacity: 0}, 200).fadeOut(0)}
    });

    $('header .right').on('click', function () {
        const aside = $('body aside');
        if (aside.attr('class') === 'opened') {aside.removeClass('opened').animate({top: "50px", opacity: 0}, 200).fadeOut(0)}
        else {aside.addClass('opened').fadeIn(0).animate({top: "60px", opacity: 1}, 300)}
    });




    // Кнопки изменения цвета
    $('aside .theme button').on('click', function () {
        const new_theme = $(this).attr('class').split(' ')[0];
        const new_color = $(this).attr('class').split(' ')[1];
        if (new_theme !== theme) {
            $('link#theme_choice').attr('href', `time_manager/styles/themes/${new_theme}.css`);
        }
        if (new_color !== color) {$('link#favicon_choice').attr('href', `time_manager/images/favicons/${new_color}.svg`);
            $('link#color_choice').attr('href', `time_manager/styles/colors/${new_color}.css`);
        }
        if ((new_theme !== theme) || (new_color !== color)) {
            send('/change_theme', `${new_theme} ${new_color}`);
            theme = new_theme;
            color = new_color;
        }
    })

});