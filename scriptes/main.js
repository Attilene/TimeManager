let user_data = {'login': '', 'theme': 'light', 'color': 'blue'};
let user_logined = false;

jQuery(document).ready(function () {
    $('body').css({opacity: 0}).animate({opacity: 1}, 1000);
    clear_fields();
    // Запоминание страницы
    if (sessionStorage.getItem('page')) {
        if (!user_logined && (sessionStorage.page === 'day' ||
            sessionStorage.page === 'month' ||
            sessionStorage.page === 'lists')) {
            sessionStorage.page = 'help'
        }
        $(`#page_${sessionStorage.page}`).addClass('opened')
    }
    else {
        $(`#page_help`).addClass('opened');
        sessionStorage.page = 'help'
    }
    // Советы
    $('aside form input').on('mouseenter', function () {
        let input = $(this);
        input.prev().addClass('show');
        input.one('mouseleave', function () {
            input.prev().removeClass('show')
        });
    });
    // Кнопки изменения цвета
    $('aside .theme button').on('mousedown' , function () {
        change_theme($(this).data('theme'), $(this).data('color'))
    });
    // Указатель выбранной темы
    $(`aside menu .theme button[data-theme="${user_data.theme}"][data-color="${user_data.color}`).addClass('choice');
    if (user_logined) {
        if (!user_data.activated){
            $('#menu_edit_email, #confirm_email').addClass('nonactive');
        }
        if (restore) {
            toggle_aside($('#profile_menu'));
            toggle_set_menu($('#menu_edit_psw'));
        }
    }
    // Настройка времени колесиком
    $('main').on('wheel', 'div.body',function (event) {
        if ($('.time').has(event.target).length > 0) {
            event.preventDefault();
            let input = $(event.target);
            let int = parseInt(input.val());
            if (event.originalEvent.deltaY < 0) {
                if (int < input[0].max) {input.val(int + 1)}
                else {input.val(input[0].min)}
                if (isNaN(int)) {input.val(input[0].min)}
            }
            if (event.originalEvent.deltaY > 0) {
                if (int > input[0].min) {input.val(int - 1)}
                else {input.val(input[0].max)}
                if (isNaN(int)) {input.val(input[0].max)}
            }
        }
    })
});
