//context: jobs ([{_id: ID,quantity: Number}]), onChange (function)
Template.menuItemJobsList.onCreated(function () {
  this.subscribe('jobItems', null, HospoHero.getCurrentAreaId());

  var tmpl = this;
  this.onJobItemUpdate = function (action, jobItemId, newQuantity) {
    var jobItemsList = tmpl.data.jobItems;

    if (action === 'add') {
      jobItemsList.push({
        _id: jobItemId,
        quantity: 1
      });
    } else if (action === 'update') {
      jobItemsList.every(function (jobItem, key) {
        if (jobItem._id === jobItemId) {
          newQuantity = newQuantity || 1;
          jobItemsList[key].quantity = newQuantity;
        }
      });
    } else if (action === 'remove') {
      jobItemsList = _.filter(stockItems, function (jobItem) {
        return jobItem._id !== jobItemId;
      });
    }
    tmpl.data.onChange(jobItemsList);
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

  idsToExclude: function () {
    return _.pluck(this.jobItems, '_id');
  },

  getOnJobItemsAdded: function () {
    var tmpl = Template.instance();
    return function (jobItemId) {
      tmpl.onJobItemUpdate('add', jobItemId);
    };
  }
});