Template.orderingCount.onRendered(function () {
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

        var count = parseFloat(newValue) ? parseFloat(newValue) : 0;
        Meteor.call('editOrderingCount', stockItemId, count, HospoHero.handleMethodResult(function () {
          console.log('after ordering count');
          $(".ordering_count").trigger('callFlowAction');
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

Template.orderingCount.events({
  'click .ordering_count': function (event, tmpl) {
    tmpl.data.onCountChange();
  }
});