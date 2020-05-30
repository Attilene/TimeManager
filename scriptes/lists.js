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
