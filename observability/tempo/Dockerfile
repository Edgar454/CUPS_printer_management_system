FROM grafana/tempo:2.9.2

COPY observability/tempo/tempo.yaml /etc/tempo.yaml

CMD ["-config.file=/etc/tempo.yaml"]