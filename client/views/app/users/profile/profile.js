Template.profileMainView.helpers({
  pageHeadingTitle: function () {
    return {
      templateName: 'profileHeaderTitle',
      context: this
    };
  },

  pageHeadingCategory: function () {
    return HospoHero.username(this);
  }
});