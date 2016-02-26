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

  // TODO: Fix a strange bug with cycling
  //saveProject() {
  //  const tmpl = Template.instance();
  //
  //  return (field, newValue) => {
  //    console.log('ne', newValue);
  //
  //    let project = tmpl.project();
  //    project[field] = newValue;
  //
  //    if (!tmpl.data.id) {
  //      tmpl.createProjectObject.set(project);
  //    } else {
  //      Meteor.call('updateProject', project, HospoHero.handleMethodResult());
  //    }
  //  }
  //}
});