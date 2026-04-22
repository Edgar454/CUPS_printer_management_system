FROM olbat/cupsd:latest

USER root

RUN apt-get update && \
    apt-get install -y printer-driver-cups-pdf curl && \
    rm -rf /var/lib/apt/lists/*
 

COPY cups_server/setup.sh /setup.sh
RUN chmod +x /setup.sh

RUN mkdir -p /var/spool/cups-pdf && \
    chmod 777 /var/spool/cups-pdf

