#!/usr/bin/env bash

SECONDS=0 # Reset $SECONDS; counting of seconds will start from 0(-ish).
isServerRunning=false 
timelimit=60
logFile=$(pwd)/output.txt
searchPattern=$1 # Accepts the search pattern as an argument

while (( SECONDS < timelimit )); do    # Loop until interval has elapsed.
  echo $(tail -n 1 $logFile) | grep -qe "$searchPattern"

  if [ $? == 0 ]; then
      isServerRunning=true;
      break;
  fi

  sleep 1
done

rm $logFile

if [ $isServerRunning = true ]; then
  echo "Server has started"
  exit 0
else
  echo "Server was not able to start"
  exit 1
fi