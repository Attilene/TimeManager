from cryptography.fernet import Fernet as Code
from key import key

Decoder = Code(key)


def encrypt(psw):
    """Шифрование пароля"""
    res = Decoder.encrypt(bytes(psw))


def decrypt(psw):
    """Расшифровка пароля"""
    res = Decoder.decrypt(psw)
