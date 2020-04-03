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
    toggle_menu();
    // for (let i = 0; i < 5; i + 1) {
    //     setTimeout( function () {
    //         $('#authorisation_menu').removeClass('login register')
    //     }, i * 4 * 1000);
    //     setTimeout( function () {
    //         $('#authorisation_menu').addClass('login')
    //     }, (i * 4 + 1) * 1000);
    //     setTimeout( function () {
    //         $('#authorisation_menu').removeClass('login register')
    //     }, (i * 4 + 2) * 1000);
    //     setTimeout( function () {
    //         $('#authorisation_menu').addClass('register')
    //     }, (i * 4 + 3) * 1000);
    // }

});
