Package.describe({
  name: 'jss:suncalc',
  version: '0.0.1',
  summary: 'A tiny JavaScript library for calculating sun/moon positions and phases.',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles('suncalc.js', 'server');
  api.export('SunCalc', 'server');
});

Npm.depends({
  "suncalc": "1.7.0"
});
