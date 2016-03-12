Package.describe({
  name: 'jss:sweetalert',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'A beautiful replacement for JavaScript\'s \"alert\".',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@0.9.1.1");

  api.add_files([
    'dist/sweetalert.css',
    'dist/sweetalert-dev.js'
  ], ['client']);

  if(api.export){

  }
})