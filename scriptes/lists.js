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

function get_list_name(form) {
    let b = form.children('input').val();
    if (!form.closest('.back_back').hasClass('new')) {
        if (form.children('input').val() === '') {
            b = form.data('old')
        }
    }
    return b
}

function save_name(form) {form.data('old', get_list_name(form))}
function save_list(form) {form.data('old', get_list_data(form))}

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
    back.prev().prev('button').removeClass('new');
    setTimeout(function () {
        back.animate({height: 0, width: 0, margin: 0}, 200, 'swing', function () {
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
    form.slideUp(200, function () {
        $(this).next('button').removeClass('new');
        $(this).remove()
    })
}


function click_add_list(btn) {
    let obj = $('<div class="back_back" style="height: 0; width: 0; line-height: 0; margin: 0; opacity: 0; pointer-events: none; transform: scale(0.6)">\n' +
        '            <div class="back">\n' +
        '                <form class="title">\n' +
        '                    <input class="name" placeholder="Название"\n' +
        '                           onfocus="save_name($(this).parent())"\n' +
        '                           onblur="blur_list_name($(this).parent())"\n' +
        '                    >\n' +
        '                    <button type="button" class="del_list"\n' +
        '                            onmousedown="del_list($(this).closest(\'.back_back\'))"\n' +
        '                    >\n' +
        '                        <svg><use xlink:href="time_manager/images/sprites.svg#sprite_btn_remove"></use></svg>\n' +
        '                    </button>\n' +
        '                </form>\n' +
        '                <button class="add_list_task new" type="button" \n' +
        '                        onmousedown="click_add_list_task($(this))"\n' +
        '                        onmouseenter="blur_list_name($(this).parent().siblings(\'.title\'))"\n' +
        '                >\n' +
        '                    <svg>\n' +
        '                        <use xlink:href="time_manager/images/sprites.svg#sprite_btn_add"></use>\n' +
        '                    </svg>\n' +
        '                </button>\n' +
        '                <a class="alert"\n' +
        '                   onmouseenter="' +
        '                        if ($(this).closest(\'.back_back\').hasClass(\'new\')) {blur_list_name($(this).siblings(\'.title\'))}\n' +
        '                        else {blur_list_task($(this).siblings(\'.list_task.new\'))}"\n' +
        '                >Введите данные</a>' +
        '            </div>\n' +
        '        </div>');
    btn.addClass('new').next().after(obj);
    if (obj.next('.back_back').length > 0) {
        obj.animate({height: '85px', width: '400px', margin: '3vh 50px 0'}, 200, 'swing', function () {
            $(this).addClass('new').removeAttr('style').find('input.name').focus();
        });
    }
    else {
        obj.addClass('new').removeAttr('style').find('input.name').focus();
    }
}

function click_add_list_task(btn) {
    let obj = $('<form class="list_task new" style="height: 0; opacity: 0; pointer-events: none">\n' +
        '                    <textarea class="task" placeholder="Задача" rows="1"\n' +
        '                              onfocus="save_list($(this).parent())"\n' +
        '                              oninput="autosize(this)"\n' +
        '                              onblur="blur_list_task($(this).parent())"\n' +
        '                              onkeydown="list_key_func(event)"\n' +
        '                    ></textarea>\n' +
        '                    <button class="del_list_task" type="button"\n' +
        '                            onmousedown="del_list_task($(this).parent())"\n' +
        '                    >\n' +
        '                        <svg><use xlink:href="time_manager/images/sprites.svg#sprite_btn_del_task"></use></svg>\n' +
        '                    </button>\n' +
        '                </form>');
    btn.addClass('new').before(obj);
    obj.animate({height: '40px', opacity: 1}, 200, 'swing', function () {
        $(this).removeAttr('style').children('textarea').focus()
    });
}

function blur_list_name(form) {
    let old = form.data('old');
    let new_name = get_list_name(form);
    let back = form.closest('.back_back');
    form.data('old', new_name);
    if (back.hasClass('new')) {
        if (new_name !== '') {
            if (user_data.login !== undefined) {
                receive('/add_list', function (data) {
                    if (data === 'exist') {
                        del_list(back)
                    } else {
                        back.removeClass('new');
                        back.prev().prev('button').removeClass('new');
                        back.find('.add_list_task').removeClass('new')
                    }
                }, new_name)
            }
            else {
                back.removeClass('new');
                back.prev().prev('button').removeClass('new');
                back.find('.add_list_task').removeClass('new')
            }
        }
    } else if (new_name !== old) {
        receive('/change_list', function (data) {
            if (data === 'exist') {
                del_list(back);
            }
        }, [old, new_name]);
    }
}

function blur_list_task(form) {
    let old = form.data('old');
    let new_list_data = get_list_data(form);
    form.data('old', new_list_data);
    if (form.hasClass('new')) {
        if (new_list_data.task !== '') {
            if (user_data.login !== undefined) {
                receive('/add_list_task', function (data) {
                    if (data === 'exist') {
                        del_list_task(form);
                    } else {
                        form.removeClass('new');
                        form.next('button').removeClass('new');
                    }
                }, new_list_data)
            }
            else {
                form.removeClass('new');
                form.find('input').removeAttr('placeholder')
            }
        }
    } else if (old.task !== new_list_data.task) {
        receive('/change_list_task', function (data) {
            if (data === 'exist') {
                del_list_task(form);
            }
        }, [old, new_list_data]);
    }
}

