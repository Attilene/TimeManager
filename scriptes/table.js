function click_add_day(btn) {
    let obj = $('<form class="item day" style="position: relative; bottom: 20px; height: 0; overflow: visible; margin: 0 auto; opacity: 0">\n' +
        '            <span class="time">\n' +
        '            <input class="hours" type="text" value="0"\n' +
        '                   onfocus="$(this).parent().addClass(\'input\')"\n' +
        '                   onblur="$(this).parent().removeClass(\'input\'); if ($(this).val() === \'\') $(this).val(0)"\n' +
        '            >\n' +
        '            <span>:</span>\n' +
        '            <input class="minutes" type="text" value="0"\n' +
        '                   onfocus="$(this).parent().addClass(\'input\')"\n' +
        '                   onblur="$(this).parent().removeClass(\'input\'); if ($(this).val() === \'\') $(this).val(0)"\n' +
        '            >\n' +
        '            </span>\n' +
        '            <textarea class="task" placeholder="Задача"></textarea>\n' +
        '            <span class="bout"><button type="button" class="del_day" onmousedown="$(\'::-webkit-resizer\').mousedown()">\n' +
        '                <svg id="email_btn_del_task">\n' +
        '                    <use xlink:href="time_manager/images/sprites.svg#sprite_btn_del_task"></use>\n' +
        '                </svg>\n' +
        '            </button></span>\n' +
        '        </form>');
    btn.before(obj);
    btn.prev().animate({ bottom: 0, height: '40px', margin: '2vh 0', opacity: 1}, 200, 'swing', function () {
        $(this).removeAttr('style')
    })
}