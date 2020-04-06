from flask import Flask, render_template, request, redirect, jsonify, json, session
from schedule_access import *
tm = Flask(__name__, template_folder="../templates", static_folder="../../time_manager")

tm.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # В КОНЦЕ ПРОЕКТА УБРАТЬ СТРОКУ


now = None


# Запросы
@tm.route('/check_password', methods=['POST'])
def req_check_password():
    return jsonify(User.check_psw(**request.get_json()))


@tm.route('/login', methods=['POST'])
def req_login():
    global now
    if User.check_psw(*request.get_json()):
        now = User(request.get_json()['login'])
        return jsonify({
            "login": now.log,
            "theme": now.theme,
            "color": now.color,
            "avatar": now.avatar
        })
    else: return jsonify(False)


@tm.route('/register', methods=['POST'])
def req_register():
    User.registration(**request.get_json)
    return jsonify(True)


@tm.route('/get_page', methods=['POST'])
def req_get_page():
    """Отсылка HTML шаблонов"""
    page = request.get_json()
    return render_template(f'{page}.html')


@tm.route('/change_theme', methods=['POST'])
def req_change_theme():
    """Изменение темы"""
    now.change_theme(request.get_json().split())
    return jsonify(True)


@tm.route('/check_user', methods=['POST'])
def req_check_user():
    """Проверка существования пользователя"""
    temp = User.check_user(request.get_json())
    return jsonify(temp)


@tm.route('/logout', methods=['POST'])
def req_logout():
    """Выход пользователя"""
    global now
    now = None
    if now.log == 'Guest': User.guest_reset()
    return jsonify(True)


@tm.route('/delete_user', methods=['POST'])
def req_delete_user():
    """Удаление учётной записи"""
    global now
    now.del_user()
    del now
    return jsonify(True)


# Страницы
@tm.route('/')
def page_home():
    return render_template("base.html", theme='light', color='blue')


@tm.route('/list')
def page_list():
    return 'list'


@tm.route('/day')
def page_day():
    return 'day'


@tm.route('/month')
def page_month():
    return 'month'


@tm.route('/about')
def page_about():
    return render_template("about.html")






