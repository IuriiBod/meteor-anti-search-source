Template.navRoster.helpers({
  year: function () {
    return moment().year();
  },
  week: function () {
    return moment().week();
  },
  today: function () {
    return moment().format("YYYY-MM-DD");
  }
});