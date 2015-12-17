Template.orderingCount.onRendered(function () {
  var self = this;
  this.$('.orderingCount').editable({
    title: 'Edit count',
    showbuttons: false,
    mode: 'inline',
    defaultValue: 0,
    autotext: 'auto',
    display: function (value, response) {
    },
    success: function (response, newValue) {
      if (newValue) {
        var stockItemId = self.data.id;
        var count = parseFloat(newValue) || 0;

        Meteor.call('editOrderingCount', stockItemId, count, HospoHero.handleMethodResult(function () {
          self.data.onCountChange();
        }));
      }
    }
  });
});

Template.orderingCount.helpers({
  orderingCount: function() {
    return StockOrders.findOne(this.id).countOrdered;
  },

  unit: function() {
    return this.unit;
  }
});