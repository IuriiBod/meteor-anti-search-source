Template.ordersReceiptsList.helpers({
  toBeReceived: function() {
    return !Session.get("thisState");
  },

  received: function() {
    return !!Session.get("thisState");
  },

  week: function() {
    var time = Session.get("thisTime");
    return time && time == "week";
  },

  month: function() {
    var time = Session.get("thisTime");
    return time && time == "month";
  },

  allTime: function() {
    var time = Session.get("thisTime");
    return time && time == "all";
  },

  list: function() {
    var state = Session.get("thisState");
    var time = Session.get("thisTime");
    var data = null;
    var ids = [];

    if (time == "week") {
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
      if (data && data.length > 0) {
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
      }
      return data;
    }
  }
});

Template.ordersReceiptsList.events({
  'click .toBeReceived': function (event) {
    event.preventDefault();
    Session.set("thisState", false);
  },

  'click .received': function (event) {
    event.preventDefault();
    Session.set("thisState", true);
  },

  'click .thisWeekReceipts': function (event) {
    event.preventDefault();
    Session.set("thisTime", "week");
  },

  'click .thisMonthReceipts': function (event) {
    event.preventDefault();
    Session.set("thisTime", "month");
  },

  'click .allTimeReceipts': function (event) {
    event.preventDefault();
    Session.set("thisTime", "all");
  }
});