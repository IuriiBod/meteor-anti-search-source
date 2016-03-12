#!/usr/bin/env bash
SETTINGS_PATH=./.mupx-deploy/settings-dev.json
SERVER_URL=https://hospohero.herokuapp.com

case "$1" in
  "android")
    meteor run android-device --settings ${SETTINGS_PATH}
    ;;
  "ios")
    meteor run ios-device --settings ${SETTINGS_PATH}
    ;;
  "android-testing")
    echo "Start android app with server ${SERVER_URL}"
    meteor run android-device --settings ${SETTINGS_PATH} --mobile-server ${SERVER_URL}
    ;;
  *)
    echo "Start meteor app locally"
    meteor run --settings ${SETTINGS_PATH}
    ;;
esac