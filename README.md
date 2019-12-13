# docker-monitor-health-agent
Docker agent to collect health status of docker containers and send them to centralized monitoring

#ENVIRONMENT VARIABLES

* DOCKER_API_VERSION default "v1.40" - Docker API version

* APP_NAME default "undefined" - Application name

* COLLECT_STATS default "false" - Also collect docker stats like cpu and memory for each container

* MONITORING_HOST - Obligatory. Hostname of the centralized monitoring server

* MONITORING_DELAY default 30 - number of seconds for the interval between collecting and sending data
