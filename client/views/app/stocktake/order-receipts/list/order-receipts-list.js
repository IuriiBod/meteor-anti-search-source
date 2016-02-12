Template.ordersReceiptsList.onCreated(function() {
  this.showsReceivedOrders = new ReactiveVar(false);
  this.periodOfOrders = new ReactiveVar('week');
});

Template.ordersReceiptsList.helpers({
  showsReceivedOrders: function () {
    return Template.instance().showsReceivedOrders.get();
  },

  isCurrentPeriodOfOrders: function (period) {
    let currentPeriod = Template.instance().periodOfOrders.get();
    return currentPeriod === period;
  },

  receipts: function() {
    let showsReceivedOrders = Template.instance().showsReceivedOrders.get();
    let period = Template.instance().periodOfOrders.get();
    let dateInterval;

    if (period === 'week') {
      dateInterval = TimeRangeQueryBuilder.forWeek();
    } else if (period === 'month') {
      dateInterval = TimeRangeQueryBuilder.forMonth();
    } else {
      dateInterval = {};
    }

    return OrderReceipts.find({
      'received': showsReceivedOrders,
      'expectedDeliveryDate': dateInterval
    }, {sort: {'receivedDate': -1, 'supplier': 1}});
  }
});

Template.ordersReceiptsList.events({
  'click .orders-status': function (event, tmpl) {
    event.preventDefault();

    let status = event.currentTarget.getAttribute('data-orders-status');
    if (status === 'received') {
      tmpl.showsReceivedOrders.set(true);  
    } else {
      tmpl.showsReceivedOrders.set(false);
    }    
  },

  'click .period-of-orders': function (event, tmpl) {
    event.preventDefault();
    let period = event.currentTarget.getAttribute('data-period-of-orders');
    tmpl.periodOfOrders.set(period);
  }
});