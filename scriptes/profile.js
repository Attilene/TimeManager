function connect_profile() {
    setTimeout(function () {$('#user input').val('')}, close_time('#authorisation_menu'));

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
        // Сброс имени пользователя
        $('header .right a div.nickname').text('Guest');
        $('#set_login').val('Guest');
        // Сброс аватара
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

    // Добавление аватара
    $('#change_avatar').on('click', function () {
        $('#get_file').click()
    });
    $('#get_file').on('change', function () {
        let img = new FormData();
        img.set('img', $("#get_file")[0].files[0], `${user_data.login}.jpg`);
        send_image(img, function () {
            $.get(`/time_manager/images/avatars/${user_data.login}.jpg`, function () {
                $('#avatar_inside').css({'background-image': 'none'}).css({'background-image': `url(time_manager/images/avatars/${user_data.login}.jpg)`});
                $('header .right picture').css({'background-image': 'none'}).css({'background-image': `url(time_manager/images/avatars/${user_data.login}.jpg)`})
            })
        })

    });

    // Подтверждение выхода
    $('#menu_confirm_exit .yes').on('click', function () {
        logout();
        if (user_data.login !== '') { receive('/logout') }
    });

    // Подтверждение удаления профиля
    $('#menu_confirm_delete_profile .yes').on('click', function () {
        logout();
        if (user_data.login !== '') { receive('/delete_user') }
    });

    // Подтверждение удаления аватара
    $('#menu_confirm_delete_avatar .yes').on('click', function () {
        $('#avatar').addClass('none');
        $('#avatar_inside').css({'background-image': ''});
        $('header .right picture').css({'background-image': ''});
        if (user_data.login !== '') {receive('/delete_avatar')}
    });



}