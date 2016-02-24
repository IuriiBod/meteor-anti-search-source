Template.searchUserInfo.helpers({
  userEmail: function () {
    return this.user.emails && this.user.emails[0].address;
  },

  isRemovingUser: function () {
    return this.removeUser || false;
  }
});
