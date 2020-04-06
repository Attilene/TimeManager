from random import choices
from string import printable
from werkzeug.security import check_password_hash, generate_password_hash, gen_salt

def inj_check(req): # TODO: Переделать (Множества)
    cl_el = ('#', '-', ';', '(', ')', '{', '}', '\\', '/', '|', '[', ']', '\'', '\"', '%', '@')
    for el in cl_el:
        if el in req:
            return False
    return True

