#!/usr/bin/env bash

#
# Run this script with "d" argument if you want to refresh dump before restore
#

DEST_DIR="./.dump"
DB_PATH=$(pwd)/.meteor/local/db

#credentials
MONGO_USER="admin"
MONGO_PASSWORD="djf2i3rfjkweh"
MONGO_DOMAIN="ds027744.mongolab.com:27744"
MONGO_DB="heroku_5dd8c4xw"

if [[ $1 != "d" ]]; then
  # refresh dump
  echo "Making remote database dump..."
  rm -rf "${DEST_DIR}"
  mongodump -u "${MONGO_USER}" -h "${MONGO_DOMAIN}" -d "${MONGO_DB}" -p "${MONGO_PASSWORD}" -o "${DEST_DIR}"
fi


meteor reset

mkdir .meteor/local .meteor/local/db

echo "Starting local database ..."

mongod --dbpath "${DB_PATH}" --storageEngine mmapv1 > /dev/null & sleep 5

mongorestore --host=127.0.0.1 --port=27017 --db=meteor --drop  "${DEST_DIR}/${MONGO_DB}"

kill $! #kill db server

echo
echo "Import finished. Press any key to exit... "