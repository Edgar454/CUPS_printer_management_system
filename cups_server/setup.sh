#!/bin/sh
set -e

# wait for cups daemon
until lpstat -r >/dev/null 2>&1; do
  echo "Waiting for CUPS..."
  sleep 1
done

# enable remote access
cupsctl --share-printers
cupsctl --remote-any

# CREATE printer if missing (this is the missing piece)
if ! lpstat -p PDF >/dev/null 2>&1; then
  echo "Creating PDF printer..."

  lpadmin -p PDF -E -v cups-pdf:/ -m raw
fi

# configure it (always safe)
echo "Configuring PDF printer..."
lpadmin -p PDF -o printer-is-shared=true
cupsenable PDF
cupsaccept PDF

echo "CUPS setup completed"