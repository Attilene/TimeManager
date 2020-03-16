class User(object):
    import sqlite3
    from front_web_routes import db
    from werkzeug.security import generate_password_hash, check_password_hash
    if __name__ == "__main__":
        __conn = sqlite3.connect(f"../{db}/schedule.db")
    else:
        __conn = sqlite3.connect(f"{db}/schedule.db")
    __gen = generate_password_hash
    __check = check_password_hash
    __cur = __conn.cursor()
    __users = []
    __cur.execute("CREATE TABLE IF NOT EXISTS users (login VARCHAR(200), psw VARCHAR(200), theme VARCHAR(30), color VARCHAR(30))")
    __month_list = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь', ]

    def __init__(self, log, psw=None):
        self.log = log
        self.theme = 'light'
        self.color = 'blue'
        if not User.check_log(self):
            User.__add_user(self, psw)
        self.lists = User.__ret_list(self)
        self.day = User.__ret_day(self)
        self.month = User.__ret_month(self)

    def __ret_users(self):
        User.__cur.execute("SELECT (login) FROM users")
        return list(sorted(User.__cur.fetchall()))

    def __ret_list(self):
        User.__cur.execute(f"SELECT * FROM list_{self.log}")
        lists = {}
        for name, task in User.__cur.fetchall():
            if name in lists:
                lists[name].append(task)
            else:
                lists[name] = [task]
        for name in lists:
            lists[name] = sorted(lists[name])
        return lists

    def __ret_day(self):
        User.__cur.execute(f"SELECT * FROM day_{self.log}")
        return list(sorted(User.__cur.fetchall(), key=lambda x: (x[0], x[1])))

    def __ret_month(self):
        User.__cur.execute(f"SELECT * FROM month_{self.log}")
        return list(sorted(User.__cur.fetchall(), key=lambda x: (User.__month_list.index(x[1]), x[0])))

    def __add_user(self, psw):
        psw = User.__gen(psw)
        if (self.log,) not in User.__users:
            User.__cur.execute("INSERT INTO users (login, psw, theme, color) VALUES (?, ?, ?, ?)", (self.log, psw, self.theme, self.color))
            User.__conn.commit()
            User.__cur.executescript(f"""
                CREATE TABLE IF NOT EXISTS month_{self.log} (digit INTEGER, month VARCHAR(30), task VARCHAR(1000));
                CREATE TABLE IF NOT EXISTS day_{self.log} (hour INTEGER, minute INTEGER, task VARCHAR(1000));
                CREATE TABLE IF NOT EXISTS list_{self.log} (name INTEGER, task VARCHAR(1000))
            """)
            User.__users = User.__ret_users(self)

    def check_log(self):
        User.__cur.execute("SELECT (login) FROM users WHERE login=?", (self.log,))
        return User.__cur.fetchone() is not None

    def check_all(self, psw):
        User.__cur.execute("SELECT (psw) FROM users WHERE login=?", (self.log,))
        return User.__check(User.__cur.fetchone(), psw)

    def change_log(self, log):
        if (log,) not in User.__users:
            User.__cur.execute("UPDATE users SET login=? WHERE login=?", (log, self.log))
            User.__cur.executescript(f"""
                ALTER TABLE month_{self.log} RENAME TO month_{log};
                ALTER TABLE day_{self.log} RENAME TO day_{log};
                ALTER TABLE list_{self.log} RENAME TO list_{log}
            """)
            User.__conn.commit()
            self.log = log

    def change_pass(self, psw):
        psw = User.__gen(psw)
        User.__cur.execute("UPDATE users SET psw=? WHERE login=?", (psw, self.log))
        User.__conn.commit()

    def change_theme(self, theme):
        self.theme = theme
        User.__cur.execute("UPDATE users SET theme=? WHERE login=?", (self.theme, self.log))
        User.__conn.commit()

    def change_color(self, color):
        self.color = color
        User.__cur.execute("UPDATE users SET color= ? WHERE login= ?", (self.color, self.log))
        User.__conn.commit()

    def del_user(self):
        User.__cur.execute("DELETE FROM users WHERE login=?", (self.log,))
        User.__conn.commit()
        User.__cur.executescript(f"""
			DROP TABLE IF EXISTS month_{self.log};
        	DROP TABLE IF EXISTS day_{self.log};
        	DROP TABLE IF EXISTS list_{self.log}
		""")

    def add_list(self, name, task):
        if (name, task) not in self.lists:
            User.__cur.execute(f"INSERT INTO list_{self.log} (name, task) VALUES (?, ?)", (name, task))
            User.__conn.commit()
            self.lists = User.__ret_list(self)

    def add_day(self, hour, minute, task):
        if (hour, minute, task) not in self.day:
            User.__cur.execute(f"INSERT INTO day_{self.log} (hour, minute, task) VALUES (?, ?, ?)", (hour, minute, task))
            User.__conn.commit()
            self.day = User.__ret_day(self)

    def add_month(self, digit, month, task):
        month = month.lower()
        if (digit, month, task) not in self.month:
            User.__cur.execute(f"INSERT INTO month_{self.log} (digit, month, task) VALUES (?, ?, ?)", (digit, month, task))
            User.__conn.commit()
            self.month = User.__ret_month(self)

    def del_list(self, name):
        if (name,) in self.lists:
            User.__cur.execute(f"DELETE FROM list_{self.log} WHERE name = ?", (name,))
            User.__conn.commit()
            self.lists.remove(name)

    def del_list_task(self, name, task):
        if task in self.lists[name] and task != 0:
            User.__cur.execute(f"DELETE FROM list_{self.log} WHERE name = ? AND task = ?", (name, task))
            User.__conn.commit()
            self.lists[name].remove(task)

    def del_day(self, hour, minute, task):
        if (hour, minute, task) in self.day:
            User.__cur.execute(f"DELETE FROM day_{self.log} WHERE hour = ? AND minute = ? AND task = ?", (hour, minute, task))
            User.__conn.commit()
            self.day.remove((hour, minute, task))

    def del_month(self, digit, month, task):
        month = month.lower()
        if (digit, month, task) in self.month:
            User.__cur.execute(f"DELETE FROM month_{self.log} WHERE digit = ? AND month = ? AND task = ?", (digit, month, task))
            User.__conn.commit()
            self.month.remove((digit, month, task))

    @staticmethod
    def _erase():
        """Стирание всех пользователей"""
        User.__cur.execute("SELECT login FROM users")
        log_list = User.__cur.fetchall()
        if len(log_list) > 0:
            for log in log_list:
                User.__cur.executescript(f"""
					DROP TABLE IF EXISTS list_{log[0]};
                	DROP TABLE IF EXISTS month_{log[0]};
                	DROP TABLE IF EXISTS day_{log[0]}
				""")
        User.__cur.execute("DELETE FROM users")
        User.__conn.commit()


