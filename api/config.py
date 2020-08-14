import psycopg2


con = psycopg2.connect(
    host="localhost",
    database="todoapp",
    user="christopherluong",
    password="",
    port=5432
)
cur = con.cursor()

cur.execute("select id, item from todo_list")

rows = cur.fetchall()

for r in rows:
    print (f"id {r[0]} name {r[1]}")

cur.close()

con.close()
#DATABASE_URI = 'postgres+psycopg2://christopherluong:@localhost:5432/todoapp'