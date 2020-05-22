let old_day_data = {};

function get_day_data(form) {
    return {
        "hour": form.children('.time').children('.hour').val(),
        "minute": form.children('.time').children('.minute').val(),
        "task": form.children('.task').val()
    }
}

function del_day_task(form) {
    if (!form.hasClass('new')) {receive('/del_day', null, get_day_data(form))}
    form.addClass('del');
    setTimeout(function () {
        form.slideUp(200, function () {
            $(this).remove()
        })
    }, close_time(form))
}

function click_add_day(btn) {
    let obj = $('<form class="item day"  style="height: 0; margin: 0; opacity: 0">\n' +
        '            <span class="time input">\n' +
        '            <input class="hour" type="text" value="" max="24" min="0"\n' +
        '                   onfocus="$(this).parent().addClass(\'input\');\n' +
        '                       focus_input_day($(this).closest(\'.item\'))"\n' +
        '                   onblur="$(this).parent().removeClass(\'input\');\n' +
        '                       if ($(this).val() === \'\') $(this).val(0);\n' +
        '                       blur_input_day($(this).closest(\'.item\'))"\n' +
        '                   onkeydown="change_val(event)"\n' +
        '            >\n' +
        '            <span>:</span>\n' +
        '            <input class="minute" type="text" max="60" min="0"\n' +
        '                   onfocus="$(this).parent().addClass(\'input\');\n' +
        '                       focus_input_day($(this).closest(\'.item\'))"\n' +
        '                   onblur="$(this).parent().removeClass(\'input\');\n' +
        '                       if ($(this).val() === \'\') $(this).val(0);\n' +
        '                       blur_input_day($(this).closest(\'.item\'))"\n' +
        '                   onkeydown="change_val(event)"\n' +
        '            >\n' +
        '            </span>\n' +
        '            <textarea class="task" placeholder="Задача"\n' +
        '                      onfocus="old_day_data = get_day_data($(this).parent())"\n' +
        '                      onblur="blur_input_day($(this).closest(\'.item\'))"\n' +
        '                      onkeydown="change_val(event)"' +
        '            ></textarea>\n' +
        '            <button type="button" class="del_day" onmousedown="del_day_task($(this).parent())">\n' +
        '                <svg id="email_btn_del_task">\n' +
        '                    <use xlink:href="time_manager/images/sprites.svg#sprite_btn_del_task"></use>\n' +
        '                </svg>\n' +
        '            </button>\n' +
        '        </form>');
    btn.before(obj);
    btn.prev().animate({height: '40px', margin: '3vh 0', opacity: 1}, 200, 'swing', function () {
        $(this).removeAttr('style').addClass('new').children('.task').focus();
    });
}

function focus_input_day(form) {
    if (!form.hasClass('new')) {old_day_data = get_day_data(form)}
}

function blur_input_day(form) {
    let new_day_data = get_day_data(form);
    if (form.hasClass('new')) {
        if (new_day_data.hour !== '' && new_day_data.minute !== '' && new_day_data.task !== ''){
            receive('/add_day', function (data) {
                if (data === 'exist') {del_day_task(form); console.log('new exist')}
                else {form.removeClass('new'); console.log('new not exist')}
            }, new_day_data);
        }
    }
    else if (new_day_data.hour !== old_day_data.hour ||
        new_day_data.minute !== old_day_data.minute ||
        new_day_data.task !== old_day_data.task) {
        receive('/change_day', function (data) {
            console.log(new_day_data.hour !== old_day_data.hour);
            console.log(new_day_data.minute !== old_day_data.minute);
            console.log(new_day_data.task !== old_day_data.task);
            console.log(old_day_data, new_day_data);
            if (data === 'exist') {del_day_task(form); console.log('old exist')}
        }, [old_day_data, new_day_data]);
    }
}

function change_val(event) {
    let key = event.keyCode;
    if (key >= 37 && key <= 40) {event.preventDefault()}
    let input = $(event.target);
    let int = parseInt(input.val());
    if (key === 37 && input.prev().length > 0) {
        if (input.prev().hasClass('time')) {input.prev().children('input')[1].focus()}
        else {input.prev().prev()[0].focus()}
    }
    else if (key === 39 && (input.next().next('input').length > 0 || input.prev().prev('input').length > 0)) {
        if (input.next().next('input').length > 0) {input.next().next()[0].focus()}
        else {input.parent().next()[0].focus()}
    }
    else if (input[0].tagName === 'INPUT') {
        if (key === 38 && int < input[0].max) {input.val(int + 1)}
        else if (key === 40 && int > input[0].min) {input.val(int - 1)}
    }
    else if (input[0].tagName === 'TEXTAREA'){
        let form = input.closest('.item');
        if (key === 38 && form.prev('.item').length > 0) {form.prev().children('textarea')[0].focus()}
        else if (key === 40 && form.next('.item').length > 0) {form.next().children('textarea')[0].focus()}
    }
}


