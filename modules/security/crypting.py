from Crypto.Cipher import PKCS1_OAEP
from Crypto.PublicKey import RSA
from Crypto.Hash import SHA256
from base64 import b64decode


def decrypt(psw):
    key = RSA.importKey(open('private_key.pem').read().encode('utf-8'))
    cipher = PKCS1_OAEP.new(key, hashAlgo=SHA256)
    decrypted = cipher.decrypt(b64decode(psw)).decode('utf-8')
    return decrypted[:64], decrypted[64:]


def new_keys():
    key_pair = RSA.generate(2048)
    with open("private_key.pem", "w") as priv_key:
        priv_key.write(key_pair.exportKey().decode('utf-8'))
    with open("public_key.pem", "w") as pub_key:
        pub_key.write(key_pair.publickey().exportKey().decode('utf-8'))
