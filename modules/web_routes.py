from flask import Flask, render_template, request, redirect, jsonify, json, session
from schedule_access import *
tm = Flask(__name__, template_folder="../templates", static_folder="../../time_manager")

tm.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # В КОНЦЕ ПРОЕКТА УБРАТЬ СТРОКУ

now = False
now = User('Test_user', '1234567890')


# Запросы
@tm.route('/get_data', methods=['POST'])
def get():
    return jsonify({
        "login": now.log,
        "theme": now.theme
    })



@tm.route('/change_theme', methods=['POST'])
def change_theme():
    now.change_theme(request.get_json().split())
    return jsonify(success=True)


@tm.route('/logout', methods=['POST'])
def logout():
    global now
    now = False
    return jsonify(success=True)


@tm.route('/delete', methods=['POST'])
def delete():
    global now
    now.del_user()
    now = False
    return jsonify(success=True)


@tm.route('/authorisation', methods=['POST'])
def authorisation():
    global now
    now = User(**(request.get_json()))
    return jsonify(success=True)


# Страницы
@tm.route('/')
def page_home():
    return render_template("base.html", login=now.log, theme=now.theme)


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






