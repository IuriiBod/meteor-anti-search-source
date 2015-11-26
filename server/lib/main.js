/**
 * This file will be executed last on startup
 */
if (!HospoHero.isDatabaseImportMode()) {
  Meteor.startup(function () {
    HospoHero.LocationScheduler.start();
  });
}
