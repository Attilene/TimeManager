let user_data = {'login': '', 'theme': 'light', 'color': 'blue'};
let user_logined = false;

jQuery(document).ready(function () {
    // Советы
    $('aside form input').on('mouseenter', function () {
        let label = $(this);
        label.prev().addClass('show');
        label.one('mouseleave', function () {
            label.prev().removeClass('show')
        });
    });
    // Указатель выбранной темы
    $(`aside menu .theme button[data-theme="${user_data.theme}"][data-color="${user_data.color}`).addClass('choice');
    // Кнопки изменения цвета
    // $('aside .theme button').on('mousedown' , function () {
    //     console.log($(this).data('theme'), $(this).data('color'));
    //     change_theme($(this).data('theme'), $(this).data('color'))
    // });

    if (user_logined) {

    }
    else {

    }
});
