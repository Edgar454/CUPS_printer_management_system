#!/bin/sh
set -e

echo "[INIT] Setting permissions..."

chown -R root:410 /data
find /data -type f -exec chmod 660 {} \;
find /data -type d -exec chmod 770 {} \;
chmod g+s /data

echo "[INIT] Done"