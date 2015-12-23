Template.menuItemJobsListItem.helpers({
  jobItemStatistics: function () {
    return HospoHero.analyze.jobItem(this.jobItem);
  }
});

Template.menuItemJobsListItem.events({
  'click .remove-job-item': function (event, tmpl) {
    tmpl.data.onJobItemUpdate('remove', tmpl.data.jobItem._id);
  },

  'keyup .job-quantity': function (event, tmpl) {
    var text = event.target.value.trim();
    tmpl.data.onJobItemUpdate('update', tmpl.data.jobItem._id, text);
  }
});