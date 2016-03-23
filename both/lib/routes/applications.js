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