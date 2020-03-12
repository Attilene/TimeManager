# Пути к ресурсам
project = "../../time_manager"
html = "../templates"
img = "time_manager/images"
css = "time_manager/styles"
db = "databases"

from flask import Flask, render_template, request, redirect
from schedule_access import *
tm = Flask(__name__, template_folder=html, static_folder=project)

tm.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # В КОНЦЕ ПРОЕКТА УБРАТЬ СТРОКУ

page = '/'
color = 'blue'
theme = 'light'

# Адреса
@tm.route('/')
def page_home():
    global page, color, theme
    page = request.path
    return render_template("login/base.html", log='Test_user', img=img, css=css, theme='light', color=color, page='/')


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


@tm.route('/change_theme', methods=['POST', 'GET'])
def change_theme():
    global page, color, theme
    theme, color = request.form['send_color'].split()
    return redirect(page)
