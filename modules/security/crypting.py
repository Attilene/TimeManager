from Crypto.Cipher import PKCS1_OAEP
from Crypto.PublicKey import RSA
from Crypto.Hash import SHA256
from base64 import b64decode


def decrypt(pswsalt):
    key = RSA.importKey(open('modules/security/private_key.pem').read().encode('utf-8'))
    cipher = PKCS1_OAEP.new(key, hashAlgo=SHA256)
    decrypted = cipher.decrypt(b64decode(pswsalt)).decode('utf-8')
    return decrypted[:64], decrypted[64:]
