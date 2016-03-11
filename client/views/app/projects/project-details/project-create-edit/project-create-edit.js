const projectStatusButtons = {
  idea: 'Idea',
  ready: 'Ready for Approval',
  approved: 'Approved',
  complete: 'Complete'
};


Template.projectCreateEdit.onCreated(function () {
  const project = this.data.project;
  this.selectedUsers = new ReactiveArray(_.union(project.lead, project.team));

  this.autorun(() => {
    this.selectedUsers.depend();
    this.subscribe('selectedUsersList', this.selectedUsers.array());
  });

  let saveProject = this.data.saveProject();
  this.addMemberToTheProject = (memberType) => {
    let onUserSelect = () => {
      return (userId) => {
        project[memberType].push(userId);
        saveProject({[memberType]: project[memberType]});
        this.selectedUsers.push(userId);
      };
    };

    FlyoutManager.open('usersSearchFlyout', {
      selectedUsers: this.selectedUsers.array(),
      onUserSelect: onUserSelect
    });
  };

  this.removeUserFormProject = (userId, teamType) => {
    project[teamType].splice(project[teamType].indexOf(userId), 1);
    saveProject({[teamType]: project[teamType]});
    this.selectedUsers.remove(userId);
  };
});


Template.projectCreateEdit.helpers({
  onValueChanged() {
    let saveProject = this.saveProject();
    return (newValue) => {
      saveProject({title: newValue});
    };
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
        saveProject({
          startTime: applyTime(project.startTime, startTime),
          endTime: applyTime(project.endTime, endTime)
        });
      }
    };
  },

  onDateChange () {
    let project = this.project;
    let saveProject = this.saveProject();

    return (newDate) => {
      if (project.startTime.valueOf() !== newDate.valueOf()) {
        let applyTimeToDate = HospoHero.dateUtils.applyTimeToDate;

        let startTime = applyTimeToDate(newDate, project.startTime);
        let endTime = applyTimeToDate(newDate, project.endTime);

        saveProject({startTime: startTime, endTime: endTime});
      }
    };
  },

  projectStatusButtons () {
    return _.keys(projectStatusButtons).map((statusKey) => {
      return {
        title: projectStatusButtons[statusKey],
        value: statusKey
      };
    });
  },

  onStatusChange () {
    let saveProject = Template.parentData(1).saveProject();

    return (newStatus) => {
      saveProject({status: newStatus});
    };
  },

  allowRemoveUser () {
    const project = this.project;
    const userId = Meteor.userId();
    return project.createdBy === userId ||
      project.lead.indexOf(userId) > -1;
  },

  onLeadMemberRemove () {
    const tmpl = Template.instance();
    return (userId) => {
      tmpl.removeUserFormProject(userId, 'lead');
    };
  },

  onTeamMemberRemove () {
    const tmpl = Template.instance();
    return (userId) => {
      tmpl.removeUserFormProject(userId, 'team');
    };
  }
});


Template.projectCreateEdit.events({
  'click .add-lead' (event, tmpl) {
    tmpl.addMemberToTheProject('lead');
  },

  'click .add-team' (event, tmpl) {
    tmpl.addMemberToTheProject('team');
  }
});

Template.projectCreateEdit.onDestroyed(function () {
  this.selectedUsers.clear();
});