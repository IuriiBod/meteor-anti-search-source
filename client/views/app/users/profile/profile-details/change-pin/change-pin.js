Template.profileChangePin.events({
  'submit form#change-pin': function (event) {
    event.preventDefault();
    var newPin = Template.instance().find("#new-pin").value;
    Meteor.call("changePinCode", newPin, HospoHero.handleMethodResult(function () {
      HospoHero.info("PIN has been changed");
    }));
  }
});