from flask import Flask
tm = Flask(__name__)


import modules

if __name__ == "__main__":
    tm.run(debug=True)
