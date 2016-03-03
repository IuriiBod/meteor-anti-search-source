let canUserEditProjects = (areaId = null) => {
  var checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(areaId, 'edit projects');
};

let isInProjectTeam = (users = []) => {
  return users.indexOf(Meteor.userId()) > -1;
};

Meteor.methods({
  createProject(projectDoc) {
    if (!canUserEditProjects()) {
      throw new Meteor.Error('You can\'t create projects');
    } else {
      check(projectDoc, HospoHero.checkers.ProjectChecker);
      let defaultProject = {
        createdBy: Meteor.userId(),
        createdAt: new Date()
      };

      _.extend(projectDoc, defaultProject);

      projectDoc._id = Projects.insert(projectDoc);

      notifiAboutParticipationInProject(projectDoc, 'lead');
      notifiAboutParticipationInProject(projectDoc, 'team');

      return projectDoc._id;
    }
  },

  updateProject(updatedProjectDoc) {
    if (!(canUserEditProjects() || isInProjectTeam(updatedProjectDoc.lead))) {
      throw new Meteor.Error('You can\'t edit projects');
    } else {
      check(updatedProjectDoc, HospoHero.checkers.ProjectChecker);
      Projects.update({_id: updatedProjectDoc._id}, {$set: updatedProjectDoc});
    }
  }
});

function notifiAboutParticipationInProject(projectDoc, projectTeamType) {
  if (projectDoc[projectTeamType] && projectDoc[projectTeamType].length) {
    let templateData = {
      project: {
        title: projectDoc.title,
        time: HospoHero.dateUtils.dateInterval(projectDoc.startTime, projectDoc.endTime),
        teamType: projectTeamType
      }
    };

    let options = {
      helpers: {
        url () {
          return NotificationSender.urlFor('projectDetails', {id: projectDoc._id}, this);
        }
      }
    };

    let notificationSender = new NotificationSender('New project', 'new-project', templateData, options);
    projectDoc[projectTeamType].forEach((userId) => notificationSender.sendBoth(userId));
  }
}