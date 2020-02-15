from cryptography.fernet import Fernet as Code
from key import key

Decoder = Code(key)

def