$.ajaxSetup({
    // Задание общих свойств запросов
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    error: function(jqXHR, textStatus, errorThrown) {
    console.log('Ошибка: ' + textStatus + ' | ' + errorThrown, jqXHR);
  }
});

function insert_page(selector, file_name, func=null, async=true) {
    // Получение HTML шаблона
    $.ajax({
        url: '/get_page',
        async: async,
        dataType: 'html',
        data: `"${file_name}"`,
        success: function (data) {
            if (func !== null) {$(selector).html(func)}
            else {$(selector).html(data)}
        }
    });
}

function receive(url, send_data=null, success=null, async=true) {
    // Получение JSON формы с сервера
    return($.ajax({
        url: url,
        async: async,
        data: JSON.stringify(send_data),
        dataType: 'json',
        success: success
    }))
}

function send(url, data, func=null, async=true) {
    // Отправка JSON формы на сервер
    $.ajax({
        url: url,
        async: async,
        data: JSON.stringify(data),
        dataType: 'json',
        complete: func
    });
}
