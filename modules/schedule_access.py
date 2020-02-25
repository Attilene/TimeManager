class User(object):
	import sqlite3
	__conn = sqlite3.connect("../databases/schedule.db")
	__cur = __conn.cursor()
	__cur.execute("""CREATE TABLE IF NOT EXISTS users 
					(login VARCHAR(300), psw VARCHAR(300))""")
	__month_list = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь', ]

	def __init__(self, log, psw=None):
		self.log = log
		if not User.check_log(self):
			User.__add_user(self, psw)
		self.lists = User.__ret_list(self)
		self.day = User.__ret_day(self)
		self.month = User.__ret_month(self)

	def __ret_list(self):
		User.__cur.execute(f"SELECT * FROM list_{self.log}")
		lists = {}
		for name, task in User.__cur.fetchall():
			if name in lists: lists[name].append(task)
			else: lists[name] = [task]
		for name in lists: lists[name] = sorted(lists[name])
		return lists

	def __ret_day(self):
		User.__cur.execute(f"SELECT * FROM day_{self.log}")
		return list(sorted(User.__cur.fetchall(), key=lambda x: (x[0], x[1])))

	def __ret_month(self):
		User.__cur.execute(f"SELECT * FROM month_{self.log}")
		return list(sorted(User.__cur.fetchall(), key=lambda x: (User.__month_list.index(x[1]), x[0])))

	def __add_user(self, psw):
		ins = "INSERT INTO users (login, psw) VALUES (?, ?)"
		User.__cur.execute(ins, [self.log, psw])
		User.__conn.commit()
		User.__cur.execute(f"CREATE TABLE IF NOT EXISTS month_{self.log} (digit INTEGER, month VARCHAR(50), task VARCHAR(1000))")
		User.__cur.execute(f"CREATE TABLE IF NOT EXISTS day_{self.log} (hour INTEGER, minute INTEGER, task VARCHAR(1000))")
		User.__cur.execute(f"CREATE TABLE IF NOT EXISTS list_{self.log} (name INTEGER, task VARCHAR(1000))")

	def check_log(self):
		sel = "SELECT (login) FROM users WHERE login=?"
		User.__cur.execute(sel, [self.log])
		return User.__cur.fetchone() is not None

	def check_all(self, psw):
		sel = "SELECT (psw) FROM users WHERE login=?"
		User.__cur.execute(sel, [self.log])
		return User.__cur.fetchone() == (psw,)

	def change_pass(self, psw):
		sel = "UPDATE users SET psw=? WHERE login=?"
		User.__cur.execute(sel, [psw, self.log])
		User.__conn.commit()

	def del_user(self):
		clr = "DELETE FROM users WHERE login=?"
		User.__cur.execute(clr, [self.log])
		User.__conn.commit()
		User.__cur.execute(f"DROP TABLE IF EXISTS month_{self.log}")
		User.__cur.execute(f"DROP TABLE IF EXISTS day_{self.log}")
		User.__cur.execute(f"DROP TABLE IF EXISTS list_{self.log}")

	# # def add_list(self, name):
	# # 	if name not in self.lists:
	# # 		ins = f"INSERT INTO list_{self.log} (name, task) VALUES (?, ?)"
	# # 		User.__cur.execute(ins, [name, 'empty'])
	# # 		User.__conn.commit()
	# # 		self.lists.update({name: []})
	#
	# def add_list(self, name, task):
	#
	# 	if task not in self.lists[name]:
	# 		ins = f"INSERT INTO list_{self.log} (name, task) VALUES (?, ?)"
	# 		User.__cur.execute(ins, [name, task])
	# 		User.__conn.commit()
	# 		self.lists = User.__ret_list(self)

	def add_list(self, name, task):
		if (name, task) not in self.lists:
			ins = f"INSERT INTO list_{self.log} (name, task) VALUES (?, ?)"
			User.__cur.execute(ins, [name, task])
			User.__conn.commit()
			self.lists = User.__ret_list(self)

	def add_day(self, hour, minute, task):
		if (hour, minute, task) not in self.day:
			ins = f"INSERT INTO day_{self.log} (hour, minute, task) VALUES (?, ?, ?)"
			User.__cur.execute(ins, [hour, minute, task])
			User.__conn.commit()
			self.day = User.__ret_day(self)

	def add_month(self, digit, month, task):
		month = month.lower()
		if (digit, month, task) not in self.month:
			ins = f"INSERT INTO month_{self.log} (digit, month, task) VALUES (?, ?, ?)"
			User.__cur.execute(ins, [digit, month, task])
			User.__conn.commit()
			self.month = User.__ret_month(self)

	def del_list(self, name):
		if (name) in self.lists:
			clr = f"DELETE FROM list_{self.log} WHERE name = ?"
			User.__cur.execute(clr, name)
			User.__conn.commit()
			self.lists.remove(name)

	def del_list_task(self, name, task):
		if task in self.lists[name] and task != 0:
			clr = f"DELETE FROM list_{self.log} WHERE name = ? AND task = ?"
			User.__cur.execute(clr, [name, task])
			User.__conn.commit()
			self.lists[name].remove(task)

	def del_day(self, hour, minute, task):
		if (hour, minute, task) in self.day:
			clr = f"DELETE FROM day_{self.log} WHERE hour = ? AND minute = ? AND task = ?"
			User.__cur.execute(clr, [hour, minute, task])
			User.__conn.commit()
			self.day.remove((hour, minute, task))

	def del_month(self, digit, month, task):
		month = month.lower()
		if (digit, month, task) in self.month:
			clr = f"DELETE FROM month_{self.log} WHERE digit = ? AND month = ? AND task = ?"
			User.__cur.execute(clr, [digit, month, task])
			User.__conn.commit()
			self.month.remove((digit, month, task))

	@staticmethod
	def _erase():
		"""Стирание всех пользователей"""
		User.__cur.execute(f"SELECT login FROM users")
		log_list = User.__cur.fetchall()
		if len(log_list) > 0:
			for log in log_list:
				User.__cur.execute(f"DROP TABLE IF EXISTS list_{log[0]}")
				User.__cur.execute(f"DROP TABLE IF EXISTS month_{log[0]}")
				User.__cur.execute(f"DROP TABLE IF EXISTS day_{log[0]}")
		User.__cur.execute(f"DELETE from users")

# Мои тесты (Дима)
# User._erase()
# now_user = User("T1MON", 'kdfjdkffj')
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

# User._erase()

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
