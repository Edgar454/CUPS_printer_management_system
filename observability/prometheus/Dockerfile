FROM prom/prometheus:v3.1.0
COPY observability/prometheus/prometheus.yml /etc/prometheus/prometheus.yml
CMD ["--config.file=/etc/prometheus/prometheus.yml", \
     "--web.enable-remote-write-receiver"]