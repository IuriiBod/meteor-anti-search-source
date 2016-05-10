#!/bin/bash

#
# Arguments
# -d use previously created dump
# -s <server_type>
# -p prevent password reset for admin
#

DEST_DIR="./.dump"
DB_PATH=$(pwd)/.meteor/local/db
DB_WAIT_TIME=10

LOCAL_DB_PORT=3000
LOCAL_DB_HOST=127.0.0.1
LOCAL_DB_NAME=meteor

# PASSWORD: qweqweqwe
read -d '' RESET_ADMIN_SCRIPT <<"JS_SCRIPT"
var meteorDb = db.getSiblingDB('meteor');
meteorDb.users.update({'emails.address': 'tom@hospohero.com'}, {$set: {'services.password.bcrypt': '$2a$10$q3hxdkZXLsRCQZcj00oOa.8NLSkXDw958G3zkwGPzp/v.Ezphv0T2'}});
JS_SCRIPT

#credentials

testingDbCredentials() {
  echo "Selected TESTING DB";
  MONGO_USER="heroku_hs84b9x2"
  MONGO_PASSWORD="2roa8aitcd29rlm9fkukvs6b2s"
  MONGO_DOMAIN="ds013041-a0.mlab.com:13041"
  MONGO_DB="heroku_hs84b9x2"
}

productionDbCredentials() {
  echo "Selected PRODUCTION DB";
  MONGO_USER="cloudninja"
  MONGO_PASSWORD="Bertaroo1"
  MONGO_DOMAIN="c144.capital.3.mongolayer.com:10144"
  MONGO_DB="herochef"
}


#parse script arguments
while [[ "$#" -gt 0 ]]; do
  key="$1"

  case $key in
    -p|--prevent-password-reset)
    echo "Prevent password reset: YES"
    PREVENT_PASSWORD_RESET="YES"
    ;;
    -d|--dump)
    echo "Use dump: YES"
    USE_DUMP="YES"
    ;;
    -s|--server)
    SERVER_TYPE="$2"
    shift # past value argument
    ;;
    *)
      echo "Unknown option ${1}"      # unknown option
      exit 1
    ;;
  esac

  shift # past argument or value
done

# set up server credentials
case "${SERVER_TYPE}" in
  "testing")
    testingDbCredentials
    ;;
  "production")
    productionDbCredentials
    ;;
  *)
    testingDbCredentials
    ;;
esac


if [[ "${USE_DUMP}" != "YES" ]]; then
  # refresh dump
  echo "Making remote database dump..."
  rm -rf "${DEST_DIR}"
  mongodump -u "${MONGO_USER}" -h "${MONGO_DOMAIN}" -d "${MONGO_DB}" -p "${MONGO_PASSWORD}" -o "${DEST_DIR}"
fi

#remove old database instead of `meteor reset`
rm -rf .meteor/local/db
mkdir .meteor/local .meteor/local/db

echo "Starting local database ..."
mongod --dbpath="${DB_PATH}" --port="${LOCAL_DB_PORT}" --storageEngine=mmapv1 --nojournal > /dev/null & sleep ${DB_WAIT_TIME}

mongorestore --host=${LOCAL_DB_HOST} --port=${LOCAL_DB_PORT} --db=${LOCAL_DB_NAME} --drop  "${DEST_DIR}/${MONGO_DB}"

if [[ "${PREVENT_PASSWORD_RESET}" != "YES" ]]; then
  #reset admin password
  echo "Reset admin password ..."
  mongo  --host=${LOCAL_DB_HOST} --port=${LOCAL_DB_PORT} --eval "${RESET_ADMIN_SCRIPT}"
fi

kill $! #kill db server

echo
echo "Congratulaitons! Your database is restored."