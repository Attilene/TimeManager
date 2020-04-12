from modules import *
from Crypto.PublicKey import RSA

# НЕ ТРОГАТЬ
# key_pair = RSA.generate(2048)  # TODO: На релизе 4096
# with open("modules/security/private_key.pem", "w") as priv_key:
#     priv_key.write(key_pair.exportKey().decode('utf-8'))
# with open("modules/security/public_key.pem", "w") as pub_key:
#     pub_key.write(key_pair.publickey().exportKey().decode('utf-8'))
# НЕ ТРОГАТЬ

if __name__ == "__main__":
    tm.run(debug=True, host='127.0.0.1', port=5000)
