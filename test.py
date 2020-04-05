from werkzeug.security import generate_password_hash
print(generate_password_hash('1234567890', method='pbkdf2:sha512:50000'))
