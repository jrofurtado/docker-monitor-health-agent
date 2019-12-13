#!/bin/bash
set -e
COLLECT_DOCKER_INFO='true'
COLLECT_DOCKER_STATS='true'
CONTAINERS=$(curl --unix-socket /var/run/docker.sock http://localhost/v1.40/containers/json)






















CONTAINERS=$(docker ps -a --format '{{json .}}')
CONTAINERS=$(printf '%s' "$CONTAINERS" | tr '\n' ', ')
CONTAINERS_HEALTHY=$(docker ps -a --format '{{json .Names}}' --filter 'health=healthy')
CONTAINERS_HEALTHY=$(printf '%s' "$CONTAINERS_HEALTHY" | tr '\n' ', ')
CONTAINERS_STARTING=$(docker ps -a --format '{{json .Names}}' --filter 'health=starting')
CONTAINERS_STARTING=$(printf '%s' "$CONTAINERS_STARTING" | tr '\n' ', ')
MESSAGE="{"
MESSAGE="$MESSAGE\"containers\": [$CONTAINERS]"
MESSAGE="$MESSAGE, \"containers_healthy\": [$CONTAINERS_HEALTHY]"
MESSAGE="$MESSAGE, \"containers_starting\": [$CONTAINERS_STARTING]"
if [ "true" = "$COLLECT_DOCKER_INFO" ]
then
  DOCKER_INFO=$(docker info --format '{{json .}}')
  MESSAGE="$MESSAGE, \"dockerInfo\": $DOCKER_INFO"
fi
if [ "true" = "$COLLECT_DOCKER_STATS" ]
then
  DOCKER_STATS=$(docker stats -a --no-stream --format '{{json .}}')
  DOCKER_STATS=$(printf '%s' "$DOCKER_STATS" | tr '\n' ', ')
  MESSAGE="$MESSAGE, \"dockerStats\": [$DOCKER_STATS]"
fi
MESSAGE=$MESSAGE"}"

echo $MESSAGE
