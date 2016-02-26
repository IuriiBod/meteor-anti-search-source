const projectStatusButtons = {
  idea: 'Idea',
  ready: 'Ready for Approval',
  approved: 'Approved',
  complete: 'Complete'
};


Template.projectCreateEdit.helpers({
  onValueChanged() {
    return () => {
      return this.saveProject;
    };
  },

  projectCreator() {
    console.log('JHG', !this.project._id || this.project.createdBy === Meteor.userId());

    return !this.project._id || this.project.createdBy === Meteor.userId();
  },

  timeComboEditableParams () {
    let project = this.project;

    return {
      withoutIcon: true,
      minuteStepping: 10,
      firstTime: project.startTime,
      secondTime: project.endTime,
      onSubmit: function (startTime, endTime) {
        let applyTime = HospoHero.dateUtils.applyTimeToDate;
        this.saveProject('startTime', applyTime(project.startTime, startTime));
        this.saveProject('endTime', applyTime(project.endTime, endTime));
      }
    }
  },

  onDateChange () {
    let project = this.project;

    return (newDate) => {
      if (project.startTime.valueOf() !== newDate.valueOf()) {
        let applyTimeToDate = HospoHero.dateUtils.applyTimeToDate;
        this.saveProject('startTime', applyTimeToDate(newDate, project.startTime));
        this.saveProject('endTime', applyTimeToDate(newDate, project.endTime));
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
    return (newStatus) => {
      this.saveProject('status', newStatus);
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

function addMemberToTheProject (tmplData, memberType) {
  let project = tmplData.project;
  const selectedUsers = _.union(project.lead, project.team);

  let onUserSelect = () => {
    return (userId) => {
      project[memberType].push(userId);
      tmplData.saveProject(memberType, project[memberType]);
    }
  };

  FlyoutManager.open('usersSearchFlyout', {
    selectedUsers: selectedUsers,
    onUserSelect: onUserSelect
  });
}