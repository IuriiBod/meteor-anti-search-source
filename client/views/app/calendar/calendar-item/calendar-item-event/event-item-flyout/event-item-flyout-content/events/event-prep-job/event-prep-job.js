Template.eventPrepJob.onCreated(function () {
  this.job = () => {
    let jobId = this.data.event.itemId;
    return JobItems.findOne({_id: jobId});
  };

  let job = this.job();
  if (job.ingredients && job.ingredients.length) {
    job.ingredients.forEach((ingredient) => {
      this.subscribe('ingredient', ingredient._id);
    });
  }
});

Template.eventPrepJob.helpers({
  job () {
    return Template.instance().job();
  }
});