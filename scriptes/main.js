var user_logined = false;
var user_data = {'theme': 'light', 'color': 'blue'};
var page_data = {'theme': 'light', 'color': 'blue'};


jQuery(document).ready(function () {
    // Добавление окна авторизации
    insert('aside', "authorisation");
    // Отключение анимации при перезагрузке
    $('body').attr('id', 'preload');
    setTimeout(function () {$('#preload').removeAttr('id')}, 300);
    actions()
});
