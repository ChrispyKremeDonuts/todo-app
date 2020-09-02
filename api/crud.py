# from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker, relationship

# DATABASE_URI = 'postgres+psycopg2://christopherluong:@localhost:5432/todoapp'

# engine = create_engine(DATABASE_URI)
# base = declarative_base()

# class List(base):
#      __tablename__ = 'lists'

#      list_id = Column(Integer, primary_key=True)
#      name = Column(String)
#      tasks = relationship("Task", back_populates="lists")

# class Task(base):
#     __tablename__ = 'tasks'

#     task_id = Column(Integer, primary_key=True)
#     item = Column(String)
#     completed = Column(Boolean)
#     list_id = Column(Integer, ForeignKey('lists.list_id'))
#     lists = relationship("List", back_populates="tasks")


# create_session = sessionmaker(engine)
# session = create_session()

# Task.__table__.drop(engine)
# List.__table__.drop(engine)


# # Create
# #examines the schema and sends a CREATE TABLE command to our database.
# base.metadata.create_all(engine)

# data = [
#     List(list_id=1, name="first_list"),
#     Task(task_id=1, item="Finish this app", completed=False, list_id=1),
#     Task(task_id=2, item="Join Tiny Shiny Weapons?", completed=False, list_id=1),
#     Task(task_id=3, item="Profit???", completed=True, list_id=1)
# ]
# session.bulk_save_objects(data)
# session.commit()

# # Read
# results = session.query(Task)
# # for row in results:
# #     print(row.item)


# # Update
# item = session.query(Task).filter(Task.task_id == 3).one()
# item.item = "updated"

# # for row in results:
# #     print(row.item)

# session.commit()

# # Delete
# session.delete(item)
# session.commit()

# # for row in results:
# #     print(row.item)