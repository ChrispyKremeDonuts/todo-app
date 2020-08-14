from sqlalchemy import create_engine
#from config.py import DATABASE_URI

DATABASE_URI = 'postgres+psycopg2://christopherluong:@localhost:5432/todoapp'
engine = create_engine(DATABASE_URI)

def create_db():
   return Base.metadata.create_all(engine)