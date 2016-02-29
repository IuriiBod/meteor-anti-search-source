const defaultProjectObject = {
  title: 'Set project title',
  startTime: moment().toDate(),
  endTime: moment().add(1, 'hour').toDate(),
  status: 'idea',
  lead: [],
  team: []
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
    return (field, newValue) => {
      let project = this.project();
      project[field] = newValue;

      if (!this.data.id) {
        this.createProjectObject.set(project);
      } else {
        Meteor.call('updateProject', project, HospoHero.handleMethodResult());
      }
    }
  }
});


Template.projectDetails.helpers({
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
  }
});