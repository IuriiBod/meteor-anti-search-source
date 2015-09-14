// TODO: Move to the HospoHero object
Meteor.startup(function () {
  window.alert = function (message) {
    sweetAlert("Error!", message, "error");
  };

  window.alertSuccess = function (message) {
    sweetAlert("Success!", message, "success");
  };

  window.notification = function (message) {
    sweetAlert("Info!", message, "info");
  }
});