let user_logined = false;
let user_data = {'theme': 'light', 'color': 'blue'};
let key = '';

receive('/get_key', function (data) {
    key = data;
    $('#form_login').attr('placeholder', 'Логин / Почта').removeAttr('disabled')
});

jQuery(document).ready(function () {

    // Советы
    $('aside form input').on('mouseenter', function () {
        let label = $(this);
        label.prev().addClass('show');
        label.one('mouseleave', function () {
            label.prev().removeClass('show')
        });
    });




    user_logined = !($('header').hasClass('logout'));
    connect_actions();
    connect_pages();
    toggle_menu();
});
