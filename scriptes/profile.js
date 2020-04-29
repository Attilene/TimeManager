function connect_profile() {
    function logout() {
        receive('/logout');
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
        // Сброс имени пользователя и аватарки
        $('header .right a div.nickname').text('Guest');
        $('#set_login').val('Guest');
        // Загрузка аватара
        $('#avatar_inside').css({'background-image': ''});
        $('header .right picture').css({'background-image': ''});
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

    // Подтверждение выхода
    $('#menu_confirm_exit .yes').on('click', logout);

    // // Подтверждение удаления профиля
    // $('#menu_confirm_delete .yes').on('click', logout)





}