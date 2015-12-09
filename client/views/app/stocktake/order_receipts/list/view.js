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