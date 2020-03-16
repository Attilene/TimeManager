from back_web_routes import *
tm = Flask(__name__, template_folder=html, static_folder=project)


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


