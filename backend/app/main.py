from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import os
from fastapi_limiter import FastAPILimiter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
