function change_theme(theme) {
    // Смена темы на сервере
    $('link#theme_choice').attr('href', `time_manager/styles/themes/${theme}.css`);
}

function change_color(color) {
    // Смена цвета на сервере
    $('link#favicon_choice').attr('href', `time_manager/images/favicons/${color}.svg`);
    $('link#color_choice').attr('href', `time_manager/styles/colors/${color}.css`);
}

function toggle_menu(click, menu) {
    // Сворачивание при клике в другой зоне
    $(document).on('click', 'main, header .left, header .center, footer', function () {
        if ($(menu).hasClass('opened')) {
            $(menu).removeClass('opened').animate({top: "50px", opacity: 0}, 200).fadeOut(0)
        }
    });
    // Переключатель сворачивания
    $(document).on('click', click, function () {
        if ($(menu).hasClass('opened')) {
            $(menu).removeClass('opened').animate({top: "50px", opacity: 0}, 200).fadeOut(0)
        } else {
            $(menu).addClass('opened').fadeIn(0).animate({top: "60px", opacity: 1}, 300)
        }
    })}

function authorisation(login, password) {
    // Вход пользователя
    // Запрос
    user_logined = true;
    page_data = {...user_data};
    get('/login', [login, password], function (data) {
        // Синхронизация данных
        if (data['login'] === 'Guest') {user_data = {
            'login': data['login'],
            'theme': page_data['theme'],
            'color': page_data['color'],
            'avatar': data['avatar']
            }
        }
        else {
            user_data = data;
            if (user_data['theme'] !== page_data['theme']) {change_theme(user_data['theme'])}
            if (user_data['color'] !== page_data['color']) {change_color(user_data['color'])}
        }
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
        $('header .center, header .right').fadeIn(0).animate({bottom: 0, opacity: 1}, 0);
        $('#authorisation').animate({top: '10px', opacity: 0}, 0).fadeOut(0);
        // Замена меню
        toggle_menu('header .right', 'aside#profile_menu')
    })
}

function connect_pages() {
    // Смена страницы
    $(document).ready(function () {
        $(document).on('click', 'header .center, footer .right', function() {
            var page = $(this).attr('id').slice(7);
            if (page !== now_page) {
                $(`main#page_${now_page}`).addClass('closed');
                setTimeout(function () {
                    $(`main#page_${now_page}`).removeAttr('class style');
                    now_page = page;
                }, 300);
                $(`main#page_${page}`).fadeIn(0, function () {$(this).addClass('opened')});
            }
        })
    })
}

function connect_actions() {
    // Функционал нажатий
    // Вход тестового пользователя
    $(document).on('click', 'header .left', function () {
        if (!user_logined) {
            authorisation('Guest', 'Год рождения Сталина')
        }
    });
    // Кнопки изменения цвета
    $(document).on('click', 'aside .theme button', function () {
        const new_theme = $(this).attr('class').split(' ')[0];
        const new_color = $(this).attr('class').split(' ')[1];
        if (new_theme !== user_data['theme']) {change_theme(new_theme)}
        if (new_color !== user_data['color']) {change_color(new_color)}
        if ((new_theme !== user_data['theme']) || (new_color !== user_data['color'])) {
            if (user_logined)
            {send('/change_theme', `${new_theme} ${new_color}`)}}
        user_data['theme'] = new_theme;
        user_data['color'] = new_color;
    });
}
