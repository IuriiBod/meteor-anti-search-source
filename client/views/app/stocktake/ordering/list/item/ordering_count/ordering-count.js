Template.orderingCount.onRendered(function () {
  var self = this;
  setTimeout( function() {
    this.$('.orderingCount').editable({
      title: 'Edit count',
      showbuttons: false,
      mode: 'inline',
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
    })
  }, 10);
});

Template.orderingCount.helpers({
  orderingCount: function() {
    return StockOrders.findOne(this.id).countOrdered;
  },

  unit: function() {
    return this.unit;
  }
});