var user_logined = false;
var user_data = {'theme': 'light', 'color': 'blue'};
var page_data = {'theme': 'light', 'color': 'blue'};
var now_page = 'help';

jQuery(document).ready(function () {
    // Отключение анимации при перезагрузке
    $('body').addClass('preload');
    setTimeout(function () {$('body').removeClass('preload')}, 10);
    // Подключение кнопок
    connect_actions();
    connect_pages();
    toggle_menu()
});
