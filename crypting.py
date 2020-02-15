from cryptography.fernet import Fernet as Code
from key import key

Decoder = Code(key)


def encrypt(psw):
    """Шифрование пароля"""
    return Decoder.encrypt(bytes(psw))


def decrypt(crypted_psw):
    """Расшифровка пароля"""
    return Decoder.decrypt(crypted_psw)
