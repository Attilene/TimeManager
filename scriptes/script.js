function send(url, request) {
    // Отправка JSON формы на сервер
    $.ajax({
        type: "POST",
        contentType: 'application/json',
        url: url,
        dataType: 'json',
        data: JSON.stringify(request)
    });
}

jQuery(document).ready(function () {

    // Получение данных от сервера
    const roots = $('#roots');
    var theme = roots.data('theme');
    var color = roots.data('color');

    setTimeout(function () {
        $('#preload').removeAttr('id')
    }, 300);

    // Анимация окна
        $('main, header .left, header .center, footer').on('click', function () {
        const aside = $('body aside');
        if (aside.attr('class') === 'opened') {aside.removeClass('opened').animate({top: "50px", opacity: 0}, 200).fadeOut(0)}
    });

    $('header .right').on('click', function () {
        const aside = $('body aside');
        if (aside.attr('class') === 'opened') {aside.removeClass('opened').animate({top: "50px", opacity: 0}, 200).fadeOut(0)}
        else {aside.addClass('opened').fadeIn(0).animate({top: "60px", opacity: 1}, 300)}
    });

    // Кнопки изменения цвета
    $('aside .theme button').on('click', function () {
        const new_theme = $(this).attr('class').split(' ')[0];
        const new_color = $(this).attr('class').split(' ')[1];
        if (new_theme !== theme) {
            $('link#theme_choice').attr('href', `time_manager/styles/themes/${new_theme}.css`);
        }
        if (new_color !== color) {$('link#favicon_choice').attr('href', `time_manager/images/favicons/${new_color}.svg`);
            $('link#color_choice').attr('href', `time_manager/styles/colors/${new_color}.css`);
        }
        if ((new_theme !== theme) || (new_color !== color)) {
            send('/change_theme', `${new_theme} ${new_color}`);
            theme = new_theme;
            color = new_color;
        }
    })

});