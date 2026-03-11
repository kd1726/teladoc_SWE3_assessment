import redis
from Config.config import settings
from Loggers.redis_logger import RedisLogger
from redis.exceptions import ConnectionError, TimeoutError, ResponseError
from ipdb import set_trace

class RedisService:
  def __init__(self, db=settings.redis_db):
    self.redis_client= redis.Redis(
      host = settings.redis_host,
      port = settings.redis_port,
      db = db,
      decode_responses=True
    )
    self.logger = RedisLogger()
    
  @classmethod
  def redis_ready(cls):
    try:
      connected = cls.redis.ping()
      return connected
    except Exception:
      cls.logger.critical("Cannot connect to redis")

  def create_entry(self, key, data, sub_key=None, expiration=settings.default_redis_entry_expiration):
    try:
      self.logger.info(f"Adding key {key}")
      match data:
        case dict():
          self.__redis_hset(key, data, sub_key, expiration)
        case _:
          self.redis_client.set(key, data)
          self.redis_client.expire(key, expiration)
          self.logger.info(f"Successfull added {key}! Entry expires in {expiration} s.")

      self.redis_client.close()
    except Exception as e:
      self.logger.error(f"Redis failed to add entry with key {key}")

  def get_entry(self, key, sub_key=None):
    try:
      entry = self.__redis_get(key)
      return entry
    except ResponseError:
      self.logger.warning("Redis get failing. Attempting hget")
      entry = self.__redis_hget(key)
      return entry
    except redis.ConnectionError:
      self.logger.error("Could not connect with redis")

    except Exception as e:
      self.logger.warning(f"Something is wrong with redis...")

  def delete_entry(self, key):
    try:
      self.logger.info(f"Deleteing entry with key of {key}")
      self.redis.delete(key)
    except ResponseError:
      elf.logger.warning(f"redis delete failed. Trying hdel")
      self.redis.hdel(key)
    except Exception as e:
      self.logger.warning(f"Something is wrong with redis delete...")
  
  def __redis_hset(self, key, data, sub_key=None, expiration=settings.default_redis_entry_expiration):
    try:
      if sub_key:
        self.logger.info(f"stringifying data and adding as value of sub_key {sub_key}")
        new_data = json.dumps(data)
        self.redis_client.hset(key, sub_key, new_data)
      else:
        self.redis_client.hset(key, mapping=data)

      self.logger.info(f"Successfull added {key}! Entry expires in {expiration} s.")
      self.redis_client.hexpire(key, expiration)
    except Exception:
      self.logger.error("Something is wrong with redis...")
  
  def __redis_get(self, key):
    self.logger.info(f"Getting entry with key {key}")
    entry = self.redis_client.get(key)
    self.redis_client.close()
    if entry:
      return entry
    self.logger.warning(f"Entry with with key {key} is not found")
    raise ResponseError

  def __redis_hget(self, key, sub_key=None):
    self.logger.warning("Attempting hget...")
    if sub_key:
      entry = self.redis_client.hget(key, sub_key)
      return entry
    entry = self.redis_client.hget(key)
    self.logger.info("hget successful. Redis entry Found!")
    self.redis_client.close()
    if entry:
      return entry
    raise Exception