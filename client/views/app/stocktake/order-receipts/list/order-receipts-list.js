Template.ordersReceiptsList.onCreated(function () {
  this.showsReceivedOrders = new ReactiveVar(false);
  this.periodOfOrders = new ReactiveVar('week');
  this.ordersToShowLimit = new ReactiveVar(10);

  let ordersPeriod = {
    forWeek: TimeRangeQueryBuilder.forWeek(),
    forMonth: TimeRangeQueryBuilder.forMonth(),
    getCurrentPeriod(period) {
      return period === 'week' ? this.forWeek : period === 'month' ? this.forMonth : {};
    }
  };

  this.getOrderReceipts = () => {
    let period = this.periodOfOrders.get();
    let dateInterval = ordersPeriod.getCurrentPeriod(period);

    return OrderReceipts.find({
      'received': this.showsReceivedOrders.get(),
      'expectedDeliveryDate': dateInterval
    }, {
      sort: {
        expectedDeliveryDate: 1, supplier: 1
      },
      limit: this.ordersToShowLimit.get()
    });
  };
});

Template.ordersReceiptsList.helpers({
  showsReceivedOrders: function () {
    return Template.instance().showsReceivedOrders.get();
  },

  isCurrentPeriodOfOrders: function (period) {
    let currentPeriod = Template.instance().periodOfOrders.get();
    return currentPeriod === period;
  },

  receipts: function () {
    return Template.instance().getOrderReceipts();
  },

  showLoadMoreOrdersButton() {
    let instance = Template.instance();
    return instance.getOrderReceipts().count() < instance.ordersToShowLimit.get();
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
    tmpl.ordersToShowLimit.set(10);
  },

  'click .load-more-orders': function (event, tmpl) {
    event.preventDefault();
    tmpl.ordersToShowLimit.set(tmpl.ordersToShowLimit.get() + 10);
  }
});