def inj_check(req):
    cl_el = ('#', '-', ';', '(', ')', '{', '}', '\\', '/', '|', '[', ']', '\'', '\"', '%')
    for el in cl_el:
        if el in req:
            return False
    return True


# Тесты (Артем и Дима(ахах, норм вписался))
# print(inj_check('adsfghdffdsfgfdf'))
User._erase()
# now_user = User("T1MON", 'kdfjdkffj')
# now_user2 = User("T1MON", 'asdfss')
# now_user1 = User("TKACH", 'sfdsd')
# print(now_user.log)
# now_user.change_log('ATTILENE')
# print(now_user.log)
# print(now_user.day)
# print(now_user.month)
# print(now_user.lists)
#
# now_user.add_month(23, 'январь', 'dfjfkdjf')
# now_user.add_month(24, 'январь', 'dfjfkdjf')
# now_user.add_month(25, 'январь', 'dfjfkdjf')
# now_user.add_list(1, 'dfjfkdjfdsfdgf')
# now_user.add_list(2, 'dfjf')
# now_user.add_list(1, 'dfjfkdjfdsfdgfasdfgdhfgjhjrsdv')
# now_user.add_day(22, 33, 'jdfkjf')
# now_user.add_day(24, 33, 'jdfkjf')
# now_user.add_day(23, 33, 'jdfkjf')
# now_user.del_day(23, 33, 'jdfkjf')
# print(now_user.day)
# print(now_user.month)
# print(now_user.lists)
# print(now_user.theme, now_user.color, sep = ' ')
# now_user.change_color('green')
# print(now_user.theme, now_user.color, sep = ' ')
#
# User._erase()
