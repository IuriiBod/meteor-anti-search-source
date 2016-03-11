#!/usr/bin/env bash

#
# Run this script with "d" argument if you want to refresh dump before restore
#

DEST_DIR="./.dump"
DB_PATH=$(pwd)/.meteor/local/db

#credentials

#testing
MONGO_USER="admin"
MONGO_PASSWORD="djf2i3rfjkweh"
MONGO_DOMAIN="ds027744.mongolab.com:27744"
MONGO_DB="heroku_5dd8c4xw"

#production
#MONGO_USER="cloudninja"
#MONGO_PASSWORD="Bertaroo1"
#MONGO_DOMAIN="c144.capital.3.mongolayer.com:10144"
#MONGO_DB="herochef"

if [[ $OSTYPE == "darwin14" ]]; then # mac os x
  echo Using configuration for Mac OS X
  DB_WAIT_TIME=10
else
  echo Using configuration for Linux
  DB_WAIT_TIME=30
fi

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
mongod --dbpath="${DB_PATH}" --port=3000 --storageEngine=mmapv1 > /dev/null & sleep ${DB_WAIT_TIME}

mongorestore --host=127.0.0.1 --port=3000 --db=meteor --drop  "${DEST_DIR}/${MONGO_DB}"

kill $! #kill db server

echo
echo "Congratulaitons! Your database is restored."