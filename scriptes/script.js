var user_data = {};

function insert(selector, file_name) {
    // Получение HTML шаблона
    $.ajax({
        url: '/get_page',
        type: "POST",
        contentType: 'application/json',
        dataType: 'html',
        data: `"${file_name}"`,
        success: function (data) {
            $(selector).html(data)
        }
    });
}

function get(url, send_data=null) {
    // Получение JSON формы с сервера
    return($.ajax({
        url: url,
        type: "POST",
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(send_data)
    }))
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

function authorisation(login) {
    // Вход пользователя
    user_data = get('/login', login);
    user_data['login'] = login;
    // Установка имени пользователя
    // $.('header .right')
    // Загрузка аватара
    $.ajax({
        url: `time_manager/images/avatars/${user_data['login']}.jpg`,
        success: function() {
            $('header .right img.avatar').attr('src', `time_manager/images/avatars/${user_data['login']}.jpg`);
            $('aside #hat .avatar:first-child').attr('src', `time_manager/images/avatars/${user_data['login']}.jpg`);
        }
    });
    // Пявление кнопок
    $('header').removeClass('logout');
    $('#authorisation').css({display: 'block', transition: 'none'}).animate({top: '20px', opacity: 0}, 100, 'linear').fadeOut(0);
    $('header .center, header .right').css({position: 'relative', bottom: '10px', opacity: 0});
    $('header .center').fadeIn(0).animate({bottom: 0, opacity: 1}, 0);
    $('header .right').fadeIn(0).animate({bottom: 0, opacity: 1}, 0);
    $('#authorisation').animate({top: '10px', opacity: 0}, 0).fadeOut(0);
    // Замена меню
    insert('aside', "profile");
}

// Активаторы
jQuery(document).ready(function () {
    // Вход тестового пользователя
    $('header .left').on('click', function () {if ($.isEmptyObject(user_data)) {authorisation('Guest')}});
    // Выпадание окна профиля
    $(document).on('click', 'main, header .left, header .center, footer', function () {
        const aside = $('body aside');
        if (aside.hasClass('opened')) {aside.removeClass('opened').animate({top: "50px", opacity: 0}, 200).fadeOut(0)}
    });
    $(document).on('click', 'header .right, header #authorisation', function () {
        const aside = $('body aside');
        if (aside.hasClass('opened')) {aside.removeClass('opened').animate({top: "50px", opacity: 0}, 200).fadeOut(0)}
        else {aside.addClass('opened').fadeIn(0).animate({top: "60px", opacity: 1}, 300)}
    });
    // Кнопки изменения цвета
    $(document).on('click', 'aside .theme button', function () {
        console.log(user_data);
        const new_theme = $(this).attr('class').split(' ')[0];
        const new_color = $(this).attr('class').split(' ')[1];
        console.log(new_theme, new_color);
        if (new_theme !== user_data['theme']) {
            console.log(new_theme, user_data['theme']);
            $('link#theme_choice').attr('href', `time_manager/styles/themes/${new_theme}.css`);
        }
        if (new_color !== user_data['color']) {$('link#favicon_choice').attr('href', `time_manager/images/favicons/${new_color}.svg`);
            $('link#color_choice').attr('href', `time_manager/styles/colors/${new_color}.css`);
            console.log(2)
        }
        if ((new_theme !== user_data['theme']) || (new_color !== user_data['color'])) {
            send('/change_theme', `${new_theme} ${new_color}`);
            user_data['theme'] = new_theme;
            user_data['color'] = new_color;
            console.log(3)
        }
    });
});

// Временные действия
jQuery(document).ready(function () {
    // Добавление окна авторизации
    insert('aside', "authorisation");
    // Отключение анимации при перезагрузке
    $('body').attr('id', 'preload');
    setTimeout(function () {$('#preload').removeAttr('id')}, 300);
});



// TODO: Разделенный флоат на аве с удалением
// TODO: Сверху динамический ник
// TODO: Сбоку смена пароля и удаление странички вместо .hat блока
// TODO: Восстановление пароля
// TODO: Сделать обЪекты передвигаемымы
