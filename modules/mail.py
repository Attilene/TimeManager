from flask_mail import Message, Mail
from threading import Thread
from flask import render_template


def send_mail(app, address, sub='', user_data={}):
    mail = Mail(app)
    msg = Message(sub, recipients=[address])
    msg.html = render_template('mail.html', **user_data)
    mail.send(msg)
    # thr = Thread(target=mail.send, args=[msg])
    # thr.start()
    # return thr
