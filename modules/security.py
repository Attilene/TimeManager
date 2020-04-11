# from random import choices
# from string import printable
# from werkzeug.security import check_password_hash, generate_password_hash, gen_salt
# import rsa
#
# private_key = ''
# public_key = ''
#
# def pakaging():
#     global private_key, public_key
#     public_key, private_key = newkeys(2048)
#
# import rsa
#
# (pubkey, privkey) = rsa.newkeys(512)
#
# message = b'Hello Blablacode.ru!'
#
# # шифруем
# crypto = rsa.encrypt(message, pubkey)
# print(crypto)
# # расшифровываем
# message = rsa.decrypt(crypto, privkey)
# print(message)
#
#
# (pubkey, privkey) = rsa.newkeys(512)
# message = b'hello Alisa!'
# crypto = rsa.encrypt(message, pubkey) # Зашифровка
# print(pubkey)
# print(crypto)
# message = rsa.decrypt(crypto, privkey) # Расшифровка
# print(message.decode('utf8'))
#
# privkey = rsa.PrivateKey(59861460478085564020717569863841455703046939406028997076971665720270739373047, 65537, 49342752284765250987429754819637445657484943506082288115895623420436999894553, 45901362813563279566235867408929868541277, 1304132531341689269119203120370247011)
#
#
# import codecs
#
# hexify = codecs.getdecoder('hex')
# crypto = hexify('175eb0732a93a6bc12f6bb4e3157d194e7ab64213b81021e4ac2d2576ba93b340369c973df0cbe2755490676069e4303da247c3b8fbfd09cc0d35234cc28aa047a25db80348e630cbbac3385a6')
# print(crypto)
# print(rsa.bytes2int(crypto))
#
#
#
#
# print(crypto)
#
# message = rsa.decrypt(crypto, privkey)  # Расшифровка
# print(message)
#
#

import PyCript