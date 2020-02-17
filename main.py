from flask import Flask
tm = Flask(__name__)


@tm.route('/')
@tm.route('/home')
def page_home():
    return


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


if __name__ == "__main__":
    tm.run(debug=True)
