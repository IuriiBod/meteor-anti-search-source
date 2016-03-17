Template.meetingUserInfo.helpers({
  userEmail: function () {
    return HospoHero.utils.getNestedProperty(this.user, 'emails.0.address', false);
  }
});

Template.meetingUserInfo.events({
  'click .search-user-info-content': function (event, tmpl) {
    event.preventDefault();
    tmpl.data.onUserSelect(tmpl.data.user);
  }
});