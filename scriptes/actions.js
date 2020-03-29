function actions() {
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
        if (new_theme !== user_data['theme']) {change_theme(new_theme)}
        if (new_color !== user_data['color']) {change_color(new_color)}
        if ((new_theme !== user_data['theme']) || (new_color !== user_data['color'])) {
            if (user_logined) {send('/change_theme', `${new_theme} ${new_color}`)}
            user_data['theme'] = new_theme;
            user_data['color'] = new_color;
        }
    });
}
