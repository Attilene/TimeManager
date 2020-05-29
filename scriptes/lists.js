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
}