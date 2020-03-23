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

    // Кнопки изменения цвета
    $('aside .theme button').on('click', function () {
        const theme = $('aside menu .theme').attr('class').split(' ')[1];
        const color = $(this).attr('class');
        $('html').attr('id', theme);
        $('body').attr('id', color);
        const favicon = $('head link[type="image/x-icon"]');
        const favicon_href = favicon.attr('href').slice(0, favicon.attr('href').lastIndexOf('favicons'));
        favicon.attr('href', `${favicon_href}/${color}.svg`);
        send('/change_theme', `${theme} ${color}`);
    });

});