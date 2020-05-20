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
    form.css({overflow: 'visible', transition: 'none'})
        .animate({ bottom: 0, height: 0, margin: 0, opacity: 0}, 200, 'swing', function () {
            $(this).remove()
        });
}

function click_add_day(btn) {
    let obj = $('<form class="item day new" style="position: relative; bottom: 20px; height: 0; overflow: visible; margin: 0 auto; opacity: 0">\n' +
        '            <span class="time">\n' +
        '            <input class="hour" type="text" value="12"\n' +
        '                   onfocus="$(this).parent().addClass(\'input\'); ' +
        '                   focus_input_day($(this).closest(\'form\')"\n' +
        '                   onblur="$(this).parent().removeClass(\'input\'); ' +
        '                   if ($(this).val() === \'\') $(this).val(0); \n' +
        '                   blur_input_day($(this).closest(\'form\'))"\n' +
        '            >\n' +
        '            <span>:</span>\n' +
        '            <input class="minute" type="text" value="12"\n' +
        '                   onfocus="$(this).parent().addClass(\'input\'); ' +
        '                   focus_input_day($(this).closest(\'form\')"\n' +
        '                   onblur="$(this).parent().removeClass(\'input\'); ' +
        '                   if ($(this).val() === \'\') $(this).val(0); \n' +
        '                   blur_input_day($(this).closest(\'form\'))"\n' +
        '            >\n' +
        '            </span>\n' +
        '            <textarea class="task" placeholder="Задача" ' +
        '                   onfocus="focus_input_day($(this).closest(\'form\'))"' +
        '                   onblur="blur_input_day($(this).closest(\'form\'))"' +
        '            ></textarea>\n' +
        '            <span class="bout"><button type="button" class="del_day" onmousedown="del_day_task($(this).closest(\'form\'))">\n' +
        '                <svg id="email_btn_del_task">\n' +
        '                    <use xlink:href="time_manager/images/sprites.svg#sprite_btn_del_task"></use>\n' +
        '                </svg>\n' +
        '            </button></span>\n' +
        '        </form>');
    btn.before(obj);
    btn.prev().animate({ bottom: 0, height: '40px', margin: '2vh 0', opacity: 1, overflow: 'visible'}, 200, 'swing', function () {
        $(this).removeAttr('style').addClass('new')
    });
    btn.attr('disabled', 'disabled')
}

function focus_input_day(form) {
    if (!form.hasClass('new')) {old_data = get_data(form)}
}

function blur_input_day(form) {
    let new_data = get_data(form);
    if (form.hasClass('new')) {



        $('#add_day_task').removeAttr('disabled');
        form.removeClass('new')
    }
    else {

    }


    // if (new_data !== old_data)    {
    //     if (form.hasClass('new')) {
    //         if (new_data.hour !== 12 || new_data.minute !== 12 || new_data.task !== '') {
    //             receive('/add_day', function (data) {
    //                 if (data === 'exist') {del_task(form)}
    //                 $('#add_day_task').removeAttr('disabled');
    //                 form.removeClass('new');
    //             }, new_data)
    //         }
    //         else {
    //             del_task(form);
    //             $('#add_day_task').removeAttr('disabled');
    //         }
    //     }
    //     else {
    //
    //     }
    //     old_data = {}
    // }
    old_data = {}
}
