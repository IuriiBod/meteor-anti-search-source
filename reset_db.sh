#!/usr/bin/env bash

#
# Run this script with "d" argument if you want to refresh dump before restore
#

DEST_DIR="./.dump"
DB_PATH=$(pwd)/.meteor/local/db
DB_WAIT_TIME=10

#credentials

#testing
#mongodb://heroku_hs84b9x2:2roa8aitcd29rlm9fkukvs6b2s@ds013041-a0.mlab.com:13041,ds013041-a1.mlab.com:13041/heroku_hs84b9x2?replicaSet=rs-ds013041
MONGO_USER="heroku_hs84b9x2"
MONGO_PASSWORD="2roa8aitcd29rlm9fkukvs6b2s"
MONGO_DOMAIN="ds013041-a0.mlab.com:13041"
MONGO_DB="heroku_hs84b9x2"

#production
#MONGO_USER="cloudninja"
#MONGO_PASSWORD="Bertaroo1"
#MONGO_DOMAIN="c144.capital.3.mongolayer.com:10144"
#MONGO_DB="herochef"


if [[ $1 != "d" ]]; then
  # refresh dump
  echo "Making remote database dump..."
  rm -rf "${DEST_DIR}"
  mongodump -u "${MONGO_USER}" -h "${MONGO_DOMAIN}" -d "${MONGO_DB}" -p "${MONGO_PASSWORD}" -o "${DEST_DIR}"
fi

#remove old database instead of `meteor reset`
rm -rf .meteor/local/db
mkdir .meteor/local .meteor/local/db

echo "Starting local database ..."
mongod --dbpath="${DB_PATH}" --port=3000 --storageEngine=mmapv1 --nojournal > /dev/null & sleep ${DB_WAIT_TIME}

mongorestore --host=127.0.0.1 --port=3000 --db=meteor --drop  "${DEST_DIR}/${MONGO_DB}"

kill $! #kill db server

echo
echo "Congratulaitons! Your database is restored."