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
        form.animate({height: 0, margin: '0 auto', opacity: 0}, 200, 'swing', function () {
            $(this).remove()
        });
    }, 200);

}

function click_add_day(btn) {
    let obj = $(' <form class="item day" style="height: 0; margin: 0; opacity: 0;">\n' +
        '            <span class="time">\n' +
        '            <input class="hour" type="text" value=""\n' +
        '                   onfocus="$(this).parent().addClass(\'input\');\n' +
        '                       focus_input_day($(this).closest(\'.item\'))"\n' +
        '                   onblur="$(this).parent().removeClass(\'input\');\n' +
        '                       if ($(this).val() === \'\') $(this).val(0);\n' +
        '                       blur_input_day($(this).closest(\'.item\'))"\n' +
        '            >\n' +
        '            <span>:</span>\n' +
        '            <input class="minute" type="text" value=""\n' +
        '                   onfocus="$(this).parent().addClass(\'input\');\n' +
        '                       focus_input_day($(this).closest(\'.item\'))"\n' +
        '                   onblur="$(this).parent().removeClass(\'input\');\n' +
        '                       if ($(this).val() === \'\') $(this).val(0);\n' +
        '                       blur_input_day($(this).closest(\'.item\'))"\n' +
        '            >\n' +
        '            </span>\n' +
        '            <textarea class="task" placeholder="Задача"\n' +
        '                      onfocus="old_day_data = get_day_data($(this).parent())"\n' +
        '                      onblur="blur_input_day($(this).closest(\'.item\'))"\n' +
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
        if (new_day_data.task === '') {
            del_day_task(form);
        }
        else if (new_day_data.hour !== '' && new_day_data.minute !== '' && new_day_data.task !== ''){
            receive('/add_day', function (data) {
                if (data === 'exist') {del_day_task(form)}
                else {form.removeClass('new')}
            }, new_day_data);
        }
    }
    else if (new_day_data.hour !== old_day_data.hour ||
        new_day_data.minute !== old_day_data.minute ||
        new_day_data.task !== old_day_data.task) {
        receive('/change_day', function (data) {
            if (data === 'exist') {del_day_task(form)}
        }, [old_day_data, new_day_data]);
    }
}
