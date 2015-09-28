if (process.env.ROOT_URL == 'http://herochef-test.meteor.com') {
  process.env.NODE_ENV = "development";
  delete process.env.MAIL_URL;
}