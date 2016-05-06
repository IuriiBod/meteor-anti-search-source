Template.interviewEdit.onCreated(function () {
  const interview = this.data.interview;
  this.selectedUsers = new ReactiveArray(interview.interviewers || []);

  this.autorun(() => {
    this.selectedUsers.depend();
    this.subscribe('selectedUsersList', this.selectedUsers.array());
  });
});


Template.interviewEdit.helpers({
  interviewStartTime () {
    return this.interview.startTime || new Date();
  },

  onValueChanged() {
    let saveInterview = this.saveInterview();
    return (newValue) => {
      saveInterview({title: newValue});
    };
  },

  interviewCreator() {
    return this.interview.createdBy === Meteor.userId();
  },

  timeComboEditableParams () {
    let interview = this.interview;
    let saveInterview = this.saveInterview();

    let startTime = interview.startTime || new Date();
    let endTime = interview.endTime || moment(startTime).add(1, 'hour').toDate();

    return {
      withoutIcon: true,
      minuteStepping: 10,
      firstTime: startTime,
      secondTime: endTime,
      onSubmit: function (startTime, endTime) {
        let applyTime = HospoHero.dateUtils.applyTimeToDate;
        saveInterview({
          startTime: applyTime(interview.startTime, startTime),
          endTime: applyTime(interview.endTime, endTime)
        });
      }
    };
  },

  onDateChange () {
    let interview = this.interview;
    let saveInterview = this.saveInterview();

    return (newDate) => {
      let oldDate = interview.startTime || new Date();

      if (oldDate.valueOf() !== newDate.valueOf()) {
        let applyTimeToDate = HospoHero.dateUtils.applyTimeToDate;

        let startTime = applyTimeToDate(newDate, interview.startTime);
        let endTime = applyTimeToDate(newDate, interview.endTime);

        saveInterview({startTime: startTime, endTime: endTime});
      }
    };
  },

  allowRemoveUser () {
    let interview = this.interview;
    let userId = Meteor.userId();
    return interview.createdBy === userId ||
      interview.interviewers.indexOf(userId) > -1;
  },

  onInterviewerRemove () {
    let tmpl = Template.instance();
    let saveInterview = this.saveInterview();
    return (userId) => {
      let interview = tmpl.data.interview;
      interview.interviewers.splice(interview.interviewers.indexOf(userId), 1);
      saveInterview({interviewers: interview.interviewers});
      tmpl.selectedUsers.remove(userId);
    };
  }
});


Template.interviewEdit.events({
  'click .add-interviewer-button' (event, tmpl) {
    let saveInterview = this.saveInterview();

    let onUserSelect = (userId) => {
      let interviewers = tmpl.selectedUsers.array() || [];
      interviewers.push(userId);
      saveInterview({interviewers: interviewers});
      tmpl.selectedUsers.push(userId);
    };

    FlyoutManager.open('usersSearch', {
      selectedUsers: tmpl.selectedUsers.array(),
      onUserSelect: onUserSelect
    });
  }
});

Template.interviewEdit.onDestroyed(function () {
  this.selectedUsers.clear();
});