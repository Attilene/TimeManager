function get_list_data(form) {
    let a = {
        "name": form.siblings('.title').children('input').val(),
        "task": form.children('.task').val()
    };
    if (!form.hasClass('new')) {
        if (form.children('.task').val() === '') {
            a.task = form.data('old').task
        }
    }
    return a
}

function save_name(form) {form.data('old', form.children('input').val())}
function save_list(form) {form.data('old', get_day_data(form))}

function del_list(back) {
    if (user_data.login !== undefined) {
        if (!back.hasClass('new')) {
            if (back.find(':focus').length === 0) {
                receive('/del_list', null, back.find('input.name').val())
            } else {
                receive('/del_list', null, back.children('.title').data('old'))
            }
        }
    }
    back.addClass('del');
    setTimeout(function () {
        back.slideUp(200, function () {
            $(this).remove()
        })
    }, close_time(back))
}

function del_list_task(form) {
    if (user_data.login !== undefined) {
        if (!form.hasClass('new')) {
            if (form.find(':focus').length === 0) {
                receive('/del_list_task', null, get_list_data(form))
            } else {
                receive('/del_list_task', null, form.data('old'))
            }
        }
    }
    form.addClass('del');
    form.slideUp(200, $(this).remove)
}


function click_add_list(btn) {
    let obj = $('<div class="back_back" style="width: 0; margin: 2vh 0; opacity: 0">\n' +
        '            <div class="back">\n' +
        '                <form class="title">\n' +
        '                    <input class="name" placeholder="Название"\n' +
        '                           onfocus="save_name($(this).parent())"\n' +
        '                           onmouseleave="blur_list_name($(this).parent())"\n' +
        '                    >\n' +
        '                    <button type="button" class="del_list"\n' +
        '                            onmousedown="del_list($(this).closest(\'.back\'))"\n' +
        '                    >\n' +
        '                        <svg><use xlink:href="time_manager/images/sprites.svg#sprite_btn_remove"></use></svg>\n' +
        '                    </button>\n' +
        '                </form>\n' +
        '                <button id="add_list_task" type="button"\n' +
        '                        onmousedown="click_add_list_task($(this))"\n' +
        '                >\n' +
        '                    <svg>\n' +
        '                        <use xlink:href="time_manager/images/sprites.svg#sprite_btn_add"></use>\n' +
        '                    </svg>\n' +
        '                </button>\n' +
        '            </div>\n' +
        '        </div>');
    btn.after(obj);
    btn.next().animate({opacity: 1, width: '400px', margin: '2vh 4%'}, 200, 'swing', function () {
        $(this).removeAttr('style').find('input.name').focus();
    });
}
