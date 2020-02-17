from flask import Flask, request
tm = Flask(__name__)


@tm.route('/')
def page_home():
    return


@tm.route('/cabinet')
def page_cabinet():
    return


@tm.route('/login')
def page_login():
    return


if __name__ == "__main__":
    tm.run(debug=True)
