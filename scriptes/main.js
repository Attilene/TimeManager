let user_logined = false;
let user_data = {'theme': 'light', 'color': 'blue'};
let key = '';

receive('/get_key', function (data) {
    key = data;
    $('#form_login').attr('placeholer', 'Логин / Почта').removeAttr('disabled')
});

jQuery(document).ready(function () {
    user_logined = !($('header').hasClass('logout'));
    connect_actions();
    connect_pages();
    toggle_menu();
});
