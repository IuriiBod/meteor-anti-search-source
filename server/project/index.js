Meteor.methods({
  createProject(projectDoc) {
    check(projectDoc, HospoHero.checkers.ProjectChecker);

    if (!HospoHero.canUser("create projects")) {
      throw new Meteor.Error('You can\'t create projects');
    } else {
      let defaultProject = {
        createdBy: Meteor.userId(),
        createdAt: new Date()
      };

      _.extend(projectDoc, defaultProject);

      return Projects.insert(projectDoc);
    }
  },

  updateProject(updatedProjectDoc) {
    check(updatedProjectDoc, HospoHero.checkers.ProjectChecker);
    Projects.update({_id: updatedProjectDoc._id}, {$set: updatedProjectDoc});
  }
});