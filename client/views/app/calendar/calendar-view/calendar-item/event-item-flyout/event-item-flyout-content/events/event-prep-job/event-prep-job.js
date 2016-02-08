Template.eventPrepJob.onCreated(function () {
  var eventItem = this.data.eventObject.item;
  this.job = function () {
    var jobId = eventItem.itemId;
    return JobItems.findOne({_id: jobId});
  };

  var job = this.job();
  if (job.ingredients && job.ingredients.length) {
    var ingredientIds = _.pluck(job.ingredients, '_id');
    this.subscribe('ingredients', ingredientIds, HospoHero.getCurrentAreaId(), false);
  }
});

Template.eventPrepJob.helpers({
  job: function () {
    return Template.instance().job();
  }
});