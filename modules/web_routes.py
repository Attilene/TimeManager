# Пути к ресурсам из папки проекта time_manager
project = "../time_manager"
html = "templates"
img = "images"
css = "styles"
db = "databases"
from flask import Flask, render_template
tm = Flask(__name__, template_folder=f"../{html}", static_folder=project)

# Пути
@tm.route('/')
def page_home():
    return render_template("base.html", img=img, css=css, theme='light', color='blue')


@tm.route('/cabinet')
def page_cabinet():
    return

@tm.route('/login')
def page_login():
    return


@tm.route('/cabinet/day')
def page_day():
    return


@tm.route('/cabinet/month')
def page_month():
    return

@tm.route('/about')
def page_about():
    return 'about_page'
