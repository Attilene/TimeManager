$.ajaxSetup({
    // Задание общих свойств запросов
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    error: function(jqXHR, textStatus, errorThrown) {
    console.log('Ошибка: ' + textStatus + ' | ' + errorThrown, jqXHR);
  }
});

function insert_page(selector, file_name, func=null) {
    // Получение HTML шаблона
    $.ajax({
        url: '/get_page',
        dataType: 'html',
        data: `"${file_name}"`,
        success: function (data) {
            if (func !== null) {$(selector).html(func)}
            else {$(selector).html(data)}
        }
    });
}

function receive(url, send_data=null, success=null) {
    // Получение JSON формы с сервера
    return($.ajax({
        url: url,
        data: JSON.stringify(send_data),
        success: success
    }))
}

function send(url, data, func=null) {
    // Отправка JSON формы на сервер
    $.ajax({
        url: url,
        data: JSON.stringify(data),
        complete: func
    });
}
