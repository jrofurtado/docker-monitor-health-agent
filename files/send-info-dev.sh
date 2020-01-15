#!/bin/bash
set -e

if [ "$#" -ne 3 ]; then
  echo 'Usage: send-info-dev.sh $APP_NAME $COLLECT_STATS $MONITORING_URL'
  false
fi

export DOCKER_API_VERSION="v1.40"
export APP_NAME="$1"
export COLLECT_STATS="$2"
export MONITORING_URL="$3"
export MONITORING_DELAY=30
export KEY=$(curl -X POST http://localhost:8080/api/app -d "{\"adminPass\": \"admin\", \"appName\":\"$APP_NAME\"}" | jq -r '.key')

node send-info.js
