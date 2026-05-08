FROM postgres:18-alpine

RUN apk add --no-cache postgresql-pg_cron && \
    cp /usr/lib/postgresql18/pg_cron.so /usr/local/lib/postgresql/ && \
    cp /usr/share/postgresql18/extension/* /usr/local/share/postgresql/extension

COPY database/init_scripts /docker-entrypoint-initdb.d
COPY database/config/postgresql.conf /etc/postgresql/postgresql.conf
COPY database/config/pg_hba.conf /etc/postgresql/pg_hba.conf

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf", "-c", "hba_file=/etc/postgresql/pg_hba.conf"]


