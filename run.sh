#!/usr/bin/env bash
SETTINGS_PATH=./.mupx-deploy/settings-dev.json
LOCALHOST_URL="localhost:3000"

case "$2" in
  "staging")
    SERVER_URL=https://hospohero.herokuapp.com
    ;;
  "testing")
    SERVER_URL=https://hospoherotesting.herokuapp.com
    ;;
  *)
    SERVER_URL="${LOCALHOST_URL}"
    ;;
esac

if [ "${SERVER_URL}" != "${LOCALHOST_URL}" ]; then
   MOBILE_SERVER_ARG="--mobile-server ${SERVER_URL}"
else
   MOBILE_SERVER_ARG=""
fi


case "$1" in
  "android")
    echo "Staring Android app on ${SERVER_URL}"
    meteor run android-device --settings ${SETTINGS_PATH} ${MOBILE_SERVER_ARG}
    ;;
  "ios")
    echo "Staring iOS app on ${SERVER_URL}"
    meteor run ios-device --settings ${SETTINGS_PATH} ${MOBILE_SERVER_ARG}
    ;;
  *)
    echo "Starting browser app only on ${LOCALHOST_URL}"
    meteor run --settings ${SETTINGS_PATH}
    ;;
esac