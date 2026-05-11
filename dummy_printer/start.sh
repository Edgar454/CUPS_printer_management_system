#!/bin/sh
set -e

echo "Cleaning stale PID files..."
rm -f /run/dbus/pid
rm -f /run/avahi-daemon/pid

# disable IPv6 BEFORE starting avahi
echo "Disabling IPv6 in avahi config..."
sed -i 's/#host-name=foo/host-name=dummy_printer/' /etc/avahi/avahi-daemon.conf
sed -i 's/use-ipv6=yes/use-ipv6=no/' /etc/avahi/avahi-daemon.conf

echo "Starting dbus..."
service dbus start

echo "Starting avahi..."
avahi-daemon --daemonize --no-chroot -D

echo "Starting IPP printer..."
exec  ippeveprinter -p 8631 -d /jobs -f "application/pdf,application/octet-stream" laser
