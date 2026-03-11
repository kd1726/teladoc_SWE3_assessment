import logging
import colorlog
from colorlog import ColoredFormatter
from Config.config import settings

class BaseLogger:
  @classmethod
  def _get_logger(cls):
    logger = logging.getLogger(cls.__name__)

    minimum_level = logging.DEBUG if settings.debug else logging.INFO
    logger.setLevel(minimum_level)

    if not logger.handlers:
      formatter = cls.__set_formatter()
      handler = cls.__set_handler(minimum_level, formatter)

      logger.addHandler(handler)
    return logger
  
  @classmethod
  def __set_handler(cls, minimum_level, formatter):
    handler = colorlog.StreamHandler()
    handler.setLevel(minimum_level)
    handler.setFormatter(formatter)
    return handler

  @classmethod
  def __set_formatter(cls):
    formatter = ColoredFormatter(
        "%(log_color)s[%(asctime)s] [%(levelname)s] [%(name)s] -- %(message)s",
        datefmt="%d-%m-%Y::%H:%M:%S %p",
        reset=True,
        log_colors={
          'DEBUG':    'cyan',
          'INFO':     'green',
          'WARNING':  'yellow',
          'ERROR':    'red',
          'CRITICAL': 'red,bg_white',
          "EXCEPTION": 'red,bg_black',
        },
        secondary_log_colors={},
        style='%'
      )
    
    return formatter

  @classmethod
  def debug(cls, message):
    return cls._get_logger().debug(message)

  @classmethod
  def info(cls, message):
    return cls._get_logger().info(message)

  @classmethod
  def warning(cls, message):
    return cls._get_logger().warning(message)

  @classmethod
  def error(cls, message):
    return cls._get_logger().error(message)

  @classmethod
  def exception(cls, message):
    return cls._get_logger().exception(f"DO NOT USE IN PROD:{message}")

  @classmethod
  def critical(cls, message):
    return cls._get_logger().critical(message)
