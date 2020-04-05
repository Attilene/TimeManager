from flask import Flask, render_template, request, redirect, jsonify, json, session
from schedule_access import *
tm = Flask(__name__, template_folder="../templates", static_folder="../../time_manager")

tm.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # В КОНЦЕ ПРОЕКТА УБРАТЬ СТРОКУ


User.guest_reset()
now = None


# Запросы
@tm.route('/login', methods=['POST'])
def login():
    global now
    now = User(*request.get_json())
    return jsonify({
        "login": now.log,
        "theme": now.theme[0],
        "color": now.theme[1],
        "avatar": now.avatar
    })


@tm.route('/get_page', methods=['POST'])
def get_page():
    """Отсылка HTML шаблонов"""
    page = request.get_json()
    return render_template(f'{page}.html')


@tm.route('/change_theme', methods=['POST'])
def change_theme():
    """Изменение темы"""
    now.change_theme(request.get_json().split())
    return jsonify(success=True)


@tm.route('/check_user', methods=['POST'])
def form_user():
    """Проверка существования пользователя"""
    temp = request.get_json()['name']
    if '@' in temp: str(User.check_user(temp, temp)).lower()
    return str(User.check_user(temp)).lower()


@tm.route('/check_email', methods=['POST'])
def form_email():
    """Проверка существования пользователя"""
    return str(User.check_email(request.get_json()['email'])).lower()


@tm.route('/logout', methods=['POST'])
def logout():
    """Выход пользователя"""
    global now
    now = None
    if now.log == 'Guest': User.guest_reset()
    return jsonify(success=True)


@tm.route('/delete', methods=['POST'])
def delete():
    """Удаление учётной записи"""
    global now
    now.del_user()
    del now
    return jsonify(success=True)


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






