#!/usr/bin/env bash
DEST_DIR="./.dump"
MONGO_USER="admin"
MONGO_PASSWORD="djf2i3rfjkweh"
MONGO_DOMAIN="ds027744.mongolab.com:27744"
MONGO_DB="heroku_5dd8c4xw"

meteor reset

#run app without migrations
export DATABASE_IMPORT_MODE=1
meteor --port 9999 --settings ./.mupx-deploy/settings.json & sleep 40

mongorestore --db meteor -h localhost --port 10000 --drop  "${DEST_DIR}/${MONGO_DB}"
kill $!
echo "\nDone. Press any key to exit... "
read key