Router.route('applications', {
  path: '/applications',
  template: 'applicationsView',
  waitOn: function () {
    let currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('applicationDefinitions', currentAreaId)
    ];
  }
});


Router.route('recruitmentForm', {
  path: '/recruitment-form/:organizationId',
  template: 'recruitmentForm',
  layoutTemplate: 'recruitmentLayout',
  waitOn: function () {
    return [
      Meteor.subscribe('applicationDefinitionsByOrganization', this.params.organizationId)
    ];
  },
  data: function () {
    return {
      applicationDefinition: ApplicationDefinitions.findOne(),
      organizationId: this.params.organizationId
    };
  }
});