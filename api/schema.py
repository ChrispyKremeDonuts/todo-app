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

    
class CreateTask(graphene.Mutation):
    class Arguments:
        item = graphene.String()
    
    completed = graphene.Boolean()
    task = graphene.Field(lambda: Task)

    def mutate(root, info, item):
        list_id=1
        completed = False
        task = Task(item=item, completed=completed)
        data = [
            TaskModel( list_id =list_id, item=item, completed=False)
        ]
        session.bulk_save_objects(data)
        session.commit()
        return CreateTask(task=task)

class UpdateTask(graphene.Mutation):
    class Arguments:
        item = graphene.String()
        task_id = graphene.Int()
    
    completed = graphene.Boolean()
    task = graphene.Field(lambda: Task)

    def mutate(root, info, item, task_id):
        completed = False
        task = Task(task_id=task_id, item=item, completed=completed)

        row = session.query(TaskModel).filter(TaskModel.task_id == task_id).one()
        row.item=item
        session.commit()
        return UpdateTask(task=task)

class UpdateCompleted(graphene.Mutation):
    class Arguments:
        task_id = graphene.Int()
        completed = graphene.Boolean()

    item = graphene.String()
    task = graphene.Field(lambda: Task)

    def mutate(root, info, completed, task_id):

        row = session.query(TaskModel).filter(TaskModel.task_id == task_id).one()
        item = row.item
        row.completed=completed
        session.commit()
        task = Task(task_id=task_id,item=item, completed=completed)
        return UpdateCompleted(task=task)

class DeleteTask(graphene.Mutation):
    class Arguments:
        task_id = graphene.Int()
    
    task_id = graphene.Int()
    task = graphene.Field(lambda: Task)

    def mutate(root, info, task_id):
        task = Task(task_id=task_id)
        row = session.query(TaskModel).filter(TaskModel.task_id == task_id).one()
        session.delete(row)
        session.commit()
        return DeleteTask(task=task)



class MyMutations(graphene.ObjectType):
    create_task = CreateTask.Field()
    delete_task = DeleteTask.Field()
    update_task = UpdateTask.Field()
    update_completed = UpdateCompleted.Field()

class Query(graphene.ObjectType):
    node = relay.Node.Field()
    # Allows sorting over multiple columns, by default over the primary key
    all_lists = SQLAlchemyConnectionField(List.connection)
    all_tasks= SQLAlchemyConnectionField(Task)
    task = graphene.Field(Task)

    # def resolve_all_tasks(self, info):
    #     return session.query(Task).all()


schema = graphene.Schema(query=Query, mutation=MyMutations)

