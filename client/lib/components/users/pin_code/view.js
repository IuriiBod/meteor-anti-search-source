Template.pinCode.onRendered(function() {
  this.$("input#pin-code").focus();
});

Template.pinCode.events({
  "submit form": function (event) {
    event.preventDefault();
    var pinCode = Template.instance().find("#pin-code").value;
    FlowComponents.callAction("inputPinCode", pinCode);
  },
  "click #switch-user": function (event) {
    event.preventDefault();
    FlowComponents.callAction("switchUser");
  }
});