class Config(object):
    DEBUG = True
    SEND_FILE_MAX_AGE_DEFAULT = 0  # TODO: Удалить в релизе
    CSRF_ENABLED = True
    SECRET_KEY = 'f92BjcBnNDIgd4CXe7sfMHpz7faEHyu0f07F6Ya2KG16c1xIoVFa3YdlkFm0lcj2vAkgxR2dIaRvR2kWR1CuOVyljL8MYhpF6tKU'
    MAIL_SERVER = 'smtp.yandex.ru'
    MAIL_PORT = 465
    MAIL_DEBUG = True  # TODO: False в релизе
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True
    MAIL_USERNAME = MAIL_DEFAULT_SENDER = 'Time-Manager.Team@yandex.ru'
    MAIL_PASSWORD = 'vofvymswprcotmet'


