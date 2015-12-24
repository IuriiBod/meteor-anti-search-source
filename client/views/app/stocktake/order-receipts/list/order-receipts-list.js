Template.ordersReceiptsList.onCreated(function() {
  this.showsReceivedOrders = new ReactiveVar(false);
  this.periodOfOrders = new ReactiveVar('week');
});

Template.ordersReceiptsList.helpers({
  showsReceivedOrders: function () {
    return Template.instance().showsReceivedOrders.get();
  },

  isCurrentPeriodOfOrders: function (period) {
    var currentPeriod = Template.instance().periodOfOrders.get();
    return currentPeriod === period;
  },

  receipts: function() {
    var showsReceivedOrders = Template.instance().showsReceivedOrders.get();
    var period = Template.instance().periodOfOrders.get();
    var receipts;

    if (period === 'week' || period === 'month') {
      receipts = OrderReceipts.find({
        'received': showsReceivedOrders,
        'expectedDeliveryDate': {
          $gte: moment().startOf(period).unix() * 1000,
          $lte: moment().endOf(period).unix() * 1000
        }
      }, {sort: {'receivedDate': -1, 'supplier': 1}});
    } else if (period === 'allTime') {
      receipts = OrderReceipts.find({
        'received': showsReceivedOrders
      }, {sort: {'receivedDate': -1, 'supplier': 1}});
    }

    console.log(receipts.fetch());
    return receipts.fetch();
  }
});

Template.ordersReceiptsList.events({
  'click .orders-status': function (event, tmpl) {
    event.preventDefault();

    var status = event.currentTarget.getAttribute('data-orders-status');
    if (status === 'received') {
      tmpl.showsReceivedOrders.set(true);  
    } else {
      tmpl.showsReceivedOrders.set(false);
    }    
  },

  'click .period-of-orders': function (event, tmpl) {
    event.preventDefault();
    var period = event.currentTarget.getAttribute('data-period-of-orders');
    tmpl.periodOfOrders.set(period);
  }
});