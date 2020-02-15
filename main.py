from flask import Flask, request

tm = Flask(__name__)


@tm.route('/')
# def home():
#     return 'Hello World'
def requestdata():
    return "Hello! Your IP is {} and you are using {}: ".format(request.remote_addr,
                                                                request.user_agent)

@tm.route('/cabinet')
def cabinet():
    return 'Hello World'




if __name__ == "__main__":
    tm.run(debug=True)
