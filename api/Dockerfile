# Dockerfile
FROM ghcr.io/astral-sh/uv:python3.10-trixie-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        cups-client \
        ca-certificates \
        postgresql-client \
        bash && \
    rm -rf /var/lib/apt/lists/*


# Copy dependency files
COPY api/pyproject.toml api/uv.lock  ./

# Install Python dependencies
ENV UV_PROJECT_ENVIRONMENT="/usr/local/"
RUN uv sync --locked --no-dev


# Copy application code
COPY api/ ./api/

# Create directories
RUN mkdir -p  /app/logs

# Create non-root user
RUN groupadd -g 410 tls-cert \
 && useradd -m -u 1500 -g tls-cert market-api \
 && chown -R market-api:tls-cert /app

USER market-api

# Use custom entrypoint
ENTRYPOINT [ "uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8080"]