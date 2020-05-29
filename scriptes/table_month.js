function get_month_data(form) {
    let a = {
        "digit": form.children('.time').children('.digit').val(),
        "month": form.children('.time').children('.month').val(),
        "task": form.children('.task').val()
    };
    if (!form.hasClass('new')) {
        if (form.children('.task').val() === '') {
            a.task = form.data('old').task
        }
    }
    return a
}

function save_month(form) {form.data('old', get_month_data(form));}

function del_month_task(form) {
    if (user_data.login !== '') {
        if (!form.hasClass('new')) {
            if (form.find(':focus').length === 0) {
                receive('/del_month', null, get_month_data(form))
            } else {
                receive('/del_month', null, form.data('old'))
            }
        }
    }
    form.addClass('del');
    setTimeout(function () {
        form.slideUp(200, function () {
            $(this).remove()
        })
    }, close_time(form))
}

function click_add_month(btn) {
    let obj = $('<form class="item month new" style="margin: 0; height: 0; opacity: 0">\n' +
        '            <span class="time"\n' +
        '                  onmouseenter="save_month($(this).parent())"\n' +
        '                  onmouseleave="blur_input_month($(this).parent())"\n' +
        '            >\n' +
        '            <input class="digit" type="text" max="31" min="1" placeholder="?" \n' +
        '                   onfocus="$(this).parent().addClass(\'input\'); save_month($(this).parent())"\n' +
        '                   onblur="$(this).parent().removeClass(\'input\');\n' +
        '                       if ($(this).val() === \'\' && !$(this).closest(\'.item\').hasClass(\'new\')) $(this).val(\'00\');\n' +
        '                       blur_input_month($(this).closest(\'.item\'))"\n' +
        '                   onkeydown="key_func(event)"\n' +
        '                   oninput="input_time($(this))"\n' +
        '            >\n' +
        '            <span>:</span>\n' +
        '            <input class="month" type="text" max="12" min="1" placeholder="?"\n' +
        '                   onfocus="$(this).parent().addClass(\'input\'); save_month($(this).parent())"\n' +
        '                   onblur="$(this).parent().removeClass(\'input\');\n' +
        '                       if ($(this).val() === \'\' && !$(this).closest(\'.item\').hasClass(\'new\')) $(this).val(\'00\');\n' +
        '                       blur_input_month($(this).closest(\'.item\'))"\n' +
        '                   onkeydown="key_func(event)"\n' +
        '                   oninput="input_time($(this))"\n' +
        '            >\n' +
        '            </span>\n' +
        '            <textarea class="task" placeholder="Задача"\n rows=1' +
        '                      oninput="autosize(this)"\n' +
        '                      onfocus="save_month($(this).parent())"\n' +
        '                      onblur="blur_input_month($(this).closest(\'.item\'))"\n' +
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
    let old = form.data('old');
    let new_month_data = get_month_data(form);
    form.data('old', new_month_data);
    if (form.hasClass('new')) {
        if (new_month_data.digit !== '' && new_month_data.month !== '' && new_month_data.task !== '') {
            if (user_data.login !== '') {
                receive('/add_month', function (data) {
                    if (data === 'exist') {
                        del_month_task(form);
                    } else {
                        form.data('old', get_month_data(form));
                        form.removeClass('new');
                        form.find('input').removeAttr('placeholder')
                    }
                }, new_month_data)
            }
            else {
                form.removeClass('new');
                form.find('input').removeAttr('placeholder')
            }
        }
    } else if (new_month_data.digit !== old.digit ||
        new_month_data.month !== old.month ||
        new_month_data.task !== old.task) {
        receive('/change_month', function (data) {
            if (data === 'exist') {
                del_month_task(form);
            }
            else {
                form.data('old', new_month_data);
            }
        }, [old, new_month_data]);
    }
}
