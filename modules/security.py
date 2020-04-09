from random import choices
from string import printable
from werkzeug.security import check_password_hash, generate_password_hash, gen_salt
import rsa

private_key = ''
public_key = ''

# def pakaging():
#     global private_key, public_key
#     public_key, private_key = newkeys(2048)


pubkey, privkey = rsa.newkeys(256)
print(pubkey, '\n', privkey)

crypto = ''
message = rsa.decrypt(crypto, privkey) # Расшифровка
print(message.decode('utf8'))
