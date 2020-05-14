from werkzeug.security import check_password_hash, generate_password_hash, gen_salt
import sqlite3
from security.crypting import decrypt, set_sum


class User(object):
    if __name__ == "__main__":
        __conn = sqlite3.connect(f"../databases/schedule.db", check_same_thread=False)
    else:
        __conn = sqlite3.connect(f"databases/schedule.db", check_same_thread=False)
    __cur = __conn.cursor()
    __cur.execute("""
            CREATE TABLE IF NOT EXISTS users(
                login      VARCHAR(50), 
                email      VARCHAR(100), 
                password   VARCHAR(100), 
                theme      VARCHAR(10), 
                color      VARCHAR(10), 
                salt       VARCHAR(64),
                activated  BOOLEAN,
                hash_sum   VARCHAR(10))
                """)
    __month_list = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь',
                    'ноябрь', 'декабрь', ]
    authorisation = False

    def __init__(self, log_email):
        User.__cur.execute("""SELECT login, email, theme, color, salt, activated, hash_sum FROM users
        WHERE login = ? OR email = ?""", (log_email, log_email,))
        self.log, self.email, self.theme, self.color, self.salt, self.activated, self.hash_sum = User.__cur.fetchone()
        self.token = gen_salt(50)
        self.lists = User.__ret_lists(self)
        self.day = User.__ret_day(self)
        self.month = User.__ret_month(self)
        User.authorisation = True

    # Возврат данных из БД #
    def __ret_lists(self):
        User.__cur.execute(f"SELECT * FROM list_{self.log}")
        lists = {}
        for name, task, number in User.__cur.fetchall():
            if name in lists:
                lists[name].append([task, number])
            else:
                lists[name] = [[task, number]]
        return lists

    def __ret_day(self):
        User.__cur.execute(f"SELECT * FROM day_{self.log}")
        return list(sorted(User.__cur.fetchall(), key=lambda x: (x[0], x[1])))

    def __ret_month(self):
        User.__cur.execute(f"SELECT * FROM month_{self.log}")
        return list(sorted(User.__cur.fetchall(), key=lambda x: (User.__month_list.index(x[1]), x[0])))

    # Изменение данных пользователя #
    def activate(self, act):
        self.activated = act
        User.__cur.execute("UPDATE users SET activated = ? WHERE login = ?", (self.activated, self.log))
        User.__conn.commit()

    def change_log(self, log):
        User.__cur.execute("UPDATE users SET login = ? WHERE login = ?", (log, self.log))
        User.__conn.commit()
        User.__cur.executescript(f"""
            ALTER TABLE month_{self.log} RENAME TO month_{log};
            ALTER TABLE day_{self.log} RENAME TO day_{log};
            ALTER TABLE list_{self.log} RENAME TO list_{log}
        """)
        self.log = log

    def change_email(self, email):
        User.__cur.execute("UPDATE users SET email = ? WHERE login = ?", (email, self.log))
        User.__conn.commit()
        self.email = email

    def change_pass(self, pswsalt):
        psw, salt = decrypt(pswsalt)
        hashed_psw = generate_password_hash(psw + salt[:-1])
        User.__cur.execute("UPDATE users SET password = ? WHERE login = ?", (hashed_psw, self.log))
        User.__conn.commit()

    def change_theme(self, theme, color):
        self.theme, self.color = theme, color
        User.__cur.execute("UPDATE users SET theme = ?, color = ? WHERE login = ?", (theme, color, self.log))
        User.__conn.commit()

    def change_num(self, name, task, new_num):
        User.__cur.execute(f"SELECT number FROM list_{self.log} WHERE name = ? AND task = ?", (name, task))
        buf = self.lists[name].pop(self.lists[name].index([task, User.__cur.fetchone()[0]]))
        buf[1] = new_num
        self.lists[name].insert(new_num - 1, buf)
        for i, value in enumerate(self.lists[name], 1):
            self.lists[name][i - 1][1] = i
        for el in self.lists[name]:
            User.__cur.execute(f"SELECT number FROM list_{self.log} WHERE name = ? AND task = ?", (name, el[0]))
            if User.__cur.fetchone()[0] != el[1]:
                User.__cur.execute(f"UPDATE list_{self.log} SET number = ? WHERE name = ? AND task = ?",
                                   (el[1], name, el[0]))
        User.__conn.commit()

    def del_user(self):
        User.__cur.execute("DELETE FROM users WHERE login = ?", (self.log,))
        User.__conn.commit()
        User.__cur.executescript(f"""
            DROP TABLE IF EXISTS month_{self.log};
            DROP TABLE IF EXISTS day_{self.log};
            DROP TABLE IF EXISTS list_{self.log}
        """)

    # Работа с данными #
    # Добавление #
    def add_list(self, name, task):
        number = 1
        check_task = False
        User.__cur.execute(f"SELECT number FROM list_{self.log} WHERE name = ?", (name,))
        num_bd = User.__cur.fetchall()
        if num_bd:
            number = num_bd[-1][0] + 1
        for k, v in self.lists.items():
            for el in v:
                if el[0] == task and k == name:
                    check_task = True
        if not check_task:
            User.__cur.execute(f"INSERT INTO list_{self.log} (name, task, number) VALUES (?, ?, ?)",
                               (name, task, number))
            User.__conn.commit()
            self.lists = User.__ret_lists(self)

    def add_day(self, hour, minute, task):
        User.__cur.execute(f"INSERT INTO day_{self.log} (hour, minute, task) VALUES (?, ?, ?)", (hour, minute, task))
        User.__conn.commit()
        self.day = User.__ret_day(self)

    def add_month(self, digit, month, task):
        month = month.lower()
        User.__cur.execute(f"INSERT INTO month_{self.log} (digit, month, task) VALUES (?, ?, ?)", (digit, month, task))
        User.__conn.commit()
        self.month = User.__ret_month(self)

    # Удаление #
    def del_list_task(self, name, task, number):
        User.__cur.execute(f"DELETE FROM list_{self.log} WHERE name = ? AND task = ? AND number = ?",
                           (name, task, number))
        self.lists[name].remove([task, number])
        if len(self.lists[name]) == 0:
            del self.lists[name]
            User.__cur.execute(f"DELETE FROM list_{self.log} WHERE name = ?", (name, ))
        else:
            for i, value in enumerate(self.lists[name], 1):
                self.lists[name][i - 1][1] = i
            for el in self.lists[name]:
                User.__cur.execute(f"SELECT number FROM list_{self.log} WHERE name = ? AND task = ?", (name, el[0]))
                if User.__cur.fetchone()[0] != el[1]:
                    User.__cur.execute(f"UPDATE list_{self.log} SET number = ? WHERE name = ? AND task = ?",
                                       (el[1], name, el[0]))
        User.__conn.commit()

    def del_list(self, name):
        if name in self.lists:
            User.__cur.execute(f"DELETE FROM list_{self.log} WHERE name = ?", (name,))
            User.__conn.commit()
            self.lists.pop(name)

    def del_day(self, hour, minute, task):
        if (hour, minute, task) in self.day:
            User.__cur.execute(f"DELETE FROM day_{self.log} WHERE hour = ? AND minute = ? AND task = ?",
                               (hour, minute, task))
            User.__conn.commit()
            self.day.remove((hour, minute, task))

    def del_month(self, digit, month, task):
        month = month.lower()
        if (digit, month, task) in self.month:
            User.__cur.execute(f"DELETE FROM month_{self.log} WHERE digit = ? AND month = ? AND task = ?",
                               (digit, month, task))
            User.__conn.commit()
            self.month.remove((digit, month, task))

    @staticmethod
    def check_user(log_email):
        """Проверка существования пользователя"""
        User.__cur.execute("SELECT (salt) FROM users WHERE login = ? OR email = ?", (log_email, log_email))
        return User.__cur.fetchone()

    @staticmethod
    def fast_check_psw(log_email, pswsalt, login):
        User.__cur.execute("SELECT hash_sum FROM users WHERE login = ? OR email = ?", (log_email, log_email))
        hash_sum = User.__cur.fetchone()[0]
        return set_sum(decrypt(pswsalt)[0], login) == hash_sum

    @staticmethod
    def check_psw(log_email, pswsalt):
        """Проверка правильности пароля"""
        User.__cur.execute("SELECT (password) FROM users WHERE login = ? OR email = ?", (log_email, log_email))
        temp = User.__cur.fetchone()
        if len(temp) < 1:
            return False
        return check_password_hash(temp[0], ''.join(decrypt(pswsalt))[:-1])

    # @staticmethod TODO: Доделать
    # def restore(email):
    #     User.__cur.execute("SELECT (login, ) FROM users WHERE email=?", (email,))
    #     if email is None:
    #         return User.__cur.fetchone()[0]
    #     else:
    #         return User.__cur.fetchone() is not None

    @staticmethod
    def registration(log, email, pswsalt, theme, color):
        """Регистрация"""
        psw, salt = decrypt(pswsalt)
        hashed_psw = generate_password_hash(psw + salt[:-1])
        User.__cur.execute(
            """INSERT INTO users (login, email, password, theme, color, salt, activated, hash_sum)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (log, email, hashed_psw, theme, color, salt, False, set_sum(psw, log)))
        User.__conn.commit()
        User.__cur.executescript(f"""
            CREATE TABLE IF NOT EXISTS month_{log} (digit INTEGER, month VARCHAR(30), task TEXT);
            CREATE TABLE IF NOT EXISTS day_{log} (hour INTEGER, minute INTEGER, task TEXT);
            CREATE TABLE IF NOT EXISTS list_{log} (name INTEGER, task TEXT, number INTEGER)
        """)

    @staticmethod
    def _erase():
        """Стирание всех пользователей"""
        User.__cur.execute("SELECT login FROM users")  # TODO: Дописать удаление аватарок
        log_list = User.__cur.fetchall()
        if len(log_list) > 0:
            for log in log_list:
                User.__cur.executescript(f"""DROP TABLE IF EXISTS list_{log[0]};
                    DROP TABLE IF EXISTS month_{log[0]};
                    DROP TABLE IF EXISTS day_{log[0]}""")
        User.__cur.execute("DELETE FROM users")
        User.__conn.commit()
        print('Очистка базы данных завершена успешно')


# User._erase()
# Создание таблицы-----------------------------------------------------------------------------------------
# __cur.execute("""CREATE TABLE IF NOT EXISTS users
#                   (login VARCHAR(200), psw VARCHAR(200),
#                   email VARCHAR(200), theme VARCHAR(30), color VARCHAR(30), avatar BOOLEAN,
#                   salt VARCHAR(20), activated BOOLEAN)""")
# -----------------------------------------------------------------------------------------------------------
# Тесты (Артем и Дима(ахах, норм вписался)) print(inj_check('adsfghdffdsfgfdf')) User._erase()
# now_user = User("T1MON", 'T1MON@yandex.ru', 'kdfjdkffj')
# now_user2 = User("T1MON", 'asdfss') now_user1 = User("TKACH", 'sfdsd') print(
# now_user.log) now_user.change_log('ATTILENE') print(now_user.log) print(now_user.day) print(now_user.month) print(
# now_user.lists)
# now_user = User('Attilene')
# print(now_user.log)
# print(now_user.email)
# now_user.change_email('qwerty@mail.ru')
# print(now_user.email)
# print(now_user.change_avatar(False))
# print(now_user.fast_check_psw('Attilene', '726b9c5fc5baf0a6d0fc92659715757b599a77b87202fb81ce23ad7662543ace'))
# now_user.add_month(23, 'январь', 'dfjfkdjf')
# now_user.add_month(24, 'январь', 'dfjfkdjf')
# now_user.add_month(25, 'январь', 'dfjfkdjf')
# now_user.add_list('1', 'dfjfkdjfdsfdgf')
# now_user.add_list('2', 'dfjf')
# now_user.add_list('1', 'dfjfkdjfdsfdgfasdfgdhfgjhjrsdv')
# now_user.add_list('1', 'werty')
# now_user.change_num('1', 'werty', 2)
# now_user.del_list_task('1', 'werty', 2)
# now_user.add_day(22, 33, 'jdfkjf')
# now_user.add_day(24, 33, 'jdfkjf')
# now_user.add_day(23, 33, 'jdfkjf')
# now_user.del_day(23, 33, 'jdfkjf')
# print(now_user.day)
# print(now_user.month)
# print(now_user.lists)
# print(now_user.theme)
# theme = ('light', 'green')
# now_user.change_theme(theme)
# print(*now_user.theme)
#
# User._erase()
