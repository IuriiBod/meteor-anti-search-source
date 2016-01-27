Package.describe({
  name: 'jquery-sparkline',
  version: '2.1.2',
  summary: 'This jQuery plugin generates sparklines (small inline charts) directly in the browser using data supplied either inline in the HTML, or via javascript.',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use(['underscore', 'jquery', 'templating'], 'client');
  api.addFiles('jquery.sparkline.min.js', 'client');
});