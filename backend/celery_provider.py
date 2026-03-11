from celery import Celery
from Config.config import settings

redis_uri = f"redis://{settings.redis_host}:{settings.redis_port}/1"

celery_provider = Celery("tasks", broker=redis_uri)

celery_provider.conf.update(
    result_backend=redis_uri,
    task_ignore_result=False,
    result_persistent=True,
    task_track_started=True
    )

celery_provider.conf.imports = ["Tasks.tasks"] 