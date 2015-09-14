Meteor.startup(function () {
  window.alert = function (message) {
    sweetAlert("Error!", message, "error");
  },

  window.notification = function (message) {
    sweetAlert("Info!", message, "info");
  }
});
