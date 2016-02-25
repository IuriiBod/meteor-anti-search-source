Template.projectCreateEdit.onCreated(function () {
  this.createProjectObject = new ReactiveVar({
    title: 'Set project title'
  });

  this.project = () => {
    if (this.data.createMode) {
      return this.createProjectObject.get();
    } else {
      return Projects.findOne({_id: this.data.id});
    }
  };

  this.saveProject = (field, newValue) => {
    let project = this.project();
    project[field] = newValue;

    if (this.data.createMode) {
      this.createProjectObject.set(project);
    } else {
      Meteor.call('updateProject', project, HospoHero.handleMethodResult());
    }
  };
});


Template.projectCreateEdit.helpers({
  project() {
    return Template.instance().project()
  },

  onValueChanged() {
    return Template.instance().saveProject;
  },

  projectCreator() {
    return this.createMode || Template.instance().project().createdBy === Meteor.userId();
  }
});
