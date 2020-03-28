var user_logined = false;
var user_data = {};

$.ajaxSetup({
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    error: function(jqXHR, textStatus, errorThrown) {
    console.log('Ошибка: ' + textStatus + ' | ' + errorThrown, jqXHR);
  }
});

function insert(selector, file_name) {
    // Получение HTML шаблона
    $.ajax({
        url: '/get_page',
        dataType: 'html',
        data: `"${file_name}"`,
        success: function (data) {$(selector).html(data)}
    });
}

function get(url, send_data=null, success=null) {
    // Получение JSON формы с сервера
    return($.ajax({
        url: url,
        data: JSON.stringify(send_data),
        success: success
    }))
}

function send(url, data) {
    // Отправка JSON формы на сервер
    $.ajax({
        url: url,
        data: JSON.stringify(data)
    });
}

function activators() {
    // Функционал нажатий
    // Вход тестового пользователя
    $(document).on('click', 'header .left', function () {
        if (!user_logined) {
            authorisation('Guest', 'Год рождения Сталина')
        }
    });
    // Выпадание окна профиля
    $(document).on('click', 'main, header .left, header .center, footer', function () {
        const aside = $('body aside');
        if (aside.hasClass('opened')) {
            aside.removeClass('opened').animate({top: "50px", opacity: 0}, 200).fadeOut(0)
        }
    });
    $(document).on('click', 'header .right, header #authorisation', function () {
        const aside = $('body aside');
        if (aside.hasClass('opened')) {
            aside.removeClass('opened').animate({top: "50px", opacity: 0}, 200).fadeOut(0)
        } else {
            aside.addClass('opened').fadeIn(0).animate({top: "60px", opacity: 1}, 300)
        }
    });
    // Кнопки изменения цвета
    $(document).on('click', 'aside .theme button', function () {
        const new_theme = $(this).attr('class').split(' ')[0];
        const new_color = $(this).attr('class').split(' ')[1];
        console.log(2, user_data['theme'], new_theme, new_theme !== user_data['theme']);
        if (new_theme !== user_data['theme']) {
            console.log(new_theme, user_data['theme']);
            $('link#theme_choice').attr('href', `time_manager/styles/themes/${new_theme}.css`);
        }
        console.log(3, user_data['color'], new_color, new_color !== user_data['color']);
        if (new_color !== user_data['color']) {
            $('link#favicon_choice').attr('href', `time_manager/images/favicons/${new_color}.svg`);
            $('link#color_choice').attr('href', `time_manager/styles/colors/${new_color}.css`);
        }
        if ((new_theme !== user_data['theme']) || (new_color !== user_data['color'])) {
            console.log(4);
            send('/change_theme', `${new_theme} ${new_color}`);
            user_data['theme'] = new_theme;
            user_data['color'] = new_color;
        }
    });
}

function authorisation(login, password) {
    // Вход пользователя
    // Запрос
    user_logined = true;
    get('/login', [login, password], function (data) {
        user_data = data;
        // Установка имени пользователя
        $('header .right a div').text(user_data['login']);
        // Загрузка аватара
        if (user_data['avatar']) {
            $('header .right img.avatar').attr('src', `time_manager/images/avatars/${user_data['login']}.jpg`);
            $('aside #hat .avatar:first-child').attr('src', `time_manager/images/avatars/${user_data['login']}.jpg`);
        }
        else {
            $('header .right img.avatar').attr('src', `time_manager/images/avatars/default.jpg`);
            $('aside #hat .avatar:first-child').attr('src', `time_manager/images/avatars/default.jpg`);
        }
        // Появление кнопок
        $('header').removeClass('logout');
        $('#authorisation').css({display: 'block', transition: 'none'}).animate({top: '20px', opacity: 0}, 100, 'linear').fadeOut(0);
        $('header .center, header .right').css({position: 'relative', bottom: '10px', opacity: 0});
        $('header .center').fadeIn(0).animate({bottom: 0, opacity: 1}, 0);
        $('header .right').fadeIn(0).animate({bottom: 0, opacity: 1}, 0);
        $('#authorisation').animate({top: '10px', opacity: 0}, 0).fadeOut(0);
        // Замена меню
        insert('aside', "profile");
    })
}



// Временные действия
jQuery(document).ready(function () {
    // Добавление окна авторизации
    insert('aside', "authorisation");
    // Отключение анимации при перезагрузке
    $('body').attr('id', 'preload');
    setTimeout(function () {$('#preload').removeAttr('id')}, 300);
    activators()
});
