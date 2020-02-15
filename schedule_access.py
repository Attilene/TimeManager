import sqlite3


def add_user(log, psw):
	ins = "INSERT INTO users (login, pswd) VALUES (?, ?)"
	cur.execute(ins, [(log), (psw)])
	conn.commit()
	cur.execute(f"CREATE TABLE IF NOT EXISTS week_{log} (deal VARCHAR(500), time INTEGER)")
	cur.execute(f"CREATE TABLE IF NOT EXISTS day_{log} (deal VARCHAR(500), time INTEGER)")


#def change_pass(log, psw):


#def del_user(log, psw):


#def check_psw(log, psw):


def check_log(log):
	res = None
	sel = "SELECT (pswd) FROM users WHERE login=?"
	cur.execute(sel, [(log)])
	res = cur.fetchone()
	if res != None:
		return True
	else:
		return False


conn = sqlite3.connect("schedule.db")
cur = conn.cursor()
cur.execute("""CREATE TABLE IF NOT EXISTS users 
	(login VARCHAR(200), pswd VARCHAR(200))""")
