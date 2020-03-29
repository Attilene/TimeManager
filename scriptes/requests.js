$.ajaxSetup({
    // Задание общих свойств запросов
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    error: function(jqXHR, textStatus, errorThrown) {
    console.log('Ошибка: ' + textStatus + ' | ' + errorThrown, jqXHR);
  }
});

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
