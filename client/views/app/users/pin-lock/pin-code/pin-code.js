console.log('pincode file');

Template.pinCode.onCreated(function () {
  var userId = Router.current().params.userId;
  this.set('userId', userId);
  this.set('backwardUrl', this.data.backwardUrl);
});

Template.pinCode.onRendered(function () {
  this.$("input#pin-code").focus();
});

Template.pinCode.events({
  "submit form": function (event, tmpl) {
    event.preventDefault();
    var backwardUrl = tmpl.get("backwardUrl") || '/';
    var userId = tmpl.get('userId');
    var pinCode = tmpl.find("#pin-code").value;

    Meteor.call("inputPinCode", userId, pinCode, HospoHero.handleMethodResult(function () {
      var loggedUsers = Session.get("loggedUsers");
      var token = loggedUsers[userId];
      Meteor.loginWithToken(token, HospoHero.handleMethodResult(function () {
        Router.go(backwardUrl);
      }));
    }));
  },

  "click #switch-user": function (event) {
    event.preventDefault();
    Router.go('switchUser');
  }
});