import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()
cur.execute("""CREATE TABLE IF NOT EXISTS users 
	(login VARCHAR(200), pswd VARCHAR(200))""")


def add_user(log, psw):
	ins = "INSERT INTO users (login, pswd) VALUES (?, ?)"
	cur.execute(ins, [(log), (psw)])
	conn.commit()
	cur.execute(f"CREATE TABLE IF NOT EXISTS month_{log} (digit INTEGER, month VARCHAR(50), task VARCHAR(700))")
	cur.execute(f"CREATE TABLE IF NOT EXISTS day_{log} (hours INTEGER, mins INTEGER, task VARCHAR(700))")

def change_pass(log, psw):
	sel = "UPDATE users SET pswd=? WHERE login=?"
	cur.execute(sel, [(psw), (log)])
	conn.commit()

def del_user(log):
	clr = "DELETE FROM users WHERE login=?"
	cur.execute(clr, [(log)])
	conn.commit()
	cur.execute(f"DROP TABLE IF EXISTS month_{log}")
	cur.execute(f"DROP TABLE IF EXISTS day_{log}")

def check_all(log, psw):
	sel = "SELECT (pswd) FROM users WHERE login=?"
	cur.execute(sel, [(log)])
	return cur.fetchone() == (psw,)

def check_log(log):
	sel = "SELECT (login) FROM users WHERE login=?"
	cur.execute(sel, [(log)])
	return cur.fetchone() != None

def ret_day(log):
	sel = f"SELECT * FROM day_{log}"
	cur.execute(sel)
	vyvod = cur.fetchall()
	return tuple(sorted(vyvod, key = lambda x: x[0] * 60 + x[1]))

def ret_month(log):
	d = {'Январь':(0,31,), 'Февраль':(1,28,), 'Март':(2,31,), 'Апрель':(3,30,), 'Май':(4,31,), 'Июнь':(5,30,),
		 'Июль':(6,31,), 'Август':(7,31,), 'Сентябрь':(8,30,), 'Октябрь':(9,31,), 'Ноябрь':(10,30,), 'Декабрь':(11,31,)}
	sel = f"SELECT * FROM month_{log}"
	cur.execute(sel)
	vyvod = cur.fetchall()
	return tuple(sorted(vyvod, key = lambda x: x[0] + d[x[1]][0] * d[x[1]][1]))

def add_day(log, hours, mins, task):
	ins = f"INSERT INTO day_{log} (hours, mins, task) VALUES (?, ?, ?)"
	cur.execute(ins, [(hours), (mins), (task)])
	conn.commit()

def add_month(log, digit, month, task):
	ins = f"INSERT INTO month_{log} (digit, month, task) VALUES (?, ?, ?)"
	cur.execute(ins, [(digit), (month.capitalize()), (task)])
	conn.commit()

#def del_day(log, <тут пока хз>):

#def del_month(log, <тут пока хз>):


# log = 'kekno'
# psw = 'real'
# add_user(log, psw)
# add_user('kring','chebureck')
# cur.execute("SELECT * FROM users")
# print(cur.fetchall())
# add_day(log, 15, 30, 'just do it')
# add_day(log, 5, 30, 'lolkekchebureck')
# add_day(log, 18, 45, 'uuuuuuuu')
# add_day(log, 5, 40, 'sdfvgv')
# add_day(log, 4, 59, 'adsfdfsd')
# add_month(log, 13, 'февраль', 'sdfdgfs')
# add_month(log, 1, 'январь', 'sdfывавпрdgfs')
# add_month(log, 30, 'Сентябрь', 'sdfdgfsфцуыквгапть')
# add_month(log, 23, 'июнь', 'sdФВАЫВППfdgfs')
# print(ret_month(log))
# print(ret_day(log))
