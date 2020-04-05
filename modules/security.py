from random import choices
from string import printable
from werkzeug.security import check_password_hash, generate_password_hash, gen_salt

def salt_generate():
    return ''.join(choices(printable, k=20))

def encrypt_psw():
    return

print(gen_salt(20))