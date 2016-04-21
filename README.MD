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

## Starting the app

Execute from project's root directory:

```
$ meteor --settings .mupx-deploy/settings-dev.json
```

or simply:

```
$ ./run.sh
```

## Contribution process

In order to contribute to this repository you should follow next steps:

1. Choose unassigned card from Trello's "Backlog" or take already assigned to you card.
2. Move your card into "In progress" column. Read card's description and comments. Based on this information estimate card using [Scrum for Trello](https://chrome.google.com/webstore/detail/scrum-for-trello/jdbcdblgjdpmfninkoogcfpnkjmndgje?hl=en) chrome extension (1 point = 1 hour). 
3. Create new branch based on `develop`. Give you branch name that makes sense (like `roster-timezones-bug`).
4. Start working on your task. If you don't know how to do something, then google it. If you stuck on something for more that 15 minutes, ask your colleagues for help. 
5. When card is finished, review your code and refactor complex/hard to understand parts of it (usually long functions or lines of code).
6. Test all features that was changed/edited/improved by you. Fix all bugs you found. Next, run `./lint.sh` and fix all linter errors.
7. If there are new commits on `develop` merge `develop` to your branch using `--no-ff` flag (see "Merging" section for details).
8. Create pull to `develop`. Put your pull request's url into related card's description.
9. Move your card into Trello's "Review" column and add estimated points using *Scrum for Trello* (see step 2). Someone of your collegues will review\* it. If your pull request was merged go to step #10. If your pull request is closed you should review comments in pull request go to step #1. If you don't understand any comment on your pull request, ask reviewer about it.
10. Congratulations! Your task is done! Go to step 1.

\* All pull requests should be __reviewed__ by other team member before merging with `develop`.


## Merging

Always merge your code with `--no-ff` option, so git will create separate commit for merging and you will be able to review changes after merging on github.

This approach allows to avoid old code appearing in merged version.


## Style Guide

### General recomendations: 

* Use variable's names that makes sense.
* Use `let` and `const` instead of `var`.
* Extract complex logic into separate class.
* Don't use global variables.
* Avoid unovious solutions. If you are using unobvious solution, then you should write a comment that expalins it.
* Don't leave `console.log` or any other __debuging/commented__ code in pull request's code.
* Do not put function into `Namespace` if it only used in 1 or 2 files.
* If your function has more than 15 lines it makes sense to split it on 2 or couple separate functions.
* Use single quotes instead of double (`'my string'` instead of `"my string"`).
* Use `Collection.find({_id: id})` instead of `Collection.find(id)`.
* Write `{someProperty: itsValue}` instead of `{"someProperty": itsValue}` (except cases when property contains dot or other special character like `{'profile.fristname': 'Test'}`).
* Use ES6 string extrapolation (e.g. `"Hello, ${username}!"`) and dynamic attributes (e.g. `{[myPropertyName]: someValue}`).
* If you need to initizlize multiple propertyies of the same object, you should use `_.extend` or `Object.assign` functions.
* IF YOU ARE WORKING WITH UNSATISFIED QUALITY CODE, PELASE, REWRITE IT FOLLOWING THIS GUIDE.

### Client side (Blaze):

* Correct order for Blaze's template configuration methods: `onCreated, onRendered, helpers, events, onDestroyed`.
* Don't use `Session` if you can pass data using template context.
* Don't use global JQuery selectors (use `this.$('.my-element')` instead of `$('.my-element')`).
* Don't use dynamic data attributes (e.g. `data-id="{{_id}}"`)
* Use `this.autorun` and `this.subscribe` (not `Meteor.autorun` and `Meteor.subscribe`) inside template.
* Don't use jquery if you can write the same thing through Blaze.
* Don't use inline styles.
* Always use double quotes inside blaze templates (e.g. `{{> Test some="value"}}`).
* Isolate your styles using LESS's namespacing feature:

```
.my-custom-component{
   ul > li {
     width: 300px;
   }
}
```

### Server side:

* Each argument should be checked using `check(target, Type)` inside all publishers and methods.
* Usually each method or publisher should perform permission checks using `HospoHero.security.PermissionChecker`.
* Use `NotificationSender` to send email/buildin/push notifications.


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

### Servers

* production
* testing
* development [hospohero.herokuapp.com](https://hospohero.herokuapp.com)

#### Configuration

Config files are located at `.mupx-deploy`:
* `settings.json` - testing/production configuration;
* `settings-dev.json` - development configuration (should be used while running app on `localhost`).


### Mobile app

We have Android, iOS support based on Cordova build system. 

#### Mobile app versioning

* __even__ (e.g. 0.1.0, 0.1.2) build for __testing__ server
* __odd__ (e.g. 0.1.1, 0.1.3) build for __production__ server
