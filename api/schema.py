import graphene
from graphene import relay, Field, String
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from models import session, List as ListModel, Task as TaskModel

class List(SQLAlchemyObjectType):
    class Meta:
        model = ListModel
        interfaces = (relay.Node, )

class Task(SQLAlchemyObjectType):
    class Meta:
        model = TaskModel
        interfaces = (relay.Node, )
    

class Query(graphene.ObjectType):
    node = relay.Node.Field()
    # Allows sorting over multiple columns, by default over the primary key
    all_lists = SQLAlchemyConnectionField(List.connection)
    #all_lists = Field(List)
    tasks = Field(Task)
    #all_tasks = SQLAlchemyConnectionField(Task.connection)
    all_tasks= graphene.List(Task)

    def resolve_all_tasks(self, info, **kwargs):
        return Task.objects.all()

schema = graphene.Schema(query=Query)

