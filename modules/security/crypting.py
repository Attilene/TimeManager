from Crypto.Cipher import PKCS1_OAEP
from Crypto.PublicKey import RSA
from Crypto.Hash import SHA256
from base64 import b64decode


def create_keys():
    key_pair = RSA.generate(2048)
    with open("modules/security/private_key.pem", "w") as priv_key:
        priv_key.write(key_pair.exportKey().decode('utf-8'))
    with open("modules/security/public_key.pem", "w") as pub_key:
        pub_key.write(key_pair.publickey().exportKey().decode('utf-8'))


def decrypt(pswsalt):
    key = RSA.importKey(open('modules/security/private_key.pem').read().encode('utf-8'))
    cipher = PKCS1_OAEP.new(key, hashAlgo=SHA256)
    decrypted = cipher.decrypt(b64decode(pswsalt)).decode('utf-8')
    return decrypted[:64], decrypted[64:]


def set_sum(psw):
    hashing = SHA256.new(bytes(psw[:10].encode('ascii')))
    return hashing.hexdigest()[:10]
