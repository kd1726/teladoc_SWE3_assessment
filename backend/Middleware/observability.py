from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from Loggers.base_logger import BaseLogger
import time
import uuid

class OberservabilityMiddleware(BaseHTTPMiddleware):
  async def dispatch(self, request: Request, call_next):
    correlation_id = request.headers.get("X-Correlation-Id", str(uuid.uuid4()))
    start_time = time.perf_counter()
  
    try:
        response: Response = await call_next(request)
    except Exception as e:
        process_time = (time.perf_counter() - start_time) * 1000
        self.log_request(request, 500, process_time, correlation_id)
        raise e

    process_time = (time.perf_counter() - start_time) * 1000
    
    response.headers["X-Correlation-Id"] = correlation_id
    self.log_request(request, response.status_code, process_time, correlation_id)
    return response

  def log_request(self, request: Request, status_code: int, latency: float, correlation_id: str):
    tenant_id = getattr(request.state, "tenant_id", "anonymous")
    log_data = {
        "correlation_id": correlation_id,
        "tenant_id": tenant_id,
        "route": request.url.path,
        "method": request.method,
        "status_code": status_code,
        "latency_ms": round(latency, 2),
    }
    BaseLogger.info(f"Request Log: {log_data}")