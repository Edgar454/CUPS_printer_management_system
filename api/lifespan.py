import os
import asyncpg
import logging
from api.utils.lifespan_utils import get_asyncpg_connection_params , create_cups_connection
from api.settings import Settings

logger = logging.getLogger(__name__)

async def lifespan(app):
    try:
        logger.info("App starting up ...")

        # PostgreSQL pool
        asyncpg_params = get_asyncpg_connection_params()
        app.state.pool = await asyncpg.create_pool(**asyncpg_params)
        # CUPS connection
        app.state.cups_conn = create_cups_connection()
        # Settings
        app.state.settings = Settings()  

        logger.info("✅ App initialized successfully")
        yield

    except Exception as e:
        logger.error(f"❌ Failed to initialize the app: {e}")
        raise  # important: crash the app if startup fails

    finally:
        logger.info("App shutting down ...")

        if hasattr(app.state, "pool"):
            await app.state.pool.close()
        if hasattr(app.state, "cups_conn"):
            app.state.cups_conn.close()