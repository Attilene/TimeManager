var user_logined = false;
var user_data = {'theme': 'light', 'color': 'blue'};
var page_data = {'theme': 'light', 'color': 'blue'};


jQuery(document).ready(function () {
    // Добавление окна авторизации
    $('aside').attr('id', 'login_menu');
    $('aside#login_menu').after("<aside id='register_menu'</aside>");

    insert_page('aside#login_menu', "login_menu");
    insert_page('aside#register_menu', "register_menu");

    toggle_menu('header #authorisation span#login', 'aside#login_menu');
    toggle_menu('header #authorisation span#register', 'aside#register_menu');
    // Отключение анимации при перезагрузке
    $('body').attr('id', 'preload');
    setTimeout(function () {$('#preload').removeAttr('id')}, 300);
    actions()
});
