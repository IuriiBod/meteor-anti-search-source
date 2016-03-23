Template.interviewDetails.onCreated(function () {
  this.saveInterview = () => {
    return (detailsToUpdate) => {
      let interview = this.data.interview;
      _.extend(interview, detailsToUpdate);

      Meteor.call('updateInterview', interview, HospoHero.handleMethodResult());
    };
  };
});


Template.interviewDetails.helpers({
  interviewTitle () {
    return `Interview with ${this.interview.interviewee}`;
  },

  canNotEditInterviewDetails () {
    const userId = Meteor.userId();
    const interview = this.interview;
    // the user can't edit interview details if he is not a creator and not an interviewee
    return interview.createdBy !== userId &&
      (!interview.interviewee || interview.interviewee.indexOf(userId) === -1);
  },

  interviewDetailsOptions () {
    return {
      namespace: 'interview',
      uiStateId: 'details',
      title: 'Interview Details'
    };
  },

  saveInterview() {
    return Template.instance().saveInterview;
  },

  agendaOptions () {
    return {
      namespace: 'interview',
      uiStateId: 'agenda',
      title: 'Agenda & Minutes',
      contentPadding: '20px'
    };
  },

  agendaAndMinutes () {
    return this.interview.agendaAndMinutes || 'Click to edit...';
  },

  saveChanges() {
    let saveProject = Template.instance().saveInterview();

    return function (newAgendaText) {
      saveProject({agendaAndMinutes: newAgendaText});
    };
  }
});