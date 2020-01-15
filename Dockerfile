FROM docker:19.03.5

CMD /entrypoint.sh
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD node /healthcheck.js
RUN apk add --no-cache nodejs
ENV KEY=""
ENV DOCKER_API_VERSION="v1.40"
ENV APP_NAME="undefined"
ENV COLLECT_STATS=false
ENV MONITORING_URL=""
ENV MONITORING_DELAY=30
COPY files/ /
