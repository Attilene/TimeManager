**Обновление от 17 февраля**

## Модуль для взаимодействия с БД (Артём)

**Поменяй местами: task на последнее место в day_<log>**

`time_manager\schedule_access.py`

#### **Функции:**

    1) ret_day(log)  ## вывод учетной таблицы дня (название впиши сюда с аргументами) (вывод: [[hours, mins, task], ...)
    2) ret_month(log)  ## вывод  учетной таблицы месяца (название впиши сюда с аргументами) (вывод: [[digit, month, task], ...)
    3) add_day(log, hours, mins, task)  ## добавление записи в дневную таблицу
    4) add_month(log, digit, month, task)  ## добавление записи в месячную таблицу
    5) del_day(log, <тут пока хз>) ## удаление записи из дневной таблицы
    6) del_month(log, <тут пока хз>) ## удаление записи из месячной таблицы таблицы
   
## Структура файлов
**Корень `time_manager\ `**

***`README.md`*** 
    ## сводка проекта

***`schedule_access.py`*** 
    ## модуль взаимодействия с БД
    
    1) add_user(log, psw) ## добавление пользователя в БД 
    2) change_psw(log, psw) ## смена пароля пользователя 
    3) del_user(log) ## удаление пользователя из БД
    4) check_all(log,psw) ## проверка соответствия пароля
    5) check_log(log) ## проверка существования пользователя
    
***`templates\ `*** 
    ## шаблоны HTML
