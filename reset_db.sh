#!/usr/bin/env bash
DEST_DIR="./.dump"
MONGO_USER="admin"
MONGO_PASSWORD="djf2i3rfjkweh"
MONGO_DOMAIN="ds027744.mongolab.com:27744"
MONGO_DB="heroku_5dd8c4xw"

rm -rf "${DEST_DIR}"
mongodump -u "${MONGO_USER}" -h "${MONGO_DOMAIN}" -d "${MONGO_DB}" -p "${MONGO_PASSWORD}" -o "${DEST_DIR}"
meteor reset

#run app without migrations
export DATABASE_IMPORT_MODE=1
meteor --port 9999 --settings ./.mupx-deploy/settings.json & sleep 30

mongorestore --db meteor -h localhost --port 10000 --drop  "${DEST_DIR}/${MONGO_DB}"
kill $!
echo "\nDone. Press any key to exit... "
read key