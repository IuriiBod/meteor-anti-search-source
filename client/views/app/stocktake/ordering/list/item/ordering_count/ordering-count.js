Template.orderingCount.onRendered(function () {
  var self = this;
  $('.orderingCount').editable({
    title: 'Edit count',
    showbuttons: false,
    mode: 'inline',
    defaultValue: 0,
    autotext: 'auto',
    display: function (value, response) {
    },
    success: function (response, newValue) {
      if (newValue) {
        var $cell = $(this);
        var $row = $cell.closest('tr');
        var stockItemId = $row.attr('data-id');

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
    var order = StockOrders.findOne(this.id);
    if (order) {
      return order.countOrdered;
    }
  },

  unit: function() {
    return this.unit;
  }
});