from flask_mail import Message, Mail
from flask import render_template
from flask_script import Manager, Shell
from threading import Thread


def send_mail(app, address, user_data={'color': '#6464ff', 'login': 'T1MON', 'link': '#', 'title': 'Тест'}):
    manager = Manager(app)
    col = {
        'red': '#ff6464',
        'blue': '#6464ff',
        'green': '#46aa46',
        'purple': '#b450b4',
        'sky': '#55c0bb',
        'black': '#000',
        'white': '#000',
    }

    def shell_context():
        import os, sys
        return dict(app=app, os=os, sys=sys)

    def async_send_mail(a, m):
        with a.app_context():
            mail.send(m)

    manager.add_command("shell", Shell(make_context=shell_context))
    mail = Mail(app)
    msg = Message(user_data['title'], recipients=[address])
    user_data['color'] = col[user_data['color']]
    msg.html = render_template('mail.html', **user_data)
    thr = Thread(target=async_send_mail, args=[app, msg])
    thr.start()
    return thr
