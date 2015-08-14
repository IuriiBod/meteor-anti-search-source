Template.switchUser.events({
  "keyup .select2-input": function (event) {
    FlowComponents.callAction("findUser", event.target.value);
  },
  "change #userPicker": function (event) {
    // TODO: Fix this ugly solution when will be possible set the value for select2 option
    var username = event.target.value;
    var user = Meteor.users.findOne({username: username});
    FlowComponents.callAction("switchUser", user._id);
  },
  "click .other-user": function () {
    FlowComponents.callAction("logout");
  }
});

Template.switchUser.helpers({
  contains: function (container, value) {
    var contains = true;
    if (_.isString(container) && _.isString(value) && value.length) {
      value = value.toLowerCase();
      container = container.toLowerCase();
      contains = container.indexOf(value) !== -1;
    }
    return contains;
  }
});