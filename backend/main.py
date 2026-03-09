import Routers.v1.health_routers as health_routers
import Routers.v1.auth_routers as auth_routers
import Routers.v1.tenant_routers as tenant_routers
import Routers.v1.events_routers as events_routers
from fastapi import FastAPI, Request, status, Depends
from sqlalchemy.orm import Session
from Loggers.base_logger import BaseLogger
from Config.config import version
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db() 
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_headers=["*"]
)
app.include_router(health_routers.router, prefix=f"/{version()}", tags=["Health"])
app.include_router(auth_routers.router, prefix=f"/{version()}/authenticate", tags=["Auth"])
app.include_router(tenant_routers.router, prefix=f"/{version()}/tenants", tags=["Tenants"])
app.include_router(events_routers.router, prefix=f"/{version()}", tags=["Events/Usage"])