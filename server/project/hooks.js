Projects.after.insert(function (userId, projectDoc) {
  let createCalendarEventsForUsers = (userIds) => {
    if (userIds.length) {
      userIds.forEach((userId) => CalendarEventsManager.insert(projectDoc, 'project', userId));
    }
  };

  createCalendarEventsForUsers(projectDoc.lead);
  createCalendarEventsForUsers(projectDoc.team);
});

Projects.after.update(function (userId, newProject) {
  let oldProject = this.previous;

  // check start/end time of meetings
  if (oldProject.startTime.valueOf() !== newProject.startTime.valueOf() ||
    oldProject.endTime.valueOf() !== newProject.endTime.valueOf()) {
    CalendarEventsManager.update(newProject._id, {
      startTime: newProject.startTime,
      endTime: newProject.endTime
    });
  }

  /**
   * Check difference between two arrays of user ids and edit calendar event of changed user id
   * @param {String} teamType - can be team or lead
   * @returns {boolean} - if there is a changed user - return true, else - false
   */
  let checkTeamChanges = (teamType) => {
    let changedUserId = HospoHero.misc.arrayDifference(oldProject[teamType], newProject[teamType])[0];

    if (changedUserId) {
      if (oldProject[teamType].length > newProject[teamType].length) {
        // the user was removed from the project
        CalendarEventsManager.remove({itemId: newProject._id, userId: changedUserId});
      } else {
        CalendarEventsManager.insert(newProject, 'project', changedUserId);
      }
      return true;
    } else {
      return false;
    }
  };

  if (!checkTeamChanges('lead')) {
    checkTeamChanges('team');
  }
});