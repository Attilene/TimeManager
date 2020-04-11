from Crypto.Cipher import PKCS1_OAEP
from Crypto.PublicKey import RSA
from Crypto.Hash import SHA256
from base64 import b64decode


def unpack_psw(psw):
    key = RSA.importKey(open('private.pem').read().encode('utf-8'))
    cipher = PKCS1_OAEP.new(key, hashAlgo=SHA256)
    decrypted = cipher.decrypt(b64decode(psw))
    return decrypted.decode('utf-8')


