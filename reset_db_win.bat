SET DEST_DIR=c:\herochef\.dump
SET DB_PATH=c:\herochef\.meteor\local\db
SET JOURNAL_DIR=c:\herochef\.meteor\local\db\journal
SET DUMP_PARAM=d

SET MONGO_USER=admin
SET MONGO_PASSWORD=djf2i3rfjkweh
SET MONGO_DOMAIN=ds027744.mongolab.com:27744
SET MONGO_DB=heroku_5dd8c4xw


if NOT %1 == %DUMP_PARAM% (
  echo Making remote database dump...
  del /s /q /f %DEST_DIR%
  mongodump -u %MONGO_USER% -h %MONGO_DOMAIN% -d %MONGO_DB% -p %MONGO_PASSWORD% -o %DEST_DIR%
)

start meteor reset

timeout 5

mkdir .meteor\local
mkdir .meteor\local\db

echo Starting local database...

start mongod --dbpath %DB_PATH% --storageEngine mmapv1

timeout 5

mongorestore --host=127.0.0.1 --port=27017 --db=meteor --drop  %DEST_DIR%/%MONGO_DB%

taskkill /f /im mongod.exe

del /s /q /f %JOURNAL_DIR%

echo
echo Congratulaitons! Your database is restored.