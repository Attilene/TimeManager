import sqlite3


def create_table():
	conn = sqlite3.connect("..//db//schedule.db")
	cur = conn.cursor()
	cur.execute("""CREATE TABLE IF NOT EXISTS users 
		(login VARCHAR(300), pswd VARCHAR(300))""")
	return conn, cur

def add_user(conn, cur, log, psw):
	ins = "INSERT INTO users (login, pswd) VALUES (?, ?)"
	cur.execute(ins, [(log), (psw)])
	conn.commit()
	cur.execute(f"CREATE TABLE IF NOT EXISTS month_{log} (digit INTEGER, month VARCHAR(50), task VARCHAR(1000))")
	cur.execute(f"CREATE TABLE IF NOT EXISTS day_{log} (hours INTEGER, mins INTEGER, task VARCHAR(1000))")

def change_pass(conn, cur, log, psw):
	sel = "UPDATE users SET pswd=? WHERE login=?"
	cur.execute(sel, [(psw), (log)])
	conn.commit()

def del_user(conn, cur, log):
	clr = "DELETE FROM users WHERE login=?"
	cur.execute(clr, [(log)])
	conn.commit()
	cur.execute(f"DROP TABLE IF EXISTS month_{log}")
	cur.execute(f"DROP TABLE IF EXISTS day_{log}")

def check_all(cur, log, psw):
	sel = "SELECT (pswd) FROM users WHERE login=?"
	cur.execute(sel, [(log)])
	return cur.fetchone() == (psw,)

def check_log(cur, log):
	sel = "SELECT (login) FROM users WHERE login=?"
	cur.execute(sel, [(log)])
	return cur.fetchone() != None

def ret_day(cur, log):
	sel = f"SELECT * FROM day_{log}"
	cur.execute(sel)
	vyvod = cur.fetchall()
	return list(sorted(vyvod, key = lambda x: x[0] * 60 + x[1]))

def ret_month(cur, log):
	d = {'Январь': 0, 'Февраль': 31, 'Март': 59, 'Апрель': 90, 'Май': 120, 'Июнь': 151,
		 'Июль': 181, 'Август': 212, 'Сентябрь': 243, 'Октябрь': 273, 'Ноябрь': 304, 'Декабрь': 334}
	sel = f"SELECT * FROM month_{log}"
	cur.execute(sel)
	vyvod = cur.fetchall()
	return list(sorted(vyvod, key = lambda x: x[0] + d[x[1]]))

def add_day(conn, cur, log, hours, mins, task):
	ins = f"INSERT INTO day_{log} (hours, mins, task) VALUES (?, ?, ?)"
	cur.execute(ins, [(hours), (mins), (task)])
	conn.commit()

def add_month(conn, cur, log, digit, month, task):
	ins = f"INSERT INTO month_{log} (digit, month, task) VALUES (?, ?, ?)"
	cur.execute(ins, [(digit), (month.capitalize()), (task)])
	conn.commit()

def del_day(conn, cur, log, hours, mins, task):
	clr = f"DELETE FROM day_{log} WHERE hours = ? AND mins = ? AND task = ?"
	cur.execute(clr, [(hours), (mins), (task)])
	conn.commit()

def del_month(conn, cur, log, digit, month, task):
	clr = f"DELETE FROM month_{log} WHERE digit = ? AND month = ? AND task = ?"
	cur.execute(clr, [(digit), (month), (task)])
	conn.commit()


# conn, cur = create_table()
# log = 'kekno'
# psw = 'real'
# add_user(conn, cur, log, psw)
# add_user(conn, cur, 'kring','chebureck')
# cur.execute("SELECT * FROM users")
# print(cur.fetchall())
# add_day(conn, cur, log, 15, 30, 'just do it')
# add_day(conn, cur, log, 5, 30, 'lolkekchebureck')
# add_day(conn, cur, log, 18, 45, 'uuuuuuuu')
# add_day(conn, cur, log, 5, 40, 'sdfvgv')
# add_day(conn, cur, log, 4, 59, 'adsfdfsd')
# add_month(conn, cur, log, 13, 'февраль', 'sdfdgfs')
# add_month(conn, cur, log, 1, 'январь', 'sdfывавпрdgfs')
# add_month(conn, cur, log, 30, 'Сентябрь', 'sdfdgfsфцуыквгапть')
# add_month(conn, cur, log, 23, 'июнь', 'sdФВАЫВППfdgfs')
# print(ret_month(cur, log))
# print(ret_day(cur, log))
# del_day(conn, cur, log, 5, 40, 'sdfvgv')
# del_month(conn, cur, log, 30, 'Сентябрь', 'sdfdgfsфцуыквгапть')
# print(ret_month(cur, log))
# print(ret_day(cur, log))
