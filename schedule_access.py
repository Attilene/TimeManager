import sqlite3

conn = sqlite3.connect("schedule.db")
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
	return tuple(sorted(vyvod, key = lambda x:x[0] * x[1]))

def ret_month(log):
	sel = f"SELECT * FROM month_{log}"
	cur.execute(sel)
	return cur.fetchall()

def add_day(log, hours, mins, task):
	ins = f"INSERT INTO day_{log} (hours, mins, task) VALUES (?, ?, ?)"
	cur.execute(ins, [(hours), (mins), (task)])
	conn.commit()

def add_month(log, digit, month, task):
	ins = f"INSERT INTO month_{log} (digit, month, task) VALUES (?, ?, ?)"
	cur.execute(ins, [(digit), (month), (task)])
	conn.commit()

#def del_day(log, <тут пока хз>):

#def del_month(log, <тут пока хз>):


log = 'kekno'
psw = 'real'
add_user(log, psw)
add_user('kring','chebureck')
cur.execute("SELECT * FROM users")
print(cur.fetchall())
add_day(log, 15, 30, 'just do it')
add_day(log, 5, 30, 'lolkekchebureck')
add_day(log, 18, 45, 'uuuuuuuu')
add_day(log, 5, 40, 'sdfvgv')
print(ret_day(log))
