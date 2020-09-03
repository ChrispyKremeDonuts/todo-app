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
        list_id = 1
        completed = False
        task = Task(task_id=task_id, item=item, completed=completed, index=index)
        data = [
            TaskModel(
                task_id=task_id,
                list_id=list_id,
                item=item,
                completed=False,
                index=index,
            )
        ]
        session.bulk_save_objects(data)
        session.commit()
        return CreateTask(task=task)


class UpdateTodo(graphene.Mutation):
    class Arguments:
        item = graphene.String()
        task_id = graphene.String()
        completed = graphene.Boolean()
        index = graphene.Int()

    task = graphene.Field(Task)

    def mutate(root, info, item, task_id, completed, index):
        task = Task(task_id=task_id, item=item, completed=completed, index=index)

        row = session.query(TaskModel).filter(TaskModel.task_id == task_id).one()
        row.item = item
        row.completed = completed
        row.index = index

        session.commit()
        return UpdateTodo(task=task)


class SwapIndex(graphene.Mutation):
    class Arguments:
        currentIndex = graphene.Int()
        targetIndex = graphene.Int()

    task = graphene.Field(Task)
    task_id = graphene.String()
    item = graphene.String()
    completed = graphene.Boolean()

    def mutate(root, info, currentIndex, targetIndex):
        currentTodo = (
            session.query(TaskModel).filter(TaskModel.index == currentIndex).one()
        )
        targetTodo = (
            session.query(TaskModel).filter(TaskModel.index == targetIndex).one()
        )

        currentTodo.index = targetIndex
        targetTodo.index = currentIndex
        session.commit()

        task_id = currentTodo.task_id
        item = currentTodo.item
        completed = currentTodo.completed

        task = Task(task_id=task_id, item=item, completed=completed, index=targetIndex)

        return SwapIndex(task=task)


class UpdateCompleted(graphene.Mutation):
    class Arguments:
        task_id = graphene.String()
        completed = graphene.Boolean()

    task = graphene.Field(lambda: Task)

    def mutate(root, info, completed, task_id):

        row = session.query(TaskModel).filter(TaskModel.task_id == task_id).one()
        item = row.item
        row.completed = completed
        session.commit()
        task = Task(task_id=task_id, item=item, completed=completed)
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
    update_todo = UpdateTodo.Field()
    update_completed = UpdateCompleted.Field()
    swap_index = SwapIndex.Field()


class Query(graphene.ObjectType):
    tasks = graphene.List(Task)
    task_max_index = graphene.List(Task)

    def resolve_tasks(self, args):
        return session.query(TaskModel).all()

    def resolve_task_max_index(self, args):
        return session.query(TaskModel).order_by(TaskModel.index.desc()).limit(1)


schema = graphene.Schema(query=Query, mutation=MyMutations)
