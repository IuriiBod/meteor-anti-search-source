Router.route('/interviews', {
  name: 'interviews',
  template: 'interviews',

  waitOn () {
    let area = HospoHero.getCurrentArea();

    if (area) {
      return Meteor.subscribe('orgainzationInterviews', area.organizationId);
    }
   }
});

Router.route('/interview-details/:id', {
  name: 'interviewDetails',
  template: 'interviewDetails',

  waitOn () {
    return Meteor.subscribe('interview', this.params.id, Meteor.userId());
  },

  data () {
    let id = this.params.id;
    let interview = Interviews.findOne({_id: id});

    if (interview) {
      let application = Applications.findOne({_id: interview.applicationId});

      return {
        id: id,
        interview: interview,
        application: application
      };
    }
  }
});