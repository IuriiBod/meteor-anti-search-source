Template.ordersReceiptsList.onCreated(function() {
  this.thisState = new ReactiveVar(false);
  this.thisTime = new ReactiveVar('week');
  this.editStockTake = new ReactiveVar(false);
});

Template.ordersReceiptsList.helpers({
  orderToBeReceived: function() {
    return !Template.instance().thisState.get();
  },

  received: function() {
    return !!Template.instance().thisState.get();
  },

  week: function() {
    var time = Template.instance().thisTime.get();
    return time && time === "week";
  },

  month: function() {
    var time = Template.instance().thisTime.get();
    return time && time === "month";
  },

  allTime: function() {
    var time = Template.instance().thisTime.get();
    return time && time === "all";
  },

  list: function() {
    var state = Template.instance().thisState.get();
    var time = Template.instance().thisTime.get();
    var data = null;
    var ids = [];

    if (time === "week") {
      data = OrderReceipts.find({
        "received": state,
        "expectedDeliveryDate": {
          $gte: moment().startOf("week").unix() * 1000,
          $lte: moment().endOf("week").unix() * 1000
        }
      }, {sort: {"receivedDate": -1, "supplier": 1}});

    } else if (time == "month") {
      data = OrderReceipts.find({
        "received": state,
        "expectedDeliveryDate": {
          $gte: moment().startOf("month").unix() * 1000,
          $lte: moment().endOf("month").unix() * 1000
        }
      }, {sort: {"receivedDate": -1, "supplier": 1}});

    } else if (time == "all") {
      data = OrderReceipts.find({"received": state}, {sort: {"receivedDate": -1, "supplier": 1}});
    }
    data = data.fetch();
    if (data && data.length > 0) {
      var users = [];
      var suppliers = [];
      data.forEach(function (receipt) {
        if (ids && ids.indexOf(receipt._id) < 0) {
          ids.push(receipt._id);
        }
        if (receipt.receivedBy && users.indexOf(receipt.receivedBy) < 0) {
          users.push(receipt.receivedBy);
        }
        if (suppliers.indexOf(receipt.supplier) < 0) {
          suppliers.push(receipt.supplier);
        }
      });
      return data;
    }
  }
});

Template.ordersReceiptsList.events({
  'click .toBeReceived': function (event, tmpl) {
    event.preventDefault();
    tmpl.thisState.set(false);
  },

  'click .received': function (event, tmpl) {
    event.preventDefault();
    tmpl.thisState.set(true);
  },

  'click .thisWeekReceipts': function (event, tmpl) {
    event.preventDefault();
    tmpl.thisTime.set('week');
  },

  'click .thisMonthReceipts': function (event, tmpl) {
    event.preventDefault();
    tmpl.thisTime.set('month');
  },

  'click .allTimeReceipts': function (event, tmpl) {
    event.preventDefault();
    tmpl.thisTime.set("all");
  }
});