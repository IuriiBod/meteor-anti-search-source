Router.route('/interviews', {
  name: 'interviews',
  template: 'interviews',

  waitOn () {
    return Meteor.subscribe('interviews');
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
    let application = Applications.findOne({_id: interview.applicationId});

    return {
      id: id,
      interview: interview,
      application: application
    };
  }
});