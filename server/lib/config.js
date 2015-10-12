MeteorSettings.setDefaults({
  "developmentServers": [
    "http://herochef-test.meteor.com"
  ]
});

//find out we are on development server
if (Meteor.settings.developmentServers.indexOf(process.env.ROOT_URL) > -1) {
  process.env.NODE_ENV = "development";
  delete process.env.MAIL_URL;
}

if(process.env.NODE_ENV == 'production') {
  process.env.MAIL_URL = 'smtp://postmaster%40herochef.com.au:Bertaroo724@smtp.mailgun.org:587/';
}