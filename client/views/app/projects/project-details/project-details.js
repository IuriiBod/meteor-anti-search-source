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
    if (!this.data.id) {
      return this.createProjectObject.get();
    } else {
      return Projects.findOne({_id: this.data.id});
    }
  };

  this.saveProject = () => {
    return (...args) => {
      let project = this.project();

      if (args.length === 1 && _.isObject(args[0])) {
        _.extend(project, args[0]);
      } else if (args.length === 2) {
        // args[0] - field name
        // args[1] - new value
        project[args[0]] = args[1];
      }

      if (!this.data.id) {
        this.createProjectObject.set(project);
      } else {
        Meteor.call('updateProject', project, HospoHero.handleMethodResult());
      }
    }
  }
});


Template.projectDetails.helpers({
  createMode () {
    return !this.id;
  },

  project () {
    return Template.instance().project();
  },

  projectDetailsOptions () {
    return {
      namespace: 'project',
      uiStateId: 'details',
      title: 'Project Details'
    }
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
    }
  },

  agendaAndMinutes () {
    const project = Template.instance().project();
    return project.agendaAndMinutes || 'Click to edit...';
  },

  saveChanges() {
    let saveProject = Template.instance().saveProject();

    return function (newAgendaText) {
      saveProject('agendaAndMinutes', newAgendaText);
    }
  }
});


Template.projectDetails.events({
  'click .create-project' (event, tmpl) {
    Meteor.call('createProject', tmpl.createProjectObject.get(), HospoHero.handleMethodResult(function (projectId) {
      Router.go('projectDetails', {id: projectId});
    }));
  }
});