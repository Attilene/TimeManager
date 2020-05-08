function connect_profile() {
    setTimeout(function () {
        let inputs = $('#user input');
        inputs.val('');
        inputs.removeClass('fill');
        $('#authorisation_menu').attr('class', 'empty')
    }, close_time('#authorisation_menu'));

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
        $('#avatar_inside').css({background: ''});
        $('header .right picture').css({background: ''});
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

    // Добавление/смена аватара
    $('#change_avatar').on('click', function () {
        $('#get_file').click()
    });
    $('#get_file').on('change', function () {
        let size = (($(this)[0].files[0].size) / 1024 / 1024).toFixed(1);
        if (user_data.login !== '' && $(this).val() !== '' && size < 10) {
            let img = new FormData();
            img.set('img', $("#get_file")[0].files[0], `${user_data.login}.jpg`);
            send_image(img, function () {
                let rand = + new Date();
                $('#avatar_inside').css({'background-image': `url(time_manager/images/avatars/${user_data.login}.jpg?img${rand})`});
                $('header .right picture').css({'background-image': `url(time_manager/images/avatars/${user_data.login}.jpg?img${rand})`});
                $('#avatar').removeClass('none')
            })
        }
        if (size > 10) {alert(`Объем данного файла (${size} МБ) превышает допустимый объём в 10 МБ`)}
    });

    // Выход
    $('#btn_exit').on('click', function () {
        logout();
        if (user_data.login !== '') { receive('/logout') }
    });

    // Подтверждение удаления профиля
    $('#menu_confirm_delete_profile .yes').on('click', function () {
        logout();
        if (user_data.login !== '') { receive('/delete_user') }
    });

    // Удаление аватара
    $('#remove_avatar').on('click', function () {
        $('#avatar').addClass('none');
        $('#avatar_inside').css({'background-image': ''});
        $('header .right picture').css({'background-image': ''});
        if (user_data.login !== '') {receive('/delete_avatar')}
    });



}