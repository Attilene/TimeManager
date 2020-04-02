var user_logined = false;
var user_data = {'theme': 'light', 'color': 'blue'};


jQuery(document).ready(function () {
    // Отключение анимации при перезагрузке
    $('body').addClass('preload');
    setTimeout(function () {$('body').removeClass('preload')}, 10);
    // Подключение кнопок
    user_logined = !($('header').hasClass('logout'));
    connect_actions();
    connect_pages();
    toggle_menu()
});
