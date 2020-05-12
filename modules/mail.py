from flask_mail import Message, Mail
from threading import Thread
from flask import render_template


def send_mail(mail, address, sub='', user_data={}):
    msg = Message(sub, recipients=[address])
    msg.html = render_template('mail.html', **user_data)
    thr = Thread(target=mail.send, args=[msg])
    thr.start()
    return thr
