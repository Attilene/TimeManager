from flask import Flask, request
tm = Flask(__name__)


@tm.route('/')
def home():
    return 'Hello World'


@tm.route('/cabinet')
def cabinet():
    return 'Hello World'




if __name__ == "__main__":
    tm.run(debug=True)
