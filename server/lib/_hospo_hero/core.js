Namespace('HospoHero', {
  isDatabaseImportMode: function () {
    //process.env.NO_MIGRATION - flag that enables run app without migrations
    return !!process.env.DATABASE_IMPORT_MODE;
  },

  isProductionMode: function () {
    return process.env.ROOT_URL.indexOf('app.hospohero.com') > -1;
  },

  isTestingMode: function () {
    return !HospoHero.isDevelopmentMode() && !HospoHero.isProductionMode();
  },

  isDevelopmentMode: function () {
    return process.env.NODE_ENV === 'development'
    // environment user check:
    // prevents loading mock data while migrating on local machine
    //&& process.env.USER !== 'taras';
  }
});