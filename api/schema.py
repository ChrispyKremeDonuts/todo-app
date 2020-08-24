import graphene
from graphene import relay, Field, String, ObjectType
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
    
    # item = graphene.String()
    # task_id = graphene.Int()
    

class Query(graphene.ObjectType):
    node = relay.Node.Field()
    # Allows sorting over multiple columns, by default over the primary key
    all_lists = SQLAlchemyConnectionField(List.connection)
    all_tasks= SQLAlchemyConnectionField(Task)
    task = graphene.Field(Task)

    def resolve_task(self, info, title):
        return session.query(Task).all()

# class Query(ObjectType):
#     # this defines a Field `hello` in our Schema with a single Argument `name`
#     hello = String(name=String(default_value="stranger"))
#     goodbye = String()
#     # our Resolver method takes the GraphQL context (root, info) as well as
#     # Argument (name) for the Field and returns data for the query Response
#     def resolve_hello(root, info, name):
#         return f'Hello {name}!'
#     def resolve_goodbye(root, info):
#         return 'See ya!'

schema = graphene.Schema(query=Query)

