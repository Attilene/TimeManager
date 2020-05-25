let old_month_data = {};

function get_month_data(form) {
    return {
        "digit": form.children('.time').children('.digit').val(),
        "month": form.children('.time').children('.month').val(),
        "task": form.children('.task').val()
    }
}

function del_month_task(form) {
    if (user_data.login !== '') {
        if (!form.hasClass('new')) {
            if (form.find(':focus').length === 0) {
                receive('/del_month', null, get_month_data(form))
            } else {
                receive('/del_month', null, old_month_data)
            }
        }
        form.addClass('del');
        setTimeout(function () {
            form.slideUp(200, function () {
                $(this).remove()
            })
        }, close_time(form))
    }
}

function click_add_month(btn) {
    let obj = $('<form class="item month new" style="margin: 0; height: 0; opacity: 0">\n' +
        '            <span class="time">\n' +
        '            <input class="digit" type="text" max="31" min="1" placeholder="?" \n' +
        '                   onfocus="$(this).parent().addClass(\'input\');\n' +
        '                        old_month_data = get_month_data($(this).closest(\'.item\'))"\n' +
        '                   onmouseenter="old_month_data = get_month_data($(this).closest(\'.item\'))"\n' +
        '                   onblur="$(this).parent().removeClass(\'input\');\n' +
        '                       if ($(this).val() === \'\' && !$(this).closest(\'.item\').hasClass(\'new\')) $(this).val(0);\n' +
        '                       blur_input_month($(this).closest(\'.item\'))"\n' +
        '                   onmouseleave="blur_input_month($(this).closest(\'.item\'))"\n' +
        '                   onkeydown="key_func(event)"\n' +
        '                   oninput="input_time($(this))"\n' +
        '            >\n' +
        '            <span>.</span>\n' +
        '            <input class="month" type="text" max="12" min="1" placeholder="?" \n' +
        '                   onfocus="$(this).parent().addClass(\'input\');\n' +
        '                        old_month_data = get_month_data($(this).closest(\'.item\'))"\n' +
        '                   onmouseenter="old_month_data = get_month_data($(this).closest(\'.item\'))"\n' +
        '                   onblur="$(this).parent().removeClass(\'input\');\n' +
        '                       if ($(this).val() === \'\' && !$(this).closest(\'.item\').hasClass(\'new\')) $(this).val(0);\n' +
        '                       blur_input_month($(this).closest(\'.item\'))"\n' +
        '                   onmouseleave="blur_input_month($(this).closest(\'.item\'))"\n' +
        '                   onkeydown="key_func(event)"\n' +
        '                   oninput="input_time($(this))"\n' +
        '            >\n' +
        '            </span>\n' +
        '            <textarea class="task" placeholder="Задача"\n' +
        '                      onfocus="old_month_data = get_month_data($(this).closest(\'.item\'))"\n' +
        '                      onmouseenter="old_month_data = get_month_data($(this).closest(\'.item\'))"\n' +
        '                      onblur="blur_input_month($(this).closest(\'.item\'))"\n' +
        '                      onmouseleave="blur_input_month($(this).closest(\'.item\'))"\n' +
        '                      onkeydown="key_func(event)"\n' +
        '            ></textarea>\n' +
        '            <button type="button" class="del_month" onmousedown="del_month_task($(this).parent())">\n' +
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

function blur_input_month(form) {
    if (user_data.login !== '') {
        let new_month_data = get_month_data(form);
        if (form.hasClass('new')) {
            if (new_month_data.digit !== '' && new_month_data.month !== '' && new_month_data.task !== '') {
                receive('/add_month', function (data) {
                    if (data === 'exist') {
                        del_month_task(form)
                    } else {
                        form.removeClass('new');
                        form.find('input').removeAttr('placeholder')
                    }
                }, new_month_data);
            }
        } else if (new_month_data.digit !== old_month_data.digit ||
            new_month_data.month !== old_month_data.month ||
            new_month_data.task !== old_month_data.task) {
            receive('/change_month', function (data) {
                if (data === 'exist') {
                    del_month_task(form);
                }
            }, [old_month_data, new_month_data]);
        }
    }
}
