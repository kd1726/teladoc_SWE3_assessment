import Routers.v1.auth_routers as auth_routers
import Routers.v1.tenant_routers as tenant_routers
import Routers.v1.events_routers as events_routers
import Routers.v1.audit_routers as audit_routers
from fastapi import FastAPI, Depends, status
from database import engine, Base
from Config.config import settings
from fastapi.middleware.cors import CORSMiddleware
from Services.db_health_service import DbHealthService
from datetime import datetime
from typing import Annotated

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_routers.router, prefix=f"/{settings.version}/authenticate", tags=["Auth"])
app.include_router(tenant_routers.router, prefix=f"/{settings.version}/tenants", tags=["Tenants"])
app.include_router(events_routers.router, prefix=f"/{settings.version}", tags=["Events/Usage"])
app.include_router(audit_routers.router, prefix=f"/{settings.version}/audits", tags=["Audit_Records"])

@app.get(f"/{settings.version}/health", status_code=status.HTTP_200_OK)
def health():
  return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.get(f"/{settings.version}/ready", status_code=status.HTTP_200_OK)
def ready(app: Annotated[FastAPI, Depends(app)]):
  db_ready = DbHealthService.is_ready_to_connect(app)

  if db_ready:
    return {message: "Application is ready"}
  else:
    raise HTTPException(detail="Dependencies not reachable",status_Code=status.HTTP_503_SERVICE_UNAVAILABLE)