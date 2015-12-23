//context: jobs ([{_id: ID,quantity: Number}]), onChange (function)
Template.menuItemJobsList.onCreated(function () {
  this.subscribe('jobItems', null, HospoHero.getCurrentAreaId());

  var tmpl = this;
  this.onJobItemUpdate = function (action, jobItemId, newQuantity) {
    var jobItemsList = tmpl.data.jobItems;

    if (action === 'add') {
      jobItemsList.push({
        _id: jobItemId,
        quantity: newQuantity
      });
    } else if (action === 'update') {
      jobItemsList.every(function (jobItem, key) {
        if (jobItem._id === jobItemId) {
          newQuantity = newQuantity || 0;
          jobItemsList[key].quantity = newQuantity;
        }
      });
    } else if (action === 'remove') {
      jobItemsList.every(function (jobItem, key) {
        if (jobItem._id === jobItemId) {
          jobItemsList.splice(key, 1);
        }
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
      tmpl.onJobItemUpdate('add', jobItemId, 1);
    };
  }
});