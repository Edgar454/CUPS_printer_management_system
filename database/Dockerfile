FROM postgres:18-alpine

RUN apk add --no-cache postgresql-pg_cron && \
    cp /usr/lib/postgresql18/pg_cron.so /usr/local/lib/postgresql/ && \
    cp /usr/share/postgresql18/extension/* /usr/local/share/postgresql/extension

COPY init_scripts /docker-entrypoint-initdb.d


