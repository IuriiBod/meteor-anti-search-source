const projectStatusButtons = {
  idea: 'Idea',
  ready: 'Ready for Approval',
  approved: 'Approved',
  complete: 'Complete'
};


Template.projectCreateEdit.helpers({
  onValueChanged() {
    let saveProject = this.saveProject();
    return (newValue) => {
      saveProject('title', newValue);
    }
  },

  activeButton () {
    const templateData = Template.parentData(1);
    return templateData.project.status;
  },

  projectCreator() {
    return !this.project._id || this.project.createdBy === Meteor.userId();
  },

  timeComboEditableParams () {
    let project = this.project;
    let saveProject = this.saveProject();
    return {
      withoutIcon: true,
      minuteStepping: 10,
      firstTime: project.startTime,
      secondTime: project.endTime,
      onSubmit: function (startTime, endTime) {
        let applyTime = HospoHero.dateUtils.applyTimeToDate;
        saveProject('startTime', applyTime(project.startTime, startTime));
        saveProject('endTime', applyTime(project.endTime, endTime));
      }
    }
  },

  onDateChange () {
    let project = this.project;
    let saveProject = this.saveProject();

    return (newDate) => {
      if (project.startTime.valueOf() !== newDate.valueOf()) {
        let applyTimeToDate = HospoHero.dateUtils.applyTimeToDate;
        saveProject('startTime', applyTimeToDate(newDate, project.startTime));
        saveProject('endTime', applyTimeToDate(newDate, project.endTime));
      }
    }
  },

  projectStatusButtons () {
    return _.keys(projectStatusButtons).map((statusKey) => {
      return {
        title: projectStatusButtons[statusKey],
        value: statusKey
      }
    });
  },

  onStatusChange () {
    let saveProject = Template.parentData(1).saveProject();

    return (newStatus) => {
      saveProject('status', newStatus);
    }
  }
});


Template.projectCreateEdit.events({
  'click .add-lead' (event, tmpl) {
    addMemberToTheProject(tmpl.data, 'lead');
  },

  'click .add-team' (event, tmpl) {
    addMemberToTheProject(tmpl.data, 'team');
  }
});


function addMemberToTheProject(tmplData, memberType) {
  let project = tmplData.project;
  let saveProject = tmplData.saveProject();

  const selectedUsers = _.union(project.lead, project.team);

  let onUserSelect = () => {
    return (userId) => {
      project[memberType].push(userId);
      saveProject(memberType, project[memberType]);
    }
  };

  FlyoutManager.open('usersSearchFlyout', {
    selectedUsers: selectedUsers,
    onUserSelect: onUserSelect
  });
}