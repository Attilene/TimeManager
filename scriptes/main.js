let user_data = {'login': '', 'theme': 'light', 'color': 'blue'};
let user_logined = false;

jQuery(document).ready(function () {
    clear_fields();
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
            $('#menu_edit_email').addClass('opened');
        }
        if (restore) {
            toggle_aside($('#profile_menu'));
            toggle_set_menu($('#btn_change_pass'), $('#menu_edit_psw'))
        }
    }
});
