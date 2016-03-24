Template.applicationEdit.helpers({
  details () {
    return this.application.details;
  },

  fieldIsInSchema (fieldName) {
    return this.applicationSchema.schema[fieldName];
  },

  applicationProgress () {
    let statuses = HospoHero.applications.statuses();
    let currentStatusIndex = statuses.indexOf(this.application.appProgress);

    return statuses.map((status, index) => {
      return {
        fieldName: status,
        fieldTitle: status,
        isChecked: index <= currentStatusIndex
      };
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