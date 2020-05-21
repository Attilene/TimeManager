let old_month_data = {};

function get_month_data(form) {
    return {
        "digit": form.children('.time').children('.digit').val(),
        "month": form.children('.time').children('.month').val(),
        "task": form.children('.task').val()
    }
}

function del_month_task(form) {
    if (!form.hasClass('new')) {receive('/del_month', null, get_month_data(form))}
    form.animate({height: 0, margin: '0 auto', opacity: 0, transition: 'none', overflow: 'hidden', 'min-height': 0}, 200, 'swing', function () {
        $(this).remove()
    });
}

function click_add_month(btn) {
    let obj = $('<form class="item month" style="height: 0; margin: 0; opacity: 0;">\n' +
        '            <span class="time input">\n' +
        '            <input class="hour" type="text" value=""\n' +
        '                   onfocus="$(this).parent().addClass(\'input\');\n' +
        '                   focus_input_month($(this).closest(\'.item\'));\n' +
        '                   old_month_data = get_month_data($(this).parent())"\n' +
        '                   onblur="$(this).parent().removeClass(\'input\');\n' +
        '                   if ($(this).val() === \'\') $(this).val(0);\n' +
        '                   blur_input_month($(this).closest(\'.item\'))"\n' +
        '\n' +
        '            >\n' +
        '            <span>.</span>\n' +
        '            <input class="minute" type="text" value=""\n' +
        '                   onfocus="$(this).parent().addClass(\'input\');\n' +
        '                   focus_input_month($(this).closest(\'.item\'));\n' +
        '                   old_month_data = get_month_data($(this).parent())"\n' +
        '                   onblur="$(this).parent().removeClass(\'input\');\n' +
        '                   if ($(this).val() === \'\') $(this).val(0);\n' +
        '                   blur_input_month($(this).closest(\'form\'))"\n' +
        '            >\n' +
        '            </span>\n' +
        '            <textarea class="task" placeholder="Задача"\n' +
        '                      onfocus="old_month_data = get_month_data($(this).parent())"\n' +
        '                      onblur="blur_input_month($(this).closest(\'.item\'))"\n' +
        '            ></textarea>\n' +
        '            <button type="button" class="del_month" onmousedown="del_month_task($(this).parent())">\n' +
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

function focus_input_month(form) {
    if (!form.hasClass('new')) {old_month_data = get_month_data(form)}
}

function blur_input_month(form) {
    let new_month_data = get_month_data(form);
    if (form.hasClass('new')) {
        if (new_month_data.task === '') {
            del_month_task(form);
            $('#add_month_task').slideDown(200);
        }
        else if (new_month_data.hour !== '' && new_month_data.minute !== '' && new_month_data.task !== ''){
            receive('/add_month', function (data) {
                if (data === 'exist') {del_month_task(form)}
                else {form.removeClass('new')}
            }, new_month_data);
            $('#add_month_task').slideDown(200);
        }
    }
    else if (new_month_data.hour !== old_month_data.digit ||
        new_month_data.minute !== old_month_data.month ||
        new_month_data.task !== old_month_data.task) {
        receive('/change_month', function (data) {
            if (data === 'exist') {del_month_task(form)}
        }, [old_month_data, new_month_data]);
    }
}