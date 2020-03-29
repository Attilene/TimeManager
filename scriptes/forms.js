
function authorisation(login, password) {
    // Вход пользователя
    // Запрос
    user_logined = true;
    page_data = {...user_data};
    get('/login', [login, password], function (data) {
        user_data = data;
        // Установка пользовательской темы
        if (user_data['theme'] !== page_data['theme']) {change_theme(user_data['theme'])}
        if (user_data['color'] !== page_data['color']) {change_color(user_data['color'])}
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
