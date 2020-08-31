import graphene
from graphene import relay, Field, String, ObjectType
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from models import session, List as ListModel, Task as TaskModel
from sqlalchemy.sql.functions import coalesce

class List(SQLAlchemyObjectType):
    class Meta:
        model = ListModel

class Task(SQLAlchemyObjectType):
    class Meta:
        model = TaskModel

    
class CreateTask(graphene.Mutation):
    class Arguments:
        item = graphene.String()
        task_id = graphene.String()
        index = graphene.Int()

    completed = graphene.Boolean()
    task = graphene.Field(Task)
    task_id = graphene.String()
    index = graphene.Int()

    def mutate(root, info, item, task_id, index):
        list_id=1
        completed = False
        task = Task(task_id=task_id,item=item, completed=completed, index = index)
        data = [
            TaskModel( task_id=task_id, list_id =list_id, item=item, completed=False, index = index)
        ]
        session.bulk_save_objects(data)
        session.commit()
        return CreateTask(task=task)

class UpdateTask(graphene.Mutation):
    class Arguments:
        item = graphene.String()
        task_id = graphene.String()
    
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
        task_id = graphene.String()
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
        task_id = graphene.String()
    
    task_id = graphene.String()
    task = graphene.Field(Task)

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
    # all_lists = SQLAlchemyConnectionField(List.connection)
    # all_tasks= SQLAlchemyConnectionField(Task)
    tasks = graphene.List(Task)
    task_max_index = graphene.List(Task)
    def resolve_tasks(self, args):
        return session.query(TaskModel).all()

    def resolve_task_max_index(self, args):
      # task_max_index = session.execute("select coalesce(max(index),0) from tasks") 
        return session.query(TaskModel).order_by(TaskModel.index.desc()).limit(1)


schema = graphene.Schema(query=Query, mutation=MyMutations)

