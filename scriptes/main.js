var user_logined = false;
var user_data = {'theme': 'light', 'color': 'blue'};
var page_data = {'theme': 'light', 'color': 'blue'};
var now_page = 'help';

jQuery(document).ready(function () {
    // Работа верхних кнопок
    $(document).on('click', '#authorisation span', function () {
        const menu_id = '#' + $(this).attr('id') + '_menu';
        if ($(menu_id).hasClass('opened')) {$(menu_id).removeClass('opened').animate({top: "50px", opacity: 0}, 200).fadeOut(0)}
        else {
            if ($('aside').hasClass('opened')) {
                $('aside.opened').removeClass('opened').css({zIndex: 100}).delay(300).fadeOut(0).animate({top: '50px', opacity: 0}, 0);
                $(menu_id).addClass('opened').css({zIndex: 101, top: '60px'}).fadeIn(0).animate({opacity: 1}, 300);
            }
            else {$(menu_id).addClass('opened').fadeIn(0).animate({top: "60px", opacity: 1}, 300)}
        }
    });
    $(document).on('click', 'main, header .left, header .center, footer', function () {
        if ($('aside').hasClass('opened')) {$('aside.opened').removeClass('opened').animate({top: "50px", opacity: 0}, 200).fadeOut(0)}
    });
    // Отключение анимации при перезагрузке
    $('body').attr('id', 'preload');
    setTimeout(function () {$('#preload').removeAttr('id')}, 100);
    // Подключение кнопок
    actions();
});
