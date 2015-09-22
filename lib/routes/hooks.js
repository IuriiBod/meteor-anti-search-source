var checkUser = function() {
  var user = Meteor.user();
  if(user) {
    if(user.relations && user.relations.organizationId) {
      this.next();
    } else {
      var adminRole = Meteor.roles.findOne({name: 'Admin'});
      if(user.roles && user.roles.defaultRole) {
        if(user.roles.defaultRole == adminRole._id) {
          this.next();
        } else {
          Meteor.logout();
          Router.go('signIn');
          this.stop();
        }
      }
    }
  } else {
    Router.go('signIn');
    this.next();
  }
};

Router.onBeforeAction(checkUser, { except: ['signIn', 'signUp', 'invitationAccept', 'switchUser'] });