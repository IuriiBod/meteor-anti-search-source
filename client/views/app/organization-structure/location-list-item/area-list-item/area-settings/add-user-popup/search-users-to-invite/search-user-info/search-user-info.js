Template.searchUserInfo.helpers({
  userEmail: function () {
    return this.user && this.user.emails && this.user.emails[0].address;
  },

  isRemovingUser: function () {
    return this.removeUser || false;
  }
});

Template.searchUserInfo.events({
  'click .search-user-info-content': function (event, tmpl) {
    event.preventDefault();
    tmpl.data.onUserSelect(tmpl.data.user);
  }
});
