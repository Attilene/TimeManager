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
    const css = roots.data('css');
    const img = roots.data('img');
    const scr = roots.data('scr');
    var theme = roots.data('theme');
    var color = roots.data('color');


    // Анимация окна
        $('main, footer').on('click', function () {
        const aside = $('body aside');
        if (aside.attr('class') === 'opened') {aside.removeClass('opened').animate({right: "0px", opacity: 0}, 200).fadeOut(0)}
    });

    $('header .right').on('click', function () {
        const aside = $('body aside');
        if (aside.attr('class') === 'opened') {aside.removeClass('opened').animate({right: "0px", opacity: 0}, 200).fadeOut(0)}
        else {aside.addClass('opened').fadeIn(0).animate({right: "10px", opacity: 1}, 300)}
    });

    // Кнопки изменения цвета
    $('aside .theme button').on('click', function () {
        const new_theme = $(this).attr('class').split(' ')[0];
        const new_color = $(this).attr('class').split(' ')[1];
        if (new_theme !== theme) {
            $('link#base_theme').attr('href', `${css}/base/${new_theme}.css`);
            $('link#profile_theme').attr('href', `${css}/profile/${new_theme}.css`);
        }
        if (new_color !== color) {
            $('link#favicon_choice').attr('href', `${img}/favicons/${new_color}.svg`);
            $('link#color_choice').attr('href', `${css}/colors/${new_color}.css`);
        }
        if ((new_theme !== theme) || (new_color !== color)) {
            send('/change_theme', `${new_theme} ${new_color}`);
            theme = new_theme;
            color = new_color;
        }
    })

});