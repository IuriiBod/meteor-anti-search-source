Template.applicationDetails.helpers({
  applicationDetailsOptions () {
    return {
      namespace: 'application',
      uiStateId: 'details',
      title: 'Application Details'
    };
  },

  saveApplication () {
    return (changedApplication) => {
      Meteor.call('updateApplication', changedApplication, HospoHero.handleMethodResult());
    };
  }
});