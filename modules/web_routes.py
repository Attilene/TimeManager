from file_routes import *
from flask import Flask, render_template, request, redirect
from schedule_access import *
tm = Flask(__name__, template_folder=html, static_folder=project)

tm.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # В КОНЦЕ ПРОЕКТА УБРАТЬ СТРОКУ


# Инициализация пользователя
now = User('Test_user', '1234567890')
page = '/'


# Исполняемые адреса
@tm.route('/change_theme', methods=['POST', 'GET'])
def change_theme():
    now.change_theme(tuple(request.form['send_color'].split()))
    return redirect(page)


# Видимые страницы
@tm.route('/')
def page_home():
    global page
    page = request.path
    return render_template("login/base.html", log=now.log, img=img, css=css, theme=now.theme, page='/')


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
    return 'about'






