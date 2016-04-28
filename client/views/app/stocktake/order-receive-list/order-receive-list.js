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

Template.orderReceiveList.onRendered(function () {
  $('#wrapper').scroll(event => {
    let wrapper = event.target;
    let wrapperHeight = wrapper.clientHeight;
    let wrapperScrollHeight = wrapper.scrollHeight;
    let wrapperScrollTop = wrapper.scrollTop;

    if (wrapperHeight + wrapperScrollTop === wrapperScrollHeight) {
      this.ordersToShowLimit.set(this.ordersToShowLimit.get() + this.defaultOrdersLimit);
    }
  });
});

Template.orderReceiveList.helpers({
  tableHeaderItems() {
    return ['Date expected', 'Supplier', 'Ordered Value', 'Received Amount', 'Received', 'Invoice Uploaded'];
  },

  orders() {
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
  }
});

Template.orderReceiveList.onDestroyed(function () {
  $('#wrapper').unbind('scroll');
});