#!/usr/bin/env bash
SETTINGS_PATH=./.mupx-deploy/settings-dev.json

case "$2" in
  "staging")
    SERVER_URL=https://hospohero.herokuapp.com
    ;;
  "testing")
    SERVER_URL=https://hospoherotesting.herokuapp.com
    ;;
  *)
    SERVER_URL=http://192.168.1.101:3000
    ;;
esac

case "$1" in
  "android")
    echo "Staring Android app on ${SERVER_URL}"
    meteor run android-device --settings ${SETTINGS_PATH} --mobile-server ${SERVER_URL}
    ;;
  "ios")
    echo "Staring iOS app on ${SERVER_URL}"
    meteor run ios-device --settings ${SETTINGS_PATH} --mobile-server ${SERVER_URL}
    ;;
  *)
    echo "Starting browser app only on localhost:3000"
    meteor run --settings ${SETTINGS_PATH}
    ;;
esac