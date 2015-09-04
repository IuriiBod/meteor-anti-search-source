// process.env.MAIL_URL = 'smtp://postmaster%40herochef.com.au:Bertaroo724@smtp.mailgun.org:587/';
if(process.env.ROOT_URL == 'http://herochef-test.meteor.com') {
  process.env.NODE_ENV = "development";
  delete process.env.MAIL_URL;
}