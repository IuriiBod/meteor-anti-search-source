Template.profileHeaderTitle.onCreated(function () {
  this.subscribe('areaUsersList', HospoHero.getCurrentAreaId());
});


Template.profileHeaderTitle.onRendered(function () {
  let userSelectElement = this.$('.user-profile-select');
  userSelectElement.select2({
    width: '100%'
  });

  userSelectElement.select2('val', this.data._id);
});


Template.profileHeaderTitle.helpers({
  users () {
    return Meteor.users.find({}, {
      sort: {'profile.fullName': 1}
    });
  },

  isMeIndicator() {
    return Meteor.userId() === this._id && '(me)';
  }
});


Template.profileHeaderTitle.events({
  'change .user-profile-select': function (event, tmpl) {
    let selectedUserId = tmpl.$('.user-profile-select').val();
    if (selectedUserId !== tmpl.data._id) {
      Router.go('profile', {_id: selectedUserId});
    }
  }
});


Template.profileHeaderTitle.onDestroyed(function () {
  this.$('.user-profile-select').select2('destroy');
});
