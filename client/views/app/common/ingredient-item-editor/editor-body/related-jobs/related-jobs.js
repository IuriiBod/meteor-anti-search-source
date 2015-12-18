//context: ingredient
Template.ingredientEditorRelatedJobs.helpers({
  relatedJobs: function () {
    return JobItems.find({"ingredients._id": this._id});
  },

  secondsToMinutes: function (secondsCount) {
    var duration = moment.duration(secondsCount, 'seconds');
    return duration.minutes() + ':' + duration.seconds();
  }
});