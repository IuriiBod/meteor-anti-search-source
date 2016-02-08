Package.describe({
  name: 'jss:reactive-fullcalendar',
  summary: "Meteor Reactive - Full-sized drag & drop event calendar (jQuery plugin - v2.1.1)",
  version: "1.1.0",
  git: "https://github.com/alonoslav/meteor-reactive-fullcalendar.git"
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.0');
  api.use('reactive-var', 'client');
  api.use('templating', 'client');
  api.addFiles([
    'fullcalendar.min.js',
    'fullcalendar.min.css',
    'lang-all.js',
    'gcal.js',
    'scheduler.min.css',
    'scheduler.min.js',
    'reactive-fullcalendar.js',
    'reactive-fullcalendar-template.html',
    'reactive-fullcalendar-template.js'
  ], 'client');
});
