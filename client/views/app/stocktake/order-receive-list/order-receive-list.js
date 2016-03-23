Template.orderReceiveList.onCreated(function () {
  this.ordersFilter = new ReactiveVar({
    isReceived: false,
    timeRangeType: 'week'
  });
  this.defaultOrdersLimit = 10;
  this.ordersToShowLimit = new ReactiveVar(this.defaultOrdersLimit);

  let currentAreaId = HospoHero.getCurrentAreaId();
  let onOrdersSearchParamsChange = () => {
    let ordersFilter = this.ordersFilter.get();
    let limit = this.ordersToShowLimit.get();

    this.subscribe('allOrdersInArea', currentAreaId, ordersFilter.isReceived, ordersFilter.timeRangeType, limit);
  };

  this.autorun(onOrdersSearchParamsChange);
});

Template.orderReceiveList.helpers({
  tableHeaderItems() {
    return ['Date expected', 'Supplier', 'Ordered Value', 'Received Amount', 'Received', 'Invoice Uploaded'];
  },

  receipts() {
    return Orders.find({}, {
      sort: {
        expectedDeliveryDate: 1, supplier: 1
      }
    });
  },

  onOrderFilterChange() {
    let tmpl = Template.instance();
    return function (isReceived, timeRangeType) {
      tmpl.ordersFilter.set({isReceived, timeRangeType});
      tmpl.ordersToShowLimit.set(tmpl.defaultOrdersLimit);
    };
  },
  
  hideLoadMoreButton() {
    let tmpl = Template.instance();
    let currentLimit = tmpl.ordersToShowLimit.get();
    return currentLimit - Orders.find().count() > 0;
  }
});

Template.orderReceiveList.events({
  'click .load-more-orders': function (event, tmpl) {
    event.preventDefault();
    tmpl.ordersToShowLimit.set(tmpl.ordersToShowLimit.get() + tmpl.defaultOrdersLimit);
  }
});