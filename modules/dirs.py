from os import mkdir, makedirs, path

keys_path = path.abspath('keys')
db_path = path.abspath('databases')
temp_path = path.abspath('templates')
stat_path = path.abspath('')
av_path = stat_path + '\\avatars'

try: mkdir(keys_path)
except FileExistsError: pass

try: mkdir(db_path)
except FileExistsError: pass

try: mkdir(av_path)
except FileExistsError: pass
