Template.applicationEdit.helpers({
  details () {
    return this.application.details;
  },

  fieldIsInSchema (fieldName) {
    return this.applicationSchema.schema[fieldName];
  },

  applicationProgress () {
    let statuses = ['New Application', 'Phone Interview', '1st Interview', '2nd Interview', 'Hired!',
      'On Wait List', 'Rejected'];

    let currentStatusIndex = statuses.indexOf(this.application.appProgress);

    let statusesActions = {
      '1st Interview': createInterview,
      '2nd Interview': createInterview,
      'Hired!': inviteUser,
      'Rejected': rejectApplication
    };

    return statuses.map((status, index) => {
      let statusObject = {
        name: status,
        checked: index <= currentStatusIndex
      };

      // set the callback, which will be called after setting application to this status
      if (statusesActions[status]) {
        statusObject.afterSetCallback = statusesActions[status];
      }

      return statusObject;
    });
  },

  positions () {
    let positionIds = this.application.positionIds;
    return Positions.find({_id: {$in: positionIds}}).map(position => position.name);
  },

  availability () {
    let availableWeekdayNumber = this.application.details.availability;
    if (availableWeekdayNumber.length) {
      return availableWeekdayNumber.map(weekdayNumber => {
        return moment().day(weekdayNumber).format('dddd');
      });
    } else {
      return [];
    }
  }
});

function createInterview (applicationId) {
  console.log('CREATE INT', applicationId);
}

function inviteUser (applicationId) {
  console.log('INVITE', applicationId);
}

function rejectApplication (applicationId) {
  console.log('REJECT', applicationId);
}