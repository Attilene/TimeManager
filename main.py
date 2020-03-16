from modules import *

User._erase()
now_user = User('Test_user', '1234567890')
User.del_user('Test_user')

if __name__ == "__main__":
    tm.run(debug=True)
