FROM olbat/cupsd:latest

USER root

RUN apt-get update && \
    apt-get install -y printer-driver-cups-pdf curl && \
    rm -rf /var/lib/apt/lists/*
 

COPY cups_server/setup.sh /setup.sh
RUN chmod +x /setup.sh

RUN useradd -m apiuser \
 && echo "apiuser:strongpass" | chpasswd \
 && usermod -aG lpadmin apiuser
 
COPY cups_server/cupsd.conf /etc/cups/cupsd.conf

RUN mkdir -p /var/spool/cups-pdf && \
    chmod 777 /var/spool/cups-pdf

