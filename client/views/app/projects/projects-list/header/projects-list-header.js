const defaultProjectObject = {
  title: 'Set project title',
  startTime: moment().toDate(),
  endTime: moment().add(1, 'hour').toDate(),
  status: 'idea',
  lead: [],
  team: [],
  agendaAndMinutes: ''
};

Template.projectsListHeader.events({
  'click .create-new-project': function (event) {
    event.preventDefault();
    Meteor.call('createProject', defaultProjectObject, HospoHero.handleMethodResult((projectId) => {
      Router.go('projectDetails', {id: projectId});
    }));
  }
});