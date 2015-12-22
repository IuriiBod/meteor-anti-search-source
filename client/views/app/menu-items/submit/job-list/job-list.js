//context: jobs ([{_id: ID,quantity: Number}]), onChange (function)
Template.menuItemJobsList.onCreated(function () {
  var tmpl = this;
  this.onJobItemUpdate = function (action, jobItemId, newQuantity) {
    var newJobsList;
    if (action === 'remove') {
      newJobsList = _.filter(tmpl.data.jobs, function (jobItem) {
        return jobItem !== jobItemId;
      });
    } else if (action === 'change') {
      newJobsList = _.map(tmpl.data.jobs, function (jobItem) {
        if (jobItem === jobItemId) {
          jobItem.quantity = newQuantity;
        }
        return jobItem;
      });
    }
    tmpl.data.onChange(newJobsList);
  };
});


Template.menuItemJobsList.helpers({
  jobEntry: function () {
    return {
      jobItem: JobItems.findOne({_id: this._id}),
      quantity: this.quantity,
      onJobItemUpdate: Template.instance().onJobItemUpdate
    };
  },

  alreadyAddedJobItemsIds: function () {
    return this.jobs.map(function (jobEntry) {
      return jobEntry._id;
    });
  },

  getOnJobItemsAdded: function () {
    var tmpl = Template.instance();
    return function (jobItemsIdsToAdd) {
      var newJobsList = _.map(jobItemsIdsToAdd, function (jobItemId) {
        return {
          _id: jobItemId,
          quantity: 1
        };
      });
      var allItems = tmpl.data.jobs.concat(newJobsList.concat);
      tmpl.data.onChange(allItems);
    };
  }
});


Template.menuItemJobsList.events({
});