Template.searchUserInfo.helpers({
  userEmail: function () {
    return this.emails && this.emails[0].address;
  }
});
