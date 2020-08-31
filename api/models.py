from sqlalchemy import *
from sqlalchemy.orm import (scoped_session, sessionmaker, relationship,
                            backref)
from sqlalchemy.ext.declarative import declarative_base  
from sqlalchemy.orm import sessionmaker, relationship


DATABASE_URI = 'postgres+psycopg2://christopherluong:@localhost:5432/todoapp'
engine = create_engine(DATABASE_URI)
session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))

base = declarative_base()
base.query = session.query_property()

class List(base):
     __tablename__ = 'lists'

     list_id = Column(Integer, primary_key=True)
     name = Column(String)
     tasks = relationship("Task", back_populates="lists")

class Task(base):  
    __tablename__ = 'tasks'

    task_id = Column(String, primary_key=True)
    item = Column(String)
    completed = Column(Boolean)
    index = Column(Integer)
    list_id = Column(Integer, ForeignKey('lists.list_id'))
    lists = relationship("List", back_populates="tasks")
