#!/usr/bin/env bash
DEST_DIR="./.dump"
MONGO_USER="cloudninja"
MONGO_PASSWORD="Bertaroo1"
MONGO_DOMAIN="c144.capital.3.mongolayer.com:10144, c144.capital.2.mongolayer.com:10144"
MONGO_DB="herochef"

rm -rf "${DEST_DIR}"
mongodump -u "${MONGO_USER}" -h "${MONGO_DOMAIN}" -d "${MONGO_DB}" -p "${MONGO_PASSWORD}" -o "${DEST_DIR}"
meteor reset
meteor --port 9999 &
sleep 10
mongorestore --db meteor -h localhost --port 10000 --drop  "${DEST_DIR}/${MONGO_DB}"
kill $!
echo "\nDone. Press any key to exit... "
read key