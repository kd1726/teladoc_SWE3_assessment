#!/usr/bin/env bash
set -e

echo "Building Services..."
docker compose up --build -d

echo "Waiting for backend to be ready..."
until docker exec backend python -c "import requests" 2>/dev/null || docker exec backend echo "alive" 2>/dev/null; do
  sleep 2
done
sleep 5

echo "Seeding the database..."
docker exec backend python seed.py

echo "Done! App is running at http://localhost"

echo " If you want to use a regular tenant, you can use the following credentials:
Username: tenant1 -- or any other tenant (tenant1, tenant2, tenant3, tenant4, tenant5)
Password: password123 -- or any other password (password123, password123, password123, password123, password123)

If you want to use the admin account, you can use the following credentials:
Username: admin
Password: admin_password
"
