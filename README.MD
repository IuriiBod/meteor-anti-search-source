# HospoHero

## Importing database

In order to import database you need to execute this command inside of project's root directory (requires MongoDB v3.x.x):

```
$ ./reset_db.sh
```

Database dump will be stored in folder `.dump`. So, next time it is possible to restore database from existing dump:

```
$ ./reset_db.sh d
```

This command takes less time (in case if you have existing dump in `.dump` folder).

__Note for Linux users:__ Use `reset_db_linux.sh` instead. 

## Starting the app

```
$ meteor --settings .mupx-deploy/settings-dev.json
```

## Contribution process

If you started working on new feature or patch, create separate branch for it.

When feature is finished, you should merge your branch with `develop` and create pull request to `develop` branch.

All pull requests should be __reviewed__ by other team member before merging with `develop`.


## Merging

Always merge your code with `--no-ff` option, so git will create separate commit for merging and you will be able to review changes after merging on github.

This approach allows to avoid old code appearing in merged version.


## Snapshots

In order to simplify shipping features and fixes to multiple servers and reduce deployment complexity we are using snapshots.

*Snapshot* is set of finished features and fixes that are ready to be deployed on particular server (staging/testing/production).

Each snapshot have appropriate branch in repository. Snapshot branches should be named like:

```
hh-12-21
```

12 is number of month, 21 is date when snapshot was created.

While deploying snapshots next rule should be always true: __you cannot deploy next snapshot until previous ones wasn't deployed.__

### Snapshot patching

Patches are created for snapshots deployed on testing server (if any bugs were found).

Example of applying patch to existing snapshot:

```
# apply patch
$ git checkout hh-12-21
$ git merge --no-ff my-patch # and review changes

# merge patched version with all newer snapshots and develop branch
$ git checkout hh-12-30
$ git merge hh-12-21
....
$ git checkout develop
$ git merge develop
```

*2015/12/30*

