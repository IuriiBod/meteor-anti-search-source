Template.eventProject.onCreated(function () {
  this.project = () => {
    return Projects.findOne({
      _id: this.data.eventObject.item.itemId
    });
  };

  this.saveProject = () => {
    return (detailsToUpdate) => {
      let project = this.project();
      _.extend(project, detailsToUpdate);
      Meteor.call('updateProject', project, HospoHero.handleMethodResult());
    };
  };
});


Template.eventProject.helpers({
  project() {
    return Template.instance().project();
  },

  goToItemTemplateData() {
    return {
      id: this.eventObject.item.itemId
    };
  },

  saveProject () {
    return Template.instance().saveProject;
  }
});