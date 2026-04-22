#!/bin/sh
set -e

echo "Waiting for CUPS HTTP..."
until curl -s http://localhost:631 >/dev/null 2>&1; do
  sleep 1
done

echo "Waiting for CUPS to fully initialize..."
sleep 5

echo "Configuring CUPS..."
cupsctl --share-printers || true
cupsctl --remote-any || true

# Remove old printer if it exists
lpadmin -x PDF 2>/dev/null || true
sleep 1

echo "Creating PDF printer..."
lpadmin -p PDF -E -v cups-pdf:/ -m drv:///sample.drv/generic.ppd

echo "Enabling printer..."
lpadmin -p PDF -o printer-is-shared=true || true
cupsenable PDF || true
cupsaccept PDF || true

echo "Verifying setup..."
lpstat -v

echo "CUPS setup completed"