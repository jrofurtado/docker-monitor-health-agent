# docker-monitor-health-agent
Docker agent to collect health status of docker containers and send them to centralized monitoring running jrofurtado/docker-monitor-health-server

*docker-compose.yml*
~~~~
agent:
    image: jrofurtado/docker-monitor-health-agent:latest
    restart: always
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - DOCKER_API_VERSION=v1.40
      - APP_NAME=myapp
      - COLLECT_STATS=false
      - MONITORING_URL=https://myserver.com/api/message
      - MONITORING_DELAY=30
~~~~

# Environment variables

* KEY - App key you get when adding the App to the central monitoring container running docker-monitor-health-server
* DOCKER_API_VERSION default "v1.40" - Docker API version
* APP_NAME default "undefined" - Application name
* COLLECT_STATS default "false" - Also collect docker stats like cpu and memory for each container
* MONITORING_URL - Obligatory. URL of the centralized monitoring server running docker-monitor-health-server 
* MONITORING_DELAY default 30 - number of seconds for the interval between collecting and sending data
