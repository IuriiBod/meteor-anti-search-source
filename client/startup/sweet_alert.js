Meteor.startup(function () {
  window.alert = function (message) {
    sweetAlert("Error!", message, "error");
  }
});
