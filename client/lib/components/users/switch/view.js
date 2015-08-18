Template.switchUser.events({
  "click .other-user": function () {
    FlowComponents.callAction("logout");
  }
});
