import sys
import logging
from fastapi import FastAPI 
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from api.lifespan import lifespan
from api.routes import jobs,files,printers,system

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/app/logs/api.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)


app = FastAPI(lifespan=lifespan)

@app.get("/health", status_code=200)
def healthcheck():
    return JSONResponse(
        content={"status": "ok"},
        status_code=200
    )

app.include_router(jobs.router)
app.include_router(files.router)
app.include_router(printers.router)
app.include_router(system.router)

# Optional CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)


