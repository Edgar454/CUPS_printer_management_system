#!/bin/bash
# ============================================
# init_users.sh
# ============================================
# Description: Update user passwords from environment variables
# Run order: AFTER init_database.sql, init_rbac.sql, seed_assets.sql
# Prerequisites: Users must exist (created by init_rbac.sql)
# ============================================

set -e  # Exit on error

echo "============================================"
echo "Updating user passwords from environment..."
echo "============================================"

# Check required environment variables
REQUIRED_VARS=(
    "API_PASSWORD"
    "WORKER_PASSWORD"
    "POSTGRES_EXPORTER_PASSWORD"
    "GRAFANA_USER_PASSWORD"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "ERROR: Environment variable $var is not set!"
        exit 1
    fi
done

# Connect to database and update passwords
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    -- Update api user
    ALTER USER api_user WITH PASSWORD '$API_PASSWORD';
    -- Update worker user 
    ALTER USER pipeline_worker WITH PASSWORD '$WORKER_PASSWORD';
    -- Update prometheus_exporter user
    ALTER USER postgres_exporter WITH PASSWORD '$POSTGRES_EXPORTER_PASSWORD';
    -- Update grafana_user user
    ALTER USER grafana_user WITH PASSWORD '$GRAFANA_USER_PASSWORD';
EOSQL

echo ""
echo "============================================"
echo "User passwords updated successfully!"
echo "============================================"
echo ""
echo "Users configured:"
echo "  ✓ api user"
echo "  ✓ worker user"
echo "  ✓ prometheus_exporter user"
echo "  ✓ grafana_user user"
echo ""
echo "Database ready for use!"
echo "============================================"