$.ajaxSetup({
    // Задание общих свойств запросов
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    error: function(jqXHR, textStatus, errorThrown) {
    console.log('Ошибка: ' + textStatus + ' | ' + errorThrown, jqXHR);
  }
});

function change_theme(theme) {
    // Смена темы на сервере
    $('link#theme_choice').attr('href', `time_manager/styles/themes/${theme}.css`);
}

function change_color(color) {
    // Смена цвета на сервере
    $('link#favicon_choice').attr('href', `time_manager/images/favicons/${color}.svg`);
    $('link#color_choice').attr('href', `time_manager/styles/colors/${color}.css`);
}

function insert(selector, file_name) {
    // Получение HTML шаблона
    $.ajax({
        url: '/get_page',
        dataType: 'html',
        data: `"${file_name}"`,
        success: function (data) {$(selector).html(data)}
    });
}

function get(url, send_data=null, success=null) {
    // Получение JSON формы с сервера
    return($.ajax({
        url: url,
        data: JSON.stringify(send_data),
        success: success
    }))
}

function send(url, data) {
    // Отправка JSON формы на сервер
    $.ajax({
        url: url,
        data: JSON.stringify(data)
    });
}
