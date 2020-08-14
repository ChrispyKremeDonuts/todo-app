from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Date


Base = declarative_base()


class Item(Base):
    __tablename__ = 'books'
    id = Column(Integer, primary_key=True)
    item = Column(String)

    def __repr__(self):
        return "<Item(id='{}', item='{}')>"\
            .format(self.id, self.item)
