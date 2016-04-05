Router.route('applications', {
  path: '/applications',
  template: 'applicationsList',

  waitOn () {
    return  [
      Meteor.subscribe('applicationDefinitions'),
      Meteor.subscribe('applications')
    ];
  },

  data () {
    return {
      positions: Positions.find()
    };
  }
});


Router.route('/application-details/:id', {
  name: 'applicationDetails',

  waitOn () {
    return Meteor.subscribe('application', this.params.id);
  },

  data () {
    let application = Applications.findOne({_id: this.params.id});

    if (application) {
      let applicationSchema = ApplicationDefinitions.findOne({
        organizationId: application.organizationId
      });

      return {
        application: application,
        applicationSchema: applicationSchema
      };
    }
  }
});


Router.route('recruitmentForm', {
  path: '/recruitment-form/:_id',
  template: 'recruitmentForm',
  layoutTemplate: 'recruitmentLayout',
  waitOn () {
    return Meteor.subscribe('applicationDefinitionsByOrganization', this.params._id);
  },
  onBeforeAction(){
    if (!ApplicationDefinitions.findOne({organizationId: this.params._id}) ||
      !Positions.findOne() || !Organizations.findOne({ _id: this.params._id})) {
      this.render('notFound');
    } else {
      this.next();
    }
  },
  data () {
    return {
      applicationDefinition: ApplicationDefinitions.findOne({organizationId: this.params._id}),
      organization:Organizations.findOne({ _id: this.params._id})
    };
  }
});