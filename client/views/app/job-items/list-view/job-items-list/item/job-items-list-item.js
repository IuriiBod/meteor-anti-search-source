Template.jobItemDetailed.helpers({
  isRecurring: function () {
    var id = this.jobItem.type;
    var type = JobTypes.findOne({_id: id});
    return !!type && type.name === 'Recurring';
  },

  jobFrequency: function () {
    var jobItem = this.jobItem;
    var frequency = jobItem.frequency;
    switch (frequency) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'everyXWeeks':
        return 'Every ' + jobItem.repeatEvery + ' weeks';
      default :
        return false;
    }
  },

  prepCostPerMeasure: function () {
    return HospoHero.analyze.jobItem(this.jobItem).prepCostPerMeasure;
  }
});

Template.jobItemDetailed.events({
  'click .viewDetail': function (event, tmpl) {
    event.preventDefault();
    Router.go('jobItemDetailed', {_id: tmpl.data.jobItem._id});
  }
});
