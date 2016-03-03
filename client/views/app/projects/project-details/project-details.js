const defaultProjectObject = {
  title: 'Set project title',
  startTime: moment().toDate(),
  endTime: moment().add(1, 'hour').toDate(),
  status: 'idea',
  lead: [],
  team: [],
  agendaAndMinutes: ''
};


Template.projectDetails.onCreated(function () {
  this.createProjectObject = new ReactiveVar(defaultProjectObject);

  this.project = () => {
    return this.data.project || this.createProjectObject.get();
  };

  this.saveProject = () => {
    return (detailsToUpdate) => {
      let project = this.project();
      _.extend(project, detailsToUpdate);

      if (!this.data.project) {
        this.createProjectObject.set(project);
      } else {
        Meteor.call('updateProject', project, HospoHero.handleMethodResult());
      }
    };
  };
});


Template.projectDetails.helpers({
  createMode () {
    return !this.project;
  },

  canNotEditProjectDetails () {
    const userId = Meteor.userId();
    const project = Template.instance().project();
    // the user can't edit project details if he is not a creator and not in project lead
    return project.createdBy !== userId && project.lead.indexOf(userId) === -1;
  },

  project () {
    return Template.instance().project();
  },

  projectDetailsOptions () {
    return {
      namespace: 'project',
      uiStateId: 'details',
      title: 'Project Details'
    };
  },

  saveProject() {
    return Template.instance().saveProject;
  },

  agendaOptions () {
    return {
      namespace: 'project',
      uiStateId: 'agenda',
      title: 'Agenda & Minutes',
      contentPadding: '20px'
    };
  },

  agendaAndMinutes () {
    const project = Template.instance().project();
    return project.agendaAndMinutes || 'Click to edit...';
  },

  saveChanges() {
    let saveProject = Template.instance().saveProject();

    return function (newAgendaText) {
      saveProject({agendaAndMinutes: newAgendaText});
    };
  }
});


Template.projectDetails.events({
  'click .create-project' (event, tmpl) {
    Meteor.call('createProject', tmpl.createProjectObject.get(), HospoHero.handleMethodResult(function (projectId) {
      Router.go('projectDetails', {id: projectId});
    }));
  }
});