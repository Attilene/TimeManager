var user_logined = false;
var user_data = {'theme': 'light', 'color': 'blue'};


jQuery(document).ready(function () {
    // Подключение кнопок
    user_logined = !($('header').hasClass('logout'));
    connect_actions();
    connect_pages();
    toggle_menu();
});
