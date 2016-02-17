Template.ordersReceiptsList.onCreated(function () {
  this.showsReceivedOrders = new ReactiveVar(false);
  this.periodOfOrders = new ReactiveVar('week');
  this.ordersToShowLimit = new ReactiveVar(10);

  let ordersPeriod = {
    forWeek: TimeRangeQueryBuilder.forWeek(),
    forMonth: TimeRangeQueryBuilder.forMonth(),
    transformPeriodToQuery(period) {
      return period === 'week' ? this.forWeek : period === 'month' ? this.forMonth : {};
    }
  };

  this.getOrderReceipts = () => {
    let period = this.periodOfOrders.get();
    let dateInterval = ordersPeriod.transformPeriodToQuery(period);

    return OrderReceipts.find({
      received: this.showsReceivedOrders.get(),
      expectedDeliveryDate: dateInterval
    }, {
      sort: {
        expectedDeliveryDate: 1, supplier: 1
      },
      limit: this.ordersToShowLimit.get()
    });
  };
});

Template.ordersReceiptsList.helpers({
  receivingOrdersButtons() {
    let showsReceivedOrders = Template.instance().showsReceivedOrders.get();
    let defaultButton = 'btn btn-white orders-status';
    let activeButton = `${defaultButton} active`;
    return [
      {
        status: 'toBeReceived',
        text: 'To be received',
        className: !showsReceivedOrders ? activeButton : defaultButton
      },
      {
        status: 'received',
        text: 'Received',
        className: showsReceivedOrders ? activeButton : defaultButton
      }
    ];
  },

  periodOfOrdersButtons() {
    let currentPeriod = Template.instance().periodOfOrders.get();
    let defaultButton = 'btn btn-white period-of-orders';
    let activeButton = `${defaultButton} active`;
    return [
      {
        period: 'week',
        text: 'This week',
        className: currentPeriod === 'week' ? activeButton : defaultButton
      },
      {
        period: 'month',
        text: 'This month',
        className: currentPeriod === 'month' ? activeButton : defaultButton
      },
      {
        period: 'allTime',
        text: 'All time',
        className: currentPeriod === 'allTime' ? activeButton : defaultButton
      }
    ];
  },

  tableHeaderItems() {
    return ['Date expected', 'Supplier', 'Ordered Value', 'Received Amount', 'Received', 'Invoice Uploaded'];
  },

  receipts() {
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

    let status = this.status;
    status = status === 'received';
    tmpl.showsReceivedOrders.set(status);
  },

  'click .period-of-orders': function (event, tmpl) {
    event.preventDefault();
    tmpl.periodOfOrders.set(this.period);
    tmpl.ordersToShowLimit.set(10);
  },

  'click .load-more-orders': function (event, tmpl) {
    event.preventDefault();
    tmpl.ordersToShowLimit.set(tmpl.ordersToShowLimit.get() + 10);
  }
});