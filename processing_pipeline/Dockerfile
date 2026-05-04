FROM ghcr.io/astral-sh/uv:python3.10-trixie-slim

WORKDIR /app

# System deps
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        libcups2-dev \
        build-essential \
        ca-certificates \
        postgresql-client \
        cups-client \
        bash && \
    rm -rf /var/lib/apt/lists/*


# Copy project
COPY processing_pipeline/pyproject.toml processing_pipeline/uv.lock ./

# Install dependencies
ENV UV_PROJECT_ENVIRONMENT="/usr/local/"
RUN uv sync --locked --no-dev


# Copy source
COPY processing_pipeline/ ./processing_pipeline/

# Logs
RUN mkdir -p /app/logs

# User
RUN groupadd -g 410 tls-cert && \
    useradd -m -u 1200 -g tls-cert pipeline && \
    chown -R pipeline:tls-cert /app

USER pipeline

# Entrypoint
ENTRYPOINT ["python", "-m", "processing_pipeline.main"]