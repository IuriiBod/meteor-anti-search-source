# HospoHero

## Importing database

```
$ ./init_db.sh
```

## Starting the app

```
$ meteor --settings .mupx-deploy/settings-dev.json
```

## Contribution process

If you started working on new feature or patch, create separate branch for it.

When feature is finished, you should merge your branch with `develop` and create pull request to `develop` branch.

All pull requests should be reviewed by other team member before merging with `develop`.

`develop` branch should be deployed on testing server (`hospoherotesting.herokuapp.com`). After 24 hour in case if new code is stable it can be merged with `master` and deployed on `app.hospohero.com`.
