from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user_route
import os
from fastapi_limiter import FastAPILimiter
from app.db.session import engine
from app.db.base import Base

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.include_router(user_route.router,tags=["user"])