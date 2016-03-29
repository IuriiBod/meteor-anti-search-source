Template.applicationEdit.helpers({
  details () {
    return this.application.details;
  },

  fieldIsInSchema (fieldName) {
    return this.applicationSchema.schema[fieldName];
  },

  positions () {
    let positionIds = this.application.positionIds;
    return Positions.find({_id: {$in: positionIds}}).map(position => position.name);
  },

  availability () {
    let availableWeekdayNumber = this.application.details.availability;

    if (availableWeekdayNumber && availableWeekdayNumber.length) {
      return availableWeekdayNumber.map(weekdayNumber => {
        return moment().day(weekdayNumber).format('dddd');
      });
    } else {
      return [];
    }
  },

  isClosed (status) {
    let appStatus = this.application.status;
    return status ? appStatus && appStatus === status : !!appStatus;
  }
});