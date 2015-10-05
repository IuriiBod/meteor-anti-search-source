Router.route('/createOrganization', {
  name: "createOrganization",
  template: "createOrganization",
  waitOn: function () {

  },

  onBeforeAction: function() {
    if(Meteor.userId() && Organizations.findOne({owner: Meteor.userId()})) {
      Router.go('home');
    } else {
      this.next();
    }
  },

  fastRender: true
});