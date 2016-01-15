/*
 * This file will be executed last on startup
 */

Meteor.startup(function () {
  HospoHero.LocationScheduler.start();
});

