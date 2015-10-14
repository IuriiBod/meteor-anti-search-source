Template.userDetailed.events({
  'click .archiveUser': function(event) {
    event.preventDefault();
    var userId = $(event.target).closest("tr").attr("data-id");
    var user = Meteor.users.findOne(userId);

    var state = user.isActive ? 'de-activate' : 'activate';
    var confirmChange = confirm("Are you sure you want to " + state + " this user");
    if(confirmChange) {
      Meteor.call("changeStatus", userId, function(err) {
        if(err) {
          HospoHero.error(err);
        }
      });
    }
  },

  'change select[name="roleSelector"]': function(e) {
    var changeRoleMessage = "Do you really want to change the role of the user?";
    if(confirm(changeRoleMessage)) {
      var userId = e.target.dataset.id;
      var newRoleId = e.target.value;
      Meteor.call('changeUserRole', userId, newRoleId, function(err) {
        if(err) {
          HospoHero.error(err);
        }
      });
    }
  }
});