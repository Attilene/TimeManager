let old_day_data = {};

function get_day_data(form) {
    return {
        "hour": form.children('.time').children('.hour').val(),
        "minute": form.children('.time').children('.minute').val(),
        "task": form.children('.task').val()
    }
}

function del_day_task(form) {
    if (user_data.login !== '') {
        if (!form.hasClass('new')) {
        if (form.find(':focus').length === 0) {receive('/del_day', null, get_day_data(form))}
        else {receive('/del_day', null, old_day_data)}
    }
    form.addClass('del');
    setTimeout(function () {
        form.slideUp(200, function () {
            $(this).remove()
        })
    }, close_time(form))
    }
}

function click_add_day(btn) {
    let obj = $('<form class="item day new" style="margin: 0; height: 0; opacity: 0">\n' +
        '            <span class="time">\n' +
        '            <input class="hour" type="text" max="23" min="0" placeholder="?" \n' +
        '                   onfocus="$(this).parent().addClass(\'input\');\n' +
        '                        old_day_data = get_day_data($(this).closest(\'.item\'))"\n' +
        '                   onmouseenter="old_day_data = get_day_data($(this).closest(\'.item\'))"\n' +
        '                   onblur="$(this).parent().removeClass(\'input\');\n' +
        '                       if ($(this).val() === \'\' && !$(this).closest(\'.item\').hasClass(\'new\')) $(this).val(0);\n' +
        '                       blur_input_day($(this).closest(\'.item\'))"\n' +
        '                   onmouseleave="blur_input_day($(this).closest(\'.item\'))"\n' +
        '                   onkeydown="key_func(event)"\n' +
        '                   oninput="input_time($(this))"\n' +
        '            >\n' +
        '            <span>:</span>\n' +
        '            <input class="minute" type="text" max="59" min="0" placeholder="?"\n' +
        '                   onfocus="$(this).parent().addClass(\'input\');\n' +
        '                        old_day_data = get_day_data($(this).closest(\'.item\'))"\n' +
        '                   onmouseenter="old_day_data = get_day_data($(this).closest(\'.item\'))"\n' +
        '                   onblur="$(this).parent().removeClass(\'input\');\n' +
        '                       if ($(this).val() === \'\' && !$(this).closest(\'.item\').hasClass(\'new\')) $(this).val(0);\n' +
        '                       blur_input_day($(this).closest(\'.item\'))"\n' +
        '                   onmouseleave="blur_input_day($(this).closest(\'.item\'))"\n' +
        '                   onkeydown="key_func(event)"\n' +
        '                   oninput="input_time($(this))"\n' +
        '            >\n' +
        '            </span>\n' +
        '            <textarea class="task" placeholder="Задача"\n' +
        '                      onfocus="old_day_data = get_day_data($(this).closest(\'.item\'))"\n' +
        '                      onblur="blur_input_day($(this).closest(\'.item\'))"\n' +
        '                      onkeydown="key_func(event)"\n' +
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

function blur_input_day(form) {
    if (user_data.login !== '') {
        let new_day_data = get_day_data(form);
        if (form.hasClass('new')) {
            if (new_day_data.hour !== '' && new_day_data.minute !== '' && new_day_data.task !== '') {
                receive('/add_day', function (data) {
                    if (data === 'exist') {
                        del_day_task(form)
                    } else {
                        form.removeClass('new');
                        form.find('input').removeAttr('placeholder')
                    }
                }, new_day_data);
            }
        } else if (new_day_data.hour !== old_day_data.hour ||
            new_day_data.minute !== old_day_data.minute ||
            new_day_data.task !== old_day_data.task) {
            receive('/change_day', function (data) {
                if (data === 'exist') {
                    del_day_task(form);
                }
            }, [old_day_data, new_day_data]);
        }
    }
}

function key_func(event) {
    let key = event.keyCode;
    if (key === 8 && event.target.selectionStart === 0 && event.target.selectionEnd === 0) {event.preventDefault(); to_prev($(event.target))}
    else if (key === 38 || key === 40 ||
        (key === 37 && !(event.target.tagName === 'TEXTAREA' && event.target.selectionStart > 0)) ||
        (key === 39 && !(event.target.tagName === 'TEXTAREA'))
        ) {
        event.preventDefault();
        let input = $(event.target);
        let int = parseInt(input.val());
        if (key === 37) to_prev(input);
        else if (key === 39) to_next(input);
        else if (input[0].tagName === 'INPUT') {
            if (key === 38) {
                if (int < input[0].max) {input.val(int + 1)}
                if (isNaN(int)) {input.val(input[0].min)}
            }
            else if (key === 40) {
                if (int > input[0].min) {input.val(int - 1)}
                if (isNaN(int)) {input.val(input[0].max)}
            }
        }
        else if (input[0].tagName === 'TEXTAREA') {
            let form = input.closest('.item');
            if (key === 38 && form.prev('.item').length > 0) {
                form.prev().children('textarea')[0].focus()
            } else if (key === 40 && form.next('.item').length > 0) {
                form.next().children('textarea')[0].focus()
            }
        }
    }
}

function to_next(input) {
    if (input.next().next('input').length > 0 || input.prev().prev('input').length > 0) {
        let next_el;
        if (input.next().next('input').length > 0) {
            next_el = input.next().next()[0];
            next_el.selectionStart = -1
        }
        else {next_el = input.parent().next()[0]}
        next_el.focus();
    }
}

function to_prev(input) {
    if (input.prev().length > 0) {
        let prev_el;
        if (input.prev().hasClass('time')) {prev_el = input.prev().children('input')[1]}
        else {prev_el = input.prev().prev()[0]}
        prev_el.focus();
        prev_el.selectionStart = -1
    }
}

function input_time(input) {
    let val = input.val();
    if (val === '') {input.val('')}
    else if (/^[0-9]+$/.test(val)) {set_val(input, val)}
    else if (/^[0-9].[0-9]$/.test(val)) {set_val(input, val[0] + val[2])}
    else if (/^[0-9]+$/.test(val.slice(0, 2))) {set_val(input, val.slice(0, 2))}
    else if (/^[0-9]+$/.test(val.slice(1))) {set_val(input, val.slice(1))}
    else if (/^[0-9]+$/.test(val[0])) {set_val(input, val[0])}
    else input.val(0);
}

function set_val(input, val) {
    let int = parseInt(val);
    let max = input[0].max;
    let min = input[0].min;
    let ed = Math.floor(max / 10) + 1;
    let new_val = int;
    if (isNaN(int)) {new_val = 0}
    else if (int > max) {new_val = parseInt(val[input[0].selectionStart - 1])}
    else if (int < min) {new_val = min}
    input.val(new_val);
    if (Math.floor(max / 10) < new_val) {to_next(input)}
}
