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

  onCheckboxChange () {
    let applicationEditData = Template.parentData(1);
    let application = applicationEditData.application;
    let saveApplication = applicationEditData.saveApplication;

    return (status, isChecked) => {
      if (isChecked) {
        application.appProgress = status;
        saveApplication(application);
      }
    };
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