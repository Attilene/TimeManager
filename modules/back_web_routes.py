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

# Инициализация пользователя
now = User('Test_user', '1234567890')


# Исполняемые адреса
@tm.route('/change_theme', methods=['POST', 'GET'])
def change_theme():
    global page, color, theme
    theme, color = request.form['send_color'].split()

    return redirect(page)


# Исполняемые адреса
@tm.route('/change_theme', methods=['POST', 'GET'])
def change_theme():
    global page, color, theme
    theme, color = request.form['send_color'].split()

    return redirect(page)



