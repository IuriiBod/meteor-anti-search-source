Template.ordersFilter.onCreated(function () {
  this.timeRangeType = new ReactiveVar('week');
  this.receivedStatus = new ReactiveVar(false);

  let onOrderFilterChange = () => {
    let timeRangeType = this.timeRangeType.get();
    let receivedStatus = this.receivedStatus.get();

    this.data.onFilterChange(receivedStatus, timeRangeType);
  };

  this.autorun(onOrderFilterChange);
});

Template.ordersFilter.helpers({
  receivingOrdersButtons() {
    let showReceivedOrders = Template.instance().receivedStatus.get();
    let defaultButton = 'btn btn-white orders-status';
    let activeButton = `${defaultButton} active`;
    return [
      {
        status: 'toBeReceived',
        text: 'To be received',
        className: !showReceivedOrders ? activeButton : defaultButton
      },
      {
        status: 'received',
        text: 'Received',
        className: showReceivedOrders ? activeButton : defaultButton
      }
    ];
  },

  periodOfOrdersButtons() {
    let timeRangeType = Template.instance().timeRangeType.get();
    let defaultButton = 'btn btn-white period-of-orders';
    let activeButton = `${defaultButton} active`;

    return [
      {
        period: 'week',
        text: 'This week',
        className: timeRangeType === 'week' ? activeButton : defaultButton
      },
      {
        period: 'month',
        text: 'This month',
        className: timeRangeType === 'month' ? activeButton : defaultButton
      },
      {
        period: 'all',
        text: 'All time',
        className: timeRangeType === 'all' ? activeButton : defaultButton
      }
    ];
  }
});

Template.ordersFilter.events({
  'click .orders-status': function (event, tmpl) {
    event.preventDefault();
    let status = this.status;
    let isReceived = status === 'received';
    tmpl.receivedStatus.set(isReceived);
  },

  'click .period-of-orders': function (event, tmpl) {
    event.preventDefault();
    tmpl.timeRangeType.set(this.period);
  }
});