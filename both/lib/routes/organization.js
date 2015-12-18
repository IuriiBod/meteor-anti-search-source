Router.route('/createOrganization', {
  name: "createOrganization",
  template: "createOrganization",
  onBeforeAction: function () {
    if (Meteor.userId() && Organizations.findOne({owner: Meteor.userId()})) {
      Router.go('dashboard');
    } else {
      this.next();
    }
  }
});