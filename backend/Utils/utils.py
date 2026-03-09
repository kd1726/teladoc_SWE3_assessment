from decouple import config

def is_debug():
  return config("DEBUG_MODE", False)