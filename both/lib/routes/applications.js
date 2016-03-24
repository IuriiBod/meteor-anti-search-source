Router.route('applications', {
  path: '/applications',
  template: 'applicationsList',

  waitOn () {
    let currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('applicationDefinitions', currentAreaId),
      Meteor.subscribe('applications', currentAreaId)
    ];
  },

  data () {
    return {
      positions: Positions.find()
    }
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
        'relations.organizationId': application.relations.organizationId
      });

      return {
        application: application,
        applicationSchema: applicationSchema
      }
    }
  }
});


Router.route('recruitmentForm', {
  path: '/recruitment-form/:organizationId',
  template: 'recruitmentForm',
  layoutTemplate: 'recruitmentLayout',
  waitOn () {
    return [
      Meteor.subscribe('applicationDefinitionsByOrganization', this.params.organizationId)
    ];
  },
  data () {
    return {
      applicationDefinition: ApplicationDefinitions.findOne(),
      organizationId: this.params.organizationId
    };
  }
});