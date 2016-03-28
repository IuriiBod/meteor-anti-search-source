Namespace('HospoHero', {
  /**
   * This method determinate logging way
   * for Digital Ocean server (it doesn't have
   * internal logging tool)
   *
   * @returns {boolean}
   */
  isProductionServer: function () {
    return process.env.ROOT_URL.indexOf('app.hospohero.com') > -1;
  },

  isDevelopmentMode: function () {
    return process.env.NODE_ENV === 'development'
      // environment user check:
      // prevents loading mock data while migrating on local machine
      && process.env.USER !== 'taras';
  }
});