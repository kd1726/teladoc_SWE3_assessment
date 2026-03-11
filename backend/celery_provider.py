from celery import Celery
from Config.config import settings

redis_uri = f"redis://{settings.redis_host}:{settings.redis_port}/1"

celery_provider = Celery("tasks", broker=redis_uri, backend=redis_uri)

celery_provider.conf.update(
    task_ignore_result=False,
    result_persistent=True,
    task_track_started=True,
    accept_content = ["json"],
    result_serializer = 'json',
    task_serializer = 'json'
    )

celery_provider.conf.imports = ["Tasks.tasks"] 