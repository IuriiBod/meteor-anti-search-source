Template.projectDetails.onCreated(function () {
  this.saveProject = () => {
    return (detailsToUpdate, onDataSaved) => {
      let project = this.data.project;
      _.extend(project, detailsToUpdate);

      Meteor.call('updateProject', project, HospoHero.handleMethodResult(() => {
        if (_.isFunction(onDataSaved)) {
          onDataSaved();
        }
      }));
    };
  };
});


Template.projectDetails.helpers({
  canNotEditProjectDetails () {
    const userId = Meteor.userId();
    const project = this.project;
    // the user can't edit project details if he is not a creator and not in project lead
    return project && project.createdBy !== userId && project.lead.indexOf(userId) === -1;
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
    const project = this.project;
    return project && project.agendaAndMinutes || 'Click to edit...';
  },

  onSaveAgenda() {
    let saveProject = Template.instance().saveProject();

    return function (newAgendaText, onDataSaved) {
      saveProject({agendaAndMinutes: newAgendaText}, onDataSaved);
    };
  }
});