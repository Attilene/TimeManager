from flask_mail import Message, Mail
from threading import Thread
from flask import render_template
from flask_script import Manager, Shell
from threading import Thread


def send_mail(app, address, title='', user_data={}):
    manager = Manager(app)

    def shell_context():
        import os, sys
        return dict(app=app, os=os, sys=sys)

    def async_send_mail(a, m):
        with a.app_context():
            mail.send(m)

    manager.add_command("shell", Shell(make_context=shell_context))
    mail = Mail(app)
    msg = Message(title, recipients=[address])
    msg.html = render_template('mail.html', **user_data)
    mail.send(msg)
    thr = Thread(target=async_send_mail, args=[app, msg])
    thr.start()
    return thr
