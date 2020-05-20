let old_data = {};

function get_data(form) {
    return {
        "hour": form.children('.time').children('.hour').val(),
        "minute": form.children('.time').children('.minute').val(),
        "task": form.children('.task').val()
    }
}

function del_day_task(form) {
    if (!form.hasClass('new')) {receive('/del_day', null, get_data(form))}
    form.animate({height: 0, margin: '0 auto', opacity: 0, transition: 'none', overflow: 'hidden', 'min-height': 0}, 200, 'swing', function () {
            $(this).remove()
    });
}

function click_add_day(btn) {
    let obj = $('<form class="item day" style="height: 0; margin: 0; opacity: 0;">\n' +
        '            <span class="time">\n' +
        '            <input class="hour" type="text" value=""\n' +
        '                   onfocus="$(this).parent().addClass(\'input\');\n' +
        '                   focus_input_day($(this).closest(\'.item\'));\n' +
        '                   old_data = get_data($(this).parent())"\n' +
        '                   onblur="$(this).parent().removeClass(\'input\');\n' +
        '                   if ($(this).val() === \'\') $(this).val(0);\n' +
        '                   blur_input_day($(this).closest(\'.item\'))"\n' +
        '\n' +
        '            >\n' +
        '            <span>:</span>\n' +
        '            <input class="minute" type="text" value=""\n' +
        '                   onfocus="$(this).parent().addClass(\'input\');\n' +
        '                   focus_input_day($(this).closest(\'.item\'));\n' +
        '                   old_data = get_data($(this).parent())"\n' +
        '                   onblur="$(this).parent().removeClass(\'input\');\n' +
        '                   if ($(this).val() === \'\') $(this).val(0);\n' +
        '                   blur_input_day($(this).closest(\'form\'))"\n' +
        '            >\n' +
        '            </span>\n' +
        '            <textarea class="task" placeholder="Задача"\n' +
        '                      onfocus="old_data = get_data($(this).parent())"\n' +
        '                      onblur="blur_input_day($(this).closest(\'.item\'))"\n' +
        '            ></textarea>\n' +
        '            <button type="button" class="del_day" onmousedown="del_day_task($(this).parent())">\n' +
        '                <svg id="email_btn_del_task">\n' +
        '                    <use xlink:href="time_manager/images/sprites.svg#sprite_btn_del_task"></use>\n' +
        '                </svg>\n' +
        '            </button>\n' +
        '        </form>');
    btn.before(obj);
    btn.slideUp(200);
    btn.prev().animate({height: '40px', margin: '3vh 0', opacity: 1}, 200, 'swing', function () {
        $(this).removeAttr('style').addClass('new').children('.task').focus();
    });
}

function focus_input_day(form) {
    if (!form.hasClass('new')) {old_data = get_data(form)}
}

function blur_input_day(form) {
    let new_data = get_data(form);
    if (form.hasClass('new')) {
        if (new_data.task === '') {
            del_day_task(form);
            $('#add_day_task').slideDown(200);

        }
        else if (new_data.hour !== '' && new_data.minute !== '' && new_data.task !== ''){
            receive('/add_day', function (data) {
                if (data === 'exist') {del_day_task(form)}
            }, new_data);
            $('#add_day_task').slideDown(200);
        }
    }
    else if (new_data !== old_data) {
        receive('/change_day', function (data) {
            if (data === 'exist') {del_day_task(form)}
        }, [old_data, new_data])
    }
}
