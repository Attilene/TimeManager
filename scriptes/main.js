let user_data = {'theme': 'light', 'color': 'blue'};
let user_logined = false;
let manuals = {
    'm_reg': new Image(),
    'm_act': new Image(),
    'm_add': new Image(),
    'm_theme': new Image()
};
let bg = new Image();
bg.src = 'time_manager/images/bg.jpg';
bg.onload = function () {$('#help_body').addClass('ready').css({'background-image': `url(${bg.src})`});
    setTimeout(function () {$('#main_clock').hide()}, close_time($('#main_clock')))};
manuals.m_reg.src = 'time_manager/images/manual/reg.gif';
manuals.m_reg.onload = function () {
    $('#m_reg').addClass('ready').children('.cover')[0].src = manuals.m_reg.src;
    setTimeout(function () {$('#m_reg .clock_load').hide()}, close_time($('#m_reg .clock_load')))};
manuals.m_act.src = 'time_manager/images/manual/act.gif';
manuals.m_act.onload = function () {
    $('#m_act').addClass('ready').children('.cover')[0].src = manuals.m_act.src;
    setTimeout(function () {$('#m_act .clock_load').hide()}, close_time($('#m_act .clock_load')))};
manuals.m_add.src = 'time_manager/images/manual/add.gif';
manuals.m_add.onload = function () {
    $('#m_add').addClass('ready').children('.cover')[0].src = manuals.m_add.src;
    setTimeout(function () {$('#m_add .clock_load').hide()}, close_time($('#m_add .clock_load')))};
manuals.m_theme.src = 'time_manager/images/manual/theme.gif';
manuals.m_theme.onload = function () {
    $('#m_theme').addClass('ready').children('.cover')[0].src = manuals.m_theme.src;
    setTimeout(function () {$('#m_theme .clock_load').hide()}, close_time($('#m_theme .clock_load')))};


jQuery(document).ready(function () {
    $('body').css({opacity: 0}).animate({opacity: 1}, 1000);
    clear_fields();
    // Запоминание страницы
    if (sessionStorage.getItem('page')) {
        if (!user_logined && (sessionStorage.page === 'day' ||
            sessionStorage.page === 'month' ||
            sessionStorage.page === 'lists')) {
            sessionStorage.page = 'help'
        }
        $(`#page_${sessionStorage.page}`).addClass('opened')
    }
    else {
        $(`#page_help`).addClass('opened');
        sessionStorage.page = 'help'
    }
    // Советы
    $('aside form input').on('mouseenter', function () {
        let input = $(this);
        input.prev().addClass('show');
        input.one('mouseleave', function () {
            input.prev().removeClass('show')
        });
    });
    // Кнопки изменения цвета
    $('aside .theme button').on('mousedown' , function () {
        change_theme($(this).data('theme'), $(this).data('color'))
    });
    // Указатель выбранной темы
    $(`aside menu .theme button[data-theme="${user_data.theme}"][data-color="${user_data.color}`).addClass('choice');
    if (user_logined) {
        if (!user_data.activated){
            $('#menu_edit_email, #confirm_email').addClass('nonactive');
        }
        if (restore) {
            toggle_aside($('#profile_menu'));
            toggle_set_menu($('#menu_edit_psw'));
        }
        $('textarea').each(function (index, element) {autosize(element)});
    }
    // Настройка времени колесиком
    $('main').on('wheel', 'div.body',function (event) {
        if ($('.time').has(event.target).length > 0) {
            event.preventDefault();
            let input = $(event.target);
            let int = parseInt(input.val());
            if (event.originalEvent.deltaY < 0) {
                 if (int < event.target.max) {set_val(input, int + 1)}
                else {input.val(event.target.min)}
                if (isNaN(int)) {set_val(input, event.target.min)}
            }
            if (event.originalEvent.deltaY > 0) {
                if (int > event.target.min) {set_val(input, int - 1)}
                else {input.val(event.target.max)}
                if (isNaN(int)) {set_val(input, event.target.max)}
            }
        }
    });
    // Гифки
    $('.man_card').on('mouseenter click', function () {
        let img = $(this).children('.cover');
        if ($(this).hasClass('ready')) {
            img.attr('src', manuals[this.id].src);
        }
    })
});
