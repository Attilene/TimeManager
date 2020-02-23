import sqlite3


conn = sqlite3.connect("..//database//schedule.db")
cur = conn.cursor()
cur.execute("""CREATE TABLE IF NOT EXISTS users 
	(login VARCHAR(200), pswd VARCHAR(200))""")


def add_user(log, psw):
	ins = "INSERT INTO users (login, pswd) VALUES (?, ?)"
	cur.execute(ins, [(log), (psw)])
	conn.commit()
	cur.execute(f"CREATE TABLE IF NOT EXISTS month_{log} (digit INTEGER, month VARCHAR(50), task VARCHAR(700))")
	cur.execute(f"CREATE TABLE IF NOT EXISTS day_{log} (task VARCHAR(700), hour INTEGER, min INTEGER)")


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


# log = 'kekno'
# psw = 'real'
# add_user(log, psw)
# add_user('kring','chebureck')
# print(check_log(log))
# print(check_all(log, psw))
# cur.execute("SELECT * FROM users")
# print(cur.fetchall())
# del_user(log, psw)
# change_pass(log, 'qwerty')
# cur.execute("SELECT * FROM users")
# print(cur.fetchall())
