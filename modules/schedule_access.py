class User(object):
	import sqlite3
	__conn = sqlite3.connect("../databases/schedule.db")
	__cur = __conn.cursor()
	__cur.execute("""CREATE TABLE IF NOT EXISTS users 
					(login VARCHAR(300), psw VARCHAR(300))""")
	__month_list = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь', ]

	def __init__(self, log, psw = None):
		self.log = log
		if not User.check_log(self):
			User.__add_user(self, psw)
		self.list = User.__ret_list(self)
		self.day = User.__ret_day(self)
		self.month = User.__ret_month(self)
		self.list = User.__ret_list(self)

	def __ret_list(self):
		dic = dict()
		User.__cur.execute(f"SELECT (name) FROM list_{self.log}")
		name = list(set(User.__cur.fetchall()))
		print(name)
		for i in range(len(name)):
			User.__cur.execute(f"SELECT (task) FROM list_{self.log} WHERE name = ?", [(name[i])])
			task  = tuple(User.__cur.fetchall())
			dic.update({i:task})
		return dict()

	def __ret_day(self):
		User.__cur.execute(f"SELECT * FROM day_{self.log}")
		return list(sorted(User.__cur.fetchall(), key=lambda x: (x[0], x[1])))

	def __ret_month(self):
		User.__cur.execute(f"SELECT * FROM month_{self.log}")
		return list(sorted(User.__cur.fetchall(), key=lambda x: (User.__month_list.index(x[1]), x[0])))

	def __add_user(self, psw):
		ins = "INSERT INTO users (login, psw) VALUES (?, ?)"
		User.__cur.execute(ins, [(self.log), (psw)])
		User.__conn.commit()
		User.__cur.execute(f"CREATE TABLE IF NOT EXISTS month_{self.log} (digit INTEGER, month VARCHAR(50), task VARCHAR(1000))")
		User.__cur.execute(f"CREATE TABLE IF NOT EXISTS day_{self.log} (hours INTEGER, mins INTEGER, task VARCHAR(1000))")
		User.__cur.execute(f"CREATE TABLE IF NOT EXISTS list_{self.log} (name INTEGER, task VARCHAR(1000))")

	def check_log(self):
		sel = "SELECT (login) FROM users WHERE login=?"
		User.__cur.execute(sel, [(self.log)])
		return User.__cur.fetchone() is not None

	def change_pass(self, psw):
		sel = "UPDATE users SET psw=? WHERE login=?"
		User.__cur.execute(sel, [(psw), (self.log)])
		User.__conn.commit()

	def del_user(self):
		clr = "DELETE FROM users WHERE login=?"
		User.__cur.execute(clr, [(self.log)])
		User.__conn.commit()
		User.__cur.execute(f"DROP TABLE IF EXISTS month_{self.log}")
		User.__cur.execute(f"DROP TABLE IF EXISTS day_{self.log}")

	def check_all(self, psw):
		sel = "SELECT (psw) FROM users WHERE login=?"
		User.__cur.execute(sel, [(self.log)])
		return User.__cur.fetchone() == (psw,)

	def add_day(self, hours, mins, task):
		if (hours, mins, task) not in self.day:
			ins = f"INSERT INTO day_{self.log} (hours, mins, task) VALUES (?, ?, ?)"
			User.__cur.execute(ins, [(hours), (mins), (task)])
			User.__conn.commit()
			self.day = User.__ret_day(self)

	def add_month(self, digit, month, task):
		month = month.lower()
		if (digit, month, task) not in self.month:
			ins = f"INSERT INTO month_{self.log} (digit, month, task) VALUES (?, ?, ?)"
			User.__cur.execute(ins, [(digit), (month), (task)])
			User.__conn.commit()
			self.month = User.__ret_month(self)

	def add_list(self, name, task):
		if (name, task) not in self.list:
			ins = f"INSERT INTO list_{self.log} (name, task) VALUES (?, ?)"
			User.__cur.execute(ins, [(name), (task)])
			User.__conn.commit()
			self.list = User.__ret_list(self)

	def del_day(self, hours, mins, task):
		if (hours, mins, task) in self.day:
			clr = f"DELETE FROM day_{self.log} WHERE hours = ? AND mins = ? AND task = ?"
			User.__cur.execute(clr, [(hours), (mins), (task)])
			User.__conn.commit()
			self.day.remove((hours, mins, task))

	def del_month(self, digit, month, task):
		month = month.lower()
		if (digit, month, task) in self.month:
			clr = f"DELETE FROM month_{self.log} WHERE digit = ? AND month = ? AND task = ?"
			User.__cur.execute(clr, [(digit), (month), (task)])
			User.__conn.commit()
			self.month.remove((digit, month, task))


# Мои тесты (Дима)
now_user = User("T1MON", 'kdfjdkffj')
now_user.add_month(23, 'январь', 'dfjfkdjf')
now_user.add_month(24, 'январь', 'dfjfkdjf')
now_user.add_month(25, 'январь', 'dfjfkdjf')
now_user.add_list(1, 'dfjfkdjfdsfdgf')
now_user.add_list(2, 'dfjf')
now_user.add_list(1, 'dfjfkdjfdsfdgfasdfgdhfgjhjrsdv')
now_user.add_day(22, 33, 'jdfkjf')
now_user.add_day(24, 33, 'jdfkjf')
now_user.add_day(23, 33, 'jdfkjf')
print(now_user.day)
print(now_user.month)
print(now_user.list)

# self.log = 'kekno'
# psw = 'real'
# add_user(conn, cur, self.log, psw)
# add_user(conn, cur, 'kring','chebureck')
# User.__cur.execute("SELECT * FROM users")
# print(User.__cur.fetchall())
# add_day(conn, cur, self.log, 15, 30, 'just do it')
# add_day(conn, cur, self.log, 5, 30, 'lolkekchebureck')
# add_day(conn, cur, self.log, 18, 45, 'uuuuuuuu')
# add_day(conn, cur, self.log, 5, 40, 'sdfvgv')
# add_day(conn, cur, self.log, 4, 59, 'adsfdfsd')
# add_month(conn, cur, self.log, 13, 'февраль', 'sdfdgfs')
# add_month(conn, cur, self.log, 1, 'январь', 'sdfывавпрdgfs')
# add_month(conn, cur, self.log, 30, 'Сентябрь', 'sdfdgfsфцуыквгапть')
# add_month(conn, cur, self.log, 23, 'июнь', 'sdФВАЫВППfdgfs')
# print(ret_month(cur, self.log))
# print(ret_day(cur, self.log))
# del_day(conn, cur, self.log, 5, 40, 'sdfvgv')
# del_month(conn, cur, self.log, 30, 'Сентябрь', 'sdfdgfsфцуыквгапть')
# print(ret_month(cur, self.log))
# print(ret_day(cur, self.log))