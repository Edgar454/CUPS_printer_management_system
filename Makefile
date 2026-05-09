.PHONY: all build push run down clean rebuild status logs login

SHELL := /bin/bash

# Stamp files
BUILD_STAMP = .build_done
PUSH_STAMP = .push_done

# Optional image tag for CI/CD
TAG ?= latest

# Registry
REGISTRY = ghcr.io/edgar454

DOCKERFILES = \
	observability/grafana/Dockerfile \
	observability/otel/Dockerfile \
	observability/prometheus/Dockerfile \
	observability/tempo/Dockerfile \
	observability/postgres-exporter/Dockerfile \
	api/Dockerfile \
	cups_server/Dockerfile \
	database/Dockerfile \
	dummy_printer/Dockerfile \
	printer-platform-ui/Dockerfile \
	processing_pipeline/Dockerfile

IMAGES = \
	grafana \
	otel-collector \
	prometheus \
	tempo \
	postgres-exporter \
	cups-api \
	cups-server \
	cups-database \
	dummy-printer \
	cups-frontend \
	cups-pipeline

# All source files
SOURCES = $(shell find observability database dummy_printer api cups_server printer-platform-ui processing_pipeline \
	-type f \
	\( -name "*.py" -o -name "*.ts" -o -name "*.tsx" -o -name "*.yaml" -o -name "*.yml" -o -name "*.sql" \) \
	2>/dev/null)

# Default target
all: build push run

# Login to registry
login:
	@echo "🔐 Logging in to $(REGISTRY)..."
	@echo $(GITHUB_ACTOR)
	@echo $(GITHUB_TOKEN) | docker login ghcr.io -u $(GITHUB_ACTOR) --password-stdin
	@echo "✅ Logged in"

# Build images if Dockerfiles or sources change
$(BUILD_STAMP): $(DOCKERFILES) $(SOURCES)
	@files=($(DOCKERFILES)); \
	images=($(IMAGES)); \
	count=$${#files[@]}; \
	pids=(); \
	for i in $$(seq 0 $$(($$count - 1))); do \
		echo "🔨 Building $(REGISTRY)/$${images[$$i]}:$(TAG) from $${files[$$i]}"; \
		docker build -f $${files[$$i]} -t $(REGISTRY)/$${images[$$i]}:$(TAG) . & \
		pids+=($$!); \
	done; \
	for pid in $${pids[@]}; do \
		wait $$pid || exit 1; \
	done; \
	echo "✅ All images built"; \
	touch $(BUILD_STAMP)

build: $(BUILD_STAMP)

# Push images if rebuilt
$(PUSH_STAMP): $(BUILD_STAMP)
	@pids=(); \
	for image in $(IMAGES); do \
		echo "📤 Pushing $(REGISTRY)/$$image:$(TAG)"; \
		docker push $(REGISTRY)/$$image:$(TAG) & \
		pids+=($$!); \
	done; \
	for pid in $${pids[@]}; do \
		wait $$pid || exit 1; \
	done
	@echo "✅ All images pushed"
	@touch $(PUSH_STAMP)

push: $(PUSH_STAMP)

# Run containers
run:
	@echo "🚀 Starting services..."
	@docker compose -f docker-compose.yaml -f docker-compose.observability.yml up -d
	@echo "✅ Services running"

# Stop containers
down:
	@echo "🛑 Stopping services..."
	@docker compose -f docker-compose.yaml -f docker-compose.observability.yml down
	@echo "✅ Services stopped"

# Clean stamp files
clean:
	@echo "🧹 Cleaning stamps..."
	@rm -f $(BUILD_STAMP) $(PUSH_STAMP)
	@echo "✅ Cleaned"

# Force rebuild + push + run
rebuild: clean all

# Show build/push status
status:
	@echo "📊 Build Status:"
	@if [ -f $(BUILD_STAMP) ]; then \
		echo "  ✅ Last build: $$(stat -f '%Sm' $(BUILD_STAMP) 2>/dev/null || stat -c '%y' $(BUILD_STAMP) 2>/dev/null)"; \
	else \
		echo "  ❌ No build stamp found"; \
	fi
	@if [ -f $(PUSH_STAMP) ]; then \
		echo "  ✅ Last push:  $$(stat -f '%Sm' $(PUSH_STAMP) 2>/dev/null || stat -c '%y' $(PUSH_STAMP) 2>/dev/null)"; \
	else \
		echo "  ❌ No push stamp found"; \
	fi

# Tail logs
logs:
	@docker compose -f docker-compose.yaml -f docker-compose.observability.yml logs -f