from flask import Flask, render_template, request, redirect, jsonify
from schedule_access import *
tm = Flask(__name__, template_folder="../templates", static_folder="../../time_manager")

tm.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # В КОНЦЕ ПРОЕКТА УБРАТЬ СТРОКУ


# Инициализация пользователя
now = User('Test_user', '1234567890')


# Исполняемые адреса
@tm.route('/change_theme', methods=['POST'])
def change_theme():
    now.change_theme(request.get_json().split())
    return jsonify(success=True)


# Видимые страницы
@tm.route('/')
def page_home():
    return render_template("login/base.html", log=now.log, theme=now.theme)


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
    return render_template("about.html", log=now.log, theme=now.theme)






