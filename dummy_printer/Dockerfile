FROM ghcr.io/istopwg/ippsample:master-be55d552edc9bef10a9f9a889b2585f249d343a3-1775838185
RUN mkdir -p /run/dbus
EXPOSE 8631
CMD ["sh", "-c", "dbus-daemon --system --fork && avahi-daemon --daemonize --no-chroot && ippeveprinter -p 8631 -d /jobs \"laser\""]