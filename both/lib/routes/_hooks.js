var requireLogIn = function () {
  if (Meteor.userId()) {
    var user = Meteor.user();

    if (user.relations && user.relations.organizationId) {
      if(user.currentAreaId && Areas.findOne({_id: user.currentAreaId, archived:{$ne:"true"}})){
        return this.next();
      }else{
        Router.go("home");
        return this.next();
      }

    } else {
      if (Organizations.findOne({owner: Meteor.userId()})) {
        return this.next();
      } else {
        Router.go('createOrganization');
        return this.next();
      }
    }
  } else {
    Router.go('signIn');
    return this.next();
  }
};

Router.onBeforeAction(requireLogIn, {except: ['signIn', 'signUp', 'invitationAccept', 'switchUser']});