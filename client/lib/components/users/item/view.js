Template.userDetailed.events({
  'click .archiveUser': function (event) {
    event.preventDefault();
    var userId = $(event.target).closest("tr").attr("data-id");
    var user = Meteor.users.findOne(userId);

    var state = user.isActive ? 'de-activate' : 'activate';
    var confirmChange = confirm("Are you sure you want to " + state + " this user");
    if (confirmChange) {
      Meteor.call("changeStatus", userId, HospoHero.handleMethodResult());
    }
  },

  'change select[name="roleSelector"]': function (e) {
    var userId = e.target.dataset.id;
    var newRoleId = e.target.value;
    Meteor.call('changeUserRole', userId, newRoleId, HospoHero.handleMethodResult());
  }
});