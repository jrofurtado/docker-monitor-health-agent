#/bin/sh
while true
do
  node send-info.js
  sleep $MONITORING_DELAY
done
