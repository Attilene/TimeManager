var user_logined = false;
var user_data = {'theme': 'light', 'color': 'blue'};
var page_data = {'theme': 'light', 'color': 'blue'};
var now_page = 'help';

jQuery(document).ready(function () {
    console.log('dfdf' === true);
    console.log(1 === true);
    console.log(0 === true);
    // Отключение анимации при перезагрузке
    $('body').addClass('preload');
    setTimeout(function () {$('body').removeClass('preload')}, 10);
    // Подключение кнопок
    connect_actions();
    connect_pages();
    toggle_menu()
});
