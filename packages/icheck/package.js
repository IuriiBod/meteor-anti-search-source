Package.describe({
  name: 'fronteed:icheck',
  version: '1.0.2',
  summary: 'Highly customizable checkboxes and radio buttons',
  git: 'https://github.com/fronteed/icheck',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2');
  api.use(['jquery'], 'client');
  api.addFiles(['icheck.js', 'custom.css'], 'client');
  api.addAssets(['green.png', 'green@2x.png'], 'client');
});

