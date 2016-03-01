Template.eventProject.onCreated(function () {
  this.project = () => {
    return Projects.findOne({
      _id: this.data.eventObject.item.itemId
    });
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

      Meteor.call('updateProject', project, HospoHero.handleMethodResult());
    }
  }
});


Template.eventProject.helpers({
  project() {
    return Template.instance().project();
  },

  goToItemTemplateData() {
    return {
      id: this.eventObject.item.itemId
    }
  },

  saveProject () {
    return Template.instance().saveProject;
  }
});